import { Flight, TicketRow } from '@/types/FlightTypes'
import { durationToMinutes, minutesToDuration } from '@/lib/flightUtils'

export const AIRLINE_COLORS: Record<string, string> = {
  Skyway: '#07689f',
  'Nova Airlines': '#e53e3e',
  'Azure Air': '#2d7dd2',
  'Orbit Air': '#38a169',
}

export const CITY_COUNTRY: Record<string, string> = {
  'New York': 'United States',
  'Los Angeles': 'United States',
  Chicago: 'United States',
  Miami: 'United States',
  Dallas: 'United States',
  London: 'United Kingdom',
  Paris: 'France',
  Dubai: 'United Arab Emirates',
  Tokyo: 'Japan',
  Singapore: 'Singapore',
  Istanbul: 'Turkey',
  Doha: 'Qatar',
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const displayH = h % 12 || 12
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

export function formatFlightDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const nextHour = Math.floor(total / 60) % 24
  const nextMinute = total % 60
  return `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`
}

export function buildTicketRows(flight: Flight): TicketRow[] {
  const totalMins = durationToMinutes(flight.duration)
  const hasStop = flight.stops > 0
  const layoverMins = 165
  const leg1DurationMins = hasStop ? Math.round((totalMins - layoverMins) * 0.42) : totalMins
  const leg2DurationMins = hasStop ? totalMins - layoverMins - leg1DurationMins : 0

  const leg1Arrival = addMinutes(flight.depart, leg1DurationMins)
  const leg2Depart = addMinutes(leg1Arrival, layoverMins)

  const rows: TicketRow[] = [
    {
      type: 'leg',
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      cabin: flight.cabin,
      fromCode: flight.departureAirport.code,
      fromCity: flight.departureAirport.city,
      fromCountry: CITY_COUNTRY[flight.departureAirport.city] || '',
      fromAirport: flight.departureAirport.name,
      fromTime: formatTime(flight.depart),
      fromDate: formatFlightDate(flight.date),
      toCode: hasStop ? (flight.stopCity || '').slice(0, 3).toUpperCase() : flight.arrivalAirport.code,
      toCity: hasStop ? (flight.stopCity || '') : flight.arrivalAirport.city,
      toCountry: hasStop ? CITY_COUNTRY[flight.stopCity || ''] || '' : CITY_COUNTRY[flight.arrivalAirport.city] || '',
      toAirport: hasStop ? `${flight.stopCity} Airport` : flight.arrivalAirport.name,
      toTime: formatTime(leg1Arrival),
      toDate: formatFlightDate(flight.date),
      duration: minutesToDuration(leg1DurationMins),
    },
  ]

  if (hasStop) {
    rows.push({
      type: 'stop',
      stopCity: flight.stopCity || '',
      stopAirport: `${flight.stopCity} International Airport`,
      layover: minutesToDuration(layoverMins),
    })

    rows.push({
      type: 'leg',
      airline: flight.secondAirline || flight.airline,
      flightNumber: flight.secondFlightNumber || `${flight.flightNumber}B`,
      cabin: flight.cabin,
      fromCode: (flight.stopCity || '').slice(0, 3).toUpperCase(),
      fromCity: flight.stopCity || '',
      fromCountry: CITY_COUNTRY[flight.stopCity || ''] || '',
      fromAirport: `${flight.stopCity} Airport`,
      fromTime: formatTime(leg2Depart),
      fromDate: formatFlightDate(flight.date),
      toCode: flight.arrivalAirport.code,
      toCity: flight.arrivalAirport.city,
      toCountry: CITY_COUNTRY[flight.arrivalAirport.city] || '',
      toAirport: flight.arrivalAirport.name,
      toTime: formatTime(flight.arrive),
      toDate: formatFlightDate(flight.date),
      duration: minutesToDuration(leg2DurationMins),
    })
  }

  return rows
}
