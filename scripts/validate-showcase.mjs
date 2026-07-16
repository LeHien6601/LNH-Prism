import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import {
  PROGRESS_REVIEW_PERCENTAGES,
  renderPrimaryButtonSvg,
  renderProgressFillSvg,
  renderProgressFrameSvg
} from "../dist/renderer/svg-recipes.js";

const html = await readFile(resolve("showcase/index.html"), "utf8");
const registry = JSON.parse(await readFile(resolve("showcase/generated/component-registry.json"), "utf8"));
const browserRecipeSource = await readFile(resolve("showcase/generated/renderer-recipes.js"), "utf8");
const browserRegistrySource = await readFile(resolve("showcase/generated/component-registry.js"), "utf8");
const browserContext = { globalThis: {} };
runInNewContext(browserRecipeSource, browserContext);
const browserRecipes = browserContext.globalThis.LNHPrismRecipes;
if (!browserRecipes) throw new Error("Showcase browser recipes did not initialize.");
if (!browserRegistrySource.includes("globalThis.LNHPrismShowcaseData")) throw new Error("Showcase browser registry did not initialize.");
for (const state of ["normal", "pressed", "disabled"]) {
  if (!html.includes(`data-state="${state}"`)) throw new Error(`Showcase is missing the ${state} state specimen.`);
  for (const size of [160, 240]) await access(resolve(`showcase/generated/primary-button/${state}/${size}/primary-button.svg`));
}
for (const height of [240, 360]) {
  await access(resolve(`showcase/generated/primary-panel/${height}/primary-panel.svg`));
}
for (const width of [320, 432]) {
  await access(resolve(`showcase/generated/primary-progress-bar/${width}/primary-progress-bar-frame.svg`));
  if (!html.includes(`data-progress-width="${width}"`)) throw new Error(`Showcase is missing the ${width}-pixel Progress Bar specimen.`);
  for (const percent of [10, 50, 90]) {
    await access(resolve(`showcase/generated/primary-progress-bar/${width}/primary-progress-bar-fill-${percent}.svg`));
    if (!html.includes(`generated/primary-progress-bar/${width}/primary-progress-bar-fill-${percent}.svg`)) {
      throw new Error(`Showcase is missing the ${width}-pixel Progress Bar at ${percent} percent.`);
    }
  }
}
if (!html.includes('data-component="primary-panel"')) throw new Error("Showcase is missing the Primary Panel specimens.");
if (!html.includes('data-component="primary-progress-bar"')) throw new Error("Showcase is missing the Primary Progress Bar specimens.");
const progressRegistry = registry.components.find(({ id }) => id === "primary-progress-bar");
if (!progressRegistry) throw new Error("Showcase registry is missing the Primary Progress Bar.");
if (JSON.stringify(progressRegistry.sizes) !== JSON.stringify([320, 432])) throw new Error("Showcase registry has incorrect Progress Bar widths.");
if (JSON.stringify(progressRegistry.percentages) !== JSON.stringify([10, 50, 90])) throw new Error("Showcase registry has incorrect Progress Bar percentages.");
if (JSON.stringify(progressRegistry.parts) !== JSON.stringify(["frame", "fill"])) throw new Error("Showcase registry does not preserve independent Progress Bar parts.");
if (JSON.stringify(progressRegistry.reviewPercentages) !== JSON.stringify(PROGRESS_REVIEW_PERCENTAGES)) throw new Error("Showcase registry is missing required Progress edge values.");
for (const logicalWidth of [160, 200, 240]) {
  for (const state of ["normal", "pressed", "disabled"]) {
    const request = { logicalWidth, state };
    if (browserRecipes.renderPrimaryButtonSvg(request) !== renderPrimaryButtonSvg(request)) throw new Error(`Browser and CLI Button recipes drifted at ${logicalWidth}/${state}.`);
  }
}
for (const logicalWidth of [320, 376, 432]) {
  if (browserRecipes.renderProgressFrameSvg(logicalWidth) !== renderProgressFrameSvg(logicalWidth)) throw new Error(`Browser and CLI Progress frame recipes drifted at ${logicalWidth}.`);
  for (const percent of PROGRESS_REVIEW_PERCENTAGES) {
    const request = { logicalWidth, percent };
    if (browserRecipes.renderProgressFillSvg(request) !== renderProgressFillSvg(request)) throw new Error(`Browser and CLI Progress fill recipes drifted at ${logicalWidth}/${percent}.`);
  }
}
for (const [render, request] of [
  [browserRecipes.renderPrimaryButtonSvg, { logicalWidth: 159, state: "normal" }],
  [browserRecipes.renderProgressFillSvg, { logicalWidth: 319, percent: 50 }],
  [browserRecipes.renderProgressFillSvg, { logicalWidth: 376, percent: 101 }]
]) {
  let rejected = false;
  try { render(request); } catch (error) { rejected = error?.name === "RangeError"; }
  if (!rejected) throw new Error("Browser recipe accepted an out-of-contract parameter.");
}
for (const requiredMarkup of [
  'data-interactive-lab="cr-002"',
  'id="lab-button-width"',
  'id="lab-button-state"',
  'id="lab-progress-width"',
  'id="lab-progress-percent"',
  'data-traceability="interactive-preview"',
  'src="generated/renderer-recipes.js"',
  'src="generated/component-registry.js"'
]) {
  if (!html.includes(requiredMarkup)) throw new Error(`Showcase is missing CR-002 markup: ${requiredMarkup}.`);
}
if (!html.includes('data-content-offset="2"')) throw new Error("Showcase is missing the approved pressed content-slot offset.");
for (const layer of ["Content slot", "Highlight", "Border", "Grain", "Fill", "Connected extrusion", "Fill highlight", "Value fill", "Frame border", "Track fill", "Frame connected extrusion"]) {
  if (!html.includes(`<li>${layer}</li>`)) throw new Error(`Showcase is missing the ${layer} layer name.`);
}
if (!html.includes("Frame · independent") || !html.includes("Fill · independent")) throw new Error("Showcase does not expose the independent Progress Bar frame and fill.");
if (!html.includes('alt="Mission readiness at 90 percent"')) throw new Error("Combined scenario is missing the Progress Bar.");
if (!html.includes("id=\"scenario-preview\"")) throw new Error("Showcase is missing the real-scenario preview.");
console.log("validated static assets, CR-002 browser/CLI recipe equivalence, bounded edge values, traceability, and scenario preview");
