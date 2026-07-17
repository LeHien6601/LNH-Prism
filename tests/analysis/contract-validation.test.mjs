import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  assertAnalysisReceiptSemantics,
  assertReviewMatchesAnalysis,
  assertReviewRecordSemantics
} from "../../dist/analysis/contract-validation.js";

const root = process.cwd();
const loadJson = async (...segments) => JSON.parse(await readFile(join(root, ...segments), "utf8"));
const [analysisSchema, reviewSchema, analysis, review] = await Promise.all([
  loadJson("specs", "schemas", "analysis-receipt.schema.json"),
  loadJson("specs", "schemas", "analysis-review.schema.json"),
  loadJson("specs", "examples", "v3-frostbound-analysis.json"),
  loadJson("specs", "examples", "v3-frostbound-analysis-review.json")
]);
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateAnalysis = ajv.compile(analysisSchema);
const validateReview = ajv.compile(reviewSchema);

test("accepts the source-bound analysis and ready review fixtures", () => {
  assert.equal(validateAnalysis(analysis), true, ajv.errorsText(validateAnalysis.errors));
  assert.equal(validateReview(review), true, ajv.errorsText(validateReview.errors));
  assert.doesNotThrow(() => assertAnalysisReceiptSemantics(analysis));
  assert.doesNotThrow(() => assertReviewRecordSemantics(review));
  assert.doesNotThrow(() => assertReviewMatchesAnalysis(review, analysis));
});

test("rejects missing evidence and production values outside recommendation", () => {
  const missingEvidence = structuredClone(analysis);
  missingEvidence.proposals[0].evidence = [];
  assert.equal(validateAnalysis(missingEvidence), false);
  const leakedProductionValue = structuredClone(analysis);
  leakedProductionValue.proposals[0].productionValue = "#FFFFFF";
  assert.equal(validateAnalysis(leakedProductionValue), false);

  const duplicateProposal = structuredClone(analysis);
  duplicateProposal.proposals[1].proposalId = duplicateProposal.proposals[0].proposalId;
  assert.throws(() => assertAnalysisReceiptSemantics(duplicateProposal), /duplicate proposalId/);
});

test("rejects normalized regions that escape the concept and mismatched evidence hashes", () => {
  const escapedRegion = structuredClone(analysis);
  escapedRegion.proposals[0].evidence[0].region = { x: 0.8, y: 0.2, width: 0.3, height: 0.4 };
  assert.equal(validateAnalysis(escapedRegion), true, ajv.errorsText(validateAnalysis.errors));
  assert.throws(() => assertAnalysisReceiptSemantics(escapedRegion), /normalized 0–1 bounds/);

  const wrongHash = structuredClone(analysis);
  wrongHash.proposals[0].evidence[0].conceptSha256 = "a".repeat(64);
  assert.throws(() => assertAnalysisReceiptSemantics(wrongHash), /does not bind/);
});

test("rejects illegal or inconsistent review transitions", () => {
  const illegal = structuredClone(review);
  illegal.reviews[0].transitions = [{
    from: "unresolved",
    to: "unresolved",
    reviewerId: "art-lead",
    at: "2026-07-17T11:05:00Z"
  }];
  assert.equal(validateReview(illegal), false);

  const inconsistent = structuredClone(review);
  inconsistent.reviews[0].disposition = "edited";
  inconsistent.reviews[0].editedValue = "#3FAFFF";
  inconsistent.reviews[0].reviewerNote = "Adjusted after review.";
  assert.equal(validateReview(inconsistent), true, ajv.errorsText(validateReview.errors));
  assert.throws(() => assertReviewRecordSemantics(inconsistent), /does not match disposition/);
});

test("blocks draft mapping until every critical proposal is resolved", () => {
  const unresolvedReady = structuredClone(review);
  unresolvedReady.reviews[0].disposition = "unresolved";
  unresolvedReady.reviews[0].transitions[0].to = "unresolved";
  unresolvedReady.reviews[0].reviewerNote = "Art direction decision required.";
  assert.equal(validateReview(unresolvedReady), false);

  const unresolvedBlocked = structuredClone(unresolvedReady);
  unresolvedBlocked.mappingGate = { status: "blocked", blockingProposalIds: ["palette-ice-primary"] };
  assert.equal(validateReview(unresolvedBlocked), true, ajv.errorsText(validateReview.errors));
  assert.doesNotThrow(() => assertReviewRecordSemantics(unresolvedBlocked));
});

test("rejects review records that drift from the immutable analysis receipt", () => {
  const wrongAnalysis = structuredClone(review);
  wrongAnalysis.analysis.version = "0.2.0";
  assert.throws(() => assertReviewMatchesAnalysis(wrongAnalysis, analysis), /ID and version/);

  const changedCriticality = structuredClone(review);
  changedCriticality.reviews[0].critical = false;
  assert.throws(() => assertReviewMatchesAnalysis(changedCriticality, analysis), /changed critical flag/);

  const duplicateReview = structuredClone(review);
  duplicateReview.reviews[1].proposalId = duplicateReview.reviews[0].proposalId;
  assert.throws(() => assertReviewRecordSemantics(duplicateReview), /duplicate proposalId/);
});
