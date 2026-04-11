"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Compass, Plus, MessageSquare, User } from "lucide-react"

interface DashboardMobileNavProps {
  className?: string
}

const navItems = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/explore", icon: Compass, label: "Explorer" },
  { href: "/publish", icon: Plus, label: "Publier", isCenter: true },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  { href: "/profile", icon: User, label: "Profil" },
]

export function DashboardMobileNav({ className }: DashboardMobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl",
      className
    )}>
      <div className="flex h-16 items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center justify-center"
              >
                <div className="flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30 transition-transform active:scale-95">
                  <item.icon className="h-6 w-6" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                isActive 
                  ? "text-cyan-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
