# LNH Prism Specifications

These are versioned, portable M0 contracts. They use JSON Schema Draft 2020-12 and describe source data—not generated output.

The Neon Core V1 examples are approved validation inputs. Generated V1 manifests bind their IDs and versions to repository paths and SHA-256 hashes; generation fails if an approved input or declared material source drifts.

M2-S1 adds draft Neon Market overlay and material-binding examples. They demonstrate additive `extends`, bounded material tokens, normalization controls, and typed bindings while leaving the approved V1 inputs unchanged.

M3-S1 adds concept-receipt, analysis-receipt, and analysis-review contracts. They preserve immutable source bindings, separate observations from recommendations, constrain normalized annotations, record human disposition transitions, and block draft mapping while a critical proposal is pending or unresolved.

M5 adds export-manifest `1.2` as the live engine-neutral production manifest. Legacy export-manifest `1.0` and Unity-targeted `1.1` remain accepted only for archival validation of historical evidence.

## Contract files

| Contract | Purpose |
|---|---|
| `schemas/style-spec.schema.json` | Shared art-direction tokens and renderer defaults |
| `schemas/component-spec.schema.json` | Component structure, layers, states, and style binding |
| `schemas/material-pack.schema.json` | Reusable material sources, bindings, normalization, and provenance |
| `schemas/export-manifest.schema.json` | Reproducible engine-neutral asset export, source versions, output hashes, and portable slice/part metadata |
| `schemas/unity-asset-registry.schema.json` | Archived Unity asset IDs, deterministic `.meta` GUIDs, canonical paths, and output hashes |
| `schemas/concept-receipt.schema.json` | Concept file identity, dimensions, generation/source provenance, rights, and usage boundary |
| `schemas/analysis-receipt.schema.json` | Source-annotated observations, recommendations, confidence, criticality, and initial disposition |
| `schemas/analysis-review.schema.json` | Human review transitions, edited values, reviewer identity, and the critical-proposal mapping gate |

## Conventions

- IDs are lower-case kebab-case and stable after approval.
- `version` is a semantic version. Increment it when contract data changes.
- `schemaVersion` identifies the format version; source contracts remain at the M0 `1.0` baseline, live export manifests use engine-neutral `1.2`, and legacy export manifests `1.0`/`1.1` are archival-only.
- `status` moves from `draft` to `reviewed` to `approved`; production export requires approved source specs.
- AI-originated data must retain prompt/settings or an explicit reason why they are unavailable.
- Hashes use lowercase SHA-256 hex values. Paths are repository-relative and use `/`.

## Validation

Run `npm run validate:contracts`. It validates every JSON Schema and every example in `specs/examples/`. The command is part of M0 contract evidence, not a substitute for art/UI approval.

## Compatibility policy

Additive optional fields are backward-compatible within `schemaVersion: 1.0`. Removing, renaming, or changing the meaning of a required field requires a new schema version and a migration note before approval.

### M5 engine-neutral export manifest `1.2`

- The combined export-manifest schema accepts archival `1.0`/`1.1` and live `1.2`; version-specific closed objects prevent fields leaking between versions.
- Version `1.2` requires portable repository-relative paths, hashed source references, output hashes, output role, and optional state, part, and slice metadata.
- Version `1.2` rejects engine import metadata. Use archived `1.0`/`1.1` fixtures only to validate historical evidence.
- See [ADR-015](../docs/decisions/ADR-015-export-manifest-compatibility-policy.md).

### M2-S1 additive extensions

- A style with `extends` is an overlay pinned to an exact parent ID and version; its token maps may be partial, but the resolver requires the merged result to be complete.
- `tokens.material`, material normalization controls, and component `materialBindings` are bounded and typed. Template-specific slot and override allowlists are enforced by the resolver.
- Resolved-style provenance records every ancestor path and SHA-256 hash in parent-to-child order.

### Approved `1.0` provenance correction

On 2026-07-16, the project owner authorized `provenance` as a required export-manifest field. This tightens validation within `schemaVersion: 1.0` to enforce an already-approved non-negotiable traceability rule. All renderer-produced manifests already complied; the incomplete canonical example was the only repository artifact requiring correction, so no production-output migration was necessary.

### M3-S1 analysis contracts

- Concept receipts bind a repository-relative reference image to dimensions, SHA-256, target canvases, rights, and source-specific provenance. AI-generated concepts require the available generation ID, provider, settings, and prompt.
- Analysis proposals keep `observation` and `recommendation` structurally separate. Every proposal requires source-region or verbal evidence; source regions are normalized and bound to the concept hash.
- Review records allow only `pending → accepted/edited/rejected/unresolved` and `unresolved → accepted/edited/rejected`. Accepted, edited, and rejected states are terminal.
- A `ready` mapping gate is invalid while any critical proposal remains `pending` or `unresolved`; semantic validation also requires the blocker list to match those proposals exactly.
