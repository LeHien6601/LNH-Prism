# CR-002 — Bounded Real-Time Showcase Controls

| Field | Value |
|---|---|
| Status | 🟢 Approved — scope-boxed shared-renderer prototype |
| Date | 2026-07-16 |
| Decision date | 2026-07-16 |
| Requester | 🧭 Project owner |
| Owner | 🧭 Product owner + 🛠️ technical lead |
| Classification | Incremental improvement |

## Problem

Static variants make it slower to judge how component geometry behaves between the currently generated examples. The project owner requested real-time preview adjustment for component size and Progress Bar value.

## Proposed change

Add a bounded interactive lab to the existing local Component Showcase:

- Width/height controls only for dimensions supported by each component contract.
- A `0–100%` Progress value control with explicit low-value and end-cap behavior.
- Immediate preview rendered from the same deterministic component recipes used by production output.
- A read-only display of the active component ID, source versions, parameters, and renderer version.

This proposal does not authorize arbitrary drawing, layer editing, material authoring, persistence, or a second source of truth.

## Impact review

| Area | Impact |
|---|---|
| Mission | Improves validation of deterministic size/value behavior without introducing AI-owned structure. |
| Renderer | May require extracting browser-safe pure SVG generation from the current renderer package; production and preview paths must share the same recipe logic. |
| Contracts | No schema change is expected for the initial experiment; controls must respect existing bounds. |
| Showcase | Changes it from read-only selection to a bounded parameter sandbox, increasing editor-scope risk. |
| Validation | Enables boundary and intermediate-value review; must not replace committed manifests or reproducible CLI output. |
| Schedule | One post-M1 implementation cycle; stop at the approved boundary and review the result before beginning M2 work. |

## Reviewed options

1. **Time-box a shared-renderer prototype — approved:** prove Button width/state and Progress width/value controls using the same deterministic SVG functions, then measure drift and maintenance cost.
2. **Use pre-generated variants only:** lower technical cost, but not truly real-time and weak for intermediate-value inspection.
3. **Defer to M2:** align controls with formal tokens, variants, and state recipes before exposing them.
4. **Reject:** preserve a strictly read-only showcase and rely on CLI regeneration.

## Acceptance criteria if approved

- Preview and CLI output are byte-identical or structurally equivalent for the same supported inputs, with the equivalence rule documented and tested.
- Controls enforce component-contract bounds and show invalid values clearly.
- Progress values include `0`, `1`, `10`, `50`, `90`, `99`, and `100` regression coverage.
- No component artwork is recreated with CSS.
- The page remains local and dependency-free at runtime unless a separate technical decision approves a build/runtime dependency.
- The feature remains a validation surface, not a general asset editor.

## Approved prototype boundary

- Include Primary Button width and normal/pressed/disabled state controls within contract-supported bounds.
- Include Progress Bar width and continuous `0–100%` value controls within contract-supported bounds.
- Show active component ID, parameters, source version, and renderer version as read-only traceability data.
- Treat this as one implementation cycle; stop after the bounded controls, equivalence tests, and review evidence are complete.
- Exclude Panel resizing, arbitrary layer or material editing, persistence, source-spec mutation, and new runtime dependencies.

## Decision

The project owner chose **Option A** on 2026-07-16. Implementation is authorized only within the approved prototype boundary. Any expansion requires a new change review.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Registered project-owner request and initial bounded impact review | Codex |
| 2026-07-16 | Approved Option A as one scope-boxed shared-renderer prototype with explicit controls, exclusions, and equivalence requirements | Project owner / Codex |
