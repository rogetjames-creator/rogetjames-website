import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { netlifyImg } from "../utils/img";

// Homepage hero. James's "ART meets design" vector mark replaces the old "Art
// meets design." text + centred-top animated ROJ logo: the glass ART symbol
// fades in, MEETS flies in, then DESIGN. All three share the original 1133.86
// artboard so the symbol's small circle lands as the dot over the "i" in DESIGN.
// The frozen original lives in HeroClassic.jsx (rollback reference).

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  "/images/hero/hero-rue-1.jpg",
  "/images/hero/hero-bambu.jpg",
  "/images/hero/hero-creeping-fig-autumn-1.jpg",
  "/images/hero/hero-creeping-fig-autumn-2.jpg",
  "/images/hero/hero-creeping-fig-grande.jpg",
  "/images/hero/hero-gren-wide.jpg",
  "/images/hero/hero-gren-free.jpg",
  "/images/hero/hero-obliationes.jpg",
  "/images/hero/hero-rue-3rd.jpg",
  "/images/hero/hero-seaweed.jpg",
  "/images/hero/hero-vasuki.jpg",
  "/images/marakesh/marakesh-promo.jpg",
  "/images/hero/hero-banksia-oldmanis.jpg",
];

const INTERVAL = 5500;
const FADE_DURATION = 1.6;

