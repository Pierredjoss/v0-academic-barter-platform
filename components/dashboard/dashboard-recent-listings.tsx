import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listings/listing-card"

export async function DashboardRecentListings() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from("listings")
    .select(`
      *,
      profiles:user_id (full_name, avatar_url, city),
      categories:category_id (name, name_fr, icon, color)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-500" />
          <h2 className="text-xl font-bold">Annonces Récentes</h2>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10">
          <Link href="/explore">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {listings && listings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
            <Sparkles className="h-7 w-7 text-cyan-500" />
          </div>
          <h3 className="mb-1 text-lg font-medium">Aucune annonce pour le moment</h3>
          <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
            Soyez le premier à publier une annonce et commencez à échanger des ressources académiques !
          </p>
          <Button asChild className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
            <Link href="/publish">Publier une annonce</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
