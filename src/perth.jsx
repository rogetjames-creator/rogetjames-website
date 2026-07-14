import { createRoot } from "react-dom/client";
import CityPreview from "./components/CityPreview";
import "./index.css";

// ── Perth page data ───────────────────────────────────────────
// PLACEHOLDER copy + images — a working template. Replace with real
// Perth detail. Perth is the home studio, so the copy leans "based here".
const PERTH = {
  name: "Perth",
  region: "WA",
  displayLine: "",
  intro: [
    "Original laser-cut wall art, sculpture & architectural features — designed and made in Perth for Architects, Designers and discerning clients across Western Australia.",
    "The studio is based in Perth, so every Corten steel and powdercoated aluminium piece is drawn, cut and finished here — made to suit WA's coastal light, limestone walls and contemporary builds, from Cottesloe courtyards to Swan Valley facades.",
    "We work face-to-face with Perth homeowners, builders and designers from first concept through to installation, and deliver Australia-wide from the workshop.",
  ],
  hero: "/images/hero/hero-marakesh-wide.jpg",
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",        title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Perth project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg", title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Perth project" },
    { src: "/images/screens/elle-corten.jpg",           title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Perth project" },
    { src: "/images/screens/ergo-cottesloe-gate.jpg",   title: "ERGO — Gate",              detail: "Cottesloe" },
    { src: "/images/custom/custom-hollingworth-1.jpg",  title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Perth project" },
    { src: "/images/hero/hero-vasuki.jpg",              title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Perth project" },
  ],
  services: [
    "Wall Art", "Sculpture", "Screens", "Gates & Fencing", "Privacy Panels", "Public Art",
  ],
  suburbs: [
    "Cottesloe", "Dalkeith", "Nedlands", "Peppermint Grove", "City Beach", "Applecross",
    "Mount Lawley", "Subiaco", "Claremont", "Swanbourne", "Fremantle", "Mosman Park",
  ],
};

createRoot(document.getElementById("perth-root")).render(
  <CityPreview city={PERTH} label="Perth Page — Private Preview" slug="/perth" />
);
