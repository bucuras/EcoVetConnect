import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Heart, Users, Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { AlertActions } from "@/components/alert-actions"
import { format } from "date-fns"
import { ro } from "date-fns/locale"

export default async function AlertsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get all alerts
  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Separate alerts by status
  const unreadAlerts = alerts?.filter((alert) => !alert.is_read) || []
  const readAlerts = alerts?.filter((alert) => alert.is_read) || []

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case "medium":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "low":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critic</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Important</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Mediu</Badge>
      case "low":
        return <Badge variant="secondary">Scăzut</Badge>
      default:
        return <Badge variant="outline">Necunoscut</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "human":
        return <Heart className="w-4 h-4 text-red-500" />
      case "animal":
        return <Users className="w-4 h-4 text-blue-500" />
      case "environment":
        return <Leaf className="w-4 h-4 text-emerald-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "human":
        return "Sănătate Umană"
      case "animal":
        return "Sănătate Animale"
      case "environment":
        return "Mediu"
      default:
        return "General"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Sistem de Alerte</h1>
          <p className="text-emerald-700">Monitorizați și gestionați alertele de sănătate pentru ferma dumneavoastră</p>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-900">
                {unreadAlerts.filter((a) => a.severity === "critical").length}
              </div>
              <p className="text-sm text-red-600">Alerte Critice</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">
                {unreadAlerts.filter((a) => a.severity === "high").length}
              </div>
              <p className="text-sm text-orange-600">Alerte Importante</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900">
                {unreadAlerts.filter((a) => a.severity === "medium").length}
              </div>
              <p className="text-sm text-yellow-600">Alerte Medii</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-900">{readAlerts.length}</div>
              <p className="text-sm text-emerald-600">Alerte Rezolvate</p>
            </CardContent>
          </Card>
        </div>

        {/* Unread Alerts */}
        {unreadAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-900 mb-4">Alerte Active ({unreadAlerts.length})</h2>
            <div className="space-y-4">
              {unreadAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${
                    alert.severity === "critical"
                      ? "border-l-red-500 bg-red-50"
                      : alert.severity === "high"
                        ? "border-l-orange-500 bg-orange-50"
                        : alert.severity === "medium"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-emerald-900">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                            <div className="flex items-center gap-1 text-xs text-emerald-600">
                              {getCategoryIcon(alert.category)}
                              <span>{getCategoryLabel(alert.category)}</span>
                            </div>
                          </div>
                          <p className="text-emerald-700 mb-3">{alert.message}</p>
                          <p className="text-xs text-emerald-500">
                            {format(new Date(alert.created_at), "dd MMMM yyyy, HH:mm", { locale: ro })}
                          </p>
                        </div>
                      </div>
                      <AlertActions alertId={alert.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Read Alerts */}
        {readAlerts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-emerald-900 mb-4">Alerte Rezolvate ({readAlerts.length})</h2>
            <div className="space-y-4">
              {readAlerts.slice(0, 10).map((alert) => (
                <Card key={alert.id} className="border-emerald-200 opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-emerald-900">{alert.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            Rezolvată
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-emerald-600">
                            {getCategoryIcon(alert.category)}
                            <span>{getCategoryLabel(alert.category)}</span>
                          </div>
                        </div>
                        <p className="text-emerald-600 text-sm mb-2">{alert.message}</p>
                        <p className="text-xs text-emerald-500">
                          {format(new Date(alert.created_at), "dd MMMM yyyy, HH:mm", { locale: ro })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Alerts */}
        {(!alerts || alerts.length === 0) && (
          <Card className="border-emerald-200">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">Nu există alerte</h3>
              <p className="text-emerald-600 mb-6">
                Toate sistemele funcționează normal. Continuați monitorizarea pentru a menține sănătatea fermei.
              </p>
              <Link href="/monitoring">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Adaugă Monitorizare</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
