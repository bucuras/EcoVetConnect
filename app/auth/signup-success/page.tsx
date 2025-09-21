import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Leaf } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
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
        </div>

        <Card className="border-emerald-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-emerald-900">Înregistrare reușită!</CardTitle>
            <CardDescription className="text-emerald-600">Verificați emailul pentru confirmare</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-emerald-700 mb-6">
              V-ați înregistrat cu succes! Vă rugăm să verificați emailul pentru a confirma contul înainte de
              autentificare.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
            >
              Înapoi la autentificare
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
