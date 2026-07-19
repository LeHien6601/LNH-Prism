# LNH Prism Agent Instructions

## Mission and non-negotiable principle

LNH Prism builds an AI-assisted mobile game UI asset system:

> AI creates concepts and reusable materials; deterministic tools create structure and final assets.

Do not treat AI-generated full-screen images as final component sources. Preserve editable geometry, independent effects, material provenance, asset IDs, and reproducible export metadata.

## Source of truth

Read these before beginning implementation work:

1. `docs/PROJECT_OVERVIEW.md` — current milestone, task board, risks, decisions, and next task.
2. The relevant document in `docs/modules/` — scope, dependencies, acceptance criteria, and validation task.
3. `docs/CHANGE_CONTROL.md` — boundary and review rules.
4. `docs/ROADMAP.md` — phase gate and exit criteria.

Update `docs/PROJECT_OVERVIEW.md` when a task changes status, a gate is reviewed, a material risk/decision appears, or the next agent-ready task changes. Keep detailed rationale in the relevant module document or change-control record.

## Engineering workflow

1. Inspect the current repository state and affected documents/code before editing.
2. Work only on an explicitly scoped task; preserve unrelated user changes.
3. Keep contracts, IDs, manifests, and exported metadata backward-compatible unless an approved change request says otherwise.
4. Add or update focused tests whenever behavior, schemas, rendering, or export changes.
5. Verify the result in proportion to risk. Do not claim validation that did not run.
6. Review the final diff for correctness, scope, generated files, and accidental changes.
7. For every task that changes repository files, stage the task's complete cohesive change, create a Conventional Commit, and push the current branch to its configured upstream after validation. Never force-push, rewrite history, or switch branches merely to complete this step.
8. If committing or pushing fails, preserve the working tree and local commit, report the exact blocker, and do not claim the task is fully delivered.

Use Conventional Commits:

```text
type(scope): imperative summary
```

Examples: `feat(renderer): add layered primary button template`, `test(specs): validate material provenance`, `docs(roadmap): record v1 validation gate`.

## Required task handoff

Every final task reply must include:

1. The completed outcome and validation actually run.
2. The next task exactly as recorded in `docs/PROJECT_OVERVIEW.md`, prefixed by its execution color and followed by its owner symbol/name. Example: `Next: 🟣 Conduct V2 review — 🧭 Product + 🎨 Art + 🛠️ Technical leads`.
3. Git status: current branch, clean or dirty working-tree state, created commit hash/subject when files changed, and push target/result. For read-only work, explicitly state that no commit or push was needed.

Do not omit the next-task assignment or Git status even when the task itself is complete. A mutating task is not fully handed off until its commit is pushed, unless an exact push blocker is reported.

## Task ownership and eligibility

The **Execution** field in the overview task board controls automation:

| Value | Meaning |
|---|---|
| `🔵 Agent-ready` | 🤖 An agent may start and complete the task autonomously within its stated acceptance criteria. |
| `🟣 Human decision` | 🎨🧭🛠️ Requires art/product/technical direction or approval; an agent may prepare options but must not choose or mark it complete. |
| `🔴 Blocked` | Do not start; report the dependency. |
| `🟢 Complete` | Do not restart unless explicitly asked. |

An agent must never infer that a `Human decision` task is agent-ready. If no unblocked `Agent-ready` task exists, report that clearly and do not begin unrelated work.

## Quick commands

### `Next:`

Treat a user message beginning with `Next:` as authorization to start **one** highest-priority, unblocked task marked `Agent-ready` in `docs/PROJECT_OVERVIEW.md`.

1. Re-read the source-of-truth documents and inspect the repository.
2. Select the highest-priority agent-ready task; use the listed order to break ties.
3. Announce the selected task and its acceptance criteria.
4. Implement, validate, review the diff, and update task status/next task.
5. Stop after that one coherent task. Do not start a human-decision task or a second task automatically.

Text after `Next:` may constrain the task. If it conflicts with the task board, explain the conflict and ask for direction rather than silently changing scope.

### `Guide:`

Treat a user message beginning with `Guide:` as a decision-preparation request. Run it **only** when the overview's next task is an unblocked `🟣 Human decision` task. It helps the user complete that task; it does not make the decision or advance task status.

1. Re-read the source-of-truth documents and identify the highest-priority pending human-decision task. Confirm that it matches the overview's next task.
2. State the decision goal, fixed constraints, acceptance criteria, and what becomes possible after the decision.
3. Provide a focused review checklist and 2–4 viable options. For each option, show benefits, trade-offs, risks, and downstream impact.
4. Recommend an option when the evidence supports one, but label it as a recommendation—not a completed decision.
5. Ask only the smallest set of questions needed for the user to choose. Use explicit choice labels when practical.
6. Do not edit project status, task ownership, decisions, specifications, or code until the user explicitly confirms a choice.

If the next task is `🔵 Agent-ready`, `🔴 Blocked`, or `🟢 Complete`, explain that `Guide:` does not apply and direct the user to `Next:` or `Review:` as appropriate. Text after `Guide:` may constrain the options or review criteria.

### `Auto Review:`

Treat a user message beginning with `Auto Review:` as explicit project-owner authorization for an agent to conduct the overview's next unblocked `🟣 Human decision` **review** task using its approved rubric. It is limited to evidence-based review decisions; it does not authorize product, art-direction, architecture, or scope decisions that are not already governed by an approved rubric.

