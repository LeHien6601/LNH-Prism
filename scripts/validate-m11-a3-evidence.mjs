import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const evidence = resolve("docs/validation/evidence/m11-enchanted-forest");
const matrix = JSON.parse(await readFile(resolve(evidence, "matrix.json"), "utf8"));
const receipt = JSON.parse(await readFile(resolve(evidence, "M11-A3-render-receipt.json"), "utf8"));
const hash = value => createHash("sha256").update(value).digest("hex");
if (matrix.count !== 26 || matrix.entries.length !== 26) throw new Error("M11 matrix must contain 26 state/size entries.");
const components = new Set(matrix.entries.map(entry => entry.component));
for (const component of ["panel", "primary-hex-button", "secondary-hex-button", "progress", "tab", "badge", "icon-container"]) if (!components.has(component)) throw new Error(`M11 matrix lacks ${component}.`);
for (const entry of matrix.entries) {
  const svg = await readFile(resolve(evidence, "matrix", `${entry.name}.svg`));
  if (hash(svg) !== entry.svgSha256 || !svg.includes("m11-enchanted-forest@0.1.0") || svg.includes("<image")) throw new Error(`M11 SVG receipt or boundary failure: ${entry.name}`);
  if (entry.component !== "progress" && (!svg.includes('data-layer="forest-variation"') || !svg.includes('data-layer="forest-ornament"'))) throw new Error(`M11 editable organic layers missing: ${entry.name}`);
  if (entry.component === "progress" && (!svg.includes('data-part="frame"') || !svg.includes('data-part="fill"'))) throw new Error(`M11 progress parts missing: ${entry.name}`);
}
for (const file of ["m11-enchanted-forest-target-phone.svg", "m11-enchanted-forest-target-phone.png", "m11-enchanted-forest-material-isolates.svg", "m11-enchanted-forest-material-isolates.png", "m11-enchanted-forest-focal-ornament-isolates.svg", "m11-enchanted-forest-focal-ornament-isolates.png", "M11-E-source-scale.html", "M11-E-target-phone.html", "M11-E-thumbnail.html", "M11-E-review-reference.html"]) await access(resolve(evidence, file));
const portrait = await readFile(resolve(evidence, "m11-enchanted-forest-target-phone.svg"), "utf8");
if (!portrait.includes("GROVE RESONANCE 90%") || !portrait.includes(">CLAIM<") || !portrait.includes(">CONTINUE<")) throw new Error("M11 target-phone semantic hierarchy is incomplete.");
const materialIsolate = await readFile(resolve(evidence, "m11-enchanted-forest-material-isolates.svg"), "utf8");
for (const marker of ['data-derived-from="renderM11MaterialClusterSvg"', 'data-layer="forest-stone-chip-cluster"', 'data-layer="forest-wood-knot-cluster"', 'data-layer="forest-moss-lichen-cluster"']) if (!materialIsolate.includes(marker)) throw new Error(`M11 material isolate is not derived from the production primitive library: ${marker}`);
if (receipt.variationSeed !== 51731 || receipt.packageOrReviewStatus !== "deferred-to-m11-a4-and-m11-a5") throw new Error("M11 A3 receipt scope is invalid.");
console.log(`validated ${matrix.count} M11 entries, independent progress parts, isolates, portrait, and four review surfaces.`);
