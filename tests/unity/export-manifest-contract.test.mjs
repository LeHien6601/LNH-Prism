import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  assertUnityAssetRegistrySemantics,
  assertUnityManifestSemantics,
  createUnityAssetRegistry,
  deriveUnityMetaGuid
} from "../../dist/unity/export-manifest-contract.js";

const root = process.cwd();
const loadJson = async (...segments) => JSON.parse(await readFile(join(root, ...segments), "utf8"));
const [manifestSchema, registrySchema, legacyManifest, unityManifest, unityRegistry] = await Promise.all([
  loadJson("specs", "schemas", "export-manifest.schema.json"),
  loadJson("specs", "schemas", "unity-asset-registry.schema.json"),
  loadJson("specs", "examples", "primary-button-normal.manifest.json"),
  loadJson("specs", "examples", "frostbound-reward-panel.unity.manifest.json"),
  loadJson("specs", "examples", "frostbound-reward-panel.unity.registry.json")
]);
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateManifest = ajv.compile(manifestSchema);
const validateRegistry = ajv.compile(registrySchema);

test("accepts legacy 1.0 and canonical Unity 1.1 fixtures", () => {
  assert.equal(validateManifest(legacyManifest), true, ajv.errorsText(validateManifest.errors));
  assert.equal(validateManifest(unityManifest), true, ajv.errorsText(validateManifest.errors));
  assert.equal(validateRegistry(unityRegistry), true, ajv.errorsText(validateRegistry.errors));
  assert.doesNotThrow(() => assertUnityManifestSemantics(legacyManifest));
  assert.doesNotThrow(() => assertUnityManifestSemantics(unityManifest));
  assert.doesNotThrow(() => assertUnityAssetRegistrySemantics(unityRegistry));
  assert.deepEqual(createUnityAssetRegistry(unityManifest), unityRegistry);
});

test("derives stable namespaced Unity GUIDs", () => {
  const assetId = unityManifest.outputs[0].unity.assetId;
  assert.equal(deriveUnityMetaGuid(assetId), "d75846e2ecbf34b9390c07c4b72dc174");
  assert.equal(deriveUnityMetaGuid(assetId), deriveUnityMetaGuid(assetId));
  assert.throws(() => deriveUnityMetaGuid("Frostbound Panel"), /Invalid Unity asset ID/);
});

test("rejects 1.1 fields on legacy manifests and incomplete or drifting Unity profiles", () => {
  const pollutedLegacy = structuredClone(legacyManifest);
  pollutedLegacy.outputs[0].unity.assetId = unityManifest.outputs[0].unity.assetId;
  assert.equal(validateManifest(pollutedLegacy), false);

  const missingProfile = structuredClone(unityManifest);
  delete missingProfile.unityIntegration;
  assert.equal(validateManifest(missingProfile), false);

  const wrongEditor = structuredClone(unityManifest);
  wrongEditor.unityIntegration.editorVersion = "6000.3.19f1";
  assert.equal(validateManifest(wrongEditor), false);

  const wrongSetting = structuredClone(unityManifest);
  wrongSetting.outputs[0].unity.wrapMode = "repeat";
  assert.equal(validateManifest(wrongSetting), false);
});

test("rejects unsafe paths, naming drift, GUID drift, and collapsed slice centers", () => {
  const unsafePath = structuredClone(unityManifest);
  unsafePath.outputs[0].path = "Assets/LNHPrism/Generated/frostbound-reward/../escape.png";
  assert.equal(validateManifest(unsafePath), false);
  assert.throws(() => assertUnityManifestSemantics(unsafePath), /outside the canonical generated Unity root/);

  const wrongName = structuredClone(unityManifest);
  wrongName.outputs[0].unity.assetId = "lnh-prism:frostbound-wrong-name";
  wrongName.outputs[0].unity.metaGuid = deriveUnityMetaGuid(wrongName.outputs[0].unity.assetId);
  assert.throws(() => assertUnityManifestSemantics(wrongName), /must match output stem/);

  const wrongGuid = structuredClone(unityManifest);
  wrongGuid.outputs[0].unity.metaGuid = "a".repeat(32);
  assert.throws(() => assertUnityManifestSemantics(wrongGuid), /metaGuid must be/);

  const collapsed = structuredClone(unityManifest);
  collapsed.outputs[0].unity.border.left = 432;
  collapsed.outputs[0].unity.border.right = 432;
  assert.equal(validateManifest(collapsed), true, ajv.errorsText(validateManifest.errors));
  assert.throws(() => assertUnityManifestSemantics(collapsed), /horizontal borders must leave at least one center pixel/);

  const negativeBorder = structuredClone(unityManifest);
  negativeBorder.outputs[0].unity.border.top = -1;
  assert.equal(validateManifest(negativeBorder), false);
});

