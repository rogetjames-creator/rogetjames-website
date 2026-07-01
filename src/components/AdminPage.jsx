import { useState, useEffect } from "react";

// Verifies the admin password against the media endpoint, stores it so the
// other admin pages (stats, media) auto-open on this device, and shows a hub
// of links to every non-public area.
export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (adminSecret) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/media-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminSecret, action: "list" }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Failed.");
        setAuthed(false);
        try { localStorage.removeItem("stats_key"); } catch { /* ignore */ }
      } else {
        setAuthed(true);
        try { localStorage.setItem("stats_key", adminSecret); } catch { /* ignore */ }
      }
    } catch {
      setError("Request failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlKey = new URLSearchParams(window.location.search).get("key");
    const saved = urlKey || (() => { try { return localStorage.getItem("stats_key"); } catch { return null; } })();
    if (urlKey) window.history.replaceState({}, "", "/admin");
    if (saved) login(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <p className="font-detail text-[10px] text-cream/85 uppercase tracking-[0.25em]">Admin</p>
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

  const cards = [
    { href: "/", title: "View site", desc: "Open the live website." },
    { href: "/stats", title: "Stats", desc: "Visitor pricing enquiries, postcodes, Q&Ai chats." },
    { href: "/media", title: "Media upload", desc: "Add images from iCloud for any part of the site." },
    { href: "/vault?admin=1", title: "Client Vault", desc: "Send a private locked page to a client." },
  ];

  return (
    <div className="min-h-screen bg-jet px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <a href="/" className="font-heading font-bold text-cream text-xl tracking-tight">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="w-8 h-px bg-clay/50 mx-auto mt-3 mb-3" />
          <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.25em]">Admin</p>
        </div>
        <div className="space-y-3">
          {cards.map((c) => (
            <a key={c.href} href={c.href}
              className="block bg-white/8 border border-white/18 rounded-2xl p-5 hover:border-clay/60 hover:bg-white/12 transition-all">
              <p className="font-heading font-semibold text-cream text-sm">{c.title}</p>
              <p className="font-detail text-[12px] text-cream/55 mt-1">{c.desc}</p>
            </a>
          ))}
        </div>
        <p className="font-detail text-[10px] text-cream/35 text-center mt-8 leading-relaxed">
          Signed in on this device — Stats and Media will open without asking again.
        </p>
      </div>
    </div>
  );
}
