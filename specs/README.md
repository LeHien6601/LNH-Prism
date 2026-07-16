# LNH Prism Specifications

These are versioned, portable M0 contracts. They use JSON Schema Draft 2020-12 and describe source data—not generated output.

The Neon Core V1 examples are approved validation inputs. Generated V1 manifests bind their IDs and versions to repository paths and SHA-256 hashes; generation fails if an approved input or declared material source drifts.

## Contract files

| Contract | Purpose |
|---|---|
| `schemas/style-spec.schema.json` | Shared art-direction tokens and renderer defaults |
| `schemas/component-spec.schema.json` | Component structure, layers, states, and style binding |
| `schemas/material-pack.schema.json` | Reusable material sources, bindings, normalization, and provenance |
| `schemas/export-manifest.schema.json` | Reproducible asset export, source versions, and Unity metadata |

## Conventions

- IDs are lower-case kebab-case and stable after approval.
- `version` is a semantic version. Increment it when contract data changes.
- `schemaVersion` identifies the format version; this M0 baseline is `1.0`.
- `status` moves from `draft` to `reviewed` to `approved`; production export requires approved source specs.
- AI-originated data must retain prompt/settings or an explicit reason why they are unavailable.
- Hashes use lowercase SHA-256 hex values. Paths are repository-relative and use `/`.

## Validation

Run `npm run validate:contracts`. It validates every JSON Schema and every example in `specs/examples/`. The command is part of M0 contract evidence, not a substitute for art/UI approval.

## Compatibility policy

Additive optional fields are backward-compatible within `schemaVersion: 1.0`. Removing, renaming, or changing the meaning of a required field requires a new schema version and a migration note before approval.
