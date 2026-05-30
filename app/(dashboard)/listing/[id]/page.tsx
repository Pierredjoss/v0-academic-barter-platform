import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ListingDetail } from "@/components/listings/listing-detail"

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get listing with related data
  const { data: listing } = await supabase
    .from("listings")
    .select(`
      *,
      profiles:user_id (id, full_name, avatar_url, city, university, average_rating, total_exchanges),
      categories:category_id (name, name_fr, icon, color)
    `)
    .eq("id", id)
    .single()

  if (!listing) {
    notFound()
  }

  // Increment view count (seulement si l'utilisateur n'est pas le propriétaire)
  const isOwner = !!user && listing.user_id === user.id
  if (!isOwner) {
    await supabase.rpc("increment_listing_views", { listing_id: id })
  }

  // Check if favorited
  const { data: favorite } = user
    ? await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", id)
        .single()
    : { data: null }

  return (
    <ListingDetail 
      listing={listing} 
      isFavorited={!!favorite} 
      isOwner={isOwner}
      currentUserId={user?.id ?? ""}
    />
  )
}
