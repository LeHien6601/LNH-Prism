import { createHash } from "node:crypto";

export interface StyleReference {
  id: string;
  version: string;
}

export interface RepositoryStyleDocument {
  id: string;
  version: string;
  path: string;
  sha256?: string;
  extends?: StyleReference;
  [key: string]: unknown;
}

export interface ResolvedStyleProvenance {
  ancestors: Array<{ id: string; version: string; path: string; sha256: string }>;
}

export interface ResolvedStyle {
  document: RepositoryStyleDocument;
  provenance: ResolvedStyleProvenance;
}

export interface MaterialBinding {
  slot: string;
  materialId: string;
  overrides?: Record<string, number>;
}

export interface MaterialPackLookup {
  materials: Array<{ id: string }>;
}

export type TemplateBindingPolicy = Record<string, readonly string[]>;

const materialBounds: Record<string, readonly [number, number]> = {
  grainOpacity: [0, 0.2],
  patternOpacity: [0, 0.18],
  patternScale: [16, 64],
  edgeLightOpacity: [0, 0.65],
  bevelDepth: [0, 4],
  decalOpacity: [0, 0.3]
};

function sourceHash(document: RepositoryStyleDocument): string {
  return document.sha256 ?? createHash("sha256").update(JSON.stringify(document)).digest("hex");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function merge(parent: unknown, child: unknown): unknown {
  if (Array.isArray(child)) return structuredClone(child);
  if (!isRecord(parent) || !isRecord(child)) return structuredClone(child);

  const result: Record<string, unknown> = structuredClone(parent);
  for (const [key, childValue] of Object.entries(child)) {
    result[key] = key in result ? merge(result[key], childValue) : structuredClone(childValue);
  }
  return result;
}

function requireCompleteResolvedStyle(style: RepositoryStyleDocument): void {
  const tokens = style.tokens;
  const renderDefaults = style.renderDefaults;
  if (!isRecord(tokens) || !isRecord(tokens.colors) || Object.keys(tokens.colors).length === 0 || !isRecord(tokens.shape) || typeof tokens.shape.cornerRadius !== "number" || !isRecord(tokens.lighting) || typeof tokens.lighting.highlightDirection !== "string" || !isRecord(tokens.spacing) || Object.keys(tokens.spacing).length === 0 || !isRecord(renderDefaults) || typeof renderDefaults.targetScale !== "number") {
    throw new Error(`Resolved style ${style.id}@${style.version} is incomplete.`);
  }

  const material = tokens.material;
  if (material !== undefined) validateBoundedMaterialValues(material, `Resolved style ${style.id}@${style.version} tokens.material`);
}

function validateBoundedMaterialValues(value: unknown, context: string): void {
  if (!isRecord(value)) throw new Error(`${context} must be an object.`);
  for (const [name, numericValue] of Object.entries(value)) {
    const bounds = materialBounds[name];
    if (!bounds) throw new Error(`${context} contains unsupported control ${name}.`);
    if (typeof numericValue !== "number" || numericValue < bounds[0] || numericValue > bounds[1]) {
      throw new Error(`${context}.${name} must be between ${bounds[0]} and ${bounds[1]}.`);
    }
  }
}

/** Resolves a repository-owned, version-pinned style inheritance graph. */
export function resolveStyleDocuments(documents: readonly RepositoryStyleDocument[], target: StyleReference): ResolvedStyle {
  const byKey = new Map<string, RepositoryStyleDocument>();
  for (const document of documents) {
    const key = `${document.id}@${document.version}`;
    if (byKey.has(key)) throw new Error(`Duplicate style document ${key}.`);
    byKey.set(key, document);
  }

  const visiting = new Set<string>();
  const resolve = (reference: StyleReference): ResolvedStyle => {
    const key = `${reference.id}@${reference.version}`;
    const document = byKey.get(key);
    if (!document) {
      if (documents.some((candidate) => candidate.id === reference.id)) {
        throw new Error(`Style parent version mismatch for ${reference.id}; requested ${reference.version}.`);
      }
      throw new Error(`Missing parent style ${key}.`);
    }
    if (visiting.has(key)) throw new Error(`Style inheritance cycle detected at ${key}.`);
    visiting.add(key);

    let inherited: RepositoryStyleDocument = {} as RepositoryStyleDocument;
    let ancestors: ResolvedStyleProvenance["ancestors"] = [];
    if (document.extends) {
      const parent = resolve(document.extends);
      inherited = parent.document;
      ancestors = parent.provenance.ancestors;
    }

    const { extends: _extends, path: _path, sha256: _sha256, ...child } = structuredClone(document);
    const resolved = merge(inherited, child) as RepositoryStyleDocument;
    resolved.path = document.path;
    resolved.sha256 = sourceHash(document);
    requireCompleteResolvedStyle(resolved);
    visiting.delete(key);
    return {
      document: resolved,
      provenance: { ancestors: [...ancestors, { id: document.id, version: document.version, path: document.path, sha256: sourceHash(document) }] }
    };
  };

  return resolve(target);
}

/** Enforces template allowlists, material identity, and global bounded controls. */
export function validateMaterialBindings(bindings: readonly MaterialBinding[], materialPack: MaterialPackLookup, policy: TemplateBindingPolicy): void {
  const materialIds = new Set(materialPack.materials.map(({ id }) => id));
  const usedSlots = new Set<string>();
  for (const binding of bindings) {
    if (usedSlots.has(binding.slot)) throw new Error(`Duplicate material binding for slot ${binding.slot}.`);
    usedSlots.add(binding.slot);
    const allowedControls = policy[binding.slot];
    if (!allowedControls) throw new Error(`Unknown material binding slot ${binding.slot}.`);
    if (!materialIds.has(binding.materialId)) throw new Error(`Unknown material ${binding.materialId} for slot ${binding.slot}.`);
    if (binding.overrides) {
      validateBoundedMaterialValues(binding.overrides, `Material binding ${binding.slot} overrides`);
      for (const control of Object.keys(binding.overrides)) {
        if (!allowedControls.includes(control)) throw new Error(`Material binding ${binding.slot} cannot override ${control}.`);
      }
    }
  }
}
