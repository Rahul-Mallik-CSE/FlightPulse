import React from "react";
import FooterAppSection from "./FooterAppSection";
import FooterLinksSection from "./FooterLinkSection";
import FooterSocialSection from "./FooterSocialSection";
import FooterContactSection from "./FooterContactSection";


const Footer = () => {
  return (
    <footer className="w-full font-sans">
      {/* App promotion banner */}
      <FooterAppSection />

      {/* Divider */}
      <div className="w-full h-px bg-[#EFEFEF]" />

      {/* Navigation link columns */}
      <FooterLinksSection />

      {/* Payment methods + social icons + email subscribe */}
      <FooterSocialSection />

      {/* Bottom contact bar */}
      <FooterContactSection />

      
    </footer>
  );
};

export default Footer;