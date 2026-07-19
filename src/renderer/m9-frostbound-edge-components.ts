import { M9_FROSTBOUND_EDGE_STACKS, renderEdgeStackSvg, type EdgeStackPreset } from "./edge-stacks.js";
import { renderM8FrostboundComponentSvg, renderM8FrostboundProgressFillSvg, renderM8FrostboundProgressFrameSvg, renderM8FrostboundProgressSvg } from "./m8-frostbound-components.js";
import type { M7AngularComponent, M7AngularRequest } from "./m7-angular-components.js";

const presetFor: Record<M7AngularComponent, string> = { "primary-hex-button": "m9-glowing-primary", "secondary-hex-button": "m9-ice-heavy", panel: "m9-dark-inset", tab: "m9-ice-heavy", badge: "m9-ice-heavy", progress: "m9-dark-inset", "icon-container": "m9-ice-heavy" };

function migrate(svg: string, request: M7AngularRequest, framePart = false): string {
  const preset = M9_FROSTBOUND_EDGE_STACKS[presetFor[request.component]] as EdgeStackPreset;
  const match = framePart
    ? svg.match(/<g id="([^"]+-frame)" data-part="frame"><path d="([^"]+)"[^>]*\/><\/g>/)
    : svg.match(/<g id="([^"]+-outer-frame)" data-layer="outer-frame"><path d="([^"]+)"[^>]*\/><\/g>/);
  if (!match) throw new Error("M9 edge-stack migration could not locate the inherited structural frame.");
  const stack = renderEdgeStackSvg({ instanceId: `${match[1]}-m9`, path: match[2], width: request.width, height: request.height, preset });
  const replacement = framePart ? `<g id="${match[1]}" data-part="frame">${stack}</g>` : stack;
  return svg.replace(match[0], replacement).replace("m8-frostbound-aligned@0.1.0", "m9-frostbound-production-fidelity@0.1.0").replace("M8 Frostbound", "M9 Frostbound edge stack");
}

export function renderM9FrostboundComponentSvg(request: M7AngularRequest): string { return migrate(renderM8FrostboundComponentSvg(request), request); }
export function renderM9FrostboundProgressSvg(request: M7AngularRequest): string { return migrate(renderM8FrostboundProgressSvg(request), request, true); }
export function renderM9FrostboundProgressFrameSvg(request: M7AngularRequest): string { return migrate(renderM8FrostboundProgressFrameSvg(request), request, true); }
export function renderM9FrostboundProgressFillSvg(request: M7AngularRequest): string { return renderM8FrostboundProgressFillSvg(request).replace("m8-frostbound-aligned@0.1.0", "m9-frostbound-production-fidelity@0.1.0"); }
