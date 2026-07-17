type UnknownRecord = Record<string, unknown>;

const terminalDispositions = new Set(["accepted", "edited", "rejected"]);
const allowedTransitions = new Set([
  "pending:accepted",
  "pending:edited",
  "pending:rejected",
  "pending:unresolved",
  "unresolved:accepted",
  "unresolved:edited",
  "unresolved:rejected"
]);

function asRecord(value: unknown, context: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${context} must be an object.`);
  }
  return value as UnknownRecord;
}

function asArray(value: unknown, context: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${context} must be an array.`);
  return value;
}

function asString(value: unknown, context: string): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${context} must be a non-empty string.`);
  return value;
}

function asFiniteNumber(value: unknown, context: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${context} must be a finite number.`);
  return value;
}

function uniqueIds(items: unknown[], field: string, context: string): Set<string> {
  const ids = new Set<string>();
  for (const [index, item] of items.entries()) {
    const id = asString(asRecord(item, `${context}[${index}]`)[field], `${context}[${index}].${field}`);
    if (ids.has(id)) throw new Error(`${context} contains duplicate ${field} ${id}.`);
    ids.add(id);
  }
  return ids;
}

/** Enforces cross-field invariants that JSON Schema cannot express for analysis receipts. */
export function assertAnalysisReceiptSemantics(receiptValue: unknown): void {
  const receipt = asRecord(receiptValue, "Analysis receipt");
  const concept = asRecord(receipt.concept, "Analysis receipt concept");
  const conceptSha256 = asString(concept.sha256, "Analysis receipt concept.sha256");
  const proposals = asArray(receipt.proposals, "Analysis receipt proposals");
  uniqueIds(proposals, "proposalId", "Analysis receipt proposals");

  for (const [proposalIndex, proposalValue] of proposals.entries()) {
    const proposal = asRecord(proposalValue, `Proposal ${proposalIndex}`);
    const proposalId = asString(proposal.proposalId, `Proposal ${proposalIndex}.proposalId`);
    const evidence = asArray(proposal.evidence, `Proposal ${proposalId}.evidence`);
    if (evidence.length === 0) throw new Error(`Proposal ${proposalId} must include source evidence.`);

    for (const [evidenceIndex, evidenceValue] of evidence.entries()) {
      const item = asRecord(evidenceValue, `Proposal ${proposalId} evidence ${evidenceIndex}`);
      if (item.type !== "source-region") continue;
      if (item.conceptSha256 !== conceptSha256) {
        throw new Error(`Proposal ${proposalId} evidence ${evidenceIndex} does not bind the analysis concept SHA-256.`);
      }
      const region = asRecord(item.region, `Proposal ${proposalId} evidence ${evidenceIndex}.region`);
      const x = asFiniteNumber(region.x, `Proposal ${proposalId} evidence ${evidenceIndex}.region.x`);
      const y = asFiniteNumber(region.y, `Proposal ${proposalId} evidence ${evidenceIndex}.region.y`);
      const width = asFiniteNumber(region.width, `Proposal ${proposalId} evidence ${evidenceIndex}.region.width`);
      const height = asFiniteNumber(region.height, `Proposal ${proposalId} evidence ${evidenceIndex}.region.height`);
      if (x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > 1 || y + height > 1) {
        throw new Error(`Proposal ${proposalId} evidence ${evidenceIndex} region must stay within normalized 0–1 bounds.`);
      }
    }
  }
}

