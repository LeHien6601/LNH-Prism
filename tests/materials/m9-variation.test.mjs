import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { renderVariationSvg, resolveVariation } from "../../dist/materials/m9-variation.js";
import { renderM9FrostboundComponentSvg } from "../../dist/renderer/m9-frostbound-edge-components.js";

const hash = (value) => createHash("sha256").update(value).digest("hex");

test("M9 variation has reproducible receipts, bounded different-seed output, and explicit zero baseline", () => {
  const first = resolveVariation("panel", "content-surface", undefined, 14821);
  assert.deepEqual(first, resolveVariation("panel", "content-surface", undefined, 14821));
  assert.notEqual(hash(renderVariationSvg("m9-test", "panel", "content-surface", 488, 660, undefined, 14821)), hash(renderVariationSvg("m9-test", "panel", "content-surface", 488, 660, undefined, 20002)));
  const zero = resolveVariation("panel", "content-surface", "m9-frostbound-zero-variation");
  assert.deepEqual(zero.channels, { frostCoverage: 0, crackDensity: 0, scratchDensity: 0, highlightScatter: 0, particleCount: 0, shardVariance: 0, asymmetry: 0 });
  assert.throws(() => resolveVariation("panel", "content-surface", undefined, -1), /unsigned/);
  assert.throws(() => resolveVariation("panel", "content-surface", undefined, 1.5), /unsigned/);
});

test("M9 variation remains region-local and traceable in renderer output", () => {
  const svg = renderM9FrostboundComponentSvg({ component: "panel", width: 488, height: 660, variationSeed: 20002 });
  assert.match(svg, /data-variation-region="content-surface"/);
  assert.match(svg, /data-variation-seed="20002"/);
  assert.match(svg, /data-variation-preset="m9-frostbound-surface-variation@1.0.0"/);
  assert.equal(svg, renderM9FrostboundComponentSvg({ component: "panel", width: 488, height: 660, variationSeed: 20002 }));
});
