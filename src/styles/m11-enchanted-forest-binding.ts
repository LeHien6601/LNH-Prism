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
function forestLayers(request: StyleCompositionRequest): string {
  const seed = request.variationSeed ?? 51731;
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError("Variation seed must be an unsigned 32-bit integer.");
  const cx = request.width / 2, cy = request.height / 2, focal = request.component === "panel" || request.component === "icon-container";
  const control = request.component.includes("button") || request.component === "tab" || request.component === "badge";
  const speckles = seed === 0 ? "" : Array.from({ length: 4 }, (_, index) => '<circle cx="' + (16 + random(seed, index * 2) * (request.width - 32)).toFixed(2) + '" cy="' + (14 + random(seed, index * 2 + 1) * (request.height - 28)).toFixed(2) + '" r="1.1"/>').join("");
  const variation = '<g id="m11-' + request.component + '-moss-variation" data-layer="forest-variation" data-variation-seed="' + seed + '" data-variation-baseline="' + (seed === 0) + '" fill="#9BCB78" fill-opacity=".18">' + speckles + "</g>";
  const ornament = '<g id="m11-' + request.component + '-leaf-vine-ornament" data-layer="forest-ornament" data-ornament="leaf-vine" data-ornament-count="4" fill="none" stroke="#76B86D" stroke-opacity=".62" stroke-width="1.4"><path d="M12 18c8-8 14-8 20-2M' + (request.width - 12) + ' 18c-8-8-14-8-20-2"/></g>';
  const typography = control ? '<g id="m11-' + request.component + '-parchment-typography" data-layer="forest-typography" data-typography-preset="m11-parchment-sage-action" data-semantic-text="required"><path d="M' + (cx - 28) + " " + (request.height / 2 + 13) + 'h56" stroke="#EDE3B4" stroke-opacity=".42"/></g>' : "";
  const focalLayers = focal ? '<g id="m11-' + request.component + '-luminous-seed" data-layer="luminous-seed-focal" data-focal="m11-luminous-seed" data-halo-opacity=".40" data-halo-extent-ratio=".12"><circle cx="' + cx + '" cy="' + cy + '" r="' + (Math.min(request.width, request.height) * .12) + '" fill="#65D5A4" fill-opacity=".40"/><path d="M' + cx + " " + (cy - 30) + 'l24 30-24 30-24-30Z" fill="#243D2C" stroke="#B9D995" stroke-width="2"/><circle cx="' + cx + '" cy="' + cy + '" r="11" fill="#B8F0B2" fill-opacity=".72"/></g><g id="m11-' + request.component + '-seed-support" data-layer="forest-focal-support" fill="none" stroke="#6E8C5D" stroke-width="2"><path d="M' + (cx - 34) + " " + (cy + 28) + "Q" + cx + " " + (cy + 52) + " " + (cx + 34) + " " + (cy + 28) + '"/></g>' : "";
  return variation + ornament + typography + focalLayers;
}
