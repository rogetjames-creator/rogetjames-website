// Receives a Q&Ai conversation when the chat widget closes: stores it in the
// "chat-transcripts" Netlify Blobs store (for the /stats dashboard) and emails
// it to James. ESM v2 function so it can statically import @netlify/blobs.
import { getStore } from "@netlify/blobs";

// Reject a missing or foreign Origin (or Referer). A real browser always sends
// one on POST, so this only blocks origin-less scripted abuse and other sites.
function originAllowed(origin) {
  if (!origin) return false;
  try {
    const h = new URL(origin).hostname;
    return h === "rogetjames.com" || h === "www.rogetjames.com" || h.endsWith(".netlify.app");
  } catch { return false; }
}

// Best-effort per-IP burst limit (per warm instance): at most 5 transcript
// posts per 10 minutes, so a single client can't flood the store or inbox.
const HITS = new Map();
const WINDOW_MS = 600_000;
const MAX_PER_WINDOW = 5;
function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

// Caps applied before anything is stored or emailed.
const MAX_MESSAGES = 100;
const MAX_CONTENT = 4000;

export default async function handler(req, context) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!originAllowed(req.headers.get("origin") || req.headers.get("referer"))) {
    return json({ error: "Forbidden" }, 403);
  }

  const ip = context?.ip || req.headers.get("x-forwarded-for") || req.headers.get("x-nf-client-connection-ip") || "";
  if (rateLimited(ip)) {
    return json({ error: "Too many requests. Please wait a moment." }, 429);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return json({ error: "Email service not configured" }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: "No messages" }, 400);
  }
  if (messages.length > MAX_MESSAGES) {
    return json({ error: "Too many messages" }, 400);
  }

  // Keep only chat turns, and cap each message's length before it is stored or
  // emailed — everything downstream reads from this trimmed copy.
  const convo = messages
    .filter(m => m && (m.role === "user" || m.role === "assistant"))
    .map(m => ({ role: m.role, content: String(m.content ?? "").slice(0, MAX_CONTENT) }));

  // Store the conversation in Netlify Blobs so the questions can be reviewed on
  // the /stats dashboard, not only emailed. Best-effort — never blocks.
  try {
    const store = getStore({ name: "chat-transcripts", consistency: "strong" });
    const key = `${new Date().toISOString()}_${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, {
      createdTime: new Date().toISOString(),
      questions: convo.filter(m => m.role === "user").map(m => m.content),
      messages: convo,
    });
  } catch { /* storage is best-effort */ }

  const lines = convo.map(m => `${m.role === "user" ? "Visitor" : "Jai"}: ${m.content}`).join("\n\n");
  const now = new Date().toLocaleString("en-AU", { timeZone: "Australia/Perth", dateStyle: "full", timeStyle: "short" });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>",
      to: process.env.NOTIFY_EMAIL || "james@rogetjames.com",
      subject: `Q & Ai transcript — ${now}`,
      text: `Chat transcript from rogetjames.com\n${now}\n\n${lines}`,
    }),
  });

  if (!res.ok) {
    return json({ error: "Failed to send" }, 502);
  }

  return json({ ok: true }, 200);
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/chat-transcript" };
