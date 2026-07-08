import { netlifyImg } from "../utils/img";

// ─────────────────────────────────────────────────────────────
//  Reusable city / location page.
//  One component, one data object per city — pass a `city` prop.
//  Melbourne is the first; Perth and Gold Coast reuse this shell.
//
//  IMPORTANT (SEO): every city MUST carry genuinely distinct copy,
//  real projects and real suburbs. Same paragraph with the city name
//  swapped = Google "doorway page" penalty. The placeholder copy below
//  is written as a template for James to replace with real Melbourne
//  detail — it is not final wording.
// ─────────────────────────────────────────────────────────────

export default function CityPage({ city }) {
  const {
    name,          // "Melbourne"
    region,        // "VIC"
    heading,
    intro,
    hero,
    projects = [],
    suburbs = [],
    services = [],
  } = city;

  return (
    <div className="min-h-screen bg-matt-black text-cream font-body">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        <img
          src={netlifyImg(hero, { w: 2000, q: 78 })}
          alt={`ROGETjames laser cut work in ${name}`}
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-matt-black" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24 max-w-5xl">
          <p className="font-detail text-[11px] uppercase tracking-[0.35em] text-clay mb-5">
            {name}, {region} · Australia-wide studio
          </p>
          <h1 className="font-drama text-4xl leading-[1.05] md:text-6xl md:leading-[1.03] text-cream max-w-3xl">
            {heading}
          </h1>
        </div>
      </header>

      {/* ── Intro ────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-16 md:py-24 max-w-3xl">
        {intro.map((para, i) => (
          <p
            key={i}
            className={`font-body text-cream/80 leading-relaxed ${i === 0 ? "text-lg md:text-xl text-cream" : "text-base md:text-lg mt-6"}`}
          >
            {para}
          </p>
        ))}
      </section>

      {/* ── Projects ─────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="px-6 pb-8 md:px-16">
          <h2 className="font-detail text-[11px] uppercase tracking-[0.3em] text-clay mb-8">
            Selected work in {name}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <figure key={i} className="group overflow-hidden rounded-xl bg-graphite">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={netlifyImg(p.src, { w: 900, q: 76 })}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <figcaption className="px-4 py-4">
                  <p className="font-heading text-sm text-cream">{p.title}</p>
                  {p.detail && (
                    <p className="font-detail text-xs text-cream/50 mt-1">{p.detail}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── Services ─────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="px-6 py-16 md:px-16 md:py-24 max-w-4xl">
          <h2 className="font-detail text-[11px] uppercase tracking-[0.3em] text-clay mb-6">
            What we make for {name} spaces
          </h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {services.map((s, i) => (
              <li key={i} className="font-drama text-2xl md:text-3xl text-cream/85">
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Suburbs served ───────────────────────────────── */}
      {suburbs.length > 0 && (
        <section className="px-6 pb-16 md:px-16 md:pb-24 max-w-4xl">
          <h2 className="font-detail text-[11px] uppercase tracking-[0.3em] text-clay mb-5">
            {name} & surrounds
          </h2>
          <p className="font-body text-cream/60 leading-relaxed">
            {suburbs.join(" · ")}
          </p>
        </section>
      )}

      {/* ── CTA back to the studio ───────────────────────── */}
      <section className="border-t border-cream/[0.08] px-6 py-20 md:px-16 md:py-28 text-center">
        <p className="font-drama text-3xl md:text-5xl text-cream mb-8 max-w-2xl mx-auto leading-tight">
          Planning a piece for a {name} home or project?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://rogetjames.com/#contact"
            className="font-detail text-xs uppercase tracking-[0.2em] text-matt-black bg-cream rounded-full px-8 py-4 hover:bg-clay hover:text-cream transition-colors duration-300"
          >
            Start a conversation
          </a>
          <a
            href="https://rogetjames.com/"
            className="font-detail text-xs uppercase tracking-[0.2em] text-cream/70 border border-cream/20 rounded-full px-8 py-4 hover:border-clay hover:text-cream transition-colors duration-300"
          >
            See the full collection
          </a>
        </div>
      </section>

      {/* ── Footer / identity ────────────────────────────── */}
      <footer className="border-t border-cream/[0.08] px-6 py-12 md:px-16">
        <p className="font-heading text-sm text-cream tracking-wide">ROGETjames</p>
        <p className="font-detail text-xs text-cream/50 mt-2">
          Bespoke laser cut wall art, sculpture & architectural features · James Roget · Est. 2008
        </p>
        <p className="font-detail text-xs text-cream/50 mt-3">
          <a href="tel:+61488878073" className="hover:text-clay">+61 488 878 073</a>
          {"  ·  "}
          <a href="mailto:james@rogetjames.com" className="hover:text-clay">james@rogetjames.com</a>
          {"  ·  "}
          <a href="https://rogetjames.com/" className="hover:text-clay">rogetjames.com</a>
        </p>
      </footer>
    </div>
  );
}
