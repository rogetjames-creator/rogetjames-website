// The live public Wall Art gallery at /wall-art — the "The Range" overview.
// ROLLBACK: revert this file to `createRoot(...).render(<FeatureWall />)` (FeatureWall.jsx is untouched).
import "./index.css";
import { mountRangeGallery } from "./rangeGalleryApp";
import { RANGE_DATA } from "./data/rangeData";
import { trackGalleryOpen } from "./utils/trackGallery";

// Up Close detail shots — always part of the Wall Art gallery: pinned at the end
// of each series' range and gathered into their own "UP CLOSE" range. Fetched
// live (same sources as the main gallery) so new uploads appear automatically,
// and always sit BEFORE these close-ups.
const UPCLOSE = {
  // range title (as it appears in RANGE_DATA) -> the series id the uploader tags
  seriesId: {
    "AUSTRALIAN NATIVES": "australian-natives",
    "CREEPING FIGS": "creeping-fig",
    "BRANCHES": "branches",
    "FLOWERS & BLOOMS": "blooms",
    "PLUMES": "plume",
    "JUNGLE": "jungle",
    "B EDITIONS": "b-editions",
    "THERUS": "therus",
    "IKONA": "ikona",
    "PENDANTS": "pendant",
    "OBLIATIONES": "obliationes",
    "BIRDS": "birds",
    "RETRO": "retro",
    "VITAE": "vitae",
    "NEAZAR": "neazar",
    "CLIENT IMAGES": "client-images",
    // Uploads tagged "custom" land in Custom Creations, which took over the
    // old CUSTOM range in Oct 2026.
    "CUSTOM CREATIONS": "custom",
  },
  // on-disk detail shots seeded per series (kept alongside uploads)
  seed: {
    plume: ["/images/details/plume-deco-rust-1.jpg", "/images/details/plume-deco-rust-2.jpg"],
  },
  // seeds for the standalone UP CLOSE range
  globalSeed: [
    { src: "/images/details/plume-deco-rust-1.jpg", name: "Plume Deco — Corten detail" },
    { src: "/images/details/plume-deco-rust-2.jpg", name: "Plume Deco — Corten detail" },
  ],
};

// CUSTOM CREATIONS is made to order — no fixed size, finish or price. Listing
// it here hides the sizes, the finishes, the pricing panel and the quote.
// It replaced the old CUSTOM range in Oct 2026.
const NO_PRICE_RANGES = ["CUSTOM CREATIONS"];
// Photographs with a title and nothing else: no details button — tapping the
// picture opens it larger. Covers uploads as well as the hand-placed pieces.
const NO_BUTTON_RANGES = ["CUSTOM CREATIONS"];

trackGalleryOpen("Wall Art");

mountRangeGallery({
  rootId: "wall-art-root",
  noPriceRanges: NO_PRICE_RANGES,
  noButtonRanges: NO_BUTTON_RANGES,
  data: RANGE_DATA,
  label: "Wall Art",
  noun: "wall art",
  section: "wall-art",
  rangeWord: "Editions",
  // "Designs" pill under the Editions row — unfolds every design title.
  designPills: true,
  upClose: UPCLOSE,
  basePath: "/wall-art",
});
