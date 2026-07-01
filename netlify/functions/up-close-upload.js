// Admin-only image upload for the "Up Close" gallery. Stores images in Netlify
// Blobs so photos can be added from the phone/desktop app with no git, no
// redeploy. Gated by the same admin password as the stats page.
import { getStore } from "@netlify/blobs";

const STORE = "up-close-images";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per image

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const adminPass = process.env.VAULT_ADMIN_SECRET;
  if (!adminPass) return json({ error: "Server not configured" }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  if (!safeEqual(body.adminSecret, adminPass)) return json({ error: "Unauthorized" }, 401);

  const store = getStore({ name: STORE, consistency: "strong" });

  if (body.action === "delete" && body.id) {
    await store.delete(body.id).catch(() => {});
    return json({ ok: true });
  }

  const images = Array.isArray(body.images) ? body.images : [];
  if (!images.length) return json({ error: "No images provided" }, 400);

  let saved = 0;
  for (const img of images) {
    const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(img?.dataUrl || "");
    if (!m) continue;
    const contentType = m[1];
    const buf = Buffer.from(m[2], "base64");
    if (buf.length > MAX_BYTES) continue;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await store.set(id, buf, {
      metadata: { name: img.name || "", contentType, createdTime: new Date().toISOString() },
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

export const config = { path: "/api/up-close-upload" };
