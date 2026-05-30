import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditListingForm } from "@/components/listings/edit-listing-form"

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

interface EditListingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, description, category_id, condition, exchange_type, city, images, user_id")
    .eq("id", id)
    .single()

  if (!listing) {
    notFound()
  }

  if (listing.user_id !== user.id) {
    redirect(`/listing/${id}`)
  }

  const { data: dbCategories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  // Utiliser les catégories de la base si elles existent, sinon utiliser les catégories par défaut
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : DEFAULT_CATEGORIES

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Modifier l&apos;annonce
        </h1>
        <p className="text-muted-foreground">
          Modifiez les informations de votre annonce.
        </p>
      </div>

      <EditListingForm
        listing={listing}
        categories={categories}
        currentUserId={user.id}
      />
    </div>
  )
}
