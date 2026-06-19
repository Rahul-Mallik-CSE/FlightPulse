
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

     
    </main>
  );
}
