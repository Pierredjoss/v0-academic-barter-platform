"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, Locate, X, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGeolocation } from "@/hooks/use-geolocation"
import { cn } from "@/lib/utils"

export function GeoFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showGeoModal, setShowGeoModal] = useState(false)
  const [manualCity, setManualCity] = useState(searchParams.get("city") || "")
  
  const { 
    city, 
    region, 
    latitude, 
    longitude, 
    requestLocation, 
    permissionGranted,
    loading,
    error 
  } = useGeolocation()

  const applyLocationFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (latitude && longitude) {
      params.set("lat", latitude.toString())
      params.set("lng", longitude.toString())
      if (city) params.set("city", city)
    } else if (manualCity) {
      params.set("city", manualCity)
      params.delete("lat")
      params.delete("lng")
    }
    
    router.push(`/explore?${params.toString()}`)
    setShowGeoModal(false)
  }

  const clearLocationFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("lat")
    params.delete("lng")
    params.delete("city")
    router.push(`/explore?${params.toString()}`)
    setManualCity("")
  }

  const hasActiveLocation = searchParams.get("city") || (searchParams.get("lat") && searchParams.get("lng"))
  const activeCity = searchParams.get("city")

  return (
    <>
      {/* Bouton principal */}
      <Button
        variant={hasActiveLocation ? "default" : "outline"}
        size="sm"
        className="gap-2"
        onClick={() => setShowGeoModal(true)}
      >
        <MapPin className="h-4 w-4" />
        {activeCity ? activeCity : "Localisation"}
      </Button>

      {/* Modal de sélection */}
      {showGeoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filtrer par localisation</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowGeoModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Option 1: Géolocalisation automatique */}
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  <span className="font-medium">Utiliser ma position</span>
                </div>
                
                {permissionGranted === true && city ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Position détectée: <strong>{city}</strong>
                      {region && `, ${region}`}
                    </p>
                    <Button onClick={applyLocationFilter} className="w-full">
                      Appliquer cette localisation
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={requestLocation}
                    disabled={loading}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {loading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Locate className="h-4 w-4" />
                    )}
                    {loading ? "Recherche..." : "Autoriser la géolocalisation"}
                  </Button>
                )}
                
                {error && (
                  <p className="mt-2 text-xs text-destructive">{error}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              {/* Option 2: Saisie manuelle */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Saisir une ville</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Cotonou, Porto-Novo..."
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={applyLocationFilter}
                    disabled={!manualCity.trim()}
                  >
                    Appliquer
                  </Button>
                </div>
              </div>

              {/* Bouton effacer */}
              {hasActiveLocation && (
                <Button
                  variant="ghost"
                  className="w-full text-destructive"
                  onClick={clearLocationFilter}
                >
                  Effacer le filtre de localisation
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
