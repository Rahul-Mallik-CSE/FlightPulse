'use client'

import { Flight } from '@/types/FlightTypes'
import { formatFlightDate } from './ticketShared'

type TicketCardHeaderProps = {
  passengerName: string
  bookingRef: string
  flight: Flight
}

export default function TicketCardHeader({ passengerName, bookingRef, flight }: TicketCardHeaderProps) {
  return (
    <>
      <div className="px-6 pt-5 pb-3 border-b border-card-border">
        <h1 className="text-xl font-bold text-foreground">Digital Ticket</h1>
        <p className="text-xs text-secondary mt-0.5">It Is Not Necessary To Print Your Ticket</p>
      </div>

      <div className="px-6 py-2 bg-muted/50 border-b border-card-border flex items-center gap-6 flex-wrap text-xs text-secondary">
        <span>Passenger: <strong className="text-foreground">{passengerName}</strong></span>
        <span>Booking Ref: <strong className="text-foreground font-mono tracking-widest">{bookingRef}</strong></span>
        <span>From: <strong className="text-foreground">{flight.departureAirport.city}</strong></span>
        <span>To: <strong className="text-foreground">{flight.arrivalAirport.city}</strong></span>
        <span>Date: <strong className="text-foreground">{formatFlightDate(flight.date)}</strong></span>
      </div>
    </>
  )
}
