import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { validateSemanticProject } from "@lnh-prism/core";
import {
  SEMANTIC_SCHEMA_VERSION,
  semanticProjectSchema,
  SUPPORTED_COMPONENT_TYPES
} from "@lnh-prism/schema";

const fixtures = resolve("tests/fixtures/semantic-v1");
const readFixture = async name => JSON.parse(await readFile(resolve(fixtures, name), "utf8"));
function instanceById(document, id) {
  const visit = instance => {
    if (instance.id === id) return instance;
    for (const child of instance.children ?? []) {
      const found = visit(child);
      if (found) return found;
    }
    return null;
  };
  for (const entry of [...document.screens, ...document.components]) {
    const found = visit(entry.root);
    if (found) return found;
  }
  throw Error(`Missing fixture instance ${id}.`);
}

test("semantic schema exposes the complete bounded M13-A2 contract set", () => {
  assert.equal(semanticProjectSchema.properties.schemaVersion.const, SEMANTIC_SCHEMA_VERSION);
  assert.deepEqual(Object.keys(semanticProjectSchema.$defs).sort(), [
    "action", "assetSlot", "binding", "component", "gridSettings", "instance", "layout",
    "project", "screen", "semanticId", "state", "theme", "unityExportSettings"
  ]);
  assert.deepEqual(SUPPORTED_COMPONENT_TYPES, [
    "screen", "safe-area", "container", "panel", "label", "image",
    "button", "toggle", "grid", "modal", "spacer"
  ]);
});

test("public contract fixture conforms to the exported JSON Schema", async () => {
  const validate = new Ajv2020({ allErrors: true, strict: true }).compile(semanticProjectSchema);
  const document = await readFixture("minimal-project.json");
  assert.equal(validate(document), true, JSON.stringify(validate.errors));
  const types = new Set();
  const visit = instance => {
    types.add(instance.type);
    for (const child of instance.children ?? []) visit(child);
  };
  for (const entry of [...document.screens, ...document.components]) visit(entry.root);
  assert.deepEqual([...types].sort(), [...SUPPORTED_COMPONENT_TYPES].sort());
});

test("public contract fixture validates with a deterministic empty diagnostic result", async () => {
  const document = await readFixture("minimal-project.json");
  const first = validateSemanticProject(document, { source: "minimal-project.json" });
  const second = validateSemanticProject(structuredClone(document), { source: "minimal-project.json" });
  assert.deepEqual(first, {
    diagnosticVersion: "1.0.0",
    contractVersion: "1.0.0",
    source: "minimal-project.json",
    valid: true,
    diagnostics: []
  });
  assert.deepEqual(second, first);
  assert.equal(JSON.stringify(second), JSON.stringify(first));
});

for (const [fixture, code, path] of [
  ["invalid-schema-version.json", "PRISM_SCHEMA_VERSION_UNSUPPORTED", "/schemaVersion"],
  ["missing-required-contract-field.json", "PRISM_SCHEMA_INVALID", "/project"],
  ["invalid-semantic-id.json", "PRISM_ID_INVALID", "/project/id"],
  ["duplicate-semantic-id.json", "PRISM_ID_DUPLICATE", "/themes/1/id"],
  ["unsupported-component-type.json", "PRISM_COMPONENT_TYPE_UNSUPPORTED", "/screens/0/root/children/0/children/0/type"]
]) {
  test(`${fixture} fails with an actionable machine-readable diagnostic`, async () => {
    const result = validateSemanticProject(await readFixture(fixture), { source: fixture });
    assert.equal(result.valid, false);
    assert.deepEqual(result.diagnostics.map(({ code: actualCode, path: actualPath }) => [actualCode, actualPath]), [[code, path]]);
    assert.ok(result.diagnostics[0].message.length > 20);
    assert.equal(result.diagnostics[0].severity, "error");
  });
}

test("semantic references resolve through their typed registries", async () => {
  const document = await readFixture("minimal-project.json");
  document.project.defaultThemeId = "theme.missing";
  document.actions[0].targetScreenId = "screen.missing";
  instanceById(document, "sample.settings").componentId = "component.missing";
  const button = instanceById(document, "sample.continue");
  button.actionId = "action.missing";
  button.navigationTargetId = "screen.missing";
  const toggle = instanceById(document, "settings.sound");
  toggle.bindingId = "binding.missing";
  toggle.stateIds = ["state.missing"];
  instanceById(document, "settings.icon").assetSlotId = "asset.missing";

  const result = validateSemanticProject(document, { source: "missing-references.json" });
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics.length, 8);
  assert.ok(result.diagnostics.every(entry => entry.code === "PRISM_REFERENCE_NOT_FOUND"));
  assert.deepEqual(result.diagnostics.map(entry => entry.path), [
    "/actions/0/targetScreenId",
    "/components/0/root/children/0/assetSlotId",
    "/components/0/root/children/1/bindingId",
    "/components/0/root/children/1/stateIds/0",
    "/project/defaultThemeId",
    "/screens/0/root/children/0/children/0/children/3/actionId",
    "/screens/0/root/children/0/children/0/children/3/navigationTargetId",
    "/screens/0/root/children/0/children/0/children/4/componentId"
  ]);
});

