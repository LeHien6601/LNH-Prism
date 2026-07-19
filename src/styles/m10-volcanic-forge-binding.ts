import type { StyleCompositionBinding, StyleCompositionRequest } from "../renderer/style-composition.js";

export const M10_VOLCANIC_FORGE_BINDING: StyleCompositionBinding = {
  id: "m10-volcanic-forge",
  version: "0.2.0",
  displayName: "M10 Volcanic Forge",
  colors: [["#071329", "#140B09"], ["#112A46", "#29130E"], ["#0B2038", "#1B100C"], ["#173D5A", "#402014"], ["#315C7A", "#70401C"], ["#1A6592", "#B34216"], ["#175A8D", "#D5531B"], ["#63CFF3", "#FF6A1F"], ["#9FEFFF", "#FFD07A"], ["#B9F7FF", "#FFE2A0"], ["#E6FBFF", "#FFF0C5"]],
  validate() { /* Bounds approved by M10-A3 and carried by the binding, not a renderer branch. */ },
  overlay(request) { return forgeLayers(request); }
};

export const M10_VOLCANIC_FORGE_LIMITS = { portraitEmberCount: 8, controlEmberCount: 0, lavaOpacityMaximum: .55, glowRadiusRatioMaximum: .12 } as const;
export const M10_VOLCANIC_FORGE_LIGHTING = { direction: "bottom", intensity: .68, glow: .4 } as const;

function random(seed: number, index: number): number { let state = (seed + Math.imul(index + 1, 0x9e3779b9)) >>> 0; state ^= state >>> 16; state = Math.imul(state, 0x85ebca6b) >>> 0; state ^= state >>> 13; return (state >>> 0) / 0x100000000; }
function forgeLayers(request: StyleCompositionRequest): string {
  const cx = request.width / 2, cy = request.height / 2;
  const focal = request.component === "panel" || request.component === "icon-container";
  const control = request.component.includes("button") || request.component === "tab" || request.component === "badge";
  const seed = request.variationSeed ?? 39211;
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError("Variation seed must be an unsigned 32-bit integer.");
  const soot = seed === 0 ? "" : Array.from({ length: 4 }, (_, index) => `<circle cx="${(12 + random(seed, index * 2) * (request.width - 24)).toFixed(2)}" cy="${(10 + random(seed, index * 2 + 1) * (request.height - 20)).toFixed(2)}" r="1.2"/>`).join("");
  const variation = `<g id="m10-${request.component}-variation" data-layer="forge-variation" data-variation-seed="${seed}" data-variation-baseline="${seed === 0}" fill="#FFD07A" fill-opacity=".16">${soot}</g>`;
  const rivets = `<g id="m10-${request.component}-forged-rivets" data-layer="forge-ornament" data-ornament="rivet-rune" fill="#D7943A" stroke="#271108" stroke-width="1"><circle cx="14" cy="14" r="3"/><circle cx="${request.width - 14}" cy="14" r="3"/><circle cx="14" cy="${request.height - 14}" r="3"/><circle cx="${request.width - 14}" cy="${request.height - 14}" r="3"/></g>`;
  const typography = control ? `<g id="m10-${request.component}-engraved-typography" data-layer="forge-typography" data-typography-preset="m10-engraved-gold-action"><path d="M${cx - 30} ${request.height / 2 + 12}h60" stroke="#FFD27A" stroke-opacity=".42"/><path d="M${cx - 20} ${request.height / 2 + 16}h40" stroke="#5A250F"/></g>` : "";
  const core = focal ? `<g id="m10-${request.component}-molten-core" data-layer="molten-focal" data-focal="m10-molten-core"><circle cx="${cx}" cy="${cy}" r="${Math.min(request.width, request.height) * .16}" fill="#FF5B1A" fill-opacity=".16"/><path d="M${cx} ${cy - 42}l34 42-34 42-34-42Z" fill="#35130B" stroke="#FFD27A" stroke-width="3"/><path d="M${cx} ${cy - 29}l20 29-20 29-20-29Z" fill="#FF5B1A" fill-opacity=".55"/></g><g id="m10-${request.component}-embers" data-layer="portrait-embers" data-ember-count="${request.component === "panel" ? 8 : 0}" fill="#FFD27A">${request.component === "panel" ? [-52, -38, -24, -10, 10, 24, 38, 52].map((x, index) => `<circle cx="${cx + x}" cy="${cy - 72 - (index % 3) * 14}" r="2"/>`).join("") : ""}</g>` : "";
  return `${variation}${rivets}${typography}${core}`;
}
