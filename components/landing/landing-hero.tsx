"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, BookOpen, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[10%] hidden h-20 w-20 rounded-2xl bg-primary/10 lg:block"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-60 right-[15%] hidden h-16 w-16 rounded-full bg-accent/20 lg:block"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-40 left-[20%] hidden h-12 w-12 rounded-xl bg-primary/15 lg:block"
      />

      <div className="container relative mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Intelligent Academic Exchange</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Exchange Knowledge,{" "}
            <span className="gradient-text">Empower Learning</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Connect with students near you to barter academic resources. 
            Books, notes, materials - all without spending a dime.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="btn-glow group gap-2 px-8">
              <Link href="/auth/sign-up">
                Start Exchanging
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 px-8">
              <Link href="#how-it-works">
                Learn More
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 sm:gap-12"
          >
            {[
              { icon: BookOpen, value: "10K+", label: "Resources Shared" },
              { icon: Users, value: "5K+", label: "Active Students" },
              { icon: MapPin, value: "50+", label: "Universities" },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <stat.icon className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold sm:text-3xl">{stat.value}</span>
                <span className="text-xs text-muted-foreground sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative mt-20 w-full max-w-5xl"
          >
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/50" />
                <div className="h-3 w-3 rounded-full bg-chart-4/50" />
                <div className="h-3 w-3 rounded-full bg-chart-2/50" />
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 p-8">
                <div className="grid h-full grid-cols-3 gap-4">
                  {/* Sidebar mockup */}
                  <div className="rounded-xl bg-card/80 p-4">
                    <div className="mb-4 h-4 w-20 rounded bg-primary/20" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10" />
                          <div className="h-3 flex-1 rounded bg-muted" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Main content mockup */}
                  <div className="col-span-2 rounded-xl bg-card/80 p-4">
                    <div className="mb-4 h-6 w-40 rounded bg-primary/20" />
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-lg bg-muted/50 p-3">
                          <div className="mb-2 aspect-video rounded bg-primary/10" />
                          <div className="h-3 w-3/4 rounded bg-muted" />
                          <div className="mt-2 h-2 w-1/2 rounded bg-muted/70" />
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
