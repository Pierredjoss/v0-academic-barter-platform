"use client"

import { motion } from "framer-motion"
import { UserPlus, Search, MapPin, Repeat } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Créer un Compte",
    description: "Inscrivez-vous avec votre email universitaire. Vérifiez votre statut d&apos;étudiant en quelques secondes.",
  },
  {
    icon: Search,
    step: "02",
    title: "Parcourir ou Publier",
    description: "Recherchez les ressources dont vous avez besoin ou publiez les articles que vous souhaitez échanger.",
  },
  {
    icon: MapPin,
    step: "03",
    title: "Trouver & Rencontrer",
    description: "Utilisez la carte pour trouver des ressources proches. Rencontrez-vous sur le campus pour échanger.",
  },
  {
    icon: Repeat,
    step: "04",
    title: "Échanger & Évaluer",
    description: "Rencontrez-vous ou organisez une livraison. Laissez un avis pour renforcer la confiance communautaire.",
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
            Comment fonctionne{" "}
            <span className="gradient-text">ɖyɔ̌</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Quatre étapes simples pour commencer à échanger des ressources académiques 
            avec des étudiants de votre région.
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
                    <span className="text-sm font-bold text-primary">Étape {step.step}</span>
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
