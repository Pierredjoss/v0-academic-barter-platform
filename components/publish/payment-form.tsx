"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Loader2, Check, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface PaymentFormProps {
  userId: string
}

export function PaymentForm({ userId }: PaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      const supabase = createClient()

      // Créer un paiement
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: userId,
          amount: 50,
          currency: "XOF",
          status: "completed", // Simulé pour l'instant
          provider: "manual",
        })
        .select("id")
        .single()

      if (paymentError) {
        throw paymentError
      }

      // Succès
      setSuccess(true)
      
      // Rediriger vers la page de publication après 1.5s
      setTimeout(() => {
        router.push("/publish")
      }, 1500)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue"
      console.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Check className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Paiement Confirmé !</h2>
        <p className="text-muted-foreground">
          Redirection vers la publication...
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 rounded-2xl border border-border bg-card p-6"
    >
      {/* Détails du paiement */}
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
          <span className="font-medium">Publication d&apos;annonce</span>
          <span className="text-lg font-bold">50 FCFA</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Paiement sécurisé. Cette somme permet de maintenir la plateforme.</span>
        </div>
      </div>

      {/* Méthodes de paiement simulées */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Méthode de paiement</p>
        
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="h-14 justify-start gap-3"
            onClick={handlePayment}
            disabled={loading}
          >
            <CreditCard className="h-5 w-5 text-primary" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Carte Bancaire</span>
              <span className="text-xs text-muted-foreground">Visa, Mastercard</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-14 justify-start gap-3"
            onClick={handlePayment}
            disabled={loading}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-orange-500 text-[10px] font-bold text-white">
              M
n            </span>
            <div className="flex flex-col items-start">
              <span className="font-medium">Mobile Money</span>
              <span className="text-xs text-muted-foreground">MTN, Orange, Wave</span>
            </div>
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Traitement du paiement...
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        En cliquant sur une méthode de paiement, vous acceptez nos conditions d&apos;utilisation.
      </p>
    </motion.div>
  )
}
