# Whole-project review — 2026-07-17

## Snapshot

| Field | Value |
|---|---|
| Reviewed revision | `ad59059` (`docs(review): record project weakness assessment`) |
| Review date | 2026-07-17 |
| Working tree at start | Clean |
| Scope | Workflow, status, and plan |
| Validation run | `npm run validate:contracts`; `npm run validate:asset-package`; `git diff --check` |
| Validation result | Passed: contracts validated including missing-provenance and live `1.2` engine-metadata rejection; 62 modular files validated across five components; no whitespace errors |

Refresh note: R-001, R-002, R-003, R-004, R-005, and R-006 have been resolved. R-005 split the remaining post-A2 M5 hardening work into M5-A3 through M5-A6.

## Current status

- M1/V1, M2/V2, M3/V3, and M4 modular asset delivery are recorded as passed/completed.
- M5-A1 and M5-A2 are complete. R-002, R-004, R-005, and R-006 are complete. The next item is the Agent-ready task M5-A3: implement manifest migration and rollback drill.
- The Frostbound package is engine-neutral and validates as 62 modular SVG/PNG files across Panel, Primary Button, Secondary Button, Progress, and Emblem.

## Findings

| ID | Severity | Area | Fact or inference | Evidence | Impact | Recommended solution | Dependencies | Eligibility |
|---|---|---|---|---|---|---|---|---|
| F-001 | P1 | Status | Fact | Resolved by R-001: active overview and Module 06 now identify M4 as passed and M5-A2 as next. | Previously caused status/task-selection ambiguity; no longer present in active statements. | Completed: align active status/next-task statements with the completed M4 package and current M5-A2 task. | None. | Complete |
| F-002 | P1 | Workflow / status | Fact | Resolved by R-002: active Module 05 and ADR-009 now state the engine-neutral M4 boundary; dead Unity-module navigation is removed; remaining Unity mentions are historical change-log entries. | Previously contradicted ADR-014 and could reintroduce retired scope; no longer present in active guidance. | Completed: replace current-scope Unity workflow/dependency statements with engine-neutral M4 package validation and repair dead links. | R-001 complete. | Complete |
| F-003 | P1 | Workflow | Fact | Resolved by R-006: export-manifest `1.2` is the live engine-neutral branch; canonical examples and V1 renderer manifests emit `1.2`; contract tests reject engine import metadata in `1.2`; legacy `1.0` validation is preserved under `specs/examples/archive/`. | Previously risked accidental engine-coupled deliverables; no longer present in live renderer output. | Completed: implement a backward-compatible engine-neutral export-manifest revision and migrate live renderer/tests/examples to it. | None. | Complete |
| F-004 | P0 | Plan | Fact | Resolved by R-003: the M5 command and passing receipt now exist at `docs/validation/evidence/m5-production-hardening/M5-A2-reproducibility-receipt.json`; `package.json` exposes `validate:m5-production-hardening`. | The stated M5-A2 production-hardening evidence is now demonstrated. | Completed: implement and run M5-A2 exactly as defined in the validation plan. | None. | Complete |
| F-005 | P2 | Plan | Fact | Resolved by R-005: the M5 plan now defines M5-A3 migration/rollback, M5-A4 backup/recovery, M5-A5 release procedure, and M5-A6 multi-style coverage decision, each with owner, execution status, and exit condition. | Previously made M5's remaining hardening boundary ambiguous; the follow-on work is now explicitly ordered. | Completed: split the remaining rollback, backup/recovery, release procedure, and multi-style coverage work into separate tasks. | None. | Complete |

## Recommended tasks

Recommendations are ordered by urgency and dependency. Apply only one `Agent-ready` task per `Apply Review:` run.

### R-001 — Align active M4/M5 status statements — Complete

- **Priority / eligibility:** P1 — Complete
- **Scope:** Correct the M4 state in the overview at-a-glance table and the stale next-task statement in Module 06. Do not change historical review scores or task-board ownership.
- **Acceptance criteria:** All active overview, roadmap, and Module 06 statements agree that M4 modular delivery is complete and M5-A2 is next; no Unity scope is added.
- **Validation:** Inspect the affected tables/text; run `git diff --check`.

Applied in this run: M4 is now green/passed in the overview at-a-glance table, and Module 06 names M5-A2 as the next agent-ready task.

### R-002 — Remove retired Unity workflow references from active governance — Complete

- **Priority / eligibility:** P1 — Complete
- **Scope:** Update Module 05 and ADR-009 to reflect ADR-014's engine-neutral delivery boundary, remove dead Unity-module references, and preserve historical change-log facts without presenting them as current requirements. Update directly affected active acceptance/reference language only when it creates a current Unity requirement.
- **Acceptance criteria:** No active module, decision, or validation guidance requires an engine project, Unity importer, runtime flow, or deleted Unity document; historic records remain auditable.
- **Validation:** Repository link/reference scan and `git diff --check`; run relevant contract/package checks if any contract guidance changes.

