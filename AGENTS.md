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

Use Conventional Commits:

```text
type(scope): imperative summary
```

Examples: `feat(renderer): add layered primary button template`, `test(specs): validate material provenance`, `docs(roadmap): record v1 validation gate`.

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

### `Review:`

Treat a user message beginning with `Review:` as a read-only whole-project health review unless the user explicitly requests fixes.

1. Inspect Git status/history, the overview, roadmap, module documents, implementation, tests, and validation evidence available in the repository.
2. Report: current status, completed/active work, blockers, weaknesses/risks, missing validation, documentation drift, and the next recommended actions.
3. Classify findings by severity and distinguish facts from assumptions.
4. Do not implement fixes, modify status, create tasks, or advance the roadmap during a review unless explicitly authorized.

## Quality gates

- Keep production UI outputs deterministic and traceable to versioned source inputs.
- Validate real assets at V1–V5; a demo alone does not pass a milestone.
- Do not add general-editor features without a reviewed change request tied to production evidence.
- Treat AI texture/material inputs as reusable, normalized inputs—not component-specific baked effects.
- Use Unity export manifests and stable IDs before claiming a reliable handoff.
