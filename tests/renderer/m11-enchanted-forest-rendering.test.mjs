import assert from "node:assert/strict";
import test from "node:test";
import { renderStyledComponentSvg, renderStyledProgressSvg } from "../../dist/renderer/style-composition.js";
import { M11_ENCHANTED_FOREST_BINDING, renderM11MaterialClusterSvg } from "../../dist/styles/m11-enchanted-forest-binding.js";

test("M11 renders required shared-template states without obscuring semantic layers", () => {
  for (const state of ["normal", "pressed", "disabled"]) {
    const button = renderStyledComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
    assert.match(button, /data-style="m11-enchanted-forest@0.1.0"/);
    assert.match(button, /data-layer="forest-typography"/);
    assert.match(button, /data-semantic-text="required"/);
    assert.doesNotMatch(button, /luminous-seed-focal/);
  }
  const panel = renderStyledComponentSvg({ component: "panel", width: 488, height: 660, state: "normal", variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(panel, /data-layer="forest-material-stack"/);
  assert.match(panel, /data-material-families="weathered-stone,dark-wood,moss-lichen"/);
  assert.match(panel, /data-layer="forest-material-detail"/);
  assert.match(panel, /data-material-channels="stone-chips,wood-grain,moss-mask"/);
  assert.match(panel, /data-layer="forest-material-face-depth"/);
  assert.match(panel, /data-layer="forest-weathered-stone"/);
  assert.match(panel, /data-layer="forest-dark-wood-grain"/);
  assert.match(panel, /data-layer="forest-moss-growth-mask"/);
  assert.match(panel, /data-layer="forest-material-restraint"/);
  assert.match(panel, /data-restraint="edge-anchored-low-opacity"/);
  assert.match(panel, /data-layer="forest-authored-material-clusters"/);
  assert.match(panel, /data-material-families="stone,wood,moss"/);
  assert.match(panel, /data-cluster-scale="component"/);
  assert.match(panel, /data-placement="component-aware"/);
  assert.match(panel, /data-layer="forest-stone-chip-cluster"/);
  assert.match(panel, /data-layer="forest-wood-knot-cluster"/);
  assert.match(panel, /data-layer="forest-moss-lichen-cluster"/);
  assert.ok(panel.indexOf('data-layer="forest-material-stack"') > panel.indexOf('data-layer="surface-pattern"'));
  assert.match(panel, /data-layer="luminous-seed-focal"/);
  assert.match(panel, /data-layer="forest-focal-roots"/);
  assert.match(panel, /data-halo-opacity="\.40"/);
  const progress = renderStyledProgressSvg({ component: "progress", width: 420, height: 28, percent: 90, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(progress, /data-part="frame"/);
  assert.match(progress, /data-part="fill"/);
});

test("M11 authored material clusters are deterministic, seed-varying, and absent at baseline", () => {
  const request = { component: "primary-hex-button", width: 320, height: 68, state: "normal" };
  const baseline = renderStyledComponentSvg({ ...request, variationSeed: 0 }, M11_ENCHANTED_FOREST_BINDING);
  const first = renderStyledComponentSvg({ ...request, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  const repeated = renderStyledComponentSvg({ ...request, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  const changed = renderStyledComponentSvg({ ...request, variationSeed: 104729 }, M11_ENCHANTED_FOREST_BINDING);
  assert.doesNotMatch(baseline, /forest-authored-material-clusters/);
  assert.equal(first, repeated);
  assert.notEqual(first, changed);
});

test("M11 material cluster library keeps each organic family independently editable", () => {
  for (const [kind, family, layer] of [
    ["stone-chip", "stone", "forest-stone-chip-cluster"],
    ["wood-knot", "wood", "forest-wood-knot-cluster"],
    ["moss-lichen", "moss", "forest-moss-lichen-cluster"]
  ]) {
    const primitive = renderM11MaterialClusterSvg(kind, 1);
    assert.match(primitive, new RegExp(`data-material-family="${family}"`));
    assert.match(primitive, new RegExp(`data-layer="${layer}"`));
    assert.doesNotMatch(primitive, /<image\b/);
  }
});