test("rejects case-folded registry collisions and GUID collisions", () => {
  const caseFolded = structuredClone(unityRegistry);
  const duplicate = structuredClone(caseFolded.entries[0]);
  duplicate.unityAssetId = duplicate.unityAssetId.toUpperCase();
  duplicate.path = duplicate.path.toUpperCase();
  caseFolded.entries.push(duplicate);
  assert.throws(() => assertUnityAssetRegistrySemantics(caseFolded), /case-folded collision/);

  const pathCollision = structuredClone(unityRegistry);
  const samePath = structuredClone(pathCollision.entries[0]);
  samePath.unityAssetId = "lnh-prism:frostbound-reward-frostbound-reward-panel-normal-432x300";
  samePath.metaGuid = deriveUnityMetaGuid(samePath.unityAssetId);
  samePath.path = samePath.path.toUpperCase();
  pathCollision.entries.push(samePath);
  assert.throws(() => assertUnityAssetRegistrySemantics(pathCollision), /paths contains a case-folded collision/);

  const guidCollision = structuredClone(unityRegistry);
  const second = structuredClone(guidCollision.entries[0]);
  second.unityAssetId = "lnh-prism:frostbound-reward-frostbound-reward-panel-normal-432x300";
  second.path = "Assets/LNHPrism/Generated/frostbound-reward/frostbound-reward-panel/frostbound-reward-frostbound-reward-panel-normal-432x300.png";
  guidCollision.entries.push(second);
  assert.throws(() => assertUnityAssetRegistrySemantics(guidCollision), /GUIDs contains a case-folded collision/);
});

test("rejects registry ordering changes and stable identity drift", () => {
  const secondManifest = structuredClone(unityManifest);
  const secondOutput = structuredClone(secondManifest.outputs[0]);
  secondOutput.path = "Assets/LNHPrism/Generated/frostbound-reward/frostbound-reward-panel/frostbound-reward-frostbound-reward-panel-normal-432x300.png";
  secondOutput.width = 864;
  secondOutput.height = 600;
  secondOutput.sha256 = "9".repeat(64);
  secondOutput.unity.assetId = "lnh-prism:frostbound-reward-frostbound-reward-panel-normal-432x300";
  secondOutput.unity.metaGuid = deriveUnityMetaGuid(secondOutput.unity.assetId);
  secondManifest.outputs.unshift(secondOutput);
  const sortedRegistry = createUnityAssetRegistry(secondManifest);
  assert.doesNotThrow(() => assertUnityAssetRegistrySemantics(sortedRegistry));
  const reversed = structuredClone(sortedRegistry);
  reversed.entries.reverse();
  assert.throws(() => assertUnityAssetRegistrySemantics(reversed), /must be sorted/);

  const moved = structuredClone(unityManifest);
  moved.outputs[0].path = "Assets/LNHPrism/Generated/frostbound-reward/frostbound-reward-panel/frostbound-reward-frostbound-reward-panel-normal-moved-432x420.png";
  moved.outputs[0].unity.assetId = "lnh-prism:frostbound-reward-frostbound-reward-panel-normal-moved-432x420";
  moved.outputs[0].unity.metaGuid = deriveUnityMetaGuid(moved.outputs[0].unity.assetId);
  const currentWithStableId = createUnityAssetRegistry(unityManifest);
  currentWithStableId.entries[0].path = moved.outputs[0].path;
  assert.throws(() => assertUnityAssetRegistrySemantics(currentWithStableId, unityRegistry), /changed path/);
});
