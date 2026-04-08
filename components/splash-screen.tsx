"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SplashScreenProps {
  onComplete: () => void
  minimumDuration?: number
}

export function SplashScreen({ onComplete, minimumDuration = 2500 }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo")

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase("text"), 800)
    const textTimer = setTimeout(() => setPhase("exit"), minimumDuration - 500)
    const exitTimer = setTimeout(onComplete, minimumDuration)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(textTimer)
      clearTimeout(exitTimer)
    }
  }, [onComplete, minimumDuration])

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {/* Mesh gradient background */}
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          
          {/* Animated circles */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute h-[600px] w-[600px] rounded-full border border-primary/20"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute h-[400px] w-[400px] rounded-full border border-primary/30"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
            className="absolute h-[200px] w-[200px] rounded-full bg-primary/5"
          />

          {/* Logo and text container */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="relative"
            >
              <div className="relative flex h-24 w-24 items-center justify-center">
                {/* Glow effect */}
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px var(--dyo-glow)",
                      "0 0 40px var(--dyo-glow)",
                      "0 0 20px var(--dyo-glow)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-primary"
                />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-primary">
                  <span className="text-4xl font-bold text-primary-foreground">ɖ</span>
                </div>
              </div>
            </motion.div>

            {/* Brand name */}
            <AnimatePresence>
              {(phase === "text" || phase === "exit") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center gap-2"
                >
                  <h1 className="text-4xl font-bold tracking-tight">
                    <span className="gradient-text">ɖyɔ̌</span>
                  </h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-sm text-muted-foreground"
                  >
                    Academic Barter Platform
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-secondary"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="h-full w-1/2 rounded-full bg-primary"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