// ART meets design mark — paths lifted verbatim from James's Illustrator SVGs
// (symbol: "…symbol with O no words"; words: "Meets design outlines"), all on
// the shared 1133.86 artboard so nothing shifts relative to the symbol.
const ART_SYMBOL = "M977.19,620.17c-1.33-6.89-7.39-12.1-14.67-12.1s-13.34,5.21-14.67,12.1h-347.14c-3.1,0-5.16-3.21-3.86-6.03.01-.03.03-.06.04-.09,2.32-5.02,4.02-10.29,5.16-15.69.2-.97.4-1.92.62-2.84.46-1.91,2.17-3.26,4.13-3.26,0,0,54.67.07,99.21.13h54.33c.86,0,1.59-.68,1.6-1.54,0-.15-.02-.3-.06-.44-.46-1.64-1.05-3.69-1.14-3.92-3.4-8.19-13.11-6.71-20.41-9.46-3.08-1.16-6.09-2.54-8.97-4.13-2.77-1.52-5.42-3.24-7.95-5.14-2.49-1.86-4.84-3.89-7.07-6.06-2.24-2.17-4.34-4.48-6.33-6.88-2.02-2.45-3.92-5-5.73-7.61-1.85-2.69-3.59-5.45-5.26-8.25-1.72-2.89-180.34-373.58-180.34-373.58-.65-1.28-1.28-2.41-1.91-3.39-.77-1.21-2.58-1.08-3.16.23l-18.03,40.66c-.16.37-.2.79-.1,1.18,1.06,4.06,2.74,8,4.41,11.89,2.87,6.71,5.59,13.05,5.25,19.83,0,.16-.04.32-.09.47-.57,1.71-1.16,3.43-1.77,5.17-.31.88-94.56,213.59-95.36,215.09-2.44,4.55-7.38,9.37-12.81,9.37,0,0-352.84-.02-352.84-.02v5.97h342.51c3.72,0,11.72.01,12.5,5,.13.82-.01,1.66-.36,2.42-1.49,3.23-18.21,39.72-26.39,53.26-7.78,12.89-17.2,25.19-29.52,34.06-5.99,4.31-12.61,7.73-19.64,9.98-3.76,1.2-7.62,2.08-11.53,2.64-3.78.54-7.74.41-11.36,1.78-3.42,1.3-4.99,4.71-5.9,8.09-.31,1.15.56,2.29,1.76,2.29h148.39c.8,0,1.52-.51,1.78-1.27.37-1.08.71-2.16,1.1-3.23.35-.98.88-1.96.81-3.04-.14-2.02-2.06-2.47-12.22-3.3-15.37-1.27-33.44-3.43-42.71-17.51-6.83-10.38-7.03-25.67-.6-44.14,1.33-3.35,17.19-40.95,19.17-42.67,2.16-1.87,5.35-2.69,8.11-3.07,4.87-.68,9.88-.19,14.77-.13,9.22.11,36.39,1.08,39.9,1.37,29.92,2.78,52.33,13.1,66.62,30.67,15.95,19.61,21.94,48.2,17.78,84.97-5.88,50.02-38.25,74.97-104.97,80.89-13.53,1.2-27.94,1.92-42.41,2.49h-29.89c-9.19,0-17.63-4.92-22.3-12.84-5.31-9.01-15.13-15.05-26.36-15.01-16.81.06-30.36,13.65-30.36,30.46,0,16.82,13.64,30.46,30.46,30.46,11.07,0,20.75-5.9,26.09-14.73,4.67-7.72,13.09-12.38,22.11-12.37,10.84,0,21.19,0,28.63,0,9.91,0,19.71,2.25,28.59,6.66,3.01,1.5,5.93,3.2,8.29,5.08,40.41,34.63,64.95,83.49,88.68,130.74,7.62,15.18,15.51,30.88,23.76,45.75,4.09,7.12,8.06,14.69,11.9,22.02,14.56,27.76,29.62,56.46,56.91,73.78,13.41,8.07,29.74,11.45,45.58,11.45,14.81,0,29.18-2.96,40.31-7.79h.01c1.14-.51,1.43-2,.57-2.9h0c-1.99-2.06-5.74-2.27-10.08-2.5-1.64-.09-3.34-.18-5-.38-27.87-3.52-46.61-27.29-62.68-52.41-8.78-14.6-18.03-31.97-27.83-50.36-36.01-67.59-80.34-150.82-142.88-176.36-1.75-.71-1.36-3.3.53-3.45l28.63-2.33c25.76-3.11,56.35-12.67,75.98-28.55,2.14-1.55,4.28-3.37,6.34-5.13,5.19-4.42,10.56-8.99,16.72-10.2.06-.01.13-.02.19-.03,20.99-2,42.01,24.12,46.85,31.52,4.74,7.25,17.25,18.35,17.59,44.08,0,0,.22,145.5.22,145.5.16,7.5.51,15.32,2.9,22.48,2.65,7.94,8.74,13.27,15.22,18.18,5.47,4.15,12.93,9.7,20.19,9.4h0c.83-.04,1.52-.63,1.68-1.44,4.42-21.96,3.43-153.48,3.42-168.83-.02-30.43.11-54.69,3.24-67.92,0-.04.02-.07.02-.11,6.3-38.73,62.72-38.91,92.11-38.72,12.99.08,83.58.1,151.81.1,1.63,6.49,7.48,11.31,14.48,11.31s12.86-4.82,14.48-11.31c54.2,0,101.09-.02,107.9-.02h6.21v-6.46h-113.93ZM331.41,692.19c-8.92,0-16.15-7.23-16.15-16.15s7.23-16.15,16.15-16.15,16.15,7.23,16.15,16.15-7.23,16.15-16.15,16.15ZM552.04,487.1c-.46-.23-.93-.46-1.4-.68-12.73-6.06-25.98-11.15-39.73-14.35-11.83-2.75-23.73-3.43-35.81-4.11-15.75-.54-31.5-1.09-47.25-1.63-1.13-.04-2.6-.08-4.16-.13-4.87-.15-8.04-5.18-6.09-9.64,1.8-4.12,3.81-8.71,5.13-11.68,4.97-11.22,9.95-22.44,14.92-33.66,6.23-14.05,12.45-28.09,18.68-42.14,6.51-14.69,13.02-29.37,19.53-44.06,5.83-13.14,11.65-26.28,17.47-39.42,4.17-9.41,8.34-18.81,12.51-28.22,1.15-2.58,2.29-5.17,3.44-7.75.19-.43.75-2.5,1.2-2.72.24-.11.48-.19.72-.24l.16-.04c2.88-.76,6.16,4.59,7.56,7.82,4.63,10.08,8.84,19.25,13.9,29.15,16.3,34.99,32.9,69.94,49.5,104.6,13.49,28.43,26.36,56.09,40.14,84.29,8.12,18.55,17.41,36.45,24.58,55.35,9.29,25.37,9.81,47.72-21.59,54.36-2.95.65-5.49,1.1-7.67,1.35-14.46,1.6-13.61-5.6-14.57-22.73-1.8-32.34-22.89-59.73-51.2-73.76ZM962.52,631.38c-3.32,0-6.17-1.93-7.53-4.73-.13-.27-.24-.54-.34-.82,0-.02-.01-.03-.02-.05-.09-.26-.17-.52-.23-.79-.01-.04-.02-.08-.03-.13-.06-.24-.1-.49-.13-.74,0-.06-.02-.12-.03-.18-.03-.3-.05-.61-.05-.93,0-.26.02-.53.04-.78.02-.16.04-.31.06-.47.01-.09.02-.18.04-.26.04-.2.08-.41.14-.6,0-.03.01-.05.02-.08.06-.22.13-.44.21-.65,1.17-3.22,4.24-5.52,7.86-5.52s6.69,2.3,7.86,5.52c.08.21.15.43.21.65,0,.03.01.05.02.08.05.2.1.4.14.6.02.09.03.18.04.27.02.15.05.31.06.46.02.26.04.52.04.78,0,.31-.02.62-.05.93,0,.06-.02.12-.03.18-.03.25-.07.5-.13.75,0,.04-.02.08-.03.13-.07.27-.14.53-.23.79,0,.02-.01.03-.02.05-.1.28-.22.55-.34.82-1.35,2.8-4.21,4.73-7.53,4.73Z";

