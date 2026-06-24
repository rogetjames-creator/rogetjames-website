// Powers the /stats admin page — pulls recent records from the
// "Pricing Interest" Airtable table (written by track-event.js) and
// returns both the raw recent events and a few rollup counts.
const TABLE_NAME = process.env.AIRTABLE_ANALYTICS_TABLE || "Pricing Interest";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey    = process.env.AIRTABLE_API_KEY;
  const baseId    = process.env.AIRTABLE_BASE_ID;
  const adminPass = process.env.VAULT_ADMIN_SECRET;

  if (!apiKey || !baseId || !adminPass) {
    return json({ error: "Server configuration missing." }, 500);
  }

  let body;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid request." }, 400); }

  if (body.adminSecret !== adminPass) return json({ error: "Unauthorized." }, 401);

  const tableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}?pageSize=100`;

  let records = [];
  let offset;
  try {
    do {
      const url = offset ? `${tableUrl}&offset=${offset}` : tableUrl;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
      if (!res.ok) {
        if (res.status === 404) return json({ records: [], summary: emptySummary() }, 200);
        return json({ error: "Could not reach database." }, 502);
      }
      const data = await res.json();
      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset && records.length < 1000);
  } catch {
    return json({ error: "Could not reach database." }, 502);
  }

  records.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

  const summary = emptySummary();
  for (const r of records) {
    const f = r.fields;
    summary.total += 1;
    if (f.Type) summary.byType[f.Type] = (summary.byType[f.Type] || 0) + 1;
    if (f.Region) summary.byRegion[f.Region] = (summary.byRegion[f.Region] || 0) + 1;
    if (f.Item) summary.byItem[f.Item] = (summary.byItem[f.Item] || 0) + 1;
    if (f.Postcode) summary.byPostcode[f.Postcode] = (summary.byPostcode[f.Postcode] || 0) + 1;
  }

  const recent = records.slice(0, 200).map(r => ({
    id: r.id,
    createdTime: r.createdTime,
    ...r.fields,
  }));

  return json({ records: recent, summary }, 200);
}

function emptySummary() {
  return { total: 0, byType: {}, byRegion: {}, byItem: {}, byPostcode: {} };
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/stats-data" };
