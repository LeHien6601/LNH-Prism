# Whole-project weakness review — 2026-07-19

## Snapshot

| Field | Value |
|---|---|
| Reviewed revision | `8ceeea0` (`docs(review): record v11 material-depth failure`) |
| Review date | 2026-07-19 |
| Working tree at start | Dirty: unrelated `docs/implementation/PRODUCTION_FIDELITY_AND_MULTI_STYLE_EXPANSION_PLAN.md` modification and untracked `new-plan.md`; neither was inspected as evidence or changed. |
| Publication state | `main` is five commits ahead of `origin/main`; external publication was not authorized. |
| Scope | Workflow, status, plan, M11 rendering/evidence, validation, reference boundary, and delivery controls. |
| Validation run | `validate:m11-a4-package`; `validate:m11-a3-evidence`; `validate:control-drift`; default `review-reference-boundary` test; Git history/status and document cross-links. |
| Validation result | All commands in this review run passed: 26 M11 entries, 52 modules, clean-workspace/provenance/seed/seam receipts, 370 production files clear of review-reference pixels, and active-task control drift alignment. |

## Current status

- M1–M10 are passed. M11 remains open after V11 scores of `41/100`, `54/100`, and `54/100` across the initial review and two re-reviews.
- M11-R005 is the only unblocked Agent-ready task. Its scope is bounded to visible material-face/isolate depth while retaining shared geometry, IDs, semantic text, deterministic seeds, and the production/reference boundary.
- The V11 technical hard gate is healthy. The active failure is visual: Organic material separation is still `2/5`; material isolates show flat swatches, lines, and dots rather than independently legible weathered stone, wood grain, and moss growth.

## Findings

| ID | Severity | Area | Fact or inference | Evidence | Impact | Recommended solution | Dependencies | Eligibility |
|---|---|---|---|---|---|---|---|---|
| F-030 | P0 | Plan / quality | Fact | V11 records `41/100`, then `54/100` twice; M11-R004 identifies flat component faces and isolates as `V11-B003`. The rubric requires at least three independently legible material families. | Repeated re-reviews consume a gate cycle without raising the failed visual minimum. | R-030: complete M11-R005 with face-integrated material channels and isolate evidence derived from those actual layers, then re-review once. | Existing M11-R005 scope and passing technical receipts. | Agent-ready. |
| F-031 | P1 | Workflow / validation | Fact plus inference | `review-reference-boundary.test.mjs` runs a baseline scan concurrently with two tests that write temporary leak fixtures into the scanned `assets` tree. A prior default-concurrency run in this review cycle reported leaks; the later run passed, consistent with a fixture race. | A nondeterministic boundary result can block reviews or falsely imply a production-reference leak. | R-031: make the suite concurrency-safe by serializing mutation cases or isolating each fixture set from the baseline scan; prove repeated default runs pass. | None. | Agent-ready. |
| F-032 | P1 | Delivery / governance | Fact | `main...origin/main [ahead 5]`; repository instructions require a push after mutating tasks, while current external-remote authorization is absent. | Five completed M11 commits are not yet published, so delivery is incomplete under the repository workflow. | R-032: explicitly approve publication to the configured `origin/main`, or record a durable exception/change to the delivery rule. | Project-owner authority for an external push. | Human decision. |
| F-033 | P2 | Status / documentation | Fact | `docs/README.md` still names the historical M3-S5 evidence task, while the source-of-truth overview names M11-R005. | Readers who enter through the README receive an incorrect handoff. | R-033: update README status/next-task text to link to the overview rather than duplicate a mutable task label. | None. | Agent-ready. |

## Ordered recommended tasks

### R-030 — Complete M11-R005 material-face and isolate depth

- **Priority / eligibility:** P0 — Agent-ready.
- **Scope:** Integrate deterministic weathered-stone texture, directional dark-wood grain, moss growth/masking, and visible focal roots into the rendered component faces. Generate material/focal isolates from those same layers rather than standalone representative swatches.
- **Acceptance criteria:** At source, phone, thumbnail, and isolate distances, stone, wood, moss, and living-light/root channels are independently legible; the M11 shared seam, stable IDs, semantic text, seeds, module boundaries, and review-reference boundary remain unchanged.
- **Validation:** Focused renderer/material assertions; regenerated matrix, portrait, isolates, package, seed/provenance/clean-workspace receipts; technical preflight; boundary and control-drift checks; one subsequent V11 review.

### R-031 — Make review-reference boundary fixtures concurrency-safe

- **Priority / eligibility:** P1 — Agent-ready.
- **Scope:** Remove shared mutable fixture overlap in `review-reference-boundary.test.mjs` without weakening filename, hash, identical-raster, direct-link, or SVG-image rejection coverage.
- **Acceptance criteria:** The default test command is deterministic across repeated runs; the baseline scan cannot observe another subtest's temporary fixture; every existing negative leak form remains covered.
- **Validation:** Run the focused boundary suite repeatedly with default concurrency and run the package boundary preflight.

### R-032 — Decide publication of completed M11 commits

- **Priority / eligibility:** P1 — Human decision.
- **Scope:** Approve pushing the current `main` branch to its configured upstream, or approve an explicit exception to the repository's normal push requirement.
- **Acceptance criteria:** The project has an unambiguous publication decision; no force-push, rebase, or unrelated working-tree change is involved.
- **Validation:** If approved, inspect upstream/ahead state and push; otherwise record the accepted exception in the governing workflow.

### R-033 — Reconcile README handoff with the control page

- **Priority / eligibility:** P2 — Agent-ready.
- **Scope:** Replace the stale README next-task statement with a durable pointer to `PROJECT_OVERVIEW.md` or current M11-R005 status.
- **Acceptance criteria:** README no longer claims M3-S5 is next and cannot silently drift from the source-of-truth control page.
- **Validation:** Text/link check and `git diff --check`.

## Review conclusion

The deterministic technical system is healthy: package, provenance, seed, shared-seam, and reference-boundary controls all pass. The project is blocked by a bounded visual-quality issue, not architecture. Complete R-030 before another V11 review; R-031 should follow to eliminate the observed flaky boundary-test risk. Publication and README drift are separate delivery/status controls and should not expand M11 rendering scope.
