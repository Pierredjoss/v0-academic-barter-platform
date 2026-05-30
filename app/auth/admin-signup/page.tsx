"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DyoLogo } from "@/components/dyo-logo"
import { createClient } from "@/lib/supabase/client"

export default function AdminSignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    university: "",
    city: "",
    password: "",
    confirmPassword: "",
    reason: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const passwordRequirements = [
    { label: "Au moins 8 caractères", met: formData.password.length >= 8 },
    { label: "Contient un chiffre", met: /\d/.test(formData.password) },
    { label: "Contient une majuscule", met: /[A-Z]/.test(formData.password) },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    if (!passwordRequirements.every((req) => req.met)) {
      setError("Veuillez respecter toutes les exigences du mot de passe")
      setLoading(false)
      return
    }

    if (!formData.reason.trim()) {
      setError("Veuillez expliquer pourquoi vous avez besoin d'un compte administrateur")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // 1. Create user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            university: formData.university,
            city: formData.city,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      const userId = signUpData.user?.id
      if (!userId) {
        setError("Erreur lors de la création du compte")
        return
      }

      // 2. Create profile with user role initially
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: formData.fullName,
        email: formData.email,
        university: formData.university,
        city: formData.city,
        role: "user", // Start as user, will be upgraded if approved
      })

      if (profileError) {
        setError("Erreur lors de la création du profil")
        return
      }

      // 3. Create admin request
      const { error: adminReqError } = await supabase
        .from("admin_requests")
        .insert({
          user_id: userId,
          email: formData.email,
          full_name: formData.fullName,
          university: formData.university,
          reason: formData.reason,
          status: "pending",
        })

      if (adminReqError) {
        setError("Erreur lors de la création de la demande")
        return
      }

      // 4. Send notification to managers
      try {
        await supabase.functions.invoke("send-admin-request-notification", {
          body: {
            user_name: formData.fullName,
            user_email: formData.email,
            university: formData.university,
            reason: formData.reason,
            request_id: userId,
          },
        })
      } catch (notifError) {
        console.error("Erreur lors de l'envoi de la notification:", notifError)
        // Don't fail the signup if notification fails
      }

      setSuccess(true)
      
      setTimeout(() => {
        router.push("/auth/admin-login")
      }, 3000)
    } catch {
      setError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="fixed inset-0 mesh-gradient opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md text-center"
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-500/10 p-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Demande envoyée!</h2>
            <p className="mb-4 text-muted-foreground">
              Votre demande d'accès administrateur a été envoyée au gestionnaire de la plateforme.
              Vous recevrez une notification par email dès qu'elle sera examinée.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection vers la connexion...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 mesh-gradient opacity-50" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Link href="/">
              <DyoLogo size="lg" />
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mb-2 inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Demande Admin
              </div>
              <h1 className="text-2xl font-bold">Demander l'accès Admin</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Créez un compte et demandez l'accès administrateur
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nom complet
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Jean Dupont"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="university" className="text-sm font-medium">
                    Université
                  </label>
                  <Input
                    id="university"
                    name="university"
                    placeholder="UAC"
                    value={formData.university}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    Ville
                  </label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Cotonou"
                    value={formData.city}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              {/* Password requirements */}
              <div className="space-y-2 rounded-lg bg-muted p-3">
                <p className="text-xs font-medium">Exigences du mot de passe:</p>
                <div className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <div key={req.label} className="flex items-center gap-2 text-xs">
                      <div
                        className={`h-4 w-4 rounded-full ${
                          req.met ? "bg-green-500" : "bg-muted-foreground/30"
                        }`}
                      >
                        {req.met && <Check className="h-3 w-3 text-white" />}
                      </div>
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Pourquoi avez-vous besoin d'un compte admin?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  placeholder="Expliquez votre besoin d'accès administrateur..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                className="h-10 w-full bg-gradient-to-r from-primary to-primary/80"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Envoyer la demande"
                )}
              </Button>

              <div className="pt-4 text-center text-sm">
                <span className="text-muted-foreground">Déjà un compte? </span>
                <Link href="/auth/admin-login" className="font-medium text-primary hover:underline">
                  Se connecter
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
