# M13-A2 semantic contracts and stable-ID validation

- Date: 2026-08-01
- Mission: `semantic-ui-v2`
- Schema version: `1.0.0`
- Status: Complete

## Delivered boundary

`@lnh-prism/schema` owns the versioned JSON Schema, stable semantic-ID pattern,
diagnostic version, and the approved component inventory: `screen`,
`safe-area`, `container`, `panel`, `label`, `image`, `button`, `toggle`, `grid`,
`modal`, and `spacer`.

The schema defines project, theme-token, screen, reusable-component, instance,
layout, action, binding, asset-slot, state, and Unity-export-setting contracts.
The Unity settings are data contracts only; this task adds no Unity generation.

`@lnh-prism/core` returns deterministic machine-readable results with source,
contract version, diagnostic version, validity, and sorted diagnostics. This
slice applies the exported JSON Schema and validates schema-version support,
stable-ID syntax and global uniqueness, and the bounded component inventory.

## Fixtures and negative coverage

- `minimal-project.json` is a generic, style-free public-contract fixture.
- `invalid-schema-version.json` proves unsupported versions receive migration guidance.
- `missing-required-contract-field.json` proves the runtime enforces the exported schema.
- `invalid-semantic-id.json` proves malformed stable IDs are rejected.
- `duplicate-semantic-id.json` proves global identity collisions are rejected.
- `unsupported-component-type.json` proves the component inventory remains bounded.

## Validation

- `npm run validate:v2-contracts` — pass; deterministic valid JSON result.
- `npm run test:semantic-contracts` — pass; eight tests, including strict JSON Schema compilation.
- `npm run validate:v2-boundaries` — pass; five isolated packages and five source files.
- `npm run test:v2-boundaries` — pass; fourteen tests.
- `npm run validate:control-drift` — pass; M13-A3 is the next agent-ready task.
- `npm run validate:contracts` — pass.
- `npm run test:renderer` — pass; 56 tests.
- `npm run agent:brief -- --json` — reports `semantic-ui-v2`, M13, and M13-A3.

## Deferred

M13-A3 owns semantic cross-reference, hierarchy, cycle, and per-type behavior
validation. Layout geometry, wireframes, CLI workflows, external-project
resolution, Unity export/generation, game-specific authoritative data, and
broad legacy cleanup remain outside M13-A2.
