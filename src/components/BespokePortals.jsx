import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import { MiniPortal, CommissionsGalleryPopup } from "./DiscoverPortals";
import { ScreensGalleryModal, SculptureGalleryModal, ProjectsGalleryModal, ConceptsGalleryModal } from "./BespokeCommissions";

gsap.registerPlugin(ScrollTrigger);

const CDN_SC = "https://cdn.myportfolio.com/b2648aa0-9d7e-45a7-9f99-54d55b4ec92e";

const COMMISSIONS_GALLERY = [
  { src: "/images/villa-leaf/villa-leaf-trio-pool.jpg" },
  { src: "/images/hero/hero-cottesloe-patio.jpg" },
  { src: "/images/marakesh/marakesh-cassie.jpg" },
  { src: "/images/hex/lalarook-2.jpg" },
  { src: "/images/hero/hero-homebase-dusk.jpg" },
  { src: "/images/hero/hero-cottesloe-gate.jpg" },
];

const COMMISSIONS_PORTAL = {
  id: "commissions",
  label: "Commissions",
  sublabel: "Bespoke & Commercial",
  slides: [],
  videos: [
    { src: "/videos/natives-collage-2.mp4", title: "CUSTOM Natives — Collage", detail: "A commission in our native botanicals series — hand-composed and laser cut to order.", poster: "/images/concept-4-natives.jpg" },
    { src: "/videos/waroona.mp4",           title: "Waroona",                  detail: "", poster: "/images/reels/waroona-thumb.jpg" },
  ],
  commissionImages: COMMISSIONS_GALLERY,
  popupType: "commissions-gallery",
};

const SIDE_PORTAL_LEFT = {
  id: "side-left",
  label: "Screens",
  sublabel: "",
  slides: [
    { src: `/images/screens/orian-wall-decor.jpg`, pos: "5% 5%", scale: 1.5 },
    `/images/screens/strip/ferlie-close.jpg`,
    `/images/screens/strip/grail-close.jpg`,
    `/images/screens/wattle-close-tdl.jpg`,
    `/images/screens/viasi-close-up.jpg`,
    `/images/screens/elle-corten.jpg`,
    { src: `/images/bloom/bloom-closeup.jpg`, pos: "center top" },
  ],
};

const SIDE_PORTAL_RIGHT = {
  id: "side-right",
  label: "",
  sublabel: "",
  slides: [
    `${CDN_SC}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg?h=b0a0ebd2ca83e06d7b56e5fbee049be2`,
    `${CDN_SC}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a`,
    `${CDN_SC}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086`,
    `${CDN_SC}/7975db43-6e77-4a2d-8b33-6cdf7218ad48_rw_1920.jpg?h=263a833c03a447a8a37804176866e779`,
    "/images/hero/hero-marakesh-tall.jpg",
    `/images/homebase/homebase-motif-closeup.jpg`,
  ],
};

const SIDE_PORTAL_PROJECTS = {
  id: "side-projects",
  label: "Projects",
  sublabel: "",
  slides: [
    `/images/hero/hero-homebase-entrance.jpg`,
    `/images/hero/hero-homebase-dusk.jpg`,
    `${CDN_SC}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg?h=96bf8823ab48bc3e90055aef0b93ea1f`,
    `${CDN_SC}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg?h=1ef862e9145edcf101d46bcd4a02fb15`,
    `${CDN_SC}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg?h=bfcf87b6d12a3c5a71b0094e8fba92cd`,
  ],
};

