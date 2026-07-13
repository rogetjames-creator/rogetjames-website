import { useEffect, useRef, useState } from "react";
import { MiniPortal, CommissionsGalleryPopup } from "./DiscoverPortals";
import { ScreensGalleryModal, SculptureGalleryModal, ProjectsGalleryModal, ConceptsGalleryModal } from "./BespokeCommissions";

const CDN_SC = import.meta.env.DEV ? "/images/cdn-gallery" : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

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

// Private owner preview. The Bespoke portals are locked ("Under Construction")
// for the public. James unlocks them on the live site by visiting once with
// ?preview=roj-open — that saves a flag in his browser so they stay open on
// every later visit. ?preview=off re-locks. Nobody else ever sees them.
const PREVIEW_PASS = "roj-open";
function ownerPreviewUnlocked() {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("preview");
    if (q === "off") {
      localStorage.removeItem("roj_bespoke_preview");
      window.history.replaceState({}, "", window.location.pathname);
      return false;
    }
    if (q === PREVIEW_PASS) {
      localStorage.setItem("roj_bespoke_preview", "1");
      // Strip the pass from the address bar so it isn't visible or shareable.
      window.history.replaceState({}, "", window.location.pathname);
    }
    return localStorage.getItem("roj_bespoke_preview") === "1";
  } catch {
    return false;
  }
}

const IS_DEV = import.meta.env.DEV || ownerPreviewUnlocked();

export function CommissionsSection() {
  const [sculptureOpen, setSculptureOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [initialScreensCat, setInitialScreensCat] = useState(false);

  const anyOpen = sculptureOpen || screensOpen || projectsOpen || conceptsOpen || reelsOpen;
  const didMountRef = useRef(false);
  useEffect(() => {
    // Skip the mount pass so we don't fire a spurious "close" before any modal
    // has ever opened; only dispatch when the open/closed state actually flips.
    if (!didMountRef.current) { didMountRef.current = true; return; }
    window.dispatchEvent(new CustomEvent(anyOpen ? "gallery-modal-open" : "gallery-modal-close"));
  }, [anyOpen]);

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

  // Deep link straight to the Screens Catalogue flipbook — ?bespoke=screenscat.
  // A distinct param name (not ?view=, which Gallery.jsx's own wall-art/
  // sculpture deep-link handler reads and unconditionally strips from the
  // URL — even for values it doesn't recognise — racing this handler out).
  // Bespoke galleries are owner-preview-only (IS_DEV), so this only actually
  // opens anything for James (or in dev); the public still sees "Under
  // Construction" the same as always, deep link or not.
  useEffect(() => {
    if (!IS_DEV) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("bespoke") !== "screenscat") return;
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    const timer = setTimeout(() => {
      setScreensOpen(true);
      setInitialScreensCat(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="bespoke" className="bg-graphite">
      <div className="px-8 pt-12 pb-10 text-center">
        <span className="font-detail text-xs text-cream/55 uppercase tracking-[0.2em]">Commissions</span>
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight mt-3">
          <span className="inline-block text-cream/60" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.55)" }}>Bespoke</span>
        </h2>
      </div>
      <div className="w-full h-px bg-white/10" />

      {/* Mobile vertical layout */}
      <div className="bg-matt-black py-8 flex flex-col items-center gap-8 md:hidden w-full">
        <MiniPortal portal={SIDE_PORTAL_RIGHT}    size={180} hideLabel centerLabel="Sculpture"   hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setSculptureOpen(true)  : undefined} />
        <MiniPortal portal={COMMISSIONS_PORTAL}   size={180} hideLabel centerLabel="Commissions" hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setReelsOpen(true)      : undefined} />
        <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={180} hideLabel centerLabel="Projects"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setProjectsOpen(true)   : undefined} />
        <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={180} hideLabel centerLabel="Concepts"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setConceptsOpen(true)   : undefined} />
      </div>

      {/* Desktop — 4 portals in a row (Screens removed) */}
      <div className="bg-matt-black relative hidden md:flex items-center justify-center gap-24 py-10">
        <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={170} hideLabel centerLabel="Projects"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setProjectsOpen(true)   : undefined} />
        <MiniPortal portal={SIDE_PORTAL_RIGHT}    size={170} hideLabel centerLabel="Sculpture"   hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setSculptureOpen(true)  : undefined} />
        <MiniPortal portal={COMMISSIONS_PORTAL}   size={170} hideLabel centerLabel="Commissions" hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setReelsOpen(true)      : undefined} />
        <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={170} hideLabel centerLabel="Concepts"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? () => setConceptsOpen(true)   : undefined} />
      </div>

      <div className="w-full h-px bg-white/10" />

      {sculptureOpen && <SculptureGalleryModal onClose={() => setSculptureOpen(false)} />}
      {screensOpen   && <ScreensGalleryModal   onClose={() => { setScreensOpen(false); setInitialScreensCat(false); }} initialShowCat={initialScreensCat} />}
      {projectsOpen  && <ProjectsGalleryModal  onClose={() => setProjectsOpen(false)} />}
      {conceptsOpen  && <ConceptsGalleryModal  onClose={() => setConceptsOpen(false)} />}
      {reelsOpen     && <CommissionsGalleryPopup videos={COMMISSIONS_PORTAL.videos} onClose={() => setReelsOpen(false)} />}
    </section>
  );
}