const MEETS_PATHS = [
  "M105.41,449.17l-5.29-49.78-20.91,46.34h-.34l-23.13-44.47-2.39,24.03c-1.11,10.48-1.02,17.89-.34,23.88h-5.12c1.54-5.99,2.65-13.47,3.75-23.96l2.73-26.8-1.88-3.52v-.22h9.39l20.57,40.05,18.01-40.05h7.85l5.8,54.5h-8.7Z",
  "M162.33,444.15l-1.62,5.02h-36.78v-54.5h35.76l1.02,4.72h-.17c-7.85-2.32-15.79-3.37-23.21-3.37h-4.69v24.1h3.93c9.22,0,15.28-.52,17.92-1.5h.17v4.64h-.17c-2.65-.97-8.71-1.8-17.92-1.8h-3.93v26.35h4.95c7.34,0,16.39-.97,24.58-3.67h.17Z",
  "M208.33,444.15l-1.62,5.02h-36.78v-54.5h35.76l1.02,4.72h-.17c-7.85-2.32-15.79-3.37-23.21-3.37h-4.69v24.1h3.93c9.22,0,15.28-.52,17.92-1.5h.17v4.64h-.17c-2.65-.97-8.71-1.8-17.92-1.8h-3.93v26.35h4.95c7.34,0,16.39-.97,24.58-3.67h.17Z",
  "M256.72,399.99h-.17c-6.83-2.84-11.61-3.97-16.73-3.97h-1.96v53.15h-8.71v-53.15h-2.05c-5.12,0-9.9,1.12-16.73,3.97h-.17l1.19-5.32h44.21l1.11,5.32Z",
  "M259.02,446.1l1.54-4.72c4.1,4.42,12.2,7.49,19.12,7.49,8.28,0,13.91-4.49,13.91-10.63,0-7.19-7.34-10.41-13.65-12.95l-4.27-1.65c-6.74-2.69-15.7-6.59-15.7-15.5,0-8.23,7.77-14.37,19.63-14.37,7,0,13.91,2.17,17.41,3.97l-1.37,4.19c-3.75-3.44-9.9-6.96-16.98-6.96-7.94,0-12.46,4.34-12.46,9.58,0,6.44,6.49,9.28,13.31,12.05l4.27,1.72c7.68,3.14,15.96,6.74,15.96,16.02s-8.79,15.72-20.82,15.72c-7.42,0-16.04-2.25-19.88-3.97Z",
];

