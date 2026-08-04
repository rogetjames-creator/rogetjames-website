// The live public Wall Art gallery at /wall-art — the "The Range" overview.
// ROLLBACK: revert this file to `createRoot(...).render(<FeatureWall />)` (FeatureWall.jsx is untouched).
import "./index.css";
import { mountRangeGallery } from "./rangeGalleryApp";
import { RANGE_DATA } from "./data/rangeData";

mountRangeGallery({
  rootId: "wall-art-root",
  data: RANGE_DATA,
  label: "Wall Art",
  noun: "wall art",
  section: "wall-art",
  catPages: Array.from({ length: 26 }, (_, i) => `/images/catalogues/cat1/page-${String(i + 4).padStart(2, "0")}.jpg`),
  catLabel: "Wall Art Catalogue",
});
