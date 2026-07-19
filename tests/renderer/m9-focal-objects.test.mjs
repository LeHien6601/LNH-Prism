import assert from "node:assert/strict";
import test from "node:test";
import { renderM9FocalObjectSvg } from "../../dist/renderer/m9-focal-objects.js";
import { renderM9FrostboundComponentSvg } from "../../dist/renderer/m9-frostbound-edge-components.js";

test("M9 focal presets expose one unobstructed panel focal", () => {
  const svg = renderM9FocalObjectSvg({ instanceId: "f", x: 50, y: 50 });
  for (const layer of ["core", "facets", "rim", "inner-light", "ground-glow"]) assert.match(svg, new RegExp(`data-focal-layer="${layer}"`));
  assert.doesNotMatch(renderM9FocalObjectSvg({ instanceId: "f", x: 50, y: 50, disabledLayers: ["particles"] }), /data-focal-layer="particles"/);
  const panel = renderM9FrostboundComponentSvg({ component: "panel", width: 488, height: 660 });
  assert.match(panel, /data-focal-preset="m9-frostbound-crystal@1.0.0"/);
  assert.match(panel, /translate\(244 145.2\) scale\(1.35\)/);
  assert.doesNotMatch(renderM9FrostboundComponentSvg({ component: "icon-container", width: 116, height: 116, state: "selected" }), /data-focal-preset/);
  assert.match(renderM9FrostboundComponentSvg({ component: "panel", width: 488, height: 660, focalPresetId: "m9-placeholder-orb" }), /m9-placeholder-orb/);
});
