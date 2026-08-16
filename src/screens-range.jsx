// PREVIEW ONLY — Screens gallery rebuilt on the Wall Art "range" template.
// Not a build entry, not routed, not committed to main. Reachable in dev at
// /screens-range.html so James can see the horizontal-slide "The Range" layout
// applied to Screens before deciding to make it live.
import "./index.css";
import { mountRangeGallery } from "./rangeGalleryApp";
import { SCREEN_COVERS, SCREENS_CAT_PAGES } from "./components/BespokeCommissions";

// Turn the live Screens covers into the range-gallery data shape:
//   { imgs:[…all image urls…], ranges:[ { label, count, designs:[{n,imgs:[idx]}], flat:[[design,variant]] } ] }
// Each screen SECTION (The Icons, The Architectural, …) becomes a range; each
// design becomes a design; a BROAD selection of every photo a design has is
// pulled in (its slides, or its single cover), so the slideshow shows the full
// spread from each design — exactly like Wall Art.
function buildScreenRangeData(covers) {
  const imgs = [];
  const idxOf = (src) => {
    let i = imgs.indexOf(src);
    if (i < 0) { i = imgs.length; imgs.push(src); }
    return i;
  };
  const ranges = covers.map((sec) => {
    const designs = sec.pieces.map((p) => {
      const srcs = (p.slides && p.slides.length ? p.slides : [p.img]).filter(Boolean);
      return { n: p.name, imgs: srcs.map(idxOf) };
    }).filter((d) => d.imgs.length > 0);
    // Random group order — each design stays grouped (its own photos together),
    // but the groups are shuffled so the strip isn't sequential/alphabetical.
    for (let i = designs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [designs[i], designs[j]] = [designs[j], designs[i]];
    }
    // James's chosen opening display image per range — pinned to first position.
    const OPENERS = {
      "THE ICONS": "viasi/viasi-1",
      "THE ARCHITECTURAL": "ff393903",
      "THE ORGANICS": "f940abcb",
      "THE CLASSICS": "screens/orian-wall-decor",
    };
    const openerKey = OPENERS[sec.label.toUpperCase()];
    if (openerKey) {
      let di = -1, vi = -1;
      for (let k = 0; k < designs.length; k++) {
        const idx = designs[k].imgs.findIndex((gi) => (imgs[gi] || "").includes(openerKey));
        if (idx >= 0) { di = k; vi = idx; break; }
      }
      if (di >= 0) {
        const [d] = designs.splice(di, 1);
        if (vi > 0) { const [g] = d.imgs.splice(vi, 1); d.imgs.unshift(g); }
        designs.unshift(d);
      }
    }
    // flat = the slideshow order: every variant of every design, broad.
    const flat = [];
    designs.forEach((d, di) => d.imgs.forEach((_, vi) => flat.push([di, vi])));
    return { label: sec.label.toUpperCase(), count: designs.length, designs, flat };
  }).filter((r) => r.designs.length > 0);
  return { imgs, ranges };
}

mountRangeGallery({
  rootId: "screens-range-root",
  data: buildScreenRangeData(SCREEN_COVERS),
  label: "Screens",
  noun: "screen",
  section: "screens",
  rangeWord: "Range",
  pricing: false,
  designPills: true,
  viewLabel: "View design",
  // The isolated Screens catalogue — same pages as the live /screens gallery.
  catalogue: { label: "Screens Catalogue", pages: SCREENS_CAT_PAGES },
  // About spiel — James's approved copy.
  aboutHtml: `<p>Original curated, adaptive designs from a practice built over twenty years. Each pattern is diligently crafted for its category, spanning a broad range of styles and customised for purpose, be it Wall Decor &middot; Entrance Gates &middot; Security Gates Automated &middot; Fencing &middot; Infills &middot; Dividers &middot; Privacy Screens &middot; Awnings &middot; Light Features — to complement and enhance architectural, interior and landscape settings.</p>`,
  // Applications the designs are used for.
  applications: ["Decoration", "Gates", "Fencing", "Dividers", "Privacy", "Pergolas"],
  // "The Art of Shadows & Light" popup — same story + poster as the live /screens gallery.
  story: {
    label: "The Art of Shadows & Light",
    posterImg: "/images/screens/spiel-poster.jpg",
    lead: "For three thousand years, humanity has shaped shadows with form and light — honing the ancient craft of screens.",
    paras: [
      "From the woven reeds of ancient Egypt to the carved lattices of Mesopotamian palaces — screens were never merely functional. They were a language. One that spoke of shelter and mystery, of the threshold between public and private, of shadow and adornment made beautiful.",
      "The Islamic Golden Age gave that language its most eloquent voice — breathtaking geometric complexity that turned a wall into a meditation, a doorway into an experience. It rippled through Medieval Europe, through the courts of Asia, through the ornate ironwork of the Victorian colonial era.",
      "Then came the machine. Laser and CNC technology did not replace the craft — they set it free. Suddenly the organic, the intricate, the impossibly fine became possible in aluminium, steel, timber and stone.",
      "ROGETjames occupies this space today — drawing on the depth of that lineage, bringing new thinking and original design into one of the oldest crafts in the built world with contemporary precision.",
    ],
  },
  // Placeholder category spiels — shown under each range title. James to finalise wording.
  descriptions: {
    "THE ICONS": "Our signature collection — the original designs that established the studio's language and now anchor landmark settings.",
    "THE ARCHITECTURAL": "Crafted for the built form: each design developed to the architecture it joins, tuned to its proportion, geometry and material.",
    "THE ORGANICS": "Botanical designs that relieve hard structure — natural forms bringing movement and ease to a composition.",
    "THE CLASSICS": "A refined collection of enduring motifs, deliberately adaptable, composed to sit within classical and heritage settings.",
    "THE MIRRORS": "Decorative mirrors for interior and exterior settings, where the frame is considered as much artwork as function.",
  },
});
