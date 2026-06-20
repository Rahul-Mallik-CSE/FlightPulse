'use client'
import React, { useRef, useCallback, useEffect } from 'react'
import { FlightFilters } from '@/types/FlightTypes'
import { getUniqueAirlines } from '@/lib/flightUtils'
import { Flight } from '@/types/FlightTypes'

interface FlightFilterSidebarProps {
  allFlights: Flight[]
  filters: FlightFilters
  onFilterChange: (partial: Partial<FlightFilters>) => void
}

// ─────────────────────────────────────────────────────────────
// Custom dual-range slider using mouse drag events.
// Why not two overlapping <input type="range">?
//   → The top input always intercepts clicks on the track,
//     so the min thumb (underneath) can never be reached when
//     it is at the leftmost position (its default value of 0).
// Solution: render custom draggable thumb divs and compute the
// new value from mouse position relative to the track rect.
// ─────────────────────────────────────────────────────────────
function DualRangeSlider({
  label,
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  formatValue,
}: {
  label: string
  min: number
  max: number
  valueMin: number
  valueMax: number
  onChangeMin: (v: number) => void
  onChangeMax: (v: number) => void
  formatValue: (v: number) => string
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  // Keep refs so the mousemove closure always reads the latest prop
  const valueMinRef = useRef(valueMin)
  const valueMaxRef = useRef(valueMax)
  useEffect(() => { valueMinRef.current = valueMin }, [valueMin])
  useEffect(() => { valueMaxRef.current = valueMax }, [valueMax])

  const pctMin = ((valueMin - min) / (max - min)) * 100
  const pctMax = ((valueMax - min) / (max - min)) * 100

  /** Convert a clientX pixel coordinate → slider value [min, max] */
  const pxToValue = useCallback((clientX: number): number => {
    if (!trackRef.current) return min
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(min + ratio * (max - min))
  }, [min, max])

  const handleMinMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const onMove = (ev: MouseEvent) => {
      const next = Math.max(min, Math.min(pxToValue(ev.clientX), valueMaxRef.current - 1))
      onChangeMin(next)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [min, onChangeMin, pxToValue])

  const handleMaxMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const onMove = (ev: MouseEvent) => {
      const next = Math.min(max, Math.max(pxToValue(ev.clientX), valueMinRef.current + 1))
      onChangeMax(next)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [max, onChangeMax, pxToValue])

  // Touch support
  const handleMinTouchStart = useCallback((e: React.TouchEvent) => {
    const onMove = (ev: TouchEvent) => {
      const next = Math.max(min, Math.min(pxToValue(ev.touches[0].clientX), valueMaxRef.current - 1))
      onChangeMin(next)
    }
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onEnd)
  }, [min, onChangeMin, pxToValue])

  const handleMaxTouchStart = useCallback((e: React.TouchEvent) => {
    const onMove = (ev: TouchEvent) => {
      const next = Math.min(max, Math.max(pxToValue(ev.touches[0].clientX), valueMinRef.current + 1))
      onChangeMax(next)
    }
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onEnd)
  }, [max, onChangeMax, pxToValue])

  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>

      {/* Outer container — we measure this for pxToValue */}
      <div className="relative h-5 flex items-center" ref={trackRef}>
        {/* Grey track */}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />

        {/* Filled (active) track segment */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-theme pointer-events-none"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />

        {/* ── Min thumb ── */}
        <div
          role="slider"
          aria-label="Minimum departure time"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMin}
          tabIndex={0}
          className="absolute w-4 h-4 rounded-full bg-theme border-2 border-white shadow-md cursor-grab active:cursor-grabbing select-none"
          style={{
            left: `calc(${pctMin}% - 8px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
          onMouseDown={handleMinMouseDown}
          onTouchStart={handleMinTouchStart}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') onChangeMin(Math.max(valueMin - 30, min))
            if (e.key === 'ArrowRight') onChangeMin(Math.min(valueMin + 30, valueMax - 1))
          }}
        />

        {/* ── Max thumb ── */}
        <div
          role="slider"
          aria-label="Maximum departure time"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMax}
          tabIndex={0}
          className="absolute w-4 h-4 rounded-full bg-theme border-2 border-white shadow-md cursor-grab active:cursor-grabbing select-none"
          style={{
            left: `calc(${pctMax}% - 8px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
          onMouseDown={handleMaxMouseDown}
          onTouchStart={handleMaxTouchStart}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') onChangeMax(Math.max(valueMax - 30, valueMin + 1))
            if (e.key === 'ArrowRight') onChangeMax(Math.min(valueMax + 30, max))
          }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-secondary">{formatValue(valueMin)}</span>
        <span className="text-xs text-secondary">{formatValue(valueMax)}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Single-range slider (used for trip duration)
// ─────────────────────────────────────────────────────────────
function SingleRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  leftLabel,
}: {
  min: number
  max: number
  step?: number
  value: number
  onChange: (v: number) => void
  formatValue: (v: number) => string
  leftLabel?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pct = ((Math.min(value, max) - min) / (max - min)) * 100

  function pxToValue(clientX: number): number {
    if (!trackRef.current) return min
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const raw = min + ratio * (max - min)
    return Math.round(raw / step) * step
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const onMove = (ev: MouseEvent) => onChange(pxToValue(ev.clientX))
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [onChange, step])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const onMove = (ev: TouchEvent) => onChange(pxToValue(ev.touches[0].clientX))
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onEnd)
  }, [onChange, step])

  return (
    <div className="relative h-5 flex items-center" ref={trackRef}>
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted">
        <div className="absolute h-1.5 rounded-full bg-theme left-0" style={{ right: `${100 - pct}%` }} />
      </div>
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        className="absolute w-4 h-4 rounded-full bg-theme border-2 border-white shadow-md cursor-grab active:cursor-grabbing select-none"
        style={{ left: `calc(${pct}% - 8px)`, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onChange(Math.max(value - step, min))
          if (e.key === 'ArrowRight') onChange(Math.min(value + step, max))
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const period = h < 12 ? 'AM' : 'PM'
  const displayH = h % 12 || 12
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

function minutesToDur(mins: number): string {
  if (mins >= 1440) return 'Any'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const STOPS_OPTIONS = [
  { label: 'Non-stop', value: 0 },
  { label: '1 Stop', value: 1 },
  { label: '2+ Stops', value: 2 },
]

const RATING_OPTIONS = [
  { label: 'Outstanding (9+)', value: 'outstanding' },
  { label: 'Excellent (8.5+)', value: 'excellent' },
  { label: 'Very Good (8+)', value: 'veryGood' },
  { label: 'Good (7+)', value: 'good' },
  { label: 'Any', value: 'any' },
]

export default function FlightFilterSidebar({ allFlights, filters, onFilterChange }: FlightFilterSidebarProps) {
  const airlines = getUniqueAirlines(allFlights)

  function toggleAirline(airline: string) {
    const updated = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline]
    onFilterChange({ airlines: updated })
  }

  function toggleStop(stop: number) {
    const updated = filters.stops.includes(stop)
      ? filters.stops.filter((s) => s !== stop)
      : [...filters.stops, stop]
    onFilterChange({ stops: updated })
  }

  return (
    <div className="w-full text-sm">
      {/* Departure Time — dual-range */}
      <DualRangeSlider
        label="Departure Time"
        min={0}
        max={1439}
        valueMin={filters.minDepartTime}
        valueMax={filters.maxDepartTime}
        onChangeMin={(v) => onFilterChange({ minDepartTime: v })}
        onChangeMax={(v) => onFilterChange({ maxDepartTime: v })}
        formatValue={minutesToTime}
      />

      {/* Trip Duration — single range */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-foreground mb-2">Trip Duration</p>
        <SingleRangeSlider
          min={60}
          max={1440}
          step={15}
          value={filters.maxDuration}
          onChange={(v) => onFilterChange({ maxDuration: v })}
          formatValue={minutesToDur}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-secondary">From 1h</span>
          <span className="text-xs text-secondary">{minutesToDur(filters.maxDuration)}</span>
        </div>
      </div>

      {/* Stops */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-foreground mb-2">Stops</p>
        <div className="space-y-2">
          {STOPS_OPTIONS.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.stops.includes(value)}
                onChange={() => toggleStop(value)}
                className="w-3.5 h-3.5 rounded border-border text-theme accent-theme cursor-pointer"
              />
              <span className="text-xs text-foreground group-hover:text-theme transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-foreground mb-2">Airline</p>
        <div className="space-y-2">
          {airlines.map((airline) => (
            <label key={airline} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => toggleAirline(airline)}
                className="w-3.5 h-3.5 rounded border-border text-theme accent-theme cursor-pointer"
              />
              <span className="text-xs text-foreground group-hover:text-theme transition-colors">{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Passenger Rating */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-foreground mb-2">Passenger Rating</p>
        <div className="space-y-2">
          {RATING_OPTIONS.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="passengerRating"
                value={value}
                checked={filters.passengerRating === value}
                onChange={() => onFilterChange({ passengerRating: value })}
                className="w-3.5 h-3.5 border-border text-theme accent-theme cursor-pointer"
              />
              <span className="text-xs text-foreground group-hover:text-theme transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popular Filters */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-foreground mb-2">Popular Filters</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.refundableOnly}
              onChange={(e) => onFilterChange({ refundableOnly: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-border accent-theme cursor-pointer"
            />
            <span className="text-xs text-foreground group-hover:text-theme transition-colors">Refundable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.vipOnly}
              onChange={(e) => onFilterChange({ vipOnly: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-border accent-theme cursor-pointer"
            />
            <span className="text-xs text-foreground group-hover:text-theme transition-colors">VIP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.childrenIncluded}
              onChange={(e) => onFilterChange({ childrenIncluded: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-border accent-theme cursor-pointer"
            />
            <span className="text-xs text-foreground group-hover:text-theme transition-colors">Children Friendly</span>
          </label>
        </div>
      </div>

      {/* AI / Random filter */}
      <div className="pt-3 border-t border-border space-y-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 rounded border-border accent-theme cursor-pointer mt-0.5" />
          <span className="text-xs text-secondary">
            Filter With The Help Of AI —{' '}
            <span className="text-theme underline cursor-pointer">see the results here</span>
          </span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 rounded border-border accent-theme cursor-pointer mt-0.5" defaultChecked />
          <span className="text-xs text-secondary">
            Filter Randomly —{' '}
            <span className="text-theme underline cursor-pointer">see the results here</span>
          </span>
        </label>
      </div>
    </div>
  )
}
