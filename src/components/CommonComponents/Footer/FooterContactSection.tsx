import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineMailOpen } from "react-icons/hi";
import { LiaPhoneVolumeSolid } from "react-icons/lia";

const FooterContactSection = () => {
  return (
    <div className="w-full bg-[#D9D9D9] py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 text-[12.5px] text-gray-600">

        {/* Copyright */}
        <div className="flex items-center gap-1.5">
          <span className="border border-theme rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold text-theme">R</span>
          <span className="text-xs text-tertiary hover:text-theme transition-colors font-semibold">Copyright Flight Pulse</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-1.5">
          <HiOutlineMailOpen className="w-4 h-4 text-theme" />
          <a href="mailto:rmallik191242@bscse.uiu.ac.bd" className="text-xs text-tertiary hover:text-theme transition-colors font-semibold">
            rmallik191242@bscse.uiu.ac.bd
          </a>
        </div>

        {/* Tagline */}
        <p className="text-base text-tertiary hover:text-theme transition-colors font-bold">
          &ldquo;Flight Pulse: Seamless Journeys, Unrivalled Travel Wisdom!&rdquo;
        </p>

        {/* Address */}
        <div className="flex items-center gap-1.5">
          <CiLocationOn className="w-4 h-4 text-theme" />
          <span className="text-xs text-tertiary hover:text-theme transition-colors font-semibold">
            Shamim Sharani, Dhaka, Bangladesh
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-1.5">
          <LiaPhoneVolumeSolid className="w-4 h-4 text-theme" />
          <a href="tel:+8801628438045" className="text-xs text-tertiary hover:text-theme transition-colors font-semibold">
            +88 01628438045
          </a>
        </div>

      </div>
    </div>
  );
};

export default FooterContactSection;