const DESIGN_PATHS = [
  "M856.87,672.23c0,17.79-13.22,28.16-34.17,28.16h-20.18v-55.11h21.62c19.58,0,32.72,9.46,32.72,26.95ZM847.37,672.61c0-15.59-9.41-26.12-23.99-26.12h-12.21v52c2.2.45,6.19.68,12.97.68,14.75,0,23.23-9.61,23.23-26.57Z",
  "M904.43,695.32l-1.61,5.07h-36.54v-55.11h35.52l1.02,4.77h-.17c-7.8-2.35-15.68-3.41-23.06-3.41h-4.66v24.38h3.9c9.16,0,15.17-.53,17.8-1.51h.17v4.69h-.17c-2.63-.98-8.65-1.82-17.8-1.82h-3.9v26.65h4.92c7.29,0,16.28-.98,24.42-3.71h.17Z",
  "M908.67,697.29l1.53-4.77c4.07,4.47,12.12,7.57,18.99,7.57,8.22,0,13.82-4.54,13.82-10.75,0-7.27-7.29-10.52-13.56-13.1l-4.24-1.67c-6.7-2.72-15.6-6.66-15.6-15.67,0-8.33,7.71-14.53,19.5-14.53,6.95,0,13.82,2.2,17.29,4.01l-1.36,4.24c-3.73-3.48-9.83-7.04-16.87-7.04-7.88,0-12.38,4.39-12.38,9.69,0,6.51,6.44,9.39,13.23,12.19l4.24,1.74c7.63,3.18,15.85,6.81,15.85,16.2s-8.73,15.9-20.69,15.9c-7.38,0-15.94-2.27-19.75-4.01Z",
  "M957.76,645.28h8.65v55.11h-8.65v-55.11Z",
  "M1032.79,675.41v19c-5.43,3.56-13.14,6.89-24.08,6.89-19.75,0-32.98-10.37-32.98-28.08s13.99-28.84,32.47-28.84c9.92,0,18.23,3.79,23.23,8.86l-4.24,3.41c-4.24-6.36-10.94-11.05-19.75-11.05-13.56,0-22.21,10.67-22.21,27.1s9.5,27.25,23.91,27.25c6.19,0,11.95-1.89,15.68-4.54v-18.62h-14.16l-.93-1.36h23.06Z",
  "M1086.71,645.28c-1.1,6.06-1.7,13.47-1.7,24.07v31.94h-.76l-39.25-48.52v23.54c0,10.6.51,18.02,1.7,24.07h-5.09c1.1-6.06,1.7-13.47,1.7-24.07v-25.66l-4.15-5.15v-.23h10.26l33.91,42.69v-18.62c0-10.6-.51-18.02-1.7-24.07h5.09Z",
];

// Words: light grey/white, a fraction transparent. Symbol: translucent glass
// like the old "Art", a little more solid than before.
const WORD_FILL = "rgba(237,234,227,0.88)";
const SYMBOL_FILL = "rgba(237,232,223,0.44)";
// Fine bevel (light top edge, dark bottom edge) + a distinct, tighter cast
// shadow (dropped further, less blur). Values in SVG user units — the mark is
// ~342px over a 1098-unit box (~0.31 scale).
const SYMBOL_FILTER =
  "drop-shadow(0 42px 20px rgba(0,0,0,0.6)) drop-shadow(0 -2.5px 1.5px rgba(255,253,248,0.5)) drop-shadow(0 3px 2px rgba(0,0,0,0.65))";
