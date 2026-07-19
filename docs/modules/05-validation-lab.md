# Module 05 — Practical Validation Lab

## Goal

Use real UI deliveries to test the system, identify root causes, and improve the process immediately.

## Scope

Validation briefs, rubric, evidence collection, retrospective, corrective actions, and revalidation. This is not a generic QA backlog; every validation must exercise the active milestone’s intended capability.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Validation brief, generated assets, reference, and milestone-specific review context | Review scorecard, issue log, corrective tasks, pass/fail decision |

## Required validation cycle

1. Select a real feature/UI screen with a named owner and playable or reviewable context.
2. Freeze a small validation brief: user-facing purpose, required components/states/sizes, reference, and target platform.
3. Generate assets only through the capabilities allowed by the milestone.
4. Review visual fidelity, consistency, editability, performance, and integration.
5. Categorize defects: spec, renderer, material, export, process, or reference ambiguity.
6. Fix the smallest root cause immediately if it blocks the milestone; otherwise file a prioritized task.
7. Re-run the validation and record the outcome.

For reference-fidelity packages, add a **craft loop** before a full package: inspect a hero panel, primary action, compact control, and focal/isolate at source and target-phone scale for material joins, depth ordering, receiver interaction, compact-control density, and state-pair readability. Record a reference grammar and state contract first, then return only the smallest owning layer/profile when this loop fails. See [UI reference-fidelity convergence system](../implementation/UI_REFERENCE_FIDELITY_CONVERGENCE_SYSTEM.md).

## Review rubric

| Dimension | Question | Suggested pass target |
|---|---|---|
| Visual hierarchy | Is the intended action/read order clear on a target phone? | No critical issue |
| Style consistency | Do layers, lighting, palette, and texture read as one family? | 4/5 average |
| Asset quality | Are edges, alpha, text slots, and details clean? | No blocker |
| Editability | Can requested token/size/state change without repainting? | Demonstrated |
| Structure and reuse | Are SVG layers/parts named, inspectable, independently reusable, and parameter-driven? | Demonstrated |
| Traceability | Can output be reproduced from versioned inputs? | Complete manifest |

## Validation milestones

- **V1 / M1:** reusable, high-quality, structurally layered SVG Primary Button, Panel, and Progress Bar for one live screen.
- **V2 / M2:** themed shop/reward popup family using one material pack.
- **V3 / M3:** concept-to-spec-to-components rebuild without component extraction.
- **M4-A / M4:** engine-neutral modular asset package inspected outside an engine project; every approved part is independently identifiable, traceable, and usable.
- **V5 / M5:** release-like batch recreated from clean versioned inputs.

## Dependencies

Every product module; art/UI reviewers; the versioned package, renderer, and evidence inputs for the active milestone.

## Acceptance criteria

- Every milestone has a completed validation record before its gate.
- Every failed validation has a root-cause category and corrective decision.
- Revalidation proves that blocker fixes worked.
- Reference-fidelity remediation proves a construction-grammar change on its craft board before a full matrix/package regeneration.

## Risks

- Demo-only tests hide real problems: validation briefs must name a real target screen.
- Endless polishing: define pass targets before rendering and defer non-blockers.

## Current V1 gate result

The original 2026-07-16 review scored V1 at `91/100` and failed because Traceability and reproducibility scored `4/5` against a mandatory `5/5`. V1-D004 corrected the provenance chain; the project owner appended a `5/5` re-score with no blockers. The current rubric-computed outcome is 🟢 Pass at `93/100`. V1-D003 was subsequently closed through connected-extrusion implementation and affected visual revalidation without changing the approved gate score.

## Current V2 gate result

The 2026-07-17 guided evidence review scored V2 at `93/100`. Every dimension met its mandatory minimum, Traceability and reproducibility scored the required `5/5`, and no automatic blocker remained. The rubric-computed outcome is 🟢 Pass. Non-blocking V2-N001 and V2-N002 inform the M3 target/specification; V2-N003 remains assigned to M5 production hardening.

## Current V3 gate result

The 2026-07-17 human fidelity review scored Frostbound V3 at `94/100`. Every mandatory dimension minimum was met; automated and human review found no blocker or defect. Human control and traceability scored `5/5`; simplified ornament, emblem detail, and atmosphere kept intentional style fidelity at its accepted minimum `4/5` and remain non-blocking. M3 is complete.

