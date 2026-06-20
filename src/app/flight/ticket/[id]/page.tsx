import { Suspense } from 'react'
import DigitalTicketContent from '@/components/FlightComponents/DigitalTicketContent'

export default function DigitalTicketPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-muted border-t-theme animate-spin" />
            <p className="text-sm text-secondary">Generating your ticket…</p>
          </div>
        </div>
      }
    >
      <DigitalTicketContent />
    </Suspense>
  )
}
