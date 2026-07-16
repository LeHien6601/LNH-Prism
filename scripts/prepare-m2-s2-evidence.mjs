import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderNeonAlloyIsolationSvg } from "../dist/materials/neon-alloy.js";

const outputDirectory = resolve("docs/validation/evidence/m2-s2-neon-alloy");
const sourceIds = ["alloy-grain", "alloy-circuit-pattern", "alloy-holo-accent"];

await mkdir(outputDirectory, { recursive: true });
for (const sourceId of sourceIds) {
  await writeFile(resolve(outputDirectory, `${sourceId}-isolation.svg`), `${renderNeonAlloyIsolationSvg(sourceId)}\n`, "utf8");
}
console.log(`Prepared M2-S2 Neon Alloy isolation previews in ${outputDirectory}.`);
