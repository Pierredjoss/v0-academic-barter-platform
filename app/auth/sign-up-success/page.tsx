"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DyoLogo } from "@/components/dyo-logo"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 mesh-gradient opacity-50" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Link href="/">
              <DyoLogo size="lg" />
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
            >
              <Mail className="h-10 w-10 text-primary" />
            </motion.div>

            <h1 className="text-2xl font-bold">Vérifiez Votre Email</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Nous avons envoyé un lien de confirmation à votre adresse email. 
              Veuillez cliquer sur le lien pour vérifier votre compte et terminer l&apos;inscription.
            </p>

            <div className="mt-8 space-y-4">
              <Button asChild className="w-full gap-2">
                <Link href="/auth/login">
                  Aller à la Connexion
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Vous n&apos;avez pas reçu l&apos;email ?{" "}
                <button className="font-medium text-primary hover:underline">
                  Renvoyer
                </button>
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              &larr; Retour à l&apos;accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
