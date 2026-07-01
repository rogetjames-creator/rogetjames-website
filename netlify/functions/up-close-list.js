// Public list of uploaded "Up Close" images. Read by the gallery to show the
// detail shots James adds via the stats admin page.
import { getStore } from "@netlify/blobs";

const STORE = "up-close-images";

export default async function handler() {
  try {
    const store = getStore({ name: STORE, consistency: "strong" });
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map(async (b) => {
        const meta = await store.getMetadata(b.key).catch(() => null);
        return {
          id: b.key,
          name: meta?.metadata?.name || "",
          createdTime: meta?.metadata?.createdTime || "",
          src: `/api/up-close-img?id=${encodeURIComponent(b.key)}`,
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

export const config = { path: "/api/up-close-list" };
