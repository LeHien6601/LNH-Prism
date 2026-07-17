import { createHash } from "node:crypto";

type UnknownRecord = Record<string, unknown>;

export interface UnityAssetRegistryEntry {
  unityAssetId: string;
  metaGuid: string;
  path: string;
  outputSha256: string;
}

export interface UnityAssetRegistry {
  schemaVersion: "1.0";
  profileId: "unity-6000-ugui-builtin-android-portrait";
  entries: UnityAssetRegistryEntry[];
}

const unityProfileId = "unity-6000-ugui-builtin-android-portrait";
const unityAssetPathPattern = /^Assets\/LNHPrism\/Generated\/([a-z][a-z0-9-]*)\/([a-z][a-z0-9-]*)\/([a-z][a-z0-9-]*)\.png$/;
const unityAssetIdPattern = /^lnh-prism:[a-z][a-z0-9-]*$/;
const metaGuidPattern = /^[a-f0-9]{32}$/;

function asRecord(value: unknown, context: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${context} must be an object.`);
  return value as UnknownRecord;
}

function asArray(value: unknown, context: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${context} must be an array.`);
  return value;
}

function asString(value: unknown, context: string): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${context} must be a non-empty string.`);
  return value;
}

function asFiniteNumber(value: unknown, context: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${context} must be a finite number.`);
  return value;
}

function assertUniqueCaseFolded(values: string[], context: string): void {
  const normalized = new Set<string>();
  for (const value of values) {
    const folded = value.toLocaleLowerCase("en-US");
    if (normalized.has(folded)) throw new Error(`${context} contains a case-folded collision for ${value}.`);
    normalized.add(folded);
  }
}

function registryEntries(value: unknown, context: string): UnityAssetRegistryEntry[] {
  const registry = asRecord(value, context);
  if (registry.schemaVersion !== "1.0") throw new Error(`${context}.schemaVersion must be 1.0.`);
  if (registry.profileId !== unityProfileId) throw new Error(`${context}.profileId must be ${unityProfileId}.`);
  return asArray(registry.entries, `${context}.entries`).map((entryValue, index) => {
    const entry = asRecord(entryValue, `${context}.entries[${index}]`);
    return {
      unityAssetId: asString(entry.unityAssetId, `${context}.entries[${index}].unityAssetId`),
      metaGuid: asString(entry.metaGuid, `${context}.entries[${index}].metaGuid`),
      path: asString(entry.path, `${context}.entries[${index}].path`),
      outputSha256: asString(entry.outputSha256, `${context}.entries[${index}].outputSha256`)
    };
  });
}

function assertNoIdentityDrift(entries: UnityAssetRegistryEntry[], previousRegistry: unknown): void {
  const previousById = new Map(registryEntries(previousRegistry, "Previous Unity asset registry").map((entry) => [entry.unityAssetId, entry]));
  for (const entry of entries) {
    const previous = previousById.get(entry.unityAssetId);
    if (!previous) continue;
    if (entry.metaGuid !== previous.metaGuid) throw new Error(`Unity asset ${entry.unityAssetId} changed metaGuid from ${previous.metaGuid} to ${entry.metaGuid}.`);
    if (entry.path !== previous.path) throw new Error(`Unity asset ${entry.unityAssetId} changed path from ${previous.path} to ${entry.path}.`);
  }
}

/** Derives the stable Unity GUID approved for M4 from a logical Unity asset ID. */
export function deriveUnityMetaGuid(unityAssetId: string): string {
  if (!unityAssetIdPattern.test(unityAssetId)) throw new Error(`Invalid Unity asset ID ${unityAssetId}.`);
  return createHash("sha256").update(`lnh-prism-unity-guid-v1\n${unityAssetId}`, "utf8").digest("hex").slice(0, 32);
}

