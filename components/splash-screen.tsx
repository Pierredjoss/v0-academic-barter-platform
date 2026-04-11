"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SplashScreenProps {
  onComplete: () => void
  minimumDuration?: number
}

export function SplashScreen({ onComplete, minimumDuration = 2500 }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, minimumDuration - 500)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, minimumDuration)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete, minimumDuration])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-teal-500/20"
              />
              <div className="relative px-8 py-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  ɖyɔ̌
                </h1>
                <p className="mt-2 text-sm text-cyan-300/70">Bénin Academic Barter</p>
              </div>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
              className="mx-auto mt-6 h-0.5 w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
