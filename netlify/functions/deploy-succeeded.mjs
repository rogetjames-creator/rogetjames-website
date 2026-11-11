// Tells Bing (and every other IndexNow search engine) which pages changed,
// each time a new version of the site goes live.
//
// WHY THIS EXISTS: without it Bing finds changes on its own schedule — days or
// weeks. IndexNow is Bing's "this page changed, come and look" signal; Bing
// shares it with Yandex, Seznam, Naver and the others that use IndexNow, and
// Bing's index is what ChatGPT search and Copilot draw on.
//
// HOW: Netlify runs this file automatically after every successful deploy (the
// file name is what makes that happen). It reads the live sitemap, fetches each
// page, and compares a fingerprint of the page's words and images with the one
// saved last time. Only pages that actually changed are sent — IndexNow asks
// that unchanged pages are not resubmitted. The very first run sends them all.
//
// The key file public/<KEY>.txt proves to Bing that this site sent the list.

import { getStore } from "@netlify/blobs";
import { createHash } from "crypto";

const SITE = "https://rogetjames.com";
const HOST = "rogetjames.com";
const KEY = "325b8c86e344d7ea044aa53f7469a67e";

// Strip everything that changes on every build without the page changing:
// scripts, inlined CSS, stylesheet links and hashed /assets/ file names.
function fingerprint(html) {
  const words = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/\/assets\/[^"'\s)]+/g, "")
    .replace(/\s+/g, " ");
  return createHash("sha1").update(words).digest("hex");
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "rogetjames-indexnow" } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

// Fetch in small groups so the site isn't hit with 100+ requests at once.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const n = i++;
        out[n] = await fn(items[n]);
      }
    })
  );
  return out;
}

export default async function handler(req) {
  let context = "production";
  try {
    const body = await req.json();
    context = body?.payload?.context || context;
  } catch { /* no body — treat as production */ }
  if (context !== "production") return new Response("skipped: not production");

  const sitemap = await fetchText(`${SITE}/sitemap.xml`);
  if (!sitemap) return new Response("sitemap unreachable", { status: 502 });
  const urls = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(SITE) && !/\.(jpe?g|png|webp|gif|svg)$/i.test(u));

  const store = getStore({ name: "indexnow", consistency: "strong" });
  const previous = (await store.get("fingerprints", { type: "json" })) || {};

  const prints = await mapLimit(urls, 10, async (u) => {
    const html = await fetchText(u);
    return html ? fingerprint(html) : null;
  });

  const next = { ...previous };
  const changed = [];
  urls.forEach((u, n) => {
    if (!prints[n]) return; // couldn't fetch — leave it for next time
    if (previous[u] !== prints[n]) changed.push(u);
    next[u] = prints[n];
  });

  let result = "nothing changed";
  if (changed.length) {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: changed }),
    });
    result = `IndexNow HTTP ${res.status}`;
    // Only remember the new fingerprints if the search engines accepted them,
    // so a failed send is retried on the next deploy.
    if (res.status !== 200 && res.status !== 202) {
      await store.setJSON("last-run", { at: new Date().toISOString(), checked: urls.length, changed, result });
      console.log(`[indexnow] ${result} — not saved, will retry next deploy`);
      return new Response(result, { status: 502 });
    }
  }

  await store.setJSON("fingerprints", next);
  await store.setJSON("last-run", { at: new Date().toISOString(), checked: urls.length, changed, result });
  console.log(`[indexnow] checked ${urls.length}, sent ${changed.length}: ${result}`);
  return new Response(`checked ${urls.length}, sent ${changed.length}: ${result}`);
}
