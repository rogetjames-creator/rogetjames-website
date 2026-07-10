import { useState, useEffect, useRef, useCallback } from "react";
import { Maximize2, X } from "lucide-react";
import { WALL_ART_COVERS } from "./Gallery";

// Private, password-gated "Feature Wall" preview of the wall-art gallery in the
// Globe Express style: a full-bleed featured piece with a rail of category
// cards that expand into the hero, and a smaller rail underneath of that
// category's own pieces. Reachable only at /feature-wall behind the same
// admin password as /stats and /media. NOT linked anywhere public.

const CATS = WALL_ART_COVERS;

const CSS = `
.fw-wrap{position:fixed;inset:0;overflow:hidden;background:#1A1A1A;color:#F2F0E9;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.fw-bg{position:absolute;inset:0;background-size:contain;background-repeat:no-repeat;background-position:center;opacity:0;transform:scale(1.06);transition:opacity 1.1s cubic-bezier(.7,0,.2,1);will-change:opacity,transform}
.fw-bg.on{opacity:1;transform:scale(1);animation:fwDrift 9s linear forwards}
@keyframes fwDrift{from{transform:scale(1.03)}to{transform:scale(1.07)}}
.fw-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,12,12,.82),rgba(12,12,12,.45) 34%,rgba(12,12,12,.05) 60%,rgba(12,12,12,.25) 100%),linear-gradient(0deg,rgba(12,12,12,.55),rgba(12,12,12,0) 45%)}
.fw-top{position:absolute;top:0;left:0;right:0;z-index:6;display:flex;align-items:flex-start;justify-content:space-between;padding:28px 46px}
.fw-logo{font-weight:800;letter-spacing:.02em;font-size:19px}
.fw-logo i{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500}
.fw-top-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.fw-tag{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(242,240,233,.45)}
.fw-count{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,240,233,.4);font-variant-numeric:tabular-nums}
.fw-expand{display:flex;align-items:center;gap:7px;padding:8px 15px;border-radius:20px;background:rgba(20,20,20,.4);border:1px solid rgba(242,240,233,.22);color:rgba(242,240,233,.75);font-size:10px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(4px);transition:.25s;font-family:inherit}
.fw-expand:hover{background:rgba(158,113,52,.25);border-color:#c08c46;color:#F2F0E9}
.fw-expand-overlay{position:fixed;inset:0;z-index:10000;background:#000;display:flex;align-items:center;justify-content:center;cursor:zoom-out}
.fw-expand-img{max-width:95vw;max-height:95vh;object-fit:contain}
.fw-expand-close{position:absolute;top:16px;right:16px;padding:10px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;border:none;cursor:pointer;transition:.2s}
.fw-expand-close:hover{background:rgba(255,255,255,.2)}
.fw-lead{position:absolute;left:52px;bottom:340px;z-index:5;max-width:46vw}
.fw-kick{display:flex;align-items:center;gap:14px;font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#c08c46;margin-bottom:18px}
.fw-kick .bar{width:34px;height:1px;background:#c08c46}
.fw-title{font-weight:800;line-height:.94;letter-spacing:-.01em;font-size:clamp(32px,4.6vw,68px);text-transform:uppercase;text-shadow:0 8px 40px rgba(0,0,0,.35)}
.fw-piece{margin-top:14px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(242,240,233,.55)}
.fw-piece b{color:#F2F0E9;font-weight:600;letter-spacing:.1em}
.fw-cta{margin-top:32px;display:flex;align-items:center;gap:18px}
.fw-dot{width:46px;height:46px;border-radius:50%;background:#9E7134;display:grid;place-items:center;color:#F2F0E9;box-shadow:0 6px 24px rgba(158,113,52,.4)}
.fw-pill{border:1px solid rgba(242,240,233,.3);border-radius:40px;padding:13px 26px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;transition:.35s}
.fw-pill:hover{background:#F2F0E9;color:#1A1A1A;border-color:#F2F0E9}
.fw-anim{opacity:0;transform:translateY(22px);animation:fwUp .9s cubic-bezier(.7,0,.2,1) forwards}
.fw-anim.d2{animation-delay:.12s}.fw-anim.d3{animation-delay:.24s}
@keyframes fwUp{to{opacity:1;transform:none}}
.fw-rail{position:absolute;right:44px;bottom:160px;z-index:5;display:flex;gap:16px;align-items:flex-end;max-width:60vw;overflow-x:auto;scrollbar-width:none;padding:30px 4px 4px}
.fw-rail::-webkit-scrollbar{display:none}
.fw-card{position:relative;width:176px;height:238px;border-radius:20px;overflow:hidden;cursor:pointer;flex:0 0 auto;box-shadow:0 24px 50px rgba(0,0,0,.5);transform:translateY(0) scale(.9);opacity:.82;transition:transform .7s cubic-bezier(.7,0,.2,1),opacity .5s,box-shadow .5s}
.fw-card img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.7,0,.2,1)}
.fw-cap{position:absolute;left:0;right:0;bottom:0;padding:14px 14px 16px;background:linear-gradient(0deg,rgba(0,0,0,.8),rgba(0,0,0,0))}
.fw-cap b{font-weight:700;font-size:12px;letter-spacing:.05em;text-transform:uppercase;line-height:1.15}
.fw-card.on{transform:translateY(-22px) scale(1.04);opacity:1;box-shadow:0 34px 70px rgba(0,0,0,.6);outline:1px solid rgba(242,240,233,.25);outline-offset:-1px}
.fw-card:hover img{transform:scale(1.08)}
.fw-card.flash img{animation:fwFlash 1.1s cubic-bezier(.7,0,.2,1)}
@keyframes fwFlash{0%{transform:scale(1)}45%{transform:scale(1.5)}100%{transform:scale(1.08)}}
.fw-subrail{position:absolute;right:44px;bottom:36px;z-index:5;display:flex;gap:8px;align-items:flex-end;max-width:60vw;overflow-x:auto;scrollbar-width:none;padding:8px 4px 4px}
.fw-subrail::-webkit-scrollbar{display:none}
.fw-subcard{position:relative;width:70px;height:90px;border-radius:9px;overflow:hidden;cursor:pointer;flex:0 0 auto;box-shadow:0 10px 22px rgba(0,0,0,.45);opacity:.6;transform:scale(.94);transition:transform .5s cubic-bezier(.7,0,.2,1),opacity .4s,box-shadow .4s;outline:1px solid rgba(242,240,233,.14);outline-offset:-1px}
.fw-subcard img{width:100%;height:100%;object-fit:cover}
.fw-subcard.on{opacity:1;transform:scale(1.06);box-shadow:0 16px 32px rgba(0,0,0,.55);outline-color:#c08c46}
.fw-subcard:hover{opacity:.9}
.fw-subcard.flash img{animation:fwFlash .8s cubic-bezier(.7,0,.2,1)}
.fw-ctrls{position:absolute;left:52px;bottom:44px;z-index:6;display:flex;align-items:center;gap:14px}
.fw-nav{width:50px;height:50px;border-radius:50%;border:1px solid rgba(242,240,233,.28);background:rgba(20,20,20,.35);backdrop-filter:blur(6px);color:#F2F0E9;display:grid;place-items:center;cursor:pointer;transition:.3s;font-size:16px}
.fw-nav:hover{border-color:#9E7134;color:#c08c46;background:rgba(20,20,20,.6)}
.fw-prog{margin-left:8px;width:130px;height:2px;background:rgba(242,240,233,.18);position:relative;border-radius:2px}
.fw-prog i{position:absolute;left:0;top:0;height:100%;background:#c08c46;border-radius:2px;transition:width .7s cubic-bezier(.7,0,.2,1)}
@media(max-width:900px){.fw-lead{max-width:84vw;left:26px}.fw-rail{display:none}.fw-subrail{display:none}.fw-ctrls{left:26px}}
`;

