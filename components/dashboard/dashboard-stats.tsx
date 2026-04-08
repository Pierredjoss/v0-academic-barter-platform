import { createClient } from "@/lib/supabase/server"
import { BookOpen, Repeat, MessageSquare, Star } from "lucide-react"

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

  // Get conversations count
  const { count: conversationsCount } = await supabase
    .from("conversation_participants")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get average rating
  const { data: profile } = await supabase
    .from("profiles")
    .select("average_rating")
    .eq("id", userId)
    .single()

  const stats = [
    {
      icon: BookOpen,
      label: "My Listings",
      value: listingsCount || 0,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      icon: Repeat,
      label: "Exchanges",
      value: exchangesCount || 0,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: MessageSquare,
      label: "Conversations",
      value: conversationsCount || 0,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Star,
      label: "Rating",
      value: profile?.average_rating?.toFixed(1) || "0.0",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
