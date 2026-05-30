import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardRecentListings } from "@/components/dashboard/dashboard-recent-listings"
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions"
import { Skeleton } from "@/components/ui/skeleton"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  return (
    <div className="space-y-6">
      <DashboardWelcome profile={profile} />
      
      <DashboardQuickActions />
      
      <Suspense fallback={<StatsLoading />}>
        <DashboardStats userId={user!.id} />
      </Suspense>
      
      <Suspense fallback={<ListingsLoading />}>
        <DashboardRecentListings />
      </Suspense>
    </div>
  )
}

function StatsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  )
}

function ListingsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
