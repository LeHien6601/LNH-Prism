# Module 01 — System Architecture and Contracts

## Goal

Define the deterministic system that turns approved specifications into final assets, while keeping AI outputs at controlled input boundaries.

## Scope

Includes repository structure, specification schemas, IDs, versioning, renderer/material/export boundaries, and traceability. Excludes a general visual editor and any final-pixel decisions made solely by AI.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Approved style spec, component spec, material pack, render preset | Rendered assets, export manifest, validation evidence, trace links |

## Architecture

```text
Concept / style board ──> reviewed Style Spec ─┐
AI material source ──> reviewed Material Pack ─┼─> Component Spec ─> Deterministic Renderer ─> Portable Asset Module
Human art/UI decisions ────────────────────────┘                              │
                                                                                └─> visual validation evidence
```

Suggested repository layout:

```text
specs/styles/{style-id}.json
specs/components/{component-id}.json
materials/{material-pack-id}/
templates/{template-id}/
exports/{style-id}/{component-id}/
validation/{validation-id}/
```

## Implementation steps

1. Define `styleId`, `componentId`, `materialPackId`, `templateId`, `assetId`, and `validationId` formats.
2. Version every spec with semantic versioning; generated output records all source versions.
3. Create schemas with required fields, defaults, and validation messages.
4. Implement a resolver: component overrides → template defaults → style tokens → render defaults.
5. Write a trace manifest containing source hashes, renderer version, timestamp, and export IDs.
6. Add migrations whenever a schema changes incompatibly.

## Dependencies

M0 contract review; chosen implementation technology; file-based schema validator.

## Acceptance criteria

- A generated asset identifies every source spec and version.
- The same inputs render the same output on a supported environment.
- Invalid or incomplete specs fail before rendering.
- Changing a global token affects dependent assets predictably.

## Validation task

Create one `primary-button` spec that inherits style tokens, overrides one parameter, and yields a manifest that proves the inheritance chain.

## Risks

- Overly rigid schemas slow art iteration: use extension fields with review, not unbounded free-form parameters.
- Contract churn: version schemas and require migration tests.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
| 2026-07-15 | Added JSON Schema Draft 2020-12 contract baseline and validation examples | Codex |
| 2026-07-16 | Required export-manifest provenance at the schema root, corrected the canonical example, and added explicit missing-provenance rejection coverage | Project owner / Codex |
| 2026-07-16 | Added M2-S1 version-pinned style overlays, complete resolved-style checks, deterministic ancestor provenance, and bounded material-binding resolution | Codex |
| 2026-07-17 | Added export-manifest `1.1`, legacy `1.0` compatibility, deterministic Unity identity/registry semantics, canonical fixtures, and migration guidance for M4-S1 | Codex |
| 2026-07-30 | Added the isolated Production Lab project/reference boundary plus first-class state inheritance, geometry, slot, effect-padding, and scalable-region contracts for M12-A1/A2 | Codex |
| 2026-07-30 | Added M12-A4 immutable approval receipts, source/evidence freshness checks, cross-job drift classifications, exclusive locks, and staged-build rollback | Codex |
