import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import { MiniPortal, CommissionsGalleryPopup } from "./DiscoverPortals";
import { ScreensGalleryModal, SculptureGalleryModal, ProjectsGalleryModal, ConceptsGalleryModal } from "./BespokeCommissions";

gsap.registerPlugin(ScrollTrigger);

const CDN_SC = "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

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
    `${CDN_SC}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg`,
    `${CDN_SC}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg`,
    `${CDN_SC}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg`,
    `${CDN_SC}/7975db43-6e77-4a2d-8b33-6cdf7218ad48_rw_1920.jpg`,
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
    `${CDN_SC}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`,
    `${CDN_SC}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg`,
    `${CDN_SC}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg`,
  ],
};

const SIDE_PORTAL_CONCEPTS = {
  id: "side-concepts",
  label: "Concepts",
  sublabel: "",
  slides: [
    `${CDN_SC}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg`,
    `${CDN_SC}/713bf242-7075-4082-90cd-c885aa129107_rw_1920.jpg`,
    `${CDN_SC}/882272cb-30b0-4cef-8f0e-dee3241578e3_rw_1920.jpg`,
    `${CDN_SC}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg`,
    `${CDN_SC}/39f2b9a7-cf77-4a54-a88e-a92948a82ebe_rw_1920.jpg`,
    "/images/homebase-concept-final.jpg",
    "/images/concepts-homebase-exterior.jpg",
    `${CDN_SC}/ba29da64-778e-4e6c-a942-02acff420a19_rw_1200.jpg`,
    `${CDN_SC}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg`,
    `${CDN_SC}/4fe97b52-7eca-4995-a9b0-e9caa6d72967_rw_1920.jpg`,
    `${CDN_SC}/3ef7ea8e-eec1-4856-b37a-f2d23978aca3_rw_1920.jpg`,
    `${CDN_SC}/66a80833-aa96-4e7a-a62e-6ce882831573_rw_1200.jpg`,
    `${CDN_SC}/9422ac0b-5ce1-4cca-83fc-660e854c3bb0_rw_1200.jpg`,
    `${CDN_SC}/04ac8236-413f-4590-a522-dfca01a94fe8_rw_1200.jpg`,
    `${CDN_SC}/8b43f372-e1ca-4882-b630-bc0d985db4a7_rw_1200.jpg`,
    `${CDN_SC}/437cf607-c821-4331-8874-d47ecda32ca3_rw_1920.jpg`,
    `${CDN_SC}/7c66f9e9-9682-4d93-8bb6-36aa19318e94_rw_1920.jpg`,
    `${CDN_SC}/d8d96ede-c60e-4b48-991b-b80f157db3a5_rw_1920.jpg`,
  ],
};

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
  const centerPortalRef = useRef(null);
  const [fanOpen, setFanOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [sculptureOpen, setSculptureOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [archOffset, setArchOffset] = useState(0); // measured: section top -> portal centre, in px

  // Measure the real distance from the section's top edge to the centre of
  // the portal circle, so the frosted arch's flat top can be pinned exactly
  // to the section top regardless of heading line-wrap or viewport size.
  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current || !centerPortalRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const portalRect = centerPortalRef.current.getBoundingClientRect();
      setArchOffset(Math.round(portalRect.top - sectionRect.top + portalRect.height / 2));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
      height: 240, duration: 1.2, ease: "sine.inOut",
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
      height: 200, duration: 0.9, ease: "power3.inOut", delay: 0.6,
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



  // Practice text now lives in About.jsx — no GSAP needed here

  return (
    <section id="bespoke" ref={sectionRef} className="bg-graphite" style={{ position: "relative" }}>
      <div className="px-8 pt-12 pb-24 text-center" style={{ position: "relative", zIndex: 51 }}>
        <span className="font-detail text-xs text-cream/55 uppercase tracking-[0.2em]">Commissions</span>
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight mt-3">
          <span className="bespoke-heading inline-block text-cream/60" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.55)" }}>Bespoke</span>
        </h2>
      </div>
      <div className="w-full h-px bg-white/10" />

      {/* Mobile vertical layout */}
      <div className="bg-matt-black py-14 flex flex-col items-center gap-10 md:hidden w-full">
        <MiniPortal portal={SIDE_PORTAL_RIGHT}    size={160} hideLabel centerLabel="Sculpture"   hoverLabel="Under Construction" locked />
        <MiniPortal portal={SIDE_PORTAL_LEFT}     size={200} hideLabel centerLabel="Screens"     hoverLabel="Under Construction" locked />
        <MiniPortal portal={COMMISSIONS_PORTAL}   size={160} hideLabel centerLabel="Commissions" hoverLabel="Under Construction" locked />
        <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={160} hideLabel centerLabel="Projects"    hoverLabel="Under Construction" locked />
        <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={160} hideLabel centerLabel="Concepts"    hoverLabel="Under Construction" locked />
      </div>

      {/* Desktop — all 5 portals always visible in a row */}
      <div className="bg-matt-black relative hidden md:flex items-center justify-center gap-12 py-20">
        <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={130} hideLabel centerLabel="Projects"   hoverLabel="Under Construction" locked />
        <MiniPortal portal={SIDE_PORTAL_RIGHT}    size={130} hideLabel centerLabel="Sculpture"  hoverLabel="Under Construction" locked />
        <MiniPortal portal={SIDE_PORTAL_LEFT}     size={248} hideLabel centerLabel="Screens"    hoverLabel="Under Construction" hoverLabelSize="16px" locked />
        <MiniPortal portal={COMMISSIONS_PORTAL}   size={130} hideLabel centerLabel="Commissions" hoverLabel="Under Construction" locked />
        <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={130} hideLabel centerLabel="Concepts"   hoverLabel="Under Construction" locked />
      </div>


      {/* Frosted arch — anchored to the section's actual top edge (measured, not guessed),
          hole sized to clear the portal's outer ring so it is never clipped */}
      {archOffset > 0 && (() => {
        const portalOuterR = 133;           // portal button outer radius (248 image + 9px ring each side)
        const gap = 6;                      // breathing room so the hole never touches the portal ring
        const hR = portalOuterR + gap;      // 139 — hole radius, strictly larger than the portal
        const ring = Math.round(hR * 0.18); // ring thickness, proportional to reference file
        const oR = hR + ring;               // outer radius of the whole arch shape
        const cY = archOffset;              // circle centre = measured portal centre, section-relative
        const svgH = cY + oR;               // bottom of shape
        const svgW = oR * 2;
        const cX = oR;
        const rX = cX + hR, lX = cX - hR;
        const d = `M0,0 H${svgW} V${cY} A${oR},${oR},0,1,1,0,${cY} Z M${rX},${cY} A${hR},${hR},0,1,0,${lX},${cY} A${hR},${hR},0,1,0,${rX},${cY} Z`;
        const boxStyle = { position: "absolute", top: 0, left: "50%", transform: `translateX(-${cX}px)`, width: svgW, height: svgH, pointerEvents: "none" };
        const clipId = "bespoke-arch-clip";
        return (
          <>
            {/* SVG clipPath definition — referenced via url(), reliably supported (unlike CSS clip-path: path()) */}
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
              <defs>
                <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                  <path d={d} clipRule="evenodd" />
                </clipPath>
              </defs>
            </svg>

            {/* Frosted arch fill — backdrop-filter + clip-path causes GPU glitch; use tinted SVG fill only */}
            <svg className="hidden md:block" style={{ ...boxStyle, zIndex: 49 }}
              width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
              <path fillRule="evenodd" fill="#F2F0E9" fillOpacity="0.06" d={d} />
            </svg>
            <svg className="hidden md:block" style={{ ...boxStyle, zIndex: 50 }}
              width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
              <path
                fillRule="evenodd"
                fill="#F2F0E9"
                fillOpacity="0.10"
                stroke="#F2F0E9"
                strokeOpacity="0.12"
                strokeWidth="1.5"
                d={d}
              />
            </svg>
          </>
        );
      })()}

      <div className="w-full h-px bg-white/10" />

      {/* Practice text now lives in About.jsx */}
      <div ref={practiceRevealRef} />

      {sculptureOpen && <SculptureGalleryModal onClose={() => setSculptureOpen(false)} />}
      {screensOpen   && <ScreensGalleryModal   onClose={() => setScreensOpen(false)} />}
      {projectsOpen  && <ProjectsGalleryModal  onClose={() => setProjectsOpen(false)} />}
      {conceptsOpen  && <ConceptsGalleryModal  onClose={() => setConceptsOpen(false)} />}
      {reelsOpen     && <CommissionsGalleryPopup videos={COMMISSIONS_PORTAL.videos} onClose={() => setReelsOpen(false)} />}
    </section>
  );
}
