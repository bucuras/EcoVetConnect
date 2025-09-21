"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HumanMonitoringPage() {
  const [formData, setFormData] = useState({
    subjectName: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    symptoms: "",
    status: "normal",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Nu sunteți autentificat")
      }

      const metrics = {
        temperature: formData.temperature ? Number.parseFloat(formData.temperature) : null,
        bloodPressure: formData.bloodPressure || null,
        heartRate: formData.heartRate ? Number.parseInt(formData.heartRate) : null,
        symptoms: formData.symptoms || null,
      }

      const { error: recordError } = await supabase.from("health_records").insert({
        user_id: user.id,
        record_type: "human",
        subject_name: formData.subjectName,
        metrics,
        status: formData.status,
        notes: formData.notes || null,
      })

      if (recordError) throw recordError

      // Create notification alert for new monitoring record
      const alertTitle = `Nouă înregistrare: ${formData.subjectName}`
      const alertMessage = `S-a adăugat o nouă înregistrare de monitorizare pentru ${formData.subjectName}. Status: ${formData.status === "normal" ? "Normal" : formData.status === "warning" ? "Atenție" : "Critic"}`
      const alertSeverity =
        formData.status === "normal" ? "medium" : formData.status === "warning" ? "high" : "critical"

      await supabase.from("alerts").insert({
        user_id: user.id,
        title: alertTitle,
        message: alertMessage,
        severity: alertSeverity,
        category: "human",
        is_read: false,
      })

      router.push("/monitoring")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "A apărut o eroare")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/monitoring">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la Monitorizare
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">Monitorizare Sănătate Umană</h1>
          </div>
          <p className="text-emerald-700">Înregistrați datele de sănătate pentru persoane</p>
        </div>

        <Card className="border-emerald-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-emerald-900">Adaugă Înregistrare Nouă</CardTitle>
            <CardDescription className="text-emerald-600">
              Completați formularul pentru a înregistra datele de sănătate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subjectName" className="text-emerald-800">
                  Numele persoanei *
                </Label>
                <Input
                  id="subjectName"
                  type="text"
                  placeholder="Ion Popescu"
                  required
                  value={formData.subjectName}
                  onChange={(e) => updateFormData("subjectName", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-emerald-800">
                    Temperatura (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={formData.temperature}
                    onChange={(e) => updateFormData("temperature", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heartRate" className="text-emerald-800">
                    Puls (bpm)
                  </Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="72"
                    value={formData.heartRate}
                    onChange={(e) => updateFormData("heartRate", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressure" className="text-emerald-800">
                  Tensiunea arterială
                </Label>
                <Input
                  id="bloodPressure"
                  type="text"
                  placeholder="120/80"
                  value={formData.bloodPressure}
                  onChange={(e) => updateFormData("bloodPressure", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-emerald-800">
                  Simptome
                </Label>
                <Input
                  id="symptoms"
                  type="text"
                  placeholder="Durere de cap, oboseală"
                  value={formData.symptoms}
                  onChange={(e) => updateFormData("symptoms", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-emerald-800">
                  Status general
                </Label>
                <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="warning">Atenție</SelectItem>
                    <SelectItem value="critical">Critic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-emerald-800">
                  Observații
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Observații suplimentare..."
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Se salvează..." : "Salvează Înregistrarea"}
                </Button>
                <Link href="/monitoring">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 bg-transparent"
                  >
                    Anulează
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
