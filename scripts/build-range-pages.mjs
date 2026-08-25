// Writes a real page for every range, so each one can be found on its own.
//
// Before this, the whole Wall Art range lived at a single address — sixty-eight
// pieces, one page, one headline. Google had nothing to tell the ranges apart
// and nobody could link to one.
//
// This runs after the site is built. For each range it writes
//   dist/wall-art/<range>.html
// carrying that range's own headline, summary, share image and listing of the
// pieces in it. Every one loads the same gallery, opened at that range — so
// nothing changes for a visitor, and Google gets fifteen pages instead of one.
//
// The range addresses are also added to the list handed to Google (sitemap.xml).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { RANGE_DATA } from "../src/data/rangeData.js";
import { SCULPTURE_DATA } from "../src/data/sculptureData.js";
import { RANGE_SEO, LIVE_RANGES } from "../src/data/rangeSeo.js";
import { rangeSlug } from "../src/utils/rangeSlug.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";

const GALLERIES = [
  { base: "/wall-art", shell: "wall-art.html", data: RANGE_DATA, parent: "Wall Art" },
  { base: "/sculpture", shell: "sculpture.html", data: SCULPTURE_DATA, parent: "Sculpture" },
];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Swap the value of one tag in the built page, leaving everything else alone.
const setMeta = (html, attr, name, value) => {
  const re = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`, "i");
  return re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html;
};

function buildPage(shellHtml, { base, parent }, range, seo, imgs) {
  const slug = rangeSlug(range.label);
  const url = `${SITE}${base}/${slug}`;
  const hero = range.designs?.[0]?.imgs?.[0];
  const image = hero != null && imgs?.[hero] ? `${SITE}${imgs[hero]}` : null;

  let html = shellHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(seo.title)}</title>`);
  html = setMeta(html, "name", "description", seo.summary);
  html = setMeta(html, "property", "og:title", seo.title);
  html = setMeta(html, "property", "og:description", seo.summary);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", seo.title);
  html = setMeta(html, "name", "twitter:description", seo.summary);
  if (image) {
    html = setMeta(html, "property", "og:image", image);
    html = setMeta(html, "name", "twitter:image", image);
  }
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${url}" />`
  );

  // What this range holds, in a form Google reads: where the page sits in the
  // site, and the pieces on it by name.
  const pieces = (range.designs || []).map((d) => d.n).filter(Boolean);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: parent, item: `${SITE}${base}` },
          { "@type": "ListItem", position: 3, name: range.label, item: url },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": url,
        name: seo.title,
        description: seo.summary,
        url,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#james-roget` },
        mainEntity: {
          "@type": "ItemList",
          name: range.label,
          numberOfItems: pieces.length,
          itemListElement: pieces.map((n, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: n,
          })),
        },
      },
    ],
  };

  const block = `\n    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>\n  `;
  return html.replace("</head>", `${block}</head>`);
}

let written = 0;
const urls = [];

for (const gallery of GALLERIES) {
  const shellPath = join(DIST, gallery.shell);
  if (!existsSync(shellPath)) {
    console.warn(`  ! ${gallery.shell} not in dist — skipping ${gallery.base} ranges`);
    continue;
  }
  const shellHtml = readFileSync(shellPath, "utf-8");

  for (const range of gallery.data.ranges) {
    if (LIVE_RANGES.includes(range.label)) continue;
    const seo = RANGE_SEO[range.label];
    if (!seo) {
      console.warn(`  ! no page words for "${range.label}" — skipped (add it to src/data/rangeSeo.js)`);
      continue;
    }
    const slug = rangeSlug(range.label);
    // Written as <range>.html, the same shape as wall-art.html itself — the host
    // already serves that as /wall-art, so /wall-art/birds works the same way.
    const dir = join(DIST, gallery.base.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${slug}.html`), buildPage(shellHtml, gallery, range, seo, gallery.data.imgs), "utf-8");
    urls.push({ loc: `${SITE}${gallery.base}/${slug}`, label: range.label });
    written++;
  }
}

// Add the new addresses to the list handed to Google.
const sitemapPath = join(DIST, "sitemap.xml");
if (existsSync(sitemapPath) && urls.length) {
  const today = new Date().toISOString().slice(0, 10);
  const xml = readFileSync(sitemapPath, "utf-8");
  const additions = urls
    .filter(({ loc }) => !xml.includes(`<loc>${loc}</loc>`))
    .map(
      ({ loc }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    )
    .join("\n");
  if (additions) {
    writeFileSync(sitemapPath, xml.replace("</urlset>", `${additions}\n</urlset>`), "utf-8");
    console.log(`  + ${urls.length} range addresses added to sitemap.xml`);
  }
}

const waiting = Object.entries(RANGE_SEO).filter(([, v]) => v.needsWords).map(([k]) => k);
console.log(`✓ ${written} range pages written`);
if (waiting.length) console.log(`  (${waiting.length} still using their range name as the headline: ${waiting.join(", ")})`);
