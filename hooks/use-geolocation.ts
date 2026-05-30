"use client"

import { useState, useEffect, useCallback } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  city: string | null
  region: string | null
  error: string | null
  loading: boolean
  permissionStatus: PermissionState | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: null,
    region: null,
    error: null,
    loading: false,
    permissionStatus: null,
  })

  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

  // Vérifier le statut de la permission
  const checkPermission = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      return null
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" as PermissionName })
      setState((prev) => ({ ...prev, permissionStatus: result.state }))
      
      if (result.state === "granted") {
        setPermissionGranted(true)
      } else if (result.state === "denied") {
        setPermissionGranted(false)
      }
      
      return result.state
    } catch {
      return null
    }
  }, [])

  // Demander la géolocalisation avec confirmation
  const requestLocation = useCallback(async (): Promise<boolean> => {
    // Vérifier d'abord si déjà accordé
    const status = await checkPermission()
    
    if (status === "granted") {
      setPermissionGranted(true)
      return true
    }

    // Demander confirmation à l'utilisateur
    const userConfirmed = window.confirm(
      "ɖyɔ̌ souhaite accéder à votre position pour vous montrer des annonces près de chez vous.\n\nAcceptez-vous de partager votre localisation ?"
    )

    if (!userConfirmed) {
      setState((prev) => ({ 
        ...prev, 
        error: "Permission refusée. Vous pouvez toujours rechercher par ville manuellement." 
      }))
      setPermissionGranted(false)
      return false
    }

    // Lancer la géolocalisation
    setState((prev) => ({ ...prev, loading: true, error: null }))

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: "La géolocalisation n'est pas supportée par votre navigateur." 
        }))
        setPermissionGranted(false)
        resolve(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // Reverse geocoding pour obtenir la ville
          let city = null
          let region = null
          
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
            )
            const data = await response.json()
            city = data.city || data.locality || data.principalSubdivision
            region = data.principalSubdivision
          } catch {
            // Si le reverse geocoding échoue, on garde juste les coordonnées
          }

          setState({
            latitude,
            longitude,
            city,
            region,
            error: null,
            loading: false,
            permissionStatus: "granted",
          })
          setPermissionGranted(true)
          resolve(true)
        },
        (error) => {
          let errorMessage = "Impossible d'obtenir votre position."
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Vous avez refusé l'accès à votre position. Vous pouvez rechercher par ville manuellement."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Position indisponible. Vérifiez que la géolocalisation est activée sur votre appareil."
              break
            case error.TIMEOUT:
              errorMessage = "Délai d'attente dépassé. Veuillez réessayer."
              break
          }

          setState((prev) => ({ 
            ...prev, 
            loading: false, 
            error: errorMessage 
          }))
          setPermissionGranted(false)
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        }
      )
    })
  }, [checkPermission])

  // Calculer la distance entre deux points (en km)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  // Vérifier la permission au montage
  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  return {
    ...state,
    permissionGranted,
    requestLocation,
    calculateDistance,
    checkPermission,
  }
}

export type { GeolocationState }
