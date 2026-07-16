# V2 Reference Brief — Neon Market Kit

## Decision

**Status:** 🟢 Selected by project owner on 2026-07-16.  
**Purpose:** authoritative product and art boundary for M2 implementation planning and Practical Validation V2.

The kit extends Neon Core into a coherent mobile shop family. It is not permission to add AI analysis, Unity integration, or a general-purpose editor.

## Target context and scale

| Field | Value |
|---|---|
| Scenario | Portrait mobile shop popup with category selection, purchase action, currency context, and limited-offer progress |
| Logical reference canvas | `540 × 960` |
| Output reference canvas | `1080 × 1920` (`2×`) |
| Canonical production source | Deterministic, named-layer SVG |
| Preview derivative | Deterministically rendered PNG where useful for review |

## Required component family

| Component | Minimum V2 behavior |
|---|---|
| Shop panel | Stable container geometry with independent structure, material, lighting, and content layers |
| Category tabs | Normal and selected variants derived from shared tokens and a state recipe |
| Primary purchase button | Normal, pressed, and disabled states with an editable label/value slot |
| Secondary/cancel button | Normal, pressed, and disabled states; visibly subordinate without leaving the material family |
| Currency badge | Reusable icon and value slots; readable at compact mobile size |
| Limited-offer progress bar | Independent frame and fill; reviewable at low, middle, and high values |

## Neon Alloy material direction

| Layer or slot | Direction |
|---|---|
| Base gradient | Dark navy-to-electric-blue alloy surface derived from Neon Core tokens |
| Fine grain | Low-opacity, tile-safe reusable surface variation |
| Pattern | Restrained hex or circuit motif with bounded scale, contrast, and opacity |
| Edge illumination | Cyan edge light driven by shared lighting tokens, not baked into a texture |
| Metallic bevel | Controlled deterministic highlight/shade profile that preserves content contrast |
| Accent decal | Optional reusable holographic motif in a named decal slot |

Material sources must be versioned and traceable. Textures and decals must not contain component-specific geometry, borders, shadows, labels, or background reflections.

## Required V2 proof

1. Assemble all required components in one realistic shop-popup showcase scenario.
2. Demonstrate the material pack on at least four component types.
3. Change one shared material or style token and show consistent propagation without repainting.
4. Review required states and progress values on target-phone scale and light/dark inspection surfaces.
5. Inspect named SVG layers and verify manifests against versioned specs, renderer sources, material sources, and output hashes.
6. Record defects by root cause, apply immediate blocker corrections, and revalidate before the V2 gate.

## Acceptance boundary

- Cross-component consistency reaches at least `4/5` in the approved V2 rubric.
- Surface detail does not obscure labels, values, icons, or action hierarchy.
- Supported resizing exposes no obvious pattern seams or distorted protected edges.
- A shared token/material change updates the complete family consistently.
- No required state or component needs a unique regenerated texture.

## Links

- Decision: [ADR-011](../decisions/ADR-011-v2-neon-market-kit.md)
- Materials module: [Module 04](../modules/04-materials-textures.md)
- Validation module: [Module 05](../modules/05-validation-lab.md)

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Recorded the approved Neon Market Kit family, scale, material direction, and validation boundary | Project owner / Codex |
