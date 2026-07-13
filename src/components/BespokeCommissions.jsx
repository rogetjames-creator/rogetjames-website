import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { X, Search } from "lucide-react";
import CatPageViewer from "./CatPageViewer";
import { netlifyImg } from "../utils/img";

const CDN = import.meta.env.DEV ? "/images/cdn-gallery" : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

// Serve any gallery image at an explicit width through the Netlify Image CDN.
// - external URLs pass through unchanged
// - srcs already built from the CDN constant (/.netlify/images?url=...) just get sizing params appended
// - plain local /images/... paths go through netlifyImg
function sizedImg(src, w, q = 80) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;
  if (src.startsWith("/.netlify/images")) return `${src}&w=${w}&fm=webp&q=${q}`;
  return netlifyImg(src, { w, q });
}

const COMMISSIONS = {
  commercial: [],
  public: [
    {
      id: "public-2",
      label: "SCULPTURES & TOTEMS",
      items: [
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`, slides: [`${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`, `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg`, `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg`, `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg`, `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg`, `/images/omare-marion-front.jpg`, `/images/hero/hero-marakesh-tall.jpg`, `${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg`] },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg` },
        { name: "Unity in Diversity",             img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg` },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg` },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg` },
        { name: "MARAKESH TRIO (Custom)",         img: "/images/hero/hero-marakesh-tall.jpg" },
        { name: "MARAKESH TRIO (Custom)",         img: `${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg` },
        { name: "OMARE (Custom)",                 img: `/images/omare-marion-front.jpg` },
        { name: "HOMEBASE Totems",                img: "/images/hero/hero-homebase-totems.jpg" },
        { name: "HOMEBASE Entrance",              img: "/images/hero/hero-homebase-entrance.jpg" },
        { name: "Homebase Motif",                 img: "/images/homebase/homebase-motif-closeup.jpg" },
        { name: "Homebase Feature",               img: "/images/hero/hero-homebase-sculpture.jpg" },
        { name: "Homebase Feature",               img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg` },
        { name: "Homebase Feature",               img: `${CDN}/68de0a24-fad7-4ca7-815c-c69bc555e26b_rw_1200.jpg` },
        { name: "Fiona Stanley",                  img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg` },
        { name: "FIONA STANLEY TOTEMS",           img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg` },
        { name: "FIONA STANLEY TOTEMS",           img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg` },
        { name: "ORIAN Totem",                    img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg` },
        { name: "REVO Planter",                   img: `${CDN}/65b28727-1582-4a73-9cef-d8da2edcf885_rw_1200.jpg` },
      ],
    },
    {
      id: "public-7",
      label: "CONCEPTS",
      items: [
        { name: "Percent for Art", img: `${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg`, slides: [`${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg`, `${CDN}/713bf242-7075-4082-90cd-c885aa129107_rw_1920.jpg`] },
        { name: "Outback Info Bays",           img: `${CDN}/882272cb-30b0-4cef-8f0e-dee3241578e3_rw_1920.jpg` },
        { name: "Shire of Peel", img: `${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg`, slides: [`${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg`, `${CDN}/39f2b9a7-cf77-4a54-a88e-a92948a82ebe_rw_1920.jpg`], videoUrl: "/videos/waroona.mp4" },
        { name: "Homebase Landscape Final Design", img: `/images/homebase-concept-final.jpg` },
        { name: "Homebase Landscape Design First Draft", img: `${CDN}/4fe97b52-7eca-4995-a9b0-e9caa6d72967_rw_1920.jpg` },
        { name: "Homebase Entrance Signage", img: `${CDN}/66a80833-aa96-4e7a-a62e-6ce882831573_rw_1200.jpg` },
        { name: "Home Base",                   img: `${CDN}/ba29da64-778e-4e6c-a942-02acff420a19_rw_1200.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/3ef7ea8e-eec1-4856-b37a-f2d23978aca3_rw_1920.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/9422ac0b-5ce1-4cca-83fc-660e854c3bb0_rw_1200.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/04ac8236-413f-4590-a522-dfca01a94fe8_rw_1200.jpg` },
        { name: "Centennial Park — Final Concept", img: `${CDN}/437cf607-c821-4331-8874-d47ecda32ca3_rw_1920.jpg` },
        { name: "Centennial Park — Concepts",  img: `${CDN}/8b43f372-e1ca-4882-b630-bc0d985db4a7_rw_1200.jpg` },
        { name: "Cottesloe Residence",         img: `${CDN}/7c66f9e9-9682-4d93-8bb6-36aa19318e94_rw_1920.jpg` },
        { name: "Cottesloe Residence",         img: `${CDN}/d8d96ede-c60e-4b48-991b-b80f157db3a5_rw_1920.jpg` },
      ],
    },
  ],
  residential: [
    {
      id: "residential-3",
      label: "GARDEN SCULPTURES",
      items: [
        { name: "HUE",         img: "/images/sculptures/hue-dalkieth.jpg" },
        { name: "ESFERA",      img: "/images/sculptures/esfera-fire-burner.jpg" },
        { name: "ORIAN Totem", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg` },
        { name: "MARAKESH",    img: "/images/hero/hero-marakesh-tall.jpg" },
        { name: "YAZAD",       img: `${CDN}/a9ffceab-afdf-47d9-8ba1-53687b469ec4_rw_1200.jpg` },
      ],
    },
  ],
};

const ALL_SERIES = [
  ...COMMISSIONS.commercial,
  ...COMMISSIONS.public,
  ...COMMISSIONS.residential,
];

export const SCULPTURE_ITEMS = (() => {
  const seriesIds = ["public-2", "residential-3"];
  const seen = new Set();
  const items = ALL_SERIES
    .filter(s => seriesIds.includes(s.id))
    .flatMap(s => s.items)
    .filter(item => { if (seen.has(item.img)) return false; seen.add(item.img); return true; });
  return items;
})();

export const CONCEPTS_ITEMS = (() => {
  const seen = new Set();
  return ALL_SERIES
    .filter(s => s.id === "public-7")
    .flatMap(s => s.items)
    .filter(item => { if (seen.has(item.img)) return false; seen.add(item.img); return true; });
})();

// ── Screens feature slideshow — edit slides here ──────────────────────────────
// Each slide: img (path), heading, subheading, body (optional text lines)
// Animation text per slide goes here — James will populate these
const SCREENS_SLIDESHOW_SLIDES = [
  {
    img: "/images/screens/viasi-mt-lawley-day.jpg",
    heading: "VIASI",
    subheading: "Mt Lawley — Fence Infills & Entry Gate",
    body: "",
  },
  {
    img: "/images/screens/ergo-display-home.jpg",
    heading: "ERGO",
    subheading: "Display Home Interior",
    body: "",
  },
  {
    img: "/images/screens/ergo-cottesloe-gate.jpg",
    heading: "ERGO",
    subheading: "Cottesloe Hotel — Gate",
    body: "",
    objectPosition: "center 85%",
  },
  {
    img: "/images/screens/ergo-fence-northstead.jpg",
    heading: "ERGO",
    subheading: "Fence Infills & Balustrade — Northstead",
    body: "",
    objectPosition: "center 70%",
  },
  {
    img: "/images/screens/homebase-display-2.jpg",
    heading: "HOMEBASE",
    subheading: "Homebase Display — TVC 2015",
    body: "",
    objectPosition: "center 20%",
  },
  {
    img: "/images/screens/eros-pergola-williamstown.jpg",
    heading: "EROS",
    subheading: "Pergola — Williamstown",
    body: "",
    objectPosition: "center 20%",
  },
];

function ScreensStoryModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#111", width: "min(500px, 92vw)", maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none", position: "relative", border: "1px solid rgba(242,240,233,0.07)", display: "flex", flexDirection: "column" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(242,240,233,0.35)", cursor: "pointer", fontSize: 18, lineHeight: 1, zIndex: 2 }}>✕</button>

        {/* Spiel header image */}
        <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", flexShrink: 0 }}>
          <img src="/images/screens/spiel-poster.jpg" alt="ROGETjames architectural screens — bespoke laser cut designs" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "block", width: 60, height: "1.5px", background: "rgba(242,240,233,0.35)" }} />
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(18px, 3.5vw, 26px)", letterSpacing: "0.06em", color: "rgba(242,240,233,0.85)", whiteSpace: "nowrap" }}>The Art Form</span>
                <span style={{ display: "block", width: 60, height: "1.5px", background: "rgba(242,240,233,0.35)" }} />
              </div>
              <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(18px, 3.5vw, 26px)", margin: 0, lineHeight: 1.05, letterSpacing: "0.06em", textAlign: "center" }}>
                <span style={{ color: "rgba(242,240,233,0.32)" }}>Shadows </span><span style={{ color: "rgba(242,240,233,0.55)" }}>& </span><span style={{ color: "rgba(242,240,233,0.9)" }}>Light</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body text */}
        <div style={{ padding: "36px 40px 44px", display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(242,240,233,0.65)", lineHeight: 1.9, margin: 0, textAlign: "center" }}>
            For three thousand years, humanity has shaped shadows with form and light — honing the ancient craft of screens.
          </p>
          {[
            "From the woven reeds of ancient Egypt to the carved lattices of Mesopotamian palaces — screens were never merely functional. They were a language. One that spoke of shelter and mystery, of the threshold between public and private, of shadow and adornment made beautiful.",
            "The Islamic Golden Age gave that language its most eloquent voice — breathtaking geometric complexity that turned a wall into a meditation, a doorway into an experience. It rippled through Medieval Europe, through the courts of Asia, through the ornate ironwork of the Victorian colonial era.",
            "Then came the machine. Laser and CNC technology did not replace the craft — they set it free. Suddenly the organic, the intricate, the impossibly fine became possible in aluminium, steel, timber and stone.",
            "ROGETjames occupies this space today — drawing on the depth of that lineage, bringing new thinking and original design into one of the oldest crafts in the built world with contemporary precision.",
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(242,240,233,0.65)", lineHeight: 1.9, margin: 0, textAlign: "center" }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreensFeatureSlideshow() {
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const timerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCur(p => (p + 1) % SCREENS_SLIDESHOW_SLIDES.length);
        setAnimating(false);
      }, 500);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slide = SCREENS_SLIDESHOW_SLIDES[cur];

  return (
    <div style={{ gridColumn: "1 / -1", margin: "8px 0 24px 0", position: "relative", height: isMobile ? "420px" : "620px", borderRadius: "12px", overflow: "hidden", background: "#111" }}>
      {/* Slide image */}
      {SCREENS_SLIDESHOW_SLIDES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt={s.heading}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: s.objectPosition || "center center",
            opacity: i === cur ? (animating ? 0 : 1) : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }} />

      {/* Text content — animate/edit per slide here */}
      <div style={{
        position: "absolute", left: 48, top: "50%", transform: "translateY(-50%)",
        opacity: animating ? 0 : 1, transition: "opacity 0.45s ease",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {slide.subheading && (
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(242,240,233,0.55)", margin: 0 }}>
            {slide.subheading}
          </p>
        )}
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(16px, 2.5vw, 28px)", letterSpacing: "0.06em", color: "rgba(242,240,233,0.6)", margin: 0, lineHeight: 1 }}>
          {slide.heading}
        </h2>
        {slide.body && (
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 14, color: "rgba(242,240,233,0.7)", maxWidth: 360, margin: 0, lineHeight: 1.6 }}>
            {slide.body}
          </p>
        )}
      </div>

      {/* Slide counter */}
      <p style={{ position: "absolute", bottom: 22, right: 24, fontFamily: "var(--font-detail)", fontSize: 11, color: "rgba(242,240,233,0.4)", letterSpacing: "0.12em", margin: 0 }}>
        {String(cur + 1).padStart(2, "0")} / {String(SCREENS_SLIDESHOW_SLIDES.length).padStart(2, "0")}
      </p>

      {/* Category tags */}
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 32px" }}>
        <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F2F0E9", margin: 0, textAlign: "center", lineHeight: 1.8 }}>
          Wall Decor · Entrance Gates · Security Gates Automated · Fencing · Infills · Dividers · Privacy Screens · Awnings · Light Features
        </p>
      </div>

      {/* Story button */}
      <div style={{ position: "absolute", top: 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setStoryOpen(true)}
          className="pill-trace"
          style={{
            fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(242,240,233,0.7)", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(242,240,233,0.18)",
            borderRadius: 9999, padding: "9px 22px", cursor: "pointer",
          }}
        >
          THE ART OF SHADOWS AND LIGHT
        </button>
      </div>

      {storyOpen && <ScreensStoryModal onClose={() => setStoryOpen(false)} />}
    </div>
  );
}

const SCREEN_DESIGNS = [
  // ── THE ICONS (A–Z) ───────────────────────────────────────────────────────
  {
    name: "ASLYIAM", sectionStart: "THE ICONS",
    items: [
      { name: "ASLYIAM",               img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg` },
      { name: "ASLYIAM Light Feature", img: `${CDN}/1a26b497-b278-4edc-a050-a2b42e3718d4_rw_1200.jpg` },
      { name: "ASLYIAM",               img: `${CDN}/bb795500-d407-424b-bc89-a099f1c7a24f_rw_1200.jpg` },
      { name: "ASLYIAM",               img: `${CDN}/90166d8d-2652-40c1-8b4f-b0c9a35778af_rw_1200.jpg` },
      { name: "ASLYIAM", img: `${CDN}/783b12fc-1521-44f3-afa8-17b4f1a5e85c_rw_1200.jpg`, slides: [`${CDN}/783b12fc-1521-44f3-afa8-17b4f1a5e85c_rw_1200.jpg`, `${CDN}/f9a69d89-d090-4620-ad47-1569381a5503_rw_1200.jpg`] },
    ],
  },
  {
    name: "LUCARIO",
    tabs: ["icons", "classics"],
    tags: ["dividers"],
    items: [
      { name: "LUCARIO", img: `${CDN}/bf29f83d-b73c-4e2e-89b6-bc0f97489251_rw_1200.jpg`, slides: [`${CDN}/bf29f83d-b73c-4e2e-89b6-bc0f97489251_rw_1200.jpg`, `${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg`] },
      { name: "LUCARIO TDL Landscapes", img: `${CDN}/586176b6-66ff-45c4-afd7-59eaa3da6181_rw_1920.jpg` },
      { name: "LUCARIO Dividers",       img: `${CDN}/0176062d-e9cc-4ed6-8b71-cb1b361b688b_rw_1200.jpg` },
      { name: "LUCARIO",                img: `${CDN}/d8769e63-8cec-44d3-991f-cee986bc6360_rw_1200.jpg` },
      { name: "LUCARIO",                img: `${CDN}/35fe8b17-6414-4ac4-bc5d-977e3feb1ac2_rw_1200.jpg` },
    ],
  },
  {
    name: "ROANDER",
    tabs: ["icons", "classics"],
    items: [
      { name: "ROANDER", img: "/images/roander/roander-1.jpg", pos: "20% center" },
      { name: "ROANDER", img: `${CDN}/b6751fc7-b7c7-4f41-b84d-bb501d184e62_rw_1920.jpg`, slides: [`${CDN}/b6751fc7-b7c7-4f41-b84d-bb501d184e62_rw_1920.jpg`, `${CDN}/f5e2a05d-f862-4427-983a-bfd5b700a9e2_rw_1200.jpg`, `${CDN}/8f61889e-8e26-41b7-9f63-af05771238f7_rw_1200.jpg`] },
    ],
  },
  {
    name: "VIASI",
    tabs: ["icons", "organics"],
    items: [
      { name: "VIASI", img: `${CDN}/db223306-7723-48dc-a4e6-df471493fab8_rw_1920.jpg`, tags: ["light features", "residential", "display homes"] },
      { name: "VIASI", img: `${CDN}/8dd14241-86af-4d62-8a14-6987e02de827_rw_1920.jpg`, tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: `${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg`, slides: [`${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg`, `${CDN}/6bac8b33-cc48-4d67-ad5e-f4f6de63ebf5_rw_1200.jpg`, `${CDN}/1d4392ab-4a58-4537-b7ce-9fb1823860dd_rw_1200.jpg`], tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-3.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-4.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },

  // ── THE ARCHITECTURAL (A–Z) ───────────────────────────────────────────────
  { name: "ELLE", sectionStart: "THE ARCHITECTURAL", tabs: ["architectural"], items: [
    { name: "ELLE — Corten Screen", img: "/images/screens/elle-corten.jpg", tags: ["screens", "residential"] },
  ] },
  { name: "CHIOLA", items: [
    { name: "CHIOLA",                       img: `${CDN}/a7051a98-18b5-4a76-bf4f-f9569636a04b_rw_1200.jpg`, tags: ["gates", "residential"] },
    { name: "CHIOLA — Display Home",        img: "/images/chiola/chiola-display-home.jpg", description: "CHIOLA as room divider and window feature in a display home", tags: ["dividers", "residential", "display homes"] },
  ] },
  {
    name: "ERGO",
    tabs: ["icons", "architectural"],
    items: [
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg`, tags: ["divider", "commercial"] },
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg`, tags: ["commercial", "gates"] },
      { name: "ERGO",                 img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg`, pos: "left center", tags: ["divider", "residential", "display homes"] },
      { name: "ERGO",                 img: `${CDN}/e3107b10-9669-4608-a72a-6f3d1c796cae_rw_1200.jpg`, tags: ["fencing", "residential"] },
      { name: "ERGO",                 img: `${CDN}/52906986-dcb0-493a-b84b-508165599d56_rw_3840.jpg`, tags: ["fencing", "balustrade", "residential"] },
      { name: "ERGO — Residential",  img: "/images/ergo/ergo-residential.jpg", description: "ERGO residential entrance gates and screen panels", tags: ["fencing", "gates", "residential"] },
      { name: "ERGO",                 img: "/images/screens/ergo-display-home.jpg", pos: "right center", tags: ["divider", "residential", "display homes"] },
    ],
  },
  {
    name: "CUSTOM",
    items: [
      { name: "CUSTOM", img: `${CDN}/0c753703-bc6a-444c-ba4e-b7983f836b30_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-2.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },
  {
    name: "EROS",
    items: [
      { name: "EROS",               img: `${CDN}/3e02a9f2-e096-472b-85f8-567a453a710c_rw_1200.jpg` },
      { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg`, slides: [`${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg`, `${CDN}/53ed3716-9227-4116-b4b6-be2973bbb29e_rw_1200.jpg`], tags: ["fencing", "gates", "residential"] },
      { name: "EROS",               img: `${CDN}/ee61c9e8-2d02-434f-9751-5b00c0142edd_rw_1200.jpg` },
      { name: "EROS",               img: "/images/eros/eros-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "EROS",               img: "/images/eros/eros-2.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "EROS Canopy / Pergola", img: "/images/eros/eros-3.jpg", tags: ["pergola", "residential"] },
      { name: "EROS Pool Gate",        img: "/images/eros/eros-4.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },
  {
    name: "EQUISETTI",
    tabs: ["architectural", "light-features"],
    tags: ["light features"],
    items: [
      { name: "EQUISETTI", img: `${CDN}/453b1942-6be0-4365-b111-0affe46a048e_rw_1920.jpg` },
      { name: "EQUISETTI", img: "/images/equisetti/equisetti-1.jpg" },
    ],
  },
  {
    name: "GRAIL",
    tags: ["privacy screens", "dividers"],
    items: [
      { name: "GRAIL",                img: `${CDN}/8a9e1d1b-a7b1-4c28-a1c1-d6a4b0dfee8c_rw_1200.jpg` },
      { name: "GRAIL", description: "Grail privacy screen — under-framed divider and tinted perspex", img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg` },
      { name: "GRAIL Pool Compliant", img: `${CDN}/72b56ce0-8e7a-4269-a157-c96927dd0683_rw_1920.jpg` },
      { name: "GRAIL — Garage Door",  img: "/images/grail/grail-garage.jpg", description: "GRAIL as inset panels in a timber garage door" },
      { name: "GRAIL — Display",      img: "/images/grail/grail-display.jpg" },
    ],
  },
  {
    name: "HEXO",
    items: [
      { name: "HEXO", img: "/images/hex/lalarook-1.jpg", slides: ["/images/hex/lalarook-1.jpg", "/images/hex/lalarook-2.jpg", "/images/hex/lalarook-copper.jpg"], description: "HEXO — Lalarook Restaurant commercial installation." },
      { name: "HEXO", img: "/images/hex/hex-restaurant.jpg" },
    ],
  },
  {
    name: "ORIEL",
    tags: ["screens", "dividers"],
    items: [
      { name: "ORIEL", img: `${CDN}/314d10c1-5cca-4761-9eb6-7b39034f7a44_rw_1200.jpg`, tags: ["screens", "dividers"] },
      { name: "ORIEL", img: `${CDN}/8e870d8c-8b02-4a6a-82b2-7aed7fc22c83_rw_1920.jpg`, tags: ["fencing", "commercial"] },
    ],
  },
  {
    name: "SABU",
    items: [
      { name: "SABU", img: `${CDN}/42277356-e737-4dca-aae9-3e9121b97db4_rw_1200.jpg`, slides: [`${CDN}/42277356-e737-4dca-aae9-3e9121b97db4_rw_1200.jpg`, `${CDN}/b46cc1c0-5446-4f3d-83ea-3bd918fdf7eb_rw_1920.jpg`] },
    ],
  },
  {
    name: "URO",
    items: [
      { name: "URO", img: `${CDN}/b07ca875-b7c4-4cc6-b61c-91faadf1fa90_rw_1920.jpg`, tags: ["gates", "fencing", "residential"] },
      { name: "URO", img: `${CDN}/99fc46c3-e4c6-4d13-84d5-c0a8b6c33e77_rw_1920.jpg` },
    ],
  },
  {
    name: "ZARATHSTRA",
    items: [
      { name: "ZARATHSTRA — Helvetica Bar", img: "/images/zarathstra/helvetica-bar.jpg", description: "ZARATHSTRA as a full-height commercial divider at Helvetica Bar — Corten finish.", tags: ["dividers", "commercial"] },
      { name: "ZARATHSTRA",                 img: `${CDN}/4c7e2bda-c2ef-4b97-b455-d2791cc51677_rw_1200.jpg`, description: "ZARATHSTRA gate for a residential client in WA south west — Corten powder coat finish.", tags: ["gates", "residential"] },
      { name: "ZARATHSTRA — Kitchen Bench", img: "/images/zarathstra/zarathstra-kitchen-1.jpg", description: "ZARATHSTRA as kitchen bench screen panel — display home", tags: ["screens", "display homes", "residential"] },
    ],
  },

  // ── THE ORGANICS (A–Z) ────────────────────────────────────────────────────
  { name: "BANKSIA", sectionStart: "THE ORGANICS", items: [{ name: "BANKSIA", img: `${CDN}/d9839268-e16d-4adf-8591-580d484748b6_rw_1200.jpg` }] },
  { name: "BLOOM", items: [
    { name: "BLOOM", img: "/images/bloom/bloom-closeup.jpg", pos: "center top", tags: ["screens", "dividers", "residential"] },
    { name: "BLOOM — Light Feature", img: "/images/bloom/bloom-light-feature.jpg", tags: ["light features", "residential"] },
  ]},
  {
    name: "FERLIE",
    tags: ["gates", "fencing"],
    items: [
      { name: "FERLIE", img: `${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg`, slides: [`${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg`, `${CDN}/bdb61a14-c6db-4b1d-afdb-2f2a4a4fc5e6_rw_1920.jpg`], tags: ["divider", "residential", "display homes"] },
      { name: "FERLIE", img: `${CDN}/029eac2b-60ad-4e18-8069-d6fd0461e636_rw_1920.jpg`, slides: [`${CDN}/029eac2b-60ad-4e18-8069-d6fd0461e636_rw_1920.jpg`, `${CDN}/ba33fe1d-7307-43fa-9673-44619efde183_rw_1920.jpg`], tags: ["divider", "residential"] },
      { name: "FERLIE Maek Architects", img: `${CDN}/8e8bddb1-93fa-475c-913b-7dd82eabdef9_rw_1920.jpg`, tags: ["wall decor", "residential"] },
      { name: "FERLIE",                 img: `${CDN}/679d192a-d3c1-4316-aff1-03ac0d9a6326_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "FERLIE",                 img: `${CDN}/87c759cb-528b-4f7e-b17a-6646de8aedca_rw_1200.jpg`, tags: ["divider", "residential"] },
    ],
  },
  { name: "PANGEA",  items: [{ name: "PANGEA",  img: `${CDN}/59a1ba1e-dc20-4f20-a4bf-b0a9d7a13a34_rw_1920.jpg`, tags: ["divider", "commercial"] }] },
  {
    name: "VUELTA",
    tabs: ["icons", "organics"],
    items: [
      { name: "VUELTA",              img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg` },
      { name: "VUELTA Aquila Homes", img: `${CDN}/df7270df-1c0c-49b2-ae6f-7eeb7545e953_rw_1920.jpg`, tags: ["fencing", "residential"] },
      { name: "VUELTA",              img: `${CDN}/c9cc882b-cd1b-4ea9-964a-3b0cddd3cb65_rw_1200.jpg`, tags: ["fencing", "residential"] },
      { name: "VUELTA Pergola",      img: "/images/vuelta/vuelta-pergola.jpg", tags: ["pergolas", "awning", "residential"] },
      { name: "VUELTA Balustrade",   img: "/images/vuelta/vuelta-balustrade.jpg", tags: ["balustrade", "residential"] },
    ],
  },
  {
    name: "WATTLE",
    tabs: ["icons", "organics"],
    tags: ["light features", "pergolas"],
    items: [
      { name: "WATTLE", img: `${CDN}/f940abcb-61e1-4097-8525-2be2df42c732_rw_1200.jpg`, tags: ["wall decor", "residential"] },
      { name: "WATTLE Architectural Screen", img: `${CDN}/4f9d07e7-a1ba-4215-b4ed-86dee879d606_rw_600.jpg`, tags: ["wall decor", "residential"] },
      { name: "WATTLE",      img: `${CDN}/ddb014e7-a9d1-43df-8902-f27c1411d25c_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "WATTLE Auto", img: `${CDN}/ab946f3b-cf58-4bd7-b219-c383e827944d_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "WATTLE",      img: `${CDN}/dc0ca52a-cee0-491c-9f63-7a83b0ae70fd_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "WATTLE Light Feature",        img: "/images/wattle/wattle-1.jpg", tags: ["light features", "divider", "commercial"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-2.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-3.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-4.jpg", tags: ["wall decor", "display homes"] },
      { name: "WATTLE Light Feature — Chew Residence", img: "/images/wattle/wattle-5.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-6.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE Architectural Canopy", img: "/images/wattle/wattle-7.jpg", tags: ["awning", "commercial"] },
      { name: "WATTLE Screen",               img: "/images/wattle/wattle-8.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE Privacy Screen",       img: "/images/wattle/wattle-9.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE Pool Feature",         img: "/images/wattle/wattle-pool-1.jpg", tags: ["light features", "residential"] },
    ],
  },
  { name: "ZED",     items: [{ name: "ZED",     img: `${CDN}/08e92d6e-6d81-4d7b-926f-8ab6ab4c7629_rw_1200.jpg`, tags: ["wall decor", "residential"] }] },

  // ── THE CLASSICS (A–Z) ────────────────────────────────────────────────────
  {
    name: "DOTTI", sectionStart: "THE CLASSICS",
    items: [
      { name: "DOTTI", img: `${CDN}/5d641ee3-f68a-46f0-836e-a439215cb153_rw_1200.jpg`, pos: "right center", tags: ["dividers", "residential", "display homes"] },
      { name: "DOTTI", img: `${CDN}/d0878a20-07d6-43df-84b4-0cfea3ff72b1_rw_1200.jpg`, tags: ["privacy screens", "residential", "display homes"] },
      { name: "DOTTI — Applecross", img: "/images/dotti/dotti-applecross.jpg", tags: ["privacy screens", "residential"] },
      { name: "DOTTI — Platinum", img: "/images/dotti/dotti-platinum.jpg", tags: ["privacy screens", "residential", "display homes"] },
      { name: "DOTTI — Pool", img: "/images/dotti/dotti-pool.jpg", tags: ["privacy screens", "residential"] },
      { name: "DOTTI — Aquilla", img: "/images/dotti/dotti-aquilla.jpg", tags: ["privacy screens", "residential"] },
    ],
  },
  {
    name: "LUMIER",
    items: [
      { name: "LUMIER",                  img: `${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg`, tags: ["divider", "residential"] },
      { name: "LUMIER Riverstone Homes", img: `${CDN}/b3bcabc9-b1a6-4362-8c1f-fb0cd111b697_rw_1200.jpg`, tags: ["wall decor", "residential", "display homes"] },
      { name: "LUMIER Mirvac Melbourne", img: `${CDN}/0cb8128a-5efd-4474-851e-636aa772a9b4_rw_1920.jpg`, pos: "left center", tags: ["divider", "commercial"] },
    ],
  },
  {
    name: "ORIAN",
    items: [
      { name: "ORIAN", img: "/images/screens/orian-wall-decor.jpg", tags: ["wall decor", "residential"] },
      { name: "ORIAN", img: `${CDN}/faa234c5-9ad4-4613-a5fa-7f0d409b38cf_rw_1920.jpg`, tags: ["privacy screens", "residential"] },
      { name: "ORIAN", img: `${CDN}/cf4e542e-07a7-4e7f-9d93-7f022739b389_rw_1920.jpg`, tags: ["divider", "residential"] },
      { name: "ORIAN", img: "/images/orian/orian-1.jpg", tags: ["gates", "residential"] },
    ],
  },
  {
    name: "RISHIKESH",
    items: [
      { name: "RISHIKESH", img: "/images/rishikesh/rishikesh-2.jpg" },
      { name: "RISHIKESH", img: "/images/rishikesh/rishikesh-3.jpg" },
    ],
  },
  {
    name: "VAYA",
    tags: ["dividers"],
    items: [
      { name: "VAYA", img: `${CDN}/62e39404-9a0d-4aaf-b345-7a5c24162ba0_rw_1200.jpg`, tags: ["dividers", "residential"] },
      { name: "VAYA", img: `${CDN}/f158bc26-4f22-47d2-bee1-ba39cc74113e_rw_1200.jpg`, pos: "left center", tags: ["dividers", "residential", "display homes"] },
    ],
  },
  {
    name: "XAVIER",
    items: [
      { name: "XAVIER",                     img: `${CDN}/c811003e-fc79-4bc1-96fc-8c5b5e9019ba_rw_1200.jpg` },
      { name: "XAVIER Rollingstone Sydney", img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg`, tags: ["wall decor", "display homes"] },
      { name: "XAVIER Dale Alcock Display", img: `${CDN}/a6956154-7410-44b9-97ce-e5b66efaeb3c_rw_1920.jpg` },
      { name: "XAVIER",                     img: "/images/xavier/xavier-1.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-2.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-3.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-4.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER — Display Home",      img: "/images/xavier/xavier-display-home.jpg", tags: ["wall decor", "residential", "display homes"] },
      { name: "XAVIER — HIA Show Sydney",    img: "/images/xavier/xavier-hia.jpg", description: "XAVIER — HIA Show Sydney Winning Display" },
    ],
  },
  {
    name: "ZANADA",
    tags: ["gates", "fencing"],
    items: [
      { name: "ZANADA 16mm Aluminium", img: `${CDN}/815b0730-4c38-4163-b3c7-f5c3ac7592ee_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "ZANADA Auto",           img: `${CDN}/c9d58bb5-01c5-41be-8bfb-a0f78df67f0c_rw_1200.jpg` },
    ],
  },

  // ── THE INDIES (A–Z) ──────────────────────────────────────────────────────
  { name: "AUDA",    sectionStart: "THE INDIES", items: [{ name: "AUDA",    img: `${CDN}/18320e7a-11d9-401e-be88-2882883feca6_rw_1920.jpg` }] },
  { name: "SPANGLE", items: [{ name: "SPANGLE", img: `${CDN}/59f5ae87-a618-4e13-95ba-fddf818fc3d8_rw_1200.jpg` }] },

  // ── THE MIRRORS ───────────────────────────────────────────────────────────
  { name: "SABAH", sectionStart: "THE MIRRORS", items: [{ name: "SABAH", img: "/images/mirrors/sabah-1.jpg" }] },
];

const PROJECT_CATEGORIES = [
  { id: "homebase",       label: "Homebase WA" },
  { id: "williamstown",   label: "Williamstown Vic" },
  { id: "fiona-stanley",  label: "Fiona Stanley Hospital WA" },
  { id: "centennial",     label: "Centennial Park WA" },
  { id: "cottesloe",      label: "Cottesloe Hotel WA" },
];

const PROJECTS_ROWS = [
  {
    id: "projects-homebase",
    name: "HOMEBASE",
    projectCategory: "homebase",
    location: "Subiaco, Western Australia",
    description: "A landmark mixed-use development in Subiaco, Western Australia. ROGETjames was engaged across the full scope of the project — designing the landscape, creating and fabricating a suite of architectural art features, and project managing the commission from concept through to installation. The works include totems, entrance signage, feature sculptures, fire pit elements and landscape art, each conceived to activate the public spaces of the precinct and work in dialogue with the surrounding architecture.",
    items: [
      { name: "HOMEBASE Entrance",      img: "/images/hero/hero-homebase-entrance.jpg" },
      { name: "HOMEBASE",               img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg` },
      { name: "Homebase Motif",         img: "/images/homebase/homebase-motif-closeup.jpg" },
      { name: "Homebase Feature",       img: "/images/hero/hero-homebase-sculpture.jpg" },
      { name: "Homebase Landscape Design", img: "/images/hero/hero-homebase-dusk.jpg" },
      { name: "HOMEBASE Totems",        img: "/images/hero/hero-homebase-totems.jpg" },
      { name: "HOMEBASE Fire Pit",      img: `${CDN}/b4fe3827-e371-4bd2-9bb5-1c0b3def3095_rw_1920.jpg` },
      { name: "EVO Planters",           img: `${CDN}/181378db-3310-4b32-8704-00836f3e0cc8_rw_1200.jpg` },
      { name: "EVO Planters",           img: `${CDN}/3826640c-6476-446d-b49c-ba7d1e312544_rw_1200.jpg` },
    ],
  },
  {
    id: "projects-unity",
    name: "UNITY IN DIVERSITY",
    projectCategory: "centennial",
    location: "Centennial Park, Western Australia",
    description: "A significant public art commission at Centennial Park, Western Australia. The selected design was developed through an extensive concept process, culminating in a site-specific installation that celebrates the identity and spirit of the precinct.",
    items: [
      { name: "UNITY IN DIVERSITY", img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg` },
      { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg` },
    ],
  },
  {
    id: "projects-cottesloe",
    name: "ERGO — COTTESLOE HOTEL",
    projectCategory: "cottesloe",
    location: "Cottesloe, Western Australia",
    hideBehindTheScenes: true,
    description: "Description to be added.",
    items: [
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg`, slides: [`${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg`, `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg`] },
      { name: "ERGO Cottesloe Hotel — Gates", img: "/images/hero/hero-cottesloe-gate.jpg" },
    ],
  },
  { id: "projects-fiona-stanley",  name: "FIONA STANLEY HOSPITAL", projectCategory: "fiona-stanley",  location: "Murdoch, Western Australia", description: "Fiona Stanley Hospital sits on land with deep indigenous significance — a place of gathering long before the hospital existed. This commission was an artistic homage to that history. ROGETjames designed and fabricated a series of totem sculptures and installations drawing on indigenous motifs, created with respect for Country and a genuine desire to bring meaning, warmth and identity to the spaces people move through every day.", items: [
    { name: "Fiona Stanley",          img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg` },
    { name: "DANDELIONS Totems",      img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg` },
    { name: "FIONA STANLEY TOTEMS", img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg` },
  ] },
  { id: "projects-williamstown",   name: "WILLIAMSTOWN",            projectCategory: "williamstown",    location: "Williamstown, Victoria", hideBehindTheScenes: true, description: "Description to be added.", items: [
    { name: "EROS Canopy",        img: "/images/eros/eros-3.jpg" },
    { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg` },
    { name: "EROS",               img: "/images/eros/eros-2.jpg" },
    { name: "EROS",               img: "/images/eros/eros-1.jpg" },
  ] },
];

const SCREENS_CAT_PAGES = [
  ...[31, 32, 33, 34, 35, 36, 37].map(n =>
    `/images/catalogues/cat1/page-${String(n).padStart(2, "0")}.jpg`
  ),
  `/images/catalogues/cat2/page-10.jpg`,
];

const SCREEN_DESIGNS_SECTIONED = (() => {
  const sectionMap = {
    "THE ICONS":         "icons",
    "THE ARCHITECTURAL": "architectural",
    "THE ORGANICS":      "organics",
    "THE CLASSICS":      "classics",
    "THE INDIES":        "indies",
    "THE MIRRORS":       "mirrors",
  };
  let section = "icons";
  return SCREEN_DESIGNS.map(d => {
    if (d.sectionStart) section = sectionMap[d.sectionStart] ?? section;
    return { ...d, _section: section, _sections: d.tabs ?? [section] };
  });
})();

// Self-maintaining section covers for the private Feature Screens page
// (same model as Gallery.jsx's WALL_ART_COVERS/SCULPTURE_COVERS). Each design
// becomes one piece — its several photos (SCREEN_DESIGNS items) collected as
// slides under the design's own name, rather than shown as separate pieces.
const SCREEN_SECTION_LABELS = {
  icons: "The Icons",
  architectural: "The Architectural",
  organics: "The Organics",
  classics: "The Classics",
  indies: "The Indies",
  mirrors: "The Mirrors",
};
export const SCREEN_COVERS = Object.entries(SCREEN_SECTION_LABELS)
  .map(([id, label]) => {
    const designs = SCREEN_DESIGNS_SECTIONED.filter((d) => d._section === id);
    const pieces = designs
      .map((d) => {
        const imgs = d.items.map((it) => it.img).filter(Boolean);
        if (!imgs.length) return null;
        return imgs.length > 1 ? { name: d.name, img: imgs[0], slides: imgs } : { name: d.name, img: imgs[0] };
      })
      .filter(Boolean);
    if (!pieces.length) return null;
    return { id, label, img: pieces[0].img, pieces };
  })
  .filter(Boolean);

const SCREEN_TABS = [
  { id: "all",           label: "ALL" },
  { id: "icons",         label: "ICONS" },
  { id: "architectural", label: "ARCHITECTURAL" },
  { id: "organics",      label: "ORGANICS" },
  { id: "classics",      label: "CLASSICS" },
  { id: "indies",        label: "INDIES" },
  { id: "light-features", label: "LIGHT FEATURES" },
  { id: "mirrors",        label: "MIRRORS" },
];

function ScreensCatalogueModal({ onClose }) {
  return <CatPageViewer pages={SCREENS_CAT_PAGES} label="Screens Catalogue" onClose={onClose} />;
}

const SCREEN_SEARCH_SUGGESTIONS = [
  { label: "By Category", items: ["icons", "architectural", "organics", "classics", "indies"] },
  { label: "By Use",      items: ["gates", "fencing", "balustrade", "privacy screens", "dividers", "wall decor", "light features", "pergolas", "awning", "commercial", "residential", "display homes"] },
  { label: "By Design",  items: SCREEN_DESIGNS.map(d => d.name.toLowerCase()) },
];

export function ScreensGalleryModal({ onClose, initialShowCat = false }) {
  const [tab, setTab] = useState("all");
  const [activeDesign, setActiveDesign] = useState(null); // null = show all, string = filtered to one design
  const [designPillsOpen, setDesignPillsOpen] = useState(false);
  const [flatIdx, setFlatIdx] = useState(null); // null = grid view, integer = expanded slideshow
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [jumpByDesign, setJumpByDesign] = useState(true); // true = arrows hop design-to-design; false = image-by-image
  const [showCat, setShowCat] = useState(initialShowCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const searchInputRef = useRef(null);
  const thumbStripRef = useRef(null);
  const activeThumbRef = useRef(null);
  const touchStartX = useRef(0);
  const navTimerRef = useRef(null);
  const schedule = useCallback((fn, ms = 180) => {
    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(navTimerRef.current), []);

  const tabDesigns = useMemo(() => (
    tab === "all"
      ? SCREEN_DESIGNS_SECTIONED
      : SCREEN_DESIGNS_SECTIONED.filter(d => d._sections.includes(tab))
  ), [tab]);
  const visibleDesigns = useMemo(() => (
    activeDesign ? tabDesigns.filter(d => d.name === activeDesign) : tabDesigns
  ), [tabDesigns, activeDesign]);
  const activeDrillDesign = activeDesign ? tabDesigns.find(d => d.name === activeDesign) : null;

  // One entry per image across all visible designs
  const gridItems = useMemo(() => (
    visibleDesigns.flatMap((d, dIdx) =>
      d.items.map((it, iIdx) => ({ img: it.img, pos: it.pos, name: d.name, section: d._section, dIdx, iIdx }))
    )
  ), [visibleDesigns]);

  // Flat index map over ALL designs — resolves a search hit to a grid position
  const allFlat = useMemo(() => (
    SCREEN_DESIGNS_SECTIONED.flatMap((d, dI) => d.items.map((_, iI) => ({ dIdx: dI, iIdx: iI })))
  ), []);

  // Current image in expanded view
  const curFlat   = flatIdx !== null ? gridItems[flatIdx] : null;
  const curDesign = curFlat ? visibleDesigns[curFlat.dIdx] : null;
  const curItem   = curFlat ? curDesign?.items[curFlat.iIdx] : null;
  const curSlides = curItem ? (curItem.slides ?? [curItem.img]) : [];
  const displayImg = curSlides[slideIdx] ?? curFlat?.img;

  // Search results (always across all designs)
  const q = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => (
    !q
      ? []
      : SCREEN_DESIGNS_SECTIONED.flatMap((d, dIdx) => {
          const nameMatch = d.name.toLowerCase().includes(q);
          const tabMatch  = (d.tabs ?? []).some(t => t.includes(q) || q.includes(t));
          // Check if any items in this design have item-level tags (if so, don't fall back to design-level)
          const hasItemTags = d.items.some(it => (it.tags ?? []).length > 0);
          const designTagMatch = !hasItemTags && (d.tags ?? []).some(t => t.includes(q) || q.includes(t));
          return d.items.flatMap((it, iIdx) => {
            const itemMatch = it.name?.toLowerCase().includes(q) || it.description?.toLowerCase().includes(q);
            // Item-level tag: if item has tags, check those; else if design has no item-level tags, use design tags
            const itemTagMatch = (it.tags ?? []).length > 0
              ? (it.tags).some(t => t.includes(q) || q.includes(t))
              : designTagMatch;
            if (!nameMatch && !itemTagMatch && !tabMatch && !itemMatch) return [];
            return [{ img: it.img, pos: it.pos, name: it.name ?? d.name, dIdx, iIdx }];
          });
        })
  ), [q]);

  // Auto-scroll thumb strip to keep active thumb visible
  useEffect(() => {
    if (activeThumbRef.current && thumbStripRef.current) {
      activeThumbRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [flatIdx]);

  // Navigate: two modes depending on how the view was entered.
  // jumpByDesign=true (grid click): arrows hop to the first image of the next/prev design.
  // jumpByDesign=false (name pill click): arrows step image-by-image within the current design.
  const navigateFlat = useCallback((dir) => {
    if (flatIdx === null) return;
    const curName = gridItems[flatIdx]?.name;

    if (jumpByDesign) {
      // Design-hop: skip to first image of next / prev design
      if (dir > 0) {
        let next = flatIdx + 1;
        while (next < gridItems.length && gridItems[next].name === curName) next++;
        if (next >= gridItems.length) next = 0;
        setAnimDir(1);
        schedule(() => { setFlatIdx(next); setSlideIdx(0); setAnimDir(null); });
      } else {
        const firstOfCurrent = gridItems.findIndex(it => it.name === curName);
        if (firstOfCurrent > 0) {
          const prevName = gridItems[firstOfCurrent - 1].name;
          const firstOfPrev = gridItems.findIndex(it => it.name === prevName);
          setAnimDir(-1);
          schedule(() => { setFlatIdx(firstOfPrev >= 0 ? firstOfPrev : 0); setSlideIdx(0); setAnimDir(null); });
        } else {
          // Already first design — wrap to last
          const lastName = gridItems[gridItems.length - 1]?.name;
          const firstOfLast = gridItems.findIndex(it => it.name === lastName);
          setAnimDir(-1);
          schedule(() => { setFlatIdx(firstOfLast >= 0 ? firstOfLast : 0); setSlideIdx(0); setAnimDir(null); });
        }
      }
    } else {
      // Image-step within current design (with slide support)
      if (dir > 0) {
        if (slideIdx < curSlides.length - 1) { setSlideIdx(s => s + 1); return; }
        const next = flatIdx + 1;
        if (next < gridItems.length && gridItems[next].name === curName) {
          setAnimDir(1);
          schedule(() => { setFlatIdx(next); setSlideIdx(0); setAnimDir(null); });
        } else {
          const first = gridItems.findIndex(it => it.name === curName);
          setAnimDir(1);
          schedule(() => { setFlatIdx(first >= 0 ? first : 0); setSlideIdx(0); setAnimDir(null); });
        }
      } else {
        if (slideIdx > 0) { setSlideIdx(s => s - 1); return; }
        const prev = flatIdx - 1;
        if (prev >= 0 && gridItems[prev].name === curName) {
          setAnimDir(-1);
          schedule(() => { setFlatIdx(prev); setSlideIdx(0); setAnimDir(null); });
        } else {
          let last = flatIdx;
          while (last + 1 < gridItems.length && gridItems[last + 1].name === curName) last++;
          setAnimDir(-1);
          schedule(() => { setFlatIdx(last); setSlideIdx(0); setAnimDir(null); });
        }
      }
    }
  }, [flatIdx, jumpByDesign, slideIdx, curSlides.length, gridItems, schedule]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (searchQuery) { setSearchQuery(""); setSearchOpen(false); return; }
        if (showCat) { setShowCat(false); return; }
        if (flatIdx !== null) { setFlatIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (flatIdx !== null && !searchQuery) {
        if (e.key === "ArrowRight") navigateFlat(1);
        if (e.key === "ArrowLeft")  navigateFlat(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flatIdx, showCat, searchQuery, navigateFlat, onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-jet flex flex-col"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50 && flatIdx !== null && !searchQuery) navigateFlat(dx < 0 ? 1 : -1); }}
    >
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3">
        <button onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· Screens</span>
        </button>
        <div className="flex-1 flex justify-center">
          <button onClick={() => setShowCat(true)}
            className="pill-trace font-detail text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/35 bg-transparent text-cream/88 transition-colors duration-200">
            Catalogue
          </button>
        </div>
        <div className="flex items-center gap-2 flex-none">
          {searchOpen
            ? <div className="relative flex items-center">
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  placeholder="Search designs…"
                  className="bg-white/6 border border-white/15 rounded-full pl-3 pr-7 py-1.5 font-detail text-[12px] text-cream placeholder:text-cream/30 focus:outline-none focus:border-clay/50 transition-colors w-24 md:w-36"
                  autoFocus />
                <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="absolute right-2.5 text-cream/30 hover:text-cream/70 transition-colors"><X size={10} /></button>
              </div>
            : <button onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                className="flex items-center gap-2 text-cream/40 hover:text-cream transition-colors" aria-label="Search">
                <span className="hidden md:inline font-detail text-[9px] uppercase tracking-[0.2em]">Refine Search</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="4"/><line x1="9.5" y1="9.5" x2="13" y2="13"/></svg>
              </button>
          }
          <button onClick={onClose} className="flex-none text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
        </div>
      </div>

      {/* Search suggestions dropdown */}
      {searchOpen && searchFocused && !searchQuery && (
        <div className="absolute left-0 right-0 z-50 bg-[#111] border-b border-white/10 px-10 md:px-20 py-4" style={{ top: "49px" }}>
          {SCREEN_SEARCH_SUGGESTIONS.map(group => (
            <div key={group.label} className="mb-3 last:mb-0">
              <p className="font-detail text-[9px] text-cream/40 uppercase tracking-[0.2em] mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(term => (
                  <button key={term} onMouseDown={e => e.preventDefault()} onClick={() => { setSearchQuery(term); }}
                    className="px-3 py-1 rounded-full font-detail text-[9px] bg-white/5 border border-white/10 text-cream/60 hover:border-clay/60 hover:text-cream transition-all duration-200 uppercase tracking-[0.12em]">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category tabs — clicking filters the view; also lights up as position indicator */}
      {!searchQuery && (
        <div className="flex justify-center gap-2 px-5 py-2.5 overflow-x-auto border-b border-white/8 flex-shrink-0" style={{ scrollbarWidth: "none" }}>
          {SCREEN_TABS.map(t => {
            const isFilter   = tab === t.id;
            // Highlight ALL sections the current design belongs to (e.g. ERGO → ICONS + ARCHITECTURAL)
            const isPosition = !isFilter && t.id !== "all" && (
              (activeDrillDesign?._sections?.includes(t.id)) ||
              (curDesign?._sections?.includes(t.id) && flatIdx !== null)
            );
            return (
              <button key={t.id}
                onClick={() => { setTab(t.id); setFlatIdx(null); setSlideIdx(0); setJumpByDesign(true); setActiveDesign(null); setShowGrid(t.id !== "all"); }}
                className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${isFilter ? " pill-active" : ""}`}
                style={{
                  background: "transparent",
                  borderColor: isFilter ? "#9e7134" : isPosition ? "rgba(242,240,233,0.8)" : "rgba(242,240,233,0.45)",
                  color:       isFilter ? "#f2f0e9"  : isPosition ? "#f2f0e9"               : "rgba(242,240,233,0.9)",
                  whiteSpace: "nowrap",
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Design name pills — animated drawer */}
      {!searchQuery && (
        <div className="flex-shrink-0 border-b border-white/6">
          {/* Trigger row */}
          <div className="flex items-center gap-3 px-5 py-2">
            <button
              onClick={() => { if (tab === "all" && !activeDesign && showGrid) { setShowGrid(false); setDesignPillsOpen(false); } else setDesignPillsOpen(o => !o); }}
              className="group flex items-center gap-2.5 transition-colors duration-200"
            >
              <span
                className="flex items-center justify-center rounded-full border font-detail text-[8px] uppercase tracking-[0.14em] transition-all duration-200"
                style={{
                  width: 30, height: 30, flexShrink: 0,
                  borderColor: designPillsOpen ? "#9e7134" : "rgba(242,240,233,0.3)",
                  background: designPillsOpen ? "#9e7134" : "transparent",
                  color: designPillsOpen ? "#f2f0e9" : "rgba(242,240,233,0.6)",
                }}
                onMouseEnter={e => { if (!designPillsOpen) { e.currentTarget.style.background = "#9e7134"; e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}}
                onMouseLeave={e => { if (!designPillsOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.6)"; }}}
              >
                ✦
              </span>
              <span className="font-detail text-[9px] uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ color: designPillsOpen ? "#f2f0e9" : "rgba(242,240,233,0.75)" }}>
                The Editions
              </span>
            </button>
            {/* Active design shown inline when drawer closed */}
            {!designPillsOpen && activeDesign && (
              <span className="font-detail text-[9px] uppercase tracking-[0.14em] px-3 py-1 rounded-full border"
                style={{ borderColor: "#9e7134", color: "#f2f0e9", background: "transparent" }}>
                {activeDesign}
              </span>
            )}
          </div>
          {/* Animated drawer */}
          <div style={{ overflow: "hidden", maxHeight: designPillsOpen ? "300px" : "0px", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              <button
                onClick={() => { setActiveDesign(null); setFlatIdx(null); setSlideIdx(0); setDesignPillsOpen(false); }}
                className="pill-trace flex-shrink-0 px-3 py-1 rounded-full font-detail text-[8px] uppercase tracking-[0.14em] border transition-colors duration-200"
                style={{ background: "transparent", borderColor: !activeDesign ? "#9e7134" : "rgba(242,240,233,0.45)", color: "#f2f0e9", whiteSpace: "nowrap" }}>
                All
              </button>
              {tabDesigns.map((d) => {
                const isActive = activeDesign === d.name;
                return (
                  <button key={d.name}
                    onClick={() => { setActiveDesign(d.name); setFlatIdx(null); setSlideIdx(0); }}
                    className={`pill-trace flex-shrink-0 px-3 py-1 rounded-full font-detail text-[8px] uppercase tracking-[0.14em] border transition-colors duration-200${isActive ? " pill-active" : ""}`}
                    style={{ background: "transparent", borderColor: isActive ? "#9e7134" : "rgba(242,240,233,0.45)", color: "#f2f0e9", whiteSpace: "nowrap" }}>
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search results */}
      {searchQuery && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          {searchResults.length === 0
            ? <p className="font-detail text-cream/30 text-xs uppercase tracking-[0.2em] text-center mt-10">No results</p>
            : <div className="flex flex-wrap justify-center gap-2">
                {searchResults.map((it, i) => (
                  <div key={it.img} onClick={() => {
                    // dIdx/iIdx are relative to SCREEN_DESIGNS_SECTIONED = ALL designs
                    const fi = allFlat.findIndex(x => x.dIdx === it.dIdx && x.iIdx === it.iIdx);
                    setTab("all"); setFlatIdx(fi >= 0 ? fi : null); setSlideIdx(0);
                    setSearchQuery(""); setSearchOpen(false);
                  }}
                    className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                    style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                    <img src={sizedImg(it.img, 700)} alt={it.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={it.pos ? { objectPosition: it.pos } : undefined} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                      <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* Grid view */}
      {!searchQuery && flatIdx === null && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4 relative" data-lenis-prevent>
          {/* Slideshow + pill — ALL tab only, hidden once grid covers it */}
          {tab === "all" && !activeDesign && (
            <div style={{ opacity: showGrid ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: showGrid ? "none" : "auto" }}>
              <ScreensFeatureSlideshow />
              <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 82px" }}>
                <button
                  onClick={() => setShowGrid(true)}
                  style={{
                    background: "rgba(10,8,6,0.55)",
                    backdropFilter: "blur(18px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(18px) saturate(1.4)",
                    border: "1px solid rgba(237,232,223,0.18)",
                    borderRadius: "999px",
                    padding: "10px 28px",
                    color: "rgba(237,232,223,0.9)",
                    fontFamily: "var(--font-detail)",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  View Gallery
                </button>
              </div>
            </div>
          )}
          {/* Grid — slides up over the slideshow like a blind */}
          <div style={{
            transform: tab === "all" && !activeDesign && showGrid ? "translateY(-508px)" : "translateY(0)",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}>
          <div className="flex flex-wrap justify-center gap-2">
            {gridItems.map((it, i) => (
              <React.Fragment key={it.img}>
                <div
                  onClick={() => {
                    if (!activeDesign) {
                      setActiveDesign(it.name); setFlatIdx(null); setSlideIdx(0);
                    } else {
                      setFlatIdx(i); setSlideIdx(0); setJumpByDesign(false);
                    }
                  }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* Expanded / slideshow view */}
      {!searchQuery && flatIdx !== null && curFlat && curItem && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigateFlat(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>

              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={sizedImg(displayImg, 1600)} alt={curFlat.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{curFlat.name}</p>
              </div>

              <button onClick={() => navigateFlat(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>

          {/* Thumbs strip */}
          <div className="flex-shrink-0 border-t border-white/10" style={{ marginTop: 24 }}>
            <div ref={thumbStripRef} data-lenis-prevent className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}
              onWheel={e => { e.preventDefault(); thumbStripRef.current.scrollLeft += e.deltaY + e.deltaX; }}>
              {gridItems.map((it, fi) => {
                const isActive     = fi === flatIdx;
                const isSameDesign = it.name === curFlat?.name;
                return (
                  <div key={fi}
                    ref={isActive ? activeThumbRef : null}
                    onClick={() => { setFlatIdx(fi); setSlideIdx(0); setJumpByDesign(true); }}
                    className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#9e7134" : "transparent"}`, opacity: isActive ? 1 : isSameDesign ? 0.75 : 0.35, transition: "all 0.2s" }}>
                    <img src={sizedImg(it.img, 600)} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showCat && <ScreensCatalogueModal onClose={() => setShowCat(false)} />}
    </div>
  );
}

const SCULPTURE_SEARCH_SUGGESTIONS = [
  { label: "By Design", items: ["homebase", "xavier", "orian", "marakesh", "hue", "yazad", "dandelions", "centennial park", "fiona stanley", "unity in diversity", "aslyiam", "vuelta"] },
  { label: "By Type", items: ["totem", "sculpture", "planter", "feature"] },
];

function ProjectInfoPopup({ project, onClose }) {
  if (!project) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 10100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#141414", border: "1px solid rgba(242,240,233,0.1)", borderRadius: 18, width: "100%", maxWidth: 820, maxHeight: "90dvh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0, padding: "28px 32px 20px", borderBottom: "1px solid rgba(242,240,233,0.08)" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: "rgba(242,240,233,0.35)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
          {project.location && (
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9E7134", margin: "0 0 8px" }}>
              {project.location}
            </p>
          )}
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px,3vw,30px)", color: "#F2F0E9", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.15 }}>
            {project.name}
          </p>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 32px" }} data-lenis-prevent>

          {/* Description */}
          {project.description && (
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 14, color: "rgba(242,240,233,0.7)", lineHeight: 1.85, margin: "0 0 28px" }}>
              {project.description}
            </p>
          )}

          {/* Behind the Scenes images */}
          {!project.hideBehindTheScenes && (
            <>
              <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(242,240,233,0.6)", margin: "0 0 12px" }}>Behind the Scenes</p>
              {project.behindTheScenes && project.behindTheScenes.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {project.behindTheScenes.map((it, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(242,240,233,0.08)" }}>
                      <img src={it.img} alt={it.name} loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: it.pos || "center" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                        <p style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontFamily: "var(--font-detail)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#F2F0E9", lineHeight: 1.3 }}>{it.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsGalleryModal({ onClose }) {
  const [activeProjectCat, setActiveProjectCat] = useState("all");
  const [itemIdx, setItemIdx] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [infoProject, setInfoProject] = useState(null);

  const items = activeProjectCat === "all"
    ? PROJECTS_ROWS.flatMap(r => r.items.map(it => ({ ...it, _cat: r.projectCategory, _rowId: r.id })))
    : PROJECTS_ROWS.filter(r => r.projectCategory === activeProjectCat).flatMap(r => r.items.map(it => ({ ...it, _cat: r.projectCategory, _rowId: r.id })));

  const item = itemIdx !== null ? items[itemIdx] : null;
  const currentItemCat = item?._cat ?? null;
  const slides = item ? (item.slides || [item.img]) : [];
  const total = items.length;

  const navTimerRef = useRef(null);
  const schedule = useCallback((fn, ms = 180) => {
    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(navTimerRef.current), []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setItemIdx(null); setSlideIdx(0); }, [activeProjectCat]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (itemIdx !== null) { setItemIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (itemIdx !== null) {
        if (e.key === "ArrowRight") { setAnimDir(1); schedule(() => { setItemIdx(i => (i + 1) % total); setSlideIdx(0); setAnimDir(null); }); }
        if (e.key === "ArrowLeft")  { setAnimDir(-1); schedule(() => { setItemIdx(i => (i - 1 + total) % total); setSlideIdx(0); setAnimDir(null); }); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [itemIdx, onClose, total, schedule]);

  const navigate = (dir) => {
    setAnimDir(dir);
    schedule(() => { setItemIdx(i => (i + dir + total) % total); setSlideIdx(0); setAnimDir(null); });
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-jet flex flex-col">
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3">
        <button onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· Projects</span>
        </button>
        <div className="flex-1" />
        <button onClick={onClose} className="flex-none text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/8 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
        {[{ id: "all", label: "All" }, ...PROJECT_CATEGORIES].map(cat => {
          const isActive = activeProjectCat === cat.id;
          const isPosition = !isActive && cat.id !== "all" && currentItemCat === cat.id && itemIdx !== null;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveProjectCat(cat.id); setItemIdx(null); setSlideIdx(0); }}
              className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${isActive ? " pill-active" : ""}`}
              style={{
                background: "transparent",
                borderColor: isActive ? "#9e7134" : isPosition ? "rgba(242,240,233,0.8)" : "rgba(242,240,233,0.45)",
                color:       isActive ? "#f2f0e9"  : isPosition ? "#f2f0e9"               : "rgba(242,240,233,0.9)",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          );
        })}
        </div>
        {activeProjectCat !== "all" && (() => {
          const row = PROJECTS_ROWS.find(r => r.projectCategory === activeProjectCat);
          return row ? (
            <button
              onClick={() => setInfoProject(row)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-all duration-200"
              style={{ borderColor: "rgba(242,240,233,0.25)", color: "rgba(242,240,233,0.9)", whiteSpace: "nowrap" }}
            >
              <span style={{ fontSize: 11 }}>ⓘ</span> Project Info
            </button>
          ) : null;
        })()}
      </div>

      {/* Grid view */}
      {itemIdx === null && (
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-4" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="font-detail text-[11px] text-cream/30 uppercase tracking-widest">Images coming soon</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {items.map((it, i) => (
                <div key={it.img} onClick={() => { setItemIdx(i); setSlideIdx(0); }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {itemIdx !== null && item && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>
              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={sizedImg(slides[slideIdx] ?? item.img, 1600)} alt={item.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{item.name}</p>
              </div>
              <button onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>
          <div className="flex-shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {items.flatMap((it, iIdx) => {
                const thumbSlides = it.slides || [it.img];
                const els = thumbSlides.map((src, sIdx) => {
                  const isActive = iIdx === itemIdx && sIdx === slideIdx;
                  return (
                    <div key={`${iIdx}-${sIdx}`} onClick={() => { setItemIdx(iIdx); setSlideIdx(sIdx); }}
                      className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#9e7134" : "transparent"}`, opacity: isActive ? 1 : iIdx === itemIdx ? 0.75 : 0.45, transition: "all 0.2s" }}>
                      <img src={sizedImg(src, 600)} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                  );
                });
                if (iIdx > 0) els.unshift(<div key={`sep-${iIdx}`} style={{ width: 1, height: 34, background: "rgba(242,240,233,0.12)", flexShrink: 0, borderRadius: 1, margin: "0 3px" }} />);
                return els;
              })}
            </div>
          </div>
        </>
      )}
      <ProjectInfoPopup project={infoProject} onClose={() => setInfoProject(null)} />
    </div>
  );
}

export function ConceptsGalleryModal({ onClose }) {
  return <SculptureGalleryModal onClose={onClose} items={CONCEPTS_ITEMS} label="Concepts" />;
}

export function SculptureGalleryModal({ onClose, items: itemsProp = null, label: labelProp = "Sculpture" }) {
  const items = itemsProp ?? SCULPTURE_ITEMS;
  const [itemIdx, setItemIdx] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const touchStartX = useRef(0);

  const item = itemIdx !== null ? items[itemIdx] : null;

  const slides = item ? (item.slides || [item.img]) : [];
  const total = items.length;

  const navTimerRef = useRef(null);
  const schedule = useCallback((fn, ms = 180) => {
    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(navTimerRef.current), []);

  const searchResults = searchQuery
    ? items.map((it, i) => ({ ...it, origIdx: i })).filter(it => it.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (searchQuery) { setSearchQuery(""); return; }
        if (searchOpen) { setSearchOpen(false); return; }
        if (itemIdx !== null) { setItemIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (itemIdx !== null && !searchOpen) {
        if (e.key === "ArrowRight") { setAnimDir(1); schedule(() => { setItemIdx(i => (i + 1) % total); setSlideIdx(0); setAnimDir(null); }); }
        if (e.key === "ArrowLeft")  { setAnimDir(-1); schedule(() => { setItemIdx(i => (i - 1 + total) % total); setSlideIdx(0); setAnimDir(null); }); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [itemIdx, onClose, total, searchQuery, searchOpen, schedule]);

  const navigate = (dir) => {
    setAnimDir(dir);
    schedule(() => { setItemIdx(i => (i + dir + total) % total); setSlideIdx(0); setAnimDir(null); });
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-jet flex flex-col"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50 && itemIdx !== null) navigate(dx < 0 ? 1 : -1); }}
    >
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3 relative">
        <button onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· {labelProp}</span>
        </button>
        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-2 relative">
          <div style={{ display: "flex", alignItems: "center", background: searchOpen ? "rgba(242,240,233,0.08)" : "transparent", borderRadius: 20, transition: "all 0.2s", padding: searchOpen ? "4px 10px" : "4px 6px", border: searchOpen ? "1px solid rgba(242,240,233,0.15)" : "1px solid transparent" }}>
            <button onClick={() => { setSearchOpen(s => !s); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50); else { setSearchQuery(""); setSearchFocused(false); } }}
              className="text-cream/50 hover:text-cream transition-colors flex-shrink-0" style={{ lineHeight: 1 }}>
              <Search size={13} />
            </button>
            {searchOpen && (
              <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="search sculpture…"
                className="bg-transparent text-cream text-[13px] outline-none ml-2 w-20 md:w-32 placeholder-cream/30 font-detail" />
            )}
          </div>
          {/* Suggestions dropdown */}
          {searchOpen && searchFocused && !searchQuery && (
            <div className="absolute right-0 bg-jet border border-white/12 rounded-xl shadow-2xl z-50 min-w-[200px] py-2" style={{ top: "49px" }}>
              {SCULPTURE_SEARCH_SUGGESTIONS.map(group => (
                <div key={group.label} className="px-3 py-1">
                  <p className="font-detail text-[9px] uppercase tracking-[0.14em] text-cream/30 mb-1">{group.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {group.items.map(item => (
                      <button key={item} onMouseDown={() => { setSearchQuery(item); }}
                        className="font-detail text-[10px] text-cream/60 hover:text-cream bg-white/5 hover:bg-white/10 rounded-full px-2 py-0.5 transition-colors capitalize">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onClose} className="flex-none text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
      </div>

      {/* Search results */}
      {searchQuery && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          {searchResults.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="font-detail text-[11px] text-cream/30 uppercase tracking-widest">No results for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {searchResults.map((it, i) => (
                <div key={it.origIdx} onClick={() => { setItemIdx(it.origIdx); setSlideIdx(0); setSearchQuery(""); setSearchOpen(false); }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {!searchQuery && itemIdx === null && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          <div className="flex flex-wrap justify-center gap-2">
            {items.map((it, i) => (
              <div key={it.img} onClick={() => { setItemIdx(i); setSlideIdx(0); }}
                className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={it.pos ? { objectPosition: it.pos } : undefined} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                  <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card view */}
      {!searchQuery && itemIdx !== null && item && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>

              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={sizedImg(slides[slideIdx] ?? item.img, 1600)} alt={item.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{item.name}</p>
              </div>

              <button onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>

          {/* Thumbs strip */}
          <div className="flex-shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {items.flatMap((it, iIdx) => {
                const thumbSlides = it.slides || [it.img];
                const els = thumbSlides.map((src, sIdx) => {
                  const isActive = iIdx === itemIdx && sIdx === slideIdx;
                  return (
                    <div key={`${iIdx}-${sIdx}`} onClick={() => { setItemIdx(iIdx); setSlideIdx(sIdx); }}
                      className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#9e7134" : "transparent"}`, opacity: isActive ? 1 : iIdx === itemIdx ? 0.75 : 0.45, transition: "all 0.2s" }}>
                      <img src={sizedImg(src, 600)} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                  );
                });
                return els;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
