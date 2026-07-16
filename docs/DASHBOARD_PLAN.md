# Component Showcase Proposal and Initial Plan

## Decision

The project owner approved replacing the deferred status-dashboard proposal with a local Component Showcase on 2026-07-16. See [CR-001](change-requests/CR-001-component-showcase.md).

Markdown remains the source of truth for project status, decisions, and governance. The showcase is a renderer-backed visual review surface, not a project-management dashboard.

## Purpose

Provide a read-only local preview of generated UI components in supported states, sizes, and a realistic screen scenario. It must never replace versioned specifications, renderer output, or validation records.

## MVP screens

| View | Contents |
|---|---|
| Component lab | Every available component, state, size, and layer/debug reference |
| Scenario preview | Components combined in a target mobile UI flow |
| Traceability | Generated manifest/source details and renderer version |
| Review notes | Links to authoritative validation records |

## Data model

Generate output assets beneath `showcase/generated/` from the renderer. Create a minimal registry with component IDs, states, sizes, and manifest summaries. Source contracts and manifests remain authoritative.

Do not copy component artwork into HTML/CSS. The page references generated SVG/PNG output; labels, values, and other localizable text remain HTML slots.

## Initial implementation plan

1. Generate deterministic display assets with `npm run prepare:showcase`.
2. Build a dependency-free static page: `showcase/index.html`, `showcase/styles.css`, `showcase/app.js`.
3. Display each generated state and size plus a mobile context preview with editable HTML labels.
4. List each SVG layer by name from topmost to bottommost and validate expected assets, content slots, and scenario markup with `npm run validate:showcase`.
5. Add Panel and Progress Bar entries only when their renderer proofs are complete.
6. Add no editing, asset authoring, accounts, servers, or status-management features in the MVP.

## Acceptance criteria

- A reviewer sees every generated state and supported size in under one minute.
- The scenario uses generated assets without baking button text into them.
- Every displayed asset is reproducible from the renderer and has a manifest/source reference.
- The page works locally with no backend or web dependency.

## Risks

- CSS imitation drifts from renderer output: prevent it by referencing generated SVG/PNG assets only.
- Showcase becomes an editor: lock M1 to read-only previews and HTML content slots.

## Proposed enhancement

[CR-002](change-requests/CR-002-realtime-showcase-controls.md) records a request for bounded real-time component-size and Progress-value controls. It remains unapproved and must not delay M1 corrective work. If approved later, preview output must come from the same deterministic renderer recipes and remain within component-contract bounds.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial dashboard proposal created | Codex |
| 2026-07-16 | Replaced the dashboard proposal with a renderer-backed component showcase | Project owner |
| 2026-07-16 | Added layer-stack labels and content-slot alignment requirements | Project owner |
| 2026-07-16 | Registered bounded real-time preview controls as proposed CR-002 pending M1 revalidation | Codex |
