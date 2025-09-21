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
import { Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EnvironmentMonitoringPage() {
  const [formData, setFormData] = useState({
    subjectName: "",
    location: "",
    airQuality: "",
    temperature: "",
    humidity: "",
    soilPh: "",
    waterQuality: "",
    noiseLevel: "",
    pollutants: "",
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
        location: formData.location || null,
        airQuality: formData.airQuality || null,
        temperature: formData.temperature ? Number.parseFloat(formData.temperature) : null,
        humidity: formData.humidity ? Number.parseFloat(formData.humidity) : null,
        soilPh: formData.soilPh ? Number.parseFloat(formData.soilPh) : null,
        waterQuality: formData.waterQuality || null,
        noiseLevel: formData.noiseLevel ? Number.parseFloat(formData.noiseLevel) : null,
        pollutants: formData.pollutants || null,
      }

      const { error: recordError } = await supabase.from("health_records").insert({
        user_id: user.id,
        record_type: "environment",
        subject_name: formData.subjectName,
        metrics,
        status: formData.status,
        notes: formData.notes || null,
      })

      if (recordError) throw recordError

      const alertTitle = `Nouă măsurătoare: ${formData.subjectName}`
      const alertMessage = `S-a adăugat o nouă măsurătoare de mediu pentru ${formData.subjectName}. Status: ${formData.status === "normal" ? "Normal" : formData.status === "warning" ? "Atenție" : "Critic"}`
      const alertSeverity =
        formData.status === "normal" ? "medium" : formData.status === "warning" ? "high" : "critical"

      await supabase.from("alerts").insert({
        user_id: user.id,
        title: alertTitle,
        message: alertMessage,
        severity: alertSeverity,
        category: "environment",
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
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">Monitorizare Mediu</h1>
          </div>
          <p className="text-emerald-700">Înregistrați datele de monitorizare a mediului</p>
        </div>

        <Card className="border-emerald-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-emerald-900">Adaugă Măsurătoare Nouă</CardTitle>
            <CardDescription className="text-emerald-600">
              Completați formularul pentru a înregistra datele de mediu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subjectName" className="text-emerald-800">
                    Numele măsurătorii *
                  </Label>
                  <Input
                    id="subjectName"
                    type="text"
                    placeholder="Monitorizare Sector A"
                    required
                    value={formData.subjectName}
                    onChange={(e) => updateFormData("subjectName", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-emerald-800">
                    Locația
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Câmp Nord, Ferma Verde"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-emerald-800">
                    Temperatura (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="22.5"
                    value={formData.temperature}
                    onChange={(e) => updateFormData("temperature", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="humidity" className="text-emerald-800">
                    Umiditatea (%)
                  </Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="0.1"
                    placeholder="65.0"
                    value={formData.humidity}
                    onChange={(e) => updateFormData("humidity", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soilPh" className="text-emerald-800">
                    pH-ul solului
                  </Label>
                  <Input
                    id="soilPh"
                    type="number"
                    step="0.1"
                    placeholder="6.8"
                    value={formData.soilPh}
                    onChange={(e) => updateFormData("soilPh", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="airQuality" className="text-emerald-800">
                    Calitatea aerului
                  </Label>
                  <Select value={formData.airQuality} onValueChange={(value) => updateFormData("airQuality", value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Selectați" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelent">Excelent</SelectItem>
                      <SelectItem value="bun">Bun</SelectItem>
                      <SelectItem value="moderat">Moderat</SelectItem>
                      <SelectItem value="slab">Slab</SelectItem>
                      <SelectItem value="periculos">Periculos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterQuality" className="text-emerald-800">
                    Calitatea apei
                  </Label>
                  <Select
                    value={formData.waterQuality}
                    onValueChange={(value) => updateFormData("waterQuality", value)}
                  >
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Selectați" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelent">Excelent</SelectItem>
                      <SelectItem value="bun">Bun</SelectItem>
                      <SelectItem value="moderat">Moderat</SelectItem>
                      <SelectItem value="slab">Slab</SelectItem>
                      <SelectItem value="contaminat">Contaminat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="noiseLevel" className="text-emerald-800">
                  Nivelul de zgomot (dB)
                </Label>
                <Input
                  id="noiseLevel"
                  type="number"
                  step="0.1"
                  placeholder="45.0"
                  value={formData.noiseLevel}
                  onChange={(e) => updateFormData("noiseLevel", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pollutants" className="text-emerald-800">
                  Poluanți detectați
                </Label>
                <Input
                  id="pollutants"
                  type="text"
                  placeholder="PM2.5, NO2, CO"
                  value={formData.pollutants}
                  onChange={(e) => updateFormData("pollutants", e.target.value)}
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
                  placeholder="Observații suplimentare despre condițiile de mediu..."
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
                  {isLoading ? "Se salvează..." : "Salvează Măsurătoarea"}
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
