import { useState, useEffect } from "react";
import MelbourneCityPage from "./MelbourneCityPage";
import MelbourneWordmark from "./MelbourneWordmark";
import { ownerPreviewUnlocked } from "../utils/ownerPreview";

// ── Melbourne page data ───────────────────────────────────────
// Copy written fresh (Aug 2026) — deliberately shares nothing with the
// earlier Melbourne wording or with the other city pages. It states what
// the practice makes and that Victorian work is cut in Victoria; it never
// places James himself anywhere, and never implies a studio to visit.
const MELBOURNE = {
  name: "Melbourne",
  region: "VIC",
  // Hero wordmark in the supplied Ethnocentric font (SVG), replacing the
  // italic Playfair word. Colour/size are set on the wrapper in CityPage.
  heroMark: <MelbourneWordmark className="w-full h-auto" />,
  // Optional bold line under the wordmark — left empty so the hero reads:
  // the Melbourne mark + the flowing subhead below.
  displayLine: "",
  // Intro-section eyebrow.
  madeLabel: "Cut in Victoria",
  // intro[0] = hero subhead (under the wordmark); intro[1..] = the written
  // piece in the intro section below the eyebrow.
  intro: [
    "Laser-cut wall art, privacy screens and sculpture in Corten steel and powdercoated aluminium — catalogue designs and bespoke commissions, cut in Victoria for Melbourne homes, gardens and commercial projects.",
    "ROGETjames is an Australian design and laser art practice. Every design is drawn in-house by James Roget: a catalogue of signature works in standard or custom sizes, and one-off commissions shaped to the space they are made for.",
    "Eighteen years of laser-cut architectural work — Mirvac Melbourne, Fiona Stanley Hospital, Centennial Park, Cottesloe Hotel with MJA Architects. Victorian work is cut in Victoria.",
    "Corten steel or powdercoated aluminium, any Dulux or Interpon colour. Catalogue designs at standard or custom size, or an original drawn for the project. In-situ renders before fabrication, concept through to install. Three to six weeks.",
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
    "Wall Art", "Sculpture", "Screens", "Public Art", "Art Projects",
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
        try { localStorage.removeItem("stats_key"); } catch { /* ignore */ }
      } else {
        setAuthed(true);
        try { localStorage.setItem("stats_key", adminSecret); } catch { /* ignore */ }
      }
    } catch { setError("Request failed. Check your connection."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    // One-click owner link: ...?preview=roj-open opens the page and remembers
    // it in this browser, so no password is needed here or on the other city
    // pages afterwards. ?preview=off re-locks.
    if (ownerPreviewUnlocked()) { setAuthed(true); return; }
    const urlKey = new URLSearchParams(window.location.search).get("key");
    const saved = urlKey || (() => { try { return localStorage.getItem("stats_key"); } catch { return null; } })();
    if (urlKey) window.history.replaceState({}, "", "/melbourne");
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

  return <MelbourneCityPage city={MELBOURNE} />;
}
