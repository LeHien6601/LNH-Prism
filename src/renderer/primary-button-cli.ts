import { resolve } from "node:path";
import { writePrimaryButtonProof } from "./primary-button.js";

const outputFlag = process.argv.indexOf("--output");
const outputRoot = outputFlag >= 0 && process.argv[outputFlag + 1] ? process.argv[outputFlag + 1] : "exports";
const manifests = await writePrimaryButtonProof(resolve(outputRoot));
console.log(`Rendered ${manifests.length} Primary Button state/size combinations to ${resolve(outputRoot)}.`);
