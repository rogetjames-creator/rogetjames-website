// Powers the /stats admin page — reads recent pricing-interest events from
// Netlify Blobs (written by track-event.js) and returns the raw recent events
// plus rollup counts. Gated by the VAULT_ADMIN_SECRET admin password.
import { getStore } from "@netlify/blobs";

const STORE_NAME = "pricing-interest";

export default async function handler(req, context) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const adminPass = process.env.VAULT_ADMIN_SECRET;
  if (!adminPass) return json({ error: "Server configuration missing." }, 500);

  // Throttle login attempts per IP so the admin password can't be brute-forced.
  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "";
  if (await tooManyAttempts(ip)) {
    return json({ error: "Too many attempts. Please try again later." }, 429);
  }

  let body;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid request." }, 400); }

  if (!safeEqual(body.adminSecret, adminPass)) return json({ error: "Unauthorized." }, 401);

  let records = [];
  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const { blobs } = await store.list();
    const entries = await Promise.all(
      blobs.map(async (b) => {
        const v = await store.get(b.key, { type: "json" }).catch(() => null);
        return v ? { id: b.key, ...v } : null;
      })
    );
    records = entries.filter(Boolean);
  } catch {
    return json({ records: [], summary: emptySummary() }, 200);
  }

  records.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

  const summary = emptySummary();
  for (const f of records) {
    summary.total += 1;
    if (f.Type) summary.byType[f.Type] = (summary.byType[f.Type] || 0) + 1;
    if (f.Region) summary.byRegion[f.Region] = (summary.byRegion[f.Region] || 0) + 1;
    if (f.Item) summary.byItem[f.Item] = (summary.byItem[f.Item] || 0) + 1;
    if (f.Postcode) summary.byPostcode[f.Postcode] = (summary.byPostcode[f.Postcode] || 0) + 1;
  }

  // Q & Ai conversations, stored by chat-transcript.js.
  let chats = [];
  try {
    const chatStore = getStore({ name: "chat-transcripts", consistency: "strong" });
    const { blobs } = await chatStore.list();
    const entries = await Promise.all(
      blobs.map(async (b) => {
        const v = await chatStore.get(b.key, { type: "json" }).catch(() => null);
        return v ? { id: b.key, ...v } : null;
      })
    );
    chats = entries.filter(Boolean).sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime)).slice(0, 100);
  } catch { /* chat store optional */ }

  return json({ records: records.slice(0, 200), summary, chats }, 200);
}

function emptySummary() {
  return { total: 0, byType: {}, byRegion: {}, byItem: {}, byPostcode: {} };
}

// At most 10 login attempts per IP per 10-minute window, counted in Blobs so
// the limit holds across function instances. Bounds password brute-forcing.
async function tooManyAttempts(ip) {
  if (!ip) return false;
  try {
    const store = getStore({ name: "stats-login", consistency: "strong" });
    const key = `${ip}_${Math.floor(Date.now() / 600000)}`;
    const count = (await store.get(key, { type: "json" })) || 0;
    if (count >= 10) return true;
    await store.setJSON(key, count + 1);
    return false;
  } catch {
    return false; // a storage hiccup must not lock out the legitimate admin
  }
}

// Constant-time string comparison — avoids leaking the admin secret via response timing.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/stats-data" };
