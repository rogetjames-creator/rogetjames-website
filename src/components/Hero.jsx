import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { netlifyImg } from "../utils/img";
import {
  ART_SYMBOL, WORD_FILL, SYMBOL_FILL, CAST_SHADOW, SYMBOL_FILTER,
  SEQUENCE, leftSlot, rightSlot, cellsFor, MEETS_CELLS, DESIGN_CELLS,
  FLIP_EVERY, FLIP_STAGGER, FLIP_DOWN, FLIP_UP,
} from "./heroMark";
import { HERO_SLIDES } from "./heroSlides";
import { MEDIA_KEYS } from "../mediaDestinations";

// Homepage hero. James's "ART meets design" vector mark: the glass ART symbol
// fades in, MEETS flies in, then DESIGN, all on the original 1133.86 artboard so
// the symbol's small circle lands as the dot over the "i" in DESIGN. After the
// entrance the two words run as a split-flap board, changing every 6s through
// SEQUENCE. The frozen pre-mark hero lives in HeroClassic.jsx (rollback).

gsap.registerPlugin(ScrollTrigger);

// Built-in slide srcs, from the shared list. The live list (BASE + any /media
// hero uploads) is resolved inside the component so replacements and additions
// apply to the whole slideshow, not just the first slide.
const BASE_SLIDES = HERO_SLIDES.map((s) => s.src);

const INTERVAL = 3000;
const FADE_DURATION = 1.6;
// The opening fade of the first photo — slower and eased, so the hero arrives
// gently rather than snapping on.
const INITIAL_FADE = 2.8;
const INITIAL_EASE = "cubic-bezier(0.33, 0, 0.2, 1)";
// How long the opening image is held before the slideshow starts advancing.
// The entrance finishes around 8.9s; hold ~1s past that so the slideshow kicks
// in just after the "ART meets design" mark has settled.
const INTRO_HOLD = 9900;

// ART meets design mark — paths lifted verbatim from James's Illustrator SVGs
// (symbol: "…symbol with O no words"; words: "Meets design outlines"), all on
// the shared 1133.86 artboard so nothing shifts relative to the symbol.

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
// Delays are measured from the moment the first hero photo arrives, not from
// page load — the whole intro is triggered by the image, so the mark always
// materialises over the picture rather than over black.
// ── Flip-board word sets ──────────────────────────────────────────────
// Every FLIP_EVERY seconds both slots flip to the next pair, letter by letter,
// like an analogue departure board. Words come from heroWords.js (James's
// outlined SVG), each normalised to left edge x=0 and baseline y=0.
//
// Anchoring — both words grow OUTWARD from the ART symbol:
//   MEETS slot  — right-aligned: every word ENDS where the S of MEETS ends.
//   DESIGN slot — left-aligned:  every word STARTS where the D of DESIGN starts.
// Four word positions on the mark — above/below the extended T (right arm) and
// above/below the extended R (left arm). Each phrase can place its left and
// right word in any of these; the default is the original layout (left word
// above the R at upper-left, right word below the T at lower-right).
// The pairs shown, in order — James's sequence, exactly as given. Left word sits
// above-left of the symbol, right word below-right, so each reads ART <l> <r>.
// The two phrases the mark cycles, in order. Left word sits above-left of the
// ART symbol, right word below-right, so each reads ART <l> <r>. This array is
// the single source of truth — the opener, the letter-cell counts and the flip
// loop all derive from it, so changing the phrases here changes everything with
// no other edit. Any word used must exist in heroWords.js.
// [left, right, leftPos?, rightPos?] — position keys default to the original
// layout. The opener puts MEETS above the T and DESIGN below it; the rest keep
// the original diagonal.
// Resolve a word to positioned cells: each letter's glyph plus its x on the
// artboard, honouring the slot's anchor.

const FLIP_START_DELAY = 9.5;

const DRIFT = [
  { el: ".hero-sub",     x: 40,   y: 30,  delay: 6.2  },
  { el: ".hero-loc-1",   x: -50,  y: 20,  delay: 6.5  },
  { el: ".hero-loc-2",   x: 30,   y: -15, delay: 6.65 },
  { el: ".hero-loc-3",   x: -20,  y: 35,  delay: 6.8  },
  { el: ".hero-loc-4",   x: 50,   y: -25, delay: 6.95 },
  { el: ".hero-eyebrow", x: 0,    y: 12,  delay: 7.3  },
];

