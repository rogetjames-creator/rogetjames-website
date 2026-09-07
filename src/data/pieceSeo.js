// ─────────────────────────────────────────────────────────────────────────
//  THE WORDS ON EACH PIECE'S OWN PAGE
//
//  Every catalogued design gets its own address — /wall-art/<range>/<piece>.
//  This file holds what Google reads and what a visitor reads on it:
//
//    subject — what the piece IS, in the words a stranger types. This goes
//              above the name and into the page title, because nobody
//              searches "OBLIATIONES".
//
//  RULES FOR WRITING THESE — set after getting it wrong:
//    • No species names, no botany, unless James has said it himself.
//      A banksia is "banksia". Not "Banksia baueri".
//    • Only what is visibly in the photograph or in the piece's own name.
//    • Powder-coated aluminium is what most people order — it leads.
//      Corten steel comes second, always with the word "rust" nearby.
//    • Never a price, a price range, or the word "from".
//
//  Anything without an entry falls back to its range's subject and a plain
//  sentence, so a new piece is never left without a page.
// ─────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────
//  JAMES'S OWN WORDS — used on every piece page. Do not reword these.
// ─────────────────────────────────────────────────────────────────────────

// Sits under the piece's own spiel, on every page.
export const BRAND_SPIEL = [
  "Step into the captivating world of ROGETjames iconic free form Wall Art Editions, where inspiration is found in wild landscapes and cultural motifs from home and afar.",
  "The ROGETjames collection of wall art, garden sculptures and decorative screens effortlessly infuses drama and designer style into any setting, whether it's your indoor oasis or your outdoor retreat. Each piece is scrupulously crafted and made using the most durable and sustainable materials available, ensuring they stay stunning through sun, rain, or shine.",
];

// The spiel for a whole subject — used by every piece it covers.
export const SUBJECT_SPIEL = {
  creepingFig:
    "What originated from a custom design — Creeping Fig Spring — spawned into a growing range of organic free form designs. A quiet wanderer, creeping across the surface like tendrils of art claiming a bare wall.",
  banksia:
    "Redefine your outdoor space with our stunning Banksia outdoor wall art piece, beautifully crafted to showcase the allure of Australia's native flora. Designed in-house, this chic, highly detailed interpretation of the iconic banksia flower adds a touch of natural beauty to your outdoor area, bringing the vibrant essence of the outdoors right to your doorstep.",
};

// The plant behind a piece, in James's words. Only where he has given it —
// never worked out from a photograph.
export const BOTANY = {
  "BANKSIA Oldmanis": [
    ["Common name", "Old Man Banksia"],
    ["Scientific name", "Banksia serrata", { i: true }],
    ["Family", "Proteaceae"],
  ],
  WANDOO: [
    ["Common name", "Wandoo"],
    ["Scientific name", "Eucalyptus wandoo", { i: true }],
    ["Family", "Myrtaceae"],
    ["Type", "Eucalyptus (gum) tree"],
  ],
  WATTLE: [
    ["Common name", "Wattle"],
    ["Scientific genus", "Acacia", { i: true }],
    ["Family", "Fabaceae"],
    ["Australia's national floral emblem", "Golden Wattle — Acacia pycnantha"],
  ],
};

// The face a piece's name is set in — each one taken from James's own SVG
// artwork for that piece, keyed by the first word of the name. Adobe Fonts
// kit idb3goe carries them; anything without an entry falls back to Syne.
//
// Where a name has a qualifier (Card, Round, Deco…) the first word is set in
// the face and the qualifier follows in the standard face, smaller. Names
// listed in FULL_TITLE_IN_FACE are set in the face end to end, as drawn.
export const TITLE_FONT = {
  BANKSIA: "joschmi",              // BANKSIA.svg
  WANDOO: "adorn-condensed-sans",  // WANDOO.svg
  // WATTLE is drawn, not typed — see src/data/wordmarks.js.
};
export const FONT_KIT = "loj3gez";
export const FULL_TITLE_IN_FACE = ["BANKSIA Oldmanis"];

// Words that belong to a whole range rather than one piece.
export const RANGE_SPIEL = {
  "CREEPING FIGS": SUBJECT_SPIEL.creepingFig,
};

export const RANGE_BOTANY = {
  "CREEPING FIGS": [
    ["Common name", "Creeping Fig"],
    ["Scientific name", "Ficus pumila", { i: true }],
    ["Family", "Moraceae"],
    ["Type", "Climbing / creeping evergreen vine"],
  ],
};

// A range whose pieces are titled "<prefix> — <piece>", the prefix set in its
// own face. James's CREEPING FIGS.svg is drawn in PF Marlet Display, and the
// title reads CREEPING FIG (singular) with the piece name under it.
export const RANGE_TITLE = {
  "CREEPING FIGS": { prefix: "CREEPING FIG", face: "pf-marlet-display" },
};

