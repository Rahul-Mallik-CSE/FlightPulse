'use client'
import React from 'react'
import { Plane, SearchX, WifiOff, Loader2 } from 'lucide-react'

type StateType = 'loading' | 'empty' | 'error' | 'no-results'

interface FlightEmptyStateProps {
  type: StateType
  message?: string
  onRetry?: () => void
}

export default function FlightEmptyState({ type, message, onRetry }: FlightEmptyStateProps) {
  if (type === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-muted border-t-theme animate-spin" />
          <Plane className="absolute inset-0 m-auto w-7 h-7 text-theme" />
        </div>
        <p className="text-base font-semibold text-foreground">Searching for the best flights…</p>
        <p className="text-sm text-secondary">Comparing prices from all airlines</p>
      </div>
    )
  }

  if (type === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-base font-semibold text-foreground">Something went wrong</p>
        <p className="text-sm text-secondary text-center max-w-xs">
          {message || 'We could not fetch flights. Please check your connection and try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-theme text-white rounded-sm text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <SearchX className="w-8 h-8 text-secondary" />
        </div>
        <p className="text-base font-semibold text-foreground">No flights match your filters</p>
        <p className="text-sm text-secondary text-center max-w-xs">
          Try adjusting your filters or search for different dates.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 border border-theme text-theme rounded-sm text-sm font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>
    )
  }

  // empty (no search yet)
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary" />
      </div>
      <p className="text-base font-semibold text-foreground">Search for flights above</p>
      <p className="text-sm text-secondary">Enter your origin, destination and travel date to get started.</p>
    </div>
  )
}
