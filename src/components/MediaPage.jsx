import { useState, useEffect } from "react";
import { MEDIA_DESTINATIONS } from "./Gallery";

const API = "/api/media-upload";

// Destinations are generated automatically from the live catalogue categories
// (imported from Gallery). Every category is always selectable; new categories
// appear on their own. Photos tagged to a category show as that category's
// "Up Close" tile. "up-close" is a combined section; "other" flags a spot that
// isn't a category so Claude can place it.
const DESTINATIONS = [
  { key: "up-close", label: "Up Close (all, combined)" },
  ...MEDIA_DESTINATIONS,
];
const labelForKey = (key) => DESTINATIONS.find(d => d.key === key)?.label || (key === "other" ? "Other (see note)" : key);

// Phone photos can be 5-10MB — far too slow/large to send as-is. Downscale to
// a sane display size and re-encode as JPEG before upload, so a batch sends
// in seconds instead of timing out.
const MAX_DIM = 2000;
function compressToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve({ name: file.name, dataUrl: canvas.toDataURL("image/jpeg", 0.82) });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function MediaPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

  // Batch composer state
  const [selectedDests, setSelectedDests] = useState([]);
  const [otherNote, setOtherNote] = useState("");
  const [staged, setStaged] = useState([]);          // [{ name, dataUrl }]
  const [phase, setPhase] = useState("compose");     // compose | sending | done
  const [doneInfo, setDoneInfo] = useState(null);    // { count, dests: [] }
  const [note, setNote] = useState("");

  // Placing an already-uploaded photo into a category (no re-upload)
  const [editing, setEditing] = useState(null);      // the image being placed
  const [editDests, setEditDests] = useState([]);
  const [savingPlace, setSavingPlace] = useState(false);

  // Reels — replace a reel's video file, keeping its sound (no compression).
  const [reelSlot, setReelSlot] = useState("branches");
  const [reelFile, setReelFile] = useState(null);    // { name, dataUrl, mb }
  const [reelPhase, setReelPhase] = useState("idle"); // idle | sending | done
  const [reelNote, setReelNote] = useState("");

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
    setNote("Preparing photos…");
    try {
      const added = await Promise.all(files.map(compressToDataUrl));
      setStaged(prev => [...prev, ...added]);
      setNote("");
    } catch {
      setNote("Couldn't read one of those photos — try again.");
    }
  };

  const removeStaged = (i) => setStaged(prev => prev.filter((_, idx) => idx !== i));

  const send = async () => {
    if (!selectedDests.length || !staged.length) return;
    setPhase("sending");
    try {
      const res = await call({ adminSecret: secret, images: staged, destinations: selectedDests, note: otherNote });
      let json;
      try { json = await res.json(); }
      catch { json = { error: `Server error (status ${res.status}) — the request may have timed out.` }; }
      if (!res.ok || json.error) { setNote(json.error || `Upload failed (status ${res.status}).`); setPhase("compose"); return; }
      setDoneInfo({ count: json.saved, dests: [...selectedDests] });
      setPhase("done");
      await refresh();
    } catch (e) {
      setNote("Upload failed — " + (e?.message || "check connection and try again.")); setPhase("compose");
    }
  };

  const startNewBatch = () => {
    setStaged([]); setSelectedDests([]); setOtherNote(""); setDoneInfo(null); setNote(""); setPhase("compose");
  };

  const remove = async (id) => {
    try { await call({ adminSecret: secret, action: "delete", id }); await refresh(); } catch { /* ignore */ }
  };

  const fileToDataUrl = (blob) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = () => rej(new Error("read"));
    r.onload = () => res(r.result);
    r.readAsDataURL(blob);
  });

  // Upload the video untouched — no re-encoding, so both the picture quality and
  // the audio are exactly as-shot. Oversized clips are compressed by me at full
  // quality rather than degraded in the browser.
  const onPickReel = async (e) => {
    const file = (e.target.files || [])[0];
    e.target.value = "";
    if (!file) return;
    setReelNote(""); setReelFile(null);
    const mb = file.size / 1048576;
    if (mb > 3.9) {
      setReelNote(`That clip is ${mb.toFixed(1)}MB — too big to send at full quality through here. Drop it to me in chat and I'll compress it properly (sound and quality kept).`);
      return;
    }
    try {
      setReelFile({ name: file.name, dataUrl: await fileToDataUrl(file), mb });
    } catch {
      setReelNote("Couldn't read that video — try again.");
    }
  };

  const sendReel = async () => {
    if (!reelFile) return;
    setReelPhase("sending"); setReelNote("");
    try {
      const res = await call({ adminSecret: secret, action: "reel", reel: { slot: reelSlot, dataUrl: reelFile.dataUrl } });
      let json; try { json = await res.json(); } catch { json = { error: `Server error (status ${res.status}).` }; }
      if (!res.ok || json.error) { setReelNote(json.error || "Upload failed."); setReelPhase("idle"); return; }
      setReelPhase("done"); setReelFile(null);
    } catch (e) {
      setReelNote("Upload failed — " + (e?.message || "check connection.")); setReelPhase("idle");
    }
  };

  const REEL_OPTIONS = [
    { key: "branches",   label: "Branches" },
    { key: "rue",        label: "Rue" },
    { key: "banksia",    label: "Banksia" },
    { key: "b-editions", label: "B Editions" },
    { key: "gren-free",  label: "GREN Free" },
  ];

  const openEditor = (im) => { setNote(""); setEditing(im); setEditDests(Array.isArray(im.destinations) ? im.destinations : []); };
  const toggleEditDest = (key) => setEditDests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  const savePlacement = async () => {
    if (!editing) return;
    setSavingPlace(true);
    try {
      const res = await call({ adminSecret: secret, action: "assign", id: editing.id, destinations: editDests });
      const json = await res.json();
      if (res.ok && !json.error) { setEditing(null); await refresh(); }
      else setNote(json.error || "Couldn't place that photo — try again.");
    } catch { setNote("Couldn't place that photo — check connection."); }
    finally { setSavingPlace(false); }
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
            <p className="font-detail text-[10px] text-cream/40 mt-3">Saved permanently — appears on the site within ~2 minutes.</p>
          </div>
        )}

        {/* ── COMPOSER ───────────────────────────── */}
        {phase !== "done" && (
          <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-8">
            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-3">Step 1 — Where do these go?</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {DESTINATIONS.map(d => {
                const on = selectedDests.includes(d.key);
                return (
                  <button key={d.key} type="button" onClick={() => toggleDest(d.key)}
                    className={`px-3 py-2 rounded-xl font-detail text-[11px] border transition-all ${on ? "bg-clay border-clay text-cream" : "bg-transparent border-white/18 text-cream/60 hover:border-white/35"}`}>
                    {on ? "✓ " : ""}{d.label}
                  </button>
                );
              })}
              <button type="button" onClick={() => toggleDest("other")}
                className={`px-3 py-2 rounded-xl font-detail text-[11px] border transition-all ${selectedDests.includes("other") ? "bg-clay border-clay text-cream" : "bg-transparent border-white/18 text-cream/60 hover:border-white/35"}`}>
                {selectedDests.includes("other") ? "✓ " : ""}Other / not listed
              </button>
            </div>
            {selectedDests.includes("other") && (
              <input type="text" value={otherNote} onChange={e => setOtherNote(e.target.value)}
                placeholder="Type where these should go (e.g. Hero slideshow, Screens — Grail)"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-2.5 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none transition-colors mb-6" />
            )}
            {!selectedDests.includes("other") && <div className="mb-6" />}

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

        {/* ── REELS (video with sound) ───────────── */}
        <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-8">
          <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-1">Reels — video with sound</p>
          <p className="font-detail text-[11px] text-cream/50 mb-4">
            Uploaded untouched — full picture quality and the sound both kept. Pick which reel this replaces; it updates the Wall Art and Discover reels together.
          </p>

          {reelPhase === "done" ? (
            <div className="bg-green-600/15 border border-green-500/40 rounded-xl p-5 text-center">
              <p className="font-heading text-cream text-base mb-1">✓ Reel updated</p>
              <p className="font-detail text-[11px] text-cream/70 mb-4">Live on the site within ~2 minutes (hard-refresh to hear it sooner).</p>
              <button onClick={() => { setReelPhase("idle"); setReelNote(""); }}
                className="w-full py-3 rounded-xl bg-clay text-cream font-heading font-semibold text-sm hover:bg-clay-light transition-all">
                Update another reel
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {REEL_OPTIONS.map(o => (
                  <button key={o.key} type="button" onClick={() => setReelSlot(o.key)}
                    className={`px-3 py-2 rounded-xl font-detail text-[11px] border transition-all ${reelSlot === o.key ? "bg-clay border-clay text-cream" : "bg-transparent border-white/18 text-cream/60 hover:border-white/35"}`}>
                    {reelSlot === o.key ? "✓ " : ""}{o.label}
                  </button>
                ))}
              </div>
              <label className={`block w-full text-center py-3 rounded-2xl border border-white/20 text-cream/80 font-detail text-sm cursor-pointer hover:border-clay/60 hover:text-cream transition-all ${reelPhase === "sending" ? "opacity-40 pointer-events-none" : ""}`}>
                {reelFile ? `Chosen: ${reelFile.name} (${reelFile.mb.toFixed(1)}MB)` : "+ Choose a video (full quality, keeps sound)"}
                <input type="file" accept="video/*" onChange={onPickReel} className="hidden" />
              </label>
              <button onClick={sendReel} disabled={!reelFile || reelPhase === "sending"}
                className="w-full mt-3 py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {reelPhase === "sending"
                  ? (<><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Sending…</>)
                  : reelFile ? `Replace “${REEL_OPTIONS.find(o => o.key === reelSlot)?.label}” reel →` : "Choose a video first"}
              </button>
              {reelNote && <p className="font-detail text-[11px] text-amber-300 text-center mt-3">{reelNote}</p>}
            </>
          )}
        </div>

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
                <div key={im.id} className="rounded-lg overflow-hidden border border-white/10">
                  <div className="relative aspect-square">
                    <img src={im.src} alt={im.name} className="w-full h-full object-cover" />
                    <button onClick={() => remove(im.id)} aria-label="Remove"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-cream/80 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">×</button>
                  </div>
                  <button onClick={() => openEditor(im)}
                    className="w-full py-1.5 bg-black/40 text-cream/70 text-[10px] font-detail hover:bg-clay/50 hover:text-cream transition-colors">
                    {im.destinations?.length ? "Placed ✓ · edit" : "+ Place in category"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── PLACE-IN-CATEGORY EDITOR ───────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-6" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md bg-jet border border-white/18 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <img src={editing.src} alt="" className="w-14 h-14 rounded-lg object-cover border border-white/10" />
              <div>
                <p className="font-heading text-cream text-sm">Show this photo in…</p>
                <p className="font-detail text-[11px] text-cream/50">Tick every place it should appear.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5 max-h-[45vh] overflow-y-auto">
              {DESTINATIONS.map(d => {
                const on = editDests.includes(d.key);
                return (
                  <button key={d.key} type="button" onClick={() => toggleEditDest(d.key)}
                    className={`px-3 py-2 rounded-xl font-detail text-[11px] border transition-all ${on ? "bg-clay border-clay text-cream" : "bg-transparent border-white/18 text-cream/60 hover:border-white/35"}`}>
                    {on ? "✓ " : ""}{d.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-2xl border border-white/20 text-cream/70 font-detail text-sm hover:border-white/40 transition-all">Cancel</button>
              <button onClick={savePlacement} disabled={savingPlace}
                className="flex-1 py-3 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm hover:bg-clay-light disabled:opacity-40 transition-all">
                {savingPlace ? "Saving…" : "Save"}
              </button>
            </div>
            {note && <p className="font-detail text-[11px] text-amber-300 text-center mt-3">{note}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