## Current M4 status

ADR-014 sets M4's accepted boundary as engine-neutral modular asset delivery. M4-A1 passed on 2026-07-17 with the tracked Frostbound package: 62 independently extractable SVG/PNG modules, stable IDs, output receipts, and use guidance. No engine project, importer, runtime flow, or device build is required for this validation milestone.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
| 2026-07-15 | Added detailed V1 scorecard, blocker criteria, and evidence package | Codex |
| 2026-07-16 | Approved V1 as an SVG structure/quality gate and deferred Unity integration validation to M4 | Project owner |
| 2026-07-16 | Prepared V1-E01 through V1-E06, light/dark SVG review surfaces, an unscored validation record, and drift validation | Codex |
| 2026-07-16 | Recorded the 91/100 V1 review and rubric-computed Fail outcome; queued traceability revalidation and connected-shadow improvement | Project owner / Codex |
| 2026-07-16 | Corrected V1-D004 with a source-hash audit, reviewer-visible traceability chain, manifest drift enforcement, and desktop/mobile QA; human re-score remains pending | Codex |
| 2026-07-16 | Appended the approved Traceability `5/5` re-score and recorded the current V1 Pass at `93/100` while retaining the original failed result | Project owner / Codex |
| 2026-07-16 | Closed V1-D003 after automated geometry checks and desktop/mobile light/dark visual revalidation of the connected extrusion treatment | Codex |
| 2026-07-16 | Completed the CR-002 validation lab with exact browser/CLI SVG equivalence, boundary/edge tests, traceability, and desktop/mobile review evidence | Codex |
| 2026-07-16 | Selected the Neon Market Kit and reusable Neon Alloy pack as the Practical Validation V2 target | Project owner |
| 2026-07-16 | Drafted the V2 evidence package, weighted review rubric, automatic blockers, scorecard, and immediate correction/revalidation procedure | Codex |
| 2026-07-16 | Approved the V2 rubric with `≥85` Pass, `82–84` Conditional Pass, mandatory dimension minimums, and automatic blockers | Project owner |
| 2026-07-16 | Prepared V2-E01–V2-E09 with 28 matrix variants, shared-token propagation, independent progress parts, browser/CLI equivalence, source/output receipts, and an unscored record; V2-P001 blocks scoring until draft review inputs are approved or rejected | Codex |
| 2026-07-16 | Approved the eight versioned V2 review inputs at `0.1.0`, closed V2-P001, and queued formal human scoring | Project owner / Codex |
| 2026-07-16 | Closed V2-P002 as a preview-tool artifact after direct RGBA verification; added light/dark surface pixel-integrity regression coverage and retained formal human scoring as the next task | Codex |
| 2026-07-17 | Recorded the confirmed V2 scorecard at `93/100`, no blockers, and 🟢 Pass; closed M2 and opened V3 target selection | Project owner / Codex |
| 2026-07-17 | Selected Frostbound Reward for V3 and drafted V3-E01–V3-E10, scoring, blockers, and review controls for human approval | Project owner / Codex |
| 2026-07-17 | Approved V3 Option A evidence, scoring, blockers, and review controls; unblocked M3-S1 | Project owner / Codex |
| 2026-07-17 | Added M3-S4's 26-variant Frostbound matrix, target portrait render, selected/hierarchy proof, independent progress outputs, annotated concept comparison, and automated no-concept production audit | Codex |
| 2026-07-17 | Prepared V3-E01–V3-E10, an unscored scorecard, defect/revalidation templates, consolidated phone and semantic comparison views, source/output receipts, and passing human-gate preflight | Codex |
| 2026-07-17 | Recorded V3 Pass at `94/100`, no blockers or defects, and completed M3 | Project owner / Codex |
| 2026-07-17 | Drafted the V4 Unity integration evidence package, scoring, blockers, and definition-review checklist | Codex |
| 2026-07-17 | Approved V4 definition Option A with manifest versioning and canonical naming clarifications; unblocked M4-S1 | Project owner / Codex |
| 2026-07-17 | Reconciled active validation guidance with ADR-014's engine-neutral M4 package boundary; historical Unity entries remain for audit only | Codex |
| 2026-07-19 | Added a pre-package craft loop and grammar/state-contract evidence after repeated M11 reviews isolated surface construction and perceptible state response as the limiting quality gap | Codex |
