"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DyoLogo } from "@/components/dyo-logo"

export default function AuthErrorPage() {
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
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
            >
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </motion.div>

            <h1 className="text-2xl font-bold">Erreur d&apos;Authentification</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Une erreur s&apos;est produite lors du processus d&apos;authentification. 
              Cela peut être dû à un lien expiré ou une requête invalide.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild className="w-full gap-2">
                <Link href="/auth/login">
                  Réessayer
                  <RefreshCw className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full gap-2">
                <Link href="/">
                  Retour à l&apos;Accueil
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Support link */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              Besoin d&apos;aide ?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contacter le Support
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
