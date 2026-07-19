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
- M11 is correctly held at the definition gate: R-016b has drafted its implementation rules and rubric, while R-016c is the next required Human decision. No renderer or package work is authorized.
- The prior review record was stale because it still reported a failed/open M10 and recommended work that later commits completed. This review supersedes it without rewriting the historical V10 review record.

## Findings

| ID | Severity | Area | Fact or inference | Evidence | Impact | Recommended solution | Dependencies | Eligibility |
|---|---|---|---|---|---|---|---|---|
| F-020 | P0 | Plan / governance | Fact | `PROJECT_OVERVIEW.md` and `ROADMAP.md` make R-016c the next task; the M11 definition and rubric are explicitly Draft and state that implementation needs approval. | Starting M11 implementation before R-016c would violate the approved decision gate and could turn draft visual bounds into unreviewed product direction. | R-016c: approve, return, or reject the definition and rubric; do not implement during the review. | None. | Human decision. |
| F-021 | P1 | Validation / provenance | Fact | `scripts/m10-reference-boundary.mjs` reads only the Forge receipt and `tests/validation/m10-reference-boundary.test.mjs` injects only a Forge leak. M11 requires an automated Enchanted Forest filename/hash/identical-raster/direct-link boundary scan. | The mandatory generated-reference policy is proven for one past style but cannot yet protect M11 production outputs. | R-018: add a parameterized review-reference boundary validator and negative tests, then register the Enchanted Forest receipt through it before package review. | R-016c approval; actual M11 source/output paths. | Agent-ready after R-016c. |
| F-022 | P1 | Architecture / regression | Fact | `src/renderer/style-composition.ts` is style-neutral in interface, but its implementation delegates to M8 renderers and the focused test exercises only `M10_VOLCANIC_FORGE_BINDING`. The M11 definition requires the same seam without a style fork. | A third binding could silently require an M11 adapter or geometry exception, undermining the multi-style claim. | R-019: add Enchanted Forest binding/contract coverage that proves shared geometry, stable IDs, variation bounds, and no style-specific renderer path before matrix generation. | R-016c approval and R-018 boundary contract. | Agent-ready after R-016c. |
| F-023 | P1 | Workflow / status | Fact | The former review’s R-017 recommendation remains unimplemented; no repository command checks active next-task alignment, broken review-reference links, or stale implementation-status phrases. The prior review record itself remained stale until this review. | Manual documentation drift can again hand agents obsolete work or conceal missing evidence. | R-017: add a focused, read-only control-drift validator with negative fixtures for stale next-task text, task-state conflicts, and required evidence-link failures. | None. | Agent-ready. |
| F-024 | P2 | Definition quality | Fact | The M11 definition requires readability at an “established target-phone readability threshold,” but it does not identify a numeric contrast target, text-size floor, or existing normative source for that threshold. | Different reviewers could apply incompatible readability expectations to the new parchment/sage typography. | Resolve during R-016c: either cite the controlling existing readability contract or add bounded numeric/observable criteria to the approved definition. | None. | Human decision. |
| F-025 | P2 | Plan / evidence | Inference | The M11 rubric correctly requires source, phone, thumbnail, matrix, material-isolation, seed, package, and boundary evidence, but no ordered implementation/evidence slices exist after the definition gate. | A future implementation task could combine contracts, rendering, packaging, and review evidence too broadly, increasing delivery and review risk. | R-020: after R-016c, write an ordered M11 implementation/evidence slice plan with one coherent validation target per slice. | R-016c approval; R-018/R-019 scope. | Agent-ready after R-016c. |

## Ordered recommended tasks

### R-016c — Review and approve Enchanted Forest third-style definition and rubric

- **Priority / eligibility:** P0 — Human decision; this is the active overview task.
- **Scope:** Review the R-016b implementation definition and rubric against ADR-024, the Enchanted Forest review-reference receipt, shared-system boundary, and the M5/M10 hardening evidence. Resolve F-024’s readability criterion explicitly.
- **Acceptance criteria:** Record approval, bounded return, or rejection. An approval identifies the governing target-phone readability threshold and preserves the seven-component, no-reference-pixel, no-style-fork boundary.
- **Validation:** Decision record links to the approved definition/rubric and identifies the next permitted task; no production renderer/package changes occur in the review.

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

The project’s baseline and two-style claims are now supported by passing contracts, deterministic M10 receipts, shared-composition evidence, review-only reference protection, and cross-style hardening. The credible remaining weakness is M11 readiness: its direction is intentionally draft, and the reference-boundary and regression controls must become multi-reference/multi-binding before package work. The immediate action is therefore the existing R-016c human definition review; it should resolve readability criteria and then permit the focused agent tasks above.
