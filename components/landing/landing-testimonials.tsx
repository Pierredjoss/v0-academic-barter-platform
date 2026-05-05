"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    content: "J’ai économisé plus de 25 000 FCFA ce semestre en échangeant des manuels via ɖyɔ̌. La plateforme a rendu si facile la connexion avec d’autres utilisateurs.",
    author: "Aminata K.",
    role: "Utilisatrice en Médecine",
    university: "Université de Lomé",
    rating: 5,
  },
  {
    content: "En tant qu’étudiant en ingénierie, les matériaux de labo sont chers. ɖyɔ̌ m’a aidé à trouver tout ce dont j’avais besoin auprès des anciens qui avaient déjà terminé les cours.",
    author: "Kofi M.",
    role: "Utilisateur en Ingénierie",
    university: "KNUST",
    rating: 5,
  },
  {
    content: "La fonction de localisation est incroyable ! J’ai trouvé quelqu’un de mon propre campus en quelques minutes. Nous nous sommes rencontrés à la bibliothèque et avons  échangé des notes.",
    author: "Fatou D.",
    role: "Utilisatrice en Droit",
    university: "Utilisateur Cheikh Anta Diop",
    rating: 5,
  },
]

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      <div className="container relative mx-auto max-w-6xl px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Adoré par les{" "}
            <span className="gradient-text">Utilisateurs</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Rejoignez des milliers d&apos;utilisateurs qui économisent déjà de l&apos;argent 
            en échangeant des ressources académiques sur ɖyɔ̌.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
              
              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="mb-6 text-muted-foreground leading-relaxed">
                &laquo;{testimonial.content}&raquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {testimonial.author.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} &bull; {testimonial.university}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
