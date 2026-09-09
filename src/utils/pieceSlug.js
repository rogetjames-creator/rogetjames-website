// One web address per design.
//
//   "BANKSIA Oldmanis"  ->  banksia-oldmanis
//   "VITAE — GREN"      ->  vitae-gren
//
// Used in two places that must always agree:
//   1. the build step that writes a real page for each design, so Google has
//      something to find,
//   2. the gallery's "More about this design" link, which has to point at the
//      page that step wrote.
export function pieceSlug(name) {
  return String(name)
    .toLowerCase()
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
