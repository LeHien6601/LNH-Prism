import assert from "node:assert/strict";
import test from "node:test";
import { renderStyledComponentSvg, renderStyledProgressSvg } from "../../dist/renderer/style-composition.js";
import { M11_ENCHANTED_FOREST_BINDING, M11_ENCHANTED_FOREST_DENSITY_BUDGETS, M11_ENCHANTED_FOREST_STATE_RECIPES, renderM11LivingFocalSvg, renderM11MaterialClusterSvg } from "../../dist/styles/m11-enchanted-forest-binding.js";

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
  assert.match(panel, /data-layer="forest-integrated-material-regions"/);
  assert.match(panel, /data-integration="construction-profile-connected"/);
  assert.match(panel, /data-layer="forest-stone-surface-region"/);
  assert.equal((panel.match(/ZM0/g) ?? []).length >= 2, true, "panel stone rail uses separated plate paths");
  assert.equal((panel.match(/data-layer="forest-stone-plate-interior"/g) ?? []).length, 6, "each panel plate owns an interior treatment");
  assert.equal((panel.match(/data-layer="forest-stone-connected-tonal-plane"/g) ?? []).length, 18, "each plate owns three connected tonal planes");
  assert.equal((panel.match(/data-layer="forest-stone-plate-chip"/g) ?? []).length, 12, "each plate owns primary and secondary chip scales");
  assert.equal((panel.match(/data-layer="forest-stone-plate-pit"/g) ?? []).length, 18, "each plate owns localized pits");
  assert.equal((panel.match(/data-layer="forest-stone-plate-contact-darkening"/g) ?? []).length, 6);
  assert.equal((panel.match(/data-layer="forest-stone-irregular-inner-bevel-break"/g) ?? []).length, 6);
  assert.equal((panel.match(/data-join-following="true"/g) ?? []).length, 6);
  assert.match(panel, /data-layer="forest-stone-contact-occlusion"/);
  assert.match(panel, /data-layer="forest-stone-fracture-field"/);
  assert.match(panel, /data-layer="forest-wood-surface-region"/);
  assert.match(panel, /data-layer="forest-wood-growth-body"/);
  assert.match(panel, /data-layer="forest-wood-relief-bands"/);
  assert.match(panel, /data-layer="forest-moss-surface-region"/);
  assert.match(panel, /data-layer="forest-moss-substrate"/);
  assert.match(panel, /data-layer="forest-moss-coverage-transition"/);
  assert.match(panel, /data-layer="forest-living-light-surface-response"/);
  assert.match(panel, /data-layer="forest-stone-light-receiver"/);
  assert.match(panel, /data-layer="forest-wood-light-receiver"/);
  assert.match(panel, /data-layer="forest-moss-light-receiver"/);
  assert.match(panel, /data-layer="forest-authored-material-clusters"/);
  assert.match(panel, /data-material-families="stone,wood,moss"/);
  assert.match(panel, /data-cluster-scale="component"/);
  assert.match(panel, /data-placement="construction-anchor-budgeted"/);
  assert.match(panel, /data-layer="forest-stone-chip-cluster"/);
  assert.match(panel, /data-layer="forest-wood-knot-cluster"/);
  assert.match(panel, /data-layer="forest-moss-lichen-cluster"/);
  assert.ok(panel.indexOf('data-layer="forest-material-stack"') > panel.indexOf('data-layer="surface-pattern"'));
  assert.match(panel, /data-layer="luminous-seed-focal"/);
  assert.match(panel, /data-layer="forest-focal-roots"/);
  assert.match(panel, /data-layer="forest-focal-light-interaction"/);
  assert.match(panel, /data-focal-depth="woven-root-cradle"/);
  assert.match(panel, /data-halo-opacity="\.40"/);
  const progress = renderStyledProgressSvg({ component: "progress", width: 420, height: 28, percent: 90, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(progress, /data-part="frame"/);
  assert.match(progress, /data-part="fill"/);
});

test("M11 living focal helper preserves editable seed, support, roots, and light interaction", () => {
  const focal = renderM11LivingFocalSvg("icon-container", 58, 58, 22, "selected");
  assert.match(focal, /data-layer="luminous-seed-focal"/);
  assert.match(focal, /data-layer="forest-focal-support"/);
  assert.match(focal, /data-layer="forest-focal-roots"/);
  assert.match(focal, /data-layer="forest-focal-light-interaction"/);
  assert.match(focal, /data-focal-state="selected"/);
  assert.match(focal, new RegExp(`data-emitter-opacity="${M11_ENCHANTED_FOREST_STATE_RECIPES.selected.emitter}"`));
  assert.doesNotMatch(focal, /<image\b/);
});

