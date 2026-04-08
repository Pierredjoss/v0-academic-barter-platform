"use client"

import { useState } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { DashboardMobileNav } from "./dashboard-mobile-nav"
import type { User } from "@supabase/supabase-js"

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

interface DashboardShellProps {
  user: User
  profile: Profile | null
  children: React.ReactNode
}

export function DashboardShell({ user, profile, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DashboardSidebar 
        user={user} 
        profile={profile}
        className="hidden lg:flex" 
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <DashboardSidebar
        user={user}
        profile={profile}
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <DashboardHeader 
          user={user} 
          profile={profile}
          onMenuClick={() => setSidebarOpen(true)} 
        />
        <main className="min-h-[calc(100vh-4rem)] p-4 pb-24 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <DashboardMobileNav className="lg:hidden" />
    </div>
  )
}
