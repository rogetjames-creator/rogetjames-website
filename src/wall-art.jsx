// The live public Wall Art gallery at /wall-art — the "The Range" overview.
// ROLLBACK: revert this file to `createRoot(...).render(<FeatureWall />)` (FeatureWall.jsx is untouched).
import "./index.css";
import { mountRangeGallery } from "./rangeGalleryApp";
import { RANGE_DATA } from "./data/rangeData";

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
    "CUSTOM": "custom",
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

// CUSTOM is made to order — no fixed size, finish or price. Listing it here
// hides the sizes, the finishes, the postcode/pricing panel and the quote
// button for that range. The detail panel still opens (image + name), ready
// for the written piece James will add later.
const NO_PRICE_RANGES = ["CUSTOM"];

mountRangeGallery({
  rootId: "wall-art-root",
  noPriceRanges: NO_PRICE_RANGES,
  data: RANGE_DATA,
  label: "Wall Art",
  noun: "wall art",
  section: "wall-art",
  rangeWord: "Editions",
  upClose: UPCLOSE,
  basePath: "/wall-art",
});
