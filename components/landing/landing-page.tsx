"use client"

import { motion } from "framer-motion"
import { LandingHeader } from "./landing-header"
import { LandingHero } from "./landing-hero"
import { LandingFeatures } from "./landing-features"
import { LandingCategories } from "./landing-categories"
import { LandingHowItWorks } from "./landing-how-it-works"
import { LandingTestimonials } from "./landing-testimonials"
import { LandingCTA } from "./landing-cta"
import { LandingFooter } from "./landing-footer"

export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCategories />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingCTA />
      </main>
      <LandingFooter />
    </motion.div>
  )
}
