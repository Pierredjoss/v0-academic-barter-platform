"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, List, Map, Search, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"
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

interface Listing {
  id: string
  title: string
  city: string | null
  latitude: number | null
  longitude: number | null
  images: string[]
  categories: {
    name: string
    name_fr: string
    icon: string
    color: string
  } | null
}

interface MapViewProps {
  listings: Listing[]
}

export function MapView({ listings }: MapViewProps) {
  const [viewMode, setViewMode] = useState<"map" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")

  // Group listings by city
  const citiesMap = listings.reduce((acc, listing) => {
    const city = listing.city || "Unknown"
    if (!acc[city]) {
      acc[city] = []
    }
    acc[city].push(listing)
    return acc
  }, {} as Record<string, Listing[]>)

  const cities = Object.entries(citiesMap)
    .map(([name, items]) => ({ name, count: items.length, listings: items }))
    .sort((a, b) => b.count - a.count)

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold sm:text-3xl">
            <span className="gradient-text">Nearby</span> Listings
          </h1>
          <p className="text-muted-foreground">
            Find resources in your area
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "map" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search cities..."
          className="h-11 pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{city.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {city.count} listing{city.count > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Navigation className="h-4 w-4" />
                    View All
                  </Button>
                </div>
                
                {/* Listings preview */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {city.listings.slice(0, 5).map((listing) => {
                    const Icon = categoryIcons[listing.categories?.icon || "package"] || Package
                    return (
                      <Link
                        key={listing.id}
                        href={`/listing/${listing.id}`}
                        className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background p-2 transition-colors hover:border-primary/50"
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${listing.categories?.color}20` }}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{ color: listing.categories?.color }}
                          />
                        </div>
                        <span className="max-w-32 truncate text-sm font-medium">
                          {listing.title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-1 font-medium">No Listings Found</h3>
              <p className="text-center text-sm text-muted-foreground">
                No listings available in nearby cities
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Map className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-medium">Map View Coming Soon</h3>
          <p className="text-center text-sm text-muted-foreground">
            Interactive map with listing pins is under development
          </p>
        </div>
      )}
    </div>
  )
}
