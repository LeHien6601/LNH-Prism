export type M7AngularComponent = "primary-hex-button" | "secondary-hex-button" | "panel" | "tab" | "badge" | "progress" | "icon-container";
export type M7AngularState = "normal" | "pressed" | "disabled" | "selected" | "highlighted";

export interface M7AngularRequest {
  component: M7AngularComponent;
  width: number;
  height: number;
  state?: M7AngularState;
  percent?: 10 | 50 | 90;
  endCapDepth?: number;
  cornerRadius?: number;
  instanceId?: string;
}

interface M7ResolvedRequest extends M7AngularRequest {
  state: M7AngularState;
  percent: 10 | 50 | 90;
  endCapDepth: number;
  cornerRadius: number;
  instanceId: string;
}

export const M7_ANGULAR_LAYER_ORDER = [
  "outer-shadow",
  "connected-depth",
  "outer-frame",
  "inner-plate-fill",
  "surface-grain",
  "surface-pattern",
  "side-bevel-shade",
  "top-bevel-highlight",
  "edge-energy-accent",
  "ornament-decal",
  "content"
] as const;

const sizes: Record<M7AngularComponent, readonly (readonly [number, number])[]> = {
  "primary-hex-button": [[320, 68], [260, 62]],
  "secondary-hex-button": [[232, 56], [188, 52]],
  panel: [[488, 660], [488, 760]],
  tab: [[148, 52], [184, 52]],
  badge: [[164, 48], [212, 48]],
  progress: [[344, 28], [420, 28]],
  "icon-container": [[92, 92], [116, 116]]
};

const states: Record<M7AngularComponent, readonly M7AngularState[]> = {
  "primary-hex-button": ["normal", "pressed", "disabled"],
  "secondary-hex-button": ["normal", "pressed", "disabled"],
  panel: ["normal"],
  tab: ["normal", "selected"],
  badge: ["normal", "highlighted"],
  progress: ["normal"],
  "icon-container": ["normal", "selected"]
};

function defaultEndCapDepth(component: M7AngularComponent, width: number, height: number): number {
  if (component === "primary-hex-button") return Math.min(44, Math.max(24, Math.round(height * 0.5)));
  if (component === "secondary-hex-button") return Math.min(36, Math.max(20, Math.round(height * 0.45)));
  if (component === "progress") return Math.round(height * 0.65);
  if (component === "icon-container") return Math.round(width * 0.24);
  return Math.min(34, Math.max(16, Math.round(height * 0.32)));
}

function validate(input: M7AngularRequest): M7ResolvedRequest {
  const state = input.state ?? "normal";
  const percent = input.percent ?? 50;
  if (!sizes[input.component].some(([width, height]) => width === input.width && height === input.height)) {
    throw new RangeError(`${input.component} dimensions are outside the approved M7-A3 bounds.`);
  }
  if (!states[input.component].includes(state)) throw new RangeError(`${input.component} does not support ${state}.`);
  if (input.component === "progress" && ![10, 50, 90].includes(percent)) throw new RangeError("M7 progress supports only 10, 50, or 90 percent.");
  const cornerRadius = input.cornerRadius ?? 2;
  if (cornerRadius < 0 || cornerRadius > 4) throw new RangeError("M7 angular geometry allows only 0-4 logical pixels of anti-alias relief.");
  const endCapDepth = input.endCapDepth ?? defaultEndCapDepth(input.component, input.width, input.height);
  if (endCapDepth < 16 || endCapDepth > 56) throw new RangeError("M7 end-cap depth must stay between 16 and 56 logical pixels.");
  if ((input.component === "primary-hex-button" || input.component === "secondary-hex-button") && endCapDepth < input.height * 0.34) {
    throw new RangeError("M7 hex buttons require visible angled end caps; rounded/capsule-like requests are rejected.");
  }
  if (endCapDepth * 2 >= input.width - 24) throw new RangeError("M7 end caps leave too little center safe area.");
  const instanceId = input.instanceId ?? `m7-${input.component}-${state}-${input.width}-${input.height}-${percent}`;
  if (!/^[a-z][a-z0-9-]*$/.test(instanceId)) throw new Error(`Invalid M7 instance ID: ${instanceId}.`);
  return { ...input, state, percent, cornerRadius, endCapDepth, instanceId };
}

