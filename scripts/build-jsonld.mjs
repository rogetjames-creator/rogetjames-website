// Runs after prerender. Rewrites the structured data (JSON-LD) of every
// indexable page in dist/ into ONE @graph that links to the same
// Organization (#org) and Person (#james-roget) from src/data/seoData.js.
//
// It keeps each page's own nodes (breadcrumbs, collections, artworks, FAQs,
// photo ImageObjects) and only:
//   - drops the old LocalBusiness / VisualArtist / WebSite copies,
//   - adds Organization + Person on every page, WebSite on / only,
//   - points creator / publisher / brand at #org or #james-roget,
//   - removes duplicate breadcrumb / collection nodes,
//   - gives wall art and sculpture artworks width / height from their sizes,
//   - marks screen design pages as Product (no offers — see seoData.js).
// Pages carrying noindex (the hidden city pages) are left exactly as they are.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, ORG, PERSON, WEBSITE, ORG_ID, PERSON_ID, SCREEN_DESIGN_TYPE, MATERIALS } from "../src/data/seoData.js";

const DIST = fileURLToPath(new URL("../dist", import.meta.url));
const LD_RE = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>\s*/gi;
const DROP = new Set(["LocalBusiness", "VisualArtist", "WebSite", "Organization", "Person"]);

// Screen use pages (/screens/privacy …) are collections, not designs.
const SCREEN_USE_PAGES = new Set(["privacy", "gates", "fencing", "dividers", "pergolas", "wall-decor"]);

function htmlFiles(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (f.endsWith(".html")) out.push(p);
  }
  return out;
}

function routeOf(file) {
  let r = "/" + relative(DIST, file).replace(/\\/g, "/");
  r = r.replace(/index\.html$/, "").replace(/\.html$/, "");
  return r.length > 1 ? r.replace(/\/$/, "") : "/";
}

const isOrg = (o) => o && typeof o === "object" && o["@type"] === "Organization" && o.name === "ROGETjames";
const isJames = (o) => o && typeof o === "object" && o["@type"] === "Person" && o.name === "James Roget";

// Point inline copies of the business / artist at the shared nodes.
// ImageObjects are left untouched — their credit and copyright are read
// by Google Images on their own.
function linkRefs(node) {
  for (const k of ["creator", "publisher", "brand", "author", "founder", "about", "provider"]) {
    if (isOrg(node[k])) node[k] = { "@id": ORG_ID };
    else if (isJames(node[k])) node[k] = { "@id": PERSON_ID };
  }
  return node;
}

// "Medium — 1190 × 1911 mm; Large — 1488 × 2390 mm" (W × H, per the catalogue)
// "1500mm — H 1500 mm"  →  height only.  "Ø 1200 mm" → width = height = 1200.
// A bare "1100 mm" says nothing about which way it is measured, so it is left out.
function dimensions(size) {
  const width = [], height = [];
  for (const part of String(size || "").split(/;\s*/)) {
    const [label, dims = label] = part.split(/\s+—\s+/);
    const qv = (v) => ({ "@type": "QuantitativeValue", value: Number(v), unitCode: "MMT", ...(label !== dims ? { name: label } : {}) });
    let m = dims.match(/^(\d+)\s*[×x]\s*(\d+)\s*mm$/i);
    if (m) { width.push(qv(m[1])); height.push(qv(m[2])); continue; }
    m = dims.match(/^H\s*(\d+)\s*mm$/i);
    if (m) { height.push(qv(m[1])); continue; }
    // Round pieces: a circle's width and height are both its diameter.
    m = dims.match(/^Ø\s*(\d+)\s*mm$/i);
    if (m) { width.push(qv(m[1])); height.push(qv(m[1])); }
  }
  const one = (a) => (a.length === 1 ? a[0] : a);
  return { ...(width.length ? { width: one(width) } : {}), ...(height.length ? { height: one(height) } : {}) };
}

