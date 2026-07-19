# Whole-project weakness review — 2026-07-19

## Snapshot

| Field | Value |
|---|---|
| Reviewed revision | `8064579` (`docs(review): record volcanic forge gate failure`) |
| Review date | 2026-07-19 |
| Working tree at start | Dirty: unrelated `docs/implementation/PRODUCTION_FIDELITY_AND_MULTI_STYLE_EXPANSION_PLAN.md` modification and untracked `new-plan.md`; neither was inspected as review evidence or changed. |
| Scope | Workflow, status, plan, renderer/asset architecture, validation/reproducibility, provenance/reference handling, and delivery documentation across M0–M10. |
| Validation run | `npm run validate:contracts`; `npm run build:renderer`; `node --test tests/renderer/m10-style-transfer.test.mjs`; `npm run validate:m10-r001-package`; `npm run validate:asset-package`; `git diff --check`. |
| Validation result | All commands passed. They validate contracts, M10 renderer behavior, the M10 26-entry/52-module evidence shape, the original Frostbound 62-module package, and whitespace; they do not close the V10 hard gates below. |

## Current status

- M1–M7 remain passed/completed; M8/M9 completed their Frostbound refinement/generalization work. M10 remains open after a formal V10 fail at a diagnostic `78/100`.
- `M10-R002` is the active agent-ready task. It correctly targets clean-workspace proof, seed/zero-baseline receipts, and shared-renderer proof.
- The prior whole-project review was at revision `ad59059` on 2026-07-17, before M7–M10. Its resolved M5/M6 findings remain historical rather than a current assessment.

## Findings

| ID | Severity | Area | Fact or inference | Evidence | Impact | Recommended solution | Dependencies | Eligibility |
|---|---|---|---|---|---|---|---|---|
| F-011 | P0 | Validation / architecture | Fact | `m10-volcanic-forge-transfer-review.md` records V10-B001–B003; `prepare-m10-r001-package.mjs` rebuilds in-repository directories, supplies no `variationSeed`, and calls the M10-specific adapter. | V10 cannot pass; determinism, variation, and generalized-reuse claims are not independently demonstrated. | R-011: complete M10-R002 with a true temporary clean workspace, byte comparison, explicit nonzero/zero seed receipts, and a generalized composition seam proven by tests. | None. | Agent-ready. |
| F-012 | P0 | Provenance / plan | Fact | `style-m10-volcanic-forge.json` cites only ADR-021 as a human-design source; `docs/reference-briefs/assets/` has Frostbound concept/receipt files but no M10 counterpart. | V10 can compare against Frostbound but cannot assess fidelity to a selected Volcanic Forge visual target. | R-012 then R-013: approve a review-only Volcanic Forge reference source, then register a hashed receipt/reference board with an explicit no-pixel-extraction boundary. | Product/art source choice. | Human decision, then Agent-ready. |
| F-013 | P1 | Validation | Fact | `validate-m10-r001-evidence.mjs` checks matrix count, module count, canonical component name, SVG receipt hashes, and surface existence; it does not iterate the 52 manifest modules to verify paths, bytes, and SHA-256 values. | A stale, missing, or substituted packaged module can remain undetected while the focused M10 validator passes. | R-011: extend the M10 validator to independently verify every manifest module receipt and identity, then include it in the clean-reproduction receipt. | R-011. | Agent-ready. |
| F-014 | P1 | Status / documentation | Fact | Overview at-a-glance still says M8 definition/specification is next; M10 implementation status still says “Approved for M10-A4 implementation,” while the task board and review record show M10-A7 failed and M10-R002 is next. | Active controls disagree, creating an incorrect handoff for people or automation that use the overview/specification rather than the task board. | R-014: reconcile active milestone/status statements without rewriting historical facts. | R-011 may remain active; documentation task is independent. | Agent-ready. |
| F-015 | P1 | Workflow / evidence integrity | Fact | M10 technical preflight lists checks as strings with no per-check evidence/result; `M10-E-comparison.md` claims seeded soot/crack behavior while the M10 generation requests omit seeds. | Reviewers must infer technical correctness from prose and may score claims that the evidence does not demonstrate. | R-011: emit per-check pass/fail evidence paths and reject comparison/preflight claims that are not backed by generated receipts. | R-011. | Agent-ready. |
| F-016 | P1 | Architecture / maintainability | Fact | `src/renderer/m10-style-transfer-components.ts` is a separate M10 adapter over M8; the current test checks its output but does not prove that its forge layers are supplied by an M9-generalized registry/seam. | The no-parallel-renderer rule remains ambiguous and each additional style risks another adapter. | R-011: define and test a style-agnostic composition interface for palette/material/ornament/focal/typography bindings; migrate M10 to it or prove the existing seam satisfies it. | R-011. | Agent-ready. |
| F-017 | P2 | Plan / risk management | Fact | ADR-016 accepted Frostbound-only hardening as a residual risk; M10 is the first second-style transfer and has not passed its hard gate. | The original single-style hardening evidence is insufficient to claim multi-style package/reproduction readiness. | R-015: after V10 hard gates pass, decide whether M5 multi-style hardening must be reopened and define the coverage target if approved. | V10 hard-gate closure. | Human decision. |
| F-018 | P2 | Plan / product validation | Fact | ADR-021 defers third-style testing; no third-style scope, reference, or contrast evidence exists. | The renderer is not yet proven beyond Frostbound and one incomplete second-style transfer. | R-016: after V10 passes, choose a third-style contrast target and reference policy before implementation. | V10 pass and R-012/R-013 reference policy. | Human decision. |
| F-019 | P3 | Workflow | Fact | ADR-017 defers dashboard/workflow scaling; the project now has many cross-linked records and manual status drift. | Markdown remains approved, but coordination cost and drift should be measured rather than assumed absent. | R-017: define lightweight drift signals (stale next-task text, mismatched task states, broken evidence links) and revisit the M6 decision if thresholds are reached. | R-014. | Agent-ready. |

