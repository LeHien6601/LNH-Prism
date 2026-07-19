import assert from "node:assert/strict";
import test from "node:test";
import { renderStyledComponentSvg, renderStyledProgressSvg } from "../../dist/renderer/style-composition.js";
import { M10_VOLCANIC_FORGE_BINDING, M10_VOLCANIC_FORGE_LIMITS, M10_VOLCANIC_FORGE_LIGHTING } from "../../dist/styles/m10-volcanic-forge-binding.js";

test("M10 binds the style-neutral composition seam with recorded variation", () => {
  const request = { component: "panel", width: 488, height: 660, variationSeed: 39211 };
  const panel = renderStyledComponentSvg(request, M10_VOLCANIC_FORGE_BINDING);
  assert.match(panel, /data-style="m10-volcanic-forge@0.2.0"/);
  assert.match(panel, /data-layer="molten-focal"/);
  assert.match(panel, /data-ember-count="8"/);
  assert.match(panel, /data-variation-seed="39211"/);
  assert.equal(M10_VOLCANIC_FORGE_LIGHTING.direction, "bottom");
  assert.equal(M10_VOLCANIC_FORGE_LIMITS.portraitEmberCount, 8);
  assert.equal(M10_VOLCANIC_FORGE_LIMITS.controlEmberCount, 0);
  assert.equal(M10_VOLCANIC_FORGE_LIMITS.lavaOpacityMaximum, .55);
  assert.equal(panel, renderStyledComponentSvg(request, M10_VOLCANIC_FORGE_BINDING));
  assert.notEqual(panel, renderStyledComponentSvg({ ...request, variationSeed: 39212 }, M10_VOLCANIC_FORGE_BINDING));
  assert.match(renderStyledComponentSvg({ ...request, variationSeed: 0 }, M10_VOLCANIC_FORGE_BINDING), /data-variation-baseline="true"/);
  const button = renderStyledComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "normal", variationSeed: 39211 }, M10_VOLCANIC_FORGE_BINDING);
  assert.match(button, /data-typography-preset="m10-engraved-gold-action"/);
  assert.doesNotMatch(button, /data-ember-count="8"/);
  const progress = renderStyledProgressSvg({ component: "progress", width: 420, height: 28, percent: 90, variationSeed: 39211 }, M10_VOLCANIC_FORGE_BINDING);
  assert.match(progress, /data-part="frame"/);
  assert.match(progress, /data-part="fill"/);
});
