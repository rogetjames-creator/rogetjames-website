import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Mail } from "lucide-react";
import { netlifyImg } from "../utils/img";
import MelbourneGalleryPanels from "./MelbourneGalleryPanels";
import { cityHeroKey } from "../mediaDestinations";
import { useUploadsByKey } from "../utils/mediaUploads";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
//  Reusable city / location page. Duplicates the main site's exact
//  design tokens so it reads as the same website:
//   • hero          — object-contain, font-drama italic word +
//                     font-heading line (mirrors the homepage hero)
//   • section eyebrow — font-detail text-xs text-warm-gray uppercase tracking-[0.2em]
//   • section title   — font-syne font-bold text-2xl/4xl/5xl text-cream/60
//   • thumbnails      — aspect-square rounded-2xl bg-cream-dark, object-cover,
//                       duration-700 group-hover:scale-105, name on hover
//                       (identical to Gallery.jsx GridCard)
//   • footer          — charcoal rounded-top ROGETjames footer
//
//  One data object per city (see src/melbourne.jsx). Perth / Gold Coast reuse it.
//  SEO note: every city MUST carry real, distinct copy, projects and suburbs —
//  placeholder text here is a template for James to replace.
// ─────────────────────────────────────────────────────────────

const HEADING_SHADOW = { textShadow: "0 4px 14px rgba(0,0,0,0.55)" };

function Wordmark({ className = "" }) {
  return (
    <a href="https://rogetjames.com/" className={`font-heading font-bold text-cream ${className}`}>
      ROGET<span className="font-normal italic font-drama">james</span>
    </a>
  );
}

function Eyebrow({ children }) {
  return <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">{children}</span>;
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-syne font-bold text-xl md:text-2xl text-cream/60 tracking-tight mt-3" style={HEADING_SHADOW}>
      {children}
    </h2>
  );
}

