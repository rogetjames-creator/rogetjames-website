import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { WALL_ART_COVERS, DetailCard } from "./Gallery";
import { loadPostcode, savePostcode } from "../utils/postcode";

// Private, password-gated preview of an ALTERNATIVE gallery design, being
// built as a possible replacement for the current site's gallery template.
// Reachable only at /feature-wall behind the same admin password as /stats
// and /media. NOT linked anywhere public. Reads the same live Up Close /
// media data as Gallery.jsx (see below) so uploads show up here too.

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

const CSS = `
.fw-wrap{position:fixed;inset:0;overflow:hidden;background:#000;color:#F2F0E9;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.fw-bg{position:absolute;inset:0;background-size:contain;background-repeat:no-repeat;background-position:center;opacity:0;transition:opacity 1.1s cubic-bezier(.7,0,.2,1);will-change:opacity}
.fw-bg.on{opacity:1}
.fw-top{position:absolute;top:0;left:0;right:0;z-index:6;display:flex;align-items:flex-start;justify-content:space-between;padding:28px 46px}
.fw-logo{font-weight:800;letter-spacing:.02em;font-size:19px}
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
.fw-pill{border:1px solid rgba(242,240,233,.3);border-radius:40px;padding:13px 26px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;background:transparent;color:inherit;font-family:inherit;cursor:pointer;transition:.35s}
.fw-pill:hover{background:#F2F0E9;color:#1A1A1A;border-color:#F2F0E9}
.fw-anim{opacity:0;transform:translateY(22px);animation:fwUp .9s cubic-bezier(.7,0,.2,1) forwards}
.fw-anim.d2{animation-delay:.12s}.fw-anim.d3{animation-delay:.24s}
@keyframes fwUp{to{opacity:1;transform:none}}
@keyframes fwFlash{0%{transform:scale(1)}45%{transform:scale(1.5)}100%{transform:scale(1.08)}}
.fw-bottomrow{position:absolute;right:44px;bottom:36px;z-index:5;display:flex;align-items:center;gap:16px}
.fw-infopill{display:flex;align-items:center;gap:7px;padding:8px 15px;border-radius:20px;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.22);color:rgba(242,240,233,.75);font-size:10px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(4px);transition:.25s;font-family:inherit;flex:0 0 auto;white-space:nowrap}
.fw-infopill:hover{background:rgba(158,113,52,.25);border-color:#c08c46;color:#F2F0E9}
.fw-subrail{display:flex;gap:10px;align-items:flex-end;max-width:60vw;overflow-x:auto;scrollbar-width:none;padding:8px 4px 4px}
.fw-subrail::-webkit-scrollbar{display:none}
.fw-subcard{position:relative;width:96px;height:124px;border-radius:11px;overflow:hidden;cursor:pointer;flex:0 0 auto;box-shadow:0 10px 22px rgba(0,0,0,.45);opacity:.6;transform:scale(.94);transition:transform .5s cubic-bezier(.7,0,.2,1),opacity .4s,box-shadow .4s;outline:1px solid rgba(242,240,233,.14);outline-offset:-1px}
.fw-subcard img{width:100%;height:100%;object-fit:cover}
.fw-subcard.on{opacity:1;transform:scale(1.06);box-shadow:0 16px 32px rgba(0,0,0,.55);outline-color:#c08c46}
.fw-subcard:hover{opacity:.9}
.fw-subcard.flash img{animation:fwFlash .8s cubic-bezier(.7,0,.2,1)}
.fw-ctrls{position:absolute;left:50%;bottom:44px;z-index:6;display:flex;flex-direction:column;align-items:center;gap:12px;transform:translateX(-50%);transition:left .3s ease}
.fw-ctrls-label{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(242,240,233,.45)}
.fw-arrows{display:flex;align-items:center;gap:14px}
.fw-nav{width:50px;height:50px;border-radius:50%;border:1px solid rgba(242,240,233,.28);background:rgba(20,20,20,.35);backdrop-filter:blur(6px);color:#F2F0E9;display:grid;place-items:center;cursor:pointer;transition:.3s;font-size:16px}
.fw-nav:hover{border-color:#9E7134;color:#c08c46;background:rgba(20,20,20,.6)}
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
  // Shared with the live site — same localStorage key, so a postcode entered
  // here or on the public gallery carries over either way.
  const [postcodeInfo, setPostcodeInfo] = useState(() => loadPostcode());
  const handleSetPostcode = useCallback((info) => { savePostcode(info); setPostcodeInfo(info); }, []);
  // The arrows + progress line sit centred under the pill, whose width
  // changes with the category name (e.g. "Plumes" vs "Australian Natives") —
  // measure its actual position rather than assume a fixed offset.
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
    const withUpClose = WALL_ART_COVERS.map((cat) => {
      const imgs = upCloseForSeries(cat.id);
      if (!imgs.length) return cat;
      const upClosePiece = { name: `${cat.label} — Up Close`, img: imgs[0], slides: imgs, _upclose: true };
      return { ...cat, pieces: [...cat.pieces, upClosePiece] };
    });

    const seedSrcs = new Set(UP_CLOSE_IMAGES.map((u) => u.src));
    const mediaUpClose = mediaImages.filter((m) => m.destinations.length > 0);
    const uploads = [
      ...uploadedUpClose.map((u) => ({ src: u.src, name: u.name || "", createdTime: u.createdTime || "" })),
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
    setTimeout(() => { busy.current = false; }, 1100);
  }, [cur, CATS]);

  const goPiece = useCallback((i) => {
    setPieceIdx(i);
    setPieceFlash(i);
    setTimeout(() => setPieceFlash(-1), 1100);
  }, []);

  useEffect(() => {
    CATS.forEach((cat) => cat.pieces.forEach((p) => {
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
  // "& GENIE BOTTLES"), otherwise after the first word (e.g. "AUSTRALIAN" /
  // "NATIVES") — never wherever the container width happens to allow.
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
        <div className="fw-logo">ROGET<i>james</i></div>
        <a className="fw-catalogue-link" href="/?view=wallartcat" target="_blank" rel="noopener noreferrer">
          Wall Art Catalogue
        </a>
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
      </header>

      <div className="fw-lead" key={cur}>
        <div className="fw-kick fw-anim"><span className="bar" />Wall Art</div>
        <h1 className="fw-title fw-anim d2">{titleFirst}{titleRest && <><br />{titleRest}</>}</h1>
        <div className="fw-piece fw-anim d2">On display — <b>{activePiece.name}</b></div>
        <div className="fw-cta fw-anim d3">
          <button className="fw-pill" ref={pillRef} onClick={() => setExpanded(true)}>
            View the {c.label.toLowerCase()} collection
          </button>
        </div>
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
          <button className="fw-nav" aria-label="Previous" onClick={() => go(cur - 1)}>&#8592;</button>
          <button className="fw-nav" aria-label="Next" onClick={() => go(cur + 1)}>&#8594;</button>
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
    </div>
  );
}

export default function FeatureWall() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (adminSecret) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/stats-data", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminSecret }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Failed."); setAuthed(false);
        try { localStorage.removeItem("stats_key"); } catch { /* ignore */ }
      } else {
        setAuthed(true);
        try { localStorage.setItem("stats_key", adminSecret); } catch { /* ignore */ }
      }
    } catch { setError("Request failed. Check your connection."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const urlKey = new URLSearchParams(window.location.search).get("key");
    const saved = urlKey || (() => { try { return localStorage.getItem("stats_key"); } catch { return null; } })();
    if (urlKey) window.history.replaceState({}, "", "/feature-wall");
    if (saved) login(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-jet flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white/8 border border-white/18 rounded-[2rem] p-8">
            <div className="text-center mb-8">
              <span className="inline-block font-heading font-bold text-cream text-xl tracking-tight">
                ROGET<span className="font-normal italic font-drama">james</span>
              </span>
              <div className="w-8 h-px bg-clay/60 mx-auto mt-3 mb-4" />
              <p className="font-detail text-[10px] text-cream/85 uppercase tracking-[0.25em]">Feature Wall — Private</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); if (secret.trim()) login(secret.trim()); }} className="space-y-4">
              <input type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="Admin password"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-2xl px-5 py-3.5 text-center font-heading text-cream tracking-[0.15em] placeholder:text-cream/30 placeholder:font-detail placeholder:text-sm outline-none transition-colors"
                style={{ caretColor: "#9E7134" }} />
              <button type="submit" disabled={!secret.trim() || loading}
                className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 transition-all">
                {loading ? "Loading…" : "Enter"}
              </button>
            </form>
            {error && <p className="font-detail text-[11px] text-red-300 text-center mt-4">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return <Gallery />;
}