/** Enforces M4 cross-field invariants that JSON Schema cannot express. */
export function assertUnityManifestSemantics(manifestValue: unknown, previousRegistry?: unknown): void {
  const manifest = asRecord(manifestValue, "Export manifest");
  if (manifest.schemaVersion === "1.0") return;
  if (manifest.schemaVersion !== "1.1") throw new Error("Export manifest.schemaVersion must be 1.0 or 1.1.");

  const profile = asRecord(manifest.unityIntegration, "Export manifest.unityIntegration");
  if (profile.profileId !== unityProfileId) throw new Error(`Export manifest Unity profile must be ${unityProfileId}.`);
  const sources = asRecord(manifest.sources, "Export manifest.sources");
  const styleId = asString(asRecord(sources.style, "Export manifest.sources.style").id, "Export manifest.sources.style.id");
  const componentId = asString(asRecord(sources.component, "Export manifest.sources.component").id, "Export manifest.sources.component.id");
  const outputs = asArray(manifest.outputs, "Export manifest.outputs");
  const entries: UnityAssetRegistryEntry[] = [];

  for (const [index, outputValue] of outputs.entries()) {
    const output = asRecord(outputValue, `Export manifest.outputs[${index}]`);
    const path = asString(output.path, `Export manifest.outputs[${index}].path`);
    const match = unityAssetPathPattern.exec(path);
    if (!match) throw new Error(`Export manifest output path ${path} is outside the canonical generated Unity root or is not safe kebab-case PNG.`);
    const [, pathStyleId, pathComponentId, stem] = match;
    if (pathStyleId !== styleId || pathComponentId !== componentId) {
      throw new Error(`Export manifest output path ${path} must use source style ${styleId} and component ${componentId}.`);
    }

    const unity = asRecord(output.unity, `Export manifest.outputs[${index}].unity`);
    const unityAssetId = asString(unity.assetId, `Export manifest.outputs[${index}].unity.assetId`);
    const metaGuid = asString(unity.metaGuid, `Export manifest.outputs[${index}].unity.metaGuid`);
    const expectedAssetId = `lnh-prism:${stem}`;
    if (unityAssetId !== expectedAssetId) throw new Error(`Unity asset ID ${unityAssetId} must match output stem as ${expectedAssetId}.`);
    const expectedGuid = deriveUnityMetaGuid(unityAssetId);
    if (metaGuid !== expectedGuid) throw new Error(`Unity asset ${unityAssetId} metaGuid must be ${expectedGuid}.`);

    const width = asFiniteNumber(output.width, `Export manifest.outputs[${index}].width`);
    const height = asFiniteNumber(output.height, `Export manifest.outputs[${index}].height`);
    const border = asRecord(unity.border, `Export manifest.outputs[${index}].unity.border`);
    const left = asFiniteNumber(border.left, `Export manifest.outputs[${index}].unity.border.left`);
    const right = asFiniteNumber(border.right, `Export manifest.outputs[${index}].unity.border.right`);
    const top = asFiniteNumber(border.top, `Export manifest.outputs[${index}].unity.border.top`);
    const bottom = asFiniteNumber(border.bottom, `Export manifest.outputs[${index}].unity.border.bottom`);
    if (left + right >= width) throw new Error(`Unity asset ${unityAssetId} horizontal borders must leave at least one center pixel.`);
    if (top + bottom >= height) throw new Error(`Unity asset ${unityAssetId} vertical borders must leave at least one center pixel.`);

    entries.push({
      unityAssetId,
      metaGuid,
      path,
      outputSha256: asString(output.sha256, `Export manifest.outputs[${index}].sha256`)
    });
  }

  assertUniqueCaseFolded(entries.map(({ unityAssetId }) => unityAssetId), "Export manifest Unity asset IDs");
  assertUniqueCaseFolded(entries.map(({ metaGuid }) => metaGuid), "Export manifest Unity meta GUIDs");
  assertUniqueCaseFolded(entries.map(({ path }) => path), "Export manifest Unity output paths");
  if (previousRegistry !== undefined) assertNoIdentityDrift(entries, previousRegistry);
}

/** Creates the sorted registry consumed by later M4 export/import slices. */
export function createUnityAssetRegistry(manifestValue: unknown, previousRegistry?: unknown): UnityAssetRegistry {
  assertUnityManifestSemantics(manifestValue, previousRegistry);
  const manifest = asRecord(manifestValue, "Export manifest");
  if (manifest.schemaVersion !== "1.1") throw new Error("A Unity asset registry can only be created from manifest schemaVersion 1.1.");
  const entries = asArray(manifest.outputs, "Export manifest.outputs").map((outputValue, index) => {
    const output = asRecord(outputValue, `Export manifest.outputs[${index}]`);
    const unity = asRecord(output.unity, `Export manifest.outputs[${index}].unity`);
    return {
      unityAssetId: asString(unity.assetId, `Export manifest.outputs[${index}].unity.assetId`),
      metaGuid: asString(unity.metaGuid, `Export manifest.outputs[${index}].unity.metaGuid`),
      path: asString(output.path, `Export manifest.outputs[${index}].path`),
      outputSha256: asString(output.sha256, `Export manifest.outputs[${index}].sha256`)
    };
  }).sort((left, right) => left.unityAssetId.localeCompare(right.unityAssetId, "en-US"));
  return { schemaVersion: "1.0", profileId: unityProfileId, entries };
}

/** Enforces uniqueness, derivation, ordering, and optional prior-registry stability. */
export function assertUnityAssetRegistrySemantics(registryValue: unknown, previousRegistry?: unknown): void {
  const entries = registryEntries(registryValue, "Unity asset registry");
  assertUniqueCaseFolded(entries.map(({ unityAssetId }) => unityAssetId), "Unity asset registry IDs");
  assertUniqueCaseFolded(entries.map(({ metaGuid }) => metaGuid), "Unity asset registry GUIDs");
  assertUniqueCaseFolded(entries.map(({ path }) => path), "Unity asset registry paths");

  const sortedIds = entries.map(({ unityAssetId }) => unityAssetId).sort((left, right) => left.localeCompare(right, "en-US"));
  if (JSON.stringify(entries.map(({ unityAssetId }) => unityAssetId)) !== JSON.stringify(sortedIds)) {
    throw new Error("Unity asset registry entries must be sorted by unityAssetId.");
  }
  for (const entry of entries) {
    if (!unityAssetPathPattern.test(entry.path)) throw new Error(`Unity asset registry path ${entry.path} is outside the canonical generated root.`);
    if (!metaGuidPattern.test(entry.metaGuid)) throw new Error(`Unity asset registry GUID ${entry.metaGuid} must be 32 lowercase hex characters.`);
    const expectedGuid = deriveUnityMetaGuid(entry.unityAssetId);
    if (entry.metaGuid !== expectedGuid) throw new Error(`Unity asset ${entry.unityAssetId} registry metaGuid must be ${expectedGuid}.`);
  }
  if (previousRegistry !== undefined) assertNoIdentityDrift(entries, previousRegistry);
}
