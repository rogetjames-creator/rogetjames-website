import { createRoot } from "react-dom/client";
import CityPreview from "./components/CityPreview";
import "./index.css";
import "./utils/countVisit";

// ── Brisbane page data ────────────────────────────────────────
// Was the Gold Coast page until Nov 2026, when fabrication moved to
// Brisbane. PLACEHOLDER copy + images — replace with real Brisbane detail.
const BRISBANE = {
  name: "Brisbane",
  region: "QLD",
  // Photo-upload key kept from the old Gold Coast page, so photos already
  // tagged for it in /media (and new ones tagged "Brisbane") appear here.
  slug: "gold-coast",
  // Heading face — New Astro Medium (set for James's GOLD COAST.svg mark).
  // Sizes give the same cap height as the MELBOURNE mark.
  heroTypeClass: "font-newastro font-medium text-[35.5px] md:text-[60.1px] lg:text-[73.7px]",
  heroStretch: 1.18,   // the horizontal scale in his artwork
  displayLine: "",
  intro: [
    "Original laser-cut wall art, sculpture & architectural features — bespoke pieces made for Brisbane homes, architects and commercial projects across South East Queensland.",
    "Corten steel and powdercoated aluminium, chosen for Queensland's subtropical climate — screens, entry gates, pool fencing and feature walls for humidity, summer storms and strong sun.",
    "Each piece is cut to order for its exact site. ROGETjames works with Brisbane architects, designers and homeowners from concept to installation, and delivers Australia-wide.",
  ],
  hero: "/images/hero/hero-marakesh-wide.jpg",
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",        title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Brisbane project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg", title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Brisbane project" },
    { src: "/images/screens/elle-corten.jpg",           title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Brisbane project" },
    { src: "/images/eros/eros-4.jpg",                   title: "EROS — Pool Gate",         detail: "Pool-compliant" },
    { src: "/images/custom/custom-hollingworth-1.jpg",  title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Brisbane project" },
    { src: "/images/hero/hero-vasuki.jpg",              title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Brisbane project" },
  ],
  services: [
    "Wall Art", "Sculpture", "Screens", "Gates & Fencing", "Pool Screens", "Public Art",
  ],
  // Placeholder service-area list — James to confirm.
  suburbs: [
    "Brisbane CBD", "New Farm", "Teneriffe", "Paddington", "Ascot", "Hamilton",
    "Bulimba", "Toowong", "Indooroopilly", "West End", "Kangaroo Point", "Fortitude Valley",
  ],
};

createRoot(document.getElementById("brisbane-root")).render(
  <CityPreview city={BRISBANE} label="Brisbane Page — Private Preview" slug="/brisbane" />
);
