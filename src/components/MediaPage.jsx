import { useState, useEffect } from "react";

const API = "/api/media-upload";

// Mirrors the gallery's label routing so the admin can see where a batch lands.
// A label can hit several destinations (e.g. "up close and branches").
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const ROUTES = [
  { kw: "upclose", to: "Up Close section" },
  { kw: "branches", to: "Branches — GREN Up Close" },
  { kw: "gren", to: "Branches — GREN Up Close" },
  { kw: "autumn", to: "Creeping Fig — Autumn" },
  { kw: "plume", to: "Plumes — Plume Deco" },
];
function routesFor(label) {
  const l = norm(label);
  if (!l) return [];
  const hits = [];
  for (const r of ROUTES) if (l.includes(r.kw) && !hits.includes(r.to)) hits.push(r.to);
  return hits;
}

export default function MediaPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const call = (payload) =>
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  const login = async (adminSecret) => {
    setLoading(true);
    setError("");
    try {
      const res = await call({ adminSecret, action: "list" });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Failed.");
        setAuthed(false);
        try { localStorage.removeItem("stats_key"); } catch { /* ignore */ }
      } else {
        setAuthed(true);
        setSecret(adminSecret);
        setImages(json.images || []);
        try { localStorage.setItem("stats_key", adminSecret); } catch { /* ignore */ }
      }
    } catch {
      setError("Request failed. Check your connection.");
    } finally {
      setLoading(false);
    }
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

  const onPick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setMsg("Uploading…");
    try {
      const toDataUrl = (file) => new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve({ name: file.name, dataUrl: r.result });
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const payload = await Promise.all(files.map(toDataUrl));
      const res = await call({ adminSecret: secret, images: payload, label });
      const json = await res.json();
      if (!res.ok || json.error) setMsg(json.error || "Upload failed.");
      else {
        const dests = routesFor(label);
        const where = dests.length ? ` → ${dests.join(" + ")}` : " — label not recognised, tell Claude where it goes";
        setMsg(`Added ${json.saved} image${json.saved === 1 ? "" : "s"}${where}.`);
        await refresh();
      }
    } catch {
      setMsg("Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const remove = async (id) => {
    setBusy(true);
    try { await call({ adminSecret: secret, action: "delete", id }); await refresh(); }
    catch { /* ignore */ } finally { setBusy(false); }
  };

  const copyLink = (src) => {
    const url = window.location.origin + src;
    try { navigator.clipboard.writeText(url); setMsg("Link copied."); } catch { setMsg(url); }
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
              <input
                type="password"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Admin password"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-2xl px-5 py-3.5 text-center font-heading text-cream tracking-[0.15em] placeholder:text-cream/30 placeholder:font-detail placeholder:text-sm outline-none transition-colors"
                style={{ caretColor: "#9E7134" }}
              />
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

  // Group images by label for display.
  const groups = {};
  for (const im of images) {
    const key = im.label || "— no location —";
    (groups[key] = groups[key] || []).push(im);
  }

  return (
    <div className="min-h-screen bg-jet px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/" className="font-heading font-bold text-cream text-xl tracking-tight">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="w-8 h-px bg-clay/50 mt-3 mb-3" />
          <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.25em]">Media Upload · {images.length} images</p>
        </div>

        <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-8">
          <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.2em] mb-3">Add images</p>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Where do these go? e.g. Banksia Round, Plumes, Hero"
            className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-2xl px-4 py-3 font-detail text-sm text-cream placeholder:text-cream/30 outline-none transition-colors mb-3"
          />
          <label className={`block w-full text-center py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide cursor-pointer hover:bg-clay-light transition-all ${busy ? "opacity-40 pointer-events-none" : ""}`}>
            {busy ? "Uploading…" : "+ Choose photos from iCloud"}
            <input type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
          </label>
          <p className="font-detail text-[10px] text-cream/40 text-center mt-3 leading-relaxed">
            Type where they belong first, then choose the photos. Tell Claude the location name and they’ll be placed on the site.
          </p>
          {busy && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-4 h-4 border-2 border-cream/30 border-t-clay rounded-full animate-spin" />
              <span className="font-detail text-[12px] text-cream/70">Uploading — please wait…</span>
            </div>
          )}
          {!busy && msg && (
            <p className="font-detail text-[12px] text-center mt-4 py-2 px-3 rounded-xl bg-clay/15 border border-clay/30 text-cream/90">
              ✓ {msg}
            </p>
          )}
        </div>

        {Object.keys(groups).length === 0 && (
          <p className="font-detail text-sm text-cream/40 text-center">No images uploaded yet.</p>
        )}

        {Object.entries(groups).map(([g, ims]) => (
          <div key={g} className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-6">
            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-1">{g} · {ims.length}</p>
            {(() => {
              const dests = routesFor(g);
              return (
                <p className={`font-detail text-[10px] mb-4 ${dests.length ? "text-green-400" : "text-amber-400"}`}>
                  {dests.length ? `✓ Live on site → ${dests.join(" + ")}` : "Not placed — label not recognised. Tell Claude where this goes."}
                </p>
              );
            })()}
            <div className="grid grid-cols-3 gap-3">
              {ims.map((im) => (
                <div key={im.id}>
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                    <img src={im.src} alt={im.name} className="w-full h-full object-cover" />
                    {/* Uploaded badge */}
                    <span className="absolute top-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-600/90 text-white text-[8px] font-detail uppercase tracking-wider">
                      ✓ Uploaded
                    </span>
                    <button onClick={() => remove(im.id)} aria-label="Remove"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-cream/80 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">×</button>
                    <button onClick={() => copyLink(im.src)}
                      className="absolute bottom-1 left-1 right-1 py-1 rounded bg-black/70 text-cream/80 text-[9px] font-detail uppercase tracking-wider opacity-0 group-hover:opacity-100 hover:bg-clay hover:text-cream transition-all">
                      Copy link
                    </button>
                  </div>
                  {im.name && <p className="font-detail text-[9px] text-cream/45 mt-1 truncate" title={im.name}>{im.name}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
