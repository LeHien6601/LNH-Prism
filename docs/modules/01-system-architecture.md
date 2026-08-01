# Module 01 — Semantic UI V2 architecture and contracts

## Goal

Define the deterministic system that compiles game-owned semantic UI
specifications into validated wireframe evidence and engine-specific generated
views without generating production artwork.

## Scope

This module owns V2 package boundaries, schema and semantic-ID versioning,
normalization, validation diagnostics, wireframe contracts, CLI orchestration,
engine-neutral Unity export contracts, generated-file ownership, and
compatibility rules.

It excludes game-specific product data, screenshot-to-layout inference,
production art generation, a general editor, Unity generation in M13-A1, and
broad legacy cleanup.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Game-owned project, theme, screen, component, action, binding, asset-slot, and export specifications | Structured diagnostics, deterministic wireframe evidence, normalized manifests, and engine-specific generated inputs |

Written typed specifications are authoritative. Reference images may support
human review but cannot define behavior or become production pixels.

## Architecture

```text
Game documents -> game-owned semantic specifications -> Prism CLI
                                                       |-> core -> schema
                                                       |-> wireframe -> core/schema
                                                       `-> Unity contract -> core/schema

future Unity adapter -> com.lnhgames.ui + generated Unity contract
```

The allowed package graph is declared in
`packages/prism-v2-boundaries.json`. `npm run validate:v2-boundaries` rejects
undeclared internal edges, cycles, imports that escape a package, and legacy
root or Production Lab dependencies.

## Ownership

Prism owns public contracts and compiler behavior. Game repositories own all
product specifications, assets, generated engine output, and authored gameplay
or presentation code. Prism may replace only a declared generated subtree;
authored files remain outside that boundary.

## Versioning and compatibility

- Packages and schemas are versioned independently.
- External projects pin tool, schema, export-contract, and adapter versions.
- Stable semantic IDs are compatibility surfaces.
- Incompatible schemas require a major version and migration guidance.
- Unsupported versions fail with diagnostics rather than implicit coercion.
- Identical pinned inputs produce equivalent normalized output.

The complete policy is [ADR-026](../decisions/ADR-026-semantic-ui-v2-boundary.md).

## Initial implementation sequence

1. M13-A1: establish product and package boundaries with enforcement.
2. M13-A2: implement the smallest versioned semantic schema and stable-ID
   validation slice.
3. Later bounded tasks: core diagnostics, deterministic wireframes, CLI
   commands, external-project resolution, Unity export contract, and adapter.

## Legacy boundary

The root renderer, materials, asset packages, showcase, milestone evidence, and
Production Lab remain auditable V1-era systems. V2 cannot import them. A small
source-neutral utility may be extracted later only behind a V2-owned contract
and focused compatibility tests.

## Acceptance criteria

- Acyclic package dependencies match the declared graph.
- V2 source cannot import legacy repository implementation paths.
- Game-specific authoritative data does not enter Prism packages.
- Generated and authored ownership remains explicit.
- Schema and behavioral capability is added only through bounded validated
  tasks.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial deterministic asset architecture created | Codex |
| 2026-08-01 | Replaced the active architecture with the approved semantic UI V2 boundary while retaining legacy history | Project owner / Codex |
