# Whole-project weakness review — 2026-07-19

## Snapshot

| Field | Value |
|---|---|
| Reviewed revision | `d6b8a8e` (`docs(reference): define enchanted forest contrast gate`) |
| Review date | 2026-07-19 |
| Working tree at start | Dirty: unrelated `docs/implementation/PRODUCTION_FIDELITY_AND_MULTI_STYLE_EXPANSION_PLAN.md` modification and untracked `new-plan.md`; neither was inspected as review evidence or changed. |
| Scope | Workflow, status, plan, renderer/composition architecture, validation/reproducibility, provenance/reference handling, and M11 readiness across the committed M0–M11 controls. |
| Validation run | `npm run validate:contracts`; `node --test tests/renderer/m10-style-transfer.test.mjs`; `npm run validate:m10-r002-package`; `npm run test:m10-reference-boundary`; `git diff --check`. |
| Validation result | All commands passed. The M10 package has 26 matrix entries, 52 validated modules, named seed/zero-baseline receipts, a clean-workspace receipt, and 318 production SVG/PNG files clear of the Forge review reference. These checks do not validate a future Enchanted Forest package. |

## Current status

- M1–M10 are passed. V10 is recorded at `86/100`, and M5-B1 cross-style hardening has passed for Volcanic Forge.
- M11 passed its definition gate: R-016c Option A approved the rules/rubric with an observable target-phone readability threshold. R-020 is the next Agent-ready planning task; renderer and package work remain unauthorized.
- The prior review record was stale because it still reported a failed/open M10 and recommended work that later commits completed. This review supersedes it without rewriting the historical V10 review record.

## Findings

| ID | Severity | Area | Fact or inference | Evidence | Impact | Recommended solution | Dependencies | Eligibility |
|---|---|---|---|---|---|---|---|---|
| F-020 | P0 | Plan / governance | Resolved fact | R-016c Option A approved the M11 definition/rubric through ADR-025, retaining the seven-component/no-reference-pixel/no-style-fork boundary and adding an observable target-phone readability rule. | The definition gate no longer blocks planning; direct renderer/package work remains intentionally deferred. | R-020: plan bounded implementation/evidence slices before implementation. | None. | Agent-ready. |
| F-021 | P1 | Validation / provenance | Resolved fact | `review-reference-boundary.mjs` validates registered review-only references, while focused tests inject filename, hash, identical-raster, direct-link, and `<image>` leaks for Forge and Enchanted Forest. | The generated-reference policy now protects both reviewed styles before M11 production work. | Preserve this validator in M11-A4 package preflight. | None. | Complete. |
| F-022 | P1 | Architecture / regression | Resolved fact | `src/styles/m11-enchanted-forest-binding.ts`, its focused renderer test, and contract validation now exercise Enchanted Forest through the existing shared composition seam with stable IDs, seed behavior, and approved bounds. | The third binding no longer requires an M11 adapter or geometry exception. | Preserve this proof while rendering the M11 matrix. | R-016c approval and R-018 boundary contract. | Complete. |
| F-023 | P1 | Workflow / status | Resolved fact | `validate:control-drift` verifies active-task/task-board/roadmap alignment and that every review-only reference receipt has a real decision, raster, and documentation link. Focused fixtures reject stale task alignment and an undocumented reference. | The previously manual drift patterns now fail with actionable errors. | Run the validator in future control/gate work. | None. | Complete. |
| F-024 | P2 | Definition quality | Resolved fact | ADR-025 requires semantic labels/progress values, no overlap or obscuration at target-phone scale, and at least `3/5` for Mobile-scale readability and state distinction. | The previously ambiguous readability threshold is now consistent and observable. | Preserve the approved rule in R-020 slice planning and later review evidence. | None. | Complete. |
| F-025 | P2 | Plan / evidence | Resolved inference | R-020 added the ordered M11 implementation/evidence plan, assigning every rubric hard-gate surface to exactly one contracts/materials, rendering/matrix, package/evidence, or review slice. | Future work now has bounded ownership and validation targets. | Start R-018 / M11-A1; preserve the ordered dependencies. | None. | Complete. |

## Ordered recommended tasks

### R-016c — Review and approve Enchanted Forest third-style definition and rubric

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Option A approved the definition/rubric through ADR-025. Required labels and progress values are semantic text, unobscured at target-phone scale, and the later Mobile-scale readability and state distinction score must be at least `3/5`.
- **Validation:** The decision record, approved definition, approved rubric, and next permitted R-020 task are cross-linked; no production renderer/package changes occurred.

### R-017 — Add lightweight control-drift detection

