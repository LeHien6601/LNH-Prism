# Phased Roadmap

## Delivery rules

Each milestone ends in a gate. A gate can pass only with working evidence, a recorded review, and an updated next task in `PROJECT_OVERVIEW.md`. If a gate fails, fix the smallest root cause and repeat the validation; do not add unrelated capability.

## 🟢 M0 — Foundation and contracts

**Goal:** establish a shared language before implementation.

- Define repository folders, IDs, versioning, and asset naming.
- Write JSON/YAML contracts for style specs, component specs, material packs, and export manifests.
- Select the V1 target: one visual style, target resolution(s), and Primary Button/Panel/Progress Bar briefs.
- Define visual and technical acceptance rubrics for reusable deterministic assets.

**Exit gate:** contracts reviewed by art, UI, and engineering; no ambiguity about the three V1 assets.

## 🟢 M1 — Deterministic MVP renderer

**Goal:** prove that controlled layers can replace screenshot extraction for core UI.

- Implement primitives: rounded/cut-corner shape, fill/gradient, stroke, clipping, outer shadow, inner shadow, top highlight, and noise overlay.
- Implement Button, Panel, and Progress Bar templates.
- Render fixed dimensions with reusable, structurally layered SVG as the canonical V1 component output; keep PNG as a deterministic preview/export derivative.
- Create normal, pressed, and disabled button states using parameters—not new AI generations.

**Practical validation V1:** produce the three assets for an actual game screen, inspect them on light/dark backgrounds and at target-phone scale, and verify named SVG layers, independent reusable parts, deterministic variants, and traceable manifests.

**Exit gate:** assets meet the V1 rubric, remain reusable and structurally inspectable at two sizes, and changes to palette/radius/shadow propagate without manual repainting.

## 🟢 M2 — Design system and reusable materials

**Goal:** make style application systematic across a component family.

- Add global tokens, component variants, state recipes, size variants, and parameter inheritance.
- Add image texture masking, tiling/offset, blend controls, procedural grain/pattern, and decal slots.
- Define material-pack versioning and normalization.
- Add 9-slice-aware component rules.

**Practical validation V2:** create a shop or reward popup set: panel, primary/secondary buttons, currency badge, tab, and progress bar from one style pack.

**Approved V2 target:** Neon Market Kit — a portrait mobile shop popup using one reusable Neon Alloy material pack across the panel, category tabs, primary/secondary buttons, currency badge, and limited-offer progress bar. See [ADR-011](decisions/ADR-011-v2-neon-market-kit.md).

**Definition gate:** 🟢 Approved on 2026-07-16 — the [M2 implementation specification](implementation/M2_NEON_MARKET_IMPLEMENTATION_SPEC.md) and [V2 review rubric](validation/V2_VISUAL_REVIEW_RUBRIC.md) govern the ordered M2 slices; M2-S1 may begin.

**Exit gate:** 🟢 Passed on 2026-07-17 at `93/100` — one style change updated all six components consistently, every mandatory dimension minimum was met, and no blocker remained.

## 🟢 M3 — AI-assisted design analysis and material intake

**Goal:** use AI for acceleration while retaining human-controlled specifications.

- Convert screenshot/style-board analysis into a proposed style specification with confidence and source annotations.
- Add palette, spacing, radius, lighting, and component-tree suggestions.
- Import AI-generated seamless material sources, normalize them, and bind them to material packs.
- Add visual comparison between concept reference and deterministic render.

**Practical validation V3:** start with a new AI concept screen; create a reviewed style spec and rebuild its key UI family without extracting components from the image.

**Approved V3 target:** Frostbound Reward Popup — a portrait mobile reward screen at `540 × 960` logical / `1080 × 1920` presentation scale. The bounded reconstruction covers a reward panel, primary/secondary button family, progress bar, and reusable reward-emblem container. The generated concept is reference evidence only; its pixels cannot become production sources. See [ADR-012](decisions/ADR-012-v3-frostbound-reward.md).

**Definition gate:** 🟢 Approved on 2026-07-17 — Option A accepted the [M3 implementation specification](implementation/M3_FROSTBOUND_ANALYSIS_IMPLEMENTATION_SPEC.md) and [V3 review rubric](validation/V3_CONCEPT_RECONSTRUCTION_RUBRIC.md) as drafted; M3-S1 may begin.

