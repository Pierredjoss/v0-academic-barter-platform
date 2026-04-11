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
      {/* Desktop Sidebar - Fixed */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 lg:block">
        <DashboardSidebar 
          user={user} 
          profile={profile}
          className="h-full" 
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar
          user={user}
          profile={profile}
          className="h-full"
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col lg:ml-64">
        {/* Header - Sticky */}
        <DashboardHeader 
          user={user} 
          profile={profile}
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        {/* Main Content */}
        <main className="flex-1 p-4 pb-20 lg:p-6 lg:pb-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <DashboardMobileNav className="lg:hidden" />
    </div>
  )
}
