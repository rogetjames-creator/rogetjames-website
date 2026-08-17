import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import VaultGallery from "./VaultGallery";

// ─────────────────────────────────────────────────────────────
//  CLIENT PREVIEW — the vault door.
//  A client clicks "Client Preview" in the nav, enters their email
//  + password, and their private gallery opens here as a pop-up.
//  Clients + images are managed by James at /media (Client Vault).
//  Access is checked server-side by /api/vault-verify.
// ─────────────────────────────────────────────────────────────

const SESSION_KEY = "roj_vault_session";

// ── Client gallery — logo + name + greeting above, then ONE large image at
//    gallery size with a row of thumbnails below it, spiel underneath.
//    No slideshow, no pills. ─────────────────────────────────────────────
function ClientGallery({ data, onClose }) {
  return <VaultGallery data={data} onClose={onClose} />;
}

// ── Main export ───────────────────────────────────────────────
export default function ClientPreview({ onClose }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // { clientName, greeting, items:[{src,title}] }

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { scale: 0.94, y: 20 }, { scale: 1, y: 0, duration: 0.45, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    // Returning client — reuse the cached vault session so they skip re-entry.
    try {
      const cached = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (cached?.data) setData(toGallery(cached.data));
    } catch { /* ignore */ }
    setTimeout(() => inputRef.current?.focus(), 450);
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const toGallery = (d) => ({
    clientName: d.clientName || "",
    greeting: d.greeting || "",
    spiel: d.projectDescription || "",
    links: d.links || [],
    items: (d.images || []).map((im) => ({ src: im.url || im.src, title: im.name || "" })),
  });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/vault-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const d = await res.json();
      if (!res.ok || d.error) {
        setError(d.error || "Email or password not recognised. Please check and try again.");
        gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.08, repeat: 5, yoyo: true, ease: "none", onComplete: () => gsap.set(cardRef.current, { x: 0 }) });
        return;
      }
      try { localStorage.setItem(SESSION_KEY, JSON.stringify({ data: d, verifiedEmail: email.trim().toLowerCase() })); } catch { /* ignore */ }
      setData(toGallery(d));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-jet/96 backdrop-blur-xl"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(158, 113, 52,0.04) 0%, transparent 70%)" }} />

      {data ? (
        <div ref={cardRef} className="relative w-full overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 2rem)" }}>
          <ClientGallery data={data} onClose={close} />
        </div>
      ) : (
        <div ref={cardRef} className="relative w-full max-w-sm mx-4">
          <button onClick={close} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors" aria-label="Close">
            <X size={18} />
          </button>

          <div className="bg-charcoal/80 border border-cream/10 rounded-[2rem] p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <p className="font-heading font-bold text-cream text-xl tracking-tight">
                ROGET<span className="font-normal italic font-drama">james</span>
              </p>
              <div className="w-8 h-px bg-clay/50 mx-auto mt-3 mb-4" />
              <p className="font-detail text-[10px] text-cream/75 uppercase tracking-[0.25em]">Client Preview Access</p>
            </div>

            <p className="font-detail text-sm text-cream/80 text-center leading-relaxed mb-8">
              Enter your email and password to view your private gallery.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="Your email address"
                autoComplete="email"
                className="w-full bg-cream/5 border border-cream/20 focus:border-clay/70 rounded-2xl px-5 py-3.5 text-center font-detail text-cream placeholder:text-cream/40 outline-none transition-colors duration-200"
                style={{ caretColor: "#9E7134" }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Your password"
                autoComplete="current-password"
                className="w-full bg-cream/5 border border-cream/20 focus:border-clay/70 rounded-2xl px-5 py-3.5 text-center font-detail text-cream placeholder:text-cream/40 outline-none transition-colors duration-200"
                style={{ caretColor: "#9E7134" }}
              />
              {error && <p className="font-detail text-[11px] text-clay text-center leading-relaxed">{error}</p>}
              <button
                type="submit"
                disabled={!email.trim() || !password || loading}
                className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-clay-light disabled:opacity-30 disabled:cursor-default flex items-center justify-center gap-2"
              >
                {loading ? (<><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Checking…</>) : "View My Gallery"}
              </button>
            </form>

            <p className="font-detail text-[10px] text-cream/55 text-center mt-6 leading-relaxed">
              Your email and password are provided directly by ROGETjames.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
