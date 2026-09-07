// Checks every hour that the contact form still answers, and emails James the
// moment it stops.
//
// WHY THIS EXISTS: the contact form failed silently. Visitors saw an error,
// nothing arrived, and there was no way to know until someone tried it.
//
// The probe is harmless. contact.js quietly ignores any submission with the
// hidden "company" field filled in — that field exists to catch bots — so this
// exercises the whole function (loading it, its guards, its parsing) without
// sending an enquiry to anyone.
//
// It emails only when the answer CHANGES: once when it breaks, once when it
// comes back. No hourly noise.

import { getStore } from "@netlify/blobs";

export const config = { schedule: "17 * * * *" };

const SITE = "https://rogetjames.com";
const WATCHED = [
  { name: "Contact form", url: `${SITE}/api/contact`, probe: { company: "health-check", name: "health-check" } },
];

async function probe({ url, probe }) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: SITE },
      body: JSON.stringify(probe),
    });
    if (res.ok) return { ok: true };
    const body = (await res.text()).slice(0, 400);
    return { ok: false, detail: `HTTP ${res.status} — ${body}` };
  } catch (err) {
    return { ok: false, detail: err.message };
  }
}

async function tell(subject, text) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "ROGETjames <james@rogetjames.com>",
      to: [process.env.NOTIFY_EMAIL || "james@rogetjames.com", "rogetjames@gmail.com"],
      subject,
      text,
    }),
  });
}

export const handler = async () => {
  const store = getStore("health-check");

  for (const target of WATCHED) {
    const result = await probe(target);
    const wasBroken = (await store.get(target.name)) === "broken";

    if (!result.ok && !wasBroken) {
      await store.set(target.name, "broken");
      await tell(
        `⚠ ${target.name} is DOWN on rogetjames.com`,
        `${target.name} stopped answering at ${new Date().toISOString()}.\n\n` +
          `Anyone using it right now is being told something went wrong.\n\n` +
          `What the server said:\n${result.detail}\n\n` +
          `Checked hourly. You'll get one more email when it works again.`
      );
    } else if (result.ok && wasBroken) {
      await store.set(target.name, "ok");
      await tell(
        `✓ ${target.name} is working again`,
        `${target.name} started answering again at ${new Date().toISOString()}.`
      );
    } else if (result.ok) {
      await store.set(target.name, "ok");
    }
  }

  return { statusCode: 200, body: "checked" };
};
