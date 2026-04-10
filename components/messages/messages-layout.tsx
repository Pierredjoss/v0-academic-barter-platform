"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  listing: {
    title: string
    images: string[]
  } | null
  otherUser: {
    full_name: string | null
    avatar_url: string | null
  } | null
  lastMessage: {
    content: string
    created_at: string
    sender_id: string
  } | null
  updatedAt: string
}

interface MessagesLayoutProps {
  conversations: Conversation[]
  currentUserId: string
}

export function MessagesLayout({ conversations, currentUserId }: MessagesLayoutProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) => {
    const name = conv.otherUser?.full_name?.toLowerCase() || ""
    const title = conv.listing?.title?.toLowerCase() || ""
    const query = searchQuery.toLowerCase()
    return name.includes(query) || title.includes(query)
  })

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "maintenant"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}j`
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">Messages</span>
        </h1>
        <p className="text-muted-foreground">
          Discutez avec d&apos;autres étudiants au sujet des échanges
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des conversations..."
          className="h-11 pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Conversations list */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-2">
          {filteredConversations.map((conversation) => (
            <motion.button
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedId(conversation.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50",
                selectedId === conversation.id && "border-primary bg-primary/5"
              )}
            >
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {conversation.otherUser?.full_name?.charAt(0) || "?"}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="truncate font-semibold">
                    {conversation.otherUser?.full_name || "Utilisateur Inconnu"}
                  </p>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(conversation.lastMessage.created_at)}
                    </span>
                  )}
                </div>
                {conversation.listing && (
                  <p className="truncate text-sm text-muted-foreground">
                    Re: {conversation.listing.title}
                  </p>
                )}
                {conversation.lastMessage && (
                  <p className="truncate text-sm text-muted-foreground">
                    {conversation.lastMessage.sender_id === currentUserId ? "Vous: " : ""}
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-medium">Aucune Conversation</h3>
          <p className="text-center text-sm text-muted-foreground">
            Commencez une conversation en contactant un propriétaire d&apos;annonce
          </p>
        </div>
      )}
    </div>
  )
}
