import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MiniPortal, CommissionsGalleryPopup } from "./DiscoverPortals";
import { useReelsPortal } from "../utils/reels";
import ArtMarkPortal from "./ArtMarkPortal";
import { ScreensGalleryModal, SculptureGalleryModal, ProjectsGalleryModal, ConceptsGalleryModal, ConcreteGalleryModal, useConcreteImages } from "./BespokeCommissions";
import { ownerPreviewUnlocked } from "../utils/ownerPreview";
import { netlifyImg } from "../utils/img";
import { useUploadsByKey } from "../utils/mediaUploads";
import { MEDIA_KEYS } from "../mediaDestinations";
import { trackGalleryOpen } from "../utils/trackGallery";

gsap.registerPlugin(ScrollTrigger);

const CDN_SC = import.meta.env.DEV ? "/images/cdn-gallery" : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

// The Commissions portal is gone — Reels stands in its place. These pictures
// were only ever feeding the sliding strip behind the portals as well, so they
// stay on under a name that says what they are still for.
const BESPOKE_STRIP_EXTRA = [
  { src: "/images/villa-leaf/villa-leaf-trio-pool.jpg" },
  { src: "/images/hero/hero-cottesloe-patio.jpg" },
  { src: "/images/marakesh/marakesh-cassie.jpg" },
  { src: "/images/hex/lalarook-2.jpg" },
  { src: "/images/hero/hero-homebase-dusk.jpg" },
  { src: "/images/hero/hero-cottesloe-gate.jpg" },
];

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