test("M11 component-class budgets reduce compact density and keep progress quiet", () => {
  assert.ok(M11_ENCHANTED_FOREST_DENSITY_BUDGETS.panel.clusters > M11_ENCHANTED_FOREST_DENSITY_BUDGETS["primary-hex-button"].clusters);
  assert.ok(M11_ENCHANTED_FOREST_DENSITY_BUDGETS["primary-hex-button"].clusters > M11_ENCHANTED_FOREST_DENSITY_BUDGETS.tab.clusters);
  const panel = renderStyledComponentSvg({ component: "panel", width: 488, height: 660, state: "normal", variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  const primary = renderStyledComponentSvg({ component: "primary-hex-button", width: 320, height: 68, state: "normal", variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  const tab = renderStyledComponentSvg({ component: "tab", width: 184, height: 52, state: "selected", variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  const progress = renderStyledProgressSvg({ component: "progress", width: 420, height: 28, percent: 90, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(panel, /data-cluster-budget="5"/);
  assert.match(primary, /data-cluster-budget="2"/);
  assert.match(tab, /data-cluster-budget="1"/);
  assert.doesNotMatch(progress, /forest-authored-material-clusters|forest-ornament/);
});

test("M11 states drive named receivers instead of a global opacity change", () => {
  const request = { component: "primary-hex-button", width: 320, height: 68, variationSeed: 51731 };
  const normal = renderStyledComponentSvg({ ...request, state: "normal" }, M11_ENCHANTED_FOREST_BINDING);
  const pressed = renderStyledComponentSvg({ ...request, state: "pressed" }, M11_ENCHANTED_FOREST_BINDING);
  const disabled = renderStyledComponentSvg({ ...request, state: "disabled" }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(normal, new RegExp(`data-receiver-opacity="${M11_ENCHANTED_FOREST_STATE_RECIPES.normal.receiver}"`));
  assert.match(pressed, new RegExp(`data-receiver-opacity="${M11_ENCHANTED_FOREST_STATE_RECIPES.pressed.receiver}"`));
  assert.match(disabled, new RegExp(`data-receiver-opacity="${M11_ENCHANTED_FOREST_STATE_RECIPES.disabled.receiver}"`));
  for (const svg of [normal, pressed, disabled]) {
    assert.match(svg, /data-layer="forest-wood-light-receiver"/);
    assert.match(svg, /data-layer="forest-edge-light-receiver"/);
  }
  assert.notEqual(normal, pressed);
  assert.notEqual(normal, disabled);
});

test("M11 compact controls use one quiet relief seam and make active receiver pulses explicit", () => {
  const request = { component: "badge", width: 212, height: 48, variationSeed: 51731 };
  const normal = renderStyledComponentSvg({ ...request, state: "normal" }, M11_ENCHANTED_FOREST_BINDING);
  const highlighted = renderStyledComponentSvg({ ...request, state: "highlighted" }, M11_ENCHANTED_FOREST_BINDING);
  assert.match(normal, /data-layer="forest-wood-relief-bands" data-band-count="1"/);
  assert.doesNotMatch(normal, /data-layer="forest-state-receiver-pulse"/);
  assert.match(highlighted, /data-layer="forest-state-receiver-pulse" data-state-response="highlighted"/);
  assert.match(highlighted, /stroke-width="2\.8"/);
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

test("M11 panel plate interiors are deterministic, seed-varying, clipped, and absent at baseline", () => {
  const request = { component: "panel", width: 488, height: 660, state: "normal" };
  const baseline = renderStyledComponentSvg({ ...request, variationSeed: 0 }, M11_ENCHANTED_FOREST_BINDING);
  const first = renderStyledComponentSvg({ ...request, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  const repeated = renderStyledComponentSvg({ ...request, variationSeed: 51731 }, M11_ENCHANTED_FOREST_BINDING);
  const changed = renderStyledComponentSvg({ ...request, variationSeed: 104729 }, M11_ENCHANTED_FOREST_BINDING);
  assert.doesNotMatch(baseline, /data-layer="forest-stone-plate-interior"/);
  assert.equal(first, repeated);
  assert.notEqual(first, changed);
  for (let index = 1; index <= 6; index += 1) {
    assert.match(first, new RegExp(`data-plate-index="${index}"[^>]+clip-path="url\\(#m11-panel-stone-plate-${index}-clip\\)"`));
  }
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
