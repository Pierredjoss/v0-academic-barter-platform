"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, Loader2, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  NotebookPen,
  Package,
} from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  "file-text": FileText,
  "flask-conical": FlaskConical,
  "graduation-cap": GraduationCap,
  "notebook-pen": NotebookPen,
  "package": Package,
}

const conditions = [
  { value: "new", label: "Neuf", description: "Jamais utilisé" },
  { value: "like_new", label: "Comme Neuf", description: "Très peu utilisé" },
  { value: "good", label: "Bon", description: "Quelques marques" },
  { value: "fair", label: "Correct", description: "Usure visible" },
]

const exchangeTypes = [
  { value: "in_person", label: "En Personne" },
  { value: "delivery", label: "Livraison" },
  { value: "both", label: "Les Deux" },
]

interface Category {
  id: string
  name: string
  name_fr: string
  icon: string
  color: string
}

interface PublishFormProps {
  categories: Category[]
}

export function PublishForm({ categories }: PublishFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    condition: "",
    exchangeType: "in_person",
    city: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError("Vous devez être connecté pour publier")
        return
      }

      const { error: insertError } = await supabase.from("listings").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category_id: formData.categoryId,
        condition: formData.condition,
        exchange_type: formData.exchangeType,
        city: formData.city,
        status: "active",
      })

      if (insertError) {
        setError(insertError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch {
      setError("Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Check className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Annonce Publiée !</h2>
        <p className="text-muted-foreground">
          Votre annonce est maintenant en ligne. Redirection...
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card p-6"
    >
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Titre <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          placeholder="ex: Manuel de Calcul 10ème Édition"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="h-12"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Décrivez votre article, son état, ce que vous recherchez en échange..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Catégorie <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon] || Package
            const isSelected = formData.categoryId === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setFormData({ ...formData, categoryId: category.id })}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color: category.color }} />
                </div>
                <span className="text-sm font-medium">{category.name_fr}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          État <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {conditions.map((condition) => {
            const isSelected = formData.condition === condition.value
            return (
              <button
                key={condition.value}
                type="button"
                onClick={() => setFormData({ ...formData, condition: condition.value })}
                className={cn(
                  "rounded-lg border p-3 text-center transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="block text-sm font-medium">{condition.label}</span>
                <span className="text-xs text-muted-foreground">{condition.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Exchange Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Mode d&apos;échange</label>
        <div className="flex gap-2">
          {exchangeTypes.map((type) => {
            const isSelected = formData.exchangeType === type.value
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, exchangeType: type.value })}
                className={cn(
                  "flex-1 rounded-lg border p-3 text-center text-sm font-medium transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label htmlFor="city" className="text-sm font-medium">
          Ville
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="city"
            placeholder="Votre ville"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="h-12 pl-10"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1 gap-2"
          disabled={loading || !formData.title || !formData.categoryId || !formData.condition}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Publier
            </>
          )}
        </Button>
      </div>
    </motion.form>
  )
}
