import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { SCULPTURE_COVERS, DetailCard } from "./Gallery";
import { QuoteBar } from "./FeatureQuote";
import CatPageViewer from "./CatPageViewer";
import { loadPostcode, savePostcode } from "../utils/postcode";

// Sculpture catalogue page scans (mirrors Gallery.jsx SCULPTURE_CAT_PAGES) —
// opened in-page by the "Sculpture Catalogue" pill so it never bounces to the
// homepage.
const SCULPTURE_CAT_PAGES = [1, 5, 4, 6, 7].map(n =>
  `/images/catalogues/cat2/page-${String(n).padStart(2, "0")}.jpg`
);

// The live public Sculpture gallery at /feature-sculpture — same model as the
// Wall Art page (see FeatureWall.jsx), retargeted at the sculpture catalogue.
// Linked from the nav/footer/homepage Collection. Reads the same live Up
// Close / media data as Gallery.jsx so uploads show up here too.

// No curated seed close-ups exist for sculpture yet — kept empty (matching
// FeatureWall.jsx's pattern) so any future uploads tagged "sculpture" via
// /media still show up automatically with no code change needed here.
const SEED_UPCLOSE = {};
const UP_CLOSE_IMAGES = [];

const CSS = `
.fw-wrap{position:fixed;inset:0;overflow:hidden;background:#000;color:#F2F0E9;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.fw-bg{position:absolute;inset:0;background-size:contain;background-repeat:no-repeat;background-position:center;opacity:0;transition:opacity .5s cubic-bezier(.7,0,.2,1);will-change:opacity}
.fw-bg.on{opacity:1}
.fw-top{position:absolute;top:0;left:0;right:0;z-index:6;display:flex;align-items:flex-start;justify-content:space-between;padding:28px 46px}
.fw-logo{font-weight:800;letter-spacing:.02em;font-size:19px;color:#F2F0E9;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:color .25s}
.fw-logo:hover{color:#c08c46}
.fw-logo i{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500}
.fw-top-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.fw-top-actions{display:flex;align-items:center;gap:10px}
.fw-exit{display:flex;align-items:center;justify-content:center;width:38px;height:38px;flex:0 0 auto;border-radius:50%;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.42);color:#F2F0E9;cursor:pointer;text-decoration:none;backdrop-filter:blur(4px);transition:.25s}
.fw-exit:hover{background:rgba(158,113,52,.32);border-color:#c08c46;color:#F2F0E9}
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
.fw-expand-overlay{position:fixed;inset:0;z-index:10000;background:#000;display:flex;align-items:center;justify-content:center;cursor:zoom-out}
.fw-expand-imgwrap{position:relative;display:inline-flex;cursor:default}
.fw-expand-img{max-width:88vw;max-height:88vh;object-fit:contain;display:block;border-radius:20px}
.fw-expand-details{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);padding:9px 18px;border-radius:20px;background:rgba(0,0,0,.6);border:1px solid rgba(242,240,233,.25);color:rgba(242,240,233,.9);font-size:11px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:.25s;font-family:inherit;white-space:nowrap}
.fw-expand-details:hover{background:#9E7134;border-color:#9E7134;color:#F2F0E9}
.fw-expand-close{position:absolute;top:16px;right:16px;padding:10px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;border:none;cursor:pointer;transition:.2s}
.fw-expand-close:hover{background:rgba(255,255,255,.2)}
.fw-expand-nav{position:absolute;top:50%;transform:translateY(-50%);padding:12px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;border:none;cursor:pointer;transition:.2s;z-index:1}
.fw-expand-nav:hover{background:rgba(255,255,255,.2)}
.fw-expand-nav.prev{left:16px}
.fw-expand-nav.next{right:16px}
.fw-lead{position:absolute;left:52px;bottom:340px;z-index:5;max-width:46vw}
.fw-kick{display:flex;align-items:center;gap:14px;font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#c08c46;margin-bottom:18px;text-shadow:0 2px 10px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.9)}
.fw-kick .bar{width:34px;height:1px;background:#c08c46;box-shadow:0 1px 4px rgba(0,0,0,.7)}
.fw-title{font-weight:800;line-height:.94;letter-spacing:-.01em;font-size:clamp(28px,4vw,58px);text-transform:uppercase;color:rgba(242,240,233,.45) !important;text-shadow:0 2px 10px rgba(0,0,0,.3)}
.fw-piece{margin-top:14px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(242,240,233,.7);text-shadow:0 2px 10px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.9)}
.fw-piece b{color:#F2F0E9;font-weight:600;letter-spacing:.1em;text-shadow:0 2px 10px rgba(0,0,0,.7),0 1px 3px rgba(0,0,0,.9)}
.fw-cta{margin-top:32px;display:flex;align-items:center;gap:18px}
.fw-deliver{margin-top:16px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,240,233,.5);text-shadow:0 2px 8px rgba(0,0,0,.8)}
.fw-pill{border:1px solid rgba(242,240,233,.3);border-radius:40px;padding:13px 26px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;background:rgba(242,240,233,.04);color:inherit;font-family:inherit;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:.35s}
.fw-pill:hover{background:rgba(242,240,233,.14);border-color:rgba(242,240,233,.6);color:#F2F0E9;backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}
.fw-anim{opacity:0;transform:translateY(22px);animation:fwUp .9s cubic-bezier(.7,0,.2,1) forwards}
.fw-anim.d2{animation-delay:.12s}.fw-anim.d3{animation-delay:.24s}
@keyframes fwUp{to{opacity:1;transform:none}}
@keyframes fwFlash{0%{transform:scale(1)}45%{transform:scale(1.5)}100%{transform:scale(1.08)}}
.fw-bottomrow{position:absolute;right:44px;bottom:36px;z-index:5;display:flex;align-items:center;gap:16px}
.fw-infopill{display:flex;align-items:center;gap:7px;padding:8px 15px;border-radius:20px;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.22);color:rgba(242,240,233,.75);font-size:10px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(4px);transition:.25s;font-family:inherit;flex:0 0 auto;white-space:nowrap}
.fw-infopill:hover{background:rgba(158,113,52,.25);border-color:#c08c46;color:#F2F0E9}
.fw-subrail{display:flex;gap:10px;align-items:flex-end;max-width:60vw;overflow-x:auto;scrollbar-width:none;padding:8px 4px 4px}
.fw-subrail::-webkit-scrollbar{display:none}
.fw-subcard{position:relative;width:96px;height:124px;border-radius:11px;overflow:hidden;cursor:pointer;flex:0 0 auto;box-shadow:0 10px 22px rgba(0,0,0,.45);opacity:.85;transform:scale(.94);transition:transform .5s cubic-bezier(.7,0,.2,1),opacity .4s,box-shadow .4s;outline:1px solid rgba(242,240,233,.14);outline-offset:-1px}
.fw-subcard img{width:100%;height:100%;object-fit:cover}
.fw-subcard.on{opacity:1;transform:scale(1.06);box-shadow:0 16px 32px rgba(0,0,0,.55);outline-color:#c08c46}
.fw-subcard:hover{opacity:1}
.fw-subcard.flash img{animation:fwFlash .8s cubic-bezier(.7,0,.2,1)}
.fw-ctrls{position:absolute;left:50%;bottom:44px;z-index:6;display:flex;flex-direction:column;align-items:center;gap:12px;transform:translateX(-50%)}
.fw-ctrls-label{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(242,240,233,.45)}
.fw-arrows{display:flex;align-items:center;gap:14px}
.fw-nav{width:52px;height:52px;border-radius:50%;border:1.5px solid rgba(242,240,233,.4);background:rgba(20,20,20,.4);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#F2F0E9;display:grid;place-items:center;cursor:pointer;transition:.3s}
.fw-nav:hover{border-color:#9E7134;color:#c08c46;background:rgba(20,20,20,.6)}
.fw-nav:active{transform:scale(.92);background:#9E7134;border-color:#9E7134;color:#F2F0E9}
.fw-prog{width:130px;height:2px;background:rgba(242,240,233,.18);position:relative;border-radius:2px}
.fw-prog i{position:absolute;left:0;top:0;height:100%;background:#c08c46;border-radius:2px;transition:width .7s cubic-bezier(.7,0,.2,1)}
@media(max-width:900px){.fw-lead{max-width:84vw;left:26px}.fw-subrail{display:none}}
`;

