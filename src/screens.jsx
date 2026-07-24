import { createRoot } from "react-dom/client";
import { ScreensGallery } from "./components/FeatureScreens";
import "./index.css";

// Public Screens gallery at /screens. Renders the same gallery component as
// the private /feature-screens preview — the only difference is that this
// entry skips the admin gate, so the page has a real address Google can index.
createRoot(document.getElementById("screens-root")).render(<ScreensGallery />);
