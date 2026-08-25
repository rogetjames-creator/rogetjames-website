// One web address per range.
//
//   "AUSTRALIAN NATIVES"  ->  australian-natives
//   "FLOWERS & BLOOMS"    ->  flowers-and-blooms
//
// Used in two places that must always agree:
//   1. the gallery itself — reads the address on load to open on that range,
//      and keeps the address in step as you scroll,
//   2. the build step that writes a real page for each range so Google has
//      something to find.
export function rangeSlug(label) {
  return String(label || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
