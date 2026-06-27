function originAllowed(origin) {
  if (!origin) return true;
  try {
    const h = new URL(origin).hostname;
    return h === "rogetjames.com" || h === "www.rogetjames.com" || h.endsWith(".netlify.app");
  } catch { return false; }
}

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const headers = event.headers || {};
  if (!originAllowed(headers.origin || headers.referer)) {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden" }) };
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Email service not configured" }) };
  }

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "No messages" }) };
  }

  const lines = messages
    .filter(m => m.role === "user" || m.role === "assistant")
    .map(m => `${m.role === "user" ? "Visitor" : "Jai"}: ${m.content}`)
    .join("\n\n");

  const now = new Date().toLocaleString("en-AU", { timeZone: "Australia/Perth", dateStyle: "full", timeStyle: "short" });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>",
      to: process.env.NOTIFY_EMAIL || "james@rogetjames.com",
      subject: `Q & Ai transcript — ${now}`,
      text: `Chat transcript from rogetjames.com\n${now}\n\n${lines}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 500, body: JSON.stringify({ error: err }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
