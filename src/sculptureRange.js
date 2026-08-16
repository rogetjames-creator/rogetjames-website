// /sculpture mount — the range gallery plus live /media upload merging, so a photo
// uploaded to a sculpture category (Classics / Leaf Sculptures / Bon Bons) appears
// as a piece at the END of that category. Mirrors the Screens gallery's approach.
import { mountRangeGallery } from "./rangeGalleryApp";
import { SCULPTURE_DATA } from "./data/sculptureData";

// Media destination key → the range label it belongs in.
const DEST_TO_LABEL = {
  classics: "The Classics",
  leafs: "Leaf Sculptures",
  bonbons: "Bon Bons & Genie Bottles",
};

async function fetchSculptureUploads() {
  try {
    const manifest = await fetch(`/media-manifest.json?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : [])).catch(() => []);
    const keys = new Set(Object.keys(DEST_TO_LABEL));
    const rows = (Array.isArray(manifest) ? manifest : [])
      .map((e) => ({ src: `/${e.path}`, name: e.name || "", dests: e.destinations || [], createdTime: e.createdTime || "" }))
      .filter((u) => (u.dests || []).some((d) => keys.has(d)));
    const seen = new Set();
    return rows
      .sort((a, b) => new Date(a.createdTime || 0) - new Date(b.createdTime || 0))
      .filter((u) => { if (seen.has(u.src)) return false; seen.add(u.src); return true; });
  } catch { return []; }
}

function injectSculptureUploads(data, uploads) {
  const out = {
    imgs: [...data.imgs],
    ranges: data.ranges.map((r) => ({
      label: r.label, count: r.count,
      designs: r.designs.map((d) => ({ n: d.n, imgs: [...d.imgs] })),
      flat: r.flat.map((f) => [...f]),
    })),
  };
  const idxOf = (src) => { let i = out.imgs.indexOf(src); if (i < 0) { i = out.imgs.length; out.imgs.push(src); } return i; };
  for (const u of uploads) {
    const labels = (u.dests || []).map((d) => DEST_TO_LABEL[d]).filter(Boolean);
    labels.forEach((label) => {
      const range = out.ranges.find((r) => r.label === label);
      if (!range) return;
      const gi = idxOf(u.src);
      if (range.designs.some((d) => d.imgs.includes(gi))) return; // dedupe within the range
      const di = range.designs.length;
      const cleanName = (u.name || label).replace(/\.(jpe?g|png|webp|gif)$/i, "").trim();
      range.designs.push({ n: cleanName || label, imgs: [gi] });   // appended at the END
      range.flat.push([di, 0]);
      range.count = range.designs.length;
    });
  }
  return out;
}

function mount(data) {
  mountRangeGallery({ rootId: "sculpture-root", data, label: "Sculpture", noun: "sculpture", section: "sculpture" });
}

export function mountSculptureRange() {
  let mounted = false;
  const once = (d) => { if (mounted) return; mounted = true; mount(d); };
  const fallback = setTimeout(() => once(SCULPTURE_DATA), 900);
  fetchSculptureUploads().then((uploads) => {
    clearTimeout(fallback);
    once(uploads.length ? injectSculptureUploads(SCULPTURE_DATA, uploads) : SCULPTURE_DATA);
  }).catch(() => { clearTimeout(fallback); once(SCULPTURE_DATA); });
}
