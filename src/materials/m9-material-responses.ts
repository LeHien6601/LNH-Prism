import type { M7AngularComponent } from "../renderer/m7-angular-components.js";

export type MaterialRegion = "structural-edge" | "content-surface" | "focal-surface";
export type MaterialChannelName = "base" | "edge" | "highlight" | "glow" | "surface";
export interface MaterialChannel { color: string; opacity: number; sourceId?: string; }
export interface MaterialResponse { id: string; version: string; base: MaterialChannel; edge: MaterialChannel; highlight: MaterialChannel; glow: MaterialChannel; surface?: MaterialChannel; }
export interface MaterialResponseBinding { componentId: M7AngularComponent; region: MaterialRegion; responseId: string; }

const channel = (color: string, opacity: number, sourceId?: string): MaterialChannel => ({ color, opacity, ...(sourceId ? { sourceId } : {}) });
export const M9_FROSTBOUND_MATERIAL_RESPONSES: Record<string, MaterialResponse> = {
  "m9-dark-substrate": { id: "m9-dark-substrate", version: "1.0.0", base: channel("#071329", 1), edge: channel("#173D5A", .76, "m8-cold-edge-accent"), highlight: channel("#9FEFFF", .24), glow: channel("#63CFF3", .16), surface: channel("#B9F7FF", .06, "m8-ice-grain") },
  "m9-silver-metal": { id: "m9-silver-metal", version: "1.0.0", base: channel("#315C7A", 1), edge: channel("#B9F7FF", .84, "m8-cold-edge-accent"), highlight: channel("#E6FBFF", .56), glow: channel("#63CFF3", .22), surface: channel("#B9F7FF", .08, "m8-ice-grain") },
  "m9-clear-ice": { id: "m9-clear-ice", version: "1.0.0", base: channel("#1A6592", .74), edge: channel("#B9F7FF", .9, "m8-cold-edge-accent"), highlight: channel("#E6FBFF", .68), glow: channel("#63CFF3", .34), surface: channel("#9FEFFF", .1, "m8-crystal-facet-pattern") },
  "m9-blue-crystal": { id: "m9-blue-crystal", version: "1.0.0", base: channel("#175A8D", .88), edge: channel("#9FEFFF", .86, "m8-cold-edge-accent"), highlight: channel("#E6FBFF", .62), glow: channel("#63CFF3", .42), surface: channel("#B9F7FF", .12, "m8-crystal-facet-pattern") },
  "m9-cold-glow": { id: "m9-cold-glow", version: "1.0.0", base: channel("#0B2440", .4), edge: channel("#63CFF3", .72, "m8-cold-edge-accent"), highlight: channel("#E6FBFF", .5), glow: channel("#9FEFFF", .62), surface: channel("#B9F7FF", .08, "m8-ice-grain") }
};

export const M9_FROSTBOUND_REGION_BINDINGS: readonly MaterialResponseBinding[] = [
  { componentId: "primary-hex-button", region: "structural-edge", responseId: "m9-silver-metal" }, { componentId: "primary-hex-button", region: "content-surface", responseId: "m9-blue-crystal" },
  { componentId: "secondary-hex-button", region: "structural-edge", responseId: "m9-clear-ice" }, { componentId: "secondary-hex-button", region: "content-surface", responseId: "m9-dark-substrate" },
  { componentId: "panel", region: "structural-edge", responseId: "m9-silver-metal" }, { componentId: "panel", region: "content-surface", responseId: "m9-dark-substrate" }, { componentId: "panel", region: "focal-surface", responseId: "m9-blue-crystal" },
  { componentId: "tab", region: "structural-edge", responseId: "m9-clear-ice" }, { componentId: "tab", region: "content-surface", responseId: "m9-dark-substrate" },
  { componentId: "badge", region: "structural-edge", responseId: "m9-clear-ice" }, { componentId: "badge", region: "content-surface", responseId: "m9-blue-crystal" },
  { componentId: "progress", region: "structural-edge", responseId: "m9-silver-metal" }, { componentId: "progress", region: "content-surface", responseId: "m9-cold-glow" },
  { componentId: "icon-container", region: "structural-edge", responseId: "m9-clear-ice" }, { componentId: "icon-container", region: "content-surface", responseId: "m9-dark-substrate" }, { componentId: "icon-container", region: "focal-surface", responseId: "m9-blue-crystal" }
];

export function resolveMaterialResponse(componentId: M7AngularComponent, region: MaterialRegion): MaterialResponse {
  const binding = M9_FROSTBOUND_REGION_BINDINGS.find((entry) => entry.componentId === componentId && entry.region === region);
  if (!binding) throw new Error(`No material response bound to ${componentId}/${region}.`);
  const response = M9_FROSTBOUND_MATERIAL_RESPONSES[binding.responseId];
  if (!response) throw new Error(`Unknown material response ${binding.responseId}.`);
  return response;
}

export function renderMaterialResponseIsolationSvg(responseId: string, channelName: MaterialChannelName | "combined", width = 160, height = 56): string {
  const response = M9_FROSTBOUND_MATERIAL_RESPONSES[responseId];
  if (!response || width < 32 || height < 24) throw new RangeError("Material response isolation request is invalid.");
  const channels = channelName === "combined" ? (["base", "edge", "highlight", "glow", "surface"] as const) : [channelName];
  const body = channels.map((name) => { const value = response[name]; if (!value) return ""; return `<rect x="4" y="4" width="${width - 8}" height="${height - 8}" fill="${value.color}" fill-opacity="${value.opacity}" data-material-channel="${name}"${value.sourceId ? ` data-material-source="${value.sourceId}"` : ""}/>`; }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}" data-material-response="${response.id}" data-inspection="target-size">${body}</svg>`;
}
