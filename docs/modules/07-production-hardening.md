# Module 07 — Production Hardening

## Goal

Make output reproducible, testable, performant, and safe to evolve across many assets and styles.

**Status:** M5-A2 reproducibility/regression batch complete; export-manifest `1.2` is the live engine-neutral manifest; post-A2 hardening slices M5-A3 through M5-A6 are defined.

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

M5 V5: rebuild one feature’s entire UI asset set in a clean workspace from versioned specs and compare it to approved output.

## Current M5 plan

The versioned [M5 production-hardening validation plan](../implementation/M5_PRODUCTION_HARDENING_VALIDATION_PLAN.md) fixes Frostbound Reward as the first release-like target. M5-A2 passed with the 62-file, 436,565-byte package baseline, clean-workspace reproduction, strict receipts, five-run performance measurement, state/part matrix verification, and four target-scale readability views. The receipt is `docs/validation/evidence/m5-production-hardening/M5-A2-reproducibility-receipt.json`.

ADR-015 approves the compatibility policy for export manifests: legacy `1.0`/`1.1` manifests remain archival-only for historical evidence, while live production output uses engine-neutral export-manifest `1.2`.

The remaining M5 hardening work is split in the M5 plan: M5-A3 migration/rollback drill, M5-A4 backup/recovery drill, M5-A5 release operating procedure, and M5-A6 multi-style coverage decision.

## Risks

- Golden tests become noisy across platforms: standardize render environment and maintain justified tolerances.
- Test maintenance consumes too much time: prioritize high-use templates and known failure modes.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
| 2026-07-17 | Defined M5-A1 Frostbound production-hardening batch, baseline receipt, reproducibility contract, regression policy, and M5-A2 exit conditions | Codex |
| 2026-07-17 | Completed M5-A2 reproducibility/regression validation with a passing receipt and four target-scale readability views | Codex |
| 2026-07-17 | Accepted ADR-015 export-manifest compatibility policy and queued the engine-neutral manifest successor | Project owner / Codex |
| 2026-07-17 | Implemented export-manifest `1.2` for live engine-neutral output while preserving archival legacy validation | Codex |
| 2026-07-18 | Split the remaining post-A2 M5 hardening work into M5-A3 through M5-A6 | Codex |