export default function Hero() {
  const sectionRef = useRef(null);
  // The live slide list: built-in slides with any /media hero uploads applied.
  // `hero-replace-<key>` uploads swap that slide; `hero` uploads are appended.
  const [slides, setSlides] = useState(BASE_SLIDES);
  const [layerIdx, setLayerIdx] = useState(() => [0, 1 % BASE_SLIDES.length]);
  const [active, setActive] = useState(0);
  const idxRef = useRef(0);
  const layerRefs = useRef([null, null]);
  // False until the slideshow has advanced past the opening image.
  const advancedRef = useRef(false);
  const preloadRef = useRef(null);
  // Guards the intro so it plays once per entry, whichever trigger gets there
  // first — the direct call on image-ready or the IntersectionObserver.
  const playedRef = useRef(false);
  // True once the FIRST hero photo has actually arrived. This — not a timer —
  // is what fades the picture up and triggers the ART meets design entrance.
  const [heroImageReady, setHeroImageReady] = useState(false);
  // The very first reveal fades slower and on a soft curve; later slide-to-slide
  // crossfades go back to the quicker linear fade.
  const [firstFadeDone, setFirstFadeDone] = useState(false);
  const lenis = useLenis();

  // Merge in /media hero uploads: `hero-replace-<key>` swaps that slide's image,
  // `hero` appends a new slide. Reads the same two sources the galleries use
  // (git-committed manifest + live blob list). Purely additive — a failed fetch
  // leaves the built-in slides untouched.
  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/media-manifest.json?v=${Date.now()}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/media-list").then((r) => r.json()).catch(() => ({ images: [] })),
    ]).then(([manifest, legacy]) => {
      if (!alive) return;
      const uploads = [
        ...(Array.isArray(manifest) ? manifest.map((e) => ({ dest: e.destinations || [], src: `/${e.path}`, t: e.createdTime || "" })) : []),
        ...(Array.isArray(legacy.images) ? legacy.images.map((i) => ({ dest: i.destinations || [], src: i.src, t: i.createdTime || "" })) : []),
      ];
      const HERO = MEDIA_KEYS.hero, HREP = MEDIA_KEYS.heroReplacePrefix;
      if (!uploads.some((u) => u.dest.some((d) => d === HERO || d.startsWith(HREP)))) return;
      // Latest upload wins per replace-key.
      const byKey = {};
      uploads.forEach((u) => u.dest.forEach((d) => {
        if (d.startsWith(HREP)) {
          const k = d.slice(HREP.length);
          if (!byKey[k] || u.t > byKey[k].t) byKey[k] = u;
        }
      }));
      const resolved = HERO_SLIDES.map((s) => (byKey[s.key] ? byKey[s.key].src : s.src));
      const seen = new Set(resolved);
      const added = uploads
        .filter((u) => u.dest.includes(HERO))
        .sort((a, b) => (a.t < b.t ? -1 : 1))
        .map((u) => u.src)
        .filter((src) => (seen.has(src) ? false : (seen.add(src), true)));
      setSlides([...resolved, ...added]);
    });
    return () => { alive = false; };
  }, []);

  // Catch the first photo landing. onLoad covers the normal case; this covers a
  // cached image (already complete before onLoad could attach), and the second
  // timer is a fallback so a slow/failed image can never leave the hero empty.
  useEffect(() => {
    const cached = setTimeout(() => {
      if (layerRefs.current[0]?.complete) setHeroImageReady(true);
    }, 0);
    const fallback = setTimeout(() => setHeroImageReady(true), 6000);
    return () => { clearTimeout(cached); clearTimeout(fallback); };
  }, []);

  // Once the photo is up, let the slow opening fade finish before handing over
  // to the quicker linear crossfade used between slides.
  useEffect(() => {
    if (!heroImageReady) return;
    const t = setTimeout(() => setFirstFadeDone(true), INITIAL_FADE * 1000);
    return () => clearTimeout(t);
  }, [heroImageReady]);

  // Flip board — every FLIP_EVERY seconds each word changes letter by letter.
  // A cell collapses on its own centre line (the seam), swaps its glyph at the
  // closed point, then opens again, staggered left-to-right across the word.
  useEffect(() => {
    if (!heroImageReady) return;
    const at = { i: 0 };

    const flipSlot = (slot, key) => {
      const host = document.getElementById(slot.id);
      if (!host) return;
      const cells = [...host.querySelectorAll(".flip-cell")];
      const next = cellsFor(slot, key);
      cells.forEach((cell, i) => {
        const path = cell.querySelector("path");
        const target = next[i];
        // The transform is written by hand rather than through GSAP's transform
        // system: glyphs are normalised so the baseline sits at local y=0, so
        // scale(1, sy) collapses the letter straight down onto the line and back.
        // GSAP's own scaleY caches a bbox-derived origin, which goes stale the
        // moment the glyph changes — that is what made letters wander.
        const st = { sy: 1, x: parseFloat(cell.dataset.x || "0") };
        const write = () => cell.setAttribute(
          "transform", `translate(${st.x} ${slot.baseline}) scale(1 ${st.sy})`);
        gsap.timeline({ delay: i * FLIP_STAGGER })
          .to(st, { sy: 0, duration: FLIP_DOWN, ease: "power2.in", onUpdate: write })
          // darken at the closed point, the way a flap catches shadow mid-turn
          .to(cell, { opacity: 0.55, duration: 0.01 }, "<0.14")
          .add(() => {
            // swapped while the flap is shut, so the move is never seen
            path.setAttribute("d", target ? target.d : "");
            if (target) { st.x = target.x; cell.dataset.x = target.x; }
            write();
          })
          .to(st, { sy: target ? 1 : 0, duration: FLIP_UP, ease: "power2.out", onUpdate: write })
          .to(cell, { opacity: target ? 1 : 0, duration: FLIP_UP * 0.6 }, "<");
      });
    };

    // Drop a word into a slot instantly, with no flip — used while the words are
    // hidden, just before they fly back in.
    const setSlot = (slot, key) => {
      const host = document.getElementById(slot.id);
      if (!host) return;
      const cells = [...host.querySelectorAll(".flip-cell")];
      const next = cellsFor(slot, key);
      cells.forEach((cell, i) => {
        const t = next[i];
        cell.querySelector("path").setAttribute("d", t ? t.d : "");
        if (t) cell.dataset.x = t.x;
        cell.setAttribute("transform", `translate(${t ? t.x : 0} ${slot.baseline}) scale(1 1)`);
        cell.style.opacity = t ? 1 : 0;
      });
    };

    // The opening phrase reads best if you watch it assemble — ART, then the
    // left word, then the right. So when the loop comes back to SEQUENCE[0] the
    // pair is not flipped into place: the words clear, then fly in one after the
    // other exactly as they do on first load. ART stays put throughout.
    const flyInOpening = () => {
      const entry = SEQUENCE[0];
      const [l, r] = entry;
      gsap.timeline()
        .to(["#hero-meets", "#hero-design"], { opacity: 0, duration: 0.5, ease: "power2.in" })
        .add(() => { setSlot(leftSlot(entry), l); setSlot(rightSlot(entry), r); })
        .set("#hero-meets",  { x: -150 })
        .set("#hero-design", { x: 150, y: 90 })
        .to("#hero-meets",  { opacity: 1, x: 0,       duration: 1.5, ease: "power3.out" })
        .to("#hero-design", { opacity: 1, x: 0, y: 0, duration: 1.5, ease: "power3.out" });
    };

    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        at.i = (at.i + 1) % SEQUENCE.length;
        if (at.i === 0) { flyInOpening(); return; }
        const entry = SEQUENCE[at.i];
        const [l, r] = entry;
        flipSlot(leftSlot(entry), l);
        flipSlot(rightSlot(entry), r);
      }, FLIP_EVERY * 1000);
    }, FLIP_START_DELAY * 1000);
    return () => { clearTimeout(start); clearInterval(interval); };
  }, [heroImageReady]);

  // Preload the next slide while the current one is showing so decode() finds it
  // in cache and doesn't stall the crossfade.
  useEffect(() => {
    if (!heroImageReady) return;
    const next = (idxRef.current + 1) % slides.length;
    const src = netlifyImg(slides[next] ?? BASE_SLIDES[0], { w: 1600, q: 82 });
    const img = new Image();
    img.src = src;
    preloadRef.current = img;
  }, [active, heroImageReady, slides]);

  // Crossfade using only two decode-gated image layers (see the old hero notes).
  // The opening image is held until the mark has finished arriving, so the whole
  // entrance plays over the first photo instead of being cut off by a slide change.
  useEffect(() => {
    if (!heroImageReady) return;
    let cancelled = false;
    const id = setTimeout(async () => {
      advancedRef.current = true;
      const nextSlide = (idxRef.current + 1) % slides.length;
      const incoming = active === 0 ? 1 : 0;
      flushSync(() => setLayerIdx((prev) => { const n = [...prev]; n[incoming] = nextSlide; return n; }));
      const el = layerRefs.current[incoming];
      if (el) { try { await el.decode(); } catch { /* fall through */ } }
      if (cancelled) return;
      idxRef.current = nextSlide;
      setActive(incoming);
    }, advancedRef.current ? INTERVAL : INTRO_HOLD);
    return () => { cancelled = true; clearTimeout(id); };
    // slides.length is re-read on each advance (effect re-runs on `active`);
    // adding it as a dep would reset the crossfade timer when uploads merge.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, heroImageReady]);

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
      if (playedRef.current) return;
      playedRef.current = true;
      DRIFT.forEach(({ el, x, y, delay }) => {
        gsap.fromTo(el, { x, y, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.6, delay, ease: "power2.out" });
      });

      // The mark sequence: ART glass fades in, MEETS flies in, then DESIGN.
      // The opening fade is long and eased on a gentle sine so the symbol
      // emerges with the photo rather than appearing on it.
      parkMark();
      const tl = gsap.timeline();
      tl.to("#hero-art-symbol", { opacity: 1, duration: 4.2, ease: "sine.out" }, 0.6);
      tl.to("#hero-meets",  { opacity: 1, x: 0,        duration: 1.5, ease: "power3.out" }, 3.9);
      tl.to("#hero-design", { opacity: 1, x: 0, y: 0,  duration: 1.5, ease: "power3.out" }, 5.4);
    };

    const resetDrift = () => {
      playedRef.current = false;
      DRIFT.forEach(({ el, x, y }) => gsap.set(el, { x, y, opacity: 0 }));
      parkMark();
    };

    resetDrift();

    // Hold everything hidden until the first photo has landed — the image
    // arriving is what triggers the entrance.
    let observer;
    if (heroImageReady) {
      // Play straight away if the hero is on screen. Don't rely on the observer's
      // first callback for this — if it were ever missed the hero would sit blank.
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.7 && r.bottom > 0) runDrift();

      // The observer then only handles scrolling away and back.
      observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) runDrift(); else resetDrift(); },
        { threshold: 0.3 }
      );
      observer.observe(section);
    }

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

    return () => { observer?.disconnect(); ctx.revert(); };
  }, [heroImageReady]);

  return (
    <section ref={sectionRef} className="relative h-dvh w-full overflow-hidden flex items-end">

      {/* Slideshow — two crossfading layers */}
      <div className="absolute inset-0 bg-charcoal">
        {[0, 1].map((layer) => (
          <img
            key={layer}
            ref={(el) => (layerRefs.current[layer] = el)}
            data-prerender-hero
            src={netlifyImg(slides[layerIdx[layer]] ?? BASE_SLIDES[0], { w: 1600, q: 82 })}
            alt={layer === 0 ? "ROGETjames — Wall Art & Sculpture" : ""}
            aria-hidden={layer !== 0}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: heroImageReady && active === layer ? 1 : 0,
              transition: firstFadeDone
                ? `opacity ${FADE_DURATION}s linear`
                : `opacity ${INITIAL_FADE}s ${INITIAL_EASE}`,
              willChange: "opacity", transform: "translateZ(0)", backfaceVisibility: "hidden",
            }}
            onLoad={layer === 0 ? () => setHeroImageReady(true) : undefined}
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
            <g style={{ filter: CAST_SHADOW }}>
              <path id="hero-art-symbol" d={ART_SYMBOL} style={{ fill: SYMBOL_FILL, filter: SYMBOL_FILTER, opacity: 0 }} />
              <g id="hero-meets" style={{ fill: WORD_FILL, opacity: 0 }}>
                {Array.from({ length: MEETS_CELLS }, (_, i) => {
                  const c = cellsFor(leftSlot(SEQUENCE[0]), SEQUENCE[0][0])[i];
                  return (
                    <g key={i} className="flip-cell" data-x={c ? c.x : 0}
                       transform={`translate(${c ? c.x : 0} ${leftSlot(SEQUENCE[0]).baseline}) scale(1 1)`}
                       style={c ? undefined : { opacity: 0 }}>
                      <path d={c ? c.d : ""} />
                    </g>
                  );
                })}
              </g>
              <g id="hero-design" style={{ fill: WORD_FILL, opacity: 0 }}>
                {Array.from({ length: DESIGN_CELLS }, (_, i) => {
                  const c = cellsFor(rightSlot(SEQUENCE[0]), SEQUENCE[0][1])[i];
                  return (
                    <g key={i} className="flip-cell" data-x={c ? c.x : 0}
                       transform={`translate(${c ? c.x : 0} ${rightSlot(SEQUENCE[0]).baseline}) scale(1 1)`}
                       style={c ? undefined : { opacity: 0 }}>
                      <path d={c ? c.d : ""} />
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          <p className="hero-sub font-body text-white text-[15px] md:text-[17px] max-w-lg mt-6 md:mt-8 leading-relaxed" style={{ opacity: 0, textShadow: "0 2px 2px rgba(0,0,0,0.7)" }}>
            Original laser-cut wall art, sculpture &amp; architectural features — curated catalogues and bespoke works. Crafted in Australia for residential, commercial, architectural and landscape spaces.
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
