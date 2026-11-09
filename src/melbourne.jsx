import { createRoot } from "react-dom/client";
import MelbourneCityPage from "./components/MelbourneCityPage";
import { MELBOURNE } from "./data/melbourneCity";
import "./index.css";
import "./utils/countVisit";

createRoot(document.getElementById("melbourne-root")).render(<MelbourneCityPage city={MELBOURNE} />);
