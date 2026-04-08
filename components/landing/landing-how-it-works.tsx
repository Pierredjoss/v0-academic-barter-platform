"use client"

import { motion } from "framer-motion"
import { UserPlus, Search, MessageCircle, Repeat } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up with your university email. Verify your student status in seconds.",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse or List",
    description: "Search for resources you need or publish items you want to exchange.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Connect & Chat",
    description: "Message other students directly. Discuss details and arrange the exchange.",
  },
  {
    icon: Repeat,
    step: "04",
    title: "Exchange & Review",
    description: "Meet up or arrange delivery. Leave a review to build community trust.",
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
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
            How{" "}
            <span className="gradient-text">ɖyɔ̌</span>
            {" "}Works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Four simple steps to start exchanging academic resources 
            with students in your area.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-20">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/50 via-primary to-primary/50 lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col items-center gap-8 lg:flex-row ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className={`inline-block rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg ${
                    index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                  }`}>
                    <span className="text-sm font-bold text-primary">Step {step.step}</span>
                    <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 max-w-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon (center on desktop) */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg lg:mx-8">
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
