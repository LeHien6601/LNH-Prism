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

**Exit gate:** assets meet the V1 rubric, remain reusable and structurally inspectable at two sizes, and changes to palette/radius/shadow propagate without manual repainting. Unity integration is deferred to M4.

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

## 🟡 M4 — Unity export and integration

**Goal:** make handoff dependable.

- Export PNG/SVG where appropriate, state files, 9-slice borders, pivot, PPU, grouping, and manifest.
- Add deterministic asset IDs and collision-safe naming.
- Build Unity importer/configuration support or clear manifest-driven setup.
- Test scaling, states, atlas grouping, and re-export without broken references.

**Practical validation V4:** replace a small playable UI flow in Unity—such as reward claim or shop purchase—with generated assets and all required states.

**Approved V4 target:** Frostbound Reward Claim on Unity `6000.3.18f1`, using uGUI and the Built-in Render Pipeline in one bounded sample project. Validate in the Windows Editor and an Android portrait build at the existing `540 × 960` logical / `1080 × 1920` presentation scale. The flow covers a 9-sliced panel, primary/secondary actions, progress values, reward-emblem states, manifest-driven import, stable IDs/references, atlas grouping, and idempotent re-export. See [ADR-013](decisions/ADR-013-m4-unity-reward-claim-baseline.md).

**Definition gate:** 🟢 Approved on 2026-07-17 — Option A accepted the [M4 implementation specification](implementation/M4_UNITY_EXPORT_IMPLEMENTATION_SPEC.md) and [V4 integration rubric](validation/V4_UNITY_INTEGRATION_RUBRIC.md) with manifest `1.1`/legacy `1.0` compatibility and authoritative kebab-case naming; M4-S1 may begin.

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
| 2026-07-17 | Approved the bounded Frostbound Reward Claim and Unity `6000.3.18f1` uGUI/Built-in baseline for V4; queued M4 specification and rubric drafting | Project owner / Codex |
| 2026-07-17 | Drafted the M4 implementation specification and V4 Unity integration rubric; implementation remains gated on Product, Technical, and Unity approval | Codex |
| 2026-07-17 | Approved M4 definition Option A with manifest versioning and naming clarifications; opened M4-S1 contract implementation | Project owner / Codex |
| 2026-07-17 | Completed M4-S1 manifest/registry contracts, semantic identity validation, canonical fixtures, negative tests, and migration guidance; opened M4-S2 bundle generation | Codex |
| 2026-07-17 | Completed M4-S2 deterministic Frostbound Unity bundle, manifests, stable-ID registry, collision audit, and repeat-export proof; opened M4-S3 bounded Unity project/importer implementation | Codex |
