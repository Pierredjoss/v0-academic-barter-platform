"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Eye,
  Calendar,
  Star,
  Repeat,
  Flag,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  NotebookPen,
  Package,
} from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  "file-text": FileText,
  "flask-conical": FlaskConical,
  "graduation-cap": GraduationCap,
  "notebook-pen": NotebookPen,
  "package": Package,
}

const conditionLabels: Record<string, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
}

const exchangeTypeLabels: Record<string, string> = {
  in_person: "In Person",
  delivery: "Delivery",
  both: "In Person or Delivery",
}

interface ListingDetailProps {
  listing: {
    id: string
    title: string
    description: string | null
    images: string[]
    condition: string
    exchange_type: string
    city: string | null
    views: number
    created_at: string
    profiles: {
      id: string
      full_name: string | null
      avatar_url: string | null
      city: string | null
      university: string | null
      average_rating: number
      total_exchanges: number
    } | null
    categories: {
      name: string
      name_fr: string
      icon: string
      color: string
    } | null
  }
  isFavorited: boolean
  isOwner: boolean
  currentUserId: string
}

export function ListingDetail({ listing, isFavorited: initialFavorited, isOwner, currentUserId }: ListingDetailProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  const CategoryIcon = categoryIcons[listing.categories?.icon || "package"] || Package
  const hasImages = listing.images && listing.images.length > 0

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
    return new Date(date).toLocaleDateString()
  }

  const handleFavorite = async () => {
    setLoading(true)
    const supabase = createClient()

    if (isFavorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", currentUserId)
        .eq("listing_id", listing.id)
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: currentUserId, listing_id: listing.id })
    }

    setIsFavorited(!isFavorited)
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleFavorite} disabled={loading}>
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          {isOwner && (
            <>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/listing/${listing.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            {hasImages ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <CategoryIcon className="h-24 w-24 text-muted-foreground/20" />
              </div>
            )}
            {/* Category badge */}
            <div
              className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white"
              style={{ backgroundColor: listing.categories?.color || "#6366f1" }}
            >
              <CategoryIcon className="h-4 w-4" />
              {listing.categories?.name_fr || "Other"}
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h1 className="mb-4 text-2xl font-bold">{listing.title}</h1>

            <div className="mb-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                <Repeat className="h-3.5 w-3.5" />
                {conditionLabels[listing.condition] || listing.condition}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {exchangeTypeLabels[listing.exchange_type] || listing.exchange_type}
              </span>
              {listing.city && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  {listing.city}
                </span>
              )}
            </div>

            {listing.description && (
              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.views} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {timeAgo(listing.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Owner card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {listing.profiles?.full_name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold">{listing.profiles?.full_name || "Unknown"}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {listing.profiles?.average_rating?.toFixed(1) || "0.0"}
                  </span>
                  <span>&bull;</span>
                  <span>{listing.profiles?.total_exchanges || 0} exchanges</span>
                </div>
              </div>
            </div>

            {listing.profiles?.university && (
              <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                {listing.profiles.university}
              </p>
            )}

            {listing.profiles?.city && (
              <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {listing.profiles.city}
              </p>
            )}

            {!isOwner && (
              <Button className="w-full gap-2" disabled variant="outline">
                <span className="text-muted-foreground">Contact (bientôt)</span>
              </Button>
            )}

            {isOwner && (
              <p className="text-center text-sm text-muted-foreground">
                This is your listing
              </p>
            )}
          </div>

          {/* Report */}
          {!isOwner && (
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
              <Flag className="h-4 w-4" />
              Report Listing
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
