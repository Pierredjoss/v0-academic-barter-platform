"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Check,
  LogOut,
  Menu,
  MessageSquare,
  Trash2,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AdminRequest {
  id: string
  user_id: string
  email: string
  full_name: string
  university: string
  reason: string
  status: string
  created_at: string
  reviewed_at?: string
}

export default function AdminRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const supabase = createClient()

        const query = supabase
          .from("admin_requests")
          .select("*")
          .order("created_at", { ascending: false })

        if (filterStatus !== "all") {
          query.eq("status", filterStatus)
        }

        const { data } = await query
        setRequests(data || [])
      } catch (error) {
        console.error("Error loading requests:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [filterStatus])

  const handleApproveRequest = async (requestId: string, userId: string) => {
    setActionLoading(requestId)
    try {
      const supabase = createClient()

      // Get current user
      const { data: currentUser } = await supabase.auth.getUser()

      // Update admin_requests status
      await supabase
        .from("admin_requests")
        .update({
          status: "approved",
          reviewed_by: currentUser.user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      // Update user profile role to admin
      await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", userId)

      // Send notification to user
      try {
        await supabase.functions.invoke("send-admin-approval-notification", {
          body: {
            user_id: userId,
            user_email: requests.find((r) => r.id === requestId)?.email,
          },
        })
      } catch (notifError) {
        console.error("Error sending notification:", notifError)
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "approved" } : r
        )
      )
    } catch (error) {
      console.error("Error approving request:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      const supabase = createClient()

      // Get current user
      const { data: currentUser } = await supabase.auth.getUser()

      // Update admin_requests status
      await supabase
        .from("admin_requests")
        .update({
          status: "rejected",
          reviewed_by: currentUser.user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      // Send rejection notification
      try {
        await supabase.functions.invoke("send-admin-rejection-notification", {
          body: {
            user_email: requests.find((r) => r.id === requestId)?.email,
          },
        })
      } catch (notifError) {
        console.error("Error sending notification:", notifError)
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "rejected" } : r
        )
      )
    } catch (error) {
      console.error("Error rejecting request:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const statusColors: { [key: string]: string } = {
    pending: "bg-orange-500/10 text-orange-600",
    approved: "bg-green-500/10 text-green-600",
    rejected: "bg-red-500/10 text-red-600",
  }

  const statusLabels: { [key: string]: string } = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300 ${
          !sidebarOpen && "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <h2 className="text-xl font-bold">Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 p-6">
          <NavLink href="/admin/dashboard" icon={BarChart3} label="Tableau de bord" />
          <NavLink href="/admin/listings" icon={BookOpen} label="Publications" />
          <NavLink href="/admin/reports" icon={AlertTriangle} label="Signalements" />
          <NavLink href="/admin/users" icon={Users} label="Utilisateurs" />
          <NavLink
            href="/admin/requests"
            icon={MessageSquare}
            label="Demandes Admin"
            active
          />
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : ""}`}>
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold">Demandes Admin</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {["pending", "approved", "rejected", "all"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status === "pending" && `En attente (${requests.length})`}
                {status === "approved" && "Approuvé"}
                {status === "rejected" && "Rejeté"}
                {status === "all" && "Tous"}
              </Button>
            ))}
          </motion.div>

          {/* Requests List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-border p-12 text-center"
            >
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Aucune demande</h3>
              <p className="text-muted-foreground">
                Il n'y a pas de demande correspondant à ce filtre.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {request.full_name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[request.status]}`}
                        >
                          {statusLabels[request.status]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>
                        {new Date(request.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mb-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium break-all">{request.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Université</p>
                      <p className="font-medium">{request.university || "Non spécifié"}</p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4 rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Raison de la demande
                    </p>
                    <p className="text-sm text-foreground">{request.reason}</p>
                  </div>

                  {/* Actions */}
                  {request.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          handleApproveRequest(request.id, request.user_id)
                        }
                        disabled={actionLoading === request.id}
                      >
                        <Check size={16} className="mr-2" />
                        {actionLoading === request.id ? "Traitement..." : "Approuver"}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={actionLoading === request.id}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string
  icon: React.ComponentType<any>
  label: string
  active?: boolean
}) {
  return (
    <Link href={href}>
      <Button
        variant={active ? "default" : "ghost"}
        className={`w-full justify-start ${active ? "bg-primary text-primary-foreground" : ""}`}
      >
        <Icon size={18} className="mr-3" />
        {label}
      </Button>
    </Link>
  )
}
