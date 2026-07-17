import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { renderFrostboundComponentSvg, renderFrostboundLockBadgeSvg, renderFrostboundProgressFillSvg, renderFrostboundProgressFrameSvg, type FrostboundState } from "../renderer/frostbound-components.js";
import { RENDERER_VERSION } from "../renderer/version.js";
import { assertUnityAssetRegistrySemantics, assertUnityManifestSemantics, deriveUnityMetaGuid, type UnityAssetRegistry, type UnityAssetRegistryEntry } from "./export-manifest-contract.js";

type Border = { left: number; right: number; top: number; bottom: number };
type Asset = { componentId: string; part?: string; variant?: string; state: FrostboundState | "locked"; width: number; height: number; border: Border; svg: string };
type Json = Record<string, unknown>;

const styleId = "frostbound-reward";
const generatedAtDefault = "2026-07-17T00:00:00.000Z";
const componentPaths: Record<string, string> = {
  "frostbound-reward-panel": "specs/examples/frostbound-reward-panel.json",
  "frostbound-claim-button": "specs/examples/frostbound-claim-button.json",
  "frostbound-later-button": "specs/examples/frostbound-later-button.json",
  "frostbound-reward-progress": "specs/examples/frostbound-reward-progress.json",
  "frostbound-reward-emblem-container": "specs/examples/frostbound-reward-emblem-container.json"
};
const commonSources = [
  ["style-spec", "specs/examples/style-frostbound-reward.json"],
  ["material-pack", "specs/examples/frost-crystal-materials.json"],
  ["material-source", "materials/frost-crystal/frost-grain.json"],
  ["material-source", "materials/frost-crystal/crystal-facet-pattern.json"],
  ["material-source", "materials/frost-crystal/rune-ornament.json"],
  ["renderer-source", "src/renderer/frostbound-components.ts"],
  ["renderer-version", "src/renderer/version.ts"],
  ["provenance-engine", "src/unity/export-manifest-contract.ts"],
  ["provenance-engine", "src/unity/frostbound-unity-bundle.ts"],
  ["dependency-lock", "package-lock.json"]
] as const;

const sha = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
const normalizedFile = async (path: string) => (await readFile(path, "utf8")).replaceAll("\r\n", "\n");
const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

function assets(): Asset[] {
  const buttonStates = ["normal", "pressed", "disabled"] as const;
  const emblemStates = ["normal", "selected"] as const;
  return [
    { componentId:"frostbound-reward-panel", state:"normal", width:432, height:300, border:{left:48,right:48,top:48,bottom:48}, svg:renderFrostboundComponentSvg({component:"panel",width:432,height:300,instanceId:"unity-panel"}) },
    ...[240,288].flatMap((width) => buttonStates.map((state): Asset => ({ componentId:"frostbound-claim-button", state, width, height:64, border:{left:36,right:36,top:24,bottom:24}, svg:renderFrostboundComponentSvg({component:"primary-button",width,height:64,state,label:"CLAIM",instanceId:`unity-claim-${width}-${state}`}) }))),
    ...[160,200].flatMap((width) => buttonStates.map((state): Asset => ({ componentId:"frostbound-later-button", state, width, height:52, border:{left:30,right:30,top:20,bottom:20}, svg:renderFrostboundComponentSvg({component:"secondary-button",width,height:52,state,label:"LATER",instanceId:`unity-later-${width}-${state}`}) }))),
    ...[320,432].flatMap((width): Asset[] => [
      { componentId:"frostbound-reward-progress", part:"frame", state:"normal", width, height:28, border:{left:28,right:28,top:14,bottom:14}, svg:renderFrostboundProgressFrameSvg(width,`unity-progress-frame-${width}`) },
      ...([10,50,75,90] as const).map((percent): Asset => ({ componentId:"frostbound-reward-progress", part:"fill", variant:String(percent), state:"normal", width, height:28, border:{left:0,right:0,top:0,bottom:0}, svg:renderFrostboundProgressFillSvg(width,percent,`unity-progress-fill-${width}-${percent}`) }))
    ]),
    ...[104,144].flatMap((width) => emblemStates.map((state): Asset => ({ componentId:"frostbound-reward-emblem-container", state, width, height:width, border:{left:0,right:0,top:0,bottom:0}, svg:renderFrostboundComponentSvg({component:"emblem",width,height:width,state,instanceId:`unity-emblem-${width}-${state}`}) }))),
    { componentId:"frostbound-reward-emblem-container", part:"lock-badge", state:"locked", width:48, height:48, border:{left:0,right:0,top:0,bottom:0}, svg:renderFrostboundLockBadgeSvg(48,"unity-lock-badge") }
  ];
}

function unity(border: Border, assetId: string) {
  return { assetId, metaGuid:deriveUnityMetaGuid(assetId), pixelsPerUnit:100, pivot:{x:0.5,y:0.5}, border, atlasGroup:"ui-frostbound-reward", spriteMode:"single", meshType:"full-rect", filterMode:"bilinear", wrapMode:"clamp", mipmaps:false, alphaIsTransparency:true, compression:"uncompressed" };
}

