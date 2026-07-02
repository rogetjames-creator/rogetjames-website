// Public list of uploaded media-library images (id, destinations, src). The
// gallery reads this and places each image by its exact destination key —
// no text-guessing.
import { getStore } from "@netlify/blobs";

const STORE = "media-library";

// Backward compatible: new uploads carry an exact "destinations" array; older
// uploads only have a free-text "label". Derive destinations from the label so
// nothing uploaded before the picker rebuild is orphaned.
// Old picker keys → real catalogue category ids (what the gallery matches on).
const KEY_MAP = {
  "banksia": "australian-natives",
  "plumes-deco": "plume",
  "branches-gren": "branches",
  "creeping-fig-autumn": "creeping-fig",
};
export function destinationsFor(meta) {
  let dests = [];
  try { dests = JSON.parse(meta?.metadata?.destinations || "[]"); } catch { dests = []; }
  if (Array.isArray(dests) && dests.length) {
    return [...new Set(dests.map(d => KEY_MAP[d] || d))];
  }
  const l = (meta?.metadata?.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!l) return [];
  const out = [];
  if (l.includes("upclose")) out.push("up-close");
  if (l.includes("banksia") || l.includes("wandoo") || l.includes("wattle")) out.push("australian-natives");
  if (l.includes("gren") || l.includes("branches")) out.push("branches");
  if (l.includes("autumn") || l.includes("creepingfig")) out.push("creeping-fig");
  if (l.includes("plume") || l.includes("feather") || l.includes("flock")) out.push("plume");
  return [...new Set(out)];
}

export default async function handler() {
  try {
    const store = getStore({ name: STORE, consistency: "strong" });
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map(async (b) => {
        const meta = await store.getMetadata(b.key).catch(() => null);
        return {
          id: b.key,
          destinations: destinationsFor(meta),
          createdTime: meta?.metadata?.createdTime || "",
          src: `/api/media-img?id=${encodeURIComponent(b.key)}`,
        };
      })
    );
    items.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
    return json({ images: items });
  } catch {
    return json({ images: [] });
  }
}

function json(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
  });
}

export const config = { path: "/api/media-list" };
