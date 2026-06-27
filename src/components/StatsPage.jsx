import { useState } from "react";

function CountTable({ title, data }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return null;
  return (
    <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-6">
      <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.2em] mb-4">{title}</p>
      <div className="space-y-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <span className="font-detail text-sm text-cream/80">{k}</span>
            <span className="font-heading text-sm font-semibold text-cream">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const load = async (adminSecret) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stats-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminSecret }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Failed to load stats.");
        setAuthed(false);
      } else {
        setAuthed(true);
        setData(json);
      }
    } catch {
      setError("Request failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-jet flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white/8 border border-white/18 rounded-[2rem] p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight">
                ROGET<span className="font-normal italic font-drama">james</span>
              </a>
              <div className="w-8 h-px bg-clay/60 mx-auto mt-3 mb-4" />
              <p className="font-detail text-[10px] text-cream/85 uppercase tracking-[0.25em]">Pricing Interest Stats</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); if (secret.trim()) load(secret.trim()); }} className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Admin password"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-2xl px-5 py-3.5 text-center font-heading text-cream tracking-[0.15em] placeholder:text-cream/30 placeholder:font-detail placeholder:text-sm placeholder:tracking-widest outline-none transition-colors"
                style={{ caretColor: "#9E7134" }}
              />
              <button
                type="submit"
                disabled={!secret.trim() || loading}
                className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Loading…</>
                ) : "Enter"}
              </button>
            </form>
            {error && (
              <p className="font-detail text-[11px] text-red-300 text-center mt-4 leading-relaxed">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { records, summary, chats } = data;

  return (
    <div className="min-h-screen bg-jet px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <a href="/" className="font-heading font-bold text-cream text-xl tracking-tight">
              ROGET<span className="font-normal italic font-drama">james</span>
            </a>
            <div className="w-8 h-px bg-clay/50 mt-3 mb-3" />
            <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.25em]">Pricing Interest · {summary.total} total events</p>
          </div>
          <button
            onClick={() => load(secret)}
            className="font-detail text-[10px] text-cream/50 uppercase tracking-wider hover:text-cream transition-colors"
          >
            Refresh
          </button>
        </div>

        <CountTable title="Activity" data={summary.byType} />
        <CountTable title="WA vs Interstate" data={summary.byRegion} />
        <CountTable title="Items viewed / quoted" data={summary.byItem} />
        <CountTable title="Postcodes" data={summary.byPostcode} />

        <div className="bg-white/8 border border-white/18 rounded-2xl p-6">
          <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.2em] mb-4">Recent events</p>
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {records.length === 0 && (
              <p className="font-detail text-sm text-cream/40">No events recorded yet.</p>
            )}
            {records.map(r => (
              <div key={r.id} className="border-b border-white/8 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-detail text-xs text-clay">{r.Type}</span>
                  <span className="font-detail text-[10px] text-cream/35">{new Date(r.createdTime).toLocaleString()}</span>
                </div>
                <p className="font-detail text-sm text-cream/80">
                  {[r.Item, r.Series, r.Material, r.Size].filter(Boolean).join(" · ")}
                  {typeof r.Price === "number" && ` — $${r.Price.toLocaleString()}`}
                </p>
                {(r.Postcode || r.Region) && (
                  <p className="font-detail text-[11px] text-cream/40 mt-0.5">
                    {[r.Postcode, r.State, r.Region].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mt-6">
          <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.2em] mb-4">
            Q &amp; Ai conversations{chats?.length ? ` · ${chats.length}` : ""}
          </p>
          <div className="space-y-4 max-h-[520px] overflow-y-auto">
            {(!chats || chats.length === 0) && (
              <p className="font-detail text-sm text-cream/40">No conversations recorded yet.</p>
            )}
            {(chats || []).map(c => (
              <div key={c.id} className="border-b border-white/8 pb-4 last:border-0">
                <span className="font-detail text-[10px] text-cream/35">{new Date(c.createdTime).toLocaleString()}</span>
                <div className="mt-1.5 space-y-1.5">
                  {(c.messages || []).map((m, i) => (
                    <p key={i} className={`font-detail text-sm leading-relaxed ${m.role === "user" ? "text-cream/90" : "text-cream/50"}`}>
                      <span className="text-clay/70">{m.role === "user" ? "Q: " : "Jai: "}</span>{m.content}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
