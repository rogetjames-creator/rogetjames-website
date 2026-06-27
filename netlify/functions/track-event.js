// Logs pricing & postcode interest to Netlify Blobs — storage built into the
// Netlify platform, so it needs no external account or API keys. The /stats
// dashboard and the weekly digest both read from this same store. We also
// email James directly the moment someone enters a postcode to price a design.
import { getStore } from "@netlify/blobs";

const STORE_NAME = "pricing-interest";

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
  // high-intent signal. Throttled per IP so it can't be used to flood the inbox.
  if (type === "postcode" && process.env.RESEND_API_KEY) {
    const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "";
    if (!emailThrottled(ip)) {
      await emailPostcodeAlert({ postcode, state, isWA, item, series }).catch(() => {});
    }
  }

  // Persist the event to Netlify Blobs for the dashboard + weekly digest.
  // Field names are capitalised to match what stats-data / weekly-stats read.
  try {
    const record = {
      createdTime: new Date().toISOString(),
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
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const key = `${record.createdTime}_${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, record);
  } catch { /* analytics must never block the visitor */ }

  return json({ ok: true }, 200);
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
