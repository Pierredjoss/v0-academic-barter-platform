import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ConversationsList } from "@/components/conversations/conversations-list"

export default async function ConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Récupérer les conversations de l'utilisateur avec les derniers messages
  const { data: conversations } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      conversations:conversation_id (
        id,
        listing_id,
        updated_at,
        listing:listings (title, images),
        participants:conversation_participants (
          user_id,
          profile:profiles (id, full_name, avatar_url)
        ),
        messages:messages (
          id,
          content,
          sender_id,
          created_at,
          read
        )
      )
    `)
    .eq("user_id", user.id)
    .order("conversations(updated_at)", { ascending: false })

  // Formater les conversations pour le composant client
  const formattedConversations = conversations?.map((conv: any) => {
    const otherParticipant = conv.conversations.participants.find(
      (p: any) => p.user_id !== user.id
    )?.profile

    const lastMessage = conv.conversations.messages?.[0]
    const unreadCount = conv.conversations.messages?.filter(
      (m: any) => m.sender_id !== user.id && !m.read
    ).length || 0

    return {
      id: conv.conversation_id,
      otherUser: otherParticipant || { full_name: "Utilisateur", avatar_url: null },
      listing: conv.conversations.listing,
      lastMessage: lastMessage ? {
        content: lastMessage.content,
        senderId: lastMessage.sender_id,
        createdAt: lastMessage.created_at,
        read: lastMessage.read,
      } : null,
      unreadCount,
      updatedAt: conv.conversations.updated_at,
    }
  }) || []

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">Messages</span>
        </h1>
        <p className="text-muted-foreground">
          Vos conversations avec les autres utilisateurs
        </p>
      </div>

      <ConversationsList 
        conversations={formattedConversations} 
        currentUserId={user.id}
      />
    </div>
  )
}
