import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

// Self-contained quote basket + request form for the standalone Wall Art /
// Sculpture gallery pages. Those pages have no Contact section of their own, so
// "Add to Quote" (dispatched as a "quote-add" window event by Gallery.jsx's
// PricingPopup) had nothing listening and vanished. This wires that event to a
// real basket and submits to the same /api/contact endpoint the main site's
// contact form uses.
//
// The basket count is broadcast as a "quote-count" event so each gallery's top
// bar can show the gold "Pending Quotes (N)" pill; that pill opens this form by
// dispatching "quote-open". (The old floating bottom-left button was removed.)

const CSS = `
.fq-overlay{position:fixed;inset:0;z-index:10001;background:rgba(6,6,6,.72);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.fq-card{width:100%;max-width:440px;max-height:88vh;overflow-y:auto;background:#141414;border:1px solid rgba(242,240,233,.12);border-radius:22px;padding:26px 24px;color:#F2F0E9;position:relative;box-shadow:0 40px 90px rgba(0,0,0,.6)}
.fq-close{position:absolute;top:16px;right:16px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.08);border:none;color:rgba(242,240,233,.7);display:grid;place-items:center;cursor:pointer;transition:.2s}
.fq-close:hover{background:rgba(255,255,255,.16);color:#F2F0E9}
.fq-heading{font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:rgba(242,240,233,.6);margin:0 0 16px}
.fq-items{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
.fq-item{display:flex;align-items:center;gap:11px;background:rgba(255,255,255,.04);border:1px solid rgba(242,240,233,.08);border-radius:12px;padding:8px 10px}
.fq-item img{width:44px;height:44px;object-fit:cover;border-radius:8px;flex:0 0 auto}
.fq-item-info{flex:1;min-width:0}
.fq-item-name{font-size:12px;font-weight:600;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fq-item-meta{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(242,240,233,.45);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fq-item-remove{background:none;border:none;color:rgba(242,240,233,.4);cursor:pointer;padding:4px;flex:0 0 auto}
.fq-item-remove:hover{color:#F2F0E9}
.fq-empty{font-size:12px;color:rgba(242,240,233,.45);text-align:center;padding:14px 0 20px}
.fq-field{margin-bottom:12px}
.fq-field label{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,240,233,.5);margin-bottom:5px}
.fq-field input,.fq-field textarea{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(242,240,233,.12);border-radius:11px;padding:11px 13px;color:#F2F0E9;font-family:inherit;font-size:14px;outline:none;transition:border-color .2s}
.fq-field input:focus,.fq-field textarea:focus{border-color:#9E7134}
.fq-field textarea{resize:none;min-height:74px}
.fq-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.fq-submit{width:100%;padding:13px;border-radius:14px;background:#9E7134;border:1px solid #9E7134;color:#F2F0E9;font-family:inherit;font-weight:600;font-size:13px;letter-spacing:.05em;cursor:pointer;transition:.25s;margin-top:4px}
.fq-submit:hover{background:#b5843f;border-color:#b5843f}
.fq-submit:disabled{opacity:.4;cursor:default}
.fq-err{font-size:11px;color:#f6a5a5;text-align:center;margin-top:10px}
.fq-success{text-align:center;padding:20px 4px}
.fq-success-mark{width:46px;height:46px;border-radius:50%;background:rgba(158,113,52,.18);border:1px solid #9E7134;color:#c08c46;display:grid;place-items:center;margin:0 auto 14px;font-size:22px}
.fq-success p{font-size:13px;color:rgba(242,240,233,.7);line-height:1.6;margin:0}
`;

export function QuoteBar() {
  // Basket lives here. Listens for the "quote-add" window event dispatched by
  // Gallery.jsx's PricingPopup and dedupes exactly like App.jsx does on the
  // main site. The gold top-bar pill (in FeatureWall/SculptureWall) opens this
  // form via a "quote-open" event.
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onAdd = (e) => {
      setItems((prev) => {
        const exists = prev.some(
          (p) => p.name === e.detail.name && p.size?.id === e.detail.size?.id && p.material?.id === e.detail.material?.id
        );
        return exists ? prev : [...prev, e.detail];
      });
      // Adding a piece drops it into the basket and lights the "Pending Quotes"
      // pill in the top bar; the visitor keeps browsing and opens the form only
      // when ready — so one quote can cover several pieces.
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("quote-add", onAdd);
    window.addEventListener("quote-open", onOpen);
    return () => {
      window.removeEventListener("quote-add", onAdd);
      window.removeEventListener("quote-open", onOpen);
    };
  }, []);

  // Broadcast the basket count so the top-bar "Pending Quotes" pill updates.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("quote-count", { detail: items.length }));
  }, [items.length]);

  const onRemove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const onClear = useCallback(() => setItems([]), []);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) return; // honeypot
    setSending(true);
    try {
      const payload = {
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        message: fd.get("message"),
        selections: items.map((qi) => `${qi.name}${qi.size?.dims ? ` — ${qi.size.dims}` : ""}${qi.material?.label ? `, ${qi.material.label}` : ""}`).join(" | "),
        company: fd.get("company"),
        attachments: [],
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
      onClear();
    } catch {
      setError("Something went wrong — please try again, or email james@rogetjames.com directly.");
    } finally {
      setSending(false);
    }
  };

  const close = () => { setOpen(false); if (done) setDone(false); };

  if (!open) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="fq-overlay" onClick={close}>
        <div className="fq-card" onClick={(e) => e.stopPropagation()}>
          <button className="fq-close" onClick={close} aria-label="Close"><X size={15} /></button>
          {done ? (
            <div className="fq-success">
              <div className="fq-success-mark">✓</div>
              <p>Thank you — your quote request has been sent. James will be in touch shortly.</p>
            </div>
          ) : (
            <>
              <p className="fq-heading">Your Quote Request</p>
              <div className="fq-items">
                {items.length === 0 ? (
                  <div className="fq-empty">No pieces added yet.</div>
                ) : items.map((qi) => (
                  <div className="fq-item" key={qi.id}>
                    {qi.img && <img src={qi.img} alt="" />}
                    <div className="fq-item-info">
                      <div className="fq-item-name">{qi.name}</div>
                      <div className="fq-item-meta">
                        {[qi.size?.dims, qi.material?.label].filter(Boolean).join(" · ") || "—"}
                      </div>
                    </div>
                    <button className="fq-item-remove" onClick={() => onRemove(qi.id)} aria-label="Remove"><X size={13} /></button>
                  </div>
                ))}
              </div>
              <form onSubmit={submit}>
                <input className="fq-hp" type="text" name="company" tabIndex={-1} autoComplete="off" />
                <div className="fq-field">
                  <label htmlFor="fq-name">Name *</label>
                  <input id="fq-name" name="name" required autoComplete="name" />
                </div>
                <div className="fq-field">
                  <label htmlFor="fq-email">Email *</label>
                  <input id="fq-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="fq-field">
                  <label htmlFor="fq-phone">Phone</label>
                  <input id="fq-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" />
                </div>
                <div className="fq-field">
                  <label htmlFor="fq-message">Message</label>
                  <textarea id="fq-message" name="message" placeholder="Tell us about your space or project…" />
                </div>
                <button className="fq-submit" type="submit" disabled={sending || items.length === 0}>
                  {sending ? "Sending…" : "Send Quote Request"}
                </button>
                {error && <p className="fq-err">{error}</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
