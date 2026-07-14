// Pricing + regional postcode helpers extracted verbatim from Gallery.jsx.
// Pure functions/data only — no computation or gating changed.

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

// Size tiers shown in the detail popup — edit these to match actual offerings
export const SIZE_TIERS = [
  { id: "s", label: "Small",  dims: "600 × 400 mm" },
  { id: "m", label: "Medium", dims: "900 × 600 mm" },
  { id: "l", label: "Large",  dims: "1200 × 800 mm" },
];

export const MATERIAL_OPTIONS = [
  { id: "aluminium", label: "Aluminium Powder Coated" },
  { id: "corten",    label: "Natural Corten Steel" },
];

// Single source of truth for a size tier's price.
// The four price fields form a 2×2 matrix of material × region:
//   price          → aluminium, WA            priceCorten    → corten, WA
//   pricePC        → aluminium, interstate     priceCortenPC  → corten, interstate
// "PC" means PostCode (interstate), NOT powder-coat. Both the lightbox pricing
// popup and the card-deck pricing must go through this so they can never disagree.
// Returns null when the relevant price is unset (caller shows POA / "Enquire").
export const priceFor = (tier, material, isWA) => {
  if (!tier) return null;
  const corten = material === "corten";
  const val = isWA
    ? (corten ? tier.priceCorten : tier.price)
    : (corten ? tier.priceCortenPC : tier.pricePC);
  return val ?? null;
};
