import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Shield, Heart, BarChart3, Users, AlertTriangle } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-emerald-900">EcoVetConnect</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                Autentificare
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Înregistrare</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-emerald-900 mb-6 text-balance">
              Monitorizare Integrată pentru Sănătatea Fermei
            </h1>
            <p className="text-xl text-emerald-700 mb-8 text-pretty">
              Platforma care conectează sănătatea oamenilor, animalelor și mediului într-un singur ecosistem digital.
              Monitorizați, analizați și protejați ferma dumneavoastră cu tehnologie avansată.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3">
                  Începeți Acum
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-3 bg-transparent"
                >
                  Aflați Mai Mult
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Funcționalități Avansate</h2>
            <p className="text-emerald-700 text-lg max-w-2xl mx-auto">
              Totul de care aveți nevoie pentru o fermă sănătoasă și productivă
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Monitorizare Sănătate</CardTitle>
                <CardDescription className="text-emerald-600">
                  Urmăriți starea de sănătate a oamenilor, animalelor și mediului în timp real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Alerte Timpurii</CardTitle>
                <CardDescription className="text-emerald-600">
                  Sistem inteligent de alertă pentru prevenirea problemelor de sănătate
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Analiză Avansată</CardTitle>
                <CardDescription className="text-emerald-600">
                  Dashboard vizual cu grafice și rapoarte detaliate pentru luarea deciziilor
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Asistent AI</CardTitle>
                <CardDescription className="text-emerald-600">
                  Chatbot inteligent pentru consiliere și educație în domeniul sănătății
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Securitate Maximă</CardTitle>
                <CardDescription className="text-emerald-600">
                  Protecția datelor cu cele mai înalte standarde de securitate
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Sustenabilitate</CardTitle>
                <CardDescription className="text-emerald-600">
                  Promovarea practicilor agricole durabile și responsabile
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Gata să Transformați Ferma Dumneavoastră?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Alăturați-vă comunității de fermieri care folosesc tehnologia pentru o agricultură mai sănătoasă și mai
            eficientă.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8 py-3">
              Începeți Gratuit Astăzi
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-emerald-100 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-lg">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">EcoVetConnect</h3>
          </div>
          <p className="text-emerald-300 text-sm">
            © 2024 EcoVetConnect. Toate drepturile rezervate. Platforma pentru monitorizarea integrată a sănătății
            fermei.
          </p>
        </div>
      </footer>
    </div>
  )
}