test("bounded component types enforce their required semantic contracts", async () => {
  const document = await readFixture("minimal-project.json");
  delete instanceById(document, "sample.continue").actionId;
  delete instanceById(document, "settings.sound").bindingId;
  delete instanceById(document, "sample.grid").grid;
  delete instanceById(document, "sample.settings").dismissalPolicy;
  const result = validateSemanticProject(document, { source: "missing-type-contracts.json" });
  assert.deepEqual(result.diagnostics.map(entry => entry.code).sort(), [
    "PRISM_BUTTON_TARGET_REQUIRED",
    "PRISM_GRID_CONFIGURATION_REQUIRED",
    "PRISM_MODAL_DISMISSAL_REQUIRED",
    "PRISM_TOGGLE_BINDING_REQUIRED"
  ]);
});

test("fixed grid content must match dimensions or declare a reusable template", async () => {
  const document = await readFixture("minimal-project.json");
  instanceById(document, "sample.grid").children = [];
  const result = validateSemanticProject(document, { source: "invalid-grid-content.json" });
  assert.deepEqual(result.diagnostics.map(({ code, path }) => [code, path]), [[
    "PRISM_GRID_CONTENT_REQUIRED",
    "/screens/0/root/children/0/children/0/children/2/children"
  ]]);
});

test("screen roots and safe-area placement preserve the bounded hierarchy", async () => {
  const document = await readFixture("minimal-project.json");
  const screenRoot = document.screens[0].root;
  const safeArea = screenRoot.children[0];
  screenRoot.children = [{ id: "sample.outer", type: "container", children: [safeArea] }];
  const result = validateSemanticProject(document, { source: "invalid-safe-area.json" });
  assert.deepEqual(result.diagnostics.map(entry => entry.code).sort(), [
    "PRISM_SAFE_AREA_PLACEMENT",
    "PRISM_SAFE_AREA_ROOT_REQUIRED"
  ]);
});

test("nested modal layers are rejected", async () => {
  const document = await readFixture("minimal-project.json");
  instanceById(document, "sample.settings").children = [{
    id: "sample.settings.confirmation",
    type: "modal",
    dismissalPolicy: "explicit"
  }];
  const result = validateSemanticProject(document, { source: "nested-modal.json" });
  assert.deepEqual(result.diagnostics.map(({ code, path }) => [code, path]), [[
    "PRISM_MODAL_NESTED",
    "/screens/0/root/children/0/children/0/children/4/children/0/type"
  ]]);
});

test("leaf component types cannot own child hierarchy", async () => {
  const document = await readFixture("minimal-project.json");
  instanceById(document, "sample.continue").children = [{ id: "sample.continue.child", type: "spacer" }];
  const result = validateSemanticProject(document, { source: "leaf-with-child.json" });
  assert.deepEqual(result.diagnostics.map(({ code, path }) => [code, path]), [[
    "PRISM_HIERARCHY_CHILDREN_UNSUPPORTED",
    "/screens/0/root/children/0/children/0/children/3/children"
  ]]);
});

test("reusable component reference cycles are rejected deterministically", async () => {
  const document = await readFixture("minimal-project.json");
  document.components.push(
    { id: "component.alpha", root: { id: "alpha.root", type: "panel", componentId: "component.beta" } },
    { id: "component.beta", root: { id: "beta.root", type: "panel", componentId: "component.alpha" } }
  );
  const first = validateSemanticProject(document, { source: "component-cycle.json" });
  const second = validateSemanticProject(structuredClone(document), { source: "component-cycle.json" });
  assert.deepEqual(first.diagnostics.map(({ code, path }) => [code, path]), [[
    "PRISM_HIERARCHY_CYCLE",
    "/components/2/root/componentId"
  ]]);
  assert.deepEqual(second, first);
});

test("in-memory child object cycles fail without entering schema recursion", async () => {
  const document = await readFixture("minimal-project.json");
  document.screens[0].root.children.push(document.screens[0].root);
  const result = validateSemanticProject(document, { source: "object-cycle" });
  assert.ok(result.diagnostics.some(entry => entry.code === "PRISM_HIERARCHY_CYCLE"));
});

test("navigate actions require a declared target screen", async () => {
  const document = await readFixture("minimal-project.json");
  document.actions[0].kind = "navigate";
  const result = validateSemanticProject(document, { source: "navigate-without-target.json" });
  assert.deepEqual(result.diagnostics.map(({ code, path }) => [code, path]), [[
    "PRISM_ACTION_TARGET_REQUIRED",
    "/actions/0/targetScreenId"
  ]]);
});
