"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
  onMenuClick: () => void
}

export function DashboardHeader({ user, profile, onMenuClick }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const userInitial = profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Ouvrir le menu</span>
      </Button>

      {/* Search Bar - Fonctionnelle */}
      <form onSubmit={handleSearch} className="flex flex-1 items-center gap-4">
        <div className="relative hidden w-full max-w-md md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des annonces..."
            className="h-10 pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        {/* Mobile search button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => router.push('/explore')}
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative shrink-0"
          asChild
        >
          <Link href="/messages">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-500" />
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>

        {/* Profile Avatar */}
        <Link 
          href="/profile" 
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
        >
          {userInitial}
        </Link>
      </div>
    </header>
  )
}
