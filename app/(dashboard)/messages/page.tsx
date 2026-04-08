import { createClient } from "@/lib/supabase/server"
import { MessagesLayout } from "@/components/messages/messages-layout"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get conversations with participants and last message
  const { data: participations } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      conversations:conversation_id (
        id,
        listing_id,
        updated_at,
        listings:listing_id (title, images)
      )
    `)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  // Get other participants for each conversation
  const conversationIds = participations?.map(p => p.conversation_id) || []
  
  const { data: allParticipants } = await supabase
    .from("conversation_participants")
    .select(`
      conversation_id,
      user_id,
      profiles:user_id (full_name, avatar_url)
    `)
    .in("conversation_id", conversationIds)
    .neq("user_id", user!.id)

  // Get last messages
  const { data: lastMessages } = await supabase
    .from("messages")
    .select("conversation_id, content, created_at, sender_id")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false })

  // Combine data
  const conversations = participations?.map(p => {
    const otherParticipant = allParticipants?.find(
      ap => ap.conversation_id === p.conversation_id
    )
    const lastMessage = lastMessages?.find(
      m => m.conversation_id === p.conversation_id
    )
    
    return {
      id: p.conversation_id,
      listing: p.conversations?.listings,
      otherUser: otherParticipant?.profiles,
      lastMessage: lastMessage,
      updatedAt: p.conversations?.updated_at,
    }
  }) || []

  return <MessagesLayout conversations={conversations} currentUserId={user!.id} />
}