function Gallery() {
  const [cur, setCur] = useState(0);
  const [pieceIdx, setPieceIdx] = useState(0);
  const busy = useRef(false);
  const [pieceFlash, setPieceFlash] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [catOpen, setCatOpen] = useState(false);
  // Shared with the live site — same localStorage key, so a postcode entered
  // here or on the public gallery carries over either way.
  const [postcodeInfo, setPostcodeInfo] = useState(() => loadPostcode());
  const handleSetPostcode = useCallback((info) => { savePostcode(info); setPostcodeInfo(info); }, []);
  const pillRef = useRef(null);
  const [pillCenter, setPillCenter] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef(null);
  const subrailRef = useRef(null);
  const hoverDirRef = useRef(0);

  // Same three Up Close / media sources Gallery.jsx reads: the dedicated
  // Up Close uploader (Blobs), the older media-library uploader (Blobs),
  // and the git-committed manifest (fast static file). A category's close-up
  // tile is anything tagged with that category's own id — matching
  // Gallery.jsx's upCloseForSeries exactly, not a separate "up-close" tag.
  const [uploadedUpClose, setUploadedUpClose] = useState([]);
  const [mediaImages, setMediaImages] = useState([]);
  useEffect(() => {
    let alive = true;
    fetch("/api/up-close-list")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d.images)) {
          setUploadedUpClose(d.images.map((i) => ({ src: i.src, name: i.name, destinations: i.destinations || [], createdTime: i.createdTime || "" })));
        }
      })
      .catch(() => {});
    Promise.all([
      fetch(`/media-manifest.json?v=${Date.now()}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/media-list").then((r) => r.json()).catch(() => ({ images: [] })),
    ]).then(([manifest, legacy]) => {
      if (!alive) return;
      const fromManifest = Array.isArray(manifest)
        ? manifest.map((e) => ({ src: `/${e.path}`, destinations: e.destinations || [], createdTime: e.createdTime || "" }))
        : [];
      const fromLegacy = Array.isArray(legacy.images)
        ? legacy.images.map((i) => ({ src: i.src, destinations: i.destinations || [], createdTime: i.createdTime || "" }))
        : [];
      setMediaImages([...fromManifest, ...fromLegacy]);
    });
    return () => { alive = false; };
  }, []);

  const byUploadTime = (a, b) => new Date(a.createdTime || 0) - new Date(b.createdTime || 0);
  const upCloseForSeries = useCallback((id) => {
    const seed = SEED_UPCLOSE[id] || [];
    const uploads = [
      ...mediaImages.filter((m) => m.destinations.includes(id)).map((m) => ({ src: m.src, createdTime: m.createdTime || "" })),
      ...uploadedUpClose.filter((u) => (u.destinations || []).includes(id)).map((u) => ({ src: u.src, createdTime: u.createdTime || "" })),
    ].sort(byUploadTime);
    const out = [...seed];
    for (const u of uploads) if (!out.includes(u.src)) out.push(u.src);
    return out;
  }, [mediaImages, uploadedUpClose]);

  // Every collection gets its seeded + uploaded close-up shots appended as
  // its own "— Up Close" piece, and every close-up also collects into its
  // own "Up Close" category — mirroring the live gallery's Up Close pill.
  const CATS = useMemo(() => {
    const withUpClose = SCULPTURE_COVERS.map((cat) => {
      const imgs = upCloseForSeries(cat.id);
      if (!imgs.length) return cat;
      const upClosePiece = { name: `${cat.label} — Up Close`, img: imgs[0], slides: imgs, _upclose: true };
      return { ...cat, pieces: [...cat.pieces, upClosePiece] };
    });

    // Scoped to "sculpture" specifically — mediaImages/uploadedUpClose are
    // shared stores across the whole site, so an unfiltered "any tag" match
    // (fine on the wall-art page, where every upload IS wall art) would pull
    // wall-art close-ups in here too.
    const seedSrcs = new Set(UP_CLOSE_IMAGES.map((u) => u.src));
    const mediaUpClose = mediaImages.filter((m) => m.destinations.includes("sculpture"));
    const uploads = [
      ...uploadedUpClose.filter((u) => (u.destinations || []).includes("sculpture")).map((u) => ({ src: u.src, name: u.name || "", createdTime: u.createdTime || "" })),
      ...mediaUpClose.map((m) => ({ src: m.src, name: "", createdTime: m.createdTime || "" })),
    ].filter((u) => !seedSrcs.has(u.src)).sort(byUploadTime);
    const seen = new Set();
    const ordered = uploads.filter((u) => { if (seen.has(u.src)) return false; seen.add(u.src); return true; });
    const allUpClose = [...UP_CLOSE_IMAGES, ...ordered].map((u) => ({ name: u.name || "Up Close", img: u.src, _upclose: true }));

    if (allUpClose.length) {
      withUpClose.push({ id: "up-close", label: "UP CLOSE", img: allUpClose[0].img, pieces: allUpClose });
    }
    return withUpClose;
  }, [mediaImages, uploadedUpClose, upCloseForSeries]);

  const go = useCallback((i) => {
    if (busy.current) return;
    const n = (i + CATS.length) % CATS.length;
    if (n === cur) return;
    busy.current = true;
    setCur(n);
    setPieceIdx(0);
    setExpanded(false);
    setDetailItem(null);
    setMenuOpen(false);
    setTimeout(() => { busy.current = false; }, 480);
  }, [cur, CATS]);

  const goPiece = useCallback((i) => {
    setPieceIdx(i);
    setPieceFlash(i);
    setTimeout(() => setPieceFlash(-1), 1100);
  }, []);

  useEffect(() => {
    // Warm only the current collection and its immediate neighbours (for a
    // smooth Next/Prev) rather than eager-loading every collection's images
    // up front.
    const n = CATS.length;
    const near = n ? [cur, (cur + 1) % n, (cur - 1 + n) % n] : [];
    near.forEach((i) => CATS[i]?.pieces.forEach((p) => {
      (p.slides && p.slides.length > 1 ? p.slides : [p.img]).forEach((src) => { const im = new Image(); im.src = src; });
    }));
    const onKey = (e) => { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur, go, CATS]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => { if (!menuWrapRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  // Piece thumbnails: hovering near either edge auto-scrolls that way, and
  // stops naturally at the start/end — no looping or wrap-around, and the
  // row renders once (not doubled), so nothing is ever shown twice at once.
  useEffect(() => {
    const el = subrailRef.current;
    if (!el) return;
    const ZONE = 70;
    const MAX_SPEED = 7;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < ZONE) hoverDirRef.current = -((ZONE - x) / ZONE);
      else if (x > rect.width - ZONE) hoverDirRef.current = (x - (rect.width - ZONE)) / ZONE;
      else hoverDirRef.current = 0;
    };
    const onLeave = () => { hoverDirRef.current = 0; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    let raf;
    const tick = () => {
      const node = subrailRef.current;
      if (node && hoverDirRef.current !== 0) {
        node.scrollLeft = Math.max(0, Math.min(node.scrollWidth - node.clientWidth, node.scrollLeft + hoverDirRef.current * MAX_SPEED));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [cur]);

  // Measured once, on first mount, and never again — the arrows/label/
  // progress line lock to that position permanently instead of re-centring
  // under the pill (and shifting) every time the category changes.
  useLayoutEffect(() => {
    const el = pillRef.current;
    if (!el || pillCenter != null) return;
    const r = el.getBoundingClientRect();
    setPillCenter(r.left + r.width / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const c = CATS[cur];
  // A design can have several photos of the same piece (Gallery.jsx "slides") —
  // show every one as its own thumb, sharing the piece's name, instead of
  // collapsing each design down to a single cover shot.
  const pieces = c.pieces.flatMap((p) =>
    p.slides && p.slides.length > 1 ? p.slides.map((img) => ({ ...p, img })) : [p]
  );
  const expandNav = (dir) => goPiece((pieceIdx + dir + pieces.length) % pieces.length);
  const activePiece = pieces[pieceIdx] || pieces[0];
  // Title breaks right before " & " if the label has one (e.g. "BON BONS" /
  // "& GENIE BOTTLES"), otherwise after the first word — never wherever the
  // container width happens to allow.
  const titleSpace = c.label.includes(" & ") ? c.label.indexOf(" & ") : c.label.indexOf(" ");
  const titleFirst = titleSpace === -1 ? c.label : c.label.slice(0, titleSpace);
  const titleRest = titleSpace === -1 ? "" : c.label.slice(titleSpace + 1);

  return (
    <div className="fw-wrap">
      <style>{CSS}</style>
      {pieces.map((p, i) => (
        <div key={`${c.id}-${i}`} className={`fw-bg ${i === pieceIdx ? "on" : ""}`} style={{ backgroundImage: `url("${p.img}")` }} />
      ))}

      <header className="fw-top">
        <a className="fw-logo" href="/" title="Back to ROGETjames home">ROGET<i>james</i></a>
        <button className="fw-catalogue-link" onClick={() => setCatOpen(true)}>
          Sculpture Catalogue
        </button>
        <div className="fw-top-actions">
          <div className="fw-top-right">
            <div className="fw-menu-wrap" ref={menuWrapRef}>
              <button className={`fw-menu-btn ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen((v) => !v)}>
                Collection Menu <ChevronDown size={12} />
              </button>
              {menuOpen && (
                <div className="fw-menu-panel">
                  {CATS.map((cat, i) => (
                    <button
                      key={cat.id}
                      className={`fw-menu-item ${i === cur ? "active" : ""}`}
                      onClick={() => go(i)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <a className="fw-exit" href="/" aria-label="Close gallery — back to main site" title="Back to ROGETjames">
            <X size={17} />
          </a>
        </div>
      </header>

      <div className="fw-lead" key={cur}>
        <div className="fw-kick fw-anim"><span className="bar" />Sculpture</div>
        <h1 className="fw-title fw-anim d2">{titleFirst}{titleRest && <><br />{titleRest}</>}</h1>
        <div className="fw-piece fw-anim d2">On display — <b>{activePiece.name}</b></div>
        <div className="fw-cta fw-anim d3">
          <button className="fw-pill" ref={pillRef} onClick={() => setExpanded(true)}>
            View the {c.label.toLowerCase()} collection
          </button>
        </div>
        <div className="fw-deliver fw-anim d3">Production lead time 3&ndash;6 weeks &middot; Australia-wide delivery</div>
      </div>

      <div className="fw-bottomrow">
        <button className="fw-infopill" onClick={() => setExpanded(true)}>
          Design · Info · Prices
        </button>
        {pieces.length > 1 && (
          <div className="fw-subrail" ref={subrailRef} key={c.id}>
            {pieces.map((p, i) => (
              <div key={p.name + i} className={`fw-subcard ${i === pieceIdx ? "on" : ""} ${i === pieceFlash ? "flash" : ""}`}
                onClick={() => { if (i !== pieceIdx) goPiece(i); }}>
                <img src={p.img} alt={p.name} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fw-ctrls" style={pillCenter != null ? { left: `${pillCenter}px` } : undefined}>
        <div className="fw-ctrls-label">Collections</div>
        <div className="fw-arrows">
          <button className="fw-nav" aria-label="Previous" onClick={() => go(cur - 1)}><ArrowLeft size={20} strokeWidth={2} /></button>
          <button className="fw-nav" aria-label="Next" onClick={() => go(cur + 1)}><ArrowRight size={20} strokeWidth={2} /></button>
        </div>
        <div className="fw-prog"><i style={{ width: `${((cur + 1) / CATS.length) * 100}%` }} /></div>
        <div className="fw-count">{String(cur + 1).padStart(2, "0")} / {String(CATS.length).padStart(2, "0")}</div>
      </div>

      {expanded && (
        <div className="fw-expand-overlay" onClick={() => setExpanded(false)}>
          {pieces.length > 1 && (
            <button
              className="fw-expand-nav prev"
              onClick={(e) => { e.stopPropagation(); expandNav(-1); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="fw-expand-imgwrap" onClick={(e) => e.stopPropagation()}>
            <img src={activePiece.img} alt={activePiece.name} className="fw-expand-img" />
            {!activePiece._upclose && (
              <button
                className="fw-expand-details"
                onClick={() => { setExpanded(false); setDetailItem(activePiece); }}
              >
                Info · Prices
              </button>
            )}
          </div>
          {pieces.length > 1 && (
            <button
              className="fw-expand-nav next"
              onClick={(e) => { e.stopPropagation(); expandNav(1); }}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          )}
          <button
            className="fw-expand-close"
            onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
            aria-label="Close expanded view"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {detailItem && (
        <DetailCard
          item={detailItem}
          seriesLabel={c.label}
          onClose={() => setDetailItem(null)}
          postcodeInfo={postcodeInfo}
          onSetPostcode={handleSetPostcode}
        />
      )}

      {catOpen && (
        <CatPageViewer pages={SCULPTURE_CAT_PAGES} label="Sculpture Catalogue" onClose={() => setCatOpen(false)} />
      )}

      <QuoteBar />
    </div>
  );
}

export default function SculptureWall() {
  // Public gallery — no auth gate. (Promoted from the private admin preview to
  // the live Sculpture gallery; the password wall was removed as part of that
  // change-over so first-time visitors reach the gallery directly.)
  return <Gallery />;
}
