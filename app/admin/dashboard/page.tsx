"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Eye,
  LogOut,
  Menu,
  MessageSquare,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Stats {
  totalListings: number
  activeListings: number
  totalViews: number
  reportedListings: number
  pendingReports: number
  totalUsers: number
  totalExchanges: number
}

interface ReportedListing {
  id: string
  listing: {
    id: string
    title: string
    user: {
      full_name: string
    }
  }
  reason: string
  status: string
  reported_by: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [reportedListings, setReportedListings] = useState<ReportedListing[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient()

        // Get stats
        const [
          listingsRes,
          viewsRes,
          reportsRes,
          usersRes,
          exchangesRes,
        ] = await Promise.all([
          supabase.from("listings").select("status", { count: "exact" }),
          supabase.rpc("get_total_views"),
          supabase.from("reported_listings").select("status", { count: "exact" }),
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase.from("exchanges").select("id", { count: "exact" }),
        ])

        const totalListings = listingsRes.count || 0
        const activeListings =
          listingsRes.data?.filter((l) => l.status === "active").length || 0
        const totalViews = viewsRes.data?.[0]?.total || 0
        const totalReports = reportsRes.count || 0
        const pendingReports =
          reportsRes.data?.filter((r) => r.status === "pending").length || 0
        const totalUsers = usersRes.count || 0
        const totalExchanges = exchangesRes.count || 0

        setStats({
          totalListings,
          activeListings,
          totalViews,
          reportedListings: totalReports,
          pendingReports,
          totalUsers,
          totalExchanges,
        })

        // Get recent reported listings
        const { data: reports } = await supabase
          .from("reported_listings")
          .select(`
            id,
            reason,
            status,
            reported_by,
            created_at,
            listing:listings (
              id,
              title,
              user:profiles (
                full_name
              )
            )
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5)

        setReportedListings(reports || [])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const statCards = [
    {
      title: "Publications",
      value: stats?.totalListings || 0,
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600",
      trend: "+12%",
    },
    {
      title: "Actives",
      value: stats?.activeListings || 0,
      icon: TrendingUp,
      color: "bg-green-500/10 text-green-600",
      trend: "+8%",
    },
    {
      title: "Vues",
      value: stats?.totalViews || 0,
      icon: Eye,
      color: "bg-purple-500/10 text-purple-600",
      trend: "+24%",
    },
    {
      title: "Utilisateurs",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-orange-500/10 text-orange-600",
      trend: "+5%",
    },
    {
      title: "Signalées",
      value: stats?.reportedListings || 0,
      icon: AlertTriangle,
      color: "bg-red-500/10 text-red-600",
      trend: stats?.pendingReports || 0,
    },
    {
      title: "Échanges",
      value: stats?.totalExchanges || 0,
      icon: MessageSquare,
      color: "bg-indigo-500/10 text-indigo-600",
      trend: "+15%",
    },
  ]

  const reportReasons: { [key: string]: string } = {
    inappropriate_content: "Contenu inapproprié",
    fake_item: "Article frauduleux",
    duplicate: "Doublon",
    spam: "Spam",
    other: "Autre",
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
          <NavLink href="/admin/dashboard" icon={BarChart3} label="Tableau de bord" active />
          <NavLink href="/admin/listings" icon={BookOpen} label="Publications" />
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
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {statCards.map((card, index) => {
                  const Icon = card.icon
                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{card.title}</p>
                          <p className="mt-2 text-3xl font-bold">{card.value}</p>
                          {card.title !== "Signalées" && (
                            <p className="mt-2 text-xs text-green-600">{card.trend}</p>
                          )}
                          {card.title === "Signalées" && (
                            <p className="mt-2 text-xs text-orange-600">
                              {card.trend} en attente
                            </p>
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${card.color}`}>
                          <Icon size={24} />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Recent Reports */}
              {reportedListings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Signalements en attente</h2>
                    <Link href="/admin/reports">
                      <Button variant="ghost" size="sm">
                        Voir tous
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {reportedListings.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{report.listing?.title || "N/A"}</h3>
                          <p className="text-sm text-muted-foreground">
                            Raison: {reportReasons[report.reason] || report.reason}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Par: {report.listing?.user?.full_name || "Anonyme"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Examiner
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <Link href="/admin/requests">
                  <Button variant="outline" className="h-12 w-full justify-start text-left">
                    <MessageSquare className="mr-3 h-5 w-5" />
                    <div>
                      <p className="font-semibold">Demandes Admin</p>
                      <p className="text-xs text-muted-foreground">
                        À examiner
                      </p>
                    </div>
                  </Button>
                </Link>

                <Link href="/admin/reports">
                  <Button variant="outline" className="h-12 w-full justify-start text-left">
                    <AlertTriangle className="mr-3 h-5 w-5" />
                    <div>
                      <p className="font-semibold">Signalements</p>
                      <p className="text-xs text-muted-foreground">
                        {stats?.pendingReports || 0} en attente
                      </p>
                    </div>
                  </Button>
                </Link>
              </motion.div>
            </>
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
