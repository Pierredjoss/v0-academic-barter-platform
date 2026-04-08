"use client"

import { motion } from "framer-motion"

interface Profile {
  full_name: string | null
  university: string | null
}

interface DashboardWelcomeProps {
  profile: Profile | null
}

export function DashboardWelcome({ profile }: DashboardWelcomeProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const firstName = profile?.full_name?.split(" ")[0] || "Student"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-1"
    >
      <h1 className="text-2xl font-bold sm:text-3xl">
        {getGreeting()}, <span className="gradient-text">{firstName}</span>
      </h1>
      <p className="text-muted-foreground">
        {profile?.university 
          ? `Welcome back! Ready to exchange at ${profile.university}?`
          : "Ready to discover academic resources?"
        }
      </p>
    </motion.div>
  )
}
