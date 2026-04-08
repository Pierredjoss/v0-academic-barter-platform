import { createClient } from "@/lib/supabase/server"
import { MapView } from "@/components/map/map-view"

export default async function MapPage() {
  const supabase = await createClient()

  // Get listings with location data
  const { data: listings } = await supabase
    .from("listings")
    .select(`
      id,
      title,
      city,
      latitude,
      longitude,
      images,
      categories:category_id (name, name_fr, icon, color)
    `)
    .eq("status", "active")
    .not("city", "is", null)
    .limit(100)

  return <MapView listings={listings || []} />
}
