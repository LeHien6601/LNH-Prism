import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { Resvg } from "@resvg/resvg-js";
import { renderNeonMarketScenarioSvg } from "../../dist/renderer/neon-market-scenario.js";

function rgbaAt(rendered, x, y) {
  const offset = (y * rendered.width + x) * 4;
  return Array.from(rendered.pixels.subarray(offset, offset + 4));
}

test("M2 Neon Market scenario composes all six shared component types deterministically on inspection surfaces", () => {
  for (const surface of ["dark", "light"]) {
    const svg = renderNeonMarketScenarioSvg(surface);
    assert.equal(createHash("sha256").update(svg).digest("hex"), createHash("sha256").update(renderNeonMarketScenarioSvg(surface)).digest("hex"));
    assert.match(svg, /NEON MARKET/); assert.equal((svg.match(/data:image\/svg\+xml/g) ?? []).length, 8);
  }
});

test("light inspection output preserves opaque component pixels", () => {
  const dark = new Resvg(renderNeonMarketScenarioSvg("dark")).render();
  const light = new Resvg(renderNeonMarketScenarioSvg("light")).render();

  assert.deepEqual(rgbaAt(dark, 100, 100), [6, 19, 31, 255]);
  assert.deepEqual(rgbaAt(light, 100, 100), [231, 246, 255, 255]);

  for (const [x, y] of [[540, 600], [540, 900], [800, 450], [540, 1020]]) {
    const darkPixel = rgbaAt(dark, x, y);
    const lightPixel = rgbaAt(light, x, y);
    assert.deepEqual(lightPixel, darkPixel, `component pixel changed at ${x},${y}`);
    assert.equal(lightPixel[3], 255, `component pixel is not opaque at ${x},${y}`);
    assert.notDeepEqual(lightPixel.slice(0, 3), [0, 0, 0], `component pixel is black at ${x},${y}`);
  }
});

test("M2 browser recipe is byte-equivalent to the compiled CLI recipe", async () => {
  const script = await readFile(new URL("../../docs/validation/evidence/m2-s4-neon-market/m2-browser-recipes.js", import.meta.url), "utf8");
  const context = { globalThis: {} };
  vm.runInNewContext(script, context);
  const request = { component: "badge", width: 160, height: 44, state: "highlighted", accentDecal: true };
  assert.equal(context.globalThis.LNHPrismM2Recipes.renderNeonAlloyComponentSvg(request), (await import("../../dist/renderer/neon-alloy-components.js")).renderNeonAlloyComponentSvg(request));
});
