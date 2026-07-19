export const EDGE_STACK_LAYER_ORDER = [
  "outer-shadow", "structural-silhouette", "body-material", "dark-bevel", "bright-bevel", "inner-shadow", "inner-rim", "accent-highlight"
] as const;

export type EdgeStackLayerId = (typeof EDGE_STACK_LAYER_ORDER)[number];
export interface EdgeStackLayer { id: EdgeStackLayerId; order: number; inset: number; thickness: number; opacity: number; color: string; }
export interface EdgeStackPreset { id: string; version: string; layers: readonly EdgeStackLayer[]; }
export interface EdgeStackRenderRequest { instanceId: string; path: string; width: number; height: number; preset: EdgeStackPreset; }

function validId(value: string): boolean { return /^[a-z][a-z0-9-]{2,62}$/.test(value); }

export function validateEdgeStack(preset: EdgeStackPreset, width: number, height: number): EdgeStackPreset {
  if (!validId(preset.id)) throw new Error("Edge-stack preset ID is invalid.");
  if (!/^\d+\.\d+\.\d+/.test(preset.version)) throw new Error("Edge-stack preset version must be semver.");
  if (preset.layers.length < 2 || preset.layers.length > EDGE_STACK_LAYER_ORDER.length) throw new RangeError("Edge stacks require 2-8 layers.");
  const seen = new Set<string>();
  let previous = -1;
  for (const layer of preset.layers) {
    if (!EDGE_STACK_LAYER_ORDER.includes(layer.id)) throw new Error(`Unsupported edge-stack layer ${layer.id}.`);
    if (seen.has(layer.id)) throw new Error(`Duplicate edge-stack layer ${layer.id}.`);
    if (!Number.isInteger(layer.order) || layer.order <= previous) throw new Error("Edge-stack layers must have strictly increasing order.");
    if (!Number.isFinite(layer.inset) || layer.inset < 0 || layer.inset * 2 + layer.thickness >= Math.min(width, height)) throw new RangeError("Edge-stack inset/thickness self-intersects the component bounds.");
    if (!Number.isFinite(layer.thickness) || layer.thickness <= 0 || layer.thickness > 12) throw new RangeError("Edge-stack thickness must be 0-12 logical pixels.");
    if (!Number.isFinite(layer.opacity) || layer.opacity < 0 || layer.opacity > 1) throw new RangeError("Edge-stack opacity must be 0-1.");
    if (!/^#[0-9A-Fa-f]{6}$/.test(layer.color)) throw new Error("Edge-stack colors must be six-digit hex values.");
    seen.add(layer.id); previous = layer.order;
  }
  return preset;
}

export function renderEdgeStackSvg({ instanceId, path, width, height, preset }: EdgeStackRenderRequest): string {
  validateEdgeStack(preset, width, height);
  if (!validId(instanceId)) throw new Error("Edge-stack instance ID is invalid.");
  const layers = preset.layers.map((layer) => {
    const scaleX = (width - layer.inset * 2) / width;
    const scaleY = (height - layer.inset * 2) / height;
    const translate = layer.inset === 0 ? "" : ` transform=\"translate(${layer.inset} ${layer.inset}) scale(${scaleX} ${scaleY})\"`;
    return `<g id="${instanceId}-${layer.id}" data-layer="${layer.id}" data-edge-stack-layer="${layer.id}" data-order="${layer.order}" data-inset="${layer.inset}" data-thickness="${layer.thickness}"><path d="${path}"${translate} fill="none" stroke="${layer.color}" stroke-width="${layer.thickness}" stroke-opacity="${layer.opacity}" stroke-linejoin="miter"/></g>`;
  }).join("");
  return `<g id="${instanceId}-edge-stack" data-edge-stack="${preset.id}" data-edge-stack-version="${preset.version}">${layers}</g>`;
}

export const M9_FROSTBOUND_EDGE_STACKS: Record<string, EdgeStackPreset> = {
  "m9-ice-heavy": { id: "m9-ice-heavy", version: "1.0.0", layers: [{ id: "outer-shadow", order: 0, inset: 0, thickness: 4, opacity: .72, color: "#020812" }, { id: "structural-silhouette", order: 1, inset: 1, thickness: 3, opacity: 1, color: "#102A45" }, { id: "dark-bevel", order: 2, inset: 3, thickness: 2, opacity: .88, color: "#174B70" }, { id: "bright-bevel", order: 3, inset: 5, thickness: 2, opacity: .92, color: "#B9F7FF" }, { id: "inner-rim", order: 4, inset: 8, thickness: 1, opacity: .64, color: "#63CFF3" }] },
  "m9-dark-inset": { id: "m9-dark-inset", version: "1.0.0", layers: [{ id: "outer-shadow", order: 0, inset: 0, thickness: 5, opacity: .78, color: "#020812" }, { id: "structural-silhouette", order: 1, inset: 1, thickness: 3, opacity: 1, color: "#0B2038" }, { id: "dark-bevel", order: 2, inset: 4, thickness: 3, opacity: .9, color: "#071329" }, { id: "inner-shadow", order: 3, inset: 7, thickness: 2, opacity: .72, color: "#173D5A" }, { id: "inner-rim", order: 4, inset: 10, thickness: 1, opacity: .55, color: "#9FEFFF" }] },
  "m9-glowing-primary": { id: "m9-glowing-primary", version: "1.0.0", layers: [{ id: "outer-shadow", order: 0, inset: 0, thickness: 5, opacity: .72, color: "#020812" }, { id: "structural-silhouette", order: 1, inset: 1, thickness: 3, opacity: 1, color: "#173B57" }, { id: "dark-bevel", order: 2, inset: 3, thickness: 2, opacity: .85, color: "#1A6592" }, { id: "bright-bevel", order: 3, inset: 5, thickness: 2, opacity: .94, color: "#E6FBFF" }, { id: "accent-highlight", order: 4, inset: 8, thickness: 1, opacity: .8, color: "#63CFF3" }] }
};
