# Enchanted Forest third-style implementation definition

## Status

Approved on 2026-07-19 by R-016c Option A; see [ADR-025](../decisions/ADR-025-enchanted-forest-definition-approval.md). This document sets the boundary for later implementation planning; it does not itself authorize renderer, package, material-source, or production-asset changes.

## Purpose and approved inputs

Prove a third visually distinct UI family while retaining the established deterministic, engine-neutral component system. The approved direction is [ADR-024](../decisions/ADR-024-enchanted-forest-third-style-contrast.md). The generated [review-only reference receipt](../reference-briefs/assets/enchanted-forest-review-reference-1080x1920.receipt.json) records the `1080 × 1920` evidence image; its PNG is comparison evidence, never a production input.

The target must read as an ancient, living interface: weathered stone and dark wood, moss and restrained leaf/vine growth, diffuse emerald/teal light, and a soft luminous-seed or ancient-grove focal. It must not read as Frostbound recolored green or Volcanic Forge with leaves added.

## Fixed production boundary

| Rule | Requirement |
|---|---|
| Component inventory | Reuse exactly seven existing components: panel, primary hex button, secondary hex button, progress frame/fill, tab, badge, and icon container. |
| Geometry | Retain the shared angular wide-hex templates, stable component IDs, content-slot contracts, module boundaries, and engine-neutral SVG/PNG handoff shape. |
| Composition | Bind Enchanted Forest through the style-agnostic composition seam; no style-specific renderer, template fork, or geometry branch is permitted. |
| Source provenance | Materials and effects must be independently versioned, procedural or source-neutral inputs with recorded hashes/settings. The generated reference and any of its pixels, crops, traces, links, or derived raster textures are forbidden from production sources and outputs. |
| Determinism | Every deliberate irregularity is driven by an explicit named seed; the same seed must reproduce byte-identical permitted variation, and a zero baseline must be receipted. |
| Canvas | Review the complete family at the approved `1080 × 1920` portrait canvas. |

## Editable visual system

| Dimension | Deterministic requirement | Explicit contrast from prior styles |
|---|---|---|
| Materials | Separate stone base, dark-wood inset/grain, moss/lichen growth, and low-intensity bioluminescent channels. Keep their fills, masks, edge response, and opacity independently editable. | No ice/crystal facets or molten metal/lava surfaces. |
| Variation | Use a recorded seed to place bounded bark grain, stone wear, moss speckle, and root-line irregularity. Variation may change only designated material/ornament masks, never geometry, IDs, labels, slots, or state semantics. | Organic wear rather than Frostbound facets or Forge soot/cracks/hammer marks. |
| Ornament | Use sparse leaf, vine, root, or lichen motifs at approved anchor points. Ornament remains below content, cannot cross slots, and is separately removable from the structural edge stack. | Botanical growth rather than rune/rivet/ember or crystal ornament. |
| Focal | Assemble the luminous seed/ancient-grove focal from separate support, seed, halo, and optional mote layers. It must establish hierarchy without becoming a bright fireball. | Soft living light rather than a cold crystal or molten core. |
| Typography | Use readable parchment/sage text treatment with restrained contrast enhancement. Typography must retain normal semantic label layers and never rely on baked lettering. | No engraved gold/brass or Forge heat-label treatment. |
| Lighting | Use diffuse canopy/inner emerald-teal illumination, with a darker neutral perimeter for separation. Emission is a supporting material channel, not a global glow filter. | No Frostbound specular ice shine, Forge bottom heat, flame, or hard orange rim light. |
| States | Primary: modest bioluminescent emphasis; pressed: coherent compression/dimming of the same layers; disabled: reduced saturation/contrast without losing label readability. State changes must preserve the material/ornament hierarchy and named layer IDs. | State language reads as living light response, not a metal heat cycle or icy flash. |

### Quantitative restraint bounds

- Total bioluminescent emission coverage may occupy at most 30% of an individual component's visible face; each halo must remain clipped to its component or focal container.
- A focal halo may extend no more than 12% of its focal container's shortest dimension beyond the seed silhouette. It must have a separately addressable opacity channel no greater than `0.40` at the default state.
- No more than six ornamental instances may appear on one component face, and no more than twelve optional motes may appear in the complete portrait. Omitted motes are valid at the zero baseline.
- Required labels and progress values remain semantic text layers. At target-phone scale, moss, grain, wear, glow, ornament, focal layers, and state treatments may not overlap or obscure them; the later rubric's Mobile-scale readability and state distinction dimension must score at least `3/5`.

## Required state and inventory coverage

The later package must prove all seven inventory members in the shared matrix. It must include primary, secondary, selected/active where the existing component contract defines it, pressed, and disabled state evidence; progress frame and fill remain independently exportable at the established percentages. No component may be substituted with a decorative mockup or a flattened portrait-only layer.

## Evidence and validation plan

Before implementation review, prepare these evidence surfaces and receipts:

1. Source-distance, target-phone, and thumbnail comparisons showing Frostbound, Volcanic Forge, Enchanted Forest, and the generated reference only in its labeled review role.
2. A complete seven-component/state matrix and a `1080 × 1920` portrait composition.
3. Material isolation and focal/ornament layer previews proving each named source remains independently editable.
4. Named seed receipts for a zero baseline and at least three nonzero seeds, including same-seed reproduction and permitted-difference checks.
5. Package/module, manifest, stable-ID, source-provenance, clean-workspace, and shared-composition receipts consistent with the current multi-style hardening controls.
6. Automated source-boundary validation that rejects the Enchanted Forest review-reference filename, SHA-256, identical raster content, and all direct production links.

## Automatic implementation/review blockers

- Palette-only green reskin of Frostbound or Forge.
- A new style-specific renderer, template, geometry fork, or changed component inventory.
- Reference-pixel use, raster tracing, flattened production-only effects, or absent material provenance.
- Unseeded randomness, absent zero-baseline evidence, or variation that changes IDs, slots, labels, geometry, or state meaning.
- Forge-like gold/brass/fire language, Frostbound-like ice/crystal language, an over-bright global bloom, or ornament that obscures content.
- Missing source/phone/thumbnail evidence, missing complete matrix/package receipts, or a failed reference-boundary scan.

## Definition-review decision

R-016c approved this definition and the companion [visual-contrast rubric](../validation/ENCHANTED_FOREST_THIRD_STYLE_RUBRIC.md) through [ADR-025](../decisions/ADR-025-enchanted-forest-definition-approval.md). The next permitted work is bounded implementation/evidence slice planning; approval does not authorize an editor, new component types, engine integration, or changes to reference-pixel policy.
