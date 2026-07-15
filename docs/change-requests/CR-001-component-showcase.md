# CR-001 — Replace the Status Dashboard with a Component Showcase

| Field | Value |
|---|---|
| Status | 🟢 Approved |
| Date | 2026-07-16 |
| Owner | 🧭 Project owner |
| Classification | Incremental improvement |

## Problem

A project-status dashboard does not directly prove visual quality, editable text policy, state behavior, or real-context use of LNH Prism output. M1 needs a review surface for generated components instead.

## Approved change

Replace the deferred HTML status dashboard with a local, read-only **Component Showcase** at `showcase/index.html`.

The showcase must display deterministic assets produced by LNH Prism. It may provide HTML text/content overlays and scenario framing, but must not recreate component art with CSS or become an asset editor.

## Scope and acceptance criteria

- Show every generated component state and supported size as it becomes available.
- Show components together in at least one realistic mobile UI scenario.
- Preserve editable/localizable text outside generated component artwork.
- Generate display assets with `npm run prepare:showcase`; do not commit generated output.
- Validate asset paths and scenario markup with `npm run validate:showcase`.
- Keep the showcase local and dependency-free during M1.

## Impact review

| Area | Impact |
|---|---|
| Mission | Supports deterministic-output review; no AI source becomes final structure. |
| Renderer | Adds a generated-asset preparation step, not a rendering contract change. |
| Documentation | Replaces the dashboard plan and updates M6 terminology. |
| Unity | No impact; browser review surface only. |
| Scope risk | Contained by read-only, renderer-backed, local-only constraints. |

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Approved renderer-backed component showcase in place of a status dashboard | Project owner |
