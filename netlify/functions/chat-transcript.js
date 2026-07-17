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
  const questions = messages.filter(m => m.role === "user").map(m => m.content);

  // The widget flushes a conversation more than once — when the visitor hides
  // the tab, and again when they close the chat or leave for good. Those
  // flushes carry the same id so they update one record instead of piling up
  // duplicates. Anything unexpected in the id is dropped: it becomes a blob
  // key, so it can't be trusted straight off the wire.
  const id = typeof body.id === "string" && /^[a-z0-9-]{6,64}$/.test(body.id) ? body.id : null;
  const final = body.final === true;
  const key = id || `${new Date().toISOString()}_${Math.random().toString(36).slice(2, 8)}`;

  let store = null;
  let existing = null;
  try {
    store = getStore({ name: "chat-transcripts", consistency: "strong" });
    existing = id ? await store.get(key, { type: "json" }).catch(() => null) : null;
  } catch { /* storage is best-effort — never block the email */ }

  // A late flush that arrives with nothing new must not overwrite a fuller
  // record or re-send an email.
  const emailedQuestions = existing?.emailedQuestions || 0;
  const isNewer = questions.length > (existing?.questions?.length || 0);
  const willEmail = final && questions.length > emailedQuestions;

  // Write when there is more conversation than we hold, and also when this
  // flush triggers an email — that write is what records the email, so
  // skipping it would let a repeat flush send the same transcript twice.
  if (store && (isNewer || !existing || willEmail)) {
    try {
      await store.setJSON(key, {
        createdTime: existing?.createdTime || new Date().toISOString(),
        updatedTime: new Date().toISOString(),
        questions: isNewer || !existing ? questions : existing.questions,
        messages: isNewer || !existing ? convo.map(m => ({ role: m.role, content: m.content })) : existing.messages,
        // Record what the email covered so a later flush can tell whether
        // there is anything new worth sending.
        emailedQuestions: willEmail ? questions.length : emailedQuestions,
      });
    } catch { /* storage is best-effort */ }
  }

  // Email only once the conversation has actually ended, and only if it has
  // moved on since the last one. A hidden tab may come back, so it just
  // stores — /stats always has it either way.
  if (!willEmail) {
    return json({ ok: true, stored: true, emailed: false }, 200);
  }

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
