import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "docs/validation/evidence/v3-frostbound-reward");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const readJson = async (name) => JSON.parse(await readFile(resolve(output, name), "utf8"));
const required = ["evidence-index.json", "V3-E04-approved-inputs.json", "V3-E05-matrix-receipt.json", "V3-E07-review-views.html", "V3-E08-material-audit.json", "V3-E09-test-report.json", "V3-E09-provenance-audit.json", "V3-E10-defect-log.json", "V3-E10-retrospective.md", "V3-E10-preflight.json"];
for (const name of required) await readFile(resolve(output, name));
const index = await readJson("evidence-index.json");
for (let number = 1; number <= 10; number += 1) if (!index.evidence[`V3-E${String(number).padStart(2, "0")}`]?.length) throw new Error(`V3-E${String(number).padStart(2, "0")} is missing.`);
const approved = await readJson("V3-E04-approved-inputs.json");
if (approved.inputs.length !== 7 || approved.inputs.some(({ status }) => status !== "approved")) throw new Error("V3 approved-input inventory is incomplete or contains an unapproved artifact.");
const matrix = await readJson("V3-E05-matrix-receipt.json");
if (matrix.variantCount !== 26 || matrix.outputReceipts.length !== 54) throw new Error("V3 matrix/output receipt is incomplete.");
for (const receipt of matrix.outputReceipts) {
  const actual = sha256(await readFile(resolve(root, receipt.path)));
  if (actual !== receipt.sha256 || (receipt.expectedSha256 && actual !== receipt.expectedSha256)) throw new Error(`Output drift: ${receipt.path}`);
}
const material = await readJson("V3-E08-material-audit.json");
if (material.sourcePreflight.status !== "pass" || !Object.values(material.sourcePreflight.checks).every(Boolean) || material.reuse.componentTypeCount < 4) throw new Error("V3 material preflight or reuse proof failed.");
const defectLog = await readJson("V3-E10-defect-log.json");
if (![defectLog.defects, defectLog.corrections, defectLog.revalidations].every(Array.isArray)) throw new Error("V3 defect, correction, or revalidation history is malformed.");
const views = await readFile(resolve(output, "V3-E07-review-views.html"), "utf8");
for (const marker of ["Target phone · dark", "Target phone · light", "Selected-state distinction", "Primary / secondary hierarchy"]) if (!views.includes(marker)) throw new Error(`V3 review view missing: ${marker}`);
const audit = await readJson("V3-E09-provenance-audit.json");
for (const receipt of audit.sourceReceipts) {
  const actual = sha256((await readFile(resolve(root, receipt.path), "utf8")).replaceAll("\r\n", "\n"));
  if (actual !== receipt.sha256) throw new Error(`Source drift: ${receipt.path}`);
}
const conceptReceipt = JSON.parse(await readFile(resolve(root, "docs/reference-briefs/assets/v3-frostbound-reward-concept.receipt.json"), "utf8"));
const forbidden = ["v3-frostbound-reward-concept", conceptReceipt.sha256];
for (const receipt of matrix.outputReceipts.filter(({ path }) => path.endsWith(".svg"))) {
  const svg = await readFile(resolve(root, receipt.path), "utf8");
  if (forbidden.some((value) => value && svg.includes(value)) || /<image\b/iu.test(svg)) throw new Error(`Concept leakage in production output: ${receipt.path}`);
}
const preflight = await readJson("V3-E10-preflight.json");
if (preflight.defectCount !== defectLog.defects.length) throw new Error("V3 preflight defect count drifted from the preserved defect log.");
if (preflight.blockers.length) throw new Error("V3 preflight contains an automatic blocker.");
if (preflight.scoringPerformed) {
  if (preflight.status !== "review-complete" || typeof preflight.weightedScore !== "number" || !preflight.gateDecision) throw new Error("Completed V3 review receipt is incomplete.");
} else if (preflight.status !== "ready-for-human-review") throw new Error("Unscored V3 evidence is not ready for the human gate.");
const reportPath = resolve(output, "V3-E09-test-report.json");
const report = await readJson("V3-E09-test-report.json");
report.status = "passed";
report.validatedAt = "2026-07-17";
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`validated V3-E01 through V3-E10: approvals, 26-variant matrix, 54 output receipts, review views, material reuse, provenance, no-pixel boundary, and ${preflight.scoringPerformed ? "completed human review" : "unscored preflight"}`);
