import { useState, useEffect } from "react";
import { MEDIA_DESTINATIONS, WALL_ART_COVERS, SCULPTURE_SUBCATS } from "./Gallery";
import { SCREEN_COVERS, PROJECT_DESTINATIONS, BESPOKE_LIVE_DESTINATIONS } from "./BespokeCommissions";
import { CITY_PANEL_NAMES } from "./MelbourneGalleryPanels";
import { HERO_SLIDES } from "./heroSlides";
import { MEDIA_KEYS, HOLDING_DESTINATIONS, cityPanelKey } from "../mediaDestinations";

// Every screen design name, self-maintaining from the live screen covers — add
// a design and it shows up here. Typing/tapping one of these as the upload's
// name files the photo with that design automatically (its section/position
// follow from the name), so there's nothing to place by hand.
const SCREEN_DESIGN_NAMES = Array.from(
  new Set(SCREEN_COVERS.flatMap((s) => s.pieces.map((p) => p.name)))
).sort((a, b) => a.localeCompare(b));

// The screen sections a NEW design can be filed under, self-maintaining from
// the live covers. Typing a name that isn't an existing design makes a brand-new
// design; it lands in the section chosen here (or under "New" if none is picked).
const SCREEN_SECTIONS = [
  ...SCREEN_COVERS.map((s) => ({ id: s.id, label: s.label })),
  // Light Features is a cross-cutting Screens category (not a design section), but
  // still needs to be a place you can file an image into.
  { id: "light-features", label: "LIGHT FEATURES" },
];
const SECTION_LABELS = Object.fromEntries(SCREEN_SECTIONS.map((s) => [s.id, `Screens — ${s.label}`]));

const API = "/api/media-upload";

// Destinations grouped by where they show on the site. These are built from the
// SAME sources the live pages read, so a button can never point at a spot no
// page shows:
//   • Wall Art series  ── WALL_ART_COVERS (the live gallery covers)
//   • Hero slides      ── HERO_SLIDES (the live hero list)
//   • Screens/Sculpture/Concepts/Up Close ── MEDIA_KEYS (see mediaDestinations.js),
//     the exact keys ScreensGalleryModal / SculptureWall / Hero import and read.
// Add a wall-art series or a hero slide and it appears here on its own. The
// "won't go live yet" group below is kept visually separate so it's obvious a
// holding-pen upload needs placing before it shows anywhere.
// City pages that render the accordion panels. Every city page shows them, and
// each keeps its own set of pictures. Uploading to a panel REPLACES its picture.
// Add a city here only once its page shows the panels, so a photo can never be
// sent to a panel that doesn't exist.
const CITY_PANEL_PAGES = [
  { slug: "melbourne",  label: "Melbourne" },
  { slug: "perth",      label: "Perth" },
  { slug: "sydney",     label: "Sydney" },
  { slug: "gold-coast", label: "Gold Coast" },
  { slug: "adelaide",   label: "Adelaide" },
];
const CITY_PANEL_GROUPS = CITY_PANEL_PAGES.map((c) => ({
  group: `${c.label} page — panels`,
  hint: `replaces a panel's picture on the ${c.label} page`,
  items: CITY_PANEL_NAMES.map((n) => ({ key: cityPanelKey(c.slug, n), label: n })),
}));

const LIVE_DEST_GROUPS = [
  {
    group: "Wall Art",
    hint: "shows on the Wall Art page",
    items: WALL_ART_COVERS.map((c) => ({ key: c.id, label: c.label })),
  },
  {
    group: "Sculpture",
    hint: "shows on the Sculpture page — pick the category",
    items: SCULPTURE_SUBCATS.map((c) => ({ key: c.id, label: c.label })),
  },
  {
    group: "Bespoke",
    hint: "the Bespoke popups on the home page — Sculpture or Concepts",
    items: BESPOKE_LIVE_DESTINATIONS,
  },
  {
    group: "Concrete",
    hint: "the Concrete portal appears in Bespoke as soon as the first photo lands here",
    items: [{ key: MEDIA_KEYS.concrete, label: "Concrete" }],
  },
  { group: "Screens", hint: "shows on the Screens page", items: [{ key: MEDIA_KEYS.screens, label: "Screens" }] },
  {
    group: "Projects",
    hint: "shows in the Projects gallery — pick which project it belongs to",
    items: PROJECT_DESTINATIONS,
  },
  {
    group: "Displays",
    hint: "one upload → shows under a DISPLAYS pill in Screens, Sculpture AND Projects",
    items: [{ key: "displays", label: "Displays (Screens + Sculpture + Projects)" }],
  },
  {
    group: "Hero slideshow",
    hint: "shows on the homepage hero",
    items: [
      { key: MEDIA_KEYS.hero, label: "Add a new slide" },
      ...HERO_SLIDES.map((s) => ({ key: `${MEDIA_KEYS.heroReplacePrefix}${s.key}`, label: `Replace: ${s.label}` })),
    ],
  },
  {
    group: "Other",
    hint: "special spots",
    items: [{ key: MEDIA_KEYS.upClose, label: "Up Close (all galleries)" }],
  },
];
// Parked spots with no gallery yet — shown apart so a photo sent here is never
// mistaken for one that's gone live.
const HOLDING_GROUP = {
  group: "Won't go live yet — I'll place it",
  hint: "no gallery for these yet",
  holding: true,
  items: HOLDING_DESTINATIONS,
};
const DEST_GROUPS = [...LIVE_DEST_GROUPS, ...CITY_PANEL_GROUPS, HOLDING_GROUP];
const ALL_DEST_ITEMS = DEST_GROUPS.flatMap((g) => g.items);
// Resolve a label for any key: the curated list first, then any legacy key that
// might still be on an older upload, so the library section always reads clearly.
const LEGACY_LABELS = Object.fromEntries((MEDIA_DESTINATIONS || []).map((d) => [d.key, d.label]));
const labelForKey = (key) =>
  ALL_DEST_ITEMS.find((d) => d.key === key)?.label || SECTION_LABELS[key] || LEGACY_LABELS[key] || (key === "other" ? "Other (see note)" : key);

