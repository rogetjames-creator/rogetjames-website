// A client replies from inside their private gallery — emails James (Resend).
// Public endpoint, but low-risk: it only sends a message to James's own inbox.
const NOTIFY = ["james@rogetjames.com", "rogetjames@gmail.com"];

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Invalid request." }, 400); }

  const name = String(body.name || "").slice(0, 120).trim();
  const email = String(body.email || "").slice(0, 160).trim();
  const message = String(body.message || "").slice(0, 5000).trim();
  if (!message) return json({ error: "Please write a message." }, 400);

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return json({ error: "Messaging is not configured." }, 500);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const lines = [
    `Client: ${name || "(unnamed)"}`,
    email ? `Email: ${email}` : null,
    "",
    message,
  ].filter((l) => l !== null).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.VAULT_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>",
      to: NOTIFY,
      reply_to: emailOk ? email : undefined,
      subject: `Vault reply from ${name || email || "a client"}`,
      text: `A client responded from their private gallery:\n\n${lines}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    return json({ error: "Could not send. Please try again.", detail: err.slice(0, 200) }, 502);
  }
  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/vault-reply" };
