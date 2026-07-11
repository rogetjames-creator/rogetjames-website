import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { WALL_ART_COVERS, DetailCard } from "./Gallery";
import { loadPostcode, savePostcode } from "../utils/postcode";

// Private, password-gated preview of an ALTERNATIVE gallery design, being
// built as a possible replacement for the current site's gallery template.
// Kept entirely self-contained — nothing in here links out to or interacts
// with the live site. Reachable only at /feature-wall behind the same
// admin password as /stats and /media. NOT linked anywhere public.

const CATS = WALL_ART_COVERS;

const CSS = `
.fw-wrap{position:fixed;inset:0;overflow:hidden;background:#1A1A1A;color:#F2F0E9;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.fw-bg{position:absolute;inset:0;background-size:cover;background-repeat:no-repeat;background-position:center;opacity:0;transform:scale(1.06);transition:opacity 1.1s cubic-bezier(.7,0,.2,1);will-change:opacity,transform}
.fw-bg.on{opacity:1;transform:scale(1);animation:fwDrift 9s linear forwards}
@keyframes fwDrift{from{transform:scale(1.03)}to{transform:scale(1.07)}}
.fw-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,12,12,.82),rgba(12,12,12,.45) 34%,rgba(12,12,12,.05) 60%,rgba(12,12,12,.25) 100%),linear-gradient(0deg,rgba(12,12,12,.55),rgba(12,12,12,0) 45%)}
.fw-top{position:absolute;top:0;left:0;right:0;z-index:6;display:flex;align-items:flex-start;justify-content:space-between;padding:28px 46px}
.fw-logo{font-weight:800;letter-spacing:.02em;font-size:19px}
.fw-logo i{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500}
.fw-top-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
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
.fw-expand-img{max-width:95vw;max-height:95vh;object-fit:contain;display:block}
.fw-expand-details{position:absolute;bottom:16px;right:16px;padding:9px 18px;border-radius:20px;background:rgba(0,0,0,.6);border:1px solid rgba(242,240,233,.25);color:rgba(242,240,233,.9);font-size:11px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:.25s;font-family:inherit}
.fw-expand-details:hover{background:#9E7134;border-color:#9E7134;color:#F2F0E9}
.fw-expand-close{position:absolute;top:16px;right:16px;padding:10px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;border:none;cursor:pointer;transition:.2s}
.fw-expand-close:hover{background:rgba(255,255,255,.2)}
.fw-expand-nav{position:absolute;top:50%;transform:translateY(-50%);padding:12px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;border:none;cursor:pointer;transition:.2s;z-index:1}
.fw-expand-nav:hover{background:rgba(255,255,255,.2)}
.fw-expand-nav.prev{left:16px}
.fw-expand-nav.next{right:16px}
.fw-lead{position:absolute;left:52px;bottom:340px;z-index:5;max-width:46vw}
.fw-kick{display:flex;align-items:center;gap:14px;font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#c08c46;margin-bottom:18px}
.fw-kick .bar{width:34px;height:1px;background:#c08c46}
.fw-title{font-weight:800;line-height:.94;letter-spacing:-.01em;font-size:clamp(32px,4.6vw,68px);text-transform:uppercase;text-shadow:0 8px 40px rgba(0,0,0,.35)}
.fw-piece{margin-top:14px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(242,240,233,.55)}
.fw-piece b{color:#F2F0E9;font-weight:600;letter-spacing:.1em}
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
  }, [cur]);

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
  }, [cur, go]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => { if (!menuWrapRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  // Piece thumbnails: hovering near either edge auto-scrolls that way, and
  // the row is rendered twice back-to-back so reaching the end loops
  // seamlessly back to the start instead of dead-ending.
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
      if (node) {
        if (hoverDirRef.current !== 0) node.scrollLeft += hoverDirRef.current * MAX_SPEED;
        const half = node.scrollWidth / 2;
        if (half > 0) {
          if (node.scrollLeft >= half) node.scrollLeft -= half;
          else if (node.scrollLeft < 0) node.scrollLeft += half;
        }
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

  useLayoutEffect(() => {
    const measure = () => {
      const el = pillRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPillCenter(r.left + r.width / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [cur]);

  const c = CATS[cur];
  // A design can have several photos of the same piece (Gallery.jsx "slides") —
  // show every one as its own thumb, sharing the piece's name, instead of
  // collapsing each design down to a single cover shot.
  const pieces = c.pieces.flatMap((p) =>
    p.slides && p.slides.length > 1 ? p.slides.map((img) => ({ ...p, img })) : [p]
  );
  const expandNav = (dir) => goPiece((pieceIdx + dir + pieces.length) % pieces.length);
  const activePiece = pieces[pieceIdx] || pieces[0];
  // Title always breaks after the first word (e.g. "AUSTRALIAN" / "NATIVES")
  // rather than wrapping wherever the container width happens to allow.
  const titleSpace = c.label.indexOf(" ");
  const titleFirst = titleSpace === -1 ? c.label : c.label.slice(0, titleSpace);
  const titleRest = titleSpace === -1 ? "" : c.label.slice(titleSpace + 1);

  return (
    <div className="fw-wrap">
      <style>{CSS}</style>
      {pieces.map((p, i) => (
        <div key={`${c.id}-${i}`} className={`fw-bg ${i === pieceIdx ? "on" : ""}`} style={{ backgroundImage: `url("${p.img}")` }} />
      ))}
      <div className="fw-scrim" />

      <header className="fw-top">
        <div className="fw-logo">ROGET<i>james</i></div>
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
            {[...pieces, ...pieces].map((p, j) => {
              const i = j % pieces.length;
              return (
                <div key={`${p.name}-${j}`} className={`fw-subcard ${i === pieceIdx ? "on" : ""} ${i === pieceFlash ? "flash" : ""}`}
                  onClick={() => { if (i !== pieceIdx) goPiece(i); }}>
                  <img src={p.img} alt={p.name} />
                </div>
              );
            })}
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
            <button
              className="fw-expand-details"
              onClick={() => { setExpanded(false); setDetailItem(activePiece); }}
            >
              Info · Prices
            </button>
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
