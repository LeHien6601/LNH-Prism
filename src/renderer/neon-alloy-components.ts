import { renderMaskedNeonAlloyLayer } from "../materials/neon-alloy.js";

export type AlloyState = "normal" | "pressed" | "disabled" | "selected" | "highlighted";
export type AlloyComponent = "button" | "panel" | "progress" | "tab" | "badge";

export interface NeonAlloyRequest {
  component: AlloyComponent;
  width: number;
  height: number;
  state?: AlloyState;
  percent?: number;
  accentDecal?: boolean;
  edgeLightOpacity?: number;
}

const supportedStates: Record<AlloyComponent, readonly AlloyState[]> = {
  button: ["normal", "pressed", "disabled"], panel: ["normal"], progress: ["normal"], tab: ["normal", "selected"], badge: ["normal", "highlighted"]
};

const bounds: Record<AlloyComponent, { width: readonly [number, number]; height: readonly [number, number] }> = {
  button: { width: [160, 240], height: [56, 56] }, panel: { width: [432, 432], height: [240, 360] }, progress: { width: [320, 432], height: [24, 24] }, tab: { width: [112, 200], height: [44, 44] }, badge: { width: [104, 200], height: [44, 44] }
};

function assertRequest(request: NeonAlloyRequest): Required<Pick<NeonAlloyRequest, "state" | "percent" | "accentDecal">> & NeonAlloyRequest {
  const state = request.state ?? "normal";
  const size = bounds[request.component];
  if (!Number.isInteger(request.width) || request.width < size.width[0] || request.width > size.width[1] || !Number.isInteger(request.height) || request.height < size.height[0] || request.height > size.height[1]) throw new RangeError(`${request.component} dimensions are outside its bounded M2 range.`);
  if (!supportedStates[request.component].includes(state)) throw new RangeError(`${request.component} does not support ${state}.`);
  const percent = request.percent ?? 100;
  if (request.edgeLightOpacity !== undefined && (request.edgeLightOpacity < 0 || request.edgeLightOpacity > 0.65)) throw new RangeError("edgeLightOpacity must be between 0 and 0.65.");
  if (request.component === "progress" && (!Number.isInteger(percent) || percent < 0 || percent > 100)) throw new RangeError("Progress percent must be an integer from 0 to 100.");
  return { ...request, state, percent, accentDecal: request.accentDecal ?? false };
}

function stateRecipe(component: AlloyComponent, state: AlloyState) {
  if (state === "pressed") return { y: 2, edge: 0.26, bevel: 0.18, extrusion: 2, saturation: 1 };
  if (state === "disabled") return { y: 0, edge: 0.12, bevel: 0.12, extrusion: 3, saturation: 0.55 };
  if (state === "selected" || state === "highlighted") return { y: 0, edge: 0.58, bevel: 0.34, extrusion: 4, saturation: 1.15 };
  return { y: 0, edge: component === "button" ? 0.42 : 0.3, bevel: 0.28, extrusion: 4, saturation: 1 };
}

