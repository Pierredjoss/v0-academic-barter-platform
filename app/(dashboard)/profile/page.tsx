import { createClient } from "@/lib/supabase/server"
import { ProfileView } from "@/components/profile/profile-view"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  // Get user's listings
  const { data: listings, count: listingsCount } = await supabase
    .from("listings")
    .select(`
      *,
      categories:category_id (name, name_fr, icon, color)
    `, { count: "exact" })
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(6)

  // Get user's reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id (full_name, avatar_url)
    `)
    .eq("reviewed_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <ProfileView
      profile={profile}
      listings={listings || []}
      listingsCount={listingsCount || 0}
      reviews={reviews || []}
    />
  )
}
