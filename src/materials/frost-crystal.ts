export type FrostCrystalSourceId = "frost-grain" | "crystal-facet-pattern" | "rune-ornament";

export interface FrostCrystalNormalization {
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  contrast?: number;
  saturation?: number;
  opacity?: number;
}

export interface FrostCrystalSourceReceipt {
  schemaVersion: "1.0";
  id: FrostCrystalSourceId;
  version: string;
  sourceType: "procedural" | "ai-generated" | "artist-provided" | "imported";
  kind: "procedural-tile" | "procedural-decal";
  generationSettings?: string;
  promptOrSettings?: string;
  colorSpace: string;
  resolution: { width: number; height: number; units: string };
  alpha: { minimum: number; maximum: number };
  contrast: number;
  edgeSignature?: { top: string; bottom: string; left: string; right: string };
  transparentBackground: boolean;
  containsConceptPixels: boolean;
  containsComponentGeometry: boolean;
  containsComponentEffects: boolean;
  rights: string;
}

export interface FrostCrystalReuseBinding {
  componentType: "panel" | "button" | "progress" | "reward-emblem-container";
  materialIds: readonly string[];
  boundary: string;
}

const normalizationBounds: Record<keyof Required<FrostCrystalNormalization>, readonly [number, number]> = {
  scale: [0.5, 4],
  offsetX: [0, 1],
  offsetY: [0, 1],
  contrast: [0.5, 1.5],
  saturation: [0, 1.5],
  opacity: [0, 0.3]
};

export const frostCrystalReusePlan: readonly FrostCrystalReuseBinding[] = [
  {
    componentType: "panel",
    materialIds: ["frost-grain-overlay", "crystal-facet-overlay", "rune-ornament-decal"],
    boundary: "Reusable detail is clipped by the deterministic panel surface and ornament slots."
  },
  {
    componentType: "button",
    materialIds: ["frost-grain-overlay", "crystal-facet-overlay"],
    boundary: "Primary and secondary variants share sources; deterministic recipes own silhouette, border, shadow, and state lighting."
  },
  {
    componentType: "progress",
    materialIds: ["frost-grain-overlay", "crystal-facet-overlay"],
    boundary: "Frame and fill remain independent deterministic masks; materials carry no progress geometry."
  },
  {
    componentType: "reward-emblem-container",
    materialIds: ["frost-grain-overlay", "rune-ornament-decal"],
    boundary: "The deterministic container owns normal/selected silhouettes and the rune remains a source-neutral decal."
  }
] as const;

export function validateFrostCrystalNormalization(normalization: FrostCrystalNormalization): void {
  for (const [name, value] of Object.entries(normalization) as Array<[keyof FrostCrystalNormalization, number | undefined]>) {
    if (value === undefined) continue;
    const bounds = normalizationBounds[name];
    if (!bounds || typeof value !== "number" || !Number.isFinite(value) || value < bounds[0] || value > bounds[1]) {
      throw new RangeError(`Frost Crystal normalization ${name} must be between ${bounds?.[0]} and ${bounds?.[1]}; received ${value}.`);
    }
  }
}

export function preflightFrostCrystalSource(source: FrostCrystalSourceReceipt): void {
  if (source.schemaVersion !== "1.0" || !source.id || !source.version) throw new Error("Frost Crystal source must declare schema, ID, and version.");
  if (!source.rights.trim()) throw new Error(`${source.id} must declare rights status.`);
  if (source.colorSpace !== "sRGB") throw new Error(`${source.id} must use sRGB.`);
  if (source.resolution.units !== "logical-pixels" || source.resolution.width < 16 || source.resolution.width > 128 || source.resolution.height < 16 || source.resolution.height > 128) {
    throw new Error(`${source.id} must declare a 16-128 logical-pixel source resolution.`);
  }
  if (source.sourceType === "ai-generated" && !source.promptOrSettings?.trim()) throw new Error(`${source.id} AI source must retain prompt/settings provenance.`);
  if (source.sourceType === "procedural" && !source.generationSettings?.trim()) throw new Error(`${source.id} procedural source must retain generation settings.`);
  if (source.containsConceptPixels) throw new Error(`${source.id} must not contain concept pixels.`);
  if (source.containsComponentGeometry || source.containsComponentEffects) throw new Error(`${source.id} must not contain component geometry or component-specific effects.`);
  if (!source.transparentBackground) throw new Error(`${source.id} must retain a transparent source background.`);
  if (source.alpha.minimum < 0 || source.alpha.maximum > 0.3 || source.alpha.minimum > source.alpha.maximum) throw new Error(`${source.id} has unsupported alpha bounds.`);
  validateFrostCrystalNormalization({ contrast: source.contrast });

  if (source.kind === "procedural-tile") {
    if (!source.edgeSignature || source.edgeSignature.top !== source.edgeSignature.bottom || source.edgeSignature.left !== source.edgeSignature.right) {
      throw new Error(`${source.id} is not tile-safe at its edges.`);
    }
  }
}