/** Enforces transition chains and the critical-proposal mapping gate. */
export function assertReviewRecordSemantics(reviewValue: unknown): void {
  const record = asRecord(reviewValue, "Analysis review");
  const reviews = asArray(record.reviews, "Analysis review reviews");
  uniqueIds(reviews, "proposalId", "Analysis review reviews");
  const expectedBlockers: string[] = [];

  for (const [reviewIndex, reviewValueItem] of reviews.entries()) {
    const review = asRecord(reviewValueItem, `Review ${reviewIndex}`);
    const proposalId = asString(review.proposalId, `Review ${reviewIndex}.proposalId`);
    const disposition = asString(review.disposition, `Review ${proposalId}.disposition`);
    const transitions = asArray(review.transitions, `Review ${proposalId}.transitions`);

    let previous = "pending";
    for (const [transitionIndex, transitionValue] of transitions.entries()) {
      const transition = asRecord(transitionValue, `Review ${proposalId} transition ${transitionIndex}`);
      const from = asString(transition.from, `Review ${proposalId} transition ${transitionIndex}.from`);
      const to = asString(transition.to, `Review ${proposalId} transition ${transitionIndex}.to`);
      if (from !== previous) throw new Error(`Review ${proposalId} transition ${transitionIndex} must start from ${previous}.`);
      if (!allowedTransitions.has(`${from}:${to}`)) throw new Error(`Review ${proposalId} has illegal transition ${from} → ${to}.`);
      previous = to;
      if (terminalDispositions.has(to) && transitionIndex !== transitions.length - 1) {
        throw new Error(`Review ${proposalId} cannot transition after terminal disposition ${to}.`);
      }
    }

    if (transitions.length === 0 && disposition !== "pending") {
      throw new Error(`Review ${proposalId} must record a transition to ${disposition}.`);
    }
    if (transitions.length > 0 && previous !== disposition) {
      throw new Error(`Review ${proposalId} final transition does not match disposition ${disposition}.`);
    }
    if (review.critical === true && (disposition === "pending" || disposition === "unresolved")) {
      expectedBlockers.push(proposalId);
    }
  }

  expectedBlockers.sort();
  const gate = asRecord(record.mappingGate, "Analysis review mappingGate");
  const gateStatus = asString(gate.status, "Analysis review mappingGate.status");
  const actualBlockers = asArray(gate.blockingProposalIds, "Analysis review mappingGate.blockingProposalIds")
    .map((value, index) => asString(value, `Analysis review mappingGate.blockingProposalIds[${index}]`))
    .sort();
  if (JSON.stringify(actualBlockers) !== JSON.stringify(expectedBlockers)) {
    throw new Error(`Analysis review mapping blockers must exactly match unresolved critical proposals: ${expectedBlockers.join(", ") || "none"}.`);
  }
  if ((expectedBlockers.length === 0 && gateStatus !== "ready") || (expectedBlockers.length > 0 && gateStatus !== "blocked")) {
    throw new Error(`Analysis review mapping gate must be ${expectedBlockers.length === 0 ? "ready" : "blocked"}.`);
  }
}

/** Verifies that a review is complete and bound to the immutable analysis receipt. */
export function assertReviewMatchesAnalysis(reviewValue: unknown, analysisValue: unknown): void {
  const review = asRecord(reviewValue, "Analysis review");
  const analysis = asRecord(analysisValue, "Analysis receipt");
  const reviewAnalysis = asRecord(review.analysis, "Analysis review analysis");
  if (reviewAnalysis.id !== analysis.id || reviewAnalysis.version !== analysis.version) {
    throw new Error("Analysis review does not bind the analysis receipt ID and version.");
  }
  const concept = asRecord(analysis.concept, "Analysis receipt concept");
  if (review.conceptSha256 !== concept.sha256) throw new Error("Analysis review does not bind the analysis concept SHA-256.");

  const proposals = asArray(analysis.proposals, "Analysis receipt proposals");
  const reviews = asArray(review.reviews, "Analysis review reviews");
  const reviewsById = new Map(reviews.map((item, index) => {
    const record = asRecord(item, `Analysis review reviews[${index}]`);
    return [asString(record.proposalId, `Analysis review reviews[${index}].proposalId`), record];
  }));
  if (reviewsById.size !== proposals.length) throw new Error("Analysis review must contain exactly one entry for every proposal.");
  for (const [index, item] of proposals.entries()) {
    const proposal = asRecord(item, `Analysis receipt proposals[${index}]`);
    const proposalId = asString(proposal.proposalId, `Analysis receipt proposals[${index}].proposalId`);
    const reviewEntry = reviewsById.get(proposalId);
    if (!reviewEntry) throw new Error(`Analysis review is missing proposal ${proposalId}.`);
    if (reviewEntry.critical !== proposal.critical) throw new Error(`Analysis review changed critical flag for ${proposalId}.`);
  }
}
