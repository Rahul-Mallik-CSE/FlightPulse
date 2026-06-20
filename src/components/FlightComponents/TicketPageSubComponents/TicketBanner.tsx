'use client'

import { Printer, Download, CheckCircle2 } from 'lucide-react'

type TicketBannerProps = {
  bookingRef: string
  email: string
  onPrint: () => void
  onDownload: () => void
}

export default function TicketBanner({ bookingRef, email, onPrint, onDownload }: TicketBannerProps) {
  return (
    <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-green-800">Booking Confirmed!</p>
        <p className="text-xs text-green-600">
          Booking Ref: <span className="font-mono font-bold tracking-widest">{bookingRef}</span>
          {email && <> · Sent to <span className="font-semibold">{email}</span></>}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 text-xs text-green-700 border border-green-300 rounded px-3 py-1.5 hover:bg-green-100 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          Print
        </button>
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 text-xs bg-green-500 text-white rounded px-3 py-1.5 hover:bg-green-600 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>
    </div>
  )
}
