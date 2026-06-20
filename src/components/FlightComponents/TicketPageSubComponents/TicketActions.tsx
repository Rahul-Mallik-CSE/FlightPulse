'use client'

import Link from 'next/link'
import { Download, Printer } from 'lucide-react'

type TicketActionsProps = {
  onPrint: () => void
  onDownload: () => void
}

export default function TicketActions({ onPrint, onDownload }: TicketActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-card-border">
      <Link
        href="/"
        className="flex items-center justify-center gap-2 border border-theme text-theme px-8 py-3 rounded-sm font-semibold hover:bg-blue-50 transition-colors text-sm w-full sm:w-auto"
      >
        Search More Flights
      </Link>
      <button
        onClick={onPrint}
        className="flex items-center justify-center gap-2 bg-theme text-white px-8 py-3 rounded-sm font-semibold hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto cursor-pointer"
      >
        <Printer className="w-4 h-4" />
        Print PDF
      </button>
      <button
        onClick={onDownload}
        className="flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-3 rounded-sm font-semibold hover:bg-green-600 transition-colors text-sm w-full sm:w-auto cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    </div>
  )
}
