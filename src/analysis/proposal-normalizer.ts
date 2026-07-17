import { assertAnalysisReceiptSemantics, assertReviewRecordSemantics } from "./contract-validation.js";

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type ConfidenceLevel = "high" | "medium" | "low";
export type Disposition = "pending" | "accepted" | "edited" | "rejected" | "unresolved";
export type ReviewerRole = "product" | "art" | "ui" | "technical";

interface SourceRegionEvidence {
  type: "source-region";
  conceptSha256: string;
  region: { x: number; y: number; width: number; height: number };
  note?: string;
}

interface VerbalEvidence {
  type: "verbal";
  statement: string;
}

export type ProposalEvidence = SourceRegionEvidence | VerbalEvidence;

export interface AnalysisProposalInput {
  proposalId: string;
  category: string;
  observation: string;
  recommendation: null | { targetPath: string; value: JsonValue; rationale?: string };
  evidence: ProposalEvidence[];
  confidence: ConfidenceLevel;
  critical: boolean;
  disposition: Disposition;
  reviewerNote?: string;
}

export interface AnalysisReceiptInput {
  schemaVersion: "1.0";
  id: string;
  version: string;
  status: string;
  concept: { receiptId: string; sha256: string };
  createdAt: string;
  analyzer: { type: string; tool: string; settings?: string };
  proposals: AnalysisProposalInput[];
}

export interface NormalizedProposal {
  proposalId: string;
  category: string;
  critical: boolean;
  observation: { text: string; evidence: ProposalEvidence[] };
  recommendation: null | { targetPath: string; value: JsonValue; rationale?: string };
  confidence: { level: ConfidenceLevel; label: string; meaning: string; requiresDecision: boolean };
  lineage: {
    analysisId: string;
    analysisVersion: string;
    conceptReceiptId: string;
    conceptSha256: string;
    sourceProposalId: string;
  };
}

export interface NormalizedAnalysis {
  artifactVersion: "1.0";
  id: string;
  analysis: { id: string; version: string };
  concept: { receiptId: string; sha256: string };
  proposals: NormalizedProposal[];
}

export interface ReviewerIdentity {
  id: string;
  role: ReviewerRole;
  reviewedAt: string;
}

export interface ReviewTransition {
  from: "pending" | "unresolved";
  to: Exclude<Disposition, "pending">;
  reviewerId: string;
  at: string;
}

export interface ProposalReview {
  proposalId: string;
  critical: boolean;
  disposition: Disposition;
  transitions: ReviewTransition[];
  reviewer?: ReviewerIdentity;
  reviewerNote?: string;
  editedValue?: JsonValue;
}

export interface AnalysisReviewRecord {
  schemaVersion: "1.0";
  id: string;
  version: string;
  analysis: { id: string; version: string };
  conceptSha256: string;
  createdAt: string;
  reviews: ProposalReview[];
  mappingGate: { status: "blocked" | "ready"; blockingProposalIds: string[] };
}

export interface ReviewDecision {
  proposalId: string;
  disposition: Exclude<Disposition, "pending">;
  reviewer: ReviewerIdentity;
  reviewerNote?: string;
  editedValue?: JsonValue;
}

export interface TokenLineageMapping {
  targetPath: string;
  value: JsonValue;
  sourceProposalId: string;
  disposition: "accepted" | "edited";
  analysis: { id: string; version: string };
  concept: { receiptId: string; sha256: string };
  evidence: ProposalEvidence[];
  reviewer: ReviewerIdentity;
}

const confidenceDisplay: Record<ConfidenceLevel, Omit<NormalizedProposal["confidence"], "level">> = {
  high: { label: "High confidence", meaning: "Directly observed in the primary reference.", requiresDecision: false },
  medium: { label: "Medium confidence", meaning: "Constrained inference that requires reviewer verification.", requiresDecision: false },
  low: { label: "Low confidence", meaning: "Product or art decision required before mapping.", requiresDecision: true }
};

const allowedTargetPrefixes: Record<string, readonly string[]> = {
  palette: ["/tokens/colors/"],
  spacing: ["/tokens/spacing/"],
  shape: ["/tokens/shape/"],
  stroke: ["/tokens/shape/", "/componentRules/"],
  lighting: ["/tokens/lighting/"],
  material: ["/tokens/material/", "/materialCategories/"],
  hierarchy: ["/componentRules/"],
  "component-tree": ["/components/"]
};

