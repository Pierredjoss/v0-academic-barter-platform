import { createClient } from "@/lib/supabase/server"
import { BookOpen, Repeat, Eye, Star } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  // Get user's listings count
  const { count: listingsCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get exchanges count
  const { count: exchangesCount } = await supabase
    .from("exchanges")
    .select("*", { count: "exact", head: true })
    .or(`giver_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "completed")

  // Get total views on user's listings
  const { data: listingsData } = await supabase
    .from("listings")
    .select("views")
    .eq("user_id", userId)
  
  const totalViews = listingsData?.reduce((sum, listing) => sum + (listing.views || 0), 0) || 0

  // Get average rating
  const { data: profile } = await supabase
    .from("profiles")
    .select("average_rating")
    .eq("id", userId)
    .single()

  const stats = [
    {
      icon: BookOpen,
      label: "Mes Annonces",
      value: listingsCount || 0,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Repeat,
      label: "Échanges",
      value: exchangesCount || 0,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Eye,
      label: "Vues Total",
      value: totalViews,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
    },
    {
      icon: Star,
      label: "Note Moyenne",
      value: profile?.average_rating?.toFixed(1) || "0.0",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity group-hover:opacity-5`} />
          
          <div className="relative flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bgColor} transition-colors group-hover:bg-opacity-20`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
