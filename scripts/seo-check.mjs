// SEO guard (James's SEO brief, Phase 3, 27 Nov 2026).
// Runs on the built pages in dist/ after prerender and the sitemap, as the
// last step of `npm run build`, so Netlify refuses to publish a build that
// brings a basic search fault back. Run it alone with `npm run seo:check`.
//
// Every page in the sitemap is checked. FAIL stops the deploy; WARN only reports.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";
// Hidden city pages: never in the sitemap, always noindex (James).
const HIDDEN_CITIES = ["/brisbane", "/sydney", "/adelaide"];
// ?open= targets that now have a page of their own.
const OPEN_HAS_PAGE = { screens: "/screens", sculpture: "/bespoke-sculpture" };

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const text = (h) => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function fileFor(route) {
  const r = route.replace(/\/$/, "") || "/";
  const tries = r === "/" ? ["index.html"] : [`${r.slice(1)}.html`, `${r.slice(1)}/index.html`];
  for (const t of tries) if (existsSync(join(DIST, t))) return join(DIST, t);
  return null;
}

// Addresses Netlify answers with a redirect count as existing.
const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
const redirectFrom = new Set([...toml.matchAll(/from\s*=\s*"([^"]+)"/g)].map((m) => m[1].replace(/\/$/, "")));
const routeExists = (r) => {
  const p = r.replace(/\/$/, "") || "/";
  return !!fileFor(p) || redirectFrom.has(p) || redirectFrom.has(`${p}/*`);
};

const sitemap = readFileSync(join(DIST, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/");

const fails = [], warns = [], rows = [];
const titles = new Map(), descs = new Map();
const add = (list, route, msg) => list.push({ route, msg });

for (const c of HIDDEN_CITIES) {
  if (routes.includes(c)) add(fails, c, "hidden city page is in the sitemap");
  const f = fileFor(c);
  if (f && !/<meta[^>]+name="robots"[^>]+noindex/i.test(readFileSync(f, "utf8"))) add(fails, c, "hidden city page is missing noindex");
}

for (const route of routes) {
  const f = fileFor(route);
  const F = [], W = [];
  if (!f) { add(fails, route, "in the sitemap but no page exists"); rows.push([route, 1, 0, "no page"]); continue; }
  const html = readFileSync(f, "utf8");
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [, ""])[1];

  const ts = [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => text(m[1]));
  if (ts.length !== 1) F.push(ts.length ? `${ts.length} <title> tags` : "no <title>");
  else {
    if (ts[0].length > 60) W.push(`title ${ts[0].length} characters`);
    titles.set(ts[0], [...(titles.get(ts[0]) || []), route]);
  }

  const d = head.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || head.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i);
  if (!d || !d[1].trim()) F.push("no meta description");
  else {
    const dv = decode(d[1]).trim();
    if (dv.length > 160) W.push(`description ${dv.length} characters`);
    descs.set(dv, [...(descs.get(dv) || []), route]);
  }

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
  if (h1s.length !== 1) F.push(`${h1s.length} <h1> tags`);
  else if (!h1s[0]) F.push("empty <h1> (no readable words)");

  const can = head.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  const self = route === "/" ? `${SITE}/` : `${SITE}${route}`;
  if (!can) F.push("no canonical");
  else if (!/^https:\/\//.test(can[1])) F.push(`canonical not absolute: ${can[1]}`);
  else if (can[1].replace(/\/$/, "") !== self.replace(/\/$/, "")) F.push(`canonical points elsewhere: ${can[1]}`);

  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(head)) F.push("noindex on a sitemap page");

  const lds = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!lds.length) F.push("no structured data (JSON-LD)");
  for (const [, b] of lds) { try { JSON.parse(b); } catch { F.push("structured data does not parse"); } }

  if (!/<meta[^>]+property="og:image"/i.test(head)) W.push("no og:image");

  // Body: links, images, words.
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, ""])[1]
    .replace(/<(script|style|noscript|template)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  for (const [, href] of body.matchAll(/<a[^>]+href="([^"]+)"/gi)) {
    let h = decode(href);
    if (h.startsWith(SITE)) h = h.slice(SITE.length) || "/";
    if (!h.startsWith("/") || h.startsWith("//")) continue;
    const open = h.match(/[?&]open=([a-z-]+)/);
    if (open && OPEN_HAS_PAGE[open[1]]) { F.push(`link ?open=${open[1]} — use ${OPEN_HAS_PAGE[open[1]]}`); continue; }
    const path = h.split(/[?#]/)[0];
    if (!path || /\.[a-z0-9]{2,5}$/i.test(path) || path.startsWith("/api/") || path.startsWith("/.netlify/") || path.startsWith("/img/")) continue;
    if (!routeExists(path)) F.push(`link to a page that does not exist: ${path}`);
  }
  for (const [tag] of body.matchAll(/<img\b[^>]*>/gi)) if (!/\balt\s*=/.test(tag)) { F.push("<img> without alt"); break; }

  const main = body.replace(/<(nav|footer|header|figcaption)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const words = text(main).split(" ").filter((w) => /[a-z]/i.test(w)).length;
  if (words < 150) W.push(`${words} words of body text`);
  if (words > 300 && !/<h2[\s>]/i.test(body)) W.push("no <h2> on a long page");

  for (const m of new Set(F)) add(fails, route, m);
  for (const m of new Set(W)) add(warns, route, m);
  rows.push([route, new Set(F).size, new Set(W).size, words]);
}

for (const [t, rs] of titles) if (rs.length > 1) for (const r of rs) add(fails, r, `duplicate title "${t}" (also ${rs.filter((x) => x !== r).join(", ")})`);
for (const [, rs] of descs) if (rs.length > 1) for (const r of rs) add(fails, r, `duplicate description (also ${rs.filter((x) => x !== r).join(", ")})`);

// Report — one row per page, then every problem.
const pad = (s, n) => String(s).padEnd(n);
const failBy = (r) => fails.filter((f) => f.route === r).length;
console.log("\n  SEO CHECK — " + routes.length + " pages in the sitemap");
console.log("  " + pad("page", 58) + pad("FAIL", 6) + pad("WARN", 6) + "words");
for (const [r, , w, words] of rows) console.log("  " + pad(r, 58) + pad(failBy(r) || "·", 6) + pad(w || "·", 6) + words);
if (warns.length) { console.log(`\n  WARN (${warns.length})`); for (const w of warns) console.log(`   ${pad(w.route, 56)} ${w.msg}`); }
if (fails.length) {
  console.log(`\n  FAIL (${fails.length})`);
  for (const f of fails) console.log(`   ${pad(f.route, 56)} ${f.msg}`);
  console.log("\n  seo-check: build stopped — fix the FAILs above.\n");
  process.exit(1);
}
console.log(`\n  seo-check: 0 FAIL, ${warns.length} WARN.\n`);
