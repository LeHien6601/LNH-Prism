import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  assertFourComponentReuse,
  frostCrystalReusePlan,
  preflightFrostCrystalSource,
  renderFrostCrystalIsolationSvg
} from "../dist/materials/frost-crystal.js";
import { buildApprovedTokenLineage, normalizeAnalysisReceipt } from "../dist/analysis/proposal-normalizer.js";

const outputDirectory = resolve("docs/validation/evidence/m3-s3-frost-crystal-intake");
const packPath = resolve("specs/examples/frost-crystal-materials.draft.json");
const pendingReviewPath = resolve("docs/validation/evidence/m3-s2-frostbound-review/pending-review.json");
const pack = JSON.parse(await readFile(packPath, "utf8"));
const pendingReview = JSON.parse(await readFile(pendingReviewPath, "utf8"));
const approvedPackPath = resolve("specs/examples/frost-crystal-materials.json");
const approvedPackContent = await readFile(approvedPackPath, "utf8");
const approvedPack = JSON.parse(approvedPackContent);
const analysis = JSON.parse(await readFile(resolve("specs/examples/v3-frostbound-analysis.json"), "utf8"));
const approvedReview = JSON.parse(await readFile(resolve("docs/validation/records/m3-s3-frostbound-analysis-review.json"), "utf8"));
const packageApproval = JSON.parse(await readFile(resolve("docs/validation/records/m3-s3-frostbound-package-approval.json"), "utf8"));
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

await mkdir(outputDirectory, { recursive: true });
const sourcePreflight = [];
for (const declaration of pack.sources) {
  const content = await readFile(resolve(declaration.path), "utf8");
  const source = JSON.parse(content);
  preflightFrostCrystalSource(source);
  const sha256 = createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex");
  if (sha256 !== declaration.sha256) throw new Error(`${declaration.id} does not match its declared SHA-256.`);
  sourcePreflight.push({
    sourceId: source.id,
    sourceType: source.sourceType,
    path: declaration.path,
    sha256,
    rights: source.rights,
    colorSpace: source.colorSpace,
    resolution: source.resolution,
    alpha: source.alpha,
    seamlessness: source.kind === "procedural-tile" ? "pass" : "not-required",
    transparentBackground: source.transparentBackground,
    containsConceptPixels: source.containsConceptPixels,
    containsComponentGeometry: source.containsComponentGeometry,
    containsComponentEffects: source.containsComponentEffects,
    normalizationSettings: pack.materials.find(({ sourceId }) => sourceId === source.id)?.normalization
  });
  await writeFile(resolve(outputDirectory, `${source.id}-isolation.svg`), `${renderFrostCrystalIsolationSvg(source.id)}\n`, "utf8");
}

