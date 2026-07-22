import { useState } from "react";
import { netlifyImg } from "../utils/img";

// ── Melbourne "browse every gallery" panels ───────────────────────────────
// Slim vertical rectangles, one per gallery. Hover expands a panel out to reveal
// its image; click goes to that gallery on the live site. Gallery name runs
// vertically (reading bottom→top), light grey, anchored bottom-LEFT so it stays
// left when a panel expands (never floats to the middle).
//
// FONT: names should be IVY MODE (squashed). Wall Art uses James's supplied
// IVY MODE outline directly (WALL_ART_MARK). The other names are set in Playfair
// (the site's didone) as a stand-in until the IVY MODE webfont is added, then
// they'll all switch to live IVY MODE text.
const NAME_GREY = "#c2c2c2";

// James's "WALL ART" outline (IVY MODE), cropped to its bounds. Vertical, reads
// bottom→top. fill:currentColor so the wrapper's colour drives it.
function WallArtMark({ className = "", style }) {
  return (
    <svg className={className} style={style} viewBox="7748.05 455.82 299.51 2151.42" fill="currentColor"
      xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wall Art">
      <path d="M7754.3,2140c40.67,21.65,76.25,37.76,124.73,59.92l166.18,74.01v2.01l-222.87,98.69,222.87,100.7v2.01l-290.91,129.9v-54.88l222.09-97.68-222.09-100.7v-2.01l222.09-98.18-99.71-44.31c-57.09-26.18-93.84-34.24-122.39-38.27v-31.22Z"/>
      <path d="M7945.51,1971.34v142.99c45.75,22.15,70.38,28.2,93.45,29.71v34.74c-39.1-24.17-75.46-43.3-124.73-69.48l-166.18-87.61v-2.01l290.91-152.56v55.89l-93.45,48.33ZM7938.47,1974.86l-130.6,67.97,109.09,56.9,21.5,11.08v-135.94Z"/>
      <path d="M8009.63,1645.58l29.33,9.57v175.22h-284.65v-51.36h277.62v-9.57c0-30.21-4.3-70.49-22.29-122.85v-1.01Z"/>
      <path d="M8009.63,1419.01l29.33,9.57v175.22h-284.65v-51.36h277.62v-9.57c0-30.21-4.3-70.49-22.29-122.85v-1.01Z"/>
      <path d="M7945.51,1129.5v142.99c45.75,22.15,70.38,28.2,93.45,29.71v34.74c-39.1-24.17-75.46-43.3-124.73-69.48l-166.18-87.61v-2.01l290.91-152.56v55.89l-93.45,48.34ZM7938.47,1133.03l-130.6,67.97,109.09,56.9,21.5,11.08v-135.94Z"/>
      <path d="M7997.9,725.2h49.66v3.02l-129.03,149.03c-6.26,7.05-8.21,12.08-8.21,26.18v33.73h128.64v51.36h-284.65v-90.13c0-96.67,23.46-148.53,71.95-148.53,40.27,0,61.39,40.28,74.29,88.11l97.36-112.78ZM7828.99,801.73c-41.45,0-68.43,32.22-68.43,98.68v36.76h141.15c1.56-11.58,2.35-36.25,2.35-46.32,0-54.88-34.41-89.12-75.07-89.12Z"/>
      <path d="M7782.06,455.83v1.01c-14.86,40.28-20.72,68.48-20.72,98.68v11.58h277.61v51.36h-277.61v12.08c0,30.21,5.87,58.41,20.72,98.68v1.01l-27.76-7.05v-260.81l27.76-6.55Z"/>
    </svg>
  );
}

const PANELS = [
  { name: "Wall Art",          mark: WallArtMark, img: "/images/cdn-gallery/3b37ba78-d6be-452a-93cf-9e0115683646_rw_1200.jpg", href: "https://rogetjames.com/wall-art" },
  { name: "Sculpture",         img: "/images/hero/hero-vasuki.jpg",                                          href: "https://rogetjames.com/sculpture" },
  { name: "Screens",           img: "/images/cdn-gallery/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg",  href: "https://rogetjames.com/?open=screens" },
  { name: "Bespoke Sculpture", img: "/images/cdn-gallery/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg",  href: "https://rogetjames.com/?open=sculpture" },
  { name: "Projects",          img: "/images/cdn-gallery/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg",  href: "https://rogetjames.com/?open=projects" },
  { name: "Commissions",       img: "/images/cdn-gallery/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg",  href: "https://rogetjames.com/?open=commissions" },
  { name: "Concepts",          img: "/images/cdn-gallery/cdd20f14-69b8-4224-ab94-80bc4a4b42bf_rw_1200.jpg",  href: "https://rogetjames.com/?open=concepts" },
  { name: "Concrete",          img: null,                                                                     href: "https://rogetjames.com/#bespoke" },
];

export default function MelbourneGalleryPanels() {
  const [hover, setHover] = useState(null);

  return (
    <section className="bg-jet pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex gap-1.5 md:gap-2 w-full h-[60vh] min-h-[380px] max-h-[660px]">
          {PANELS.map((p, i) => {
            const active = hover === i;
            const Mark = p.mark;
            return (
              <a
                key={p.name}
                href={p.href}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group relative overflow-hidden rounded-lg cursor-pointer block"
                style={{ flexGrow: active ? 5 : 1, flexBasis: 0, transition: "flex-grow 0.55s cubic-bezier(0.4,0,0.2,1)" }}
              >
                {p.img ? (
                  <img
                    src={netlifyImg(p.img, { w: 1000, q: 80 })}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-graphite to-onyx" />
                )}

                {/* Scrim — lifts on hover so the image reads through */}
                <div className={`absolute inset-0 transition-colors duration-500 ${active ? "bg-black/20" : "bg-black/55"}`} />

                {/* Gallery name — bottom-LEFT, vertical, light grey. Stays left on expand. */}
                <div className="absolute inset-0 flex items-end justify-start pb-6 pl-4 md:pl-5 pointer-events-none">
                  {Mark ? (
                    <Mark
                      className="w-auto"
                      style={{ color: NAME_GREY, height: active ? "42%" : "36%", transition: "height 0.4s ease", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
                    />
                  ) : (
                    <span
                      className="font-drama"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        color: NAME_GREY,
                        letterSpacing: "0.04em",
                        fontSize: active ? 30 : 22,
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        transition: "font-size 0.4s ease",
                        textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                      }}
                    >
                      {p.name}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