function hexPath(width: number, height: number, endCapDepth: number, y = 0, inset = 2): string {
  const left = inset;
  const right = width - inset;
  const top = y + inset;
  const bottom = y + height - inset;
  const midY = (top + bottom) / 2;
  return `M${left + endCapDepth} ${top}H${right - endCapDepth}L${right} ${midY}L${right - endCapDepth} ${bottom}H${left + endCapDepth}L${left} ${midY}Z`;
}

function chamferPath(width: number, height: number, chamfer: number, y = 0, inset = 2): string {
  const left = inset;
  const right = width - inset;
  const top = y + inset;
  const bottom = y + height - inset;
  return `M${left + chamfer} ${top}H${right - chamfer}L${right} ${top + chamfer}V${bottom - chamfer}L${right - chamfer} ${bottom}H${left + chamfer}L${left} ${bottom - chamfer}V${top + chamfer}Z`;
}

function componentPath(request: M7ResolvedRequest, y: number, inset = 2): string {
  if (request.component === "primary-hex-button" || request.component === "secondary-hex-button" || request.component === "progress") {
    return hexPath(request.width, request.height - (request.component === "progress" ? 0 : 4), request.endCapDepth, y, inset);
  }
  return chamferPath(request.width, request.height - 4, request.endCapDepth, y, inset);
}

function defs(id: string): string {
  return `<linearGradient id="${id}-plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A5B72"/><stop offset=".48" stop-color="#162A3E"/><stop offset="1" stop-color="#091422"/></linearGradient><linearGradient id="${id}-primary" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".45" stop-color="#E59C32"/><stop offset="1" stop-color="#8E4D12"/></linearGradient><linearGradient id="${id}-energy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#88F8FF" stop-opacity="0"/><stop offset=".5" stop-color="#88F8FF" stop-opacity=".86"/><stop offset="1" stop-color="#88F8FF" stop-opacity="0"/></linearGradient><pattern id="${id}-grain" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="5" cy="7" r=".6" fill="#FFFFFF" fill-opacity=".12"/><circle cx="20" cy="15" r=".45" fill="#061321" fill-opacity=".2"/></pattern><pattern id="${id}-plate-pattern" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M0 22H44M22 0V44M0 22L22 0 44 22 22 44Z" fill="none" stroke="#D8FBFF" stroke-opacity=".12" stroke-width=".8"/></pattern>`;
}

