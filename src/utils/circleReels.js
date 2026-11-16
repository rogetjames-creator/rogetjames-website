// Small copies of the reels, used only inside the Reels circles. The enlarged
// player always uses the full-size original. See scripts/check-circle-reels.mjs.
import CIRCLE_REELS from "../data/circleReels.json";

const SET = new Set(CIRCLE_REELS);
export function circleReel(src) {
  const m = typeof src === "string" && src.match(/^\/videos\/reels\/([\w-]+)\.mp4$/);
  return m && SET.has(m[1]) ? `/videos/reels/circle/${m[1]}.mp4` : src;
}
