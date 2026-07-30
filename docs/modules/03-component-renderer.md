# Module 03 — Deterministic Component Renderer

## Goal

Render editable UI components from layer recipes, tokens, dimensions, and materials.

## Scope

V1 primitives: shapes, fills, gradients, strokes, masks, outer/inner shadows, highlights, texture overlays, text/icon slots, and raster export. V2 adds cut corners, patterns, decals, 9-slice rules, and state recipes. Excludes free-form illustration tools.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Component spec, style tokens, material pack, state and size request | PNG/SVG where supported, layer debug view, render manifest |

## Layer architecture

```text
Component
├── outer shadow
├── outer/inner border
├── base fill / gradient
├── masked texture or pattern
├── inner shadow / bevel
├── edge or top highlight
├── optional decal
└── content slots (icon, label, value)
```

## Implementation steps

1. Use the approved TypeScript + SVG source + `@resvg/resvg-js` PNG stack from [ADR-009](../decisions/ADR-009-v1-render-export-stack.md); pin the renderer version.
2. Implement one layer at a time with parameterized tests.
3. Build the Button template first; parameterize normal/pressed/disabled rather than duplicating art.
4. Add Panel and Progress Bar, separating frame and fill into independent renderable parts.
5. Add debug rendering for individual layers and masks.
6. Add responsive rules: fixed, stretch, tile, and 9-slice-aware areas.

## Dependencies

Module 01 schemas; selected rendering technology; Module 04 for texture inputs.

## Acceptance criteria

- Changing size does not distort protected corners/borders.
- Shadow/highlight are separate from texture and adapt to states.
- A component renders at two target sizes with no manual pixel repair.
- Layer debug view makes visual defects diagnosable.

## Validation task

M1 V1: create a Primary Button, a Panel, and a Progress Bar for a real screen. The progress frame and fill must be separately reusable.

## Risks

- Filter behavior differs across backends: pin backend/version and cover with golden images.
- Too many arbitrary parameters: favor named presets and bounded ranges.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
| 2026-07-15 | Recorded approved V1 SVG/resvg rendering stack | Project owner |
| 2026-07-15 | Completed Primary Button SVG/PNG proof with named layers, state recipes, manifests, and deterministic-output tests | Codex |
| 2026-07-16 | Completed Primary Panel proof at both target heights with fixed corners, tiled grain, manifests, and deterministic-output tests | Codex |
| 2026-07-16 | Completed Primary Progress Bar proof with independent frame/fill outputs at two widths and three fill percentages | Codex |
| 2026-07-16 | Integrated all Progress Bar variants and independent parts into the renderer-backed showcase for mobile-context review | Codex |
| 2026-07-16 | Clipped the Progress Bar highlight to the rounded value-fill silhouette after visual review found cap overflow | Codex |
| 2026-07-16 | Bound V1 manifests to approved source paths/hashes, real material provenance, renderer sources, dependency lock, and verified output hashes for V1-D004 | Codex |
| 2026-07-16 | Replaced detached duplicate silhouettes with connected, parameterized extrusion bodies for Button, Panel, and Progress frame while retaining stable independent layer IDs | Codex |
| 2026-07-16 | Extracted browser-safe pure SVG recipes shared by CLI and CR-002 previews; added bounded intermediate widths/values, low-fill geometry, and manifest provenance | Codex |
| 2026-07-16 | Drafted M2 requirements for six Neon Market components, stable material layer order, bounded states/sizes, and browser/CLI equivalence; implementation awaits approval | Codex |
| 2026-07-16 | Approved the M2 renderer requirements and ordered delivery slices; M2-S1 contract/resolver work may begin | Project owner |
| 2026-07-16 | Completed M2-S2 material-source and masking foundation; M2-S3 may bind the shared templates to the Neon Alloy layer model | Codex |
| 2026-07-16 | Completed M2-S3 with one additive shared Neon Alloy renderer family for Button, Panel, Progress, Tab, and Badge; stable layer IDs, mask clipping, bounds, and deterministic tests are ready for M2-S4 assembly | Codex |
| 2026-07-17 | Completed M3-S4 Frostbound Panel, primary/secondary Button, Progress, and Reward Emblem Container recipes with bounded states/sizes, independent progress parts, a portrait reconstruction, and deterministic comparison evidence | Codex |
| 2026-07-30 | Added Production Lab editable family-state SVG rendering plus deterministic transparent PNG derivatives with alpha, native-dimension, and effect-padding validation for M12-A3 | Codex |
