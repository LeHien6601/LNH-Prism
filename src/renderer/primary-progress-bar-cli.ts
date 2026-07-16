import { resolve } from "node:path";
import { writePrimaryProgressBarProof } from "./primary-progress-bar.js";

const outputFlag = process.argv.indexOf("--output");
const outputRoot = outputFlag >= 0 && process.argv[outputFlag + 1] ? process.argv[outputFlag + 1] : "exports";
const manifests = await writePrimaryProgressBarProof(resolve(outputRoot));
console.log(`Rendered ${manifests.length} Primary Progress Bar width sets to ${resolve(outputRoot)}.`);
