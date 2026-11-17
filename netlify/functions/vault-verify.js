// Client-facing. Unlocks a vault with email + password (no Airtable).
// Clients live in the private "vault-clients" Netlify Blobs store, written by the
// admin at /media. A matching email + password returns that client's gallery.
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { alertFrom, alertTo } from "../lib/alert-email.js";

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
  // James (admin) opens any client's vault with his saved admin key — no client password.
  const isAdmin = !!process.env.VAULT_ADMIN_SECRET && safeEqual(body.adminSecret, process.env.VAULT_ADMIN_SECRET);
  if (!email || (!password && !isAdmin)) return json({ error: "Enter your email and password." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email." }, 400);

  let record;
  try {
    const store = getStore({ name: STORE, consistency: "strong" });
    record = await store.get(email, { type: "json" });
  } catch {
    return json({ error: "Could not reach the vault. Try again shortly." }, 502);
  }

  if (!record || (!isAdmin && !safeEqual(password, record.password))) {
    return json({ error: "Email or password not recognised. Please check and try again." }, 401);
  }

  // A client (not James's admin key) just opened their vault: note it and email James.
  if (!isAdmin) await noteOpen(email, record.name).catch(() => {});

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

// Visits live in their own "vault-opens" store, keyed by client email:
// { first, last, count }. James gets one email per visit — reloads within
// 30 minutes count as the same visit and don't send another.
const OPENS = "vault-opens";
const SAME_VISIT_MS = 30 * 60 * 1000;

async function noteOpen(email, name) {
  const store = getStore({ name: OPENS, consistency: "strong" });
  const prev = (await store.get(email, { type: "json" }).catch(() => null)) || {};
  const now = new Date();
  const newVisit = !prev.last || now - new Date(prev.last) > SAME_VISIT_MS;
  await store.setJSON(email, {
    first: prev.first || now.toISOString(),
    last: now.toISOString(),
    count: (prev.count || 0) + (newVisit ? 1 : 0),
  });
  if (newVisit && process.env.RESEND_API_KEY) {
    const when = now.toLocaleString("en-AU", { timeZone: "Australia/Perth", dateStyle: "medium", timeStyle: "short" });
    const who = name || email;
    const times = (prev.count || 0) + 1;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: alertFrom(),
        to: alertTo(),
        subject: `Vault opened — ${who}`,
        text: `${who} has just opened their vault.\n\nTime: ${when} (Perth)\nVisit: ${times === 1 ? "first time" : `${times} times so far`}`,
      }),
    });
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export const config = { path: "/api/vault-verify" };
