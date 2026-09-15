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
    "Original laser-cut metal wall art, sculpture & architectural features — curated catalogues and bespoke works, crafted in Perth, Western Australia.",
    "Since 2007 ROGETjames has designed and created original laser-cut metal wall art and sculpture, developing an ever-evolving curated catalogue of unique designs. Highly detailed and meticulously designed creations are one feature that sets these works apart.",
    "Sculptural works, free-form wall art, screens and bespoke commissions stretch across Perth and the wider Western Australian region. Found in venues such as Homebase Design Centre, Kings Park, Fiona Stanley Hospital Sculpture Park and Centennial Park; across a gamut of commercial venues including the Cottesloe Hotel, the Duxton Hotel and Lalla Rookh; and in many of Perth's display homes and finest private residences.",
    "Made to last, with durable materials and quality finishes. These works are statement features tailored for architecture and interior styling — where ART meets design.",
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