function materialsIn(images) {
  const text = (Array.isArray(images) ? images : [images]).map((i) => `${i?.caption || ""} ${i?.name || ""}`).join(" ").toLowerCase();
  return MATERIALS.filter((m) => text.includes(m.toLowerCase()));
}

function score(n) { return Object.keys(n).length + (n["@id"] ? 100 : 0); }

let changed = 0, skipped = 0;
const noCrumbs = [];

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, "utf8");
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) { skipped++; continue; }
  if (!/<link[^>]+rel="canonical"/i.test(html)) continue; // not a real page (fragments, tools)
  const route = routeOf(file);
  const url = route === "/" ? `${SITE}/` : `${SITE}${route}`;

  const nodes = [];
  for (const [, body] of html.matchAll(LD_RE)) {
    try {
      const d = JSON.parse(body);
      for (const n of Array.isArray(d) ? d : d["@graph"] || [d]) nodes.push(n);
    } catch {
      console.error(`  build-jsonld: unreadable JSON-LD left out on ${route}`);
    }
  }
  if (!nodes.length && !/\/(screens|wall-art|sculpture|bespoke-sculpture|perth|melbourne)\b|^\/$/.test(route)) continue;

  // Keep the page's own nodes, best copy of each breadcrumb / collection.
  const kept = [];
  const best = {};
  for (const n of nodes) {
    delete n["@context"];
    if (DROP.has(n["@type"])) continue;
    if (n["@type"] === "BreadcrumbList" || n["@type"] === "CollectionPage") {
      if (!best[n["@type"]] || score(n) > score(best[n["@type"]])) best[n["@type"]] = n;
      continue;
    }
    kept.push(n);
  }
  if (best.CollectionPage) {
    best.CollectionPage["@id"] = best.CollectionPage["@id"] || url;
    kept.unshift(best.CollectionPage);
  }
  if (best.BreadcrumbList) {
    best.BreadcrumbList["@id"] = `${url}#breadcrumb`;
    kept.unshift(best.BreadcrumbList);
  } else if (route !== "/" && !/^\/(perth|melbourne)$/.test(route)) {
    noCrumbs.push(route);
  }

  const seg = route.split("/").filter(Boolean);
  for (const n of kept) {
    linkRefs(n);
    if (n["@type"] === "FAQPage") n["@id"] = n["@id"] || `${url}#faq`;
    if (n["@type"] === "VisualArtwork") {
      const isScreenDesign = seg[0] === "screens" && seg.length === 2 && !SCREEN_USE_PAGES.has(seg[1]);
      if (isScreenDesign && SCREEN_DESIGN_TYPE === "Product") {
        // Product, no offers: prices are never shown openly, so no rich
        // result — by design (James, 27 Nov 2026).
        const mats = materialsIn(n.image);
        n["@type"] = "Product";
        n["@id"] = `${url}#product`;
        n.brand = { "@id": ORG_ID };
        n.manufacturer = { "@id": ORG_ID };
        if (mats.length) n.material = mats.join(", ");
        delete n.creator; delete n.artform; delete n.artMedium; delete n.publisher;
      } else {
        n["@id"] = `${url}#artwork`;
        n.creator = { "@id": PERSON_ID };
        n.publisher = { "@id": ORG_ID };
        if (seg[0] === "wall-art") n.artform = "Wall art";
        if (seg[0] === "sculpture") n.artform = "Sculpture";
        Object.assign(n, dimensions(n.size));
      }
    }
  }

  const graph = [ORG, PERSON, ...(route === "/" ? [WEBSITE] : []), ...kept];
  const block = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>\n`;
  let out = html.replace(LD_RE, "");
  out = out.replace(/<\/head>/i, `${block}</head>`);
  writeFileSync(file, out);
  changed++;
}

console.log(`build-jsonld: one linked @graph written into ${changed} pages (${skipped} noindex pages left alone).`);
if (noCrumbs.length) console.log(`build-jsonld: no breadcrumb on ${noCrumbs.length}: ${noCrumbs.join(", ")}`);