function sourceDefinition(sourceId: FrostCrystalSourceId): string {
  switch (sourceId) {
    case "frost-grain":
      return `<pattern id="material-frost-grain" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="4" cy="6" r="0.8" fill="#E8FBFF" fill-opacity="0.12"/><circle cx="21" cy="14" r="0.55" fill="#9DEBFF" fill-opacity="0.09"/><path d="M27 27h2M28 26v2" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="0.7"/></pattern>`;
    case "crystal-facet-pattern":
      return `<pattern id="material-crystal-facet-pattern" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M0 24L12 12 24 24 36 12 48 24M0 24L12 36 24 24 36 36 48 24M24 0V48" fill="none" stroke="#BCEFFF" stroke-opacity="0.13" stroke-width="0.8"/></pattern>`;
    case "rune-ornament":
      return `<g id="material-rune-ornament"><circle cx="32" cy="32" r="22" fill="none" stroke="#C9F5FF" stroke-opacity="0.2" stroke-width="1.5"/><path d="M32 8v12l9-5-3 10 10 7-10 7 3 10-9-5v12M32 20l-9-5 3 10-10 7 10 7-3 10 9-5" fill="none" stroke="#D8FAFF" stroke-opacity="0.24" stroke-width="1.5" stroke-linejoin="round"/></g>`;
  }
}

export function renderFrostCrystalIsolationSvg(sourceId: FrostCrystalSourceId, normalization: FrostCrystalNormalization = {}): string {
  validateFrostCrystalNormalization(normalization);
  const scale = normalization.scale ?? 1;
  const offsetX = normalization.offsetX ?? 0;
  const offsetY = normalization.offsetY ?? 0;
  const opacity = normalization.opacity ?? (sourceId === "frost-grain" ? 0.12 : sourceId === "crystal-facet-pattern" ? 0.16 : 0.24);
  const paint = sourceId === "rune-ornament" ? "none" : `url(#material-${sourceId})`;
  const content = sourceId === "rune-ornament"
    ? sourceDefinition(sourceId)
    : `<defs>${sourceDefinition(sourceId)}</defs><rect width="128" height="128" fill="${paint}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="Frost Crystal ${sourceId} isolation"><defs><linearGradient id="frost-isolation-base" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#17395B"/><stop offset="1" stop-color="#07182C"/></linearGradient><clipPath id="frost-isolation-mask"><rect x="8" y="8" width="112" height="112" rx="16"/></clipPath></defs><rect width="128" height="128" fill="url(#frost-isolation-base)"/><g id="material-${sourceId}-isolation" data-material-source="${sourceId}" clip-path="url(#frost-isolation-mask)" opacity="${opacity}" transform="translate(${offsetX * 32} ${offsetY * 32}) scale(${scale})">${content}</g></svg>`;
}

export function assertFourComponentReuse(plan: readonly FrostCrystalReuseBinding[]): void {
  const required = new Set(["panel", "button", "progress", "reward-emblem-container"]);
  for (const binding of plan) {
    if (!binding.materialIds.length || !binding.boundary.trim()) throw new Error(`${binding.componentType} reuse binding is incomplete.`);
    required.delete(binding.componentType);
  }
  if (required.size) throw new Error(`Frost Crystal reuse plan is missing: ${[...required].sort().join(", ")}.`);
}
