// Every instruction James typed into /media, shouted at the top of the build.
//
// James writes what he wants in the note box when he uploads a photo —
// "this is also a pergola", "mention the location", "replace this image".
// Nothing read those notes. They sat in media-manifest.json while he assumed
// they had been acted on, and found out weeks later that they had not.
//
// This prints every note that has not been marked done, on every single build,
// so it cannot be missed. Once an instruction has been carried out, add its
// upload id to public/media-notes-done.json with a line saying what was done.
//
// It never fails the build — a photo must never be blocked by paperwork.

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(ROOT, "public", "media-manifest.json");
const DONE = join(ROOT, "public", "media-notes-done.json");

const read = (p, fallback) => {
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : fallback; }
  catch { return fallback; }
};

const manifest = read(MANIFEST, []);
const done = read(DONE, {});
if (!existsSync(DONE)) writeFileSync(DONE, "{}\n", "utf-8");

// Notes the uploader or a script wrote about itself are not instructions.
const AUTOMATED = /^(auto-(applied|replaced)|used in[- ]place|placed as|folded into|added to hero|held out of)/i;

const outstanding = (Array.isArray(manifest) ? manifest : [])
  .filter((e) => String(e?.note || "").trim())
  .filter((e) => !done[e.id])
  .filter((e) => !AUTOMATED.test(String(e.note).trim()));

if (!outstanding.length) {
  console.log("  ✓ no unread instructions in the media uploader");
} else {
  const bar = "━".repeat(72);
  console.log(`\n\x1b[33m${bar}\x1b[0m`);
  console.log(`\x1b[33m  ${outstanding.length} INSTRUCTION${outstanding.length === 1 ? "" : "S"} FROM JAMES IN THE MEDIA UPLOADER — NOT YET ACTED ON\x1b[0m`);
  console.log(`\x1b[33m${bar}\x1b[0m`);
  for (const e of outstanding) {
    const where = (e.destinations || []).join(", ") || "no destination";
    console.log(`\n  \x1b[1m${e.name || "(unnamed)"}\x1b[0m   [${where}]`);
    console.log(`  id: ${e.id}`);
    console.log(`  \x1b[36m"${String(e.note).trim()}"\x1b[0m`);
  }
  console.log(`\n\x1b[33m  Carry each one out, then add its id to public/media-notes-done.json\x1b[0m`);
  console.log(`\x1b[33m${bar}\x1b[0m\n`);
}
