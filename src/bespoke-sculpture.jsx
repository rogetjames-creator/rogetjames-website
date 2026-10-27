// Public Bespoke Sculpture gallery at /bespoke-sculpture — the "range" gallery,
// same layout as /screens, with James's four galleries (Public Art, Commercial,
// Planters, Residential). Config lives in src/bespokeSculptureRange.js.
//
// ROLLBACK to the old flat gallery: replace the lines below with —
//   import { createRoot } from "react-dom/client";
//   import { SculptureGalleryModal } from "./components/BespokeCommissions";
//   createRoot(document.getElementById("bespoke-sculpture-root")).render(
//     <SculptureGalleryModal onClose={() => window.location.assign("/")} mediaKey="bespoke-sculpture" />
//   );
import "./index.css";
import { mountBespokeSculptureRange } from "./bespokeSculptureRange";
import { trackGalleryOpen } from "./utils/trackGallery";

trackGalleryOpen("Bespoke Sculpture");
mountBespokeSculptureRange("bespoke-sculpture-root");
