// Client-facing. Unlocks a vault with email + password (no Airtable).
// Clients live in the private "vault-clients" Netlify Blobs store, written by the
// admin at /media. A matching email + password returns that client's gallery.
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE = "vault-clients";
const emailKey = (e) => String(e || "").trim().toLowerCase();

function safeEqual(a, b) {
  const A = Buffer.from(String(a || "")); const B = Buffer.from(String(b || ""));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid request." }, 400); }

  const email = emailKey(body.email);
  const password = String(body.password || "");
  if (!email || !password) return json({ error: "Enter your email and password." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email." }, 400);

  let record;
  try {
    const store = getStore({ name: STORE, consistency: "strong" });
    record = await store.get(email, { type: "json" });
  } catch {
    return json({ error: "Could not reach the vault. Try again shortly." }, 502);
  }

  if (!record || !safeEqual(password, record.password)) {
    return json({ error: "Email or password not recognised. Please check and try again." }, 401);
  }

  return json({
    clientName: record.name || "",
    email,
    projectTitle: record.projectTitle || "",
    projectDescription: record.spiel || record.projectDescription || "",
    location: record.location || "",
    status: record.status || null,
    greeting: record.greeting || null,
    images: (record.images || []).map((i) => ({ url: i.src, name: i.name || "" })),
    pdfs: [],
    keyPoints: [],
    links: (record.links || []).filter((l) => l && l.label && l.url).map((l) => ({ label: l.label, url: l.url, description: l.description || null })),
  }, 200);
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/vault-verify" };
