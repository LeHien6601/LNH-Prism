import assert from "node:assert/strict";
import test from "node:test";
import { resolveStyleDocuments, validateMaterialBindings } from "../../dist/resolver/style-resolver.js";

const sha = (character) => character.repeat(64);
const root = {
  id: "neon-core", version: "0.1.0", path: "specs/styles/neon-core.json", sha256: sha("a"),
  tokens: { colors: { primary: "#4F84FF" }, shape: { cornerRadius: 24 }, lighting: { highlightDirection: "top" }, spacing: { md: 16 } },
  renderDefaults: { targetScale: 2 }
};
const overlay = {
  id: "neon-market", version: "0.1.0", path: "specs/styles/neon-market.json", sha256: sha("b"),
  extends: { id: "neon-core", version: "0.1.0" },
  tokens: { colors: { accent: "#00FFFF" }, material: { edgeLightOpacity: 0.42 } },
  renderDefaults: { targetScale: 2 }
};

test("resolves a version-pinned overlay deterministically with ancestor provenance", () => {
  const first = resolveStyleDocuments([root, overlay], { id: "neon-market", version: "0.1.0" });
  const second = resolveStyleDocuments([root, overlay], { id: "neon-market", version: "0.1.0" });
  assert.deepEqual(first, second);
  assert.equal(first.document.tokens.colors.primary, "#4F84FF");
  assert.equal(first.document.tokens.colors.accent, "#00FFFF");
  assert.deepEqual(first.provenance.ancestors.map(({ path, sha256 }) => ({ path, sha256 })), [
    { path: root.path, sha256: root.sha256 }, { path: overlay.path, sha256: overlay.sha256 }
  ]);
});

test("rejects missing parents, version mismatches, cycles, and incomplete resolved styles", () => {
  assert.throws(() => resolveStyleDocuments([overlay], { id: "neon-market", version: "0.1.0" }), /Missing parent/);
  assert.throws(() => resolveStyleDocuments([root, { ...overlay, extends: { id: "neon-core", version: "9.9.9" } }], { id: "neon-market", version: "0.1.0" }), /version mismatch/);
  const cycle = { ...overlay, id: "cycle-style", extends: { id: "cycle-style", version: "0.1.0" } };
  assert.throws(() => resolveStyleDocuments([cycle], { id: "cycle-style", version: "0.1.0" }), /cycle/);
  const indirectOne = { ...overlay, id: "indirect-one", extends: { id: "indirect-two", version: "0.1.0" } };
  const indirectTwo = { ...overlay, id: "indirect-two", extends: { id: "indirect-one", version: "0.1.0" } };
  assert.throws(() => resolveStyleDocuments([indirectOne, indirectTwo], { id: "indirect-one", version: "0.1.0" }), /cycle/);
  const incomplete = { id: "incomplete-style", version: "0.1.0", path: "specs/styles/incomplete.json", tokens: { colors: { primary: "#FFFFFF" } }, renderDefaults: { targetScale: 2 } };
  assert.throws(() => resolveStyleDocuments([incomplete], { id: "incomplete-style", version: "0.1.0" }), /incomplete/);
});

test("rejects unknown slots/materials, disallowed overrides, and invalid bounds", () => {
  const pack = { materials: [{ id: "alloy-grain" }] };
  const policy = { "surface-grain": ["grainOpacity"] };
  validateMaterialBindings([{ slot: "surface-grain", materialId: "alloy-grain", overrides: { grainOpacity: 0.1 } }], pack, policy);
  assert.throws(() => validateMaterialBindings([{ slot: "missing-slot", materialId: "alloy-grain" }], pack, policy), /Unknown material binding slot/);
  assert.throws(() => validateMaterialBindings([{ slot: "surface-grain", materialId: "missing-material" }], pack, policy), /Unknown material/);
  assert.throws(() => validateMaterialBindings([{ slot: "surface-grain", materialId: "alloy-grain", overrides: { patternOpacity: 0.1 } }], pack, policy), /cannot override/);
  assert.throws(() => validateMaterialBindings([{ slot: "surface-grain", materialId: "alloy-grain", overrides: { grainOpacity: 0.21 } }], pack, policy), /between/);
});
