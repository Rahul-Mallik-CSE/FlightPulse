import { Text, View } from '@react-pdf/renderer'
import { Flight } from '@/types/FlightTypes'
import { formatFlightDate } from '../ticketShared'
import { ticketPdfStyles } from './ticketPdfStyles'

type PdfTripSummaryProps = {
  flight: Flight
  passengerName: string
  bookingRef: string
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={ticketPdfStyles.metaCard}>
      <Text style={ticketPdfStyles.metaLabel}>{label}</Text>
      <Text style={ticketPdfStyles.metaValue}>{value}</Text>
    </View>
  )
}

export default function PdfTripSummary({ flight, passengerName, bookingRef }: PdfTripSummaryProps) {
  return (
    <View style={ticketPdfStyles.section}>
      <View style={ticketPdfStyles.banner}>
        <Text style={ticketPdfStyles.bannerLabel}>Booking Confirmed</Text>
        <Text style={ticketPdfStyles.bannerText}>Passenger: {passengerName}</Text>
        <Text style={ticketPdfStyles.bannerText}>Booking Ref: {bookingRef}</Text>
      </View>

      <View style={ticketPdfStyles.metaGrid}>
        <MetaCard label="From" value={flight.departureAirport.city} />
        <MetaCard label="To" value={flight.arrivalAirport.city} />
        <MetaCard label="Date" value={formatFlightDate(flight.date)} />
        <MetaCard label="Cabin" value={flight.cabin} />
        <MetaCard label="Airline" value={flight.airline} />
        <MetaCard label="Flight" value={flight.flightNumber} />
      </View>
    </View>
  )
}
