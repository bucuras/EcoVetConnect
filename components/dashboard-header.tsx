"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Leaf, User, Settings, LogOut, Bell, AlertTriangle, Clock, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import PortalDropdown  from "@/components/ui/portal-dropdown"

interface DashboardHeaderProps {
  user: any
  profile: any
}

interface Alert {
  id: string
  title: string
  message: string
  severity: "critical" | "high" | "medium" | "low"
  category: "human" | "animal" | "environment"
  created_at: string
  is_read: boolean
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0)
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const fetchUnreadAlerts = async () => {
      if (user) {
        const { data: alerts } = await supabase
            .from("alerts")
            .select("id")
            .eq("user_id", user.id)
            .eq("is_read", false)
        setUnreadAlertsCount(alerts?.length || 0)
      }
    }

    fetchUnreadAlerts()
  }, [user, supabase])

  const fetchRecentAlerts = async () => {
    if (user) {
      const { data: alerts } = await supabase
          .from("alerts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

      setRecentAlerts(alerts || [])
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const markAlertAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
          .from("alerts")
          .update({ is_read: true })
          .eq("id", alertId)
          .eq("user_id", user.id)

      if (!error) {
        setRecentAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId ? { ...alert, is_read: true } : alert
            )
        )
        setUnreadAlertsCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking alert as read:", error)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "farmer":
        return "Fermier"
      case "veterinarian":
        return "Veterinar"
      case "authority":
        return "Autoritate"
      default:
        return "Utilizator"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "farmer":
        return "default"
      case "veterinarian":
        return "secondary"
      case "authority":
        return "outline"
      default:
        return "default"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}z`
    }
  }

  return (
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-900">EcoVetConnect</h1>
              {profile?.farm_name && (
                  <p className="text-xs text-emerald-600">{profile.farm_name}</p>
              )}
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
                href="/dashboard"
                className="text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Dashboard
            </Link>
            <Link
                href="/monitoring"
                className="text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Monitorizare
            </Link>
            <Link
                href="/alerts"
                className="text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Alerte
            </Link>
            <Link
                href="/ai-assistant"
                className="text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Asistent AI
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* 🔔 Notifications Dropdown */}
            <PortalDropdown
                trigger={
                  <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-700 hover:text-emerald-900 relative cursor-pointer"
                      onClick={fetchRecentAlerts}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadAlertsCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {unreadAlertsCount > 99 ? "99+" : unreadAlertsCount}
                        </Badge>
                    )}
                  </Button>
                }
                align="end"
            >
              <div className="w-80 bg-white rounded-lg shadow-lg border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-emerald-900">
                    Alerte Recente
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recentAlerts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>Nu există alerte recente</p>
                      </div>
                  ) : (
                      recentAlerts.map((alert) => (
                          <div
                              key={alert.id}
                              className={`p-3 border-b last:border-b-0 hover:bg-gray-50 ${
                                  !alert.is_read ? "bg-emerald-50" : ""
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle
                                  className={`w-4 h-4 mt-0.5 ${getSeverityColor(
                                      alert.severity
                                  )}`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {alert.title}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                  {alert.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {alert.category === "human"
                                          ? "Uman"
                                          : alert.category === "animal"
                                              ? "Animal"
                                              : "Mediu"}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      {formatTimeAgo(alert.created_at)}
                                    </div>
                                  </div>
                                  {!alert.is_read && (
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-800"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            markAlertAsRead(alert.id)
                                          }}
                                          title="Marchează ca văzut"
                                      >
                                        <Check className="w-3 h-3" />
                                      </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                      ))
                  )}
                </div>
                {recentAlerts.length > 0 && (
                    <div className="p-3 border-t bg-gray-50">
                      <Link
                          href="/alerts"
                          className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                          data-close="true"
                      >
                        Vezi toate alertele →
                      </Link>
                    </div>
                )}
              </div>
            </PortalDropdown>

            {/* 👤 Account Dropdown */}
            <PortalDropdown
                trigger={
                  <Button
                      variant="ghost"
                      className="text-emerald-700 hover:text-emerald-900 relative cursor-pointer"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {profile?.full_name?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-emerald-900">
                        {profile?.full_name || user.email}
                      </p>

                    </div>
                  </Button>
                }
                align="end"
            >
              <div className="w-56 bg-white rounded-lg shadow-lg border">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    data-close="true"
                >
                  <LogOut className="h-4 w-4" />
                  Deconectare
                </button>
              </div>
            </PortalDropdown>
          </div>
        </div>
      </header>
  )
}
