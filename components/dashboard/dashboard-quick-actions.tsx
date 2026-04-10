"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Search, MapPin, BookOpen } from "lucide-react"

const actions = [
  {
    href: "/publish",
    icon: Plus,
    label: "Publier",
    description: "Créer une annonce",
    color: "bg-primary text-primary-foreground",
  },
  {
    href: "/explore",
    icon: Search,
    label: "Explorer",
    description: "Trouver des ressources",
    color: "bg-violet-500 text-white",
  },
  {
    href: "/map",
    icon: MapPin,
    label: "Proximité",
    description: "Voir sur la carte",
    color: "bg-emerald-500 text-white",
  },
  {
    href: "/explore?category=book",
    icon: BookOpen,
    label: "Livres",
    description: "Parcourir les livres",
    color: "bg-amber-500 text-white",
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
          className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
            <action.icon className="h-5 w-5" />
          </div>
          <p className="font-semibold">{action.label}</p>
          <p className="text-xs text-muted-foreground">{action.description}</p>
        </Link>
      ))}
    </motion.div>
  )
}
