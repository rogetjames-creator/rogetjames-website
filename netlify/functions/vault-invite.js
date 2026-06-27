const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Clients";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey     = process.env.AIRTABLE_API_KEY;
  const baseId     = process.env.AIRTABLE_BASE_ID;
  const resendKey  = process.env.RESEND_API_KEY;
  const adminPass  = process.env.VAULT_ADMIN_SECRET;
  const siteUrl    = process.env.URL || "https://rogetjames.com";
  const fromEmail  = process.env.VAULT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>";

  if (!apiKey || !baseId || !resendKey || !adminPass) {
    return json({ error: "Server configuration missing." }, 500);
  }

  let body;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid request." }, 400); }

  const { adminSecret, clientEmail } = body;
  if (!adminSecret || !clientEmail) return json({ error: "Missing required fields." }, 400);
  if (!safeEqual(adminSecret, adminPass)) return json({ error: "Unauthorized." }, 401);

  // Reject anything that could break out of the Airtable formula string below.
  const emailOk = typeof clientEmail === "string" && /^[^\s"'(),]{1,120}@[^\s"'(),]{1,120}$/.test(clientEmail);
  if (!emailOk) return json({ error: "Invalid email." }, 400);

  // Look up client in Airtable by email
  const formula = encodeURIComponent(`LOWER({Email})="${clientEmail.toLowerCase()}"`);
  const searchUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}?filterByFormula=${formula}`;

  let searchRes, searchData;
  try {
    searchRes = await fetch(searchUrl, { headers: { Authorization: `Bearer ${apiKey}` } });
    searchData = await searchRes.json();
  } catch {
    return json({ error: "Could not reach database." }, 502);
  }

  if (!searchRes.ok || !searchData.records?.length) {
    return json({ error: "Client not found. Add them to Airtable first." }, 404);
  }

  const record = searchData.records[0];
  const fields = record.fields;
  let token = fields["Token"];

  // Generate and save token if not already set
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, "");
    const saveRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}/${record.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { Token: token } }),
    }).catch(() => null);
    // If the token never saved, the emailed link can't be verified — fail before sending it.
    if (!saveRes || !saveRes.ok) return json({ error: "Could not save the client's access token. Please try again." }, 502);
  }

  const vaultUrl = `${siteUrl}/vault?token=${token}`;
  const firstName = (fields["Name"] || "").split(" ")[0] || "there";
  const projectTitle = fields["Project Title"] || "";

  // Send email via Resend
  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to: [clientEmail],
      subject: "Your private project preview is ready — ROGETjames",
      html: buildEmail(firstName, projectTitle, vaultUrl),
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.json().catch(() => ({}));
    return json({ error: err.message || "Failed to send email." }, 500);
  }

  // Mark invite as sent in Airtable
  await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}/${record.id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { "Invite Sent": true } }),
  });

  return json({ success: true, vaultUrl }, 200);
}

function buildEmail(firstName, projectTitle, vaultUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your private preview — ROGETjames</title>
</head>
<body style="margin:0;padding:0;background:#f0ece6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece6;padding:48px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#191510;border-radius:20px;overflow:hidden;">

        <tr>
          <td style="padding:40px 48px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07);">
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.06em;color:#ede8df;">
              ROGET<em>james</em>
            </p>
            <div style="width:28px;height:1px;background:#c45018;margin:12px auto 0;"></div>
          </td>
        </tr>

        <tr>
          <td style="padding:44px 48px 36px;">
            <p style="margin:0 0 10px;font-size:10px;color:#c45018;letter-spacing:0.28em;text-transform:uppercase;font-family:Helvetica,sans-serif;">
              Private Client Vault
            </p>
            <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:#ede8df;line-height:1.3;">
              Your exclusive preview is ready.
            </h1>
            ${projectTitle ? `<p style="margin:0 0 20px;font-size:11px;color:rgba(237,232,223,0.45);letter-spacing:0.18em;text-transform:uppercase;font-family:Helvetica,sans-serif;">${projectTitle}</p>` : ""}
            <p style="margin:0 0 36px;font-size:15px;color:rgba(237,232,223,0.70);line-height:1.75;font-family:Helvetica,sans-serif;">
              We've prepared an exclusive digital vault for your private review${firstName !== "there" ? `, ${firstName}` : ""}. It includes your project details, imagery, and any documents prepared especially for you.
            </p>
            <a href="${vaultUrl}" style="display:inline-block;background:#c45018;color:#ede8df;text-decoration:none;padding:15px 36px;border-radius:50px;font-size:12px;font-family:Helvetica,sans-serif;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;">
              View My Vault
            </a>
            <p style="margin:28px 0 0;font-size:12px;color:rgba(237,232,223,0.35);line-height:1.65;font-family:Helvetica,sans-serif;">
              Enter your email address on the vault page to confirm your identity. This link is exclusive to you.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:22px 48px 28px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
            <p style="margin:0 0 5px;font-size:10px;color:rgba(237,232,223,0.28);font-family:Helvetica,sans-serif;letter-spacing:0.1em;">
              ROGETjames · Perth · Gold Coast · Melbourne
            </p>
            <p style="margin:0;font-size:10px;font-family:Helvetica,sans-serif;">
              <a href="https://rogetjames.com" style="color:rgba(237,232,223,0.32);text-decoration:none;">rogetjames.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Constant-time string comparison — avoids leaking the admin secret via response timing.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = { path: "/api/vault-invite" };
