import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

const CSS = `
.rjv{display:flex;flex-direction:column;color:#F2F0E9;width:100%}
.rjv-head{text-align:center;padding:2px 16px 0}
.rjv-name{font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:800;font-size:clamp(24px,4vw,44px);line-height:1.02;letter-spacing:-.01em;text-transform:uppercase;margin:0;color:#F2F0E9}
.rjv-name .w2{color:rgba(237,232,223,.6)}
.rjv-cat{display:inline-block;margin-top:16px;font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#F2F0E9;border:1px solid rgba(237,232,223,.32);border-radius:999px;padding:8px 18px;text-decoration:none;transition:.25s}
.rjv-cat:hover{background:#9E7134;border-color:#9E7134}
.rjv-mark{display:flex;align-items:center;justify-content:center;gap:16px;margin:14px 0 6px}
.rjv-mark .ln{display:block;width:88px;max-width:22vw;height:1px;background:rgba(237,232,223,.30)}
.rjv-mark img{height:44px;width:auto;opacity:.92}
.rjv-greet{font-family:var(--font-detail,system-ui,sans-serif);font-size:13.5px;letter-spacing:.01em;color:rgba(237,232,223,.62);max-width:640px;margin:8px auto 0;line-height:1.65;white-space:pre-line}
.rjv-stage{height:58vh;display:flex;align-items:center;justify-content:center;margin:18px 0 8px}
.rjv-stage img{max-width:100%;max-height:100%;object-fit:contain;border-radius:14px;box-shadow:0 26px 70px rgba(0,0,0,.55);cursor:zoom-in;transition:opacity .18s ease}
.rjv-cap{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:12px}
.rjv-cap .dn{font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(237,232,223,.55)}
.rjv-cap .dn b{color:#F2F0E9;font-weight:600}
.rjv-thumbs{display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;overflow-x:auto;scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none;padding:2px}
.rjv-thumbs::-webkit-scrollbar{display:none}
.rjv-thumb{flex:0 0 auto;width:62px;height:62px;border-radius:9px;overflow:hidden;border:1px solid rgba(237,232,223,.16);cursor:pointer;position:relative;transition:border-color .25s,transform .25s}
.rjv-thumb:hover{transform:translateY(-2px)}
.rjv-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.rjv-thumb.active{border-color:#9E7134;box-shadow:0 0 0 1px #9E7134}
.rjv-spiel{max-width:680px;margin:30px auto 0;text-align:center;font-family:var(--font-detail,system-ui,sans-serif);font-size:14px;line-height:1.85;color:rgba(237,232,223,.7);white-space:pre-line}
.rjv-links{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:18px auto 0}
.rjv-link{font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.02em;color:#c79a5b;border:1px solid rgba(158,113,52,.45);border-radius:999px;padding:6px 14px;transition:.2s;text-decoration:none}
.rjv-link:hover{color:#e6c489;border-color:#9E7134}
@media(max-width:640px){.rjv-thumb{width:52px;height:52px}.rjv-stage{height:48vh}.rjv-mark .ln{width:56px}}
`;

export default function VaultGallery({ data, onClose }) {
  const rootRef = useRef(null);
  const items = data.items || [];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const total = items.length;
  const item = items[idx] || items[0];

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (rootRef.current) gsap.fromTo(rootRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && zoom) setZoom(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next, zoom]);

  return (
    <div ref={rootRef} className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-9">
      <style>{CSS}</style>
      {onClose && (
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors z-20" aria-label="Close">
          <X size={18} />
        </button>
      )}

      <div className="rjv">
        {/* Header: RJ mark divider (logo + lines) above the client name, then greeting */}
        <div className="rjv-head">
          <div className="rjv-mark">
            <span className="ln" />
            <img src="/images/roj-logo.png" alt="ROGETjames" />
            <span className="ln" />
          </div>
          <h2 className="rjv-name">
            {(() => {
              const parts = (data.clientName || "Your Gallery").trim().split(/\s+/);
              return <>{parts[0]}{parts.length > 1 && <span className="w2"> {parts.slice(1).join(" ")}</span>}</>;
            })()}
          </h2>
          {data.greeting && <p className="rjv-greet">{data.greeting}</p>}
          <a className="rjv-cat" href="/wall-art">Wall Art Catalogue ↗</a>
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

        {/* Spiel + links underneath */}
        {data.spiel && <p className="rjv-spiel">{data.spiel}</p>}
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
    </div>
  );
}