function Gallery() {
  const [cur, setCur] = useState(0);
  const [pieceIdx, setPieceIdx] = useState(0);
  const busy = useRef(false);
  const [flash, setFlash] = useState(-1);
  const [pieceFlash, setPieceFlash] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  // Persisted rail order — whichever category is opened moves to the back
  // of this list and STAYS there (rather than the row resetting to catalogue
  // order every time), so a second click doesn't undo the first.
  const [railOrder, setRailOrder] = useState(() => CATS.map((_, i) => i));

  const go = useCallback((i) => {
    if (busy.current) return;
    const n = (i + CATS.length) % CATS.length;
    if (n === cur) return;
    busy.current = true;
    setCur(n);
    setPieceIdx(0);
    setExpanded(false);
    setRailOrder((prev) => [...prev.filter((x) => x !== n), n]);
    setTimeout(() => { busy.current = false; setFlash(-1); }, 1100);
  }, [cur]);

  const goPiece = useCallback((i) => {
    setPieceIdx(i);
    setPieceFlash(i);
    setTimeout(() => setPieceFlash(-1), 1100);
  }, []);

  useEffect(() => {
    CATS.forEach((cat) => cat.pieces.forEach((p) => { const im = new Image(); im.src = p.img; }));
    const onKey = (e) => { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur, go]);

  const c = CATS[cur];
  const pieces = c.pieces;
  const activePiece = pieces[pieceIdx] || pieces[0];

  return (
    <div className="fw-wrap">
      <style>{CSS}</style>
      {pieces.map((p, i) => (
        <div key={`${c.id}-${p.name}`} className={`fw-bg ${i === pieceIdx ? "on" : ""}`} style={{ backgroundImage: `url("${p.img}")` }} />
      ))}
      <div className="fw-scrim" />

      <header className="fw-top">
        <div className="fw-logo">ROGET<i>james</i></div>
        <div className="fw-top-right">
          <div className="fw-tag">Feature Wall · private preview</div>
          <div className="fw-count">{String(cur + 1).padStart(2, "0")} / {String(CATS.length).padStart(2, "0")}</div>
          <button className="fw-expand" onClick={() => setExpanded(true)} aria-label="Expand image">
            <Maximize2 size={12} /> Expand
          </button>
        </div>
      </header>

      <div className="fw-lead" key={cur}>
        <div className="fw-kick fw-anim"><span className="bar" />Wall Art</div>
        <h1 className="fw-title fw-anim d2">{c.label}</h1>
        <div className="fw-piece fw-anim d2">On display — <b>{activePiece.name}</b></div>
        <div className="fw-cta fw-anim d3">
          <div className="fw-dot">&#8599;</div>
          <div className="fw-pill">View the {c.label.toLowerCase()} collection</div>
        </div>
      </div>

      <div className="fw-rail">
        {railOrder.map((i) => {
          const cat = CATS[i];
          return (
            <div key={cat.id} className={`fw-card ${i === cur ? "on" : ""} ${i === flash ? "flash" : ""}`}
              onClick={() => { if (i !== cur) { setFlash(i); go(i); } }}>
              <img src={cat.img} alt={cat.label} />
              <div className="fw-cap"><b>{cat.label}</b></div>
            </div>
          );
        })}
      </div>

      {pieces.length > 1 && (
        <div className="fw-subrail" key={c.id}>
          {pieces.map((p, i) => (
            <div key={p.name} className={`fw-subcard ${i === pieceIdx ? "on" : ""} ${i === pieceFlash ? "flash" : ""}`}
              onClick={() => { if (i !== pieceIdx) goPiece(i); }}>
              <img src={p.img} alt={p.name} />
            </div>
          ))}
        </div>
      )}

      <div className="fw-ctrls">
        <button className="fw-nav" aria-label="Previous" onClick={() => go(cur - 1)}>&#8592;</button>
        <button className="fw-nav" aria-label="Next" onClick={() => go(cur + 1)}>&#8594;</button>
        <div className="fw-prog"><i style={{ width: `${((cur + 1) / CATS.length) * 100}%` }} /></div>
      </div>

      {expanded && (
        <div className="fw-expand-overlay" onClick={() => setExpanded(false)}>
          <img src={activePiece.img} alt={activePiece.name} className="fw-expand-img" />
          <button
            className="fw-expand-close"
            onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
            aria-label="Close expanded view"
          >
            <X size={20} />
          </button>
        </div>
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
