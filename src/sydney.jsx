import { createRoot } from "react-dom/client";
import CityPreview from "./components/CityPreview";
import "./index.css";

// ── Sydney page data ──────────────────────────────────────────
// PLACEHOLDER copy + images — a working template. Replace with real
// Sydney detail.
const SYDNEY = {
  name: "Sydney",
  region: "NSW",
  displayLine: "",
  intro: [
    "Original laser-cut wall art, sculpture & architectural features — bespoke works made for Sydney homes, architects and commercial projects across New South Wales.",
    "Our Corten steel and powdercoated aluminium pieces are made to suit Sydney's mix of harbourside residences, terraces and landmark builds — privacy screens, entry gates and feature walls cut to order for each site, from Mosman to the Eastern Suburbs.",
    "Every piece is drawn, cut and finished to the site. We work with Sydney designers and homeowners from concept through to installation, and deliver Australia-wide from the studio.",
  ],
  hero: "/images/hero/hero-marakesh-wide.jpg",
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",        title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Sydney project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg", title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Sydney project" },
    { src: "/images/screens/elle-corten.jpg",           title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Sydney project" },
    { src: "/images/screens/eros-pergola-williamstown.jpg", title: "EROS — Pergola",       detail: "Placeholder — replace with real Sydney project" },
    { src: "/images/custom/custom-hollingworth-1.jpg",  title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Sydney project" },
    { src: "/images/hero/hero-vasuki.jpg",              title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Sydney project" },
  ],
  services: [
    "Wall Art", "Sculpture", "Screens", "Gates & Fencing", "Privacy Panels", "Public Art",
  ],
  suburbs: [
    "Mosman", "Double Bay", "Vaucluse", "Bondi", "Woollahra", "Paddington",
    "Manly", "Bellevue Hill", "Palm Beach", "Rose Bay", "Cronulla", "Northern Beaches",
  ],
};

createRoot(document.getElementById("sydney-root")).render(
  <CityPreview city={SYDNEY} label="Sydney Page — Private Preview" slug="/sydney" />
);
