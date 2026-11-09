// Scheduled function — runs every Monday 6am Perth and emails James a summary
// of the past week on rogetjames.com: site visits (page landed on + where
// visitors came from), galleries opened, Pinterest, pricing and quotes.
// Read from the "pricing-interest" Netlify Blobs store written by track-event.js.
//
// It ALWAYS sends, even in a quiet week, so a missing email means something is
// wrong. Sending is retried, because on 9 Nov 2026 a single failed connection
// to the email service lost that week's email.
import { getStore } from "@netlify/blobs";

const STORE_NAME = "pricing-interest";

export default async function handler() {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.VAULT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>";
  // Branded address plus the Gmail, same as the contact form and postcode alerts.
  const toList = [...new Set([process.env.NOTIFY_EMAIL || "james@rogetjames.com", "rogetjames@gmail.com"])];

  if (!resendKey) { console.error("weekly-stats: RESEND_API_KEY is not set"); return new Response("no key", { status: 500 }); }

  const sinceTs = Date.now() - 7 * 24 * 60 * 60 * 1000;

  let records = [];
  let readFailed = false;
  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const { blobs } = await store.list();
    // Keys start with the ISO time, so skip older entries without fetching them.
    const sinceIso = new Date(sinceTs).toISOString();
    const recent = blobs.filter((b) => b.key >= sinceIso);
    const entries = await Promise.all(
      recent.map((b) => store.get(b.key, { type: "json" }).catch(() => null))
    );
    records = entries.filter(Boolean).filter((r) => new Date(r.createdTime).getTime() >= sinceTs);
  } catch (err) {
    console.error("weekly-stats: could not read stats", err);
    readFailed = true;
  }

  const count = (key, filter = () => true) => {
    const out = {};
    for (const r of records) if (filter(r) && r[key]) out[r[key]] = (out[r[key]] || 0) + 1;
    return Object.entries(out).sort((a, b) => b[1] - a[1]);
  };
  const isVisit = (r) => r.Type === "Site Visit";

  const visits = records.filter(isVisit).length;
  const byType = count("Type", (r) => !isVisit(r));
  const topPages = count("Page", isVisit).slice(0, 8);
  const topSources = count("From", isVisit).slice(0, 8);
  const topGalleries = count("Gallery").slice(0, 8);
  const topItems = count("Item", (r) => r.Type !== "Saved to Pinterest").slice(0, 8);
  const byRegion = count("Region");
  const postcodes = records.map((r) => r.Postcode).filter(Boolean);

  const subject = readFailed
    ? "Weekly stats — could not read this week's figures"
    : `Weekly stats — ${visits} visit${visits === 1 ? "" : "s"}, ${records.length - visits} other event${records.length - visits === 1 ? "" : "s"}`;
  const html = buildEmail({ readFailed, visits, byType, topPages, topSources, topGalleries, topItems, byRegion, postcodes });

  // Up to 4 tries, waiting 3s, 6s then 9s between them.
  let lastError = "";
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromEmail, to: toList, subject, html }),
      });
      if (res.ok) return new Response("sent");
      lastError = `HTTP ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`;
      if (res.status < 500 && res.status !== 429) break; // a real rejection won't fix itself
    } catch (err) {
      lastError = String(err?.cause || err);
    }
    if (attempt < 4) await new Promise((r) => setTimeout(r, attempt * 3000));
  }
  console.error("weekly-stats: email not sent —", lastError);
  return new Response("send failed", { status: 500 });
}

function buildEmail({ readFailed, visits, byType, topPages, topSources, topGalleries, topItems, byRegion, postcodes }) {
  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const row = (label, value) =>
    `<tr><td style="padding:6px 0;color:rgba(237,232,223,0.7);font-family:Helvetica,sans-serif;font-size:14px;">${esc(label)}</td><td style="padding:6px 0;text-align:right;color:#ede8df;font-family:Helvetica,sans-serif;font-size:14px;font-weight:600;">${esc(value)}</td></tr>`;
  const rows = (list) => (list.length ? list.map(([k, v]) => row(k, v)).join("") : row("None this week", "—"));
  const section = (title, body) =>
    `<p style="margin:0 0 8px;font-size:11px;color:rgba(237,232,223,0.45);letter-spacing:0.12em;text-transform:uppercase;">${title}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${body}</table>`;
  const postcodeList = postcodes.length ? esc(postcodes.join(", ")) : "None entered this week";

  const content = readFailed
    ? `<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ede8df;">This week's figures could not be read</h1>
          <p style="margin:0 0 24px;font-size:14px;color:rgba(237,232,223,0.75);line-height:1.6;">The email went out, but the stats storage didn't answer. The stats page may still show them.</p>`
    : `<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ede8df;">${visits} site visit${visits === 1 ? "" : "s"} this week</h1>
          ${section("Pages people landed on", rows(topPages))}
          ${section("Where visitors came from", rows(topSources.length ? topSources : [["Direct / not known", visits || "—"]]))}
          ${section("Activity", rows(byType))}
          ${section("Galleries opened", rows(topGalleries))}
          ${section("Designs viewed / quoted", rows(topItems))}
          ${section("WA vs interstate", rows(byRegion))}
          <p style="margin:0 0 8px;font-size:11px;color:rgba(237,232,223,0.45);letter-spacing:0.12em;text-transform:uppercase;">Postcodes entered</p>
          <p style="margin:0 0 24px;font-size:13px;color:rgba(237,232,223,0.75);line-height:1.6;">${postcodeList}</p>`;

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
          <p style="margin:0 0 8px;font-size:10px;color:#c45018;letter-spacing:0.28em;text-transform:uppercase;">Weekly Stats</p>
          ${content}
          <a href="https://rogetjames.com/stats" style="display:inline-block;background:#c45018;color:#ede8df;text-decoration:none;padding:13px 30px;border-radius:50px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Full Stats Page</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const config = { schedule: "0 22 * * 0" };