/** M7-A3 deterministic angular recipe proving wide-hex geometry and approved layer order. */
export function renderM7AngularComponentSvg(input: M7AngularRequest): string {
  const request = validate(input);
  if (request.component === "progress") return renderM7AngularProgressSvg(request);
  const pressed = request.state === "pressed";
  const disabled = request.state === "disabled";
  const selected = request.state === "selected" || request.state === "highlighted";
  const y = pressed ? 2 : 0;
  const depth = pressed ? 2 : request.component === "panel" ? 8 : 5;
  const path = componentPath(request, y);
  const maskPath = `<path d="${path}" fill="white"/>`;
  const fill = request.component === "primary-hex-button" ? `url(#${request.instanceId}-primary)` : `url(#${request.instanceId}-plate)`;
  const opacity = disabled ? 0.48 : 1;
  const safeLeft = request.endCapDepth + 14;
  const safeWidth = request.width - safeLeft * 2;
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${request.width * 2}" height="${request.height * 2}" viewBox="0 0 ${request.width} ${request.height}" role="img" aria-label="M7 ${request.component} ${request.state}" data-style="m7-reference-fidelity@0.1.0" data-geometry-shape="${request.component.includes("hex") ? "wide-hexagon" : "chamfered-angular"}" data-corner-radius="${request.cornerRadius}" data-end-cap-depth="${request.endCapDepth}"><defs>${defs(request.instanceId)}<mask id="${request.instanceId}-mask">${maskPath}</mask></defs><g opacity="${opacity}"><g id="${request.instanceId}-outer-shadow" data-layer="outer-shadow" transform="translate(0 ${depth})"><path d="${path}" fill="#020812" opacity=".82"/></g><g id="${request.instanceId}-connected-depth" data-layer="connected-depth" transform="translate(0 ${depth / 2})"><path d="${path}" fill="#071522" opacity=".9"/></g><g id="${request.instanceId}-outer-frame" data-layer="outer-frame"><path d="${path}" fill="#071421" stroke="${selected ? "#FFFFFF" : "#9DEFFF"}" stroke-width="${selected ? 4 : 2}" stroke-linejoin="miter"/></g><g id="${request.instanceId}-inner-plate-fill" data-layer="inner-plate-fill"><path d="${path}" fill="${fill}"/></g><g id="${request.instanceId}-surface-grain" data-layer="surface-grain" data-material-source="m7-faceted-grain" mask="url(#${request.instanceId}-mask)"><rect width="${request.width}" height="${request.height}" fill="url(#${request.instanceId}-grain)"/></g><g id="${request.instanceId}-surface-pattern" data-layer="surface-pattern" data-material-source="m7-angular-plate-pattern" mask="url(#${request.instanceId}-mask)"><rect width="${request.width}" height="${request.height}" fill="url(#${request.instanceId}-plate-pattern)"/></g><g id="${request.instanceId}-side-bevel-shade" data-layer="side-bevel-shade" mask="url(#${request.instanceId}-mask)"><path d="${path}" fill="none" stroke="#020812" stroke-opacity=".38" stroke-width="5"/></g><g id="${request.instanceId}-top-bevel-highlight" data-layer="top-bevel-highlight" mask="url(#${request.instanceId}-mask)"><path d="M${request.endCapDepth + 10} ${8 + y}H${request.width - request.endCapDepth - 10}" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="3" stroke-linecap="square"/></g><g id="${request.instanceId}-edge-energy-accent" data-layer="edge-energy-accent" data-material-source="m7-energy-edge-accent" mask="url(#${request.instanceId}-mask)"><rect x="${request.endCapDepth}" y="${6 + y}" width="${request.width - request.endCapDepth * 2}" height="8" fill="url(#${request.instanceId}-energy)"/></g><g id="${request.instanceId}-ornament-decal" data-layer="ornament-decal" data-material-source="m7-ornament-marks" mask="url(#${request.instanceId}-mask)"><path d="M${request.endCapDepth + 8} ${request.height - 13}h16M${request.width - request.endCapDepth - 24} ${request.height - 13}h16" stroke="#E6FCFF" stroke-opacity=".5" stroke-width="2"/></g><g id="${request.instanceId}-content" data-layer="content" data-slot="editable-${request.component}-content" data-safe-x="${safeLeft}" data-safe-y="${8 + y}" data-safe-width="${safeWidth}" data-safe-height="${request.height - 18}"/></g></svg>`;
}

export function renderM7AngularProgressSvg(input: M7AngularRequest): string {
  const request = validate(input);
  if (request.component !== "progress") throw new RangeError("M7 progress renderer requires component=progress.");
  const fillWidth = Math.round((request.width - request.endCapDepth * 2) * request.percent / 100);
  const framePath = componentPath(request, 0);
  const fillPath = hexPath(fillWidth + request.endCapDepth * 2, request.height, request.endCapDepth, 0, 6);
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${request.width * 2}" height="${request.height * 2}" viewBox="0 0 ${request.width} ${request.height}" role="img" aria-label="M7 angular progress ${request.percent} percent" data-style="m7-reference-fidelity@0.1.0" data-geometry-shape="wide-hexagon"><defs>${defs(request.instanceId)}<clipPath id="${request.instanceId}-fill-clip"><path d="${fillPath}"/></clipPath></defs><g id="${request.instanceId}-frame" data-part="frame"><path d="${framePath}" fill="#071421" stroke="#9DEFFF" stroke-width="2" stroke-linejoin="miter"/></g><g id="${request.instanceId}-fill" data-part="fill" clip-path="url(#${request.instanceId}-fill-clip)"><path d="${fillPath}" fill="url(#${request.instanceId}-primary)"/><rect width="${request.width}" height="${request.height}" fill="url(#${request.instanceId}-grain)" data-layer="surface-grain" data-material-source="m7-faceted-grain"/><rect width="${request.width}" height="${request.height}" fill="url(#${request.instanceId}-plate-pattern)" data-layer="surface-pattern" data-material-source="m7-angular-plate-pattern"/></g></svg>`;
}
