import { createRoot } from "react-dom/client";
import CityPreview from "./components/CityPreview";
import "./index.css";

// ── Perth page data ───────────────────────────────────────────
// PLACEHOLDER copy + images — a working template. Replace with real
// Perth detail. Perth is the home studio, so the copy leans "based here".
const PERTH = {
  name: "Perth",
  region: "WA",
  // Heading face — Ivy Mode Regular.
  // Sizes give the same cap height as the MELBOURNE mark (cap ratio 0.728).
  heroTypeClass: "font-ivymode font-normal text-[34.3px] md:text-[58.0px] lg:text-[71.2px]",
  heroStretch: 1.12,   // slight horizontal stretch
  displayLine: "",
  intro: [
    "Laser cut metal wall art, sculpture and bespoke commissions — designed and made in Perth, Western Australia for architects, builders and developers.",
    "The studio works from Perth. Every piece is drawn, cut and finished here in Corten steel that weathers to a deep rust and holds it, or aluminium powdercoated to any colour — both chosen for what WA's coastal air and hard light do to a surface.",
    "Work stands at Homebase Design Centre, at Frasers in Kings Park and at the Cottesloe Beach Hotel, with public sculpture at Fiona Stanley Hospital Sculpture Park and at Centennial Park.",
    "Most of it is commissioned. An architect, a builder or a developer brings a wall, a void, a facade or an entry, and the piece is drawn to it — made for that place rather than chosen from a catalogue. We work to drawings and to program, from concept through to fixing on site, and deliver Australia-wide.",
  ],
  hero: "/images/hero/hero-marakesh-wide.jpg",
  // Hero pictures — they cross-fade, first to last and back round. Slide 1 is
  // whatever is uploaded to Perth's hero spot at /media (the Home Base
  // shopfront); slide 2 is the Corten teardrops in the fountain, the same
  // photo the Melbourne page opens with.
  heroSlides: [
    "/images/hero/hero-marakesh-wide.jpg",
    "/images/uploads/1787360688694_qcw4sh.jpg",
  ],
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",        title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Perth project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg", title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Perth project" },
    { src: "/images/screens/elle-corten.jpg",           title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Perth project" },
    { src: "/images/screens/ergo-cottesloe-gate.jpg",   title: "ERGO — Gate",              detail: "Cottesloe" },
    { src: "/images/custom/custom-hollingworth-1.jpg",  title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Perth project" },
    { src: "/images/hero/hero-vasuki.jpg",              title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Perth project" },
  ],
  services: [
    "Metal Wall Art", "Sculpture", "Bespoke Commissions",
    "Architectural Screens", "Public Art", "Facade & Entry Statements",
  ],
  // The page talks to people who specify work, not to homeowners.
  ctaHeading: "Specifying a piece for a Perth project?",
  // Perth suburbs first, then the WA towns James also delivers to — Geraldton,
  // Margaret River and Esperance are regional, not Perth.
  suburbs: [
    "Cottesloe", "Dalkeith", "Nedlands", "Peppermint Grove", "City Beach", "Applecross",
    "Mount Lawley", "Subiaco", "Claremont", "Swanbourne", "Fremantle", "Mosman Park",
    "North Beach", "Bicton", "Darlington",
    "Geraldton", "Margaret River", "Esperance",
  ],
};

createRoot(document.getElementById("perth-root")).render(
  <CityPreview city={PERTH} label="Perth Page — Private Preview" slug="/perth" />
);