1. Re-read the source-of-truth documents, relevant review rubric, evidence package, and repository state. Confirm that the next task is a bounded review with explicit pass criteria and a recorded evidence location.
2. Run the applicable technical/preflight validation and inspect every review surface required by the rubric. Do not claim a hard gate passes unless the evidence or validation demonstrates it.
3. Record the reviewer as `project-owner-authorized automated review`, the evidence inspected, technical hard-gate outcome, blockers, each required visual score, weighted total, observations, and decision in a new or updated validation record.
4. Apply the rubric exactly. A hard-gate failure, a score below the stated threshold, or a dimension below its minimum is a fail even when other evidence is strong. Do not treat technical correctness as a visual-score multiplier.
5. On pass, update the overview, roadmap, and relevant implementation record with the authorized decision and identify the next task that the approved plan permits. On fail, record bounded, evidence-linked remediation task(s), mark only the reviewed task complete with its failed outcome, and set the highest-priority remediation as the next agent-ready task. Do not begin that remediation in the same turn.
6. Preserve unrelated user changes, review the final diff, create a Conventional Commit, and push it under the normal engineering workflow.

If the next task is not an unblocked human review, if its rubric/evidence/pass criteria are missing, or if the request would decide unapproved product/art/architecture scope, explain the blocker and direct the user to `Guide:` or the appropriate decision process. Text after `Auto Review:` may constrain the evidence or rubric dimensions but cannot weaken existing hard gates or pass criteria.

### `Review:`

Treat a user message beginning with `Review:` as a whole-project weakness assessment. Its purpose is to find evidence-backed weaknesses in the project's **workflow, status, and plan**, then define practical remediation work without implementing it.

1. Inspect Git status/history, the overview, roadmap, module documents, implementation, tests, validation evidence, task ownership, and completed-work records available in the repository.
2. Assess all three review areas:
   - **Workflow:** handoffs, ownership, validation, reproducibility, delivery, and process controls.
   - **Status:** task-board accuracy, milestone/gate state, evidence alignment, blockers, and documentation drift.
   - **Plan:** ordering, dependencies, scope, acceptance criteria, risks, and whether the next task is actionable.
3. Record every material finding with an ID, severity, review area, evidence, fact vs. inference label, impact, recommended solution, dependencies, and execution eligibility.
4. Turn each bounded solution into a recommended task with a clear scope and acceptance criteria. When a solution is too large, crosses multiple areas, has independent dependencies, or cannot be validated as one coherent change, split it into ordered smaller tasks.
5. Write or update `docs/validation/records/latest-project-review.md`. This review record is the only repository mutation permitted by `Review:`; it must include the inspected revision/date, findings, ordered recommended tasks, and any Human decision or Blocked items. Do not modify product code, milestone/task status, roadmap, or other project records during the review.
6. Report current status, blockers, weakness points, and the ordered recommendations. Classify findings by severity and clearly distinguish facts from assumptions.

### `Apply Review:`

Treat a user message beginning with `Apply Review:` as authorization to implement **one** recommended remediation task from the latest project review record.

1. Read `docs/validation/records/latest-project-review.md`, the source-of-truth documents, and the current repository state. If no current review record exists, or its revision/snapshot no longer matches the repository in a way that could invalidate the recommendation, stop and direct the user to run `Review:` first.
2. Select the highest-priority unblocked recommended task marked `Agent-ready`. Text after `Apply Review:` may name a recommendation ID; otherwise use the record's order. Never infer that a `Human decision` or `Blocked` recommendation is agent-ready.
3. Confirm the selected recommendation has bounded scope, dependencies, and acceptance criteria. If it does not, report the gap and direct the user to `Review:`; do not invent scope.
4. Implement and validate that one task only. Preserve unrelated changes and do not start a second recommendation automatically.
5. Update the review record to mark the applied recommendation complete and to identify its next recommended task. Update `docs/PROJECT_OVERVIEW.md` only when the applied work changes project status, a material risk/decision, or the next agent-ready task.
6. Review the final diff, create a Conventional Commit, and push it under the normal engineering workflow. Report the recommendation ID, evidence/validation, remaining recommendations, and any blockers.

### `Push:`

Treat a user message beginning with `Push:` as authorization to push all commits on the current local branch to its configured upstream remote branch.

1. Inspect Git status, the current branch, configured upstream, and commits that have not yet been pushed.
2. Push the current branch without creating commits, amending history, rebasing, or switching branches.
3. Preserve uncommitted changes; report them separately and do not include them in the push.
4. If the branch has no configured upstream or the push is rejected, report the exact blocker and do not force-push or alter history.

`Push:` remains available for retrying or explicitly checking publication, but normal mutating task completion already includes commit and push under the Engineering workflow.

## Quality gates

- Keep production UI outputs deterministic and traceable to versioned source inputs.
- Validate real assets at V1–V5; a demo alone does not pass a milestone.
- Do not add general-editor features without a reviewed change request tied to production evidence.
- Treat AI texture/material inputs as reusable, normalized inputs—not component-specific baked effects.
- Use engine-neutral asset manifests and stable IDs before claiming a reliable handoff.
