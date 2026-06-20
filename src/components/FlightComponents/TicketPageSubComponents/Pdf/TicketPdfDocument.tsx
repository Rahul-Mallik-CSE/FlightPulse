import { Document, Page, Text, View } from '@react-pdf/renderer'
import { Flight, TicketRow } from '@/types/FlightTypes'
import { formatFlightDate } from '../ticketShared'
import PdfFlightRows from './PdfFlightRows'
import PdfSectionTitle from './PdfSectionTitle'
import PdfTermsSection from './PdfTermsSection'
import PdfTripSummary from './PdfTripSummary'
import { ticketPdfStyles } from './ticketPdfStyles'

type TicketPdfDocumentProps = {
  flight: Flight
  rows: TicketRow[]
  passengerName: string
  bookingRef: string
  email: string
}

export default function TicketPdfDocument({ flight, rows, passengerName, bookingRef, email }: TicketPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={ticketPdfStyles.page}>
        <View style={ticketPdfStyles.pageShell}>
          <View style={ticketPdfStyles.accentBar} />

          <PdfSectionTitle title="Digital Ticket" subtitle="It Is Not Necessary To Print Your Ticket" />

          <View style={[ticketPdfStyles.section, ticketPdfStyles.sectionBorder]}>
            <Text style={ticketPdfStyles.bannerLabel}>Booking Confirmed</Text>
            <Text style={ticketPdfStyles.bannerText}>Passenger: {passengerName}</Text>
            <Text style={ticketPdfStyles.bannerText}>Booking Ref: {bookingRef}</Text>
            {email ? <Text style={ticketPdfStyles.bannerText}>Sent To: {email}</Text> : null}
          </View>

          <PdfTripSummary flight={flight} passengerName={passengerName} bookingRef={bookingRef} />

          <View style={ticketPdfStyles.sectionBorder} />

          <PdfFlightRows rows={rows} />

          <View style={ticketPdfStyles.sectionBorder} />

          <PdfTermsSection />

          <Text style={ticketPdfStyles.footer}>
            Travel date: {formatFlightDate(flight.date)} · Booking reference {bookingRef}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
