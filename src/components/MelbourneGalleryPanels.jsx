import { useState } from "react";
import { netlifyImg } from "../utils/img";
import { IVY_WORDS } from "./ivyModeWords";

// ── Melbourne "browse every gallery" panels ───────────────────────────────
// Slim vertical rectangles, one per gallery. Hover expands a panel out to reveal
// its image; click goes to that gallery on the live site. Gallery name runs
// vertically (bottom→top) in IVY MODE (assembled from the supplied alphabet),
// light grey, 85% opaque (15% transparent), anchored bottom-LEFT so it stays
// left when a panel expands. Fixed letter size (STRIP_PX) so every name reads
// the same size.
const NAME_COLOR = "rgba(194,194,194,0.85)"; // light grey, 85% opaque
const STRIP_PX = 12;                          // letter thickness — all names equal

// One assembled IVY MODE word, sized to a fixed strip thickness (height auto so
// longer names just run taller). fill:currentColor picks up NAME_COLOR.
function IvyWord({ name, className = "" }) {
  const w = IVY_WORDS[name.toUpperCase()];
  if (!w) return null;
  return (
    <svg
      viewBox={w.viewBox}
      className={className}
      style={{ width: STRIP_PX, height: "auto", color: NAME_COLOR, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={name}
    >
      <g transform={w.outer}>
        {w.groups.map((g, i) => (
          <g key={i} transform={`translate(${g.t} 0)`}><path d={g.d} /></g>
        ))}
      </g>
    </svg>
  );
}

const PANELS = [
  { name: "Wall Art",          img: "/images/cdn-gallery/3b37ba78-d6be-452a-93cf-9e0115683646_rw_1200.jpg", href: "https://rogetjames.com/wall-art" },
  { name: "Sculpture",         img: "/images/hero/hero-vasuki.jpg",                                          href: "https://rogetjames.com/sculpture" },
  { name: "Screens",           img: "/images/cdn-gallery/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg",  href: "https://rogetjames.com/?open=screens" },
  { name: "Bespoke Sculpture", img: "/images/cdn-gallery/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg",  href: "https://rogetjames.com/?open=sculpture" },
  { name: "Projects",          img: "/images/cdn-gallery/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg",  href: "https://rogetjames.com/?open=projects" },
  { name: "Commissions",       img: "/images/cdn-gallery/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg",  href: "https://rogetjames.com/?open=commissions" },
  { name: "Concepts",          img: "/images/cdn-gallery/cdd20f14-69b8-4224-ab94-80bc4a4b42bf_rw_1200.jpg",  href: "https://rogetjames.com/?open=concepts" },
  { name: "Concrete",          img: null,                                                                     href: "https://rogetjames.com/#bespoke" },
];

export default function MelbourneGalleryPanels() {
  const [hover, setHover] = useState(null);

  return (
    <section className="bg-jet pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex gap-1.5 md:gap-2 w-full h-[60vh] min-h-[380px] max-h-[660px]">
          {PANELS.map((p, i) => {
            const active = hover === i;
            return (
              <a
                key={p.name}
                href={p.href}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group relative overflow-hidden rounded-lg cursor-pointer block"
                style={{ flexGrow: active ? 5 : 1, flexBasis: 0, transition: "flex-grow 0.55s cubic-bezier(0.4,0,0.2,1)" }}
              >
                {p.img ? (
                  <img
                    src={netlifyImg(p.img, { w: 1000, q: 80 })}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-graphite to-onyx" />
                )}

                {/* Scrim — lifts on hover so the image reads through */}
                <div className={`absolute inset-0 transition-colors duration-500 ${active ? "bg-black/20" : "bg-black/55"}`} />

                {/* Gallery name — IVY MODE, bottom-LEFT, stays left on expand */}
                <div className="absolute inset-0 flex items-end justify-start pb-6 pl-4 md:pl-5 pointer-events-none">
                  <IvyWord name={p.name} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
