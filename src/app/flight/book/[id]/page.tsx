'use client'
import React, { use, useState, useEffect } from 'react'
import * as countryCodesList from 'country-codes-list'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Plane,
  Star,
  Leaf,
  ChevronDown,
  CreditCard,
  AlertCircle,
  Info,
  Mail,
} from 'lucide-react'
import { Flight, BookingFormData } from '@/types/FlightTypes'
import { getStopsLabel } from '@/lib/flightUtils'
import flightsData from '@/data/flights.json'

const ALL_FLIGHTS = flightsData as Flight[]

function generateBookingRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const PAYMENT_METHODS = [
  { id: 'paypal', label: 'PayPal', color: 'bg-blue-500 text-white', abbr: 'P' },
  { id: 'visa', label: 'Visa', color: 'bg-blue-700 text-white', abbr: 'VISA' },
  { id: 'mastercard', label: 'Mastercard', color: 'bg-red-600 text-white', abbr: 'MC' },
  { id: 'amex', label: 'Amex', color: 'bg-blue-900 text-white', abbr: 'AE' },
] as const

type FieldErrors = Partial<Record<keyof BookingFormData, string>>

function validateForm(form: BookingFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.firstName.trim()) errors.firstName = 'First name is required'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required'
  if (!form.phone.trim()) errors.phone = 'Phone is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format'
  if (!form.cardNumber.replace(/\s/g, '')) errors.cardNumber = 'Card number is required'
  if (form.cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = 'Card number must be 16 digits'
  if (!form.cvc.trim()) errors.cvc = 'CVC is required'
  if (form.cvc.length < 3) errors.cvc = 'CVC must be 3 digits'
  if (!form.expDate.trim()) errors.expDate = 'Expiry date is required'
  if (!/^\d{2}\/\d{2}$/.test(form.expDate)) errors.expDate = 'Format: MM/YY'
  return errors
}

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [flight, setFlight] = useState<Flight | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormData, boolean>>>({})

  const countries = countryCodesList.all()
  const [dialCode, setDialCode] = useState('46') // Sweden default (matches the 🇸🇪 you had)
  
  const [form, setForm] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    cardNumber: '',
    cvc: '',
    expDate: '',
    bookingForWork: false,
    paymentMethod: 'paypal',
  })

  const adults = 2
  const children = 3
  const infants = 1

  useEffect(() => {
    const found = ALL_FLIGHTS.find((f) => f.id === id)
    setFlight(found || null)
  }, [id])

  function updateField<K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpDate(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Mark every field as touched so errors appear immediately
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key as keyof BookingFormData] = true
      return acc
    }, {} as typeof touched)
    setTouched(allTouched)

    const validationErrors = validateForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    // Simulate payment processing
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)

    // Redirect to Digital Ticket page with booking data in URL
    const ref = generateBookingRef()
    const name = encodeURIComponent(`${form.firstName} ${form.lastName}`)
    const email = encodeURIComponent(form.email)
    router.push(`/flight/ticket/${id}?ref=${ref}&name=${name}&email=${email}`)
  }

  function getFieldError(key: keyof BookingFormData) {
    return touched[key] ? errors[key] : undefined
  }

  if (!flight) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-muted border-t-theme animate-spin" />
      </main>
    )
  }

  const adultPrice = Math.round(flight.price * 0.55 * adults)
  const childPrice = Math.round(flight.price * 0.16 * children)
  const infantPrice = Math.round(flight.price * 0.08 * infants)
  const total = adultPrice + childPrice + infantPrice
  const cancellationDate = new Date(flight.date)
  cancellationDate.setDate(cancellationDate.getDate() - 30)

  return (
    <main className="w-full min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-secondary text-sm mb-6 hover:text-theme transition-colors cursor-pointer"
        >
          ← Back to Flight Detail
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Info panel */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Information You Need To Pay Attention.
            </h1>
            <p className="text-sm text-secondary mb-6">
              Passengers Are Divided According To Age Categories. Please Check Categories
            </p>

            {/* Flight summary card */}
            <div className="bg-card border border-card-border rounded-lg overflow-hidden mb-6">
              <div className="bg-theme px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-semibold">
                    {getStopsLabel(flight.stops, flight.stopCity)}{flight.stops > 0 ? ', 3h Between' : ''}
                  </span>
                </div>
                <span className="text-white text-xs font-semibold">
                  Flight Duration · {flight.duration}
                </span>
              </div>
              <div className="relative w-full h-40">
                <Image
                  src={flight.imageUrl}
                  alt={`${flight.airline} flight`}
                  fill
                  sizes="500px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="border-t border-card-border">
                <div className="flex items-center justify-between px-4 py-2 border-b border-card-border/50">
                  <span className="text-xs text-secondary">
                    First Flight No From {flight.departureAirport.city}{' '}
                    <span className="font-bold text-foreground">{flight.flightNumber}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <Plane className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold">{flight.airline}</span>
                  </div>
                </div>
                {flight.secondFlightNumber && (
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs text-secondary">
                      Second Flight No From {flight.stopCity}{' '}
                      <span className="font-bold text-foreground">{flight.secondFlightNumber}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                        <Plane className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-xs font-semibold">{flight.secondAirline || flight.airline}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trip summary */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground mb-2">Your Trip Summary</h2>
              <p className="text-sm text-secondary leading-relaxed">
                Your Flight Take Off From {flight.departureAirport.code} Gate {flight.departureAirport.gate}, You Enter Through {flight.departureAirport.terminal} Entrance.
                {flight.stopCity
                  ? ` In ${flight.stopCity} Airport You Will Stay 3h & 45m Then Exit Through Gate ${flight.arrivalAirport.gate}.`
                  : ''}{' '}
                Final Destination Will Be {flight.arrivalAirport.code} Airport And You Can Exit Through {flight.arrivalAirport.terminal} Door.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors cursor-pointer">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-foreground">Very Good</span>
                <span className="text-secondary">, {flight.reviewCount.toLocaleString()} Reviews</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button className="flex items-center gap-1.5 text-secondary hover:text-theme transition-colors cursor-pointer">
                <Leaf className="w-4 h-4 text-green-500" />
                <span>Sustainability Level</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* RIGHT: Payment form */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Payment Methods And Information
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              {/* Price details */}
              <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
                <p className="font-bold text-foreground mb-3">Price Details</p>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="text-theme font-bold">${adultPrice}</span>
                  <span className="text-secondary">{adults} Adults</span>
                  <span className="text-theme font-bold">${childPrice}</span>
                  <span className="text-secondary">{children} Children</span>
                  <span className="text-theme font-bold">${infantPrice}</span>
                  <span className="text-secondary">{infants} Infants</span>
                </div>
                <div className="border-t border-card-border mt-3 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total (USD)</span>
                  <span className="text-xl font-bold text-theme">${total}</span>
                </div>
              </div>

              {/* Booking for work + payment method */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => updateField('bookingForWork', !form.bookingForWork)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${form.bookingForWork ? 'border-theme bg-theme' : 'border-border'}`}
                  >
                    {form.bookingForWork && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                  <span className="text-sm font-medium text-foreground">Booking For Work</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary font-medium">Payment Method</span>
                  <div className="flex items-center gap-1">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => updateField('paymentMethod', method.id)}
                        className={`w-8 h-6 rounded text-xs font-bold cursor-pointer transition-all border-0 ${method.color} ${
                          form.paymentMethod === method.id
                            ? 'ring-2 ring-theme ring-offset-1 scale-110'
                            : 'opacity-50 hover:opacity-75'
                        }`}
                        title={method.label}
                      >
                        {method.abbr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Anna"
                    aria-describedby="firstName-error"
                    className={`w-full px-3 py-2.5 border rounded-sm text-sm bg-background focus:outline-none focus:ring-1 focus:ring-theme transition-colors ${getFieldError('firstName') ? 'border-red-400 bg-red-50' : 'border-border'}`}
                  />
                  {getFieldError('firstName') && (
                    <p id="firstName-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{getFieldError('firstName')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Carinna"
                    aria-describedby="lastName-error"
                    className={`w-full px-3 py-2.5 border rounded-sm text-sm bg-background focus:outline-none focus:ring-1 focus:ring-theme transition-colors ${getFieldError('lastName') ? 'border-red-400 bg-red-50' : 'border-border'}`}
                  />
                  {getFieldError('lastName') && (
                    <p id="lastName-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{getFieldError('lastName')}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className="shrink-0 w-36 px-2 py-2.5 border border-border rounded-sm text-sm bg-background focus:outline-none focus:ring-1 focus:ring-theme transition-colors appearance-none cursor-pointer"
                  >
                    {countries.map((c) => (
                      <option key={`${c.countryCode}-${c.countryCallingCode}`} value={c.countryCallingCode}>
                        {c.flag} +{c.countryCallingCode} ({c.countryCode})
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
                      placeholder="76437 88888"
                      aria-describedby="phone-error"
                      className={`w-full px-3 py-2.5 border rounded-sm text-sm bg-background focus:outline-none focus:ring-1 focus:ring-theme transition-colors ${getFieldError('phone') ? 'border-red-400 bg-red-50' : 'border-border'}`}
                    />
                  </div>
                </div>
                {getFieldError('phone') && (
                  <p id="phone-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{getFieldError('phone')}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="anna@example.com"
                    aria-describedby="email-error"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-sm text-sm bg-background focus:outline-none focus:ring-1 focus:ring-theme transition-colors ${
                      getFieldError('email') ? 'border-red-400 bg-red-50' : 'border-border'
                    }`}
                  />
                </div>
                {getFieldError('email') && (
                  <p id="email-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{getFieldError('email')}
                  </p>
                )}
              </div>

              {/* Card Number */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    value={form.cardNumber}
                    onChange={(e) => updateField('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="•••• •••• •••• ••••"
                    maxLength={19}
                    aria-describedby="cardNumber-error"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-sm text-sm bg-background font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-theme transition-colors ${getFieldError('cardNumber') ? 'border-red-400 bg-red-50' : 'border-border'}`}
                  />
                </div>
                {getFieldError('cardNumber') && (
                  <p id="cardNumber-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{getFieldError('cardNumber')}
                  </p>
                )}
              </div>

              {/* CVC + EXP */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    CVC <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    inputMode="numeric"
                    value={form.cvc}
                    onChange={(e) => updateField('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    aria-describedby="cvc-error"
                    className={`w-full px-3 py-2.5 border rounded-sm text-sm bg-background font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-theme transition-colors ${getFieldError('cvc') ? 'border-red-400 bg-red-50' : 'border-border'}`}
                  />
                  {getFieldError('cvc') && (
                    <p id="cvc-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{getFieldError('cvc')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    EXP Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="expDate"
                    type="text"
                    inputMode="numeric"
                    value={form.expDate}
                    onChange={(e) => updateField('expDate', formatExpDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    aria-describedby="expDate-error"
                    className={`w-full px-3 py-2.5 border rounded-sm text-sm bg-background font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-theme transition-colors ${getFieldError('expDate') ? 'border-red-400 bg-red-50' : 'border-border'}`}
                  />
                  {getFieldError('expDate') && (
                    <p id="expDate-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{getFieldError('expDate')}
                    </p>
                  )}
                </div>
              </div>

              {/* Cancellation policy */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-sm font-bold text-foreground mb-0.5">Cancellation Policy</p>
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-secondary">
                    Get A Full Refund If You Cancel By{' '}
                    <span className="font-semibold text-foreground">
                      {cancellationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (PDT)
                    </span>
                    .{' '}
                    <button type="button" className="text-theme underline cursor-pointer">Read More …</button>
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-theme text-white py-3 rounded-sm font-bold text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Processing…
                    </>
                  ) : (
                    'Confirm And Pay'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center justify-center gap-1.5 border border-border text-foreground py-3 rounded-sm font-semibold text-sm hover:border-theme hover:text-theme transition-colors cursor-pointer"
                >
                  Save If You Like It ♡
                </button>
              </div>

              <p className="text-xs text-secondary text-center mt-2">Check your information before submitting.</p>
              <p className="text-xs text-secondary text-center mt-0.5">Save your flight info · find it through Shortcut.</p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
