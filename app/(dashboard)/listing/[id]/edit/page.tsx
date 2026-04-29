import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditListingForm } from "@/components/listings/edit-listing-form"

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
    redirect(`/dashboard/listing/${id}`)
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

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
        categories={categories || []}
        currentUserId={user.id}
      />
    </div>
  )
}
