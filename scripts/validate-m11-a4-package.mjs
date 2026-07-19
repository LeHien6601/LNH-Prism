import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateRegisteredReviewReferenceBoundary } from "./review-reference-boundary.mjs";

const root = resolve(".");
const evidence = resolve(root, "docs/validation/evidence/m11-enchanted-forest");
const hash = value => createHash("sha256").update(value).digest("hex");
const matrix = JSON.parse(await readFile(resolve(evidence, "matrix.json"), "utf8"));
const manifest = JSON.parse(await readFile(resolve(root, "assets/m11-enchanted-forest/manifest.json"), "utf8"));
if (matrix.count !== 26 || manifest.modules.length !== 52 || manifest.components.length !== 7 || !manifest.components.includes("icon-container")) throw new Error("M11 matrix, package inventory, or module count is incomplete.");
for (const entry of matrix.entries) {
  const svg = await readFile(resolve(evidence, "matrix", `${entry.name}.svg`));
  if (hash(svg) !== entry.svgSha256 || svg.includes("<image") || !svg.includes("m11-enchanted-forest@0.1.0")) throw new Error(`M11 matrix receipt or reference boundary failure: ${entry.name}`);
}
for (const module of manifest.modules) { const bytes = await readFile(resolve(root, module.path)); if (bytes.length !== module.bytes || hash(bytes) !== module.sha256) throw new Error(`M11 module receipt failure: ${module.assetId}`); }
const seeds = JSON.parse(await readFile(resolve(evidence, "M11-A4-variation-receipts.json"), "utf8"));
if (seeds.receipts.length !== 4 || !seeds.receipts.some(receipt => receipt.seed === 0 && receipt.baseline) || new Set(seeds.receipts.map(receipt => receipt.sha256)).size !== 4 || !seeds.receipts.every(receipt => receipt.sameSeedDeterministic)) throw new Error("M11 seed and zero-baseline receipts are incomplete.");
const reproduction = JSON.parse(await readFile(resolve(evidence, "M11-A4-clean-workspace-receipt.json"), "utf8"));
if (reproduction.status !== "pass" || reproduction.comparedModules !== 52 || reproduction.manifestMatch !== true || !reproduction.modules.every(module => module.match)) throw new Error("M11 clean-workspace byte comparison failed.");
const provenance = JSON.parse(await readFile(resolve(evidence, "M11-A4-source-provenance.json"), "utf8"));
if (provenance.status !== "pass" || provenance.sources.length !== 7 || !manifest.provenance.materials || !manifest.provenance.renderer) throw new Error("M11 source provenance is incomplete.");
for (const file of ["M11-E-technical-preflight.json", "M11-A4-generalized-seam-proof.json", "M11-E-source-scale.html", "M11-E-target-phone.html", "M11-E-thumbnail.html", "M11-E-review-reference.html", "m11-enchanted-forest-target-phone.svg", "m11-enchanted-forest-target-phone.png"]) await access(resolve(evidence, file));
const boundary = await validateRegisteredReviewReferenceBoundary({ root, referenceIds: ["enchanted-forest-review-reference"] });
console.log(`validated ${matrix.count} M11 entries, ${manifest.modules.length} module receipts, seeds, clean workspace, provenance, seam, technical preflight, and ${boundary.productionFileCount} production files clear of review-reference pixels.`);