const allowedTransitions = new Set([
  "pending:accepted",
  "pending:edited",
  "pending:rejected",
  "pending:unresolved",
  "unresolved:accepted",
  "unresolved:edited",
  "unresolved:rejected"
]);

function stableJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])])) as JsonValue;
  }
  return value;
}

function stableEvidence(evidence: ProposalEvidence[]): ProposalEvidence[] {
  return evidence.map((item) => structuredClone(item));
}

function recomputeMappingGate(reviews: readonly ProposalReview[]): AnalysisReviewRecord["mappingGate"] {
  const blockingProposalIds = reviews
    .filter(({ critical, disposition }) => critical && (disposition === "pending" || disposition === "unresolved"))
    .map(({ proposalId }) => proposalId)
    .sort();
  return { status: blockingProposalIds.length === 0 ? "ready" : "blocked", blockingProposalIds };
}

function assertIsoDateTime(value: string, context: string): void {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) || Number.isNaN(Date.parse(value))) {
    throw new Error(`${context} must be an ISO-8601 UTC date-time.`);
  }
}

function assertReviewBinding(normalized: NormalizedAnalysis, record: AnalysisReviewRecord): void {
  if (record.analysis.id !== normalized.analysis.id || record.analysis.version !== normalized.analysis.version || record.conceptSha256 !== normalized.concept.sha256) {
    throw new Error("Review record does not bind the normalized analysis and concept.");
  }
}

/** Converts a validated raw analysis receipt into a deterministic, reviewer-facing proposal model. */
export function normalizeAnalysisReceipt(receipt: AnalysisReceiptInput): NormalizedAnalysis {
  assertAnalysisReceiptSemantics(receipt);
  const seenTargetPaths = new Set<string>();
  const proposals = receipt.proposals.map((proposal): NormalizedProposal => {
    if (proposal.disposition !== "pending") {
      throw new Error(`Raw proposal ${proposal.proposalId} must remain pending until human review.`);
    }
    if (proposal.recommendation) {
      const prefixes = allowedTargetPrefixes[proposal.category];
      if (!prefixes?.some((prefix) => proposal.recommendation!.targetPath.startsWith(prefix))) {
        throw new Error(`Proposal ${proposal.proposalId} target ${proposal.recommendation.targetPath} is not allowed for ${proposal.category}.`);
      }
      if (seenTargetPaths.has(proposal.recommendation.targetPath)) {
        throw new Error(`Duplicate recommendation target ${proposal.recommendation.targetPath}.`);
      }
      seenTargetPaths.add(proposal.recommendation.targetPath);
    }
    return {
      proposalId: proposal.proposalId,
      category: proposal.category,
      critical: proposal.critical,
      observation: { text: proposal.observation, evidence: stableEvidence(proposal.evidence) },
      recommendation: proposal.recommendation ? {
        targetPath: proposal.recommendation.targetPath,
        value: stableJson(proposal.recommendation.value),
        ...(proposal.recommendation.rationale ? { rationale: proposal.recommendation.rationale } : {})
      } : null,
      confidence: { level: proposal.confidence, ...confidenceDisplay[proposal.confidence] },
      lineage: {
        analysisId: receipt.id,
        analysisVersion: receipt.version,
        conceptReceiptId: receipt.concept.receiptId,
        conceptSha256: receipt.concept.sha256,
        sourceProposalId: proposal.proposalId
      }
    };
  });
  return {
    artifactVersion: "1.0",
    id: `${receipt.id}-normalized`,
    analysis: { id: receipt.id, version: receipt.version },
    concept: structuredClone(receipt.concept),
    proposals
  };
}

/** Creates a schema-compatible pending review without mutating the raw analysis or normalized model. */
export function createPendingReviewRecord(
  normalized: NormalizedAnalysis,
  control: { id: string; version: string; createdAt: string }
): AnalysisReviewRecord {
  assertIsoDateTime(control.createdAt, "Review createdAt");
  const reviews = normalized.proposals.map(({ proposalId, critical }) => ({
    proposalId,
    critical,
    disposition: "pending" as const,
    transitions: []
  }));
  const record: AnalysisReviewRecord = {
    schemaVersion: "1.0",
    id: control.id,
    version: control.version,
    analysis: structuredClone(normalized.analysis),
    conceptSha256: normalized.concept.sha256,
    createdAt: control.createdAt,
    reviews,
    mappingGate: recomputeMappingGate(reviews)
  };
  assertReviewRecordSemantics(record);
  return record;
}

