// Admin-only image upload for the "Up Close" gallery. Stores images in Netlify
// Blobs so photos can be added from the phone/desktop app with no git, no
// redeploy. Gated by the same admin password as the stats page.
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const STORE = "up-close-images";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per image

export default async function handler(req, context) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const adminPass = process.env.VAULT_ADMIN_SECRET;
  if (!adminPass) return json({ error: "Server not configured" }, 500);

  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "";
  if (tooManyAttempts(ip)) return json({ error: "Too many attempts. Please try again later." }, 429);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  if (!safeEqual(body.adminSecret, adminPass)) {
    bumpAttempts(ip);
    return json({ error: "Unauthorized" }, 401);
  }

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

// Constant-time comparison via fixed-length SHA-256 digests — avoids leaking
// the admin secret's length or content through response timing.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Per-IP failed-attempt limiter (per warm instance). Only wrong-password tries
// are counted, so a correct-password admin is never locked out of uploading.
const ATTEMPTS = new Map();
const ATTEMPT_WINDOW_MS = 600_000; // 10 minutes
const MAX_ATTEMPTS = 8;
function tooManyAttempts(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (ATTEMPTS.get(ip) || []).filter((t) => now - t < ATTEMPT_WINDOW_MS);
  ATTEMPTS.set(ip, recent);
  return recent.length >= MAX_ATTEMPTS;
}
function bumpAttempts(ip) {
  if (!ip) return;
  const now = Date.now();
  const recent = (ATTEMPTS.get(ip) || []).filter((t) => now - t < ATTEMPT_WINDOW_MS);
  recent.push(now);
  ATTEMPTS.set(ip, recent);
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/up-close-upload" };
