export type M7FacetedSourceId = "m7-faceted-grain" | "m7-angular-plate-pattern" | "m7-energy-edge-accent" | "m7-ornament-marks";

export interface M7FacetedSourceReceipt {
  schemaVersion: "1.0";
  id: M7FacetedSourceId;
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
  containsReferencePixels: boolean;
  containsComponentGeometry: boolean;
  containsComponentEffects: boolean;
  rights: string;
}

export interface M7FacetedReuseBinding {
  componentType: "panel" | "primary-button" | "secondary-button" | "tab" | "badge" | "progress" | "icon-container";
  materialIds: readonly string[];
  boundary: string;
}

export const m7FacetedReusePlan: readonly M7FacetedReuseBinding[] = [
  { componentType: "panel", materialIds: ["m7-faceted-grain-overlay", "m7-angular-plate-overlay", "m7-energy-edge-decal", "m7-ornament-decal"], boundary: "The angular panel owns its chamfered silhouette, bevel, shadow, and clipping." },
  { componentType: "primary-button", materialIds: ["m7-faceted-grain-overlay", "m7-angular-plate-overlay", "m7-energy-edge-decal", "m7-ornament-decal"], boundary: "The renderer owns wide-hex geometry and all state depth changes." },
  { componentType: "secondary-button", materialIds: ["m7-faceted-grain-overlay", "m7-angular-plate-overlay", "m7-energy-edge-decal"], boundary: "The renderer owns the secondary wide-hex silhouette and state lighting." },
  { componentType: "tab", materialIds: ["m7-faceted-grain-overlay", "m7-angular-plate-overlay", "m7-energy-edge-decal"], boundary: "The renderer owns tab shape and selected contrast." },
  { componentType: "badge", materialIds: ["m7-faceted-grain-overlay", "m7-angular-plate-overlay", "m7-energy-edge-decal", "m7-ornament-decal"], boundary: "The renderer owns faceted badge shape and highlighted state." },
  { componentType: "progress", materialIds: ["m7-faceted-grain-overlay", "m7-angular-plate-overlay", "m7-energy-edge-decal"], boundary: "Frame and fill remain independent deterministic masks." },
  { componentType: "icon-container", materialIds: ["m7-faceted-grain-overlay", "m7-angular-plate-overlay", "m7-energy-edge-decal", "m7-ornament-decal"], boundary: "The renderer owns selected icon-container geometry and protected content slot." }
] as const;

export function preflightM7FacetedSource(source: M7FacetedSourceReceipt): void {
  if (source.schemaVersion !== "1.0" || !source.id || !source.version || !source.rights.trim()) throw new Error("M7 source must declare schema, ID, version, and rights.");
  if (source.colorSpace !== "sRGB") throw new Error(`${source.id} must use sRGB.`);
  if (source.resolution.units !== "logical-pixels" || source.resolution.width < 16 || source.resolution.width > 128 || source.resolution.height < 16 || source.resolution.height > 128) throw new Error(`${source.id} must use a 16-128 logical-pixel source resolution.`);
  if (source.sourceType === "procedural" && !source.generationSettings?.trim()) throw new Error(`${source.id} procedural source must retain generation settings.`);
  if (source.sourceType === "ai-generated" && !source.promptOrSettings?.trim()) throw new Error(`${source.id} AI source must retain prompt/settings provenance.`);
  if (source.containsReferencePixels) throw new Error(`${source.id} must not contain reference pixels.`);
  if (source.containsComponentGeometry || source.containsComponentEffects) throw new Error(`${source.id} must not contain component geometry or component-specific effects.`);
  if (!source.transparentBackground || source.alpha.minimum < 0 || source.alpha.maximum > 0.3 || source.alpha.minimum > source.alpha.maximum) throw new Error(`${source.id} has unsupported alpha bounds.`);
  if (source.contrast < 0.5 || source.contrast > 1.5) throw new Error(`${source.id} contrast must be between 0.5 and 1.5.`);
  if (source.kind === "procedural-tile" && (!source.edgeSignature || source.edgeSignature.top !== source.edgeSignature.bottom || source.edgeSignature.left !== source.edgeSignature.right)) throw new Error(`${source.id} is not tile-safe at its edges.`);
}

function sourceDefinition(id: M7FacetedSourceId): string {
  switch (id) {
    case "m7-faceted-grain": return `<pattern id="m7-faceted-grain" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M4 6h2M18 10h1M25 25h2M9 29h1" stroke="#C4F8FF" stroke-opacity=".16"/><circle cx="23" cy="16" r=".7" fill="#77DDF9" fill-opacity=".12"/></pattern>`;
    case "m7-angular-plate-pattern": return `<pattern id="m7-angular-plate-pattern" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M0 16 16 0l16 16L48 0M0 32l16 16 16-16 16 16M16 0v48M32 0v48" fill="none" stroke="#A8EDFF" stroke-opacity=".14"/></pattern>`;
    case "m7-energy-edge-accent": return `<g id="m7-energy-edge-accent"><path d="M4 22 20 8h26l14 14-14 8H20Z" fill="none" stroke="#8DF5FF" stroke-opacity=".55" stroke-width="2"/><path d="M12 22h40" stroke="#E5FFFF" stroke-opacity=".35"/></g>`;
    case "m7-ornament-marks": return `<g id="m7-ornament-marks"><path d="M10 22 22 10h20l12 12-12 12H22Z" fill="none" stroke="#C2F7FF" stroke-opacity=".4"/><path d="M22 10v24m20-24v24M10 22h44" stroke="#83DCEF" stroke-opacity=".28"/><circle cx="16" cy="16" r="2" fill="#D9FBFF" fill-opacity=".45"/><circle cx="48" cy="28" r="2" fill="#D9FBFF" fill-opacity=".45"/></g>`;
  }
}

export function renderM7FacetedIsolationSvg(id: M7FacetedSourceId): string {
  const tile = id === "m7-faceted-grain" || id === "m7-angular-plate-pattern";
  const content = tile ? `<defs>${sourceDefinition(id)}</defs><rect width="128" height="128" fill="url(#${id})"/>` : sourceDefinition(id);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="M7 ${id} isolation"><defs><linearGradient id="m7-base" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#182D4D"/><stop offset="1" stop-color="#07101E"/></linearGradient><clipPath id="m7-mask"><path d="M16 28 28 16h72l12 12v72l-12 12H28L16 100Z"/></clipPath></defs><rect width="128" height="128" fill="url(#m7-base)"/><g id="material-${id}-isolation" data-material-source="${id}" clip-path="url(#m7-mask)">${content}</g></svg>`;
}

export function assertM7FacetedReuse(plan: readonly M7FacetedReuseBinding[]): void {
  const required = new Set(["panel", "primary-button", "secondary-button", "tab", "badge", "progress", "icon-container"]);
  for (const binding of plan) { if (!binding.materialIds.length || !binding.boundary.trim()) throw new Error(`${binding.componentType} reuse binding is incomplete.`); required.delete(binding.componentType); }
  if (required.size) throw new Error(`M7 reuse plan is missing: ${[...required].sort().join(", ")}.`);
}