/** Applies one reviewer decision immutably and recomputes the critical-proposal mapping gate. */
export function applyReviewDecision(record: AnalysisReviewRecord, decision: ReviewDecision): AnalysisReviewRecord {
  assertReviewRecordSemantics(record);
  assertIsoDateTime(decision.reviewer.reviewedAt, "Reviewer reviewedAt");
  const next = structuredClone(record);
  const review = next.reviews.find(({ proposalId }) => proposalId === decision.proposalId);
  if (!review) throw new Error(`Unknown proposal ${decision.proposalId}.`);
  const transitionKey = `${review.disposition}:${decision.disposition}`;
  if (!allowedTransitions.has(transitionKey)) throw new Error(`Illegal review transition ${transitionKey}.`);
  if ((decision.disposition === "edited" || decision.disposition === "rejected" || decision.disposition === "unresolved") && !decision.reviewerNote) {
    throw new Error(`${decision.disposition} decision for ${decision.proposalId} requires a reviewer note.`);
  }
  if (decision.disposition === "edited" && decision.editedValue === undefined) {
    throw new Error(`Edited decision for ${decision.proposalId} requires an edited value.`);
  }
  review.transitions.push({
    from: review.disposition as "pending" | "unresolved",
    to: decision.disposition,
    reviewerId: decision.reviewer.id,
    at: decision.reviewer.reviewedAt
  });
  review.disposition = decision.disposition;
  review.reviewer = structuredClone(decision.reviewer);
  if (decision.reviewerNote) review.reviewerNote = decision.reviewerNote;
  else delete review.reviewerNote;
  if (decision.disposition === "edited") review.editedValue = stableJson(decision.editedValue!);
  else delete review.editedValue;
  next.mappingGate = recomputeMappingGate(next.reviews);
  assertReviewRecordSemantics(next);
  return next;
}

