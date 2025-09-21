"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format } from "date-fns"
import { ro } from "date-fns/locale"

interface HealthRecord {
  id: string
  record_type: "human" | "animal" | "environment"
  subject_name: string
  metrics: any
  status: "normal" | "warning" | "critical"
  created_at: string
}

interface HealthMetricsChartProps {
  data: HealthRecord[]
}

export function HealthMetricsChart({ data }: HealthMetricsChartProps) {
  // Process data for chart
  const processedData = data
    .slice(0, 30) // Last 30 records
    .reverse()
    .map((record, index) => ({
      date: format(new Date(record.created_at), "dd MMM", { locale: ro }),
      human: record.record_type === "human" ? 1 : 0,
      animal: record.record_type === "animal" ? 1 : 0,
      environment: record.record_type === "environment" ? 1 : 0,
      status: record.status,
    }))

  // Aggregate by date
  const aggregatedData = processedData.reduce((acc: any[], curr) => {
    const existingDate = acc.find((item) => item.date === curr.date)
    if (existingDate) {
      existingDate.human += curr.human
      existingDate.animal += curr.animal
      existingDate.environment += curr.environment
    } else {
      acc.push(curr)
    }
    return acc
  }, [])

  if (aggregatedData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-emerald-600">
        <p>Nu există date pentru afișare. Adăugați înregistrări pentru a vedea graficele.</p>
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
          <XAxis dataKey="date" stroke="#065f46" fontSize={12} />
          <YAxis stroke="#065f46" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #a7f3d0",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="human"
            stroke="#dc2626"
            strokeWidth={2}
            name="Sănătate Umană"
            dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="animal"
            stroke="#2563eb"
            strokeWidth={2}
            name="Sănătate Animale"
            dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="environment"
            stroke="#059669"
            strokeWidth={2}
            name="Mediu"
            dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
