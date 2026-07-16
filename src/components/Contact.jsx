import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, Instagram, Youtube, Upload, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ quoteItems = [], onRemoveQuoteItem, onQuoteSubmitted }) {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const MAX_FILES = 6;
  const MAX_FILE_MB = 15;
  // Netlify Functions cap a request body at ~6MB and base64 inflates bytes by
  // ~1.37x, so keep all images together well under that.
  const MAX_ATTACH_PAYLOAD = 5 * 1024 * 1024; // total base64 across all photos
  const MAX_RAW_FILE_BYTES = 4 * 1024 * 1024; // biggest ORIGINAL we'll send un-shrunk

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const tooBig = files.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    const incoming = files
      .filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024)
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setError(tooBig.length ? `${tooBig.length > 1 ? "Some images are" : "One image is"} over ${MAX_FILE_MB}MB and ${tooBig.length > 1 ? "were" : "was"} skipped.` : null);
    setUploadedFiles((prev) => [...prev, ...incoming].slice(0, MAX_FILES));
    e.target.value = "";
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Read any file as base64 (no data: prefix). This is the fallback so a photo
  // the browser can't shrink — most often an iPhone HEIC — is still sent whole
  // instead of being silently dropped.
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onerror = () => reject(new Error("read failed"));
      r.onload = () => resolve(String(r.result).split(",")[1] || "");
      r.readAsDataURL(file);
    });

  // Try to shrink a photo to a small JPEG in the browser. Resolves null (never
  // throws) when the browser can't decode it, so the caller falls back to the
  // original file rather than losing it. A blank/failed canvas (e.g. iOS's
  // memory limit on very large photos) also counts as a failure.
  const compressImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      const done = (val) => { URL.revokeObjectURL(url); resolve(val); };
      img.onload = () => {
        try {
          const maxDim = 1600;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL("image/jpeg", 0.75).split(",")[1] || "";
          done(base64.length > 1000 ? base64 : null);
        } catch { done(null); }
      };
      img.onerror = () => done(null);
      img.src = url;
    });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".contact-reveal").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setError(null);

    const formData = new FormData(formRef.current);
    setSending(true);
    setWarning(null);
    try {
      // Build one attachment per photo: shrunk if we can, otherwise the original
      // file so it is never silently dropped. Anything we genuinely can't fit is
      // recorded so both the visitor and James are told — never lost in silence.
      const attachments = [];
      const failedAttachments = [];
      let payloadBytes = 0;
      for (const f of uploadedFiles) {
        const compressed = await compressImage(f.file);
        let content = null;
        let filename = f.file.name;
        if (compressed) {
          content = compressed;
          filename = f.file.name.replace(/\.[^.]+$/, "") + ".jpg";
        } else if (f.file.size <= MAX_RAW_FILE_BYTES) {
          content = await fileToBase64(f.file).catch(() => null);
        }
        if (content && payloadBytes + content.length <= MAX_ATTACH_PAYLOAD) {
          attachments.push({ filename, content });
          payloadBytes += content.length;
        } else {
          failedAttachments.push(f.file.name);
        }
      }

      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        postcode: formData.get("postcode"),
        address: formData.get("address"),
        message: formData.get("message"),
        selections: formData.get("design_interest"),
        company: formData.get("company"), // honeypot — should always be empty
        attachments,
        failedAttachments,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      setWarning(
        failedAttachments.length
          ? `Your enquiry was sent, but ${failedAttachments.length === 1 ? "one photo" : `${failedAttachments.length} photos`} couldn't be attached (too large or an unsupported format). Please email ${failedAttachments.length === 1 ? "it" : "them"} to james@rogetjames.com so we don't miss it.`
          : null
      );

      gsap.to(formRef.current, {
        opacity: 0, scale: 0.96, y: -20, duration: 0.35, ease: "power2.in",
        onComplete: () => {
          setSubmitted(true);
          onQuoteSubmitted?.();
        },
      });
    } catch {
      setError("Something went wrong sending this — please try again, or email james@rogetjames.com directly.");
    } finally {
      setSending(false);
    }
  };

  // Animate success message in after state update, and make sure it's actually on screen
  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [submitted]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 md:py-32 bg-onyx"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20">
          {/* Left: Info */}
          <div>
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <span className="bespoke-ring-1 absolute w-20 h-20 rounded-full border border-white/30" />
              <span className="bespoke-ring-2 absolute w-20 h-20 rounded-full border border-white/20" />
              <span className="bespoke-ring-3 absolute w-20 h-20 rounded-full border border-white/12" />
              <img src="/images/roj-logo.png?v=2" alt="ROGETjames" className="relative z-10 w-full h-auto" width="3035" height="3035" style={{ opacity: 0.5, filter: "drop-shadow(0px 5px 0px rgba(0,0,0,0.55))" }} />
            </div>
            <span className="contact-reveal font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
              Get in Touch
            </span>
            <h2 className="contact-reveal font-syne font-bold text-2xl md:text-4xl lg:text-5xl text-cream/60 tracking-tight mt-3">
              Request a{" "}
              <span className="text-cream/60">Quote</span>
            </h2>
            <p className="contact-reveal text-warm-gray text-base md:text-lg max-w-md mt-4 leading-relaxed">
              Tell us about your project. Whether it's a single wall piece or a
              full architectural commission, we'd love to hear from you.
            </p>

            <div className="contact-reveal mt-10 space-y-5">
              <a
                href="mailto:james@rogetjames.com"
                className="lift-hover flex items-center gap-4 text-cream group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                  <Mail size={16} className="text-clay" />
                </div>
                <div>
                  <p className="font-medium text-sm text-clay">james@rogetjames.com</p>
                  <p className="text-warm-gray text-xs">Primary email</p>
                </div>
              </a>

              <a
                href="tel:+61488878073"
                className="lift-hover flex items-center gap-4 text-cream group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                  <Phone size={16} className="text-clay" />
                </div>
                <div>
                  <p className="font-medium text-sm text-clay">+61 488 878 073</p>
                  <p className="text-warm-gray text-xs">Mobile</p>
                </div>
              </a>

              <div className="flex items-center gap-4 text-cream">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin size={16} className="text-clay" />
                </div>
                <div>
                  <p className="font-medium text-sm text-clay">
                    Perth · Gold Coast · Melbourne
                  </p>
                  <p className="text-warm-gray text-xs">
                    Australia-wide delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form / Success */}
          <div className="contact-reveal">
            {submitted ? (
              <div
                ref={successRef}
                className="bg-white/5 rounded-[2rem] p-10 border border-white/10 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-clay" />
                </div>
                <h3 className="font-heading font-bold text-xl text-cream mb-2">
                  Thank you for your enquiry
                </h3>
                <p className="text-warm-gray text-sm">
                  We shall endeavour to get back to you shortly.
                </p>
                {warning && (
                  <p className="mt-4 text-xs text-amber-300/90 font-detail leading-relaxed">
                    {warning}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setUploadedFiles([]); setError(null); setWarning(null); }}
                  className="mt-6 font-detail text-xs text-clay uppercase tracking-[0.2em] underline underline-offset-4 hover:text-cream transition-colors"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-white/5 rounded-[2rem] p-5 md:p-8 lg:p-10 border border-white/10 space-y-5"
              >
                {/* Honeypot — invisible to people; bots fill it and get silently dropped */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0 pointer-events-none"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-cream text-sm font-body placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay/30 hover:bg-black focus:bg-black transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-cream text-sm font-body placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay/30 hover:bg-black focus:bg-black transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    required
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    autoComplete="postal-code"
                    title="Enter a 4-digit Australian postcode"
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-cream text-sm font-body placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay/30 hover:bg-black focus:bg-black transition-all"
                    placeholder="1234"
                  />
                </div>

                {/* Selected works from gallery */}
                <div>
                  <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                    Design Interest{quoteItems.length > 0 && ` (${quoteItems.length} selected)`}
                  </label>

                  {quoteItems.length === 0 ? (
                    <div className="w-full px-4 py-4 rounded-xl bg-white/5 border border-dashed border-white/15 text-center">
                      <p className="text-cream/70 text-sm font-detail leading-relaxed">Browse the <a href="#collection" className="text-clay underline underline-offset-2">Collection</a> for catalogue designs — click <span className="text-clay italic">Details</span> on any piece to add it here. Or describe your interests in the message box below.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {quoteItems.map((qi) => (
                        <div key={qi.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <img src={qi.img} alt={qi.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-cream text-sm truncate">{qi.name}</p>
                            <p className="font-detail text-xs text-warm-gray mt-0.5">
                              {qi.size?.dims} · {qi.material?.label}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveQuoteItem?.(qi.id)}
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-warm-gray hover:text-cream hover:bg-white/10 transition-colors"
                            aria-label="Remove"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hidden field carries selections into the form submission */}
                  <input
                    type="hidden"
                    name="design_interest"
                    value={quoteItems.map((qi) => `${qi.name} — ${qi.size?.dims}, ${qi.material?.label}`).join(" | ")}
                  />
                </div>

                <div>
                  <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                    Reference Images{uploadedFiles.length > 0 && ` (${uploadedFiles.length}/${MAX_FILES})`}
                  </label>

                  {/* Uploaded previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden border border-moss/20 bg-cream-dark aspect-square">
                          <img src={f.url} alt={f.file.name} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-charcoal/70 flex items-center justify-center text-cream/80 hover:text-cream hover:bg-charcoal transition-colors"
                            aria-label="Remove"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add more button — hidden once at max */}
                  {uploadedFiles.length < MAX_FILES && (
                    <label className="w-full flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl bg-white/5 border border-dashed border-white/15 text-warm-gray text-sm cursor-pointer hover:border-clay/40 hover:bg-clay/5 transition-all">
                      <Upload size={18} className="text-warm-gray/60" />
                      <span className="font-detail text-xs uppercase tracking-wider">
                        {uploadedFiles.length === 0 ? "Upload photos" : "Add another"}
                      </span>
                      <span className="text-sm text-cream/70">Up to {MAX_FILES} images, max {MAX_FILE_MB}MB each — your space, a sketch, or inspiration</span>
                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                {/* Address + phone — only required when a file is uploaded */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-4 p-4 rounded-xl border border-clay/20 bg-clay/5">
                    <p className="font-detail text-[10px] text-moss uppercase tracking-wider">Required for this service</p>
                    <div>
                      <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                        Full Address *
                      </label>
                      <input
                        type="text"
                        required={uploadedFiles.length > 0}
                        name="address"
                        className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-cream text-sm font-body placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay/30 hover:bg-black focus:bg-black transition-all"
                        placeholder="Street, suburb, state, postcode"
                      />
                    </div>
                    <div>
                      <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required={uploadedFiles.length > 0}
                        name="phone"
                        inputMode="tel"
                        autoComplete="tel"
                        className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-cream text-sm font-body placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay/30 hover:bg-black focus:bg-black transition-all"
                        placeholder="+61 400 000 000"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-detail text-xs text-warm-gray uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-cream text-sm font-body placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay/30 transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-detail">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-magnetic w-full py-4 rounded-xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide disabled:opacity-60"
                >
                  <span className="btn-bg bg-clay-dark rounded-xl" />
                  <span className="relative z-10">{sending ? "Sending…" : "Send Enquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Instagram — centered at the bottom of the section */}
        <div className="contact-reveal flex justify-center mt-16">
          <a
            href="https://instagram.com/rogetjames/"
            target="_blank"
            rel="noopener noreferrer"
            className="lift-hover w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={22} className="text-clay" />
          </a>
        </div>
      </div>
    </section>
  );
}
