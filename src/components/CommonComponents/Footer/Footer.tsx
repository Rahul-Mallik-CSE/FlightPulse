import React from "react";
import FooterAppSection from "./FooterAppSection";
import FooterLinksSection from "./FooterLinkSection";


const Footer = () => {
  return (
    <footer className="w-full font-sans">
      {/* App promotion banner */}
      <FooterAppSection />

      {/* Divider */}
      <div className="w-full h-px bg-[#EFEFEF]" />

      {/* Navigation link columns */}
      <FooterLinksSection />

      
    </footer>
  );
};

export default Footer;