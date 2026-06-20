'use client'
import React, { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    X,
    Plane,
    Luggage,
    PawPrint,
    Share2,
    HelpCircle,
    ChevronLeft,
    Snowflake,
    Star,
} from 'lucide-react'
import { Flight } from '@/types/FlightTypes'
import { getStopsLabel } from '@/lib/flightUtils'
import flightsData from '@/data/flights.json'

const ALL_FLIGHTS = flightsData as Flight[]

const getRouteCode = (seed: string, min: number, max: number) => {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
    }

    return min + (hash % (max - min + 1))
}

// Box3d is not available in lucide-react 1.x, use Cube instead
const CubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
)

export default function FlightDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const router = useRouter()
    const flight = ALL_FLIGHTS.find((f) => f.id === id) ?? null
    const notFound = !flight

    if (notFound) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
                <Plane className="w-16 h-16 text-secondary" />
                <h1 className="text-2xl font-bold text-foreground">Flight not found</h1>
                <p className="text-secondary">The flight you are looking for does not exist.</p>
                <Link href="/flight" className="px-6 py-2.5 bg-theme text-white rounded-sm font-semibold hover:bg-blue-700 transition-colors">
                    Back to Search
                </Link>
            </main>
        )
    }

    if (!flight) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 rounded-full border-4 border-muted border-t-theme animate-spin" />
            </main>
        )
    }

    const stopsLabel = getStopsLabel(flight.stops, flight.stopCity)
    const stopBetweenText = flight.stops > 0 ? `${flight.stops} Stop, ${flight.stopCity || '3h Between'}` : 'Non-stop'

    return (
        <main className="relative min-h-screen bg-gray-400 overflow-hidden">
            {/* Map-like background */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-300 via-gray-400 to-slate-500">
                {/* Grid lines to simulate map */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Back link */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium hover:bg-black/50 transition-colors cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to results
                </button>
            </div>

            {/* Modal card */}
            <div className="relative z-10 flex items-start justify-center px-4 py-8 min-h-[calc(100vh-5rem)]">
                <div className="bg-card w-full max-w-xl rounded-xl shadow-2xl overflow-hidden">
                    {/* Header bar */}
                    <div className="bg-theme px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">{stopBetweenText}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-white text-sm font-semibold">
                                Flight Duration · {flight.duration}
                            </span>
                            <button
                                onClick={() => router.back()}
                                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white cursor-pointer transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Hero image */}
                    <div className="relative w-full h-48">
                        <Image
                            src={flight.imageUrl}
                            alt={`${flight.airline} flight view`}
                            fill
                            sizes="600px"
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Airline info rows */}
                    <div className="border-b border-card-border">
                        <div className="flex items-center justify-between px-5 py-2 border-b border-card-border/50">
                            <span className="text-xs text-secondary">
                                First Flight No From {flight.departureAirport.city}{' '}
                                <span className="font-bold text-foreground">{flight.flightNumber}</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                    <Plane className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-semibold text-foreground">{flight.airline}</span>
                            </div>
                        </div>
                        {flight.secondFlightNumber && (
                            <div className="flex items-center justify-between px-5 py-2">
                                <span className="text-xs text-secondary">
                                    Second Flight No From {flight.stopCity || 'Rome'}{' '}
                                    <span className="font-bold text-foreground">{flight.secondFlightNumber}</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                                        <Plane className="w-3 h-3 text-white rotate-45" />
                                    </div>
                                    <span className="text-xs font-semibold text-foreground">{flight.secondAirline || flight.airline}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Route section */}
                    <div className="px-5 py-4">
                        {/* Airports */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
                            {/* Departure */}
                            <div>
                                <p className="text-2xl font-bold text-theme">{flight.departureAirport.code}</p>
                                <p className="text-sm font-semibold text-foreground">{flight.departureAirport.city}</p>
                                <p className="text-xs text-secondary">CET({flight.depart})</p>
                            </div>

                            {/* Stop badge */}
                            <div className="flex flex-col items-center gap-1">
                                {flight.stopCity && (
                                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                                        <span className="text-xs font-bold text-foreground text-center leading-tight">
                                            {flight.stopCity === 'Rome' ? 'FCO' :
                                                flight.stopCity === 'Chicago' ? 'ORD' :
                                                    flight.stopCity === 'Dallas' ? 'DFW' :
                                                        flight.stopCity?.slice(0, 3).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                {!flight.stopCity && (
                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                                        <Plane className="w-4 h-4 text-theme" />
                                    </div>
                                )}
                            </div>

                            {/* Arrival */}
                            <div className="text-right">
                                <p className="text-2xl font-bold text-theme">{flight.arrivalAirport.code}</p>
                                <p className="text-sm font-semibold text-foreground">{flight.arrivalAirport.city}</p>
                                <p className="text-xs text-secondary">CET({flight.arrive})</p>
                            </div>
                        </div>

                        {/* Gates row */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-3">
                            <div>
                                <p className="text-xs text-secondary">Gate</p>
                                <p className="text-3xl font-bold text-foreground">{flight.departureAirport.gate}</p>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                {flight.stopCity && (
                                    <div className="text-center">
                                        <p className="text-xs text-secondary">
                                            CET({flight.depart === '12:00' ? '18:00' : flight.depart})
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">{flight.stopCity}</p>
                                        <p className="text-xs text-secondary">
                                            CET({flight.arrive === '15:20' ? '20:00' : flight.arrive})
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-secondary">Gate</p>
                                <p className="text-3xl font-bold text-foreground">{flight.arrivalAirport.gate}</p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="relative my-3 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-theme to-blue-400 rounded-full"
                                    style={{ width: flight.stops > 0 ? '60%' : '100%' }}
                                />
                            </div>
                            <Plane className="w-5 h-5 text-theme" />
                        </div>

                        {/* Route details */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-muted rounded-md p-2.5 text-xs">
                                <p className="font-semibold text-foreground">
                                    {flight.departureAirport.code} · Entrance {flight.departureAirport.terminal} — Gate {flight.departureAirport.gate}
                                </p>
                                <p className="text-theme mt-0.5">+{getRouteCode(`${flight.id}-departure`, 400000, 499999)}</p>
                            </div>
                            <div className="bg-muted rounded-md p-2.5 text-xs">
                                {flight.stops > 0 ? (
                                    <>
                                        <p className="font-semibold text-foreground">
                                            {flight.arrivalAirport.code} · Exit L
                                        </p>
                                        <p className="text-theme mt-0.5">+{getRouteCode(`${flight.id}-arrival-stop`, 800000, 899999)}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-foreground">
                                            {flight.arrivalAirport.code} · Gate {flight.arrivalAirport.gate}
                                        </p>
                                        <p className="text-theme mt-0.5">+{getRouteCode(`${flight.id}-arrival-direct`, 300000, 399999)}</p>
                                    </>
                                )}
                            </div>

                            {flight.stops > 0 && (
                                <>
                                    <div className="bg-muted rounded-md p-2.5 text-xs">
                                        <p className="font-semibold text-foreground">
                                            {flight.departureAirport.code} — Gate {flight.arrivalAirport.gate}
                                        </p>
                                        <p className="text-theme mt-0.5">+{getRouteCode(`${flight.id}-transfer`, 390000, 489999)}</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-100 rounded-md p-2.5 text-xs">
                                        <p className="font-semibold text-foreground">
                                            {stopsLabel}
                                        </p>
                                        <p className="text-red-500 mt-0.5 text-xs">It is Not Possible To Exit The Airport</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Amenities row */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-secondary">
                            {/* City stops */}
                            <div className="flex items-center gap-1">
                                <Snowflake className="w-3.5 h-3.5 text-theme" />
                                <span>{flight.stops > 0 ? `-${flight.stops} · ${flight.stopCity || 'Stop'}` : `· ${flight.departureAirport.city}`}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Snowflake className="w-3.5 h-3.5 text-blue-400" />
                                <span>{flight.stops > 0 ? `2 · ${flight.stopCity}` : `· Direct`}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Snowflake className="w-3.5 h-3.5 text-green-400" />
                                <span>{`· ${flight.arrivalAirport.city}`}</span>
                            </div>

                            {/* Baggage */}
                            <div className="flex items-center gap-1">
                                <Luggage className="w-3.5 h-3.5" />
                                <span>{flight.baggageWeight}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Luggage className="w-3.5 h-3.5" />
                                <span>{flight.baggageWeight}</span>
                            </div>
                            <div />

                            {/* Pet allowed */}
                            <div className="flex items-center gap-1">
                                <PawPrint className="w-3.5 h-3.5" />
                                <span>{flight.petAllowed ? 'Pet Allowed' : 'No Pets'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <PawPrint className="w-3.5 h-3.5" />
                                <span>{flight.petAllowed ? 'Pet Allowed' : 'No Pets'}</span>
                            </div>
                        </div>

                        {/* Price and payment */}
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <p className="text-3xl font-bold text-theme">${flight.price}</p>
                                <p className="text-xs text-secondary mt-0.5">Taxes included</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Payment logos */}
                                <div className="flex items-center gap-2 opacity-80">
                                    <div className="w-10 h-6 bg-[#EB001B] rounded-sm relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute w-6 h-6 rounded-full bg-[#F79E1B] right-1" />
                                        <div className="absolute w-6 h-6 rounded-full bg-[#EB001B] left-1" />
                                        <div className="absolute w-4 h-4 rounded-full bg-[#FF5F00] z-10" />
                                    </div>
                                    <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-sm italic">VISA</div>
                                    <div className="bg-blue-800 text-white text-xs font-bold px-1 py-1 rounded-sm leading-tight text-center">
                                        <span className="text-blue-300">Amex</span>
                                    </div>
                                    <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-sm italic">Pay<span className="text-blue-200">Pal</span></div>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-secondary text-right mb-4">Transactions Are Encrypted By EasyTravio</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-foreground">{flight.rating}</span>
                            <span className="text-xs text-secondary">({flight.reviewCount.toLocaleString()} reviews)</span>
                        </div>

                        {/* Action footer */}
                        <div className="flex items-center gap-3 border-t border-card-border pt-4">
                            <button className="flex flex-col items-center gap-0.5 text-xs text-secondary hover:text-theme transition-colors cursor-pointer">
                                <CubeIcon className="w-5 h-5" />
                                3d View
                            </button>
                            <button
                                onClick={() => navigator.share?.({ title: `Flight ${flight.flightNumber}`, url: window.location.href }).catch(() => { })}
                                className="flex flex-col items-center gap-0.5 text-xs text-secondary hover:text-theme transition-colors cursor-pointer"
                            >
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                            <button className="flex flex-col items-center gap-0.5 text-xs text-secondary hover:text-theme transition-colors cursor-pointer">
                                <HelpCircle className="w-5 h-5" />
                                Help
                            </button>
                            <Link
                                href={`/flight/book/${flight.id}`}
                                className="flex-1 bg-theme text-white text-center py-2.5 rounded-sm text-sm font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors"
                            >
                                Purchase The Flight
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
