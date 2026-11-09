// ─────────────────────────────────────────────────────────────────────────
// Pricing switch.
//
// Pricing is OFF: no prices and no postcode step anywhere on the site.
// Off Sep 2026, on 8 Oct 2026, off again 9 Nov 2026 while James redoes prices.
// Setting this to false shows NO prices and never asks for a postcode:
//   • the "Pricing" / "View Pricing" / "See pricing" buttons are not rendered
//   • the postcode gate never opens
//   • "Details & prices" reads "Details" instead
// Sizes, materials and Add to Quote all stay exactly as they are — a quote
// request still reaches James, it simply carries no price.
//
// To take pricing off again: set this to false. Nothing else needs changing.
// ─────────────────────────────────────────────────────────────────────────
export const PRICING_ON = false;
