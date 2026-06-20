'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Flight } from '@/types/FlightTypes'
import flightsData from '@/data/flights.json'
import TicketActions from './TicketPageSubComponents/TicketActions'
import TicketBanner from './TicketPageSubComponents/TicketBanner'
import TicketCardHeader from './TicketPageSubComponents/TicketCardHeader'
import TicketNotFoundState from './TicketPageSubComponents/TicketNotFoundState'
import TicketRowsTable from './TicketPageSubComponents/TicketRowsTable'
import TicketTerms from './TicketPageSubComponents/TicketTerms'
import { buildTicketRows } from './TicketPageSubComponents/ticketShared'

const ALL_FLIGHTS = flightsData as Flight[]

export default function DigitalTicketContent() {
  const params = useParams()
  const searchParams = useSearchParams()

  const id = (params.id as string) || ''
  const passengerName = searchParams.get('name') || 'Anna Carinna'
  const email = searchParams.get('email') || ''
  const bookingRef = searchParams.get('ref') || 'EX1234'

  const flight = ALL_FLIGHTS.find((candidate) => candidate.id === id) || null

  if (!flight) {
    return <TicketNotFoundState />
  }

  const activeFlight = flight
  const rows = buildTicketRows(activeFlight)
  const hasStop = activeFlight.stops > 0

  async function createTicketPdfUrl() {
    const [{ pdf }, { default: TicketPdfDocument }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./TicketPageSubComponents/Pdf/TicketPdfDocument'),
    ])

    const blob = await pdf(
      <TicketPdfDocument
        flight={activeFlight}
        rows={rows}
        passengerName={passengerName}
        bookingRef={bookingRef}
        email={email}
      />
    ).toBlob()

    return URL.createObjectURL(blob)
  }

  async function handleDownloadPdf() {
    const pdfUrl = await createTicketPdfUrl()
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `flightpulse-ticket-${bookingRef}.pdf`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 1500)
  }

  async function handlePrintPdf() {
    const pdfUrl = await createTicketPdfUrl()
    const pdfWindow = window.open(pdfUrl, '_blank')

    if (!pdfWindow) {
      URL.revokeObjectURL(pdfUrl)
      return
    }

    window.setTimeout(() => {
      pdfWindow.focus()
      pdfWindow.print()
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 2000)
    }, 700)
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TicketBanner bookingRef={bookingRef} email={email} onPrint={handlePrintPdf} onDownload={handleDownloadPdf} />

        <div className="bg-card border border-card-border rounded-lg shadow-sm mb-8" id="print-ticket">
          <TicketCardHeader passengerName={passengerName} bookingRef={bookingRef} flight={activeFlight} />
          <TicketRowsTable
            rows={rows}
            flightId={activeFlight.id}
            bookingRef={bookingRef}
            passengerName={passengerName}
            hasStop={hasStop}
          />
        </div>

        <TicketTerms />

        <TicketActions onPrint={handlePrintPdf} onDownload={handleDownloadPdf} />
      </div>
    </div>
  )
}
