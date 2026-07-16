import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { renderNeonMarketScenarioSvg } from "../../dist/renderer/neon-market-scenario.js";
test("M2 Neon Market scenario composes all six shared component types deterministically on inspection surfaces", () => {
  for (const surface of ["dark", "light"]) {
    const svg = renderNeonMarketScenarioSvg(surface);
    assert.equal(createHash("sha256").update(svg).digest("hex"), createHash("sha256").update(renderNeonMarketScenarioSvg(surface)).digest("hex"));
    assert.match(svg, /NEON MARKET/); assert.equal((svg.match(/data:image\/svg\+xml/g) ?? []).length, 8);
  }
});

test("M2 browser recipe is byte-equivalent to the compiled CLI recipe", async () => {
  const script = await readFile(new URL("../../docs/validation/evidence/m2-s4-neon-market/m2-browser-recipes.js", import.meta.url), "utf8");
  const context = { globalThis: {} };
  vm.runInNewContext(script, context);
  const request = { component: "badge", width: 160, height: 44, state: "highlighted", accentDecal: true };
  assert.equal(context.globalThis.LNHPrismM2Recipes.renderNeonAlloyComponentSvg(request), (await import("../../dist/renderer/neon-alloy-components.js")).renderNeonAlloyComponentSvg(request));
});
