'use client'

import { AIRLINE_COLORS } from './ticketShared'

export default function AirlineBadge({ name }: { name: string }) {
  const backgroundColor = AIRLINE_COLORS[name] || '#07689f'
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow" style={{ backgroundColor }}>
      {initials}
    </div>
  )
}
