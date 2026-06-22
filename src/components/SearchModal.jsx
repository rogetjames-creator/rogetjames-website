import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

const CDN = "https://cdn.myportfolio.com/b2648aa0-9d7e-45a7-9f99-54d55b4ec92e";

// All searchable works and series across the site
const SEARCH_INDEX = [
  // ── Wall Art series ──────────────────────────────────────────────────
  { name: "Branches Series",     category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/3b37ba78-d6be-452a-93cf-9e0115683646_rw_1200.jpg?h=6a7c951a88c594cc78aed17d6649e87e` },
  { name: "GREN Edge",           category: "Branches Series", section: "#collection", tab: "wall-art", img: `${CDN}/3b37ba78-d6be-452a-93cf-9e0115683646_rw_1200.jpg?h=6a7c951a88c594cc78aed17d6649e87e` },
  { name: "GREN Tao",            category: "Branches Series", section: "#collection", tab: "wall-art", img: `${CDN}/b679b0f6-6fb9-4433-bcfa-c6cf516bb335_rw_1200.jpg?h=ac294373b0c47ecaf4d7794cf0c6d4f0` },
  { name: "WANDOO",              category: "Branches Series", section: "#collection", tab: "wall-art", img: `${CDN}/f49956aa-85f0-43d0-b11a-d5ced1b09477_rw_1200.jpg?h=ecaf542e2b494495eececee1b2defae5` },
  { name: "KYRA LEAF",           category: "Branches Series", section: "#collection", tab: "wall-art", img: `${CDN}/5ba61f7c-c0d7-4036-93d5-d85abdbbb7c6_rw_1200.jpg?h=57e46a88f708de0ed6a2c1436189e0b0` },
  { name: "AUTUMN LEAF",         category: "Branches Series", section: "#collection", tab: "wall-art", img: `${CDN}/fbb008fe-128a-4516-b4e2-0e3b6dc81de3_rw_1920.jpg?h=48be669e9e825fb94c959e72f6ec189a` },
  { name: "VILLA LEAF",          category: "Branches Series", section: "#collection", tab: "wall-art", img: "/images/villa-leaf/villa-leaf-trio-pool.jpg", slides: ["/images/villa-leaf/villa-leaf-trio-pool.jpg", "/images/villa-leaf/villa-leaf-rust.jpg", "/images/villa-leaf/villa-leaf-trio.jpg", "/images/villa-leaf/villa-leaf-black.jpg"] },
  { name: "VASUKI",              category: "IKONA Series",    section: "#collection", tab: "wall-art", img: "/images/vasuki/vasuki-sabi.jpg", slides: ["/images/vasuki/vasuki-sabi.jpg"] },

  { name: "Banksia Collection",  category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/ddd2cb0a-f1e2-4796-b7ce-93ba2c113995_rw_1200.jpg?h=e6fdfdc8437f85411df51b3e1c9acbaa` },
  { name: "BANKSIA",             category: "Banksia Collection", section: "#collection", tab: "wall-art", img: `${CDN}/ddd2cb0a-f1e2-4796-b7ce-93ba2c113995_rw_1200.jpg?h=e6fdfdc8437f85411df51b3e1c9acbaa` },
  { name: "BANKSIA Frame",       category: "Banksia Collection", section: "#collection", tab: "wall-art", img: `${CDN}/8d509a8f-6206-4838-a54c-9a167012b227_rw_1200.jpg?h=26ba245fd08138ec3a2f60935b4b6257` },
  { name: "RUE the 3rd",         category: "Banksia Collection", section: "#collection", tab: "wall-art", img: `${CDN}/de02fd70-518b-4e8a-8f6e-2ae6f3199eab_rw_1200.jpg?h=004b4dbab40455c6a393d4c4fd42deb6` },
  { name: "UBUD Round",          category: "Banksia Collection", section: "#collection", tab: "wall-art", img: `${CDN}/7c2957b7-54ab-48f9-91dc-7652d83c8f88_rw_1200.jpg?h=ac9bd923e016bf4abfc7301e6eb757be` },
  { name: "DANDELIONS",          category: "Banksia Collection", section: "#collection", tab: "wall-art", img: `${CDN}/03980b30-48fd-48a3-8027-741f35a87421_rw_1200.jpg?h=7a91f55af427ba6c7ccfd3662ae07c49` },
  { name: "DIAMOND BLOOM",       category: "Banksia Collection", section: "#collection", tab: "wall-art", img: `${CDN}/5f33d76a-d731-4265-904f-87e0f5a7eb22_rw_1200.jpg?h=8481af935944e37eb97dc7a5914e00e7` },

  { name: "Creeping Fig Series", category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/1709be7d-5020-449f-beca-caf68e8903a9_rw_1920.jpg?h=1cdc050b707eed78b5492791ff7c1d84` },
  { name: "Creeping Fig I",      category: "Creeping Fig Series", section: "#collection", tab: "wall-art", img: `${CDN}/1709be7d-5020-449f-beca-caf68e8903a9_rw_1920.jpg?h=1cdc050b707eed78b5492791ff7c1d84` },
  { name: "Creeping Fig II",     category: "Creeping Fig Series", section: "#collection", tab: "wall-art", img: `${CDN}/1047e2b0-5aa9-4c92-bfb8-322d56b91cb2_rw_1920.jpg?h=94336cfd84b23352d98913f217ac9911` },
  { name: "Creeping Fig III",    category: "Creeping Fig Series", section: "#collection", tab: "wall-art", img: `${CDN}/326a3cac-efe8-4647-a0bd-562e4c59fe52_rw_1920.jpg?h=8a81778b2216c41a7dd388d6dba04886` },

  { name: "Plume Collection",    category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/cdd20f14-69b8-4224-ab94-80bc4a4b42bf_rw_1200.jpg?h=d07104c694bc11db6838dc4af5d78ebd` },
  { name: "PLUME DECO",          category: "Plume Collection", section: "#collection", tab: "wall-art", img: `${CDN}/cdd20f14-69b8-4224-ab94-80bc4a4b42bf_rw_1200.jpg?h=d07104c694bc11db6838dc4af5d78ebd` },
  { name: "FEATHER",             category: "Plume Collection", section: "#collection", tab: "wall-art", img: `${CDN}/2e22f513-6f01-4920-be6d-8a3864acfd79_rw_1200.jpg?h=11026b0b84f9372debcd75e452fa719b` },
  { name: "BIRDY NUM NUM",       category: "Plume Collection", section: "#collection", tab: "wall-art", img: `${CDN}/45fc5d4e-42da-4cb1-b1cb-3098330422b7_rw_1200.jpg?h=500457715866591d8660fa5c9e94ce5c` },
  { name: "FERLICI",             category: "Plume Collection", section: "#collection", tab: "wall-art", img: `${CDN}/c1605308-65ce-4cf1-bea1-1f2918bfd557_rw_1200.jpg?h=d518365b8784ca3180265615ced71718` },
  { name: "BAMBU",               category: "Plume Collection", section: "#collection", tab: "wall-art", img: `${CDN}/d6f37bad-bb06-48b1-b58c-2c215295a9ff_rw_1200.jpg?h=b1dae9f98382afe01e10a74c8ccfa7ee` },

  { name: "Blooms",              category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/03980b30-48fd-48a3-8027-741f35a87421_rw_1200.jpg?h=7a91f55af427ba6c7ccfd3662ae07c49` },
  { name: "Screens & Gates",     category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f` },
  { name: "ERGO",                category: "Screens & Gates", section: "#collection", tab: "wall-art", img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f` },
  { name: "GRAIL",               category: "Screens & Gates", section: "#collection", tab: "wall-art", img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
  { name: "FERLIE",              category: "Screens & Gates", section: "#collection", tab: "wall-art", img: `${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg?h=8ed539c980ba51543bf04a555b8b5e93` },
  { name: "LUCARIO",             category: "Screens & Gates", section: "#collection", tab: "wall-art", img: `${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg?h=040e8d1a3bc81a9e3a71209f6979b222` },
  { name: "LUMIER",              category: "Screens & Gates", section: "#collection", tab: "wall-art", img: `${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg?h=8fa0436374c48082a687a93785e8c28e` },
  { name: "XAVIER",              category: "Screens & Gates", section: "#collection", tab: "wall-art", img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg?h=e6346e68c6fdfb984159856228b18dc4` },

  { name: "Geometric Series",    category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg?h=9714e17c2c6817b7853e5c5b3572f750` },
  { name: "VUELTA",              category: "Geometric Series", section: "#collection", tab: "wall-art", img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg?h=9714e17c2c6817b7853e5c5b3572f750` },
  { name: "ASLYIAM",             category: "Geometric Series", section: "#collection", tab: "wall-art", img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg?h=df73cbda10ac29b35c6dc97ed20ff906` },
  { name: "WATTLE",              category: "Geometric Series", section: "#collection", tab: "wall-art", img: `${CDN}/4f9d07e7-a1ba-4215-b4ed-86dee879d606_rw_600.jpg?h=98b5087c0cadf4a5f192beb793d55296` },
  { name: "VAYA",                category: "Geometric Series", section: "#collection", tab: "wall-art", img: `${CDN}/2bcd6fe0-699f-4525-b006-5063523f80f3_rw_1200.jpg?h=4e39c5a0962b339fced048fdb6373d5f` },

  { name: "Cultural Patterns",   category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
  { name: "BENIN Inspired",      category: "Cultural Patterns", section: "#collection", tab: "wall-art", img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
  { name: "RAVI Inspired",       category: "Cultural Patterns", section: "#collection", tab: "wall-art", img: `${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6` },
  { name: "MARAKESH TRIO",       category: "Cultural Patterns", section: "#collection", tab: "wall-art", img: `${CDN}/7242a044-526d-49ad-92f3-b6a74d6b0198_rw_1200.jpg?h=aed4aadb71807616895e7453440680b6` },
  { name: "Unity in Diversity",  category: "Cultural Patterns", section: "#collection", tab: "wall-art", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a` },

  { name: "Fire & Light",        category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/b03ec13b-fba3-432f-9723-3f646b508054_rw_1920.jpg?h=418827879ce9e3c033d8eee6e975b2c4` },
  { name: "REEDS of UNGARO",     category: "Fire & Light", section: "#collection", tab: "wall-art", img: `${CDN}/b03ec13b-fba3-432f-9723-3f646b508054_rw_1920.jpg?h=418827879ce9e3c033d8eee6e975b2c4` },
  { name: "EQUISETTI",           category: "Fire & Light", section: "#collection", tab: "wall-art", img: `${CDN}/453b1942-6be0-4365-b111-0affe46a048e_rw_1920.jpg?h=968dc8dad1b2ec3603236a03c95526df` },
  { name: "URCHIN",              category: "Fire & Light", section: "#collection", tab: "wall-art", img: `${CDN}/4abdd8f3-44a5-4a24-b6cb-ccdb233b297e_rw_1920.jpeg?h=b6df39c4e5d452fcf8293dc8052d0399` },
  { name: "HOMEBASE Fire Pit",   category: "Fire & Light", section: "#collection", tab: "wall-art", img: `${CDN}/b4fe3827-e371-4bd2-9bb5-1c0b3def3095_rw_1920.jpg?h=84f3b1d6bc18639679e471b3b23f418d` },
  { name: "YAZAD Fire",          category: "Fire & Light", section: "#collection", tab: "wall-art", img: `${CDN}/a9ffceab-afdf-47d9-8ba1-53687b469ec4_rw_1200.jpg?h=9e83085238f9a77b3e2d2ed447431717` },
  { name: "TOTEMS",              category: "Fire & Light", section: "#collection", tab: "wall-art", img: `${CDN}/181230d9-006a-4785-b75b-2a7b4da421fe_rw_1920.jpeg?h=c7265c6c9ecff29746e6d5d5649b233e` },

  { name: "Sculpture",           category: "Wall Art", section: "#collection", tab: "wall-art", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
  { name: "ORIAN Totem",         category: "Sculpture", section: "#collection", tab: "wall-art", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
  { name: "DANDELIONS Totems",   category: "Sculpture", section: "#collection", tab: "wall-art", img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg?h=ba62f642a4afa2e84f7480801652c94e` },
  { name: "HOMEBASE",            category: "Sculpture", section: "#collection", tab: "wall-art", img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg?h=b0a0ebd2ca83e06d7b56e5fbee049be2` },
  { name: "HUE",                 category: "Sculpture", section: "#collection", tab: "wall-art", img: `${CDN}/7975db43-6e77-4a2d-8b33-6cdf7218ad48_rw_1920.jpg?h=263a833c03a447a8a37804176866e779` },
  { name: "Centennial Park",     category: "Sculpture", section: "#collection", tab: "wall-art", img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c` },
  { name: "Fiona Stanley",       category: "Sculpture", section: "#collection", tab: "wall-art", img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg?h=0542d30e647f6e1d326dee723044be1b` },

  // ── Other categories ─────────────────────────────────────────────────
  { name: "Sculpture Gallery",   category: "Collection", section: "#collection", tab: "sculpture", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
  { name: "Screens",             category: "Collection", section: "#collection", tab: "screens", img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f` },
  { name: "Fire & Light Gallery",category: "Collection", section: "#collection", tab: "fire-light", img: `${CDN}/b03ec13b-fba3-432f-9723-3f646b508054_rw_1920.jpg?h=418827879ce9e3c033d8eee6e975b2c4` },

  // ── Bespoke Commissions ───────────────────────────────────────────────
  { name: "Commercial Commissions",  category: "Bespoke", section: "#bespoke", tab: "commercial", img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f` },
  { name: "Hospitality & Retail",    category: "Commercial", section: "#bespoke", tab: "commercial", img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f` },
  { name: "Architectural Screens",   category: "Commercial", section: "#bespoke", tab: "commercial", img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
  { name: "Corporate Features",      category: "Commercial", section: "#bespoke", tab: "commercial", img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
  { name: "Public Art",              category: "Public", section: "#bespoke", tab: "public", img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c` },
  { name: "Sculptures & Totems",     category: "Public", section: "#bespoke", tab: "public", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
  { name: "Cultural Commissions",    category: "Public", section: "#bespoke", tab: "public", img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
  { name: "Feature Walls",           category: "Residential", section: "#bespoke", tab: "residential", img: `${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6` },
  { name: "Garden Sculptures",       category: "Residential", section: "#bespoke", tab: "residential", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
  { name: "Entry & Gates",           category: "Residential", section: "#bespoke", tab: "residential", img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f` },
  { name: "Interior Panels",         category: "Residential", section: "#bespoke", tab: "residential", img: `${CDN}/cdd20f14-69b8-4224-ab94-80bc4a4b42bf_rw_1200.jpg?h=d07104c694bc11db6838dc4af5d78ebd` },
];

function fuzzySearch(query, items) {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const item of items) {
    const name = item.name.toLowerCase();
    const cat = item.category.toLowerCase();
    let score = 0;
    if (name === q)              score = 100;
    else if (name.startsWith(q)) score = 88;
    else if (name.includes(q))   score = 75;
    else if (cat.includes(q))    score = 55;
    else {
      let qi = 0;
      for (let i = 0; i < name.length && qi < q.length; i++) {
        if (name[i] === q[qi]) qi++;
      }
      if (qi === q.length) score = 35;
      else {
        let shared = 0;
        for (const c of q) { if (name.includes(c)) shared++; }
        if (shared / q.length >= 0.75) score = 20;
      }
    }
    if (score > 0) {
      // Expand slides into individual results
      const images = item.slides || [item.img];
      images.forEach((img, idx) => {
        results.push({ ...item, img, score: score - idx * 0.1 });
      });
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 12);
}

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const results = fuzzySearch(query, SEARCH_INDEX);
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const lenis = useLenis();

  // Animate in/out — component stays mounted so lenis always gets restarted
  useEffect(() => {
    if (!overlayRef.current || !cardRef.current) return;
    if (open) {
      lenis?.stop();
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(cardRef.current, { y: -24, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" });
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // Immediately re-enable scroll + stop blocking clicks
      lenis?.start();
      gsap.set(overlayRef.current, { pointerEvents: "none" });
      gsap.to(cardRef.current, { y: -16, opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in" });
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => { gsap.set(overlayRef.current, { display: "none", pointerEvents: "auto" }); setQuery(""); },
      });
    }
  }, [open, lenis]);

  // Keyboard close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSelect = useCallback((item) => {
    lenis?.start(); // unlock scroll immediately, synchronously
    onClose();
    window.dispatchEvent(new CustomEvent("search-navigate", { detail: { tab: item.tab } }));
    setTimeout(() => {
      const el = document.querySelector(item.section);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 400);
  }, [onClose, lenis]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] items-start justify-center pt-[12vh] px-4"
      style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)", display: "none" }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="w-full max-w-xl bg-charcoal rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: "1px solid rgba(242,240,233,0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search size={18} className="text-warm-gray flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search works, series, materials…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-cream font-body text-base outline-none placeholder:text-warm-gray/50"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-warm-gray hover:text-cream transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim() && (
          <ul className="max-h-[55vh] overflow-y-auto" data-lenis-prevent>
            {results.length === 0 ? (
              <li className="px-5 py-8 text-center text-warm-gray font-body text-sm">
                No works found for <span className="text-cream italic">"{query}"</span>
              </li>
            ) : (
              results.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left group"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-cream font-heading font-medium text-sm truncate">{item.name}</p>
                      <p className="text-warm-gray font-detail text-xs uppercase tracking-wider mt-0.5">{item.category}</p>
                    </div>
                    <span className="ml-auto text-clay opacity-0 group-hover:opacity-100 transition-opacity text-xs font-detail flex-shrink-0">→</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        {/* Footer hint */}
        {!query.trim() && (
          <div className="px-5 py-4 flex gap-4 text-warm-gray/50 font-detail text-xs">
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
        )}
      </div>
    </div>
  );
}
