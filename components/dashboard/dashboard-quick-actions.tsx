"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Search, MapPin, BookOpen, ArrowUpRight } from "lucide-react"

const actions = [
  {
    href: "/publish",
    icon: Plus,
    label: "Publier",
    description: "Créer une annonce",
    gradient: "from-cyan-500 to-teal-600",
    shadow: "shadow-cyan-500/25",
  },
  {
    href: "/explore",
    icon: Search,
    label: "Explorer",
    description: "Trouver des ressources",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
  },
  {
    href: "/map",
    icon: MapPin,
    label: "Proximité",
    description: "Voir sur la carte",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
  },
  {
    href: "/explore?category=books",
    icon: BookOpen,
    label: "Livres",
    description: "Parcourir les livres",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
  },
]

export function DashboardQuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {actions.map((action, index) => (
        <Link
          key={action.href}
          href={action.href}
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-transparent hover:shadow-lg"
        >
          {/* Hover gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
          
          {/* Icon container */}
          <div className={`relative mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg ${action.shadow} transition-transform duration-300 group-hover:scale-110`}>
            <action.icon className="h-5 w-5" />
          </div>
          
          {/* Text content */}
          <div className="relative">
            <div className="flex items-center gap-1">
              <p className="font-semibold">{action.label}</p>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </Link>
      ))}
    </motion.div>
  )
}
