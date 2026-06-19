'use client'
import React from 'react'
import { SortOption } from '@/types/FlightTypes'

interface FlightSortBarProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
  resultCount: number
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Cheapest', value: 'cheapest' },
  { label: 'Fastest', value: 'fastest' },
  { label: 'Earliest', value: 'earliest' },
  { label: 'Latest', value: 'latest' },
]

export default function FlightSortBar({ currentSort, onSortChange, resultCount }: FlightSortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      <p className="text-sm text-secondary">
        <span className="font-semibold text-foreground">{resultCount}</span> flights found
      </p>
      <div className="flex items-center gap-1 bg-card border border-card-border rounded-sm overflow-hidden shadow-sm">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-r border-card-border last:border-0 ${
              currentSort === opt.value
                ? 'bg-theme text-white'
                : 'bg-transparent text-secondary hover:text-theme hover:bg-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
