"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, Clock, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Conversation {
  id: string
  otherUser: {
    full_name: string | null
    avatar_url: string | null
  }
  listing: {
    title: string
    images: string[]
  } | null
  lastMessage: {
    content: string
    senderId: string
    createdAt: string
    read: boolean
  } | null
  unreadCount: number
  updatedAt: string
}

interface ConversationsListProps {
  conversations: Conversation[]
  currentUserId: string
}

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "À l'instant"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}j`
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

export function ConversationsList({ conversations, currentUserId }: ConversationsListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-16">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-medium">Aucune conversation</h3>
        <p className="text-center text-sm text-muted-foreground">
          Commencez à contacter les propriétaires d&apos;annonces pour échanger
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation, index) => (
        <motion.div
          key={conversation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/conversations/${conversation.id}`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {conversation.otherUser.avatar_url ? (
                <Image
                  src={conversation.otherUser.avatar_url}
                  alt={conversation.otherUser.full_name || "Utilisateur"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {conversation.otherUser.full_name?.charAt(0) || "U"}
                </div>
              )}
              {conversation.unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate font-semibold">
                  {conversation.otherUser.full_name || "Utilisateur"}
                </h3>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {timeAgo(conversation.updatedAt)}
                </span>
              </div>

              {conversation.listing && (
                <p className="truncate text-xs text-muted-foreground">
                  Re: {conversation.listing.title}
                </p>
              )}

              {conversation.lastMessage && (
                <p 
                  className={`truncate text-sm ${
                    conversation.unreadCount > 0 && conversation.lastMessage.senderId !== currentUserId
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {conversation.lastMessage.senderId === currentUserId ? "Vous: " : ""}
                  {conversation.lastMessage.content}
                </p>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
