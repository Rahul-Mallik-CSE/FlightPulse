import React from "react";

interface LinkItem {
  label: string;
  href: string;
}

interface FooterLinkColumnProps {
  heading: string;
  links: LinkItem[];
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ heading, links }) => {
  return (
    <div className="flex flex-col gap-3 min-w-30">
      <h3 className="text-sm md:text-base font-bold text-primary ">{heading}</h3>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-sm md:text-base text-tertiary hover:text-blue-600 transition-colors duration-200 leading-snug"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default FooterLinkColumn;