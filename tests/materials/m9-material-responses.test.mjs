import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { M9_FROSTBOUND_MATERIAL_RESPONSES, M9_FROSTBOUND_REGION_BINDINGS, renderMaterialResponseIsolationSvg, resolveMaterialResponse } from "../../dist/materials/m9-material-responses.js";
import { renderM9FrostboundComponentSvg } from "../../dist/renderer/m9-frostbound-edge-components.js";

const hash = (value) => createHash("sha256").update(value).digest("hex");

test("M9 material responses resolve source-neutral reusable channels for seven components", () => {
  assert.equal(Object.keys(M9_FROSTBOUND_MATERIAL_RESPONSES).length, 5);
  assert.ok(M9_FROSTBOUND_REGION_BINDINGS.length >= 14);
  for (const component of ["primary-hex-button", "secondary-hex-button", "panel", "tab", "badge", "progress", "icon-container"]) {
    assert.ok(resolveMaterialResponse(component, "structural-edge"));
    assert.ok(resolveMaterialResponse(component, "content-surface"));
  }
  assert.throws(() => resolveMaterialResponse("badge", "focal-surface"), /No material response/);
});

test("M9 response isolation exposes each channel and combined target-size output deterministically", () => {
  const responseId = "m9-blue-crystal";
  for (const channel of ["base", "edge", "highlight", "glow", "surface", "combined"]) {
    const svg = renderMaterialResponseIsolationSvg(responseId, channel);
    assert.match(svg, new RegExp(`data-material-response="${responseId}"`));
    assert.match(svg, /data-inspection="target-size"/);
    assert.equal(hash(svg), hash(renderMaterialResponseIsolationSvg(responseId, channel)));
  }
  assert.throws(() => renderMaterialResponseIsolationSvg("missing-response", "base"), /invalid/);
});

test("M9 renderer binds structural and surface responses without a style branch", () => {
  const svg = renderM9FrostboundComponentSvg({ component: "primary-hex-button", width: 320, height: 68 });
  assert.match(svg, /data-material-response="m9-silver-metal"/);
  assert.match(svg, /data-material-response="m9-blue-crystal"/);
  assert.match(svg, /data-material-source="m8-cold-edge-accent"/);
  assert.match(svg, /data-material-responses="m9-frostbound-material-responses@1.0.0"/);
});
