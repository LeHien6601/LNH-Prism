# Module 02 — AI-Assisted Design Analysis

## Goal

Turn a concept screen or style board into a reviewed proposal for tokens and component structure. AI accelerates observation; humans approve the design specification.

## Scope

Palette/radius/spacing/lighting/material-category suggestions, component inventory, confidence markers, and source annotations. It does not output final assets or automatically approve its own interpretation.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Concept image(s), target platform, game context, existing token library | Proposed style spec, component inventory, confidence report, unresolved-question list |

## Architecture

1. Ingest concept and metadata.
2. AI proposes observations, each linked to a source region or verbal evidence.
3. Normalizer converts observations into controlled token candidates.
4. Art/UI reviewer edits and approves a versioned style spec.
5. Approved spec becomes renderer input; raw AI analysis remains trace evidence.

## Implementation steps

1. Create a review form for palette, typography placeholders, radii, strokes, shadows, highlights, spacing scale, and material categories.
2. Define confidence levels: high (directly observed), medium (reasonable inference), low (requires decision).
3. Require AI output to distinguish observation from recommendation.
4. Map accepted items into `style-spec` fields; leave rejected items recorded.
5. Add side-by-side concept/render review once M1 is available.

## Dependencies

Module 01 contracts; style reference collection; M1 renderer for meaningful comparison.

## Acceptance criteria

- Reviewers can edit every AI proposal before it reaches production.
- Each accepted critical token has a reference or explicit human decision.
- The process creates a usable V1 style spec in a bounded review session.

## Validation task

For V3, analyze one new concept screen and rebuild its Button, Panel, and Progress Bar using only the reviewed spec and material pack—not cropped pixels.

The approved primary reference is the [Frostbound Reward Popup](../reference-briefs/V3_FROSTBOUND_REWARD.md). V3 adds a reusable reward-emblem container so material reuse is demonstrated across at least four component types while retaining the bounded Panel–Button–Progress core.

## Current M3 implementation

M3-S1 is complete. Versioned contracts now cover the concept receipt, source-annotated analysis proposals, and human review records. JSON Schema enforces required evidence, bounded annotation coordinates, typed confidence/disposition values, legal transition shapes, and the critical-proposal mapping gate; semantic validation enforces region containment, concept-hash binding, transition continuity, exact blocker lists, and immutable analysis/review linkage.

## Risks

- False precision from visual inference: show confidence and allow “unknown.”
- Style drift from multiple images: nominate one primary reference and label secondary references.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
| 2026-07-17 | Selected Frostbound Reward as the V3 concept and drafted the source-annotated, human-controlled analysis workflow | Project owner / Codex |
| 2026-07-17 | Approved the M3 proposal/review model and unblocked M3-S1 contract implementation | Project owner / Codex |
| 2026-07-17 | Completed M3-S1 contracts, representative Frostbound fixtures, semantic validation, and focused failure coverage | Codex |
