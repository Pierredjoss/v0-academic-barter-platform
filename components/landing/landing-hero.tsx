"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, BookOpen, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const typingTexts = [
  "Donner-Recevoir-Progresser",
  "l'échange au service du savoir",
  "Partagez vos ressources",
]

function TypewriterText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = typingTexts[currentIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % typingTexts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex])

  return (
    <span className="gradient-text">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block ml-1 w-[3px] h-[0.9em] bg-primary align-middle"
      />
    </span>
  )
}

export function LandingHero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Floating elements - hidden on mobile for performance */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[10%] hidden h-16 w-16 rounded-2xl bg-primary/10 blur-sm lg:block xl:h-20 xl:w-20"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-60 right-[15%] hidden h-12 w-12 rounded-full bg-accent/20 blur-sm lg:block xl:h-16 xl:w-16"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-40 left-[20%] hidden h-10 w-10 rounded-xl bg-primary/15 blur-sm lg:block xl:h-12 xl:w-12"
      />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Plateforme de Troc Académique Intelligente</span>
            </div>
          </motion.div>

          {/* Heading with Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 sm:mt-8"
          >
            <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <TypewriterText />
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-xl px-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:max-w-2xl sm:px-0 sm:text-lg md:text-xl"
          >
            Connectez-vous avec des utilisateurs près de chez vous pour troquer des ressources académiques. Articles, notes,
            matériels.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex w-full flex-col gap-3 px-4 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4 sm:px-0"
          >
            <Button 
              size="lg" 
              asChild 
              className="btn-glow group gap-2 px-6 py-6 text-base shadow-lg shadow-primary/20 sm:px-8 sm:py-6"
            >
              <Link href="/auth/sign-up">
                Commencer à Échanger
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="gap-2 px-6 py-6 text-base sm:px-8 sm:py-6"
            >
              <Link href="#how-it-works">
                En Savoir Plus
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid w-full max-w-md grid-cols-3 gap-4 sm:mt-16 sm:max-w-lg sm:gap-8 md:max-w-xl lg:gap-12"
          >
            {[
              { icon: BookOpen, value: "1K+", label: "Ressources" },
              { icon: Users, value: "500+", label: "Utilisateurs" },
              { icon: MapPin, value: "20+", label: "Universités" },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="flex flex-col items-center gap-1.5 sm:gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
                  <stat.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <span className="text-xl font-bold sm:text-2xl md:text-3xl">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground sm:text-xs md:text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Hero Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative mt-12 w-full max-w-5xl px-2 sm:mt-20 sm:px-0"
          >
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:rounded-2xl">
              {/* Browser dots */}
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2 sm:gap-2 sm:px-4 sm:py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/50 sm:h-3 sm:w-3" />
                <div className="h-2.5 w-2.5 rounded-full bg-chart-4/50 sm:h-3 sm:w-3" />
                <div className="h-2.5 w-2.5 rounded-full bg-chart-2/50 sm:h-3 sm:w-3" />
                <div className="ml-2 flex-1 rounded-md bg-muted/80 px-3 py-1 sm:ml-4">
                  <span className="text-[10px] text-muted-foreground sm:text-xs">dyo.app/dashboard</span>
                </div>
              </div>
              {/* Mockup content */}
              <div className="aspect-[16/10] bg-gradient-to-br from-muted to-muted/50 p-3 sm:aspect-[16/9] sm:p-6 md:p-8">
                <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  {/* Sidebar mockup - hidden on mobile */}
                  <div className="hidden rounded-xl bg-card/80 p-3 sm:block sm:p-4">
                    <div className="mb-3 h-3 w-16 rounded bg-primary/20 sm:mb-4 sm:h-4 sm:w-20" />
                    <div className="space-y-2 sm:space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-2 sm:gap-3">
                          <div className="h-6 w-6 rounded-lg bg-primary/10 sm:h-8 sm:w-8" />
                          <div className="h-2 flex-1 rounded bg-muted sm:h-3" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Main content mockup */}
                  <div className="col-span-1 rounded-xl bg-card/80 p-3 sm:col-span-2 sm:p-4">
                    <div className="mb-3 h-4 w-28 rounded bg-primary/20 sm:mb-4 sm:h-6 sm:w-40" />
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-lg bg-muted/50 p-2 sm:p-3">
                          <div className="mb-1.5 aspect-video rounded bg-primary/10 sm:mb-2" />
                          <div className="h-2 w-3/4 rounded bg-muted sm:h-3" />
                          <div className="mt-1 h-1.5 w-1/2 rounded bg-muted/70 sm:mt-2 sm:h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
