"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Send, Image as ImageIcon, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  isMe: boolean
  createdAt: string
  read: boolean
}

interface ConversationDetailProps {
  conversationId: string
  currentUserId: string
  otherUser: {
    full_name: string | null
    avatar_url: string | null
  }
  listing: {
    id: string
    title: string
    images: string[]
    status: string
  } | null
  messages: Message[]
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatDate = (date: string) => {
  const messageDate = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (messageDate.toDateString() === today.toDateString()) {
    return "Aujourd'hui"
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Hier"
  } else {
    return messageDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    })
  }
}

// Grouper les messages par date
const groupMessagesByDate = (messages: Message[]) => {
  const groups: { date: string; messages: Message[] }[] = []
  let currentDate = ""

  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString()
    if (date !== currentDate) {
      currentDate = date
      groups.push({ date: formatDate(message.createdAt), messages: [message] })
    } else {
      groups[groups.length - 1].messages.push(message)
    }
  })

  return groups
}

export function ConversationDetail({
  conversationId,
  currentUserId,
  otherUser,
  listing,
  messages: initialMessages,
}: ConversationDetailProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Souscrire aux nouveaux messages en temps réel
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as any
          if (newMsg.sender_id !== currentUserId) {
            setMessages((prev) => [
              ...prev,
              {
                id: newMsg.id,
                content: newMsg.content,
                isMe: false,
                createdAt: newMsg.created_at,
                read: newMsg.read,
              },
            ])
            
            // Marquer comme lu
            supabase.from("messages").update({ read: true }).eq("id", newMsg.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, currentUserId])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage("")

    try {
      const supabase = createClient()

      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content,
        })
        .select("id, content, sender_id, created_at, read")
        .single()

      if (error) throw error

      setMessages((prev) => [
        ...prev,
        {
          id: message.id,
          content: message.content,
          isMe: true,
          createdAt: message.created_at,
          read: message.read,
        },
      ])

      inputRef.current?.focus()
    } catch (err) {
      console.error("Erreur envoi message:", err)
    } finally {
      setSending(false)
    }
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/conversations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          {otherUser.avatar_url ? (
            <Image
              src={otherUser.avatar_url}
              alt={otherUser.full_name || "Utilisateur"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {otherUser.full_name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h1 className="font-semibold">{otherUser.full_name || "Utilisateur"}</h1>
            {listing && (
              <p className="text-xs text-muted-foreground">
                Re: {listing.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Listing info card */}
      {listing && (
        <Link
          href={`/listing/${listing.id}`}
          className="my-4 flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
        >
          {listing.images && listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              width={60}
              height={60}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-muted">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{listing.title}</p>
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-xs",
                listing.status === "active"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              )}
            >
              {listing.status === "active" ? "Disponible" : listing.status}
            </span>
          </div>
        </Link>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Aucun message pour l&apos;instant</p>
            <p className="text-sm text-muted-foreground">
              Commencez la conversation ci-dessous
            </p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {/* Date separator */}
              <div className="flex justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {group.date}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      message.isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <p>{message.content}</p>
                    <span
                      className={cn(
                        "mt-1 block text-[10px]",
                        message.isMe
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.createdAt)}
                      {message.isMe && (
                        <span className="ml-1">
                          {message.read ? "✓✓" : "✓"}
                        </span>
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border pt-4">
        <Input
          ref={inputRef}
          placeholder="Écrivez votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
          disabled={sending}
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
          {sending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
