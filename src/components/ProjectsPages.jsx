import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { netlifyImg } from "../utils/img";
import { projectKey } from "../mediaDestinations";
import { useUploadsByKey } from "../utils/mediaUploads";
import { PROJECTS, projectBySlug } from "../data/projectsData";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
//  /projects — the Projects section as its own pages.
//
//   /projects              the summary page: every project as a card
//   /projects?p=<slug>     one project, as a case study
//
//  Design tokens are the site's own (matt-black / cream / clay, Syne
//  headings, Jost detail type) so these read as the same website.
//  PRIVATE while it is built — the gate lives in src/projects.jsx.
// ─────────────────────────────────────────────────────────────

const SHADOW = { textShadow: "0 4px 14px rgba(0,0,0,0.55)" };

function Wordmark({ className = "" }) {
  return (
    <a href="/" className={`font-heading font-bold text-cream ${className}`}>
      ROGET<span className="font-normal italic font-drama">james</span>
    </a>
  );
}

function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-matt-black/85 to-transparent backdrop-blur-[6px]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        <Wordmark className="text-lg md:text-xl" />
        <nav className="flex items-center gap-6 md:gap-9 font-detail text-[11px] uppercase tracking-[0.22em] text-cream/70">
          <a href="/#collection" className="hover:text-cream transition-colors hidden sm:inline">Collection</a>
          <a href="/projects" className="hover:text-cream transition-colors">Projects</a>
          <a href="/#contact" className="hover:text-clay transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function Eyebrow({ children }) {
  return <span className="font-detail text-[11px] text-cream/55 uppercase tracking-[0.25em]">{children}</span>;
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-syne font-bold text-2xl md:text-4xl text-cream/60 tracking-tight mt-3" style={SHADOW}>
      {children}
    </h2>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal rounded-t-[3rem] md:rounded-t-[4rem] pt-16 pb-10 mt-10 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <Eyebrow>Commission</Eyebrow>
        <SectionTitle>Start a project</SectionTitle>
        <p className="font-body text-cream/60 leading-relaxed mt-5 max-w-lg mx-auto">
          Architectural art features, sculpture and screens designed, made and installed as one commission.
        </p>
        <a
          href="/#contact"
          className="inline-block mt-8 border border-clay/70 text-clay-light rounded-full px-8 py-3.5 font-detail text-[11px] uppercase tracking-[0.24em] hover:bg-clay/10 transition-colors"
        >
          Request a Quote
        </a>
      </div>
    </footer>
  );
}

// Photos James uploads to a project at /media are appended to the END of that
// project's gallery — newest last, the same rule as everywhere else.
function useProjectImages(project) {
  const keys = useMemo(
    () => (project ? [projectKey(project.projectCategory)] : []),
    [project]
  );
  const uploads = useUploadsByKey(keys);
  return useMemo(() => {
    if (!project) return [];
    const extra = uploads[projectKey(project.projectCategory)] || [];
    return [...project.images, ...extra.map((u) => ({ name: u.name || "", img: u.img }))];
  }, [project, uploads]);
}

