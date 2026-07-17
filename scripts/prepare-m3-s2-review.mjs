import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  createPendingReviewRecord,
  normalizeAnalysisReceipt,
  renderReviewArtifactHtml
} from "../dist/analysis/proposal-normalizer.js";

const root = process.cwd();
const outputDir = join(root, "docs", "validation", "evidence", "m3-s2-frostbound-review");
const analysis = JSON.parse(await readFile(join(root, "specs", "examples", "v3-frostbound-analysis.json"), "utf8"));
const normalized = normalizeAnalysisReceipt(analysis);
const pendingReview = createPendingReviewRecord(normalized, {
  id: "frostbound-reward-pending-review",
  version: "0.1.0",
  createdAt: "2026-07-17T12:00:00Z"
});
const html = renderReviewArtifactHtml(normalized, pendingReview);
const index = {
  evidenceVersion: "1.0.0",
  slice: "M3-S2",
  analysis: "specs/examples/v3-frostbound-analysis.json",
  normalizedAnalysis: "normalized-analysis.json",
  pendingReview: "pending-review.json",
  reviewArtifact: "review.html",
  mappingGate: pendingReview.mappingGate,
  note: "The artifact is intentionally pending; it demonstrates reviewer controls without claiming human approval."
};

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(join(outputDir, "normalized-analysis.json"), `${JSON.stringify(normalized, null, 2)}\n`),
  writeFile(join(outputDir, "pending-review.json"), `${JSON.stringify(pendingReview, null, 2)}\n`),
  writeFile(join(outputDir, "review.html"), html),
  writeFile(join(outputDir, "evidence-index.json"), `${JSON.stringify(index, null, 2)}\n`)
]);
console.log(`Prepared M3-S2 review artifact in ${outputDir}.`);
