"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 lg:p-16"
        >
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-foreground/5" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground/5" />
          
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              Ready to Start Exchanging?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
              Join thousands of students saving money and building connections. 
              Create your free account today.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group gap-2 px-8"
              >
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/explore">
                  Browse Listings
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
