import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import {
  applyReviewDecision,
  buildApprovedTokenLineage,
  createPendingReviewRecord,
  normalizeAnalysisReceipt,
  renderReviewArtifactHtml
} from "../../dist/analysis/proposal-normalizer.js";

const analysis = JSON.parse(await readFile(join(process.cwd(), "specs", "examples", "v3-frostbound-analysis.json"), "utf8"));
const reviewControl = { id: "frostbound-reward-pending-review", version: "0.1.0", createdAt: "2026-07-17T12:00:00Z" };
const reviewer = (id, role, reviewedAt) => ({ id, role, reviewedAt });

test("normalizes proposals deterministically while separating observation, recommendation, and confidence display", () => {
  const first = normalizeAnalysisReceipt(analysis);
  const second = normalizeAnalysisReceipt(structuredClone(analysis));
  assert.deepEqual(first, second);
  assert.notStrictEqual(first.proposals[0], analysis.proposals[0]);
  assert.deepEqual(Object.keys(first.proposals[0].observation).sort(), ["evidence", "text"]);
  assert.equal(first.proposals[0].recommendation.targetPath, "/tokens/colors/primary");
  assert.equal(first.proposals[0].confidence.label, "High confidence");
  assert.match(first.proposals[1].confidence.meaning, /reviewer verification/);
  assert.equal(first.proposals[0].lineage.sourceProposalId, analysis.proposals[0].proposalId);
  assert.equal(analysis.proposals[0].disposition, "pending");
});

test("rejects AI-preapproved proposals, incompatible targets, and duplicate token targets", () => {
  const preapproved = structuredClone(analysis);
  preapproved.proposals[0].disposition = "accepted";
  assert.throws(() => normalizeAnalysisReceipt(preapproved), /must remain pending/);

  const incompatible = structuredClone(analysis);
  incompatible.proposals[0].recommendation.targetPath = "/tokens/spacing/primary";
  assert.throws(() => normalizeAnalysisReceipt(incompatible), /not allowed for palette/);

  const duplicate = structuredClone(analysis);
  duplicate.proposals[1].category = "palette";
  duplicate.proposals[1].recommendation.targetPath = duplicate.proposals[0].recommendation.targetPath;
  assert.throws(() => normalizeAnalysisReceipt(duplicate), /Duplicate recommendation target/);
});

test("creates a schema-compatible pending review without mutating normalized proposals", () => {
  const normalized = normalizeAnalysisReceipt(analysis);
  const snapshot = structuredClone(normalized);
  const review = createPendingReviewRecord(normalized, reviewControl);
  assert.equal(review.mappingGate.status, "blocked");
  assert.deepEqual(review.mappingGate.blockingProposalIds, normalized.proposals.map(({ proposalId }) => proposalId).sort());
  assert.ok(review.reviews.every(({ disposition, transitions }) => disposition === "pending" && transitions.length === 0));
  assert.deepEqual(normalized, snapshot);
});

test("applies reviewer dispositions immutably and preserves allowed transition history", () => {
  const normalized = normalizeAnalysisReceipt(analysis);
  const pending = createPendingReviewRecord(normalized, reviewControl);
  const unresolved = applyReviewDecision(pending, {
    proposalId: "palette-ice-primary",
    disposition: "unresolved",
    reviewer: reviewer("art-lead", "art", "2026-07-17T12:05:00Z"),
    reviewerNote: "Confirm the accent against target-phone contrast."
  });
  const accepted = applyReviewDecision(unresolved, {
    proposalId: "palette-ice-primary",
    disposition: "accepted",
    reviewer: reviewer("art-lead", "art", "2026-07-17T12:10:00Z")
  });
  assert.equal(pending.reviews[0].disposition, "pending");
  assert.deepEqual(accepted.reviews[0].transitions.map(({ from, to }) => ({ from, to })), [
    { from: "pending", to: "unresolved" },
    { from: "unresolved", to: "accepted" }
  ]);
  assert.throws(() => applyReviewDecision(accepted, {
    proposalId: "palette-ice-primary",
    disposition: "edited",
    reviewer: reviewer("art-lead", "art", "2026-07-17T12:15:00Z"),
    reviewerNote: "Late edit is forbidden.",
    editedValue: "#FFFFFF"
  }), /Illegal review transition/);
});

test("blocks mappings until critical reviews resolve and emits accepted or edited values with complete lineage", () => {
  const normalized = normalizeAnalysisReceipt(analysis);
  let review = createPendingReviewRecord(normalized, reviewControl);
  assert.throws(() => buildApprovedTokenLineage(normalized, review), /Draft mapping is blocked/);
  review = applyReviewDecision(review, {
    proposalId: "palette-ice-primary", disposition: "accepted",
    reviewer: reviewer("art-lead", "art", "2026-07-17T12:05:00Z")
  });
  review = applyReviewDecision(review, {
    proposalId: "spacing-action-stack", disposition: "edited",
    reviewer: reviewer("ui-lead", "ui", "2026-07-17T12:06:00Z"),
    reviewerNote: "Use four spacing units.", editedValue: 32
  });
  review = applyReviewDecision(review, {
    proposalId: "material-frost-grain", disposition: "accepted",
    reviewer: reviewer("technical-lead", "technical", "2026-07-17T12:07:00Z")
  });
  review = applyReviewDecision(review, {
    proposalId: "hierarchy-primary-action", disposition: "rejected",
    reviewer: reviewer("product-owner", "product", "2026-07-17T12:08:00Z"),
    reviewerNote: "Defer the numeric contrast delta to the reviewed style draft."
  });
  assert.equal(review.mappingGate.status, "ready");
  const mappings = buildApprovedTokenLineage(normalized, review);
  assert.equal(mappings.length, 3);
  const spacing = mappings.find(({ sourceProposalId }) => sourceProposalId === "spacing-action-stack");
  assert.equal(spacing.value, 32);
  assert.equal(spacing.disposition, "edited");
  assert.equal(spacing.analysis.id, analysis.id);
  assert.equal(spacing.concept.sha256, analysis.concept.sha256);
  assert.equal(spacing.reviewer.id, "ui-lead");
  assert.ok(spacing.evidence.length > 0);
  assert.equal(mappings.some(({ sourceProposalId }) => sourceProposalId === "hierarchy-primary-action"), false);
});

test("renders a deterministic reviewer-editable artifact with visible confidence and separate sections", () => {
  const normalized = normalizeAnalysisReceipt(analysis);
  const review = createPendingReviewRecord(normalized, reviewControl);
  const first = renderReviewArtifactHtml(normalized, review);
  const second = renderReviewArtifactHtml(normalized, structuredClone(review));
  assert.equal(first, second);
  assert.match(first, /<section class="observation"><h3>Observation<\/h3>/);
  assert.match(first, /<section class="recommendation"><h3>Recommendation<\/h3>/);
  assert.match(first, /High confidence/);
  assert.match(first, /Medium confidence/);
  assert.match(first, /<select name="disposition:palette-ice-primary">/);
  assert.match(first, /<textarea name="reviewerNote:palette-ice-primary">/);
  assert.match(first, /<textarea name="editedValue:palette-ice-primary">/);
  assert.match(first, /<input name="reviewerId" required>/);
  assert.match(first, /<select name="reviewerRole">/);
  assert.match(first, /<input name="reviewedAt" type="datetime-local" required>/);
  assert.doesNotMatch(first, /contenteditable/);

  const mismatched = structuredClone(review);
  mismatched.conceptSha256 = "a".repeat(64);
  assert.throws(() => renderReviewArtifactHtml(normalized, mismatched), /does not bind/);
});
