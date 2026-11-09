import { createRoot } from "react-dom/client";
import FeatureScreens from "./components/FeatureScreens";
import "./index.css";
import "./utils/countVisit";

createRoot(document.getElementById("feature-screens-root")).render(<FeatureScreens />);
