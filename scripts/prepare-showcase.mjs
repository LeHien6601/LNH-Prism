import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { writePrimaryButtonProof } from "../dist/renderer/primary-button.js";
import { writePrimaryPanelProof } from "../dist/renderer/primary-panel.js";

const outputRoot = resolve("showcase/generated");
const buttonManifests = await writePrimaryButtonProof(outputRoot);
const panelManifests = await writePrimaryPanelProof(outputRoot);
const registry = {
  generatedAt: new Date().toISOString(),
  components: [
    {
      id: "primary-button",
      title: "Primary Button",
      states: ["normal", "pressed", "disabled"],
      sizes: [160, 240],
      layersTopToBottom: ["Content slot", "Highlight", "Border", "Fill", "Shadow"],
      pathPattern: "primary-button/{state}/{size}/primary-button.svg"
    },
    {
      id: "primary-panel",
      title: "Primary Panel",
      states: ["normal"],
      sizes: ["432x240", "432x360"],
      layersTopToBottom: ["Content slot", "Highlight", "Border", "Grain", "Fill", "Shadow"],
      pathPattern: "primary-panel/{height}/primary-panel.svg"
    }
  ],
  manifests: [...buttonManifests, ...panelManifests].map(({ assetId, renderer, sources, outputs }) => ({ assetId, renderer, sources, outputs }))
};

await mkdir(outputRoot, { recursive: true });
await writeFile(resolve(outputRoot, "component-registry.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8");
console.log(`Prepared component showcase assets in ${outputRoot}.`);
