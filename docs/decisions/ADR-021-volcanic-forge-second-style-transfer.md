# ADR-021 — Select Volcanic Forge for second-style transfer

## Status

Accepted — 2026-07-19

## Context

M9 passed its corrected production-fidelity review at `85/100`. The generalized edge, material-response, seeded-variation, ornament, focal-object, typography, and lighting systems must now be tested against a materially different style before any third-style or authoring-workflow work begins.

The decision must preserve deterministic, modular, engine-neutral delivery and must not allow a palette-only reskin, a Frostbound-specific renderer branch, flattened production assets, or new editor scope.

## Decision

Select **Volcanic Forge** as M10, the second-style transfer target.

The approved style direction is:

- angular wide-hex geometry reused from the shared component inventory;
- obsidian, brass/forged metal, and lava material families;
- warm bottom/inner lighting with constrained emission;
- soot, cracks, and hammered surface variation driven by recorded seeds;
- rivet, rune, and ember ornament treatments through shared anchors;
- engraved-gold typography and a molten-core focal object;
- heat-glow, compression, and dimmed state treatments.

M10 must prove that the shared systems—not a new parallel renderer—produce a package visibly distinct from Frostbound at thumbnail, target-phone, and source scales. A dedicated implementation specification and review rubric are required before renderer, asset, or package work begins.

## Consequences

- M10-A1 is complete; the next agent-ready task is to draft the bounded M10 implementation specification and visual-transfer rubric.
- The chosen style must use the existing seven-component inventory and shared generalized systems.
- M10 validation must include deterministic package receipts, complete provenance, independent source/phone/thumbnail inspection, target-phone readability, and a visual gate that rejects palette-only similarity.
- Enchanted Forest and Royal Arcane remain deferred options for a later third-style decision; neither is authorized now.

## Follow-up

Use `Next:` to draft the M10 Volcanic Forge implementation specification and validation rubric.
