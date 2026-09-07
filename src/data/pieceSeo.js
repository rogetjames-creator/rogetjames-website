// ─────────────────────────────────────────────────────────────────────────
//  THE WORDS ON EACH PIECE'S OWN PAGE
//
//  Every catalogued design gets its own address — /wall-art/<range>/<piece>.
//  This file holds what Google reads and what a visitor reads on it:
//
//    subject — what the piece IS, in the words a stranger types. This goes
//              above the name and into the page title, because nobody
//              searches "OBLIATIONES".
//    text    — one or two sentences under the name.
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
  "The ROGETjames collection of wall art, garden sculptures and decorative screens effortlessly infuses drama and designer style into any setting, whether it's your indoor oasis or your outdoor retreat. Each piece is scrupulously crafted and made here in Perth, using the most durable and sustainable materials available, ensuring they stay stunning through sun, rain, or shine. Discover your unique outdoor style with ROGETjames, and let your outdoor space tell its own story.",
];

// The spiel for a whole subject — used by every piece it covers.
export const SUBJECT_SPIEL = {
  banksia:
    "Redefine your outdoor space with our stunning Banksia outdoor wall art piece, beautifully crafted to showcase the allure of Australia's native flora. Designed in-house, this chic, highly detailed interpretation of the iconic banksia flower adds a touch of natural beauty to your outdoor area, bringing the vibrant essence of the outdoors right to your doorstep.",
};

// The plant behind a piece, in James's words. Only where he has given it —
// never worked out from a photograph.
export const BOTANY = {
  "BANKSIA Oldmanis": {
    common: "Old Man Banksia",
    scientific: "Banksia serrata",
    family: "Proteaceae",
  },
};

// The face a piece's name is set in. Joschmi is the Banksia type — it is the
// font named in James's own BANKSIA.svg artwork. Adobe Fonts kit msz1oxa
// carries it; anything without an entry falls back to the site's Syne.
//
// On a Banksia the word BANKSIA is set in Joschmi and the qualifier (Card,
// Round, Deco…) follows in the standard face, smaller. BANKSIA OLDMANIS is
// the exception — the whole name is set in Joschmi, as in the artwork.
export const TITLE_FONT = {
  banksia: "joschmi",
};
export const FULL_TITLE_IN_FACE = ["BANKSIA Oldmanis"];

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
  "Wall art can be delicate and should be transported flat to avoid any damage during transit. Please discuss installation and delivery requirements with our team to ensure your artwork arrives safely.",
  "Mount the art a few centimetres out from the wall for stunning shadows during the day. You can also add lights for shadows at night.",
  "Check the size of your art piece before you buy. Then, after using painter's tape to mark the size on your wall, step back and reflect on how it would suit your space.",
  "Lead time approximately 4–6 weeks.",
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

