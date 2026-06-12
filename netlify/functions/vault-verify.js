// Airtable table name — change if yours is named differently
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Clients";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    return json({ error: "Server configuration missing." }, 500);
  }

  let body;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid request." }, 400); }

  const { token, email } = body;
  if (!token || !email) return json({ error: "Missing token or email." }, 400);

  const formula = encodeURIComponent(`AND({Token}="${token}",LOWER({Email})="${email.toLowerCase()}")`);
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}?filterByFormula=${formula}`;

  let airtableRes, airtableData;
  try {
    airtableRes = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    airtableData = await airtableRes.json();
  } catch {
    return json({ error: "Could not reach database." }, 502);
  }

  if (!airtableRes.ok || !airtableData.records?.length) {
    return json({ error: "Email not recognised for this link. Please check and try again." }, 404);
  }

  const fields = airtableData.records[0].fields;

  return json({
    clientName:         fields["Name"] || "",
    projectTitle:       fields["Project Title"] || "",
    projectDescription: fields["Project Description"] || "",
    status:             fields["Status"] || null,
    location:           fields["Location"] || "",
    greeting:           fields["Greeting"] || null,
    images:             parseAttachments(fields["Images"]),
    pdfs:               parseAttachments(fields["PDFs"]),
  }, 200);
}

function parseAttachments(field) {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field.map(f => ({ url: f.url || f, name: f.filename || "" }));
  }
  if (typeof field === "string") {
    return field.split(",").map(s => s.trim()).filter(Boolean).map(u => ({ url: u, name: "" }));
  }
  return [];
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = { path: "/api/vault-verify" };
