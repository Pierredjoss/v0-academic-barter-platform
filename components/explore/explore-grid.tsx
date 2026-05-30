import { createClient } from "@/lib/supabase/server"
import { ListingCard } from "@/components/listings/listing-card"
import { Search } from "lucide-react"

interface ExploreGridProps {
  params: {
    category?: string
    search?: string
    condition?: string
    sort?: string
    city?: string
    lat?: string
    lng?: string
  }
}

export async function ExploreGrid({ params }: ExploreGridProps) {
  const supabase = await createClient()

  let query = supabase
    .from("listings")
    .select(`
      *,
      profiles:user_id (full_name, avatar_url, city),
      categories:category_id (name, name_fr, icon, color)
    `)
    .eq("status", "active")

  // Apply category filter
  if (params.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("name", params.category)
      .single()
    
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  // Apply search filter
  if (params.search) {
    query = query.ilike("title", `%${params.search}%`)
  }

  // Apply condition filter
  if (params.condition) {
    query = query.eq("condition", params.condition)
  }

  // Apply city filter
  if (params.city) {
    query = query.ilike("city", `%${params.city}%`)
  }

  // Apply geo filter (radius ~50km if lat/lng provided)
  if (params.lat && params.lng) {
    const lat = parseFloat(params.lat)
    const lng = parseFloat(params.lng)
    const radiusKm = 50
    
    // Approximation: 1 degree ≈ 111km
    const latDelta = radiusKm / 111
    const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180))
    
    query = query
      .gte("latitude", lat - latDelta)
      .lte("latitude", lat + latDelta)
      .gte("longitude", lng - lngDelta)
      .lte("longitude", lng + lngDelta)
  }

  // Apply sorting
  switch (params.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true })
      break
    case "views":
      query = query.order("views", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: listings } = await query.limit(20)

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-medium">Aucune annonce trouvée</h3>
        <p className="text-center text-sm text-muted-foreground">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
