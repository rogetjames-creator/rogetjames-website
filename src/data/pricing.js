// Single source of truth for wall-art / sculpture pricing.
// Imported by Gallery.jsx AND wall-art.jsx so prices can never disagree.
// The four price fields per tier are a 2x2 of material x region:
//   price -> aluminium WA | priceCorten -> corten WA | pricePC -> aluminium interstate | priceCortenPC -> corten interstate

export const checkWA = (pc) => { const n = parseInt(pc, 10); return n >= 6000 && n <= 6999; };

export const getState = (pc) => {
  const n = parseInt(pc, 10);
  if (n >= 200 && n <= 299) return "ACT";
  if (n >= 800 && n <= 999) return "NT";
  if (n >= 1000 && n <= 1999) return "NSW";
  if (n >= 2000 && n <= 2599) return "NSW";
  if (n >= 2600 && n <= 2618) return "ACT";
  if (n >= 2900 && n <= 2920) return "ACT";
  if (n >= 2619 && n <= 2999) return "NSW";
  if (n >= 3000 && n <= 3999) return "VIC";
  if (n >= 8000 && n <= 8999) return "VIC";
  if (n >= 4000 && n <= 4999) return "QLD";
  if (n >= 9000 && n <= 9999) return "QLD";
  if (n >= 5000 && n <= 5999) return "SA";
  if (n >= 6000 && n <= 6999) return "WA";
  if (n >= 7000 && n <= 7999) return "TAS";
  return null;
};

export const STATE_NAMES = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland",
  SA: "South Australia", WA: "Western Australia", TAS: "Tasmania",
  NT: "Northern Territory", ACT: "Australian Capital Territory",
};

export const SIZE_TIERS = [
  { id: "s", label: "Small",  dims: "600 × 400 mm" },
  { id: "m", label: "Medium", dims: "900 × 600 mm" },
  { id: "l", label: "Large",  dims: "1200 × 800 mm" },
];

export const MATERIAL_OPTIONS = [
  { id: "aluminium", label: "Aluminium Powder Coated" },
  { id: "corten",    label: "Natural Corten Steel" },
];

export const priceFor = (tier, material, isWA) => {
  if (!tier) return null;
  // Corten (Natural Corten Steel) is priced the SAME as Aluminium (Powder Coated) — owner
  // directive 2026-08-04. Both finishes therefore return the Aluminium price for the region.
  const val = isWA ? tier.price : tier.pricePC;
  return val ?? null;
};

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
    // 12 fixings — from the Wall Art & Screens catalogue, Flowers & Blooms page.
    { id: "s", label: "Small", dims: "1100 mm", fixings: 12 },
    { id: "l", label: "Large", dims: "1700 mm", fixings: 12 },
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
  "LIBRATUM": [
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

