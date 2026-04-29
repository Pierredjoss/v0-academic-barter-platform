"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Save, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { BookOpen, FileText, FlaskConical, GraduationCap, NotebookPen, Package } from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  "file-text": FileText,
  "flask-conical": FlaskConical,
  "graduation-cap": GraduationCap,
  "notebook-pen": NotebookPen,
  package: Package,
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
]

interface Category {
  id: string
  name: string
  name_fr: string
  icon: string
  color: string
}

interface ListingToEdit {
  id: string
  title: string
  description: string | null
  category_id: string | null
  condition: string
  exchange_type: string
  city: string | null
  images: string[] | null
  user_id: string
}

interface EditListingFormProps {
  listing: ListingToEdit
  categories: Category[]
  currentUserId: string
}

export function EditListingForm({ listing, categories, currentUserId }: EditListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [photos, setPhotos] = useState<File[]>([])

  const [formData, setFormData] = useState({
    title: listing.title ?? "",
    description: listing.description ?? "",
    categoryId: listing.category_id ?? "",
    condition: listing.condition ?? "",
    exchangeType: listing.exchange_type ?? "in_person",
    city: listing.city ?? "",
  })

  const existingImages = useMemo(() => listing.images ?? [], [listing.images])

  const canSubmit =
    !loading &&
    !deleting &&
    !!formData.title &&
    !!formData.condition &&
    (categories.length === 0 || !!formData.categoryId)

  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError("Vous devez être connecté pour modifier")
        return
      }

      if (user.id !== currentUserId || listing.user_id !== user.id) {
        setError("Accès refusé")
        return
      }

      if (categories.length > 0 && !formData.categoryId) {
        setError("Veuillez choisir une catégorie")
        return
      }

      const categoryId = formData.categoryId && isValidUUID(formData.categoryId) ? formData.categoryId : null

      const payload: {
        title: string
        description: string
        category_id?: string | null
        condition: string
        exchange_type: string
        city: string
      } = {
        title: formData.title,
        description: formData.description,
        condition: formData.condition,
        exchange_type: formData.exchangeType,
        city: formData.city,
      }

      payload.category_id = categoryId

      const { error: updateListingError } = await supabase
        .from("listings")
        .update(payload)
        .eq("id", listing.id)

      if (updateListingError) {
        const extra = [updateListingError.details, updateListingError.hint, updateListingError.code]
          .filter(Boolean)
          .join(" | ")
        setError(extra ? `${updateListingError.message} (${extra})` : updateListingError.message)
        return
      }

      if (photos.length > 0) {
        const bucket = supabase.storage.from("listing-images")
        const uploadedUrls: string[] = []

        for (const file of photos) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
          const path = `${user.id}/${listing.id}/${Date.now()}-${safeName}`

          const { error: uploadError } = await bucket.upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          })

          if (uploadError) {
            const message = [uploadError.message, (uploadError as any)?.error].filter(Boolean).join(" | ")
            throw new Error(message || "Erreur upload")
          }

          const { data } = bucket.getPublicUrl(path)
          if (!data?.publicUrl) {
            throw new Error("Impossible de récupérer l'URL de l'image")
          }
          uploadedUrls.push(data.publicUrl)
        }

        const { error: updateImagesError } = await supabase
          .from("listings")
          .update({ images: uploadedUrls })
          .eq("id", listing.id)

        if (updateImagesError) {
          const extra = [updateImagesError.details, updateImagesError.hint, updateImagesError.code]
            .filter(Boolean)
            .join(" | ")
          setError(extra ? `${updateImagesError.message} (${extra})` : updateImagesError.message)
          return
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/listing/${listing.id}`)
        router.refresh()
      }, 800)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur inattendue s'est produite"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleting || loading) return
    setError(null)

    const ok = window.confirm("Supprimer cette annonce ?")
    if (!ok) return

    setDeleting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError("Vous devez être connecté pour supprimer")
        return
      }

      if (user.id !== currentUserId || listing.user_id !== user.id) {
        setError("Accès refusé")
        return
      }

      const { error: deleteError } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing.id)

      if (deleteError) {
        const extra = [deleteError.details, deleteError.hint, deleteError.code]
          .filter(Boolean)
          .join(" | ")
        setError(extra ? `${deleteError.message} (${extra})` : deleteError.message)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur inattendue s'est produite"
      setError(message)
    } finally {
      setDeleting(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="text-sm text-muted-foreground">Annonce mise à jour. Redirection...</div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleUpdate}
      className="space-y-6 rounded-2xl border border-border bg-card p-6"
    >
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Titre <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Catégorie{categories.length > 0 && <span className="text-destructive">*</span>}
        </label>
        {categories.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            Aucune catégorie disponible pour le moment.
          </div>
        ) : (
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
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
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
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Photos
        </label>
        {existingImages.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Photos actuelles: {existingImages.length}. Ajouter de nouvelles photos remplacera les anciennes.
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos(Array.from(e.target.files || []))}
          className="h-12"
        />
      </div>

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
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                )}
              >
                <span className="block text-sm font-medium">{condition.label}</span>
                <span className="text-xs text-muted-foreground">{condition.description}</span>
              </button>
            )
          })}
        </div>
      </div>

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
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                )}
              >
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="city" className="text-sm font-medium">
          Ville
        </label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="h-12"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="destructive" className="flex-1 gap-2" onClick={handleDelete} disabled={loading || deleting}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Supprimer
        </Button>

        <Button type="submit" className="flex-1 gap-2" disabled={!canSubmit}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

      {photos.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {photos.length} nouvelle(s) photo(s) sélectionnée(s).
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Upload className="h-3.5 w-3.5" />
        Les nouvelles photos remplacent les anciennes.
      </div>
    </motion.form>
  )
}
