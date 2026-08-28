// Counts a visitor opening a gallery, for the /stats page.
//
// James's own visits are never counted. His browser is recognised three ways —
// any one of them is enough, and all three are set the moment he uses the site
// the way he normally does:
//   · the admin password saved by /stats, /media or /admin
//   · the private owner-preview pass (?preview=roj-open)
//   · 1966 entered as a postcode in the pricing gate
// Local development never counts either.
const has = (key) => {
  try { return !!localStorage.getItem(key); } catch { return false; }
};

export function isOwnerVisit() {
  if (import.meta.env.DEV) return true;
  if (has("stats_key")) return true;
  try {
    if (localStorage.getItem("roj_bespoke_preview") === "1") return true;
    const pc = JSON.parse(localStorage.getItem("roj_postcode") || "null");
    if (pc && pc.isAdmin === true) return true;
  } catch { /* a locked-down browser just counts as a normal visitor */ }
  return false;
}

export function trackGalleryOpen(gallery) {
  if (!gallery || isOwnerVisit()) return;
  try {
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "gallery", gallery }),
    }).catch(() => {});
  } catch { /* counting must never get in a visitor's way */ }
}
