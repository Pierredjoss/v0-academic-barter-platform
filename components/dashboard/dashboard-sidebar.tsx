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

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Tableau de Bord" },
  { href: "/explore", icon: Compass, label: "Explorer" },
  { href: "/publish", icon: Plus, label: "Publier", highlight: true },
]

const secondaryNavItems = [
  { href: "/map", icon: MapPin, label: "Carte" },
  { href: "/profile", icon: User, label: "Mon Profil" },
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

  const userInitial = profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"
  const userName = profile?.full_name || "Utilisateur"
  const university = profile?.university || "Université"

  return (
    <aside className={cn(
      "flex h-full w-full flex-col bg-sidebar",
      className
    )}>
      {/* Header with Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <DyoLogo size="sm" />
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* User Profile Card */}
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-sm font-bold text-white shadow-md">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-semibold text-sidebar-foreground">
              {userName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {university}
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-3 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-medium">{profile?.average_rating?.toFixed(1) || "0.0"}</span>
          </div>
          <span className="text-sidebar-foreground/30">|</span>
          <span className="text-sidebar-foreground/60">
            {profile?.total_exchanges || 0} échanges
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Menu Principal
        </div>
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border-l-2 border-cyan-400"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    item.highlight && !isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", item.highlight && !isActive && "text-primary")} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Plus
        </div>
        <ul className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border-l-2 border-cyan-400"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
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

      {/* Footer - Sign Out */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
