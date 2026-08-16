// The live public Sculpture gallery at /sculpture — the "The Range" overview,
// same engine as Wall Art, plus live /media upload merging (uploads tagged a
// sculpture category appear as pieces in that category). ROLLBACK: revert this
// file to `createRoot(...).render(<SculptureWall />)` (SculptureWall.jsx is untouched).
import "./index.css";
import { mountSculptureRange } from "./sculptureRange";

mountSculptureRange();
