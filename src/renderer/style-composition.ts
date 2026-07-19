import {
  renderM8FrostboundComponentSvg,
  renderM8FrostboundProgressFillSvg,
  renderM8FrostboundProgressFrameSvg,
  renderM8FrostboundProgressSvg
} from "./m8-frostbound-components.js";
import type { M7AngularRequest } from "./m7-angular-components.js";

export interface StyleCompositionRequest extends M7AngularRequest { variationSeed?: number; }
export interface StyleCompositionBinding {
  id: string;
  version: string;
  displayName: string;
  colors: readonly (readonly [string, string])[];
  overlay(request: StyleCompositionRequest): string;
  validate(): void;
}

function compose(svg: string, request: StyleCompositionRequest, binding: StyleCompositionBinding): string {
  binding.validate();
  let output = svg;
  for (const [from, to] of binding.colors) output = output.replaceAll(from, to);
  output = output
    .replace("m8-frostbound-aligned@0.1.0", `${binding.id}@${binding.version}`)
    .replace("M8 Frostbound", binding.displayName);
  return output.replace(
    /<g id="[^"]+-content" data-layer="content"/,
    `${binding.overlay(request)}<g id="${binding.id}-${request.component}-content" data-layer="content"`
  );
}

/** Style-neutral M9 composition seam. Bindings provide data-owned layers; geometry remains M7/M8. */
export function renderStyledComponentSvg(request: StyleCompositionRequest, binding: StyleCompositionBinding): string {
  return compose(renderM8FrostboundComponentSvg(request), request, binding);
}
export function renderStyledProgressSvg(request: StyleCompositionRequest, binding: StyleCompositionBinding): string {
  return compose(renderM8FrostboundProgressSvg(request), request, binding);
}
export function renderStyledProgressFrameSvg(request: StyleCompositionRequest, binding: StyleCompositionBinding): string {
  return compose(renderM8FrostboundProgressFrameSvg(request), request, binding);
}
export function renderStyledProgressFillSvg(request: StyleCompositionRequest, binding: StyleCompositionBinding): string {
  return compose(renderM8FrostboundProgressFillSvg(request), request, binding);
}
