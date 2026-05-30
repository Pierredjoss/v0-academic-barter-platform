import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ExploreHeader } from "@/components/explore/explore-header"
import { ExploreFilters } from "@/components/explore/explore-filters"
import { ExploreGrid } from "@/components/explore/explore-grid"
import { Skeleton } from "@/components/ui/skeleton"

interface ExplorePageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    condition?: string
    sort?: string
    city?: string
    lat?: string
    lng?: string
  }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Get categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <ExploreHeader />
      <Suspense fallback={<div className="h-20" />}>
        <ExploreFilters categories={categories || []} currentParams={params} />
      </Suspense>
      <Suspense fallback={<GridLoading />}>
        <ExploreGrid params={params} />
      </Suspense>
    </div>
  )
}

function GridLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Skeleton key={i} className="h-72 rounded-xl" />
      ))}
    </div>
  )
}
