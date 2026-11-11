// Where James asked an upload to sit, read from the uploader note.
// "Make it the second image", "place 3rd", "put this in 8th position",
// "position 2", "make it first" — all counted from one. Returns null if the
// note does not ask for a place, in which case the upload goes last as usual.
//
// Shared by the uploader (to tell James whether the instruction will be
// carried out), the hero slideshow and the Wall Art ranges, so all three
// read a note the same way.
const ORDINALS = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5,
  sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
};

export function askedPosition(note) {
  const t = String(note || "").toLowerCase();
  if (!/\b(place|put|position|make (?:it|this)|goes?|move|set|as the|be the|should be)\b/.test(t)) return null;
  const m = t.match(/\b(\d{1,2})\s*(?:st|nd|rd|th)\b/) || t.match(/\bposition\s*(?:no\.?\s*|number\s*|#\s*)?(\d{1,2})\b/);
  if (m) return Math.max(1, parseInt(m[1], 10));
  for (const w in ORDINALS) { if (new RegExp("\\b" + w + "\\b").test(t)) return ORDINALS[w]; }
  return null;
}

// Put each positioned item at its asked place (counting from one) in `list`,
// in upload order so a later request wins. Items without a place stay put.
// `items` are { value, position } and must already be in `list`.
export function applyPositions(list, items) {
  const out = [...list];
  for (const { value, position } of items) {
    if (!position) continue;
    const from = out.indexOf(value);
    if (from < 0) continue;
    out.splice(from, 1);
    out.splice(Math.min(position - 1, out.length), 0, value);
  }
  return out;
}
