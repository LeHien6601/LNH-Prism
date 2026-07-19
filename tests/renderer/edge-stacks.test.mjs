import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { M9_FROSTBOUND_EDGE_STACKS, renderEdgeStackSvg, validateEdgeStack } from "../../dist/renderer/edge-stacks.js";
import { renderM9FrostboundComponentSvg, renderM9FrostboundProgressFillSvg, renderM9FrostboundProgressFrameSvg, renderM9FrostboundProgressSvg } from "../../dist/renderer/m9-frostbound-edge-components.js";

const hash = (value) => createHash("sha256").update(value).digest("hex");

test("edge stacks enforce order, bounds, and deterministic reusable layers", () => {
  const preset = M9_FROSTBOUND_EDGE_STACKS["m9-ice-heavy"];
  const svg = renderEdgeStackSvg({ instanceId: "m9-test-stack", path: "M10 2H90V30H10Z", width: 100, height: 32, preset });
  assert.equal(hash(svg), hash(renderEdgeStackSvg({ instanceId: "m9-test-stack", path: "M10 2H90V30H10Z", width: 100, height: 32, preset })));
  let previous = -1;
  for (const layer of preset.layers) {
    const index = svg.indexOf(`data-edge-stack-layer="${layer.id}"`);
    assert.ok(index > previous, `${layer.id} must remain ordered`);
    previous = index;
  }
  assert.throws(() => validateEdgeStack({ ...preset, layers: [...preset.layers, { ...preset.layers[0], order: 5 }] }, 100, 32), /Duplicate/);
  assert.throws(() => validateEdgeStack({ ...preset, layers: [{ ...preset.layers[0], inset: 20, thickness: 12 }, ...preset.layers.slice(1)] }, 32, 32), /self-intersects/);
  assert.throws(() => validateEdgeStack({ ...preset, layers: [{ ...preset.layers[0], order: 3 }, ...preset.layers.slice(1)] }, 100, 32), /strictly increasing/);
});

test("M9 migrates Frostbound structural borders through shared edge presets", () => {
  const primary = renderM9FrostboundComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "normal" });
  const secondary = renderM9FrostboundComponentSvg({ component: "secondary-hex-button", width: 232, height: 56, state: "normal" });
  const panel = renderM9FrostboundComponentSvg({ component: "panel", width: 488, height: 660 });
  assert.match(primary, /data-edge-stack="m9-glowing-primary"/);
  assert.match(secondary, /data-edge-stack="m9-ice-heavy"/);
  assert.match(panel, /data-edge-stack="m9-dark-inset"/);
  assert.match(panel, /data-layer="crystal-focal"/);
  assert.doesNotMatch(primary, /data-layer="outer-frame"/);
  assert.equal(primary, renderM9FrostboundComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "normal" }));
});

test("M9 progress keeps its frame and fill independently renderable", () => {
  const request = { component: "progress", width: 420, height: 28, percent: 90 };
  assert.match(renderM9FrostboundProgressSvg(request), /data-edge-stack="m9-dark-inset"/);
  assert.match(renderM9FrostboundProgressFrameSvg(request), /data-part="frame"/);
  const fill = renderM9FrostboundProgressFillSvg(request);
  assert.match(fill, /data-part="fill"/);
  assert.doesNotMatch(fill, /data-edge-stack=/);
});