/** Shared M2 SVG recipe for Button, Panel, Progress, Tab, and Badge. */
export function renderNeonAlloyComponentSvg(input: NeonAlloyRequest): string {
  const request = assertRequest(input);
  const { component, width, height, state, percent, accentDecal } = request;
  const recipe = stateRecipe(component, state);
  if (request.edgeLightOpacity !== undefined) recipe.edge = request.edgeLightOpacity;
  const radius = component === "progress" ? 12 : component === "tab" ? 12 : 16;
  const surfaceHeight = height - recipe.extrusion;
  const fillWidth = component === "progress" ? Math.round((width - 10) * percent / 100) : width - 2;
  const fillX = component === "progress" ? 5 : 1;
  const fillHeight = component === "progress" ? 12 : surfaceHeight - 2;
  const fillY = component === "progress" ? 5 : recipe.y + 1;
  const fillRadius = Math.min(radius - 2, fillWidth / 2, fillHeight / 2);
  const maskId = `${component}-surface-mask`;
  const decal = accentDecal ? `<g id="layer-accent-decal" data-layer="decal" clip-path="url(#${maskId})"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${fillHeight}" fill="url(#alloy-decal-gradient)" fill-opacity="0.18"/></g>` : "";
  const materialLayers = `${renderMaskedNeonAlloyLayer("alloy-grain", maskId, width, height)}\n${renderMaskedNeonAlloyLayer("alloy-circuit-pattern", maskId, width, height)}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Neon Alloy ${component} ${state}">
  <defs><linearGradient id="alloy-base-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#23566B"/><stop offset="100%" stop-color="#0A2436"/></linearGradient><linearGradient id="alloy-edge-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B5FAFF" stop-opacity="${recipe.edge}"/><stop offset="100%" stop-color="#B5FAFF" stop-opacity="0"/></linearGradient><linearGradient id="alloy-decal-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A7FFFF" stop-opacity="0"/><stop offset="50%" stop-color="#A7FFFF" stop-opacity="1"/><stop offset="100%" stop-color="#A7FFFF" stop-opacity="0"/></linearGradient><clipPath id="${maskId}"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight - 2}" rx="${radius - 1}"/></clipPath></defs>
  <g id="layer-outer-shadow" data-layer="shadow"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight + recipe.extrusion - 2}" rx="${radius - 1}" fill="#04131E" fill-opacity="0.78"/></g>
  <g id="layer-connected-extrusion" data-layer="extrusion" data-depth="${recipe.extrusion}"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight + recipe.extrusion - 2}" rx="${radius - 1}" fill="#0A3040" fill-opacity="0.75"/></g>
  <g id="layer-border" data-layer="border"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight - 2}" rx="${radius - 1}" fill="none" stroke="#A8F4FF" stroke-opacity="0.72" stroke-width="2"/></g>
  <g id="layer-base-fill" data-layer="fill" data-saturation="${recipe.saturation}"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${fillHeight}" rx="${fillRadius}" fill="url(#alloy-base-gradient)"/></g>
  ${materialLayers}
  <g id="layer-bevel-highlight" data-layer="bevel" clip-path="url(#${maskId})"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${Math.min(8, fillHeight)}" rx="${fillRadius}" fill="#D3FFFF" fill-opacity="${recipe.bevel}"/></g>
  <g id="layer-edge-highlight" data-layer="highlight" clip-path="url(#${maskId})"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${Math.min(14, fillHeight)}" rx="${fillRadius}" fill="url(#alloy-edge-gradient)"/></g>
  ${decal}
  <g id="layer-content-slot" data-layer="content" data-slot="editable-${component}-content" transform="translate(0 ${recipe.y})"/>
</svg>`;
}

export const NEON_ALLOY_LAYER_IDS = ["layer-outer-shadow", "layer-connected-extrusion", "layer-border", "layer-base-fill", "layer-alloy-grain", "layer-alloy-circuit-pattern", "layer-bevel-highlight", "layer-edge-highlight", "layer-accent-decal", "layer-content-slot"] as const;

export function renderNeonAlloyProgressFrameSvg(width: number): string {
  const svg = renderNeonAlloyComponentSvg({ component: "progress", width, height: 24, percent: 0 });
  return svg.replace(/(<svg[^>]*>)/, '$1\n  <g id="part-frame" data-part="frame">').replace("</svg>", "  </g>\n</svg>");
}

export function renderNeonAlloyProgressFillSvg(width: number, percent: number, edgeLightOpacity = 0.42): string {
  if (!Number.isInteger(width) || width < 320 || width > 432 || !Number.isInteger(percent) || percent < 0 || percent > 100) throw new RangeError("Progress fill request is outside its bounded M2 range.");
  if (edgeLightOpacity < 0 || edgeLightOpacity > 0.65) throw new RangeError("edgeLightOpacity must be between 0 and 0.65.");
  const fillWidth = Math.round((width - 10) * percent / 100);
  const radius = Math.min(6, fillWidth / 2);
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="48" viewBox="0 0 ${width} 24"><defs><linearGradient id="progress-value" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#59E8FF" stop-opacity="${edgeLightOpacity}"/><stop offset="100%" stop-color="#176A88"/></linearGradient><clipPath id="progress-fill-mask"><rect x="5" y="5" width="${fillWidth}" height="12" rx="${radius}"/></clipPath></defs><g id="part-fill" data-part="fill" clip-path="url(#progress-fill-mask)"><g id="layer-base-fill" data-layer="fill"><rect x="5" y="5" width="${fillWidth}" height="12" rx="${radius}" fill="url(#progress-value)"/></g>${renderMaskedNeonAlloyLayer("alloy-grain", "progress-fill-mask", width, 24)}${renderMaskedNeonAlloyLayer("alloy-circuit-pattern", "progress-fill-mask", width, 24)}</g></svg>`;
}
