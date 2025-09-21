"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Check, MoreVertical, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import PortalDropdown from "@/components/ui/portal-dropdown"

interface AlertActionsProps {
  alertId: string
}

export function AlertActions({ alertId }: AlertActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const markAsRead = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
          .from("alerts")
          .update({ is_read: true })
          .eq("id", alertId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error marking alert as read:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAlert = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("alerts").delete().eq("id", alertId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting alert:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <PortalDropdown
          trigger={
            <Button variant="ghost" size="sm" className={"cursor-pointer"} disabled={isLoading}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
          align="end"
      >
        <div className="w-48 bg-white rounded-lg shadow-lg border">
          <button
              onClick={markAsRead}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              data-close="true"
              disabled={isLoading}
          >
            <Check className="h-4 w-4 text-emerald-600" />
            Marchează ca citită
          </button>
          <button
              onClick={deleteAlert}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              data-close="true"
              disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Șterge alerta
          </button>
        </div>
      </PortalDropdown>
  )
}
