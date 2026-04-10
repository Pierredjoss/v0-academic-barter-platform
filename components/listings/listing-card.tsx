"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Eye, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
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

interface ListingCardProps {
  listing: {
    id: string
    title: string
    description: string | null
    images: string[]
    city: string | null
    views: number
    created_at: string
    profiles: {
      full_name: string | null
      avatar_url: string | null
      city: string | null
    } | null
    categories: {
      name: string
      name_fr: string
      icon: string
      color: string
    } | null
  }
  className?: string
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const CategoryIcon = categoryIcons[listing.categories?.icon || "package"] || Package
  const hasImage = listing.images && listing.images.length > 0

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "À l'instant"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `Il y a ${minutes}min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `Il y a ${days}j`
    return new Date(date).toLocaleDateString("fr-FR")
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hasImage ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CategoryIcon className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Category badge */}
        <div 
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: listing.categories?.color || "#6366f1" }}
        >
          <CategoryIcon className="h-3.5 w-3.5" />
          {listing.categories?.name_fr || "Autre"}
        </div>

        {/* Favorite button */}
        <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 truncate font-semibold group-hover:text-primary">
          {listing.title}
        </h3>
        
        {listing.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {listing.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {listing.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {listing.city}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {listing.views}
            </span>
          </div>
          <span>{timeAgo(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}
