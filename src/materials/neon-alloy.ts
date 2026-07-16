export type NeonAlloySourceId = "alloy-grain" | "alloy-circuit-pattern" | "alloy-holo-accent";

export interface MaterialNormalization {
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  contrast?: number;
  saturation?: number;
}

export interface MaterialSourcePreflight {
  id: string;
  kind: "procedural-tile" | "procedural-decal";
  colorSpace: string;
  alpha: { minimum: number; maximum: number };
  contrast: number;
  rights: string;
  containsComponentGeometry: boolean;
  tile?: { width: number; height: number; units: string };
  edgeSignature?: { top: string; bottom: string; left: string; right: string };
  transparentBackground?: boolean;
}

const normalizationBounds: Record<keyof Required<MaterialNormalization>, readonly [number, number]> = {
  scale: [0.5, 4], offsetX: [0, 1], offsetY: [0, 1], contrast: [0.5, 1.5], saturation: [0, 1.5]
};

export function validateMaterialNormalization(normalization: MaterialNormalization): void {
  for (const [name, value] of Object.entries(normalization) as Array<[keyof MaterialNormalization, number | undefined]>) {
    if (value === undefined) continue;
    const [minimum, maximum] = normalizationBounds[name];
    if (typeof value !== "number" || value < minimum || value > maximum) {
      throw new RangeError(`Material normalization ${name} must be between ${minimum} and ${maximum}; received ${value}.`);
    }
  }
}

export function preflightNeonAlloySource(source: MaterialSourcePreflight): void {
  if (!source.id || !source.rights) throw new Error("Material source must declare an ID and rights.");
  if (source.colorSpace !== "sRGB") throw new Error(`${source.id} must use sRGB.`);
  if (source.containsComponentGeometry) throw new Error(`${source.id} must not contain component geometry.`);
  if (source.alpha.minimum < 0 || source.alpha.maximum > 0.3 || source.alpha.minimum > source.alpha.maximum) {
    throw new Error(`${source.id} has unsupported alpha bounds.`);
  }
  validateMaterialNormalization({ contrast: source.contrast });
  if (source.kind === "procedural-tile") {
    if (!source.tile || source.tile.units !== "logical-pixels" || source.tile.width < 16 || source.tile.width > 64 || source.tile.height < 16 || source.tile.height > 64) {
      throw new Error(`${source.id} must declare a 16-64 logical-pixel tile.`);
    }
    if (!source.edgeSignature || source.edgeSignature.top !== source.edgeSignature.bottom || source.edgeSignature.left !== source.edgeSignature.right) {
      throw new Error(`${source.id} is not tile-safe at its edges.`);
    }
  } else if (!source.transparentBackground) {
    throw new Error(`${source.id} decal must retain a transparent background.`);
  }
}

function materialPattern(sourceId: NeonAlloySourceId): string {
  switch (sourceId) {
    case "alloy-grain":
      return `<pattern id="material-alloy-grain" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="4" cy="6" r="0.7" fill="#D7F7FF" fill-opacity="0.10"/><circle cx="20" cy="15" r="0.55" fill="#061A2A" fill-opacity="0.10"/><circle cx="28" cy="27" r="0.4" fill="#6FE7FF" fill-opacity="0.08"/></pattern>`;
    case "alloy-circuit-pattern":
      return `<pattern id="material-alloy-circuit-pattern" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M0 16H8V8H16V16H24V24H32M16 0V8M16 24V32" fill="none" stroke="#59E8FF" stroke-opacity="0.18" stroke-width="1"/><circle cx="16" cy="8" r="1.25" fill="#B5FAFF" fill-opacity="0.22"/></pattern>`;
    case "alloy-holo-accent":
      return `<linearGradient id="material-alloy-holo-accent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A7FFFF" stop-opacity="0"/><stop offset="50%" stop-color="#A7FFFF" stop-opacity="0.3"/><stop offset="100%" stop-color="#A7FFFF" stop-opacity="0"/></linearGradient>`;
  }
}

export function renderNeonAlloyIsolationSvg(sourceId: NeonAlloySourceId, normalization: MaterialNormalization = {}): string {
  validateMaterialNormalization(normalization);
  const scale = normalization.scale ?? 1;
  const offsetX = normalization.offsetX ?? 0;
  const offsetY = normalization.offsetY ?? 0;
  const opacity = sourceId === "alloy-grain" ? 0.1 : sourceId === "alloy-circuit-pattern" ? 0.18 : 0.3;
  const paint = sourceId === "alloy-holo-accent" ? "url(#material-alloy-holo-accent)" : `url(#material-${sourceId})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="Neon Alloy ${sourceId} isolation"><defs>${materialPattern(sourceId)}<clipPath id="material-isolation-mask"><rect x="8" y="8" width="112" height="112" rx="16"/></clipPath></defs><rect width="128" height="128" fill="#082033"/><g id="material-${sourceId}-isolation" data-material-source="${sourceId}" clip-path="url(#material-isolation-mask)" transform="translate(${offsetX * 32} ${offsetY * 32}) scale(${scale})"><rect x="0" y="0" width="128" height="128" fill="${paint}" fill-opacity="${opacity}"/></g></svg>`;
}

export function renderMaskedNeonAlloyLayer(sourceId: Exclude<NeonAlloySourceId, "alloy-holo-accent">, maskId: string, width: number, height: number, normalization: MaterialNormalization = {}): string {
  if (!/^[a-z][a-z0-9-]*$/.test(maskId)) throw new Error(`Material mask ID is invalid: ${maskId}.`);
  if (width <= 0 || height <= 0) throw new RangeError("Material mask dimensions must be positive.");
  validateMaterialNormalization(normalization);
  const opacity = sourceId === "alloy-grain" ? 0.1 : 0.08;
  return `<g id="layer-${sourceId}" data-material-source="${sourceId}" clip-path="url(#${maskId})"><defs>${materialPattern(sourceId)}</defs><rect width="${width}" height="${height}" fill="url(#material-${sourceId})" fill-opacity="${opacity}"/></g>`;
}
