"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    content: "I saved over $500 this semester by exchanging textbooks through ɖyɔ̌. The platform made it so easy to connect with other students.",
    author: "Aminata K.",
    role: "Medical Student",
    university: "Université de Lomé",
    rating: 5,
  },
  {
    content: "As an engineering student, lab materials are expensive. ɖyɔ̌ helped me find everything I needed from seniors who already completed the courses.",
    author: "Kofi M.",
    role: "Engineering Student",
    university: "KNUST",
    rating: 5,
  },
  {
    content: "The location feature is amazing! I found someone from my own campus within minutes. We met at the library and exchanged notes.",
    author: "Fatou D.",
    role: "Law Student",
    university: "Université Cheikh Anta Diop",
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
            Loved by{" "}
            <span className="gradient-text">Students</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Join thousands of students who are already saving money 
            and building connections through ɖyɔ̌.
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
                &ldquo;{testimonial.content}&rdquo;
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
