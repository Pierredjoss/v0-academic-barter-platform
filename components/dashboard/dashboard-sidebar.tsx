"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { DyoLogo } from "@/components/dyo-logo"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
  Home,
  Compass,
  Plus,
  MessageSquare,
  MapPin,
  User,
  Settings,
  LogOut,
  X,
  Star,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  university: string | null
  city: string | null
  avatar_url: string | null
  total_exchanges: number
  average_rating: number
}

interface DashboardSidebarProps {
  user: SupabaseUser
  profile: Profile | null
  className?: string
  onClose?: () => void
}

const navItems = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/explore", icon: Compass, label: "Explorer" },
  { href: "/publish", icon: Plus, label: "Publier" },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  { href: "/map", icon: MapPin, label: "Carte" },
]

const bottomNavItems = [
  { href: "/profile", icon: User, label: "Profil" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
]

export function DashboardSidebar({ user, profile, className, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <aside className={cn(
      "flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/dashboard">
          <DyoLogo size="sm" />
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* User Info */}
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium text-sidebar-foreground">
              {profile?.full_name || "Étudiant"}
            </p>
            <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{profile?.average_rating?.toFixed(1) || "0.0"}</span>
              <span className="mx-1">&bull;</span>
              <span>{profile?.total_exchanges || 0} échanges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-4">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
          <li>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
