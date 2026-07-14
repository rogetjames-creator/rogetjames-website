import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ChevronDown, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { loadPostcode, savePostcode } from "../utils/postcode";
import { netlifyImg } from "../utils/img";

// Shared engine for the three feature-gallery pages: /wall-art (FeatureWall),
// /sculpture (SculptureWall) and /feature-screens (FeatureScreens). Each page
// is a thin wrapper that passes a `config` object describing its data source,
// its own CSS, its media destination tag and which chrome it shows. Every
// current per-page behaviour is preserved exactly — the differences live in
// `config`, not in the logic below. See the three wrapper files for the full
// config each supplies.
//
// The catalogue image data all three read is the same live Up Close / media
// data as Gallery.jsx: the dedicated Up Close uploader (Blobs), the older
// media-library uploader (Blobs), and the git-committed manifest (fast static
// file). Uploads are scoped per page by `config.mediaTag` so they never leak
// across pages (wall-art is unscoped — every upload there IS wall art).

const byUploadTime = (a, b) => new Date(a.createdTime || 0) - new Date(b.createdTime || 0);

// Default piece flattening (Gallery.jsx "slides"): one thumb per photo, each
// carrying its design's name. Wall Art overrides this via config.orderPieces
// to pin/shuffle its Australian Natives collection; the others use this as-is.
const flattenPieces = (cat) =>
  cat.pieces.flatMap((p) => (p.slides && p.slides.length > 1 ? p.slides.map((img) => ({ ...p, img })) : [p]));

