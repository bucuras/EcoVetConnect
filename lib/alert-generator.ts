// Utility functions for generating alerts based on health records

interface HealthRecord {
  id: string
  record_type: "human" | "animal" | "environment"
  subject_name: string
  metrics: any
  status: "normal" | "warning" | "critical"
  created_at: string
}

interface Alert {
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  category: "human" | "animal" | "environment"
}

export function generateAlertsFromHealthRecord(record: HealthRecord): Alert[] {
  const alerts: Alert[] = []

  if (record.status === "critical") {
    alerts.push(generateCriticalAlert(record))
  } else if (record.status === "warning") {
    alerts.push(generateWarningAlert(record))
  }

  // Check specific metrics for additional alerts
  if (record.record_type === "human") {
    alerts.push(...checkHumanMetrics(record))
  } else if (record.record_type === "animal") {
    alerts.push(...checkAnimalMetrics(record))
  } else if (record.record_type === "environment") {
    alerts.push(...checkEnvironmentMetrics(record))
  }

  return alerts
}

function generateCriticalAlert(record: HealthRecord): Alert {
  return {
    title: `Stare critică detectată - ${record.subject_name}`,
    message: `${record.subject_name} prezintă o stare critică care necesită intervenție imediată. Verificați toate parametrii și consultați un specialist.`,
    severity: "critical",
    category: record.record_type,
  }
}

function generateWarningAlert(record: HealthRecord): Alert {
  return {
    title: `Atenție necesară - ${record.subject_name}`,
    message: `${record.subject_name} prezintă semne care necesită monitorizare atentă. Verificați parametrii și luați măsurile preventive necesare.`,
    severity: "high",
    category: record.record_type,
  }
}

function checkHumanMetrics(record: HealthRecord): Alert[] {
  const alerts: Alert[] = []
  const metrics = record.metrics

  // Check temperature
  if (metrics.temperature && metrics.temperature > 38.5) {
    alerts.push({
      title: `Febră detectată - ${record.subject_name}`,
      message: `Temperatura de ${metrics.temperature}°C indică febră. Monitorizați simptomele și consultați un medic dacă febra persistă.`,
      severity: "medium",
      category: "human",
    })
  }

  // Check heart rate
  if (metrics.heartRate && (metrics.heartRate > 100 || metrics.heartRate < 60)) {
    alerts.push({
      title: `Puls anormal - ${record.subject_name}`,
      message: `Pulsul de ${metrics.heartRate} bpm este în afara limitelor normale (60-100 bpm). Recomandăm evaluare medicală.`,
      severity: "medium",
      category: "human",
    })
  }

  return alerts
}

function checkAnimalMetrics(record: HealthRecord): Alert[] {
  const alerts: Alert[] = []
  const metrics = record.metrics

  // Check temperature for different animal types
  if (metrics.temperature) {
    const temp = metrics.temperature
    let isAbnormal = false
    let normalRange = ""

    switch (metrics.animalType) {
      case "bovine":
        isAbnormal = temp < 38.0 || temp > 39.5
        normalRange = "38.0-39.5°C"
        break
      case "porcine":
        isAbnormal = temp < 38.7 || temp > 39.8
        normalRange = "38.7-39.8°C"
        break
      case "ovine":
        isAbnormal = temp < 38.5 || temp > 40.0
        normalRange = "38.5-40.0°C"
        break
      default:
        isAbnormal = temp < 38.0 || temp > 40.0
        normalRange = "38.0-40.0°C"
    }

    if (isAbnormal) {
      alerts.push({
        title: `Temperatură anormală - ${record.subject_name}`,
        message: `Temperatura de ${temp}°C este în afara limitelor normale (${normalRange}) pentru ${metrics.animalType || "acest tip de animal"}. Consultați veterinarul.`,
        severity: temp > 40.5 || temp < 37.0 ? "critical" : "high",
        category: "animal",
      })
    }
  }

  // Check appetite
  if (metrics.appetite === "absent") {
    alerts.push({
      title: `Lipsă apetit - ${record.subject_name}`,
      message: `${record.subject_name} nu a consumat hrană. Monitorizați îndeaproape și consultați veterinarul dacă situația persistă.`,
      severity: "high",
      category: "animal",
    })
  }

  return alerts
}

function checkEnvironmentMetrics(record: HealthRecord): Alert[] {
  const alerts: Alert[] = []
  const metrics = record.metrics

  // Check air quality
  if (metrics.airQuality === "slab" || metrics.airQuality === "periculos") {
    alerts.push({
      title: `Calitate aer problematică - ${record.subject_name}`,
      message: `Calitatea aerului în ${metrics.location || "zona monitorizată"} este ${metrics.airQuality}. Luați măsuri pentru îmbunătățirea ventilației.`,
      severity: metrics.airQuality === "periculos" ? "critical" : "high",
      category: "environment",
    })
  }

  // Check water quality
  if (metrics.waterQuality === "slab" || metrics.waterQuality === "contaminat") {
    alerts.push({
      title: `Calitate apă problematică - ${record.subject_name}`,
      message: `Calitatea apei în ${metrics.location || "zona monitorizată"} este ${metrics.waterQuality}. Testați și tratați apa înainte de utilizare.`,
      severity: metrics.waterQuality === "contaminat" ? "critical" : "high",
      category: "environment",
    })
  }

  // Check soil pH
  if (metrics.soilPh && (metrics.soilPh < 5.5 || metrics.soilPh > 8.5)) {
    alerts.push({
      title: `pH sol problematic - ${record.subject_name}`,
      message: `pH-ul solului (${metrics.soilPh}) este în afara limitelor optime (5.5-8.5). Considerați amendarea solului.`,
      severity: "medium",
      category: "environment",
    })
  }

  return alerts
}
