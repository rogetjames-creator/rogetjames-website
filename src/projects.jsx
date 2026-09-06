import { createRoot } from "react-dom/client";
import { ProjectsIndex, ProjectCasePage } from "./components/ProjectsPages";
import { ownerPreviewUnlocked } from "./utils/ownerPreview";
import "./index.css";

// ── /projects ─────────────────────────────────────────────────
// The Projects section as real pages: a summary page, and one case-study
// page per project (/projects?p=homebase).
//
// PRIVATE while it is being built. Nobody sees it but James — open it once
// with ?preview=roj-open and this browser remembers. Everyone else gets the
// same "Under Construction" wording as the locked Bespoke portals, and the
// page is marked no-index so Google never lists it.
//
// TO GO LIVE: delete the gate below (keep the two renders), change robots to
// "index, follow" in projects.html, add /projects to public/sitemap.xml, and
// point the Projects portal on the home page at it for everyone.
const OPEN = import.meta.env.DEV || ownerPreviewUnlocked();

const slug = new URLSearchParams(window.location.search).get("p");
const root = createRoot(document.getElementById("projects-root"));

if (!OPEN) {
  root.render(
    <div className="min-h-screen bg-matt-black text-cream font-body grid place-items-center px-6 text-center">
      <div>
        <p className="font-detail text-[11px] uppercase tracking-[0.25em] text-cream/45">ROGETjames</p>
        <p className="font-syne font-bold text-2xl md:text-3xl text-cream/70 mt-4">Under Construction</p>
        <a href="/" className="inline-block mt-8 font-detail text-[11px] uppercase tracking-[0.24em] text-clay-light">← Back to the site</a>
      </div>
    </div>
  );
} else {
  root.render(slug ? <ProjectCasePage slug={slug} /> : <ProjectsIndex />);
}
