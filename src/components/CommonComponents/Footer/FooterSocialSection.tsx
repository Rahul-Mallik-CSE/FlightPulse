import Image from "next/image";
import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebookF, FaLinkedinIn, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";




const socialLinks = [
  { icon: <FaLinkedinIn className="h-6 w-6" />, href: "#", label: "LinkedIn" },
  { icon: <FaTelegramPlane className="h-6 w-6" />, href: "#", label: "Telegram" },
  { icon: <FaTwitter className="h-6 w-6" />, href: "#", label: "Twitter" },
  { icon: <FaFacebookF className="h-6 w-6" />, href: "#", label: "Facebook" },
  { icon: <FaSquareInstagram className="h-6 w-6" />, href: "#", label: "Instagram" },
];

const FooterSocialSection = () => {
  return (
    <div className="w-full bg-transparent py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0 lg:justify-between">

        {/* Payment methods */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { Icon: "/icons/visa-logo.png", label: "Visa" },
            { Icon: "/icons/Amex.png", label: "American Express" },
            { Icon: "/icons/Masterrcard.png", label: "Mastercard" },
            { Icon: "/icons/Paypal.png", label: "PayPal" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="border border-gray-200 rounded-sm px-4 py-2 flex items-center justify-center h-10 w-22 shadow-sm bg-white"
              title={label}
            >
              <Image src={Icon} alt={label} width={120} height={140} className="h-5 w-10" />
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-5">
          {socialLinks.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-theme hover:text-theme cursor-pointer transition-colors duration-200"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Email subscribe */}
        <div className="flex flex-col gap-1">
          <label htmlFor="footer-email" className="text-sm font-medium text-primary">
            Email
          </label>
          <div className="flex items-center border border-border rounded-sm overflow-hidden h-9 w-full max-w-xs shadow-sm">
            <span className="pl-3 text-secondary">
             <AiOutlineMail />
            </span>
            <input
              id="footer-email"
              type="email"
              placeholder="Enter Your Email"
              className="flex-1 px-2 text-[13px] text-primary placeholder:text-secondary outline-none bg-white"
            />
            <button className="bg-theme cursor-pointer hover:bg-theme/90 text-white text-sm font-medium px-4 h-full transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FooterSocialSection;