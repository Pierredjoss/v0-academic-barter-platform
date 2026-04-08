"use client"

import { motion } from "framer-motion"
import { 
  Zap, 
  Shield, 
  MapPin, 
  MessageSquare, 
  Star, 
  Smartphone 
} from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Location-Based Discovery",
    description: "Find students and resources near your campus. Exchange in person or arrange delivery.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Messaging",
    description: "Chat directly with other students. Negotiate exchanges and coordinate meetups.",
  },
  {
    icon: Shield,
    title: "Verified Students",
    description: "University email verification ensures you are trading with real students.",
  },
  {
    icon: Star,
    title: "Trust & Reviews",
    description: "Build your reputation through reviews. See ratings before you exchange.",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description: "AI-powered suggestions help you find exactly what you need quickly.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Beautiful experience on any device. Exchange on the go, anytime.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to{" "}
            <span className="gradient-text">Exchange Smarter</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Built for students, by students. Every feature designed to make 
            academic resource sharing simple and secure.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
