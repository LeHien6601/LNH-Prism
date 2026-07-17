import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const project=resolve("unity/v4-frostbound-reward-claim"), evidence=resolve("docs/validation/evidence/m4-s3-unity-import");
const required=["Packages/manifest.json","Packages/packages-lock.json","ProjectSettings/ProjectVersion.txt","ProjectSettings/ProjectSettings.asset","Assets/LNHPrism/Editor/FrostboundUnityImporter.cs","Assets/LNHPrism/Generated/FrostboundBindings.asset","Assets/LNHPrism/Generated/ui-frostbound-reward.spriteatlas","Assets/LNHPrism/Generated/unity-asset-registry.json","Assets/LNHPrism/Generated/Manifests/frostbound-reward-panel.manifest.json","Assets/LNHPrism/Prefabs/RewardPanel.prefab","Assets/LNHPrism/Prefabs/RewardPanelTall.prefab","Assets/LNHPrism/Prefabs/FrostboundRewardClaim.prefab","Assets/LNHPrism/Scenes/V4FrostboundRewardClaim.unity","Assets/LNHPrism/Tests/EditMode/FrostboundImportTests.cs"];
for(const path of required) assert.equal(existsSync(resolve(project,path)),true,`Missing ${path}`);
const version=readFileSync(resolve(project,"ProjectSettings/ProjectVersion.txt"),"utf8"); assert.match(version,/6000\.3\.18f1/); assert.match(version,/5ebeb53e4c07/);
const packages=JSON.parse(readFileSync(resolve(project,"Packages/manifest.json"),"utf8")); assert.equal(packages.dependencies["com.unity.ugui"],"2.0.0"); assert.equal(packages.dependencies["com.unity.test-framework"],"1.6.0");
const registry=JSON.parse(readFileSync(resolve(project,"Assets/LNHPrism/Generated/unity-asset-registry.json"),"utf8")); assert.equal(registry.entries.length,28);
for(const entry of registry.entries){ const asset=resolve(project,entry.path), meta=readFileSync(`${asset}.meta`,"utf8"); assert.equal(createHash("sha256").update(readFileSync(asset)).digest("hex"),entry.outputSha256,entry.path); assert.match(meta,new RegExp(`^guid: ${entry.metaGuid}$`,`m`),entry.path); }
const receipt=JSON.parse(readFileSync(resolve(evidence,"import-receipt.json"),"utf8")); assert.equal(receipt.status,"pass"); assert.equal(receipt.unityVersion,"6000.3.18f1"); assert.equal(receipt.profileId,"unity-6000-ugui-builtin-android-portrait"); assert.equal(receipt.created,0); assert.equal(receipt.updated,0); assert.equal(receipt.unchanged,28); assert.equal(receipt.rejected,0); assert.equal(receipt.manifestSha256.length,5); assert.equal(receipt.sourceTreeSha256.length,5); assert.equal(receipt.outputSha256.length,28); assert.deepEqual(receipt.diagnostics,[]);
const results=readFileSync(resolve(evidence,"edit-mode-results.xml"),"utf8"); assert.match(results,/(result="Passed"|failed="0")/); assert.doesNotMatch(results,/result="Failed"/);
const index=JSON.parse(readFileSync(resolve(evidence,"evidence-index.json"),"utf8")); assert.equal(index.status,"pass"); assert.equal(index.declaredSpriteCount,28); assert.equal(index.atlasMemberCount,28); assert.deepEqual(index.editModeTests,{total:4,passed:4,failed:0});
console.log("Validated M4-S3 pinned Unity project, no-op import receipt, and passing Edit Mode results.");
