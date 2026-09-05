// Photo descriptions for Google.
//
// Every artwork photo carries a short line saying what it is. Nothing shows on
// the page — the text sits behind the image, where Google Images reads it. Left
// blank (which is how most of the site was), a piece can never be found by
// anyone searching for it.
//
// The wording is built from the piece names and range names already held in
// rangeData.js / sculptureData.js, so it stays true as the ranges change.
//
//   BANKSIA Oldmanis — laser cut metal wall art, Australian Natives range, by ROGETjames
//   PLUME DECO — laser cut metal wall art in powder-coated black, Plumes range, by ROGETjames
//   MARAKESH — laser cut metal garden sculpture, The Classics range, by ROGETjames

import { RANGE_DATA } from "../data/rangeData";
import { SCULPTURE_DATA } from "../data/sculptureData";

const WALL_ART = "laser cut metal wall art";
const SCULPTURE = "laser cut metal garden sculpture";

// Colour read from the file name. These are powder-coat colours, not metals —
// never write "in bronze" or "in copper", which would claim a material James
// does not make. Rust/Corten is deliberately absent: a rust-coloured file name
// could be Corten steel or a rust powder-coat, and guessing gets it wrong.
const FINISHES = [
  [/\bbronze\b/i, "powder-coated bronze"],
  [/\bcopper\b/i, "powder-coated copper"],
  [/\bblack\b/i, "powder-coated black"],
  [/\bwhite\b/i, "powder-coated white"],
  [/\bpink\b/i, "powder-coated pink"],
  [/\bgold\b/i, "powder-coated gold"],
];

function finishOf(src = "") {
  const file = String(src).split("/").pop() || "";
  for (const [re, word] of FINISHES) if (re.test(file)) return word;
  return "";
}

function tidyRange(label = "") {
  if (!/[a-z]/.test(label)) {
    return label
      .toLowerCase()
      .replace(/\b[a-z]/g, (c) => c.toUpperCase())
      .replace(/\bB Editions\b/, "B Editions");
  }
  return label;
}

/** The description for one piece. `kind` is "wall" (default) or "sculpture". */
export function altForPiece(name, rangeLabel, kind = "wall", src = "") {
  if (!name) return "ROGETjames";
  const what = kind === "sculpture" ? SCULPTURE : WALL_ART;
  const finish = finishOf(src);
  const range = tidyRange(rangeLabel || "");
  const parts = [`${name} — ${what}${finish ? ` in ${finish}` : ""}`];
  if (range) parts.push(`${range} range`);
  parts.push("by ROGETjames");
  return parts.join(", ");
}

// One lookup from image path to description, built once from both ranges.
function buildIndex() {
  const map = new Map();
  const add = (data, kind) => {
    if (!data?.imgs || !data?.ranges) return;
    data.ranges.forEach((r) => {
      (r.designs || []).forEach((d) => {
        (d.imgs || []).forEach((i) => {
          const src = data.imgs[i];
          if (src && !map.has(src)) map.set(src, altForPiece(d.n, r.label, kind, src));
        });
      });
    });
  };
  add(RANGE_DATA, "wall");
  add(SCULPTURE_DATA, "sculpture");
  return map;
}

let INDEX = null;

/**
 * The description for a photo, found by its path. Falls back to a plain
 * ROGETjames line rather than leaving a photo blank.
 */
export function altForSrc(src, fallback = `Original ${WALL_ART} by ROGETjames`) {
  if (!src) return fallback;
  if (!INDEX) INDEX = buildIndex();
  // Strip any Netlify image-resizing wrapper before looking the path up.
  let path = String(src);
  const m = path.match(/[?&]url=([^&]+)/);
  if (m) path = decodeURIComponent(m[1]);
  path = path.split("?")[0];
  return INDEX.get(path) || fallback;
}
