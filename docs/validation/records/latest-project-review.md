# Whole-project review — 2026-07-17

## Snapshot

| Field | Value |
|---|---|
| Reviewed revision | `ad59059` (`docs(review): record project weakness assessment`) |
| Review date | 2026-07-17 |
| Working tree at start | Clean |
| Scope | Workflow, status, and plan |
| Validation run | `npm run validate:contracts`; `npm run validate:asset-package` |
| Validation result | Passed: contracts validated including missing-provenance rejection; 62 modular files validated across five components |

Refresh note: Compared with the prior review, no recommendation has been applied and no project code, status, or plan has changed. Findings F-001 through F-005 remain open.

## Current status

- M1/V1, M2/V2, M3/V3, and M4 modular asset delivery are recorded as passed/completed.
- M5-A1 is complete. The overview's current agent-ready task is M5-A2: the Frostbound clean-workspace reproducibility and regression batch.
- The Frostbound package is engine-neutral and validates as 62 modular SVG/PNG files across Panel, Primary Button, Secondary Button, Progress, and Emblem.

## Findings

| ID | Severity | Area | Fact or inference | Evidence | Impact | Recommended solution | Dependencies | Eligibility |
|---|---|---|---|---|---|---|---|---|
| F-001 | P1 | Status | Fact | `docs/PROJECT_OVERVIEW.md` records M4-A1 as complete and `docs/ROADMAP.md` says M4 passed, while the overview's at-a-glance table still marks M4 `🟡`; `docs/modules/06-asset-delivery.md` says M5-A1 is next even though the overview and M5 plan identify M5-A2. | A reader can select the wrong task or misjudge the milestone state. | Align active status/next-task statements with the completed M4 package and current M5-A2 task. | None. | Agent-ready |
| F-002 | P1 | Workflow / status | Fact | ADR-014 removed engine integration from scope, but active Module 05 still defines V4/M4 as a playable Unity flow, names Unity project dependencies, and links deleted M4 Unity documents. ADR-009 also links deleted `modules/06-unity-export.md`. | The source-of-truth set contradicts the delivery boundary and contains broken navigation; future work can reintroduce retired scope. | Replace current-scope Unity workflow/dependency statements with engine-neutral M4 package validation; retain historical events only where clearly marked historical; remove or repair dead links. | R-001 can be completed independently. | Agent-ready |
| F-003 | P1 | Workflow | Fact | `specs/schemas/export-manifest.schema.json` still defines required Unity 1.1 integration/import metadata and Unity asset paths; V1 renderer manifests/types/tests still emit and assert `unity` fields. | Retired engine assumptions remain in the live output contract, increasing maintenance and risking accidental engine-coupled deliverables. | Plan a backward-compatible engine-neutral export-manifest revision and migrate live renderer/tests/examples to it; retain legacy validation only when needed for historic evidence. | Requires an explicit compatibility decision because schema/version behavior changes. | Human decision |
| F-004 | P0 | Plan | Fact | M5-A2 has an explicit plan and acceptance criteria, but no package script implements the required clean-workspace five-run receipt batch. `package.json` has no M5 validation command. | The project cannot yet demonstrate its stated production-hardening exit evidence. | Implement and run M5-A2 exactly as defined in `docs/implementation/M5_PRODUCTION_HARDENING_VALIDATION_PLAN.md`. | None; this is the overview's current task. | Agent-ready |
| F-005 | P2 | Plan | Fact | Module 07 and the M5 plan defer migration/rollback, backup/recovery, release procedures, and multi-style coverage, but the overview task board has no later M5 tasks or decision that schedules them. | M5's post-A2 boundary is not yet executable; it could be prematurely considered complete. | Decide the required M5 exit scope after M5-A2 evidence, then create separately bounded follow-on tasks for the accepted slices. | M5-A2 evidence and project-owner scope decision. | Blocked |

## Recommended tasks

Recommendations are ordered by urgency and dependency. Apply only one `Agent-ready` task per `Apply Review:` run.

### R-001 — Align active M4/M5 status statements

- **Priority / eligibility:** P1 — Agent-ready
- **Scope:** Correct the M4 state in the overview at-a-glance table and the stale next-task statement in Module 06. Do not change historical review scores or task-board ownership.
- **Acceptance criteria:** All active overview, roadmap, and Module 06 statements agree that M4 modular delivery is complete and M5-A2 is next; no Unity scope is added.
- **Validation:** Inspect the affected tables/text; run `git diff --check`.

### R-002 — Remove retired Unity workflow references from active governance

- **Priority / eligibility:** P1 — Agent-ready
- **Scope:** Update Module 05 and ADR-009 to reflect ADR-014's engine-neutral delivery boundary, remove dead Unity-module references, and preserve historical change-log facts without presenting them as current requirements. Update directly affected active acceptance/reference language only when it creates a current Unity requirement.
- **Acceptance criteria:** No active module, decision, or validation guidance requires an engine project, Unity importer, runtime flow, or deleted Unity document; historic records remain auditable.
- **Validation:** Repository link/reference scan and `git diff --check`; run relevant contract/package checks if any contract guidance changes.

### R-003 — Implement and run M5-A2 reproducibility/regression batch

- **Priority / eligibility:** P0 — Agent-ready (existing overview task)
- **Scope:** Implement the one local engine-neutral M5 command and receipt described in `docs/implementation/M5_PRODUCTION_HARDENING_VALIDATION_PLAN.md`; do not include deferred recovery, migration, release, or multi-style work.
- **Acceptance criteria:** Clean-workspace assembly, strict byte receipts, five-run timing, environment/package metrics, full state/part matrix, and four readability views are recorded and pass the plan's gates.
- **Validation:** Run the new M5 command and its focused regression checks.

### R-004 — Decide export-manifest compatibility migration

- **Priority / eligibility:** P1 — Human decision
- **Decision:** Choose whether legacy Unity `1.0`/`1.1` manifest validation remains as archival compatibility or is formally deprecated in favor of a new engine-neutral manifest version.
- **Options:** Preserve legacy schemas as historical-only compatibility; or introduce a versioned engine-neutral successor with documented migration/deprecation.
- **Acceptance criteria:** An approved compatibility policy identifies the supported manifest versions, migration path, and evidence-retention rule.

### R-005 — Define post-A2 M5 hardening slices

- **Priority / eligibility:** P2 — Blocked on R-003 and R-004
- **Scope:** After M5-A2 results and the compatibility policy are available, split the remaining migration/rollback, backup/recovery, release procedure, and multi-style coverage work into separate tasks with owners and exit criteria.
- **Acceptance criteria:** The overview task board and M5 plan have explicit, ordered follow-on slices; no deferred area is implicitly counted as complete.

## Review conclusion

The asset package and current contracts are healthy, but the project control layer has two immediate scope/status inconsistencies left by the engine-scope retirement. M5-A2 remains the primary delivery task; the export-manifest migration needs a project-owner compatibility decision before any contract-breaking cleanup.
