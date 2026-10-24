import { readFileSync } from "node:fs";

const file = "private/Software of OMCAR Inspection.html";
const html = readFileSync(file, "utf8");
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
  .filter((match) => !/\bsrc\s*=/.test(match[1]))
  .map((match) => match[2])
  .filter((source) => source.trim());

if (!scripts.length) {
  console.error("No inline scripts found in the inspection workspace.");
  process.exit(1);
}

let failed = false;
scripts.forEach((source, index) => {
  try {
    // Compile only. Do not execute report-builder code or access user data in CI.
    new Function(source);
  } catch (error) {
    failed = true;
    console.error("Inline script " + (index + 1) + " has a syntax error:", error.message);
  }
});

if (failed) process.exit(1);
console.log("Inspection workspace inline JavaScript syntax is valid (" + scripts.length + " script(s)).");
