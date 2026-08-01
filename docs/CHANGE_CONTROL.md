# Change Control and Review Rules

## Purpose

The system must welcome useful ideas without losing its active mission: **game-owned typed specifications are authoritative; Prism deterministically validates, previews, and packages UI structure without creating production artwork.**

## Non-negotiable guardrails

1. A feature must improve production quality, repeatability, throughput, or integration for the defined UI scope.
2. No AI output becomes final production structure without a reviewed, versioned specification.
3. No feature starts solely because it is technically interesting.
4. Real validation evidence outranks opinion when prioritizing work.
5. The project does not become a general editor unless a separately approved strategy changes the mission.

## Change-request workflow

1. Create `CR-###` with problem, proposed change, affected modules, cost, alternatives, and mission impact.
2. Classify it: correction, incremental improvement, experiment, or strategic expansion.
3. Perform an impact review: contracts, output compatibility, asset portability, quality, timeline, and owners.
4. Decide: approve, time-box experiment, defer, or reject.
5. For approved work, update the roadmap/module docs and add measurable acceptance criteria.
6. Validate on a real asset if output behavior changes; record the result.

## Decision matrix

| Question | Required answer to proceed |
|---|---|
| What concrete production problem does it solve? | Named task or validation defect |
| Does it preserve deterministic final output? | Yes, or an explicit approved exception |
| Which module owns it? | One accountable module/owner |
| How will success be measured? | Acceptance criterion and validation task |
| What will be displaced? | Explicit cost/schedule impact |
| Can it be time-boxed? | Yes for uncertain ideas |

## Review gates

- **Design review:** confirms user value, target assets, style constraints, and in/out-of-scope boundary.
- **Technical review:** confirms contracts, dependencies, compatibility, performance, and failure handling.
- **Art/UI review:** confirms hierarchy, material treatment, readability, and cross-component consistency.
- **Delivery review:** confirms modular asset completeness, portability, and re-export safety.
- **Retrospective:** follows every practical validation; turn root causes into tasks or decisions.

## Whole-project review and remediation

- `Review:` assesses workflow, status, and plan weaknesses across the repository. It records evidence-backed findings and task-sized recommendations in `docs/validation/records/latest-project-review.md`.
- A review record distinguishes facts from inferences, identifies severity and dependencies, and labels each recommendation `Agent-ready`, `Human decision`, or `Blocked`.
- A broad or multi-aspect recommendation must be split into independently actionable tasks with their own acceptance criteria and ordering.
- `Apply Review:` may implement only one highest-priority, unblocked `Agent-ready` recommendation from that record. It must not choose or apply a human-decision/blocked recommendation.
- Review records are diagnostic control artifacts: they do not themselves alter the roadmap or task board. Applied work updates project status only when the result materially changes it.

## Traceability rules

- Each output must link to source style/component/material versions and renderer version.
- Each milestone gate links to its validation report.
- Each material source stores provenance, generation prompt/settings when applicable, and rights/usage status.
- After a human approves a new style direction, create an Agent-ready task to generate and receipt one review-only reference image before visual-fidelity review. Record its prompt, tool/model, seed when available, dimensions, date, and review-only status; reference pixels must never enter production assets or materials.
- Update `PROJECT_OVERVIEW.md` after accepted decisions, new critical risks, gate outcomes, or next-task changes.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial governance rules created | Codex |
| 2026-07-17 | Defined whole-project weakness reviews and one-task review remediation workflow | Codex |
| 2026-08-01 | Approved CR-003 and made the semantic UI compiler boundary the active mission for new V2 development | Project owner / Codex |
