// Public Screens gallery at /screens — now the "range" gallery (the horizontal
// slideshow layout with categories, Applications, About + "Art of Shadows & Light",
// and the Screens catalogue). Config is shared with /screens-range via
// src/screensRange.js.
//
// ROLLBACK to the old tabbed gallery: replace the two lines below with —
//   import { createRoot } from "react-dom/client";
//   import { ScreensGalleryModal } from "./components/BespokeCommissions";
//   createRoot(document.getElementById("screens-root")).render(
//     <ScreensGalleryModal onClose={() => { window.location.href = "/"; }} />
//   );
// (ScreensGalleryModal is left intact — still used by the Screens portal popup.)
import "./index.css";
import { mountScreensRange } from "./screensRange";

mountScreensRange("screens-root");
