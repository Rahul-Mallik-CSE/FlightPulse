'use client'

import Link from 'next/link'
import { Plane } from 'lucide-react'

export default function TicketNotFoundState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Plane className="w-12 h-12 text-secondary" />
      <p className="text-lg font-bold text-foreground">Ticket not found</p>
      <Link href="/flight" className="px-5 py-2.5 bg-theme text-white rounded-sm font-semibold hover:bg-blue-700 transition-colors">
        Back to Flights
      </Link>
    </div>
  )
}
