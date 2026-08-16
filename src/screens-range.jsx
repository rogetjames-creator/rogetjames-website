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
    // James's call: ELLE must not be the opening design of its range — push it to the end.
    const ei = designs.findIndex((d) => (d.n || "").toUpperCase() === "ELLE");
    if (ei >= 0) designs.push(designs.splice(ei, 1)[0]);
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
  // Placeholder "About" spiel — James to rewrite in his own voice later.
  aboutHtml: `<p>Curated, adaptive designs from a practice built over twenty years. Each pattern is deliberated and crafted for its category, taking form as decoration, gates, fencing, dividers, privacy screens, pergolas and light features — adapting to complement and enhance its setting across architecture, interiors and landscape, and often becoming a signature motif for the space it enters.</p><p style="margin-top:10px;opacity:.55;font-size:11px">Placeholder text — to be refined.</p>`,
  // Applications the designs are used for.
  applications: ["Decoration", "Gates", "Fencing", "Dividers", "Privacy", "Pergolas", "Light Features"],
});