## Ordered recommended tasks

### R-011 — Close V10 hard-gate evidence and generalized-renderer proof

- **Priority / eligibility:** P0 — Agent-ready; aligns with active M10-R002.
- **Scope:** Rebuild Volcanic Forge from a temporary clean workspace; compare every output and manifest byte/SHA against the approved package; render three named nonzero seeds plus a zero baseline; and expose Volcanic Forge bindings through a proven style-agnostic composition seam rather than an unproven style adapter.
- **Acceptance criteria:** Per-check preflight results link to receipts; all 52 modules validate against manifest hashes; seed receipts show deterministic same-seed output and distinct permitted variation; no style-specific renderer branch/parallel composition path remains; M7–M9 bytes are unchanged.
- **Validation:** New focused clean-workspace, manifest-receipt, seed/baseline, and generalized-seam tests; existing contracts, renderer test, and M10 package validation.

### R-012 — Approve a Volcanic Forge review-reference policy and source

- **Priority / eligibility:** P0 — Complete, project-owner decision on 2026-07-19.
- **Decision:** Use a generated, review-only reference for Volcanic Forge and make the same agent-task workflow mandatory for future styles; see [ADR-023](../../decisions/ADR-023-generated-review-reference-workflow.md).

### R-012a — Generate and receipt the Volcanic Forge review-only reference

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Generated, deterministically resized, and inspected the `1080 × 1920` reference at `docs/reference-briefs/assets/m10-volcanic-forge-review-reference-1080x1920.png`. Its hash, source size, generation provenance, permitted use, and prohibited production uses are recorded in the adjacent receipt.
- **Validation:** PNG dimensions, byte count, SHA-256, and visual inspection passed. R-013 remains responsible for the M10 evidence links and automated source-boundary checks.

### R-013 — Register the approved Volcanic Forge review-only reference

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** The M10 reference brief, transfer-review record, technical preflight, and renderer-versus-reference comparison surface now bind the generated reference and receipt. `validate:m10-r002-package` scans production SVG/PNG assets and rejects the reference filename/hash or an identical raster.
- **Validation:** `npm run test:m10-reference-boundary` passed a negative injected-leak check; `npm run validate:m10-r002-package` passed with 318 production files clear of reference pixels.

