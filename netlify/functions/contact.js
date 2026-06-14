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

  const { name, email, phone, postcode, message, selections } = body;

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
      from: "ROGETjames Website <onboarding@resend.dev>",
      to: "james@rogetjames.com",
      reply_to: email || undefined,
      subject: `New enquiry from ${name || "website visitor"}`,
      text: `New enquiry from rogetjames.com\n\n${lines}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 500, body: JSON.stringify({ error: err }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
