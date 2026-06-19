import React from "react";
import Image from "next/image";
import { RiAppleLine } from "react-icons/ri";
import { FaGooglePlay } from "react-icons/fa";

const FooterAppSection = () => {
  return (
    <div className="w-full bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: text content */}
        <div className="flex flex-col gap-0.5 max-w-xl">
          <h2 className="text-lg md:text-xl font-bold text-theme leading-snug">
            Go Further With The EasyTravio App
          </h2>
          <p className="text-xs md:text-sm text-primary leading-relaxed">
            Enjoy Savings On Chosen Hotels And Flights When You Book Through The EasyTravio Website.
            Additionally, Earn One Key Cash For Every Booking Made Through The App.
          </p>
          <p className="text-xs md:text-sm text-secondary ">Secured By Europe GTP</p>
        </div>

        {/* Right: store badges + QR codes */}
        <div className="flex flex-col gap-4">
          {/* App Store row */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 bg-black text-white rounded-sm px-2 py-1.5 min-w-30 hover:opacity-90 transition-opacity"
            >
              {/* Apple icon SVG */}
              <RiAppleLine className="w-6 h-6" />
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] font-light tracking-wide">Download on the</span>
                <span className="text-sm font-semibold tracking-tight">App Store</span>
              </div>
            </a>
            {/* QR placeholder */}
            <div className="w-12 h-12  flex items-center justify-center">
              <Image src="/images/QR.png" alt="QR Code" width={40} height={40} className="object-contain" />
            </div>
          </div>

          {/* Google Play row */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 border border-border bg-white text-primary rounded-sm px-2 py-1.5 min-w-30 hover:opacity-90 transition-opacity"
            >
              {/* Google Play icon SVG */}
              <FaGooglePlay className="w-6 h-6 " />
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] font-light tracking-wide">GET IT ON</span>
                <span className="text-sm font-semibold tracking-tight">Google Play</span>
              </div>
            </a>
            {/* QR placeholder */}
            <div className="w-12 h-12  flex items-center justify-center">
              <Image src="/images/QR.png" alt="QR Code" width={40} height={40} className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterAppSection;