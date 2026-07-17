import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  assertFourComponentReuse,
  preflightFrostCrystalSource,
  renderFrostCrystalIsolationSvg
} from "../dist/materials/frost-crystal.js";

const outputDirectory = resolve("docs/validation/evidence/m3-s3-frost-crystal-intake");
const pack = JSON.parse(await readFile(resolve("specs/examples/frost-crystal-materials.draft.json"), "utf8"));
const preflight = JSON.parse(await readFile(resolve(outputDirectory, "preflight.json"), "utf8"));
const reusePlan = JSON.parse(await readFile(resolve(outputDirectory, "reuse-plan.json"), "utf8"));
const approval = JSON.parse(await readFile(resolve(outputDirectory, "approval-package.json"), "utf8"));
const approvedReview = JSON.parse(await readFile(resolve(outputDirectory, "approved-analysis-review.json"), "utf8"));
const approvedLineage = JSON.parse(await readFile(resolve(outputDirectory, "approved-token-lineage.json"), "utf8"));
const approvedPackage = JSON.parse(await readFile(resolve(outputDirectory, "approved-package.json"), "utf8"));
const approvedPackContent = await readFile(resolve("specs/examples/frost-crystal-materials.json"), "utf8");
const approvedPack = JSON.parse(approvedPackContent);
const index = JSON.parse(await readFile(resolve(outputDirectory, "evidence-index.json"), "utf8"));
const conceptHash = "19d55d8ed0d1a2b8949bcd135ecd95ad2d0b5920846a843b652949eb02712383";

if (pack.status !== "draft" || approval.status !== "pending-human-approval") throw new Error("M3-S3 artifacts must remain draft/pending until explicit human approval.");
if (approval.draftGenerationGate.status !== "blocked" || approval.reconstructionGate.status !== "blocked") throw new Error("M3-S4 must remain blocked before human approval.");
if (approval.analysisReview.status !== "blocked" || approval.analysisReview.blockingProposalIds.length === 0) throw new Error("Pending critical analysis proposals must remain visible blockers.");
if (!approval.decisionsRequired.every(({ status }) => status === "pending")) throw new Error("The generated approval package must not pre-decide human choices.");
if (approvedReview.mappingGate.status !== "ready" || approvedReview.mappingGate.blockingProposalIds.length !== 0 || !approvedReview.reviews.every(({ disposition }) => disposition === "accepted")) throw new Error("Option A must explicitly accept every critical proposal.");
if (approvedPack.status !== "approved" || approvedPackage.status !== "approved" || approvedPackage.decision !== "option-a-as-drafted") throw new Error("Approved material and package records must retain the confirmed Option A decision.");
if (approvedPackage.m3S4Gate.status !== "ready" || approvedPackage.reconstructionGate.status !== "ready") throw new Error("Recorded approval must unblock M3-S4.");
if (approvedLineage.length !== 4 || new Set(approvedLineage.map(({ sourceProposalId }) => sourceProposalId)).size !== 4) throw new Error("Approved token lineage must contain every critical proposal exactly once.");
const approvedPackHash = createHash("sha256").update(approvedPackContent.replaceAll("\r\n", "\n")).digest("hex");
if (approvedPackage.materialIntake.approvedPackSha256 !== approvedPackHash) throw new Error("Approved material pack hash drifted from the approval evidence.");
if (preflight.status !== "pass" || !Object.values(preflight.checks).every(Boolean)) throw new Error("Frost Crystal preflight did not pass every source check.");
assertFourComponentReuse(reusePlan.bindings);
if (reusePlan.componentTypeCount !== 4) throw new Error("Reuse evidence must cover four distinct component types.");

for (const declaration of pack.sources) {
  const content = await readFile(resolve(declaration.path), "utf8");
  const source = JSON.parse(content);
  preflightFrostCrystalSource(source);
  const hash = createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex");
  if (hash !== declaration.sha256) throw new Error(`${source.id} hash drifted.`);
  if (content.includes(conceptHash) || content.includes("v3-frostbound-reward-concept.png")) throw new Error(`${source.id} contains prohibited concept provenance.`);
  const actualPreview = await readFile(resolve(outputDirectory, `${source.id}-isolation.svg`), "utf8");
  if (actualPreview !== `${renderFrostCrystalIsolationSvg(source.id)}\n`) throw new Error(`${source.id} isolation preview is not deterministic.`);
}

const approvalHtml = await readFile(resolve(outputDirectory, "approval.html"), "utf8");
for (const required of ["Pending human approval", "Draft/reconstruction gate: blocked", "Human decisions", "Reviewer identity", "No concept pixels"]) {
  if (!approvalHtml.includes(required)) throw new Error(`Approval form is missing: ${required}.`);
}
const approvalRecordHtml = await readFile(resolve(outputDirectory, "approval-record.html"), "utf8");
for (const required of ["Approved as drafted (Option A)", "M3-S4 gate is ready", "Concept pixels and component-specific material effects remain prohibited"]) {
  if (!approvalRecordHtml.includes(required)) throw new Error(`Approval record is missing: ${required}.`);
}
if (index.status !== "approved-for-m3-s4" || !index.note.includes("append-only")) throw new Error("Evidence index must preserve pending history and record M3-S4 approval.");
console.log("validated M3-S3 pending history, Option A approval, lineage, material intake, and ready M3-S4 gate");
