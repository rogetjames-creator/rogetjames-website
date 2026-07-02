import { useState, useEffect } from "react";

const API = "/api/media-upload";

// Fixed list of destinations — exact, no text-guessing. Add a new row here
// whenever a new gallery spot needs to receive uploaded photos; the gallery
// code (Gallery.jsx) reads images by this same "key" via item.mediaKeys.
export const DESTINATIONS = [
  { key: "up-close",             label: "Up Close section" },
  { key: "branches-gren",        label: "Branches — GREN Up Close" },
  { key: "creeping-fig-autumn",  label: "Creeping Fig — Autumn" },
  { key: "plumes-deco",          label: "Plumes — Plume Deco" },
  { key: "banksia",              label: "Banksia — Up Close" },
];
const labelForKey = (key) => DESTINATIONS.find(d => d.key === key)?.label || key;

export default function MediaPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

  // Batch composer state
  const [selectedDests, setSelectedDests] = useState([]);
  const [staged, setStaged] = useState([]);          // [{ name, dataUrl }]
  const [phase, setPhase] = useState("compose");     // compose | sending | done
  const [doneInfo, setDoneInfo] = useState(null);    // { count, dests: [] }
  const [note, setNote] = useState("");

  const call = (payload) =>
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

  const login = async (adminSecret) => {
    setLoading(true); setError("");
    try {
      const res = await call({ adminSecret, action: "list" });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Failed."); setAuthed(false);
        try { localStorage.removeItem("stats_key"); } catch { /* ignore */ }
      } else {
        setAuthed(true); setSecret(adminSecret); setImages(json.images || []);
        try { localStorage.setItem("stats_key", adminSecret); } catch { /* ignore */ }
      }
    } catch { setError("Request failed. Check your connection."); }
    finally { setLoading(false); }
  };

  const refresh = async (s = secret) => {
    try {
      const res = await call({ adminSecret: s, action: "list" });
      const json = await res.json();
      if (res.ok && !json.error) setImages(json.images || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    const urlKey = new URLSearchParams(window.location.search).get("key");
    const saved = urlKey || (() => { try { return localStorage.getItem("stats_key"); } catch { return null; } })();
    if (urlKey) window.history.replaceState({}, "", "/media");
    if (saved) login(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDest = (key) => setSelectedDests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const onPick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setNote("");
    const toDataUrl = (file) => new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve({ name: file.name, dataUrl: r.result });
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    const added = await Promise.all(files.map(toDataUrl));
    setStaged(prev => [...prev, ...added]);
  };

  const removeStaged = (i) => setStaged(prev => prev.filter((_, idx) => idx !== i));

  const send = async () => {
    if (!selectedDests.length || !staged.length) return;
    setPhase("sending");
    try {
      const res = await call({ adminSecret: secret, images: staged, destinations: selectedDests });
      const json = await res.json();
      if (!res.ok || json.error) { setNote(json.error || "Upload failed — try again."); setPhase("compose"); return; }
      setDoneInfo({ count: json.saved, dests: [...selectedDests] });
      setPhase("done");
      await refresh();
    } catch {
      setNote("Upload failed — check connection and try again."); setPhase("compose");
    }
  };

  const startNewBatch = () => {
    setStaged([]); setSelectedDests([]); setDoneInfo(null); setNote(""); setPhase("compose");
  };

  const remove = async (id) => {
    try { await call({ adminSecret: secret, action: "delete", id }); await refresh(); } catch { /* ignore */ }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-jet flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white/8 border border-white/18 rounded-[2rem] p-8">
            <div className="text-center mb-8">
              <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight">
                ROGET<span className="font-normal italic font-drama">james</span>
              </a>
              <div className="w-8 h-px bg-clay/60 mx-auto mt-3 mb-4" />
              <p className="font-detail text-[10px] text-cream/85 uppercase tracking-[0.25em]">Media Upload</p>
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

  // Group existing images by destination set.
  const groups = {};
  for (const im of images) {
    const dests = Array.isArray(im.destinations) && im.destinations.length ? im.destinations : [];
    const key = dests.length ? dests.map(labelForKey).join(" + ") : "— no destination —";
    (groups[key] = groups[key] || []).push(im);
  }

  const canSend = selectedDests.length > 0 && staged.length > 0;

  return (
    <div className="min-h-screen bg-jet px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/" className="font-heading font-bold text-cream text-xl tracking-tight">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="w-8 h-px bg-clay/50 mt-3 mb-3" />
          <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.25em]">Media Upload · {images.length} live images</p>
        </div>

        {/* ── DONE STATE ─────────────────────────── */}
        {phase === "done" && doneInfo && (
          <div className="bg-green-600/15 border border-green-500/40 rounded-2xl p-7 mb-8 text-center">
            <p className="font-heading text-cream text-lg mb-1">✓ Done</p>
            <p className="font-detail text-sm text-cream/80 mb-1">
              {doneInfo.count} photo{doneInfo.count === 1 ? "" : "s"} sent and now live in:
            </p>
            <p className="font-detail text-sm text-green-300 mb-5">{doneInfo.dests.map(labelForKey).join(" + ")}</p>
            <button onClick={startNewBatch}
              className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light transition-all">
              + Start a new batch
            </button>
            <p className="font-detail text-[10px] text-cream/40 mt-3">Appears on the site within ~1 minute.</p>
          </div>
        )}

        {/* ── COMPOSER ───────────────────────────── */}
        {phase !== "done" && (
          <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-8">
            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-3">Step 1 — Where do these go?</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {DESTINATIONS.map(d => {
                const on = selectedDests.includes(d.key);
                return (
                  <button key={d.key} type="button" onClick={() => toggleDest(d.key)}
                    className={`px-3 py-2 rounded-xl font-detail text-[11px] border transition-all ${on ? "bg-clay border-clay text-cream" : "bg-transparent border-white/18 text-cream/60 hover:border-white/35"}`}>
                    {on ? "✓ " : ""}{d.label}
                  </button>
                );
              })}
            </div>

            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-3">Step 2 — Choose photos</p>
            <label className={`block w-full text-center py-3 rounded-2xl border border-white/20 text-cream/80 font-detail text-sm cursor-pointer hover:border-clay/60 hover:text-cream transition-all ${phase === "sending" ? "opacity-40 pointer-events-none" : ""}`}>
              + Choose photos from iCloud
              <input type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
            </label>

            {staged.length > 0 && (
              <>
                <p className="font-detail text-[10px] text-cream/50 mt-4 mb-2">{staged.length} photo{staged.length === 1 ? "" : "s"} ready to send:</p>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {staged.map((s, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                      <img src={s.dataUrl} alt={s.name} className="w-full h-full object-cover" />
                      <button onClick={() => removeStaged(i)} aria-label="Remove"
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-cream/80 flex items-center justify-center text-xs hover:bg-red-600 hover:text-white">×</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mt-6 mb-3">Step 3 — Send</p>
            <button onClick={send} disabled={!canSend || phase === "sending"}
              className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              {phase === "sending"
                ? (<><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Sending…</>)
                : canSend
                  ? `Send ${staged.length} photo${staged.length === 1 ? "" : "s"} →`
                  : (!selectedDests.length ? "Pick a destination first" : "Choose photos first")}
            </button>
            {note && <p className="font-detail text-[11px] text-amber-300 text-center mt-3">{note}</p>}
          </div>
        )}

        {/* ── LIVE LIBRARY ───────────────────────── */}
        <p className="font-detail text-[10px] text-cream/45 uppercase tracking-[0.25em] mb-4">Currently on the site</p>
        {Object.keys(groups).length === 0 && (
          <p className="font-detail text-sm text-cream/40 text-center">Nothing uploaded yet.</p>
        )}
        {Object.entries(groups).map(([g, ims]) => (
          <div key={g} className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-6">
            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-1">{g} · {ims.length}</p>
            <p className={`font-detail text-[10px] mb-4 ${g === "— no destination —" ? "text-amber-400" : "text-green-400"}`}>
              {g === "— no destination —" ? "Not placed — remove these or re-upload with a destination." : "✓ Live on site"}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {ims.map((im) => (
                <div key={im.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                  <img src={im.src} alt={im.name} className="w-full h-full object-cover" />
                  <button onClick={() => remove(im.id)} aria-label="Remove"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-cream/80 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">×</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
