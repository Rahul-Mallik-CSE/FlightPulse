import React from "react";
import FooterLinkColumn from "./FooterLinkColumn";


const columns = [
  {
    heading: "About Us",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Work With Us", href: "#" },
      { label: "Press & Media", href: "#" },
      { label: "Privacy & Security", href: "#" },
    ],
  },
  {
    heading: "We Offer",
    links: [
      { label: "Trip Sponsorship", href: "#" },
      { label: "Last Minutes Flights", href: "#" },
      { label: "Best Deals", href: "#" },
      { label: "AI-Driven Search", href: "#" },
    ],
  },
  {
    heading: "Headquarters",
    links: [
      { label: "England", href: "#" },
      { label: "France", href: "#" },
      { label: "Canada", href: "#" },
      { label: "Iceland", href: "#" },
    ],
  },
  {
    heading: "Travel Blogs",
    links: [
      { label: "Bali Travel Guide", href: "#" },
      { label: "Sri Travel Guide", href: "#" },
      { label: "Peru Travel Guide", href: "#" },
      { label: "Swiss Travel Guide", href: "#" },
    ],
  },
  {
    heading: "Activities",
    links: [
      { label: "Tour Leading", href: "#" },
      { label: "Cruising & Sailing", href: "#" },
      { label: "Camping", href: "#" },
      { label: "Kayaking", href: "#" },
    ],
  },
  {
    heading: "Service",
    links: [
      { label: "Report Error", href: "#" },
      { label: "Ask Online", href: "#" },
      { label: "Travel Insurance", href: "#" },
    ],
  },
];

const FooterLinksSection = () => {
  return (
    <div className="w-full bg-transparent pt-10 pb-6">
      <div className="max-w-7xl px-4 md:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {columns.map((col) => (
            <FooterLinkColumn
              key={col.heading}
              heading={col.heading}
              links={col.links}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterLinksSection;