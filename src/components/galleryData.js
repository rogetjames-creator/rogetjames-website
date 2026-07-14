// Catalogue + gallery seed DATA extracted verbatim from Gallery.jsx.
// Pure data only (no JSX, no component state). Ordered so derived values
// always follow their sources, matching the original module order.

export const REELS = [
  {
    id: "gren-free",
    title: "GREN Free",
    thumb: "/images/reels/gren-free-thumb.jpg",
    video: "/videos/reels/gren-free.mp4",
    detail: "GREN Free — Branches design.",
  },
  {
    id: "branches",
    title: "Branches",
    thumb: "/images/reels/branches-thumb.jpg",
    video: "/videos/reels/branches.mp4",
    detail: "A close-up reel of the Branches laser-cut design — birds perched on delicate steel branches.",
  },
  {
    id: "rue",
    title: "Rue",
    thumb: "/images/reels/rue-thumb.jpg",
    video: "/videos/reels/rue.mp4",
    detail: "Rue — a ROGETjames reel.",
  },
  {
    id: "banksia",
    title: "Banksia",
    thumb: "/images/reels/banksia-thumb.jpg",
    video: "/videos/reels/banksia.mp4",
    detail: "Banksia — a ROGETjames reel.",
  },
  {
    id: "b-editions",
    title: "B Editions",
    thumb: "/images/reels/b-editions-thumb.jpg",
    video: "/videos/reels/b-editions.mp4",
    detail: "B Editions — a curated collection reel.",
  },
  {
    id: "obliationes",
    title: "Obliationes",
    thumb: "/images/reels/obliationes-thumb.jpg",
    video: "/videos/reels/obliationes.mp4",
    detail: "Obliationes — a ROGETjames reel.",
  },
  {
    id: "waroona",
    title: "Waroona",
    thumb: "/images/reels/waroona-thumb.jpg",
    video: "/videos/waroona.mp4",
    detail: "Waroona — a ROGETjames reel.",
    noPortal: true,
  },
];

export const PORTAL_REELS = REELS.filter(r => !r.noPortal);

export const SCULPTURE_PORTAL = {
  id: "gallery-sculpture",
  label: "Sculpture",
  sublabel: "",
  slides: [
    "/images/marakesh/marakesh-1.jpg",
    "/images/autumn-leaf/leaf-fire.jpg",
    "/images/sculptures/medina.jpg",
    "/images/halo/pavia-1.jpg",
    "/images/sculptures/bon-bon.jpg",
    "/images/villa-leaf/villa-leaf-trio-pool.jpg",
  ],
};

export const SCREENS_PORTAL = {
  id: "gallery-screens",
  label: "Screens",
  sublabel: "",
  slides: [
    { src: "/images/screens/orian-wall-decor.jpg", pos: "5% 5%", scale: 1.5 },
    "/images/screens/strip/ferlie-close.jpg",
    "/images/screens/strip/grail-close.jpg",
    "/images/screens/wattle-close-tdl.jpg",
    "/images/screens/viasi-close-up.jpg",
    "/images/screens/elle-corten.jpg",
    { src: "/images/bloom/bloom-closeup.jpg", pos: "center top" },
  ],
};

// Raw local path — the CDN-sourced catalogue shots live in public/images/cdn-gallery/.
// Kept as a plain /images/ path so netlifyImg() can width-optimise them uniformly
// like every other local image (it rewrites to /.netlify/images at render time).
export const CDN = "/images/cdn-gallery";

// Wall Art series — display order
export const WALL_ART_SERIES = [
  // ── AUSTRALIAN NATIVES ───────────────────
  {
    id: "australian-natives",
    label: "AUSTRALIAN NATIVES",
    items: [
      { name: "BANKSIA Card",              img: "/images/banksia/banksia-card-1.jpg" },
      { name: "BANKSIA Oldmanis",          img: "/images/banksia/banksia-oldmanis-bronze.jpg", slides: ["/images/banksia/banksia-oldmanis-bronze.jpg", "/images/banksia/banksia-oldmanis-black.jpg", "/images/banksia/banksia-oldmanis-framed.jpg"] },
      { name: "WANDOO",                    img: "/images/australian-natives/wandoo-1.jpg" },
      { name: "BANKSIA Free Range",        img: "/images/banksia/banksia-main.jpg" },
      { name: "BANKSIA Rec Landscape",     img: "/images/banksia/banksia-rec-rust.jpg", slides: ["/images/banksia/banksia-rec-rust.jpg", "/images/banksia/banksia-rec-framed.jpg", "/images/banksia/banksia-rec-landscape.jpg"] },
      { name: "BANKSIA Rec Portrait",      img: "/images/banksia/banksia-framed-rust.jpg" },
      { name: "BANKSIA Free Range — Custom", img: "/images/banksia/banksia-free-2.jpg" },
      { name: "BANKSIA Round",             img: "/images/banksia/banksia-round.jpg", slides: ["/images/banksia/banksia-round.jpg", "/images/banksia/banksia-round-2.jpg", "/images/banksia/banksia-framed-circle.jpg"] },
      { name: "BANKSIA Deco",              img: "/images/banksia/banksia-deco-2.jpg", slides: ["/images/banksia/banksia-deco-2.jpg", "/images/banksia/banksia-deco.jpg"] },
      { name: "WATTLE",                    img: "/images/australian-natives/wattle-1.jpg" },
      { name: "BANKSIA Diamond",           img: "/images/placeholder.svg" },
      { name: "WANDOO DIAMOND",            img: "/images/placeholder.svg" },
      { name: "NATIVE COLLAGE",            img: "/images/placeholder.svg" },
    ],
  },
  // ── CREEPING FIG SERIES ──────────────────
  {
    id: "creeping-fig",
    label: "CREEPING FIGS",
    items: [
      { name: "AUTUMN",  img: "/images/creeping-fig/autumn-2.jpg", slides: ["/images/creeping-fig/autumn-2.jpg", "/images/creeping-fig/autumn-1.jpg", "/images/creeping-fig/autumn-3.jpg"], singleInAll: true },
      { name: "GRANDE",  img: "/images/creeping-fig/grande-1.jpg", slides: ["/images/creeping-fig/grande-1.jpg", "/images/creeping-fig/grande-2.jpg"] },
      { name: "SPRING",  img: "/images/creeping-fig/spring-1.jpg" },
      { name: "FIGARO",  img: "/images/creeping-fig/figaro-1.jpg" },
      { name: "ONTIO",   img: "/images/creeping-fig/ontio-1.jpg", slides: ["/images/creeping-fig/ontio-1.jpg", "/images/creeping-fig/ontio-2.jpg"] },
      { name: "NUVINE",    img: "/images/creeping-fig/nuvine-1.jpg" },
      { name: "BUTTERFLY", img: "/images/creeping-fig/butterfly-1.jpg" },
    ],
  },
  // ── BRANCHES SERIES ──────────────────────
  {
    id: "branches",
    label: "BRANCHES",
    items: [
      { name: "GREN Edge", img: "/images/branches/gren-edge-1.jpg", slides: ["/images/branches/gren-edge-1.jpg", "/images/branches/gren-edge-3.jpg"] },
      { name: "GREN Tao",  img: "/images/branches/gren-tao-2.jpg", slides: ["/images/branches/gren-tao-2.jpg", "/images/branches/gren-tao-1.jpg"] },
      { name: "GREN Free", img: "/images/branches/gren-free-1.jpg" },
      { name: "GREN X",    img: "/images/branches/gren-x-1.jpg" },
      { name: "VITAE — GREN", img: "/images/vitae/vitae-gren-1.jpg" },
    ],
  },
  // ── FLOWERS & BLOOMS ─────────────────────
  {
    id: "blooms",
    label: "FLOWERS & BLOOMS",
    items: [
      { name: "RUE",          img: "/images/flowers/rue-original.jpg", slides: ["/images/flowers/rue-original.jpg", "/images/flowers/rue-office.jpg"], focus: "center top" },
      { name: "RUE the 3rd", img: "/images/flowers/rue-the-3rd.jpg" },
      { name: "OLIN",         img: "/images/flowers/olin.jpg" },
      { name: "PETUNIA",      img: "/images/flowers/petunia.jpg" },
      { name: "DIAMOND BLOOM",img: `${CDN}/5f33d76a-d731-4265-904f-87e0f5a7eb22_rw_1200.jpg` },
      { name: "FUEILLES",     img: "/images/flowers/fuelles.jpg" },
      { name: "FERLICE",      img: "/images/flowers/ferlice.jpg" },
      { name: "PALM RAJA",    img: "/images/flowers/palm-raja.jpg" },
      { name: "DANDELIONS",   img: `${CDN}/03980b30-48fd-48a3-8027-741f35a87421_rw_1200.jpg` },
      { name: "BLOOM",        img: "/images/placeholder.svg" },
    ],
  },
  // ── PLUME COLLECTION ─────────────────────
  {
    id: "plume",
    label: "PLUMES",
    items: [
      { name: "PLUME DECO Black",    img: "/images/plume/plume-deco-black.jpg", priceKey: "PLUME DECO" },
      { name: "PLUME DECO",          img: "/images/plume/plume-deco-rust2.jpg" },
      { name: "PLUME DECO Pink",     img: "/images/plume/plume-deco-pink.jpg", priceKey: "PLUME DECO" },
      { name: "FEATHER",             img: "/images/plume/feather.jpg" },
      { name: "FEATHER — Toivottaa", img: "/images/plume/feather-wish.jpg" },
      { name: "FLOCK O FEATHERS",    img: "/images/plume/flock-o-feathers.jpg", subtitle: "Hyvää · Toivottaa · Sinulle" },
      { name: "PLUME DECO Rust",     img: "/images/uploads/1783237275228_qn3ggo.jpg", priceKey: "PLUME DECO", _new: true },
      { name: "PLUME DECO Rust II",  img: "/images/uploads/1783237275228_3bixg9.jpg", priceKey: "PLUME DECO", _new: true },
    ],
  },
  // ── JUNGLE COLLECTION ────────────────────
  {
    id: "jungle",
    label: "JUNGLE",
    items: [
      { name: "BAMBU",          img: "/images/jungle/bambu-insitu-1.jpg", slides: ["/images/jungle/bambu-insitu-1.jpg", "/images/jungle/bambu-insitu-2.jpg"] },
      { name: "UBUD Round",     img: "/images/jungle/ubud-round-1.jpg", slides: ["/images/jungle/ubud-round-1.jpg", "/images/jungle/ubud-round-2.jpg"] },
      { name: "UBUD Rectangle", img: "/images/jungle/ubud-rec.jpg" },
    ],
  },
  // ── B EDITIONS ───────────────────────────
  {
    id: "b-editions",
    label: "B EDITIONS",
    items: [
      { name: "HALSTON B", img: "/images/b-editions/halston-b.jpg", focus: "center 85%" },
      { name: "PAVIA B",   img: "/images/b-editions/pavia-b.jpg" },
      { name: "ZED B",     img: "/images/b-editions/zed-b.jpg" },
    ],
  },
  // ── THERUS ───────────────────────────────
  {
    id: "therus",
    label: "THERUS",
    items: [
      { name: "SEAWEED", img: "/images/therus/seaweed-1.jpg", slides: ["/images/therus/seaweed-1.jpg", "/images/therus/seaweed-2.jpg"] },
      { name: "ZON ZEE", img: "/images/neazar/zon-zee-1.jpg", slides: ["/images/neazar/zon-zee-1.jpg", "/images/neazar/zon-zee-2.jpg", "/images/zon-zee-rust2.jpg"] },
      { name: "NEA",     img: "/images/neazar/nea-2.jpg", slides: ["/images/neazar/nea-2.jpg", "/images/neazar/nea-1.jpg"] },
      { name: "ASLYIAM CLASSIC",       img: "/images/placeholder.svg" },
      { name: "THE SUM OF EVERYTHING", img: "/images/placeholder.svg" },
    ],
  },
  // ── IKONA ────────────────────────────────
  {
    id: "ikona",
    label: "IKONA",
    items: [
      { name: "VASUKI",   img: "/images/vasuki/vasuki-sabi.jpg", slides: ["/images/vasuki/vasuki-sabi.jpg", "/images/ikona/vasuka.jpg"] },
      { name: "MAHOLA",   img: "/images/ikona/mahola-1.jpg", slides: ["/images/ikona/mahola-1.jpg", "/images/ikona/mahola-2.jpg"], focus: "center top" },
      { name: "GEO LEAF", img: "/images/ikona/geo-leaf-1.jpg", focus: "center top" },
    ],
  },
  // ── PENDANT SERIES ───────────────────────
  {
    id: "pendant",
    label: "PENDANTS",
    items: [
      { name: "LIBERATUM", img: "/images/pendant/liberatum-1.jpg" },
      { name: "METROPOLIS", img: "/images/neazar/metropolis-1.jpg" },
      { name: "BENIN", img: "/images/pendant/benin-horizontal.jpg", slides: ["/images/pendant/benin-horizontal.jpg", "/images/pendant/benin-vertical.jpg"], focus: "30% top" },
      { name: "SANUR",     img: "/images/pendant/sanur-1.jpg", focus: "center top" },
      { name: "SALAMANKA",  img: "/images/neazar/salamanka-1.jpg" },
    ],
  },
  // ── OBLIATIONES SERIES ───────────────────
  {
    id: "obliationes",
    label: "OBLIATIONES",
    items: [
      { name: "OBLIATIONES",         img: "/images/obliationes/obliationes-1.jpg" },
      { name: "OBLIATIONES — Large", img: "/images/obliationes/obliationes-2.jpg" },
      { name: "OBLIATIONES TIBETAN — Patha", img: "/images/obliationes/obliationes-tibetan-patha.jpg" },
      { name: "OKO", img: "/images/obliationes/oko-1.jpg", slides: ["/images/obliationes/oko-1.jpg", "/images/obliationes/oko-2.jpg", "/images/obliationes/oko-3.jpg"] },
    ],
  },
  // ── THE BIRDS ────────────────────────────
  {
    id: "birds",
    label: "BIRDS",
    items: [
      { name: "BIRDY NUM NUM",              img: "/images/birds/birdy-num-num-1.jpg" },
      { name: "SWALLOWS",                   img: "/images/birds/swallows-install-1.jpg", slides: ["/images/birds/swallows-install-1.jpg", "/images/birds/swallows-free2fly-1.jpg"] },
      { name: "WREN",                       img: "/images/birds/wren-1.jpg" },
      { name: "BIRDY NUM NUM (Free range)", img: "/images/placeholder.svg" },
      { name: "SAVANAH",                    img: "/images/placeholder.svg" },
    ],
  },
  // ── RETRO ────────────────────────────────
  {
    id: "retro",
    label: "RETRO",
    items: [
      { name: "JEAGER",       img: "/images/retro/jeager-insitu.jpg", slides: ["/images/retro/jeager-insitu.jpg", "/images/retro/jeager-2.jpg"] },
      { name: "HALSTON Tall", img: "/images/retro/halston-tall-1.jpg" },
      { name: "ZED O",        img: "/images/retro/zed-o-1.jpg" },
      { name: "ZED",          img: "/images/retro/zed-rec-1.jpg", focus: "right center" },
      { name: "HALSTON",      img: "/images/placeholder.svg" },
      { name: "ORIGINS",      img: "/images/placeholder.svg" },
    ],
  },
  // ── VITAE SERIES ─────────────────────────
  {
    id: "vitae",
    label: "VITAE",
    items: [
      { name: "VITAE — GREN",   img: "/images/vitae/vitae-gren-1.jpg",   slides: ["/images/vitae/vitae-gren-1.jpg", "/images/vitae/vitae-gren-2.jpg"] },
      { name: "VITAE — SHIOGI", img: "/images/vitae/vitae-shiogi-1.jpg", focus: "center top" },
    ],
  },
  // ── NEAZAR ───────────────────────────────
  {
    id: "neazar",
    label: "NEAZAR",
    items: [
      { name: "TRIBE", img: "/images/placeholder.svg" },
      { name: "RAVI",  img: "/images/placeholder.svg" },
      { name: "RYE",   img: "/images/placeholder.svg" },
    ],
  },
  // ── CLIENT IMAGES ─────────────────────────
  {
    id: "client-images",
    label: "CLIENT IMAGES",
    items: [
      { name: "LIBRATUM",   img: "/images/libratum-1.jpg" },
      { name: "METROPOLIS",     img: "/images/metropolis-client-1.jpg" },
      { name: "BENIN Inspired",  img: "/images/benin-inspired-1.jpg" },
      { name: "OMARE — Marion", img: "/images/omare-marion-front.jpg" },
    ],
  },
];

// Other categories (flat grid — more to be structured later)
export const OTHER_CATEGORIES = [
  {
    id: "sculpture",
    label: "Sculpture",
    description: "",
    items: [
      { name: "MARAKESH",   cat: "classics", img: "/images/marakesh/marakesh-promo.jpg", slides: ["/images/marakesh/marakesh-promo.jpg", "/images/marakesh/marakesh-1.jpg", "/images/marakesh/marakesh-cassie.jpg"], materials: ["corten"] },
      { name: "PAVIA",      cat: "classics", img: "/images/halo/pavia-1.jpg" },
      { name: "MOWHITI",    cat: "classics", img: "/images/sculptures/mowhiti.jpg" },
      { name: "OMARE",      cat: "classics", img: "/images/sculptures/omare.jpg", materials: ["corten"] },
      { name: "BON BON",    cat: "bonbons",  img: "/images/sculptures/bon-bon.jpg" },
      { name: "MEDINA",     cat: "bonbons",  img: "/images/sculptures/medina.jpg" },
      { name: "AUTUMN LEAF",cat: "leafs",    img: "/images/autumn-leaf/leaf-bali-1.jpg", slides: ["/images/autumn-leaf/leaf-bali-1.jpg", "/images/autumn-leaf/leaf-fire.jpg", "/images/autumn-leaf/leaf-bali-2.jpg", "/images/autumn-leaf/leafs-wg-copper.jpg", "/images/autumn-leaf/leafs-wg-a.jpg", "/images/autumn-leaf/leafs-wg-black.jpg"] },
      { name: "VILLA LEAF", cat: "leafs",    img: "/images/villa-leaf/villa-leaf-trio-pool.jpg", slides: ["/images/villa-leaf/villa-leaf-trio-pool.jpg", "/images/villa-leaf/villa-leaf-black.jpg", `${CDN}/362f312d-4a16-4ba4-ab9d-8d199041a8cb_rw_1200.jpg`] },
    ],
  },
];

// Self-maintaining wall-art category covers for the Wall Art gallery page (/wall-art).
// One representative image per wall-art category (first real, non-placeholder
// piece), plus that category's own pieces for the sub-thumb row. Add a
// category to the catalogue and it appears here automatically.
export const WALL_ART_COVERS = WALL_ART_SERIES
  .map((s) => {
    const pieces = s.items.filter((it) => it.img && !it.img.includes("placeholder"));
    if (!pieces.length) return null;
    return { id: s.id, label: s.label, img: pieces[0].img, pieces };
  })
  .filter(Boolean);

// Same idea as WALL_ART_COVERS, but for the Sculpture page: the single
// "sculpture" series has no sub-series of its own, just a flat item list
// tagged by `cat` (classics/bonbons/leafs — same ids as SCULPTURE_CATS in
// CardDeckOverlay). Group those into cover cards instead.
export const SCULPTURE_SUBCATS = [
  { id: "classics", label: "The Classics" },
  { id: "leafs",    label: "Leaf Sculptures" },
  { id: "bonbons",  label: "Bon Bons & Genie Bottles" },
];
export const SCULPTURE_COVERS = SCULPTURE_SUBCATS
  .map(({ id, label }) => {
    const allItems = OTHER_CATEGORIES.find((s) => s.id === "sculpture")?.items || [];
    const pieces = allItems.filter((it) => it.cat === id && it.img && !it.img.includes("placeholder"));
    if (!pieces.length) return null;
    return { id, label, img: pieces[0].img, pieces };
  })
  .filter(Boolean);

// Self-maintaining media destinations: every catalogue category is
// automatically an upload target (used by /media). Add a category to the
// catalogue and it appears in the uploader with no other change. Each category
// gets an auto "Up Close" tile (see filteredSeries) that shows its uploads.
export const MEDIA_DESTINATIONS = [...WALL_ART_SERIES, ...OTHER_CATEGORIES]
  .map((s) => ({ key: s.id, label: s.label }));

// Existing on-disk detail shots seeded into a category's Up Close tile so they
// keep showing alongside any uploaded ones.
export const SEED_UPCLOSE = {
  plume: ["/images/details/plume-deco-rust-1.jpg", "/images/details/plume-deco-rust-2.jpg"],
};

export const ALL_TABS = [
  { id: "wall-art", label: "Wall Art" },
  ...OTHER_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
];

