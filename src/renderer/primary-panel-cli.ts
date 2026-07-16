import { resolve } from "node:path";
import { writePrimaryPanelProof } from "./primary-panel.js";

const outputFlag = process.argv.indexOf("--output");
const outputRoot = outputFlag >= 0 && process.argv[outputFlag + 1] ? process.argv[outputFlag + 1] : "exports";
const manifests = await writePrimaryPanelProof(resolve(outputRoot));
console.log(`Rendered ${manifests.length} Primary Panel sizes to ${resolve(outputRoot)}.`);
