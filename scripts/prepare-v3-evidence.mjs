import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "docs/validation/evidence/v3-frostbound-reward");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const readBuffer = async (path) => readFile(resolve(root, path));
const readText = async (path) => (await readBuffer(path)).toString("utf8");
const normalizedHash = async (path) => sha256((await readText(path)).replaceAll("\r\n", "\n"));
const write = async (name, value) => {
  const path = resolve(output, name);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
};
const writeIfMissing = async (name, value) => {
  try { await access(resolve(output, name)); } catch { await write(name, value); }
};

const componentSpecs = ["frostbound-reward-panel", "frostbound-claim-button", "frostbound-later-button", "frostbound-reward-progress", "frostbound-reward-emblem-container"];
const approvedPaths = ["specs/examples/style-frostbound-reward.json", "specs/examples/frost-crystal-materials.json", ...componentSpecs.map((id) => `specs/examples/${id}.json`)];
const approvedInputs = await Promise.all(approvedPaths.map(async (path) => {
  const document = JSON.parse(await readText(path));
  return { path, id: document.id, version: document.version, status: document.status, sha256: await normalizedHash(path) };
}));
const approvalBlockers = approvedInputs.filter(({ status }) => status !== "approved").map(({ path, status }) => ({ id: "V3-P001", category: "approval", severity: "blocker", path, status }));
await write("V3-E04-approved-inputs.json", { schemaVersion: "1.0", inputs: approvedInputs });

const matrixPath = "docs/validation/evidence/m3-s4-frostbound-reconstruction/matrix.json";
const matrix = JSON.parse(await readText(matrixPath));
const outputReceipts = [];
for (const entry of matrix.entries) {
  const base = `docs/validation/evidence/m3-s4-frostbound-reconstruction/matrix/${entry.name}`;
  outputReceipts.push({ path: `${base}.svg`, sha256: sha256(await readBuffer(`${base}.svg`)), expectedSha256: entry.svgSha256 });
  outputReceipts.push({ path: `${base}.png`, sha256: sha256(await readBuffer(`${base}.png`)), expectedSha256: entry.pngSha256 });
}
for (const extension of ["svg", "png"]) {
  const path = `docs/validation/evidence/m3-s4-frostbound-reconstruction/frostbound-reconstruction.${extension}`;
  outputReceipts.push({ path, sha256: sha256(await readBuffer(path)) });
}
await write("V3-E05-matrix-receipt.json", { schemaVersion: "1.0", source: matrixPath, matrixSha256: await normalizedHash(matrixPath), variantCount: matrix.count, boundedSizes: true, outputReceipts });

await write("V3-E07-review-views.html", `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>V3-E07 Frostbound review views</title><style>
:root{font-family:system-ui,sans-serif;color:#eaf8ff;background:#091321}body{margin:0;padding:24px}h1,h2{margin:.25rem 0 1rem}.note{max-width:76ch;color:#b8d3e8}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}.card{border:1px solid #4d82a7;border-radius:12px;padding:16px}.dark{background:#081421}.light{background:#e8f4fb;color:#10273a}.phone{width:min(100%,270px);display:block;margin:auto}.pair{display:flex;align-items:center;justify-content:center;gap:18px;min-height:170px;flex-wrap:wrap}.pair img{max-width:288px;height:auto}.label{text-align:center;font-weight:700;margin:.5rem}</style></head>
<body><h1>V3-E07 — Frostbound comparison views</h1><p class="note">Evidence-only page. The portrait reconstruction and component images are deterministic outputs; the concept remains confined to the separate V3-E06 comparison.</p>
<div class="grid"><section class="card dark"><h2>Target phone · dark</h2><img class="phone" src="../m3-s4-frostbound-reconstruction/frostbound-reconstruction.png" alt="Frostbound reconstruction on dark surface"></section>
<section class="card light"><h2>Target phone · light</h2><img class="phone" src="../m3-s4-frostbound-reconstruction/frostbound-reconstruction.png" alt="Frostbound reconstruction on light surface"></section>
<section class="card dark"><h2>Selected-state distinction</h2><div class="pair"><div><img src="../m3-s4-frostbound-reconstruction/matrix/emblem-144x144-normal.png" alt="Normal emblem"><div class="label">Normal</div></div><div><img src="../m3-s4-frostbound-reconstruction/matrix/emblem-144x144-selected.png" alt="Selected emblem"><div class="label">Selected</div></div></div></section>
<section class="card light"><h2>Primary / secondary hierarchy</h2><div class="pair"><div><img src="../m3-s4-frostbound-reconstruction/matrix/primary-button-288x64-normal.png" alt="Primary claim button"><div class="label">Primary</div></div><div><img src="../m3-s4-frostbound-reconstruction/matrix/secondary-button-160x52-normal.png" alt="Secondary later button"><div class="label">Secondary</div></div></div></section></div></body></html>\n`);

