// The words Google sees for each range's own page.
//
// Each range in the Wall Art and Sculpture galleries now has its own web
// address — /wall-art/australian-natives, /wall-art/birds and so on. This file
// holds the headline and the summary that appear in Google's results for each
// of those pages. Nothing here shows on screen; the gallery itself is unchanged.
//
// The key is the range's title exactly as it appears in the gallery.
//
// Every range's headline names what the pieces ARE before it names the range,
// because nobody searches a range name they have never heard. The six that were
// only ever a name — B Editions, Therus, Ikona, Pendants, Obliationes, Vitae —
// were written from the photographs; change any wording that reads wrong.
//
// Keep a headline under about 60 characters and a summary under about 155, or
// Google trims them.
export const RANGE_SEO = {
  // ── Wall Art ──────────────────────────────────────────────────────────────
  "AUSTRALIAN NATIVES": {
    title: "Australian Native Metal Wall Art — Banksia, Wattle | ROGETjames",
    summary:
      "Laser cut Australian native wall art in Corten steel and aluminium — banksia, wattle and wandoo designs by James Roget. Made to order, delivered Australia-wide.",
  },
  "CREEPING FIGS": {
    title: "Creeping Fig Metal Wall Art, Laser Cut | ROGETjames",
    summary:
      "Laser cut creeping fig wall art in Corten steel or powder-coated aluminium — trailing vine designs for walls, courtyards and entries. Made to order in Australia.",
  },
  BRANCHES: {
    title: "Branch & Tree Metal Wall Art, Laser Cut | ROGETjames",
    summary:
      "Laser cut branch and tree wall art in Corten steel and aluminium — sculptural line work for interiors and garden walls. Made to order, delivered Australia-wide.",
  },
  "FLOWERS & BLOOMS": {
    title: "Floral Metal Wall Art — Laser Cut Flowers | ROGETjames",
    summary:
      "Laser cut floral wall art in Corten steel and powder-coated aluminium — botanical blooms, palms and dandelions by James Roget. Made to order in Australia.",
  },
  PLUMES: {
    title: "Feather Metal Wall Art, Laser Cut | ROGETjames",
    summary:
      "Laser cut feather wall art in Corten steel or aluminium — single plumes and flocking feather compositions. Made to order in Australia, delivered nationwide.",
  },
  JUNGLE: {
    title: "Bamboo & Tropical Leaf Metal Wall Art | ROGETjames",
    summary:
      "Laser cut bamboo and tropical leaf wall art in Corten steel and aluminium — panels for interiors, courtyards and garden walls. Made to order in Australia.",
  },
  BIRDS: {
    title: "Bird Metal Wall Art — Swallows, Wren | ROGETjames",
    summary:
      "Laser cut bird wall art in Corten steel and aluminium — swallows in flight, wrens and flocking bird compositions. Made to order in Australia, delivered nationwide.",
  },
  RETRO: {
    title: "Retro & Mid-Century Metal Wall Art | ROGETjames",
    summary:
      "Laser cut retro wall art in Corten steel and powder-coated aluminium — mid-century geometric forms and repeat patterns. Made to order in Australia.",
  },
  CUSTOM: {
    title: "Custom Laser Cut Metal Wall Art, Made to Size | ROGETjames",
    summary:
      "Custom laser cut wall art made to your size and finish — an existing design adapted, or new work developed with you. Corten steel and aluminium, made in Australia.",
  },

  // ── Wall Art — named ranges ───────────────────────────────────────────────
  // These six are names rather than words anyone searches, so each headline
  // says what the pieces are first and names the pieces themselves second.
  // Descriptions written from the photographs — correct any that read wrong.
  "B EDITIONS": {
    title: "Tall Geometric Metal Wall Panels — B Editions | ROGETjames",
    summary:
      "Tall leaf-shaped wall panels in laser cut steel with geometric perforation — Halston B, Pavia B and Zed B. Made to order in Australia, delivered nationwide.",
  },
  THERUS: {
    title: "Coral & Sea Fan Metal Wall Art — Therus | ROGETjames",
    summary:
      "Laser cut coral and sea fan wall art in Corten steel or aluminium — Seaweed, Zon Zee and Nea, drawn from marine forms. Made to order in Australia.",
  },
  IKONA: {
    title: "Serpent, Blossom & Leaf Metal Wall Art — Ikona | ROGETjames",
    summary:
      "Laser cut figurative wall art in Corten steel and aluminium — the Vasuki serpent, Mohala blossom panel and Geo Leaf. Made to order in Australia.",
  },
  PENDANTS: {
    title: "Circle & Orbit Metal Wall Art — Pendants | ROGETjames",
    summary:
      "Laser cut circular and orbital wall art in Corten steel or aluminium — Libratum, Metropolis, Benin, Sanur and Salamanka. Made to order in Australia.",
  },
  OBLIATIONES: {
    title: "Perforated Round Metal Wall Discs — Obliationes | ROGETjames",
    summary:
      "Laser cut round wall discs in Corten steel and aluminium, patterned in fine perforation — Obliationes and Oko, hung singly or in a column. Made in Australia.",
  },
  VITAE: {
    title: "Foliage Metal Wall Panels — Vitae | ROGETjames",
    summary:
      "Arched laser cut wall panels dense with cut foliage — Vitae Gren and Vitae Shiogi, in Corten steel or powder-coated aluminium. Made to order in Australia.",
  },

  // ── Sculpture ─────────────────────────────────────────────────────────────
  "The Classics": {
    title: "Laser Cut Metal Garden Sculpture — The Classics | ROGETjames",
    summary:
      "Freestanding laser cut garden sculpture in Corten steel — the original ROGETjames forms, weathering to a warm patina outdoors. Made to order in Australia.",
  },
  "Leaf Sculptures": {
    title: "Leaf Garden Sculpture, Laser Cut Corten Steel | ROGETjames",
    summary:
      "Freestanding leaf sculpture in laser cut Corten steel — oversized botanical forms for gardens, courtyards and entries. Made to order, delivered Australia-wide.",
  },
  "Bon Bons & Genie Bottles": {
    title: "Sculptural Metal Garden Forms — Bon Bons | ROGETjames",
    summary:
      "Freestanding laser cut sculpture in Corten steel — rounded bon bon and genie bottle forms for gardens and courtyards. Made to order in Australia.",
  },
};

// The ranges built live from uploaded photos rather than fixed data. They can't
// have a page written ahead of time, so the build step skips them.
export const LIVE_RANGES = ["UP CLOSE", "Fire Sculptures", "DISPLAYS", "CLIENT IMAGES", "NEAZAR"];
