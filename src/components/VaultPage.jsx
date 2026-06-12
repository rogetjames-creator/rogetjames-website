import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X, Download, ExternalLink, Lock, ArrowRight } from "lucide-react";

const STATUS_CONFIG = {
  "Design":      { label: "In Design",    dot: "#60a5fa" },
  "In Progress": { label: "In Progress",  dot: "#f59e0b" },
  "Review":      { label: "Under Review", dot: "#a78bfa" },
  "Complete":    { label: "Complete",     dot: "#34d399" },
  "Delivered":   { label: "Delivered",    dot: "#c45018" },
};

function Lightbox({ items, startIndex, onClose }) {
  const overlayRef = useRef(null);
  const [idx, setIdx] = useState(startIndex);
  const total = items.length;
  const item = items[idx];

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  }, [onClose]);

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [close, prev, next]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={e => e.target === e.currentTarget && close()}
    >
      <button onClick={close} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors z-10" aria-label="Close">
        <X size={18} />
      </button>
      {total > 1 && (
        <button onClick={prev} className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors" aria-label="Previous">
          <ChevronLeft size={22} />
        </button>
      )}
      <div className="relative max-w-4xl w-full mx-20 md:mx-28 flex flex-col items-center">
        <img
          key={idx}
          src={item.url}
          alt={item.name || `Image ${idx + 1}`}
          className="w-full max-h-[78vh] object-contain rounded-2xl"
        />
        {item.name && (
          <p className="mt-5 font-detail text-xs text-cream/55 uppercase tracking-wider">
            {item.name.replace(/\.[^.]+$/, "")}
          </p>
        )}
        {total > 1 && (
          <p className="font-detail text-[10px] text-cream/35 uppercase tracking-widest mt-3">{idx + 1} / {total}</p>
        )}
      </div>
      {total > 1 && (
        <button onClick={next} className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors" aria-label="Next">
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-jet flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-clay/30 border-t-clay rounded-full animate-spin" />
    </div>
  );
}

function ErrorScreen() {
  return (
    <div className="min-h-screen bg-jet flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight mb-2">
          ROGET<span className="font-normal italic font-drama">james</span>
        </a>
        <div className="w-8 h-px bg-clay/50 mx-auto my-4" />
        <p className="font-detail text-sm text-cream/60 leading-relaxed">
          This link appears to be invalid or has expired. Please contact us to request a new one.
        </p>
        <a href="/" className="mt-8 inline-flex items-center gap-2 font-detail text-xs text-cream/50 uppercase tracking-[0.2em] hover:text-cream transition-colors">
          <ChevronLeft size={12} />
          Return to site
        </a>
      </div>
    </div>
  );
}

function VerifyStep({ onVerified, formRef }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vault-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Email not recognised. Please check and try again.");
        if (formRef.current) {
          gsap.fromTo(formRef.current, { x: -8 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, ease: "none", onComplete: () => gsap.set(formRef.current, { x: 0 }) });
        }
        return;
      }
      onVerified(data, email.trim().toLowerCase());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-jet flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(196,80,24,0.04) 0%, transparent 70%)" }} />
      <div ref={formRef} className="relative w-full max-w-sm">
        <div className="bg-charcoal/80 border border-cream/10 rounded-[2rem] p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight hover:text-cream/80 transition-colors">
              ROGET<span className="font-normal italic font-drama">james</span>
            </a>
            <div className="w-8 h-px bg-clay/50 mx-auto mt-3 mb-4" />
            <p className="font-detail text-[10px] text-cream/75 uppercase tracking-[0.25em]">Private Client Vault</p>
          </div>
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-clay/10 border border-clay/30 flex items-center justify-center">
              <Lock size={16} className="text-clay" />
            </div>
          </div>
          <p className="font-detail text-sm text-cream/75 text-center leading-relaxed mb-8">
            Enter the email address associated with your private preview to access your vault.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="Your email address"
                autoComplete="email"
                className="w-full bg-cream/5 border border-cream/20 focus:border-clay/70 rounded-2xl px-5 py-3.5 text-center font-detail text-cream placeholder:text-cream/35 outline-none transition-colors duration-200"
                style={{ caretColor: "#C45018" }}
              />
              {error && <p className="font-detail text-[11px] text-clay text-center mt-2 leading-relaxed">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={!email.trim() || loading}
              className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 disabled:cursor-default transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Verifying…</>
              ) : "Access My Vault"}
            </button>
          </form>
          <p className="font-detail text-[10px] text-cream/40 text-center mt-6 leading-relaxed">
            This page was prepared exclusively for you by ROGETjames.
          </p>
        </div>
      </div>
    </div>
  );
}

