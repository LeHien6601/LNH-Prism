# ADR-024 — Select Enchanted Forest for third-style contrast proof

## Status

Accepted on 2026-07-19 by project-owner decision (R-016 Option A).

## Context

Frostbound and Volcanic Forge prove cold-crystal and hot-forged-metal expressions through the shared renderer. A third-style proof must exercise materially different surface, lighting, ornament, focal, and hierarchy behavior without expanding into a new editor, engine integration, or unbounded component catalog.

## Decision

Select **Enchanted Forest** as the third-style contrast target. The approved contrast direction is weathered stone and dark wood, moss and leaf/vine ornament, diffuse emerald/teal bioluminescence, and a soft luminous-seed or ancient-grove focal. Typography should use restrained parchment/sage treatment rather than Forge-like engraved gold.

The proof remains bounded to the existing seven-component inventory: panel, primary hex button, secondary hex button, progress frame/fill, tab, badge, and icon container. Use the established `1080 × 1920` portrait review canvas. A generated review-only reference with complete provenance is required before any implementation work; its pixels cannot become production components, materials, SVG content, or PNG outputs.

## Consequences

- `R-016` is complete: the target, contrast dimensions, reference policy, canvas, inventory, and exit-evidence direction are recorded.
- `R-016a` is the next Agent-ready task: generate and receipt the Enchanted Forest review-only reference from this decision.
- A later definition task must specify deterministic material, variation, ornament, focal, typography, lighting, state, and validation rules before renderer or package changes begin.
- The third-style exit evidence must include the reference receipt, source/phone/thumbnail comparison, complete bounded component matrix, package/provenance receipts, and automated reference-pixel boundary validation.

## Recorded outcome

R-016a completed on 2026-07-19 with `enchanted-forest-review-reference-1080x1920.png` and its adjacent provenance receipt. The image was generated at `941 × 1672` and deterministically resized to the approved `1080 × 1920` review canvas; it remains review-only evidence.
