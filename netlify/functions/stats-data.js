// Powers the /stats admin page — reads recent pricing-interest events from
// Netlify Blobs (written by track-event.js) and returns the raw recent events
// plus rollup counts. Gated by the VAULT_ADMIN_SECRET admin password.
import { getStore } from "@netlify/blobs";

const STORE_NAME = "pricing-interest";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const adminPass = process.env.VAULT_ADMIN_SECRET;
  if (!adminPass) return json({ error: "Server configuration missing." }, 500);

  let body;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid request." }, 400); }

  if (body.adminSecret !== adminPass) return json({ error: "Unauthorized." }, 401);

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

  return json({ records: records.slice(0, 200), summary }, 200);
}

function emptySummary() {
  return { total: 0, byType: {}, byRegion: {}, byItem: {}, byPostcode: {} };
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/stats-data" };