/** Emits only human-accepted mappings with complete proposal-to-token lineage. */
export function buildApprovedTokenLineage(normalized: NormalizedAnalysis, record: AnalysisReviewRecord): TokenLineageMapping[] {
  assertReviewRecordSemantics(record);
  assertReviewBinding(normalized, record);
  if (record.mappingGate.status !== "ready") {
    throw new Error(`Draft mapping is blocked by: ${record.mappingGate.blockingProposalIds.join(", ")}.`);
  }

  const reviews = new Map(record.reviews.map((review) => [review.proposalId, review]));
  const mappings: TokenLineageMapping[] = [];
  for (const proposal of normalized.proposals) {
    const review = reviews.get(proposal.proposalId);
    if (!review) throw new Error(`Review record is missing proposal ${proposal.proposalId}.`);
    if (!proposal.recommendation || (review.disposition !== "accepted" && review.disposition !== "edited")) continue;
    if (!review.reviewer) throw new Error(`Mapped proposal ${proposal.proposalId} has no reviewer.`);
    mappings.push({
      targetPath: proposal.recommendation.targetPath,
      value: stableJson(review.disposition === "edited" ? review.editedValue! : proposal.recommendation.value),
      sourceProposalId: proposal.proposalId,
      disposition: review.disposition,
      analysis: structuredClone(normalized.analysis),
      concept: structuredClone(normalized.concept),
      evidence: stableEvidence(proposal.observation.evidence),
      reviewer: structuredClone(review.reviewer)
    });
  }
  return mappings.sort((left, right) => left.targetPath.localeCompare(right.targetPath));
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function prettyJson(value: JsonValue | undefined): string {
  return value === undefined ? "" : JSON.stringify(value, null, 2);
}

/** Renders a deterministic browser-editable review form; the raw analysis remains read-only. */
export function renderReviewArtifactHtml(normalized: NormalizedAnalysis, record: AnalysisReviewRecord): string {
  assertReviewRecordSemantics(record);
  assertReviewBinding(normalized, record);
  const reviewById = new Map(record.reviews.map((review) => [review.proposalId, review]));
  const cards = normalized.proposals.map((proposal) => {
    const review = reviewById.get(proposal.proposalId);
    if (!review) throw new Error(`Review record is missing proposal ${proposal.proposalId}.`);
    const evidence = proposal.observation.evidence.map((item) => item.type === "source-region"
      ? `<li>Region x=${item.region.x}, y=${item.region.y}, w=${item.region.width}, h=${item.region.height}${item.note ? ` — ${escapeHtml(item.note)}` : ""}</li>`
      : `<li>${escapeHtml(item.statement)}</li>`).join("");
    const recommendation = proposal.recommendation
      ? `<code>${escapeHtml(proposal.recommendation.targetPath)}</code><pre>${escapeHtml(prettyJson(proposal.recommendation.value))}</pre>${proposal.recommendation.rationale ? `<p>${escapeHtml(proposal.recommendation.rationale)}</p>` : ""}`
      : "<p>No production recommendation; reviewer decision required.</p>";
    const options = (["pending", "accepted", "edited", "rejected", "unresolved"] as Disposition[])
      .map((value) => `<option value="${value}"${review.disposition === value ? " selected" : ""}>${value}</option>`).join("");
    return `<article class="proposal" data-proposal-id="${escapeHtml(proposal.proposalId)}">
  <header><h2>${escapeHtml(proposal.proposalId)}</h2><span class="confidence confidence-${proposal.confidence.level}">${escapeHtml(proposal.confidence.label)}</span>${proposal.critical ? '<span class="critical">Critical</span>' : ""}</header>
  <p class="confidence-meaning">${escapeHtml(proposal.confidence.meaning)}</p>
  <section class="observation"><h3>Observation</h3><p>${escapeHtml(proposal.observation.text)}</p><ul>${evidence}</ul></section>
  <section class="recommendation"><h3>Recommendation</h3>${recommendation}</section>
  <fieldset><legend>Human review</legend>
    <label>Disposition <select name="disposition:${escapeHtml(proposal.proposalId)}">${options}</select></label>
    <label>Reviewer note <textarea name="reviewerNote:${escapeHtml(proposal.proposalId)}">${escapeHtml(review.reviewerNote ?? "")}</textarea></label>
    <label>Edited value (JSON) <textarea name="editedValue:${escapeHtml(proposal.proposalId)}">${escapeHtml(prettyJson(review.editedValue))}</textarea></label>
  </fieldset>
</article>`;
  }).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Frostbound analysis review</title>
<style>body{margin:0;background:#071625;color:#e8f7ff;font:16px/1.45 system-ui,sans-serif}.page{max-width:980px;margin:auto;padding:32px}.proposal{margin:24px 0;padding:24px;border:1px solid #315a75;border-radius:16px;background:#0d2638}.proposal header{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.proposal h2{margin:0 auto 0 0}.confidence,.critical{padding:4px 10px;border-radius:999px}.confidence-high{background:#174f55}.confidence-medium{background:#5a4919}.confidence-low,.critical{background:#682e3b}.observation,.recommendation{padding:16px;margin:16px 0;border-radius:12px}.observation{background:#102f43}.recommendation{background:#18283b;border:1px dashed #5b7990}fieldset{display:grid;gap:12px;border:1px solid #476b82;border-radius:12px}label{display:grid;gap:6px}select,textarea{padding:10px;background:#06131f;color:#effaff;border:1px solid #55758a;border-radius:8px}textarea{min-height:72px}pre{white-space:pre-wrap}</style>
</head>
<body><main class="page">
<h1>Frostbound proposal review</h1>
<p>Raw observations are read-only. Reviewers may edit only dispositions, notes, and edited recommendation values.</p>
<p><strong>Mapping gate:</strong> ${record.mappingGate.status}; blockers: ${escapeHtml(record.mappingGate.blockingProposalIds.join(", ") || "none")}</p>
<form id="analysis-review-form">
<fieldset class="reviewer-identity"><legend>Reviewer identity</legend>
  <label>Reviewer ID <input name="reviewerId" required></label>
  <label>Role <select name="reviewerRole"><option value="product">product</option><option value="art">art</option><option value="ui">ui</option><option value="technical">technical</option></select></label>
  <label>Reviewed at (UTC) <input name="reviewedAt" type="datetime-local" required></label>
</fieldset>
${cards}</form>
</main></body>
</html>
`;
}
