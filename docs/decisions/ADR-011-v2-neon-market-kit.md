# ADR-011 — Use the Neon Market Kit for V2

| Field | Value |
|---|---|
| Status | 🟢 Accepted |
| Date | 2026-07-16 |
| Decision owner | 🧭 Project owner |
| Scope | M2 / Practical Validation V2 target and first material direction |

## Context

M2 must prove that one versioned material pack and shared design tokens can style a realistic family of mobile UI components consistently. The validation target needs to exercise variants, states, reusable surface detail, and cross-component hierarchy without introducing M3 AI analysis or M4 Unity integration.

## Decision

Practical Validation V2 will build a **Neon Market Kit** for a portrait mobile shop popup at the existing `540 × 960` logical / `1080 × 1920` output baseline.

The required component family is:

- shop panel;
- category tabs;
- primary purchase button;
- secondary or cancel button;
- currency badge;
- limited-offer progress bar.

Every component will derive its surface treatment from one versioned **Neon Alloy** material pack. The material direction combines a dark-blue base gradient, fine reusable grain, a restrained hex/circuit pattern, cyan edge illumination, a controlled metallic bevel, and an optional holographic accent decal.

Neon Alloy is a reusable material input, not a final component image. Geometry, borders, lighting, states, content slots, and final SVG output remain deterministic and independently editable.

## Validation boundary

V2 must demonstrate:

- one token or material change propagating consistently across the family;
- material reuse on at least four component types;
- parameter-driven states and supported sizes without manual repainting;
- readable hierarchy and surface detail at target-phone scale;
- named SVG layers and complete source/output provenance;
- cross-component consistency of at least `4/5` in the approved V2 rubric.

V2 does not include AI screenshot analysis, per-component AI textures, Unity integration, or general-purpose editing features.

## Consequences

### Benefits

- The shop context naturally exercises the full M2 component family.
- Neon Alloy extends the approved Neon Core baseline, keeping material-system risk isolated.
- Tabs, badges, button variants, and progress state expose consistency defects early.

### Trade-offs and controls

| Trade-off | Control |
|---|---|
| The art direction is evolutionary rather than a completely new theme | Measure material richness and reuse, then defer new-theme transfer testing to a later validation |
| Pattern, bevel, and edge light can reduce mobile readability | Define bounded intensity tokens and target-phone review evidence before implementation |
| Optional decals could become component-specific decoration | Use named reusable decal slots and require the base family to remain coherent without them |

## Links

- [V2 reference brief](../reference-briefs/V2_NEON_MARKET.md)
- [Materials and Textures](../modules/04-materials-textures.md)
- [Practical Validation Lab](../modules/05-validation-lab.md)
- [Phased roadmap](../ROADMAP.md)

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Approved Option A: Neon Market Kit with one reusable Neon Alloy material direction | Project owner |
