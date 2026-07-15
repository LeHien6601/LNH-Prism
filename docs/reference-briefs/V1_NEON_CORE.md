# V1 Reference Brief — Neon Core

## Decision

**Status:** 🟢 Selected by project owner on 2026-07-15.  
**Purpose:** visual reference for the first deterministic Primary Button, Panel, and Progress Bar validation.

This brief is the authoritative V1 design reference until a reviewed concept image is added. It defines style intent and tokens; it is **not** a source image to crop into final assets.

## Target scale

| Field | Value |
|---|---|
| Orientation | Portrait mobile |
| Logical reference canvas | `540 × 960` |
| Output scale | `2×` |
| Output reference canvas | `1080 × 1920` |
| Component design rule | Define component geometry in logical pixels; render and inspect at 2× output |

## Visual direction

Neon Core is a clean, blue sci-fi UI material family: crisp geometry, a cool luminous surface, restrained grain, and a consistent top light. It should feel polished and energetic without making texture or glow compete with gameplay readability.

| Aspect | Direction |
|---|---|
| Primary color | `#4F84FF` electric blue |
| Border color | `#D9E8FF` pale blue-white |
| Shadow color | `#102040` deep navy |
| Shape | Rounded rectangles; 24 logical-pixel corner radius; 2 logical-pixel stroke baseline |
| Lighting | Top highlight; shadow below the component; no conflicting local light directions |
| Material | Smooth blue gradient with low-opacity reusable grain; no baked background reflection |
| Contrast | Primary action and progress value must remain readable over both light and dark review backgrounds |

## V1 component intent

| Component | Required behavior |
|---|---|
| Primary Button | Normal, pressed, and disabled states; label/icon slot remains editable; pressed state is parameter-driven |
| Panel | Reusable container; independent border, fill, shadow, and content slot; stretch-safe corners |
| Progress Bar | Frame and fill are separately renderable; fill remains legible at low and high progress |

## Constraints and exclusions

- Keep effects in independent deterministic layers: shadow, border, fill, grain, highlight, and content.
- Use reusable material inputs; do not generate a unique AI texture for each component.
- Do not bake text, background color spill, or neighboring effects into reusable controls.
- Avoid heavy decals, dense circuitry, excessive bloom, and low-contrast blue-on-blue labels in V1.
- Treat any future concept image as a reference annotated to this brief, never as the production asset source.

## Review checklist

- [ ] Palette, border, radius, and lighting match this brief across all three components.
- [ ] A component remains clear at the `540 × 960` logical reference scale.
- [ ] 2× output is clean at 100% and 200% inspection.
- [ ] Texture/grain is subtle enough that hierarchy remains obvious.
- [ ] Button state changes and progress fill changes do not require AI regeneration.

## Links

- Style contract: `specs/examples/style-neon-core.json`
- V1 scorecard: `docs/validation/V1_VISUAL_REVIEW_RUBRIC.md`
- Next decision: define V1 component acceptance briefs in `docs/PROJECT_OVERVIEW.md`

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Recorded selected Neon Core V1 direction and target scale | Project owner |
