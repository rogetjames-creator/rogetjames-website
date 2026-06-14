# Pre-Launch Checklist — ROGETjames

## DONE (no action needed)
- [x] Canonical URL set to rogetjames.com
- [x] Open Graph / Twitter meta tags
- [x] Structured data (LocalBusiness + WebSite JSON-LD)
- [x] robots.txt — updated to rogetjames.com
- [x] sitemap.xml — updated to rogetjames.com
- [x] Favicon — all sizes generated from roj-logo.png
- [x] apple-touch-icon.png (iOS home screen)
- [x] site.webmanifest
- [x] DEBUG_LABELS = false in BespokeCommissions
- [x] No console.logs in codebase
- [x] All anchor links verified
- [x] Footer links corrected
- [x] Chat assistant knows rogetjames.com
- [x] All dead code / unused variables cleaned

---

## NEEDS JAMES — before going live

### ~~1. ANTHROPIC_API_KEY (chat widget)~~ ✅ DONE
Chat widget is live and working.

### 2. Browser test
Walk through the full site before approving:
- Gallery — all images load, quote system works, catalogue PDFs open
- Bespoke Commissions — all tabs, strip animations, lightbox
- Contact form — submits correctly
- Chat widget — test a question
- Mobile — check on phone

### 3. Domain redirect
When happy with everything:
- In your domain registrar (wherever rogetjames.com is registered)
- Point DNS to Netlify (Netlify will give you the exact records in Site Settings → Domain Management)
- Netlify auto-provisions an SSL certificate once DNS is pointing

---

## CONTENT DECISIONS (on hold)
- Art Elements popup — painting spiel saved in src/_drafts/art-elements-painting-spiel.txt
- About section (About.jsx) is currently commented out of the page — confirm if it should stay off or come back
