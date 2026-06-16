
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/vault-invite.js
var TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Clients";
async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const resendKey = process.env.RESEND_API_KEY;
  const adminPass = process.env.VAULT_ADMIN_SECRET;
  const siteUrl = process.env.URL || "https://rogetjames.com";
  const fromEmail = process.env.VAULT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>";
  if (!apiKey || !baseId || !resendKey || !adminPass) {
    return json({ error: "Server configuration missing." }, 500);
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const { adminSecret, clientEmail } = body;
  if (!adminSecret || !clientEmail)
    return json({ error: "Missing required fields." }, 400);
  if (adminSecret !== adminPass)
    return json({ error: "Unauthorized." }, 401);
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
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, "");
    await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}/${record.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { Token: token } })
    });
  }
  const vaultUrl = `${siteUrl}/vault?token=${token}`;
  const firstName = (fields["Name"] || "").split(" ")[0] || "there";
  const projectTitle = fields["Project Title"] || "";
  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to: [clientEmail],
      subject: "Your private project preview is ready \u2014 ROGETjames",
      html: buildEmail(firstName, projectTitle, vaultUrl)
    })
  });
  if (!emailRes.ok) {
    const err = await emailRes.json().catch(() => ({}));
    return json({ error: err.message || "Failed to send email." }, 500);
  }
  await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}/${record.id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { "Invite Sent": true } })
  });
  return json({ success: true, vaultUrl }, 200);
}
function buildEmail(firstName, projectTitle, vaultUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your private preview \u2014 ROGETjames</title>
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
              ROGETjames \xB7 Perth \xB7 Gold Coast \xB7 Melbourne
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
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
var config = { path: "/api/vault-invite" };
export {
  config,
  handler as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvdmF1bHQtaW52aXRlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBUQUJMRV9OQU1FID0gcHJvY2Vzcy5lbnYuQUlSVEFCTEVfVEFCTEVfTkFNRSB8fCBcIkNsaWVudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEpIHtcbiAgaWYgKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIk1ldGhvZCBub3QgYWxsb3dlZFwiLCB7IHN0YXR1czogNDA1IH0pO1xuICB9XG5cbiAgY29uc3QgYXBpS2V5ICAgICA9IHByb2Nlc3MuZW52LkFJUlRBQkxFX0FQSV9LRVk7XG4gIGNvbnN0IGJhc2VJZCAgICAgPSBwcm9jZXNzLmVudi5BSVJUQUJMRV9CQVNFX0lEO1xuICBjb25zdCByZXNlbmRLZXkgID0gcHJvY2Vzcy5lbnYuUkVTRU5EX0FQSV9LRVk7XG4gIGNvbnN0IGFkbWluUGFzcyAgPSBwcm9jZXNzLmVudi5WQVVMVF9BRE1JTl9TRUNSRVQ7XG4gIGNvbnN0IHNpdGVVcmwgICAgPSBwcm9jZXNzLmVudi5VUkwgfHwgXCJodHRwczovL3JvZ2V0amFtZXMuY29tXCI7XG4gIGNvbnN0IGZyb21FbWFpbCAgPSBwcm9jZXNzLmVudi5WQVVMVF9GUk9NX0VNQUlMIHx8IFwiUk9HRVRqYW1lcyA8amFtZXNAcm9nZXRqYW1lcy5jb20+XCI7XG5cbiAgaWYgKCFhcGlLZXkgfHwgIWJhc2VJZCB8fCAhcmVzZW5kS2V5IHx8ICFhZG1pblBhc3MpIHtcbiAgICByZXR1cm4ganNvbih7IGVycm9yOiBcIlNlcnZlciBjb25maWd1cmF0aW9uIG1pc3NpbmcuXCIgfSwgNTAwKTtcbiAgfVxuXG4gIGxldCBib2R5O1xuICB0cnkgeyBib2R5ID0gYXdhaXQgcmVxLmpzb24oKTsgfVxuICBjYXRjaCB7IHJldHVybiBqc29uKHsgZXJyb3I6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH0sIDQwMCk7IH1cblxuICBjb25zdCB7IGFkbWluU2VjcmV0LCBjbGllbnRFbWFpbCB9ID0gYm9keTtcbiAgaWYgKCFhZG1pblNlY3JldCB8fCAhY2xpZW50RW1haWwpIHJldHVybiBqc29uKHsgZXJyb3I6IFwiTWlzc2luZyByZXF1aXJlZCBmaWVsZHMuXCIgfSwgNDAwKTtcbiAgaWYgKGFkbWluU2VjcmV0ICE9PSBhZG1pblBhc3MpIHJldHVybiBqc29uKHsgZXJyb3I6IFwiVW5hdXRob3JpemVkLlwiIH0sIDQwMSk7XG5cbiAgLy8gTG9vayB1cCBjbGllbnQgaW4gQWlydGFibGUgYnkgZW1haWxcbiAgY29uc3QgZm9ybXVsYSA9IGVuY29kZVVSSUNvbXBvbmVudChgTE9XRVIoe0VtYWlsfSk9XCIke2NsaWVudEVtYWlsLnRvTG93ZXJDYXNlKCl9XCJgKTtcbiAgY29uc3Qgc2VhcmNoVXJsID0gYGh0dHBzOi8vYXBpLmFpcnRhYmxlLmNvbS92MC8ke2Jhc2VJZH0vJHtlbmNvZGVVUklDb21wb25lbnQoVEFCTEVfTkFNRSl9P2ZpbHRlckJ5Rm9ybXVsYT0ke2Zvcm11bGF9YDtcblxuICBsZXQgc2VhcmNoUmVzLCBzZWFyY2hEYXRhO1xuICB0cnkge1xuICAgIHNlYXJjaFJlcyA9IGF3YWl0IGZldGNoKHNlYXJjaFVybCwgeyBoZWFkZXJzOiB7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHthcGlLZXl9YCB9IH0pO1xuICAgIHNlYXJjaERhdGEgPSBhd2FpdCBzZWFyY2hSZXMuanNvbigpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ganNvbih7IGVycm9yOiBcIkNvdWxkIG5vdCByZWFjaCBkYXRhYmFzZS5cIiB9LCA1MDIpO1xuICB9XG5cbiAgaWYgKCFzZWFyY2hSZXMub2sgfHwgIXNlYXJjaERhdGEucmVjb3Jkcz8ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGpzb24oeyBlcnJvcjogXCJDbGllbnQgbm90IGZvdW5kLiBBZGQgdGhlbSB0byBBaXJ0YWJsZSBmaXJzdC5cIiB9LCA0MDQpO1xuICB9XG5cbiAgY29uc3QgcmVjb3JkID0gc2VhcmNoRGF0YS5yZWNvcmRzWzBdO1xuICBjb25zdCBmaWVsZHMgPSByZWNvcmQuZmllbGRzO1xuICBsZXQgdG9rZW4gPSBmaWVsZHNbXCJUb2tlblwiXTtcblxuICAvLyBHZW5lcmF0ZSBhbmQgc2F2ZSB0b2tlbiBpZiBub3QgYWxyZWFkeSBzZXRcbiAgaWYgKCF0b2tlbikge1xuICAgIHRva2VuID0gY3J5cHRvLnJhbmRvbVVVSUQoKS5yZXBsYWNlKC8tL2csIFwiXCIpO1xuICAgIGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5haXJ0YWJsZS5jb20vdjAvJHtiYXNlSWR9LyR7ZW5jb2RlVVJJQ29tcG9uZW50KFRBQkxFX05BTUUpfS8ke3JlY29yZC5pZH1gLCB7XG4gICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2FwaUtleX1gLCBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBmaWVsZHM6IHsgVG9rZW46IHRva2VuIH0gfSksXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCB2YXVsdFVybCA9IGAke3NpdGVVcmx9L3ZhdWx0P3Rva2VuPSR7dG9rZW59YDtcbiAgY29uc3QgZmlyc3ROYW1lID0gKGZpZWxkc1tcIk5hbWVcIl0gfHwgXCJcIikuc3BsaXQoXCIgXCIpWzBdIHx8IFwidGhlcmVcIjtcbiAgY29uc3QgcHJvamVjdFRpdGxlID0gZmllbGRzW1wiUHJvamVjdCBUaXRsZVwiXSB8fCBcIlwiO1xuXG4gIC8vIFNlbmQgZW1haWwgdmlhIFJlc2VuZFxuICBjb25zdCBlbWFpbFJlcyA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9hcGkucmVzZW5kLmNvbS9lbWFpbHNcIiwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7cmVzZW5kS2V5fWAsIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgZnJvbTogZnJvbUVtYWlsLFxuICAgICAgdG86IFtjbGllbnRFbWFpbF0sXG4gICAgICBzdWJqZWN0OiBcIllvdXIgcHJpdmF0ZSBwcm9qZWN0IHByZXZpZXcgaXMgcmVhZHkgXHUyMDE0IFJPR0VUamFtZXNcIixcbiAgICAgIGh0bWw6IGJ1aWxkRW1haWwoZmlyc3ROYW1lLCBwcm9qZWN0VGl0bGUsIHZhdWx0VXJsKSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgaWYgKCFlbWFpbFJlcy5vaykge1xuICAgIGNvbnN0IGVyciA9IGF3YWl0IGVtYWlsUmVzLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgICByZXR1cm4ganNvbih7IGVycm9yOiBlcnIubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBzZW5kIGVtYWlsLlwiIH0sIDUwMCk7XG4gIH1cblxuICAvLyBNYXJrIGludml0ZSBhcyBzZW50IGluIEFpcnRhYmxlXG4gIGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5haXJ0YWJsZS5jb20vdjAvJHtiYXNlSWR9LyR7ZW5jb2RlVVJJQ29tcG9uZW50KFRBQkxFX05BTUUpfS8ke3JlY29yZC5pZH1gLCB7XG4gICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7YXBpS2V5fWAsIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBmaWVsZHM6IHsgXCJJbnZpdGUgU2VudFwiOiB0cnVlIH0gfSksXG4gIH0pO1xuXG4gIHJldHVybiBqc29uKHsgc3VjY2VzczogdHJ1ZSwgdmF1bHRVcmwgfSwgMjAwKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFbWFpbChmaXJzdE5hbWUsIHByb2plY3RUaXRsZSwgdmF1bHRVcmwpIHtcbiAgcmV0dXJuIGA8IURPQ1RZUEUgaHRtbD5cbjxodG1sIGxhbmc9XCJlblwiPlxuPGhlYWQ+XG4gIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxuICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MVwiPlxuICA8dGl0bGU+WW91ciBwcml2YXRlIHByZXZpZXcgXHUyMDE0IFJPR0VUamFtZXM8L3RpdGxlPlxuPC9oZWFkPlxuPGJvZHkgc3R5bGU9XCJtYXJnaW46MDtwYWRkaW5nOjA7YmFja2dyb3VuZDojZjBlY2U2O2ZvbnQtZmFtaWx5OidIZWx2ZXRpY2EgTmV1ZScsSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7XCI+XG4gIDx0YWJsZSB3aWR0aD1cIjEwMCVcIiBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBzdHlsZT1cImJhY2tncm91bmQ6I2YwZWNlNjtwYWRkaW5nOjQ4cHggMjBweDtcIj5cbiAgICA8dHI+PHRkIGFsaWduPVwiY2VudGVyXCI+XG4gICAgICA8dGFibGUgd2lkdGg9XCIxMDAlXCIgY2VsbHBhZGRpbmc9XCIwXCIgY2VsbHNwYWNpbmc9XCIwXCIgc3R5bGU9XCJtYXgtd2lkdGg6NTYwcHg7YmFja2dyb3VuZDojMTkxNTEwO2JvcmRlci1yYWRpdXM6MjBweDtvdmVyZmxvdzpoaWRkZW47XCI+XG5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6NDBweCA0OHB4IDMycHg7dGV4dC1hbGlnbjpjZW50ZXI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA3KTtcIj5cbiAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOjA7Zm9udC1mYW1pbHk6R2VvcmdpYSwnVGltZXMgTmV3IFJvbWFuJyxzZXJpZjtmb250LXNpemU6MjJweDtsZXR0ZXItc3BhY2luZzowLjA2ZW07Y29sb3I6I2VkZThkZjtcIj5cbiAgICAgICAgICAgICAgUk9HRVQ8ZW0+amFtZXM8L2VtPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOjI4cHg7aGVpZ2h0OjFweDtiYWNrZ3JvdW5kOiNjNDUwMTg7bWFyZ2luOjEycHggYXV0byAwO1wiPjwvZGl2PlxuICAgICAgICAgIDwvdGQ+XG4gICAgICAgIDwvdHI+XG5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6NDRweCA0OHB4IDM2cHg7XCI+XG4gICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbjowIDAgMTBweDtmb250LXNpemU6MTBweDtjb2xvcjojYzQ1MDE4O2xldHRlci1zcGFjaW5nOjAuMjhlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLHNhbnMtc2VyaWY7XCI+XG4gICAgICAgICAgICAgIFByaXZhdGUgQ2xpZW50IFZhdWx0XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8aDEgc3R5bGU9XCJtYXJnaW46MCAwIDE4cHg7Zm9udC1mYW1pbHk6R2VvcmdpYSwnVGltZXMgTmV3IFJvbWFuJyxzZXJpZjtmb250LXNpemU6MjhweDtmb250LXdlaWdodDo0MDA7Y29sb3I6I2VkZThkZjtsaW5lLWhlaWdodDoxLjM7XCI+XG4gICAgICAgICAgICAgIFlvdXIgZXhjbHVzaXZlIHByZXZpZXcgaXMgcmVhZHkuXG4gICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgJHtwcm9qZWN0VGl0bGUgPyBgPHAgc3R5bGU9XCJtYXJnaW46MCAwIDIwcHg7Zm9udC1zaXplOjExcHg7Y29sb3I6cmdiYSgyMzcsMjMyLDIyMywwLjQ1KTtsZXR0ZXItc3BhY2luZzowLjE4ZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxzYW5zLXNlcmlmO1wiPiR7cHJvamVjdFRpdGxlfTwvcD5gIDogXCJcIn1cbiAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOjAgMCAzNnB4O2ZvbnQtc2l6ZToxNXB4O2NvbG9yOnJnYmEoMjM3LDIzMiwyMjMsMC43MCk7bGluZS1oZWlnaHQ6MS43NTtmb250LWZhbWlseTpIZWx2ZXRpY2Esc2Fucy1zZXJpZjtcIj5cbiAgICAgICAgICAgICAgV2UndmUgcHJlcGFyZWQgYW4gZXhjbHVzaXZlIGRpZ2l0YWwgdmF1bHQgZm9yIHlvdXIgcHJpdmF0ZSByZXZpZXcke2ZpcnN0TmFtZSAhPT0gXCJ0aGVyZVwiID8gYCwgJHtmaXJzdE5hbWV9YCA6IFwiXCJ9LiBJdCBpbmNsdWRlcyB5b3VyIHByb2plY3QgZGV0YWlscywgaW1hZ2VyeSwgYW5kIGFueSBkb2N1bWVudHMgcHJlcGFyZWQgZXNwZWNpYWxseSBmb3IgeW91LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGEgaHJlZj1cIiR7dmF1bHRVcmx9XCIgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOiNjNDUwMTg7Y29sb3I6I2VkZThkZjt0ZXh0LWRlY29yYXRpb246bm9uZTtwYWRkaW5nOjE1cHggMzZweDtib3JkZXItcmFkaXVzOjUwcHg7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLHNhbnMtc2VyaWY7bGV0dGVyLXNwYWNpbmc6MC4xNGVtO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtmb250LXdlaWdodDo2MDA7XCI+XG4gICAgICAgICAgICAgIFZpZXcgTXkgVmF1bHRcbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOjI4cHggMCAwO2ZvbnQtc2l6ZToxMnB4O2NvbG9yOnJnYmEoMjM3LDIzMiwyMjMsMC4zNSk7bGluZS1oZWlnaHQ6MS42NTtmb250LWZhbWlseTpIZWx2ZXRpY2Esc2Fucy1zZXJpZjtcIj5cbiAgICAgICAgICAgICAgRW50ZXIgeW91ciBlbWFpbCBhZGRyZXNzIG9uIHRoZSB2YXVsdCBwYWdlIHRvIGNvbmZpcm0geW91ciBpZGVudGl0eS4gVGhpcyBsaW5rIGlzIGV4Y2x1c2l2ZSB0byB5b3UuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgPC90cj5cblxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzoyMnB4IDQ4cHggMjhweDtib3JkZXItdG9wOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMDcpO3RleHQtYWxpZ246Y2VudGVyO1wiPlxuICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW46MCAwIDVweDtmb250LXNpemU6MTBweDtjb2xvcjpyZ2JhKDIzNywyMzIsMjIzLDAuMjgpO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxzYW5zLXNlcmlmO2xldHRlci1zcGFjaW5nOjAuMWVtO1wiPlxuICAgICAgICAgICAgICBST0dFVGphbWVzIFx1MDBCNyBQZXJ0aCBcdTAwQjcgR29sZCBDb2FzdCBcdTAwQjcgTWVsYm91cm5lXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbjowO2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OkhlbHZldGljYSxzYW5zLXNlcmlmO1wiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9yb2dldGphbWVzLmNvbVwiIHN0eWxlPVwiY29sb3I6cmdiYSgyMzcsMjMyLDIyMywwLjMyKTt0ZXh0LWRlY29yYXRpb246bm9uZTtcIj5yb2dldGphbWVzLmNvbTwvYT5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuXG4gICAgICA8L3RhYmxlPlxuICAgIDwvdGQ+PC90cj5cbiAgPC90YWJsZT5cbjwvYm9keT5cbjwvaHRtbD5gO1xufVxuXG5mdW5jdGlvbiBqc29uKGRhdGEsIHN0YXR1cykge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpLCB7XG4gICAgc3RhdHVzLFxuICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7IHBhdGg6IFwiL2FwaS92YXVsdC1pbnZpdGVcIiB9O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBLElBQU0sYUFBYSxRQUFRLElBQUksdUJBQXVCO0FBRXRELGVBQU8sUUFBK0IsS0FBSztBQUN6QyxNQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLFdBQU8sSUFBSSxTQUFTLHNCQUFzQixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDM0Q7QUFFQSxRQUFNLFNBQWEsUUFBUSxJQUFJO0FBQy9CLFFBQU0sU0FBYSxRQUFRLElBQUk7QUFDL0IsUUFBTSxZQUFhLFFBQVEsSUFBSTtBQUMvQixRQUFNLFlBQWEsUUFBUSxJQUFJO0FBQy9CLFFBQU0sVUFBYSxRQUFRLElBQUksT0FBTztBQUN0QyxRQUFNLFlBQWEsUUFBUSxJQUFJLG9CQUFvQjtBQUVuRCxNQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsV0FBVztBQUNsRCxXQUFPLEtBQUssRUFBRSxPQUFPLGdDQUFnQyxHQUFHLEdBQUc7QUFBQSxFQUM3RDtBQUVBLE1BQUk7QUFDSixNQUFJO0FBQUUsV0FBTyxNQUFNLElBQUksS0FBSztBQUFBLEVBQUcsUUFDekI7QUFBRSxXQUFPLEtBQUssRUFBRSxPQUFPLG1CQUFtQixHQUFHLEdBQUc7QUFBQSxFQUFHO0FBRXpELFFBQU0sRUFBRSxhQUFhLFlBQVksSUFBSTtBQUNyQyxNQUFJLENBQUMsZUFBZSxDQUFDO0FBQWEsV0FBTyxLQUFLLEVBQUUsT0FBTywyQkFBMkIsR0FBRyxHQUFHO0FBQ3hGLE1BQUksZ0JBQWdCO0FBQVcsV0FBTyxLQUFLLEVBQUUsT0FBTyxnQkFBZ0IsR0FBRyxHQUFHO0FBRzFFLFFBQU0sVUFBVSxtQkFBbUIsbUJBQW1CLFlBQVksWUFBWSxDQUFDLEdBQUc7QUFDbEYsUUFBTSxZQUFZLCtCQUErQixNQUFNLElBQUksbUJB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
