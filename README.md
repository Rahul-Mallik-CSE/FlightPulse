# FlightPulse - Flight Search and Booking Experience

FlightPulse is a polished flight search, booking, and digital ticket experience built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. It uses mock flight data to power a complete end-to-end flow: search flights, inspect flight details, complete a booking, and view the generated ticket.

## Live Demo

- Production deployment: [https://flight-pulse-pied.vercel.app/](https://flight-pulse-pied.vercel.app/)

## Features

### Home / Search (`/`)
- Flight search hero with origin and destination selection
- Search results rendered from shared flight data
- Filtered and organized results section
- Loading state while flight data is being prepared

### Flight Detail (`/flight/[id]`)
- Full-screen modal-style detail view
- Flight summary with airline, duration, route, gate, and terminal information
- Visual route presentation with stopover handling
- Flight amenities and travel details surfaced from the mock dataset
- Back navigation to the results view

### Booking Flow (`/flight/book/[id]`)
- Two-column booking layout
- Flight summary and trip narrative on the left panel
- Passenger pricing breakdown on the right panel
- Payment method selection and booking form fields
- Real-time validation for name, phone, email, card number, CVC, and expiry date
- Booking submission that redirects to a digital ticket page

### Digital Ticket (`/flight/ticket/[id]`)
- Generated booking reference and passenger details
- Digital ticket presentation based on the booked flight
- Ticket utilities and printable PDF-ready components

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript 5 |
| UI | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| Component primitives | shadcn/ui, Radix UI, @base-ui/react |
| Icons | lucide-react, react-icons |
| PDF | react-pdf, @react-pdf/renderer |
| Utilities | clsx, tailwind-merge, class-variance-authority, cmdk |
| Data helpers | country-codes-list, country-flag-icons |

## Installed Packages

### Dependencies
- @base-ui/react
- @react-pdf/renderer
- class-variance-authority
- clsx
- cmdk
- country-codes-list
- country-flag-icons
- lucide-react
- next
- radix-ui
- react
- react-dom
- react-icons
- react-pdf
- shadcn
- tailwind-merge
- tw-animate-css

### Dev Dependencies
- @tailwindcss/postcss
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
- tailwindcss
- typescript

## Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── flight/
│       ├── [id]/page.tsx
│       ├── book/[id]/page.tsx
│       └── ticket/[id]/page.tsx
├── components/
│   ├── CommonComponents/
│   │   ├── Footer/
│   │   └── NavBar/
│   ├── FlightComponents/
│   │   ├── FlightSearchBar.tsx
│   │   ├── FlightResultsSection.tsx
│   │   ├── FlightFilterSidebar.tsx
│   │   ├── FlightSortBar.tsx
│   │   ├── FlightCard.tsx
│   │   ├── FlightEmptyState.tsx
│   │   └── DigitalTicketContent.tsx
│   └── ui/
├── data/
│   └── flights.json
├── hooks/
│   └── use-mobile.ts
├── lib/
│   ├── flightUtils.ts
│   └── utils.ts
└── types/
    └── FlightTypes.ts
```

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm, pnpm, yarn, or bun

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- Flight data is sourced from `src/data/flights.json`.
- Booking and ticket generation are implemented entirely in the front end using the mock dataset.
- The project is already deployed on Vercel at [https://flight-pulse-pied.vercel.app/](https://flight-pulse-pied.vercel.app/).

## Deployment

This project is ready for Vercel deployment. The live deployment is available here:

[https://flight-pulse-pied.vercel.app/](https://flight-pulse-pied.vercel.app/)
