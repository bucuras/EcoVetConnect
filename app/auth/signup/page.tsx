"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Leaf, Shield, Heart } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "",
    farmName: "",
    location: "",
    phone: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu se potrivesc")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            role: formData.role,
            farm_name: formData.farmName,
            location: formData.location,
            phone: formData.phone,
          },
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-900">EcoVetConnect</h1>
          </div>
          <p className="text-emerald-700 text-sm">Alăturați-vă platformei de monitorizare integrată</p>
        </div>

        <Card className="border-emerald-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-emerald-900">Înregistrare</CardTitle>
            <CardDescription className="text-emerald-600">Creați un cont nou pentru a accesa platforma</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-emerald-800">
                  Nume complet
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ion Popescu"
                  required
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-800">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplu@email.com"
                  required
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-emerald-800">
                  Rol
                </Label>
                <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Selectați rolul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Fermier</SelectItem>
                    <SelectItem value="veterinarian">Veterinar</SelectItem>
                    <SelectItem value="authority">Autoritate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "farmer" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="farmName" className="text-emerald-800">
                      Numele fermei
                    </Label>
                    <Input
                      id="farmName"
                      type="text"
                      placeholder="Ferma Verde"
                      value={formData.farmName}
                      onChange={(e) => updateFormData("farmName", e.target.value)}
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
                      placeholder="București, România"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-emerald-800">
                  Telefon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+40 123 456 789"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-800">
                  Parolă
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-emerald-800">
                  Confirmă parola
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? "Se înregistrează..." : "Înregistrare"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-emerald-600">
                Aveți deja cont?{" "}
                <Link href="/auth/login" className="font-medium text-emerald-700 hover:text-emerald-800 underline">
                  Autentificați-vă aici
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-6 text-emerald-600">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="text-xs">Sănătate</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Siguranță</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            <span className="text-xs">Mediu</span>
          </div>
        </div>
      </div>
    </div>
  )
}
