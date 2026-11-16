// Public, but harmless: emails James a one-tap admin login link so he never has
// to type the admin password. The link only ever goes to James's own inboxes
// (hard-coded below) — whoever presses the button gets nothing back. Throttled
// so the button can't be used to flood his inbox.
import { getStore } from "@netlify/blobs";

const TO = ["james@rogetjames.com", "rogetjames@gmail.com"];
const MIN_GAP_MS = 60 * 1000;
const PAGES = { media: "/media", stats: "/stats", admin: "/admin" };

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secret = process.env.VAULT_ADMIN_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  if (!secret || !resendKey) return json({ error: "Email not configured." }, 500);

  let body = {};
  try { body = await req.json(); } catch { /* default page */ }
  const path = PAGES[body.page] || "/media";

  try {
    const store = getStore({ name: "admin-link", consistency: "strong" });
    const last = await store.get("last", { type: "json" }).catch(() => null);
    if (last?.t && Date.now() - last.t < MIN_GAP_MS) {
      return json({ ok: true, note: "A link was just sent — check your email." }, 200);
    }
    await store.setJSON("last", { t: Date.now() });
  } catch { /* throttle unavailable — still send */ }

  const link = `https://rogetjames.com${path}?key=${encodeURIComponent(secret)}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || process.env.VAULT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>",
      to: TO,
      subject: "ROGETjames admin login",
      text: `Tap to log in on this device:\n\n${link}\n\nThe device stays logged in after that. Don't forward this email.`,
      html: `<p>Tap to log in on this device:</p><p><a href="${link}" style="display:inline-block;padding:12px 22px;background:#9E7134;color:#fff;border-radius:999px;text-decoration:none;font-family:sans-serif">Log in to ROGETjames admin</a></p><p style="color:#888;font-size:12px">The device stays logged in after that. Don't forward this email.</p>`,
    }),
  });
  if (!res.ok) return json({ error: "Couldn't send the email — try again." }, 502);
  return json({ ok: true, note: "Login link sent to your email." }, 200);
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/admin-link" };
