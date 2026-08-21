// ─────────────────────────────────────────────────────────────────────────
// One place that reads James's /media uploads.
//
// Every gallery used to repeat this fetch inline, which is how a destination
// could quietly end up read by nobody. Now a gallery just names the keys it
// cares about and gets the photos back grouped by key.
//
// Two sources are merged, exactly as the Wall Art page reads them:
//   • /media-manifest.json — photos committed into the repo (the durable list)
//   • /api/media-list      — the live blob list (covers very recent uploads)
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";

// Uploads that must never appear as their own tile (duplicates of a photo that
// is already placed by hand). Keyed by the upload id inside the filename.
export const MEDIA_SUPPRESS = [
  "1784883338512_ggq8l0", // HUE — duplicate of "Hue 2"
  "1785745326687_0pxdcn", // UNITY — byte-identical twin of the tie649 upload
];

// Strip the file extension and James's "1200px" style reference tail so a tile
// shows the name he gave the piece, never the raw filename.
export function tidyUploadName(name, fallback = "") {
  return (name || "")
    .replace(/\.(jpe?g|png|webp|heic|heif)$/i, "")
    .replace(/\s*\d+\s*px\b/i, "")
    .trim() || fallback;
}

// One shared request per page load. Several galleries ask for this list on the
// same page; without this each one hit /api/media-list separately, which is a
// billed function call every time. They now share a single in-flight promise.
let _inflight = null;
export function fetchMediaUploads() {
  if (!_inflight) {
    _inflight = _fetchMediaUploads().catch((e) => { _inflight = null; throw e; });
  }
  return _inflight;
}

// Fetch both sources and return one merged, de-duplicated list.
// Never throws — a failed fetch just contributes nothing, so a gallery's
// hand-placed images always still render.
async function _fetchMediaUploads() {
  const [manifest, legacy] = await Promise.all([
    fetch(`/media-manifest.json?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : [])).catch(() => []),
    fetch("/api/media-list").then((r) => r.json()).catch(() => ({ images: [] })),
  ]);

  const fromManifest = Array.isArray(manifest)
    ? manifest.map((e) => ({
        name: e.name,
        destinations: e.destinations || [],
        src: `/${e.path}`,
        createdTime: e.createdTime || null,
      }))
    : [];
  const fromLegacy = Array.isArray(legacy?.images)
    ? legacy.images.map((i) => ({
        name: i.name,
        destinations: i.destinations || [],
        src: i.src,
        createdTime: i.createdTime || null,
      }))
    : [];

  const seen = new Set();
  return [...fromManifest, ...fromLegacy]
    .filter((m) => Array.isArray(m.destinations) && m.destinations.length)
    .filter((m) => !MEDIA_SUPPRESS.some((id) => (m.src || "").includes(id)))
    .filter((m) => { if (seen.has(m.src)) return false; seen.add(m.src); return true; });
}

// Hook: give it the destination keys a gallery reads, get back
// { [key]: [{ name, img }] } — oldest upload first, so new photos land LAST.
// `keys` is re-read whenever its joined value changes, so callers can pass a
// freshly-built array without causing a refetch loop.
export function useUploadsByKey(keys, fallbackName = "") {
  // Fetch once and keep the raw list; the per-key grouping below is derived,
  // so changing the key list never costs another round trip.
  const [all, setAll] = useState(null);
  const keySig = (keys || []).join("|");

  useEffect(() => {
    let alive = true;
    fetchMediaUploads().then((rows) => { if (alive) setAll(rows); });
    return () => { alive = false; };
  }, []);

  return useMemo(() => {
    const wanted = keySig ? keySig.split("|") : [];
    if (!all || !wanted.length) return {};
    const sorted = [...all].sort(
      (a, b) => new Date(a.createdTime || 0) - new Date(b.createdTime || 0)
    );
    const out = {};
    for (const key of wanted) {
      const hits = sorted
        .filter((m) => m.destinations.includes(key))
        .map((m) => ({ name: tidyUploadName(m.name, fallbackName), img: m.src }));
      if (hits.length) out[key] = hits;
    }
    return out;
  }, [all, keySig, fallbackName]);
}
