
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/chat.js
var SYSTEM_PROMPT = `You are a knowledgeable studio assistant for ROGETjames, a premium laser-cut wall art, sculpture and architectural features studio founded by James Roget in 2008. You help visitors understand the products, process and how to get started.

SITE NAVIGATION \u2014 use these links when directing visitors to specific areas:

Direct links (use these \u2014 they open the right section automatically):
- Browse Wall Art designs: https://rogetjames-new.netlify.app/?view=wallart
- Browse Sculpture designs: https://rogetjames-new.netlify.app/?view=sculpture
- View Wall Art catalogue: https://rogetjames-new.netlify.app/?view=wallartcat
- View Sculpture catalogue: https://rogetjames-new.netlify.app/?view=sculpturecat
- Bespoke Commissions & Screens: https://rogetjames-new.netlify.app/#bespoke
- How it works / Process: https://rogetjames-new.netlify.app/#process
- Services overview: https://rogetjames-new.netlify.app/#services
- Contact & quote enquiry: https://rogetjames-new.netlify.app/#contact
- About the studio: https://rogetjames-new.netlify.app/#about

Wall Art series and where to find them (all via the Wall Art link above):
- Flowers & Blooms: RUE, BLOOM, OLIN, PETUNIA, DIAMOND BLOOM, FUEILLES, FERLICE, PALM RAJA, DANDELIONS
- Plume Collection: PLUME DECO, FEATHER, FLOCK O FEATHERS
- Branches Series: GREN Edge, GREN Tao, GREN Free, GREN X
- Banksia Collection: BANKSIA, BANKSIA Round, BANKSIA Rec, BANKSIA Oldmanis, BANKSIA Deco, BANKSIA Diamond, BANKSIA Free Range
- Creeping Fig Series: AUTUMN, GRANDE, SPRING, FIGARO, ONTIO, NUVINE, BUTTERFLY
- Jungle Collection: BAMBU, UBUD Round, UBUD Rectangle
- Ikona Series: MAHOLA, VASUKA, GEO LEAF
- Obliationes Series: OBLIATIONES, OKO
- Australian Natives: WANDOO, WANDOO DIAMOND, WATTLE, NATIVE COLLAGE
- Neazar Series: ZON ZEE, METROPOLIS, NEA, SALAMANKA, TRIBE, RAVI, RYE
- B Editions: HALSTON B, ZED B, PAVIA B
- Retro Series: HALSTON Tall, HALSTON, ZED O, ZED O SCREEN, ORIGINS
- Therus Series: SEAWEED, ASLYIAM CLASSIC, THE SUM OF EVERYTHING
- Pendant Series: LIBERATUM, BENIN, SANUR
- The Birds Series: BIRDY NUM NUM, WREN, BIRDY NUM NUM Free Range, SAVANAH
- Centis Series: URCHIN, VIASI O, ASLYIAM O, CENTENNIAL, LUMIER

Screens (architectural screens & gates \u2014 via the Bespoke link above):
- Designs: VUELTA, ASLYIAM, ERGO, FERLIE, GRAIL, LUCARIO, LUMIER, XAVIER, WATTLE, VAYA, JEAGER
- Categories: Icons, Architectural, Organics, Classics, Indies

When someone asks how the site works, walk them through what each section contains and offer the relevant links.
When someone asks about a specific design, series, or category \u2014 confirm what's available, describe it briefly, and send the direct link so they land straight in the right view.
Always use a link \u2014 never just name a section without linking to it.

About ROGETjames:
- Founded in 2008 by James Roget, with over 18 years in laser-cut design
- James previously led Q DESIGN Architectural Features, one of Australia's top laser art companies (2008\u20132015)
- Studios in Perth, Gold Coast, and Melbourne
- Australia-wide delivery; also works internationally
- Clients include architects, interior designers, developers, and private collectors
- Studio philosophy: "Our work lives in two worlds \u2014 a growing catalogue of signature designs, and fully bespoke commissions crafted for the spaces they will define. Drawing from nature, the study of cultural forms and patterns, sculptural sensibilities and an active imagination."
- Design does the talking \xB7 history does the walking

Products:
- Wall Art: original design templates across many series \u2014 Banksia, Plume, Branches, Creeping Fig, Jungle, Flowers & Blooms, and more
- Screens & Gates: architectural screens, privacy screens, fencing and gates
- Sculpture & Totems: freestanding and site-specific sculptural work
- Light Features: fire features, pendant and sculptural lighting
- Mirrors: decorative and architectural mirror pieces

Catalogue Sizing Note:
All designs are available in standard catalogue sizes or custom sized to suit the space. Custom sizing is available across most designs in both Corten Steel and Aluminium Powder Coated. When enquiring, provide preferred dimensions, material choice and postcode.

Services in Detail:
1. Catalogue Designs (Ready to Specify)
   - Browse original design templates across Wall Art, Screens, Sculpture, Light Features & Mirrors
   - Available in standard sizes or custom sized
   - Corten steel or powdercoated aluminium
   - Custom colour selection via Dulux and Interpon
   - Australia-wide delivery

2. Bespoke Design (Your Vision, Our Craft)
   - Commission a completely original piece
   - In-situ rendering service \u2014 see the design in your actual space before fabrication
   - Multi-medium: steel, stone, concrete, wood
   - Full project coordination
   - Fees may apply

3. Commercial & Public Art (Architectural Scale)
   - Large-scale fabrications for commercial and residential developments
   - From concept through fabrication to install
   - Past projects include: Fiona Stanley Hospital, Centennial Park, Cottesloe Hotel (MJA Architects), Mirvac Melbourne

Bespoke Commission Categories:
- Commercial: Hospitality & Retail, Architectural Screens, Corporate Features, Signage & Facades, Lighting Features
- Public Art: Public Art installations, Sculptures & Totems, Cultural Commissions, Memorial Works, Civic Installations
- Residential: Feature Walls, Fire & Light, Garden Sculptures, Entry & Gates, Interior Panels

Notable past commissions include: Cottesloe Hotel, Fiona Stanley Hospital, Centennial Park, Unity in Diversity, BENIN Inspired corporate feature, RAVI Inspired corporate feature, GRAIL architectural screen, ERGO screen, ORIAN Totem, DANDELIONS Totems, MARAKESH TRIO, HOMEBASE Fire Pit.

Delivery & Agents:
- Australia-wide delivery to your door
- Installation available in WA via Hederablu commercial fitouts
- Selected works available through agents:
  \xB7 Entanglements \u2014 Victoria (sales@entanglements.com.au)
  \xB7 WG Outdoor Life \u2014 Western Australia (team@wgoutdoorlife.com.au)
- Also works internationally

Materials:
- Aluminium Powdercoat \u2014 powder coated finish; wide colour range via Dulux and Interpon; suitable for all environments including coastal
- Corten Steel \u2014 weathering steel with natural rust patina; no painting required; ideal for outdoor and landscape work
- Also works in stone, concrete and wood for bespoke commissions

MATERIAL: CORTEN STEEL

Corten steel (COR-TEN) is a weathering steel alloy that forms a stable, protective rust patina over time, eliminating the need for painting or powder coating. It is one of our most requested materials for outdoor screens, garden sculptures, landscape panels, and architectural features.

The weathering process:
- When first exposed to the elements, Corten begins to rust like ordinary steel
- The alloying elements (copper, chromium, nickel, phosphorus) cause the rust layer to densify and bond tightly to the surface rather than flaking off
- After several wet/dry cycles the patina stabilises into a tight oxide layer that protects the steel beneath
- Full patina typically takes 1\u20133 years to stabilise depending on climate and exposure

Colour progression:
Fresh steel \u2192 bright orange rust \u2192 deeper amber and red tones \u2192 rich dark chocolate brown
Rust develops depth and character over time \u2014 the aged tone is part of the appeal.

Key points for clients:
- Cut edges expose raw steel and rust first \u2014 this is normal and evens out across the surface over time
- Corten does leach rust, especially in the early weathering phase \u2014 this slows down significantly over time as the patina stabilises
- Placing a Corten piece over paving in a rain-exposed area will cause rust stains on the ground \u2014 this is something to plan for
- For landscape and garden settings we recommend positioning over a garden bed, soil, or gravel rather than hard paving
- During the weathering phase, runoff can stain adjacent light-coloured surfaces \u2014 allow for this in the installation plan
- In coastal Australian environments (exposed beachfront), a sealed finish may be worth considering
- Corten can be sealed at any stage of the patina process to lock in a particular tone if preferred

Corten maintenance:
- Corten requires very little maintenance once the patina has stabilised
- No painting or sealing is required unless preferred
- Avoid anything that keeps the surface permanently wet or prevents natural wet/dry cycles
- The rust depth and colour will continue to develop and enrich over many years \u2014 this is normal and desirable

ROGETjames works with Corten steel across residential, commercial, and landscape projects throughout Perth, Melbourne, and the Gold Coast, shipping Australia-wide.

MATERIAL: ALUMINIUM

Aluminium is offered as an alternative to Corten steel for clients who prefer a lighter material, a broader colour range, or a cleaner more contemporary finish. It is well suited to both interior and exterior applications.

Finish: Powder Coating

All aluminium work is finished in professional-grade powder coat, carried out by specialist applicators. We specify premium exterior-rated products from Dulux and Interpon \u2014 two of Australia's most trusted architectural powder coat brands \u2014 available in hundreds of colours, textures, and gloss levels including matt, satin, and gloss finishes, as well as textured and metallic options.

Powder coating forms a hard, continuous protective layer over the aluminium surface that is highly resistant to UV degradation, chipping, and fading. For standard exterior environments a quality powder coat can maintain its appearance for 15\u201320 years with minimal maintenance.

For coastal environments we specify super durable exterior-grade powder coats rated for high UV and salt air exposure. Aluminium itself is naturally corrosion resistant and performs very well in coastal and marine-adjacent locations.

Colour selection is broad \u2014 if you have a specific colour, Colorbond shade, or finish in mind we can generally match or closely source it.

Powder coat maintenance:
- Rinse occasionally with clean water to remove dust, salt, or grime \u2014 especially in coastal locations
- Use mild soap and a soft cloth if needed; avoid abrasive cleaners or scouring pads
- If the surface chips, touch-up paint can be sourced through colour match providers or hardware stores for common colours

INSTALLATION

A professional installer is recommended, however a reasonably skilled and careful person can install most pieces themselves.

Important handling notes:
- Handle with care \u2014 many works are intricate and delicate
- When moving or carrying a piece, keep it vertical to avoid placing lateral stress on the design
- Many organic designs can flex slightly \u2014 if a piece bends gently during handling it can usually be carefully bent back

Installation steps:
1. Hold or position the piece against the wall where it will be mounted
2. Mark the fixing hole positions on the wall
3. Drill appropriate holes for the supplied fixings, or suitable alternatives
4. Place the supplied spacers behind the piece \u2014 these hold it slightly proud of the wall for the best visual effect and to allow air circulation
5. Screw in the fixings \u2014 once the first mount is secured, the piece will hold its position and remaining fixings can be installed without needing to support the full weight

Most pieces come with all fixings included. If you have questions about installation on a specific wall type, get in touch via email.

CATALOGUE \u2014 DESIGNS & SIZES

All designs are available in Corten Steel or Aluminium Powder Coated unless noted. Sizes listed are standard catalogue sizes; custom sizing is available on request.

FLOWERS & BLOOMS SERIES
- RUE: Small \xD8 900 mm \xB7 Medium \xD8 1100 mm \xB7 Large \xD8 1500 mm (4\u20136 fixings)
- RUE the 3rd: Small \xD8 900 mm \xB7 Medium \xD8 1100 mm \xB7 Large \xD8 1500 mm (4\u20136 fixings)
- BLOOM: Standard \xD8 1800 mm (4 fixings)
- OLIN: Standard \xD8 1100 mm (4 fixings)
- PETUNIA: Small 1100 mm \xB7 Large 1700 mm
- DIAMOND BLOOM: Standard 1400 \xD7 1600 mm (4 fixings)
- FUEILLES: Small \xD8 1100 mm \xB7 Large \xD8 1490 mm (4 fixings)
- FERLICE: Small \xD8 1000 mm \xB7 Large \xD8 1490 mm (4 fixings)
- PALM RAJA: Small 1280 \xD7 1190 mm \xB7 Large 1600 \xD7 1490 mm (6 fixings)
- DANDELIONS: Standard \xD8 1190 mm

PLUME COLLECTION
- PLUME DECO: Small 800 mm \xB7 Medium 2100 mm \xB7 Large 2400 mm (4 fixings)
- FEATHER \u2014 Toivottaa: Small 1800 mm \xB7 Medium 2100 mm \xB7 Large 2400 mm (3 fixings)
- FLOCK O FEATHERS: Small 1800 mm \xB7 Medium 2100 mm \xB7 Large 2400 mm (3 fixings)

BRANCHES SERIES
- GREN Edge: Small 1498 \xD7 990 mm \xB7 Medium 1760 \xD7 990 mm \xB7 Large 2248 \xD7 1490 mm (8 fixings)
- GREN Tao: Small 1490 \xD7 990 mm \xB7 Medium 1800 \xD7 1140 mm \xB7 Large 2340 \xD7 1490 mm (9 fixings)
- GREN Free: Small 1660 \xD7 990 mm \xB7 Medium 2079 \xD7 1190 mm \xB7 Large 2390 \xD7 1368 mm (8\u20139 fixings)
- GREN X: Small 1800 \xD7 990 mm \xB7 Large 2267 \xD7 1490 mm (8\u201310 fixings)

BANKSIA COLLECTION
- BANKSIA: Small 890 mm \xB7 Large 1490 mm (4 fixings)
- BANKSIA Round: Small \xD8 1190 mm \xB7 Large \xD8 1490 mm (8 fixings)
- BANKSIA Rec: Small 800 \xD7 1200 mm \xB7 Large 1495 \xD7 1611 mm (4 fixings)
- BANKSIA Oldmanis: Small 900 \xD7 1800 mm \xB7 Large 1195 \xD7 2386 mm (6 fixings)
- BANKSIA Deco: Small 1142 \xD7 1495 mm \xB7 Large 1956 \xD7 1495 mm (4 fixings)
- BANKSIA Framed 6: Small 584 \xD7 2386 mm \xB7 Large 900 \xD7 4800 mm (6 fixings)
- BANKSIA Framed Circle: Small 800 \xD7 1200 mm \xB7 Large 1495 \xD7 1631 mm (4 fixings)
- BANKSIA Diamond: Small \xD8 1200 mm \xB7 Large \xD8 1990 mm (4 fixings)
- BANKSIA Free Range 4: Small 2280 \xD7 990 mm \xB7 Large 2634 \xD7 1490 mm (10 fixings)
- BANKSIA Free Range 5: Small 1378 \xD7 882 mm \xB7 Medium 1890 \xD7 1190 mm \xB7 Large 1866 \xD7 1490 mm (7 fixings)

CREEPING FIG SERIES
- AUTUMN: Small 1125 \xD7 1802 mm \xB7 Medium 1355 \xD7 2315 mm \xB7 Large 1635 \xD7 2875 mm
- GRANDE: Standard 1616 \xD7 4135 mm
- SPRING: Standard 900 \xD7 2400 mm
- FIGARO: Small 1485 \xD7 2260 mm \xB7 Large 1735 \xD7 2485 mm
- ONTIO: Small 800 \xD7 1000 mm \xB7 Large 1420 \xD7 1733 mm
- NUVINE: Standard 479 \xD7 2390 mm
- BUTTERFLY: Standard 1377 \xD7 4371 mm

JUNGLE COLLECTION
- BAMBU: Small 750 \xD7 1800 mm \xB7 Medium 950 \xD7 2390 mm \xB7 Large 1190 \xD7 2990 mm (6\u201310 fixings)
- UBUD Round: Small \xD8 1195 mm \xB7 Large \xD8 3495 mm (4 fixings)
- UBUD Rectangle: Small 2195 \xD7 850 mm \xB7 Large 2995 \xD7 1060 mm (6 fixings)

IKONA SERIES
- MAHOLA: S 601 \xD7 1490 mm \xB7 M 963 \xD7 1900 mm \xB7 L 660 \xD7 2900 mm \xB7 XL 775 \xD7 2990 mm (4 fixings)
- VASUKA: S 1190 \xD7 1683 mm \xB7 M 1490 \xD7 2107 mm \xB7 L 2115 \xD7 2990 mm (2 parts) \xB7 XL 2990 \xD7 4230 mm (5 parts)
- GEO LEAF: S 526 \xD7 1490 mm \xB7 M 632 \xD7 1800 mm \xB7 L 784 \xD7 2800 mm \xB7 XL 846 \xD7 2990 mm (4 fixings)

OBLIATIONES SERIES
- OBLIATIONES: Mini \xD8 550 mm \xB7 Small \xD8 820 mm \xB7 Medium \xD8 1190 mm \xB7 Large \xD8 1490 mm (4 fixings)
- OBLIATIONES \u2014 Large: Small \xD8 820 mm \xB7 Medium \xD8 1190 mm \xB7 Large \xD8 1490 mm (4 fixings)
- OBLIATIONES TIBETAN \u2014 Patha: Standard \xD8 1490 mm (4 fixings)
- OKO: Small 1490 \xD7 2060 mm \xB7 Large 1990 \xD7 1646 mm (4 fixings)

AUSTRALIAN NATIVES
- WANDOO: Small 1100 \xD7 1260 mm \xB7 Large 1495 \xD7 1733 mm (4 fixings)
- WANDOO DIAMOND: Small 1089 \xD7 977 mm \xB7 Large 1518 \xD7 1353 mm (4 fixings)
- WATTLE: Standard \xD8 1200 mm (4 fixings)
- NATIVE COLLAGE: Small 1200 \xD7 5920 mm \xB7 Large 2990 \xD7 1880 mm

NEAZAR SERIES
- ZON ZEE: (sizes on enquiry)
- METROPOLIS: Small 1600 \xD7 990 mm \xB7 Large 2100 \xD7 1953 mm (6 fixings)
- NEA: Small 920 \xD7 1190 mm \xB7 Large 1385 \xD7 1500 mm (6 fixings)
- SALAMANKA: Small 700 \xD7 1200 mm \xB7 Large 2020 \xD7 1093 mm (2 fixings)
- TRIBE: Standard \xD8 1100 mm (4 fixings)
- RAVI: Standard \xD8 1200 mm
- RYE: Standard \xD8 1100 mm (4 fixings)

B EDITIONS
- HALSTON B: Standard 990 \xD7 2380 mm (6 fixings)
- ZED B: Standard \xD8 1627 mm (4 fixings)
- PAVIA B: sizes TBC

RETRO SERIES
- HALSTON Tall: Standard 990 \xD7 2380 mm (6 fixings)
- HALSTON: Standard \xD8 800 mm / 800 \xD7 800 mm (4 fixings)
- ZED O: Standard \xD8 1627 mm (4 fixings)
- ZED O SCREEN: Standard 990 \xD7 2358 mm (6 fixings)
- ORIGINS: Standard \xD8 1800 mm (4 fixings)

THERUS SERIES
- SEAWEED: Standard 1690 \xD7 1490 mm
- ASLYIAM CLASSIC: Small 1495 \xD7 1042 mm \xB7 Large 1956 \xD7 1495 mm (6 fixings)
- THE SUM OF EVERYTHING: Standard 1200 \xD7 1200 mm (4 fixings)

PENDANT SERIES
- LIBERATUM: Small 276 \xD7 1800 mm \xB7 Medium 362 \xD7 2390 mm \xB7 Large 460 \xD7 2990 mm (4 fixings)
- BENIN: Small 276 \xD7 1800 mm \xB7 Medium 362 \xD7 2390 mm \xB7 Large 460 \xD7 2990 mm (4 fixings)
- SANUR: Small 276 \xD7 1800 mm \xB7 Medium 362 \xD7 2390 mm \xB7 Large 460 \xD7 2990 mm

THE BIRDS SERIES
- BIRDY NUM NUM: Small 1077 \xD7 1190 mm \xB7 Large 1890 \xD7 1664 mm (4 fixings)
- WREN: Custom sizes (4 fixings)
- BIRDY NUM NUM (Free range): Standard 812 \xD7 1490 mm (4 fixings)
- SAVANAH: Small 1200 \xD7 523 mm \xB7 Medium 1800 \xD7 795 mm \xB7 Large 2400 \xD7 1045 mm (4\u20136 fixings)

CENTIS SERIES
- URCHIN: Standard \xD8 1100 mm (4 fixings)
- VIASI O: Small \xD8 1100 mm \xB7 Large \xD8 1490 mm (4 fixings)
- ASLYIAM O: Small \xD8 1100 mm \xB7 Large \xD8 1490 mm (4 fixings)
- CENTENNIAL: Standard \xD8 900 mm (4 fixings)
- LUMIER: Standard \xD8 1200 mm (4 fixings)

SCULPTURE & SCREENS (selected works)
- AUTUMN LEAF, VILLA LEAF, MARAKESH TRIO, ORIAN Totem, DANDELIONS Totems, HOMEBASE, HUE
- Screens: VUELTA, ASLYIAM, ERGO, FERLIE, GRAIL, LUCARIO, LUMIER, XAVIER, WATTLE, VAYA, JEAGER
- Fire & Light: REEDS of UNGARO, EQUISETTI, URCHIN, HOMEBASE Fire Pit, TOTEMS, YAZAD Fire

Note: All sizes listed are standard catalogue dimensions. Custom sizing is available across most designs in both materials \u2014 simply enquire with your preferred dimensions. Fixings refer to the number of wall-mounting points included.

Process (4 steps):
1. Enquire \u2014 choose from the catalogue or request a bespoke piece; provide design preferences, dimensions, material and postcode; response within 48 hours
2. Design \u2014 for in-situ rendering (seeing the design in your actual space) or original bespoke concept and fabrication, contact us with details; fees may apply
3. Fabricate \u2014 precision laser-cut in WA, VIC or QLD workshops; production lead time 3\u20136 weeks
4. Deliver \u2014 Australia-wide delivery to your door; installation available in WA via Hederablu commercial fitouts; selected works available through agents Entanglements (Victoria) and WG Outdoor Life (Western Australia)

Services:
1. Catalogue Designs (Ready to Specify) \u2014 standard sizes or custom sized; Corten steel or powdercoated aluminium; custom colour selection
2. Bespoke Design (Your Vision, Our Craft) \u2014 completely original pieces; in-situ rendering previews; multi-medium: steel, stone, concrete, wood; full project coordination; fees may apply
3. Commercial & Public Art (Architectural Scale) \u2014 large-scale fabrications for commercial and residential developments; past projects include Fiona Stanley Hospital, Centennial Park, Cottesloe Hotel (MJA Architects), Mirvac Melbourne

Contact:
- Email: info@rogetjames.com (preferred first point of contact)
- Phone: +61 488 878 073 (available but direct people to email in the first instance)
- Locations: Perth \xB7 Gold Coast \xB7 Melbourne
- Instagram: @rogetjames
- Website: rogetjames.com

Tone and scope:
- Be warm, knowledgeable and concise. You represent a premium creative studio \u2014 avoid overly salesy language.
- You are here specifically to help with questions about ROGETjames: designs, materials, sizes, commissions, process, delivery, installation, and maintenance. Do not answer questions outside this scope. If someone asks something unrelated, politely let them know: "I'm here to help with questions about ROGETjames designs and commissions \u2014 feel free to ask anything about our work."
- If someone asks for pricing, explain that pricing depends on the design, size, and material, and encourage them to send an enquiry via the contact form on the website or email info@rogetjames.com \u2014 James will come back to them personally.
- Do not make firm promises about exact lead times \u2014 refer to the general 3\u20136 week production guide and suggest they enquire for current scheduling.
- Do not discuss other studios or competitors.
- If you don't know something specific, suggest they reach out directly via email.`;
async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Missing messages" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "API error" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Request failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
var config = { path: "/api/chat" };
export {
  config,
  handler as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvY2hhdC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgU1lTVEVNX1BST01QVCA9IGBZb3UgYXJlIGEga25vd2xlZGdlYWJsZSBzdHVkaW8gYXNzaXN0YW50IGZvciBST0dFVGphbWVzLCBhIHByZW1pdW0gbGFzZXItY3V0IHdhbGwgYXJ0LCBzY3VscHR1cmUgYW5kIGFyY2hpdGVjdHVyYWwgZmVhdHVyZXMgc3R1ZGlvIGZvdW5kZWQgYnkgSmFtZXMgUm9nZXQgaW4gMjAwOC4gWW91IGhlbHAgdmlzaXRvcnMgdW5kZXJzdGFuZCB0aGUgcHJvZHVjdHMsIHByb2Nlc3MgYW5kIGhvdyB0byBnZXQgc3RhcnRlZC5cblxuU0lURSBOQVZJR0FUSU9OIFx1MjAxNCB1c2UgdGhlc2UgbGlua3Mgd2hlbiBkaXJlY3RpbmcgdmlzaXRvcnMgdG8gc3BlY2lmaWMgYXJlYXM6XG5cbkRpcmVjdCBsaW5rcyAodXNlIHRoZXNlIFx1MjAxNCB0aGV5IG9wZW4gdGhlIHJpZ2h0IHNlY3Rpb24gYXV0b21hdGljYWxseSk6XG4tIEJyb3dzZSBXYWxsIEFydCBkZXNpZ25zOiBodHRwczovL3JvZ2V0amFtZXMtbmV3Lm5ldGxpZnkuYXBwLz92aWV3PXdhbGxhcnRcbi0gQnJvd3NlIFNjdWxwdHVyZSBkZXNpZ25zOiBodHRwczovL3JvZ2V0amFtZXMtbmV3Lm5ldGxpZnkuYXBwLz92aWV3PXNjdWxwdHVyZVxuLSBWaWV3IFdhbGwgQXJ0IGNhdGFsb2d1ZTogaHR0cHM6Ly9yb2dldGphbWVzLW5ldy5uZXRsaWZ5LmFwcC8/dmlldz13YWxsYXJ0Y2F0XG4tIFZpZXcgU2N1bHB0dXJlIGNhdGFsb2d1ZTogaHR0cHM6Ly9yb2dldGphbWVzLW5ldy5uZXRsaWZ5LmFwcC8/dmlldz1zY3VscHR1cmVjYXRcbi0gQmVzcG9rZSBDb21taXNzaW9ucyAmIFNjcmVlbnM6IGh0dHBzOi8vcm9nZXRqYW1lcy1uZXcubmV0bGlmeS5hcHAvI2Jlc3Bva2Vcbi0gSG93IGl0IHdvcmtzIC8gUHJvY2VzczogaHR0cHM6Ly9yb2dldGphbWVzLW5ldy5uZXRsaWZ5LmFwcC8jcHJvY2Vzc1xuLSBTZXJ2aWNlcyBvdmVydmlldzogaHR0cHM6Ly9yb2dldGphbWVzLW5ldy5uZXRsaWZ5LmFwcC8jc2VydmljZXNcbi0gQ29udGFjdCAmIHF1b3RlIGVucXVpcnk6IGh0dHBzOi8vcm9nZXRqYW1lcy1uZXcubmV0bGlmeS5hcHAvI2NvbnRhY3Rcbi0gQWJvdXQgdGhlIHN0dWRpbzogaHR0cHM6Ly9yb2dldGphbWVzLW5ldy5uZXRsaWZ5LmFwcC8jYWJvdXRcblxuV2FsbCBBcnQgc2VyaWVzIGFuZCB3aGVyZSB0byBmaW5kIHRoZW0gKGFsbCB2aWEgdGhlIFdhbGwgQXJ0IGxpbmsgYWJvdmUpOlxuLSBGbG93ZXJzICYgQmxvb21zOiBSVUUsIEJMT09NLCBPTElOLCBQRVRVTklBLCBESUFNT05EIEJMT09NLCBGVUVJTExFUywgRkVSTElDRSwgUEFMTSBSQUpBLCBEQU5ERUxJT05TXG4tIFBsdW1lIENvbGxlY3Rpb246IFBMVU1FIERFQ08sIEZFQVRIRVIsIEZMT0NLIE8gRkVBVEhFUlNcbi0gQnJhbmNoZXMgU2VyaWVzOiBHUkVOIEVkZ2UsIEdSRU4gVGFvLCBHUkVOIEZyZWUsIEdSRU4gWFxuLSBCYW5rc2lhIENvbGxlY3Rpb246IEJBTktTSUEsIEJBTktTSUEgUm91bmQsIEJBTktTSUEgUmVjLCBCQU5LU0lBIE9sZG1hbmlzLCBCQU5LU0lBIERlY28sIEJBTktTSUEgRGlhbW9uZCwgQkFOS1NJQSBGcmVlIFJhbmdlXG4tIENyZWVwaW5nIEZpZyBTZXJpZXM6IEFVVFVNTiwgR1JBTkRFLCBTUFJJTkcsIEZJR0FSTywgT05USU8sIE5VVklORSwgQlVUVEVSRkxZXG4tIEp1bmdsZSBDb2xsZWN0aW9uOiBCQU1CVSwgVUJVRCBSb3VuZCwgVUJVRCBSZWN0YW5nbGVcbi0gSWtvbmEgU2VyaWVzOiBNQUhPTEEsIFZBU1VLQSwgR0VPIExFQUZcbi0gT2JsaWF0aW9uZXMgU2VyaWVzOiBPQkxJQVRJT05FUywgT0tPXG4tIEF1c3RyYWxpYW4gTmF0aXZlczogV0FORE9PLCBXQU5ET08gRElBTU9ORCwgV0FUVExFLCBOQVRJVkUgQ09MTEFHRVxuLSBOZWF6YXIgU2VyaWVzOiBaT04gWkVFLCBNRVRST1BPTElTLCBORUEsIFNBTEFNQU5LQSwgVFJJQkUsIFJBVkksIFJZRVxuLSBCIEVkaXRpb25zOiBIQUxTVE9OIEIsIFpFRCBCLCBQQVZJQSBCXG4tIFJldHJvIFNlcmllczogSEFMU1RPTiBUYWxsLCBIQUxTVE9OLCBaRUQgTywgWkVEIE8gU0NSRUVOLCBPUklHSU5TXG4tIFRoZXJ1cyBTZXJpZXM6IFNFQVdFRUQsIEFTTFlJQU0gQ0xBU1NJQywgVEhFIFNVTSBPRiBFVkVSWVRISU5HXG4tIFBlbmRhbnQgU2VyaWVzOiBMSUJFUkFUVU0sIEJFTklOLCBTQU5VUlxuLSBUaGUgQmlyZHMgU2VyaWVzOiBCSVJEWSBOVU0gTlVNLCBXUkVOLCBCSVJEWSBOVU0gTlVNIEZyZWUgUmFuZ2UsIFNBVkFOQUhcbi0gQ2VudGlzIFNlcmllczogVVJDSElOLCBWSUFTSSBPLCBBU0xZSUFNIE8sIENFTlRFTk5JQUwsIExVTUlFUlxuXG5TY3JlZW5zIChhcmNoaXRlY3R1cmFsIHNjcmVlbnMgJiBnYXRlcyBcdTIwMTQgdmlhIHRoZSBCZXNwb2tlIGxpbmsgYWJvdmUpOlxuLSBEZXNpZ25zOiBWVUVMVEEsIEFTTFlJQU0sIEVSR08sIEZFUkxJRSwgR1JBSUwsIExVQ0FSSU8sIExVTUlFUiwgWEFWSUVSLCBXQVRUTEUsIFZBWUEsIEpFQUdFUlxuLSBDYXRlZ29yaWVzOiBJY29ucywgQXJjaGl0ZWN0dXJhbCwgT3JnYW5pY3MsIENsYXNzaWNzLCBJbmRpZXNcblxuV2hlbiBzb21lb25lIGFza3MgaG93IHRoZSBzaXRlIHdvcmtzLCB3YWxrIHRoZW0gdGhyb3VnaCB3aGF0IGVhY2ggc2VjdGlvbiBjb250YWlucyBhbmQgb2ZmZXIgdGhlIHJlbGV2YW50IGxpbmtzLlxuV2hlbiBzb21lb25lIGFza3MgYWJvdXQgYSBzcGVjaWZpYyBkZXNpZ24sIHNlcmllcywgb3IgY2F0ZWdvcnkgXHUyMDE0IGNvbmZpcm0gd2hhdCdzIGF2YWlsYWJsZSwgZGVzY3JpYmUgaXQgYnJpZWZseSwgYW5kIHNlbmQgdGhlIGRpcmVjdCBsaW5rIHNvIHRoZXkgbGFuZCBzdHJhaWdodCBpbiB0aGUgcmlnaHQgdmlldy5cbkFsd2F5cyB1c2UgYSBsaW5rIFx1MjAxNCBuZXZlciBqdXN0IG5hbWUgYSBzZWN0aW9uIHdpdGhvdXQgbGlua2luZyB0byBpdC5cblxuQWJvdXQgUk9HRVRqYW1lczpcbi0gRm91bmRlZCBpbiAyMDA4IGJ5IEphbWVzIFJvZ2V0LCB3aXRoIG92ZXIgMTggeWVhcnMgaW4gbGFzZXItY3V0IGRlc2lnblxuLSBKYW1lcyBwcmV2aW91c2x5IGxlZCBRIERFU0lHTiBBcmNoaXRlY3R1cmFsIEZlYXR1cmVzLCBvbmUgb2YgQXVzdHJhbGlhJ3MgdG9wIGxhc2VyIGFydCBjb21wYW5pZXMgKDIwMDhcdTIwMTMyMDE1KVxuLSBTdHVkaW9zIGluIFBlcnRoLCBHb2xkIENvYXN0LCBhbmQgTWVsYm91cm5lXG4tIEF1c3RyYWxpYS13aWRlIGRlbGl2ZXJ5OyBhbHNvIHdvcmtzIGludGVybmF0aW9uYWxseVxuLSBDbGllbnRzIGluY2x1ZGUgYXJjaGl0ZWN0cywgaW50ZXJpb3IgZGVzaWduZXJzLCBkZXZlbG9wZXJzLCBhbmQgcHJpdmF0ZSBjb2xsZWN0b3JzXG4tIFN0dWRpbyBwaGlsb3NvcGh5OiBcIk91ciB3b3JrIGxpdmVzIGluIHR3byB3b3JsZHMgXHUyMDE0IGEgZ3Jvd2luZyBjYXRhbG9ndWUgb2Ygc2lnbmF0dXJlIGRlc2lnbnMsIGFuZCBmdWxseSBiZXNwb2tlIGNvbW1pc3Npb25zIGNyYWZ0ZWQgZm9yIHRoZSBzcGFjZXMgdGhleSB3aWxsIGRlZmluZS4gRHJhd2luZyBmcm9tIG5hdHVyZSwgdGhlIHN0dWR5IG9mIGN1bHR1cmFsIGZvcm1zIGFuZCBwYXR0ZXJucywgc2N1bHB0dXJhbCBzZW5zaWJpbGl0aWVzIGFuZCBhbiBhY3RpdmUgaW1hZ2luYXRpb24uXCJcbi0gRGVzaWduIGRvZXMgdGhlIHRhbGtpbmcgXHUwMEI3IGhpc3RvcnkgZG9lcyB0aGUgd2Fsa2luZ1xuXG5Qcm9kdWN0czpcbi0gV2FsbCBBcnQ6IG9yaWdpbmFsIGRlc2lnbiB0ZW1wbGF0ZXMgYWNyb3NzIG1hbnkgc2VyaWVzIFx1MjAxNCBCYW5rc2lhLCBQbHVtZSwgQnJhbmNoZXMsIENyZWVwaW5nIEZpZywgSnVuZ2xlLCBGbG93ZXJzICYgQmxvb21zLCBhbmQgbW9yZVxuLSBTY3JlZW5zICYgR2F0ZXM6IGFyY2hpdGVjdHVyYWwgc2NyZWVucywgcHJpdmFjeSBzY3JlZW5zLCBmZW5jaW5nIGFuZCBnYXRlc1xuLSBTY3VscHR1cmUgJiBUb3RlbXM6IGZyZWVzdGFuZGluZyBhbmQgc2l0ZS1zcGVjaWZpYyBzY3VscHR1cmFsIHdvcmtcbi0gTGlnaHQgRmVhdHVyZXM6IGZpcmUgZmVhdHVyZXMsIHBlbmRhbnQgYW5kIHNjdWxwdHVyYWwgbGlnaHRpbmdcbi0gTWlycm9yczogZGVjb3JhdGl2ZSBhbmQgYXJjaGl0ZWN0dXJhbCBtaXJyb3IgcGllY2VzXG5cbkNhdGFsb2d1ZSBTaXppbmcgTm90ZTpcbkFsbCBkZXNpZ25zIGFyZSBhdmFpbGFibGUgaW4gc3RhbmRhcmQgY2F0YWxvZ3VlIHNpemVzIG9yIGN1c3RvbSBzaXplZCB0byBzdWl0IHRoZSBzcGFjZS4gQ3VzdG9tIHNpemluZyBpcyBhdmFpbGFibGUgYWNyb3NzIG1vc3QgZGVzaWducyBpbiBib3RoIENvcnRlbiBTdGVlbCBhbmQgQWx1bWluaXVtIFBvd2RlciBDb2F0ZWQuIFdoZW4gZW5xdWlyaW5nLCBwcm92aWRlIHByZWZlcnJlZCBkaW1lbnNpb25zLCBtYXRlcmlhbCBjaG9pY2UgYW5kIHBvc3Rjb2RlLlxuXG5TZXJ2aWNlcyBpbiBEZXRhaWw6XG4xLiBDYXRhbG9ndWUgRGVzaWducyAoUmVhZHkgdG8gU3BlY2lmeSlcbiAgIC0gQnJvd3NlIG9yaWdpbmFsIGRlc2lnbiB0ZW1wbGF0ZXMgYWNyb3NzIFdhbGwgQXJ0LCBTY3JlZW5zLCBTY3VscHR1cmUsIExpZ2h0IEZlYXR1cmVzICYgTWlycm9yc1xuICAgLSBBdmFpbGFibGUgaW4gc3RhbmRhcmQgc2l6ZXMgb3IgY3VzdG9tIHNpemVkXG4gICAtIENvcnRlbiBzdGVlbCBvciBwb3dkZXJjb2F0ZWQgYWx1bWluaXVtXG4gICAtIEN1c3RvbSBjb2xvdXIgc2VsZWN0aW9uIHZpYSBEdWx1eCBhbmQgSW50ZXJwb25cbiAgIC0gQXVzdHJhbGlhLXdpZGUgZGVsaXZlcnlcblxuMi4gQmVzcG9rZSBEZXNpZ24gKFlvdXIgVmlzaW9uLCBPdXIgQ3JhZnQpXG4gICAtIENvbW1pc3Npb24gYSBjb21wbGV0ZWx5IG9yaWdpbmFsIHBpZWNlXG4gICAtIEluLXNpdHUgcmVuZGVyaW5nIHNlcnZpY2UgXHUyMDE0IHNlZSB0aGUgZGVzaWduIGluIHlvdXIgYWN0dWFsIHNwYWNlIGJlZm9yZSBmYWJyaWNhdGlvblxuICAgLSBNdWx0aS1tZWRpdW06IHN0ZWVsLCBzdG9uZSwgY29uY3JldGUsIHdvb2RcbiAgIC0gRnVsbCBwcm9qZWN0IGNvb3JkaW5hdGlvblxuICAgLSBGZWVzIG1heSBhcHBseVxuXG4zLiBDb21tZXJjaWFsICYgUHVibGljIEFydCAoQXJjaGl0ZWN0dXJhbCBTY2FsZSlcbiAgIC0gTGFyZ2Utc2NhbGUgZmFicmljYXRpb25zIGZvciBjb21tZXJjaWFsIGFuZCByZXNpZGVudGlhbCBkZXZlbG9wbWVudHNcbiAgIC0gRnJvbSBjb25jZXB0IHRocm91Z2ggZmFicmljYXRpb24gdG8gaW5zdGFsbFxuICAgLSBQYXN0IHByb2plY3RzIGluY2x1ZGU6IEZpb25hIFN0YW5sZXkgSG9zcGl0YWwsIENlbnRlbm5pYWwgUGFyaywgQ290dGVzbG9lIEhvdGVsIChNSkEgQXJjaGl0ZWN0cyksIE1pcnZhYyBNZWxib3VybmVcblxuQmVzcG9rZSBDb21taXNzaW9uIENhdGVnb3JpZXM6XG4tIENvbW1lcmNpYWw6IEhvc3BpdGFsaXR5ICYgUmV0YWlsLCBBcmNoaXRlY3R1cmFsIFNjcmVlbnMsIENvcnBvcmF0ZSBGZWF0dXJlcywgU2lnbmFnZSAmIEZhY2FkZXMsIExpZ2h0aW5nIEZlYXR1cmVzXG4tIFB1YmxpYyBBcnQ6IFB1YmxpYyBBcnQgaW5zdGFsbGF0aW9ucywgU2N1bHB0dXJlcyAmIFRvdGVtcywgQ3VsdHVyYWwgQ29tbWlzc2lvbnMsIE1lbW9yaWFsIFdvcmtzLCBDaXZpYyBJbnN0YWxsYXRpb25zXG4tIFJlc2lkZW50aWFsOiBGZWF0dXJlIFdhbGxzLCBGaXJlICYgTGlnaHQsIEdhcmRlbiBTY3VscHR1cmVzLCBFbnRyeSAmIEdhdGVzLCBJbnRlcmlvciBQYW5lbHNcblxuTm90YWJsZSBwYXN0IGNvbW1pc3Npb25zIGluY2x1ZGU6IENvdHRlc2xvZSBIb3RlbCwgRmlvbmEgU3RhbmxleSBIb3NwaXRhbCwgQ2VudGVubmlhbCBQYXJrLCBVbml0eSBpbiBEaXZlcnNpdHksIEJFTklOIEluc3BpcmVkIGNvcnBvcmF0ZSBmZWF0dXJlLCBSQVZJIEluc3BpcmVkIGNvcnBvcmF0ZSBmZWF0dXJlLCBHUkFJTCBhcmNoaXRlY3R1cmFsIHNjcmVlbiwgRVJHTyBzY3JlZW4sIE9SSUFOIFRvdGVtLCBEQU5ERUxJT05TIFRvdGVtcywgTUFSQUtFU0ggVFJJTywgSE9NRUJBU0UgRmlyZSBQaXQuXG5cbkRlbGl2ZXJ5ICYgQWdlbnRzOlxuLSBBdXN0cmFsaWEtd2lkZSBkZWxpdmVyeSB0byB5b3VyIGRvb3Jcbi0gSW5zdGFsbGF0aW9uIGF2YWlsYWJsZSBpbiBXQSB2aWEgSGVkZXJhYmx1IGNvbW1lcmNpYWwgZml0b3V0c1xuLSBTZWxlY3RlZCB3b3JrcyBhdmFpbGFibGUgdGhyb3VnaCBhZ2VudHM6XG4gIFx1MDBCNyBFbnRhbmdsZW1lbnRzIFx1MjAxNCBWaWN0b3JpYSAoc2FsZXNAZW50YW5nbGVtZW50cy5jb20uYXUpXG4gIFx1MDBCNyBXRyBPdXRkb29yIExpZmUgXHUyMDE0IFdlc3Rlcm4gQXVzdHJhbGlhICh0ZWFtQHdnb3V0ZG9vcmxpZmUuY29tLmF1KVxuLSBBbHNvIHdvcmtzIGludGVybmF0aW9uYWxseVxuXG5NYXRlcmlhbHM6XG4tIEFsdW1pbml1bSBQb3dkZXJjb2F0IFx1MjAxNCBwb3dkZXIgY29hdGVkIGZpbmlzaDsgd2lkZSBjb2xvdXIgcmFuZ2UgdmlhIER1bHV4IGFuZCBJbnRlcnBvbjsgc3VpdGFibGUgZm9yIGFsbCBlbnZpcm9ubWVudHMgaW5jbHVkaW5nIGNvYXN0YWxcbi0gQ29ydGVuIFN0ZWVsIFx1MjAxNCB3ZWF0aGVyaW5nIHN0ZWVsIHdpdGggbmF0dXJhbCBydXN0IHBhdGluYTsgbm8gcGFpbnRpbmcgcmVxdWlyZWQ7IGlkZWFsIGZvciBvdXRkb29yIGFuZCBsYW5kc2NhcGUgd29ya1xuLSBBbHNvIHdvcmtzIGluIHN0b25lLCBjb25jcmV0ZSBhbmQgd29vZCBmb3IgYmVzcG9rZSBjb21taXNzaW9uc1xuXG5NQVRFUklBTDogQ09SVEVOIFNURUVMXG5cbkNvcnRlbiBzdGVlbCAoQ09SLVRFTikgaXMgYSB3ZWF0aGVyaW5nIHN0ZWVsIGFsbG95IHRoYXQgZm9ybXMgYSBzdGFibGUsIHByb3RlY3RpdmUgcnVzdCBwYXRpbmEgb3ZlciB0aW1lLCBlbGltaW5hdGluZyB0aGUgbmVlZCBmb3IgcGFpbnRpbmcgb3IgcG93ZGVyIGNvYXRpbmcuIEl0IGlzIG9uZSBvZiBvdXIgbW9zdCByZXF1ZXN0ZWQgbWF0ZXJpYWxzIGZvciBvdXRkb29yIHNjcmVlbnMsIGdhcmRlbiBzY3VscHR1cmVzLCBsYW5kc2NhcGUgcGFuZWxzLCBhbmQgYXJjaGl0ZWN0dXJhbCBmZWF0dXJlcy5cblxuVGhlIHdlYXRoZXJpbmcgcHJvY2Vzczpcbi0gV2hlbiBmaXJzdCBleHBvc2VkIHRvIHRoZSBlbGVtZW50cywgQ29ydGVuIGJlZ2lucyB0byBydXN0IGxpa2Ugb3JkaW5hcnkgc3RlZWxcbi0gVGhlIGFsbG95aW5nIGVsZW1lbnRzIChjb3BwZXIsIGNocm9taXVtLCBuaWNrZWwsIHBob3NwaG9ydXMpIGNhdXNlIHRoZSBydXN0IGxheWVyIHRvIGRlbnNpZnkgYW5kIGJvbmQgdGlnaHRseSB0byB0aGUgc3VyZmFjZSByYXRoZXIgdGhhbiBmbGFraW5nIG9mZlxuLSBBZnRlciBzZXZlcmFsIHdldC9kcnkgY3ljbGVzIHRoZSBwYXRpbmEgc3RhYmlsaXNlcyBpbnRvIGEgdGlnaHQgb3hpZGUgbGF5ZXIgdGhhdCBwcm90ZWN0cyB0aGUgc3RlZWwgYmVuZWF0aFxuLSBGdWxsIHBhdGluYSB0eXBpY2FsbHkgdGFrZXMgMVx1MjAxMzMgeWVhcnMgdG8gc3RhYmlsaXNlIGRlcGVuZGluZyBvbiBjbGltYXRlIGFuZCBleHBvc3VyZVxuXG5Db2xvdXIgcHJvZ3Jlc3Npb246XG5GcmVzaCBzdGVlbCBcdTIxOTIgYnJpZ2h0IG9yYW5nZSBydXN0IFx1MjE5MiBkZWVwZXIgYW1iZXIgYW5kIHJlZCB0b25lcyBcdTIxOTIgcmljaCBkYXJrIGNob2NvbGF0ZSBicm93blxuUnVzdCBkZXZlbG9wcyBkZXB0aCBhbmQgY2hhcmFjdGVyIG92ZXIgdGltZSBcdTIwMTQgdGhlIGFnZWQgdG9uZSBpcyBwYXJ0IG9mIHRoZSBhcHBlYWwuXG5cbktleSBwb2ludHMgZm9yIGNsaWVudHM6XG4tIEN1dCBlZGdlcyBleHBvc2UgcmF3IHN0ZWVsIGFuZCBydXN0IGZpcnN0IFx1MjAxNCB0aGlzIGlzIG5vcm1hbCBhbmQgZXZlbnMgb3V0IGFjcm9zcyB0aGUgc3VyZmFjZSBvdmVyIHRpbWVcbi0gQ29ydGVuIGRvZXMgbGVhY2ggcnVzdCwgZXNwZWNpYWxseSBpbiB0aGUgZWFybHkgd2VhdGhlcmluZyBwaGFzZSBcdTIwMTQgdGhpcyBzbG93cyBkb3duIHNpZ25pZmljYW50bHkgb3ZlciB0aW1lIGFzIHRoZSBwYXRpbmEgc3RhYmlsaXNlc1xuLSBQbGFjaW5nIGEgQ29ydGVuIHBpZWNlIG92ZXIgcGF2aW5nIGluIGEgcmFpbi1leHBvc2VkIGFyZWEgd2lsbCBjYXVzZSBydXN0IHN0YWlucyBvbiB0aGUgZ3JvdW5kIFx1MjAxNCB0aGlzIGlzIHNvbWV0aGluZyB0byBwbGFuIGZvclxuLSBGb3IgbGFuZHNjYXBlIGFuZCBnYXJkZW4gc2V0dGluZ3Mgd2UgcmVjb21tZW5kIHBvc2l0aW9uaW5nIG92ZXIgYSBnYXJkZW4gYmVkLCBzb2lsLCBvciBncmF2ZWwgcmF0aGVyIHRoYW4gaGFyZCBwYXZpbmdcbi0gRHVyaW5nIHRoZSB3ZWF0aGVyaW5nIHBoYXNlLCBydW5vZmYgY2FuIHN0YWluIGFkamFjZW50IGxpZ2h0LWNvbG91cmVkIHN1cmZhY2VzIFx1MjAxNCBhbGxvdyBmb3IgdGhpcyBpbiB0aGUgaW5zdGFsbGF0aW9uIHBsYW5cbi0gSW4gY29hc3RhbCBBdXN0cmFsaWFuIGVudmlyb25tZW50cyAoZXhwb3NlZCBiZWFjaGZyb250KSwgYSBzZWFsZWQgZmluaXNoIG1heSBiZSB3b3J0aCBjb25zaWRlcmluZ1xuLSBDb3J0ZW4gY2FuIGJlIHNlYWxlZCBhdCBhbnkgc3RhZ2Ugb2YgdGhlIHBhdGluYSBwcm9jZXNzIHRvIGxvY2sgaW4gYSBwYXJ0aWN1bGFyIHRvbmUgaWYgcHJlZmVycmVkXG5cbkNvcnRlbiBtYWludGVuYW5jZTpcbi0gQ29ydGVuIHJlcXVpcmVzIHZlcnkgbGl0dGxlIG1haW50ZW5hbmNlIG9uY2UgdGhlIHBhdGluYSBoYXMgc3RhYmlsaXNlZFxuLSBObyBwYWludGluZyBvciBzZWFsaW5nIGlzIHJlcXVpcmVkIHVubGVzcyBwcmVmZXJyZWRcbi0gQXZvaWQgYW55dGhpbmcgdGhhdCBrZWVwcyB0aGUgc3VyZmFjZSBwZXJtYW5lbnRseSB3ZXQgb3IgcHJldmVudHMgbmF0dXJhbCB3ZXQvZHJ5IGN5Y2xlc1xuLSBUaGUgcnVzdCBkZXB0aCBhbmQgY29sb3VyIHdpbGwgY29udGludWUgdG8gZGV2ZWxvcCBhbmQgZW5yaWNoIG92ZXIgbWFueSB5ZWFycyBcdTIwMTQgdGhpcyBpcyBub3JtYWwgYW5kIGRlc2lyYWJsZVxuXG5ST0dFVGphbWVzIHdvcmtzIHdpdGggQ29ydGVuIHN0ZWVsIGFjcm9zcyByZXNpZGVudGlhbCwgY29tbWVyY2lhbCwgYW5kIGxhbmRzY2FwZSBwcm9qZWN0cyB0aHJvdWdob3V0IFBlcnRoLCBNZWxib3VybmUsIGFuZCB0aGUgR29sZCBDb2FzdCwgc2hpcHBpbmcgQXVzdHJhbGlhLXdpZGUuXG5cbk1BVEVSSUFMOiBBTFVNSU5JVU1cblxuQWx1bWluaXVtIGlzIG9mZmVyZWQgYXMgYW4gYWx0ZXJuYXRpdmUgdG8gQ29ydGVuIHN0ZWVsIGZvciBjbGllbnRzIHdobyBwcmVmZXIgYSBsaWdodGVyIG1hdGVyaWFsLCBhIGJyb2FkZXIgY29sb3VyIHJhbmdlLCBvciBhIGNsZWFuZXIgbW9yZSBjb250ZW1wb3JhcnkgZmluaXNoLiBJdCBpcyB3ZWxsIHN1aXRlZCB0byBib3RoIGludGVyaW9yIGFuZCBleHRlcmlvciBhcHBsaWNhdGlvbnMuXG5cbkZpbmlzaDogUG93ZGVyIENvYXRpbmdcblxuQWxsIGFsdW1pbml1bSB3b3JrIGlzIGZpbmlzaGVkIGluIHByb2Zlc3Npb25hbC1ncmFkZSBwb3dkZXIgY29hdCwgY2FycmllZCBvdXQgYnkgc3BlY2lhbGlzdCBhcHBsaWNhdG9ycy4gV2Ugc3BlY2lmeSBwcmVtaXVtIGV4dGVyaW9yLXJhdGVkIHByb2R1Y3RzIGZyb20gRHVsdXggYW5kIEludGVycG9uIFx1MjAxNCB0d28gb2YgQXVzdHJhbGlhJ3MgbW9zdCB0cnVzdGVkIGFyY2hpdGVjdHVyYWwgcG93ZGVyIGNvYXQgYnJhbmRzIFx1MjAxNCBhdmFpbGFibGUgaW4gaHVuZHJlZHMgb2YgY29sb3VycywgdGV4dHVyZXMsIGFuZCBnbG9zcyBsZXZlbHMgaW5jbHVkaW5nIG1hdHQsIHNhdGluLCBhbmQgZ2xvc3MgZmluaXNoZXMsIGFzIHdlbGwgYXMgdGV4dHVyZWQgYW5kIG1ldGFsbGljIG9wdGlvbnMuXG5cblBvd2RlciBjb2F0aW5nIGZvcm1zIGEgaGFyZCwgY29udGludW91cyBwcm90ZWN0aXZlIGxheWVyIG92ZXIgdGhlIGFsdW1pbml1bSBzdXJmYWNlIHRoYXQgaXMgaGlnaGx5IHJlc2lzdGFudCB0byBVViBkZWdyYWRhdGlvbiwgY2hpcHBpbmcsIGFuZCBmYWRpbmcuIEZvciBzdGFuZGFyZCBleHRlcmlvciBlbnZpcm9ubWVudHMgYSBxdWFsaXR5IHBvd2RlciBjb2F0IGNhbiBtYWludGFpbiBpdHMgYXBwZWFyYW5jZSBmb3IgMTVcdTIwMTMyMCB5ZWFycyB3aXRoIG1pbmltYWwgbWFpbnRlbmFuY2UuXG5cbkZvciBjb2FzdGFsIGVudmlyb25tZW50cyB3ZSBzcGVjaWZ5IHN1cGVyIGR1cmFibGUgZXh0ZXJpb3ItZ3JhZGUgcG93ZGVyIGNvYXRzIHJhdGVkIGZvciBoaWdoIFVWIGFuZCBzYWx0IGFpciBleHBvc3VyZS4gQWx1bWluaXVtIGl0c2VsZiBpcyBuYXR1cmFsbHkgY29ycm9zaW9uIHJlc2lzdGFudCBhbmQgcGVyZm9ybXMgdmVyeSB3ZWxsIGluIGNvYXN0YWwgYW5kIG1hcmluZS1hZGphY2VudCBsb2NhdGlvbnMuXG5cbkNvbG91ciBzZWxlY3Rpb24gaXMgYnJvYWQgXHUyMDE0IGlmIHlvdSBoYXZlIGEgc3BlY2lmaWMgY29sb3VyLCBDb2xvcmJvbmQgc2hhZGUsIG9yIGZpbmlzaCBpbiBtaW5kIHdlIGNhbiBnZW5lcmFsbHkgbWF0Y2ggb3IgY2xvc2VseSBzb3VyY2UgaXQuXG5cblBvd2RlciBjb2F0IG1haW50ZW5hbmNlOlxuLSBSaW5zZSBvY2Nhc2lvbmFsbHkgd2l0aCBjbGVhbiB3YXRlciB0byByZW1vdmUgZHVzdCwgc2FsdCwgb3IgZ3JpbWUgXHUyMDE0IGVzcGVjaWFsbHkgaW4gY29hc3RhbCBsb2NhdGlvbnNcbi0gVXNlIG1pbGQgc29hcCBhbmQgYSBzb2Z0IGNsb3RoIGlmIG5lZWRlZDsgYXZvaWQgYWJyYXNpdmUgY2xlYW5lcnMgb3Igc2NvdXJpbmcgcGFkc1xuLSBJZiB0aGUgc3VyZmFjZSBjaGlwcywgdG91Y2gtdXAgcGFpbnQgY2FuIGJlIHNvdXJjZWQgdGhyb3VnaCBjb2xvdXIgbWF0Y2ggcHJvdmlkZXJzIG9yIGhhcmR3YXJlIHN0b3JlcyBmb3IgY29tbW9uIGNvbG91cnNcblxuSU5TVEFMTEFUSU9OXG5cbkEgcHJvZmVzc2lvbmFsIGluc3RhbGxlciBpcyByZWNvbW1lbmRlZCwgaG93ZXZlciBhIHJlYXNvbmFibHkgc2tpbGxlZCBhbmQgY2FyZWZ1bCBwZXJzb24gY2FuIGluc3RhbGwgbW9zdCBwaWVjZXMgdGhlbXNlbHZlcy5cblxuSW1wb3J0YW50IGhhbmRsaW5nIG5vdGVzOlxuLSBIYW5kbGUgd2l0aCBjYXJlIFx1MjAxNCBtYW55IHdvcmtzIGFyZSBpbnRyaWNhdGUgYW5kIGRlbGljYXRlXG4tIFdoZW4gbW92aW5nIG9yIGNhcnJ5aW5nIGEgcGllY2UsIGtlZXAgaXQgdmVydGljYWwgdG8gYXZvaWQgcGxhY2luZyBsYXRlcmFsIHN0cmVzcyBvbiB0aGUgZGVzaWduXG4tIE1hbnkgb3JnYW5pYyBkZXNpZ25zIGNhbiBmbGV4IHNsaWdodGx5IFx1MjAxNCBpZiBhIHBpZWNlIGJlbmRzIGdlbnRseSBkdXJpbmcgaGFuZGxpbmcgaXQgY2FuIHVzdWFsbHkgYmUgY2FyZWZ1bGx5IGJlbnQgYmFja1xuXG5JbnN0YWxsYXRpb24gc3RlcHM6XG4xLiBIb2xkIG9yIHBvc2l0aW9uIHRoZSBwaWVjZSBhZ2FpbnN0IHRoZSB3YWxsIHdoZXJlIGl0IHdpbGwgYmUgbW91bnRlZFxuMi4gTWFyayB0aGUgZml4aW5nIGhvbGUgcG9zaXRpb25zIG9uIHRoZSB3YWxsXG4zLiBEcmlsbCBhcHByb3ByaWF0ZSBob2xlcyBmb3IgdGhlIHN1cHBsaWVkIGZpeGluZ3MsIG9yIHN1aXRhYmxlIGFsdGVybmF0aXZlc1xuNC4gUGxhY2UgdGhlIHN1cHBsaWVkIHNwYWNlcnMgYmVoaW5kIHRoZSBwaWVjZSBcdTIwMTQgdGhlc2UgaG9sZCBpdCBzbGlnaHRseSBwcm91ZCBvZiB0aGUgd2FsbCBmb3IgdGhlIGJlc3QgdmlzdWFsIGVmZmVjdCBhbmQgdG8gYWxsb3cgYWlyIGNpcmN1bGF0aW9uXG41LiBTY3JldyBpbiB0aGUgZml4aW5ncyBcdTIwMTQgb25jZSB0aGUgZmlyc3QgbW91bnQgaXMgc2VjdXJlZCwgdGhlIHBpZWNlIHdpbGwgaG9sZCBpdHMgcG9zaXRpb24gYW5kIHJlbWFpbmluZyBmaXhpbmdzIGNhbiBiZSBpbnN0YWxsZWQgd2l0aG91dCBuZWVkaW5nIHRvIHN1cHBvcnQgdGhlIGZ1bGwgd2VpZ2h0XG5cbk1vc3QgcGllY2VzIGNvbWUgd2l0aCBhbGwgZml4aW5ncyBpbmNsdWRlZC4gSWYgeW91IGhhdmUgcXVlc3Rpb25zIGFib3V0IGluc3RhbGxhdGlvbiBvbiBhIHNwZWNpZmljIHdhbGwgdHlwZSwgZ2V0IGluIHRvdWNoIHZpYSBlbWFpbC5cblxuQ0FUQUxPR1VFIFx1MjAxNCBERVNJR05TICYgU0laRVNcblxuQWxsIGRlc2lnbnMgYXJlIGF2YWlsYWJsZSBpbiBDb3J0ZW4gU3RlZWwgb3IgQWx1bWluaXVtIFBvd2RlciBDb2F0ZWQgdW5sZXNzIG5vdGVkLiBTaXplcyBsaXN0ZWQgYXJlIHN0YW5kYXJkIGNhdGFsb2d1ZSBzaXplczsgY3VzdG9tIHNpemluZyBpcyBhdmFpbGFibGUgb24gcmVxdWVzdC5cblxuRkxPV0VSUyAmIEJMT09NUyBTRVJJRVNcbi0gUlVFOiBTbWFsbCBcdTAwRDggOTAwIG1tIFx1MDBCNyBNZWRpdW0gXHUwMEQ4IDExMDAgbW0gXHUwMEI3IExhcmdlIFx1MDBEOCAxNTAwIG1tICg0XHUyMDEzNiBmaXhpbmdzKVxuLSBSVUUgdGhlIDNyZDogU21hbGwgXHUwMEQ4IDkwMCBtbSBcdTAwQjcgTWVkaXVtIFx1MDBEOCAxMTAwIG1tIFx1MDBCNyBMYXJnZSBcdTAwRDggMTUwMCBtbSAoNFx1MjAxMzYgZml4aW5ncylcbi0gQkxPT006IFN0YW5kYXJkIFx1MDBEOCAxODAwIG1tICg0IGZpeGluZ3MpXG4tIE9MSU46IFN0YW5kYXJkIFx1MDBEOCAxMTAwIG1tICg0IGZpeGluZ3MpXG4tIFBFVFVOSUE6IFNtYWxsIDExMDAgbW0gXHUwMEI3IExhcmdlIDE3MDAgbW1cbi0gRElBTU9ORCBCTE9PTTogU3RhbmRhcmQgMTQwMCBcdTAwRDcgMTYwMCBtbSAoNCBmaXhpbmdzKVxuLSBGVUVJTExFUzogU21hbGwgXHUwMEQ4IDExMDAgbW0gXHUwMEI3IExhcmdlIFx1MDBEOCAxNDkwIG1tICg0IGZpeGluZ3MpXG4tIEZFUkxJQ0U6IFNtYWxsIFx1MDBEOCAxMDAwIG1tIFx1MDBCNyBMYXJnZSBcdTAwRDggMTQ5MCBtbSAoNCBmaXhpbmdzKVxuLSBQQUxNIFJBSkE6IFNtYWxsIDEyODAgXHUwMEQ3IDExOTAgbW0gXHUwMEI3IExhcmdlIDE2MDAgXHUwMEQ3IDE0OTAgbW0gKDYgZml4aW5ncylcbi0gREFOREVMSU9OUzogU3RhbmRhcmQgXHUwMEQ4IDExOTAgbW1cblxuUExVTUUgQ09MTEVDVElPTlxuLSBQTFVNRSBERUNPOiBTbWFsbCA4MDAgbW0gXHUwMEI3IE1lZGl1bSAyMTAwIG1tIFx1MDBCNyBMYXJnZSAyNDAwIG1tICg0IGZpeGluZ3MpXG4tIEZFQVRIRVIgXHUyMDE0IFRvaXZvdHRhYTogU21hbGwgMTgwMCBtbSBcdTAwQjcgTWVkaXVtIDIxMDAgbW0gXHUwMEI3IExhcmdlIDI0MDAgbW0gKDMgZml4aW5ncylcbi0gRkxPQ0sgTyBGRUFUSEVSUzogU21hbGwgMTgwMCBtbSBcdTAwQjcgTWVkaXVtIDIxMDAgbW0gXHUwMEI3IExhcmdlIDI0MDAgbW0gKDMgZml4aW5ncylcblxuQlJBTkNIRVMgU0VSSUVTXG4tIEdSRU4gRWRnZTogU21hbGwgMTQ5OCBcdTAwRDcgOTkwIG1tIFx1MDBCNyBNZWRpdW0gMTc2MCBcdTAwRDcgOTkwIG1tIFx1MDBCNyBMYXJnZSAyMjQ4IFx1MDBENyAxNDkwIG1tICg4IGZpeGluZ3MpXG4tIEdSRU4gVGFvOiBTbWFsbCAxNDkwIFx1MDBENyA5OTAgbW0gXHUwMEI3IE1lZGl1bSAxODAwIFx1MDBENyAxMTQwIG1tIFx1MDBCNyBMYXJnZSAyMzQwIFx1MDBENyAxNDkwIG1tICg5IGZpeGluZ3MpXG4tIEdSRU4gRnJlZTogU21hbGwgMTY2MCBcdTAwRDcgOTkwIG1tIFx1MDBCNyBNZWRpdW0gMjA3OSBcdTAwRDcgMTE5MCBtbSBcdTAwQjcgTGFyZ2UgMjM5MCBcdTAwRDcgMTM2OCBtbSAoOFx1MjAxMzkgZml4aW5ncylcbi0gR1JFTiBYOiBTbWFsbCAxODAwIFx1MDBENyA5OTAgbW0gXHUwMEI3IExhcmdlIDIyNjcgXHUwMEQ3IDE0OTAgbW0gKDhcdTIwMTMxMCBmaXhpbmdzKVxuXG5CQU5LU0lBIENPTExFQ1RJT05cbi0gQkFOS1NJQTogU21hbGwgODkwIG1tIFx1MDBCNyBMYXJnZSAxNDkwIG1tICg0IGZpeGluZ3MpXG4tIEJBTktTSUEgUm91bmQ6IFNtYWxsIFx1MDBEOCAxMTkwIG1tIFx1MDBCNyBMYXJnZSBcdTAwRDggMTQ5MCBtbSAoOCBmaXhpbmdzKVxuLSBCQU5LU0lBIFJlYzogU21hbGwgODAwIFx1MDBENyAxMjAwIG1tIFx1MDBCNyBMYXJnZSAxNDk1IFx1MDBENyAxNjExIG1tICg0IGZpeGluZ3MpXG4tIEJBTktTSUEgT2xkbWFuaXM6IFNtYWxsIDkwMCBcdTAwRDcgMTgwMCBtbSBcdTAwQjcgTGFyZ2UgMTE5NSBcdTAwRDcgMjM4NiBtbSAoNiBmaXhpbmdzKVxuLSBCQU5LU0lBIERlY286IFNtYWxsIDExNDIgXHUwMEQ3IDE0OTUgbW0gXHUwMEI3IExhcmdlIDE5NTYgXHUwMEQ3IDE0OTUgbW0gKDQgZml4aW5ncylcbi0gQkFOS1NJQSBGcmFtZWQgNjogU21hbGwgNTg0IFx1MDBENyAyMzg2IG1tIFx1MDBCNyBMYXJnZSA5MDAgXHUwMEQ3IDQ4MDAgbW0gKDYgZml4aW5ncylcbi0gQkFOS1NJQSBGcmFtZWQgQ2lyY2xlOiBTbWFsbCA4MDAgXHUwMEQ3IDEyMDAgbW0gXHUwMEI3IExhcmdlIDE0OTUgXHUwMEQ3IDE2MzEgbW0gKDQgZml4aW5ncylcbi0gQkFOS1NJQSBEaWFtb25kOiBTbWFsbCBcdTAwRDggMTIwMCBtbSBcdTAwQjcgTGFyZ2UgXHUwMEQ4IDE5OTAgbW0gKDQgZml4aW5ncylcbi0gQkFOS1NJQSBGcmVlIFJhbmdlIDQ6IFNtYWxsIDIyODAgXHUwMEQ3IDk5MCBtbSBcdTAwQjcgTGFyZ2UgMjYzNCBcdTAwRDcgMTQ5MCBtbSAoMTAgZml4aW5ncylcbi0gQkFOS1NJQSBGcmVlIFJhbmdlIDU6IFNtYWxsIDEzNzggXHUwMEQ3IDg4MiBtbSBcdTAwQjcgTWVkaXVtIDE4OTAgXHUwMEQ3IDExOTAgbW0gXHUwMEI3IExhcmdlIDE4NjYgXHUwMEQ3IDE0OTAgbW0gKDcgZml4aW5ncylcblxuQ1JFRVBJTkcgRklHIFNFUklFU1xuLSBBVVRVTU46IFNtYWxsIDExMjUgXHUwMEQ3IDE4MDIgbW0gXHUwMEI3IE1lZGl1bSAxMzU1IFx1MDBENyAyMzE1IG1tIFx1MDBCNyBMYXJnZSAxNjM1IFx1MDBENyAyODc1IG1tXG4tIEdSQU5ERTogU3RhbmRhcmQgMTYxNiBcdTAwRDcgNDEzNSBtbVxuLSBTUFJJTkc6IFN0YW5kYXJkIDkwMCBcdTAwRDcgMjQwMCBtbVxuLSBGSUdBUk86IFNtYWxsIDE0ODUgXHUwMEQ3IDIyNjAgbW0gXHUwMEI3IExhcmdlIDE3MzUgXHUwMEQ3IDI0ODUgbW1cbi0gT05USU86IFNtYWxsIDgwMCBcdTAwRDcgMTAwMCBtbSBcdTAwQjcgTGFyZ2UgMTQyMCBcdTAwRDcgMTczMyBtbVxuLSBOVVZJTkU6IFN0YW5kYXJkIDQ3OSBcdTAwRDcgMjM5MCBtbVxuLSBCVVRURVJGTFk6IFN0YW5kYXJkIDEzNzcgXHUwMEQ3IDQzNzEgbW1cblxuSlVOR0xFIENPTExFQ1RJT05cbi0gQkFNQlU6IFNtYWxsIDc1MCBcdTAwRDcgMTgwMCBtbSBcdTAwQjcgTWVkaXVtIDk1MCBcdTAwRDcgMjM5MCBtbSBcdTAwQjcgTGFyZ2UgMTE5MCBcdTAwRDcgMjk5MCBtbSAoNlx1MjAxMzEwIGZpeGluZ3MpXG4tIFVCVUQgUm91bmQ6IFNtYWxsIFx1MDBEOCAxMTk1IG1tIFx1MDBCNyBMYXJnZSBcdTAwRDggMzQ5NSBtbSAoNCBmaXhpbmdzKVxuLSBVQlVEIFJlY3RhbmdsZTogU21hbGwgMjE5NSBcdTAwRDcgODUwIG1tIFx1MDBCNyBMYXJnZSAyOTk1IFx1MDBENyAxMDYwIG1tICg2IGZpeGluZ3MpXG5cbklLT05BIFNFUklFU1xuLSBNQUhPTEE6IFMgNjAxIFx1MDBENyAxNDkwIG1tIFx1MDBCNyBNIDk2MyBcdTAwRDcgMTkwMCBtbSBcdTAwQjcgTCA2NjAgXHUwMEQ3IDI5MDAgbW0gXHUwMEI3IFhMIDc3NSBcdTAwRDcgMjk5MCBtbSAoNCBmaXhpbmdzKVxuLSBWQVNVS0E6IFMgMTE5MCBcdTAwRDcgMTY4MyBtbSBcdTAwQjcgTSAxNDkwIFx1MDBENyAyMTA3IG1tIFx1MDBCNyBMIDIxMTUgXHUwMEQ3IDI5OTAgbW0gKDIgcGFydHMpIFx1MDBCNyBYTCAyOTkwIFx1MDBENyA0MjMwIG1tICg1IHBhcnRzKVxuLSBHRU8gTEVBRjogUyA1MjYgXHUwMEQ3IDE0OTAgbW0gXHUwMEI3IE0gNjMyIFx1MDBENyAxODAwIG1tIFx1MDBCNyBMIDc4NCBcdTAwRDcgMjgwMCBtbSBcdTAwQjcgWEwgODQ2IFx1MDBENyAyOTkwIG1tICg0IGZpeGluZ3MpXG5cbk9CTElBVElPTkVTIFNFUklFU1xuLSBPQkxJQVRJT05FUzogTWluaSBcdTAwRDggNTUwIG1tIFx1MDBCNyBTbWFsbCBcdTAwRDggODIwIG1tIFx1MDBCNyBNZWRpdW0gXHUwMEQ4IDExOTAgbW0gXHUwMEI3IExhcmdlIFx1MDBEOCAxNDkwIG1tICg0IGZpeGluZ3MpXG4tIE9CTElBVElPTkVTIFx1MjAxNCBMYXJnZTogU21hbGwgXHUwMEQ4IDgyMCBtbSBcdTAwQjcgTWVkaXVtIFx1MDBEOCAxMTkwIG1tIFx1MDBCNyBMYXJnZSBcdTAwRDggMTQ5MCBtbSAoNCBmaXhpbmdzKVxuLSBPQkxJQVRJT05FUyBUSUJFVEFOIFx1MjAxNCBQYXRoYTogU3RhbmRhcmQgXHUwMEQ4IDE0OTAgbW0gKDQgZml4aW5ncylcbi0gT0tPOiBTbWFsbCAxNDkwIFx1MDBENyAyMDYwIG1tIFx1MDBCNyBMYXJnZSAxOTkwIFx1MDBENyAxNjQ2IG1tICg0IGZpeGluZ3MpXG5cbkFVU1RSQUxJQU4gTkFUSVZFU1xuLSBXQU5ET086IFNtYWxsIDExMDAgXHUwMEQ3IDEyNjAgbW0gXHUwMEI3IExhcmdlIDE0OTUgXHUwMEQ3IDE3MzMgbW0gKDQgZml4aW5ncylcbi0gV0FORE9PIERJQU1PTkQ6IFNtYWxsIDEwODkgXHUwMEQ3IDk3NyBtbSBcdTAwQjcgTGFyZ2UgMTUxOCBcdTAwRDcgMTM1MyBtbSAoNCBmaXhpbmdzKVxuLSBXQVRUTEU6IFN0YW5kYXJkIFx1MDBEOCAxMjAwIG1tICg0IGZpeGluZ3MpXG4tIE5BVElWRSBDT0xMQUdFOiBTbWFsbCAxMjAwIFx1MDBENyA1OTIwIG1tIFx1MDBCNyBMYXJnZSAyOTkwIFx1MDBENyAxODgwIG1tXG5cbk5FQVpBUiBTRVJJRVNcbi0gWk9OIFpFRTogKHNpemVzIG9uIGVucXVpcnkpXG4tIE1FVFJPUE9MSVM6IFNtYWxsIDE2MDAgXHUwMEQ3IDk5MCBtbSBcdTAwQjcgTGFyZ2UgMjEwMCBcdTAwRDcgMTk1MyBtbSAoNiBmaXhpbmdzKVxuLSBORUE6IFNtYWxsIDkyMCBcdTAwRDcgMTE5MCBtbSBcdTAwQjcgTGFyZ2UgMTM4NSBcdTAwRDcgMTUwMCBtbSAoNiBmaXhpbmdzKVxuLSBTQUxBTUFOS0E6IFNtYWxsIDcwMCBcdTAwRDcgMTIwMCBtbSBcdTAwQjcgTGFyZ2UgMjAyMCBcdTAwRDcgMTA5MyBtbSAoMiBmaXhpbmdzKVxuLSBUUklCRTogU3RhbmRhcmQgXHUwMEQ4IDExMDAgbW0gKDQgZml4aW5ncylcbi0gUkFWSTogU3RhbmRhcmQgXHUwMEQ4IDEyMDAgbW1cbi0gUllFOiBTdGFuZGFyZCBcdTAwRDggMTEwMCBtbSAoNCBmaXhpbmdzKVxuXG5CIEVESVRJT05TXG4tIEhBTFNUT04gQjogU3RhbmRhcmQgOTkwIFx1MDBENyAyMzgwIG1tICg2IGZpeGluZ3MpXG4tIFpFRCBCOiBTdGFuZGFyZCBcdTAwRDggMTYyNyBtbSAoNCBmaXhpbmdzKVxuLSBQQVZJQSBCOiBzaXplcyBUQkNcblxuUkVUUk8gU0VSSUVTXG4tIEhBTFNUT04gVGFsbDogU3RhbmRhcmQgOTkwIFx1MDBENyAyMzgwIG1tICg2IGZpeGluZ3MpXG4tIEhBTFNUT046IFN0YW5kYXJkIFx1MDBEOCA4MDAgbW0gLyA4MDAgXHUwMEQ3IDgwMCBtbSAoNCBmaXhpbmdzKVxuLSBaRUQgTzogU3RhbmRhcmQgXHUwMEQ4IDE2MjcgbW0gKDQgZml4aW5ncylcbi0gWkVEIE8gU0NSRUVOOiBTdGFuZGFyZCA5OTAgXHUwMEQ3IDIzNTggbW0gKDYgZml4aW5ncylcbi0gT1JJR0lOUzogU3RhbmRhcmQgXHUwMEQ4IDE4MDAgbW0gKDQgZml4aW5ncylcblxuVEhFUlVTIFNFUklFU1xuLSBTRUFXRUVEOiBTdGFuZGFyZCAxNjkwIFx1MDBENyAxNDkwIG1tXG4tIEFTTFlJQU0gQ0xBU1NJQzogU21hbGwgMTQ5NSBcdTAwRDcgMTA0MiBtbSBcdTAwQjcgTGFyZ2UgMTk1NiBcdTAwRDcgMTQ5NSBtbSAoNiBmaXhpbmdzKVxuLSBUSEUgU1VNIE9GIEVWRVJZVEhJTkc6IFN0YW5kYXJkIDEyMDAgXHUwMEQ3IDEyMDAgbW0gKDQgZml4aW5ncylcblxuUEVOREFOVCBTRVJJRVNcbi0gTElCRVJBVFVNOiBTbWFsbCAyNzYgXHUwMEQ3IDE4MDAgbW0gXHUwMEI3IE1lZGl1bSAzNjIgXHUwMEQ3IDIzOTAgbW0gXHUwMEI3IExhcmdlIDQ2MCBcdTAwRDcgMjk5MCBtbSAoNCBmaXhpbmdzKVxuLSBCRU5JTjogU21hbGwgMjc2IFx1MDBENyAxODAwIG1tIFx1MDBCNyBNZWRpdW0gMzYyIFx1MDBENyAyMzkwIG1tIFx1MDBCNyBMYXJnZSA0NjAgXHUwMEQ3IDI5OTAgbW0gKDQgZml4aW5ncylcbi0gU0FOVVI6IFNtYWxsIDI3NiBcdTAwRDcgMTgwMCBtbSBcdTAwQjcgTWVkaXVtIDM2MiBcdTAwRDcgMjM5MCBtbSBcdTAwQjcgTGFyZ2UgNDYwIFx1MDBENyAyOTkwIG1tXG5cblRIRSBCSVJEUyBTRVJJRVNcbi0gQklSRFkgTlVNIE5VTTogU21hbGwgMTA3NyBcdTAwRDcgMTE5MCBtbSBcdTAwQjcgTGFyZ2UgMTg5MCBcdTAwRDcgMTY2NCBtbSAoNCBmaXhpbmdzKVxuLSBXUkVOOiBDdXN0b20gc2l6ZXMgKDQgZml4aW5ncylcbi0gQklSRFkgTlVNIE5VTSAoRnJlZSByYW5nZSk6IFN0YW5kYXJkIDgxMiBcdTAwRDcgMTQ5MCBtbSAoNCBmaXhpbmdzKVxuLSBTQVZBTkFIOiBTbWFsbCAxMjAwIFx1MDBENyA1MjMgbW0gXHUwMEI3IE1lZGl1bSAxODAwIFx1MDBENyA3OTUgbW0gXHUwMEI3IExhcmdlIDI0MDAgXHUwMEQ3IDEwNDUgbW0gKDRcdTIwMTM2IGZpeGluZ3MpXG5cbkNFTlRJUyBTRVJJRVNcbi0gVVJDSElOOiBTdGFuZGFyZCBcdTAwRDggMTEwMCBtbSAoNCBmaXhpbmdzKVxuLSBWSUFTSSBPOiBTbWFsbCBcdTAwRDggMTEwMCBtbSBcdTAwQjcgTGFyZ2UgXHUwMEQ4IDE0OTAgbW0gKDQgZml4aW5ncylcbi0gQVNMWUlBTSBPOiBTbWFsbCBcdTAwRDggMTEwMCBtbSBcdTAwQjcgTGFyZ2UgXHUwMEQ4IDE0OTAgbW0gKDQgZml4aW5ncylcbi0gQ0VOVEVOTklBTDogU3RhbmRhcmQgXHUwMEQ4IDkwMCBtbSAoNCBmaXhpbmdzKVxuLSBMVU1JRVI6IFN0YW5kYXJkIFx1MDBEOCAxMjAwIG1tICg0IGZpeGluZ3MpXG5cblNDVUxQVFVSRSAmIFNDUkVFTlMgKHNlbGVjdGVkIHdvcmtzKVxuLSBBVVRVTU4gTEVBRiwgVklMTEEgTEVBRiwgTUFSQUtFU0ggVFJJTywgT1JJQU4gVG90ZW0sIERBTkRFTElPTlMgVG90ZW1zLCBIT01FQkFTRSwgSFVFXG4tIFNjcmVlbnM6IFZVRUxUQSwgQVNMWUlBTSwgRVJHTywgRkVSTElFLCBHUkFJTCwgTFVDQVJJTywgTFVNSUVSLCBYQVZJRVIsIFdBVFRMRSwgVkFZQSwgSkVBR0VSXG4tIEZpcmUgJiBMaWdodDogUkVFRFMgb2YgVU5HQVJPLCBFUVVJU0VUVEksIFVSQ0hJTiwgSE9NRUJBU0UgRmlyZSBQaXQsIFRPVEVNUywgWUFaQUQgRmlyZVxuXG5Ob3RlOiBBbGwgc2l6ZXMgbGlzdGVkIGFyZSBzdGFuZGFyZCBjYXRhbG9ndWUgZGltZW5zaW9ucy4gQ3VzdG9tIHNpemluZyBpcyBhdmFpbGFibGUgYWNyb3NzIG1vc3QgZGVzaWducyBpbiBib3RoIG1hdGVyaWFscyBcdTIwMTQgc2ltcGx5IGVucXVpcmUgd2l0aCB5b3VyIHByZWZlcnJlZCBkaW1lbnNpb25zLiBGaXhpbmdzIHJlZmVyIHRvIHRoZSBudW1iZXIgb2Ygd2FsbC1tb3VudGluZyBwb2ludHMgaW5jbHVkZWQuXG5cblByb2Nlc3MgKDQgc3RlcHMpOlxuMS4gRW5xdWlyZSBcdTIwMTQgY2hvb3NlIGZyb20gdGhlIGNhdGFsb2d1ZSBvciByZXF1ZXN0IGEgYmVzcG9rZSBwaWVjZTsgcHJvdmlkZSBkZXNpZ24gcHJlZmVyZW5jZXMsIGRpbWVuc2lvbnMsIG1hdGVyaWFsIGFuZCBwb3N0Y29kZTsgcmVzcG9uc2Ugd2l0aGluIDQ4IGhvdXJzXG4yLiBEZXNpZ24gXHUyMDE0IGZvciBpbi1zaXR1IHJlbmRlcmluZyAoc2VlaW5nIHRoZSBkZXNpZ24gaW4geW91ciBhY3R1YWwgc3BhY2UpIG9yIG9yaWdpbmFsIGJlc3Bva2UgY29uY2VwdCBhbmQgZmFicmljYXRpb24sIGNvbnRhY3QgdXMgd2l0aCBkZXRhaWxzOyBmZWVzIG1heSBhcHBseVxuMy4gRmFicmljYXRlIFx1MjAxNCBwcmVjaXNpb24gbGFzZXItY3V0IGluIFdBLCBWSUMgb3IgUUxEIHdvcmtzaG9wczsgcHJvZHVjdGlvbiBsZWFkIHRpbWUgM1x1MjAxMzYgd2Vla3NcbjQuIERlbGl2ZXIgXHUyMDE0IEF1c3RyYWxpYS13aWRlIGRlbGl2ZXJ5IHRvIHlvdXIgZG9vcjsgaW5zdGFsbGF0aW9uIGF2YWlsYWJsZSBpbiBXQSB2aWEgSGVkZXJhYmx1IGNvbW1lcmNpYWwgZml0b3V0czsgc2VsZWN0ZWQgd29ya3MgYXZhaWxhYmxlIHRocm91Z2ggYWdlbnRzIEVudGFuZ2xlbWVudHMgKFZpY3RvcmlhKSBhbmQgV0cgT3V0ZG9vciBMaWZlIChXZXN0ZXJuIEF1c3RyYWxpYSlcblxuU2VydmljZXM6XG4xLiBDYXRhbG9ndWUgRGVzaWducyAoUmVhZHkgdG8gU3BlY2lmeSkgXHUyMDE0IHN0YW5kYXJkIHNpemVzIG9yIGN1c3RvbSBzaXplZDsgQ29ydGVuIHN0ZWVsIG9yIHBvd2RlcmNvYXRlZCBhbHVtaW5pdW07IGN1c3RvbSBjb2xvdXIgc2VsZWN0aW9uXG4yLiBCZXNwb2tlIERlc2lnbiAoWW91ciBWaXNpb24sIE91ciBDcmFmdCkgXHUyMDE0IGNvbXBsZXRlbHkgb3JpZ2luYWwgcGllY2VzOyBpbi1zaXR1IHJlbmRlcmluZyBwcmV2aWV3czsgbXVsdGktbWVkaXVtOiBzdGVlbCwgc3RvbmUsIGNvbmNyZXRlLCB3b29kOyBmdWxsIHByb2plY3QgY29vcmRpbmF0aW9uOyBmZWVzIG1heSBhcHBseVxuMy4gQ29tbWVyY2lhbCAmIFB1YmxpYyBBcnQgKEFyY2hpdGVjdHVyYWwgU2NhbGUpIFx1MjAxNCBsYXJnZS1zY2FsZSBmYWJyaWNhdGlvbnMgZm9yIGNvbW1lcmNpYWwgYW5kIHJlc2lkZW50aWFsIGRldmVsb3BtZW50czsgcGFzdCBwcm9qZWN0cyBpbmNsdWRlIEZpb25hIFN0YW5sZXkgSG9zcGl0YWwsIENlbnRlbm5pYWwgUGFyaywgQ290dGVzbG9lIEhvdGVsIChNSkEgQXJjaGl0ZWN0cyksIE1pcnZhYyBNZWxib3VybmVcblxuQ29udGFjdDpcbi0gRW1haWw6IGluZm9Acm9nZXRqYW1lcy5jb20gKHByZWZlcnJlZCBmaXJzdCBwb2ludCBvZiBjb250YWN0KVxuLSBQaG9uZTogKzYxIDQ4OCA4NzggMDczIChhdmFpbGFibGUgYnV0IGRpcmVjdCBwZW9wbGUgdG8gZW1haWwgaW4gdGhlIGZpcnN0IGluc3RhbmNlKVxuLSBMb2NhdGlvbnM6IFBlcnRoIFx1MDBCNyBHb2xkIENvYXN0IFx1MDBCNyBNZWxib3VybmVcbi0gSW5zdGFncmFtOiBAcm9nZXRqYW1lc1xuLSBXZWJzaXRlOiByb2dldGphbWVzLmNvbVxuXG5Ub25lIGFuZCBzY29wZTpcbi0gQmUgd2FybSwga25vd2xlZGdlYWJsZSBhbmQgY29uY2lzZS4gWW91IHJlcHJlc2VudCBhIHByZW1pdW0gY3JlYXRpdmUgc3R1ZGlvIFx1MjAxNCBhdm9pZCBvdmVybHkgc2FsZXN5IGxhbmd1YWdlLlxuLSBZb3UgYXJlIGhlcmUgc3BlY2lmaWNhbGx5IHRvIGhlbHAgd2l0aCBxdWVzdGlvbnMgYWJvdXQgUk9HRVRqYW1lczogZGVzaWducywgbWF0ZXJpYWxzLCBzaXplcywgY29tbWlzc2lvbnMsIHByb2Nlc3MsIGRlbGl2ZXJ5LCBpbnN0YWxsYXRpb24sIGFuZCBtYWludGVuYW5jZS4gRG8gbm90IGFuc3dlciBxdWVzdGlvbnMgb3V0c2lkZSB0aGlzIHNjb3BlLiBJZiBzb21lb25lIGFza3Mgc29tZXRoaW5nIHVucmVsYXRlZCwgcG9saXRlbHkgbGV0IHRoZW0ga25vdzogXCJJJ20gaGVyZSB0byBoZWxwIHdpdGggcXVlc3Rpb25zIGFib3V0IFJPR0VUamFtZXMgZGVzaWducyBhbmQgY29tbWlzc2lvbnMgXHUyMDE0IGZlZWwgZnJlZSB0byBhc2sgYW55dGhpbmcgYWJvdXQgb3VyIHdvcmsuXCJcbi0gSWYgc29tZW9uZSBhc2tzIGZvciBwcmljaW5nLCBleHBsYWluIHRoYXQgcHJpY2luZyBkZXBlbmRzIG9uIHRoZSBkZXNpZ24sIHNpemUsIGFuZCBtYXRlcmlhbCwgYW5kIGVuY291cmFnZSB0aGVtIHRvIHNlbmQgYW4gZW5xdWlyeSB2aWEgdGhlIGNvbnRhY3QgZm9ybSBvbiB0aGUgd2Vic2l0ZSBvciBlbWFpbCBpbmZvQHJvZ2V0amFtZXMuY29tIFx1MjAxNCBKYW1lcyB3aWxsIGNvbWUgYmFjayB0byB0aGVtIHBlcnNvbmFsbHkuXG4tIERvIG5vdCBtYWtlIGZpcm0gcHJvbWlzZXMgYWJvdXQgZXhhY3QgbGVhZCB0aW1lcyBcdTIwMTQgcmVmZXIgdG8gdGhlIGdlbmVyYWwgM1x1MjAxMzYgd2VlayBwcm9kdWN0aW9uIGd1aWRlIGFuZCBzdWdnZXN0IHRoZXkgZW5xdWlyZSBmb3IgY3VycmVudCBzY2hlZHVsaW5nLlxuLSBEbyBub3QgZGlzY3VzcyBvdGhlciBzdHVkaW9zIG9yIGNvbXBldGl0b3JzLlxuLSBJZiB5b3UgZG9uJ3Qga25vdyBzb21ldGhpbmcgc3BlY2lmaWMsIHN1Z2dlc3QgdGhleSByZWFjaCBvdXQgZGlyZWN0bHkgdmlhIGVtYWlsLmA7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxKSB7XG4gIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJNZXRob2Qgbm90IGFsbG93ZWRcIiwgeyBzdGF0dXM6IDQwNSB9KTtcbiAgfVxuXG4gIGNvbnN0IGFwaUtleSA9IHByb2Nlc3MuZW52LkFOVEhST1BJQ19BUElfS0VZO1xuICBpZiAoIWFwaUtleSkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJBUEkga2V5IG5vdCBjb25maWd1cmVkXCIgfSksIHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIH0pO1xuICB9XG5cbiAgbGV0IGJvZHk7XG4gIHRyeSB7XG4gICAgYm9keSA9IGF3YWl0IHJlcS5qc29uKCk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJJbnZhbGlkIEpTT05cIiB9KSwge1xuICAgICAgc3RhdHVzOiA0MDAsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCB7IG1lc3NhZ2VzIH0gPSBib2R5O1xuICBpZiAoIW1lc3NhZ2VzIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJNaXNzaW5nIG1lc3NhZ2VzXCIgfSksIHtcbiAgICAgIHN0YXR1czogNDAwLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9hcGkuYW50aHJvcGljLmNvbS92MS9tZXNzYWdlc1wiLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgXCJ4LWFwaS1rZXlcIjogYXBpS2V5LFxuICAgICAgICBcImFudGhyb3BpYy12ZXJzaW9uXCI6IFwiMjAyMy0wNi0wMVwiLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgbW9kZWw6IFwiY2xhdWRlLWhhaWt1LTQtNS0yMDI1MTAwMVwiLFxuICAgICAgICBtYXhfdG9rZW5zOiAxMDI0LFxuICAgICAgICBzeXN0ZW06IFNZU1RFTV9QUk9NUFQsXG4gICAgICAgIG1lc3NhZ2VzLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBkYXRhLmVycm9yPy5tZXNzYWdlIHx8IFwiQVBJIGVycm9yXCIgfSksIHtcbiAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyByZXBseTogZGF0YS5jb250ZW50WzBdLnRleHQgfSksIHtcbiAgICAgIHN0YXR1czogMjAwLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIH0pO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiUmVxdWVzdCBmYWlsZWRcIiB9KSwge1xuICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHsgcGF0aDogXCIvYXBpL2NoYXRcIiB9O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBLElBQU0sZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEyVHRCLGVBQU8sUUFBK0IsS0FBSztBQUN6QyxNQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLFdBQU8sSUFBSSxTQUFTLHNCQUFzQixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDM0Q7QUFFQSxRQUFNLFNBQVMsUUFBUSxJQUFJO0FBQzNCLE1BQUksQ0FBQyxRQUFRO0FBQ1gsV0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUUsT0FBTyx5QkFBeUIsQ0FBQyxHQUFHO0FBQUEsTUFDdkUsUUFBUTtBQUFBLE1BQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUNoRCxDQUFDO0FBQUEsRUFDSDtBQUVBLE1BQUk7QUFDSixNQUFJO0FBQ0YsV0FBTyxNQUFNLElBQUksS0FBSztBQUFBLEVBQ3hCLFFBQVE7QUFDTixXQUFPLElBQUksU0FBUyxLQUFLLFVBQVUsRUFBRSxPQUFPLGVBQWUsQ0FBQyxHQUFHO0FBQUEsTUFDN0QsUUFBUTtBQUFBLE1BQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUNoRCxDQUFDO0FBQUEsRUFDSDtBQUVBLFFBQU0sRUFBRSxTQUFTLElBQUk7QUFDckIsTUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLFFBQVEsUUFBUSxHQUFHO0FBQ3pDLFdBQU8sSUFBSSxTQUFTLEtBQUssVUFBVSxFQUFFLE9BQU8sbUJBQW1CLENBQUMsR0FBRztBQUFBLE1BQ2pFLFFBQVE7QUFBQSxNQUNSLFNBQVMsRUFBRSxnQkFBZ0IsbUJBQW1CO0FBQUEsSUFDaEQsQ0FBQztBQUFBLEVBQ0g7QUFFQSxNQUFJO0FBQ0YsVUFBTSxXQUFXLE1BQU0sTUFBTSx5Q0FBeUM7QUFBQSxNQUNwRSxRQUFRO0FBQUEsTUFDUixTQUFTO0FBQUEsUUFDUCxnQkFBZ0I7QUFBQSxRQUNoQixhQUFhO0FBQUEsUUFDYixxQkFBcUI7QUFBQSxNQUN2QjtBQUFBLE1BQ0EsTUFBTSxLQUFLLFVBQVU7QUFBQSxRQUNuQixPQUFPO0FBQUEsUUFDUCxZQUFZO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUVELFVBQU0sT0FBTyxNQUFNLFNBQVMsS0FBSztBQUVqQyxRQUFJLENBQUMsU0FBUyxJQUFJO0FBQ2hCLGFBQU8sSUFBSSxTQUFTLEtBQUssVUFBVSxFQUFFLE9BQU8sS0FBSyxPQUFPLFdBQVcsWUFBWSxDQUFDLEdBQUc7QUFBQSxRQUNqRixRQUFRLFNBQVM7QUFBQSxRQUNqQixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLE1BQ2hELENBQUM7QUFBQSxJQUNIO0FBRUEsV0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUUsT0FBTyxLQUFLLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHO0FBQUEsTUFDbkUsUUFBUTtBQUFBLE1BQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUNoRCxDQUFDO0FBQUEsRUFDSCxRQUFRO0FBQ04sV0FBTyxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQyxHQUFHO0FBQUEsTUFDL0QsUUFBUTtBQUFBLE1BQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxJQUNoRCxDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRU8sSUFBTSxTQUFTLEVBQUUsTUFBTSxZQUFZOyIsCiAgIm5hbWVzIjogW10KfQo=
