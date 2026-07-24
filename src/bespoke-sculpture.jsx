import { createRoot } from "react-dom/client";
import { SculptureGalleryModal } from "./components/BespokeCommissions";
import "./index.css";

// Public Bespoke Sculpture gallery at /bespoke-sculpture. Same component the
// homepage opens as an overlay — it is already a full-screen view, so the
// layout is identical. Standing alone, "close" returns to the homepage
// instead of dismissing a layer.
createRoot(document.getElementById("bespoke-sculpture-root")).render(
  <SculptureGalleryModal onClose={() => window.location.assign("/")} mediaKey="bespoke-sculpture" />
);
