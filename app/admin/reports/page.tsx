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

interface ReportedListing {
  id: string
  listing: {
    id: string
    title: string
    status: string
    user: {
      full_name: string
    }
  }
  reason: string
  description: string
  status: string
  reported_by: string
  created_at: string
  review_count?: number
}

export default function AdminReports() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportedListing[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const loadReports = async () => {
      try {
        const supabase = createClient()

        const query = supabase
          .from("reported_listings")
          .select(`
            id,
            reason,
            description,
            status,
            reported_by,
            created_at,
            listing:listings (
              id,
              title,
              status,
              user:profiles (
                full_name
              )
            )
          `)
          .order("created_at", { ascending: false })

        if (filterStatus !== "all") {
          query.eq("status", filterStatus)
        }

        const { data } = await query
        setReports(data || [])
      } catch (error) {
        console.error("Error loading reports:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [filterStatus])

  const handleApproveReport = async (reportId: string, listingId: string) => {
    setActionLoading(reportId)
    try {
      const supabase = createClient()

      // Update report status
      await supabase
        .from("reported_listings")
        .update({ status: "resolved" })
        .eq("id", reportId)

      // Archive the listing
      await supabase
        .from("listings")
        .update({ status: "archived" })
        .eq("id", listingId)

      // Refresh reports
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status: "resolved" } : r
        )
      )
    } catch (error) {
      console.error("Error approving report:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDismissReport = async (reportId: string) => {
    setActionLoading(reportId)
    try {
      const supabase = createClient()

      await supabase
        .from("reported_listings")
        .update({ status: "dismissed" })
        .eq("id", reportId)

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status: "dismissed" } : r
        )
      )
    } catch (error) {
      console.error("Error dismissing report:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const reportReasons: { [key: string]: string } = {
    inappropriate_content: "Contenu inapproprié",
    fake_item: "Article frauduleux",
    duplicate: "Doublon",
    spam: "Spam",
    other: "Autre",
  }

  const statusColors: { [key: string]: string } = {
    pending: "bg-orange-500/10 text-orange-600",
    reviewed: "bg-blue-500/10 text-blue-600",
    resolved: "bg-green-500/10 text-green-600",
    dismissed: "bg-gray-500/10 text-gray-600",
  }

  const statusLabels: { [key: string]: string } = {
    pending: "En attente",
    reviewed: "Examiné",
    resolved: "Résolu",
    dismissed: "Rejeté",
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
          <NavLink href="/admin/reports" icon={AlertTriangle} label="Signalements" active />
          <NavLink href="/admin/users" icon={Users} label="Utilisateurs" />
          <NavLink href="/admin/requests" icon={MessageSquare} label="Demandes Admin" />
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
            <h1 className="text-2xl font-bold">Signalements</h1>
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
            {["pending", "reviewed", "resolved", "dismissed", "all"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status === "pending" && `En attente (${reports.length})`}
                {status === "reviewed" && "Examiné"}
                {status === "resolved" && "Résolu"}
                {status === "dismissed" && "Rejeté"}
                {status === "all" && "Tous"}
              </Button>
            ))}
          </motion.div>

          {/* Reports List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : reports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-border p-12 text-center"
            >
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Aucun signalement</h3>
              <p className="text-muted-foreground">
                Il n'y a pas de signalement correspondant à ce filtre.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {report.listing?.title || "Annonce supprimée"}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[report.status]}`}
                        >
                          {statusLabels[report.status]}
                        </span>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600">
                          {reportReasons[report.reason] || report.reason}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>
                        {new Date(report.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {report.description && (
                    <div className="mb-4 rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-foreground">{report.description}</p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Auteur de l'annonce</p>
                      <p className="font-medium">{report.listing?.user?.full_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Statut de l'annonce</p>
                      <p className="font-medium capitalize">{report.listing?.status || "supprimée"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {report.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          handleApproveReport(report.id, report.listing?.id || "")
                        }
                        disabled={actionLoading === report.id}
                      >
                        <Check size={16} className="mr-2" />
                        {actionLoading === report.id ? "Traitement..." : "Accepter & Archiver"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismissReport(report.id)}
                        disabled={actionLoading === report.id}
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
