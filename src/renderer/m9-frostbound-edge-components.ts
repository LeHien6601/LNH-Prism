import { M9_FROSTBOUND_EDGE_STACKS, renderEdgeStackSvg, type EdgeStackPreset } from "./edge-stacks.js";
import { resolveMaterialResponse } from "../materials/m9-material-responses.js";
import { renderVariationSvg, type VariationRegion } from "../materials/m9-variation.js";
import { renderM8FrostboundComponentSvg, renderM8FrostboundProgressFillSvg, renderM8FrostboundProgressFrameSvg, renderM8FrostboundProgressSvg } from "./m8-frostbound-components.js";
import type { M7AngularComponent, M7AngularRequest } from "./m7-angular-components.js";

const presetFor: Record<M7AngularComponent, string> = { "primary-hex-button": "m9-glowing-primary", "secondary-hex-button": "m9-ice-heavy", panel: "m9-dark-inset", tab: "m9-ice-heavy", badge: "m9-ice-heavy", progress: "m9-dark-inset", "icon-container": "m9-ice-heavy" };
export interface M9FrostboundRequest extends M7AngularRequest { variationPresetId?: string; variationSeed?: number; }

function responseLayers(instanceId: string, path: string, component: M7AngularComponent, width: number, height: number, variationPresetId?: string, variationSeed?: number): string {
  const edge = resolveMaterialResponse(component, "structural-edge");
  const surface = resolveMaterialResponse(component, "content-surface");
  const layer = (region: string, channel: string, color: string, opacity: number, sourceId: string | undefined, fill = "none") => `<g id="${instanceId}-${region}-${channel}" data-material-region="${region}" data-material-response="${region === "structural-edge" ? edge.id : surface.id}" data-material-channel="${channel}"${sourceId ? ` data-material-source="${sourceId}"` : ""}><path d="${path}" fill="${fill === "none" ? "none" : color}" fill-opacity="${fill === "none" ? 0 : opacity}" stroke="${fill === "none" ? color : "none"}" stroke-opacity="${fill === "none" ? opacity : 0}" stroke-width="${fill === "none" ? 1.5 : 0}"/></g>`;
  const variation = renderVariationSvg(instanceId, component, "content-surface" as VariationRegion, width, height, variationPresetId, variationSeed);
  return `<g id="${instanceId}-material-responses" data-material-responses="m9-frostbound-material-responses@1.0.0">${layer("structural-edge", "edge", edge.edge.color, edge.edge.opacity, edge.edge.sourceId)}${layer("content-surface", "base", surface.base.color, surface.base.opacity, surface.base.sourceId, "fill")}${layer("content-surface", "highlight", surface.highlight.color, surface.highlight.opacity, surface.highlight.sourceId)}${layer("content-surface", "glow", surface.glow.color, surface.glow.opacity, surface.glow.sourceId)}${surface.surface ? layer("content-surface", "surface", surface.surface.color, surface.surface.opacity, surface.surface.sourceId, "fill") : ""}${variation}</g>`;
}

function migrate(svg: string, request: M9FrostboundRequest, framePart = false): string {
  const preset = M9_FROSTBOUND_EDGE_STACKS[presetFor[request.component]] as EdgeStackPreset;
  const match = framePart
    ? svg.match(/<g id="([^"]+-frame)" data-part="frame"><path d="([^"]+)"[^>]*\/><\/g>/)
    : svg.match(/<g id="([^"]+-outer-frame)" data-layer="outer-frame"><path d="([^"]+)"[^>]*\/><\/g>/);
  if (!match) throw new Error("M9 edge-stack migration could not locate the inherited structural frame.");
  const stack = renderEdgeStackSvg({ instanceId: `${match[1]}-m9`, path: match[2], width: request.width, height: request.height, preset });
  const responses = responseLayers(`${match[1]}-m9`, match[2], request.component, request.width, request.height, request.variationPresetId, request.variationSeed);
  const replacement = framePart ? `<g id="${match[1]}" data-part="frame">${stack}${responses}</g>` : `${stack}${responses}`;
  return svg.replace(match[0], replacement).replace("m8-frostbound-aligned@0.1.0", "m9-frostbound-production-fidelity@0.1.0").replace("M8 Frostbound", "M9 Frostbound edge stack");
}

export function renderM9FrostboundComponentSvg(request: M9FrostboundRequest): string { return migrate(renderM8FrostboundComponentSvg(request), request); }
export function renderM9FrostboundProgressSvg(request: M9FrostboundRequest): string { return migrate(renderM8FrostboundProgressSvg(request), request, true); }
export function renderM9FrostboundProgressFrameSvg(request: M9FrostboundRequest): string { return migrate(renderM8FrostboundProgressFrameSvg(request), request, true); }
export function renderM9FrostboundProgressFillSvg(request: M9FrostboundRequest): string { return renderM8FrostboundProgressFillSvg(request).replace("m8-frostbound-aligned@0.1.0", "m9-frostbound-production-fidelity@0.1.0"); }
