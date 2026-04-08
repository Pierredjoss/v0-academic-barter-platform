"use client"

import { motion } from "framer-motion"
import { 
  BookOpen, 
  FileText, 
  FlaskConical, 
  GraduationCap, 
  NotebookPen, 
  Package 
} from "lucide-react"

const categories = [
  {
    icon: BookOpen,
    name: "Books",
    nameFr: "Livres",
    count: "3.2K+",
    color: "bg-violet-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500",
  },
  {
    icon: FileText,
    name: "Past Exams",
    nameFr: "Épreuves",
    count: "1.8K+",
    color: "bg-cyan-500",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-500",
  },
  {
    icon: FlaskConical,
    name: "Lab Materials",
    nameFr: "Matériaux",
    count: "950+",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500",
  },
  {
    icon: GraduationCap,
    name: "Courses",
    nameFr: "Cours",
    count: "2.1K+",
    color: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-500",
  },
  {
    icon: NotebookPen,
    name: "Notes",
    nameFr: "Notes",
    count: "4.5K+",
    color: "bg-pink-500",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-500",
  },
  {
    icon: Package,
    name: "Other",
    nameFr: "Autre",
    count: "780+",
    color: "bg-indigo-500",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-500",
  },
]

export function LandingCategories() {
  return (
    <section id="categories" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      
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
            Browse by{" "}
            <span className="gradient-text">Category</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            From textbooks to lab equipment, find exactly what you need 
            for your academic journey.
          </p>
        </motion.div>

        {/* Categories grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.bgColor}`}>
                  <category.icon className={`h-7 w-7 ${category.textColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.nameFr}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{category.count}</span>
                  <p className="text-xs text-muted-foreground">listings</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