- **Priority / eligibility:** P1 — Complete.
- **Outcome:** Added `validate:control-drift` plus focused negative fixtures. It verifies overview next-task/task-board/roadmap alignment and review-only reference receipt decision/raster/documentation links.
- **Validation:** `npm run test:control-drift`; `npm run validate:control-drift`; `git diff --check`.

### R-018 / M11-A1 — Generalize the review-reference production boundary

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Added a registered-reference validator and retained the Forge compatibility wrapper. Focused tests reject filename, SHA-256, identical raster, direct SVG link, and `<image>` leaks for Forge and Enchanted Forest.
- **Validation:** Both boundary suites and `validate:m10-r002-package` passed with 318 production SVG/PNG files clear.

### R-019 / M11-A2 — Prove Enchanted Forest shared-composition binding

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Added source-neutral Enchanted Forest style, material, variation, ornament, focal, typography, lighting, state, and component binding registries through the existing composition seam. The focused proof covers shared geometry, independent editable layers, approved budgets, and named same/different/zero seed behavior without an M11 renderer/template branch.
- **Validation:** `npm run build:renderer`; `npm run validate:contracts`; `node --test tests/renderer/m11-enchanted-forest-binding.test.mjs`; `npm run test:review-reference-boundary`; and `npm run validate:control-drift` passed.

### M11-A3 — Render Enchanted Forest matrix and review surfaces

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Rendered 26 shared-template matrix entries, a `1080 × 1920` target-phone portrait, editable material and focal/ornament isolate surfaces, and labeled source/phone/thumbnail/reference comparison surfaces.
- **Validation:** `npm run prepare:m11-a3-evidence`; `npm run validate:m11-a3-evidence`; focused M11 rendering test; contracts; review-reference boundary; control-drift; and target-phone visual inspection passed.

### M11-A4 — Package Enchanted Forest modules and technical preflight

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Produced 52 engine-neutral M11 modules plus manifest/provenance, four named variation seed receipts including zero baseline, clean-workspace byte comparison, generalized-seam proof, review-reference boundary proof, and unscored technical preflight.
- **Validation:** `npm run prepare:m11-a4-package`; `npm run validate:m11-a4-package`; M11-A3 evidence validation; contracts; review-reference boundary; and control-drift passed.

### M11-A5 / V11 — Conduct the Enchanted Forest third-style review

- **Priority / eligibility:** P0 — Complete — failed.
- **Outcome:** Project-owner-authorized automated review passed every technical hard gate but scored `41/100` visually. `V11-B001` found a palette-only Frostbound material grammar, and Four visual dimensions fell below the `3/5` minimum.
- **Validation:** [V11 review record](v11-enchanted-forest-third-style-review.md) records hard gates, inspected surfaces, weighted scores, blocker, and fail decision.

### M11-R001 — Remediate Enchanted Forest material-language contrast

- **Priority / eligibility:** P0 — Agent-ready; this is the active overview task and next recommended task.
- **Scope:** Replace inherited Frostbound material grammar with deterministic visible stone, wood, moss, and botanical treatments through the existing shared composition seam.
- **Acceptance criteria:** Source, phone, and thumbnail surfaces clearly establish a third family rather than a recolor while preserving approved bounds, semantic text, geometry, stable IDs, module boundaries, seeds, and reference boundary.
- **Validation:** Focused renderer/material tests, regenerated matrix/portrait/isolates/package receipts, technical preflight, reference-boundary, and control-drift checks.

### R-020 — Plan bounded M11 implementation and evidence slices

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** [M11 implementation/evidence plan](../../implementation/M11_ENCHANTED_FOREST_IMPLEMENTATION_PLAN.md) assigns every V11 hard-gate surface to one bounded slice and sets R-018 / M11-A1 as the next action.
- **Validation:** Cross-link and dependency scan against the approved definition/rubric and `git diff --check` passed.

### R-018 / M11-A1 — Generalize Enchanted Forest review-reference boundary validation

- **Priority / eligibility:** P0 — Agent-ready; this is the active overview task and next recommended task.
- **Scope:** Parameterize review-reference production-boundary validation and register Enchanted Forest with negative coverage before any renderer or material work.
- **Acceptance criteria:** Forge regression coverage remains green; Enchanted Forest filename, SHA-256 match, identical raster, direct SVG link, and raster `<image>` leaks fail deterministically.
- **Validation:** Focused negative tests for both references, existing M10 package validation, and a current production-file-count receipt.

## Review conclusion

The project’s baseline and two-style claims are now supported by passing contracts, deterministic M10 receipts, shared-composition evidence, review-only reference protection, and cross-style hardening. M11’s definition gate is approved, including an observable readability threshold. The credible remaining weakness is implementation readiness: first plan bounded slices, then extend the reference-boundary and regression controls to a third style before package work.
