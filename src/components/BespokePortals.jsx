import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MiniPortal, CommissionsGalleryPopup } from "./DiscoverPortals";
import { ScreensGalleryModal, SculptureGalleryModal, ProjectsGalleryModal, ConceptsGalleryModal, ConcreteGalleryModal, useConcreteImages } from "./BespokeCommissions";
import { ownerPreviewUnlocked } from "../utils/ownerPreview";
import { netlifyImg } from "../utils/img";
import { trackGalleryOpen } from "../utils/trackGallery";

gsap.registerPlugin(ScrollTrigger);

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

// Concrete's portal shows the uploaded concrete photos themselves — the slides
// are filled in at render time from whatever has been placed there, so the
// portal never needs a hand-picked image.
const SIDE_PORTAL_CONCRETE = {
  id: "side-concrete",
  label: "Concrete",
  sublabel: "",
  slides: [],
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
  ],
};

// The sliding strip behind the Sculpture portal shows the pictures from every
// Bespoke portal at once — Sculpture, Projects, Concepts, Commissions, and any
// Concrete uploads, which are added at render time. Decorative only: the strip
// is not clickable, exactly as the portals themselves still are.
const slideSrc = (s) => (typeof s === "string" ? s : s?.src);

// The strip asks for its photos at exactly the size the 170px portals ask for
// (MiniPortal uses size x 2.4). Same address, so the strip and the portals
// share one download instead of fetching two different sizes of the same
// picture — on a page already carrying ~200 images that is the difference
// between the strip filling in at once and trickling in.
const PORTAL_IMG = { w: 408, q: 78 };

const BESPOKE_STRIP_IMAGES = [
  ...SIDE_PORTAL_RIGHT.slides,
  ...SIDE_PORTAL_PROJECTS.slides,
  ...SIDE_PORTAL_CONCEPTS.slides,
  ...COMMISSIONS_GALLERY.map((i) => i.src),
].map(slideSrc).filter(Boolean);

const shuffled = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Private owner preview. Sculpture is open to the public; the remaining
// Bespoke portals (Projects, Commissions, Concepts) are locked ("Under
// Construction"). James unlocks those on the live site by visiting once with
// ?preview=roj-open — that saves a flag in his browser so they stay open on
// every later visit. ?preview=off re-locks. Nobody else ever sees them.
// Shared with the private city pages — see src/utils/ownerPreview.js.

const IS_DEV = import.meta.env.DEV || ownerPreviewUnlocked();