// "Material and colour options" — opens on the page.
export const MATERIAL_COPY = [
  {
    id: "corten",
    heading: "Corten steel",
    text: "Corten Steel develops a unique natural patina that changes as it ages. It is important to note that the Corten steel may leach (drip rust) during the ageing process, and the bright orange tones that can appear initially will stabilise to a deeper, more even, rusted finish.",
  },
  {
    id: "aluminium",
    heading: "Aluminium",
    text: "Aluminium won't age or leach like Corten steel, and the powder coated colour range is extensive. The Corten real 'rust' look can be achieved by choosing the Interpon Sable 'Corten' powder coat colour. Standard thickness 3 mm. We recommend choosing a textured, matte or satin finish for outdoor wall art — a glossy finish can reflect sunlight and show marks. For more colour options, view the colour chart in Catalogues on the menu.",
  },
];

// "Tips for installation" — opens on the page. {fixings} is filled in with the
// number that piece actually needs.
export const INSTALL_TIPS = [
  "Wall art can be delicate and should be transported flat to avoid any damage during transit.",
  "When handling try to lift vertically to avoid bending.",
  "Place the artwork on the wall in desired position, mark the designated holes on the wall and drill appropriate holes for fixing.",
  "Mount the art a few centimetres out from the wall for stunning shadows during the day. You can also add lights for shadows at night.",
  "Lead time approximately 3–6 weeks.",
  "Powder coated stand-offs are available to purchase and can be powder-coated to match the piece.",  // no outside supplier is ever named
  "{fixings} standoffs required.",
];

// The searchable subject for each range — used when a piece has no subject
// of its own, and for the range's own page.
export const RANGE_SUBJECT = {
  "AUSTRALIAN NATIVES": "Australian native metal wall art",
  "CREEPING FIGS": "Creeping fig metal wall art",
  BRANCHES: "Branch & tree metal wall art",
  "FLOWERS & BLOOMS": "Floral metal wall art",
  PLUMES: "Feather metal wall art",
  JUNGLE: "Tropical metal wall art",
  "B EDITIONS": "Abstract metal wall art",
  THERUS: "Coastal metal wall art",
  IKONA: "Sculptural metal wall art",
  PENDANTS: "Tall metal wall panel",
  OBLIATIONES: "Round metal wall art",
  BIRDS: "Bird metal wall art",
  RETRO: "Retro metal wall art",
  VITAE: "Metal wall art panel",
  CUSTOM: "Custom metal wall art",
  "The Classics": "Corten steel garden sculpture",
  "Leaf Sculptures": "Leaf garden sculpture",
  "Bon Bons & Genie Bottles": "Freestanding garden sculpture",
};

