import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { renderPortfolio } from "../assets/content.mjs";

const index = new URL("../index.html", import.meta.url);
const source = await readFile(new URL("../data/site.json", import.meta.url), "utf8");
const signature = createHash("sha256").update(source).digest("hex");
const current = await readFile(index, "utf8");
const markers = /<!-- portfolio:start -->[\s\S]*?<!-- portfolio:end -->/;
if (!markers.test(current)) throw new Error("Missing portfolio section in index.html");
const snapshot = '<!-- portfolio:start -->\n  <div id="site-content" data-source="' + signature + '">\n' +
  renderPortfolio(JSON.parse(source)).replace(/^[ \t]+$/gm, "") + '\n  </div>\n  <!-- portfolio:end -->';
const updated = current.replace(markers, () => snapshot);
if (process.argv.includes("--check")) {
  if (updated !== current) throw new Error("Refresh index.html with node scripts/prerender.mjs");
} else if (updated !== current) {
  await writeFile(index, updated);
}