export function CommissionsSection() {
  const [sculptureOpen, setSculptureOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [concreteOpen, setConcreteOpen] = useState(false);
  const [initialScreensCat, setInitialScreensCat] = useState(false);
  // Concrete has no hand-placed images — the portal appears on its own as soon
  // as the first photo is uploaded to it, and stays hidden until then. Its
  // spinning slides are those same uploads.
  const concreteImages = useConcreteImages();
  const concretePortal = useMemo(
    () => ({ ...SIDE_PORTAL_CONCRETE, slides: concreteImages.map((i) => i.img) }),
    [concreteImages]
  );

  // Sliding strip — same shape as the Collection strip on the home page, but
  // both halves run the one way, left to right. Shuffled once per visit.
  const sectionRef   = useRef(null);
  const stripAreaRef = useRef(null);
  const gateLeftRef  = useRef(null);
  const gateRightRef = useRef(null);
  const [stripSeed] = useState(() => shuffled(BESPOKE_STRIP_IMAGES));
  const stripImages = useMemo(
    () => (concreteImages.length ? shuffled([...stripSeed, ...concreteImages.map((i) => i.img)]) : stripSeed),
    [stripSeed, concreteImages]
  );
  const halfway    = Math.ceil(stripImages.length / 2);
  const leftDup    = [...stripImages.slice(0, halfway), ...stripImages.slice(0, halfway)];
  const rightDup   = [...stripImages.slice(halfway),    ...stripImages.slice(halfway)];

  // A marquee that keeps running while nobody is looking at it costs frames
  // everywhere else on the page. Stop it whenever the section is off screen.
  const [stripVisible, setStripVisible] = useState(false);
  useEffect(() => {
    const el = stripAreaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setStripVisible(e.isIntersecting), { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Gate reveal — two black panels slide apart from the centre on scroll in,
  // the same 8s linear opening used on the Collection strip.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gateLeftRef.current || !gateRightRef.current || !stripAreaRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stripAreaRef.current, start: "top bottom", toggleActions: "play none none none" },
      });
      tl.to(gateLeftRef.current,  { x: "-100%", duration: 8, ease: "none" }, 0);
      tl.to(gateRightRef.current, { x: "100%",  duration: 8, ease: "none" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Opening one of these popups is a gallery view — count it for /stats.
  const openAndCount = (setter, name) => () => { trackGalleryOpen(name); setter(true); };

  // Projects now has its own pages — the portal goes to the summary page at
  // /projects instead of opening the old popup. Owner-only while it is built.
  const openProjectsPage = () => { trackGalleryOpen("Projects"); window.location.assign("/projects"); };

  const anyOpen = sculptureOpen || screensOpen || projectsOpen || conceptsOpen || reelsOpen;
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(anyOpen ? "gallery-modal-open" : "gallery-modal-close"));
  }, [anyOpen]);

  useEffect(() => {
    const handler = (e) => {
      const cat = e.detail;
      if (cat === "screens")   { window.location.assign("/screens"); return; }
      if (cat === "sculpture") setSculptureOpen(true);
      if (cat === "projects")  { if (IS_DEV) window.location.assign("/projects"); }
      if (cat === "concepts")  { if (IS_DEV) setConceptsOpen(true); }
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

  // Deep-link from other pages (e.g. the Melbourne page's gallery panels):
  // ?open=<cat> opens that gallery directly. Public: screens / sculpture.
  // Owner-only: projects / commissions / concepts (still under construction),
  // matching the portal locks.
  useEffect(() => {
    const which = new URLSearchParams(window.location.search).get("open");
    if (!which) return;
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    const opener = {
      screens:     () => { window.location.assign("/screens"); },
      sculpture:   () => setSculptureOpen(true),
      concepts:    () => { if (IS_DEV) setConceptsOpen(true); },
      projects:    () => { if (IS_DEV) window.location.assign("/projects"); },
      commissions: () => { if (IS_DEV) setReelsOpen(true); },
    }[which];
    if (!opener) return;
    const timer = setTimeout(() => {
      opener();
      document.querySelector("#bespoke")?.scrollIntoView({ behavior: "smooth" });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="bespoke" ref={sectionRef} className="bg-graphite">
      {/* Extra bottom space on desktop only — the Sculpture portal is lifted up
          into the strip and would otherwise sit right on the Bespoke title. */}
      <div className="px-8 pt-12 pb-10 md:pb-20 text-center">
        <span className="font-detail text-xs text-cream/55 uppercase tracking-[0.2em]">Commissions</span>
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight mt-3">
          <span className="inline-block text-cream/60" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.55)" }}>Bespoke</span>
        </h2>
      </div>
      <div className="w-full h-px bg-white/10" />

      {/* Mobile vertical layout */}
      <div className="bg-matt-black py-8 flex flex-col items-center gap-8 md:hidden w-full">
        <MiniPortal portal={SIDE_PORTAL_RIGHT}    size={180} hideLabel centerLabel="Sculpture"   onOpen={openAndCount(setSculptureOpen, "Bespoke Sculpture")} />
        <MiniPortal portal={COMMISSIONS_PORTAL}   size={180} hideLabel centerLabel="Commissions" hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? openAndCount(setReelsOpen, "Commissions")   : undefined} />
        <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={180} hideLabel centerLabel="Projects"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? openProjectsPage : undefined} />
        <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={180} hideLabel centerLabel="Concepts"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? openAndCount(setConceptsOpen, "Concepts")   : undefined} />
        {concreteImages.length > 0 && (
          <MiniPortal portal={concretePortal} size={180} hideLabel centerLabel="Concrete" onOpen={openAndCount(setConcreteOpen, "Concrete")} />
        )}
      </div>

      {/* Desktop — laid out like the Collection section on the home page:
          Sculpture floats in the centre of a sliding strip at the same size and
          in the same place as Wall Art there, with Projects, Concepts and
          Commissions in a row beneath at the size they have always been. */}
      <div className="bg-matt-black relative hidden md:flex flex-col items-center">

        {/* Faint rule above strip */}
        <div className="w-full h-px bg-white/20 mb-4" />

        <div ref={stripAreaRef} className="relative flex items-stretch h-52 w-full px-0 gap-0">
          {/* Gate panels — slide outward from centre on scroll into view */}
          <div ref={gateLeftRef}  className="absolute inset-y-0 left-0 w-1/2 z-20 pointer-events-none" style={{ background: "#010101" }} />
          <div ref={gateRightRef} className="absolute inset-y-0 right-0 w-1/2 z-20 pointer-events-none" style={{ background: "#010101" }} />

          {/* Left half of the strip */}
          <div className="flex-1 overflow-hidden" aria-hidden="true">
            <div className="marquee-track-right flex gap-3 h-full" style={{ width: "max-content", animationDuration: "78s", animationPlayState: stripVisible ? "running" : "paused" }}>
              {leftDup.map((src, i) => (
                <div key={i} className="flex-none h-full aspect-square rounded-2xl overflow-hidden">
                  <img src={netlifyImg(src, PORTAL_IMG)} alt="" role="presentation" className="w-full h-full object-cover" loading="lazy" decoding="async" fetchPriority="low" />
                </div>
              ))}
            </div>
          </div>

          {/* Centre spacer — keeps strip images clear of the portal column */}
          <div className="flex-none" style={{ width: "338px" }} />

          {/* Right half of the strip — runs the same way, left to right */}
          <div className="flex-1 overflow-hidden" aria-hidden="true">
            <div className="marquee-track-right flex gap-3 h-full" style={{ width: "max-content", animationDuration: "78s", animationPlayState: stripVisible ? "running" : "paused" }}>
              {rightDup.map((src, i) => (
                <div key={i} className="flex-none h-full aspect-square rounded-2xl overflow-hidden">
                  <img src={netlifyImg(src, PORTAL_IMG)} alt="" role="presentation" className="w-full h-full object-cover" loading="lazy" decoding="async" fetchPriority="low" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faint rule below strip */}
        <div className="w-full h-px bg-white/20 mt-4" />

        {/* Negative margin lifts Sculpture up to float in the strip centre —
            the same -274px the Wall Art portal uses in the Collection. */}
        <div className="flex flex-col items-center gap-10 pb-16 relative z-30" style={{ marginTop: "-274px" }}>
          <MiniPortal portal={SIDE_PORTAL_RIGHT} size={288} arcLabel="Sculpture" hideLabel hoverLabel="Sculpture" goldHover onOpen={openAndCount(setSculptureOpen, "Bespoke Sculpture")} />

          <div className="flex items-center justify-center gap-24">
            <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={170} hideLabel centerLabel="Projects"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? openProjectsPage : undefined} />
            <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={170} hideLabel centerLabel="Concepts"    hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? openAndCount(setConceptsOpen, "Concepts")   : undefined} />
            <MiniPortal portal={COMMISSIONS_PORTAL}   size={170} hideLabel centerLabel="Commissions" hoverLabel="Under Construction" locked={!IS_DEV} onOpen={IS_DEV ? openAndCount(setReelsOpen, "Commissions")   : undefined} />
            {concreteImages.length > 0 && (
              <MiniPortal portal={concretePortal} size={170} hideLabel centerLabel="Concrete" onOpen={openAndCount(setConcreteOpen, "Concrete")} />
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/10" />

      {sculptureOpen && <SculptureGalleryModal onClose={() => setSculptureOpen(false)} />}
      {screensOpen   && <ScreensGalleryModal   onClose={() => { setScreensOpen(false); setInitialScreensCat(false); }} initialShowCat={initialScreensCat} />}
      {projectsOpen  && <ProjectsGalleryModal  onClose={() => setProjectsOpen(false)} />}
      {conceptsOpen  && <ConceptsGalleryModal  onClose={() => setConceptsOpen(false)} />}
      {reelsOpen     && <CommissionsGalleryPopup videos={COMMISSIONS_PORTAL.videos} onClose={() => setReelsOpen(false)} />}
      {concreteOpen  && <ConcreteGalleryModal  onClose={() => setConcreteOpen(false)} />}
    </section>
  );
}