export default function CityPage({ city }) {
  const {
    name, region, displayLine, intro, hero, heroMark, heroTypeClass, heroStretch,
    suburbs = [], services = [],
  } = city;
  // Slug used for this city's /media panel keys, so each city page keeps its
  // own set of panel pictures. Falls back to the city name.
  const citySlug = city.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // A photo uploaded to this city's hero spot replaces the picture at the top
  // of the page — newest upload wins. Falls back to the hero set in code.
  const heroKeys = useMemo(() => [cityHeroKey(citySlug)], [citySlug]);
  const heroUploads = useUploadsByKey(heroKeys);
  const heroSrc = useMemo(() => {
    const hits = heroUploads[cityHeroKey(citySlug)];
    return hits?.length ? hits[hits.length - 1].img : hero;
  }, [heroUploads, citySlug, hero]);

  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero drift-in — same easing/duration as the homepage hero.
      gsap.fromTo(".city-eyebrow", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, delay: 0.2, ease: "power2.out" });
      gsap.fromTo(".city-h-1", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.6, delay: 0.4, ease: "power2.out" });
      gsap.fromTo(".city-h-2", { x: 40, y: 30, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.6, delay: 0.6, ease: "power2.out" });
      gsap.fromTo(".city-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, delay: 0.85, ease: "power2.out" });

      gsap.utils.toArray(".city-reveal").forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-matt-black text-cream font-body">

      {/* ── Slim header ─────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <Wordmark className="text-lg md:text-xl" />
          <nav className="flex items-center gap-6 md:gap-9 font-detail text-[11px] uppercase tracking-[0.22em] text-cream/70">
            <a href="https://rogetjames.com/#collection" className="hover:text-cream transition-colors hidden sm:inline">Collection</a>
            <a href="https://rogetjames.com/#bespoke" className="hover:text-cream transition-colors hidden sm:inline">Bespoke</a>
            <a href="https://rogetjames.com/#contact" className="hover:text-clay transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* ── Hero — object-contain, mirrors the homepage hero ── */}
      <section className="relative h-dvh min-h-[560px] w-full overflow-hidden flex items-end bg-charcoal">
        <img
          src={netlifyImg(heroSrc, { w: 1600, q: 82 })}
          alt={`ROGETjames laser cut work in ${name}`}
          className="absolute inset-0 w-full h-full object-contain"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-matt-black pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-4xl">
            <p className="city-eyebrow font-detail text-xs text-cream/70 uppercase tracking-[0.25em] mb-5" style={{ opacity: 0 }}>
              {name}, {region} · Australia-wide studio
            </p>
            <h1 className="flex flex-col">
              {heroMark ? (
                <span className="city-h-1 block text-cream/90 w-[260px] md:w-[440px] lg:w-[540px]" style={{ opacity: 0, filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.45))" }}>
                  {heroMark}
                </span>
              ) : heroTypeClass ? (
                // Each city has its own heading face, supplied by James as an
                // SVG naming the font (see src/components/CityPage notes). All
                // are set white at 90% with Melbourne's drop shadow, and sized
                // so the cap height matches the MELBOURNE mark exactly —
                // 51.8px at desktop, 42.2 at md, 25.0 at base. The sizes live
                // on each city because every face has a different cap ratio.
                // heroStretch reproduces the horizontal scale in his artwork;
                // it sits on an inner span so it can't fight the GSAP drift-in
                // that owns the transform on .city-h-1.
                <span className="city-h-1 block" style={{ opacity: 0 }}>
                  <span
                    className={`${heroTypeClass} text-white/90 uppercase leading-none inline-block`}
                    style={{
                      textShadow: "0 3px 10px rgba(0,0,0,0.45)",
                      ...(heroStretch ? { transform: `scaleX(${heroStretch})`, transformOrigin: "left center" } : {}),
                    }}
                  >
                    {name}
                  </span>
                </span>
              ) : (
                // Until this city has its own wordmark, the plain
                // name carries Melbourne's weight and lift — text-cream/90 with
                // the same drop shadow — rather than the old faint engraved look.
                <span
                  className="city-h-1 font-drama italic text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-cream/90"
                  style={{ textShadow: "0 3px 10px rgba(0,0,0,0.45)", opacity: 0 }}
                >
                  {name}
                </span>
              )}
              {displayLine && (
                <span
                  className="city-h-2 font-heading font-semibold text-cream/70 text-base md:text-xl leading-snug mt-4 max-w-xl"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.45)", opacity: 0 }}
                >
                  {displayLine}
                </span>
              )}
            </h1>
            <p
              className="city-sub font-body text-white text-base md:text-lg max-w-2xl mt-6 md:mt-8 leading-relaxed"
              style={{ opacity: 0, textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)" }}
            >
              {intro[0]}
            </p>
          </div>
        </div>
      </section>

      {/* ── Intro — centered, like the About section ─────── */}
      <section className="bg-jet py-20 md:py-32">
        <div className="city-reveal max-w-3xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          <Eyebrow>Made for {name}</Eyebrow>
          <div className="space-y-6 mt-8">
            {intro.slice(1).map((para, i) => (
              <p key={i} className="font-body text-base text-cream/70 leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse every gallery — expanding vertical panels (below the spiel) ── */}
      <MelbourneGalleryPanels city={citySlug} />

      {/* ── Services ─────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="bg-pewter py-20 md:py-32">
          <div className="city-reveal max-w-3xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
            <Eyebrow>Made in {name} & Australia-wide</Eyebrow>
            <SectionTitle>What we make</SectionTitle>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2.5">
              {services.map((s, i) => (
                <li key={i} className="font-heading font-medium text-sm md:text-base text-cream/60">{s}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Suburbs served ──────────────────────────────── */}
      {suburbs.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="city-reveal max-w-3xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
            <Eyebrow>{name} & surrounds</Eyebrow>
            <p className="font-body text-cream/55 leading-relaxed text-sm md:text-base mt-5">{suburbs.join("  ·  ")}</p>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="border-t border-cream/[0.07]">
        <div className="city-reveal max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
          <h2 className="font-syne font-bold text-xl md:text-3xl text-cream/60 tracking-tight max-w-2xl mx-auto" style={HEADING_SHADOW}>
            Planning a piece for a {name} home or project?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <a
              href="https://rogetjames.com/#contact"
              className="font-detail text-xs uppercase tracking-[0.2em] text-cream rounded-full px-9 py-4 transition-colors duration-300"
              style={{ backgroundColor: "#9E7134" }}
            >
              Start a conversation
            </a>
            <a
              href="https://rogetjames.com/"
              className="font-detail text-xs uppercase tracking-[0.2em] text-cream/70 border border-cream/15 rounded-full px-9 py-4 hover:border-clay hover:text-cream transition-colors duration-300"
            >
              See the full collection
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer — mirrors the main site footer ───────── */}
      <footer className="bg-charcoal rounded-t-[3rem] md:rounded-t-[4rem] pt-16 md:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-14">
            <Wordmark className="text-2xl" />
            <p className="text-cream/60 text-sm mt-4 max-w-md leading-relaxed">
              Original bespoke laser-cut wall art, sculpture & architectural features, crafted in Australia and delivered to {name} & Australia-wide.
            </p>
            <p className="font-detail text-xs text-cream/55 uppercase tracking-[0.15em] mt-6">
              <a href="tel:+61488878073" className="hover:text-clay transition-colors">+61 488 878 073</a>
              <span className="mx-3 text-cream/25">/</span>
              <a href="mailto:james@rogetjames.com" className="hover:text-clay transition-colors">james@rogetjames.com</a>
            </p>
            <div className="flex gap-3 mt-8">
              <a href="https://instagram.com/rogetjames/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="w-9 h-9 rounded-lg bg-cream/5 flex items-center justify-center hover:bg-cream/10 transition-colors">
                <Instagram size={14} className="text-cream/50" />
              </a>
              <a href="mailto:james@rogetjames.com" aria-label="Email"
                 className="w-9 h-9 rounded-lg bg-cream/5 flex items-center justify-center hover:bg-cream/10 transition-colors">
                <Mail size={14} className="text-cream/50" />
              </a>
            </div>
          </div>
          <div className="border-t border-cream/5 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
            <p className="text-cream/55 text-sm font-detail">All images are the designs and works of ROGETjames.</p>
            <p className="text-cream/55 text-sm font-detail">&copy; {new Date().getFullYear()} ROGETjames. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
