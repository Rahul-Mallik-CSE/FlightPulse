'use client'

import Link from 'next/link'
import { ArrowRight, Plane } from 'lucide-react'
import { TicketRow } from '@/types/FlightTypes'
import AirlineBadge from './AirlineBadge'
import QRCode from './QRCode'
import LinearBarcode from './LinearBarcode'

type TicketRowsTableProps = {
  rows: TicketRow[]
  flightId: string
  bookingRef: string
  passengerName: string
  hasStop: boolean
}

export default function TicketRowsTable({ rows, flightId, bookingRef, passengerName, hasStop }: TicketRowsTableProps) {
  return (
    <div className="flex">
      <div className="flex-1 min-w-0 overflow-x-auto">
        <div className="grid grid-cols-[2fr_2.2fr_2.2fr_1fr] text-xs font-semibold bg-slate-100 text-slate-600 border-b border-card-border">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-card-border">
            <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center">
              <Plane className="w-3 h-3 text-white" />
            </div>
            Flight
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-card-border">
            <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center">
              <Plane className="w-3 h-3 text-white rotate-90" />
            </div>
            From
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-card-border">
            <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center">
              <Plane className="w-3 h-3 text-white -rotate-45" />
            </div>
            To
          </div>
          <div className="px-4 py-2.5">Duration</div>
        </div>

        {rows.map((row, index) => {
          if (row.type === 'stop') {
            return (
              <div key={index} className="grid grid-cols-[2fr_2.2fr_2.2fr_1fr] text-xs border-b border-card-border bg-slate-50/60">
                <div className="px-4 py-3 border-r border-card-border flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="font-semibold text-slate-600">One Stop</span>
                </div>
                <div className="px-4 py-3 border-r border-card-border col-span-2">
                  <p className="text-theme font-medium hover:underline cursor-pointer">Layovers &amp; Connecting Flights For {row.stopCity}</p>
                  <p className="text-secondary mt-0.5">
                    {row.stopAirport}.{' '}
                    <Link href={`/flight/${flightId}`} className="text-theme hover:underline">
                      See More...
                    </Link>
                  </p>
                </div>
                <div className="px-4 py-3 font-bold text-slate-700">{row.layover}</div>
              </div>
            )
          }

          return (
            <div key={index} className={`grid grid-cols-[2fr_2.2fr_2.2fr_1fr] text-xs border-b border-card-border last:border-0 ${index === 0 ? '' : 'bg-white'}`}>
              <div className="px-4 py-4 border-r border-card-border">
                <div className="flex items-center gap-2 mb-1">
                  <AirlineBadge name={row.airline} />
                  <span className="font-bold text-foreground text-sm">{row.airline}</span>
                </div>
                <p className="text-secondary font-semibold ml-12">{row.flightNumber}</p>
                <p className="text-theme ml-12">{row.cabin}</p>
              </div>

              <div className="px-4 py-4 border-r border-card-border">
                <p className="text-theme font-bold text-sm">{row.fromTime}</p>
                <p className="text-theme text-[11px] mb-1">{row.fromDate}</p>
                <p className="font-bold text-foreground">
                  {row.fromCity}
                  {row.fromCountry ? `(${row.fromCountry.split(' ').pop()})` : ''}
                </p>
                <p className="text-secondary mt-0.5">
                  {row.fromAirport} ({row.fromCode})
                </p>
              </div>

              <div className="px-4 py-4 border-r border-card-border">
                <p className="text-theme font-bold text-sm">{row.toTime}</p>
                <p className="text-theme text-[11px] mb-1">{row.toDate}</p>
                <p className="font-bold text-foreground">
                  {row.toCity}
                  {row.toCountry ? `(${row.toCountry.split(' ').pop()})` : ''}
                </p>
                <p className="text-secondary mt-0.5">
                  {row.toAirport} ({row.toCode})
                </p>
              </div>

              <div className="px-4 py-4 flex items-center font-bold text-foreground">{row.duration}</div>
            </div>
          )
        })}
      </div>

      <div className="w-20 shrink-0 border-l-2 border-dashed border-slate-300 flex flex-col items-center py-4 gap-3 bg-white">
        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Bar Code</p>
        <QRCode value={bookingRef + flightId} size={62} />
        <div className="border-t border-dashed border-slate-300 w-full my-1" />
        <LinearBarcode value={bookingRef + flightId + passengerName} w={18} h={hasStop ? 140 : 90} />
      </div>
    </div>
  )
}
