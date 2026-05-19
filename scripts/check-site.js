const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(file, text) {
  assert(read(file).includes(text), `${file} should include: ${text}`);
}

function assertNotIncludes(file, text) {
  assert(!read(file).includes(text), `${file} should not include: ${text}`);
}

function assertExists(file) {
  assert(fs.existsSync(path.join(root, file)), `${file} should exist`);
}

function collectRefs(file) {
  const html = read(file);
  const refs = [];
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (
      value.startsWith("http") ||
      value.startsWith("mailto:") ||
      value.startsWith("#")
    ) {
      continue;
    }
    refs.push(value);
  }
  return refs;
}

assertExists("assets/pdfs/a-creek-in-a-plain-city-mudd.pdf");
assertExists("assets/pdfs/one-dead-snake-2.pdf");
assertExists("assets/pdfs/website-page-inspo.pdf");
assertExists("assets/creek-shiner.jpg");

assertIncludes("writing.html", "A Creek in a Plain City");
assertIncludes("writing.html", "One Dead Snake");
assertIncludes("writing.html", "assets/pdfs/a-creek-in-a-plain-city-mudd.pdf");
assertIncludes("writing.html", "assets/pdfs/one-dead-snake-2.pdf");
assertNotIncludes("writing.html", "PDF forthcoming");

assertIncludes("projects.html", "project-intro");
assertIncludes("projects.html", "Selected roles and projects");

for (const name of [
  "George Orwell",
  "Fernando Pessoa",
  "Salvador Plascencia",
  "Alan Lightman",
]) {
  assertIncludes("inspirations.html", name);
}
assertIncludes("inspirations.html", "assets/pdfs/website-page-inspo.pdf");

assertIncludes("contact.html", "creek-shiner.jpg");
assertIncludes("contact.html", "landscape-card");

for (const file of [
  "index.html",
  "writing.html",
  "projects.html",
  "inspirations.html",
  "contact.html",
]) {
  for (const ref of collectRefs(file)) {
    assertExists(ref);
  }
}

console.log("Site checks passed.");
