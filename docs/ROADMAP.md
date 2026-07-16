# Phased Roadmap

## Delivery rules

Each milestone ends in a gate. A gate can pass only with working evidence, a recorded review, and an updated next task in `PROJECT_OVERVIEW.md`. If a gate fails, fix the smallest root cause and repeat the validation; do not add unrelated capability.

## 🟡 M0 — Foundation and contracts

**Goal:** establish a shared language before implementation.

- Define repository folders, IDs, versioning, and asset naming.
- Write JSON/YAML contracts for style specs, component specs, material packs, and export manifests.
- Select the V1 target: one visual style, target resolution(s), and Primary Button/Panel/Progress Bar briefs.
- Define visual and technical acceptance rubrics for reusable deterministic assets.

**Exit gate:** contracts reviewed by art, UI, and engineering; no ambiguity about the three V1 assets.

## ⚪ M1 — Deterministic MVP renderer

**Goal:** prove that controlled layers can replace screenshot extraction for core UI.

- Implement primitives: rounded/cut-corner shape, fill/gradient, stroke, clipping, outer shadow, inner shadow, top highlight, and noise overlay.
- Implement Button, Panel, and Progress Bar templates.
- Render fixed dimensions with reusable, structurally layered SVG as the canonical V1 component output; keep PNG as a deterministic preview/export derivative.
- Create normal, pressed, and disabled button states using parameters—not new AI generations.

**Practical validation V1:** produce the three assets for an actual game screen, inspect them on light/dark backgrounds and at target-phone scale, and verify named SVG layers, independent reusable parts, deterministic variants, and traceable manifests.

**Exit gate:** assets meet the V1 rubric, remain reusable and structurally inspectable at two sizes, and changes to palette/radius/shadow propagate without manual repainting. Unity integration is deferred to M4.

## ⚪ M2 — Design system and reusable materials

**Goal:** make style application systematic across a component family.

- Add global tokens, component variants, state recipes, size variants, and parameter inheritance.
- Add image texture masking, tiling/offset, blend controls, procedural grain/pattern, and decal slots.
- Define material-pack versioning and normalization.
- Add 9-slice-aware component rules.

**Practical validation V2:** create a shop or reward popup set: panel, primary/secondary buttons, currency badge, tab, and progress bar from one style pack.

**Exit gate:** one style change updates the set consistently; reviewers judge cross-component consistency at or above the agreed threshold.

## ⚪ M3 — AI-assisted design analysis and material intake

**Goal:** use AI for acceleration while retaining human-controlled specifications.

- Convert screenshot/style-board analysis into a proposed style specification with confidence and source annotations.
- Add palette, spacing, radius, lighting, and component-tree suggestions.
- Import AI-generated seamless material sources, normalize them, and bind them to material packs.
- Add visual comparison between concept reference and deterministic render.

**Practical validation V3:** start with a new AI concept screen; create a reviewed style spec and rebuild its key UI family without extracting components from the image.

**Exit gate:** human reviewers can correct AI suggestions efficiently; no AI suggestion bypasses spec review; material reuse is demonstrated on at least four components.

## ⚪ M4 — Unity export and integration

**Goal:** make handoff dependable.

- Export PNG/SVG where appropriate, state files, 9-slice borders, pivot, PPU, grouping, and manifest.
- Add deterministic asset IDs and collision-safe naming.
- Build Unity importer/configuration support or clear manifest-driven setup.
- Test scaling, states, atlas grouping, and re-export without broken references.

**Practical validation V4:** replace a small playable UI flow in Unity—such as reward claim or shop purchase—with generated assets and all required states.

**Exit gate:** import needs no asset-by-asset correction beyond documented Unity project defaults.

## ⚪ M5 — Production hardening

**Goal:** make the system trustworthy for repeated production use.

- Add schema validation, deterministic rendering tests, golden-image/regression checks, and visual diff thresholds.
- Measure generation time, asset size, memory, and mobile readability.
- Add error reporting, migration rules, backup/reproducibility, and version compatibility policy.
- Document operating procedures and ownership.

**Practical validation V5:** run a release-like batch for one complete feature area, then recreate it from versioned specs on a clean workspace.

**Exit gate:** reproducibility, performance, QA, and handoff criteria are met; unresolved issues have an owner and release decision.

## ⚪ M6 — Dashboard and workflow scaling (conditional)

**Goal:** reduce coordination overhead only when evidence shows Markdown alone is insufficient.

- Implement the dashboard described in `DASHBOARD_PLAN.md`.
- Read project state from structured source files; dashboard must not become a second source of truth.
- Add milestone, task, decision, risk, validation, and change-request views.

**Exit gate:** dashboard saves review time and remains consistent with source documents.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial roadmap created | Codex |
| 2026-07-15 | Added milestone status indicators | Codex |
| 2026-07-16 | Refocused M1/V1 on reusable high-quality structured SVG output and deferred Unity integration to M4 | Project owner |
