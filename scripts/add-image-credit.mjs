// Writes "ROGETjames" as creator, credit and copyright inside every JPEG the
// site publishes, so the credit travels with the file wherever it is copied,
// and Google Images can show it under "Image credits".
//
// WHY AT BUILD TIME: photos James uploads from his phone at /media are
// re-drawn in the browser, which strips everything hidden inside them. Doing
// it here means every photo — old or newly uploaded — is credited without
// anyone having to remember.
//
// HOW: a standard XMP block (the same one Lightroom and Photoshop write) is
// slotted into the file's header. The picture itself is not touched — no
// re-compression, not one pixel changes. Files that already carry XMP are
// left alone (those were credited once with ExifTool, Nov 2026).
//
// Runs on dist/ only; the originals in public/ are never modified here.

import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "dist", "images");

const XMP_NS = Buffer.from("http://ns.adobe.com/xap/1.0/\0", "latin1");
const PACKET = Buffer.from(
  `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>` +
    `<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">` +
    `<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" ` +
    `xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">` +
    `<dc:creator><rdf:Seq><rdf:li>ROGETjames</rdf:li></rdf:Seq></dc:creator>` +
    `<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© ROGETjames. All rights reserved.</rdf:li></rdf:Alt></dc:rights>` +
    `<photoshop:Credit>ROGETjames</photoshop:Credit>` +
    `<xmpRights:Marked>True</xmpRights:Marked>` +
    `</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`,
  "utf8"
);
const BODY = Buffer.concat([XMP_NS, PACKET]);
const SEGMENT = Buffer.concat([Buffer.from([0xff, 0xe1, (BODY.length + 2) >> 8, (BODY.length + 2) & 0xff]), BODY]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jpe?g$/i.test(name)) out.push(p);
  }
  return out;
}

// Returns the offset just after the leading APP0 (JFIF) / APP1 (EXIF) blocks,
// which must stay first; or -1 if the file isn't a JPEG we understand or
// already has an XMP block.
function insertAt(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return -1;
  let i = 2;
  let at = -1;
  // Walk every header block up to the picture data (SOS), looking for XMP.
  while (i + 4 <= buf.length && buf[i] === 0xff) {
    const marker = buf[i + 1];
    if (marker === 0xda) break;
    const len = buf.readUInt16BE(i + 2);
    if (marker === 0xe1 && buf.subarray(i + 4, i + 4 + XMP_NS.length).equals(XMP_NS)) return -1;
    if (at < 0 && marker !== 0xe0 && marker !== 0xe1) at = i;
    i += 2 + len;
  }
  return at < 0 ? i : at;
}

let added = 0, skipped = 0;
let files = [];
try { files = walk(DIR); } catch { /* no dist/images — nothing to do */ }
for (const f of files) {
  const buf = readFileSync(f);
  const at = insertAt(buf);
  if (at < 0) { skipped++; continue; }
  writeFileSync(f, Buffer.concat([buf.subarray(0, at), SEGMENT, buf.subarray(at)]));
  added++;
}
console.log(`  ✓ image credit: added to ${added} photos, ${skipped} already credited`);
