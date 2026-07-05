// Admin-only media upload. New photos are committed as real files straight
// into the GitHub repo (public/images/uploads/) plus a manifest
// (public/media-manifest.json) — so they're backed up in git and served as
// fast static assets like every other image on the site, instead of being
// read one-by-one from a database on every page view.
//
// Requires a GITHUB_TOKEN env var (a GitHub personal access token with
// "repo" scope) set in Netlify. Older photos already sitting in Netlify
// Blobs (from before this change) are still listed/deletable here so
// nothing already uploaded is lost.
import { getStore } from "@netlify/blobs";

const OWNER = "rogetjames-creator";
const REPO = "rogetjames-website";
const BRANCH = "main";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per image

const OLD_STORE = "media-library";

const isValidKey = (k) => typeof k === "string" && /^[a-z0-9-]{2,40}$/.test(k);

// Old picker keys → real catalogue category ids (what the gallery matches on).
const KEY_MAP = {
  "banksia": "australian-natives",
  "plumes-deco": "plume",
  "branches-gren": "branches",
  "creeping-fig-autumn": "creeping-fig",
};

function destinationsFromOldMeta(meta) {
  let dests = [];
  try { dests = JSON.parse(meta?.metadata?.destinations || "[]"); } catch { dests = []; }
  if (Array.isArray(dests) && dests.length) return [...new Set(dests.map((d) => KEY_MAP[d] || d))];
  const l = (meta?.metadata?.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!l) return [];
  const out = [];
  if (l.includes("upclose")) out.push("up-close");
  if (l.includes("banksia") || l.includes("wandoo") || l.includes("wattle")) out.push("australian-natives");
  if (l.includes("gren") || l.includes("branches")) out.push("branches");
  if (l.includes("autumn") || l.includes("creepingfig")) out.push("creeping-fig");
  if (l.includes("plume") || l.includes("feather") || l.includes("flock")) out.push("plume");
  return [...new Set(out)];
}

function extFor(contentType) {
  const map = { "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
  return map[contentType] || "jpg";
}

async function gh(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "rogetjames-media-uploader",
      Accept: "application/vnd.github+json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API ${path} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function getManifest() {
  try {
    const file = await gh(`/repos/${OWNER}/${REPO}/contents/public/media-manifest.json?ref=${BRANCH}`);
    const parsed = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Commits any number of new files, removed files, and the updated manifest as
// ONE git commit — so a whole batch triggers exactly one Netlify rebuild.
async function commitBatch({ addFiles = [], removePaths = [], manifest, message }) {
  const ref = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
  const baseSha = ref.object.sha;
  const baseCommit = await gh(`/repos/${OWNER}/${REPO}/git/commits/${baseSha}`);
  const baseTreeSha = baseCommit.tree.sha;

  const tree = [];
  for (const f of addFiles) {
    const blob = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: f.base64, encoding: "base64" }),
    });
    tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  for (const p of removePaths) {
    tree.push({ path: p, mode: "100644", type: "blob", sha: null });
  }
  const manifestBlob = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content: Buffer.from(JSON.stringify(manifest, null, 2), "utf8").toString("base64"), encoding: "base64" }),
  });
  tree.push({ path: "public/media-manifest.json", mode: "100644", type: "blob", sha: manifestBlob.sha });

  const newTree = await gh(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  const newCommit = await gh(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }),
  });
  await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha }),
  });
}

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const adminPass = process.env.VAULT_ADMIN_SECRET;
  if (!adminPass) return json({ error: "Server not configured" }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  if (!safeEqual(body.adminSecret, adminPass)) return json({ error: "Unauthorized" }, 401);

  const oldStore = getStore({ name: OLD_STORE, consistency: "strong" });

  // List — merges git-committed uploads (new, fast) with anything still in
  // the older database store (from before this change), so nothing vanishes.
  if (body.action === "list") {
    const manifest = await getManifest().catch(() => []);
    const gitItems = manifest.map((e) => ({
      id: `git_${e.id}`,
      name: e.name || "",
      destinations: Array.isArray(e.destinations) ? e.destinations.map((d) => KEY_MAP[d] || d) : [],
      note: e.note || "",
      createdTime: e.createdTime || "",
      src: `/${e.path}`,
    }));

    let oldItems = [];
    try {
      const { blobs } = await oldStore.list();
      oldItems = await Promise.all(
        blobs.map(async (b) => {
          const meta = await oldStore.getMetadata(b.key).catch(() => null);
          return {
            id: b.key,
            name: meta?.metadata?.name || "",
            destinations: destinationsFromOldMeta(meta),
            note: meta?.metadata?.note || "",
            createdTime: meta?.metadata?.createdTime || "",
            src: `/api/media-img?id=${encodeURIComponent(b.key)}`,
          };
        })
      );
    } catch { /* old store optional */ }

    const all = [...gitItems, ...oldItems].sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
    return json({ images: all });
  }

  // Delete — routes to git or the old store depending on the id prefix.
  if (body.action === "delete" && body.id) {
    if (body.id.startsWith("git_")) {
      const realId = body.id.slice(4);
      try {
        const manifest = await getManifest();
        const entry = manifest.find((e) => e.id === realId);
        const updated = manifest.filter((e) => e.id !== realId);
        await commitBatch({ removePaths: entry ? [`public/${entry.path}`] : [], manifest: updated, message: `Remove uploaded image ${realId}` });
        return json({ ok: true });
      } catch (e) {
        return json({ error: "Delete failed: " + e.message }, 500);
      }
    }
    await oldStore.delete(body.id).catch(() => {});
    return json({ ok: true });
  }

  // Upload — new photos are committed straight to git.
  const images = Array.isArray(body.images) ? body.images : [];
  if (!images.length) return json({ error: "No images provided" }, 400);
  const destinations = (Array.isArray(body.destinations) ? body.destinations : [])
    .filter(isValidKey)
    .map((d) => KEY_MAP[d] || d);
  if (!destinations.length) return json({ error: "No valid destination selected" }, 400);
  const noteRaw = (body.note || "").toString().slice(0, 200);

  if (!process.env.GITHUB_TOKEN) {
    return json({ error: "Upload storage not configured yet — GITHUB_TOKEN is missing on the server." }, 500);
  }

  try {
    const manifest = await getManifest();
    const addFiles = [];
    const newEntries = [];
    for (const img of images) {
      const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(img?.dataUrl || "");
      if (!m) continue;
      const contentType = m[1];
      const base64 = m[2];
      const buf = Buffer.from(base64, "base64");
      if (buf.length > MAX_BYTES) continue;
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const ext = extFor(contentType);
      const relPath = `images/uploads/${id}.${ext}`;
      addFiles.push({ path: `public/${relPath}`, base64 });
      newEntries.push({ id, name: img.name || "", destinations, note: noteRaw, createdTime: new Date().toISOString(), path: relPath });
    }
    if (!addFiles.length) return json({ error: "No valid images to upload" }, 400);

    await commitBatch({
      addFiles,
      manifest: [...manifest, ...newEntries],
      message: `Add ${addFiles.length} uploaded image(s) — ${destinations.join(", ")}`,
    });
    return json({ ok: true, saved: addFiles.length });
  } catch (e) {
    return json({ error: "Upload failed: " + e.message }, 500);
  }
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/media-upload" };
# deploy trigger 2026-07-05T03:51:58Z
