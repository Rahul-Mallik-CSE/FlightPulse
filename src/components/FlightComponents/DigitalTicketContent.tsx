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

  const rows = buildTicketRows(flight)
  const hasStop = flight.stops > 0

  function handlePrint() {
    window.print()
  }

  function handleDownload() {
    window.print()
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TicketBanner bookingRef={bookingRef} email={email} onPrint={handlePrint} onDownload={handleDownload} />

        <div className="bg-card border border-card-border rounded-lg shadow-sm mb-8" id="print-ticket">
          <TicketCardHeader passengerName={passengerName} bookingRef={bookingRef} flight={flight} />
          <TicketRowsTable
            rows={rows}
            flightId={flight.id}
            bookingRef={bookingRef}
            passengerName={passengerName}
            hasStop={hasStop}
          />
        </div>

        <TicketTerms />

        <TicketActions onPrint={handlePrint} onDownload={handleDownload} />
      </div>
    </div>
  )
}
