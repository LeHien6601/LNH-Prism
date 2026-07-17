import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import {
  renderFrostboundComponentSvg,
  renderFrostboundProgressFillSvg,
  renderFrostboundProgressFrameSvg
} from "../../dist/renderer/frostbound-components.js";
import { renderFrostboundScenarioSvg } from "../../dist/renderer/frostbound-scenario.js";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const conceptHash = "19d55d8ed0d1a2b8949bcd135ecd95ad2d0b5920846a843b652949eb02712383";
const matrix = [
  { component:"panel", width:432, height:300 }, { component:"panel", width:432, height:420 },
  ...[240,288].flatMap((width) => ["normal","pressed","disabled"].map((state) => ({ component:"primary-button", width, height:64, state }))),
  ...[160,200].flatMap((width) => ["normal","pressed","disabled"].map((state) => ({ component:"secondary-button", width, height:52, state }))),
  ...[320,432].flatMap((width) => [10,50,75,90].map((percent) => ({ component:"progress", width, height:28, percent }))),
  ...[104,144].flatMap((width) => ["normal","selected"].map((state) => ({ component:"emblem", width, height:width, state })))
];

test("Frostbound family covers the complete bounded state, size, and progress matrix deterministically", () => {
  assert.equal(matrix.length, 26);
  for (const request of matrix) {
    const svg = renderFrostboundComponentSvg(request);
    assert.equal(hash(svg), hash(renderFrostboundComponentSvg(request)));
    assert.match(svg, /frostbound-reward@0\.1\.0/);
    assert.doesNotMatch(svg, new RegExp(conceptHash));
    assert.doesNotMatch(svg, /v3-frostbound-reward-concept|<image\b/);
  }
});

test("Frostbound layers stay ordered, editable, material-bound, and component neutral", () => {
  for (const request of [matrix[0], matrix[2], matrix[8], matrix[22]]) {
    const svg = renderFrostboundComponentSvg(request);
    const roles = ["shadow","extrusion","fill","texture","border","highlight"];
    let previous = -1;
    for (const role of roles) {
      const index = svg.indexOf(`data-layer="${role}"`);
      assert.ok(index > previous, `${request.component} must retain ${role} order`);
      previous = index;
    }
    assert.match(svg, /data-material-source="frost-grain"/);
    assert.match(svg, /data-material-source="crystal-facet-pattern"/);
    assert.match(svg, /data-slot="editable-/);
  }
});

test("primary/secondary hierarchy and emblem selected state differ without text dependence", () => {
  const primary = renderFrostboundComponentSvg({ component:"primary-button", width:288, height:64 });
  const secondary = renderFrostboundComponentSvg({ component:"secondary-button", width:200, height:52 });
  assert.ok(288 / 200 >= 1.4);
  assert.match(primary, /-primary\)/);
  assert.doesNotMatch(secondary, /-primary\)/);
  const normal = renderFrostboundComponentSvg({ component:"emblem", width:144, height:144, state:"normal" });
  const selected = renderFrostboundComponentSvg({ component:"emblem", width:144, height:144, state:"selected" });
  assert.notEqual(normal, selected);
  assert.match(normal, /<rect[^>]+rx="22"/);
  assert.match(selected, /<path d="M36 2H108/);
  assert.match(selected, /stroke-width="4"/);
});

test("progress frame and fill remain independent at all approved widths and values", () => {
  for (const width of [320,432]) {
    const frame = renderFrostboundProgressFrameSvg(width);
    assert.match(frame, /data-part="frame"/);
    assert.doesNotMatch(frame, /data-part="fill"/);
    for (const percent of [10,50,75,90]) {
      const fill = renderFrostboundProgressFillSvg(width, percent);
      assert.match(fill, /data-part="fill"/);
      assert.doesNotMatch(fill, /data-part="frame"/);
      assert.match(fill, /clip-path="url\(#progress-fill-/);
    }
  }
});

test("Frostbound recipes reject values outside the approved matrix", () => {
  assert.throws(() => renderFrostboundComponentSvg({ component:"panel", width:431, height:300 }), RangeError);
  assert.throws(() => renderFrostboundComponentSvg({ component:"primary-button", width:240, height:64, state:"selected" }), RangeError);
  assert.throws(() => renderFrostboundComponentSvg({ component:"progress", width:320, height:28, percent:25 }), RangeError);
  assert.throws(() => renderFrostboundComponentSvg({ component:"emblem", width:104, height:104, instanceId:"BAD" }), /instance ID/);
});

test("portrait reconstruction is deterministic, traceable, and contains no concept raster", () => {
  const svg = renderFrostboundScenarioSvg();
  assert.equal(svg, renderFrostboundScenarioSvg());
  assert.match(svg, /viewBox="0 0 540 960"/);
  assert.match(svg, /data-concept-pixels="none"/);
  assert.match(svg, />CLAIM</);
  assert.match(svg, />LATER</);
  assert.match(svg, />75%</);
  assert.doesNotMatch(svg, new RegExp(conceptHash));
  assert.doesNotMatch(svg, /v3-frostbound-reward-concept|<image\b/);
});
