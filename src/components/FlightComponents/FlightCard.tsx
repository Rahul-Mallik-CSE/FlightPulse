'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plane, Luggage, Leaf } from 'lucide-react'
import { Flight } from '@/types/FlightTypes'
import { getStopsLabel, getAirlineColor } from '@/lib/flightUtils'

interface FlightCardProps {
  flight: Flight
}

export default function FlightCard({ flight }: FlightCardProps) {
  const airlineColor = getAirlineColor(flight.airline)
  const stopsLabel = getStopsLabel(flight.stops, flight.stopCity)

  return (
    <article className="bg-card border border-card-border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Airline image */}
        <div className="relative w-full sm:w-52 h-36 sm:h-auto shrink-0 overflow-hidden">
          <Image
            src={flight.imageUrl}
            alt={`${flight.airline} flight`}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 hover:scale-105"
          />
          {/* Airline name overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <span className="text-white text-xs font-semibold">{flight.airline}</span>
          </div>
          {/* Vacant seats badge */}
          {flight.vacantSeats <= 10 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {flight.vacantSeats} left!
            </div>
          )}
        </div>

        {/* Flight info */}
        <div className="flex-1 p-4">
          {/* Top row: From / Route / To */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 mb-3">
            {/* From */}
            <div>
              <p className="text-xs text-secondary mb-0.5">From</p>
              <p className="font-bold text-theme text-base">{flight.departureAirport.city}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-foreground">{flight.depart}</span>
                <span className="text-xs text-secondary">PM</span>
              </div>
              <p className="text-xs text-secondary mt-0.5">Departure</p>
              <div className="flex items-center gap-1 mt-1">
                <Plane className="w-3 h-3 text-secondary" />
                <span className="text-xs text-secondary">
                  {flight.departureAirport.code} {flight.departureAirport.name}
                </span>
              </div>
            </div>

            {/* Center: duration + stops */}
            <div className="flex flex-col items-center gap-1 pt-5 px-2">
              <p className="text-xs text-secondary whitespace-nowrap">
                Trip Duration · {flight.duration}
              </p>
              <div className="flex items-center gap-1 w-full my-1">
                <div className="h-px flex-1 bg-border" />
                <Plane className="w-4 h-4 text-theme rotate-90" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <p
                className="text-xs font-medium"
                style={{ color: flight.stops === 0 ? '#38a169' : airlineColor }}
              >
                {stopsLabel}
              </p>
            </div>

            {/* To */}
            <div className="text-right">
              <p className="text-xs text-secondary mb-0.5">To</p>
              <p className="font-bold text-theme text-base">{flight.arrivalAirport.city}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-xl font-bold text-foreground">{flight.arrive}</span>
                <span className="text-xs text-secondary">AM</span>
              </div>
              <p className="text-xs text-secondary mt-0.5">Landing</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <Plane className="w-3 h-3 text-secondary" />
                <span className="text-xs text-secondary">
                  {flight.arrivalAirport.code} {flight.arrivalAirport.name}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-card-border my-3" />

          {/* Bottom row: price + extras + button */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {/* Price */}
              <div>
                <span className="text-2xl font-bold text-theme">${flight.price}</span>
                {flight.vacantSeats > 0 && (
                  <span className="ml-2 text-xs text-green-600 font-medium">
                    {flight.vacantSeats} Vacant Seats
                  </span>
                )}
              </div>

              {/* CO2 */}
              <div className="flex items-center gap-1 text-green-600">
                <Leaf className="w-3.5 h-3.5" />
                <span className="text-xs">{flight.co2}</span>
              </div>
            </div>

            {/* Bag info */}
            <div className="flex items-center gap-1 text-secondary">
              <Luggage className="w-3.5 h-3.5" />
              <span className="text-xs">{flight.bag}</span>
            </div>

            {/* View detail button */}
            <Link
              href={`/flight/${flight.id}`}
              className="inline-flex items-center gap-2 px-5 py-2 bg-theme text-white text-sm font-semibold rounded-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              View Detail
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