// Concrete's portal wears James's carved lotus and nothing else. The picture
// is cropped to the carving's own edge, so the portal's circle and the
// carving's circle are the same circle — it fills the frame with nothing
// cropped off it and no black behind it. Deliberately NOT part of the Concrete
// gallery: photographs uploaded to Concrete go to the gallery, and the portal
// keeps this face.
const SIDE_PORTAL_CONCRETE = {
  id: "side-concrete",
  label: "Concrete",
  sublabel: "",
  slides: ["/images/concrete/lotus-portal.jpg"],
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
// Bespoke portal at once — Sculpture, Projects, Concepts, Reels, and any
// Concrete uploads, which are added at render time. Decorative only: the strip
// is not clickable, exactly as the portals themselves still are.
const slideSrc = (s) => (typeof s === "string" ? s : s?.src);

// The strip asks for its photos at exactly the size the 170px portals ask for
// (MiniPortal uses size x 2.4). Same address, so the strip and the portals
// share one download instead of fetching two different sizes of the same
// picture — on a page already carrying ~200 images that is the difference
// between the strip filling in at once and trickling in.
// The strip tiles are 208px square; a retina screen wants twice that and
// these are photographs, not flat graphics. 408 at q78 was barely 2x at a
// low quality, which is what made the strip look soft.
const PORTAL_IMG = { w: 560, q: 88 };

// Concepts carries 17 pictures for its own portal against Sculpture's 6 and
// Projects' 5 — put them all in and the strip reads as a concepts strip. It
// contributes every third one instead, six like the rest, spread across the
// set rather than the first six in a row. The Concepts portal itself is
// untouched and still turns through all 17.
const STRIP_CONCEPTS = SIDE_PORTAL_CONCEPTS.slides.filter((_, i) => i % 3 === 0);

// Pictures that cannot survive the strip's square crop. The Shire of Peel
// panorama — James's Waroona project, the one whose film is waroona.mp4 — is
// 1920x336; cut to a square tile it is blown up six times and reads as blur.
// It stays in the Concepts portal, where it is shown whole.
const STRIP_EXCLUDE = ["8157a7f2-763b-469d-bca4-dee47707d7da"];
const keptInStrip = (src) => !STRIP_EXCLUDE.some((bad) => String(src || "").includes(bad));

const BESPOKE_STRIP_IMAGES = [
  ...SIDE_PORTAL_RIGHT.slides,
  ...SIDE_PORTAL_PROJECTS.slides,
  ...STRIP_CONCEPTS,
  ...BESPOKE_STRIP_EXTRA.map((i) => i.src),
].map(slideSrc).filter(Boolean).filter(keptInStrip);

const shuffled = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Private owner preview. Sculpture, Concepts, Reels and Concrete are open to
// the public. Projects alone is not shown to them at all — no portal, rather
// than one wearing an "Under Construction" sign. James sees all five. He
// unlocks Projects on the live site by visiting once with
// ?preview=roj-open — that saves a flag in his browser so they stay open on
// every later visit. ?preview=off re-locks. Nobody else ever sees them.
// Shared with the private city pages — see src/utils/ownerPreview.js.

const IS_DEV = import.meta.env.DEV || ownerPreviewUnlocked();

// The same rippling gold dot the Collection uses beside its pills.
function GalleryDot() {
  return (
    <span style={{ position: "relative", width: 5, height: 5, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#9e7134", border: "1px solid #9e7134", display: "block", flexShrink: 0 }} />
      <span style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: 5, height: 5,
        borderRadius: "50%", border: "0.5px solid #9e7134",
        animation: "bcl-ripple 2.4s ease-out infinite", pointerEvents: "none",
      }} />
      <style>{`@keyframes bcl-ripple { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; } 100% { transform: translate(-50%,-50%) scale(8); opacity: 0; } }`}</style>
    </span>
  );
}

export function CommissionsSection() {
  const [sculptureOpen, setSculptureOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);
  const [concreteOpen, setConcreteOpen] = useState(false);
  // The section had the mark turning, five portals turning and the strip
  // sliding, all at once. The portals stay out of sight until asked for, so
  // what is moving when you arrive is the mark and the strip alone.
  const [galleriesOpen, setGalleriesOpen] = useState(false);
  // The same Reels portal the Discover section shows, uploads already merged.
  const reelsPortal = useReelsPortal();
  const [initialScreensCat, setInitialScreensCat] = useState(false);
  // Concrete has no hand-placed images — the portal appears on its own as soon
  // as the first photo is uploaded to it, and stays hidden until then. Its
  // spinning slides are those same uploads.
  const concreteImages = useConcreteImages();
  // Photographs sent straight to the strip from /media. Until now the strip was
  // a hand-written list and an upload had nowhere to go.
  const stripByKey = useUploadsByKey([MEDIA_KEYS.bespokeStrip], "Bespoke");
  const stripUploads = stripByKey[MEDIA_KEYS.bespokeStrip] || [];
  // The portal keeps its lotus whatever is uploaded to the Concrete gallery.
  const concretePortal = SIDE_PORTAL_CONCRETE;

  // Sliding strip — same shape as the Collection strip on the home page, but
  // both halves run the one way, left to right. Shuffled once per visit.
  const sectionRef   = useRef(null);
  const stripAreaRef = useRef(null);
  const gateLeftRef  = useRef(null);
  const gateRightRef = useRef(null);
  const gateTlRef    = useRef(null);
  const [stripSeed] = useState(() => shuffled(BESPOKE_STRIP_IMAGES));
  // Opening the galleries draws the two black panels back across the strip from
  // the centre, closing it — the same movement that opened it, run backwards.
  // Hiding them opens the strip again.
  const gatesReadyRef = useRef(false);
  // Once the panels have met in the middle there is nothing to see behind them,
  // so the pictures stop moving until they part again. Two things moving under
  // a black panel is what made the wipe feel like it was fighting the slide.
  const [stripCovered, setStripCovered] = useState(false);
  useEffect(() => {
    const l = gateLeftRef.current, r = gateRightRef.current;
    if (!l || !r) return;
    // Nothing to animate on first paint: the scroll-in reveal owns the panels
    // until the galleries are asked for.
    if (!gatesReadyRef.current) { gatesReadyRef.current = true; if (!galleriesOpen) return; }
    gateTlRef.current?.pause();
    // Slow, and eased at both ends — the panels drift rather than snap. The
    // whole section is meant to breathe, so this is nearer the strip's own
    // eight-second opening than to a UI transition. force3D hands the panels to
    // the graphics card so a panel the width of half the screen is not repainted
    // on every frame, and overwrite means a second press replaces the movement
    // instead of stacking a second one on top of it.
    const drift = { duration: 3.4, ease: "sine.inOut", force3D: true, overwrite: "auto" };
    gsap.to(l, { ...drift, x: galleriesOpen ? "0%" : "-100%" });
    gsap.to(r, { ...drift, x: galleriesOpen ? "0%" : "100%",
      // The pictures start moving again the instant the panels begin to part,
      // and only stop once the panels have fully met.
      onStart:    () => { if (!galleriesOpen) setStripCovered(false); },
      onComplete: () => { if (galleriesOpen)  setStripCovered(true);  } });
  }, [galleriesOpen]);

  // Keyed on the photographs themselves, not on the lists that carry them —
  // those lists are rebuilt on every redraw, and reshuffling the strip mid-slide
  // restarts the movement, which is what made it stutter.
  const extraKey = [...concreteImages.map((i) => i.img), ...stripUploads.map((i) => i.img)].join("|");
  const stripImages = useMemo(
    () => (extraKey ? shuffled([...stripSeed, ...extraKey.split("|")]) : stripSeed),
    [stripSeed, extraKey]
  );
  const halfway    = Math.ceil(stripImages.length / 2);
  const leftHalf   = stripImages.slice(0, halfway);
  const rightHalf  = stripImages.slice(halfway);
  const leftDup    = [...leftHalf,  ...leftHalf];
  const rightDup   = [...rightHalf, ...rightHalf];
  // Each half loops its own set, so a fixed time would move the shorter half
  // slower than the longer one — the two sides visibly drifting apart. Timing
  // each half by how many pictures it carries keeps both at one speed.
  const SECS_PER_PICTURE = 4.6;
  const leftSecs   = `${(leftHalf.length  * SECS_PER_PICTURE).toFixed(1)}s`;
  const rightSecs  = `${(rightHalf.length * SECS_PER_PICTURE).toFixed(1)}s`;
  // A tile is as wide as the strip is tall (h-52 = 208px) and the gap is 12px,
  // so one whole set travels exactly this far. Whole pixels, so the loop point
  // lands on a tile edge and the picture never shifts by half a pixel.
  const STRIP_STEP = 220;
  const leftLoop   = `${leftHalf.length  * STRIP_STEP}px`;
  const rightLoop  = `${rightHalf.length * STRIP_STEP}px`;

  // A marquee that keeps running while nobody is looking at it costs frames
  // everywhere else on the page. Stop it whenever the section is off screen.
  const [stripVisible, setStripVisible] = useState(false);
  // A picture arriving while the strip is moving forces the browser to redraw
  // the whole track — and each track is nearly 9000px wide. That redraw is what
  // read as jitter. The pictures are asked for as the section comes near, the
  // strip stays still until they are in, and then it moves without interruption.
  const [stripReady, setStripReady] = useState(false);
  const stripLoadedRef = useRef(0);
  useEffect(() => {
    const el = stripAreaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setStripVisible(e.isIntersecting), { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Never leave it frozen: whatever has or hasn't arrived, start after 3s.
  useEffect(() => {
    if (!stripVisible || stripReady) return;
    const t = setTimeout(() => setStripReady(true), 3000);
    return () => clearTimeout(t);
  }, [stripVisible, stripReady]);

  const totalStripImgs = leftDup.length + rightDup.length;
  const onStripImgSettled = () => {
    stripLoadedRef.current += 1;
    if (stripLoadedRef.current >= totalStripImgs) setStripReady(true);
  };

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
      gateTlRef.current = tl;
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
      // One case per portal in this section, and the same rules: everything
      // open to the public except Projects, which only James can reach.
      if (cat === "screens")   { window.location.assign("/screens"); return; }
      if (cat === "sculpture") setSculptureOpen(true);
      if (cat === "concepts")  setConceptsOpen(true);
      if (cat === "reels")     setReelsOpen(true);
      if (cat === "concrete")  setConcreteOpen(true);
      if (cat === "projects")  { if (IS_DEV) window.location.assign("/projects"); }
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
  // Owner-only: projects / concepts (still under construction),
  // matching the portal locks.
  useEffect(() => {
    const which = new URLSearchParams(window.location.search).get("open");
    if (!which) return;
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    const opener = {
      screens:     () => { window.location.assign("/screens"); },
      sculpture:   () => setSculptureOpen(true),
      concepts:    () => setConceptsOpen(true),
      reels:       () => setReelsOpen(true),
      concrete:    () => setConcreteOpen(true),
      projects:    () => { if (IS_DEV) window.location.assign("/projects"); },
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
        <span className="font-detail text-xs text-cream/55 uppercase tracking-[0.2em]">Bespoke</span>
        {/* The heading carries the words people search for when they want work
            made for a place. "Bespoke" alone is read by Google as tailoring,
            framing and jewellery, so it sits above as the eyebrow instead. */}
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight mt-3 leading-tight">
          <span className="inline-block text-cream" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.55)" }}>Architectural </span>
          <span className="inline-block text-cream/60" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.55)" }}>Art</span>
        </h2>
      </div>
      <div className="w-full h-px bg-white/10" />

      {/* Mobile vertical layout */}
      <div className="bg-matt-black py-8 flex flex-col items-center gap-8 md:hidden w-full">
        {/* Phone order, James's: Sculpture, Reels, Concepts, Concrete, Projects.
            No mark portal here — it leads the desktop layout only. */}
        <MiniPortal portal={SIDE_PORTAL_RIGHT}    size={210} hideLabel centerLabel="Sculpture"   onOpen={openAndCount(setSculptureOpen, "Bespoke Sculpture")} />
        <MiniPortal portal={reelsPortal}          size={180} hideLabel centerLabel="Reels"       onOpen={openAndCount(setReelsOpen, "Reels")} />
        <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={180} hideLabel centerLabel="Concepts"    onOpen={openAndCount(setConceptsOpen, "Concepts")} />
        <MiniPortal portal={concretePortal}       size={180} hideLabel centerLabel="Concrete"    onOpen={openAndCount(setConcreteOpen, "Concrete")} />
        {/* Projects is always on the phone, last in the line. The public sees it
            locked, as Under Construction; it opens for James only. */}
        <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={180} hideLabel centerLabel="Projects"
                    locked={!IS_DEV} onOpen={IS_DEV ? openProjectsPage : null} />
      </div>

      {/* Desktop — laid out like the Collection section on the home page:
          Sculpture floats in the centre of a sliding strip at the same size and
          in the same place as Wall Art there, with Projects, Concepts and
          Reels in a row beneath at the size they have always been. */}
      <div className="bg-matt-black relative hidden md:flex flex-col items-center">

        {/* Faint rule above strip */}
        <div className="w-full h-px bg-white/20 mb-4" />

        <div ref={stripAreaRef} className="relative flex items-stretch h-52 w-full px-0 gap-0">
          {/* Gate panels — slide outward from centre on scroll into view */}
          {/* Each panel runs 40px past the centre and fades away over that last
              40px. Closed, the two overlap so the centre stays solid black;
              moving, the leading edge dissolves across the pictures instead of
              drawing a hard line over them, which is what read as a jolt. */}
          <div ref={gateLeftRef}  className="absolute inset-y-0 left-0 z-20 pointer-events-none"
               style={{ width: "calc(50% + 40px)", willChange: "transform",
                        background: "linear-gradient(to right, #010101 0, #010101 calc(100% - 40px), rgba(1,1,1,0) 100%)" }} />
          <div ref={gateRightRef} className="absolute inset-y-0 right-0 z-20 pointer-events-none"
               style={{ width: "calc(50% + 40px)", willChange: "transform",
                        background: "linear-gradient(to left, #010101 0, #010101 calc(100% - 40px), rgba(1,1,1,0) 100%)" }} />

          {/* Left half of the strip */}
          <div className="flex-1 overflow-hidden" aria-hidden="true" style={{ contain: "paint" }}>
            <div className="marquee-loop-right flex gap-3 h-full" style={{ width: "max-content", "--loop": leftLoop, "--loop-secs": leftSecs, animationPlayState: stripVisible && stripReady && !stripCovered ? "running" : "paused" }}>
              {leftDup.map((src, i) => (
                <div key={i} className="flex-none h-full aspect-square rounded-2xl overflow-hidden">
                  <img src={stripVisible ? netlifyImg(src, PORTAL_IMG) : undefined} alt="" role="presentation" className="w-full h-full object-cover" decoding="async" fetchPriority="low" onLoad={onStripImgSettled} onError={onStripImgSettled} />
                </div>
              ))}
            </div>
          </div>

          {/* Centre spacer — keeps strip images clear of the portal column */}
          <div className="flex-none" style={{ width: "338px" }} />

          {/* Right half of the strip — runs the same way, left to right */}
          <div className="flex-1 overflow-hidden" aria-hidden="true" style={{ contain: "paint" }}>
            <div className="marquee-loop-right flex gap-3 h-full" style={{ width: "max-content", "--loop": rightLoop, "--loop-secs": rightSecs, animationPlayState: stripVisible && stripReady && !stripCovered ? "running" : "paused" }}>
              {rightDup.map((src, i) => (
                <div key={i} className="flex-none h-full aspect-square rounded-2xl overflow-hidden">
                  <img src={stripVisible ? netlifyImg(src, PORTAL_IMG) : undefined} alt="" role="presentation" className="w-full h-full object-cover" decoding="async" fetchPriority="low" onLoad={onStripImgSettled} onError={onStripImgSettled} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faint rule below strip */}
        <div className="w-full h-px bg-white/20 mt-4" />

        {/* Negative margin lifts Sculpture up to float in the strip centre —
            the same -274px the Wall Art portal uses in the Collection. */}
        {/* The row of five sits well clear of the sliding strip the mark
            floats in, rather than tucking up under it. */}
        <div className="flex flex-col items-center gap-12 pb-16 relative z-30" style={{ marginTop: "-274px" }}>
          <ArtMarkPortal size={288} label="Sculpture" onOpen={openAndCount(setSculptureOpen, "Bespoke Sculpture")} />

          {/* The way in to the portals. Closed, nothing below the mark moves.
              Built to match the Collection's Sculpture / Wall Art / Screens
              pills exactly — same trace, same gold on hover, and the same
              rippling dot either side. */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <GalleryDot />
            <button
              type="button"
              onClick={() => setGalleriesOpen(o => !o)}
              aria-expanded={galleriesOpen}
              onMouseEnter={e => { if (!galleriesOpen) { e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; } }}
              onMouseLeave={e => { if (!galleriesOpen) { e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.85)"; } }}
              className="pill-trace font-detail text-[10px] uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border bg-transparent transition-colors duration-300"
              style={{
                borderColor: galleriesOpen ? "#9e7134" : "rgba(242,240,233,0.3)",
                color: galleriesOpen ? "#f2f0e9" : "rgba(242,240,233,0.85)",
                cursor: "pointer",
                boxShadow: galleriesOpen ? "none" : "0 0 0 1px rgba(242,240,233,0.18)",
              }}
            >
              {galleriesOpen ? "Hide Galleries" : "View Galleries"}
            </button>
            <GalleryDot />
          </div>

          {/* Five portals at 170px need ~1200px to sit on one line. On a
              narrower desktop they wrap to a second line rather than running
              off the edge. */}
          {/* Always here, so the black holds its full height and nothing below
              the section moves when the galleries are shown or hidden. Closed,
              it is simply not visible and cannot be reached. */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 px-6 max-w-[1280px]"
            aria-hidden={!galleriesOpen}
            style={{
              visibility: galleriesOpen ? "visible" : "hidden",
              opacity: galleriesOpen ? 1 : 0,
              pointerEvents: galleriesOpen ? "auto" : "none",
              transition: "opacity 2.4s cubic-bezier(0.33, 0, 0.2, 1) 0.9s",
            }}
          >
            <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={170} hideLabel centerLabel="Concepts" onOpen={openAndCount(setConceptsOpen, "Concepts")} />
            <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={170} hideLabel centerLabel="Projects" locked={!IS_DEV} onOpen={IS_DEV ? openProjectsPage : null} />
            {/* Sculpture holds the middle of the row and stands a size above the
                rest, so the eye lands on it first. */}
            <MiniPortal portal={SIDE_PORTAL_RIGHT} size={200} hideLabel centerLabel="Sculpture" onOpen={openAndCount(setSculptureOpen, "Bespoke Sculpture")} />
            <MiniPortal portal={reelsPortal}          size={170} hideLabel centerLabel="Reels"       onOpen={openAndCount(setReelsOpen, "Reels")} />
            <MiniPortal portal={concretePortal} size={170} hideLabel centerLabel="Concrete" onOpen={openAndCount(setConcreteOpen, "Concrete")} />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/10" />

      {sculptureOpen && <SculptureGalleryModal onClose={() => setSculptureOpen(false)} />}
      {screensOpen   && <ScreensGalleryModal   onClose={() => { setScreensOpen(false); setInitialScreensCat(false); }} initialShowCat={initialScreensCat} />}
      {projectsOpen  && <ProjectsGalleryModal  onClose={() => setProjectsOpen(false)} />}
      {conceptsOpen  && <ConceptsGalleryModal  onClose={() => setConceptsOpen(false)} />}
      {reelsOpen     && <CommissionsGalleryPopup videos={reelsPortal.videos} title="Reels" onClose={() => setReelsOpen(false)} />}
      {concreteOpen  && <ConcreteGalleryModal  onClose={() => setConcreteOpen(false)} />}
    </section>
  );
}
