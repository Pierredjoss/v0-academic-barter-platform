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
    title: "Découverte Géolocalisée",
    description: "Trouvez des étudiants et des ressources près de votre campus. Échangez en personne ou organisez une livraison.",
  },
  {
    icon: MessageSquare,
    title: "Messagerie en Temps Réel",
    description: "Discutez directement avec d&apos;autres étudiants. Négociez les échanges et coordonnez les rencontres.",
  },
  {
    icon: Shield,
    title: "Étudiants Vérifiés",
    description: "La vérification par email universitaire garantit que vous échangez avec de vrais étudiants.",
  },
  {
    icon: Star,
    title: "Confiance & Avis",
    description: "Construisez votre réputation grâce aux avis. Consultez les notes avant d&apos;échanger.",
  },
  {
    icon: Zap,
    title: "Matching Intelligent",
    description: "Les suggestions basées sur l&apos;IA vous aident à trouver rapidement exactement ce dont vous avez besoin.",
  },
  {
    icon: Smartphone,
    title: "Optimisé Mobile",
    description: "Une expérience fluide sur tous les appareils. Échangez en déplacement, à tout moment.",
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
            Tout ce dont vous avez besoin pour{" "}
            <span className="gradient-text">Échanger Intelligemment</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Conçu par des étudiants, pour des étudiants. Chaque fonctionnalité est pensée 
            pour rendre le partage de ressources académiques simple et sécurisé.
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
