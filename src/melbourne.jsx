import { createRoot } from "react-dom/client";
import CityPage from "./components/CityPage";
import "./index.css";

// ── Melbourne page data ───────────────────────────────────────
// PLACEHOLDER content + images — a working template. James replaces
// the copy, project titles/suburbs and images with real Melbourne
// detail. Keep the wording genuinely distinct from other city pages.
const MELBOURNE = {
  name: "Melbourne",
  region: "VIC",
  // Optional bold line under the big italic "Melbourne." — left empty so the
  // hero reads: "Melbourne." + the flowing subhead below.
  displayLine: "",
  intro: [
    "Original laser-cut wall art, sculpture & architectural features — curated catalogues and bespoke works, crafted in Melbourne for Architects, Designers and discerning clients.",
    "Over years of commissions across Victoria, our Corten steel and powdercoated aluminium pieces have been made to suit Melbourne's mix of heritage terraces, contemporary builds and landmark public spaces — each cut to order for its exact wall, courtyard or facade.",
    "Every piece is drawn, cut and finished to the site. We work directly with Melbourne designers and homeowners from concept through to installation, and deliver Australia-wide from the studio.",
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
    "Wall Art", "Sculpture", "Screens", "Gates & Fencing", "Privacy Panels", "Fire Features", "Public Art",
  ],
  // Real Melbourne suburbs help local relevance — edit to the ones you actually serve.
  suburbs: [
    "South Yarra", "Toorak", "Brighton", "Malvern", "Kew", "Hawthorn",
    "Fitzroy", "Carlton", "Richmond", "St Kilda", "Williamstown", "Mornington Peninsula",
  ],
};

createRoot(document.getElementById("melbourne-root")).render(<CityPage city={MELBOURNE} />);
