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

export default async function handler(req, context) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Only accept events from our own site; never block the visitor on failure.
  if (!originAllowed(req.headers.get("origin"))) return json({ ok: true }, 200);

  let body;
  try { body = await req.json(); } catch { return json({ ok: true }, 200); }

  const { type, item, series, postcode, state, isWA, material, size, price } = body;
  if (!type) return json({ ok: true }, 200);

  // Email James the moment a visitor enters a postcode to price a design — the
  // high-intent signal. Resend only (no Airtable needed). Throttled per IP so
  // it can't be used to flood the inbox; never blocks the visitor.
  if (type === "postcode" && process.env.RESEND_API_KEY) {
    const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "";
    if (!emailThrottled(ip)) {
      await emailPostcodeAlert({ postcode, state, isWA, item, series }).catch(() => {});
    }
  }

  // Log every event to Airtable for the weekly digest / stats page, if set up.
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) return json({ ok: true }, 200); // analytics store not configured — fine

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

function originAllowed(origin) {
  if (!origin) return true;
  try {
    const h = new URL(origin).hostname;
    return h === "rogetjames.com" || h === "www.rogetjames.com" || h.endsWith(".netlify.app");
  } catch { return false; }
}

// At most 3 postcode emails per IP per 10 minutes (per warm instance).
const EMAILS = new Map();
function emailThrottled(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (EMAILS.get(ip) || []).filter((t) => now - t < 600000);
  recent.push(now);
  EMAILS.set(ip, recent);
  return recent.length > 3;
}

async function emailPostcodeAlert({ postcode, state, isWA, item, series }) {
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>";
  const toEmail   = process.env.NOTIFY_EMAIL || "james@rogetjames.com";
  const region = isWA ? "WA" : "Interstate";
  const when = new Date().toLocaleString("en-AU", { timeZone: "Australia/Perth", dateStyle: "medium", timeStyle: "short" });
  const lines = [
    `Postcode: ${postcode || "—"}`,
    `State: ${state || "—"} (${region})`,
    `Design viewed: ${item || "—"}${series ? ` — ${series}` : ""}`,
    `Time: ${when} (Perth)`,
  ].join("\n");
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `Pricing interest — ${postcode || "?"} (${region})${item ? ` · ${item}` : ""}`,
      text: `Someone is checking delivery pricing on rogetjames.com.\n\n${lines}`,
    }),
  });
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/track-event" };
