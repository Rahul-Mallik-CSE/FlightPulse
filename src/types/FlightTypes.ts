export type AirportInfo = {
  code: string
  name: string
  city: string
  terminal?: string
  gate?: string
}

export type Flight = {
  id: string
  airline: string
  flightNumber: string
  origin: string
  destination: string
  date: string
  depart: string
  arrive: string
  duration: string
  stops: number
  stopCity?: string
  price: number
  cabin: string
  aircraft: string
  bag: string
  refundable: boolean
  // Enriched fields
  imageUrl: string
  departureAirport: AirportInfo
  arrivalAirport: AirportInfo
  gate: string
  arrivalGate: string
  vacantSeats: number
  co2: string
  rating: number
  reviewCount: number
  baggageWeight: string
  petAllowed: boolean
  secondFlightNumber?: string
  secondAirline?: string
}

export type FlightSearchInputs = {
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
  tripType: 'one-way' | 'round-trip'
}

export type FlightFilters = {
  airlines: string[]
  stops: number[]
  cabins: string[]
  minPrice: number
  maxPrice: number
  minDepartTime: number  // minutes from midnight
  maxDepartTime: number
  maxDuration: number    // minutes
  passengerRating: string
  refundableOnly: boolean
  vipOnly: boolean
  childrenIncluded: boolean
}

export type SortOption = 'cheapest' | 'fastest' | 'earliest' | 'latest'

export type BookingFormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  cardNumber: string
  cvc: string
  expDate: string
  bookingForWork: boolean
  paymentMethod: 'paypal' | 'visa' | 'mastercard' | 'amex'
}

export type PassengerCount = {
  adults: number
  children: number
  infants: number
}

export type BookingInfo = {
  fullName: string
  email: string
  phone: string
}


/* ─────────────────────── Ticket row types ─────────────────────── */
export type FlightLeg = {
  type: 'leg'
  airline: string
  flightNumber: string
  cabin: string
  fromCode: string
  fromCity: string
  fromCountry: string
  fromAirport: string
  fromTime: string
  fromDate: string
  toCode: string
  toCity: string
  toCountry: string
  toAirport: string
  toTime: string
  toDate: string
  duration: string
}

export type StopRow = {
  type: 'stop'
  stopCity: string
  stopAirport: string
  layover: string
}

export type TicketRow = FlightLeg | StopRow
