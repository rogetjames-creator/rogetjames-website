// Shared config for the Screens "range" gallery — the single source of truth used
// by both the live /screens page (src/screens.jsx) and the /screens-range preview
// (src/screens-range.jsx). Call mountScreensRange(rootId) with the page's root id.
import { mountRangeGallery } from "./rangeGalleryApp";
import { SCREEN_COVERS, SCREENS_CAT_PAGES } from "./components/BespokeCommissions";

// Place each /media upload into EVERY category (destination) it was tagged with —
// e.g. an image tagged both "icons" and "light-features" appears in both ranges —
// plus its title's home range for the general "screens" destination. This honours
// multi-category uploads instead of only matching one spot by title.
function injectUploads(covers, uploads) {
  const rangeIds = new Set(covers.map((c) => c.id));
  const norm = (s) => (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const out = covers.map((c) => ({
    id: c.id, label: c.label, img: c.img,
    pieces: c.pieces.map((p) => ({ name: p.name, slides: (p.slides && p.slides.length) ? [...p.slides] : [p.img] })),
  }));
  const byId = {}; out.forEach((c) => { byId[c.id] = c; });
  const addTo = (range, name, src) => {
    if (!range || !src) return;
    if (range.pieces.some((p) => p.slides.includes(src))) return; // dedupe by src within a range
    const existing = range.pieces.find((p) => norm(p.name) === norm(name));
    if (existing) existing.slides.push(src);
    else range.pieces.push({ name, slides: [src] });
  };
  for (const u of uploads) {
    const name = u.name || "Screen";
    const cats = (u.dests || []).filter((d) => rangeIds.has(d));
    cats.forEach((cat) => addTo(byId[cat], name, u.src));
    // general "screens" destination (or no category chosen) → its title's home
    // range, or Icons if it's a brand-new design with no category.
    if ((u.dests || []).includes("screens") || cats.length === 0) {
      const home = out.find((c) => c.pieces.some((p) => norm(p.name) === norm(name)));
      if (home) addTo(home, name, u.src);
      else if (cats.length === 0) addTo(byId.icons, name, u.src);
    }
  }
  out.forEach((c) => { c.pieces.forEach((p) => { p.img = p.slides[0]; }); c.img = c.pieces.length ? c.pieces[0].img : c.img; });
  return out;
}

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
      "THE LIGHT FEATURES": "b03ec13b",
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

// Pull every "screens" /media upload (git-committed manifest + legacy/up-close
// blob stores), newest last, deduped by src — the same sources the old gallery used.
// Only the git-committed manifest (a fast static file) — this is where /media
// uploads are committed, so it's the source of truth. We deliberately skip the
// /api/media-list and /api/up-close-list functions here: they can cold-start slow
// and would hold up the first render.
async function fetchScreenUploads() {
  try {
    const manifest = await fetch(`/media-manifest.json?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : [])).catch(() => []);
    // Any screen-related tag counts: the generic "screens" OR a specific screen
    // category (icons / architectural / … / light-features / mirrors).
    const screenKeys = new Set([...SCREEN_COVERS.map((c) => c.id), "screens"]);
    // "classics" is ALSO a Sculpture category, so a bare "classics" tag is a
    // sculpture upload, not a screen one — only treat it as a screen when the
    // generic "screens" tag is present too. (Prevents sculpture photos leaking
    // into Screens · The Classics.)
    const SHARED_WITH_SCULPTURE = new Set(["classics"]);
    const isScreenUpload = (dests) => {
      const d = dests || [];
      if (d.includes("screens")) return true;
      return d.some((x) => screenKeys.has(x) && !SHARED_WITH_SCULPTURE.has(x));
    };
    const rows = (Array.isArray(manifest) ? manifest : [])
      .map((e) => ({ src: `/${e.path}`, name: e.name || "", dests: e.destinations || [], createdTime: e.createdTime || "" }))
      .filter((u) => isScreenUpload(u.dests));
    const seen = new Set();
    return rows
      .sort((a, b) => new Date(a.createdTime || 0) - new Date(b.createdTime || 0))
      .filter((u) => { if (seen.has(u.src)) return false; seen.add(u.src); return true; });
  } catch { return []; }
}

export function mountScreensRange(rootId) {
  let mounted = false;
  const mountWith = (c) => {
    if (mounted) return;
    mounted = true;
    _mount(rootId, buildScreenRangeData(c));
  };
  // Mount once — with /media uploads placed by their destinations if the fetch
  // returns quickly, otherwise fall back to the static covers so it never hangs.
  const fallback = setTimeout(() => mountWith(SCREEN_COVERS), 900);
  fetchScreenUploads().then((uploads) => {
    clearTimeout(fallback);
    mountWith(uploads.length ? injectUploads(SCREEN_COVERS, uploads) : SCREEN_COVERS);
  }).catch(() => { clearTimeout(fallback); mountWith(SCREEN_COVERS); });
}

function _mount(rootId, data) {
  mountRangeGallery({
    rootId,
    data,
    label: "Screens",
    noun: "screen",
    section: "screens",
    rangeWord: "Range",
    pricing: false,
    designPills: true,
    viewLabel: "View design",
    // The isolated Screens catalogue.
    catalogue: { label: "Screens Catalogue", pages: SCREENS_CAT_PAGES },
    // About spiel — James's approved copy.
    aboutHtml: `<p>Original curated, adaptive designs from a practice built over twenty years. Each pattern is diligently crafted for its category, spanning a broad range of styles and customised for purpose, be it Wall Decor &middot; Entrance Gates &middot; Security Gates Automated &middot; Fencing &middot; Infills &middot; Dividers &middot; Privacy Screens &middot; Awnings &middot; Light Features — to complement and enhance architectural, interior and landscape settings.</p>`,
    // Applications the designs are used for.
    applications: ["Decoration", "Gates", "Fencing", "Dividers", "Privacy", "Pergolas"],
    // "The Art of Shadows & Light" popup.
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
    // Category spiels — shown under each range title.
    descriptions: {
      "THE ICONS": "Our signature collection — the original designs that established the studio's language and now anchor landmark settings.",
      "THE ARCHITECTURAL": "Crafted for the built form: each design developed to the architecture it joins, tuned to its proportion, geometry and material.",
      "THE ORGANICS": "Botanical designs that relieve hard structure — natural forms bringing movement and ease to a composition.",
      "THE CLASSICS": "A refined collection of enduring motifs, deliberately adaptable, composed to sit within classical and heritage settings.",
      "THE INDIES": "An eclectic collection.",
      "THE MIRRORS": "Decorative mirrors for interior and exterior settings, where the frame is considered as much artwork as function.",
    },
  });
}
