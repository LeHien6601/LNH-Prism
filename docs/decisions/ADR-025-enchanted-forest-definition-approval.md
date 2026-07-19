# ADR-025 — Approve Enchanted Forest third-style definition

## Status

Accepted on 2026-07-19 by project-owner decision (R-016c, Option A).

## Context

ADR-024 selected Enchanted Forest as the third-style contrast target. R-016b drafted the deterministic implementation definition and visual-contrast rubric, but target-phone readability needed an explicit, consistent review threshold before implementation planning could begin.

## Decision

Approve [the Enchanted Forest implementation definition](../implementation/ENCHANTED_FOREST_THIRD_STYLE_IMPLEMENTATION_SPEC.md) and [visual-contrast rubric](../validation/ENCHANTED_FOREST_THIRD_STYLE_RUBRIC.md) with Option A's observable readability rule:

- Required labels and progress values remain semantic text layers, not baked lettering.
- At target-phone scale, no glow, material, ornament, focal layer, or state treatment may overlap or obscure required text or progress values.
- The later visual review must score **Mobile-scale readability and state distinction** at least `3/5`, in addition to the rubric's existing `≥85/100`, per-dimension minimum, and automatic-blocker rules.

All other approved bounds remain unchanged: the existing seven-component inventory, shared angular wide-hex geometry, style-agnostic composition seam, named deterministic seeds, review-only reference boundary, and engine-neutral SVG/PNG delivery.

## Consequences

- R-016c is complete; the M11 definition gate is passed.
- R-020 is the next Agent-ready task: plan bounded M11 implementation and evidence slices before contracts, materials, renderer bindings, or package work.
- This decision does not authorize a new component type, style-specific renderer/template path, editor, engine integration, or production use of reference pixels.
