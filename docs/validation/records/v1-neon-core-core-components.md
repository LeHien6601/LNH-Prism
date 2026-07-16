# V1 Validation Record — Neon Core Core Components

**Status:** 🟣 Ready for human review — unscored.

| Field | Value |
|---|---|
| Review date | Pending human review |
| Reference brief | [V1 Neon Core](../../reference-briefs/V1_NEON_CORE.md) |
| Acceptance briefs | [V1 core components](../../acceptance-briefs/V1_CORE_COMPONENTS.md) |
| Evidence package | [V1-E01 through V1-E06](../evidence/v1-neon-core-core-components/README.md) |
| Review page | `showcase/v1-evidence.html` |
| Target scale | `540 × 960` logical portrait; `2×` output reference |
| Source versions | `neon-core@0.1.0`; core components `@0.1.0`; `neon-core-materials@0.1.0` |
| Renderer version | `0.1.0+resvg.2.6.2` |

## Evidence readiness

| Evidence | Prepared | Human review required |
|---|---|---|
| V1-E01 — approved reference and target scale | 🟢 Yes | Confirm source is sufficient |
| V1-E02 — specs, material provenance, manifests | 🟢 Yes | Confirm traceability is complete |
| V1-E03 — two-size renders and SVG structure | 🟢 Yes | Inspect at 100% and 200% |
| V1-E04 — Button state renders | 🟢 Yes | Judge state distinction and intent |
| V1-E05 — light/dark composites | 🟢 Yes | Inspect edges, alpha, readability |
| V1-E06 — defect/revalidation log | 🟢 Yes | Confirm dispositions and remaining blockers |

## Human scorecard

Do not prefill scores from automated evidence. Reviewers score independently using the [approved rubric](../V1_VISUAL_REVIEW_RUBRIC.md).

| Dimension | Weight | Score (0–5) | Weighted result | Evidence | Reviewer | Notes |
|---|---:|---:|---:|---|---|---|
| Visual hierarchy and mobile readability | 20 | | | V1-E03, V1-E05 | 🎨 / ✦ | |
| Style consistency | 20 | | | V1-E03 | 🎨 / ✦ | |
| Edge, alpha, and layer quality | 15 | | | V1-E03, V1-E05 | 🎨 / ✦ | |
| State and size behavior | 15 | | | V1-E03, V1-E04 | ✦ / 🛠️ | |
| Editability and reuse | 20 | | | V1-E02, V1-E03, V1-E04 | 🛠️ | |
| Traceability and reproducibility | 10 | | | V1-E02, V1-E06 | 🛠️ | |

**Weighted score:** Pending  
**Automatic blockers:** Pending human review  
**Decision:** 🟣 Not decided — 🟢 Pass / 🟡 Conditional pass / 🔴 Fail

## Defect and corrective-action log

| Issue ID | Category | Severity | Status | Corrective action | Owner | Revalidation evidence |
|---|---|---|---|---|---|---|
| V1-D001 | renderer | blocker before correction | 🟢 Closed | Clip the Progress highlight to the exact rounded fill silhouette | 🤖 Agent | Commit `6eaffa6`; all-variant clipping test; generated 10% and 90% visual inspection |
| V1-D002 | process | medium | 🟢 Closed | Prevent evidence-grid clipping and scale inspection cells with their SVGs | 🤖 Agent | Desktop dark/light surfaces at 100%; full 10% bar at 200%; 320-pixel viewport check |
| — | — | — | No open automated defect recorded during preparation | — | — | Human review pending |

## Gate sign-off

| Role | Reviewer | Date | Outcome/notes |
|---|---|---|---|
| 🎨 Art lead | | | |
| ✦ UI lead | | | |
| 🛠️ Technical lead | | | |

The project owner records the final M1 gate outcome only after scores, blockers, and corrective actions are complete.
