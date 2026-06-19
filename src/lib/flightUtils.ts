import { Flight, FlightFilters, SortOption } from '@/types/FlightTypes'

/** Convert "6h 45m" → total minutes */
export function durationToMinutes(duration: string): number {
  const match = duration.match(/(\d+)h\s*(\d+)m/)
  if (!match) return 0
  return parseInt(match[1]) * 60 + parseInt(match[2])
}

/** Convert "HH:MM" → minutes from midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** Format minutes → "Xh Ym" */
export function minutesToDuration(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

/** Get stops label */
export function getStopsLabel(stops: number, stopCity?: string): string {
  if (stops === 0) return 'Non-stop'
  if (stops === 1) return stopCity ? `1 Stop, ${stopCity}` : '1 Stop'
  return `${stops} Stops`
}

/** Get rating label */
export function getRatingLabel(rating: number): string {
  if (rating >= 9) return 'Outstanding'
  if (rating >= 8.5) return 'Excellent'
  if (rating >= 8) return 'Very Good'
  if (rating >= 7) return 'Good'
  return 'Fair'
}

/** Apply all filters to a list of flights */
export function applyFlightFilters(flights: Flight[], filters: FlightFilters): Flight[] {
  return flights.filter((f) => {
    // Price range
    if (f.price < filters.minPrice || f.price > filters.maxPrice) return false

    // Airlines
    if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) return false

    // Stops
    if (filters.stops.length > 0 && !filters.stops.includes(f.stops)) return false

    // Cabins
    if (filters.cabins.length > 0 && !filters.cabins.includes(f.cabin)) return false

    // Departure time
    const departMins = timeToMinutes(f.depart)
    if (departMins < filters.minDepartTime || departMins > filters.maxDepartTime) return false

    // Duration
    if (filters.maxDuration < 1440) {
      const durationMins = durationToMinutes(f.duration)
      if (durationMins > filters.maxDuration) return false
    }

    // Passenger rating
    if (filters.passengerRating === 'outstanding' && f.rating < 9) return false
    if (filters.passengerRating === 'excellent' && f.rating < 8.5) return false
    if (filters.passengerRating === 'veryGood' && f.rating < 8) return false
    if (filters.passengerRating === 'good' && f.rating < 7) return false

    // Refundable only
    if (filters.refundableOnly && !f.refundable) return false

    return true
  })
}

/** Sort flights */
export function sortFlights(flights: Flight[], sort: SortOption): Flight[] {
  const sorted = [...flights]
  switch (sort) {
    case 'cheapest':
      return sorted.sort((a, b) => a.price - b.price)
    case 'fastest':
      return sorted.sort((a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration))
    case 'earliest':
      return sorted.sort((a, b) => timeToMinutes(a.depart) - timeToMinutes(b.depart))
    case 'latest':
      return sorted.sort((a, b) => timeToMinutes(b.depart) - timeToMinutes(a.depart))
    default:
      return sorted
  }
}

/** Get unique airlines from a list */
export function getUniqueAirlines(flights: Flight[]): string[] {
  return [...new Set(flights.map((f) => f.airline))].sort()
}

/** Get price range from a list */
export function getPriceRange(flights: Flight[]): { min: number; max: number } {
  if (flights.length === 0) return { min: 0, max: 1000 }
  const prices = flights.map((f) => f.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/** Format price with $ */
export function formatPrice(price: number): string {
  return `$${price}`
}

/** Airline color mapping */
export const airlineColors: Record<string, string> = {
  'Skyway': '#07689f',
  'Nova Airlines': '#e53e3e',
  'Azure Air': '#2d7dd2',
  'Orbit Air': '#38a169',
}

export function getAirlineColor(airline: string): string {
  return airlineColors[airline] || '#07689f'
}

/** Default filter state */
export function getDefaultFilters(flights: Flight[]): FlightFilters {
  const { min, max } = getPriceRange(flights)
  return {
    airlines: [],
    stops: [],
    cabins: [],
    minPrice: min,
    maxPrice: max,
    minDepartTime: 0,
    maxDepartTime: 1439,
    maxDuration: 1440,
    passengerRating: 'any',
    refundableOnly: false,
    vipOnly: false,
    childrenIncluded: false,
  }
}

/** Debounce function */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
