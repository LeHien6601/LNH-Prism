import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { renderM8FrostboundComponentSvg, renderM8FrostboundProgressFillSvg, renderM8FrostboundProgressFrameSvg, renderM8FrostboundProgressSvg } from "../../dist/renderer/m8-frostbound-components.js";

const hash = (value) => createHash("sha256").update(value).digest("hex");

test("M8 applies versioned cold materials without changing the approved angular geometry", () => {
  const svg = renderM8FrostboundComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "normal" });
  assert.match(svg, /m8-frostbound-aligned@0\.1\.0/);
  for (const material of ["m8-ice-grain", "m8-crystal-facet-pattern", "m8-cold-edge-accent"]) assert.match(svg, new RegExp(`data-material-source="${material}"`));
  assert.match(svg, /data-geometry-shape="wide-hexagon"/);
  assert.equal(hash(svg), hash(renderM8FrostboundComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "normal" })));
});

test("M8 focal treatment stays an editable layer and progress parts remain independent", () => {
  const panel = renderM8FrostboundComponentSvg({ component: "panel", width: 488, height: 660 });
  const icon = renderM8FrostboundComponentSvg({ component: "icon-container", width: 116, height: 116, state: "selected" });
  assert.match(panel, /data-layer="crystal-focal"/);
  assert.match(icon, /data-slot="editable-crystal-focal"/);
  const request = { component: "progress", width: 420, height: 28, percent: 90 };
  assert.match(renderM8FrostboundProgressSvg(request), /data-style="m8-frostbound-aligned@0\.1\.0"/);
  assert.match(renderM8FrostboundProgressFrameSvg(request), /data-part="frame"/);
  assert.match(renderM8FrostboundProgressFillSvg(request), /data-part="fill"/);
});
