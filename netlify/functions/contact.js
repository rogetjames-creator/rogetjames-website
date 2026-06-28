// Block only when an Origin/Referer is present and clearly not ours, so a real
// customer's browser (which sends the correct Origin) always gets through.
function originAllowed(origin) {
  if (!origin) return true;
  try {
    const h = new URL(origin).hostname;
    return h === "rogetjames.com" || h === "www.rogetjames.com" || h.endsWith(".netlify.app");
  } catch { return false; }
}

// Best-effort per-IP burst limit (per warm instance). Generous, since a real
// person submits an enquiry rarely — this only stops scripted flooding.
const HITS = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const headers = event.headers || {};
  if (!originAllowed(headers.origin || headers.referer)) {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden" }) };
  }
  const ip = headers["x-nf-client-connection-ip"] || headers["x-forwarded-for"] || "";
  if (rateLimited(ip)) {
    return { statusCode: 429, body: JSON.stringify({ error: "Too many enquiries in a short time. Please wait a moment or email james@rogetjames.com." }) };
  }
  // Reject oversized payloads (compressed attachments should be a few MB at most).
  if (typeof event.body === "string" && event.body.length > 15_000_000) {
    return { statusCode: 413, body: JSON.stringify({ error: "Attachments too large. Please send fewer or smaller images." }) };
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Email service not configured" }) };
  }

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }

  // Honeypot — a real person never fills the hidden "company" field. If it's
  // set, it's a bot: pretend success so it moves on, but send nothing.
  if (body.company) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const { name, email, phone, postcode, message, selections, attachments } = body;

  const lines = [
    `Name: ${name || "—"}`,
    `Email: ${email || "—"}`,
    `Phone: ${phone || "—"}`,
    postcode ? `Postcode: ${postcode}` : null,
    selections ? `Selections: ${selections}` : null,
    ``,
    `Message:`,
    message || "—",
  ].filter(l => l !== null).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>",
      to: "rogetjames@gmail.com",
      reply_to: email || undefined,
      subject: `New enquiry from ${name || "website visitor"}`,
      text: `New enquiry from rogetjames.com\n\n${lines}`,
      attachments: Array.isArray(attachments) && attachments.length
        ? attachments.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 500, body: JSON.stringify({ error: err }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
