import type { StyleCompositionBinding, StyleCompositionRequest } from "../renderer/style-composition.js";

export const M11_ENCHANTED_FOREST_LIMITS = { bioluminescenceCoverageMaximum: .30, haloExtentRatioMaximum: .12, haloOpacityMaximum: .40, ornamentMaximum: 6, portraitMoteMaximum: 12 } as const;
export const M11_ENCHANTED_FOREST_LIGHTING = { direction: "inner-canopy", intensity: .44, glow: .30 } as const;

export const M11_ENCHANTED_FOREST_BINDING: StyleCompositionBinding = {
  id: "m11-enchanted-forest",
  version: "0.1.0",
  displayName: "M11 Enchanted Forest",
  colors: [["#071329", "#13251E"], ["#112A46", "#20382B"], ["#0B2038", "#182E24"], ["#173D5A", "#31513B"], ["#315C7A", "#5C7650"], ["#1A6592", "#2A856F"], ["#175A8D", "#359A7B"], ["#63CFF3", "#66D9B2"], ["#9FEFFF", "#B8E0A5"], ["#B9F7FF", "#D4D9A6"], ["#E6FBFF", "#F1E8C8"]],
  validate() { /* M11 limits are data-owned; the renderer retains M7/M8 geometry. */ },
  overlay(request) { return forestLayers(request); }
};

