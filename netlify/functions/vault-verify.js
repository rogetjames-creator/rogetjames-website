// Airtable table name — change via AIRTABLE_TABLE_NAME env var if needed
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Clients";

/*
  Expected Airtable fields:
    Name               — single line text
    Email              — email
    Token              — single line text (auto-generated, do not edit)
    Project Title      — single line text
    Project Description— long text
    Location           — single line text (e.g. "Perth, WA")
    Status             — single select: Design / In Progress / Review / Complete / Delivered
    Greeting           — single line text (optional opening message)
    Images             — attachments (project images, used for hero + gallery)
    Key Points         — long text, one point per line
    Links              — long text, one link per line, format: "Label|https://url" or "Label|https://url|Description"
    PDFs               — attachments
    Invite Sent        — checkbox (auto-set when invite is sent)
*/

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) return json({ error: "Server configuration missing." }, 500);

  let body;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid request." }, 400); }

  const { token, email } = body;
  if (!token || !email) return json({ error: "Missing token or email." }, 400);

  const formula = encodeURIComponent(`AND({Token}="${token}",LOWER({Email})="${email.toLowerCase()}")`);
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE_NAME)}?filterByFormula=${formula}`;

  let res, data;
  try {
    res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    data = await res.json();
  } catch {
    return json({ error: "Could not reach database." }, 502);
  }

  if (!res.ok || !data.records?.length) {
    return json({ error: "Email not recognised for this link. Please check and try again." }, 404);
  }

  const f = data.records[0].fields;

  return json({
    clientName:         f["Name"] || "",
    projectTitle:       f["Project Title"] || "",
    projectDescription: f["Project Description"] || "",
    location:           f["Location"] || "",
    status:             f["Status"] || null,
    greeting:           f["Greeting"] || null,
    images:             parseAttachments(f["Images"]),
    pdfs:               parseAttachments(f["PDFs"]),
    keyPoints:          parseLines(f["Key Points"]),
    links:              parseLinks(f["Links"]),
  }, 200);
}

function parseAttachments(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field.map(f => ({ url: f.url || f, name: f.filename || "" }));
  if (typeof field === "string") {
    return field.split(",").map(s => s.trim()).filter(Boolean).map(u => ({ url: u, name: "" }));
  }
  return [];
}

// One point per line
function parseLines(field) {
  if (!field || typeof field !== "string") return [];
  return field.split("\n").map(s => s.trim()).filter(Boolean);
}

// Format: "Label|https://url" or "Label|https://url|Description"
function parseLinks(field) {
  if (!field || typeof field !== "string") return [];
  return field.split("\n")
    .map(s => {
      const parts = s.split("|").map(p => p.trim());
      const [label, url, description] = parts;
      return label && url ? { label, url, description: description || null } : null;
    })
    .filter(Boolean);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = { path: "/api/vault-verify" };
