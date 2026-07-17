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
const index = JSON.parse(await readFile(resolve(outputDirectory, "evidence-index.json"), "utf8"));
const conceptHash = "19d55d8ed0d1a2b8949bcd135ecd95ad2d0b5920846a843b652949eb02712383";

if (pack.status !== "draft" || approval.status !== "pending-human-approval") throw new Error("M3-S3 artifacts must remain draft/pending until explicit human approval.");
if (approval.draftGenerationGate.status !== "blocked" || approval.reconstructionGate.status !== "blocked") throw new Error("M3-S4 must remain blocked before human approval.");
if (approval.analysisReview.status !== "blocked" || approval.analysisReview.blockingProposalIds.length === 0) throw new Error("Pending critical analysis proposals must remain visible blockers.");
if (!approval.decisionsRequired.every(({ status }) => status === "pending")) throw new Error("The generated approval package must not pre-decide human choices.");
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
if (index.status !== "ready-for-human-review" || !index.caveat.includes("unapproved")) throw new Error("Evidence index must state the pending approval boundary.");
console.log("validated M3-S3 Frost Crystal intake, reuse, no-pixel audit, and pending approval package");
