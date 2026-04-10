import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Eye } from "lucide-react"
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Annonces Récentes</h2>
        <Button variant="ghost" asChild className="gap-1">
          <Link href="/explore">
            Voir Tout
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Eye className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-medium">Aucune Annonce</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Soyez le premier à publier une annonce !
          </p>
          <Button asChild>
            <Link href="/publish">Publier Maintenant</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
