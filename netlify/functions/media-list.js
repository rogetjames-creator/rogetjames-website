// Public list of uploaded media-library images (id, label, src). The gallery
// reads this and routes each image into place by its label. Image bytes are
// served by media-img; only labels + ids are exposed here.
import { getStore } from "@netlify/blobs";

const STORE = "media-library";

export default async function handler() {
  try {
    const store = getStore({ name: STORE, consistency: "strong" });
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map(async (b) => {
        const meta = await store.getMetadata(b.key).catch(() => null);
        return {
          id: b.key,
          label: meta?.metadata?.label || "",
          name: meta?.metadata?.name || "",
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
