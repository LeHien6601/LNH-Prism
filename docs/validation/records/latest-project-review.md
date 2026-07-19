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
| F-021 | P1 | Validation / provenance | Fact | `scripts/m10-reference-boundary.mjs` reads only the Forge receipt and `tests/validation/m10-reference-boundary.test.mjs` injects only a Forge leak. M11 requires an automated Enchanted Forest filename/hash/identical-raster/direct-link boundary scan. | The mandatory generated-reference policy is proven for one past style but cannot yet protect M11 production outputs. | R-018: add a parameterized review-reference boundary validator and negative tests, then register the Enchanted Forest receipt through it before package review. | R-016c approval; actual M11 source/output paths. | Agent-ready after R-016c. |
| F-022 | P1 | Architecture / regression | Fact | `src/renderer/style-composition.ts` is style-neutral in interface, but its implementation delegates to M8 renderers and the focused test exercises only `M10_VOLCANIC_FORGE_BINDING`. The M11 definition requires the same seam without a style fork. | A third binding could silently require an M11 adapter or geometry exception, undermining the multi-style claim. | R-019: add Enchanted Forest binding/contract coverage that proves shared geometry, stable IDs, variation bounds, and no style-specific renderer path before matrix generation. | R-016c approval and R-018 boundary contract. | Agent-ready after R-016c. |
| F-023 | P1 | Workflow / status | Fact | The former review’s R-017 recommendation remains unimplemented; no repository command checks active next-task alignment, broken review-reference links, or stale implementation-status phrases. The prior review record itself remained stale until this review. | Manual documentation drift can again hand agents obsolete work or conceal missing evidence. | R-017: add a focused, read-only control-drift validator with negative fixtures for stale next-task text, task-state conflicts, and required evidence-link failures. | None. | Agent-ready. |
| F-024 | P2 | Definition quality | Resolved fact | ADR-025 requires semantic labels/progress values, no overlap or obscuration at target-phone scale, and at least `3/5` for Mobile-scale readability and state distinction. | The previously ambiguous readability threshold is now consistent and observable. | Preserve the approved rule in R-020 slice planning and later review evidence. | None. | Complete. |
| F-025 | P2 | Plan / evidence | Inference | The M11 rubric correctly requires source, phone, thumbnail, matrix, material-isolation, seed, package, and boundary evidence, but no ordered implementation/evidence slices exist after the definition gate. | A future implementation task could combine contracts, rendering, packaging, and review evidence too broadly, increasing delivery and review risk. | R-020: write an ordered M11 implementation/evidence slice plan with one coherent validation target per slice. | R-018/R-019 scope. | Agent-ready. |

## Ordered recommended tasks

### R-016c — Review and approve Enchanted Forest third-style definition and rubric

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Option A approved the definition/rubric through ADR-025. Required labels and progress values are semantic text, unobscured at target-phone scale, and the later Mobile-scale readability and state distinction score must be at least `3/5`.
- **Validation:** The decision record, approved definition, approved rubric, and next permitted R-020 task are cross-linked; no production renderer/package changes occurred.

### R-017 — Add lightweight control-drift detection

- **Priority / eligibility:** P1 — Agent-ready.
- **Scope:** Add a read-only validation command that checks the active overview next task against task-board execution state, flags stale active milestone/implementation text, and verifies required review-reference/evidence links exist.
- **Acceptance criteria:** Focused negative fixtures reproduce the stale-M10 and broken-link drift patterns; the current committed controls pass with actionable errors on failure.
- **Validation:** Focused positive/negative tests plus `git diff --check`.

### R-018 — Generalize the review-reference production boundary

- **Priority / eligibility:** P1 — Agent-ready after R-016c.
- **Scope:** Replace the Forge-only assumption with a parameterized review-reference boundary validator and negative tests. Register the Enchanted Forest receipt as review-only evidence while retaining existing Forge coverage.
- **Acceptance criteria:** The validator rejects each registered reference filename, SHA-256 match, identical raster, direct SVG link, and raster `<image>` use in production outputs; Forge regression coverage remains green.
- **Validation:** Negative injected-leak tests for Forge and Enchanted Forest, existing M10 package validation, and a current production-file count receipt.

### R-019 — Prove Enchanted Forest shared-composition binding

- **Priority / eligibility:** P1 — Agent-ready after R-016c.
- **Scope:** Define the approved Enchanted Forest data binding and focused contracts/tests before package generation. Cover all approved material, variation, ornament, focal, typography, lighting, and state bounds through the existing style-composition seam.
- **Acceptance criteria:** The test evidence proves shared geometry/stable IDs, named zero/nonzero seed behavior, independent layers, and absence of an M11-specific renderer/template path.
- **Validation:** Contracts, focused renderer tests, and a negative test that rejects a disallowed geometry/style-specific path.

### R-020 — Plan bounded M11 implementation and evidence slices

- **Priority / eligibility:** P2 — Agent-ready after R-016c.
- **Scope:** Divide approved M11 work into ordered contracts/materials, rendering/matrix, package/evidence, and review slices, each with bounded acceptance criteria and validation.
- **Acceptance criteria:** Every required hard-gate surface from the M11 rubric has an owning slice; no slice changes more than one independently reviewable contract/evidence concern.
- **Validation:** Cross-link and dependency scan against the approved definition/rubric and `git diff --check`.

## Review conclusion

The project’s baseline and two-style claims are now supported by passing contracts, deterministic M10 receipts, shared-composition evidence, review-only reference protection, and cross-style hardening. M11’s definition gate is approved, including an observable readability threshold. The credible remaining weakness is implementation readiness: first plan bounded slices, then extend the reference-boundary and regression controls to a third style before package work.
