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
import { Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AnimalMonitoringPage() {
  const [formData, setFormData] = useState({
    subjectName: "",
    animalType: "",
    age: "",
    weight: "",
    temperature: "",
    appetite: "",
    behavior: "",
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
        animalType: formData.animalType || null,
        age: formData.age || null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        temperature: formData.temperature ? Number.parseFloat(formData.temperature) : null,
        appetite: formData.appetite || null,
        behavior: formData.behavior || null,
        symptoms: formData.symptoms || null,
      }

      const { error: recordError } = await supabase.from("health_records").insert({
        user_id: user.id,
        record_type: "animal",
        subject_name: formData.subjectName,
        metrics,
        status: formData.status,
        notes: formData.notes || null,
      })

      if (recordError) throw recordError

      const alertTitle = `Nouă înregistrare: ${formData.subjectName}`
      const alertMessage = `S-a adăugat o nouă înregistrare de monitorizare pentru animalul ${formData.subjectName}. Status: ${formData.status === "normal" ? "Normal" : formData.status === "warning" ? "Atenție" : "Critic"}`
      const alertSeverity =
        formData.status === "normal" ? "medium" : formData.status === "warning" ? "high" : "critical"

      await supabase.from("alerts").insert({
        user_id: user.id,
        title: alertTitle,
        message: alertMessage,
        severity: alertSeverity,
        category: "animal",
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">Monitorizare Sănătate Animale</h1>
          </div>
          <p className="text-emerald-700">Înregistrați datele de sănătate pentru animale</p>
        </div>

        <Card className="border-emerald-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-emerald-900">Adaugă Înregistrare Nouă</CardTitle>
            <CardDescription className="text-emerald-600">
              Completați formularul pentru a înregistra datele de sănătate ale animalului
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subjectName" className="text-emerald-800">
                    Numele animalului *
                  </Label>
                  <Input
                    id="subjectName"
                    type="text"
                    placeholder="Bella"
                    required
                    value={formData.subjectName}
                    onChange={(e) => updateFormData("subjectName", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="animalType" className="text-emerald-800">
                    Tipul animalului
                  </Label>
                  <Select value={formData.animalType} onValueChange={(value) => updateFormData("animalType", value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Selectați tipul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bovine">Bovine</SelectItem>
                      <SelectItem value="porcine">Porcine</SelectItem>
                      <SelectItem value="ovine">Ovine</SelectItem>
                      <SelectItem value="caprine">Caprine</SelectItem>
                      <SelectItem value="pasari">Păsări</SelectItem>
                      <SelectItem value="caini">Câini</SelectItem>
                      <SelectItem value="pisici">Pisici</SelectItem>
                      <SelectItem value="altele">Altele</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-emerald-800">
                    Vârsta
                  </Label>
                  <Input
                    id="age"
                    type="text"
                    placeholder="2 ani"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-emerald-800">
                    Greutatea (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="25.5"
                    value={formData.weight}
                    onChange={(e) => updateFormData("weight", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-emerald-800">
                    Temperatura (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="38.5"
                    value={formData.temperature}
                    onChange={(e) => updateFormData("temperature", e.target.value)}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appetite" className="text-emerald-800">
                    Apetitul
                  </Label>
                  <Select value={formData.appetite} onValueChange={(value) => updateFormData("appetite", value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Selectați" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="redus">Redus</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="crescut">Crescut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="behavior" className="text-emerald-800">
                    Comportamentul
                  </Label>
                  <Select value={formData.behavior} onValueChange={(value) => updateFormData("behavior", value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Selectați" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="agitat">Agitat</SelectItem>
                      <SelectItem value="letargic">Letargic</SelectItem>
                      <SelectItem value="agresiv">Agresiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-emerald-800">
                  Simptome observate
                </Label>
                <Input
                  id="symptoms"
                  type="text"
                  placeholder="Tuse, secreții nazale, claudicație"
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
                  placeholder="Observații suplimentare despre starea animalului..."
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