function random(seed: number, index: number): number { let state = (seed + Math.imul(index + 1, 0x9e3779b9)) >>> 0; state ^= state >>> 16; state = Math.imul(state, 0x85ebca6b) >>> 0; state ^= state >>> 13; return (state >>> 0) / 0x100000000; }
function forestFace(request: StyleCompositionRequest): string {
  const inset = 4, top = inset, bottom = request.height - 6, mid = (top + bottom) / 2;
  const hex = request.component.includes("button");
  const cap = request.component === "primary-hex-button" ? Math.min(44, Math.max(24, Math.round(request.height * .5))) : Math.min(36, Math.max(20, Math.round(request.height * .45)));
  if (hex) return `M${inset + cap} ${top}H${request.width - inset - cap}L${request.width - inset} ${mid}L${request.width - inset - cap} ${bottom}H${inset + cap}L${inset} ${mid}Z`;
  const chamfer = request.component === "icon-container" ? Math.round(request.width * .24) : Math.min(34, Math.max(16, Math.round(request.height * .32)));
  return `M${inset + chamfer} ${top}H${request.width - inset - chamfer}L${request.width - inset} ${top + chamfer}V${bottom - chamfer}L${request.width - inset - chamfer} ${bottom}H${inset + chamfer}L${inset} ${bottom - chamfer}V${top + chamfer}Z`;
}
function forestLayers(request: StyleCompositionRequest): string {
  const seed = request.variationSeed ?? 51731;
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError("Variation seed must be an unsigned 32-bit integer.");
  const cx = request.width / 2, cy = request.height / 2, focal = request.component === "panel" || request.component === "icon-container";
  const control = request.component.includes("button") || request.component === "tab" || request.component === "badge";
  const face = forestFace(request);
  const material = '<g id="m11-' + request.component + '-material-stack" data-layer="forest-material-stack" data-material-families="weathered-stone,dark-wood,moss-lichen"><path d="' + face + '" fill="#20382B"/><path d="M' + (request.width * .08) + ' ' + (request.height * .32) + 'H' + (request.width * .92) + 'M' + (request.width * .12) + ' ' + (request.height * .55) + 'H' + (request.width * .88) + 'M' + (request.width * .18) + ' ' + (request.height * .76) + 'H' + (request.width * .82) + '" stroke="#182E24" stroke-width="' + Math.min(3, Math.max(1, request.height * .012)) + '" stroke-opacity=".82"/><path d="M' + (request.width * .10) + ' ' + (request.height * .25) + 'Q' + (request.width * .28) + ' ' + (request.height * .17) + ' ' + (request.width * .43) + ' ' + (request.height * .24) + 'M' + (request.width * .58) + ' ' + (request.height * .76) + 'Q' + (request.width * .74) + ' ' + (request.height * .68) + ' ' + (request.width * .9) + ' ' + (request.height * .75) + '" fill="none" stroke="#4D6E45" stroke-width="' + Math.min(2.5, Math.max(1, request.height * .008)) + '" stroke-opacity=".9"/><path d="M' + (request.width * .06) + ' ' + (request.height * .16) + 'Q' + (request.width * .18) + ' ' + (request.height * .06) + ' ' + (request.width * .3) + ' ' + (request.height * .16) + 'M' + (request.width * .7) + ' ' + (request.height * .84) + 'Q' + (request.width * .83) + ' ' + (request.height * .73) + ' ' + (request.width * .94) + ' ' + (request.height * .84) + '" fill="none" stroke="#84B66A" stroke-width="' + Math.min(3, Math.max(1, request.height * .01)) + '" stroke-opacity=".72"/></g>';
  const speckles = seed === 0 ? "" : Array.from({ length: 7 }, (_, index) => '<circle cx="' + (16 + random(seed, index * 2) * (request.width - 32)).toFixed(2) + '" cy="' + (14 + random(seed, index * 2 + 1) * (request.height - 28)).toFixed(2) + '" r="' + (1 + random(seed, index + 16) * 2).toFixed(1) + '"/>').join("");
  const variation = '<g id="m11-' + request.component + '-moss-variation" data-layer="forest-variation" data-variation-seed="' + seed + '" data-variation-baseline="' + (seed === 0) + '" fill="#A6CC72" fill-opacity=".38">' + speckles + "</g>";
  const ornament = '<g id="m11-' + request.component + '-leaf-vine-ornament" data-layer="forest-ornament" data-ornament="leaf-vine" data-ornament-count="4" fill="none" stroke="#76B86D" stroke-opacity=".78" stroke-width="1.8"><path d="M12 18c8-8 14-8 20-2M' + (request.width - 12) + ' 18c-8-8-14-8-20-2M18 ' + (request.height - 18) + 'c8-7 15-7 22-1M' + (request.width - 18) + ' ' + (request.height - 18) + 'c-8-7-15-7-22-1"/><path d="M24 14l5-5M' + (request.width - 24) + ' 14l-5-5"/></g>';
  const typography = control ? '<g id="m11-' + request.component + '-parchment-typography" data-layer="forest-typography" data-typography-preset="m11-parchment-sage-action" data-semantic-text="required"><path d="M' + (cx - 28) + " " + (request.height / 2 + 13) + 'h56" stroke="#EDE3B4" stroke-opacity=".42"/></g>' : "";
  const focalLayers = focal ? '<g id="m11-' + request.component + '-luminous-seed" data-layer="luminous-seed-focal" data-focal="m11-luminous-seed" data-halo-opacity=".40" data-halo-extent-ratio=".12"><circle cx="' + cx + '" cy="' + cy + '" r="' + (Math.min(request.width, request.height) * .12) + '" fill="#65D5A4" fill-opacity=".40"/><path d="M' + cx + " " + (cy - 30) + 'l24 30-24 30-24-30Z" fill="#243D2C" stroke="#B9D995" stroke-width="2"/><circle cx="' + cx + '" cy="' + cy + '" r="11" fill="#B8F0B2" fill-opacity=".72"/></g><g id="m11-' + request.component + '-seed-support" data-layer="forest-focal-support" fill="none" stroke="#6E8C5D" stroke-width="2"><path d="M' + (cx - 34) + " " + (cy + 28) + "Q" + cx + " " + (cy + 52) + " " + (cx + 34) + " " + (cy + 28) + '"/></g>' : "";
  return material + variation + ornament + typography + focalLayers;
}
