// Simple geocoding utility for Benin cities
// In production, you might want to use a proper geocoding API like Google Maps, Mapbox, or Nominatim

interface CityCoordinates {
  latitude: number
  longitude: number
}

// Coordinates for major cities in Benin
const BENIN_CITIES: Record<string, CityCoordinates> = {
  "cotonou": { latitude: 6.365, longitude: 2.418 },
  "abomey-calavi": { latitude: 6.497, longitude: 2.609 },
  "calavi": { latitude: 6.496, longitude: 2.629 },
  "parakou": { latitude: 9.339, longitude: 2.620 },
  "porto-novo": { latitude: 6.497, longitude: 2.607 },
  "porto novo": { latitude: 6.497, longitude: 2.607 },
  "ouidah": { latitude: 6.366, longitude: 2.450 },
  "lokossa": { latitude: 7.182, longitude: 1.991 },
  "natitingou": { latitude: 10.291, longitude: 1.379 },
  "savalou": { latitude: 8.030, longitude: 2.490 },
  "abomey": { latitude: 7.200, longitude: 2.066 },
  "djougou": { latitude: 9.708, longitude: 1.665 },
  "bohicon": { latitude: 7.178, longitude: 2.067 },
  "kandi": { latitude: 11.134, longitude: 2.938 },
  "malanville": { latitude: 11.868, longitude: 3.253 },
  "tanguieta": { latitude: 10.622, longitude: 1.266 },
}

export function getCityCoordinates(cityName: string): CityCoordinates | null {
  if (!cityName) return null

  const normalizedCity = cityName.toLowerCase().trim()

  // Direct match
  if (BENIN_CITIES[normalizedCity]) {
    return BENIN_CITIES[normalizedCity]
  }

  // Partial match (e.g., "Cotonou, Bénin" should match "cotonou")
  for (const [city, coords] of Object.entries(BENIN_CITIES)) {
    if (normalizedCity.includes(city)) {
      return coords
    }
  }

  return null
}

// Add some randomness to coordinates so multiple listings in the same city don't overlap perfectly
export function getRandomizedCityCoordinates(cityName: string): CityCoordinates | null {
  const baseCoords = getCityCoordinates(cityName)
  if (!baseCoords) return null

  // Add small random offset (about 0.5-1km)
  const offset = 0.005
  return {
    latitude: baseCoords.latitude + (Math.random() - 0.5) * offset,
    longitude: baseCoords.longitude + (Math.random() - 0.5) * offset,
  }
}
