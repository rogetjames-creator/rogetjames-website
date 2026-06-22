import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import RojLogoAnimation from "./RojLogoAnimation";

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  "/images/hero/hero-banksia-oldmanis.jpg",
  "/images/hero/hero-bambu.jpg",
  "/images/hero/hero-creeping-fig-autumn-1.jpg",
  "/images/hero/hero-creeping-fig-autumn-2.jpg",
  "/images/hero/hero-creeping-fig-grande.jpg",
  "/images/hero/hero-gren-wide.jpg",
  "/images/hero/hero-gren-free.jpg",
  "/images/hero/hero-obliationes.jpg",
  "/images/hero/hero-rue-1.jpg",
  "/images/hero/hero-rue-3rd.jpg",
  "/images/hero/hero-seaweed.jpg",
  "/images/hero/hero-vasuki.jpg",
  "/images/marakesh/marakesh-promo.jpg",
];

const INTERVAL = 5000;
const FADE_DURATION = 2.5;

const DRIFT = [
  { el: ".hero-line-1",  x: -80,  y: 0,   delay: 0.45 },
  { el: ".hero-line-2",  x: 60,   y: 40,  delay: 0.65 },
  { el: ".hero-sub",     x: 40,   y: 30,  delay: 0.9  },
  { el: ".hero-loc-1",   x: -50,  y: 20,  delay: 1.15 },
  { el: ".hero-loc-2",   x: 30,   y: -15, delay: 1.28 },
  { el: ".hero-loc-3",   x: -20,  y: 35,  delay: 1.41 },
  { el: ".hero-loc-4",   x: 50,   y: -25, delay: 1.54 },
  { el: ".hero-eyebrow", x: 0,    y: 12,  delay: 3.4  },
];

export default function Hero() {
  const sectionRef    = useRef(null);
  const underlineRef  = useRef(null);
  const _lottieLogoRef = useRef(null);
  const logoTimerRef  = useRef(null);
  const [current, setCurrent] = useState(0);
  const [slideshowReady, setSlideshowReady] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [logoHolding, setLogoHolding] = useState(false);
  const lenis = useLenis();

  // Slideshow — fades in as text settles, cycles after full interval
  useEffect(() => {
    let timer;
    const startDelay = setTimeout(() => {
      setSlideshowReady(true);
      timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), INTERVAL);
    }, 2800);
    return () => { clearTimeout(startDelay); clearInterval(timer); };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const runDrift = () => {
      DRIFT.forEach(({ el, x, y, delay }) => {
        gsap.fromTo(el, { x, y, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.6, delay, ease: "power2.out" });
      });

      // Underline: waits for "meets design." to settle, grows L→R, then flies off right
      const ul = underlineRef.current;
      if (ul) {
        gsap.set(ul, { scaleX: 0, x: 0, transformOrigin: "left center", opacity: 1 });
        const tl = gsap.timeline({ delay: 2.4 });
        tl.to(ul, { scaleX: 1, duration: 0.7, ease: "power3.out" });
        tl.to(ul, { x: 320, opacity: 0, duration: 0.55, ease: "power2.in" }, "+=0.35");
      }

      setLogoVisible(true);
    };

    const resetDrift = () => {
      DRIFT.forEach(({ el, x, y }) => gsap.set(el, { x, y, opacity: 0 }));
      if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 0, x: 0, opacity: 1 });
      clearTimeout(logoTimerRef.current);
      setLogoVisible(false);
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

      {/* Slideshow */}
      <div className="absolute inset-0 bg-charcoal">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? "ROGETjames — Wall Art & Sculpture" : ""}
            aria-hidden={i !== 0}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: slideshowReady && i === current ? 1 : 0, transition: `opacity ${FADE_DURATION}s ease-in-out` }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">

        <div className="max-w-4xl">

          {/* ROJ logo — portalled to body so GSAP parallax doesn't trap fixed positioning */}
          {createPortal(
            <span style={{ position: "fixed", top: 76, left: "50%", transform: "translateX(-50%)", opacity: logoVisible ? 1 : 0, transition: "opacity 1.4s ease", pointerEvents: "none", width: 124, height: 124, zIndex: 99 }}>
              <RojLogoAnimation visible={logoVisible} onHoldChange={setLogoHolding} />
            </span>,
            document.body
          )}
          {/* Glass fog fill — own portal so backdrop-filter is not trapped inside opacity-animated parent */}
          {createPortal(
            <div style={{
              position: "fixed",
              top: 78,
              left: "50%",
              transform: "translateX(-50%)",
              width: 101,
              height: 119,
              borderRadius: "23px",
              background: "rgba(237,232,223,0.07)",
              backdropFilter: "blur(28px) brightness(1.06) saturate(0.85)",
              WebkitBackdropFilter: "blur(28px) brightness(1.06) saturate(0.85)",
              opacity: logoVisible && logoHolding ? 1 : 0,
              transition: "opacity 1.4s ease",
              pointerEvents: "none",
              zIndex: 98,
            }} />,
            document.documentElement
          )}

          <h1 className="flex items-center">
            <span className="hero-line-2 font-drama italic text-5xl md:text-8xl lg:text-[10rem] leading-[0.85]" style={{
              color: "rgba(237,232,223,0.18)",
              textShadow: "0 -1px 1px rgba(255,253,248,0.22), 0 1px 1px rgba(0,0,0,0.28)",
              opacity: 0,
            }}>
              Art
            </span>
            <span className="hero-line-1 font-heading font-bold text-cream/70 text-xl md:text-4xl leading-tight ml-3 md:ml-4 relative inline-block" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.45)", opacity: 0 }}>
              meets design.
              <span
                ref={underlineRef}
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  right: 0,
                  height: "1.5px",
                  background: "rgba(242,240,233,0.4)",
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  display: "block",
                }}
              />
            </span>
          </h1>

          <p className="hero-sub font-body text-cream/85 text-base md:text-lg max-w-lg mt-6 md:mt-8 leading-relaxed" style={{ opacity: 0 }}>
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
        </div>
      </div>

      {/* Eyebrow — centered on screen, at Gold Coast row level, fades in after all transitions */}
      <p
        className="hero-eyebrow absolute left-1/2 font-heading font-semibold text-xs text-cream/75 uppercase tracking-[0.9em] pointer-events-none" style={{ opacity: 0 }}
        style={{ bottom: "7.5rem", transform: "translateX(-50%)", whiteSpace: "nowrap", wordSpacing: "0.4em" }}
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
