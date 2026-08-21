import { createRoot } from "react-dom/client";
import CityPreview from "./components/CityPreview";
import "./index.css";

// ── Adelaide page data ────────────────────────────────────────
// PLACEHOLDER copy + images — a working template, same shape as Perth and
// Sydney. James replaces the wording, the project titles/suburbs and the
// images with real Adelaide detail. Keep the wording genuinely distinct from
// the other city pages.
const ADELAIDE = {
  name: "Adelaide",
  region: "SA",
  displayLine: "",
  intro: [
    "Original laser-cut wall art, sculpture & architectural features — curated catalogues and bespoke works, made for Adelaide architects, designers and discerning clients.",
    "Placeholder — replace with the Adelaide story. South Australian light, bluestone and heritage frontages ask for something different again: pieces that read as considered against stone and render rather than competing with it.",
    "Every piece is drawn, cut and finished to order in Corten steel or powdercoated aluminium, and delivered Australia-wide from the workshop.",
  ],
  hero: "/images/hero/hero-marakesh-wide.jpg",
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",             title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Adelaide project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg",     title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Adelaide project" },
    { src: "/images/screens/elle-corten.jpg",               title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Adelaide project" },
    { src: "/images/screens/eros-pergola-williamstown.jpg", title: "EROS — Pergola",           detail: "Placeholder — replace with real Adelaide project" },
    { src: "/images/custom/custom-hollingworth-1.jpg",      title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Adelaide project" },
    { src: "/images/hero/hero-vasuki.jpg",                  title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Adelaide project" },
  ],
  services: [
    "Wall Art", "Sculpture", "Screens", "Gates & Fencing", "Privacy Panels", "Public Art",
  ],
  // Real Adelaide suburbs help local relevance — edit to the ones actually served.
  suburbs: [
    "North Adelaide", "Unley", "Norwood", "Burnside", "Glenelg", "Henley Beach",
    "Prospect", "Walkerville", "Malvern", "Somerton Park", "Stirling", "McLaren Vale",
  ],
};

createRoot(document.getElementById("adelaide-root")).render(
  <CityPreview city={ADELAIDE} label="Adelaide Page — Private Preview" slug="/adelaide" />
);