const SIDE_PORTAL_CONCEPTS = {
  id: "side-concepts",
  label: "Concepts",
  sublabel: "",
  slides: [
    `${CDN_SC}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg?h=b4276b4f7952052c0cdbc1db1526c232`,
    `${CDN_SC}/713bf242-7075-4082-90cd-c885aa129107_rw_1920.jpg?h=a51d01c9d949978e58515742c345cd34`,
    `${CDN_SC}/882272cb-30b0-4cef-8f0e-dee3241578e3_rw_1920.jpg?h=accf777e0802c55ffa064f37bb13befe`,
    `${CDN_SC}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg?h=8c83e1b4dca7446ea02465c6438a82e9`,
    `${CDN_SC}/39f2b9a7-cf77-4a54-a88e-a92948a82ebe_rw_1920.jpg?h=9e5d420ad71060f91b222a0d11ac0a67`,
    "/images/homebase-concept-final.jpg",
    "/images/concepts-homebase-exterior.jpg",
    `${CDN_SC}/ba29da64-778e-4e6c-a942-02acff420a19_rw_1200.jpg?h=c81199c62bdc877ac5244d0b3b22f17f`,
    `${CDN_SC}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg?h=142926ed21c731745b66587a99e4c8e0`,
    `${CDN_SC}/4fe97b52-7eca-4995-a9b0-e9caa6d72967_rw_1920.jpg?h=e8870627f871e657b986a401d62100fe`,
    `${CDN_SC}/3ef7ea8e-eec1-4856-b37a-f2d23978aca3_rw_1920.jpg?h=6ec1f7e1ff1f709ad73ac4e78cf30736`,
    `${CDN_SC}/66a80833-aa96-4e7a-a62e-6ce882831573_rw_1200.jpg?h=b3a5cf5b979eb22dc56bd82cc14f5946`,
    `${CDN_SC}/9422ac0b-5ce1-4cca-83fc-660e854c3bb0_rw_1200.jpg?h=3b92abcf4f65601c8e5cd9872c6e3121`,
    `${CDN_SC}/04ac8236-413f-4590-a522-dfca01a94fe8_rw_1200.jpg?h=37ffcbb1ecba586da34b3acca113e525`,
    `${CDN_SC}/8b43f372-e1ca-4882-b630-bc0d985db4a7_rw_1200.jpg?h=c300bdda09947b73eb5e16f3aa004970`,
    `${CDN_SC}/437cf607-c821-4331-8874-d47ecda32ca3_rw_1920.jpg?h=c750d85f1ffad919b8eeefcb3ecfb597`,
    `${CDN_SC}/7c66f9e9-9682-4d93-8bb6-36aa19318e94_rw_1920.jpg?h=610337b8800e7a8f32bcb1e992b7da2e`,
    `${CDN_SC}/d8d96ede-c60e-4b48-991b-b80f157db3a5_rw_1920.jpg?h=3958d3517925745ac20a9c1ce75ff1c0`,
  ],
};

