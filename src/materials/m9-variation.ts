import type { M7AngularComponent } from "../renderer/m7-angular-components.js";

export type VariationRegion = "content-surface" | "focal-surface";
export interface VariationChannels { frostCoverage: number; crackDensity: number; scratchDensity: number; highlightScatter: number; particleCount: number; shardVariance: number; asymmetry: number; }
export interface VariationPreset { id: string; version: string; seed: number; channels: VariationChannels; }
export interface VariationReceipt { variationPresetId: string; variationPresetVersion: string; variationSeed: number; channels: VariationChannels; }
export const M9_DEFAULT_VARIATION_SEED = 14821;

export const M9_FROSTBOUND_VARIATION_PRESETS: Record<string, VariationPreset> = {
  "m9-frostbound-surface-variation": { id: "m9-frostbound-surface-variation", version: "1.0.0", seed: 14821, channels: { frostCoverage: .34, crackDensity: .17, scratchDensity: .12, highlightScatter: .22, particleCount: 12, shardVariance: .15, asymmetry: .08 } },
  "m9-frostbound-zero-variation": { id: "m9-frostbound-zero-variation", version: "1.0.0", seed: 0, channels: { frostCoverage: 0, crackDensity: 0, scratchDensity: 0, highlightScatter: 0, particleCount: 0, shardVariance: 0, asymmetry: 0 } }
};

const bindings: ReadonlySet<string> = new Set(["primary-hex-button/content-surface", "secondary-hex-button/content-surface", "panel/content-surface", "panel/focal-surface", "tab/content-surface", "badge/content-surface", "progress/content-surface", "icon-container/content-surface", "icon-container/focal-surface"]);

function assertSeed(seed: number): void { if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError("Variation seed must be an unsigned 32-bit integer."); }
function assertChannels(channels: VariationChannels): void { for (const [name, value] of Object.entries(channels)) { if (!Number.isFinite(value) || value < 0 || (name === "particleCount" ? !Number.isInteger(value) || value > 32 : value > 1)) throw new RangeError(`Variation channel ${name} is outside its documented bounds.`); } }

export function resolveVariation(component: M7AngularComponent, region: VariationRegion, presetId = "m9-frostbound-surface-variation", seed?: number): VariationReceipt {
  if (!bindings.has(`${component}/${region}`)) throw new Error(`No variation binding for ${component}/${region}.`);
  const preset = M9_FROSTBOUND_VARIATION_PRESETS[presetId]; if (!preset) throw new Error(`Unknown variation preset ${presetId}.`);
  const resolvedSeed = seed ?? preset.seed; assertSeed(resolvedSeed); assertChannels(preset.channels);
  return { variationPresetId: preset.id, variationPresetVersion: preset.version, variationSeed: resolvedSeed, channels: { ...preset.channels } };
}

function random(seed: number, index: number): number { let state = (seed + Math.imul(index + 1, 0x9e3779b9)) >>> 0; state ^= state >>> 16; state = Math.imul(state, 0x85ebca6b) >>> 0; state ^= state >>> 13; return (state >>> 0) / 0x100000000; }

export function renderVariationSvg(instanceId: string, component: M7AngularComponent, region: VariationRegion, width: number, height: number, presetId?: string, seed?: number): string {
  const receipt = resolveVariation(component, region, presetId, seed); const { channels } = receipt;
  const particles = Array.from({ length: channels.particleCount }, (_, index) => { const x = 12 + random(receipt.variationSeed, index * 2) * (width - 24); const y = 10 + random(receipt.variationSeed, index * 2 + 1) * (height - 20); return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(0.5 + channels.shardVariance * 1.5).toFixed(2)}" fill="#D9FFFF" fill-opacity="${(channels.highlightScatter * .45).toFixed(3)}"/>`; }).join("");
  const crack = channels.crackDensity === 0 ? "" : `<path d="M12 ${height * .56}l${(width - 24) * channels.crackDensity} ${height * (.08 + channels.asymmetry * .12)}" stroke="#D7FBFF" stroke-opacity="${(channels.crackDensity * .45).toFixed(3)}"/>`;
  return `<g id="${instanceId}-variation" data-variation-region="${region}" data-variation-preset="${receipt.variationPresetId}@${receipt.variationPresetVersion}" data-variation-seed="${receipt.variationSeed}" data-variation-frost="${channels.frostCoverage}" data-variation-scratch="${channels.scratchDensity}"><rect x="10" y="8" width="${width - 20}" height="${height - 16}" fill="#E6FBFF" fill-opacity="${(channels.frostCoverage * .12).toFixed(3)}"/>${crack}${particles}</g>`;
}
