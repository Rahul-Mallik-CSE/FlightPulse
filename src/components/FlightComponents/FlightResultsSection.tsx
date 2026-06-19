'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Heart, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import FlightFilterSidebar from './FlightFilterSidebar'
import FlightSortBar from './FlightSortBar'
import FlightCard from './FlightCard'
import FlightEmptyState from './FlightEmptyState'
import { Flight, FlightFilters, SortOption } from '@/types/FlightTypes'
import { getDefaultFilters, sortFlights, applyFlightFilters, getPriceRange } from '@/lib/flightUtils'
import flightsData from '@/data/flights.json'

const ALL_FLIGHTS = flightsData as Flight[]
const INITIAL_VISIBLE = 5
const LOAD_MORE_COUNT = 5

export default function FlightResultsSection() {
  const searchParams = useSearchParams()
  const [allFlights] = useState<Flight[]>(ALL_FLIGHTS)
  const [filters, setFilters] = useState<FlightFilters>(() => getDefaultFilters(ALL_FLIGHTS))
  const [debouncedFilters, setDebouncedFilters] = useState<FlightFilters>(() => getDefaultFilters(ALL_FLIGHTS))
  const [sort, setSort] = useState<SortOption>('cheapest')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [isLoading, setIsLoading] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Re-init filters when flights data available
  useEffect(() => {
    const pr = getPriceRange(ALL_FLIGHTS)
    setFilters((prev) => ({
      ...prev,
      minPrice: pr.min,
      maxPrice: pr.max,
    }))
    setDebouncedFilters((prev) => ({
      ...prev,
      minPrice: pr.min,
      maxPrice: pr.max,
    }))
  }, [])

  const handleFilterChange = useCallback((partial: Partial<FlightFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }, [])

  // Debounce filter application (350ms matching hotel pattern)
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setIsLoading(true)
    debounceTimer.current = setTimeout(() => {
      setDebouncedFilters(filters)
      setVisibleCount(INITIAL_VISIBLE)
      setIsLoading(false)
    }, 350)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [filters])

  // Apply search query from URL
  const origin = searchParams.get('origin') || ''
  const destination = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''
  const cabin = searchParams.get('cabin') || ''

  let filteredFlights = applyFlightFilters(allFlights, debouncedFilters)

  // Apply search params
  if (origin) {
    filteredFlights = filteredFlights.filter(
      (f) =>
        f.origin.toUpperCase().includes(origin.toUpperCase().slice(0, 3)) ||
        f.departureAirport.city.toLowerCase().includes(origin.toLowerCase().replace(/\s*\(.*\)/, '').trim())
    )
  }
  if (destination) {
    filteredFlights = filteredFlights.filter(
      (f) =>
        f.destination.toUpperCase().includes(destination.toUpperCase().slice(0, 3)) ||
        f.arrivalAirport.city.toLowerCase().includes(destination.toLowerCase().replace(/\s*\(.*\)/, '').trim())
    )
  }
  if (date) filteredFlights = filteredFlights.filter((f) => f.date === date)
  if (cabin && cabin !== 'Economy') filteredFlights = filteredFlights.filter((f) => f.cabin.toLowerCase() === cabin.toLowerCase())

  const sortedFlights = sortFlights(filteredFlights, sort)
  const visibleFlights = sortedFlights.slice(0, visibleCount)
  const hasMore = visibleCount < sortedFlights.length

  function handleSortChange(newSort: SortOption) {
    setSort(newSort)
    setVisibleCount(INITIAL_VISIBLE)
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
  }

  function handleClearFilters() {
    const defaults = getDefaultFilters(ALL_FLIGHTS)
    setFilters(defaults)
    setDebouncedFilters(defaults)
    setVisibleCount(INITIAL_VISIBLE)
  }

  return (
    <section className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Mobile filter toggle */}
      <div className="flex md:hidden items-center justify-between mb-4">
        <p className="text-sm text-secondary">
          <span className="font-semibold text-foreground">{sortedFlights.length}</span> flights found
        </p>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 border border-theme text-theme rounded-sm px-3 py-2 text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto p-5">
            <p className="text-base font-bold mb-4">Filters</p>
            <FlightFilterSidebar
              allFlights={allFlights}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Filter sidebar — desktop only */}
        <aside className="hidden md:block w-44 lg:w-52 shrink-0">
          <div className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <FlightFilterSidebar
              allFlights={allFlights}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <FlightSortBar
            currentSort={sort}
            onSortChange={handleSortChange}
            resultCount={sortedFlights.length}
          />

          {/* States */}
          {isLoading ? (
            <FlightEmptyState type="loading" />
          ) : sortedFlights.length === 0 ? (
            <FlightEmptyState type="no-results" onRetry={handleClearFilters} />
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {visibleFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>

              {/* Bottom action row */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button className="flex items-center gap-2 border border-theme text-theme px-6 py-2.5 rounded-sm text-sm font-semibold hover:bg-blue-50 transition-colors cursor-pointer">
                  <Heart className="w-4 h-4" />
                  List Your Favourite Places
                </button>

                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    className="flex items-center gap-2 bg-theme text-white px-6 py-2.5 rounded-sm text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    See More Search Results
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
