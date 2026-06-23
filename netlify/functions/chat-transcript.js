exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
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
      from: "ROGETjames Website <onboarding@resend.dev>",
      to: "info@rogetjames.com",
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
