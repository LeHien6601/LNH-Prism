export type FrostboundComponent = "panel" | "primary-button" | "secondary-button" | "progress" | "emblem";
export type FrostboundState = "normal" | "pressed" | "disabled" | "selected";

export interface FrostboundRequest {
  component: FrostboundComponent;
  width: number;
  height: number;
  state?: FrostboundState;
  percent?: 10 | 50 | 75 | 90;
  label?: string;
  instanceId?: string;
}

const sizes: Record<FrostboundComponent, readonly (readonly [number, number])[]> = {
  panel: [[432, 300], [432, 420]],
  "primary-button": [[240, 64], [288, 64]],
  "secondary-button": [[160, 52], [200, 52]],
  progress: [[320, 28], [432, 28]],
  emblem: [[104, 104], [144, 144]]
};
const states: Record<FrostboundComponent, readonly FrostboundState[]> = {
  panel: ["normal"], "primary-button": ["normal", "pressed", "disabled"], "secondary-button": ["normal", "pressed", "disabled"], progress: ["normal"], emblem: ["normal", "selected"]
};
const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function validate(input: FrostboundRequest): Required<Pick<FrostboundRequest, "state" | "percent" | "label" | "instanceId">> & FrostboundRequest {
  const state = input.state ?? "normal";
  if (!sizes[input.component].some(([width, height]) => width === input.width && height === input.height)) throw new RangeError(`${input.component} dimensions are outside the approved M3-S4 matrix.`);
  if (!states[input.component].includes(state)) throw new RangeError(`${input.component} does not support ${state}.`);
  const percent = input.percent ?? 75;
  if (input.component === "progress" && ![10, 50, 75, 90].includes(percent)) throw new RangeError("Frostbound progress supports only 10, 50, 75, or 90 percent.");
  const instanceId = input.instanceId ?? `${input.component}-${state}-${input.width}-${input.height}-${percent}`;
  if (!/^[a-z][a-z0-9-]*$/.test(instanceId)) throw new Error(`Invalid Frostbound instance ID: ${instanceId}.`);
  return { ...input, state, percent, label: input.label ?? "", instanceId };
}

const definitions = (id: string) => `<linearGradient id="${id}-surface" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#276A9A"/><stop offset="0.48" stop-color="#123B64"/><stop offset="1" stop-color="#081B35"/></linearGradient><linearGradient id="${id}-primary" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EDCFF"/><stop offset="0.45" stop-color="#2F9FEF"/><stop offset="1" stop-color="#1763A4"/></linearGradient><pattern id="${id}-grain" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="4" cy="6" r=".8" fill="#E8FBFF" fill-opacity=".12"/><circle cx="21" cy="14" r=".55" fill="#9DEBFF" fill-opacity=".09"/></pattern><pattern id="${id}-facets" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M0 24L12 12 24 24 36 12 48 24M0 24L12 36 24 24 36 36 48 24M24 0V48" fill="none" stroke="#BCEFFF" stroke-opacity=".13" stroke-width=".8"/></pattern>`;
const rune = (cx: number, cy: number, radius: number) => `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#C9F5FF" stroke-opacity=".5" stroke-width="1.5"/><path d="M${cx} ${cy-radius*.75}v${radius*.45}l${radius*.35} ${-radius*.2} ${-radius*.12} ${radius*.4} ${radius*.4} ${radius*.28} ${-radius*.4} ${radius*.28} ${radius*.12} ${radius*.4} ${-radius*.35} ${-radius*.2}" fill="none" stroke="#E5FBFF" stroke-opacity=".7" stroke-width="1.5" stroke-linejoin="round"/>`;

