import { Instagram, Youtube, Mail } from "lucide-react";

const NAV_COLS = [
  {
    title: "Collection",
    links: [
      { label: "Wall Art", href: "#collection" },
      { label: "Sculpture", href: "#collection" },
      { label: "Screens", href: "#collection" },
    ],
  },
  {
    title: "Bespoke",
    links: [
      { label: "Sculpture", href: "#bespoke", event: "open-bespoke-category", detail: "sculpture" },
      { label: "Commissions", href: "#bespoke" },
      { label: "Projects", href: "#bespoke", event: "open-bespoke-category", detail: "projects" },
      { label: "Concepts", href: "#bespoke", event: "open-bespoke-category", detail: "concepts" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Catalogue Designs", href: "#services" },
      { label: "Bespoke Design", href: "#bespoke" },
      { label: "Rendering Service", href: "#process" },
      { label: "Commercial", href: "#services" },
      { label: "Public Art", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Process & Ordering", href: "#process" },
      { label: "Contact", href: "#contact" },
      { label: "Links", href: "#discover-portals", event: "open-discover-portal-links" },
    ],
  },
];

function scrollTo(href) {
  const target = href === "#" ? document.body : document.querySelector(href);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth" });
}

function handleLink(link) {
  if (link.event) {
    window.dispatchEvent(new CustomEvent(link.event, { detail: link.detail }));
    setTimeout(() => scrollTo(link.href), 50);
  } else {
    scrollTo(link.href);
  }
}

export default function Footer() {
  return (
    <footer className="bg-charcoal rounded-t-[3rem] md:rounded-t-[4rem] pt-16 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center mb-16">
          {/* Brand */}
          <a href="#" onClick={e => { e.preventDefault(); scrollTo("#"); }} className="font-heading font-bold text-2xl text-cream">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <p className="text-cream/60 text-sm mt-4 max-w-md leading-relaxed">
            Original bespoke designs & catalogued creations. Laser-cut wall
            art, sculpture & architectural features crafted in Australia.
          </p>

          {/* Nav Columns */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 mt-10">
            {NAV_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="font-detail text-xs text-cream/60 uppercase tracking-[0.15em] mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={e => { e.preventDefault(); handleLink(link); }}
                        className="lift-hover text-cream/50 hover:text-cream text-sm transition-colors duration-300 inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mt-10">
            <a
              href="https://instagram.com/rogetjames/"
              target="_blank"
              rel="noopener noreferrer"
              className="lift-hover w-9 h-9 rounded-lg bg-cream/5 flex items-center justify-center hover:bg-cream/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={14} className="text-cream/50" />
            </a>
            <a
              href="mailto:james@rogetjames.com"
              className="lift-hover w-9 h-9 rounded-lg bg-cream/5 flex items-center justify-center hover:bg-cream/10 transition-colors"
              aria-label="Email"
            >
              <Mail size={14} className="text-cream/50" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/5 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <p className="text-cream/55 text-sm font-detail">
            All images are the designs and works of ROGETjames.
          </p>
          <p className="text-cream/55 text-sm font-detail">
            &copy; {new Date().getFullYear()} ROGETjames. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
