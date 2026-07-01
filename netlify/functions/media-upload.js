// Admin-only general media upload. Stores images in Netlify Blobs, tagged with
// exact destination keys (not free text) so placement on the site is
// deterministic. Gated by the stats/vault admin password.
import { getStore } from "@netlify/blobs";

const STORE = "media-library";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per image

// Must match MediaPage.jsx's DESTINATIONS keys and Gallery.jsx's mediaKeys.
const VALID_DESTINATIONS = ["up-close", "branches-gren", "creeping-fig-autumn", "plumes-deco"];

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const adminPass = process.env.VAULT_ADMIN_SECRET;
  if (!adminPass) return json({ error: "Server not configured" }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  if (!safeEqual(body.adminSecret, adminPass)) return json({ error: "Unauthorized" }, 401);

  const store = getStore({ name: STORE, consistency: "strong" });

  // List (admin) — returns all images with their destinations.
  if (body.action === "list") {
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map(async (b) => {
        const meta = await store.getMetadata(b.key).catch(() => null);
        let destinations = [];
        try { destinations = JSON.parse(meta?.metadata?.destinations || "[]"); } catch { /* ignore */ }
        return {
          id: b.key,
          name: meta?.metadata?.name || "",
          destinations,
          createdTime: meta?.metadata?.createdTime || "",
          src: `/api/media-img?id=${encodeURIComponent(b.key)}`,
        };
      })
    );
    items.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
    return json({ images: items });
  }

  // Delete one.
  if (body.action === "delete" && body.id) {
    await store.delete(body.id).catch(() => {});
    return json({ ok: true });
  }

  // Upload one or more (data URLs), tagged with one or more destination keys.
  const images = Array.isArray(body.images) ? body.images : [];
  if (!images.length) return json({ error: "No images provided" }, 400);
  const destinations = (Array.isArray(body.destinations) ? body.destinations : [])
    .filter((d) => VALID_DESTINATIONS.includes(d));
  if (!destinations.length) return json({ error: "No valid destination selected" }, 400);

  let saved = 0;
  for (const img of images) {
    const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(img?.dataUrl || "");
    if (!m) continue;
    const contentType = m[1];
    const buf = Buffer.from(m[2], "base64");
    if (buf.length > MAX_BYTES) continue;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await store.set(id, buf, {
      metadata: {
        name: img.name || "",
        destinations: JSON.stringify(destinations),
        contentType,
        createdTime: new Date().toISOString(),
      },
    });
    saved += 1;
  }

  return json({ ok: true, saved });
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/media-upload" };
