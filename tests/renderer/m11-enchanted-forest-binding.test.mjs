import assert from "node:assert/strict";
import test from "node:test";
import { renderStyledComponentSvg, renderStyledProgressSvg } from "../../dist/renderer/style-composition.js";
import { M11_ENCHANTED_FOREST_BINDING, M11_ENCHANTED_FOREST_LIMITS, M11_ENCHANTED_FOREST_LIGHTING } from "../../dist/styles/m11-enchanted-forest-binding.js";

test("M11 binds the shared composition seam with bounded organic variation", () => {
  const request = { component: "panel", width: 488, height: 660, variationSeed: 51731 };
  const panel = renderStyledComponentSvg(request, M11_ENCHANTED_FOREST_BINDING);
  assert.match(panel, /data-style="m11-enchanted-forest@0.1.0"/);
  assert.match(panel, /data-layer="luminous-seed-focal"/);
  assert.match(panel, /data-layer="forest-ornament"/);
  assert.match(panel, /data-variation-seed="51731"/);
  assert.equal(M11_ENCHANTED_FOREST_LIGHTING.direction, "inner-canopy");
  assert.equal(M11_ENCHANTED_FOREST_LIMITS.haloOpacityMaximum, .40);
  assert.equal(M11_ENCHANTED_FOREST_LIMITS.ornamentMaximum, 6);
  assert.equal(panel, renderStyledComponentSvg(request, M11_ENCHANTED_FOREST_BINDING));
  assert.notEqual(panel, renderStyledComponentSvg({ ...request, variationSeed: 51732 }, M11_ENCHANTED_FOREST_BINDING));
  assert.match(renderStyledComponentSvg({ ...request, variationSeed: 0 }, M11_ENCHANTED_FOREST_BINDING), /data-variation-baseline="true"/);
  const button = renderStyledComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "pressed", variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(button, /data-typography-preset="m11-parchment-sage-action"/);
  assert.match(button, /data-semantic-text="required"/);
  assert.doesNotMatch(button, /luminous-seed-focal/);
  const progress = renderStyledProgressSvg({ component: "progress", width: 420, height: 28, percent: 90, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(progress, /data-part="frame"/);
  assert.match(progress, /data-part="fill"/);
  assert.doesNotMatch(panel, /m11-enchanted-forest-components/);
});
