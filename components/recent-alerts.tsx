import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, AlertCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { ro } from "date-fns/locale"

interface Alert {
  id: string
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  category: "human" | "animal" | "environment"
  created_at: string
  notes: string // Adăugăm câmpul pentru observații
}

interface HealthRecord {
  id: string
  user_id: string
  notes: string
}

interface RecentAlertsProps {
  alerts: Alert[]
  healthRecords: HealthRecord[]
}

export function RecentAlerts({ alerts, healthRecords }: RecentAlertsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "low":
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critic</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Important</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Mediu</Badge>
      case "low":
        return <Badge variant="secondary">Scăzut</Badge>
      default:
        return <Badge variant="outline">Necunoscut</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
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

  const getHealthRecordNote = (alertId: string) => {
    if(!healthRecords || healthRecords.length === 0) return null
    const record = healthRecords.find((record) => record.id === alertId)
    return record ? record.notes : null
  }

  if (alerts.length === 0) {
    return (
        <div className="text-center py-8 text-emerald-600">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nu există alerte active</p>
          <p className="text-xs text-emerald-500 mt-1">Toate sistemele funcționează normal</p>
        </div>
    )
  }

  return (
      <div className="space-y-4">
        {alerts.map((alert) => {
          const healthNote = getHealthRecordNote(alert.id)
          return (
              <div
                  key={alert.id}
                  className="border border-emerald-200 rounded-lg p-4 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-emerald-900 text-sm truncate">{alert.title}</h4>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-xs text-emerald-600 mb-2 line-clamp-2">{alert.message}</p>
                    {(alert.notes || healthNote) && (
                        <p className="text-xs text-emerald-700 italic mb-2">
                          Observații: {alert.notes || healthNote}
                        </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-emerald-500">
                      <span>{getCategoryLabel(alert.category)}</span>
                      <span>{format(new Date(alert.created_at), "dd MMM, HH:mm", { locale: ro })}</span>
                    </div>
                  </div>
                </div>
              </div>
          )
        })}
      </div>
  )
}