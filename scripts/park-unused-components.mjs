import { glob } from "glob";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const codeGlobs = ["src/**/*.{astro,ts,tsx,js,jsx}", "public/**/*.html"];
const componentGlobs = ["src/components/**/*.{astro,ts,tsx}"];

const [codeFiles, componentFiles] = await Promise.all([
  glob(codeGlobs),
  glob(componentGlobs),
]);

const haystack = (await Promise.all(codeFiles.map(f => fs.readFile(f, "utf8")))).join("\n");

const used = new Set();
for (const file of componentFiles) {
  const base = path.basename(file).replace(/\.(astro|tsx?|jsx?)$/, "");
  const rel = file.replace(/^src\//, "").replace(/\.(astro|tsx?|jsx?)$/, "");
  if (haystack.includes(base) || haystack.includes(rel)) used.add(file);
}

const candidates = componentFiles.filter(f => !f.includes("/deprecated/") && !used.has(f));

// Don't auto-park anything under layout/ui/services/gallery/shared if name suggests it might be used dynamically
const SAFE_DIRS = ["layout", "ui", "services", "gallery", "shared"];
const toPark = candidates.filter(f => !SAFE_DIRS.some(d => f.includes(`/components/${d}/`)));

for (const from of toPark) {
  const to = `src/deprecated/${path.basename(from).replace(/\.(\w+)$/, ".deprecated.$1")}`;
  const res = spawnSync("git", ["mv", from, to], { stdio: "inherit" });
  if (res.status !== 0) console.error("Failed to move:", from);
}

console.log(JSON.stringify({
  scanned_components: componentFiles.length,
  used: used.size,
  parked: toPark
}, null, 2));
