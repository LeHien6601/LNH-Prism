import type { M7FacetedReuseBinding, M7FacetedSourceReceipt } from "./m7-faceted.js";

export type M8FrostboundSourceId = "m8-ice-grain" | "m8-crystal-facet-pattern" | "m8-cold-edge-accent";
export const m8FrostboundReusePlan: readonly M7FacetedReuseBinding[] = [
  { componentType:"panel", materialIds:["m8-ice-grain-overlay","m8-crystal-facet-overlay","m8-cold-edge-decal"], boundary:"Renderer owns panel silhouette and editable crystal-focal slot." },
  { componentType:"primary-button", materialIds:["m8-ice-grain-overlay","m8-crystal-facet-overlay","m8-cold-edge-decal"], boundary:"Renderer owns wide-hex geometry and states." },
  { componentType:"secondary-button", materialIds:["m8-ice-grain-overlay","m8-crystal-facet-overlay","m8-cold-edge-decal"], boundary:"Renderer owns wide-hex geometry and states." },
  { componentType:"tab", materialIds:["m8-ice-grain-overlay","m8-crystal-facet-overlay","m8-cold-edge-decal"], boundary:"Renderer owns angular geometry and selected state." },
  { componentType:"badge", materialIds:["m8-ice-grain-overlay","m8-crystal-facet-overlay","m8-cold-edge-decal"], boundary:"Renderer owns faceted geometry and highlighted state." },
  { componentType:"progress", materialIds:["m8-ice-grain-overlay","m8-crystal-facet-overlay","m8-cold-edge-decal"], boundary:"Frame and fill remain independent." },
  { componentType:"icon-container", materialIds:["m8-ice-grain-overlay","m8-crystal-facet-overlay","m8-cold-edge-decal"], boundary:"Renderer owns editable crystal-focal geometry and content slot." }
];
export function preflightM8FrostboundSource(source: M7FacetedSourceReceipt): void {
  if (!source.id.startsWith("m8-") || source.containsReferencePixels || source.containsComponentGeometry || source.containsComponentEffects) throw new Error("M8 sources must be source-neutral with no reference pixels or component effects.");
  if (source.colorSpace !== "sRGB" || !source.transparentBackground || source.alpha.maximum > .3) throw new Error("M8 source color or alpha boundary failed.");
  if (source.kind === "procedural-tile" && (!source.edgeSignature || source.edgeSignature.top !== source.edgeSignature.bottom || source.edgeSignature.left !== source.edgeSignature.right)) throw new Error("M8 tile source is not seam-safe.");
}
export function renderM8FrostboundIsolationSvg(id: M8FrostboundSourceId): string {
  const art = id === "m8-ice-grain" ? `<pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="6" cy="7" r="1" fill="#D9FFFF" opacity=".25"/><path d="M18 5l3 4-3 4-3-4Z" fill="#8EEFFF" opacity=".2"/></pattern><rect width="128" height="128" fill="url(#p)"/>` : id === "m8-crystal-facet-pattern" ? `<pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M0 24 12 0l12 24L36 0l12 24-12 24-12-24L12 48Z" fill="none" stroke="#AEEFFF" opacity=".3"/></pattern><rect width="128" height="128" fill="url(#p)"/>` : `<path d="M12 64 48 24h32l36 40-36 40H48Z" fill="none" stroke="#C8FFFF" stroke-width="3" opacity=".7"/><path d="M30 64h68" stroke="#8DEFFF" opacity=".7"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="#0B2039"/><g data-material-source="${id}">${art}</g></svg>`;
}
export function assertM8FrostboundReuse(): void { if (m8FrostboundReusePlan.length !== 7 || m8FrostboundReusePlan.some((x) => x.materialIds.length < 3)) throw new Error("M8 cold material reuse must cover all seven components."); }
