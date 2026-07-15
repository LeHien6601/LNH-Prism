# Simple HTML Dashboard Proposal and Initial Plan

## Decision trigger

Keep Markdown as the source of truth initially. Build the dashboard only when one or more conditions occur for two consecutive reviews:

- Reviewers spend more than 15 minutes locating status, decisions, or validation evidence.
- There are more than 20 active tasks/change requests across modules.
- Milestone and validation status must be consumed frequently by non-authors.

## Purpose

Provide a read-only, local overview of project health. It must summarize structured data; it must not replace documentation, approval records, or version-controlled specs.

## MVP screens

| View | Contents |
|---|---|
| Overview | Active milestone, next task, progress, top risks, gate status |
| Roadmap | Milestones, gates, dependencies, validation milestones |
| Modules | Per-module status, owner, blockers, latest change |
| Validation | V1–V5 briefs, scores, defects, corrective actions |
| Governance | Decisions and change requests with status/filtering |

## Data model

Create `dashboard/data/project-status.json` as a generated projection from the authoritative Markdown/contracts. It contains milestone, task, risk, decision, change request, and validation summary objects. Each object includes a source-document link and stable ID.

Do not hand-edit both Markdown and JSON. Either generate the JSON from a small structured front-matter block, or update a single structured status source and render the overview from it.

## Initial implementation plan

1. Confirm the trigger is met and approve M6 via change control.
2. Define the minimal JSON schema and source-of-truth workflow.
3. Build a dependency-free static page: `dashboard/index.html`, `dashboard/styles.css`, `dashboard/app.js`.
4. Render cards/tables from `project-status.json`; every item links back to its Markdown source.
5. Add filters for module, status, milestone, and risk severity.
6. Verify the dashboard against `PROJECT_OVERVIEW.md` during two weekly reviews.
7. Add only proven needs—avoid user accounts, editing, servers, or a database in the MVP.

## Acceptance criteria

- A reviewer finds active milestone, next task, top risks, and latest validation result in under one minute.
- Every dashboard entry links to an authoritative document.
- Dashboard data matches the control page at review time.
- The page works locally with no build service or backend.

## Risks

- Duplicate status sources: prevent through generated projection and source links.
- Dashboard becomes a product: lock MVP to read-only reporting.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial dashboard proposal created | Codex |