function VaultContent({ clientData }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const pageRef = useRef(null);
  const statusConfig = STATUS_CONFIG[clientData?.status] || null;

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });
    }
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-jet text-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cream/[0.08] bg-jet/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="font-heading font-bold text-cream tracking-tight hover:text-cream/80 transition-colors">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="flex items-center gap-5">
            <a href="/#collection" className="font-detail text-[10px] text-cream/50 uppercase tracking-[0.2em] hover:text-cream transition-colors hidden sm:block">Collection</a>
            <a href="/#contact" className="font-detail text-[10px] text-cream/50 uppercase tracking-[0.2em] hover:text-cream transition-colors hidden sm:block">Contact</a>
            <a href="/" className="flex items-center gap-1.5 font-detail text-[10px] text-cream/55 uppercase tracking-[0.15em] hover:text-cream transition-colors border border-cream/15 hover:border-cream/35 rounded-full px-3.5 py-1.5">
              Explore Studio
              <ArrowRight size={10} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10 border-b border-cream/[0.08]">
        <div className="max-w-2xl">
          <p className="font-detail text-[10px] text-clay uppercase tracking-[0.25em] mb-3">
            Private Client Vault{clientData?.location ? ` · ${clientData.location}` : ""}
          </p>
          <h1 className="font-drama text-3xl md:text-4xl font-light text-cream leading-tight">
            {clientData?.clientName || "Your Project"}
          </h1>
          {clientData?.projectTitle && (
            <p className="font-detail text-sm text-cream/55 uppercase tracking-[0.15em] mt-2">{clientData.projectTitle}</p>
          )}
          {statusConfig && (
            <div className="inline-flex items-center gap-2 mt-5 bg-cream/5 border border-cream/10 rounded-full px-3.5 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusConfig.dot }} />
              <span className="font-detail text-[10px] uppercase tracking-[0.15em] text-cream/75">{statusConfig.label}</span>
            </div>
          )}
          {clientData?.greeting && (
            <p className="font-detail text-sm text-cream/65 mt-7 leading-relaxed max-w-lg border-l border-clay/40 pl-4">
              {clientData.greeting}
            </p>
          )}
        </div>
      </section>

      {/* Project description */}
      {clientData?.projectDescription && (
        <section className="max-w-6xl mx-auto px-6 py-10 border-b border-cream/[0.08]">
          <p className="font-detail text-[10px] text-cream/35 uppercase tracking-[0.2em] mb-4">Project Details</p>
          <p className="font-detail text-sm text-cream/75 leading-relaxed max-w-2xl whitespace-pre-line">
            {clientData.projectDescription}
          </p>
        </section>
      )}

      {/* Image gallery */}
      {clientData?.images?.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-10 border-b border-cream/[0.08]">
          <p className="font-detail text-[10px] text-cream/35 uppercase tracking-[0.2em] mb-6">Project Images</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientData.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="group relative rounded-2xl overflow-hidden bg-cream/5 border border-cream/[0.08] hover:border-clay/35 transition-all duration-300 text-left"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={img.url}
                  alt={img.name || `Image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.name && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-detail text-[10px] text-cream/70 uppercase tracking-wider">
                      {img.name.replace(/\.[^.]+$/, "")}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* PDF downloads */}
      {clientData?.pdfs?.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-10 border-b border-cream/[0.08]">
          <p className="font-detail text-[10px] text-cream/35 uppercase tracking-[0.2em] mb-6">Documents</p>
          <div className="space-y-3 max-w-xl">
            {clientData.pdfs.map((pdf, i) => (
              <a
                key={i}
                href={pdf.url}
                download={pdf.name}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 bg-cream/5 border border-cream/[0.08] rounded-2xl hover:border-clay/35 hover:bg-cream/[0.07] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-clay/10 border border-clay/25 flex items-center justify-center flex-shrink-0">
                  <Download size={16} className="text-clay" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-detail text-sm text-cream/80 truncate">{pdf.name || "Document"}</p>
                  <p className="font-detail text-[10px] text-cream/35 uppercase tracking-wider mt-0.5">PDF Document</p>
                </div>
                <ExternalLink size={14} className="text-cream/25 group-hover:text-cream/55 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="font-detail text-[10px] text-cream/30 uppercase tracking-[0.25em] mb-3">Discover more</p>
        <h2 className="font-drama text-2xl md:text-3xl text-cream font-light mb-7">
          Explore the full ROGETjames collection
        </h2>
        <a
          href="/"
          className="inline-flex items-center gap-3 bg-clay text-cream px-8 py-4 rounded-full font-detail text-xs uppercase tracking-[0.2em] hover:bg-clay-light transition-colors"
        >
          Explore the Studio
          <ArrowRight size={14} />
        </a>
        <div className="mt-12 pt-8 border-t border-cream/[0.08]">
          <p className="font-detail text-[10px] text-cream/20 uppercase tracking-wider">ROGETjames · Perth · Gold Coast · Melbourne</p>
        </div>
      </section>

      {lightboxIndex !== null && clientData?.images && (
        <Lightbox
          items={clientData.images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

function AdminPanel() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/vault-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminSecret: secret, clientEmail: inviteEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setResult({ error: data.error || "Failed to send invite." });
        if (!res.ok && res.status === 401) setAuthed(false);
      } else {
        setResult({ success: true, vaultUrl: data.vaultUrl });
        setInviteEmail("");
      }
    } catch {
      setResult({ error: "Request failed. Check your connection." });
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-jet flex items-center justify-center px-6">
        <div ref={formRef} className="w-full max-w-sm">
          <div className="bg-charcoal/80 border border-cream/10 rounded-[2rem] p-8">
            <div className="text-center mb-8">
              <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight">
                ROGET<span className="font-normal italic font-drama">james</span>
              </a>
              <div className="w-8 h-px bg-clay/50 mx-auto mt-3 mb-4" />
              <p className="font-detail text-[10px] text-cream/75 uppercase tracking-[0.25em]">Vault Admin</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); if (secret.trim()) setAuthed(true); }} className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Admin password"
                className="w-full bg-cream/5 border border-cream/20 focus:border-clay/70 rounded-2xl px-5 py-3.5 text-center font-heading text-cream tracking-[0.15em] placeholder:text-cream/30 placeholder:font-detail placeholder:text-sm placeholder:tracking-widest outline-none transition-colors"
                style={{ caretColor: "#C45018" }}
              />
              <button
                type="submit"
                disabled={!secret.trim()}
                className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 transition-all"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jet px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <a href="/" className="font-heading font-bold text-cream text-xl tracking-tight">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="w-8 h-px bg-clay/50 mt-3 mb-5" />
          <p className="font-detail text-[10px] text-clay uppercase tracking-[0.25em]">Vault Admin · Send Client Invite</p>
        </div>

        <div className="bg-charcoal/60 border border-cream/10 rounded-2xl p-8">
          <p className="font-detail text-sm text-cream/60 leading-relaxed mb-6">
            Enter a client's email address to send them their exclusive vault invite. The client must already have a record in Airtable with this email.
          </p>
          <form onSubmit={handleSend} className="space-y-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => { setInviteEmail(e.target.value); setResult(null); }}
              placeholder="client@email.com"
              className="w-full bg-cream/5 border border-cream/20 focus:border-clay/70 rounded-2xl px-5 py-3.5 font-detail text-cream placeholder:text-cream/30 outline-none transition-colors"
              style={{ caretColor: "#C45018" }}
            />
            <button
              type="submit"
              disabled={!inviteEmail.trim() || loading}
              className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Sending…</>
              ) : "Send Vault Invite"}
            </button>
          </form>

          {result?.error && (
            <div className="mt-5 p-4 bg-red-500/10 border border-red-500/25 rounded-xl">
              <p className="font-detail text-sm text-red-300">{result.error}</p>
            </div>
          )}
          {result?.success && (
            <div className="mt-5 p-4 bg-green-500/10 border border-green-500/25 rounded-xl space-y-3">
              <p className="font-detail text-sm text-green-300">Invite sent successfully.</p>
              <p className="font-detail text-[10px] text-cream/40 uppercase tracking-wider">Vault URL (copy to share manually)</p>
              <p className="font-mono text-xs text-cream/70 break-all bg-cream/5 rounded-lg px-3 py-2">{result.vaultUrl}</p>
              <button
                onClick={() => navigator.clipboard?.writeText(result.vaultUrl)}
                className="font-detail text-[10px] text-clay uppercase tracking-wider hover:text-cream transition-colors"
              >
                Copy link
              </button>
            </div>
          )}
        </div>

        <p className="font-detail text-[10px] text-cream/25 mt-6 text-center">
          Clients access their vault at <span className="text-cream/40">rogetjames.com/vault?token=…</span>
        </p>
      </div>
    </div>
  );
}

export default function VaultPage() {
  const token = new URLSearchParams(window.location.search).get("token");
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "1";
  const STORAGE_KEY = token ? `roj_vault_${token}` : null;

  const [step, setStep] = useState("loading");
  const [clientData, setClientData] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (isAdmin) { setStep("admin"); return; }
    if (!token) { setStep("error"); return; }
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (data) { setClientData(data); setStep("content"); return; }
      }
    } catch {}
    setStep("verify");
  }, []);

  const handleVerified = (data, verifiedEmail) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, verifiedEmail }));
    } catch {}
    setClientData(data);
    setStep("content");
  };

  if (step === "loading") return <LoadingScreen />;
  if (step === "error") return <ErrorScreen />;
  if (step === "admin") return <AdminPanel />;
  if (step === "verify") return <VerifyStep onVerified={handleVerified} formRef={formRef} />;
  if (step === "content") return <VaultContent clientData={clientData} />;
  return null;
}