/** Deterministic Frostbound component recipe bound to approved M3-S3 inputs. */
export function renderFrostboundComponentSvg(input: FrostboundRequest): string {
  const request = validate(input);
  if (request.component === "progress") return renderFrostboundProgressSvg(request.width, request.percent, request.instanceId);
  const { component, width, height, state, instanceId } = request;
  const selected = state === "selected";
  const pressed = state === "pressed";
  const disabled = state === "disabled";
  const y = pressed ? 2 : 0;
  const extrusion = pressed ? 2 : component === "panel" ? 6 : 4;
  const radius = component === "panel" ? 24 : component === "emblem" ? 22 : 18;
  const primary = component === "primary-button";
  const fill = primary ? `url(#${instanceId}-primary)` : `url(#${instanceId}-surface)`;
  const opacity = disabled ? .48 : 1;
  const shape = component === "emblem" && selected
    ? `<path d="M${width*.25} 2H${width*.75}L${width-2} ${height*.25}V${height*.75}L${width*.75} ${height-2}H${width*.25}L2 ${height*.75}V${height*.25}Z"/ >`.replace("/ >", "/>")
    : `<rect x="2" y="${2+y}" width="${width-4}" height="${height-extrusion-4}" rx="${radius}"/>`;
  const maskShape = shape.replace("/>", ` fill="white"/>`);
  const label = request.label ? `<text x="${width/2}" y="${height/2+6+y}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${primary?22:18}" font-weight="800" fill="#F4FDFF" letter-spacing="1">${xml(request.label)}</text>` : "";
  const slots = component === "panel" ? `<g id="${instanceId}-header-slot" data-slot="editable-header"/><g id="${instanceId}-content-slot" data-slot="editable-content"/>` : `<g id="${instanceId}-content-slot" data-slot="editable-${component}-content">${label}</g>`;
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width*2}" height="${height*2}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Frostbound ${component} ${state}" data-style="frostbound-reward@0.1.0" data-material-pack="frost-crystal-materials@0.1.0"><defs>${definitions(instanceId)}<mask id="${instanceId}-mask">${maskShape}</mask></defs><g opacity="${opacity}"><g id="${instanceId}-shadow" data-layer="shadow" transform="translate(0 ${extrusion})" fill="#020A18" opacity=".8">${shape}</g><g id="${instanceId}-extrusion" data-layer="extrusion" transform="translate(0 ${extrusion/2})" fill="#071D38">${shape}</g><g id="${instanceId}-fill" data-layer="fill" fill="${fill}">${shape}</g><g id="${instanceId}-frost-grain" data-layer="texture" data-material-source="frost-grain" mask="url(#${instanceId}-mask)"><rect width="${width}" height="${height}" fill="url(#${instanceId}-grain)"/></g><g id="${instanceId}-crystal-facets" data-layer="texture" data-material-source="crystal-facet-pattern" mask="url(#${instanceId}-mask)" opacity="${primary ? .9 : .55}"><rect width="${width}" height="${height}" fill="url(#${instanceId}-facets)"/></g><g id="${instanceId}-border" data-layer="border" fill="none" stroke="${selected?'#FFFFFF':'#A6E9FF'}" stroke-width="${selected?4:2}" stroke-opacity="${primary?1:.76}">${shape}</g><g id="${instanceId}-edge-light" data-layer="highlight" mask="url(#${instanceId}-mask)"><path d="M12 ${8+y}H${width-12}" stroke="#E8FCFF" stroke-width="3" stroke-linecap="round" opacity="${selected ? .9 : .5}"/></g>${component === "emblem" ? `<g id="${instanceId}-rune" data-layer="decal" data-material-source="rune-ornament">${rune(width/2,height/2,Math.min(width,height)*.28)}</g>` : ""}<g id="${instanceId}-content" data-layer="content">${slots}</g></g></svg>`;
}

export function renderFrostboundProgressFrameSvg(width: number, instanceId = `progress-frame-${width}`): string {
  validate({ component: "progress", width, height: 28, percent: 75, instanceId });
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width*2}" height="56" viewBox="0 0 ${width} 28" data-style="frostbound-reward@0.1.0"><defs>${definitions(instanceId)}</defs><g id="${instanceId}-frame" data-part="frame"><rect x="1" y="1" width="${width-2}" height="26" rx="13" fill="#06152B" stroke="#A6E9FF" stroke-width="2"/><rect x="6" y="6" width="${width-12}" height="16" rx="8" fill="#0B2745"/></g></svg>`;
}

export function renderFrostboundProgressFillSvg(width: number, percent: 10 | 50 | 75 | 90, instanceId = `progress-fill-${width}-${percent}`): string {
  validate({ component: "progress", width, height: 28, percent, instanceId });
  const fillWidth = Math.round((width-12)*percent/100);
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width*2}" height="56" viewBox="0 0 ${width} 28" data-style="frostbound-reward@0.1.0" data-material-pack="frost-crystal-materials@0.1.0"><defs>${definitions(instanceId)}<clipPath id="${instanceId}-clip"><rect x="6" y="6" width="${fillWidth}" height="16" rx="8"/></clipPath></defs><g id="${instanceId}-fill" data-part="fill" clip-path="url(#${instanceId}-clip)"><rect x="6" y="6" width="${fillWidth}" height="16" rx="8" fill="url(#${instanceId}-primary)"/><rect width="${width}" height="28" fill="url(#${instanceId}-grain)" data-material-source="frost-grain"/><rect width="${width}" height="28" fill="url(#${instanceId}-facets)" data-material-source="crystal-facet-pattern"/><path d="M12 9H${Math.max(12,fillWidth)}" stroke="#F0FDFF" stroke-width="2" opacity=".7"/></g></svg>`;
}

export function renderFrostboundProgressSvg(width: number, percent: 10 | 50 | 75 | 90, instanceId = `progress-${width}-${percent}`): string {
  const frame = renderFrostboundProgressFrameSvg(width, `${instanceId}-frame`).replace(/^.*?<svg[^>]*>|<\/svg>$/gs, "");
  const fill = renderFrostboundProgressFillSvg(width, percent, `${instanceId}-fill`).replace(/^.*?<svg[^>]*>|<\/svg>$/gs, "");
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width*2}" height="56" viewBox="0 0 ${width} 28" role="img" aria-label="Frostbound progress ${percent} percent" data-style="frostbound-reward@0.1.0" data-material-pack="frost-crystal-materials@0.1.0">${frame}${fill}</svg>`;
}

export const FROSTBOUND_LAYER_ORDER = ["shadow", "extrusion", "fill", "texture", "border", "highlight", "decal", "content"] as const;
