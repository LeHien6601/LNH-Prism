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
AI material source ──> reviewed Material Pack ─┼─> Component Spec ─> Deterministic Renderer ─> Export Manifest ─> Unity
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
