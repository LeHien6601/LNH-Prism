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

- **V1 / M1:** reusable, high-quality, structurally layered SVG Primary Button, Panel, and Progress Bar for one live screen; no Unity integration requirement.
- **V2 / M2:** themed shop/reward popup family using one material pack.
- **V3 / M3:** concept-to-spec-to-components rebuild without component extraction.
- **V4 / M4:** playable Unity reward/shop flow with exported states.
- **V5 / M5:** release-like batch recreated from clean versioned inputs.

## Dependencies

Every product module; art/UI reviewers; Unity sample project from M4 onward.

## Acceptance criteria

- Every milestone has a completed validation record before its gate.
- Every failed validation has a root-cause category and corrective decision.
- Revalidation proves that blocker fixes worked.

## Risks

- Demo-only tests hide real problems: validation briefs must name a real target screen.
- Endless polishing: define pass targets before rendering and defer non-blockers.

## Current V1 gate result

The original 2026-07-16 review scored V1 at `91/100` and failed because Traceability and reproducibility scored `4/5` against a mandatory `5/5`. V1-D004 corrected the provenance chain; the project owner appended a `5/5` re-score with no blockers. The current rubric-computed outcome is 🟢 Pass at `93/100`. V1-D003 was subsequently closed through connected-extrusion implementation and affected visual revalidation without changing the approved gate score.

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
