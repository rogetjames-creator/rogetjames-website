// Shared config for the Screens "range" gallery — the single source of truth used
// by both the live /screens page (src/screens.jsx) and the /screens-range preview
// (src/screens-range.jsx). Call mountScreensRange(rootId) with the page's root id.
import { mountRangeGallery } from "./rangeGalleryApp";
import { SCREEN_COVERS, SCREENS_CAT_PAGES } from "./components/BespokeCommissions";
import { SCREEN_APPLICATIONS, applicationKey } from "./mediaDestinations";
import { SCREEN_DESIGNS } from "./data/screenDesigns";

// Place each /media upload into EVERY place it belongs — one photograph can be
// cross-referenced many times over: every category (destination) it was tagged
// with, AND the range where its design already lives (so a photo named AUDA
// joins the AUDA design in THE INDIES), AND its application range/page. A photo
// tagged only for an application whose title matches no design stays with that
// application alone — it never invents a design.
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
  const appKeys = new Set(SCREEN_APPLICATIONS.map((a) => applicationKey(a.id)));
  for (const u of uploads) {
    const name = u.name || "Screen";
    const dests = u.dests || [];
    const cats = dests.filter((d) => rangeIds.has(d));
    cats.forEach((cat) => addTo(byId[cat], name, u.src));
    // Always join the design of the same name wherever it already lives — that
    // is the cross-reference: the photo shows under its design's pill as well
    // as under every category and application it was tagged for.
    const home = out.find((c) => c.pieces.some((p) => norm(p.name) === norm(name)));
    if (home) addTo(home, name, u.src);
    else if (cats.length === 0 && !dests.some((d) => appKeys.has(d))) addTo(byId.icons, name, u.src);
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
    // DISPLAYS keeps its owner-pinned order (see DISPLAYS_ORDER) — never shuffled.
    if (sec.id !== "displays") {
      for (let i = designs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [designs[i], designs[j]] = [designs[j], designs[i]];
      }
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
    return { label: sec.label.toUpperCase(), count: designs.length, designs, flat, _app: !!sec.app };
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
    const manifest = await fetch("/media-manifest.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : [])).catch(() => []);
    // Any screen-related tag counts: the generic "screens" OR a specific screen
    // category (icons / architectural / … / light-features / mirrors).
    const screenKeys = new Set([
      ...SCREEN_COVERS.map((c) => c.id), "screens", "displays",
      ...SCREEN_APPLICATIONS.map((a) => applicationKey(a.id)),
    ]);
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

// The shared "Displays" set → its own range at the end of the Screens gallery.
// The same photos also appear under DISPLAYS in the Sculpture and Projects
// galleries (one /media upload, three homes).
// Owner-pinned opening order for the Screens · DISPLAYS tiles. Anything listed
// here comes first, in this order; the rest follow by upload time.
const DISPLAYS_ORDER = [
  "/images/uploads/1787118567607_tc0re5.jpg",
  "/images/uploads/1787118567609_mynq6x.jpg",
];
function buildDisplaysCover(uploads) {
  // Displays carry NO title — one photo per tile, no name shown.
  const seen = new Set();
  const pieces = [];
  for (const u of uploads) {
    if (!u.src || seen.has(u.src)) continue;
    seen.add(u.src);
    pieces.push({ name: "", img: u.src, slides: [u.src] });
  }
  const rank = (src) => { const i = DISPLAYS_ORDER.indexOf(src); return i < 0 ? Infinity : i; };
  pieces.sort((a, b) => rank(a.img) - rank(b.img)); // stable: unpinned keep upload order
  return { id: "displays", label: "Displays", img: pieces.length ? pieces[0].img : "", pieces };
}

// An application James has put photos against → its own range at the end of the
// gallery, named exactly as its pill so the pill can find it. An application
// with no photos yet makes no range, and its pill simply does nothing.
function buildApplicationCovers(uploads) {
  const normTag = (t) => String(t || "").toLowerCase().trim();
  return SCREEN_APPLICATIONS.map((a) => {
    const key = applicationKey(a.id);
    const want = new Set(a.tags.map(normTag));
    const seen = new Set();
    const pieces = [];
    const add = (name, src) => {
      if (!src || seen.has(src)) return;
      seen.add(src);
      const existing = pieces.find((p) => p.name && name && p.name.toUpperCase() === name.toUpperCase());
      if (existing) { existing.slides.push(src); return; }
      pieces.push({ name: name || "", img: src, slides: [src] });
    };
    // Every photograph already tagged for this use in the design list — the
    // same rule the /screens/<application> pages follow: the photograph itself
    // must carry the tag, never the design as a whole.
    for (const d of SCREEN_DESIGNS) {
      for (const it of d.items || []) {
        if (!(it.tags || []).map(normTag).some((t) => want.has(t))) continue;
        for (const src of (it.slides && it.slides.length ? it.slides : [it.img])) add(d.name, src);
      }
    }
    // …plus anything uploaded straight to this application through /media.
    for (const u of uploads) {
      if (!(u.dests || []).includes(key)) continue;
      add(u.name || "", u.src);
    }
    return { id: key, label: a.label, img: pieces.length ? pieces[0].img : "", pieces, app: true };
  }).filter((c) => c.pieces.length);
}

// Which applications a design is used for — read from the tags already written
// against each photograph, plus anything uploaded straight to an application.
// This is what the "Used for" pills in a design's detail sheet show: click one
// and you see every design used that way.
function buildDesignApplications(uploads) {
  const normTag = (t) => String(t || "").toLowerCase().trim();
  const normName = (s) => (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const map = new Map();
  const add = (name, app) => {
    const k = normName(name);
    if (!k) return;
    if (!map.has(k)) map.set(k, new Set());
    map.get(k).add(app.id);
  };
  for (const a of SCREEN_APPLICATIONS) {
    const want = new Set(a.tags.map(normTag));
    for (const d of SCREEN_DESIGNS) {
      for (const it of d.items || []) {
        if ((it.tags || []).map(normTag).some((t) => want.has(t))) add(d.name, a);
      }
    }
    const key = applicationKey(a.id);
    for (const u of uploads) if ((u.dests || []).includes(key)) add(u.name, a);
  }
  return (name) => {
    const ids = map.get(normName(name));
    if (!ids) return [];
    return SCREEN_APPLICATIONS.filter((a) => ids.has(a.id))
      .map((a) => ({ label: a.label, href: `/screens/${a.id}` }));
  };
}

export function mountScreensRange(rootId) {
  let mounted = false;
  const mountWith = (c, uploads) => {
    if (mounted) return;
    mounted = true;
    _mount(rootId, buildScreenRangeData(c), buildDesignApplications(uploads || []));
  };
  // Mount once — with /media uploads placed by their destinations if the fetch
  // returns quickly, otherwise fall back to the static covers so it never hangs.
  // Never make the page wait: if the photo list is slow, the gallery opens
  // without it. The list itself is preloaded in the page head, so in practice
  // it is already here. (An application with no section then opens its page.)
  const fallback = setTimeout(() => mountWith(SCREEN_COVERS, []), 700);
  fetchScreenUploads().then((uploads) => {
    clearTimeout(fallback);
    const displays = uploads.filter((u) => (u.dests || []).includes("displays"));
    // An application photo is NOT taken out of the ranges — it belongs in both:
    // under its design's pill and on its application page.
    const rest = uploads.filter((u) => !(u.dests || []).includes("displays"));
    let covers = rest.length ? injectUploads(SCREEN_COVERS, rest) : SCREEN_COVERS;
    if (displays.length) covers = [...covers, buildDisplaysCover(displays)];
    covers = [...covers, ...buildApplicationCovers(uploads)];
    mountWith(covers, uploads);
  }).catch(() => { clearTimeout(fallback); mountWith(SCREEN_COVERS, []); });
}

function _mount(rootId, data, designApplications) {
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
    // Each application also has a page of its own (/screens/gates, …) — the pill
    // is a real link to it, so the pages are reachable and crawlable.
    applications: SCREEN_APPLICATIONS.map((a) => ({ label: a.label, href: `/screens/${a.id}` })),
    // The ways THIS design is used, shown as pills inside its detail sheet.
    designApplications,
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
