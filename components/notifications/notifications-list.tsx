"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NotificationRow = {
  id: string
  recipient_id: string
  actor_id: string | null
  type: string
  data: unknown
  read_at: string | null
  created_at: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key]
  return typeof v === "string" ? v : null
}

function formatDate(dateIso: string) {
  const d = new Date(dateIso)
  return d.toLocaleString("fr-FR")
}

export function NotificationsList({
  initialNotifications,
  userId,
}: {
  initialNotifications: NotificationRow[]
  userId: string
}) {
  const [notifications, setNotifications] = useState<NotificationRow[]>(initialNotifications)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  useEffect(() => {
    const channel = supabase
      .channel(`notifications:list:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const newRow = payload.new as NotificationRow
          setNotifications((prev) => [newRow, ...prev])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  const markAsRead = async (id: string) => {
    const readAt = new Date().toISOString()

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: readAt } : n)),
    )

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("id", id)
      .eq("recipient_id", userId)

    if (error) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: null } : n)))
    }
  }

  const markAllAsRead = async () => {
    const readAt = new Date().toISOString()

    const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id)
    if (unreadIds.length === 0) return

    setNotifications((prev) => prev.map((n) => (!n.read_at ? { ...n, read_at: readAt } : n)))

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("recipient_id", userId)
      .is("read_at", null)

    if (error) {
      setNotifications((prev) => prev.map((n) => (unreadIds.includes(n.id) ? { ...n, read_at: null } : n)))
    }
  }

  const unreadCount = notifications.reduce((acc, n) => acc + (n.read_at ? 0 : 1), 0)

  if (!notifications.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Vous n'avez aucune notification pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} non lue(s)` : "Tout est lu"}
        </p>
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Tout marquer comme lu
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((n) => {
          const data = isRecord(n.data) ? n.data : {}
          const listingId = getString(data, "listing_id")
          const listingTitle = getString(data, "listing_title")

          const title =
            n.type === "exchange_proposed"
              ? "Nouvelle proposition d'échange"
              : "Notification"

          const description =
            n.type === "exchange_proposed"
              ? `Quelqu'un a proposé un échange sur votre annonce${listingTitle ? ` : ${listingTitle}` : ""}.`
              : "Vous avez une nouvelle notification."

          const href = listingId ? `/listing/${listingId}` : "/dashboard"

          return (
            <div
              key={n.id}
              className={cn(
                "rounded-xl border border-border bg-card p-4 transition-colors",
                !n.read_at && "border-primary/40 bg-primary/5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={href}>Voir</Link>
                    </Button>

                    {!n.read_at && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)}>
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>

                {!n.read_at && (
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