// Per piece. `s` = subject line (overrides the range's), `t` = the paragraph.
export const PIECE_SEO = {
  // ── AUSTRALIAN NATIVES ────────────────────────────────────────────────
  "BANKSIA Card": { s: "Banksia metal wall art", t: "A single banksia, cone and foliage, held inside a cut border. The tallest size stands well beside a door or in a stairwell." },
  "BANKSIA Oldmanis": { s: "Banksia metal wall art", t: "Banksia cones and serrated leaves drawn at full height and cut from one sheet, the stem carried in a single line. Suits an entry wall, a courtyard, or a stairwell tall enough to take it." },
  WANDOO: { s: "Wandoo gum metal wall art", t: "A wandoo in full spread — trunk, limbs and leaf drawn as one open canopy. Reads best on a wide wall with light across it." },
  "BANKSIA Free Range": { s: "Banksia metal wall art", t: "Banksia cut loose from any border, so the wall shows through the foliage. Fixed straight to brick, render or timber." },
  "BANKSIA Rec Landscape": { s: "Banksia metal wall art", t: "The banksia set in a landscape rectangle — a framed panel for a wall wider than it is tall." },
  "BANKSIA Rec Portrait": { s: "Banksia metal wall art", t: "The banksia set upright in a portrait rectangle, for a tall wall or a narrow return." },
  "BANKSIA Free Range — Custom": { s: "Custom banksia metal wall art", t: "The free-range banksia cut to your wall — any width or height, drawn to suit the space before it is cut." },
  "BANKSIA Round": { s: "Round banksia metal wall art", t: "Banksia cut inside a circle, the foliage running out to the rim. A round piece sits well above a bench, a bed or a fireplace." },
  "BANKSIA Deco": { s: "Banksia metal wall panel", t: "The banksia handled as a deco panel — repeated, squared off and even, closer to pattern than portrait." },
  WATTLE: { s: "Wattle metal wall art", t: "Wattle in flower, cut inside a circle so the blossom carries the whole disc. Powder-coated in colour or left as Corten to rust outdoors." },

  // ── CREEPING FIGS ─────────────────────────────────────────────────────
  AUTUMN: { s: "Creeping fig metal wall art", t: "Creeping fig in its autumn state — leaf thinning out along the runners, the wall showing through. Three sizes, the largest nearly three metres wide." },
  GRANDE: { s: "Creeping fig metal wall art", t: "The widest creeping fig in the range at over four metres, made to run the length of a wall rather than sit on it." },
  SPRING: { s: "Creeping fig metal wall art", t: "New growth — tight leaf climbing a narrow upright panel. Suits a pier, a return wall or the space beside a door." },
  FIGARO: { s: "Creeping fig metal wall art", t: "Creeping fig drawn dense and even, the leaf close enough to read as a mass from across a courtyard." },
  ONTIO: { s: "Creeping fig metal wall art", t: "A smaller creeping fig panel for an entry, a hallway or a courtyard wall that can't take the full spread." },
  NUVINE: { s: "Creeping fig metal wall art", t: "A tall, narrow run of creeping fig — 3 metres at the largest, less than 600 mm wide. Made for a pier or a slot of wall." },
  BUTTERFLY: { s: "Creeping fig metal wall art", t: "The widest piece in the catalogue at over four metres, the fig opening out from the centre in both directions." },
  "CREEPING FIG SERIES": { s: "Creeping fig metal wall art", t: "The creeping fig series — the same climbing leaf worked at different scales and densities across the range." },

  // ── BRANCHES ──────────────────────────────────────────────────────────
  "GREN Edge": { s: "Branch metal wall art", t: "Branch and leaf running off the edge of the panel, so the piece reads as part of a larger tree beyond the wall." },
  "GREN Tao": { s: "Branch metal wall art", t: "A quieter branch — fewer limbs, more space between them, the line doing the work." },
  "GREN Free": { s: "Branch metal wall art", t: "The branch cut free of any border, fixed straight to the wall so the shadow becomes part of it." },
  "GREN X": { s: "Branch metal wall art", t: "Two branch runs crossing, filling a wide wall to just under 2.3 metres at the largest size." },
  "VITAE — GREN": { s: "Branch metal wall panel", t: "The GREN branch worked into the VITAE panel — the tree line held inside a solid rectangle." },

  // ── FLOWERS & BLOOMS ──────────────────────────────────────────────────
  RUE: { s: "Round floral metal wall art", t: "A bloom opening across a disc, petals cut to the rim. The most ordered of the round florals, in three sizes to 1.5 metres." },
  "RUE the 3rd": { s: "Round floral metal wall art", t: "The third drawing of RUE — the same disc, a looser and more open bloom." },
  OLIN: { s: "Round floral metal wall art", t: "A tight, even bloom on a 1.1 metre disc. Reads well as a pair or a run of three." },
  PETUNIA: { s: "Floral metal wall art", t: "A single open flower, cut large — 1.7 metres across at the bigger size." },
  "DIAMOND BLOOM": { s: "Floral metal wall art", t: "The bloom set on the diagonal inside a diamond, for a wall that needs the drawing to sit off-square." },
  FUEILLES: { s: "Round leaf metal wall art", t: "Leaf rather than flower, worked as a circle — foliage turning around the centre." },
  FERLICE: { s: "Round floral metal wall art", t: "A one-metre disc, fine cut and even, for a smaller wall or a run of several." },
  "PALM RAJA": { s: "Palm metal wall art", t: "Palm fronds cut across a landscape panel — the tropical piece in the floral range." },
  DANDELIONS: { s: "Dandelion metal wall art", t: "Dandelion heads and seed carried up a square or a tall portrait panel. Fine cutting, best where light can rake across it." },

  // ── PLUMES ────────────────────────────────────────────────────────────
  "PLUME DECO": { s: "Feather metal wall art", t: "A single feather laid out long and horizontal — 2.4 metres at the largest, under a metre high. Shown here in black, in rust, and in colour." },
  FEATHER: { s: "Feather metal wall art", t: "One feather, cut clean, the barbs opening away from the shaft." },
  "FEATHER — Toivottaa": { s: "Feather metal wall art", t: "The feather drawn finer and longer, to 2.4 metres." },
  "FLOCK O FEATHERS": { s: "Feather metal wall art", t: "Several feathers drifting across the wall together rather than one on its own." },

  // ── JUNGLE ────────────────────────────────────────────────────────────
  BAMBU: { s: "Bamboo metal wall art", t: "Bamboo canes and leaf running the full height of a panel — to nearly three metres. Works as a screen-like feature indoors or out." },
  "UBUD Round": { s: "Round tropical metal wall art", t: "A carved-pattern disc drawn from Balinese work. The largest reaches 3.5 metres across, for a facade or a double-height wall." },
  "UBUD Rectangle": { s: "Tropical metal wall panel", t: "The same Balinese pattern set in a long horizontal panel, to just under three metres." },

  // ── B EDITIONS ────────────────────────────────────────────────────────
  "HALSTON B": { s: "Abstract metal wall art", t: "A tall geometric panel — repeated line broken by open ground, nearly 2.4 metres high." },
  "PAVIA B": { s: "Abstract metal wall art", t: "The PAVIA form flattened into a wall panel — the sculpture's profile read straight on." },
  "ZED B": { s: "Round abstract metal wall art", t: "A 1.6 metre disc of cut geometry, sized to hold a large blank wall on its own." },

  // ── THERUS ────────────────────────────────────────────────────────────
  SEAWEED: { s: "Coastal metal wall art", t: "Kelp and weed drifting across a landscape panel — the coastal piece in the range." },
  "ZON ZEE": { s: "Coastal metal wall art", t: "Sun and water worked into one drawing, to 2.3 metres square at the larger size." },
  NEA: { s: "Coastal metal wall art", t: "An upright coastal panel, taller than it is wide, for a narrower wall." },

  // ── IKONA ─────────────────────────────────────────────────────────────
  VASUKI: { s: "Large sculptural metal wall art", t: "The largest wall work in the catalogue — 4.2 metres at the extra-large size, cut in five parts and joined on the wall. Made for a facade, a foyer or a double-height space." },
  MAHOLA: { s: "Tall metal wall panel", t: "A narrow upright panel to 2.4 metres, cut fine enough to read as texture from across a room." },
  "GEO LEAF": { s: "Geometric leaf metal wall art", t: "Leaf drawn as geometry — straight cuts and hard angles instead of a botanical line." },

  // ── PENDANTS ──────────────────────────────────────────────────────────
  LIBRATUM: { s: "Tall metal wall panel", t: "A pendant panel — under half a metre wide, up to three metres tall. Made for a pier, a stairwell or either side of a door." },
  METROPOLIS: { s: "Metal wall panel", t: "A horizontal city line, cut across a landscape panel to just over two metres." },
  BENIN: { s: "Tall metal wall panel", t: "A pendant drawn from West African pattern, to three metres tall." },
  SANUR: { s: "Tall metal wall panel", t: "A pendant carrying an Indonesian-drawn pattern, narrow and full height." },
  SALAMANKA: { s: "Metal wall panel", t: "A wide pendant panel, to two metres across at the larger size." },

  // ── OBLIATIONES ───────────────────────────────────────────────────────
  OBLIATIONES: { s: "Round metal wall art", t: "A cut disc in four sizes from 550 mm to 1.5 metres — the smallest of the round pieces, and the easiest to hang in a group." },
  "OBLIATIONES — Large": { s: "Round metal wall art", t: "The larger cut of the same disc, to 1.5 metres." },
  "OBLIATIONES TIBETAN — Patha": { s: "Round metal wall art", t: "A 1.45 metre disc drawn from Tibetan pattern — dense cutting, even weight across the circle." },
  OKO: { s: "Metal wall art panel", t: "A single eye-like form filling the panel, upright or landscape depending on the size." },

  // ── BIRDS ─────────────────────────────────────────────────────────────
  "BIRDY NUM NUM": { s: "Bird metal wall art", t: "Birds settled through branch and leaf, cut as one panel to 1.66 metres." },
  SWALLOWS: { s: "Bird metal wall art", t: "Swallows in flight, cut as separate birds and set across the wall in a drift rather than a single panel." },
  WREN: { s: "Bird metal wall art", t: "A wren, cut small and fine. Made to size for the wall it goes on." },

  // ── RETRO ─────────────────────────────────────────────────────────────
  JEAGER: { s: "Retro metal wall art", t: "A long horizontal band of mid-century pattern — 2.4 metres wide, half a metre high. Sits above a sideboard or a bedhead." },
  "HALSTON Tall": { s: "Retro metal wall art", t: "The HALSTON pattern run upright to 2.4 metres." },
  "ZED O": { s: "Round retro metal wall art", t: "A 1.6 metre disc of repeating retro cut-out." },
  ZED: { s: "Retro metal wall art", t: "The ZED pattern as a flat panel — hard geometry, evenly repeated." },

  // ── VITAE ─────────────────────────────────────────────────────────────
  "VITAE — SHIOGI": { s: "Metal wall art panel", t: "The SHIOGI drawing held inside the VITAE panel — a solid rectangle with the line cut through it." },

  // ── CUSTOM ────────────────────────────────────────────────────────────
  "LIBRATUM — Custom": { s: "Custom metal wall panel", t: "The LIBRATUM pendant cut to your own height and width." },
  "CREEPING FIG — Custom": { s: "Custom creeping fig metal wall art", t: "The creeping fig drawn to your wall — the run, the density and the size all set before cutting." },

  // ── SCULPTURE — The Classics ──────────────────────────────────────────
  MARAKESH: { s: "Corten steel garden sculpture", t: "A freestanding garden sculpture in Corten steel, 1.5 to 2.1 metres tall, weathering to rust outdoors. Sits in a bed, on a lawn or in gravel." },
  PAVIA: { s: "Corten steel garden sculpture", t: "One of the original ROGETjames forms — freestanding, cut and folded, weathering outdoors." },
  MOWHITI: { s: "Corten steel garden sculpture", t: "A freestanding sculpture built from repeating cut sections, open enough to see the garden through it." },
  OMARE: { s: "Corten steel garden sculpture", t: "A tall freestanding form to 2.4 metres — the largest of the classics." },

  // ── SCULPTURE — Leaf Sculptures ───────────────────────────────────────
  "AUTUMN LEAF": { s: "Leaf garden sculpture", t: "A single leaf standing on its stem, 1.5 to 2.4 metres tall. In Corten it rusts down to the colour of the season it's named for." },
  "VILLA LEAF": { s: "Leaf garden sculpture", t: "A narrower standing leaf, to 2.4 metres — for a bed too tight for the Autumn Leaf." },

  // ── SCULPTURE — Bon Bons & Genie Bottles ──────────────────────────────
  "BON BON": { s: "Freestanding garden sculpture", t: "A turned, bottle-like form standing 1.8 or 3 metres tall. Best in a group of two or three at different heights." },
  MEDINA: { s: "Freestanding garden sculpture", t: "A standing sculpture drawn from Moroccan pattern, cut so light passes through it." },
};

// Piece pages Google should NOT be shown — nothing here yet; kept so a piece
// can be held back without deleting its page.
export const HIDDEN_PIECES = [];
