// /screens-range — the same "range" Screens gallery as the live /screens page,
// kept as a working preview URL. Shares its config with src/screens.jsx via
// src/screensRange.js (single source of truth).
import "./index.css";
import { mountScreensRange } from "./screensRange";

mountScreensRange("screens-range-root");
