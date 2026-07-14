import { useState, useEffect } from "react";
import CityPage from "./CityPage";

// ── Melbourne page data ───────────────────────────────────────
// PLACEHOLDER content + images — a working template. James replaces
// the copy, project titles/suburbs and images with real Melbourne
// detail. Keep the wording genuinely distinct from other city pages.
const MELBOURNE = {
  name: "Melbourne",
  region: "VIC",
  // Optional bold line under the big italic "Melbourne." — left empty so the
  // hero reads: "Melbourne." + the flowing subhead below.
  displayLine: "",
  intro: [
    "Original laser-cut wall art, sculpture & architectural features — curated catalogues and bespoke works, crafted in Melbourne for Architects, Designers and discerning clients.",
    "Over years of commissions across Victoria, our Corten steel and powdercoated aluminium pieces have been made to suit Melbourne's mix of heritage terraces, contemporary builds and landmark public spaces — each cut to order for its exact wall, courtyard or facade.",
    "Every piece is drawn, cut and finished to the site. We work directly with Melbourne designers and homeowners from concept through to installation, and deliver Australia-wide from the studio.",
  ],
  hero: "/images/hero/hero-marakesh-wide.jpg",
  projects: [
    { src: "/images/hero/hero-gren-edge-1.jpg",        title: "GREN Edge — Wall Feature", detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/hero/hero-creeping-fig-grande.jpg", title: "Creeping Fig — Screen",    detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/screens/elle-corten.jpg",           title: "ELLE — Corten Screen",     detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/screens/eros-pergola-williamstown.jpg", title: "EROS — Pergola",       detail: "Williamstown" },
    { src: "/images/custom/custom-hollingworth-1.jpg",  title: "Custom Gate & Infill",     detail: "Placeholder — replace with real Melbourne project" },
    { src: "/images/hero/hero-vasuki.jpg",              title: "VASUKI — Sculpture",       detail: "Placeholder — replace with real Melbourne project" },
  ],
  services: [
    "Wall Art", "Sculpture", "Screens", "Gates & Fencing", "Privacy Panels", "Public Art",
  ],
  // Real Melbourne suburbs help local relevance — edit to the ones you actually serve.
  suburbs: [
    "South Yarra", "Toorak", "Brighton", "Malvern", "Kew", "Hawthorn",
    "Fitzroy", "Carlton", "Richmond", "St Kilda", "Williamstown", "Mornington Peninsula",
  ],
};

// Private preview — content is still placeholder (see notes above), so this
// page is gated behind the same admin password as Stats, Media and Feature
// Wall, rather than being reachable by anyone with the URL. NOT public.
export default function MelbournePreview() {
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
        try { localStorage.removeItem("stats_key"); localStorage.removeItem("stats_key_t"); } catch { /* ignore */ }
      } else {
        setAuthed(true);
        try { localStorage.setItem("stats_key", adminSecret); localStorage.setItem("stats_key_t", String(Date.now())); } catch { /* ignore */ }
      }
    } catch { setError("Request failed. Check your connection."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    // Cached admin password expires after 30 days — before trusting it, check
    // the timestamp written alongside it; if it's missing or stale, clear both
    // and fall back to the password form. A ?key= in the URL still works as
    // before and refreshes the timestamp on a successful login.
    const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
    const urlKey = new URLSearchParams(window.location.search).get("key");
    if (urlKey) window.history.replaceState({}, "", "/melbourne");
    let saved = urlKey || null;
    if (!saved) {
      try {
        const cached = localStorage.getItem("stats_key");
        const t = Number(localStorage.getItem("stats_key_t") || 0);
        if (cached && t && Date.now() - t < MAX_AGE) saved = cached;
        else { localStorage.removeItem("stats_key"); localStorage.removeItem("stats_key_t"); }
      } catch { /* ignore */ }
    }
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
              <p className="font-detail text-[10px] text-cream/85 uppercase tracking-[0.25em]">Melbourne Page — Private Preview</p>
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

  return <CityPage city={MELBOURNE} />;
}
