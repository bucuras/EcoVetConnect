import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // In a real implementation, this would call an AI service like OpenAI
    // For now, we'll return a simulated response
    const response = generateAIResponse(message)

    return NextResponse.json({
      response: response.content,
      category: response.category,
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateAIResponse(message: string): { content: string; category: string } {
  const input = message.toLowerCase()

  // Health-related responses for farm management
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
