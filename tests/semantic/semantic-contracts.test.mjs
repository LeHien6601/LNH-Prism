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
  ["unsupported-component-type.json", "PRISM_COMPONENT_TYPE_UNSUPPORTED", "/screens/0/root/type"]
]) {
  test(`${fixture} fails with an actionable machine-readable diagnostic`, async () => {
    const result = validateSemanticProject(await readFixture(fixture), { source: fixture });
    assert.equal(result.valid, false);
    assert.deepEqual(result.diagnostics.map(({ code: actualCode, path: actualPath }) => [actualCode, actualPath]), [[code, path]]);
    assert.ok(result.diagnostics[0].message.length > 20);
    assert.equal(result.diagnostics[0].severity, "error");
  });
}
