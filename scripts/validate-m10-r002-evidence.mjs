import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve("."), evidence = resolve(root, "docs/validation/evidence/m10-volcanic-forge"), hash = value => createHash("sha256").update(value).digest("hex");
const matrix = JSON.parse(await readFile(resolve(evidence, "matrix.json"))), manifest = JSON.parse(await readFile(resolve(root, "assets/m10-volcanic-forge/manifest.json")));
if (matrix.count !== 26 || manifest.modules.length !== 52 || !manifest.components.includes("icon-container")) throw Error("M10 matrix or canonical inventory incomplete");
for (const entry of matrix.entries) { const svg = await readFile(resolve(evidence, "matrix", `${entry.name}.svg`)); if (hash(`${svg}\n`) !== entry.svgSha256 || svg.includes("<image") || (entry.component !== "progress" && !svg.includes("data-variation-seed=\"39211\""))) throw Error(`M10 matrix receipt/seed failure: ${entry.name}`); }
for (const module of manifest.modules) { const bytes = await readFile(resolve(root, module.path)); if (bytes.length !== module.bytes || hash(bytes) !== module.sha256) throw Error(`M10 module receipt failure: ${module.assetId}`); }
const seeds = JSON.parse(await readFile(resolve(evidence, "M10-R002-variation-receipts.json")));
if (seeds.receipts.length !== 4 || !seeds.receipts.some(item => item.seed === 0 && item.baseline) || new Set(seeds.receipts.map(item => item.sha256)).size !== 4) throw Error("M10 seed and zero-baseline receipts are incomplete");
const reproduction = JSON.parse(await readFile(resolve(evidence, "M10-R002-clean-workspace-receipt.json")));
if (reproduction.status !== "pass" || reproduction.comparedModules !== 52 || reproduction.manifestMatch !== true) throw Error("M10 clean-workspace byte comparison failed");
for (const file of ["M10-E-technical-preflight.json", "M10-R002-generalized-seam-proof.json"]) await access(resolve(evidence, file));
console.log(`validated ${matrix.count} M10 entries, ${manifest.modules.length} module receipts, seeds, clean workspace, and generalized seam.`);