const materialPreflightPath = "docs/validation/evidence/m3-s3-frost-crystal-intake/preflight.json";
const reusePlanPath = "docs/validation/evidence/m3-s3-frost-crystal-intake/reuse-plan.json";
const materialPreflight = JSON.parse(await readText(materialPreflightPath));
const reusePlan = JSON.parse(await readText(reusePlanPath));
await write("V3-E08-material-audit.json", {
  schemaVersion: "1.0",
  materialPack: "frost-crystal-materials@0.1.0",
  sourcePreflight: { path: materialPreflightPath, sha256: await normalizedHash(materialPreflightPath), status: materialPreflight.status, checks: materialPreflight.checks },
  reuse: { path: reusePlanPath, sha256: await normalizedHash(reusePlanPath), componentTypeCount: reusePlan.componentTypeCount, bindings: reusePlan.bindings },
  isolationViews: ["../m3-s3-frost-crystal-intake/frost-grain-isolation.svg", "../m3-s3-frost-crystal-intake/crystal-facet-pattern-isolation.svg", "../m3-s3-frost-crystal-intake/rune-ornament-isolation.svg"]
});

const sourcePaths = [
  "docs/decisions/ADR-012-v3-frostbound-reward.md", "docs/reference-briefs/V3_FROSTBOUND_REWARD.md", "docs/implementation/M3_FROSTBOUND_ANALYSIS_IMPLEMENTATION_SPEC.md",
  "docs/validation/V3_CONCEPT_RECONSTRUCTION_RUBRIC.md", "docs/reference-briefs/assets/v3-frostbound-reward-concept.receipt.json",
  "specs/examples/v3-frostbound-analysis.json", "docs/validation/records/m3-s3-frostbound-analysis-review.json", "docs/validation/records/m3-s3-frostbound-package-approval.json",
  "docs/validation/evidence/m3-s3-frost-crystal-intake/approved-token-lineage.json", ...approvedPaths,
  "materials/frost-crystal/frost-grain.json", "materials/frost-crystal/crystal-facet-pattern.json", "materials/frost-crystal/rune-ornament.json",
  "src/materials/frost-crystal.ts", "src/renderer/frostbound-components.ts", "src/renderer/frostbound-scenario.ts",
  "scripts/prepare-v3-evidence.mjs", "scripts/validate-v3-evidence.mjs", "package.json", "package-lock.json"
];
const sourceReceipts = await Promise.all(sourcePaths.map(async (path) => ({ path, sha256: await normalizedHash(path) })));
await write("V3-E09-provenance-audit.json", {
  schemaVersion: "1.0",
  sourceTreeSha256: sha256(sourceReceipts.map(({ path, sha256: hash }) => `${path}:${hash}`).join("\n")), sourceReceipts,
  outputTreeSha256: sha256(outputReceipts.map(({ path, sha256: hash }) => `${path}:${hash}`).join("\n")), outputReceipts,
  conceptUsageBoundary: "The concept raster is review evidence only and is absent from production sources and outputs."
});
await write("V3-E09-test-report.json", { schemaVersion: "1.0", command: "npm run validate", status: "pending-final-validation", coverage: ["contracts", "analysis-control", "proposal-mapping", "material-preflight", "renderer-states-and-bounds", "determinism", "progress-frame-fill", "provenance", "concept-leakage", "V1-V2-regression"] });
await writeIfMissing("V3-E10-defect-log.json", { schemaVersion: "1.0", status: "open-for-human-review", defects: [], corrections: [], revalidations: [], note: "No automated preflight defects are known. Human review may append defects; empty does not imply a V3 decision." });
await writeIfMissing("V3-E10-retrospective.md", `# V3 Frostbound retrospective and revalidation\n\nStatus: Pending human review\n\n## Observations\n\nTo be completed by the V3 reviewers.\n\n## Corrections and revalidation\n\nRecord each defect ID, root cause, owner, correction commit, validation command, and result without overwriting the original finding.\n`);

