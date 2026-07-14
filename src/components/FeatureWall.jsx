import FeatureGallery from "./FeatureGallery";
import { WALL_ART_COVERS, DetailCard } from "./Gallery";
import { QuoteBar } from "./FeatureQuote";
import CatPageViewer from "./CatPageViewer";

// The live public Wall Art gallery at /wall-art. Linked from the
// nav/footer/homepage Collection. Reads the same live Up Close / media data
// as Gallery.jsx (see below) so uploads show up here too.

// Wall Art catalogue page scans (mirrors Gallery.jsx WALL_ART_CAT_PAGES) —
// opened in-page by the "Wall Art Catalogue" pill so it never bounces to the
// homepage.
const WALL_ART_CAT_PAGES = Array.from({ length: 26 }, (_, i) =>
  `/images/catalogues/cat1/page-${String(i + 4).padStart(2, "0")}.jpg`
);

// Kept in sync by hand with the same curated shots in Gallery.jsx
// (SEED_UPCLOSE / UP_CLOSE_IMAGES) — small, rarely-changed lists, duplicated
// here rather than exported so this file stays self-contained.
const SEED_UPCLOSE = {
  plume: ["/images/details/plume-deco-rust-1.jpg", "/images/details/plume-deco-rust-2.jpg"],
};
const UP_CLOSE_IMAGES = [
  { src: "/images/details/plume-deco-rust-1.jpg", name: "Plume Deco — Corten detail" },
  { src: "/images/details/plume-deco-rust-2.jpg", name: "Plume Deco — Corten detail" },
];

// Deterministic string hash (FNV-1a) — gives the Australian Natives
// "randomised" layout a stable, shuffle-looking order: the same set of images
// always yields the same order, so it never reshuffles on remount. That keeps
// the search index and the rendered grid from ever disagreeing on a
// thumbnail's position.
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
// Stable "shuffle" — orders by a hash of each item's image path. Looks
// arbitrary but is fixed for a given set of images (replaces the old
// Math.random shuffle that re-ordered on every render).
function stableShuffle(arr) {
  return [...arr].sort((a, b) => hashStr(a.img) - hashStr(b.img));
}

// Australian Natives thumbnail layout (per James): these three shots are
// pinned to fixed positions, everything else is randomised, and the Up Close
// tile is always last.
const AN_PINS = {
  "/images/banksia/banksia-card-1.jpg": 0,    // 1st thumb
  "/images/banksia/banksia-rec-rust.jpg": 2,  // 3rd thumb
  "/images/banksia/banksia-round.jpg": 3,     // 4th thumb
};
function orderAustralianNatives(flat) {
  const upclose = flat.filter((p) => p._upclose);
  const rest = flat.filter((p) => !p._upclose);
  const pinned = new Map();
  const pool = [];
  for (const p of rest) {
    const slot = AN_PINS[p.img];
    if (slot !== undefined && !pinned.has(slot)) pinned.set(slot, p);
    else pool.push(p);
  }
  const shuffled = stableShuffle(pool);
  const out = [];
  let pi = 0;
  for (let i = 0; i < rest.length; i++) {
    out.push(pinned.has(i) ? pinned.get(i) : shuffled[pi++]);
  }
  return [...out, ...upclose];
}

// Flatten a category's pieces into one thumb per photo (Gallery.jsx "slides"),
// applying the Australian Natives ordering. Shared by BOTH the search index
// and the rendered grid, so a search result's index always matches the grid.
function orderPieces(cat) {
  const flat = cat.pieces.flatMap((p) =>
    p.slides && p.slides.length > 1 ? p.slides.map((img) => ({ ...p, img })) : [p]
  );
  return cat.id === "australian-natives" ? orderAustralianNatives(flat) : flat;
}

