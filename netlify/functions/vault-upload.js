// Admin-only. Runs the client Vault as a simple gallery — no Airtable.
// A client is just: name + email + password + their images. Everything lives in
// the private "vault-clients" Netlify Blobs store (server-side only, never served
// to the public); the photos themselves are committed into the repo like every
// other gallery image. Actions (all gated by VAULT_ADMIN_SECRET):
//   • "list-clients"  → clients for the picker (email, name, image count)
//   • "create-client" → add a client (name, email, password) → returns vault link
//   • "add-images"    → commit photos into the repo + attach them to the client
//   • "delete-image"  → remove one image from a client
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

const OWNER = "rogetjames-creator";
const REPO = "rogetjames-website";
const BRANCH = "main";
const MAX_BYTES = 8 * 1024 * 1024;
const STORE = "vault-clients";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
function safeEqual(a, b) {
  const A = Buffer.from(String(a || "")); const B = Buffer.from(String(b || ""));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
function extFor(ct) { return ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : ct.includes("gif") ? "gif" : "jpg"; }
// Normalise an email: lowercase, trim, drop a "mailto:" prefix some browsers autofill.
const emailKey = (e) => String(e || "").trim().toLowerCase().replace(/^mailto:/, "").trim();
const slug = (e) => emailKey(e).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "client";

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

// Commit a set of files as one commit.
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

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  if (!safeEqual(body.adminSecret, process.env.VAULT_ADMIN_SECRET)) return json({ error: "Unauthorized" }, 401);

  const store = getStore({ name: STORE, consistency: "strong" });
  const action = body.action || "add-images";

  try {
    if (action === "list-clients") {
      const { blobs } = await store.list();
      const clients = [];
      for (const b of blobs) {
        const c = await store.get(b.key, { type: "json" }).catch(() => null);
        if (c) clients.push({ id: b.key, email: c.email, name: c.name || c.email, count: (c.images || []).length, cover: (c.images || [])[0]?.src || null, vaultUrl: `https://rogetjames.com/vault?e=${encodeURIComponent(c.email)}` });
      }
      clients.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      return json({ clients });
    }

    if (action === "create-client") {
      const name = (body.name || "").trim();
      const email = emailKey(body.email);
      const password = (body.password || "").trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a name and a valid email." }, 400);
      if (password.length < 4) return json({ error: "Set a password of at least 4 characters." }, 400);
      const existing = await store.get(email, { type: "json" }).catch(() => null);
      if (existing) return json({ error: "A client with that email already exists." }, 409);
      const record = { email, name, password, images: [], greeting: "", spiel: "", links: [], token: crypto.randomUUID(), createdTime: new Date().toISOString() };
      await store.setJSON(email, record);
      return json({ ok: true, id: email, name, email, vaultUrl: `https://rogetjames.com/vault?e=${encodeURIComponent(email)}` });
    }

    if (action === "get-client") {
      const email = emailKey(body.clientId || body.email);
      const record = await store.get(email, { type: "json" }).catch(() => null);
      if (!record) return json({ error: "Client not found." }, 404);
      return json({ email: record.email, name: record.name, password: record.password, images: record.images || [], greeting: record.greeting || "", spiel: record.spiel || "", links: record.links || [], vaultUrl: `https://rogetjames.com/vault?e=${encodeURIComponent(record.email)}` });
    }

    if (action === "update-client") {
      const email = emailKey(body.clientId || body.email);
      const record = await store.get(email, { type: "json" }).catch(() => null);
      if (!record) return json({ error: "Client not found." }, 404);
      if (typeof body.greeting === "string") record.greeting = body.greeting;
      if (typeof body.spiel === "string") record.spiel = body.spiel;
      if (Array.isArray(body.links)) record.links = body.links.filter((l) => l && l.label && l.url).map((l) => ({ label: String(l.label), url: String(l.url) }));
      if (typeof body.name === "string" && body.name.trim()) record.name = body.name.trim();
      await store.setJSON(email, record);
      return json({ ok: true });
    }

    if (action === "add-images") {
      const email = emailKey(body.clientId || body.email);
      const images = body.images;
      if (!email || !Array.isArray(images) || !images.length) return json({ error: "Pick a client and at least one photo." }, 400);
      if (!process.env.GITHUB_TOKEN) return json({ error: "Upload storage not configured — GITHUB_TOKEN missing." }, 500);
      const record = await store.get(email, { type: "json" }).catch(() => null);
      if (!record) return json({ error: "That client no longer exists." }, 404);

      const addFiles = [];
      const newImages = [];
      for (const img of images) {
        const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(img?.dataUrl || "");
        if (!m) continue;
        if (Buffer.from(m[2], "base64").length > MAX_BYTES) continue;
        const id = `${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
        const rel = `images/vault/${slug(email)}/${id}.${extFor(m[1])}`;
        addFiles.push({ path: `public/${rel}`, base64: m[2] });
        newImages.push({ src: `/${rel}`, name: img.name || "", createdTime: new Date().toISOString() });
      }
      if (!addFiles.length) return json({ error: "No valid images." }, 400);
      await commitFiles(addFiles, `Vault images for ${email} (${newImages.length})`);
      record.images = [...(record.images || []), ...newImages];
      await store.setJSON(email, record);
      return json({ ok: true, added: newImages.length, total: record.images.length });
    }

    if (action === "update-images") {
      const email = emailKey(body.clientId || body.email);
      const updates = Array.isArray(body.images) ? body.images : [];
      const record = await store.get(email, { type: "json" }).catch(() => null);
      if (!record) return json({ error: "Client not found." }, 404);
      const bySrc = {};
      updates.forEach((u) => { if (u && u.src) bySrc[u.src] = u; });
      record.images = (record.images || []).map((im) => bySrc[im.src] ? { ...im, name: String(bySrc[im.src].name || "") } : im);
      // Optional reorder: if a full ordered list of srcs is supplied, apply it.
      if (Array.isArray(body.order) && body.order.length) {
        const map = {}; record.images.forEach((im) => { map[im.src] = im; });
        const reordered = body.order.map((s) => map[s]).filter(Boolean);
        const rest = record.images.filter((im) => !body.order.includes(im.src));
        record.images = [...reordered, ...rest];
      }
      await store.setJSON(email, record);
      return json({ ok: true, images: record.images });
    }

    if (action === "delete-image") {
      const email = emailKey(body.clientId || body.email);
      const src = body.src;
      const record = await store.get(email, { type: "json" }).catch(() => null);
      if (!record) return json({ error: "Client not found." }, 404);
      record.images = (record.images || []).filter((i) => i.src !== src);
      await store.setJSON(email, record);
      return json({ ok: true, total: record.images.length });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e?.message || "Vault upload failed." }, 500);
  }
}

export const config = { path: "/api/vault-upload" };
