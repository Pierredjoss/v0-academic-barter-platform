import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ConversationDetail } from "@/components/conversations/conversation-detail"

interface ConversationPageProps {
  params: { id: string }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { id } = params

  // Vérifier que l'utilisateur est participant de cette conversation
  const { data: participant } = await supabase
    .from("conversation_participants")
    .select("*")
    .eq("conversation_id", id)
    .eq("user_id", user.id)
    .single()

  if (!participant) {
    redirect("/conversations")
  }

  // Récupérer les détails de la conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      id,
      listing_id,
      listing:listings (id, title, images, status),
      participants:conversation_participants (
        user_id,
        profile:profiles (id, full_name, avatar_url)
      )
    `)
    .eq("id", id)
    .single()

  if (!conversation) {
    redirect("/conversations")
  }

  // Récupérer tous les messages
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      sender_id,
      created_at,
      read
    `)
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })

  // Formater les données
  const otherParticipantData = conversation.participants?.find(
    (p: any) => p.user_id !== user.id
  )
  const otherParticipant = otherParticipantData?.profile || { full_name: "Utilisateur", avatar_url: null }
  const otherUserId = otherParticipantData?.user_id

  const formattedMessages = messages?.map((m: any) => ({
    id: m.id,
    content: m.content,
    isMe: m.sender_id === user.id,
    createdAt: m.created_at,
    read: m.read,
  })) || []

  // Marquer les messages comme lus
  if (otherUserId) {
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", id)
      .eq("sender_id", otherUserId)
      .eq("read", false)
  }

  return (
    <ConversationDetail
      conversationId={id}
      currentUserId={user.id}
      otherUser={otherParticipant || { full_name: "Utilisateur", avatar_url: null }}
      listing={conversation.listing}
      messages={formattedMessages}
    />
  )
}
