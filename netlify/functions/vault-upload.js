// Admin-only. Lets /media upload images straight into a client's Vault:
//   • "list-clients" → returns the Airtable clients (id, name, email) for the picker
//   • "add-images"   → commits the photos into the repo, then appends them to that
//                       client's Airtable "Images" attachment field (so the vault,
//                       which reads Airtable, shows them). Auth: VAULT_ADMIN_SECRET.
import crypto from "node:crypto";

const OWNER = "rogetjames-creator";
const REPO = "rogetjames-website";
const BRANCH = "main";
const MAX_BYTES = 8 * 1024 * 1024;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Clients";

function json(data, status = 200) {
  return { statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
}
function safeEqual(a, b) {
  const A = Buffer.from(String(a || "")); const B = Buffer.from(String(b || ""));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
function extFor(ct) { return ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : ct.includes("gif") ? "gif" : "jpg"; }

async function gh(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "rogetjames-vault-uploader",
      Accept: "application/vnd.github+json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  return res.json();
}

// Commit a set of files as one commit (no manifest — vault images aren't in it).
async function commitFiles(addFiles, message) {
  const ref = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
  const baseSha = ref.object.sha;
  const baseCommit = await gh(`/repos/${OWNER}/${REPO}/git/commits/${baseSha}`);
  const tree = [];
  for (const f of addFiles) {
    const blob = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, { method: "POST", body: JSON.stringify({ content: f.base64, encoding: "base64" }) });
    tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  const newTree = await gh(`/repos/${OWNER}/${REPO}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }) });
  const newCommit = await gh(`/repos/${OWNER}/${REPO}/git/commits`, { method: "POST", body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }) });
  await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, { method: "PATCH", body: JSON.stringify({ sha: newCommit.sha }) });
}

const AT_BASE = () => `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
const atHeaders = () => ({ Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`, "Content-Type": "application/json" });

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!safeEqual((JSON.parse(event.body || "{}").adminSecret), process.env.VAULT_ADMIN_SECRET)) return json({ error: "Unauthorized" }, 401);
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) return json({ error: "Airtable not configured on the server." }, 500);

  const body = JSON.parse(event.body || "{}");
  const action = body.action || "add-images";

  try {
    if (action === "list-clients") {
      const clients = [];
      let offset;
      do {
        // No fields[] restriction — asking for a field name that isn't an exact
        // match makes Airtable reject the whole request (empty list). Read all.
        const url = `${AT_BASE()}?pageSize=100${offset ? `&offset=${offset}` : ""}`;
        const r = await fetch(url, { headers: atHeaders() });
        const d = await r.json();
        if (!r.ok) return json({ error: `Airtable: ${d?.error?.message || d?.error?.type || r.status}` }, 502);
        (d.records || []).forEach((rec) => {
          const f = rec.fields || {};
          clients.push({ id: rec.id, name: f.Name || f.name || f["Project Title"] || f.Email || "(unnamed)", email: f.Email || f.email || "", project: f["Project Title"] || "" });
        });
        offset = d.offset;
      } while (offset);
      clients.sort((a, b) => a.name.localeCompare(b.name));
      return json({ clients });
    }

    if (action === "create-client") {
      const name = (body.name || "").trim();
      const email = (body.email || "").trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a name and a valid email." }, 400);
      const token = crypto.randomUUID();
      const res = await fetch(AT_BASE(), { method: "POST", headers: atHeaders(), body: JSON.stringify({ fields: { Name: name, Email: email, Token: token } }) });
      const d = await res.json();
      if (!res.ok) return json({ error: d?.error?.message || "Couldn't create the client." }, 502);
      return json({ ok: true, id: d.id, name, email, token, vaultUrl: `https://rogetjames.com/vault?token=${token}` });
    }

    if (action === "add-images") {
      const { clientId, images } = body;
      if (!clientId || !Array.isArray(images) || !images.length) return json({ error: "Pick a client and at least one photo." }, 400);
      if (!process.env.GITHUB_TOKEN) return json({ error: "Upload storage not configured — GITHUB_TOKEN missing." }, 500);

      // Commit the photos into the repo.
      const addFiles = [];
      const rawUrls = [];
      for (const img of images) {
        const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(img?.dataUrl || "");
        if (!m) continue;
        if (Buffer.from(m[2], "base64").length > MAX_BYTES) continue;
        const id = `${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
        const rel = `public/images/vault/${clientId}/${id}.${extFor(m[1])}`;
        addFiles.push({ path: rel, base64: m[2] });
        rawUrls.push(`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${rel}`);
      }
      if (!addFiles.length) return json({ error: "No valid images." }, 400);
      await commitFiles(addFiles, `Vault images for client ${clientId} (${addFiles.length})`);

      // Append to the client's Airtable Images (keep existing by id, add new by url).
      const recRes = await fetch(`${AT_BASE()}/${clientId}`, { headers: atHeaders() });
      const rec = await recRes.json();
      if (!recRes.ok) return json({ error: rec?.error?.message || "Client not found in Airtable." }, 404);
      const existing = Array.isArray(rec.fields?.Images) ? rec.fields.Images.map((a) => ({ id: a.id })) : [];
      const patch = await fetch(`${AT_BASE()}/${clientId}`, {
        method: "PATCH", headers: atHeaders(),
        body: JSON.stringify({ fields: { Images: [...existing, ...rawUrls.map((url) => ({ url }))] } }),
      });
      const patchData = await patch.json();
      if (!patch.ok) return json({ error: patchData?.error?.message || "Airtable update failed." }, 502);
      return json({ ok: true, added: rawUrls.length });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e?.message || "Vault upload failed." }, 500);
  }
};
