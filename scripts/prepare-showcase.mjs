import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { writePrimaryButtonProof } from "../dist/renderer/primary-button.js";
import { writePrimaryPanelProof } from "../dist/renderer/primary-panel.js";
import { writePrimaryProgressBarProof } from "../dist/renderer/primary-progress-bar.js";
import { BUTTON_WIDTH_BOUNDS, PROGRESS_REVIEW_PERCENTAGES, PROGRESS_WIDTH_BOUNDS } from "../dist/renderer/svg-recipes.js";
import { buildClassicBrowserRecipes } from "./browser-recipes.mjs";

const outputRoot = resolve("showcase/generated");
const buttonManifests = await writePrimaryButtonProof(outputRoot);
const panelManifests = await writePrimaryPanelProof(outputRoot);
const progressBarManifests = await writePrimaryProgressBarProof(outputRoot);
const registry = {
  generatedAt: new Date().toISOString(),
  components: [
    {
      id: "primary-button",
      title: "Primary Button",
      states: ["normal", "pressed", "disabled"],
      sizes: [160, 240],
      interactiveBounds: BUTTON_WIDTH_BOUNDS,
      layersTopToBottom: ["Content slot", "Highlight", "Border", "Fill", "Connected extrusion"],
      pathPattern: "primary-button/{state}/{size}/primary-button.svg"
    },
    {
      id: "primary-panel",
      title: "Primary Panel",
      states: ["normal"],
      sizes: ["432x240", "432x360"],
      layersTopToBottom: ["Content slot", "Highlight", "Border", "Grain", "Fill", "Connected extrusion"],
      pathPattern: "primary-panel/{height}/primary-panel.svg"
    },
    {
      id: "primary-progress-bar",
      title: "Primary Progress Bar",
      states: ["normal"],
      sizes: [320, 432],
      percentages: [10, 50, 90],
      interactiveBounds: { width: PROGRESS_WIDTH_BOUNDS, percent: { min: 0, max: 100 } },
      reviewPercentages: PROGRESS_REVIEW_PERCENTAGES,
      parts: ["frame", "fill"],
      layersTopToBottom: ["Fill highlight", "Value fill", "Frame border", "Track fill", "Frame connected extrusion"],
      pathPatterns: {
        frame: "primary-progress-bar/{width}/primary-progress-bar-frame.svg",
        fill: "primary-progress-bar/{width}/primary-progress-bar-fill-{percent}.svg"
      }
    }
  ],
  manifests: [...buttonManifests, ...panelManifests, ...progressBarManifests].map(({ assetId, renderer, sources, provenance, outputs }) => ({ assetId, renderer, sources, provenance, outputs }))
};

await mkdir(outputRoot, { recursive: true });
await writeFile(resolve(outputRoot, "component-registry.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8");
await writeFile(resolve(outputRoot, "component-registry.js"), `globalThis.LNHPrismShowcaseData = Object.freeze(${JSON.stringify(registry)});\n`, "utf8");
const compiledRecipes = await readFile(resolve("dist/renderer/svg-recipes.js"), "utf8");
await writeFile(resolve(outputRoot, "renderer-recipes.js"), buildClassicBrowserRecipes(compiledRecipes), "utf8");
console.log(`Prepared component showcase assets in ${outputRoot}.`);
