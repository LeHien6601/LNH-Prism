import { renderFrostboundComponentSvg } from "./frostbound-components.js";

function nested(svg: string, x: number, y: number, width: number, height: number): string {
  return svg.replace(/^<\?xml[^>]*>/, "").replace(/<svg[^>]*>/, `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
}

export function renderFrostboundScenarioSvg(): string {
  const panel = nested(renderFrostboundComponentSvg({ component:"panel", width:432, height:420, instanceId:"scenario-panel" }),54,90,432,420);
  const emblem = nested(renderFrostboundComponentSvg({ component:"emblem", width:144, height:144, state:"selected", instanceId:"scenario-emblem" }),198,142,144,144);
  const progress = nested(renderFrostboundComponentSvg({ component:"progress", width:320, height:28, percent:75, instanceId:"scenario-progress" }),110,448,320,28);
  const claim = nested(renderFrostboundComponentSvg({ component:"primary-button", width:288, height:64, label:"CLAIM", instanceId:"scenario-claim" }),126,570,288,64);
  const later = nested(renderFrostboundComponentSvg({ component:"secondary-button", width:200, height:52, label:"LATER", instanceId:"scenario-later" }),170,658,200,52);
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 540 960" role="img" aria-label="Deterministic Frostbound Reward reconstruction" data-concept-pixels="none"><defs><radialGradient id="scene-bg"><stop offset="0" stop-color="#173B63"/><stop offset="1" stop-color="#030B18"/></radialGradient></defs><rect width="540" height="960" fill="url(#scene-bg)"/><g id="reconstruction" data-source="approved-specs-only">${panel}<text x="270" y="128" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="800" fill="#E7FAFF">FROSTBOUND REWARD</text>${emblem}<text x="270" y="325" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">CRYSTAL CACHE</text><text x="270" y="365" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#BCEBFF">Reward progress</text>${progress}<text x="270" y="469" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">75%</text>${claim}${later}</g><g id="annotation-safe-area" fill="none" stroke="#7EDCFF" stroke-opacity=".16" stroke-dasharray="4 4"><rect x="24" y="24" width="492" height="912" rx="24"/></g></svg>`;
}
