import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { assertUnityAssetRegistrySemantics, assertUnityManifestSemantics } from "../dist/unity/export-manifest-contract.js";

const evidence=resolve("docs/validation/evidence/m4-s2-frostbound-unity-bundle"), bundle=join(evidence,"bundle");
const readJson=async(path)=>JSON.parse(await readFile(path,"utf8"));
const ajv=new Ajv2020({allErrors:true,strict:true}); addFormats(ajv);
const validateManifest=ajv.compile(await readJson("specs/schemas/export-manifest.schema.json"));
const validateRegistry=ajv.compile(await readJson("specs/schemas/unity-asset-registry.schema.json"));
const registry=await readJson(join(bundle,"unity-asset-registry.json"));
assert.equal(validateRegistry(registry),true,ajv.errorsText(validateRegistry.errors)); assertUnityAssetRegistrySemantics(registry); assert.equal(registry.entries.length,28);
const manifestNames=(await readdir(join(bundle,"Manifests"))).filter((name)=>name.endsWith(".manifest.json")).sort(); assert.equal(manifestNames.length,5);
for(const name of manifestNames){ const manifest=await readJson(join(bundle,"Manifests",name)); assert.equal(validateManifest(manifest),true,ajv.errorsText(validateManifest.errors)); assertUnityManifestSemantics(manifest,registry); for(const output of manifest.outputs){ const bytes=await readFile(join(bundle,output.path)); assert.equal(createHash("sha256").update(bytes).digest("hex"),output.sha256); } }
for(const name of manifestNames){
  const manifest=await readJson(join(bundle,"Manifests",name));
  for(const source of manifest.provenance.sourceFiles){
    const normalized=(await readFile(source.path,"utf8")).replaceAll("\r\n","\n");
    assert.equal(createHash("sha256").update(normalized).digest("hex"),source.sha256,source.path);
  }
  const tree=manifest.provenance.sourceFiles.map(({role,path,sha256})=>`${role}:${path}:${sha256}`).join("\n");
  assert.equal(createHash("sha256").update(tree).digest("hex"),manifest.provenance.sourceTreeSha256);
}
const collision=await readJson(join(evidence,"collision-audit.json")); const repeat=await readJson(join(evidence,"repeat-export-proof.json"));
assert.equal(collision.status,"pass"); assert.equal(repeat.status,"pass"); assert.equal(repeat.assetCount,28); assert.deepEqual(repeat.firstInventory,repeat.secondInventory);
console.log("Validated M4-S2 Frostbound Unity bundle: 28 assets, 5 manifests, stable registry, zero collisions, repeat export pass.");
