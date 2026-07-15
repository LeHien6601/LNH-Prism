import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const html = await readFile(resolve("showcase/index.html"), "utf8");
for (const state of ["normal", "pressed", "disabled"]) {
  if (!html.includes(`data-state="${state}"`)) throw new Error(`Showcase is missing the ${state} state specimen.`);
  for (const size of [160, 240]) await access(resolve(`showcase/generated/primary-button/${state}/${size}/primary-button.svg`));
}
if (!html.includes("id=\"scenario-preview\"")) throw new Error("Showcase is missing the real-scenario preview.");
console.log("validated Primary Button showcase assets and scenario preview");
