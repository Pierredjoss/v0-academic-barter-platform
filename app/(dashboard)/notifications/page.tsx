import { createClient } from "@/lib/supabase/server"
import { NotificationsList } from "@/components/notifications/notifications-list"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">Notifications</span>
        </h1>
        <p className="text-muted-foreground">
          Retrouvez ici toutes vos notifications
        </p>
      </div>

      <NotificationsList initialNotifications={notifications || []} userId={user!.id} />
    </div>
  )
}
