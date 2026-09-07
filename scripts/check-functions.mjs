// Refuses to build if any /api function can't actually load.
//
// WHY THIS EXISTS: the contact form returned an error to every visitor for an
// unknown length of time. The function itself was fine — it was written in the
// older CommonJS style, and Netlify's runtime stopped accepting that. Nothing
// in the code changed; the platform did. Nobody found out until James tried the
// form himself.
//
// This loads every function the same way the server does. A file that can't be
// loaded, or that doesn't export a handler, fails the build — and a failed
// build never replaces the live site, so the last working version keeps serving.

import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "netlify", "functions");

const files = readdirSync(DIR).filter((f) => /\.(js|mjs|ts)$/.test(f));
const problems = [];
let checked = 0;

for (const file of files) {
  const path = join(DIR, file);
  let mod;
  try {
    mod = await import(pathToFileURL(path).href);
  } catch (err) {
    // The exact failure that took the contact form down reads like this.
    const cjs = /module is not defined|exports is not defined|require is not defined/i.test(err.message);
    problems.push(
      cjs
        ? `${file} — written in the old CommonJS style (exports.handler / module.exports / require). ` +
          `Every function here must use "export const handler = …" and "import …". This is exactly what broke the contact form.`
        : `${file} — will not load: ${err.message.split("\n")[0]}`
    );
    continue;
  }
  // A scheduled function may export only config; anything on /api needs a handler.
  const hasHandler = typeof mod.handler === "function" || typeof mod.default === "function";
  const scheduled = mod.config && mod.config.schedule;
  if (!hasHandler && !scheduled) {
    problems.push(`${file} — loads, but exports no handler. Nothing would answer that address.`);
    continue;
  }
  checked++;
}

if (problems.length) {
  console.error("\n  ✗ FUNCTION CHECK FAILED — the build stops here, the live site is untouched.\n");
  problems.forEach((p) => console.error(`     ${p}`));
  console.error("");
  process.exit(1);
}

console.log(`  ✓ ${checked} functions load and answer`);
