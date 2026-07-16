import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { NEON_ALLOY_LAYER_IDS, renderNeonAlloyComponentSvg, renderNeonAlloyProgressFillSvg, renderNeonAlloyProgressFrameSvg } from "../../dist/renderer/neon-alloy-components.js";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const requests = [
  { component: "button", width: 160, height: 56, state: "normal", accentDecal: true }, { component: "button", width: 240, height: 56, state: "pressed" }, { component: "button", width: 160, height: 56, state: "disabled" },
  { component: "panel", width: 432, height: 240 }, { component: "panel", width: 432, height: 360 }, { component: "progress", width: 320, height: 24, percent: 10 }, { component: "progress", width: 432, height: 24, percent: 90 },
  { component: "tab", width: 112, height: 44, state: "normal" }, { component: "tab", width: 200, height: 44, state: "selected" }, { component: "badge", width: 104, height: 44, state: "normal" }, { component: "badge", width: 200, height: 44, state: "highlighted", accentDecal: true }
];

test("M2 shared recipes keep ordered, inspectable Neon Alloy layers across all component types", () => {
  for (const request of requests) {
    const svg = renderNeonAlloyComponentSvg(request);
    let previous = -1;
    for (const id of NEON_ALLOY_LAYER_IDS.filter((id) => request.accentDecal || id !== "layer-accent-decal")) {
      const index = svg.indexOf(`id="${id}"`);
      assert.ok(index > previous, `${request.component} must retain ${id} order`);
      previous = index;
    }
    assert.match(svg, /clip-path="url\(#[a-z-]+-surface-mask\)"/);
  }
});

test("M2 progress frame and value fill remain independently renderable and clipped", () => {
  const frame = renderNeonAlloyProgressFrameSvg(320);
  const fill = renderNeonAlloyProgressFillSvg(320, 10);
  assert.match(frame, /id="part-frame"/); assert.doesNotMatch(frame, /id="part-fill"/);
  assert.match(fill, /id="part-fill"/); assert.doesNotMatch(fill, /id="part-frame"/);
  assert.match(fill, /clip-path="url\(#progress-fill-mask\)"/);
});

test("M2 shared recipes are deterministic and reject invalid states, sizes, and progress values", () => {
  for (const request of requests) assert.equal(hash(renderNeonAlloyComponentSvg(request)), hash(renderNeonAlloyComponentSvg(request)));
  assert.throws(() => renderNeonAlloyComponentSvg({ component: "tab", width: 111, height: 44 }), RangeError);
  assert.throws(() => renderNeonAlloyComponentSvg({ component: "badge", width: 104, height: 44, state: "selected" }), RangeError);
  assert.throws(() => renderNeonAlloyComponentSvg({ component: "progress", width: 320, height: 24, percent: 101 }), RangeError);
  assert.throws(() => renderNeonAlloyComponentSvg({ component: "button", width: 160, height: 56, edgeLightOpacity: 0.66 }), RangeError);
});

test("approved edge-light mutation changes only the shared edge-light value across the six spec assets", () => {
  const family = [
    { component: "panel", width: 432, height: 240 }, { component: "tab", width: 112, height: 44, state: "selected" },
    { component: "button", width: 240, height: 56 }, { component: "button", width: 160, height: 56 },
    { component: "badge", width: 104, height: 44 }, { component: "progress", width: 320, height: 24, percent: 50 }
  ];
  for (const request of family) {
    const canonical = renderNeonAlloyComponentSvg({ ...request, edgeLightOpacity: 0.42 });
    const mutated = renderNeonAlloyComponentSvg({ ...request, edgeLightOpacity: 0.3 });
    assert.notEqual(canonical, mutated);
    assert.equal(canonical.replace('stop-opacity="0.42"', 'stop-opacity="0.30"'), mutated.replace('stop-opacity="0.3"', 'stop-opacity="0.30"'));
  }
});
