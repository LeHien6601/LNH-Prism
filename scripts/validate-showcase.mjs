import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const html = await readFile(resolve("showcase/index.html"), "utf8");
const registry = JSON.parse(await readFile(resolve("showcase/generated/component-registry.json"), "utf8"));
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
if (!html.includes('data-content-offset="2"')) throw new Error("Showcase is missing the approved pressed content-slot offset.");
for (const layer of ["Content slot", "Highlight", "Border", "Grain", "Fill", "Shadow", "Fill highlight", "Value fill", "Frame border", "Track fill", "Frame shadow"]) {
  if (!html.includes(`<li>${layer}</li>`)) throw new Error(`Showcase is missing the ${layer} layer name.`);
}
if (!html.includes("Frame · independent") || !html.includes("Fill · independent")) throw new Error("Showcase does not expose the independent Progress Bar frame and fill.");
if (!html.includes('alt="Mission readiness at 90 percent"')) throw new Error("Combined scenario is missing the Progress Bar.");
if (!html.includes("id=\"scenario-preview\"")) throw new Error("Showcase is missing the real-scenario preview.");
console.log("validated Button, Panel, and Progress Bar showcase assets, independent parts, layer stacks, and scenario preview");
