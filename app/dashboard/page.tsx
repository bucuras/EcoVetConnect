import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Leaf, AlertTriangle, Activity } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { HealthMetricsChart } from "@/components/health-metrics-chart"
import { RecentAlerts } from "@/components/recent-alerts"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get recent health records
  const { data: healthRecords } = await supabase
    .from("health_records")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get recent alerts
  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5)

  // Calculate stats
  const humanRecords = healthRecords?.filter((r) => r.record_type === "human") || []
  const animalRecords = healthRecords?.filter((r) => r.record_type === "animal") || []
  const environmentRecords = healthRecords?.filter((r) => r.record_type === "environment") || []

  const criticalAlerts = alerts?.filter((a) => a.severity === "critical").length || 0
  const highAlerts = alerts?.filter((a) => a.severity === "high").length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Bună ziua, {profile?.full_name || user.email}!</h1>
          <p className="text-emerald-700">
            {profile?.role === "farmer" && profile?.farm_name
              ? `Bine ați venit la ${profile.farm_name}`
              : "Bine ați venit în platforma EcoVetConnect"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Sănătate Umană</CardTitle>
              <Heart className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{humanRecords.length}</div>
              <p className="text-xs text-emerald-600">înregistrări active</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Sănătate Animale</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{animalRecords.length}</div>
              <p className="text-xs text-emerald-600">animale monitorizate</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Mediu</CardTitle>
              <Leaf className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{environmentRecords.length}</div>
              <p className="text-xs text-emerald-600">măsurători mediu</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Alerte Active</CardTitle>
              <AlertTriangle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{alerts?.length || 0}</div>
              <p className="text-xs text-emerald-600">
                {criticalAlerts > 0 && <span className="text-red-600">{criticalAlerts} critice</span>}
                {highAlerts > 0 && <span className="text-orange-600">{highAlerts} importante</span>}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Metrics Chart */}
          <div className="lg:col-span-2">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Tendințe Sănătate</CardTitle>
                <CardDescription className="text-emerald-600">
                  Evoluția indicatorilor de sănătate în ultimele 30 de zile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HealthMetricsChart data={healthRecords || []} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <div>
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Alerte Recente</CardTitle>
                <CardDescription className="text-emerald-600">
                  Notificări importante care necesită atenție
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAlerts alerts={alerts || []} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-emerald-900 mb-4">Acțiuni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/monitoring/human">
              <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-medium text-emerald-900">Monitorizare Umană</h3>
                  <p className="text-sm text-emerald-600 mt-1">Adaugă date sănătate</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/monitoring/animal">
              <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-medium text-emerald-900">Monitorizare Animale</h3>
                  <p className="text-sm text-emerald-600 mt-1">Urmărește animalele</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/monitoring/environment">
              <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Leaf className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-medium text-emerald-900">Monitorizare Mediu</h3>
                  <p className="text-sm text-emerald-600 mt-1">Măsurători ambientale</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ai-assistant">
              <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Activity className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-medium text-emerald-900">Asistent AI</h3>
                  <p className="text-sm text-emerald-600 mt-1">Consiliere inteligentă</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
