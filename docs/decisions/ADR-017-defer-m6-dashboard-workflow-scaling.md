# ADR-017 — Defer M6 dashboard and workflow scaling

| Field | Value |
|---|---|
| Status | 🟢 Accepted |
| Date | 2026-07-18 |
| Decision owner | 🧭 Project owner + 🛠️ Technical lead |
| Scope | M6 / Workflow scaling |

## Context

M6 was conditional: dashboard and workflow scaling should begin only if Markdown controls and the existing showcase no longer keep the project understandable.

The current project already has:

- `docs/PROJECT_OVERVIEW.md` as the control page;
- roadmap, module, decision, review, validation, and release procedure records;
- a renderer-backed Component Showcase for visual review;
- passed milestones M0 through M5;
- no current evidence that a dashboard would save enough review time to offset maintenance cost.

The prior dashboard proposal was already replaced by the Component Showcase. Markdown remains the source of truth for status, decisions, and governance.

## Decision

Do not build an M6 dashboard or workflow-scaling tool now.

Markdown controls plus the existing renderer-backed showcase remain sufficient. Dashboard/workflow scaling is deferred until coordination pain appears and can be tied to a concrete review or delivery problem.

## Rationale

The project has strong control documents and reproducible validation evidence. Adding a dashboard now would create a second surface to maintain before there is evidence that it improves delivery. Deferring preserves focus on production assets and avoids expanding into project-management tooling prematurely.

## Consequences

- M6 is closed as deferred/not needed now.
- `docs/DASHBOARD_PLAN.md` remains a historical showcase plan, not an active dashboard roadmap.
- Future dashboard/workflow work requires a new reviewed task or change request with a measurable coordination problem and acceptance criteria.
- The next project decision is roadmap direction: choose the next production validation target, future package/style hardening, or maintenance cadence.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-18 | Approved Option A: defer M6 dashboard/workflow scaling and keep Markdown + showcase as the operating model | Project owner / Codex |
