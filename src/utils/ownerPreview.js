// Private owner preview — the one link James uses to open anything that isn't
// public yet, on any device, without typing the admin password.
//
//   ...?preview=roj-open   unlocks and remembers it in this browser
//   ...?preview=off        re-locks it
//
// The pass is stripped from the address bar straight away, so the address he
// ends up on is shareable-safe and gives nothing away. Used by the Bespoke
// portals on the home page and by the private city pages.
export const PREVIEW_PASS = "roj-open";

export function ownerPreviewUnlocked() {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("preview");
    if (q === "off") {
      localStorage.removeItem("roj_bespoke_preview");
      window.history.replaceState({}, "", window.location.pathname);
      return false;
    }
    if (q === PREVIEW_PASS) {
      localStorage.setItem("roj_bespoke_preview", "1");
      // Strip the pass from the address bar so it isn't visible or shareable.
      window.history.replaceState({}, "", window.location.pathname);
    }
    return localStorage.getItem("roj_bespoke_preview") === "1";
  } catch {
    return false;
  }
}
