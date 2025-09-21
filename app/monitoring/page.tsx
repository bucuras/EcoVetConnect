import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Leaf, Plus } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"

export default async function MonitoringPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get recent records for each category
  const { data: humanRecords } = await supabase
    .from("health_records")
    .select("*")
    .eq("user_id", user.id)
    .eq("record_type", "human")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: animalRecords } = await supabase
    .from("health_records")
    .select("*")
    .eq("user_id", user.id)
    .eq("record_type", "animal")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: environmentRecords } = await supabase
    .from("health_records")
    .select("*")
    .eq("user_id", user.id)
    .eq("record_type", "environment")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Monitorizare Sănătate</h1>
          <p className="text-emerald-700">
            Urmăriți și înregistrați datele de sănătate pentru oameni, animale și mediu
          </p>
        </div>

        {/* Monitoring Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Human Health */}
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-900">Sănătate Umană</CardTitle>
                    <CardDescription className="text-emerald-600">Monitorizare persoane</CardDescription>
                  </div>
                </div>
                <Link href="/monitoring/human">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Adaugă
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {humanRecords && humanRecords.length > 0 ? (
                  humanRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-900 text-sm">{record.subject_name}</p>
                        <p className="text-xs text-red-600">
                          Status: <span className="capitalize">{record.status}</span>
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.status === "normal"
                            ? "bg-green-500"
                            : record.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-emerald-600 text-center py-4">Nu există înregistrări</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Animal Health */}
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-900">Sănătate Animale</CardTitle>
                    <CardDescription className="text-emerald-600">Monitorizare animale</CardDescription>
                  </div>
                </div>
                <Link href="/monitoring/animal">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Adaugă
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {animalRecords && animalRecords.length > 0 ? (
                  animalRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900 text-sm">{record.subject_name}</p>
                        <p className="text-xs text-blue-600">
                          Status: <span className="capitalize">{record.status}</span>
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.status === "normal"
                            ? "bg-green-500"
                            : record.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-emerald-600 text-center py-4">Nu există înregistrări</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Environment */}
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-900">Mediu</CardTitle>
                    <CardDescription className="text-emerald-600">Monitorizare mediu</CardDescription>
                  </div>
                </div>
                <Link href="/monitoring/environment">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Adaugă
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {environmentRecords && environmentRecords.length > 0 ? (
                  environmentRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div>
                        <p className="font-medium text-emerald-900 text-sm">{record.subject_name}</p>
                        <p className="text-xs text-emerald-600">
                          Status: <span className="capitalize">{record.status}</span>
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.status === "normal"
                            ? "bg-green-500"
                            : record.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-emerald-600 text-center py-4">Nu există înregistrări</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
