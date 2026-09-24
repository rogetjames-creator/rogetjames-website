import MelbourneWordmark from "../components/MelbourneWordmark";

// Melbourne page content. Kept out of the component files so both the page
// and its rollback preview can read the one copy.
// ── Melbourne page data ───────────────────────────────────────
// Copy written fresh (Aug 2026) — deliberately shares nothing with the
// earlier Melbourne wording or with the other city pages. It states what
// the practice makes and that Victorian work is cut in Victoria; it never
// places James himself anywhere, and never implies a studio to visit.
export const MELBOURNE = {
  name: "Melbourne",
  headingText: "Laser cut metal wall art and sculpture in Melbourne, Victoria",
  region: "VIC",
  // Hero wordmark in the supplied Ethnocentric font (SVG), replacing the
  // italic Playfair word. Colour/size are set on the wrapper in CityPage.
  heroMark: <MelbourneWordmark className="w-full h-auto" />,
  // Optional bold line under the wordmark — left empty so the hero reads:
  // the Melbourne mark + the flowing subhead below.
  displayLine: "",
  // Intro-section eyebrow.
  madeLabel: "",
  // intro[0] = hero subhead; intro[1..] = the block below the eyebrow, in
  // James's own words, matching the Perth page.
  intro: [
    "Original laser-cut metal wall art, sculpture & architectural features \u2014 curated catalogues and bespoke works, crafted in Melbourne, Victoria for residential, commercial, architectural and landscape spaces.",
    "Since 2007 ROGETjames has designed and created original laser-cut metal wall art and sculpture, developing an ever-evolving curated catalogue of unique designs. Highly detailed and meticulously designed creations are features that set these artworks on their own path.",
    "Sculptural works, free-form wall art, screens and bespoke commissions stretch across Melbourne and the wider Victorian region.",
    "Made to last, with durable materials and quality finishes. These works are statement features tailored for architecture, landscapes and interior styling, where \u2026",
  ],

  hero: "/images/hero/hero-marakesh-wide.jpg",
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",        title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg", title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/screens/elle-corten.jpg",           title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/screens/eros-pergola-williamstown.jpg", title: "EROS — Pergola",       detail: "Williamstown" },
    { src: "/images/custom/custom-hollingworth-1.jpg",  title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/hero/hero-vasuki.jpg",              title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Melbourne project" },
  ],
  services: [
    "Wall Art", "Sculpture", "Screens", "Public Art", "Art Projects",
  ],
  // Real Melbourne suburbs help local relevance — edit to the ones you actually serve.
  suburbs: [
    "South Yarra", "Toorak", "Brighton", "Malvern", "Kew", "Hawthorn",
    "Fitzroy", "Carlton", "Richmond", "St Kilda", "Williamstown", "Mornington Peninsula",
  ],
};
