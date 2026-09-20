// ─────────────────────────────────────────────────────────────────────────
// Pricing switch.
//
// James has taken pricing off the site for now and will put it back later.
// While this is false the site shows NO prices and never asks for a postcode:
//   • the "Pricing" / "View Pricing" / "See pricing" buttons are not rendered
//   • the postcode gate never opens
//   • "Details & prices" reads "Details" instead
// Sizes, materials and Add to Quote all stay exactly as they are — a quote
// request still reaches James, it simply carries no price.
//
// To put pricing back: set this to true. Nothing else needs changing.
// ─────────────────────────────────────────────────────────────────────────
export const PRICING_ON = false;
