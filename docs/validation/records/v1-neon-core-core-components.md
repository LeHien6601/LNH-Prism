# V1 Validation Record — Neon Core Core Components

**Status:** 🔴 Reviewed — M1 gate failed pending corrective work and revalidation.

| Field | Value |
|---|---|
| Review date | 2026-07-16 |
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

These scores were supplied by the project owner after reviewing the prepared evidence. Automated evidence did not prefill the scorecard.

| Dimension | Weight | Score (0–5) | Weighted result | Evidence | Reviewer | Notes |
|---|---:|---:|---:|---|---|---|
| Visual hierarchy and mobile readability | 20 | 4 | 16 | V1-E03, V1-E05 | Project owner | Meets the V1 minimum. |
| Style consistency | 20 | 5 | 20 | V1-E03 | Project owner | Reads as one Neon Core family. |
| Edge, alpha, and layer quality | 15 | 4 | 12 | V1-E03, V1-E05 | Project owner | Meets the V1 minimum. |
| State and size behavior | 15 | 5 | 15 | V1-E03, V1-E04 | Project owner | Deterministic states and supported sizes behave correctly. |
| Editability and reuse | 20 | 5 | 20 | V1-E02, V1-E03, V1-E04 | Project owner | Named SVG structure and independent parts meet the target. |
| Traceability and reproducibility | 10 | 4 | 8 | V1-E02, V1-E06 | Project owner | Below the mandatory V1 minimum of 5; reviewer-visible evidence must be audited and completed. |

- **Weighted score:** 91 / 100
- **Automatic blockers:** None reported
- **Requested decision:** 🟢 Pass (Option A)
- **Rubric-computed decision:** 🔴 Fail — Traceability and reproducibility scored `4`, below its mandatory minimum of `5`.

The weighted total exceeds the Pass threshold, but the approved rubric requires every dimension to meet its minimum. The gate can be reconsidered after the traceability finding is corrected and the affected dimension is re-scored by the same review authority.

## Defect and corrective-action log

| Issue ID | Category | Severity | Status | Corrective action | Owner | Revalidation evidence |
|---|---|---|---|---|---|---|
| V1-D001 | renderer | blocker before correction | 🟢 Closed | Clip the Progress highlight to the exact rounded fill silhouette | 🤖 Agent | Commit `6eaffa6`; all-variant clipping test; generated 10% and 90% visual inspection |
| V1-D002 | process | medium | 🟢 Closed | Prevent evidence-grid clipping and scale inspection cells with their SVGs | 🤖 Agent | Desktop dark/light surfaces at 100%; full 10% bar at 200%; 320-pixel viewport check |
| V1-D003 | renderer | medium | 🟡 Open | Replace the detached same-silhouette shadow with a connected, parameterized 3D extrusion/side-wall treatment while keeping it as an independent SVG layer | 🤖 Agent | Re-render Button, Panel, and Progress frame at both accepted sizes/states; inspect connection, corners, and alpha on both backgrounds |
| V1-D004 | process | gate failure | 🟡 Open | Audit reviewer-visible provenance, source/version links, manifests, hashes, and reproduction instructions; correct the smallest missing or unclear evidence | 🤖 Agent | Run the complete reproduction flow, document the audit, and re-score Traceability and reproducibility |

## Gate sign-off

| Role | Reviewer | Date | Outcome/notes |
|---|---|---|---|
| 🎨 Art lead | Project owner | 2026-07-16 | Hierarchy 4; consistency 5; edge/layer quality 4. Requested connected 3D shadow treatment. |
| ✦ UI lead | Project owner | 2026-07-16 | State/size behavior 5. Requested bounded real-time size and Progress controls in the preview. |
| 🛠️ Technical lead | Project owner | 2026-07-16 | Editability/reuse 5; traceability 4; no automatic blockers reported. |

The original review is retained for traceability. Revalidation must append the affected evidence and revised score rather than overwrite these results.

## Review change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Recorded the project-owner scorecard, 91/100 weighted result, rubric-computed Fail outcome, and corrective findings V1-D003/V1-D004 | Codex |
