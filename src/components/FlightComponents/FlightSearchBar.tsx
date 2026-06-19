'use client'
import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeftRight,
  Users,
  Calendar,
  ChevronDown,
  PlaneTakeoff,
  PlaneLanding,
  Search,
} from 'lucide-react'
import { FlightSearchInputs, PassengerCount } from '@/types/FlightTypes'


const POPULAR_ORIGINS = ['New York (NYC)', 'London (LHR)', 'Paris (CDG)', 'Tokyo (TYO)', 'Dubai (DXB)']
const POPULAR_DESTINATIONS = ['Los Angeles (LAX)', 'Miami (MIA)', 'Chicago (ORD)', 'Istanbul (IST)', 'Singapore (SIN)']
const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class']

interface FlightSearchBarProps {
  initialValues?: Partial<FlightSearchInputs>
  onSearch?: (inputs: FlightSearchInputs) => void
}

export default function FlightSearchBar({ initialValues, onSearch }: FlightSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [inputs, setInputs] = useState<FlightSearchInputs>({
    origin: initialValues?.origin || searchParams.get('origin') || 'New York (NYC)',
    destination: initialValues?.destination || searchParams.get('destination') || 'Los Angeles (LAX)',
    departDate: initialValues?.departDate || searchParams.get('date') || '2026-08-15',
    returnDate: initialValues?.returnDate || searchParams.get('returnDate') || '',
    passengers: initialValues?.passengers || Number(searchParams.get('passengers')) || 2,
    cabinClass: initialValues?.cabinClass || searchParams.get('cabin') || 'Economy',
    tripType: (initialValues?.tripType || searchParams.get('tripType') || 'one-way') as 'one-way' | 'round-trip',
  })

  const [passengers, setPassengers] = useState<PassengerCount>({
    adults: 2,
    children: 0,
    infants: 0,
  })

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false)
  const [showCabinDropdown, setShowCabinDropdown] = useState(false)
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestDropdown, setShowDestDropdown] = useState(false)
  const passengerRef = useRef<HTMLDivElement>(null)

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  function swapLocations() {
    setInputs((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }))
  }

  function handleSearch() {
    const params = new URLSearchParams({
      origin: inputs.origin,
      destination: inputs.destination,
      date: inputs.departDate,
      passengers: totalPassengers.toString(),
      cabin: inputs.cabinClass,
      tripType: inputs.tripType,
    })
    if (inputs.returnDate) params.set('returnDate', inputs.returnDate)

    if (onSearch) {
      onSearch({ ...inputs, passengers: totalPassengers })
    } else {
      router.push(`/flight?${params.toString()}`)
    }
  }

  function adjustPassenger(type: keyof PassengerCount, delta: number) {
    setPassengers((prev) => {
      const newVal = Math.max(0, prev[type] + delta)
      if (type === 'adults' && newVal < 1) return prev
      return { ...prev, [type]: newVal }
    })
  }

  const passengerLabel = `${passengers.adults} Adult${passengers.adults !== 1 ? 's' : ''}${passengers.children > 0 ? `, ${passengers.children} Child${passengers.children !== 1 ? 'ren' : ''}` : ''}${passengers.infants > 0 ? `, ${passengers.infants} Infant${passengers.infants !== 1 ? 's' : ''}` : ''}`

  return (
    <div className="w-full">
      {/* Hero heading */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          Which Exciting Place Is Your Next Adventure Taking You?
        </h1>
        <p className="text-sm text-theme mt-1">Discover Exclusive Genius Rewards Wherever Your Journey Takes You!</p>
      </div>

      {/* Search card */}
      <div className="bg-card border border-card-border rounded-lg shadow-sm p-4">
        {/* Trip type toggle */}
        <div className="flex items-center gap-2 mb-4">
          {(['one-way', 'round-trip'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setInputs((p) => ({ ...p, tripType: type }))}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${inputs.tripType === type
                  ? 'bg-theme text-white border-theme'
                  : 'bg-white text-secondary border-border hover:border-theme hover:text-theme'
                }`}
            >
              {type === 'one-way' ? 'One Way' : 'Round Trip'}
            </button>
          ))}
        </div>

        {/* Main search row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_1fr_auto] gap-3 items-end">
          {/* From */}
          <div className="relative">
            <label className="block text-xs text-secondary font-medium mb-1">From</label>
            <div className="relative">
              <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme" />
              <input
                type="text"
                value={inputs.origin}
                onChange={(e) => setInputs((p) => ({ ...p, origin: e.target.value }))}
                onFocus={() => setShowOriginDropdown(true)}
                onBlur={() => setTimeout(() => setShowOriginDropdown(false), 150)}
                placeholder="City or airport"
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-sm text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme"
              />
              {showOriginDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
                  {POPULAR_ORIGINS.filter((c) =>
                    c.toLowerCase().includes(inputs.origin.toLowerCase())
                  ).slice(0, 5).map((city) => (
                    <button
                      key={city}
                      onMouseDown={() => {
                        setInputs((p) => ({ ...p, origin: city }))
                        setShowOriginDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted text-foreground transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center items-end pb-0.5">
            <button
              onClick={swapLocations}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-theme text-theme hover:bg-theme hover:text-white transition-colors cursor-pointer"
              aria-label="Swap origin and destination"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-xs text-secondary font-medium mb-1">To</label>
            <div className="relative">
              <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme" />
              <input
                type="text"
                value={inputs.destination}
                onChange={(e) => setInputs((p) => ({ ...p, destination: e.target.value }))}
                onFocus={() => setShowDestDropdown(true)}
                onBlur={() => setTimeout(() => setShowDestDropdown(false), 150)}
                placeholder="City or airport"
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-sm text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme"
              />
              {showDestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
                  {POPULAR_DESTINATIONS.filter((c) =>
                    c.toLowerCase().includes(inputs.destination.toLowerCase())
                  ).slice(0, 5).map((city) => (
                    <button
                      key={city}
                      onMouseDown={() => {
                        setInputs((p) => ({ ...p, destination: city }))
                        setShowDestDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted text-foreground transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Passengers + Class */}
          <div className="relative" ref={passengerRef}>
            <label className="block text-xs text-secondary font-medium mb-1">Passengers · Class</label>
            <button
              onClick={() => {
                setShowPassengerDropdown((p) => !p)
                setShowCabinDropdown(false)
              }}
              className="w-full flex items-center justify-between pl-3 pr-2 py-2.5 border border-border rounded-sm text-sm text-foreground bg-background hover:border-theme focus:outline-none focus:ring-1 focus:ring-theme cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Users className="w-4 h-4 text-theme shrink-0" />
                <span className="truncate text-xs">{passengerLabel} · {inputs.cabinClass}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-secondary shrink-0" />
            </button>

            {showPassengerDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-xl z-50 p-4 min-w-72">
                {/* Passenger counts */}
                {(
                  [
                    { label: 'Adults', sub: 'Age 12+', key: 'adults' as const },
                    { label: 'Children', sub: 'Age 2–11', key: 'children' as const },
                    { label: 'Infants', sub: 'Under 2', key: 'infants' as const },
                  ]
                ).map(({ label, sub, key }) => (
                  <div key={key} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-secondary">{sub}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjustPassenger(key, -1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-lg font-medium text-foreground hover:border-theme hover:text-theme cursor-pointer transition-colors"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-semibold">{passengers[key]}</span>
                      <button
                        onClick={() => adjustPassenger(key, 1)}
                        className="w-8 h-8 rounded-full border border-theme bg-theme text-white flex items-center justify-center text-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {/* Cabin class */}
                <div className="mt-3">
                  <p className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wide">Cabin Class</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CABIN_CLASSES.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setInputs((p) => ({ ...p, cabinClass: cls }))}
                        className={`py-2 px-3 rounded-sm border text-xs font-medium cursor-pointer transition-colors ${inputs.cabinClass === cls
                            ? 'bg-theme text-white border-theme'
                            : 'border-border text-foreground hover:border-theme hover:text-theme'
                          }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowPassengerDropdown(false)}
                  className="mt-3 w-full py-2 bg-theme text-white rounded-sm text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Dates */}
          <div>
            <label className="block text-xs text-secondary font-medium mb-1">
              {inputs.tripType === 'round-trip' ? 'Departure · Return' : 'Departure Date'}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme" />
                <input
                  type="date"
                  value={inputs.departDate}
                  onChange={(e) => setInputs((p) => ({ ...p, departDate: e.target.value }))}
                  className="w-full pl-9 pr-2 py-2.5 border border-border rounded-sm text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme"
                />
              </div>
              {inputs.tripType === 'round-trip' && (
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input
                    type="date"
                    value={inputs.returnDate}
                    onChange={(e) => setInputs((p) => ({ ...p, returnDate: e.target.value }))}
                    className="w-full pl-9 pr-2 py-2.5 border border-border rounded-sm text-sm text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 bg-theme text-white px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            Find Flights
          </button>
        </div>
      </div>
    </div>
  )
}