export interface FrostboundBundleResult { manifests: Json[]; registry: UnityAssetRegistry; receipt: Json; collisionAudit: Json }

/** Writes the complete deterministic Frostbound Unity handoff bundle. */
export async function writeFrostboundUnityBundle(outputRoot: string, options: { generatedAt?: string; previousRegistry?: unknown } = {}): Promise<FrostboundBundleResult> {
  const repo = process.cwd();
  const root = resolve(outputRoot);
  const generatedAt = options.generatedAt ?? generatedAtDefault;
  const rendered = [] as Array<Asset & { stem:string; path:string; png:Buffer; outputSha256:string }>;
  for (const asset of assets()) {
    const segments = [styleId, asset.componentId, asset.part, asset.variant, asset.state, `${asset.width}x${asset.height}`].filter(Boolean);
    const stem = segments.join("-");
    const path = `Assets/LNHPrism/Generated/${styleId}/${asset.componentId}/${stem}.png`;
    const png = Buffer.from(new Resvg(asset.svg).render().asPng());
    await mkdir(join(root, path, ".."), { recursive:true });
    await writeFile(join(root, path), png);
    rendered.push({ ...asset, stem, path, png, outputSha256:sha(png) });
  }

  const manifests: Json[] = [];
  const entries: UnityAssetRegistryEntry[] = [];
  for (const [componentId, componentPath] of Object.entries(componentPaths)) {
    const sourcePairs = [["component-spec", componentPath] as const, ...commonSources];
    const sourceFiles = await Promise.all(sourcePairs.map(async ([role,path]) => ({ role, path, sha256:sha(await normalizedFile(join(repo,path))) })));
    const sourceTreeSha256 = sha(sourceFiles.map(({role,path,sha256}) => `${role}:${path}:${sha256}`).join("\n"));
    const style = JSON.parse(await normalizedFile(join(repo,"specs/examples/style-frostbound-reward.json")));
    const component = JSON.parse(await normalizedFile(join(repo,componentPath)));
    const material = JSON.parse(await normalizedFile(join(repo,"specs/examples/frost-crystal-materials.json")));
    const outputs = rendered.filter((item) => item.componentId === componentId).map((item) => {
      const assetId = `lnh-prism:${item.stem}`;
      const output = { path:item.path, format:"png", width:item.width*2, height:item.height*2, sha256:item.outputSha256, state:item.state, unity:unity(item.border,assetId) };
      entries.push({ unityAssetId:assetId, metaGuid:output.unity.metaGuid, path:item.path, outputSha256:item.outputSha256 });
      return output;
    });
    const fileByPath = new Map(sourceFiles.map((file) => [file.path,file]));
    const manifest = { schemaVersion:"1.1", assetId:`${componentId}-unity`, generatedAt, renderer:{name:"lnh-prism-renderer",version:RENDERER_VERSION}, sources:{ style:{id:style.id,version:style.version,path:"specs/examples/style-frostbound-reward.json",sha256:fileByPath.get("specs/examples/style-frostbound-reward.json")!.sha256}, component:{id:component.id,version:component.version,path:componentPath,sha256:fileByPath.get(componentPath)!.sha256}, materialPacks:[{id:material.id,version:material.version,path:"specs/examples/frost-crystal-materials.json",sha256:fileByPath.get("specs/examples/frost-crystal-materials.json")!.sha256}] }, provenance:{sourceTreeSha256,sourceFiles}, unityIntegration:{profileId:"unity-6000-ugui-builtin-android-portrait",editorVersion:"6000.3.18f1",uiSystem:"ugui",renderPipeline:"built-in",referenceResolution:{width:540,height:960},targetPlatform:"android",orientation:"portrait",importerVersion:"0.1.0"}, outputs };
    assertUnityManifestSemantics(manifest, options.previousRegistry);
    manifests.push(manifest);
    await mkdir(join(root,"Manifests"),{recursive:true});
    await writeFile(join(root,"Manifests",`${componentId}.manifest.json`),json(manifest));
  }
  entries.sort((a,b) => a.unityAssetId.localeCompare(b.unityAssetId,"en-US"));
  const registry: UnityAssetRegistry = { schemaVersion:"1.0", profileId:"unity-6000-ugui-builtin-android-portrait", entries };
  assertUnityAssetRegistrySemantics(registry, options.previousRegistry);
  const collisionAudit = { schemaVersion:"1.0", status:"pass", entryCount:entries.length, caseFoldedAssetIdCollisions:[], caseFoldedPathCollisions:[], guidCollisions:[] };
  const receipt = { schemaVersion:"1.0", bundleId:"m4-s2-frostbound-unity-bundle", generatedAt, rendererVersion:RENDERER_VERSION, assetCount:entries.length, manifestCount:manifests.length, registrySha256:sha(json(registry)), sourceOutputReceipt:entries.map((entry) => ({ unityAssetId:entry.unityAssetId, outputSha256:entry.outputSha256 })) };
  await writeFile(join(root,"unity-asset-registry.json"),json(registry));
  await writeFile(join(root,"bundle-receipt.json"),json(receipt));
  return { manifests, registry, receipt, collisionAudit };
}
