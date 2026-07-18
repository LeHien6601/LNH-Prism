import {
  renderM7AngularComponentSvg,
  renderM7AngularProgressFillSvg,
  renderM7AngularProgressFrameSvg,
  renderM7AngularProgressSvg,
  type M7AngularRequest
} from "./m7-angular-components.js";

/**
 * M8 preserves the approved M7 component geometry and state matrix.  This
 * adapter changes only renderer-owned material layers and inserts an editable
 * crystal focal layer for the reward-bearing surfaces.
 */
function frostbound(svg: string, request: M7AngularRequest, focal = false): string {
  let output = svg
    .replaceAll("m7-reference-fidelity@0.1.0", "m8-frostbound-aligned@0.1.0")
    .replaceAll("M7 angular", "M8 Frostbound")
    .replaceAll("m7-faceted-grain", "m8-ice-grain")
    .replaceAll("m7-angular-plate-pattern", "m8-crystal-facet-pattern")
    .replaceAll("m7-energy-edge-accent", "m8-cold-edge-accent")
    .replaceAll("edge-energy-accent", "cold-edge-accent")
    .replaceAll("#3A5B72", "#315C7A")
    .replaceAll("#162A3E", "#112A46")
    .replaceAll("#091422", "#071329")
    .replaceAll("#9DEFFF", "#B9F7FF")
    .replaceAll("#88F8FF", "#9FEFFF")
    .replaceAll("#FFE9A8", "#E6FBFF")
    .replaceAll("#E59C32", "#63CFF3")
    .replaceAll("#8E4D12", "#1A6592");

  if (focal) {
    const cx = request.width / 2;
    const cy = request.height / 2;
    const crystal = `<g id="m8-${request.component}-crystal-focal" data-layer="crystal-focal" data-slot="editable-crystal-focal" aria-label="editable crystal focal"><path d="M${cx} ${cy - 15}l12 15-12 15-12-15Z" fill="#A9F7FF" fill-opacity=".42" stroke="#E8FEFF" stroke-width="1.5"/><path d="M${cx} ${cy - 15}v30M${cx - 12} ${cy}h24" stroke="#D7FBFF" stroke-opacity=".8"/><path d="M${cx} ${cy - 10}l7 10-7 10-7-10Z" fill="#FFFFFF" fill-opacity=".5"/></g>`;
    output = output.replace(/<g id="[^"]+-content" data-layer="content"/, `${crystal}<g id="m8-${request.component}-content" data-layer="content"`);
  }
  return output;
}

export function renderM8FrostboundComponentSvg(request: M7AngularRequest): string {
  return frostbound(renderM7AngularComponentSvg(request), request, request.component === "panel" || request.component === "icon-container");
}

export function renderM8FrostboundProgressSvg(request: M7AngularRequest): string {
  return frostbound(renderM7AngularProgressSvg(request), request);
}

export function renderM8FrostboundProgressFrameSvg(request: M7AngularRequest): string {
  return frostbound(renderM7AngularProgressFrameSvg(request), request);
}

export function renderM8FrostboundProgressFillSvg(request: M7AngularRequest): string {
  return frostbound(renderM7AngularProgressFillSvg(request), request);
}