// ── The summary page ──────────────────────────────────────────
export function ProjectsIndex() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".pj-in", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, delay: 0.2, stagger: 0.1, ease: "power2.out" });
      gsap.utils.toArray(".pj-card").forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-matt-black text-cream font-body">
      <Header />

      {/* Opening panel */}
      <section className="pt-32 md:pt-44 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="pj-in inline-flex items-center gap-2.5 font-detail text-[11px] uppercase tracking-[0.28em] text-clay-light" style={{ opacity: 0 }}>
            <i className="w-[7px] h-[7px] bg-clay not-italic" /> Projects
          </span>
          <h1 className="pj-in font-syne font-bold tracking-tight leading-[0.95] text-cream/95 text-[46px] md:text-[76px] lg:text-[92px] mt-4" style={{ ...SHADOW, opacity: 0 }}>
            Projects
          </h1>
          <p className="pj-in font-body text-cream/70 text-base md:text-lg leading-relaxed max-w-2xl mt-6" style={{ opacity: 0 }}>
            Commissions delivered end to end — landscape and public art, architectural features,
            sculpture, screens and gates. Designed, fabricated and installed by the studio.
          </p>
        </div>
      </section>

      <div className="w-full h-px bg-white/10" />

      {/* Project cards */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 md:gap-8 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <a
              key={p.slug}
              href={`/projects?p=${p.slug}`}
              className={`pj-card group block relative overflow-hidden rounded-3xl bg-pewter ${i === 0 ? "md:col-span-2" : ""}`}
              style={{ opacity: 0 }}
            >
              <div className={`${i === 0 ? "aspect-[16/7]" : "aspect-[4/3]"} w-full overflow-hidden`}>
                <img
                  src={netlifyImg(p.hero, { w: 1400, q: 82 })}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute left-0 right-0 bottom-0 p-6 md:p-8">
                <span className="font-detail text-[10px] uppercase tracking-[0.22em] text-cream/60">{p.location}</span>
                <h2 className="font-syne font-bold text-xl md:text-3xl text-cream tracking-tight mt-2" style={SHADOW}>{p.name}</h2>
                <span className="inline-flex items-center gap-2 font-detail text-[10px] uppercase tracking-[0.22em] text-clay-light mt-3">
                  View project <i className="not-italic">→</i>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── One project, as a case study ──────────────────────────────
export function ProjectCasePage({ slug }) {
  const project = projectBySlug(slug);
  const images = useProjectImages(project);
  const rootRef = useRef(null);

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? PROJECTS[idx - 1] : PROJECTS[PROJECTS.length - 1];
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : PROJECTS[0];

  useEffect(() => {
    if (!project) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pj-h", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 0.25, stagger: 0.12, ease: "power2.out" });
      gsap.utils.toArray(".pj-reveal").forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-matt-black text-cream font-body grid place-items-center px-6 text-center">
        <div>
          <p className="font-syne font-bold text-2xl text-cream/70">Project not found</p>
          <a href="/projects" className="inline-block mt-6 font-detail text-[11px] uppercase tracking-[0.24em] text-clay-light">← All projects</a>
        </div>
      </div>
    );
  }

  const specStrip = [
    ["Sector", project.sector],
    ["Material", project.material],
    ["Location", project.location],
    ["Scope", project.scope],
    ["Completed", project.completed],
  ].filter(([, v]) => v);

  const jump = [
    project.description && ["The Brief", "brief"],
    project.approach.length && ["Our Approach", "approach"],
    images.length && ["Gallery", "gallery"],
    project.specs.length && ["Specs", "specs"],
  ].filter(Boolean);

  return (
    <div ref={rootRef} className="min-h-screen bg-matt-black text-cream font-body">
      <Header />

      {/* Hero — full colour, full bleed */}
      <section className="relative h-[72vh] min-h-[500px] w-full overflow-hidden bg-charcoal flex items-end">
        <img
          src={netlifyImg(project.hero, { w: 2000, q: 84 })}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-matt-black pointer-events-none" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-14 md:pb-20">
          <span className="pj-h inline-flex items-center gap-2.5 font-detail text-[11px] uppercase tracking-[0.28em] text-clay-light" style={{ opacity: 0 }}>
            <i className="w-[7px] h-[7px] bg-clay not-italic" /> Project
          </span>
          <h1 className="pj-h font-syne font-bold tracking-tight leading-[0.95] text-cream/95 text-[40px] md:text-[68px] lg:text-[84px] mt-4" style={{ ...SHADOW, opacity: 0 }}>
            {project.name}
          </h1>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center gap-2.5 py-5 font-detail text-xs text-cream/45">
          <a href="/" className="hover:text-cream/80 transition-colors">Home</a> ›
          <a href="/projects" className="hover:text-cream/80 transition-colors">Projects</a> ›
          <span className="text-cream/85">{project.name}</span>
        </div>
      </div>
      <div className="w-full h-px bg-white/10" />

      {/* On this page */}
      {jump.length > 1 && (
        <div className="sticky top-0 z-40 bg-jet/95 backdrop-blur-[8px]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center gap-7 md:gap-9 overflow-x-auto font-detail text-[11px] uppercase tracking-[0.2em] text-cream/50">
            <span className="text-cream/35 whitespace-nowrap">On this page</span>
            {jump.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="flex items-center gap-3 whitespace-nowrap hover:text-cream transition-colors">
                <i className="block w-[18px] h-px bg-white/20 not-italic" />{label}
              </a>
            ))}
          </div>
          <div className="w-full h-px bg-white/10" />
        </div>
      )}

      {/* Spec strip */}
      {specStrip.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <dl className="grid grid-cols-2 md:grid-cols-5 gap-y-7 gap-x-5 py-12 md:py-14">
              {specStrip.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-detail text-[11px] uppercase tracking-[0.2em] text-warm-gray mb-2">{k}</dt>
                  <dd className="font-heading font-medium text-[15px] md:text-base text-cream">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="w-full h-px bg-white/10" />
        </>
      )}

      {/* The Brief */}
      {project.description && (
        <>
          <section id="brief" className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <Eyebrow>01 — The Brief</Eyebrow>
              <SectionTitle>The Brief</SectionTitle>
              <p className="font-body text-base md:text-lg leading-[1.75] text-cream/75 max-w-3xl mt-7">
                {project.description}
              </p>
            </div>
          </section>
          <div className="w-full h-px bg-white/10" />
        </>
      )}

      {/* Our Approach */}
      {project.approach.length > 0 && (
        <>
          <section id="approach" className="bg-jet py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-10 md:grid-cols-2 md:gap-16 items-start">
              <div>
                <Eyebrow>02 — Our Approach</Eyebrow>
                <SectionTitle>Our Approach</SectionTitle>
                {project.approachIntro && (
                  <p className="font-body text-base md:text-lg leading-[1.75] text-cream/75 mt-7">{project.approachIntro}</p>
                )}
              </div>
              <ol className="flex flex-col gap-7">
                {project.approach.map((s, i) => (
                  <li key={s.title} className="pj-reveal flex gap-5" style={{ opacity: 0 }}>
                    <span className="font-detail text-[11px] tracking-[0.2em] text-clay pt-1 min-w-[28px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading font-semibold text-cream text-base">{s.title}</h3>
                      <p className="font-body text-[15px] leading-relaxed text-cream/60 mt-1.5">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <div className="w-full h-px bg-white/10" />
        </>
      )}

      {/* Gallery */}
      {images.length > 0 && (
        <>
          <section id="gallery" className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <Eyebrow>03 — Gallery</Eyebrow>
              <SectionTitle>Gallery</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-5 mt-9">
                {images.map((im, i) => (
                  <figure
                    key={`${im.img}-${i}`}
                    className={`pj-reveal group relative overflow-hidden rounded-2xl bg-pewter ${i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
                    style={{ opacity: 0 }}
                  >
                    <img
                      src={netlifyImg(im.img, { w: i === 0 ? 1400 : 800, q: 82 })}
                      alt={im.name || project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {im.name && (
                      <figcaption className="absolute inset-x-0 bottom-0 p-4 font-detail text-[10px] uppercase tracking-[0.18em] text-cream bg-gradient-to-t from-black/75 to-transparent">
                        {im.name}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
          <div className="w-full h-px bg-white/10" />
        </>
      )}

      {/* Specs */}
      {project.specs.length > 0 && (
        <section id="specs" className="bg-jet py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Eyebrow>04 — Specs</Eyebrow>
            <SectionTitle>Specifications</SectionTitle>
            <table className="w-full max-w-4xl mt-9">
              <tbody>
                {project.specs.map(([k, v]) => (
                  <tr key={k} className="border-b border-white/8">
                    <td className="py-4 pr-6 align-top w-[150px] md:w-[220px] font-detail text-[11px] uppercase tracking-[0.2em] text-warm-gray">{k}</td>
                    <td className="py-4 font-body text-[15px] text-cream/85">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Previous / next */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="w-full h-px bg-white/10" />
        <div className="flex justify-between gap-6 py-8 font-detail text-[11px] uppercase tracking-[0.2em] text-cream/50">
          <a href={`/projects?p=${prev.slug}`} className="group">
            Previous
            <b className="block font-syne text-lg md:text-xl tracking-tight normal-case text-cream mt-2 group-hover:text-clay-light transition-colors">{prev.name}</b>
          </a>
          <a href={`/projects?p=${next.slug}`} className="group text-right">
            Next project
            <b className="block font-syne text-lg md:text-xl tracking-tight normal-case text-cream mt-2 group-hover:text-clay-light transition-colors">{next.name}</b>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
