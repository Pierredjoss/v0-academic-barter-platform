"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import Link from "next/link"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

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

interface LeafletMapProps {
  listings: Listing[]
  onCitySelect?: (city: string) => void
}

// Component to fit bounds to markers
function MapBounds({ listings }: { listings: Listing[] }) {
  const map = useMap()

  useEffect(() => {
    const validListings = listings.filter(
      (l): l is Listing & { latitude: number; longitude: number } =>
        l.latitude !== null && l.longitude !== null
    )

    if (validListings.length === 0) return

    if (validListings.length === 1) {
      map.setView([validListings[0].latitude, validListings[0].longitude], 13)
    } else {
      const bounds = L.latLngBounds(
        validListings.map((l) => [l.latitude, l.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [listings, map])

  return null
}

// Custom marker with category color
function createCustomIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

export function LeafletMap({ listings }: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const validListings = useMemo(
    () =>
      listings.filter(
        (l): l is Listing & { latitude: number; longitude: number } =>
          l.latitude !== null && l.longitude !== null
      ),
    [listings]
  )

  // Default center (Cotonou, Bénin - approximate center)
  const defaultCenter: [number, number] = [6.365, 2.418]

  if (!isMounted) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center rounded-xl border border-border bg-muted/30">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="h-8 w-8 animate-pulse" />
          <p>Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  if (validListings.length === 0) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MapPin className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-medium">Aucune Position Disponible</h3>
        <p className="text-center text-sm text-muted-foreground">
          Les annonces n&apos;ont pas de coordonnées GPS pour afficher sur la carte
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-border">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds listings={validListings} />

        {validListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
            icon={createCustomIcon(listing.categories?.color || "#6366f1")}
          >
            <Popup className="min-w-[200px]">
              <div className="space-y-2 p-1">
                {listing.images?.[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-24 w-full rounded-md object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {listing.city || "Ville inconnue"}
                    {listing.categories?.name_fr && (
                      <span className="ml-1">
                        • {listing.categories.name_fr}
                      </span>
                    )}
                  </p>
                </div>
                <Link href={`/listing/${listing.id}`}>
                  <Button size="sm" className="w-full gap-1 mt-1">
                    <Navigation className="h-3 w-3" />
                    Voir l&apos;annonce
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
        <p className="text-xs font-medium text-muted-foreground">
          {validListings.length} annonce{validListings.length > 1 ? "s" : ""} sur la carte
        </p>
      </div>
    </div>
  )
}
