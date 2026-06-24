// Logs pricing & postcode interest to Airtable for the weekly stats digest.
// Table auto-creates on first use if it doesn't exist yet (requires the
// Airtable token to have schema write access — same token used for the vault).
const TABLE_NAME = process.env.AIRTABLE_ANALYTICS_TABLE || "Pricing Interest";

const FIELDS = [
  { name: "Type", type: "singleSelect", options: { choices: [
    { name: "Postcode Entered" }, { name: "Viewed Pricing" }, { name: "Added to Quote" },
  ] } },
  { name: "Item", type: "singleLineText" },
  { name: "Series", type: "singleLineText" },
  { name: "Postcode", type: "singleLineText" },
  { name: "State", type: "singleLineText" },
  { name: "Region", type: "singleLineText" },
  { name: "Material", type: "singleLineText" },
  { name: "Size", type: "singleLineText" },
  { name: "Price", type: "number", options: { precision: 0 } },
];

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) return json({ ok: false }, 200); // fail silently — never block the visitor

  let body;
  try { body = await req.json(); } catch { return json({ ok: false }, 200); }

  const { type, item, series, postcode, state, isWA, material, size, price } = body;
  if (!type) return json({ ok: false }, 200);

  const fields = {
    Type: type === "postcode" ? "Postcode Entered" : type === "add_to_quote" ? "Added to Quote" : "Viewed Pricing",
    ...(item && { Item: item }),
    ...(series && { Series: series }),
    ...(postcode && { Postcode: postcode }),
    ...(state && { State: state }),
    ...(typeof isWA === "boolean" && { Region: isWA ? "WA" : "Interstate" }),
    ...(material && { Material: material }),
    ...(size && { Size: size }),
    ...(typeof price === "number" && { Price: price }),
  };

  const tableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}`;
  let res = await createRecord(tableUrl, apiKey, fields);

  if (res.status === 404 || res.status === 422) {
    const created = await createTable(baseId, apiKey).catch(() => false);
    if (created) res = await createRecord(tableUrl, apiKey, fields);
  }

  return json({ ok: res.ok }, 200);
}

async function createRecord(tableUrl, apiKey, fields) {
  return fetch(tableUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ records: [{ fields }] }),
  });
}

async function createTable(baseId, apiKey) {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: TABLE_NAME, fields: FIELDS }),
  });
  return res.ok;
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/track-event" };
