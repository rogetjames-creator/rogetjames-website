// Receives a Q&Ai conversation when the chat widget closes: stores it in the
// "chat-transcripts" Netlify Blobs store (for the /stats dashboard) and emails
// it to James. ESM v2 function so it can statically import @netlify/blobs.
import { getStore } from "@netlify/blobs";

function originAllowed(origin) {
  if (!origin) return true;
  try {
    const h = new URL(origin).hostname;
    return h === "rogetjames.com" || h === "www.rogetjames.com" || h.endsWith(".netlify.app");
  } catch { return false; }
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!originAllowed(req.headers.get("origin") || req.headers.get("referer"))) {
    return json({ error: "Forbidden" }, 403);
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return json({ error: "Email service not configured" }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: "No messages" }, 400);
  }

  const convo = messages.filter(m => m.role === "user" || m.role === "assistant");

  // Store the conversation in Netlify Blobs so the questions can be reviewed on
  // the /stats dashboard, not only emailed. Best-effort — never blocks.
  try {
    const store = getStore({ name: "chat-transcripts", consistency: "strong" });
    const key = `${new Date().toISOString()}_${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, {
      createdTime: new Date().toISOString(),
      questions: messages.filter(m => m.role === "user").map(m => m.content),
      messages: convo.map(m => ({ role: m.role, content: m.content })),
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
    const err = await res.text();
    return json({ error: err }, 500);
  }

  return json({ ok: true }, 200);
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/chat-transcript" };
