# Module 04 — Materials and Textures

## Goal

Provide art richness through reusable, normalized materials that can be masked into deterministic geometry.

## Scope

Procedural fills/noise/patterns, AI-generated or artist-provided raster sources, tiling, scaling, color normalization, blend modes, edge masks, and decals. AI does not generate a final texture separately for every component.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Material references, source textures, style palette, quality constraints | Versioned material pack, previews, licensing/source record, renderer bindings |

## Material-pack structure

```text
Fantasy-Ice-v1
├── base-gradient
├── crystal-surface (tileable raster/procedural)
├── frost-grain (overlay)
├── edge-highlight profile
├── crack-decal set
├── shadow profile
└── state modifiers
```

## Implementation steps

1. Define source categories: base material, detail overlay, pattern, edge mask, and ornament/decal.
2. Add preflight checks: alpha, seamlessness where required, resolution, contrast, color space, and source/license record.
3. Normalize source texture to a style palette and documented detail scale.
4. Implement tile/scale/offset and masking before adding special effects.
5. Bind material slots to templates; expose bounded intensity controls.
6. Build state modifiers that adjust lighting/material intensity without regenerating textures.

## Dependencies

Module 01 contracts and Module 03 masking/compositing support.

## Acceptance criteria

- One material pack visibly supports at least four component types.
- Texture does not carry component-specific shadows or borders.
- Cropping/resizing does not expose obvious seams at supported sizes.
- Every imported AI source has prompt/source/version traceability.

## Validation task

M2 V2: produce a themed popup set using one material pack and document every reuse and override.

## Risks

- Visual noise reduces mobile readability: enforce a small-scale readability test.
- Texture styling overwhelms hierarchy: tokenized opacity/contrast caps and art review.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
| 2026-07-16 | Selected Neon Alloy as the first reusable M2 material direction for the V2 Neon Market Kit | Project owner |
| 2026-07-16 | Drafted Neon Alloy source categories, typed bounds, normalization, binding, propagation, and preflight requirements; implementation awaits approval | Codex |
| 2026-07-16 | Approved Neon Alloy source categories, typed controls, normalization, binding, and propagation requirements | Project owner |
