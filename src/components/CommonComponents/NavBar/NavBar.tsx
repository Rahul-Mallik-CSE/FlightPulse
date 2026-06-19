"use client"
import Image from "next/image"
import Link from "next/link"
import {  useState } from "react"
import { CiSearch } from "react-icons/ci"
import { GiHamburgerMenu } from "react-icons/gi"

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="w-full bg-background z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: logo + small icons */}
          <div className="flex items-center gap-4">
            <Link href="/" className=" items-center gap-3">
              <div className="w-10 h-10 relative mx-auto">
                <Image src="/logo.png" alt="Flight Pulse" fill sizes="48px" style={{ objectFit: "contain" }} />
              </div>
              <div className="hidden sm:block">
                <div className="text-theme font-bold text-base">Flight Pulse</div>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-3">
              <button aria-label="help" className="w-5 h-5 font-bold rounded-full flex items-center justify-center border border-theme text-theme">?</button>
              <button aria-label="lang" className="w-5 h-5 rounded-full flex items-center justify-center border border-none overflow-hidden">
                <Image src="/united-kingdom.png" alt="Language" width={16} height={16} 
                className="w-6 h-6 object-cover" />
              </button>
            </div>
          </div>

          {/* Center: search (hidden on very small screens) */}
          <div className="flex-1 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full border border-border rounded-sm py-1 pl-4 pr-10 text-secondary placeholder:font-semibold placeholder:text-secondary shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary cursor-pointer">
                  <CiSearch className="w-5 h-5 font-semibold" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: auth buttons + mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <button className="py-2 px-8 md:px-12 cursor-pointer rounded-sm border border-theme text-theme font-semibold">Sing In</button>
              <button className="py-2 px-8 md:px-12 cursor-pointer rounded-sm border border-theme text-theme font-semibold">Register</button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-label="menu"
                className="p-1.5 cursor-pointer rounded-md border border-theme"
              >
                <GiHamburgerMenu className="w-6 h-6 text-theme" />
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {/* Mobile popup menu */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-x-0 top-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)}>
          <div
            className="w-full border-b border-border bg-background px-4 py-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              

              <button
                onClick={() => setMobileOpen(false)}
                aria-label="close menu"
                className="flex ml-auto cursor-pointer h-6 w-6 items-center justify-center rounded-full border border-border text-foreground"
              >
                ×
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <button className="w-full cursor-pointer rounded-xl border border-theme px-4 py-1.5 font-semibold text-theme">Sing In</button>
              <button className="w-full cursor-pointer rounded-xl border border-theme bg-background px-4 py-1.5 font-semibold text-theme">Register</button>

             
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