**Exit gate:** 🟢 Passed on 2026-07-17 at `94/100` — human reviewers controlled every critical proposal, no suggestion bypassed spec review, one traceable material pack served four component types, every mandatory dimension minimum was met, and no blocker or defect remained.

## 🟡 M4 — Modular asset delivery

**Goal:** make final UI assets independently extractable and usable without an engine project.

- Package each component/part as a small engine-neutral module with deterministic source and approved SVG/PNG derivatives.
- Preserve stable asset IDs, dimensions, state/part boundaries, 9-slice guidance where relevant, and source/material/output provenance.
- Provide concise extraction and use guidance with no engine-project dependency.

**Practical validation M4-A:** inspect the package outside an engine project and confirm that every required module can be identified, extracted, traced, and used from its package alone.

**Scope decision:** [ADR-014](decisions/ADR-014-engine-neutral-modular-asset-delivery.md) defines M4 as an engine-neutral asset package.

**Exit gate:** 🟢 Passed on 2026-07-17 — all approved Frostbound assets are delivered as independently usable modules with deterministic source, derivatives, metadata, and provenance; no engine integration is required.

## ⚪ M5 — Production hardening

**Goal:** make the system trustworthy for repeated production use.

**Definition status:** 🟡 M5-A1 through M5-A5 complete — [the Frostbound validation plan](implementation/M5_PRODUCTION_HARDENING_VALIDATION_PLAN.md), receipts, and release procedure prove clean-workspace reproduction, strict asset receipts, timing, matrix, readability validation, manifest migration/rollback, backup/recovery, and release controls. M5-A6 multi-style hardening coverage remains a human decision.

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
| 2026-07-16 | Recorded the failed V1 gate caused by the mandatory traceability minimum and entered the M1 corrective/revalidation cycle | Project owner / Codex |
| 2026-07-16 | Passed V1 at `93/100` after the appended Traceability `5/5` re-score; retained V1-D003 as a non-blocking post-gate improvement | Project owner / Codex |
| 2026-07-16 | Closed the post-gate V1-D003 connected-extrusion improvement and completed the M1 corrective cycle | Codex |
| 2026-07-16 | Approved the scope-boxed CR-002 shared-renderer showcase prototype as a post-M1 validation improvement | Project owner / Codex |
| 2026-07-16 | Completed and closed CR-002; advanced project control to the V2 target-screen and first-material decision | Codex |
| 2026-07-16 | Approved the Neon Market Kit and Neon Alloy direction as the M2/V2 target; queued specification and rubric drafting before implementation | Project owner / Codex |
| 2026-07-16 | Drafted the M2 implementation specification and V2 review rubric; added a human definition gate before M2-S1 contract/resolver work | Codex |
| 2026-07-16 | Approved Option A, clarified the V2 Conditional-pass floor to `82`, and opened M2-S1 contract/resolver implementation | Project owner / Codex |
| 2026-07-17 | Recorded V2 Pass at `93/100`, completed M2, and opened M3 target definition | Project owner / Codex |
| 2026-07-17 | Selected Frostbound Reward for V3 and drafted the M3 implementation specification and concept-reconstruction rubric for human definition review | Project owner / Codex |
| 2026-07-17 | Approved M3 definition Option A as drafted and opened M3-S1 contract implementation | Project owner / Codex |
| 2026-07-17 | Passed V3 at `94/100` with every mandatory minimum met and no blockers or defects; completed M3 and opened M4 target definition | Project owner / Codex |
| 2026-07-17 | Accepted ADR-014, removed engine-specific work, and set M4 to engine-neutral modular asset delivery | Project owner / Codex |
| 2026-07-17 | Passed M4-A1 modular asset delivery with the tracked Frostbound package and deterministic receipt validation; opened M5-A1 | Codex |
| 2026-07-17 | Completed M5-A1 definition and opened M5-A2 reproducibility/regression batch implementation | Codex |
| 2026-07-17 | Passed M5-A2 reproducibility/regression validation; retained deferred hardening slices for a later scope decision | Codex |
| 2026-07-18 | Completed M5-A3 through M5-A5 hardening controls and queued the M5-A6 multi-style coverage decision | Codex |
