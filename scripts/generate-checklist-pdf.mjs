import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const OUT = "/home/user/rogetjames-website/rogetjames-launch-checklist.pdf";
const doc = new PDFDocument({ size: "A4", margin: 50, info: { Title: "ROGETjames Launch Checklist" } });
doc.pipe(createWriteStream(OUT));

const W = doc.page.width - 100;
const CREAM = "#f2f0e9";
const BLACK = "#111111";
const GRAY = "#888888";
const GREEN = "#4a7c59";
const BGDONE = "#f5faf4";
const BGACTION = "#f7f7f7";
const BGDESIGN = "#fdfaf5";
const CLAY = "#b87c4c";

function sectionTitle(text) {
  doc.moveDown(0.6);
  doc.fontSize(7).fillColor(GRAY).font("Helvetica-Bold")
    .text(text.toUpperCase(), { characterSpacing: 2 });
  doc.moveTo(50, doc.y + 3).lineTo(50 + W, doc.y + 3).strokeColor("#dddddd").lineWidth(0.5).stroke();
  doc.moveDown(0.5);
}

function row(icon, iconColor, title, detail, bgColor) {
  const startY = doc.y;
  const rowH = detail ? (detail.split("\n").length * 14 + 32) : 28;

  doc.save();
  doc.rect(50, startY, W, rowH).fillColor(bgColor).fill();
  doc.restore();

  doc.fontSize(10).fillColor(iconColor).font("Helvetica-Bold")
    .text(icon, 58, startY + 8, { width: 20 });

  doc.fontSize(10).fillColor(BLACK).font("Helvetica-Bold")
    .text(title, 84, startY + 8, { width: W - 40 });

  if (detail) {
    doc.fontSize(9).fillColor("#555555").font("Helvetica")
      .text(detail, 84, startY + 22, { width: W - 40, lineGap: 1 });
  }

  doc.y = startY + rowH + 4;
}

// ── HEADER ──────────────────────────────────────────────────────────────
doc.fontSize(22).fillColor(BLACK).font("Helvetica-Bold").text("ROGET", 50, 50, { continued: true });
doc.fontSize(22).fillColor(GRAY).font("Helvetica-Oblique").text("james");
doc.fontSize(8).fillColor(GRAY).font("Helvetica").text("SITE LAUNCH CHECKLIST", { characterSpacing: 2 });
doc.moveDown(1);
doc.fontSize(20).fillColor(BLACK).font("Helvetica-Bold").text("Everything to go live");
doc.fontSize(8).fillColor("#bbbbbb").font("Helvetica").text("JUNE 2026", { characterSpacing: 2 });
doc.moveDown(1);

// ── ALREADY DONE ────────────────────────────────────────────────────────
sectionTitle("Already done — no action needed");
row("✓", GREEN, "Debug overlays off", "Dev-only audit labels are hidden in the published site.", BGDONE);
row("✓", GREEN, "SEO meta tags", "Title, description, canonical URL (rogetjames.com), Open Graph, Twitter Card,\nrobots, geo tags, and structured data (JSON-LD) are all in place.", BGDONE);
row("✓", GREEN, "Sitemap & robots.txt", "Both present and pointing to rogetjames.com.", BGDONE);
row("✓", GREEN, "Mobile fixes", "Search visible, close button, pricing pills, footer overlap, top marquee strip\nremoved, pulse on editions circle.", BGDONE);
row("✓", GREEN, "Studio Operational indicator removed", null, BGDONE);

// ── NETLIFY ──────────────────────────────────────────────────────────────
sectionTitle("Netlify dashboard — required before launch");
row("1", BLACK, "Turn off site protection / Coming Soon", "Site → Site configuration → Site protection → disable.", BGACTION);
row("2", BLACK, "Add environment variables", "Site → Environment variables → add all six:\nANTHROPIC_API_KEY — chat widget\nAIRTABLE_API_KEY — client vault\nAIRTABLE_BASE_ID — starts with app…\nRESEND_API_KEY — vault invite emails\nVAULT_ADMIN_SECRET — your password at /vault?admin=1\nVAULT_FROM_EMAIL — e.g. ROGETjames <james@rogetjames.com>", BGACTION);

// ── DOMAIN ───────────────────────────────────────────────────────────────
sectionTitle("Domain — required before launch");
row("3", BLACK, "Add rogetjames.com in Netlify", "Site → Domain management → Add domain → rogetjames.com.\nNetlify shows you the DNS values to use in the next step.", BGACTION);
row("4", BLACK, "Update DNS at your registrar", "Point your domain's nameservers to Netlify's (values from step 3).\nSSL certificate auto-issued once DNS propagates — usually 15 min to 48 hrs.", BGACTION);

// ── GOOGLE ───────────────────────────────────────────────────────────────
sectionTitle("Google — do after domain is live");
row("5", BLACK, "Google Search Console", "Verify ownership of rogetjames.com → submit https://rogetjames.com/sitemap.xml\n→ request indexing. Tells Google the site exists.", BGACTION);
row("6", BLACK, "Google Analytics (GA4)", "Create a GA4 property for rogetjames.com → get the G-XXXXXXXX tracking ID\n→ share it with Claude and the script gets added to the site automatically.", BGACTION);
row("7", BLACK, "Google Business Profile", "Create or claim at business.google.com with your address, phone and website.\nPuts ROGETjames on Maps and in local search results (Perth, Gold Coast etc).", BGACTION);

// ── FUNCTIONAL ───────────────────────────────────────────────────────────
sectionTitle("Content & functional review — before launch");
row("8", BLACK, "Postcode logic", "Test that WA postcodes show WA pricing and all other states show interstate pricing.", BGACTION);
row("9", BLACK, "Contact form", "Send a test enquiry and confirm it lands in your inbox.", BGACTION);
row("10", BLACK, "Chat widget", "Test a message on the live site once ANTHROPIC_API_KEY is set in Netlify.", BGACTION);
row("11", BLACK, "Client vault", "Send yourself a test invite at /vault?admin=1 once all vault env vars are set.", BGACTION);

// ── DESIGN ───────────────────────────────────────────────────────────────
sectionTitle("Design — your call on timing");
row("12", GRAY, "Coming Soon animation", "Original design was lost — rebuild when ready to direct it.", BGDESIGN);
row("13", GRAY, "Charcoal panel colours", "Reference palette from Blvck Tumbler — not yet applied. Decide where and Claude applies it.", BGDESIGN);

// ── FOOTER ───────────────────────────────────────────────────────────────
doc.moveDown(1.5);
doc.fontSize(8).fillColor("#cccccc").font("Helvetica")
  .text("ROGETjames  ·  rogetjames.com  ·  June 2026", { align: "center", characterSpacing: 1 });

doc.end();
console.log("PDF saved to", OUT);