assertFourComponentReuse(frostCrystalReusePlan);
const preflight = {
  schemaVersion: "1.0",
  id: "frost-crystal-source-preflight",
  version: "0.1.0",
  status: "pass",
  generatedAt: "2026-07-17T14:00:00Z",
  sourceCount: sourcePreflight.length,
  checks: {
    hashesMatch: true,
    rightsRecorded: true,
    colorSpaceAndResolutionRecorded: true,
    seamlessSourcesPass: true,
    noConceptPixels: true,
    noComponentGeometryOrEffects: true
  },
  sources: sourcePreflight
};
const reusePlan = {
  schemaVersion: "1.0",
  id: "frost-crystal-four-component-reuse-plan",
  version: "0.1.0",
  status: "proposed",
  componentTypeCount: frostCrystalReusePlan.length,
  bindings: frostCrystalReusePlan
};
const approvalPackage = {
  schemaVersion: "1.0",
  id: "frostbound-m3-s3-human-approval-package",
  version: "0.1.0",
  status: "pending-human-approval",
  createdAt: "2026-07-17T14:00:00Z",
  materialIntake: {
    candidatePack: "specs/examples/frost-crystal-materials.draft.json",
    candidateStatus: pack.status,
    preflight: "preflight.json",
    reusePlan: "reuse-plan.json"
  },
  analysisReview: {
    record: "docs/validation/evidence/m3-s2-frostbound-review/pending-review.json",
    status: pendingReview.mappingGate.status,
    blockingProposalIds: pendingReview.mappingGate.blockingProposalIds
  },
  proposedComponentInventory: [
    { id: "frostbound-reward-panel", componentType: "panel" },
    { id: "frostbound-claim-button", componentType: "button", variant: "primary" },
    { id: "frostbound-later-button", componentType: "button", variant: "secondary" },
    { id: "frostbound-reward-progress", componentType: "progress" },
    { id: "frostbound-reward-emblem-container", componentType: "reward-emblem-container" }
  ],
  decisionsRequired: [
    { id: "analysis-proposals", owner: "Product + Art + UI + Technical leads", status: "pending", decision: "Record a disposition for every critical M3-S2 proposal." },
    { id: "material-sources", owner: "Art + Technical leads", status: "pending", decision: "Accept, edit, or reject the three independent procedural sources and normalization settings." },
    { id: "reuse-plan", owner: "Art + UI + Technical leads", status: "pending", decision: "Accept or edit the four-component-type reuse and deterministic masking boundaries." },
    { id: "component-inventory", owner: "Product + UI leads", status: "pending", decision: "Accept or edit the five proposed component artifact IDs and roles." }
  ],
  draftGenerationGate: {
    status: "blocked",
    reason: "Critical analysis proposals remain pending; style and component drafts must not be generated or reconstructed.",
    blockingProposalIds: pendingReview.mappingGate.blockingProposalIds
  },
  reconstructionGate: {
    status: "blocked",
    reason: "Human proposal decisions and explicit artifact approval are required before M3-S4."
  }
};
const approvedTokenLineage = buildApprovedTokenLineage(normalizeAnalysisReceipt(analysis), approvedReview);
const approvedPackage = {
  ...packageApproval,
  materialIntake: {
    approvedPack: "specs/examples/frost-crystal-materials.json",
    approvedPackSha256: createHash("sha256").update(approvedPackContent.replaceAll("\r\n", "\n")).digest("hex"),
    approvedStatus: approvedPack.status,
    preflight: "preflight.json",
    reusePlan: "reuse-plan.json"
  },
  approvedTokenLineage: "approved-token-lineage.json",
  reconstructionGate: {
    status: "ready",
    reason: "Option A explicitly accepted every critical proposal, the material pack, reuse plan, and component inventory."
  }
};

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const sourceRows = sourcePreflight.map((source) => `<tr><td>${escapeHtml(source.sourceId)}</td><td>${escapeHtml(source.sourceType)}</td><td><code>${escapeHtml(source.sha256)}</code></td><td>${source.seamlessness}</td><td>${source.containsConceptPixels ? "FAIL" : "PASS"}</td></tr>`).join("");
const reuseRows = frostCrystalReusePlan.map((binding) => `<tr><td>${escapeHtml(binding.componentType)}</td><td>${escapeHtml(binding.materialIds.join(", "))}</td><td>${escapeHtml(binding.boundary)}</td></tr>`).join("");
const decisionControls = approvalPackage.decisionsRequired.map((decision) => `<fieldset><legend>${escapeHtml(decision.id)} — ${escapeHtml(decision.owner)}</legend><p>${escapeHtml(decision.decision)}</p><label><input type="radio" name="${escapeHtml(decision.id)}" value="accepted"> Accept</label><label><input type="radio" name="${escapeHtml(decision.id)}" value="edited"> Edit</label><label><input type="radio" name="${escapeHtml(decision.id)}" value="rejected"> Reject</label><label>Reviewer note<textarea name="${escapeHtml(decision.id)}-note"></textarea></label></fieldset>`).join("");
const approvalHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>M3-S3 Frost Crystal approval</title><style>body{font:16px system-ui;max-width:1100px;margin:32px auto;padding:0 20px;color:#10243c;background:#f2f8fc}h1,h2{color:#153d63}section,fieldset{background:white;border:1px solid #b7cfdf;border-radius:10px;padding:16px;margin:16px 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #c8d9e5;padding:8px;text-align:left;vertical-align:top}code{font-size:11px;word-break:break-all}.blocked{border-left:6px solid #b3261e}label{display:block;margin:8px 0}textarea{display:block;width:100%;min-height:60px}</style></head><body><h1>M3-S3 Frost Crystal intake approval</h1><section><strong>Status:</strong> Pending human approval. This package does not approve analysis proposals or authorize reconstruction.</section><section><h2>Source preflight</h2><table><thead><tr><th>Source</th><th>Type</th><th>SHA-256</th><th>Seam</th><th>No concept pixels</th></tr></thead><tbody>${sourceRows}</tbody></table></section><section><h2>Four-component reuse plan</h2><table><thead><tr><th>Type</th><th>Materials</th><th>Deterministic boundary</th></tr></thead><tbody>${reuseRows}</tbody></table></section><section class="blocked"><h2>Draft/reconstruction gate: blocked</h2><p>${escapeHtml(approvalPackage.draftGenerationGate.reason)}</p><p>Blocking proposals: ${escapeHtml(approvalPackage.draftGenerationGate.blockingProposalIds.join(", "))}</p></section><form><h2>Human decisions</h2>${decisionControls}<fieldset><legend>Reviewer identity</legend><label>Name/ID<input name="reviewer-id"></label><label>Role<input name="reviewer-role"></label><label>Reviewed at<input type="datetime-local" name="reviewed-at"></label></fieldset></form></body></html>`;
const approvalRecordHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>M3-S3 Frostbound approval record</title><style>body{font:16px system-ui;max-width:1000px;margin:32px auto;padding:0 20px;color:#10243c;background:#f2f8fc}section{background:white;border:1px solid #b7cfdf;border-radius:10px;padding:16px;margin:16px 0}.ready{border-left:6px solid #198754}code{font-size:12px}</style></head><body><h1>M3-S3 Frostbound approval record</h1><section class="ready"><strong>Status:</strong> Approved as drafted (Option A). M3-S4 gate is ready.</section><section><h2>Accepted critical proposals</h2><ul>${packageApproval.acceptedProposalValues.map(({ proposalId, targetPath, value }) => `<li><code>${escapeHtml(proposalId)}</code> → <code>${escapeHtml(targetPath)}</code> = <code>${escapeHtml(JSON.stringify(value))}</code></li>`).join("")}</ul></section><section><h2>Accepted package</h2><p>Material pack <code>frost-crystal-materials@0.1.0</code>, the four-component reuse plan, and the five-item component inventory were accepted without edits.</p><p>Reviewer: ${escapeHtml(packageApproval.reviewer.id)} · ${escapeHtml(packageApproval.approvedAt)}</p></section><section><h2>Boundary retained</h2><p>Concept pixels and component-specific material effects remain prohibited. Reconstruction must use deterministic geometry and the approved source bindings.</p></section></body></html>`;

await writeFile(resolve(outputDirectory, "preflight.json"), stableJson(preflight), "utf8");
await writeFile(resolve(outputDirectory, "reuse-plan.json"), stableJson(reusePlan), "utf8");
await writeFile(resolve(outputDirectory, "approval-package.json"), stableJson(approvalPackage), "utf8");
await writeFile(resolve(outputDirectory, "approval.html"), `${approvalHtml}\n`, "utf8");
await writeFile(resolve(outputDirectory, "approved-analysis-review.json"), stableJson(approvedReview), "utf8");
await writeFile(resolve(outputDirectory, "approved-token-lineage.json"), stableJson(approvedTokenLineage), "utf8");
await writeFile(resolve(outputDirectory, "approved-package.json"), stableJson(approvedPackage), "utf8");
await writeFile(resolve(outputDirectory, "approval-record.html"), `${approvalRecordHtml}\n`, "utf8");
await writeFile(resolve(outputDirectory, "evidence-index.json"), stableJson({
  schemaVersion: "1.0",
  id: "m3-s3-frost-crystal-intake-evidence",
  version: "0.1.0",
  status: "approved-for-m3-s4",
  artifacts: ["preflight.json", "reuse-plan.json", "approval-package.json", "approval.html", "approved-analysis-review.json", "approved-token-lineage.json", "approved-package.json", "approval-record.html", ...pack.sources.map(({ id }) => `${id}-isolation.svg`)],
  note: "The original pending artifacts are preserved; Option A approval is recorded append-only and unblocks M3-S4."
}), "utf8");
console.log(`Prepared M3-S3 Frost Crystal intake evidence in ${outputDirectory}.`);
