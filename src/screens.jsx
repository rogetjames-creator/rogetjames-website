import { createRoot } from "react-dom/client";
import { ScreensGalleryModal } from "./components/BespokeCommissions";
import "./index.css";

// Public Screens gallery at /screens — the original tabbed gallery with "The
// Editions" (the one opened as a pop-up from the Screens portal), rendered
// full-page here. Its close/logo returns to the home page since there is no
// page underneath it.
createRoot(document.getElementById("screens-root")).render(
  <ScreensGalleryModal onClose={() => { window.location.href = "/"; }} />
);