export default function FeatureGallery({ config }) {
  const {
    kicker,
    covers,
    css,
    seedUpClose = {},
    upCloseImages = [],
    mediaTag = null,
    catalogue,
    DetailCard,
    QuoteBar,
    CatPageViewer,
    showSearch = false,
    showMobileMenu = false,
    showInfoPill = false,
    showCollectionCount = false,
    hasExpand = false,
    showExpandProgress = false,
    showExit = false,
    wrapImgSlot = false,
    navIcons = false,
    pillStripThe = false,
    exitClassName = "fw-exit",
    goDelay = 480,
  } = config;

  const orderPieces = useCallback((cat) => (config.orderPieces || flattenPieces)(cat), [config]);

  const [cur, setCur] = useState(0);
  const [pieceIdx, setPieceIdx] = useState(0);
  const busy = useRef(false);
  const [pieceFlash, setPieceFlash] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [catOpen, setCatOpen] = useState(false);
  // Shared with the live site — same localStorage key, so a postcode entered
  // here or on the public gallery carries over either way.
  const [postcodeInfo, setPostcodeInfo] = useState(() => loadPostcode());
  const handleSetPostcode = useCallback((info) => { savePostcode(info); setPostcodeInfo(info); }, []);
  // The arrows + progress line sit centred under the pill, whose width changes
  // with the category name — measure its actual position rather than assume a
  // fixed offset.
  const pillRef = useRef(null);
  const [pillCenter, setPillCenter] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuWrapRef = useRef(null);
  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);
  const subrailRef = useRef(null);
  const hoverDirRef = useRef(0);

  const [uploadedUpClose, setUploadedUpClose] = useState([]);
  const [mediaImages, setMediaImages] = useState([]);
  useEffect(() => {
    let alive = true;
    fetch("/api/up-close-list")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d.images)) {
          setUploadedUpClose(d.images.map((i) => ({ src: i.src, name: i.name, destinations: i.destinations || [], createdTime: i.createdTime || "" })));
        }
      })
      .catch(() => {});
    Promise.all([
      fetch(`/media-manifest.json?v=${Date.now()}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/media-list").then((r) => r.json()).catch(() => ({ images: [] })),
    ]).then(([manifest, legacy]) => {
      if (!alive) return;
      const fromManifest = Array.isArray(manifest)
        ? manifest.map((e) => ({ src: `/${e.path}`, destinations: e.destinations || [], createdTime: e.createdTime || "" }))
        : [];
      const fromLegacy = Array.isArray(legacy.images)
        ? legacy.images.map((i) => ({ src: i.src, destinations: i.destinations || [], createdTime: i.createdTime || "" }))
        : [];
      setMediaImages([...fromManifest, ...fromLegacy]);
    });
    return () => { alive = false; };
  }, []);

  // A category's close-up tile is anything tagged with that category's own id —
  // matching Gallery.jsx's upCloseForSeries exactly, not a separate "up-close" tag.
  const upCloseForSeries = useCallback((id) => {
    const seed = seedUpClose[id] || [];
    const uploads = [
      ...mediaImages.filter((m) => m.destinations.includes(id)).map((m) => ({ src: m.src, createdTime: m.createdTime || "" })),
      ...uploadedUpClose.filter((u) => (u.destinations || []).includes(id)).map((u) => ({ src: u.src, createdTime: u.createdTime || "" })),
    ].sort(byUploadTime);
    const out = [...seed];
    for (const u of uploads) if (!out.includes(u.src)) out.push(u.src);
    return out;
  }, [mediaImages, uploadedUpClose, seedUpClose]);

  // Every collection gets its seeded + uploaded close-up shots appended as its
  // own "— Up Close" piece, and every close-up also collects into its own
  // "Up Close" category — mirroring the live gallery's Up Close pill. The media
  // stores are shared site-wide, so scope by config.mediaTag (null = unscoped,
  // fine on wall-art where every upload IS wall art) to keep pages from pulling
  // each other's close-ups in.
  const CATS = useMemo(() => {
    const withUpClose = covers.map((cat) => {
      const imgs = upCloseForSeries(cat.id);
      if (!imgs.length) return cat;
      const upClosePiece = { name: `${cat.label} — Up Close`, img: imgs[0], slides: imgs, _upclose: true };
      return { ...cat, pieces: [...cat.pieces, upClosePiece] };
    });

    const seedSrcs = new Set(upCloseImages.map((u) => u.src));
    const mediaUpClose = mediaTag
      ? mediaImages.filter((m) => m.destinations.includes(mediaTag))
      : mediaImages.filter((m) => m.destinations.length > 0);
    const uploadedScoped = mediaTag
      ? uploadedUpClose.filter((u) => (u.destinations || []).includes(mediaTag))
      : uploadedUpClose;
    const uploads = [
      ...uploadedScoped.map((u) => ({ src: u.src, name: u.name || "", createdTime: u.createdTime || "" })),
      ...mediaUpClose.map((m) => ({ src: m.src, name: "", createdTime: m.createdTime || "" })),
    ].filter((u) => !seedSrcs.has(u.src)).sort(byUploadTime);
    const seen = new Set();
    const ordered = uploads.filter((u) => { if (seen.has(u.src)) return false; seen.add(u.src); return true; });
    const allUpClose = [...upCloseImages, ...ordered].map((u) => ({ name: u.name || "Up Close", img: u.src, _upclose: true }));

    if (allUpClose.length) {
      withUpClose.push({ id: "up-close", label: "UP CLOSE", img: allUpClose[0].img, pieces: allUpClose });
    }
    return withUpClose;
  }, [covers, mediaImages, uploadedUpClose, upCloseForSeries, upCloseImages, mediaTag]);

  // Flat, searchable index of every named design across all collections —
  // excludes the synthetic "— Up Close" cards. Built from the SAME ordered
  // array the grid renders (orderPieces), so a result's flatIdx lands on the
  // exact thumbnail shown — including Wall Art's reordered Australian Natives.
  const searchIndex = useMemo(() => {
    const idx = [];
    CATS.forEach((cat, catIdx) => {
      orderPieces(cat).forEach((p, flatIdx) => {
        if (p._upclose) return;
        idx.push({ name: p.name, catIdx, catLabel: cat.label, img: p.img, flatIdx });
      });
    });
    return idx;
  }, [CATS, orderPieces]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((it) => it.name.toLowerCase().includes(q)).slice(0, 20);
  }, [searchQuery, searchIndex]);

  const go = useCallback((i) => {
    if (busy.current) return;
    const n = (i + CATS.length) % CATS.length;
    if (n === cur) return;
    busy.current = true;
    setCur(n);
    setPieceIdx(0);
    setExpanded(false);
    setDetailItem(null);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setTimeout(() => { busy.current = false; }, goDelay);
  }, [cur, CATS, goDelay]);

  // Jumps straight to a specific piece from a search result — same category
  // switch as go(), but lands on the matched piece instead of the first one.
  const jumpToPiece = useCallback((catIdx, flatIdx) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (catIdx === cur) {
      setPieceIdx(flatIdx);
      setPieceFlash(flatIdx);
      setTimeout(() => setPieceFlash(-1), 1100);
      return;
    }
    if (busy.current) return;
    busy.current = true;
    setCur(catIdx);
    setPieceIdx(flatIdx);
    setPieceFlash(flatIdx);
    setExpanded(false);
    setDetailItem(null);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => { busy.current = false; setPieceFlash(-1); }, 1100);
  }, [cur]);

  const goPiece = useCallback((i) => {
    setPieceIdx(i);
    setPieceFlash(i);
    setTimeout(() => setPieceFlash(-1), 1100);
  }, []);

  useEffect(() => {
    // Warm only the current collection and its immediate neighbours (for a
    // smooth Next/Prev) rather than eager-loading every image in every
    // collection up front.
    const n = CATS.length;
    const near = n ? [cur, (cur + 1) % n, (cur - 1 + n) % n] : [];
    near.forEach((i) => CATS[i]?.pieces.forEach((p) => {
      (p.slides && p.slides.length > 1 ? p.slides : [p.img]).forEach((src) => { const im = new Image(); im.src = netlifyImg(src, { w: 1600, q: 80 }); });
    }));
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") go(cur + 1);
      if (e.key === "ArrowLeft") go(cur - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur, go, CATS]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => { if (!menuWrapRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    const onDocClick = (e) => { if (!searchWrapRef.current?.contains(e.target)) setSearchOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  // Close the expanded lightbox on Escape, matching the site's other modals.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Piece thumbnails: hovering near either edge auto-scrolls that way, and
  // stops naturally at the start/end — no looping or wrap-around, and the row
  // renders once (not doubled), so nothing is ever shown twice at once.
  useEffect(() => {
    const el = subrailRef.current;
    if (!el) return;
    const ZONE = 70;
    const MAX_SPEED = 7;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < ZONE) hoverDirRef.current = -((ZONE - x) / ZONE);
      else if (x > rect.width - ZONE) hoverDirRef.current = (x - (rect.width - ZONE)) / ZONE;
      else hoverDirRef.current = 0;
    };
    const onLeave = () => { hoverDirRef.current = 0; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    let raf;
    const tick = () => {
      const node = subrailRef.current;
      if (node && hoverDirRef.current !== 0) {
        node.scrollLeft = Math.max(0, Math.min(node.scrollWidth - node.clientWidth, node.scrollLeft + hoverDirRef.current * MAX_SPEED));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [cur]);

  // Measured once, on first mount, and never again — the arrows/label/progress
  // line lock to that position permanently instead of re-centring under the
  // pill (and shifting) every time the category changes.
  useLayoutEffect(() => {
    const el = pillRef.current;
    if (!el || pillCenter != null) return;
    const r = el.getBoundingClientRect();
    setPillCenter(r.left + r.width / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const c = CATS[cur];
  // A design can have several photos of the same piece (Gallery.jsx "slides") —
  // show every one as its own thumb, sharing the piece's name. Stable per
  // collection so thumbs don't jump around on every render.
  const pieces = useMemo(() => orderPieces(c), [c, orderPieces]);
  const expandNav = (dir) => goPiece((pieceIdx + dir + pieces.length) % pieces.length);
  const activePiece = pieces[pieceIdx] || pieces[0];
  // Real design count for this collection — excludes the synthetic "Up Close"
  // card appended to categories that have close-up shots. Falls back to the raw
  // piece count for the "Up Close" category itself.
  const designCount = c.pieces.filter((p) => !p._upclose).length || c.pieces.length;
  // Title breaks right before " & " if the label has one (e.g. "BON BONS" /
  // "& GENIE BOTTLES"), otherwise after the first word (e.g. "AUSTRALIAN" /
  // "NATIVES") — never wherever the container width happens to allow.
  const titleSpace = c.label.includes(" & ") ? c.label.indexOf(" & ") : c.label.indexOf(" ");
  const titleFirst = titleSpace === -1 ? c.label : c.label.slice(0, titleSpace);
  const titleRest = titleSpace === -1 ? "" : c.label.slice(titleSpace + 1);
  const pillLabel = pillStripThe ? c.label.toLowerCase().replace(/^the\s+/, "") : c.label.toLowerCase();

  const bgSlides = pieces.map((p, i) => (
    <div key={`${c.id}-${i}`} className={`fw-bg ${i === pieceIdx ? "on" : ""}`} style={{ backgroundImage: `url("${netlifyImg(p.img, { w: 1600, q: 80 })}")` }} />
  ));

  const menuEl = (
    <div className="fw-menu-wrap" ref={menuWrapRef}>
      <button className={`fw-menu-btn ${menuOpen ? "open" : ""}`} onClick={() => { setSearchOpen(false); setMenuOpen((v) => !v); }}>
        Collection Menu <ChevronDown size={12} />
      </button>
      {menuOpen && (
        <div className="fw-menu-panel">
          {CATS.map((cat, i) => (
            <button
              key={cat.id}
              className={`fw-menu-item ${i === cur ? "active" : ""}`}
              onClick={() => go(i)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fw-wrap">
      <style>{css}</style>
      {wrapImgSlot ? <div className="fw-imgslot">{bgSlides}</div> : bgSlides}

      <header className="fw-top">
        <a className="fw-logo" href="/" title="Back to ROGETjames home">ROGET<i>james</i></a>
        {catalogue.type === "modal" ? (
          <button className="fw-catalogue-link" onClick={() => setCatOpen(true)}>
            {catalogue.label}
          </button>
        ) : (
          <a className="fw-catalogue-link" href={catalogue.href} target="_blank" rel="noopener noreferrer">
            {catalogue.label}
          </a>
        )}
        {showSearch || showMobileMenu || showExit ? (
          <div className="fw-top-actions">
            {showSearch && (
              <div className="fw-search-wrap" ref={searchWrapRef}>
                <button
                  className={`fw-icon-btn ${searchOpen ? "open" : ""}`}
                  aria-label="Search designs"
                  aria-expanded={searchOpen}
                  onClick={() => { setMenuOpen(false); setMobileMenuOpen(false); setSearchOpen((v) => !v); }}
                >
                  <Search size={15} />
                </button>
                {searchOpen && (
                  <div className="fw-search-panel">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search designs…"
                      className="fw-search-input"
                    />
                    {searchQuery.trim() && (
                      <div className="fw-search-results">
                        {searchResults.length === 0 && <div className="fw-search-empty">No matches</div>}
                        {searchResults.map((r) => (
                          <button
                            key={`${r.catIdx}-${r.flatIdx}-${r.name}`}
                            className="fw-search-result"
                            onClick={() => jumpToPiece(r.catIdx, r.flatIdx)}
                          >
                            <img src={netlifyImg(r.img, { w: 120, q: 72 })} alt="" />
                            <span>
                              <span className="fw-search-result-name">{r.name}</span>
                              <span className="fw-search-result-cat">{r.catLabel}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="fw-top-right">{menuEl}</div>
            {showMobileMenu && (
              <button
                className="fw-icon-btn fw-hamburger"
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => { setSearchOpen(false); setMobileMenuOpen((v) => !v); }}
              >
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  {mobileMenuOpen
                    ? <><line x1="4" y1="4" x2="18" y2="18" /><line x1="18" y1="4" x2="4" y2="18" /></>
                    : <><line x1="3" y1="7" x2="19" y2="7" /><line x1="3" y1="11" x2="19" y2="11" /><line x1="3" y1="15" x2="19" y2="15" /></>
                  }
                </svg>
              </button>
            )}
            {showExit && (
              <a className={exitClassName} href="/" aria-label="Close gallery — back to main site" title="Back to ROGETjames">
                <X size={17} />
              </a>
            )}
          </div>
        ) : (
          <div className="fw-top-right">{menuEl}</div>
        )}
      </header>

      {showMobileMenu && mobileMenuOpen && (
        <div className="fw-mobile-menu" onClick={() => setMobileMenuOpen(false)}>
          <button className="fw-mobile-menu-close" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
            <X size={18} />
          </button>
          <div className="fw-mobile-menu-list" onClick={(e) => e.stopPropagation()}>
            {catalogue.type === "modal" && (
              <>
                <button
                  className="fw-mobile-menu-item"
                  onClick={() => { setMobileMenuOpen(false); setCatOpen(true); }}
                >
                  {catalogue.label}
                </button>
                <div className="fw-mobile-menu-divider" />
              </>
            )}
            {CATS.map((cat, i) => (
              <button
                key={cat.id}
                className={`fw-mobile-menu-item ${i === cur ? "active" : ""}`}
                onClick={() => go(i)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fw-lead" key={cur}>
        <div className="fw-kick fw-anim"><span className="bar" />{kicker}</div>
        {showCollectionCount && (
          <div className="fw-collection-count fw-anim">{c.label} — {designCount} Design{designCount !== 1 ? "s" : ""}</div>
        )}
        <h1 className="fw-title fw-anim d2">{titleFirst}{titleRest && <><br />{titleRest}</>}</h1>
        <div className="fw-piece fw-anim d2">On display — <b>{activePiece.name}</b></div>
        <div className="fw-cta fw-anim d3">
          {hasExpand ? (
            <button className="fw-pill" ref={pillRef} onClick={() => setExpanded(true)}>
              View the {pillLabel} collection
            </button>
          ) : (
            <div className="fw-pill" ref={pillRef}>
              View the {pillLabel} collection
            </div>
          )}
        </div>
      </div>

      <div className="fw-bottomrow">
        {showInfoPill && (
          <button className="fw-infopill" onClick={() => setExpanded(true)}>
            Design · Info · Prices
          </button>
        )}
        {pieces.length > 1 && (
          <div className="fw-subrail" ref={subrailRef} key={c.id}>
            {pieces.map((p, i) => (
              <div key={p.name + i} className={`fw-subcard ${i === pieceIdx ? "on" : ""} ${i === pieceFlash ? "flash" : ""}`}
                onClick={() => { if (i !== pieceIdx) goPiece(i); }}>
                <img src={netlifyImg(p.img, { w: 600, q: 78 })} alt={p.name} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fw-ctrls" style={pillCenter != null ? { left: `${pillCenter}px` } : undefined}>
        <div className="fw-ctrls-label">Collections</div>
        <div className="fw-arrows">
          <button className="fw-nav" aria-label="Previous" onClick={() => go(cur - 1)}>
            {navIcons ? <ArrowLeft size={20} strokeWidth={2} /> : "←"}
          </button>
          <button className="fw-nav" aria-label="Next" onClick={() => go(cur + 1)}>
            {navIcons ? <ArrowRight size={20} strokeWidth={2} /> : "→"}
          </button>
        </div>
        <div className="fw-prog"><i style={{ width: `${((cur + 1) / CATS.length) * 100}%` }} /></div>
        <div className="fw-count">{String(cur + 1).padStart(2, "0")} / {String(CATS.length).padStart(2, "0")}</div>
      </div>

      {hasExpand && expanded && (
        <div className="fw-expand-overlay" onClick={() => setExpanded(false)}>
          {pieces.length > 1 && (
            <button
              className="fw-expand-nav prev"
              onClick={(e) => { e.stopPropagation(); expandNav(-1); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          {showExpandProgress ? (
            <div className="fw-expand-stack" onClick={(e) => e.stopPropagation()}>
              <div className="fw-expand-imgwrap">
                <img src={netlifyImg(activePiece.img, { w: 1600, q: 80 })} alt={activePiece.name} className="fw-expand-img" />
                {!activePiece._upclose && DetailCard && (
                  <button
                    className="fw-expand-details"
                    onClick={() => { setExpanded(false); setDetailItem(activePiece); }}
                  >
                    Info · Prices
                  </button>
                )}
              </div>
              {pieces.length > 1 && (
                <div className="fw-expand-progress">
                  <div className="fw-expand-progress-text">{c.label} — {pieceIdx + 1} of {pieces.length}</div>
                  <div className="fw-prog" style={{ width: 160 }}>
                    <i style={{ width: `${((pieceIdx + 1) / pieces.length) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="fw-expand-imgwrap" onClick={(e) => e.stopPropagation()}>
              <img src={netlifyImg(activePiece.img, { w: 1600, q: 80 })} alt={activePiece.name} className="fw-expand-img" />
              {!activePiece._upclose && DetailCard && (
                <button
                  className="fw-expand-details"
                  onClick={() => { setExpanded(false); setDetailItem(activePiece); }}
                >
                  Info · Prices
                </button>
              )}
            </div>
          )}
          {pieces.length > 1 && (
            <button
              className="fw-expand-nav next"
              onClick={(e) => { e.stopPropagation(); expandNav(1); }}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          )}
          <button
            className="fw-expand-close"
            onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
            aria-label="Close expanded view"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {DetailCard && detailItem && (
        <DetailCard
          item={detailItem}
          seriesLabel={c.label}
          onClose={() => setDetailItem(null)}
          postcodeInfo={postcodeInfo}
          onSetPostcode={handleSetPostcode}
        />
      )}

      {catalogue.type === "modal" && catOpen && CatPageViewer && (
        <CatPageViewer pages={catalogue.pages} label={catalogue.label} onClose={() => setCatOpen(false)} />
      )}

      {QuoteBar && <QuoteBar />}
    </div>
  );
}
