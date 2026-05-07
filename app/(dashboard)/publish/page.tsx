import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PublishForm } from "@/components/publish/publish-form"

// Catégories par défaut (fallback si la base de données est vide)
const DEFAULT_CATEGORIES = [
  {
    id: "default-1",
    name: "livres-cours",
    name_fr: "Livres et Supports de Cours",
    icon: "book-open",
    color: "#3b82f6",
  },
  {
    id: "default-2",
    name: "manuels",
    name_fr: "Manuels Scolaires & Livres",
    icon: "graduation-cap",
    color: "#8b5cf6",
  },
  {
    id: "default-3",
    name: "annales",
    name_fr: "Annales & Sujets d'Examens",
    icon: "file-text",
    color: "#f59e0b",
  },
  {
    id: "default-4",
    name: "notes-fiches",
    name_fr: "Notes de Cours & Fiches de Révision",
    icon: "notebook-pen",
    color: "#10b981",
  },
  {
    id: "default-5",
    name: "romans",
    name_fr: "Romans & Littérature",
    icon: "book-open",
    color: "#ec4899",
  },
]

export default async function PublishPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: dbCategories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  // Utiliser les catégories de la base si elles existent, sinon utiliser les catégories par défaut
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : DEFAULT_CATEGORIES

  if (categoriesError) {
    console.warn("Impossible de charger les catégories :", categoriesError.message)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">Publier</span> une Annonce
        </h1>
        <p className="text-muted-foreground">
          Partagez vos ressources académiques avec d&apos;autres utilisateurs
        </p>
      </div>

      <PublishForm categories={categories} />
    </div>
  )
}
