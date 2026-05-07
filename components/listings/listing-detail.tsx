"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { 
  ArrowLeft, Heart, Share2, MapPin, 
  Clock, Shield, MessageCircle, 
  Package, Phone, MessageSquare, 
  AlertCircle, Check, Loader2, Flag, Star, GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface ListingDetailProps {
  listing: any
  isFavorited: boolean
  isOwner: boolean
  currentUserId: string
}

export function ListingDetail({ listing, isFavorited: initialFavorited, isOwner, currentUserId }: ListingDetailProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'selecting' | 'sent'>('idle')
  
  // États pour le formulaire d'échange
  const [myListings, setMyListings] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const fetchMyListings = async () => {
    if (!currentUserId) {
      router.push("/auth/login")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', currentUserId)
    
    if (error) {
      toast.error("Erreur de chargement de vos articles")
    } else {
      setMyListings(data || [])
      setStatus('selecting')
    }
    setLoading(false)
  }

  const handleSendOffer = async () => {
    if (selectedItems.length === 0) return toast.error("Sélectionnez au moins un article")
    if (!phone.trim()) return toast.error("Le numéro de téléphone est obligatoire")

    setLoading(true)
    const supabase = createClient()

    try {
      const { error: offerError } = await supabase.from('exchange_offers').insert({
        sender_id: currentUserId,
        receiver_id: listing.profiles?.id,
        listing_id: listing.id,
        offered_item_ids: selectedItems,
        phone_number: phone,
        message: message,
        status: 'pending'
      })

      if (offerError) throw offerError

      await supabase.from('notifications').insert({
        user_id: listing.profiles?.id,
        title: "Nouvelle proposition d'échange !",
        message: `Offre reçue pour "${listing.title}". Contact : ${phone}`,
        type: "offer_received",
        link: "/dashboard/offers"
      })

      setStatus('sent')
      toast.success("Proposition envoyée !")
    } catch (err) {
      console.error(err)
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted shadow-lg">
            <Image 
              src={listing.images?.[0] || "/placeholder.svg"} 
              alt={listing.title} 
              fill 
              className="object-cover"
            />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div key="idle" className="space-y-3">
                  <Button 
                    onClick={fetchMyListings} 
                    disabled={loading || isOwner}
                    className="w-full h-14 text-lg font-bold"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Proposer un échange"}
                  </Button>
                  <Button variant="outline" className="w-full h-12 gap-2">
                    <MessageCircle className="h-5 w-5" /> Contacter
                  </Button>
                </motion.div>
              )}

              {status === 'selecting' && (
                <motion.div 
                  key="selecting"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 p-4 border-2 border-primary/20 rounded-2xl bg-primary/5"
                >
                  <h4 className="font-bold flex items-center gap-2 underline text-primary">
                    <Package className="h-4 w-4" /> Vos articles (Max 2)
                  </h4>
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {myListings.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (selectedItems.includes(item.id)) {
                            setSelectedItems(selectedItems.filter(id => id !== item.id))
                          } else if (selectedItems.length < 2) {
                            setSelectedItems([...selectedItems, item.id])
                          }
                        }}
                        className={`text-left p-3 rounded-xl border-2 text-sm transition-all ${
                          selectedItems.includes(item.id) ? "border-primary bg-primary/10" : "bg-white"
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" /> Ton Numéro *
                    </label>
                    <Input 
                      placeholder="+229..." 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" /> Message (Optionnel)
                    </label>
                    <Textarea 
                      placeholder="Un petit mot ?" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1" onClick={() => setStatus('idle')}>Annuler</Button>
                    <Button 
                      className="flex-1 font-bold" 
                      onClick={handleSendOffer}
                      disabled={loading || selectedItems.length === 0 || !phone}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Envoyer"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {status === 'sent' && (
                <motion.div key="sent" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <Button disabled className="w-full h-14 bg-green-600 text-white font-bold text-lg">
                    <Check className="mr-2 h-6 w-6" /> OFFRE ENVOYÉE
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {listing.profiles?.full_name?.[0] || "?"}
              </div>
              <div>
                <p className="font-bold">{listing.profiles?.full_name || "Utilisateur"}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {listing.profiles?.average_rating || "0.0"} • {listing.profiles?.university || "Étudiant"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}