// Per-piece size tiers — sourced from ROGETjames 2024 catalogue
export const PIECE_SIZES = {
  // ── Flowers & Blooms ──────────────────────
  "RUE": [
    { id: "s", label: "Small",  dims: "Ø 900 mm",  fixings: "4–6", price: 780,   pricePC: 1190 },
    { id: "m", label: "Medium", dims: "Ø 1100 mm", fixings: "4–6", price: 910,   pricePC: 1320 },
    { id: "l", label: "Large",  dims: "Ø 1500 mm", fixings: "4–6", price: 1240,  pricePC: 1610 },
  ],
  "RUE the 3rd": [
    { id: "s", label: "Small",  dims: "Ø 900 mm",  fixings: "4–6", price: 780,   pricePC: 1190 },
    { id: "m", label: "Medium", dims: "Ø 1100 mm", fixings: "4–6", price: 910,   pricePC: 1320 },
    { id: "l", label: "Large",  dims: "Ø 1500 mm", fixings: "4–6", price: 1240,  pricePC: 1610 },
  ],
  "BLOOM": [
    { id: "l", label: "Standard", dims: "Ø 1800 mm", fixings: 4 },
  ],
  "OLIN": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm", fixings: 4 },
  ],
  "PETUNIA": [
    { id: "s", label: "Small", dims: "1100 mm", fixings: 0 },
    { id: "l", label: "Large", dims: "1700 mm", fixings: 0 },
  ],
  "DIAMOND BLOOM": [
    { id: "m", label: "Medium", dims: "1410 × 1597 mm", fixings: 4, price: 1145, pricePC: 1450, priceCorten: 1145, priceCortenPC: 1250 },
    { id: "l", label: "Large",  dims: "1814 × 2055 mm", fixings: 4, price: 1650, pricePC: 2150, priceCorten: 1650, priceCortenPC: 1650 },
  ],
  "FUEILLES": [
    { id: "s", label: "Small", dims: "Ø 1100 mm", fixings: 4, price: 850,  pricePC: 1400, priceCorten: 850,  priceCortenPC: 1100 },
    { id: "l", label: "Large", dims: "Ø 1490 mm", fixings: 4, price: 1350, pricePC: 1750, priceCorten: 1350, priceCortenPC: 1350 },
  ],
  "FERLICE": [
    { id: "s", label: "Standard", dims: "Ø 1000 mm", fixings: 4, price: 780, pricePC: 780 },
  ],
  "PALM RAJA": [
    { id: "s", label: "Small", dims: "1280 × 1190 mm", fixings: 6 },
    { id: "l", label: "Large", dims: "1600 × 1490 mm", fixings: 6 },
  ],
  "DANDELIONS": [
    { id: "s", label: "Square",   dims: "1200 × 1200 mm", price: 1630, pricePC: 1630 },
    { id: "l", label: "Portrait", dims: "1200 × 2400 mm", price: 2180, pricePC: 2180 },
  ],
  // ── Plume Collection ──────────────────────
  "PLUME DECO": [
    { id: "s", label: "Small",  dims: "1800 × 638 mm",  fixings: 4, price: 895,  priceCorten: 895,  pricePC: 1600, priceCortenPC: 1200 },
    { id: "m", label: "Medium", dims: "2100 × 745 mm",  fixings: 4, price: 1030, priceCorten: 1030, pricePC: 1800, priceCortenPC: 1300 },
    { id: "l", label: "Large",  dims: "2400 × 851 mm",  fixings: 4, price: 1270, priceCorten: 1270, pricePC: 2200, priceCortenPC: 1400 },
  ],
  "FLOCK O FEATHERS": [
    { id: "s", label: "Small",  dims: "1800 mm", fixings: 3, price: 910,  pricePC: 1050 },
    { id: "m", label: "Medium", dims: "2100 mm", fixings: 3, price: 990,  pricePC: 1300 },
    { id: "l", label: "Large",  dims: "2400 mm", fixings: 3, price: 1090, pricePC: 1550 },
  ],
  "FEATHER — Toivottaa": [
    { id: "s", label: "Small",  dims: "1800 mm", fixings: 3, price: 910,  pricePC: 1050 },
    { id: "m", label: "Medium", dims: "2100 mm", fixings: 3, price: 990,  pricePC: 1300 },
    { id: "l", label: "Large",  dims: "2400 mm", fixings: 3, price: 1090, pricePC: 1550 },
  ],
  // ── Jungle Collection ─────────────────────
  "BAMBU": [
    { id: "s", label: "Small",  dims: "750 × 1800 mm",  fixings: 8,  price: 990,  pricePC: 990,  priceCorten: 690,  priceCortenPC: 690  },
    { id: "m", label: "Medium", dims: "950 × 2390 mm",  fixings: 10, price: 1285, pricePC: 1285, priceCorten: 970,  priceCortenPC: 970  },
    { id: "l", label: "Large",  dims: "1190 × 2990 mm", fixings: 10, price: 1615, pricePC: 1615, priceCorten: 1175, priceCortenPC: 1175 },
  ],
  "UBUD Round": [
    { id: "s", label: "Small", dims: "Ø 1195 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "Ø 3495 mm", fixings: 4 },
  ],
  "UBUD Rectangle": [
    { id: "s", label: "Small", dims: "2195 × 850 mm",  fixings: 6 },
    { id: "l", label: "Large", dims: "2995 × 1060 mm", fixings: 6 },
  ],
  // ── IKONA ─────────────────────────────────
  "MAHOLA": [
    { id: "xs", label: "XS",     dims: "463 × 1490 mm", fixings: 4 },
    { id: "s",  label: "Small",  dims: "563 × 1800 mm", fixings: 4 },
    { id: "m",  label: "Medium", dims: "660 × 2100 mm", fixings: 4 },
    { id: "l",  label: "Large",  dims: "775 × 2390 mm", fixings: 4 },
  ],
  "VASUKI": [
    { id: "s",  label: "S",  dims: "1190 × 1683 mm" },
    { id: "m",  label: "M",  dims: "1490 × 2107 mm" },
    { id: "l",  label: "L",  dims: "2120 × 2990 mm (2 parts)" },
    { id: "xl", label: "XL", dims: "2990 × 4230 mm (5 parts)" },
  ],
  "GEO LEAF": [
    { id: "xs", label: "XS",     dims: "528 × 1490 mm", fixings: 4 },
    { id: "s",  label: "Small",  dims: "637 × 1800 mm", fixings: 4 },
    { id: "m",  label: "Medium", dims: "784 × 2100 mm", fixings: 4 },
    { id: "l",  label: "Large",  dims: "846 × 2390 mm", fixings: 4 },
  ],
  // ── Obliationes Series ────────────────────
  "OBLIATIONES": [
    { id: "xs", label: "Mini",   dims: "Ø 550 mm",   fixings: 4 },
    { id: "s",  label: "Small",  dims: "Ø 820 mm",   fixings: 4 },
    { id: "m",  label: "Medium", dims: "Ø 1190 mm",  fixings: 4 },
    { id: "l",  label: "Large",  dims: "Ø 1490 mm",  fixings: 4 },
  ],
  "OBLIATIONES — Large": [
    { id: "s", label: "Small",  dims: "Ø 820 mm",  fixings: 4 },
    { id: "m", label: "Medium", dims: "Ø 1190 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "Ø 1490 mm", fixings: 4 },
  ],
  "OBLIATIONES TIBETAN — Patha": [
    { id: "l", label: "Standard", dims: "Ø 1450 mm", fixings: 4 },
  ],
  "OKO": [
    { id: "s", label: "Small", dims: "1490 × 2060 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "1990 × 1646 mm", fixings: 4 },
  ],
  // ── Branches Series ───────────────────────
  "GREN Edge": [
    { id: "s", label: "Small",  dims: "1418 × 950 mm",  fixings: 8, price: 1420, pricePC: 1820 },
    { id: "m", label: "Medium", dims: "1780 × 1190 mm", fixings: 8, price: 1640, pricePC: 2430 },
    { id: "l", label: "Large",  dims: "2248 × 1490 mm", fixings: 9, price: 1980, pricePC: 2830 },
  ],
  "GREN Tao": [
    { id: "s", label: "Small",  dims: "1490 × 950 mm",  fixings: 9, price: 1420, pricePC: 1820 },
    { id: "m", label: "Medium", dims: "1800 × 1146 mm", fixings: 9, price: 1640, pricePC: 2430 },
    { id: "l", label: "Large",  dims: "2340 × 1490 mm", fixings: 9, price: 1980, pricePC: 2830 },
  ],
  "GREN Free": [
    { id: "s", label: "Small",  dims: "1660 × 950 mm",  fixings: 8, price: 1420, pricePC: 1820 },
    { id: "m", label: "Medium", dims: "2079 × 1190 mm", fixings: 9, price: 1640, pricePC: 2430 },
    { id: "l", label: "Large",  dims: "2390 × 1368 mm", fixings: 9, price: 1980, pricePC: 2830 },
  ],
  "GREN X": [
    { id: "s", label: "Small", dims: "1810 × 1190 mm", fixings: 10, price: 1420, pricePC: 1820 },
    { id: "l", label: "Large", dims: "2267 × 1490 mm", fixings: 11, price: 1980, pricePC: 2830 },
  ],
  // ── Australian Natives ────────────────────
  "WANDOO": [
    { id: "s", label: "Small", dims: "1100 × 1260 mm", fixings: 4, price: 850,  pricePC: 1300, priceCorten: 850,  priceCortenPC: 1050 },
    { id: "l", label: "Large", dims: "1495 × 1713 mm", fixings: 4, price: 1390, pricePC: 1700, priceCorten: 1390, priceCortenPC: 1350 },
  ],
  "WANDOO DIAMOND": [
    { id: "s", label: "Small", dims: "1089 × 977 mm",  fixings: 4 },
    { id: "l", label: "Large", dims: "1508 × 1353 mm", fixings: 4 },
  ],
  "WATTLE": [
    { id: "s", label: "Small", dims: "Ø 1200 mm", fixings: 4, price: 850,  pricePC: 1350, priceCorten: 850,  priceCortenPC: 1100 },
    { id: "l", label: "Large", dims: "Ø 1490 mm", fixings: 4, price: 1300, pricePC: 1700, priceCorten: 1300, priceCortenPC: 1450 },
  ],
  "NATIVE COLLAGE": [
    { id: "s", label: "Small", dims: "1200 × 592 mm" },
    { id: "l", label: "Large", dims: "2390 × 1180 mm" },
  ],
  // ── Banksia Collection ────────────────────
  "BANKSIA Card": [
    { id: "s", label: "Small", dims: "900 × 1800 mm",  fixings: 6, price: 1200, priceCorten: 1200, pricePC: 1500, priceCortenPC: 1400 },
    { id: "l", label: "Large", dims: "1184 × 2386 mm", fixings: 6, price: 1930, priceCorten: 1930, pricePC: 2230, priceCortenPC: 2130 },
  ],
  "BANKSIA Free Range": [
    { id: "s", label: "Small", dims: "890 mm",  fixings: 4 },
    { id: "l", label: "Large", dims: "1490 mm", fixings: 4 },
  ],
  "BANKSIA Free Range 2": [
    { id: "l", label: "Standard", dims: "2225 × 1466 mm", fixings: 12 },
  ],
  "BANKSIA Free Range — Custom": [
    { id: "l", label: "Custom", dims: "Custom sizes available", fixings: 0 },
  ],
  "BANKSIA Round": [
    { id: "s", label: "Small", dims: "1100 × 1200 mm", fixings: 4, price: 1200, priceCorten: 1200, pricePC: 1350, priceCortenPC: 1200 },
    { id: "l", label: "Large", dims: "1495 × 1631 mm", fixings: 4, price: 1750, priceCorten: 1750, pricePC: 1850, priceCortenPC: 1750 },
  ],
  "BANKSIA Rec Portrait": [
    { id: "s", label: "Small", dims: "1100 × 1200 mm",  fixings: 4, price: 1200, pricePC: 1200 },
    { id: "l", label: "Large", dims: "1495 × 1631 mm",  fixings: 4, price: 1750, pricePC: 1750 },
  ],
  "BANKSIA Rec Landscape": [
    { id: "s", label: "Small", dims: "1100 × 1200 mm",  fixings: 4, price: 1200, pricePC: 1200 },
    { id: "l", label: "Large", dims: "1495 × 1631 mm",  fixings: 4, price: 1750, pricePC: 1750 },
  ],
  "BANKSIA Oldmanis": [
    { id: "s", label: "Medium", dims: "1190 × 1911 mm", fixings: 6, price: 2650, pricePC: 2650, priceCorten: 1900, priceCortenPC: 1900 },
    { id: "l", label: "Large",  dims: "1488 × 2390 mm", fixings: 6, price: 3150, pricePC: 3150, priceCorten: 2200, priceCortenPC: 2200 },
  ],
  "BANKSIA Deco": [
    { id: "s", label: "Small", dims: "1142 × 1495 mm", fixings: 4, price: 1630, pricePC: 1630 },
    { id: "l", label: "Large", dims: "1956 × 1495 mm", fixings: 4, price: 2295, pricePC: 2295 },
  ],
  "BANKSIA Diamond": [
    { id: "s", label: "Small",  dims: "1200 × 1200 mm", fixings: 4 },
    { id: "m", label: "Medium", dims: "1590 × 1590 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "1990 × 1990 mm", fixings: 4 },
  ],
  "BANKSIA Free Range 4": [
    { id: "s", label: "Small", dims: "2780 × 1190 mm", fixings: 10 },
    { id: "l", label: "Large", dims: "2854 × 1490 mm", fixings: 10 },
  ],
  "BANKSIA Free Range 5": [
    { id: "s", label: "Small",  dims: "1378 × 882 mm",  fixings: 7 },
    { id: "m", label: "Medium", dims: "1490 × 1190 mm", fixings: 7 },
    { id: "l", label: "Large",  dims: "1866 × 1490 mm", fixings: 7 },
  ],
  // ── Neazar ────────────────────────────────
  "SALAMANKA": [
    { id: "s", label: "Small", dims: "700 × 1200 mm",  fixings: 2 },
    { id: "l", label: "Large", dims: "2020 × 1093 mm", fixings: 2 },
  ],
  "TRIBE": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm", fixings: 4 },
  ],
  "RAVI": [
    { id: "l", label: "Standard", dims: "Ø 1200 mm" },
  ],
  "RYE": [
    { id: "l", label: "Standard", dims: "Ø 800 mm", fixings: 4 },
  ],
  "ZON ZEE": [
    { id: "s", label: "Small", dims: "1490 × 1578 mm", fixings: 4, price: 2000, pricePC: 2000, priceCorten: 1450, priceCortenPC: 1450 },
    { id: "l", label: "Large", dims: "2212 × 2327 mm", fixings: 4, price: 2650, pricePC: 2650, priceCorten: 1900, priceCortenPC: 1900 },
  ],
  "NEA": [
    { id: "s", label: "Small", dims: "820 × 1880 mm",  fixings: 6 },
    { id: "l", label: "Large", dims: "1185 × 1700 mm", fixings: 6, price: 1630, pricePC: 2020 },
  ],
  "METROPOLIS": [
    { id: "s", label: "Small", dims: "1800 × 990 mm",  fixings: 6 },
    { id: "l", label: "Large", dims: "2100 × 1155 mm", fixings: 6 },
  ],
  // ── Pendant Series ────────────────────────
  "BENIN": [
    { id: "s", label: "Small",  dims: "276 × 1800 mm", fixings: 4 },
    { id: "m", label: "Medium", dims: "362 × 2390 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "460 × 2990 mm", fixings: 4 },
  ],
  "LIBERATUM": [
    { id: "s", label: "Small",  dims: "276 × 1800 mm", fixings: 4 },
    { id: "m", label: "Medium", dims: "362 × 2390 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "460 × 2990 mm", fixings: 4 },
  ],
  "SANUR": [
    { id: "s", label: "Small",  dims: "276 × 1800 mm" },
    { id: "m", label: "Medium", dims: "362 × 2390 mm" },
    { id: "l", label: "Large",  dims: "460 × 2990 mm" },
  ],
  // ── The Birds ─────────────────────────────
  "BIRDY NUM NUM": [
    { id: "s", label: "Small", dims: "1077 × 1190 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "1490 × 1664 mm", fixings: 4 },
  ],
  "WREN": [
    { id: "l", label: "Custom", dims: "Custom sizes", fixings: 4 },
  ],
  "BIRDY NUM NUM (Free range)": [
    { id: "l", label: "Standard", dims: "812 × 1490 mm", fixings: 4 },
  ],
  "SAVANAH": [
    { id: "s", label: "Small",  dims: "1200 × 523 mm",  fixings: "4–6" },
    { id: "m", label: "Medium", dims: "1800 × 785 mm",  fixings: "4–6" },
    { id: "l", label: "Large",  dims: "2400 × 1045 mm", fixings: "4–6" },
  ],
  // ── Centis ────────────────────────────────
  "URCHIN": [
    { id: "l", label: "Standard", dims: "Ø 1800 mm", fixings: 4 },
  ],
  "VIASI O": [
    { id: "s", label: "Small", dims: "Ø 1490 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "Ø 1800 mm", fixings: 4 },
  ],
  "ASLYIAM O": [
    { id: "xs", label: "Small",  dims: "Ø 1100 mm", fixings: 4, pricePC: 1250, priceCortenPC: 750 },
    { id: "s",  label: "Medium", dims: "Ø 1490 mm", fixings: 4, pricePC: 1450, priceCortenPC: 950 },
    { id: "l",  label: "Large",  dims: "Ø 1800 mm", fixings: 4 },
  ],
  "CENTENNIAL": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm", fixings: 4 },
  ],
  "LUMIER": [
    { id: "l", label: "Standard", dims: "Ø 1200 mm", fixings: 4 },
  ],
  // ── Therus ────────────────────────────────
  "ASLYIAM CLASSIC": [
    { id: "s", label: "Small", dims: "1495 × 1142 mm", fixings: 6 },
    { id: "l", label: "Large", dims: "1956 × 1495 mm", fixings: 6 },
  ],
  "THE SUM OF EVERYTHING": [
    { id: "l", label: "Standard", dims: "1200 × 1200 mm", fixings: 4 },
  ],
  "SEAWEED": [
    { id: "l", label: "Standard", dims: "1860 × 995 mm" },
  ],
  // ── Retro ─────────────────────────────────
  "HALSTON B": [
    { id: "l", label: "Standard", dims: "990 × 2380 mm", fixings: 6 },
  ],
  "ZED B": [
    { id: "l", label: "Standard", dims: "Ø 1627 mm", fixings: 4 },
  ],
  "PAVIA B": [
    { id: "l", label: "Standard", dims: "TBC" },
  ],
  "HALSTON Tall": [
    { id: "s", label: "Small", dims: "979 × 1878 mm",  fixings: 6, price: 1750, pricePC: 1750, priceCorten: 1500, priceCortenPC: 1500 },
    { id: "l", label: "Large", dims: "1190 × 2381 mm", fixings: 6, price: 2400, pricePC: 2400, priceCorten: 2050, priceCortenPC: 2050 },
  ],
  "HALSTON": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm / 1100 × 1100 mm", fixings: 4 },
  ],
  "ZED O": [
    { id: "l", label: "Standard", dims: "Ø 1627 mm", fixings: 4 },
  ],
  "ZED O SCREEN": [
    { id: "l", label: "Standard", dims: "990 × 2358 mm", fixings: 6 },
  ],
  "ORIGINS": [
    { id: "l", label: "Standard", dims: "Ø 1800 mm", fixings: 4 },
  ],
  // ── Creeping Fig Series ────────────────────
  "AUTUMN": [
    { id: "s", label: "Small",  dims: "1800 × 1000 mm", price: 1150, priceCorten: 1150 },
    { id: "m", label: "Medium", dims: "2315 × 1195 mm", price: 1870, priceCorten: 1870 },
    { id: "l", label: "Large",  dims: "2870 × 1490 mm", price: 2350, pricePC: 2550, priceCorten: 2350, priceCortenPC: 1900 },
  ],
  "FIGARO": [
    { id: "s", label: "Small", dims: "2395 × 1330 mm", price: 1870, pricePC: 1870 },
    { id: "l", label: "Large", dims: "2685 × 1490 mm", price: 2200, pricePC: 2200 },
  ],
  "GRANDE": [
    { id: "l", label: "Standard", dims: "4150 × 1465 mm", price: 3200, pricePC: 3150, priceCortenPC: 2400 },
  ],
  "SPRING": [
    { id: "l", label: "Standard", dims: "900 × 2400 mm" },
  ],
  "ONTIO": [
    { id: "s", label: "Small", dims: "800 × 1000 mm" },
    { id: "l", label: "Large", dims: "1420 × 1733 mm" },
  ],
  "NUVINE": [
    { id: "s", label: "Small", dims: "479 × 2390 mm",  fixings: 4, pricePC: 1250, priceCortenPC: 600 },
    { id: "l", label: "Large", dims: "600 × 2990 mm",  fixings: 4, pricePC: 1500, priceCortenPC: 800 },
  ],
  "BUTTERFLY": [
    { id: "l", label: "Standard", dims: "4371 × 1377 mm", price: 3900, pricePC: 3900 },
  ],
  // ── Screens ───────────────────────────────
  "JEAGER": [
    { id: "l", label: "Standard", dims: "2395 × 540 mm", priceCorten: 1100, priceCortenPC: 1100, price: 1150, pricePC: 1150 },
  ],
  // ── Sculpture — The Classics ───────────────
  "MARAKESH": [
    { id: "s",  label: "1500mm", dims: "H 1500 mm", price: 3000, priceCorten: 3000, pricePC: 3245, priceCortenPC: 3245 },
    { id: "m",  label: "1800mm", dims: "H 1800 mm", price: 3500, priceCorten: 3500, pricePC: 3795, priceCortenPC: 3795 },
    { id: "l",  label: "2100mm", dims: "H 2100 mm", price: 4150, priceCorten: 4150, pricePC: 4345, priceCortenPC: 4345 },
  ],
  "OMARE": [
    { id: "s",  label: "1500mm", dims: "H 1500 mm" },
    { id: "m",  label: "1800mm", dims: "H 1800 mm" },
    { id: "l",  label: "2100mm", dims: "H 2100 mm" },
    { id: "xl", label: "2400mm", dims: "H 2400 mm" },
  ],
  // ── Sculpture — Bon Bons ───────────────────
  "BON BON": [
    { id: "x", label: "BON BON X", dims: "H 1800 mm" },
    { id: "e", label: "BON BON E", dims: "H 3000 mm" },
  ],
  // ── Sculpture — Leaf Sculptures ───────────
  "AUTUMN LEAF": [
    { id: "m",  label: "1500mm", dims: "680 × 1500 mm", price: 1495, priceCorten: 1495, pricePC: 1695, priceCortenPC: 1695 },
    { id: "l",  label: "1800mm", dims: "785 × 1800 mm", price: 1795, priceCorten: 1795, pricePC: 1995, priceCortenPC: 1995 },
    { id: "xl", label: "2100mm", dims: "915 × 2100 mm", price: 2100, priceCorten: 2100, pricePC: 2300, priceCortenPC: 2300 },
    { id: "2x", label: "2400mm", dims: "935 × 2400 mm", price: 2350, priceCorten: 2350, pricePC: 2550, priceCortenPC: 2550 },
  ],
  "VILLA LEAF": [
    { id: "m",  label: "1500mm", dims: "428 × 1500 mm", price: 1150, priceCorten: 1150, pricePC: 1350, priceCortenPC: 1350 },
    { id: "l",  label: "1800mm", dims: "512 × 1800 mm", price: 1270, priceCorten: 1270, pricePC: 1470, priceCortenPC: 1470 },
    { id: "xl", label: "2100mm", dims: "598 × 2100 mm", price: 1390, priceCorten: 1390, pricePC: 1590, priceCortenPC: 1590 },
    { id: "2x", label: "2400mm", dims: "684 × 2400 mm", price: 1630, priceCorten: 1630, pricePC: 1830, priceCortenPC: 1830 },
  ],
};

// Build a lookup: design name → all unique image URLs across every series/category
export const NAME_TO_IMAGES = (() => {
  const map = {};
  const add = (name, img) => {
    if (!map[name]) map[name] = [];
    if (!map[name].includes(img)) map[name].push(img);
  };
  const addItem = (i) => {
    if (i.slides) i.slides.forEach(src => add(i.name, src));
    else add(i.name, i.img);
  };
  WALL_ART_SERIES.forEach((s) => s.items.forEach(addItem));
  OTHER_CATEGORIES.forEach((c) => c.items.forEach(addItem));
  return map;
})();

// Search aliases — maps a keyword to items that should appear in results.
// Each entry is either a name string (matches any series) or {name, series} (exact series match).
export const ROUND_ITEMS = [
  "OBLIATIONES",
  "OBLIATIONES — Large",
  "OBLIATIONES TIBETAN — Patha",
  "WANDOO",
  { name: "WATTLE", series: "AUSTRALIAN NATIVES" },
  "BIRDY NUM NUM",
  "FERLICE",
  "OLIN",
  "FUEILLES",
  "DANDELIONS",
];
export const SEARCH_ALIASES = {
  round:    ROUND_ITEMS,
  circle:   ROUND_ITEMS,
  circular: ROUND_ITEMS,
  floral: [
    "RUE", "RUE the 3rd", "OLIN", "FERLICE", "FUEILLES", "DANDELIONS",
    "BANKSIA Free Range", "BANKSIA Round", "BANKSIA Rec Landscape", "BANKSIA Rec Portrait",
    "BANKSIA Oldmanis", "BANKSIA Deco", "BANKSIA Diamond",
    { name: "WATTLE", series: "AUSTRALIAN NATIVES" }, "WANDOO", "BIRDY NUM NUM",
    "GREN Edge", "GREN Tao", "GREN Free", "GREN X",
  ],
  organic: [
    "RUE", "RUE the 3rd", "OLIN", "FERLICE", "FUEILLES", "DANDELIONS",
    "BANKSIA Free Range", "BANKSIA Round", "BANKSIA Rec Landscape", "BANKSIA Rec Portrait", "BANKSIA Oldmanis", "BANKSIA Deco",
    "GREN Edge", "GREN Tao", "GREN Free", "GREN X",
    { name: "WATTLE", series: "AUSTRALIAN NATIVES" }, "WANDOO", "BIRDY NUM NUM",
    "CREEPING FIG", "GRANDE CF", "OASIS CF", "BANKSIA CF",
    "VITAE — GREN", "VITAE — SHIOGI",
  ],
  geometric: [
    "OBLIATIONES", "OBLIATIONES — Large", "OBLIATIONES TIBETAN — Patha", "OKO",
    "SALAMANKA", "METROPOLIS", "NEA", "ZON ZEE",
    "JEAGER", "ZED O", "ORIGINS",
    "PLUME", "PLUME FERN",
  ],
  abstract: [
    "SALAMANKA", "METROPOLIS", "NEA", "ZON ZEE", "OKO",
    "JEAGER", "ZED O",
    "PLUME", "PLUME FERN",
  ],
};

// Suggestion groups shown when search is focused but empty
export const SEARCH_SUGGESTIONS = [
  {
    label: "By Style",
    items: ["round", "floral", "organic", "geometric", "abstract", "sculptural"],
  },
  {
    label: "By Series",
    items: ["flowers", "plume", "branches", "australian natives", "creeping fig", "jungle", "b editions", "therus", "ikona", "obliationes", "neazar", "pendant", "birds", "centis", "retro", "vitae", "sculpture", "screens", "fire & light"],
  },
];

// Flat list of every item across all series/categories for search
export const ALL_SEARCHABLE = [
  ...WALL_ART_SERIES.flatMap(s => s.items.map(item => ({ ...item, _series: s.label }))),
  ...OTHER_CATEGORIES.flatMap(c => c.items.map(item => ({ ...item, _series: c.label }))),
];

// Wall Art catalogue: pages 1–20 covers the section up to and including Creeping Fig.
// Adjust the 20 if the cutoff page changes.
export const WALL_ART_CAT_PAGES = Array.from({ length: 26 }, (_, i) =>
  `/images/catalogues/cat1/page-${String(i + 4).padStart(2, "0")}.jpg`
);
export const SCULPTURE_CAT_PAGES = [1, 5, 4, 6, 7].map(n =>
  `/images/catalogues/cat2/page-${String(n).padStart(2, "0")}.jpg`
);

// ── Card Deck Overlay ─────────────────────────────────────────────────────
export const DECK_SERIES = [...WALL_ART_SERIES, ...OTHER_CATEGORIES].map(s => ({
  id: s.id,
  label: s.label,
  items: s.items.filter(i => i.img && !i.img.includes("placeholder")),
})).filter(s => s.items.length > 0);

// Which series ids belong to Wall Art (vs Sculpture) — stable, module-level so
// it can serve as a clean useMemo dependency inside the overlay.
export const WALL_ART_IDS = new Set(WALL_ART_SERIES.map(s => s.id));

// Oldest→newest by upload time, so a freshly uploaded close-up always lands last.
export const byUploadTime = (a, b) => new Date(a.createdTime || 0) - new Date(b.createdTime || 0);

// ── "Up Close" gallery ────────────────────────────────────────────────────
// Images for the "Up Close" pill (sits next to Slideshow in the wall art
// catalogue). Add close-up / detail shots here, one per line.
export const UP_CLOSE_IMAGES = [
  { src: "/images/details/plume-deco-rust-1.jpg", name: "Plume Deco — Corten detail" },
  { src: "/images/details/plume-deco-rust-2.jpg", name: "Plume Deco — Corten detail" },
];
