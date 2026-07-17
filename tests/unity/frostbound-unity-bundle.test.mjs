import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { renderFrostboundLockBadgeSvg } from "../../dist/renderer/frostbound-components.js";
import { writeFrostboundUnityBundle } from "../../dist/unity/frostbound-unity-bundle.js";
import { assertUnityAssetRegistrySemantics, assertUnityManifestSemantics } from "../../dist/unity/export-manifest-contract.js";

async function inventory(root, prefix = "") {
  const result = [];
  for (const entry of await readdir(join(root,prefix),{withFileTypes:true})) {
    const relative = join(prefix,entry.name);
    if (entry.isDirectory()) result.push(...await inventory(root,relative));
    else result.push([relative.replaceAll("\\","/"),await readFile(join(root,relative))]);
  }
  return result.sort(([a],[b]) => a.localeCompare(b,"en-US"));
}

test("writes the exact deterministic Frostbound Unity matrix", async () => {
  const a = await mkdtemp(join(tmpdir(),"lnh-prism-m4-a-"));
  const b = await mkdtemp(join(tmpdir(),"lnh-prism-m4-b-"));
  try {
    const first = await writeFrostboundUnityBundle(a);
    const second = await writeFrostboundUnityBundle(b,{previousRegistry:first.registry});
    assert.equal(first.registry.entries.length,28);
    assert.equal(first.manifests.length,5);
    assert.deepEqual(first.registry,second.registry);
    const firstFiles = await inventory(a); const secondFiles = await inventory(b);
    assert.deepEqual(firstFiles.map(([path])=>path),secondFiles.map(([path])=>path));
    firstFiles.forEach(([path,bytes],index) => assert.deepEqual(bytes,secondFiles[index][1],path));
    const counts = Object.fromEntries(first.manifests.map((manifest) => [manifest.sources.component.id,manifest.outputs.length]));
    assert.deepEqual(counts,{"frostbound-reward-panel":1,"frostbound-claim-button":6,"frostbound-later-button":6,"frostbound-reward-progress":10,"frostbound-reward-emblem-container":5});
    assert.equal(first.collisionAudit.status,"pass");
    assert.doesNotThrow(() => assertUnityAssetRegistrySemantics(first.registry,first.registry));
  } finally { await rm(a,{recursive:true,force:true}); await rm(b,{recursive:true,force:true}); }
});

test("bundle manifests and registry satisfy schemas and semantic contracts", async () => {
  const root = await mkdtemp(join(tmpdir(),"lnh-prism-m4-schema-"));
  try {
    const result = await writeFrostboundUnityBundle(root);
    const ajv = new Ajv2020({allErrors:true,strict:true}); addFormats(ajv);
    const manifestSchema = JSON.parse(await readFile("specs/schemas/export-manifest.schema.json","utf8"));
    const registrySchema = JSON.parse(await readFile("specs/schemas/unity-asset-registry.schema.json","utf8"));
    const validateManifest = ajv.compile(manifestSchema); const validateRegistry = ajv.compile(registrySchema);
    for (const manifest of result.manifests) {
      assert.equal(validateManifest(manifest),true,ajv.errorsText(validateManifest.errors));
      assert.doesNotThrow(() => assertUnityManifestSemantics(manifest));
      for (const output of manifest.outputs) assert.equal((await readFile(join(root,output.path))).length > 0,true);
    }
    assert.equal(validateRegistry(result.registry),true,ajv.errorsText(validateRegistry.errors));
  } finally { await rm(root,{recursive:true,force:true}); }
});

test("lock badge recipe is deterministic and bounded", () => {
  assert.equal(renderFrostboundLockBadgeSvg(),renderFrostboundLockBadgeSvg());
  assert.throws(() => renderFrostboundLockBadgeSvg(64),/approved 48x48/);
});
