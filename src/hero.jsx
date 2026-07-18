import { createRoot } from "react-dom/client";
import HeroPreview from "./components/HeroPreview";
import "./index.css";

createRoot(document.getElementById("hero-root")).render(<HeroPreview />);
