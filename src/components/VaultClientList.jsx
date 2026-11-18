import { useEffect, useState } from "react";

// The admin's list of vault clients — shown on /vault and in the Client Preview
// pop-up when James's admin password is saved on this device.
// James opening /vault on his own device (admin key saved) sees every client
// to choose from, instead of whichever client last signed in on this device.
export default function VaultClientList({ adminKey, onPick }) {
  const [clients, setClients] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/vault-upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminSecret: adminKey, action: "list-clients" }) })
      .then((r) => r.json())
      .then((d) => { if (d && Array.isArray(d.clients)) setClients(d.clients); else setError(d?.error || "Couldn't load clients."); })
      .catch(() => setError("Couldn't load clients."));
  }, [adminKey]);
  const fmt = (iso) => { try { return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" }); } catch { return ""; } };
  return (
    <div className="min-h-screen bg-jet px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <a href="/" className="font-heading font-bold text-cream text-xl tracking-tight">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="w-8 h-px bg-clay/50 mt-3 mb-5" />
          <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.25em]">Vault · Choose a client</p>
        </div>
        {error && <p className="font-detail text-[13px] text-red-300">{error}</p>}
        {!clients && !error && <p className="font-detail text-[13px] text-cream/75">Loading clients…</p>}
        {clients && (
          <div className="space-y-3">
            {clients.map((c) => (
              <button key={c.id} type="button" onClick={() => onPick(c)}
                className="w-full text-left flex items-center gap-4 bg-white/8 border border-white/18 hover:border-clay/65 rounded-2xl p-3 transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream/5 shrink-0 flex items-center justify-center">
                  {c.cover ? <img src={c.cover} alt="" className="w-full h-full object-cover" /> : <span className="font-detail text-[11px] text-cream/75">No photos</span>}
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-cream text-[15px] truncate">{c.name}</p>
                  <p className="font-detail text-[13px] text-cream/75">
                    {c.count} photo{c.count === 1 ? "" : "s"} · {c.lastOpened ? `Opened ${fmt(c.lastOpened)}` : "Not opened yet"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

