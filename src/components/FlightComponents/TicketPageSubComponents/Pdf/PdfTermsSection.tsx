import { Text, View } from '@react-pdf/renderer'
import { ticketPdfStyles } from './ticketPdfStyles'

function Bullet({ children }: { children: string }) {
  return (
    <View style={ticketPdfStyles.bulletRow}>
      <Text style={ticketPdfStyles.bullet}>•</Text>
      <Text style={ticketPdfStyles.bulletText}>{children}</Text>
    </View>
  )
}

export default function PdfTermsSection() {
  return (
    <View style={ticketPdfStyles.section}>
      <Text style={ticketPdfStyles.termsTitle}>Terms and Conditions</Text>

      <Text style={ticketPdfStyles.termsSectionTitle}>Payments</Text>
      <Bullet>
        If You Are Purchasing Your Ticket Using A Debit Or Credit Card Via The Website, We Will Process These
        Payments Via The Automated Secure Common Payment Gateway.
      </Bullet>
      <Bullet>
        If You Do Not Supply The Correct Card Billing Address Or Cardholder Information, Your Booking May Not Be
        Confirmed.
      </Bullet>

      <View style={{ height: 8 }} />

      <Text style={ticketPdfStyles.termsSectionTitle}>Passenger Information</Text>
      <Bullet>
        All Passengers Must Carry Valid Government-Issued Photo Identification. International Passengers Must
        Present A Valid Passport With At Least 6 Months Validity Beyond The Intended Stay.
      </Bullet>
      <Bullet>
        Please Arrive At The Airport At Least 2 Hours Before Domestic Flights And 3 Hours Before International Flights.
      </Bullet>
    </View>
  )
}
