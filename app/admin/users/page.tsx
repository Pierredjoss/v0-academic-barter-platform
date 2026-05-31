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
  Mail,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface User {
  id: string
  full_name: string
  email: string
  university: string
  city: string
  role: string
  average_rating: number
  total_exchanges: number
  created_at: string
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filterRole, setFilterRole] = useState<string>("all")

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const supabase = createClient()

        const query = supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })

        if (filterRole !== "all") {
          query.eq("role", filterRole)
        }

        const { data } = await query
        setUsers(data || [])
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [filterRole])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const roleColors: { [key: string]: string } = {
    admin: "bg-red-500/10 text-red-600",
    manager: "bg-orange-500/10 text-orange-600",
    user: "bg-blue-500/10 text-blue-600",
  }

  const roleLabels: { [key: string]: string } = {
    admin: "Administrateur",
    manager: "Gestionnaire",
    user: "Utilisateur",
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
          <NavLink href="/admin/users" icon={Users} label="Utilisateurs" active />
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
            <h1 className="text-2xl font-bold">Utilisateurs</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total: {users.length}
              </span>
            </div>
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
            {["all", "user", "admin", "manager"].map((role) => (
              <Button
                key={role}
                variant={filterRole === role ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole(role)}
              >
                {role === "all" && `Tous (${users.length})`}
                {role === "user" && "Utilisateurs"}
                {role === "admin" && "Administrateurs"}
                {role === "manager" && "Gestionnaires"}
              </Button>
            ))}
          </motion.div>

          {/* Users Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-border p-12 text-center"
            >
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Aucun utilisateur</h3>
              <p className="text-muted-foreground">
                Il n'y a pas d'utilisateur correspondant à ce filtre.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2">
                        {user.full_name}
                      </h3>
                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${roleColors[user.role]}`}
                      >
                        {roleLabels[user.role]}
                      </span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mb-4 space-y-2 border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-muted-foreground" />
                      <span className="break-all text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    {user.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {user.city}
                          {user.university ? `, ${user.university}` : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-center text-sm">
                    <div>
                      <p className="font-semibold text-primary">
                        {user.total_exchanges}
                      </p>
                      <p className="text-xs text-muted-foreground">Échanges</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-600">
                        {user.average_rating ? user.average_rating.toFixed(1) : "0.0"}
                      </p>
                      <p className="text-xs text-muted-foreground">Note</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    <p>
                      Inscrit le{" "}
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
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
