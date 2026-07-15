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

1. Choose a rendering backend that supports masks, compositing, and repeatable headless export.
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
