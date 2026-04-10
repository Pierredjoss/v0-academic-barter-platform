"use client"

import { motion } from "framer-motion"

export function ExploreHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-1"
    >
      <h1 className="text-2xl font-bold sm:text-3xl">
        <span className="gradient-text">Explorer</span> les Annonces
      </h1>
      <p className="text-muted-foreground">
        Découvrez des ressources académiques d&apos;étudiants près de chez vous
      </p>
    </motion.div>
  )
}