const WORD_FILTER = "drop-shadow(0 3px 6px rgba(0,0,0,0.55))";

const DRIFT = [
  { el: ".hero-sub",     x: 40,   y: 30,  delay: 5.0  },
  { el: ".hero-loc-1",   x: -50,  y: 20,  delay: 5.3  },
  { el: ".hero-loc-2",   x: 30,   y: -15, delay: 5.45 },
  { el: ".hero-loc-3",   x: -20,  y: 35,  delay: 5.6  },
  { el: ".hero-loc-4",   x: 50,   y: -25, delay: 5.75 },
  { el: ".hero-eyebrow", x: 0,    y: 12,  delay: 6.1  },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const [layerIdx, setLayerIdx] = useState(() => [0, 1 % SLIDES.length]);
  const [active, setActive] = useState(0);
  const idxRef = useRef(0);
  const layerRefs = useRef([null, null]);
  const [slideshowReady, setSlideshowReady] = useState(false);
  const lenis = useLenis();

  // Reveal the slideshow once the intro has settled.
  useEffect(() => {
    const t = setTimeout(() => setSlideshowReady(true), 2800);
    return () => clearTimeout(t);
  }, []);

  // Crossfade using only two decode-gated image layers (see the old hero notes).
  useEffect(() => {
    if (!slideshowReady) return;
    let cancelled = false;
    const id = setTimeout(async () => {
      const nextSlide = (idxRef.current + 1) % SLIDES.length;
      const incoming = active === 0 ? 1 : 0;
      flushSync(() => setLayerIdx((prev) => { const n = [...prev]; n[incoming] = nextSlide; return n; }));
      const el = layerRefs.current[incoming];
      if (el) { try { await el.decode(); } catch { /* fall through */ } }
      if (cancelled) return;
      idxRef.current = nextSlide;
      setActive(incoming);
    }, INTERVAL);
    return () => { cancelled = true; clearTimeout(id); };
  }, [active, slideshowReady]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Mark starts fully hidden — symbol invisible, words parked off to the side.
    const parkMark = () => {
      gsap.set("#hero-art-symbol", { opacity: 0 });
      gsap.set("#hero-meets", { opacity: 0, x: -150 });
      gsap.set("#hero-design", { opacity: 0, x: 150, y: 90 });
    };

    const runDrift = () => {
      DRIFT.forEach(({ el, x, y, delay }) => {
        gsap.fromTo(el, { x, y, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.6, delay, ease: "power2.out" });
      });

      // The mark sequence: ART glass fades in, MEETS flies in, then DESIGN.
      // Slow and deliberate — the symbol materialises before the words arrive.
      parkMark();
      const tl = gsap.timeline();
      tl.to("#hero-art-symbol", { opacity: 1, duration: 2.6, ease: "power2.out" }, 0.5);
      tl.to("#hero-meets",  { opacity: 1, x: 0,        duration: 1.5, ease: "power3.out" }, 2.9);
      tl.to("#hero-design", { opacity: 1, x: 0, y: 0,  duration: 1.5, ease: "power3.out" }, 4.4);
    };

    const resetDrift = () => {
      DRIFT.forEach(({ el, x, y }) => gsap.set(el, { x, y, opacity: 0 }));
      parkMark();
    };

    resetDrift();

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) runDrift(); else resetDrift(); },
      { threshold: 0.3 }
    );
    observer.observe(section);

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.to(".hero-content", {
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1 },
            y: -60, opacity: 0,
          });
        },
      });
    }, sectionRef);

    return () => { observer.disconnect(); ctx.revert(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-dvh w-full overflow-hidden flex items-end">

      {/* Slideshow — two crossfading layers */}
      <div className="absolute inset-0 bg-charcoal">
        {[0, 1].map((layer) => (
          <img
            key={layer}
            ref={(el) => (layerRefs.current[layer] = el)}
            data-prerender-hero
            src={netlifyImg(SLIDES[layerIdx[layer]], { w: 1600, q: 82 })}
            alt={layer === 0 ? "ROGETjames — Wall Art & Sculpture" : ""}
            aria-hidden={layer !== 0}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: slideshowReady && active === layer ? 1 : 0, transition: `opacity ${FADE_DURATION}s linear`, willChange: "opacity", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
            loading={layer === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={layer === 0 ? "high" : "auto"}
          />
        ))}
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">

        <div className="max-w-4xl">

          {/* ART meets design mark — symbol + words on the shared 1133.86 artboard.
              viewBox cropped to the drawn content (+ headroom for the shadow). */}
          <svg
            className="hero-mark block"
            style={{ width: "clamp(216px, 27vw, 342px)", height: "auto", overflow: "visible", marginBottom: "1.75rem" }}
            viewBox="18 150 1098 880"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="ART meets design"
            role="img"
          >
            <path id="hero-art-symbol" d={ART_SYMBOL} style={{ fill: SYMBOL_FILL, filter: SYMBOL_FILTER }} />
            <g id="hero-meets" style={{ fill: WORD_FILL, filter: WORD_FILTER }}>
              {MEETS_PATHS.map((d, i) => <path key={i} d={d} />)}
            </g>
            <g id="hero-design" style={{ fill: WORD_FILL, filter: WORD_FILTER }}>
              {DESIGN_PATHS.map((d, i) => <path key={i} d={d} />)}
            </g>
          </svg>

          <p className="hero-sub font-body text-white text-base md:text-lg max-w-lg mt-6 md:mt-8 leading-relaxed" style={{ opacity: 0, textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)" }}>
            Original laser-cut wall art, sculpture &amp; architectural features — curated catalogues and bespoke works, crafted in Australia.
          </p>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col gap-1.5">
          {[
            ["hero-loc-1", "Perth"],
            ["hero-loc-2", "Gold Coast"],
            ["hero-loc-3", "Melbourne"],
            ["hero-loc-4", "Delivery · Australia · Wide"],
          ].map(([cls, label]) => (
            <span key={cls} className={`${cls} font-detail text-xs text-cream/70 uppercase tracking-[0.25em]`} style={{ opacity: 0 }}>
              {label}
            </span>
          ))}

          {/* Eyebrow — mobile only, below the location list */}
          <p className="hero-eyebrow md:hidden mt-4 font-heading font-semibold text-[10px] text-cream/75 uppercase tracking-[0.35em]" style={{ opacity: 0 }}>
            Original Laser Cut Wall Art &amp; Sculpture
          </p>
        </div>
      </div>

      {/* Eyebrow — desktop: centered at the bottom of the section */}
      <p
        className="hero-eyebrow hidden md:block absolute inset-x-0 text-center font-heading font-semibold text-xs text-cream/75 uppercase tracking-[0.9em] pointer-events-none"
        style={{ opacity: 0, bottom: "2rem", whiteSpace: "nowrap", wordSpacing: "0.4em" }}
      >
        Original Laser Cut Wall Art &amp; Sculpture
      </p>

      {/* Scroll indicator */}
      <button
        aria-label="Scroll down"
        onClick={() => lenis?.scrollTo(document.querySelector("#collection"), { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) })}
        className="absolute bottom-6 right-6 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
        style={{ background: "transparent", color: "rgba(237,232,223,0.5)", border: "1.5px solid rgba(158, 113, 52,0.4)", animation: "scrollDot 1.8s ease-in-out infinite" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#9E7134"; e.currentTarget.style.color = "#EDE8DF"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 16px rgba(158, 113, 52,0.35)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(158, 113, 52,0.4)"; e.currentTarget.style.color = "rgba(237,232,223,0.5)"; e.currentTarget.style.boxShadow = "none"; }}
        onMouseDown={(e) => { e.currentTarget.style.background = "#9E7134"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 20px rgba(158, 113, 52,0.4)"; }}
        onMouseUp={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 16px rgba(158, 113, 52,0.35)"; }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
