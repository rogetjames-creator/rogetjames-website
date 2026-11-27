// Netlify preview and branch copies of the site (deploy-preview-…,
// <branch>--rogetjames-new.netlify.app) must never be indexed as duplicates of
// rogetjames.com (SEO brief, Phase 4). Netlify tells the build which kind it is
// through CONTEXT; anything other than "production" gets a noindex header on
// every address. The live site is never touched.
import { appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ctx = process.env.CONTEXT;
if (ctx && ctx !== "production") {
  appendFileSync(fileURLToPath(new URL("../dist/_headers", import.meta.url)), "\n/*\n  X-Robots-Tag: noindex, nofollow\n");
  console.log(`preview-noindex: ${ctx} copy marked noindex.`);
}
