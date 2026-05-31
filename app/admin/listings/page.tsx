"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  BookOpen,
  LogOut,
  Menu,
  MessageSquare,
  AlertTriangle,
  Users,
  X,
  CheckCircle,
  Clock,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Listing {
  id: string
  title: string
  description: string
  status: string
  views: number
  created_at: string
  user: {
    full_name: string
    email: string
  }
  category: {
    name_fr: string
  }
}

export default function AdminListings() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const loadListings = async () => {
      try {
        const supabase = createClient()

        const query = supabase
          .from("listings")
          .select(`
            id,
            title,
            description,
            status,
            views,
            created_at,
            user:profiles (
              full_name,
              email
            ),
            category:categories (
              name_fr
            )
          `)
          .order("created_at", { ascending: false })
          .limit(100)

        if (filterStatus !== "all") {
          query.eq("status", filterStatus)
        }

        const { data } = await query
        setListings(data || [])
      } catch (error) {
        console.error("Error loading listings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadListings()
  }, [filterStatus])

  const handleArchiveListing = async (listingId: string) => {
    setActionLoading(listingId)
    try {
      const supabase = createClient()

      await supabase
        .from("listings")
        .update({ status: "archived" })
        .eq("id", listingId)

      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId ? { ...l, status: "archived" } : l
        )
      )
    } catch (error) {
      console.error("Error archiving listing:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivateListing = async (listingId: string) => {
    setActionLoading(listingId)
    try {
      const supabase = createClient()

      await supabase
        .from("listings")
        .update({ status: "active" })
        .eq("id", listingId)

      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId ? { ...l, status: "active" } : l
        )
      )
    } catch (error) {
      console.error("Error activating listing:", error)
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
    pending_payment: "bg-orange-500/10 text-orange-600",
    active: "bg-green-500/10 text-green-600",
    reserved: "bg-blue-500/10 text-blue-600",
    completed: "bg-purple-500/10 text-purple-600",
    archived: "bg-gray-500/10 text-gray-600",
  }

  const statusLabels: { [key: string]: string } = {
    pending_payment: "En attente de paiement",
    active: "Active",
    reserved: "Réservée",
    completed: "Complétée",
    archived: "Archivée",
  }

  const statusIcons: { [key: string]: any } = {
    pending_payment: Clock,
    active: CheckCircle,
    reserved: BookOpen,
    completed: CheckCircle,
    archived: Archive,
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
          <NavLink href="/admin/listings" icon={BookOpen} label="Publications" active />
          <NavLink href="/admin/reports" icon={AlertTriangle} label="Signalements" />
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
            <h1 className="text-2xl font-bold">Publications</h1>
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
            {["all", "active", "pending_payment", "reserved", "completed", "archived"].map(
              (status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status === "all" && `Toutes (${listings.length})`}
                  {status === "active" && "Active"}
                  {status === "pending_payment" && "En attente"}
                  {status === "reserved" && "Réservée"}
                  {status === "completed" && "Complétée"}
                  {status === "archived" && "Archivée"}
                </Button>
              )
            )}
          </motion.div>

          {/* Listings List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : listings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-border p-12 text-center"
            >
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Aucune publication</h3>
              <p className="text-muted-foreground">
                Il n'y a pas de publication correspondant à ce filtre.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {listings.map((listing) => {
                const StatusIcon = statusIcons[listing.status] || Clock
                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold line-clamp-2">
                          {listing.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[listing.status]}`}
                          >
                            <div className="flex items-center gap-1">
                              <StatusIcon size={12} />
                              {statusLabels[listing.status]}
                            </div>
                          </span>
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600">
                            {listing.category?.name_fr || "Catégorie"}
                          </span>
                          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600">
                            👁️ {listing.views} vues
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>
                          {new Date(listing.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="mb-4 rounded-lg bg-muted/50 p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Auteur
                      </p>
                      <p className="text-sm font-medium">{listing.user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{listing.user?.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {listing.status === "archived" ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleActivateListing(listing.id)}
                          disabled={actionLoading === listing.id}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          {actionLoading === listing.id ? "Traitement..." : "Réactiver"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleArchiveListing(listing.id)}
                          disabled={actionLoading === listing.id}
                        >
                          <Archive size={16} className="mr-2" />
                          {actionLoading === listing.id ? "Traitement..." : "Archiver"}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
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
