// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for /media upload destinations.
//
// The problem this solves: the uploader's destination buttons used to be typed
// by hand, separately from the keys each gallery actually reads. When the two
// drifted apart, a photo could land in a destination no page reads and vanish
// silently (this happened to Screens and Bespoke Sculpture).
//
// The rule now: the uploader offers a *live* destination only if a real page
// reads the SAME key from this file. Both sides import these constants, so a
// button and the page that shows it can never drift apart.
//
//   Live keys here  ── imported by ──▶  the gallery that renders them
//        │                                     ▲
//        └──────── imported by ── the uploader ─┘  (offers exactly these)
//
// Wall Art series and hero slides are already self-maintaining (both the
// uploader and their pages derive them from WALL_ART_COVERS / HERO_SLIDES), so
// they aren't restated here — only the fixed single keys that would otherwise
// be hand-typed in two places.
// ─────────────────────────────────────────────────────────────────────────

// Fixed live destination keys. Each is read by a real page (named in the
// comment). Change a value here and every place that imports it moves together.
export const MEDIA_KEYS = {
  screens: "screens",         // read by ScreensGalleryModal (BespokeCommissions)
  sculpture: "sculpture",     // legacy alias, still read
  // The Bespoke Sculpture popup. This is the key James's existing uploads
  // actually carry — the gallery used to read "sculpture", which nothing was
  // ever tagged with, so those photos never appeared.
  bespokeSculpture: "bespoke-sculpture",
  concepts: "concepts",       // read by the Concepts SculptureGalleryModal
  hero: "hero",               // read by Hero.jsx (appended as a new slide)
  heroReplacePrefix: "hero-replace-", // Hero.jsx: hero-replace-<slide key>
  upClose: "up-close",        // read by every gallery's Up Close row
  concrete: "concrete",       // read by the Concrete gallery (BespokeCommissions)
  clientImages: "client-images", // read by the Client Images portal (DiscoverPortals)
};

// Prefixes for the two galleries that are made of many named sections, so each
// section is its own upload spot instead of one catch-all bucket.
// The suffix is the section's own id, so adding a section to either gallery
// creates its upload destination automatically — nothing to type here.
//   bespoke-<section id>   read by the Bespoke gallery (BespokeCommissions)
//   project-<project id>   read by the Projects gallery (BespokeCommissions)
export const BESPOKE_PREFIX = "bespoke-";
export const PROJECT_PREFIX = "project-";
export const bespokeKey = (sectionId) => `${BESPOKE_PREFIX}${sectionId}`;

// City page accordion panels. One key per city per panel, so a photo uploaded
// there REPLACES that panel's picture (newest upload wins). Only cities whose
// page actually renders the panels are offered in /media.
export const CITY_PANEL_PREFIX = "city-";
export const cityPanelKey = (citySlug, panelName) =>
  `${CITY_PANEL_PREFIX}${citySlug}-${panelName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

// The big picture at the top of a city page. Uploading here replaces it.
export const cityHeroKey = (citySlug) => cityPanelKey(citySlug, "hero");
export const projectKey = (projectCategory) => `${PROJECT_PREFIX}${projectCategory}`;

// Parked destinations: these intentionally have NO gallery yet. They are shown
// in a separate "won't go live yet" group in the uploader so it is always
// obvious the photo needs placing before it appears anywhere.
export const HOLDING_DESTINATIONS = [
  { key: "other", label: "Somewhere else (I'll place it) — type below" },
];
export const HOLDING_KEYS = HOLDING_DESTINATIONS.map((d) => d.key);
