
import FlightResultsSection from "@/components/FlightComponents/FlightResultsSection";
import FlightSearchBar from "@/components/FlightComponents/FlightSearchBar";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="w-full bg-background">
      {/* Hero search section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={null}>
          <FlightSearchBar />
        </Suspense>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-card-border" />

      {/* Results + filter section */}
      <Suspense fallback={
        <div className="w-full flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-muted border-t-theme animate-spin" />
        </div>
      }>
        <FlightResultsSection />
      </Suspense>

     
    </main>
  );
}
