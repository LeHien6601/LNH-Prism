import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import {
  M7_ANGULAR_LAYER_ORDER,
  renderM7AngularComponentSvg,
  renderM7AngularProgressSvg,
  renderM7AngularProgressFrameSvg,
  renderM7AngularProgressFillSvg
} from "../../dist/renderer/m7-angular-components.js";

const hash = (value) => createHash("sha256").update(value).digest("hex");

const matrix = [
  { component: "primary-hex-button", width: 320, height: 68, state: "normal" },
  { component: "primary-hex-button", width: 260, height: 62, state: "pressed" },
  { component: "primary-hex-button", width: 320, height: 68, state: "disabled" },
  { component: "secondary-hex-button", width: 232, height: 56, state: "normal" },
  { component: "secondary-hex-button", width: 188, height: 52, state: "pressed" },
  { component: "panel", width: 488, height: 660 },
  { component: "panel", width: 488, height: 760 },
  { component: "tab", width: 148, height: 52, state: "normal" },
  { component: "tab", width: 184, height: 52, state: "selected" },
  { component: "badge", width: 164, height: 48, state: "normal" },
  { component: "badge", width: 212, height: 48, state: "highlighted" },
  { component: "icon-container", width: 92, height: 92, state: "normal" },
  { component: "icon-container", width: 116, height: 116, state: "selected" }
];

test("M7 angular components render deterministic bounded matrix with no raster or engine hooks", () => {
  for (const request of matrix) {
    const svg = renderM7AngularComponentSvg(request);
    assert.equal(hash(svg), hash(renderM7AngularComponentSvg(request)));
    assert.match(svg, /m7-reference-fidelity@0\.1\.0/);
    assert.doesNotMatch(svg, /<image\b|unity|Unity|engine/i);
  }
});

test("M7 hex buttons expose sharp wide-hex geometry and reject rounded baseline drift", () => {
  const svg = renderM7AngularComponentSvg({ component: "primary-hex-button", width: 320, height: 68, endCapDepth: 34, cornerRadius: 2 });
  assert.match(svg, /data-geometry-shape="wide-hexagon"/);
  assert.match(svg, /data-corner-radius="2"/);
  assert.match(svg, /data-end-cap-depth="34"/);
  assert.match(svg, /<path d="M36 2H284L318 32/);
  assert.doesNotMatch(svg, /<rect[^>]+rx="(1[0-9]|[2-9][0-9])"/);
  assert.throws(() => renderM7AngularComponentSvg({ component: "primary-hex-button", width: 320, height: 68, cornerRadius: 12 }), /0-4/);
  assert.throws(() => renderM7AngularComponentSvg({ component: "primary-hex-button", width: 320, height: 68, endCapDepth: 18 }), /rounded\/capsule-like/);
});

test("M7 angular recipe keeps the approved top-to-bottom layer model inspectable", () => {
  const svg = renderM7AngularComponentSvg({ component: "secondary-hex-button", width: 232, height: 56, state: "normal" });
  let previous = -1;
  for (const layer of M7_ANGULAR_LAYER_ORDER) {
    const index = svg.indexOf(`data-layer="${layer}"`);
    assert.ok(index > previous, `M7 layer ${layer} must remain ordered`);
    previous = index;
  }
  assert.match(svg, /data-slot="editable-secondary-hex-button-content"/);
  assert.match(svg, /data-safe-x="39"/);
  assert.match(svg, /data-material-source="m7-faceted-grain"/);
  assert.match(svg, /data-material-source="m7-angular-plate-pattern"/);
});

test("M7 states are deterministic parameter changes, not alternate manual structures", () => {
  const normal = renderM7AngularComponentSvg({ component: "primary-hex-button", width: 260, height: 62, state: "normal" });
  const pressed = renderM7AngularComponentSvg({ component: "primary-hex-button", width: 260, height: 62, state: "pressed" });
  const disabled = renderM7AngularComponentSvg({ component: "primary-hex-button", width: 260, height: 62, state: "disabled" });
  assert.notEqual(normal, pressed);
  assert.notEqual(normal, disabled);
  assert.match(pressed, /data-safe-y="10"/);
  assert.match(disabled, /opacity="0.48"/);
  assert.equal(normal.replaceAll("normal", "state").replaceAll('data-safe-y="8"', 'data-safe-y="Y"'), renderM7AngularComponentSvg({ component: "primary-hex-button", width: 260, height: 62, state: "normal" }).replaceAll("normal", "state").replaceAll('data-safe-y="8"', 'data-safe-y="Y"'));
});

test("M7 angular progress keeps frame and fill independent at approved values", () => {
  for (const width of [344, 420]) {
    for (const percent of [10, 50, 90]) {
      const svg = renderM7AngularProgressSvg({ component: "progress", width, height: 28, percent });
      assert.match(svg, /data-part="frame"/);
      assert.match(svg, /data-part="fill"/);
      assert.match(svg, /clip-path="url\(#m7-progress-normal-/);
      assert.doesNotMatch(svg, /<rect[^>]+rx=/);
      assert.equal(svg, renderM7AngularProgressSvg({ component: "progress", width, height: 28, percent }));
      const frame = renderM7AngularProgressFrameSvg({ component: "progress", width, height: 28, percent });
      const fill = renderM7AngularProgressFillSvg({ component: "progress", width, height: 28, percent });
      assert.match(frame, /data-part="frame"/);
      assert.doesNotMatch(frame, /data-part="fill"/);
      assert.match(fill, /data-part="fill"/);
      assert.doesNotMatch(fill, /data-part="frame"/);
    }
  }
  assert.throws(() => renderM7AngularProgressSvg({ component: "progress", width: 344, height: 28, percent: 75 }), /10, 50, or 90/);
});

test("M7 angular components reject unsupported states, sizes, and unsafe caps", () => {
  assert.throws(() => renderM7AngularComponentSvg({ component: "tab", width: 148, height: 52, state: "pressed" }), /does not support/);
  assert.throws(() => renderM7AngularComponentSvg({ component: "badge", width: 165, height: 48 }), /outside the approved/);
  assert.throws(() => renderM7AngularComponentSvg({ component: "icon-container", width: 92, height: 92, instanceId: "BAD" }), /instance ID/);
  assert.throws(() => renderM7AngularComponentSvg({ component: "secondary-hex-button", width: 188, height: 52, endCapDepth: 90 }), /between 16 and 56/);
});
