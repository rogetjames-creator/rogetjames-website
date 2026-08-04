// The live public Sculpture gallery at /sculpture — the "The Range" overview,
// same engine as Wall Art. ROLLBACK: revert this file to
// `createRoot(...).render(<SculptureWall />)` (SculptureWall.jsx is untouched).
import "./index.css";
import { mountRangeGallery } from "./rangeGalleryApp";
import { SCULPTURE_DATA } from "./data/sculptureData";

mountRangeGallery({
  rootId: "sculpture-root",
  data: SCULPTURE_DATA,
  label: "Sculpture",
  noun: "sculpture",
  section: "sculpture",
  catPages: [1, 5, 4, 6, 7].map((n) => `/images/catalogues/cat2/page-${String(n).padStart(2, "0")}.jpg`),
  catLabel: "Sculpture Catalogue",
});
