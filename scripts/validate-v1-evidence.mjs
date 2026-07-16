import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const evidenceHtml = await readFile(resolve("showcase/v1-evidence.html"), "utf8");
const evidencePackage = await readFile(resolve("docs/validation/evidence/v1-neon-core-core-components/README.md"), "utf8");
const validationRecord = await readFile(resolve("docs/validation/records/v1-neon-core-core-components.md"), "utf8");

for (const background of ["light", "dark"]) {
  if (!evidenceHtml.includes(`data-review-background="${background}"`)) throw new Error(`V1 evidence is missing the ${background} review background.`);
}
for (const scale of [1, 2]) {
  if (!evidenceHtml.includes(`data-review-scale="${scale}"`)) throw new Error(`V1 evidence is missing the ${scale * 100}% inspection control.`);
}
for (let evidenceId = 1; evidenceId <= 6; evidenceId += 1) {
  const id = `V1-E0${evidenceId}`;
  if (!evidencePackage.includes(id) || !validationRecord.includes(id)) throw new Error(`V1 evidence package or record is missing ${id}.`);
}

const buttonLayers = ["layer-shadow", "layer-fill", "layer-border", "layer-highlight", "layer-content-slot"];
for (const state of ["normal", "pressed", "disabled"]) {
  for (const size of [160, 240]) {
    const path = resolve(`showcase/generated/primary-button/${state}/${size}/primary-button.svg`);
    await access(path);
    const svg = await readFile(path, "utf8");
    for (const layer of buttonLayers) if (!svg.includes(`id="${layer}"`)) throw new Error(`${path} is missing ${layer}.`);
    if (/<text\b/i.test(svg)) throw new Error(`${path} contains baked text.`);
    if (!evidenceHtml.includes(`generated/primary-button/${state}/${size}/primary-button.svg`)) throw new Error(`V1 evidence page is missing ${state} Primary Button ${size}.`);
  }
}

const panelLayers = ["layer-shadow", "layer-fill", "layer-grain", "layer-border", "layer-highlight", "layer-content-slot"];
for (const height of [240, 360]) {
  const path = resolve(`showcase/generated/primary-panel/${height}/primary-panel.svg`);
  await access(path);
  const svg = await readFile(path, "utf8");
  for (const layer of panelLayers) if (!svg.includes(`id="${layer}"`)) throw new Error(`${path} is missing ${layer}.`);
  if (/<text\b/i.test(svg)) throw new Error(`${path} contains baked text.`);
  if (!evidenceHtml.includes(`generated/primary-panel/${height}/primary-panel.svg`)) throw new Error(`V1 evidence page is missing Primary Panel ${height}.`);
}

const progressFrameLayers = ["layer-frame-shadow", "layer-frame-fill", "layer-frame-border"];
const progressFillLayers = ["layer-progress-fill", "layer-progress-highlight"];
for (const width of [320, 432]) {
  const framePath = resolve(`showcase/generated/primary-progress-bar/${width}/primary-progress-bar-frame.svg`);
  const frame = await readFile(framePath, "utf8");
  for (const layer of progressFrameLayers) if (!frame.includes(`id="${layer}"`)) throw new Error(`${framePath} is missing ${layer}.`);
  if (frame.includes('data-part="fill"')) throw new Error(`${framePath} incorrectly contains the fill part.`);
  for (const percent of [10, 50, 90]) {
    const relativeFillPath = `generated/primary-progress-bar/${width}/primary-progress-bar-fill-${percent}.svg`;
    const fillPath = resolve(`showcase/${relativeFillPath}`);
    const fill = await readFile(fillPath, "utf8");
    for (const layer of progressFillLayers) if (!fill.includes(`id="${layer}"`)) throw new Error(`${fillPath} is missing ${layer}.`);
    if (fill.includes('data-part="frame"')) throw new Error(`${fillPath} incorrectly contains the frame part.`);
    if (/<text\b/i.test(fill)) throw new Error(`${fillPath} contains baked text.`);
    if (!evidenceHtml.includes(relativeFillPath)) throw new Error(`V1 evidence page is missing Progress Bar ${width} at ${percent}%.`);
  }
}

if (!evidenceHtml.includes('data-independent-parts="primary-progress-bar"')) throw new Error("V1 evidence does not expose independent Progress Bar parts.");

const isReadyForReview = validationRecord.includes("Ready for human review")
  && validationRecord.includes("**Weighted score:** Pending");
const hasRecordedScore = /\*\*Weighted score:\*\*\s+\d+(?:\.\d+)?\s*\/\s*100/.test(validationRecord);
const hasRecordedBlockers = validationRecord.includes("**Automatic blockers:**")
  && !validationRecord.includes("**Automatic blockers:** Pending");
const hasGateDecision = /\*\*Rubric-computed decision:\*\*.*(?:Pass|Conditional pass|Fail)/.test(validationRecord);
const isReviewed = validationRecord.includes("Reviewed")
  && hasRecordedScore
  && hasRecordedBlockers
  && hasGateDecision;

if (!isReadyForReview && !isReviewed) {
  throw new Error("V1 validation record must be either ready and unscored or reviewed with a numeric score, blocker disposition, and rubric-computed decision.");
}

if (isReviewed && validationRecord.includes("Rubric-computed decision:** 🔴 Fail")) {
  if (!validationRecord.includes("| 🟡 Open |")) throw new Error("A failed V1 review must record at least one open corrective finding.");
  if (!validationRecord.includes("Revalidation must append")) throw new Error("A failed V1 review must preserve the original result and define append-only revalidation.");
}

console.log(`validated V1-E01 through V1-E06 package, structured SVG assets, review backgrounds, and ${isReviewed ? "recorded gate result" : "unscored human record"}`);
