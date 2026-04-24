"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  MapPin, 
  GraduationCap, 
  Star, 
  Calendar,
  Settings,
  Plus,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listings/listing-card"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  university: string | null
  city: string | null
  avatar_url: string | null
  cover_url: string | null
  bio: string | null
  total_exchanges: number
  average_rating: number
  created_at: string
}

interface ProfileViewProps {
  profile: Profile | null
  listings: Array<{
    id: string
    title: string
    description: string | null
    images: string[]
    city: string | null
    views: number
    created_at: string
    profiles?: { full_name: string | null; avatar_url: string | null; city: string | null } | null
    categories: { name: string; name_fr: string; icon: string; color: string } | null
  }>
  listingsCount: number
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    created_at: string
    reviewer: { full_name: string | null; avatar_url: string | null } | null
  }>
}

export function ProfileView({ profile, listings, listingsCount, reviews }: ProfileViewProps) {
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : "Inconnu"

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-border bg-card"
      >
        {/* Cover */}
        <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 sm:h-40" />

        {/* Profile info */}
        <div className="relative px-4 pb-6 sm:px-6">
          {/* Avatar */}
          <div className="absolute -top-12 left-4 sm:-top-16 sm:left-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-primary text-3xl font-bold text-primary-foreground sm:h-32 sm:w-32 sm:text-4xl">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm" asChild className="gap-1">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Modifier le Profil
              </Link>
            </Button>
          </div>

          {/* Info */}
          <div className="mt-8 sm:mt-4">
            <h1 className="text-2xl font-bold">{profile?.full_name || "Utilisateur"}</h1>
            
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {profile?.university && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {profile.university}
                </span>
              )}
              {profile?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Membre depuis {memberSince}
              </span>
            </div>

            {profile?.bio && (
              <p className="mt-4 text-muted-foreground">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="mt-6 flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{listingsCount}</p>
                <p className="text-xs text-muted-foreground">Annonces</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{profile?.total_exchanges || 0}</p>
                <p className="text-xs text-muted-foreground">Échanges</p>
              </div>
              <div className="flex items-center gap-1 text-center">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <p className="text-2xl font-bold">{profile?.average_rating?.toFixed(1) || "0.0"}</p>
                <p className="text-xs text-muted-foreground">Note</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Mes Annonces</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="gap-1">
              <Link href="/publish">
                <Plus className="h-4 w-4" />
                Ajouter
              </Link>
            </Button>
            {listingsCount > 6 && (
              <Button variant="ghost" size="sm" asChild className="gap-1">
                <Link href="/my-listings">
                  Voir Tout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={{
                  ...listing,
                  profiles: listing.profiles ?? null,
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12">
            <p className="mb-4 text-muted-foreground">Aucune annonce pour le moment</p>
            <Button asChild>
              <Link href="/publish">Créer Votre Première Annonce</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Avis</h2>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {review.reviewer?.full_name?.charAt(0) || "?"}
                    </div>
                    <span className="font-medium">
                      {review.reviewer?.full_name || "Anonyme"}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-8">
            <p className="text-muted-foreground">Aucun avis pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
