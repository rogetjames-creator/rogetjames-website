// TEMPORARY one-off digest. Reads the pricing-interest events from Netlify
// Blobs and emails the most recent ones to James, so he can see what a visitor
// was pricing without logging into the dashboard. Scheduled to fire every
// minute; remove this file once the email has arrived.
import { getStore } from "@netlify/blobs";

export default async () => {
  let records = [];
  try {
    const store = getStore({ name: "pricing-interest", consistency: "strong" });
    const { blobs } = await store.list();
    const entries = await Promise.all(
      blobs.map(async (b) => {
        const v = await store.get(b.key, { type: "json" }).catch(() => null);
        return v || null;
      })
    );
    records = entries.filter(Boolean);
  } catch (e) {
    records = [];
  }

  records.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
  const recent = records.slice(0, 60);

  const fmt = (r) => {
    const when = new Date(r.createdTime).toLocaleString("en-AU", {
      timeZone: "Australia/Perth", dateStyle: "medium", timeStyle: "short",
    });
    const bits = [
      `${when} (Perth)`,
      r.Type || "?",
      r.Item ? `Design: ${r.Item}` : null,
      r.Series ? `Series: ${r.Series}` : null,
      r.Postcode ? `Postcode: ${r.Postcode}` : null,
      r.Region || null,
      typeof r.Price === "number" ? `$${r.Price}` : null,
    ].filter(Boolean);
    return "• " + bits.join(" — ");
  };

  const body = recent.length
    ? recent.map(fmt).join("\n")
    : "No events found in storage.";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ROGETjames Stats <onboarding@resend.dev>",
      to: ["rogetjames@gmail.com", "james@rogetjames.com"],
      subject: `Recent pricing-interest events (${recent.length})`,
      text: `Most recent visitor pricing events on rogetjames.com:\n\n${body}`,
    }),
  });

  return new Response("sent");
};

export const config = { schedule: "* * * * *" };