// Per piece. `s` = the subject line above the name — what a stranger types.
// There is no description field: the only words on a page are James's own.
export const PIECE_SEO = {
  // ── AUSTRALIAN NATIVES ────────────────────────────────────────────────
  "BANKSIA Card": { s: "Banksia metal wall art" },
  "BANKSIA Oldmanis": { s: "Banksia metal wall art" },
  WANDOO: { s: "Gum leaves metal wall art" },
  "BANKSIA Free Range": { s: "Banksia metal wall art" },
  "BANKSIA Rec Landscape": { s: "Banksia metal wall art" },
  "BANKSIA Rec Portrait": { s: "Banksia metal wall art" },
  "BANKSIA Free Range — Custom": { s: "Custom banksia metal wall art" },
  "BANKSIA Round": { s: "Round banksia metal wall art" },
  "BANKSIA Deco": { s: "Banksia metal wall panel" },
  WATTLE: {
    s: "Wattle metal wall art",
    spiel: "Wattle is one of ROGETjames most iconic original designs. The Wattle design can also be found in our screens gallery.",
    links: [["screens gallery", "/screens"]],
  },

  // ── CREEPING FIGS ─────────────────────────────────────────────────────
  AUTUMN: { s: "Creeping fig metal wall art" },
  GRANDE: { s: "Creeping fig metal wall art" },
  SPRING: { s: "Creeping fig metal wall art" },
  FIGARO: { s: "Creeping fig metal wall art" },
  ONTIO: { s: "Creeping fig metal wall art" },
  NUVINE: { s: "Creeping fig metal wall art" },
  BUTTERFLY: { s: "Creeping fig metal wall art" },
  "CREEPING FIG SERIES": { s: "Creeping fig metal wall art" },

  // ── BRANCHES ──────────────────────────────────────────────────────────
  "GREN Edge": { s: "Branch metal wall art" },
  "GREN Tao": { s: "Branch metal wall art" },
  "GREN Free": { s: "Branch metal wall art" },
  "GREN X": { s: "Branch metal wall art" },
  "VITAE — GREN": { s: "Branch metal wall panel" },

  // ── FLOWERS & BLOOMS ──────────────────────────────────────────────────
  RUE: { s: "Round floral metal wall art" },
  "RUE the 3rd": { s: "Round floral metal wall art" },
  OLIN: { s: "Round floral metal wall art" },
  PETUNIA: { s: "Floral metal wall art" },
  "DIAMOND BLOOM": { s: "Floral metal wall art" },
  FUEILLES: { s: "Round leaf metal wall art" },
  FERLICE: { s: "Round floral metal wall art" },
  "PALM RAJA": { s: "Palm metal wall art" },
  DANDELIONS: { s: "Dandelion metal wall art" },

  // ── PLUMES ────────────────────────────────────────────────────────────
  "PLUME DECO": { s: "Feather metal wall art" },
  FEATHER: { s: "Feather metal wall art" },
  "FEATHER — Toivottaa": { s: "Feather metal wall art" },
  "FLOCK O FEATHERS": { s: "Feather metal wall art" },

  // ── JUNGLE ────────────────────────────────────────────────────────────
  BAMBU: { s: "Bamboo metal wall art" },
  "UBUD Round": { s: "Round tropical metal wall art" },
  "UBUD Rectangle": { s: "Tropical metal wall panel" },

  // ── B EDITIONS ────────────────────────────────────────────────────────
  "HALSTON B": { s: "Abstract metal wall art" },
  "PAVIA B": { s: "Abstract metal wall art" },
  "ZED B": { s: "Round abstract metal wall art" },

  // ── THERUS ────────────────────────────────────────────────────────────
  SEAWEED: { s: "Coastal metal wall art" },
  "ZON ZEE": { s: "Coastal metal wall art" },
  NEA: { s: "Coastal metal wall art" },

  // ── IKONA ─────────────────────────────────────────────────────────────
  VASUKI: { s: "Large sculptural metal wall art" },
  MAHOLA: { s: "Tall metal wall panel" },
  "GEO LEAF": { s: "Geometric leaf metal wall art" },

  // ── PENDANTS ──────────────────────────────────────────────────────────
  LIBRATUM: { s: "Tall metal wall panel" },
  METROPOLIS: { s: "Metal wall panel" },
  BENIN: { s: "Tall metal wall panel" },
  SANUR: { s: "Tall metal wall panel" },
  SALAMANKA: { s: "Metal wall panel" },

  // ── OBLIATIONES ───────────────────────────────────────────────────────
  OBLIATIONES: { s: "Round metal wall art" },
  "OBLIATIONES — Large": { s: "Round metal wall art" },
  "OBLIATIONES TIBETAN — Patha": { s: "Round metal wall art" },
  OKO: { s: "Metal wall art panel" },

  // ── BIRDS ─────────────────────────────────────────────────────────────
  "BIRDY NUM NUM": { s: "Bird metal wall art" },
  SWALLOWS: { s: "Bird metal wall art" },
  WREN: { s: "Bird metal wall art" },

  // ── RETRO ─────────────────────────────────────────────────────────────
  JEAGER: { s: "Retro metal wall art" },
  "HALSTON Tall": { s: "Retro metal wall art" },
  "ZED O": { s: "Round retro metal wall art" },
  ZED: { s: "Retro metal wall art" },

  // ── VITAE ─────────────────────────────────────────────────────────────
  "VITAE — SHIOGI": { s: "Metal wall art panel" },

  // ── CUSTOM ────────────────────────────────────────────────────────────
  "LIBRATUM — Custom": { s: "Custom metal wall panel" },
  "CREEPING FIG — Custom": { s: "Custom creeping fig metal wall art" },

  // ── SCULPTURE — The Classics ──────────────────────────────────────────
  MARAKESH: { s: "Corten steel garden sculpture" },
  PAVIA: { s: "Corten steel garden sculpture" },
  MOWHITI: { s: "Corten steel garden sculpture" },
  OMARE: { s: "Corten steel garden sculpture" },

  // ── SCULPTURE — Leaf Sculptures ───────────────────────────────────────
  "AUTUMN LEAF": { s: "Leaf garden sculpture" },
  "VILLA LEAF": { s: "Leaf garden sculpture" },

  // ── SCULPTURE — Bon Bons & Genie Bottles ──────────────────────────────
  "BON BON": { s: "Freestanding garden sculpture" },
  MEDINA: { s: "Freestanding garden sculpture" },
};

// Piece pages Google should NOT be shown — nothing here yet; kept so a piece
// can be held back without deleting its page.
export const HIDDEN_PIECES = [];
