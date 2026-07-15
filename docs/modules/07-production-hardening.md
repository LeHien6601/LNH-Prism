# Module 07 — Production Hardening

## Goal

Make output reproducible, testable, performant, and safe to evolve across many assets and styles.

## Scope

Schema validation, golden renders, visual diffs, deterministic builds, performance budgets, migrations, backups, access/logging policy, and release procedures.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Versioned source specs, renderer build, test baselines, performance budgets | Test reports, release candidate, compatibility/migration notes, recovery evidence |

## Implementation steps

1. Validate schemas and dependency graphs before render.
2. Add deterministic unit tests for token resolution and state recipes.
3. Create approved golden renders and visual-diff thresholds per template.
4. Set budgets for render time, exported asset size, texture memory, and mobile readability.
5. Define renderer/schema compatibility and migrations.
6. Run clean-workspace reproduction and export recovery drills.
7. Publish operating procedures for review, release, rollback, and incident handling.

## Dependencies

M1–M4 working outputs, Module 05 evidence, release environment.

## Acceptance criteria

- Reproducing an asset from pinned inputs produces an approved match.
- Regressions are detected before release.
- Performance and size budgets are measured, not assumed.
- A migration/rollback procedure has been tested.

## Validation task

M5 V5: rebuild one feature’s entire UI asset set in a clean workspace from versioned specs, import it into Unity, and compare it to approved output.

## Risks

- Golden tests become noisy across platforms: standardize render environment and maintain justified tolerances.
- Test maintenance consumes too much time: prioritize high-use templates and known failure modes.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
