import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import gsap from "gsap";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATALOGUES } from "../catalogues";
const CatPageViewer = lazy(() => import("./CatPageViewer"));

// The client gallery viewer — deliberately mirrors the Wall Art / Screens /
// Sculpture gallery look: client name + RJ mark divider on top, one large image
// on black, a thumbnail strip along the bottom, spiel underneath.
// Shared by the Client Preview popup and the /vault page.

const previewImg = (url, w) => {
  if (!url) return url;
  if (/^data:/.test(url)) return url;
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${w}&fm=webp&q=74`;
};
const NO_SAVE = { onContextMenu: (e) => e.preventDefault(), onDragStart: (e) => e.preventDefault(), draggable: false };
const NO_SAVE_STYLE = { userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none" };

// Placeholder spiel shown when a client has no custom message yet.
const DEFAULT_SPIEL = "This is your private preview — a selection prepared exclusively for you. Take your time with each piece: study the detail, picture it in your space, and note anything that draws you in. Every design here can be tailored in size, finish and material to suit your setting. When you're ready, we'll refine the shortlist together and move toward your final commission.";

const CSS = `
.rjv{display:flex;flex-direction:column;color:#F2F0E9;width:100%}
.rjv-head{text-align:center;padding:0 16px 0}
/* Client name — vertical label down the left, reading bottom-to-top,
   two-tone (grey + charcoal), muted */
.rjv-vname{position:fixed;left:38px;top:50%;transform:translate(-50%,-50%) rotate(-90deg);transform-origin:center;font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:800;font-size:clamp(28px,4.4vw,58px);line-height:1;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;z-index:15;pointer-events:none;user-select:none}
.rjv-vname .w1{color:rgba(237,232,223,.42)}
.rjv-vname .w2{color:rgba(237,232,223,.2)}
.rjv-cat{display:inline-block;margin-top:16px;font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#F2F0E9;border:1px solid rgba(237,232,223,.32);border-radius:999px;padding:8px 18px;text-decoration:none;transition:.25s}
.rjv-cat:hover{background:#9E7134;border-color:#9E7134}
.rjv-mark{position:relative;width:78px;height:78px;margin:0 auto 6px;display:flex;align-items:center;justify-content:center}
.rjv-mark img{width:100%;height:auto;opacity:.5;filter:drop-shadow(0 5px 0 rgba(0,0,0,.55))}
.rjv-mark .ln{position:absolute;top:50%;height:1.5px;width:90px;background:rgba(242,240,233,.35);margin-top:-.75px}
.rjv-mark .ln.l{right:calc(100% + 10px)}
.rjv-mark .ln.r{left:calc(100% + 10px)}
.rjv-greet{font-family:var(--font-detail,system-ui,sans-serif);font-size:13.5px;letter-spacing:.01em;color:rgba(237,232,223,.62);max-width:640px;margin:8px auto 0;line-height:1.65;white-space:pre-line}
.rjv-stage{height:58vh;display:flex;align-items:center;justify-content:center;margin:18px 0 8px}
.rjv-stage img{max-width:100%;max-height:100%;object-fit:contain;border-radius:14px;box-shadow:0 26px 70px rgba(0,0,0,.55);cursor:zoom-in;transition:opacity .18s ease}
.rjv-cap{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:12px}
.rjv-cap .dn{font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(237,232,223,.34)}
.rjv-cap .dn b{color:rgba(237,232,223,.56);font-weight:600}
.rjv-thumbs{display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;overflow-x:auto;scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none;padding:2px}
.rjv-thumbs::-webkit-scrollbar{display:none}
.rjv-thumb{flex:0 0 auto;width:62px;height:62px;border-radius:9px;overflow:hidden;border:1px solid rgba(237,232,223,.16);cursor:pointer;position:relative;transition:border-color .25s,transform .25s}
.rjv-thumb:hover{transform:translateY(-2px)}
.rjv-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.rjv-thumb.active{border-color:#9E7134;box-shadow:0 0 0 1px #9E7134}
.rjv-spiel{max-width:680px;margin:30px auto 0;text-align:center;font-family:var(--font-detail,system-ui,sans-serif);font-size:15.5px;line-height:1.85;color:rgba(237,232,223,.7);white-space:pre-line}
.rjv-links{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:18px auto 0}
.rjv-link{font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.02em;color:#c79a5b;border:1px solid rgba(158,113,52,.45);border-radius:999px;padding:6px 14px;transition:.2s;text-decoration:none}
.rjv-link:hover{color:#e6c489;border-color:#9E7134}
.rjv-topbar{position:fixed;top:14px;left:0;right:0;z-index:30;display:flex;justify-content:space-between;align-items:flex-start;padding:0 16px;pointer-events:none}
.rjv-topbar>*{pointer-events:auto}
.rjv-web{font-family:var(--font-detail,system-ui,sans-serif);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#F2F0E9;border:1px solid rgba(237,232,223,.32);border-radius:30px;padding:8px 16px;background:none;cursor:pointer;text-decoration:none;transition:.25s;white-space:nowrap}
.rjv-web:hover{background:#9E7134;border-color:#9E7134}
.rjv-catwrap{position:relative}
.rjv-catbtn{display:flex;align-items:center;gap:8px;font-family:var(--font-detail,system-ui,sans-serif);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#F2F0E9;border:1px solid rgba(237,232,223,.32);border-radius:30px;padding:8px 16px;background:none;cursor:pointer;transition:.25s;white-space:nowrap}
.rjv-catbtn:hover{background:#9E7134;border-color:#9E7134}
.rjv-catmenu{position:absolute;top:calc(100% + 12px);right:0;width:240px;background:rgba(16,16,16,.97);border:1px solid rgba(242,240,233,.16);border-radius:14px;padding:8px;box-shadow:0 30px 60px rgba(0,0,0,.55);backdrop-filter:blur(10px);display:flex;flex-direction:column}
.rjv-catmenu button{display:block;width:100%;text-align:left;padding:10px 14px;border-radius:8px;background:transparent;border:none;color:rgba(242,240,233,.75);font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;font-family:var(--font-detail,system-ui,sans-serif);transition:.2s;line-height:1.4}
.rjv-catmenu button:hover{background:rgba(255,255,255,.06);color:#F2F0E9}
@media(max-width:900px){.rjv-vname{font-size:26px;left:28px}}
@media(max-width:640px){.rjv-thumb{width:52px;height:52px}.rjv-stage{height:48vh}.rjv-mark .ln{width:56px}.rjv-vname{font-size:18px;left:20px}}
`;

export default function VaultGallery({ data, onClose }) {
  const rootRef = useRef(null);
  const items = data.items || [];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [catView, setCatView] = useState(null); // an image catalogue being viewed
  const total = items.length;
  const item = items[idx] || items[0];

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (rootRef.current) gsap.fromTo(rootRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") { if (catView) setCatView(null); else if (catOpen) setCatOpen(false); else if (zoom) setZoom(false); return; }
      if (zoom) { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next, zoom, catOpen, catView]);

  return (
    <div ref={rootRef} className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-2 md:pt-2 pb-8">
      <style>{CSS}</style>

      {/* Top bar: visit-website (left) + catalogues dropdown (right) */}
      <div className="rjv-topbar">
        {onClose
          ? <button className="rjv-web" onClick={onClose}>← Visit website</button>
          : <a className="rjv-web" href="/">← Visit website</a>}
        <div className="rjv-catwrap">
          <button className="rjv-catbtn" onClick={() => setCatOpen((o) => !o)}>Catalogues ▾</button>
          {catOpen && (
            <div className="rjv-catmenu">
              {CATALOGUES.map((c) => (
                <button key={c.label} onClick={() => { setCatOpen(false); setCatView(c); }}>
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client name — vertical two-tone label down the left */}
      <div className="rjv-vname" aria-label={data.clientName || "Your Gallery"}>
        {(() => {
          const parts = (data.clientName || "Your Gallery").trim().split(/\s+/);
          return <><span className="w1">{parts[0]}</span>{parts.length > 1 && <span className="w2"> {parts.slice(1).join(" ")}</span>}</>;
        })()}
      </div>

      <div className="rjv">
        {/* Header: RJ mark divider (logo + lines), top centre — level with the pills */}
        <div className="rjv-head">
          <div className="rjv-mark">
            <span className="ln l" />
            <span className="ln r" />
            <img src={previewImg("/images/roj-logo.png", 240)} alt="ROGETjames" />
          </div>
        </div>

        {total === 0 ? (
          <div style={{ padding: "22vh 0", textAlign: "center" }}>
            <p className="font-detail text-sm text-cream/45 uppercase tracking-wider">Your gallery is being prepared</p>
          </div>
        ) : (
          <>
            {/* Big image — no arrows here; browse via thumbnails, arrows appear in expand view */}
            <div className="rjv-stage">
              <img key={idx} src={previewImg(item.src, 1400)} alt={item.title || ""} onClick={() => setZoom(true)} style={NO_SAVE_STYLE} {...NO_SAVE} />
            </div>

            {/* Caption */}
            <div className="rjv-cap">
              <span className="dn">{item.title ? <b>{item.title}</b> : null}{total > 1 ? `${item.title ? "  ·  " : ""}${idx + 1} / ${total}` : ""}</span>
            </div>

            {/* Thumbnail strip */}
            {total > 1 && (
              <div className="rjv-thumbs" data-lenis-prevent>
                {items.map((it, i) => (
                  <button key={i} className={`rjv-thumb${i === idx ? " active" : ""}`} onClick={() => setIdx(i)} onMouseEnter={() => setIdx(i)} title={it.title || ""}>
                    <img src={previewImg(it.src, 200)} alt="" loading="lazy" {...NO_SAVE} />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Greeting + spiel underneath (scrolls) */}
        {data.greeting && <p className="rjv-greet">{data.greeting}</p>}
        <p className="rjv-spiel">{data.spiel || DEFAULT_SPIEL}</p>
        {data.links?.length > 0 && (
          <div className="rjv-links">
            {data.links.map((l, i) => <a key={i} className="rjv-link" href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {zoom && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/95 backdrop-blur-xl" onClick={() => setZoom(false)}>
          <button onClick={() => setZoom(false)} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-cream/15 flex items-center justify-center text-cream hover:bg-cream/30 z-10" aria-label="Close"><X size={18} /></button>
          {total > 1 && <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 z-10" aria-label="Previous"><ChevronLeft size={22} /></button>}
          <img src={previewImg(item.src, 1600)} alt={item.title || ""} className="max-w-[92vw] max-h-[90vh] object-contain" style={NO_SAVE_STYLE} {...NO_SAVE} onClick={(e) => e.stopPropagation()} />
          {total > 1 && <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 z-10" aria-label="Next"><ChevronRight size={22} /></button>}
        </div>
      )}

      {/* Catalogue viewer — the site's shared CatPageViewer, identical to the nav/galleries */}
      {catView && (
        <Suspense fallback={null}>
          <CatPageViewer
            pages={catView.pages}
            label={catView.label}
            onClose={() => setCatView(null)}
            onCloseAll={() => { setCatView(null); if (onClose) onClose(); else window.location.href = "/"; }}
          />
        </Suspense>
      )}
    </div>
  );
}