// Upside-down arch / pill portal — frosted glass with cycling image circle at top
function ArchPortal({ slides, fanOpen, onOpen }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 3200);
    return () => clearInterval(timer);
  }, [slides.length]);

  const W = 248, H = 340, circleSize = 210;

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: W, height: H,
        borderRadius: W / 2,
        background: "rgba(10,10,10,0.82)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.48)" : "rgba(255,255,255,0.17)"}`,
        boxShadow: hovered
          ? "inset 0 -4px 8px rgba(0,0,0,0.65), 0 8px 32px rgba(0,0,0,0.95), 0 0 0 4px #0a0a0a, 0 0 0 7px rgba(255,255,255,0.55)"
          : "inset 0 -4px 8px rgba(0,0,0,0.45), 0 8px 40px rgba(0,0,0,0.7), 0 0 0 4px #0a0a0a, 0 0 0 6px rgba(255,255,255,0.22)",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "15px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Circular image window */}
      <div style={{
        width: circleSize, height: circleSize,
        borderRadius: "50%",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.18)",
        flexShrink: 0,
        position: "relative",
        zIndex: 2,
      }}>
        {slides.map((slide, i) => {
          const src = typeof slide === "string" ? slide : slide.src;
          return (
            <img key={i} src={src} alt="" style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: i === slideIdx ? 1 : 0,
              transition: "opacity 1.4s ease",
            }} />
          );
        })}
      </div>

      {/* Label */}
      <div style={{ marginTop: "16px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <span style={{
          fontFamily: "var(--font-detail)",
          fontSize: "9px",
          color: hovered ? "rgba(242,240,233,0.88)" : "rgba(242,240,233,0.42)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          transition: "color 0.4s ease",
        }}>
          {fanOpen ? "Screens" : "View"}
        </span>
      </div>

      {/* Inner glass gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 35%, rgba(0,0,0,0.18) 100%)",
        borderRadius: W / 2,
        pointerEvents: "none",
        zIndex: 1,
      }} />
    </div>
  );
}

// Tight pulse rings for the standalone center portal
function PulseRings({ active, size }) {
  if (!active) return null;
  const inset = -(size * 0.04);
  return (
    <>
      <span style={{ position: "absolute", inset, borderRadius: "50%", border: "1px solid rgba(242,240,233,0.35)", animation: "portal-pulse-tight 2.2s ease-out infinite", pointerEvents: "none", zIndex: 50 }} />
      <span style={{ position: "absolute", inset, borderRadius: "50%", border: "1px solid rgba(242,240,233,0.22)", animation: "portal-pulse-tight 2.2s ease-out 0.75s infinite", pointerEvents: "none", zIndex: 50 }} />
      <span style={{ position: "absolute", inset, borderRadius: "50%", border: "1px solid rgba(242,240,233,0.12)", animation: "portal-pulse-tight 2.2s ease-out 1.5s infinite", pointerEvents: "none", zIndex: 50 }} />
    </>
  );
}

export function CommissionsSection() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftOuterRef = useRef(null);
  const rightOuterRef = useRef(null);
  const practiceLineRef = useRef(null);
  const practiceLineRightRef = useRef(null);
  const practiceRevealRef = useRef(null);
  const playPracticeRef = useRef(null);
  const practiceTriggerRef = useRef(null);
  const stripRef = useRef(null);
  const [fanOpen, setFanOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [sculptureOpen, setSculptureOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);

  const anyOpen = screensOpen || projectsOpen || conceptsOpen || reelsOpen;
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(anyOpen ? "gallery-modal-open" : "gallery-modal-close"));
  }, [anyOpen]);

  // Init: side portals hidden, Practice collapsed
  useEffect(() => {
    gsap.set([leftRef.current, rightRef.current, leftOuterRef.current, rightOuterRef.current], { x: 0, opacity: 0, visibility: "hidden" });
    if (practiceRevealRef.current) {
      gsap.set(practiceRevealRef.current, { height: 0, overflow: "hidden" });
    }
  }, []);

  // Fan open — strip expands first, then portals fan out
  useEffect(() => {
    if (!fanOpen) return;
    // 1. Expand strip from 140px to 280px, then open overflow so fan can spill
    gsap.to(stripRef.current, {
      height: 178, duration: 1.2, ease: "sine.inOut",
      onComplete: () => {
        if (stripRef.current) stripRef.current.style.overflow = "visible";
        // 2. Fan portals after strip is open
        if (window.innerWidth >= 768) {
          gsap.set([leftRef.current, rightRef.current, leftOuterRef.current, rightOuterRef.current], { opacity: 1, visibility: "visible" });
          gsap.fromTo(leftRef.current,       { x: 0 }, { x: -300, duration: 5.0, ease: "none" });
          gsap.fromTo(rightRef.current,      { x: 0 }, { x:  300, duration: 5.0, ease: "none" });
          gsap.fromTo(leftOuterRef.current,  { x: 0 }, { x: -580, duration: 5.0, ease: "none" });
          gsap.fromTo(rightOuterRef.current, { x: 0 }, { x:  580, duration: 5.0, ease: "none" });
        }
      },
    });
    // 3. Reveal Practice after strip + fan settle
    const el = practiceRevealRef.current;
    if (el) {
      gsap.to(el, {
        height: "auto", duration: 1.6, ease: "power3.inOut", delay: 1.4,
        clearProps: "overflow",
        onComplete: () => {
          ScrollTrigger.refresh();
          setTimeout(() => {
            ScrollTrigger.refresh();
            const el = practiceTriggerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
              playPracticeRef.current?.();
            } else {
              ScrollTrigger.create({
                trigger: el,
                start: "top bottom",
                once: true,
                onEnter: () => playPracticeRef.current?.(),
              });
            }
          }, 200);
        },
      });
    }
  }, [fanOpen]);

  // Close — collapse fan + Practice + shrink strip
  const closeSection = () => {
    gsap.to([leftRef.current, rightRef.current, leftOuterRef.current, rightOuterRef.current],
      { x: 0, opacity: 0, duration: 1.0, ease: "power2.in" });
    const el = practiceRevealRef.current;
    if (el) {
      gsap.set(el, { overflow: "hidden" });
      gsap.to(el, { height: 0, duration: 1.0, ease: "power3.inOut" });
    }
    gsap.to(stripRef.current, {
      height: 140, duration: 0.9, ease: "power3.inOut", delay: 0.6,
      onComplete: () => ScrollTrigger.refresh(),
    });
    setFanOpen(false);
  };


  // Nav dropdown
  useEffect(() => {
    const handler = (e) => {
      const cat = e.detail;
      if (cat === "screens")   setScreensOpen(true);
      if (cat === "sculpture") setSculptureOpen(true);
      if (cat === "projects")  setProjectsOpen(true);
      if (cat === "concepts")  setConceptsOpen(true);
    };
    window.addEventListener("open-bespoke-category", handler);
    return () => window.removeEventListener("open-bespoke-category", handler);
  }, []);



  // Practice text — fired when fan opens
  useEffect(() => {
    gsap.set(".about-practice-label", { y: -10, opacity: 0 });
    gsap.set(".para1-bright",   { x: 28, opacity: 0 });
    gsap.set(".para1-dim-word", { opacity: 0 });
    gsap.set(".para2-bright",   { x: 28, opacity: 0 });
    gsap.set(".para2-dim",      { opacity: 0 });
    gsap.set(practiceLineRef.current,      { scaleX: 0 });
    gsap.set(practiceLineRightRef.current, { scaleX: 0 });

    playPracticeRef.current = () => {
      gsap.to(practiceLineRef.current,      { scaleX: 1, duration: 1.1, ease: "power3.out" });
      gsap.to(practiceLineRightRef.current, { scaleX: 1, duration: 1.1, ease: "power3.out" });
      gsap.to(".about-practice-label", { y: 0, opacity: 1, duration: 1.8, ease: "power1.out" });
      gsap.to(".para1-bright",   { x: 0, opacity: 1, duration: 3.2, stagger: 0.45, ease: "power1.out", delay: 0.4 });
      gsap.to(".para1-dim-word", { opacity: 1, duration: 1.6, stagger: 0.28, ease: "power1.out", delay: 3.2 });
      gsap.to(".para2-bright",   { x: 0, opacity: 1, duration: 3.2, stagger: 0.45, ease: "power1.out", delay: 9.0 });
      gsap.to(".para2-dim",      { opacity: 1, duration: 4.2, stagger: 0.65, ease: "power1.out", delay: 12.5 });
    };
  }, []);

  return (
    <section id="bespoke" ref={sectionRef} className="bg-graphite">
      <div className="px-8 pt-12 pb-24 text-center">
        <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">Commissions</span>
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight mt-3">
          <span className="bespoke-heading inline-block text-cream/60">Bespoke</span>
        </h2>
      </div>
      <div className="w-full h-px bg-white/10" />

      {/* Mobile vertical layout */}
      <div className="bg-matt-black py-14 flex flex-col items-center gap-10 md:hidden w-full">
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_RIGHT} size={160} hideLabel hoverLabel="Sculpture" onOpen={() => setSculptureOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Sculpture</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_LEFT} size={200} hideLabel hoverLabel="Screens" noGlow onOpen={() => setScreensOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Screens</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={COMMISSIONS_PORTAL} size={160} hideLabel hoverLabel="Commissions" alwaysLabel onOpen={() => setReelsOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Commissions</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={160} hideLabel hoverLabel="Projects" onOpen={() => setProjectsOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Projects</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={160} hideLabel hoverLabel="Concepts" onOpen={() => setConceptsOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Concepts</span>
        </div>
      </div>

      {/* Desktop horizontal fan — starts half-height, expands on click */}
      <div
        ref={stripRef}
        className="bg-matt-black relative hidden md:block"
        style={{ height: "140px", overflow: "visible", cursor: fanOpen ? "default" : "pointer" }}
        onClick={!fanOpen ? () => setFanOpen(true) : undefined}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Hover warm edge — bottom border glow when collapsed */}
        {!fanOpen && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
            background: hovering ? "rgba(196,80,24,0.45)" : "rgba(242,240,233,0.08)",
            transition: "background 0.5s ease",
            pointerEvents: "none", zIndex: 5,
          }} />
        )}

        {/* Portal names — static left side */}
        {!fanOpen && (
          <div style={{
            position: "absolute", left: "48px", top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: "5px",
            opacity: hovering ? 0.7 : 0.28, transition: "opacity 0.5s ease",
            pointerEvents: "none", zIndex: 5,
          }}>
            {["Screens", "Sculpture", "Projects", "Commissions", "Concepts"].map((name) => (
              <span key={name} style={{
                fontFamily: "var(--font-detail)", fontSize: "9px", color: "var(--color-cream)",
                letterSpacing: "0.22em", textTransform: "uppercase", lineHeight: 1,
              }}>{name}</span>
            ))}
          </div>
        )}


        {/* Portal fan */}
        <div className="absolute inset-0 flex items-center justify-center overflow-visible">
          <div ref={leftOuterRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={130} hideLabel hoverLabel="Projects" onOpen={() => setProjectsOpen(true)} />
          </div>
          <div ref={leftRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={SIDE_PORTAL_RIGHT} size={130} hideLabel hoverLabel="Sculpture" onOpen={() => setSculptureOpen(true)} />
          </div>

          {/* Center portal — arch/pill frosted glass */}
          <div className="relative" style={{ zIndex: 40 }} onClick={e => fanOpen && e.stopPropagation()}>
            <ArchPortal
              slides={SIDE_PORTAL_LEFT.slides}
              fanOpen={fanOpen}
              onOpen={() => { if (!fanOpen) setFanOpen(true); else setScreensOpen(true); }}
            />
          </div>

          <div ref={rightRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={COMMISSIONS_PORTAL} size={130} hideLabel hoverLabel="Commissions" onOpen={() => setReelsOpen(true)} />
          </div>
          <div ref={rightOuterRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={130} hideLabel hoverLabel="Concepts" onOpen={() => setConceptsOpen(true)} />
          </div>
        </div>

        {/* Close button — in the strip, top-right, only when open */}
        {fanOpen && (
          <button
            onClick={closeSection}
            className="group absolute top-4 right-6 z-30 w-8 h-8 rounded-full border border-cream/20 flex items-center justify-center transition-all duration-300 hover:border-clay hover:bg-clay/10"
            aria-label="Close section"
          >
            <X size={13} className="text-cream/40 group-hover:text-clay transition-colors duration-300" />
          </button>
        )}
      </div>

      <div className="w-full h-px bg-white/10" />

      {/* The Practice — revealed when fan opens */}
      <div ref={practiceRevealRef}>
        <div style={{ paddingTop: "220px" }} className="pb-0 flex flex-col items-center">
          <div className="relative flex items-center justify-center overflow-visible" style={{ width: "80px", height: "80px" }}>
            <span ref={practiceLineRef} style={{
              position: "absolute", right: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
              width: "90px", height: "1.5px",
              background: "rgba(242,240,233,0.35)",
              transformOrigin: "right center",
              transform: "scaleX(0)",
            }} />
            <span ref={practiceLineRightRef} style={{
              position: "absolute", left: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
              width: "90px", height: "1.5px",
              background: "rgba(242,240,233,0.35)",
              transformOrigin: "left center",
              transform: "scaleX(0)",
            }} />
            <img src="/images/roj-logo.png" alt="ROGETjames" className="relative z-10 w-full h-auto"
              style={{ opacity: 0.5, filter: "drop-shadow(0px 5px 0px rgba(0,0,0,0.55))" }} />
          </div>
        </div>
        <div className="about-practice-label px-8 pt-4 pb-0 text-center">
          <span className="font-detail text-xs text-cream/90 uppercase tracking-[0.2em]">The Practice</span>
        </div>
        <div className="max-w-2xl mx-auto px-8 pt-8 pb-0 text-center">
          <p className="about-practice-para1 text-lg md:text-2xl font-heading font-bold leading-tight" style={{ wordSpacing: "0.22em" }}>
            {"Our work lives in two worlds — an evolving catalogue of".split(" ").map((word, i) => (
              <span key={`a${i}`} className="para1-dim-word inline-block text-cream/40">{word}&thinsp;</span>
            ))}
            {" "}<span className="para1-bright inline-block text-cream/90">signature designs</span>{" "}
            {"and fully bespoke commissions crafted".split(" ").map((word, i) => (
              <span key={`b${i}`} className="para1-dim-word inline-block text-cream/40">{word}&thinsp;</span>
            ))}
            {" "}<span className="para1-bright inline-block text-cream/90">for the spaces they will define.</span>
          </p>
          <div className="about-practice-para2 mt-8">
            <p className="text-cream/65 text-base leading-relaxed">
              <span className="para2-bright inline-block text-cream">Drawing from</span>
              <span className="para2-dim inline">{" "}</span>
              <span className="para2-bright inline-block text-cream">nature</span>
              <span className="para2-dim inline">{", "}the study and appreciation of{" "}</span>
              <span className="para2-bright inline-block text-cream">cultural forms and patterns</span>
              <span className="para2-dim inline">{", "}sculptural inspirations{" "}</span>
              <span className="para2-bright inline-block text-cream">and an active imagination.</span>
            </p>
          </div>
        </div>
        {/* Scroll trigger sentinel — animation fires when this point enters view */}
        <div ref={practiceTriggerRef} style={{ height: "1px", marginTop: "60px" }} />
        <div style={{ height: "260px" }} />

        <div style={{ height: "64px" }} />
      </div>

      {sculptureOpen && <SculptureGalleryModal onClose={() => setSculptureOpen(false)} />}
      {screensOpen   && <ScreensGalleryModal   onClose={() => setScreensOpen(false)} />}
      {projectsOpen  && <ProjectsGalleryModal  onClose={() => setProjectsOpen(false)} />}
      {conceptsOpen  && <ConceptsGalleryModal  onClose={() => setConceptsOpen(false)} />}
      {reelsOpen     && <CommissionsGalleryPopup videos={COMMISSIONS_PORTAL.videos} onClose={() => setReelsOpen(false)} />}
    </section>
  );
}