const CSS = `
.fw-wrap{position:fixed;inset:0;overflow:hidden;background:#000;color:#F2F0E9;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.fw-bg{position:absolute;inset:0;background-size:contain;background-repeat:no-repeat;background-position:center;opacity:0;transition:opacity .5s cubic-bezier(.7,0,.2,1);will-change:opacity}
.fw-bg.on{opacity:1}
.fw-top{position:absolute;top:0;left:0;right:0;z-index:6;display:flex;align-items:flex-start;justify-content:space-between;padding:28px 46px}
.fw-logo{font-weight:800;letter-spacing:.02em;font-size:19px;color:#F2F0E9;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:color .25s}
.fw-logo:hover{color:#c08c46}
.fw-logo i{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500}
.fw-top-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.fw-catalogue-link{position:absolute;top:28px;left:50%;transform:translateX(-50%);display:flex;align-items:center;padding:8px 15px;border-radius:20px;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.22);color:rgba(242,240,233,.75);font-size:10px;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;cursor:pointer;backdrop-filter:blur(4px);transition:.25s;font-family:inherit;white-space:nowrap}
.fw-catalogue-link:hover{background:rgba(158,113,52,.25);border-color:#c08c46;color:#F2F0E9}
.fw-count{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,240,233,.4);font-variant-numeric:tabular-nums}
.fw-menu-wrap{position:relative}
.fw-menu-btn{display:flex;align-items:center;gap:7px;padding:8px 15px;border-radius:20px;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.22);color:rgba(242,240,233,.75);font-size:10px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(4px);transition:.25s;font-family:inherit}
.fw-menu-btn:hover,.fw-menu-btn.open{background:rgba(158,113,52,.25);border-color:#c08c46;color:#F2F0E9}
.fw-menu-btn svg{transition:transform .25s}
.fw-menu-btn.open svg{transform:rotate(180deg)}
.fw-menu-panel{position:absolute;top:calc(100% + 10px);right:0;z-index:20;width:230px;max-height:360px;overflow-y:auto;background:rgba(16,16,16,.97);border:1px solid rgba(242,240,233,.16);border-radius:14px;padding:8px;box-shadow:0 30px 60px rgba(0,0,0,.55);backdrop-filter:blur(10px)}
.fw-menu-item{display:block;width:100%;text-align:left;padding:10px 14px;border-radius:8px;background:transparent;border:none;color:rgba(242,240,233,.75);font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:.2s}
.fw-menu-item:hover{background:rgba(255,255,255,.06);color:#F2F0E9}
.fw-menu-item.active{color:#c08c46;background:rgba(158,113,52,.12)}
.fw-expand-overlay{position:fixed;inset:0;z-index:10000;background:#000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;overflow-y:auto;padding:32px 16px}
.fw-expand-stack{display:flex;flex-direction:column;align-items:center;gap:16px;cursor:default}
.fw-expand-imgwrap{position:relative;display:inline-flex}
.fw-expand-img{max-width:88vw;max-height:76vh;object-fit:contain;display:block;border-radius:20px}
.fw-expand-progress{display:flex;flex-direction:column;align-items:center;gap:9px}
.fw-expand-progress-text{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,240,233,.55);font-variant-numeric:tabular-nums}
.fw-expand-details{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);padding:9px 18px;border-radius:20px;background:rgba(0,0,0,.6);border:1px solid rgba(242,240,233,.25);color:rgba(242,240,233,.9);font-size:11px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:.25s;font-family:inherit;white-space:nowrap}
.fw-expand-details:hover{background:#9E7134;border-color:#9E7134;color:#F2F0E9}
.fw-expand-close{position:absolute;top:16px;right:16px;padding:10px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;border:none;cursor:pointer;transition:.2s}
.fw-expand-close:hover{background:rgba(255,255,255,.2)}
.fw-expand-nav{position:absolute;top:50%;transform:translateY(-50%);padding:12px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;border:none;cursor:pointer;transition:.2s;z-index:1}
.fw-expand-nav:hover{background:rgba(255,255,255,.2)}
.fw-expand-nav.prev{left:16px}
.fw-expand-nav.next{right:16px}
.fw-lead{position:absolute;left:52px;bottom:340px;z-index:5;max-width:46vw}
.fw-kick{display:flex;align-items:center;gap:14px;font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#c08c46;margin-bottom:10px;text-shadow:0 2px 10px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.9)}
.fw-kick .bar{width:34px;height:1px;background:#c08c46;box-shadow:0 1px 4px rgba(0,0,0,.7)}
.fw-collection-count{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,240,233,.5);margin-bottom:18px;text-shadow:0 2px 10px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.9)}
.fw-title{font-weight:800;line-height:.94;letter-spacing:-.01em;font-size:clamp(28px,4vw,58px);text-transform:uppercase;color:rgba(242,240,233,.45) !important;text-shadow:0 2px 10px rgba(0,0,0,.3)}
.fw-piece{margin-top:14px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(242,240,233,.7);text-shadow:0 2px 10px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.9)}
.fw-piece b{color:#F2F0E9;font-weight:600;letter-spacing:.1em;text-shadow:0 2px 10px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.9)}
.fw-cta{margin-top:32px;display:flex;align-items:center;gap:18px}
.fw-pill{border:1px solid rgba(242,240,233,.3);border-radius:40px;padding:13px 26px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;background:rgba(242,240,233,.04);color:inherit;font-family:inherit;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:.35s}
.fw-pill:hover{background:rgba(242,240,233,.14);border-color:rgba(242,240,233,.6);color:#F2F0E9;backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}
.fw-anim{opacity:0;transform:translateY(22px);animation:fwUp .9s cubic-bezier(.7,0,.2,1) forwards}
.fw-anim.d2{animation-delay:.12s}.fw-anim.d3{animation-delay:.24s}
@keyframes fwUp{to{opacity:1;transform:none}}
@keyframes fwFlash{0%{transform:scale(1)}45%{transform:scale(1.5)}100%{transform:scale(1.08)}}
.fw-bottomrow{position:absolute;right:44px;bottom:36px;z-index:5;display:flex;align-items:center;gap:16px}
.fw-infopill{display:flex;align-items:center;gap:7px;padding:8px 15px;border-radius:20px;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.22);color:rgba(242,240,233,.75);font-size:10px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(4px);transition:.25s;font-family:inherit;flex:0 0 auto;white-space:nowrap}
.fw-infopill:hover{background:rgba(158,113,52,.25);border-color:#c08c46;color:#F2F0E9}
.fw-subrail{display:flex;gap:10px;align-items:flex-end;max-width:min(60vw,calc(100vw - 620px));overflow-x:auto;scrollbar-width:none;padding:8px 4px 4px}
.fw-subrail::-webkit-scrollbar{display:none}
.fw-subcard{position:relative;width:96px;height:124px;border-radius:11px;overflow:hidden;cursor:pointer;flex:0 0 auto;box-shadow:0 10px 22px rgba(0,0,0,.45);opacity:.85;transform:scale(.94);transition:transform .5s cubic-bezier(.7,0,.2,1),opacity .4s,box-shadow .4s;outline:1px solid rgba(242,240,233,.14);outline-offset:-1px}
.fw-subcard img{width:100%;height:100%;object-fit:cover}
.fw-subcard.on{opacity:1;transform:scale(1.06);box-shadow:0 16px 32px rgba(0,0,0,.55);outline-color:#c08c46}
.fw-subcard:hover{opacity:1}
.fw-subcard.flash img{animation:fwFlash .8s cubic-bezier(.7,0,.2,1)}
.fw-ctrls{position:absolute;left:50%;bottom:44px;z-index:6;display:flex;flex-direction:column;align-items:center;gap:12px;transform:translateX(-50%);transition:left .3s ease}
.fw-ctrls-label{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(242,240,233,.45)}
.fw-arrows{display:flex;align-items:center;gap:14px}
.fw-nav{width:52px;height:52px;border-radius:50%;border:1.5px solid rgba(242,240,233,.4);background:rgba(20,20,20,.4);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#F2F0E9;display:grid;place-items:center;cursor:pointer;transition:.3s}
.fw-nav:hover{border-color:#9E7134;color:#c08c46;background:rgba(20,20,20,.6)}
.fw-nav:active{transform:scale(.92);background:#9E7134;border-color:#9E7134;color:#F2F0E9}
.fw-prog{width:130px;height:2px;background:rgba(242,240,233,.18);position:relative;border-radius:2px}
.fw-prog i{position:absolute;left:0;top:0;height:100%;background:#c08c46;border-radius:2px;transition:width .7s cubic-bezier(.7,0,.2,1)}
@media(max-width:900px){.fw-lead{max-width:84vw;left:26px}.fw-subrail{display:none}}

.fw-imgslot{position:absolute;inset:0}
.fw-top-actions{display:flex;align-items:center;gap:10px}
.fw-icon-btn{display:flex;align-items:center;justify-content:center;width:38px;height:38px;flex:0 0 auto;border-radius:50%;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.22);color:rgba(242,240,233,.85);cursor:pointer;backdrop-filter:blur(4px);transition:.25s}
.fw-icon-btn:hover,.fw-icon-btn.open{background:rgba(158,113,52,.25);border-color:#c08c46;color:#F2F0E9}
.fw-exit{text-decoration:none;border-color:rgba(242,240,233,.42);color:#F2F0E9}
.fw-exit:hover{background:rgba(158,113,52,.32);border-color:#c08c46;color:#F2F0E9}
.fw-hamburger{display:none}
.fw-search-wrap{position:relative}
.fw-search-panel{position:absolute;top:calc(100% + 10px);right:0;z-index:25;width:min(270px,calc(100vw - 32px));max-height:380px;display:flex;flex-direction:column;background:rgba(16,16,16,.97);border:1px solid rgba(242,240,233,.16);border-radius:14px;padding:10px;box-shadow:0 30px 60px rgba(0,0,0,.55);backdrop-filter:blur(10px)}
.fw-search-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(242,240,233,.16);border-radius:10px;padding:9px 12px;color:#F2F0E9;font-size:12px;letter-spacing:.03em;font-family:inherit;outline:none;transition:.2s;box-sizing:border-box}
.fw-search-input:focus{border-color:#9E7134}
.fw-search-input::placeholder{color:rgba(242,240,233,.4)}
.fw-search-results{margin-top:8px;overflow-y:auto;max-height:280px;display:flex;flex-direction:column;gap:2px}
.fw-search-result{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:6px;border-radius:8px;background:transparent;border:none;color:rgba(242,240,233,.8);font-size:11px;letter-spacing:.03em;cursor:pointer;font-family:inherit;transition:.2s}
.fw-search-result:hover{background:rgba(255,255,255,.06);color:#F2F0E9}
.fw-search-result img{width:34px;height:34px;border-radius:6px;object-fit:cover;flex:0 0 auto}
.fw-search-result-name{display:block}
.fw-search-result-cat{display:block;color:rgba(242,240,233,.4);font-size:9px;letter-spacing:.12em;text-transform:uppercase;margin-top:2px}
.fw-search-empty{padding:14px 8px;text-align:center;color:rgba(242,240,233,.4);font-size:11px;letter-spacing:.06em}
.fw-mobile-menu{position:fixed;inset:0;z-index:40;background:rgba(6,5,4,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:flex;flex-direction:column}
.fw-mobile-menu-list{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:76px 24px 40px;overflow-y:auto;-webkit-overflow-scrolling:touch}
.fw-mobile-menu-item{display:block;width:100%;max-width:320px;text-align:center;padding:14px;border-radius:12px;background:transparent;border:none;color:rgba(242,240,233,.75);font-size:13px;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;cursor:pointer;font-family:inherit;transition:.2s}
.fw-mobile-menu-item:hover,.fw-mobile-menu-item.active{background:rgba(255,255,255,.06);color:#c08c46}
.fw-mobile-menu-close{position:absolute;top:20px;right:20px;padding:10px;border-radius:50%;background:rgba(255,255,255,.08);color:#F2F0E9;border:none;cursor:pointer}
.fw-mobile-menu-divider{width:60px;height:1px;background:rgba(242,240,233,.18);margin:10px 0}

@media(max-width:640px){
  .fw-wrap{position:relative;height:auto;min-height:100dvh;overflow:visible}
  .fw-imgslot{position:relative;height:42vh;min-height:240px}
  .fw-top{padding:16px 16px}
  .fw-logo{font-size:16px}
  .fw-catalogue-link,.fw-top-right{display:none}
  .fw-hamburger{display:flex}
  .fw-lead{position:static;max-width:100%;left:auto;bottom:auto;padding:24px 20px 0}
  .fw-bottomrow{position:static;right:auto;bottom:auto;justify-content:center;padding:18px 20px 0}
  .fw-ctrls{position:static !important;left:auto !important;transform:none !important;width:100%;padding:18px 20px 36px;gap:16px}
  .fw-arrows{gap:22px}
  .fw-nav{width:64px;height:64px;border-width:1.5px;border-color:rgba(242,240,233,.5)}
  .fw-nav svg{width:26px;height:26px}
  .fw-prog{width:160px}
  .fw-ctrls-label{font-size:11px}
}
`;

const config = {
  kicker: "Wall Art",
  covers: WALL_ART_COVERS,
  css: CSS,
  seedUpClose: SEED_UPCLOSE,
  upCloseImages: UP_CLOSE_IMAGES,
  mediaTag: null,                 // unscoped — every upload on /wall-art IS wall art
  orderPieces,                    // pins/shuffles Australian Natives (Wall Art only)
  DetailCard,                     // postcode-gated pricing panel
  QuoteBar,
  CatPageViewer,
  catalogue: { type: "modal", pages: WALL_ART_CAT_PAGES, label: "Wall Art Catalogue" },
  showSearch: true,
  showMobileMenu: true,
  showInfoPill: true,
  showCollectionCount: true,
  hasExpand: true,
  showExpandProgress: true,
  showExit: true,
  wrapImgSlot: true,
  navIcons: true,
  pillStripThe: true,
  exitClassName: "fw-icon-btn fw-exit",
  goDelay: 480,
};

export default function FeatureWall() {
  // Public gallery — no auth gate. (Promoted from the private admin preview to
  // the live Wall Art gallery; the password wall was removed as part of that
  // change-over so first-time visitors reach the gallery directly.)
  return <FeatureGallery config={config} />;
}
