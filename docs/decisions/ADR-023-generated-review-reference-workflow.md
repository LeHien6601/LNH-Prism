# ADR-023 — Generate review-only references for new style packages

## Status

Accepted on 2026-07-19 by project-owner direction.

## Context

Volcanic Forge has an approved style direction but no review-only visual reference with complete provenance. Requiring an owner-supplied or licensed source can delay a meaningful visual review, while allowing an agent to infer an unrecorded source would weaken traceability.

## Decision

For every new style package, once a human-approved style direction, target canvas, and component inventory exist, create an Agent-ready task to generate one review-only reference image. The task must record the generation prompt, model/tool, seed when available, dimensions, creation date, and permitted review use.

The generated image is comparison evidence only. It must never be used as a production component source, raster-traced, cropped into a material, linked by production SVG/PNG, or used to override the approved deterministic specification. An agent may derive the generation brief only from the approved direction; a new or materially changed art direction still requires human approval.

## Consequences

- `R-012` is complete: the project owner selected the generated-reference policy for Volcanic Forge.
- `R-012a` is the next Agent-ready task: generate and receipt the Volcanic Forge portrait reference at `1080 × 1920` from ADR-021's approved direction.
- `R-013` follows R-012a and binds the generated reference receipt to review evidence while enforcing the no-pixel-extraction boundary.
- Future style plans must include the same generated-reference task before a visual-fidelity review can claim reference comparison.
