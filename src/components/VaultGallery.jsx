import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATALOGUES } from "../catalogues";
// Bundled directly (not lazy-loaded) so the catalogue always opens reliably inside
// the gallery — no separately-loaded piece that could fail after a deploy.
import CatPageViewer from "./CatPageViewer";

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
/* Client name — vertical label down the left, aligned to the image's height and
   level (so the thumbnail row below never reaches it). Two-tone, muted. */
.rjv-stagewrap{position:relative}
.rjv-vname{position:absolute;left:8px;top:0;height:100%;display:flex;align-items:center;z-index:15;pointer-events:none;user-select:none}
.rjv-vtxt{transform:rotate(-90deg);white-space:nowrap;font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:800;font-size:clamp(20px,3vw,46px);line-height:1;letter-spacing:.04em;text-transform:uppercase}
.rjv-vtxt .w1{color:rgba(237,232,223,.42)}
.rjv-vtxt .w2{color:rgba(237,232,223,.2)}
.rjv-cat{display:inline-block;margin-top:16px;font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#F2F0E9;border:1px solid rgba(237,232,223,.32);border-radius:999px;padding:8px 18px;text-decoration:none;transition:.25s}
.rjv-cat:hover{background:#9E7134;border-color:#9E7134}
.rjv-mark{position:relative;width:78px;height:78px;margin:0 auto 6px;display:flex;align-items:center;justify-content:center}
.rjv-mark img{width:100%;height:auto;opacity:.5;filter:drop-shadow(0 5px 0 rgba(0,0,0,.55))}
.rjv-mark .ln{position:absolute;top:50%;height:1.5px;width:90px;background:rgba(242,240,233,.35);margin-top:-.75px}
.rjv-mark .ln.l{right:calc(100% + 10px)}
.rjv-mark .ln.r{left:calc(100% + 10px)}
.rjv-greet{font-family:var(--font-detail,system-ui,sans-serif);font-size:13.5px;letter-spacing:.01em;color:rgba(237,232,223,.62);max-width:640px;margin:8px auto 0;line-height:1.65;white-space:pre-line}
.rjv-stage{height:58vh;display:flex;align-items:center;justify-content:center;margin:18px 0 8px}
.rjv-stage img{max-width:min(100%,720px);max-height:100%;object-fit:contain;border-radius:14px;box-shadow:0 26px 70px rgba(0,0,0,.55);cursor:zoom-in;transition:opacity .18s ease}
.rjv-cap{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:12px}
.rjv-cap .dn{font-family:var(--font-detail,system-ui,sans-serif);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(237,232,223,.34)}
.rjv-cap .dn b{color:rgba(237,232,223,.56);font-weight:600}
.rjv-thumbs{display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;overflow-x:auto;scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none;padding:2px}
.rjv-thumbs::-webkit-scrollbar{display:none}
.rjv-thumb{flex:0 0 auto;width:62px;height:62px;border-radius:9px;overflow:hidden;border:1px solid rgba(237,232,223,.16);cursor:pointer;position:relative;transition:border-color .25s,transform .25s}
.rjv-thumb:hover{transform:translateY(-2px)}
.rjv-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.rjv-thumb.active{border-color:#9E7134;box-shadow:0 0 0 1px #9E7134}
.rjv-spielbox{max-width:720px;margin:34px auto 0;padding:26px 28px;border:1px solid rgba(237,232,223,.14);border-radius:16px;background:rgba(255,255,255,.03)}
.rjv-spiel{margin:0;text-align:center;font-family:var(--font-detail,system-ui,sans-serif);font-size:15.5px;line-height:1.85;color:rgba(237,232,223,.72);white-space:pre-line}
.rjv-reply{max-width:720px;margin:16px auto 0;padding:22px 28px;border:1px solid rgba(158,113,52,.28);border-radius:16px;background:rgba(158,113,52,.05);text-align:center}
.rjv-reply h4{margin:0 0 4px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:700;font-size:14px;letter-spacing:.02em;color:#ECE7DE}
.rjv-reply p.hint{margin:0 0 12px;font-family:var(--font-detail,system-ui,sans-serif);font-size:12px;color:rgba(237,232,223,.5)}
.rjv-reply textarea{width:100%;min-height:96px;resize:vertical;background:rgba(0,0,0,.25);border:1px solid rgba(237,232,223,.16);border-radius:12px;padding:12px 14px;font-family:var(--font-detail,system-ui,sans-serif);font-size:14px;color:#ECE7DE;outline:none}
.rjv-reply textarea:focus{border-color:rgba(158,113,52,.7)}
.rjv-reply button{margin-top:12px;padding:10px 26px;border-radius:999px;border:1px solid #9E7134;background:#9E7134;color:#F2F0E9;font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:600;font-size:13px;letter-spacing:.04em;cursor:pointer;transition:.2s}
.rjv-reply button:hover{background:#b5854a;border-color:#b5854a}
.rjv-reply button:disabled{opacity:.4;cursor:default}
.rjv-reply .sent{font-family:var(--font-detail,system-ui,sans-serif);font-size:13px;color:#8fce9b}
.rjv-reply .err{font-family:var(--font-detail,system-ui,sans-serif);font-size:12px;color:#e0a35a;margin-top:8px}
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
@media(max-width:900px){.rjv-vtxt{font-size:26px}.rjv-vname{left:2px}}
@media(max-width:640px){.rjv-thumb{width:52px;height:52px}.rjv-stage{height:48vh}.rjv-mark .ln{width:56px}.rjv-vtxt{font-size:16px}.rjv-vname{left:0}}
`;

export default function VaultGallery({ data, onClose }) {
  const rootRef = useRef(null);
  const items = data.items || [];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [catView, setCatView] = useState(null); // an image catalogue being viewed
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [replyErr, setReplyErr] = useState("");
  const total = items.length;

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true); setReplyErr("");
    try {
      const r = await fetch("/api/vault-reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.clientName, email: data.email, message: reply.trim() }) });
      const d = await r.json();
      if (!r.ok || d.error) { setReplyErr(d.error || "Could not send. Please try again."); setSending(false); return; }
      setSent(true);
    } catch { setReplyErr("Could not send. Please try again."); }
    setSending(false);
  };
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
            {/* Big image, with the vertical client name aligned to its height/level */}
            <div className="rjv-stagewrap">
              <div className="rjv-vname" aria-label={data.clientName || "Your Gallery"}>
                <span className="rjv-vtxt">
                  {(() => {
                    const parts = (data.clientName || "Your Gallery").trim().split(/\s+/);
                    return <><span className="w1">{parts[0]}</span>{parts.length > 1 && <span className="w2"> {parts.slice(1).join(" ")}</span>}</>;
                  })()}
                </span>
              </div>
              <div className="rjv-stage">
                <img key={idx} src={previewImg(item.src, 1400)} alt={item.title || ""} onClick={() => setZoom(true)} style={NO_SAVE_STYLE} {...NO_SAVE} />
              </div>
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

        {/* Greeting + spiel (contained) underneath (scrolls) */}
        {data.greeting && <p className="rjv-greet">{data.greeting}</p>}
        <div className="rjv-spielbox">
          <p className="rjv-spiel">{data.spiel || DEFAULT_SPIEL}</p>
        </div>
        {data.links?.length > 0 && (
          <div className="rjv-links">
            {data.links.map((l, i) => <a key={i} className="rjv-link" href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
          </div>
        )}

        {/* Client reply — emails James on send */}
        <div className="rjv-reply">
          <h4>Send a message to ROGETjames</h4>
          <p className="hint">Questions, thoughts or which pieces you like — write here and it comes straight to James.</p>
          {sent ? (
            <p className="sent">Sent ✓ — thank you, James will be in touch.</p>
          ) : (
            <>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Your message…" />
              <div><button onClick={sendReply} disabled={!reply.trim() || sending}>{sending ? "Sending…" : "Send"}</button></div>
              {replyErr && <p className="err">{replyErr}</p>}
            </>
          )}
        </div>
      </div>

      {/* Fullscreen — portalled to body so the close button is always screen-fixed (no scroll to exit) */}
      {zoom && createPortal(
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/95 backdrop-blur-xl" onClick={() => setZoom(false)}>
          <button onClick={() => setZoom(false)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-cream/15 flex items-center justify-center text-cream hover:bg-cream/30 z-10" aria-label="Close"><X size={20} /></button>
          {total > 1 && <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 z-10" aria-label="Previous"><ChevronLeft size={22} /></button>}
          <img src={previewImg(item.src, 1600)} alt={item.title || ""} className="max-w-[92vw] max-h-[90vh] object-contain" style={NO_SAVE_STYLE} {...NO_SAVE} onClick={(e) => e.stopPropagation()} />
          {total > 1 && <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 z-10" aria-label="Next"><ChevronRight size={22} /></button>}
        </div>, document.body)}

      {/* Catalogue viewer — the site's shared CatPageViewer, identical to the nav/galleries.
          Both close controls return to the client's gallery (never eject to the site). */}
      {catView && createPortal(
        <CatPageViewer
          pages={catView.pages}
          label={catView.label}
          onClose={() => setCatView(null)}
        />, document.body)}
    </div>
  );
}
