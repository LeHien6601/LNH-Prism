import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
const review = createPendingReviewRecord(normalized, {
  id: "frostbound-reward-pending-review",
  version: "0.1.0",
  createdAt: "2026-07-17T12:00:00Z"
});
const [storedNormalized, storedReview, storedHtml, index] = await Promise.all([
  readFile(join(outputDir, "normalized-analysis.json"), "utf8"),
  readFile(join(outputDir, "pending-review.json"), "utf8"),
  readFile(join(outputDir, "review.html"), "utf8"),
  readFile(join(outputDir, "evidence-index.json"), "utf8").then(JSON.parse)
]);
assert.equal(storedNormalized, `${JSON.stringify(normalized, null, 2)}\n`);
assert.equal(storedReview, `${JSON.stringify(review, null, 2)}\n`);
assert.equal(storedHtml, renderReviewArtifactHtml(normalized, review));
assert.equal(index.mappingGate.status, "blocked");
assert.equal(index.mappingGate.blockingProposalIds.length, normalized.proposals.filter(({ critical }) => critical).length);
assert.match(storedHtml, /class="observation"/);
assert.match(storedHtml, /class="recommendation"/);
assert.match(storedHtml, /name="disposition:/);
assert.match(storedHtml, /name="reviewerNote:/);
assert.match(storedHtml, /name="editedValue:/);
assert.match(storedHtml, /name="reviewerId"/);
assert.match(storedHtml, /name="reviewerRole"/);
assert.match(storedHtml, /name="reviewedAt"/);
console.log("validated deterministic M3-S2 normalization, pending review, confidence display, and editable controls");