Applied in this run: active Module 05 and ADR-009 guidance now follows ADR-014; only historical Unity entries remain, and the deleted Unity-module link is gone.

### R-003 — Implement and run M5-A2 reproducibility/regression batch — Complete

- **Priority / eligibility:** P0 — Complete
- **Scope:** Implement the one local engine-neutral M5 command and receipt described in `docs/implementation/M5_PRODUCTION_HARDENING_VALIDATION_PLAN.md`; do not include deferred recovery, migration, release, or multi-style work.
- **Acceptance criteria:** Clean-workspace assembly, strict byte receipts, five-run timing, environment/package metrics, full state/part matrix, and four readability views are recorded and pass the plan's gates.
- **Validation:** Run the new M5 command and its focused regression checks.

Applied in this run: `npm run validate:m5-production-hardening` passed with 62 modules, five byte-identical runs, a 453.799 ms median, a 530.237 ms p95, a complete matrix, and four readability views.

### R-004 — Decide export-manifest compatibility migration — Complete

- **Priority / eligibility:** P1 — Complete
- **Decision:** Option A approved on 2026-07-17: legacy Unity-shaped `1.0`/`1.1` manifest validation remains archival-only, and live production output moves to a versioned engine-neutral successor.
- **Acceptance criteria:** An approved compatibility policy identifies the supported manifest versions, migration path, and evidence-retention rule.

Applied in this run: ADR-015 records the archival legacy policy and queues live output migration to an engine-neutral successor.

### R-006 — Implement engine-neutral export-manifest successor — Complete

- **Priority / eligibility:** P1 — Complete
- **Scope:** Add the approved engine-neutral export-manifest successor while preserving archival validation for legacy `1.0`/`1.1` evidence. Migrate live renderer manifest types, canonical examples, focused tests, and validation docs to make the successor the current production-output target.
- **Acceptance criteria:** Live examples/tests no longer require engine import metadata; legacy fixtures remain explicitly archival; contract validation distinguishes archival compatibility from current production output; no engine integration scope is introduced.
- **Validation:** Run contract validation and focused renderer/export manifest tests; run `git diff --check`.

Applied in this run: export-manifest `1.2` is the live engine-neutral schema branch; V1 renderer proof manifests emit `1.2`; canonical examples and tests reject engine import metadata; archived legacy validation remains covered.

### R-005 — Define post-A2 M5 hardening slices — Complete

- **Priority / eligibility:** P2 — Complete
- **Scope:** Split the remaining migration/rollback, backup/recovery, release procedure, and multi-style coverage work into separate tasks with owners and exit criteria.
- **Acceptance criteria:** The overview task board and M5 plan have explicit, ordered follow-on slices; no deferred area is implicitly counted as complete.

Applied in this run: M5-A3 through M5-A6 are recorded in the M5 plan and overview with owners, execution status, dependencies, and exit conditions.

### R-007 — Implement manifest migration and rollback drill (M5-A3)

- **Priority / eligibility:** P1 — Agent-ready
- **Scope:** Implement the M5-A3 drill defined in the M5 plan. Prove live `1.2` manifest handling, archived legacy evidence retention, rollback/failure reporting, and unchanged approved package bytes.
- **Acceptance criteria:** A migration/rollback receipt is recorded under `docs/validation/evidence/m5-production-hardening/`; missing provenance/output hashes/archive rules fail clearly; approved package bytes remain unchanged.
- **Validation:** Run the new drill plus `npm run validate:contracts`, `npm run validate:asset-package`, and `git diff --check`.

### R-008 — Implement package backup and recovery drill (M5-A4)

- **Priority / eligibility:** P2 — Blocked on R-007
- **Scope:** Restore or rebuild the Frostbound package from pinned inputs and receipts, then verify byte equality against the approved manifest.
- **Acceptance criteria:** Recovery evidence records source set, destination, environment, timing, defects, and path/byte/SHA equality.

### R-009 — Draft release operating procedure and exception policy (M5-A5)

- **Priority / eligibility:** P2 — Blocked on R-008
- **Scope:** Define the release checklist, validation commands, evidence paths, owner sign-off, regression exception policy, rollback decision points, and handoff artifacts.
- **Acceptance criteria:** Procedure is usable for an engine-neutral asset package release and references completed hardening evidence.

### R-010 — Decide multi-style hardening coverage (M5-A6)

- **Priority / eligibility:** P2 — Human decision
- **Decision:** Choose whether the Frostbound package is sufficient for M5 exit or whether another style/package must run through M5 hardening.
- **Acceptance criteria:** Approved decision records either the additional target and next agent-ready task, or the rationale for deferring extra coverage.

## Review conclusion

The asset package and M5-A2 validation are healthy. R-001 resolved the M4/M5 status inconsistency, R-002 closed the active Unity-governance drift, R-003 closed the reproducibility batch, R-004 selected archival legacy validation plus a live engine-neutral successor, R-006 implemented that successor, and R-005 split the remaining M5 work into ordered slices. The next recommended task is R-007/M5-A3: implement the manifest migration and rollback drill.