// Phone photos can be 5-10MB — far too slow/large to send as-is. Downscale to
// a sane display size and re-encode as JPEG before upload, so a batch sends
// in seconds instead of timing out.
const MAX_DIM = 2000;
function compressToDataUrl(file) {
  return new Promise((resolve) => {
    // Never reject — resolve a { failed } marker instead, so one unreadable
    // photo (typically an iPhone HEIC the browser can't decode) doesn't take
    // the whole batch down with it. The caller reports which ones failed.
    const fail = () => resolve({ name: file.name, failed: true });
    const reader = new FileReader();
    reader.onerror = fail;
    reader.onload = () => {
      const img = new Image();
      img.onerror = fail;
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          // A blank/failed canvas yields a tiny string — treat as a failure so
          // it is never staged as a blank gallery image.
          if (dataUrl.length > 1000) resolve({ name: file.name, dataUrl });
          else fail();
        } catch { fail(); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// One tidy dropdown to choose a destination; the ones you pick show as removable
// chips below. Replaces the old wall of ~35 chips. Multiple can be added, but
// most uploads are one place.
function DestPicker({ selected, onToggle }) {
  return (
    <div>
      <select
        value=""
        onChange={(e) => { if (e.target.value) onToggle(e.target.value); }}
        className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-3 font-detail text-[13px] text-cream outline-none transition-colors cursor-pointer"
      >
        <option value="" className="bg-jet">+ Choose where these go…</option>
        {DEST_GROUPS.map((g) => (
          <optgroup key={g.group} label={g.group} className="bg-jet">
            {g.items.map((d) => (
              <option key={d.key} value={d.key} disabled={selected.includes(d.key)} className="bg-jet">
                {d.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((k) => (
            <button key={k} type="button" onClick={() => onToggle(k)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay border border-clay text-cream font-detail text-[11px] hover:bg-clay-light transition-colors">
              {labelForKey(k)}<span className="text-cream/70 text-[13px] leading-none">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Add images straight into a client's Vault (writes to their Airtable record).
function VaultUpload({ secret }) {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [staged, setStaged] = useState([]); // [{ name, dataUrl }]
  const [phase, setPhase] = useState("loading"); // loading | idle | sending | done
  const [msg, setMsg] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [current, setCurrent] = useState(null); // selected client's full record
  const [loadingClient, setLoadingClient] = useState(false);
  // Per-client notes editor
  const [nGreeting, setNGreeting] = useState("");
  const [nSpiel, setNSpiel] = useState("");
  const [nLinks, setNLinks] = useState("");
  const [nAddress, setNAddress] = useState("");
  const [nContact, setNContact] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [caps, setCaps] = useState({});          // per-image caption edits, keyed by src
  const [savingCaps, setSavingCaps] = useState(false);
  const [newCaption, setNewCaption] = useState(""); // shared caption applied to a new batch
  const fillNotes = (d) => { setNGreeting(d.greeting || ""); setNSpiel(d.spiel || ""); setNLinks((d.links || []).map((l) => `${l.label} | ${l.url}`).join("\n")); setNAddress(d.address || ""); setNContact(d.contact || ""); };
  const fillCaps = (d) => { setCaps(Object.fromEntries((d.images || []).map((im) => [im.src, im.name || ""]))); };

  const post = (payload) => fetch("/api/vault-upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminSecret: secret, ...payload }) }).then((r) => r.json());
  const vthumb = (src) => `/.netlify/images?url=${encodeURIComponent(src)}&w=240&fm=webp&q=70`;

  const loadClients = () => post({ action: "list-clients" })
    .then((d) => { if (Array.isArray(d.clients)) setClients(d.clients); if (d.error) setMsg(d.error); setPhase("idle"); })
    .catch(() => { setPhase("idle"); setMsg("Couldn't load clients."); });

  useEffect(() => { if (secret) loadClients(); /* eslint-disable-next-line */ }, [secret]);

  // When a client is picked, load their existing gallery.
  useEffect(() => {
    if (!clientId) { setCurrent(null); return; }
    let alive = true;
    setLoadingClient(true);
    post({ action: "get-client", clientId })
      .then((d) => { if (!alive) return; if (d.error) { setCurrent(null); } else { setCurrent(d); fillNotes(d); fillCaps(d); } })
      .finally(() => { if (alive) setLoadingClient(false); });
    return () => { alive = false; };
    /* eslint-disable-next-line */
  }, [clientId]);

  const deleteImage = async (src) => {
    const d = await post({ action: "delete-image", clientId, src });
    if (!d.error) { setCurrent((c) => c ? { ...c, images: (c.images || []).filter((i) => i.src !== src) } : c); setCaps((p) => { const n = { ...p }; delete n[src]; return n; }); }
  };

  const saveCaps = async () => {
    setSavingCaps(true); setMsg("");
    const images = (current.images || []).map((im) => ({ src: im.src, name: caps[im.src] ?? im.name ?? "" }));
    const d = await post({ action: "update-images", clientId, images });
    setSavingCaps(false);
    if (d.error) { setMsg(d.error); return; }
    if (d.images) setCurrent((c) => c ? { ...c, images: d.images } : c);
    setMsg("Saved the captions for this gallery.");
  };

  const parseLinks = (text) => text.split("\n").map((line) => {
    const [label, url] = line.split("|").map((s) => (s || "").trim());
    return label && url ? { label, url } : null;
  }).filter(Boolean);

  const saveNotes = async () => {
    setSavingNotes(true); setMsg("");
    const links = parseLinks(nLinks);
    const d = await post({ action: "update-client", clientId, greeting: nGreeting.trim(), spiel: nSpiel.trim(), links, address: nAddress.trim(), contact: nContact.trim() });
    setSavingNotes(false);
    if (d.error) { setMsg(d.error); return; }
    setCurrent((c) => c ? { ...c, greeting: nGreeting.trim(), spiel: nSpiel.trim(), links, address: nAddress.trim(), contact: nContact.trim() } : c);
    setMsg("Saved the notes for this gallery.");
  };

  const onFiles = async (files) => {
    const list = [];
    for (const f of Array.from(files || [])) {
      if (!f.type.startsWith("image/")) continue;
      const dataUrl = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); });
      list.push({ name: f.name, dataUrl });
    }
    setStaged((p) => [...p, ...list]);
  };
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer?.files); };

  const createClient = async () => {
    if (!newName.trim() || !newEmail.trim() || newPassword.trim().length < 4) return;
    setCreating(true); setMsg(""); setCreatedLink("");
    try {
      const r = await fetch("/api/vault-upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminSecret: secret, action: "create-client", name: newName.trim(), email: newEmail.trim(), password: newPassword.trim() }) });
      const d = await r.json();
      if (!r.ok || d.error) { setMsg(d.error || "Couldn't create client."); setCreating(false); return; }
      setClients((p) => [...p, { id: d.id, name: d.name, email: d.email }].sort((a, b) => (a.name || "").localeCompare(b.name || "")));
      setClientId(d.id);
      setCreatedLink(`Vault link: ${d.vaultUrl}  ·  password: ${newPassword.trim()}`);
      setNewName(""); setNewEmail(""); setNewPassword("");
    } catch (e) { setMsg("Create failed — " + (e?.message || "check connection.")); }
    setCreating(false);
  };

  const send = async () => {
    if (!clientId || !staged.length) return;
    setPhase("sending"); setMsg("");
    // If a shared caption is set, apply it to every photo in this batch.
    const images = newCaption.trim() ? staged.map((s) => ({ ...s, name: newCaption.trim() })) : staged;
    try {
      const r = await fetch("/api/vault-upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminSecret: secret, action: "add-images", clientId, images }) });
      const d = await r.json();
      if (!r.ok || d.error) { setMsg(d.error || "Upload failed."); setPhase("idle"); return; }
      setMsg(`Added ${d.added} image(s) — the client now has ${d.total} in their vault. New photos show in the vault about a minute after the site rebuilds.`);
      setStaged([]); setNewCaption(""); setPhase("done");
      post({ action: "get-client", clientId }).then((c) => { if (!c.error) { setCurrent(c); fillCaps(c); } });
      loadClients();
    } catch (e) { setMsg("Upload failed — " + (e?.message || "check connection.")); setPhase("idle"); }
  };

  // ── LIST VIEW: every client as a card; tap one to open it ──
  if (!clientId) {
    return (
      <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-8">
        <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-1">Client Vaults</p>
        <p className="font-detail text-[11px] text-cream/50 mb-4">Each client is a private gallery. Tap a client to see their photos and add more. Make a new one below for a special gallery.</p>

        {/* New client */}
        <div className="mb-5 rounded-xl border border-clay/25 bg-clay/5 p-3">
          <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.14em] mb-2">New client / new gallery</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name (e.g. Smith — Concepts)"
              className="flex-1 bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none" />
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Their email"
              className="flex-1 bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none" />
            <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password"
              className="sm:w-32 bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none" />
            <button onClick={createClient} disabled={!newName.trim() || !newEmail.trim() || newPassword.trim().length < 4 || creating}
              className="px-4 py-2 rounded-xl bg-clay text-cream font-detail text-[12px] hover:bg-clay-light disabled:opacity-30 transition-all whitespace-nowrap">
              {creating ? "Creating…" : "+ Create"}
            </button>
          </div>
          {createdLink && (
            <p className="font-detail text-[11px] text-green-400 mt-2 break-all">Created ✓ — <span className="text-cream/80">{createdLink}</span></p>
          )}
        </div>

        {/* Client cards */}
        {phase === "loading" ? (
          <p className="font-detail text-[12px] text-cream/50">Loading clients…</p>
        ) : clients.length === 0 ? (
          <p className="font-detail text-[12px] text-cream/45">No clients yet — make one above.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {clients.map((c) => (
              <button key={c.id} onClick={() => { setClientId(c.id); setMsg(""); setPhase("idle"); }}
                className="text-left rounded-xl border border-white/12 bg-black/20 hover:border-clay/60 transition-all overflow-hidden group">
                <div className="w-full aspect-[4/3] bg-cream/5 overflow-hidden">
                  {c.cover
                    ? <img src={vthumb(c.cover)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center font-detail text-[10px] text-cream/35 uppercase tracking-wider">No photos</div>}
                </div>
                <div className="p-2.5">
                  <p className="font-detail text-[13px] text-cream/90 leading-tight truncate">{c.name}</p>
                  <p className="font-detail text-[10px] text-cream/45 mt-0.5">{c.count} photo{c.count === 1 ? "" : "s"}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {msg && <p className="font-detail text-[11px] text-center mt-3 text-amber-300">{msg}</p>}
      </div>
    );
  }

  // ── OPEN VIEW: one client — see, add, remove ──
  return (
    <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-8">
      <button onClick={() => { setClientId(""); setStaged([]); setMsg(""); loadClients(); }}
        className="flex items-center gap-1 font-detail text-[11px] text-cream/60 hover:text-cream uppercase tracking-[0.15em] mb-4">← All clients</button>

      {loadingClient ? (
        <p className="font-detail text-[12px] text-cream/50">Loading this vault…</p>
      ) : current ? (
        <>
          <p className="font-heading font-semibold text-cream text-lg leading-tight">{current.name}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 mb-4">
            <a href={current.vaultUrl} target="_blank" rel="noreferrer" className="font-detail text-[11px] text-clay hover:text-clay-light underline">open their gallery ↗</a>
            <span className="font-detail text-[11px] text-cream/45">login: {current.email} · password: {current.password}</span>
          </div>

          {/* Existing photos — number, thumbnail, caption (shown under the image), delete */}
          <p className="font-detail text-[10px] text-cream/50 uppercase tracking-wider mb-2">In this gallery — {(current.images || []).length} · type a caption under each</p>
          {(current.images || []).length > 0 ? (
            <>
              <div className="flex flex-col gap-2 mb-3">
                {current.images.map((im, i) => (
                  <div key={im.src} className="flex items-center gap-3">
                    <span className="font-detail text-[11px] text-cream/40 w-5 text-right">{i + 1}</span>
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-white/15">
                      <img src={vthumb(im.src)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <input type="text" value={caps[im.src] ?? ""} onChange={(e) => setCaps((p) => ({ ...p, [im.src]: e.target.value }))}
                      placeholder="Caption (e.g. UBUD round — Corten steel, rust)"
                      className="flex-1 bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none" />
                    <button onClick={() => deleteImage(im.src)} title="Remove from gallery"
                      className="text-cream/40 hover:text-red-400 text-lg leading-none px-1">×</button>
                  </div>
                ))}
              </div>
              <button onClick={saveCaps} disabled={savingCaps}
                className="px-4 py-2 rounded-xl bg-clay/80 text-cream font-detail text-[12px] hover:bg-clay disabled:opacity-40 transition-all mb-5">
                {savingCaps ? "Saving…" : "Save captions"}
              </button>
            </>
          ) : (
            <p className="font-detail text-[11px] text-cream/40 mb-5">No photos yet — drag some in below.</p>
          )}

          {/* Notes / spiel / links shown to the client */}
          <div className="rounded-xl border border-white/12 bg-black/20 p-3 mb-5">
            <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.15em] mb-2">Notes shown in their gallery</p>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input type="text" value={nAddress} onChange={(e) => setNAddress(e.target.value)} placeholder="Full address (private — for your records)"
                className="flex-1 bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none" />
              <input type="text" value={nContact} onChange={(e) => setNContact(e.target.value)} placeholder="Contact (phone, etc.)"
                className="sm:w-56 bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none" />
            </div>
            <input type="text" value={nGreeting} onChange={(e) => setNGreeting(e.target.value)} placeholder="Short greeting (e.g. Your private preview is ready)"
              className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none mb-2" />
            <textarea value={nSpiel} onChange={(e) => setNSpiel(e.target.value)} rows={10} placeholder={"Message to the client — write as much as you like.\n\nEach new line becomes a new paragraph.\nLeave a blank line for a bigger gap.\nStart a line with *  to make a bullet point."}
              className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none mb-1 resize-y leading-relaxed" />
            <p className="font-detail text-[10.5px] text-cream/40 mb-2 leading-relaxed">New line = new paragraph · blank line = gap · a line starting with <span className="text-clay/90">*</span> becomes a bullet.</p>
            <textarea value={nLinks} onChange={(e) => setNLinks(e.target.value)} rows={2} placeholder={"Links — one per line, as:  Label | https://link.com"}
              className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[12px] text-cream placeholder:text-cream/30 outline-none mb-2 resize-y" />
            <button onClick={saveNotes} disabled={savingNotes}
              className="px-4 py-2 rounded-xl bg-clay/80 text-cream font-detail text-[12px] hover:bg-clay disabled:opacity-40 transition-all">
              {savingNotes ? "Saving…" : "Save notes"}
            </button>
          </div>
        </>
      ) : (
        <p className="font-detail text-[12px] text-cream/50 mb-4">Couldn&apos;t load this vault.</p>
      )}

      {/* Add photos */}
      <label onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}
        className={`block w-full text-center py-6 rounded-2xl border-2 border-dashed font-detail text-sm cursor-pointer transition-all mb-3 ${dragOver ? "border-clay bg-clay/10 text-cream" : "border-white/20 text-cream/80 hover:border-clay/60 hover:text-cream"} ${phase === "sending" ? "opacity-40 pointer-events-none" : ""}`}>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        Drag photos here, or tap to choose
      </label>

      {staged.length > 0 && (
        <>
          <p className="font-detail text-[10px] text-cream/50 mb-2">{staged.length} photo{staged.length === 1 ? "" : "s"} ready to send:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {staged.map((s, i) => (
              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/15">
                <img src={s.dataUrl} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setStaged((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-0 right-0 bg-black/70 text-cream w-4 h-4 flex items-center justify-center text-[10px] leading-none">×</button>
              </div>
            ))}
          </div>
          <input type="text" value={newCaption} onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Caption for all of these (e.g. CORTEN Powder coat — job samples)"
            className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-3 py-2 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none mb-3" />
        </>
      )}

      <button onClick={send} disabled={!staged.length || phase === "sending"}
        className="w-full py-3 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        {phase === "sending" ? "Sending…" : !staged.length ? "Add photos above first" : `Add ${staged.length} photo${staged.length === 1 ? "" : "s"} to gallery →`}
      </button>
      {msg && <p className={`font-detail text-[11px] text-center mt-3 ${phase === "done" ? "text-green-400" : "text-amber-300"}`}>{msg}</p>}
    </div>
  );
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
  const [instructions, setInstructions] = useState(""); // free-text info sent with the upload (e.g. which image to replace)
  const [screenName, setScreenName] = useState("");   // names a Screens upload → files it with that design
  const [pieceName, setPieceName] = useState("");     // title for a non-Screens upload (used as the gallery title, not the filename)
  const [screenSections, setScreenSections] = useState([]); // one or more screen categories to file into
  const [replaceUrl, setReplaceUrl] = useState("");   // paste an existing image URL to overwrite it in place
  const [staged, setStaged] = useState([]);          // [{ name, dataUrl }]
  const [dragOver, setDragOver] = useState(false);   // drag-and-drop highlight
  const [phase, setPhase] = useState("compose");     // compose | sending | done
  const [doneInfo, setDoneInfo] = useState(null);    // { count, dests: [] }
  const [note, setNote] = useState("");

  // Placing an already-uploaded photo into a category (no re-upload)
  const [editing, setEditing] = useState(null);      // the image being placed
  const [editDests, setEditDests] = useState([]);
  const [savingPlace, setSavingPlace] = useState(false);

  // Reels — name it anything and choose which portals it shows in. Sound kept.
  const [reelTitle, setReelTitle] = useState("");
  const [reelTargets, setReelTargets] = useState(["wallart", "reels"]);
  const [reelFile, setReelFile] = useState(null);    // { name, file, mb }
  const [reelPhase, setReelPhase] = useState("idle"); // idle | sending | done
  const [reelNote, setReelNote] = useState("");
  const [reelProgress, setReelProgress] = useState(0);
  const toggleReelTarget = (t) => setReelTargets(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const call = (payload) =>
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

  // optimistic=true (auto-login from a saved key): if the library-list call is
  // slow or fails — it hits the GitHub API and can time out — open the uploader
  // anyway rather than lock the page. A genuine wrong-password (401) never opens
  // optimistically. Manual password entry stays strict so a typo is caught.
  const login = async (adminSecret, { optimistic = false } = {}) => {
    setLoading(true); setError("");
    try {
      const res = await call({ adminSecret, action: "list" });
      let json;
      try { json = await res.json(); } catch { json = null; }
      if (res.status === 401) {
        setError("Wrong password."); setAuthed(false);
        try { localStorage.removeItem("stats_key"); } catch { /* ignore */ }
      } else if (!res.ok || !json || json.error) {
        // Reached the server but the list couldn't be built (e.g. GitHub slow).
        if (optimistic) {
          setAuthed(true); setSecret(adminSecret);
          setNote("Couldn't load your existing photos just now — you can still upload.");
          try { localStorage.setItem("stats_key", adminSecret); } catch { /* ignore */ }
        } else { setError(json?.error || "Couldn't load — try again."); setAuthed(false); }
      } else {
        setAuthed(true); setSecret(adminSecret); setImages(json.images || []);
        try { localStorage.setItem("stats_key", adminSecret); } catch { /* ignore */ }
      }
    } catch {
      // Network/timeout (the fetch itself threw). For a saved key, trust it and
      // open — it verified before; the upload call will re-check server-side.
      if (optimistic) {
        setAuthed(true); setSecret(adminSecret);
        setNote("Couldn't load your existing photos just now — you can still upload.");
      } else { setError("Request failed. Check your connection — or try again."); }
    }
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
    if (saved) login(saved, { optimistic: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDest = (key) => setSelectedDests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  // Shared by the file picker AND drag-and-drop — accepts any image list.
  const processFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(
      (f) => f.type.startsWith("image/") || /\.(heic|heif|jpe?g|png|webp|gif|tiff?)$/i.test(f.name)
    );
    if (!files.length) return;
    setNote("Preparing photos…");
    try {
      const results = await Promise.all(files.map(compressToDataUrl));
      const ok = results.filter(r => !r.failed);
      const failed = results.filter(r => r.failed);
      setStaged(prev => [...prev, ...ok]);
      setNote(
        failed.length
          ? `Couldn't read ${failed.length} photo${failed.length === 1 ? "" : "s"} (${failed.map(f => f.name).join(", ")}) — likely an iPhone HEIC. Open ${failed.length === 1 ? "it" : "them"} and share/save as JPEG, then add again. The rest are ready.`
          : ""
      );
    } catch {
      setNote("Couldn't read those photos — try again.");
    }
  };

  const onPick = (e) => { const fl = e.target.files; e.target.value = ""; processFiles(fl); };
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer?.files); };

  const removeStaged = (i) => setStaged(prev => prev.filter((_, idx) => idx !== i));

  const send = async () => {
    const rep = replaceUrl.trim();
    // Replace mode needs a URL + one photo; normal mode needs a destination.
    if ((!selectedDests.length && !rep) || !staged.length) return;
    setPhase("sending");
    try {
      // A named Screens upload carries that name on every photo in the batch, so
      // the Screens page files it with the matching design (or makes a new one).
      // Every photo in the batch carries the name James typed, so the gallery
      // titles it by that name — never the raw filename. Screens uses its own
      // design-name field; every other category uses the general Name field.
      const screensSel = selectedDests.includes("screens");
      const nm = (screensSel ? screenName : pieceName).trim();
      const outImages = nm
        ? staged.map((s) => ({ ...s, name: nm }))
        : staged;
      // Screens: every chosen category rides along as a destination tag so the
      // photo appears in each one (a design can live in several categories).
      const outDests = screensSel
        ? [...new Set([...selectedDests, ...screenSections])]
        : selectedDests;
      // Replace mode: the note instruction tells the server to overwrite that
      // existing image in place (keeps its URL, so every reference updates).
      const repNote = rep ? `replace this image - ${rep}` : "";
      const combinedNote = [repNote, otherNote.trim(), instructions.trim()].filter(Boolean).join(" — ");
      const res = await call({ adminSecret: secret, images: outImages, destinations: outDests, note: combinedNote });
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
    setStaged([]); setSelectedDests([]); setOtherNote(""); setInstructions(""); setScreenName(""); setPieceName(""); setScreenSections([]); setReplaceUrl(""); setDoneInfo(null); setNote(""); setPhase("compose");
  };

  const remove = async (id) => {
    try { await call({ adminSecret: secret, action: "delete", id }); await refresh(); } catch { /* ignore */ }
  };

  const blobToBase64 = (blob) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = () => rej(new Error("read"));
    r.onload = () => res(String(r.result).split(",")[1] || "");
    r.readAsDataURL(blob);
  });

  // Stage the video untouched — no re-encoding, so picture quality and audio are
  // exactly as-shot. Big files are sent in parts at send-time (see sendReel).
  const onPickReel = (e) => {
    const file = (e.target.files || [])[0];
    e.target.value = "";
    if (!file) return;
    setReelNote("");
    const mb = file.size / 1048576;
    if (mb > 25) { setReelNote(`That clip is ${mb.toFixed(1)}MB — keep it under 25MB.`); setReelFile(null); return; }
    setReelFile({ name: file.name, file, mb });
  };

  const sendReel = async () => {
    if (!reelFile?.file) return;
    const title = reelTitle.trim();
    if (!title) { setReelNote("Give the reel a name first."); return; }
    if (!reelTargets.length) { setReelNote("Tick at least one place for it to show."); return; }
    setReelPhase("sending"); setReelNote(""); setReelProgress(0);
    const file = reelFile.file;
    try {
      const CHUNK = 3 * 1048576;                 // ~3MB → ~4MB base64, under the 6MB cap
      const total = Math.ceil(file.size / CHUNK);
      const uploadId = `up_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      for (let i = 0; i < total; i++) {
        const chunk = await blobToBase64(file.slice(i * CHUNK, (i + 1) * CHUNK));
        const res = await call({ adminSecret: secret, action: "reel-chunk", uploadId, index: i, total, title, targets: reelTargets, chunk });
        let json; try { json = await res.json(); } catch { json = { error: `Server error (status ${res.status}).` }; }
        if (!res.ok || json.error) { setReelNote(json.error || `Upload failed on part ${i + 1} of ${total}.`); setReelPhase("idle"); return; }
        setReelProgress(Math.round(((i + 1) / total) * 100));
      }
      setReelPhase("done"); setReelFile(null); setReelProgress(0);
    } catch (e) {
      setReelNote("Upload failed — " + (e?.message || "check connection and try again.")); setReelPhase("idle");
    }
  };

  // Existing reels — click a name to reuse it (that reel gets replaced).
  const EXISTING_REELS = ["Branches", "Rue", "Banksia", "B Editions", "GREN Free", "Obliationes"];
  const REEL_TARGETS = [
    { key: "wallart", label: "Wall Art portal" },
    { key: "reels",   label: "Discover · Reels" },
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

  const canSend = (selectedDests.length > 0 || replaceUrl.trim()) && staged.length > 0;

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
            <div className="mb-3">
              <DestPicker selected={selectedDests} onToggle={toggleDest} />
            </div>

            {/* Replace an existing image in place — paste its URL, add the new photo below. */}
            <div className="mb-4 rounded-xl border border-clay/30 bg-clay/5 p-3">
              <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.16em] mb-1.5">Or — replace an existing image</p>
              <input type="text" value={replaceUrl} onChange={e => setReplaceUrl(e.target.value)}
                placeholder="Paste the image's URL (right-click the image → Copy image address)"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-2.5 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none transition-colors" />
              <p className="font-detail text-[11px] text-cream/50 mt-2">
                {replaceUrl.trim()
                  ? "Replace mode — the photo you add below overwrites that image everywhere it appears. No destination needed."
                  : "Overwrites that image in place (keeps its spot everywhere). Leave blank for a normal upload."}
              </p>
            </div>
            {selectedDests.includes("other") && (
              <input type="text" value={otherNote} onChange={e => setOtherNote(e.target.value)}
                placeholder="Type where these should go (e.g. Hero slideshow, Screens — Grail)"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-2.5 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none transition-colors mb-6" />
            )}
            {selectedDests.includes("screens") && (() => {
              const nm = screenName.trim();
              return (
                <div className="mb-6">
                  <input type="text" value={screenName} onChange={e => setScreenName(e.target.value)}
                    placeholder="Name this design — an existing one, or a brand-new name"
                    className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-2.5 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none transition-colors" />
                  <p className="font-detail text-[11px] text-cream/50 mt-2">
                    Click an existing design (e.g. <b className="text-cream/75 font-semibold">ASLYIAM</b>) to file it there, or type a new name. Then pick <b className="text-clay/90 font-semibold">one or more categories</b> below — a design can live in several (e.g. Architectural <i>and</i> Light Features).
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SCREEN_DESIGN_NAMES.map(name => (
                      <button key={name} type="button"
                        onClick={() => setScreenName(cur => cur.trim().toLowerCase() === name.toLowerCase() ? "" : name)}
                        className={`px-2.5 py-1 rounded-lg font-detail text-[10px] border transition-all ${nm.toLowerCase() === name.toLowerCase() ? "bg-clay border-clay text-cream" : "border-white/15 text-cream/50 hover:border-clay/50 hover:text-cream"}`}>
                        {name}
                      </button>
                    ))}
                  </div>
                  <p className="font-detail text-[10px] text-clay/70 uppercase tracking-[0.14em] mt-3 mb-1.5">Category</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SCREEN_SECTIONS.map(sec => (
                      <button key={sec.id} type="button"
                        onClick={() => setScreenSections(a => a.includes(sec.id) ? a.filter(x => x !== sec.id) : [...a, sec.id])}
                        className={`px-2.5 py-1 rounded-lg font-detail text-[10px] uppercase tracking-[0.1em] border transition-all ${screenSections.includes(sec.id) ? "bg-clay border-clay text-cream" : "border-clay/45 text-clay/90 hover:border-clay hover:text-cream"}`}>
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
            {/* Name field for every non-Screens category — this becomes the gallery
                title, so the piece is never titled by its raw filename. */}
            {selectedDests.length > 0 && !selectedDests.includes("screens") && !replaceUrl.trim() && (
              <div className="mb-6">
                <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-2">
                  Name <span className="text-cream/40 normal-case tracking-normal font-detail">(the title shown in the gallery)</span>
                </p>
                <input type="text" value={pieceName} onChange={e => setPieceName(e.target.value)}
                  placeholder="e.g. ESFERA, Fire Table, POD"
                  className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-2.5 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none transition-colors" />
                <p className="font-detail text-[11px] text-cream/50 mt-2">
                  Type the name only — no <span className="text-cream/70">- official</span> / <span className="text-cream/70">1200px</span> tags. Applied to every photo in this batch. Leave blank to keep the file's own name.
                </p>
              </div>
            )}
            {!selectedDests.includes("other") && !selectedDests.includes("screens") && selectedDests.length === 0 && <div className="mb-4" />}

            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-2">
              Instructions <span className="text-cream/40 normal-case tracking-normal font-detail">(optional)</span>
            </p>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={2}
              placeholder="To auto-swap an image on Send: replace this image - https://rogetjames.com/images/…/name.jpg"
              className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-2.5 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none transition-colors mb-6 resize-y" />

            <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-3">Step 2 — Choose photos</p>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`block w-full text-center py-6 rounded-2xl border-2 border-dashed font-detail text-sm cursor-pointer transition-all ${dragOver ? "border-clay bg-clay/10 text-cream" : "border-white/20 text-cream/80 hover:border-clay/60 hover:text-cream"} ${phase === "sending" ? "opacity-40 pointer-events-none" : ""}`}>
              + Choose photos, or drag them here from Photos / Finder
              <input type="file" accept="image/*,.heic,.heif" multiple onChange={onPick} className="hidden" />
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
                  ? (replaceUrl.trim() ? `Replace image →` : `Send ${staged.length} photo${staged.length === 1 ? "" : "s"} →`)
                  : (!staged.length ? "Choose a photo first" : "Pick a destination (or paste an image URL to replace)")}
            </button>
            {note && <p className="font-detail text-[11px] text-amber-300 text-center mt-3">{note}</p>}
          </div>
        )}

        {/* ── CLIENT VAULT — add images to a client's private vault ── */}
        <VaultUpload secret={secret} />

        {/* ── REELS (video with sound) ───────────── */}
        <div className="bg-white/8 border border-white/18 rounded-2xl p-6 mb-8">
          <p className="font-detail text-[11px] text-clay/90 uppercase tracking-[0.2em] mb-1">Reels — video with sound</p>
          <p className="font-detail text-[11px] text-cream/50 mb-4">
            Any clip up to 25MB — large ones upload in parts. Nothing is re-encoded, so picture quality and sound are exactly as-shot. Name it anything and tick where it should show. A new name adds a new reel; an existing name replaces it.
          </p>

          {reelPhase === "done" ? (
            <div className="bg-green-600/15 border border-green-500/40 rounded-xl p-5 text-center">
              <p className="font-heading text-cream text-base mb-1">✓ Reel saved</p>
              <p className="font-detail text-[11px] text-cream/70 mb-4">Live on the site within ~2 minutes (hard-refresh to see/hear it sooner).</p>
              <button onClick={() => { setReelPhase("idle"); setReelNote(""); setReelTitle(""); }}
                className="w-full py-3 rounded-xl bg-clay text-cream font-heading font-semibold text-sm hover:bg-clay-light transition-all">
                Add another reel
              </button>
            </div>
          ) : (
            <>
              <input type="text" value={reelTitle} onChange={e => setReelTitle(e.target.value)}
                placeholder="Reel name (e.g. Obliationes, Banksia)"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-xl px-4 py-2.5 font-detail text-[13px] text-cream placeholder:text-cream/30 outline-none transition-colors mb-2" />
              <div className="flex flex-wrap gap-1.5 mb-4">
                {EXISTING_REELS.map(name => (
                  <button key={name} type="button" onClick={() => setReelTitle(name)}
                    className="px-2.5 py-1 rounded-lg font-detail text-[10px] border border-white/15 text-cream/50 hover:border-clay/50 hover:text-cream transition-all">
                    {name}
                  </button>
                ))}
              </div>

              <p className="font-detail text-[10px] text-cream/50 uppercase tracking-[0.15em] mb-2">Show it in</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {REEL_TARGETS.map(t => {
                  const on = reelTargets.includes(t.key);
                  return (
                    <button key={t.key} type="button" onClick={() => toggleReelTarget(t.key)}
                      className={`px-3 py-2 rounded-xl font-detail text-[11px] border transition-all ${on ? "bg-clay border-clay text-cream" : "bg-transparent border-white/18 text-cream/60 hover:border-white/35"}`}>
                      {on ? "✓ " : ""}{t.label}
                    </button>
                  );
                })}
              </div>

              <label className={`block w-full text-center py-3 rounded-2xl border border-white/20 text-cream/80 font-detail text-sm cursor-pointer hover:border-clay/60 hover:text-cream transition-all ${reelPhase === "sending" ? "opacity-40 pointer-events-none" : ""}`}>
                {reelFile ? `Chosen: ${reelFile.name} (${reelFile.mb.toFixed(1)}MB)` : "+ Choose a video (full quality, keeps sound)"}
                <input type="file" accept="video/*" onChange={onPickReel} className="hidden" />
              </label>
              <button onClick={sendReel} disabled={!reelFile || reelPhase === "sending"}
                className="w-full mt-3 py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {reelPhase === "sending"
                  ? (<><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Sending… {reelProgress}%</>)
                  : reelFile ? `Save${reelTitle.trim() ? ` “${reelTitle.trim()}”` : ""} reel →` : "Choose a video first"}
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
                  {im.note && (
                    <p className="px-2 py-1.5 bg-clay/15 border-t border-clay/25 text-clay text-[9px] font-detail leading-snug">
                      <span className="uppercase tracking-wider text-clay/70">Instructions: </span>{im.note}
                    </p>
                  )}
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
            <div className="mb-5">
              <DestPicker selected={editDests} onToggle={toggleEditDest} />
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
