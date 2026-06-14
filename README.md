# ROGETjames Website

Portfolio website for ROGETjames — original bespoke laser cut wall art, sculpture & architectural features.

**Live site:** https://rogetjames.netlify.app

---

## Making Changes with Claude

You can use Claude to make design changes, update content, add images, and more — all through a simple chat interface. No coding experience required.

### What You'll Need

- A [Claude Pro or Team account](https://claude.ai) (the paid plan that includes Claude Code)
- A [GitHub account](https://github.com) (free)
- A [Netlify account](https://netlify.com) (free)

### Step 1: Connect GitHub to Claude

1. Go to [claude.ai](https://claude.ai) and sign in
2. Start a new conversation and type `/connect github`
3. Claude will open a browser window asking you to authorise access to your GitHub account
4. Click **Authorize** and follow the prompts
5. Once connected, Claude can read and edit your website code directly

### Step 2: Connect Netlify to GitHub (one-time setup)

This makes your site automatically update whenever changes are pushed to GitHub.

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Find the **rogetjames** project (or click **Add new project** if starting fresh)
3. Click **Site configuration** > **Build & deploy** > **Link to Git provider**
4. Choose **GitHub** and authorise Netlify to access your repos
5. Select the **rogetjames-website** repository
6. Set these build settings:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click **Deploy**

From now on, every time Claude pushes a change to GitHub, Netlify will automatically rebuild and publish your site within about 30 seconds.

### Step 3: Ask Claude to Make Changes

Start a conversation on [claude.ai](https://claude.ai) and tell Claude what you want. For example:

- *"Change the hero heading to say 'Where Art Meets Architecture'"*
- *"Add a new sculpture called LOTUS to the gallery"*
- *"Change the clay/orange accent colour to a deep blue"*
- *"Update the phone number to +61 400 123 456"*
- *"Add a new section showcasing recent projects"*
- *"Make the contact form send emails to a different address"*

Claude will make the changes, commit them to GitHub, and your live site will update automatically.

### Tips

- **Be specific.** Instead of "make it look better," try "make the heading text larger and add more spacing below it."
- **Reference sections by name.** The site has these sections: Hero (top banner), Gallery (the collection), About, Process, Services, Contact, and Footer.
- **Ask to see changes first.** You can say "show me what you'd change before committing" and Claude will explain the plan before making edits.
- **You can always undo.** Every change is saved as a Git commit, so you can ask Claude to revert any change at any time.

---

## For Developers

### Tech Stack

- React 19 + Vite 7
- Tailwind CSS v4
- GSAP 3 (ScrollTrigger animations)
- Lucide React (icons)
- Playwright (build-time prerendering for SEO)

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

This runs Vite build followed by a Playwright prerender step that generates static HTML for SEO. The output goes to `dist/`.

### Project Structure

```
src/
  components/
    Hero.jsx          # Full-screen hero with h1 heading
    Gallery.jsx       # 5-category tabbed gallery with lightbox
    About.jsx         # Dark section with philosophy + bio
    Process.jsx       # 4-step ordering process
    Services.jsx      # 3-tier service cards
    Contact.jsx       # Enquiry form + contact details
    Navbar.jsx        # Floating pill nav, morphs on scroll
    Footer.jsx        # Site footer with links
    NoiseOverlay.jsx  # Subtle SVG noise texture
  index.css           # Tailwind theme + custom styles
  App.jsx             # Main layout composition
public/
  favicon.svg         # Brand favicon
  robots.txt          # Crawler directives
  sitemap.xml         # Sitemap for search engines
index.html            # Meta tags, OG, structured data, noscript fallback
scripts/
  prerender.mjs       # Post-build HTML prerendering
```