### R-014 — Reconcile active M8–M10 control status

- **Priority / eligibility:** P1 — Complete.
- **Outcome:** Active overview, roadmap, and M10 specification controls now show M8–M10 as passed/completed, identify R-016 as the current decision, and retain historical M10 remediation/review outcomes as historical records.
- **Validation:** Targeted status scan and `git diff --check` passed.

### R-015 — Revisit multi-style production hardening coverage

- **Priority / eligibility:** P2 — Human decision after R-011/V10 hard-gate closure.
- **Scope:** Decide whether a passing Volcanic Forge package requires reopening the M5 hardening batch for cross-style reproduction, rollback, size/timing, and manifest checks.
- **Acceptance criteria:** An approved policy either defines a bounded cross-style hardening task or explicitly accepts the residual risk with a review trigger.

**Decision:** Complete — Option 1 accepted on 2026-07-19. ADR-022 defines M5-B1 as the bounded Agent-ready Volcanic Forge cross-style hardening batch.

### R-016 — Select third-style contrast proof

- **Priority / eligibility:** P2 — Complete, project-owner decision on 2026-07-19.
- **Outcome:** Option A selected Enchanted Forest. [ADR-024](../../decisions/ADR-024-enchanted-forest-third-style-contrast.md) records organic stone/wood/moss materials, diffuse bioluminescence, botanical ornament, soft focal treatment, the `1080 × 1920` canvas, the existing seven-component inventory, generated-reference provenance policy, and required exit evidence.

### R-016a — Generate and receipt the Enchanted Forest review-only reference

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Generated, deterministically resized, and inspected the `1080 × 1920` reference at `docs/reference-briefs/assets/enchanted-forest-review-reference-1080x1920.png`. Its hash, source size, generation provenance, permitted use, and prohibited production uses are recorded in the adjacent receipt.
- **Validation:** PNG dimensions, byte count, SHA-256, and visual inspection passed. R-016b subsequently drafted the third-style definition and rubric; R-016c must review them before implementation.

### R-016b — Draft Enchanted Forest third-style definition and rubric

- **Priority / eligibility:** P0 — Complete.
- **Outcome:** Drafted the bounded [implementation definition](../../implementation/ENCHANTED_FOREST_THIRD_STYLE_IMPLEMENTATION_SPEC.md) and [visual-contrast rubric](../ENCHANTED_FOREST_THIRD_STYLE_RUBRIC.md). They define organic material/variation/ornament/focal/typography/lighting/state rules, seven-component reuse, deterministic constraints, evidence, scoring, and blockers without authorizing renderer or package work.
- **Validation:** Document link/consistency scan and `git diff --check` passed.

### R-016c — Review and approve Enchanted Forest third-style definition and rubric

- **Priority / eligibility:** P0 — Human decision.
- **Scope:** Review the R-016b definition and rubric against ADR-024, the generated review-only reference receipt, shared-renderer boundary, seven-component inventory, and multi-style hardening controls. Approve, return with bounded corrections, or reject; do not implement production assets during the review.
- **Acceptance criteria:** A recorded decision explicitly accepts or revises the deterministic material, variation, ornament, focal, typography, lighting, state, evidence, scoring, and blocker rules. Only an approved definition may authorize later implementation.

### R-017 — Add lightweight control-drift detection

- **Priority / eligibility:** P3 — Agent-ready after R-014.
- **Scope:** Add a documentation/evidence consistency check for next-task text, task status, required review evidence links, and stale active implementation status.
- **Acceptance criteria:** The check fails with actionable messages on the M8/M10 drift patterns found in F-014.
- **Validation:** Focused negative fixtures plus repository consistency command.

## Review conclusion

The project retains strong deterministic, contract, and historical Frostbound package controls. Its current weakness is not baseline rendering capability; it is the lack of credible multi-style proof. The highest-priority work is therefore R-011, which closes V10’s technical hard gates and makes package/reuse claims independently verifiable. A review-only Volcanic Forge reference must then be selected and registered before treating V10 visual fidelity as a meaningful quality gate. Broader multi-style hardening, third-style proof, and workflow scaling remain deliberately deferred until this second style is credible.