const record = await readText("docs/validation/records/v3-frostbound-reward.md");
const decisionMatch = record.match(/^Decision: (🟢 Pass|🟡 Conditional pass|🔴 Fail)$/mu);
const scoreMatch = record.match(/^Weighted score: `(\d+(?:\.\d+)?)\/100`$/mu);
const scoringPerformed = Boolean(decisionMatch && scoreMatch);
const blockers = [...approvalBlockers];
const defectLog = JSON.parse(await readText("docs/validation/evidence/v3-frostbound-reward/V3-E10-defect-log.json"));
if (materialPreflight.status !== "pass" || !Object.values(materialPreflight.checks).every(Boolean)) blockers.push({ id: "V3-P002", category: "material", severity: "blocker", status: materialPreflight.status });
if (matrix.count !== 26 || outputReceipts.some(({ expectedSha256, sha256: actual }) => expectedSha256 && expectedSha256 !== actual)) blockers.push({ id: "V3-P003", category: "output", severity: "blocker", detail: "Matrix count or output hash mismatch." });
const reviewStatus = scoringPerformed ? "review-complete" : blockers.length ? "blocked-before-scoring" : "ready-for-human-review";
await write("V3-E10-preflight.json", {
  schemaVersion: "1.0", status: reviewStatus, blockers, scoringPerformed, defectCount: defectLog.defects.length,
  ...(scoringPerformed ? { weightedScore: Number(scoreMatch[1]), gateDecision: decisionMatch[1].replace(/^[^ ]+ /u, "").toLowerCase().replaceAll(" ", "-") } : {})
});

await write("evidence-index.json", { schemaVersion: "1.0", id: "v3-frostbound-reward", status: reviewStatus, evidence: {
  "V3-E01": ["docs/decisions/ADR-012-v3-frostbound-reward.md", "docs/reference-briefs/V3_FROSTBOUND_REWARD.md", "docs/implementation/M3_FROSTBOUND_ANALYSIS_IMPLEMENTATION_SPEC.md", "docs/validation/V3_CONCEPT_RECONSTRUCTION_RUBRIC.md"],
  "V3-E02": ["docs/reference-briefs/assets/v3-frostbound-reward-concept.receipt.json", "specs/examples/v3-frostbound-analysis.json"],
  "V3-E03": ["docs/validation/records/m3-s3-frostbound-analysis-review.json", "../m3-s3-frost-crystal-intake/approved-token-lineage.json"],
  "V3-E04": ["V3-E04-approved-inputs.json", ...approvedPaths],
  "V3-E05": ["V3-E05-matrix-receipt.json", "../m3-s4-frostbound-reconstruction/matrix.json", "../m3-s4-frostbound-reconstruction/matrix/"],
  "V3-E06": ["../m3-s4-frostbound-reconstruction/frostbound-reconstruction.svg", "../m3-s4-frostbound-reconstruction/frostbound-reconstruction.png", "../m3-s4-frostbound-reconstruction/comparison.html"],
  "V3-E07": ["V3-E07-review-views.html"],
  "V3-E08": ["V3-E08-material-audit.json", "../m3-s3-frost-crystal-intake/"],
  "V3-E09": ["V3-E09-test-report.json", "V3-E09-provenance-audit.json"],
  "V3-E10": ["V3-E10-defect-log.json", "V3-E10-retrospective.md", "V3-E10-preflight.json", "../../records/v3-frostbound-reward.md"]
} });
console.log(`Prepared V3-E01 through V3-E10 evidence in ${output}.`);
