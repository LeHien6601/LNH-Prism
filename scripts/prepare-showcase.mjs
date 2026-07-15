import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { writePrimaryButtonProof } from "../dist/renderer/primary-button.js";

const outputRoot = resolve("showcase/generated");
const manifests = await writePrimaryButtonProof(outputRoot);
const registry = {
  generatedAt: new Date().toISOString(),
  components: [{ id: "primary-button", title: "Primary Button", states: ["normal", "pressed", "disabled"], sizes: [160, 240], pathPattern: "primary-button/{state}/{size}/primary-button.svg" }],
  manifests: manifests.map(({ assetId, renderer, sources, outputs }) => ({ assetId, renderer, sources, outputs }))
};

await mkdir(outputRoot, { recursive: true });
await writeFile(resolve(outputRoot, "component-registry.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8");
console.log(`Prepared component showcase assets in ${outputRoot}.`);
