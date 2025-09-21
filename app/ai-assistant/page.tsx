"use client"

import
{ useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Send, Loader2, Heart, Users, Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  category?: "human" | "animal" | "environment" | "general"
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bună ziua! Sunt asistentul AI EcoVetConnect, specializat în sănătatea fermei. Vă pot ajuta cu întrebări despre sănătatea oamenilor, animalelor și mediului din ferma dumneavoastră. Cu ce vă pot ajuta astăzi?",
      timestamp: new Date(),
      category: "general",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [router])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response - in a real app, this would call an AI API
      const response = await simulateAIResponse(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        category: response.category,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Îmi pare rău, a apărut o eroare. Vă rog să încercați din nou.",
        timestamp: new Date(),
        category: "general",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const simulateAIResponse = async (userInput: string): Promise<{ content: string; category: "human" | "animal" | "environment" | "general" }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const input = userInput.toLowerCase()

    // Categorize and respond based on keywords
    if (input.includes("animal") || input.includes("vaca") || input.includes("porc") || input.includes("pasare")) {
      return {
        content: `Pentru sănătatea animalelor, este important să monitorizați zilnic comportamentul, apetitul și temperatura. Semnele de alertă includ: letargie, pierderea apetitului, secreții anormale sau schimbări în comportament. Recomand să țineți un jurnal de observații și să consultați un veterinar la primele semne de boală. Vaccinarea și deparazitarea regulată sunt esențiale pentru prevenție.`,
        category: "animal",
      }
    }

    if (input.includes("mediu") || input.includes("sol") || input.includes("apa") || input.includes("aer")) {
      return {
        content: `Monitorizarea mediului este crucială pentru o fermă sănătoasă. Verificați regulat calitatea apei (pH, nitrați, bacterii), testați solul pentru nutrienți și pH, și monitorizați calitatea aerului. Poluarea poate afecta atât animalele cât și culturile. Recomand instalarea de senzori pentru monitorizare continuă și implementarea de practici agricole durabile.`,
        category: "environment",
      }
    }

    if (input.includes("sanatate") || input.includes("om") || input.includes("muncitor") || input.includes("fermier")) {
      return {
        content: `Sănătatea fermierilor și muncitorilor este prioritară. Purtați echipament de protecție când lucrați cu chimicale sau animale, spălați-vă frecvent pe mâini, și faceți controale medicale regulate. Atenție la expunerea la praf, alergeni și zoonoze. Mențineți o dietă echilibrată și hidratarea adecvată, mai ales în timpul muncii fizice intense.`,
        category: "human",
      }
    }

    if (input.includes("boala") || input.includes("simptom") || input.includes("tratament")) {
      return {
        content: `Pentru orice simptome de boală la animale sau oameni, consultați imediat un specialist. Izolați animalele bolnave pentru a preveni răspândirea. Documentați toate simptomele și tratamentele aplicate. Pentru boli zoonotice (transmisibile de la animale la oameni), luați măsuri de precauție suplimentare și informați autoritățile sanitare dacă este necesar.`,
        category: "general",
      }
    }

    // Default response
    return {
      content: `Înțeleg întrebarea dumneavoastră. Pentru o fermă sănătoasă, recomand o abordare integrată care include: monitorizarea regulată a sănătății animalelor, testarea periodică a calității mediului (sol, apă, aer), respectarea normelor de igienă pentru muncitori, și implementarea de practici agricole durabile. Dacă aveți întrebări specifice despre sănătatea animalelor, mediu sau oameni, vă pot oferi sfaturi mai detaliate.`,
      category: "general",
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "human":
        return <Heart className="w-4 h-4 text-red-500" />
      case "animal":
        return <Users className="w-4 h-4 text-blue-500" />
      case "environment":
        return <Leaf className="w-4 h-4 text-emerald-500" />
      default:
        return <Bot className="w-4 h-4 text-emerald-600" />
    }
  }

  const getCategoryLabel = (category?: string) => {
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

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">Asistent AI EcoVetConnect</h1>
          </div>
          <p className="text-emerald-700">Consiliere inteligentă pentru sănătatea fermei dumneavoastră</p>
        </div>

        <Card className="border-emerald-200 shadow-xl max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Chat cu Asistentul AI
            </CardTitle>
            <CardDescription className="text-emerald-600">
              Puneți întrebări despre sănătatea oamenilor, animalelor și mediului din ferma dumneavoastră
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[500px] p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 bg-emerald-100">
                        <AvatarFallback>
                          <Bot className="w-4 h-4 text-emerald-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user" ? "bg-emerald-600 text-white" : "bg-white border border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.role === "assistant" && message.category && (
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(message.category)}
                            <span className="ml-1">{getCategoryLabel(message.category)}</span>
                          </Badge>
                        )}
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString("ro-RO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 bg-emerald-600">
                        <AvatarFallback>
                          <User className="w-4 h-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 bg-emerald-100">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-emerald-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span className="text-sm text-emerald-600">Asistentul gândește...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-emerald-200 p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrieți întrebarea dumneavoastră aici..."
                  className="flex-1 border-emerald-200 focus:border-emerald-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-emerald-900 mb-4">Întrebări Frecvente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 text-left border-emerald-200 hover:bg-emerald-50 bg-transparent"
              onClick={() => setInput("Cum pot preveni bolile la animale?")}
            >
              <div>
                <Users className="w-5 h-5 text-blue-500 mb-2" />
                <p className="font-medium text-emerald-900">Prevenirea bolilor la animale</p>
                <p className="text-sm text-emerald-600">Sfaturi pentru sănătatea animalelor</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 text-left border-emerald-200 hover:bg-emerald-50 bg-transparent"
              onClick={() => setInput("Ce teste de mediu ar trebui să fac?")}
            >
              <div>
                <Leaf className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="font-medium text-emerald-900">Testarea mediului</p>
                <p className="text-sm text-emerald-600">Monitorizarea calității mediului</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 text-left border-emerald-200 hover:bg-emerald-50 bg-transparent"
              onClick={() => setInput("Cum mă protejez de bolile zoonotice?")}
            >
              <div>
                <Heart className="w-5 h-5 text-red-500 mb-2" />
                <p className="font-medium text-emerald-900">Protecția sănătății umane</p>
                <p className="text-sm text-emerald-600">Prevenirea bolilor transmisibile</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
