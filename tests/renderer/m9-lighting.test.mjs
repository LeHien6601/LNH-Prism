import assert from "node:assert/strict";
import test from "node:test";
import { renderM9LightingSvg } from "../../dist/renderer/m9-lighting.js";
import { renderM9FrostboundComponentSvg } from "../../dist/renderer/m9-frostbound-edge-components.js";

test("M9 lighting and typography remain visible above inherited component layers", () => {
  assert.match(renderM9LightingSvg("x", 200, 60), /m9-cold-top-rim/);
  const button = renderM9FrostboundComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "pressed" });
  assert.match(button, /data-lighting-model="m9-cold-top-rim@1.0.0"/);
  assert.match(button, /data-typography-preset="m9-frostbound-action@1.0.0"/);
  assert.ok(button.indexOf("data-typography-preset") > button.indexOf('data-layer="content"'));
  assert.throws(() => renderM9LightingSvg("x", 200, 60, { id: "x", version: "1", direction: "top", intensity: 2, glow: 0 }), /budget/);
});
