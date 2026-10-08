// ─────────────────────────────────────────────────────────────────────────
// Pricing switch.
//
// Pricing is ON: prices show only after a visitor enters a postcode.
// James took pricing off in Sep 2026 and restored it on 8 Oct 2026.
// Setting this to false shows NO prices and never asks for a postcode:
//   • the "Pricing" / "View Pricing" / "See pricing" buttons are not rendered
//   • the postcode gate never opens
//   • "Details & prices" reads "Details" instead
// Sizes, materials and Add to Quote all stay exactly as they are — a quote
// request still reaches James, it simply carries no price.
//
// To take pricing off again: set this to false. Nothing else needs changing.
// ─────────────────────────────────────────────────────────────────────────
export const PRICING_ON = true;
