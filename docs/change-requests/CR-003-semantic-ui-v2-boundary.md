# CR-003: Establish the Prism Semantic UI V2 boundary

- Status: Approved
- Date: 2026-08-01
- Classification: Strategic expansion
- Requested by: Project owner through the authorized `Next:` task

## Problem

The existing repository produces deterministic art assets, but an external game
project needs a versioned semantic UI contract, validation, wireframe evidence,
and safe generated-view ownership. Extending the style renderer in place would
carry art-generation and reconstruction assumptions into that workflow.

## Approved change

Create an isolated V2 package family for schema, core validation, wireframes,
CLI orchestration, and an engine-neutral Unity export contract. Make the V2
product boundary active in repository guidance and enforce that V2 packages do
not import legacy implementation code.

## Affected modules

- Active README, architecture, overview, roadmap, and documentation index.
- New private packages under `packages/`.
- A package-boundary policy, validator, and focused tests.

## Cost and displacement

M13 becomes the active implementation milestone. The pending M12-A6z human
delivery decision is preserved and is neither accepted nor rejected by this
change. Legacy asset-generation work remains available but is not the active
architecture for new Prism development.

## Alternatives considered

1. Refactor the legacy renderer into V2. Rejected because style/material and
   milestone coupling would violate the clean semantic-toolchain boundary.
2. Build the toolchain inside the Tic-Tac-Toe repository. Rejected because
   shared schemas and engine adapters belong to Prism, while game-specific data
   must remain game-owned.
3. Delay V2 until M12-A6z. Rejected by the project owner's explicit M13 task
   authorization; the unmade M12 decision remains independently reviewable.

## Mission impact

This changes the active mission for new development from deterministic art
generation to semantic UI compilation. It retains deterministic output,
editable structure, stable IDs, provenance, and review-reference safeguards.

## Acceptance criteria

- ADR-026 records goals, non-goals, ownership, dependency direction, file
  ownership, versioning, and compatibility rules.
- The active README no longer presents art generation as the current mission.
- Five private V2 packages exist with an acyclic declared dependency graph.
- Automated validation rejects legacy dependencies and package-root escapes.
- No semantic component behavior, game-specific data, Unity generation, or
  broad legacy cleanup is added.
