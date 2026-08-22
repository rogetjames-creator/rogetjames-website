import { createRoot } from "react-dom/client";
import CityPreview from "./components/CityPreview";
import "./index.css";

// ── Gold Coast page data ──────────────────────────────────────
// PLACEHOLDER copy + images — a working template. Replace with real
// Gold Coast detail.
const GOLD_COAST = {
  name: "Gold Coast",
  region: "QLD",
  // Heading face — New Astro Medium, from James's GOLD COAST.svg.
  // Sizes give the same cap height as the MELBOURNE mark.
  heroTypeClass: "font-newastro font-medium text-[35.5px] md:text-[60.1px] lg:text-[73.7px]",
  heroStretch: 1.18,   // the horizontal scale in his artwork
  displayLine: "",
  intro: [
    "Original laser-cut wall art, sculpture & architectural features — bespoke pieces made for Gold Coast homes, architects and waterfront developments across South East Queensland.",
    "Our Corten steel and marine-grade powdercoated aluminium suit the Gold Coast's climate — pool-compliant screens, entry gates and feature walls made to stand up to salt air and subtropical sun, from Broadbeach towers to Sanctuary Cove canal homes.",
    "Each piece is cut to order for its exact site. We work with Gold Coast designers and homeowners from concept to installation, and deliver Australia-wide from the studio.",
  ],
  hero: "/images/hero/hero-marakesh-wide.jpg",
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",        title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Gold Coast project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg", title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Gold Coast project" },
    { src: "/images/screens/elle-corten.jpg",           title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Gold Coast project" },
    { src: "/images/eros/eros-4.jpg",                   title: "EROS — Pool Gate",         detail: "Pool-compliant" },
    { src: "/images/custom/custom-hollingworth-1.jpg",  title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Gold Coast project" },
    { src: "/images/hero/hero-vasuki.jpg",              title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Gold Coast project" },
  ],
  services: [
    "Wall Art", "Sculpture", "Screens", "Gates & Fencing", "Pool Screens", "Public Art",
  ],
  suburbs: [
    "Broadbeach", "Mermaid Beach", "Burleigh Heads", "Palm Beach", "Surfers Paradise", "Main Beach",
    "Sanctuary Cove", "Hope Island", "Robina", "Currumbin", "Coolangatta", "Isle of Capri",
  ],
};

createRoot(document.getElementById("gold-coast-root")).render(
  <CityPreview city={GOLD_COAST} label="Gold Coast Page — Private Preview" slug="/gold-coast" />
);
