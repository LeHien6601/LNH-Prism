import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderNeonAlloyIsolationSvg } from "../dist/materials/neon-alloy.js";

const outputDirectory = resolve("docs/validation/evidence/m2-s2-neon-alloy");
for (const sourceId of ["alloy-grain", "alloy-circuit-pattern", "alloy-holo-accent"]) {
  const path = resolve(outputDirectory, `${sourceId}-isolation.svg`);
  const actual = await readFile(path, "utf8");
  const expected = `${renderNeonAlloyIsolationSvg(sourceId)}\n`;
  if (actual !== expected) throw new Error(`${path} does not match the deterministic Neon Alloy isolation recipe.`);
}
console.log("validated M2-S2 Neon Alloy deterministic isolation previews");
