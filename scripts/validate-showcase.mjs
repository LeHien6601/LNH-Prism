import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const html = await readFile(resolve("showcase/index.html"), "utf8");
for (const state of ["normal", "pressed", "disabled"]) {
  if (!html.includes(`data-state="${state}"`)) throw new Error(`Showcase is missing the ${state} state specimen.`);
  for (const size of [160, 240]) await access(resolve(`showcase/generated/primary-button/${state}/${size}/primary-button.svg`));
}
for (const height of [240, 360]) {
  await access(resolve(`showcase/generated/primary-panel/${height}/primary-panel.svg`));
}
if (!html.includes('data-component="primary-panel"')) throw new Error("Showcase is missing the Primary Panel specimens.");
if (!html.includes('data-content-offset="2"')) throw new Error("Showcase is missing the approved pressed content-slot offset.");
for (const layer of ["Content slot", "Highlight", "Border", "Grain", "Fill", "Shadow"]) {
  if (!html.includes(`<li>${layer}</li>`)) throw new Error(`Showcase is missing the ${layer} layer name.`);
}
if (!html.includes("id=\"scenario-preview\"")) throw new Error("Showcase is missing the real-scenario preview.");
console.log("validated Button and Panel showcase assets, content slots, layer stacks, and scenario preview");
