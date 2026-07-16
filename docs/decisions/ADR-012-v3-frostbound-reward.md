# ADR-012 — Use Frostbound Reward Popup for V3

| Field | Value |
|---|---|
| Status | 🟢 Accepted |
| Date | 2026-07-17 |
| Decision owner | 🧭 Project owner |
| Scope | M3 / Practical Validation V3 target |

## Context

M3 must prove that AI-assisted observation can accelerate a concept-to-spec workflow without allowing AI output to bypass human review or deterministic production. The target must also address V2 follow-ups: stronger selected-state distinction and bounded semantic differentiation between primary and secondary actions.

## Decision

Practical Validation V3 will use the newly generated **Frostbound Reward Popup** as its primary concept reference at `540 × 960` logical / `1080 × 1920` presentation scale.

The bounded reconstruction family is:

- reward panel;
- primary claim button;
- secondary later button;
- reward progress bar;
- reusable reward-emblem icon container as the fourth material-reuse type.

AI may propose source-annotated observations, token candidates, component structure, and reusable material categories. Art/UI reviewers must correct and approve those proposals before they become versioned renderer inputs. Final geometry, states, masks, lighting, and output remain deterministic.

The concept raster is reference evidence only. Cropping, tracing pixels into production masks, texture extraction, or using the full-screen image as a component source is prohibited.

## Consequences

### Benefits

- A new visual theme tests transfer beyond Neon Core/Neon Market.
- The screen directly exercises action hierarchy, active-state clarity, and progress readability.
- Frost/crystal treatment offers a useful test of separating reusable material inputs from deterministic edges and lighting.

### Trade-offs and controls

| Trade-off | Control |
|---|---|
| The generated raster does not match the exact target resolution | Treat it as a composition reference; reconstruct at the approved logical/output scales |
| Ornate crystal detail can tempt pixel extraction or overfitting | Require source annotations, reusable material categories, and no concept-derived raster inputs |
| Visual inference can appear more precise than evidence supports | Record confidence and unknowns; require human decisions for low-confidence critical values |
| Pixel-perfect comparison would reward baked imitation | Score hierarchy, material language, structure, reuse, and traceability instead |

## Links

- [V3 reference brief](../reference-briefs/V3_FROSTBOUND_REWARD.md)
- [M3 implementation specification](../implementation/M3_FROSTBOUND_ANALYSIS_IMPLEMENTATION_SPEC.md)
- [V3 review rubric](../validation/V3_CONCEPT_RECONSTRUCTION_RUBRIC.md)

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Approved Option A: Frostbound Reward Popup and bounded Panel–Button–Progress reconstruction | Project owner |
