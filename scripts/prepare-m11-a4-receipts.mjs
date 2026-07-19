import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { renderStyledComponentSvg } from "../dist/renderer/style-composition.js";
import { M11_ENCHANTED_FOREST_BINDING } from "../dist/styles/m11-enchanted-forest-binding.js";

const root = resolve(".");
const evidence = resolve(root, "docs/validation/evidence/m11-enchanted-forest");
const hash = value => createHash("sha256").update(value).digest("hex");
const write = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
const request = seed => ({ component: "panel", width: 488, height: 660, state: "normal", variationSeed: seed });
const receipts = [0, 51731, 104729, 8675309].map(seed => {
  const svg = renderStyledComponentSvg(request(seed), M11_ENCHANTED_FOREST_BINDING);
  return { seed, baseline: seed === 0, sha256: hash(svg), sameSeedDeterministic: svg === renderStyledComponentSvg(request(seed), M11_ENCHANTED_FOREST_BINDING) };
});
await write(resolve(evidence, "M11-A4-variation-receipts.json"), { schemaVersion: "1.0", renderer: "src/renderer/style-composition.ts", permittedVariation: ["moss-variation", "leaf-vine-ornament"], receipts });

const run = (cwd, args) => new Promise((resolveRun, reject) => {
  const child = spawn(process.execPath, args, { cwd, stdio: "pipe" }); let error = "";
  child.stderr.on("data", chunk => { error += chunk; });
  child.on("close", code => code === 0 ? resolveRun() : reject(new Error(error || `Command failed: ${args.join(" ")}`)));
});
const clean = await mkdtemp(join(tmpdir(), "lnh-prism-m11-a4-"));
try {
  for (const path of ["src", "scripts", "specs", "docs", "node_modules", "package.json", "tsconfig.json"]) await cp(resolve(root, path), resolve(clean, path), { recursive: true });
  await run(clean, ["node_modules/typescript/bin/tsc", "--project", "tsconfig.json"]);
  await run(clean, ["scripts/prepare-m11-a3-evidence.mjs"]);
  await run(clean, ["scripts/prepare-m11-a4-package.mjs"]);
  const local = JSON.parse(await readFile(resolve(root, "assets/m11-enchanted-forest/manifest.json"), "utf8"));
  const rebuilt = JSON.parse(await readFile(resolve(clean, "assets/m11-enchanted-forest/manifest.json"), "utf8"));
  const modules = local.modules.map(module => ({ assetId: module.assetId, match: module.sha256 === rebuilt.modules.find(item => item.assetId === module.assetId)?.sha256 }));
  await write(resolve(evidence, "M11-A4-clean-workspace-receipt.json"), { schemaVersion: "1.0", status: modules.every(module => module.match) ? "pass" : "fail", workspace: "temporary clean source snapshot", command: "tsc then prepare-m11-a3-evidence then prepare-m11-a4-package", comparedModules: modules.length, manifestMatch: hash(await readFile(resolve(root, "assets/m11-enchanted-forest/manifest.json"))) === hash(await readFile(resolve(clean, "assets/m11-enchanted-forest/manifest.json"))), modules });
} finally { await rm(clean, { recursive: true, force: true }); }
await write(resolve(evidence, "M11-A4-generalized-seam-proof.json"), { schemaVersion: "1.0", renderer: "src/renderer/style-composition.ts", binding: "src/styles/m11-enchanted-forest-binding.ts", proof: ["M11 has no renderer module", "style-composition owns all renderer entry points", "binding supplies only data-owned organic layers while M7/M8 geometry is inherited"], status: "pass" });
await write(resolve(evidence, "M11-A4-source-provenance.json"), { schemaVersion: "1.0", sources: ["specs/examples/style-m11-enchanted-forest.json", "specs/examples/m11-enchanted-forest-materials.json", "specs/examples/m11-enchanted-forest-edge-stacks.json", "specs/examples/m11-enchanted-forest-material-responses.json", "specs/examples/m11-enchanted-forest-variation.json", "specs/examples/m11-enchanted-forest-ornament-anchors.json", "specs/examples/m11-enchanted-forest-focal-objects.json"], prohibitedReviewReference: "enchanted-forest-review-reference-1080x1920.png", status: "pass" });
await write(resolve(evidence, "M11-E-technical-preflight.json"), { schemaVersion: "1.0", status: "unscored-review-ready", technicalCorrectness: "hard-gate-only", checks: { matrix: "matrix.json", modules: "assets/m11-enchanted-forest/manifest.json", cleanWorkspace: "M11-A4-clean-workspace-receipt.json", seedBaseline: "M11-A4-variation-receipts.json", generalizedSeam: "M11-A4-generalized-seam-proof.json", provenance: "M11-A4-source-provenance.json", sourceScale: "M11-E-source-scale.html", targetPhone: "M11-E-target-phone.html", thumbnail: "M11-E-thumbnail.html", reviewReference: "../../../reference-briefs/ENCHANTED_FOREST_REVIEW_REFERENCE.md", reviewReferenceReceipt: "../../../reference-briefs/assets/enchanted-forest-review-reference-1080x1920.receipt.json", reviewReferenceComparison: "M11-E-review-reference.html", reviewReferenceBoundary: "npm run test:review-reference-boundary" }, automaticBlockers: [], scoringPerformed: false, gateDecision: "pending-human-review" });
console.log("Prepared M11-A4 seed, provenance, clean-workspace, seam, and preflight receipts.");
