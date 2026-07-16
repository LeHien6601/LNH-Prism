import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { renderNeonMarketScenarioSvg } from "../dist/renderer/neon-market-scenario.js";
import { buildM2BrowserRecipes } from "./browser-recipes.mjs";
const output = resolve("docs/validation/evidence/m2-s4-neon-market");
await mkdir(output, { recursive: true });
for (const surface of ["dark", "light"]) {
  const svg = renderNeonMarketScenarioSvg(surface);
  await writeFile(resolve(output, `neon-market-${surface}.svg`), `${svg}\n`, "utf8");
  await writeFile(resolve(output, `neon-market-${surface}.png`), new Resvg(svg).render().asPng());
}
const [materials, components] = await Promise.all([readFile(resolve("dist/materials/neon-alloy.js"), "utf8"), readFile(resolve("dist/renderer/neon-alloy-components.js"), "utf8")]);
await writeFile(resolve(output, "m2-browser-recipes.js"), buildM2BrowserRecipes(materials, components), "utf8");
console.log(`Prepared M2-S4 scenario evidence in ${output}.`);
