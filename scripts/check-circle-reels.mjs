// The Reels circles play small copies of each reel (public/videos/reels/circle/),
// made from the full-size originals. If an original is replaced (e.g. through
// /media), its small copy no longer matches — so that reel falls back to the
// original in the circle until a new small copy is made. Runs before vite build.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const sources = JSON.parse(readFileSync("scripts/circle-reels-sources.json", "utf8"));
const ok = [];
for (const [name, hash] of Object.entries(sources)) {
  const orig = `public/videos/reels/${name}.mp4`;
  const small = `public/videos/reels/circle/${name}.mp4`;
  if (!existsSync(orig) || !existsSync(small)) continue;
  const now = createHash("sha256").update(readFileSync(orig)).digest("hex");
  if (now === hash) ok.push(name);
  else console.warn(`[circle-reels] ${name}.mp4 was replaced — circle plays the full original until a new small copy is made.`);
}
writeFileSync("src/data/circleReels.json", JSON.stringify(ok.sort(), null, 2) + "\n");
console.log(`[circle-reels] ${ok.length} reels use small circle copies.`);
