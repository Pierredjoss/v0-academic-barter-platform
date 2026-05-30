// components/listings/report-listing-dialog.tsx
"use client"

import { useState } from "react"
import { AlertTriangle, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface ReportListingDialogProps {
  listingId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const reportReasons = [
  { value: "inappropriate_content", label: "Contenu inapproprié" },
  { value: "fake_item", label: "Article frauduleux" },
  { value: "duplicate", label: "Doublon" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Autre" },
]

export function ReportListingDialog({
  listingId,
  isOpen,
  onOpenChange,
}: ReportListingDialogProps) {
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/listings/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          reason,
          description,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Erreur lors du signalement")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setReason("")
        setDescription("")
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="mb-4 rounded-full bg-green-500/10 p-3">
              <div className="h-8 w-8 rounded-full bg-green-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Merci!</h3>
            <p className="text-muted-foreground">
              Votre signalement a été envoyé à notre équipe modération.
            </p>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Signaler cette annonce
              </DialogTitle>
              <DialogDescription>
                Aidez-nous à maintenir une plateforme sûre en signalant les annonces problématiques
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Raison du signalement *
                </label>
                <div className="space-y-2">
                  {reportReasons.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 rounded-lg border border-input p-3 cursor-pointer hover:bg-muted transition-colors"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={opt.value}
                        checked={reason === opt.value}
                        onChange={(e) => setReason(e.target.value)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Détails supplémentaires
                </label>
                <textarea
                  id="description"
                  placeholder="Décrivez le problème en détail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={loading || !reason}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Envoyer le signalement"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
