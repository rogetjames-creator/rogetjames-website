// Scheduled function — runs every Monday morning and emails James a
// summary of the past week's pricing/postcode interest, pulled from
// the "Pricing Interest" Airtable table written by track-event.js.
const TABLE_NAME = process.env.AIRTABLE_ANALYTICS_TABLE || "Pricing Interest";

export default async function handler() {
  const apiKey    = process.env.AIRTABLE_API_KEY;
  const baseId    = process.env.AIRTABLE_BASE_ID;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.VAULT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>";
  const toEmail   = "james@rogetjames.com";

  if (!apiKey || !baseId || !resendKey) return new Response("ok");

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const formula = encodeURIComponent(`IS_AFTER(CREATED_TIME(), DATETIME_PARSE("${since}"))`);
  const tableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}?pageSize=100&filterByFormula=${formula}`;

  let records = [];
  let offset;
  try {
    do {
      const url = offset ? `${tableUrl}&offset=${offset}` : tableUrl;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
      if (!res.ok) return new Response("ok"); // table may not exist yet — nothing to report
      const data = await res.json();
      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset);
  } catch {
    return new Response("ok");
  }

  if (records.length === 0) return new Response("ok"); // skip the email entirely if there's nothing to report

  const byType = {};
  const byItem = {};
  const byRegion = {};
  const postcodes = [];
  for (const r of records) {
    const f = r.fields;
    if (f.Type) byType[f.Type] = (byType[f.Type] || 0) + 1;
    if (f.Item) byItem[f.Item] = (byItem[f.Item] || 0) + 1;
    if (f.Region) byRegion[f.Region] = (byRegion[f.Region] || 0) + 1;
    if (f.Postcode) postcodes.push(f.Postcode);
  }

  const topItems = Object.entries(byItem).sort((a, b) => b[1] - a[1]).slice(0, 8);

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `Weekly pricing interest — ${records.length} event${records.length === 1 ? "" : "s"}`,
      html: buildEmail({ total: records.length, byType, byRegion, topItems, postcodes }),
    }),
  });

  return new Response("ok");
}

function buildEmail({ total, byType, byRegion, topItems, postcodes }) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 0;color:rgba(237,232,223,0.7);font-family:Helvetica,sans-serif;font-size:14px;">${label}</td><td style="padding:6px 0;text-align:right;color:#ede8df;font-family:Helvetica,sans-serif;font-size:14px;font-weight:600;">${value}</td></tr>`;

  const typeRows = Object.entries(byType).map(([k, v]) => row(k, v)).join("");
  const itemRows = topItems.map(([k, v]) => row(k, v)).join("");
  const regionRows = Object.entries(byRegion).map(([k, v]) => row(k, v)).join("");
  const postcodeList = postcodes.length ? postcodes.join(", ") : "None entered this week";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ece6;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece6;padding:48px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#191510;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 48px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07);">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;letter-spacing:0.06em;color:#ede8df;">ROGET<em>james</em></p>
          <div style="width:28px;height:1px;background:#c45018;margin:12px auto 0;"></div>
        </td></tr>
        <tr><td style="padding:36px 48px;">
          <p style="margin:0 0 8px;font-size:10px;color:#c45018;letter-spacing:0.28em;text-transform:uppercase;">Weekly Digest</p>
          <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ede8df;">${total} pricing event${total === 1 ? "" : "s"} this week</h1>

          <p style="margin:0 0 8px;font-size:11px;color:rgba(237,232,223,0.45);letter-spacing:0.12em;text-transform:uppercase;">By activity</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${typeRows}</table>

          <p style="margin:0 0 8px;font-size:11px;color:rgba(237,232,223,0.45);letter-spacing:0.12em;text-transform:uppercase;">Top items viewed / quoted</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${itemRows || row("None", "—")}</table>

          <p style="margin:0 0 8px;font-size:11px;color:rgba(237,232,223,0.45);letter-spacing:0.12em;text-transform:uppercase;">WA vs interstate</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${regionRows || row("None", "—")}</table>

          <p style="margin:0 0 8px;font-size:11px;color:rgba(237,232,223,0.45);letter-spacing:0.12em;text-transform:uppercase;">Postcodes entered</p>
          <p style="margin:0 0 24px;font-size:13px;color:rgba(237,232,223,0.75);line-height:1.6;">${postcodeList}</p>

          <a href="https://rogetjames.com/stats" style="display:inline-block;background:#c45018;color:#ede8df;text-decoration:none;padding:13px 30px;border-radius:50px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Full Stats Page</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const config = { schedule: "0 22 * * 0" };
