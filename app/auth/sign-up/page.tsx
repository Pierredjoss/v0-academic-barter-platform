"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DyoLogo } from "@/components/dyo-logo"
import { createClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "",
    city: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordRequirements = [
    { label: "Au moins 8 caractères", met: formData.password.length >= 8 },
    { label: "Contient un chiffre", met: /\d/.test(formData.password) },
    { label: "Contient une majuscule", met: /[A-Z]/.test(formData.password) },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const supabase = createClient()
      
      // 1. Créer le compte utilisateur
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            university: formData.university,
            city: formData.city,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      const signedUpUserId = signUpData.user?.id
      const hasSession = !!signUpData.session

      // 2. Connexion immédiate (auto-login après inscription)
      // Quand la confirmation email est OFF, Supabase retourne souvent directement une session.
      if (!hasSession) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          setError(`Compte créé mais erreur lors de la connexion: ${signInError.message}`)
          router.push("/auth/login")
          return
        }
      }

      const { data: { user: authedUser }, error: authedUserError } = await supabase.auth.getUser()
      if (authedUserError) {
        setError(authedUserError.message)
        return
      }
      const userId = authedUser?.id || signedUpUserId
      if (!userId) {
        setError("Une erreur inattendue s'est produite")
        return
      }

      // 3. Créer ou mettre à jour le profil (si le trigger a échoué)
      const { error: profileUpsertError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            full_name: formData.fullName,
            phone: formData.phone,
            university: formData.university,
            city: formData.city,
            email: formData.email,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )

      if (profileUpsertError) {
        console.error("Erreur mise à jour profil:", profileUpsertError)
      }

      // 4. Redirection directe vers le dashboard
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-2xl font-bold">Créer un Compte</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Rejoignez la communauté d'échange académique
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nom Complet
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="h-12"
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
                  placeholder="prenom.nom@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Numéro MTN <span className="text-muted-foreground">(pour les paiements)</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="ex: 96 12 34 56"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="university" className="text-sm font-medium">
                    Université <span className="text-muted-foreground">(optionnel)</span>
                  </label>
                  <Input
                    id="university"
                    name="university"
                    type="text"
                    placeholder="ex: UAC, EPAC, UP..."
                    value={formData.university}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    Ville
                  </label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="ex: Cotonou, Abomey-Calavi, Parakou..."
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="h-12"
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
                    placeholder="Créez un mot de passe fort"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* Password requirements */}
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-xs ${
                        req.met ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      <Check className={`h-3 w-3 ${req.met ? "opacity-100" : "opacity-30"}`} />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmer le Mot de passe
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Créer un Compte
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                En vous inscrivant, vous acceptez nos{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Conditions d&apos;utilisation
                </Link>{" "}
                et notre{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Politique de confidentialité
                </Link>
              </p>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Se connecter
              </Link>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
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
