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

## 🟢 M5 — Production hardening

**Goal:** make the system trustworthy for repeated production use.

**Exit gate:** 🟢 Passed on 2026-07-18 — [the Frostbound validation plan](implementation/M5_PRODUCTION_HARDENING_VALIDATION_PLAN.md), receipts, release procedure, and [ADR-016](decisions/ADR-016-m5-frostbound-only-hardening-coverage.md) prove clean-workspace reproduction, strict asset receipts, timing, matrix, readability validation, manifest migration/rollback, backup/recovery, release controls, and accepted coverage scope. Multi-style hardening is deferred as a future scaling risk.

- Add schema validation, deterministic rendering tests, golden-image/regression checks, and visual diff thresholds.
- Measure generation time, asset size, memory, and mobile readability.
- Add error reporting, migration rules, backup/reproducibility, and version compatibility policy.
- Document operating procedures and ownership.

**Practical validation V5:** run a release-like batch for one complete feature area, then recreate it from versioned specs on a clean workspace.

**Exit gate:** reproducibility, performance, QA, and handoff criteria are met; unresolved issues have an owner and release decision.

## 🟢 M6 — Dashboard and workflow scaling (conditional)

**Goal:** reduce coordination overhead only when evidence shows Markdown alone is insufficient.

**Decision:** 🟢 Deferred on 2026-07-18 — [ADR-017](decisions/ADR-017-defer-m6-dashboard-workflow-scaling.md) keeps Markdown controls and the renderer-backed showcase as the operating model. Dashboard/workflow scaling should start only when a concrete coordination problem appears.

- Keep the showcase plan in [DASHBOARD_PLAN.md](DASHBOARD_PLAN.md) as the renderer-backed visual review surface, not an active project-management dashboard.
- Read project state from structured source files; dashboard must not become a second source of truth.
- Add milestone, task, decision, risk, validation, and change-request views.

**Exit gate:** deferred; no dashboard is required while Markdown controls and the existing showcase remain sufficient.

## ⚪ M7 — Reference-fidelity style expansion

**Goal:** validate a next production package that improves reference fidelity and style complexity beyond the current rounded-corner baseline.

**Decision:** 🟢 Accepted on 2026-07-18 — [ADR-018](decisions/ADR-018-reference-fidelity-style-expansion.md) starts a new asset-only track focused on sharper, wider hexagonal button geometry, angular UI language, richer material/ornament treatment, and engine-neutral modular handoff.

- Draft the M7 implementation specification and visual-fidelity rubric before rendering.
- Define the target/reference constraints and a bounded component inventory.
- Replace rounded button expectations with sharp wide-hexagon geometry where the reference calls for it.
- Expand style complexity through controlled material, edge, lighting, ornament, and state rules.
- Keep final outputs as deterministic, independently extractable, engine-neutral assets shown in the showroom or handed off with exact file/folder addresses.

**Practical validation M7:** produce one approved production package from the M7 specification and review it against the reference-fidelity rubric, package integrity checks, deterministic receipts, and showroom/handoff evidence.

**Definition gate:** 🟢 Approved on 2026-07-18 — Option A accepted the M7 reference brief, implementation specification, visual-fidelity rubric, seven-component inventory, wide-hexagon shape rules, scoring/blockers, and asset-only handoff requirements as drafted. M7-A3 may begin.

**Exit gate:** 🟢 Passed on 2026-07-18 at `90.5/100` — the M7 package meets every mandatory fidelity, modularity, traceability, deterministic-reproduction, and asset-only-handoff criterion with no automatic blocker. Two non-blocking comparative art observations are retained in the V7 validation record.

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
| 2026-07-18 | Accepted Frostbound-only hardening coverage for M5 exit and marked M5 passed | Project owner / Codex |
| 2026-07-18 | Deferred M6 dashboard/workflow scaling and kept Markdown plus showcase as the operating model | Project owner / Codex |
| 2026-07-18 | Selected M7 reference-fidelity style expansion as the next asset-only production track | Project owner / Codex |
| 2026-07-18 | Drafted the M7 reference brief, implementation specification, and visual-fidelity rubric for definition review | Codex |
| 2026-07-18 | Approved the M7 definition package and opened angular hex contract/template implementation | Project owner / Codex |
| 2026-07-18 | Completed M7-A3 angular hex contracts/templates and queued M7 material/spec work | Codex |
| 2026-07-18 | Passed M7 at `90.5/100` with a project-owner-authorized automated review, V7 evidence package, 68 engine-neutral modules, showroom handoff, and no blockers | Project owner / Codex |
| 2026-07-18 | Approved M8 Frostbound-aligned angular refinement: retain M7 geometry and asset-only handoff while addressing reusable icy material and reward-focal observations | Project owner / Codex |

## ⚪ M8 — Frostbound-aligned angular refinement

**Goal:** improve the M7 family’s Frostbound-aligned cold-blue material, crystal/focal presence, and interior hierarchy without weakening its sharp angular geometry, deterministic structure, or modular asset-only handoff.

**Decision:** [ADR-019](decisions/ADR-019-frostbound-aligned-m7-refinement.md) accepted Option A on 2026-07-18.

- Preserve M7 component boundaries and sharp wide-hex geometry.
- Add only reusable, source-neutral ice/crystal materials and independently editable focal treatment.
- Keep the Frostbound concept as review evidence only; no concept pixels may enter production sources or outputs.
- Revalidate showroom visibility, exact asset folders, provenance, and modular output receipts.

**Definition gate:** 🟢 Approved on 2026-07-18 — Option A accepted the [M8 implementation specification](implementation/M8_FROSTBOUND_ALIGNED_REFINEMENT_SPEC.md) and [V8 visual-fidelity rubric](validation/M8_FROSTBOUND_ALIGNED_REFINEMENT_RUBRIC.md) as drafted. The complete seven-component cold-material/focal refinement may begin.

**M8-A3:** 🟢 Complete — versioned M8 cold material/focal contracts, source preflight, seven-component reuse plan, and isolation evidence validate without reference pixels.

**M8-A4:** 🟢 Complete — the M8 package provides a 26-render seven-component matrix, 68 modular SVG/PNG assets, a Frostbound portrait, receipts, and `showcase/m8-frostbound-aligned.html` without mutating M7 outputs.

**M8-A5a:** 🟢 Complete — V8-E01 through E10 now provide target-phone/light-dark/material-focal review surfaces, receipt/audit/handoff reports, and unscored defect/preflight records. Renderer and assets were not altered.

**M8-A5:** 🟢 Pass — project owner approved V8 at `90/100` on 2026-07-18. No automatic blocker; V8-O001 remains a non-blocking M9 observation.

**Next task:** M9-A12 — re-review the corrected M9 package before any multi-style transfer.

**Exit gate:** a reviewed M8 package improves the two V7 observations while retaining M7’s deterministic, modular, engine-neutral asset handoff.

## 🟢 M9 — Frostbound production-fidelity systems

**Decision:** [ADR-020](decisions/ADR-020-stage-production-fidelity-as-m9.md) accepts Option B on 2026-07-18.

**Goal:** after the bounded M8 package establishes a reviewed baseline, turn Frostbound’s material depth, edge hierarchy, focal quality, controlled irregularity, typography, lighting, composition review, and visual-quality controls into reusable deterministic systems before multi-style transfer.

**Dependencies:** M8-A4 and M8-A5 are complete. M9-A1 through M9-A10 and M9-R001 are complete; M9-A12 passed the corrected package review at `85/100`.

**Required ordered capability areas:** layered edge stacks; material-response channels; seeded variation; structural/ornament separation; focal-object framework; typography treatments; shared lighting; three-distance review; visual scoring distinct from technical correctness.

**Boundary:** no concept pixels, unseeded randomness, flattened production structure, engine integration, Volcanic Forge transfer, third-style testing, or style-authoring workflow before M9 is reviewed.

**Implementation sequence:** 🟢 M9-A1 through M9-A10 complete; 🟢 M9-A11 authorized review failed at `65/100`; 🟢 M9-R001 corrected action typography/focal composition and regenerated receipt-validated evidence; 🟢 M9-A12 authorized automated review passed at `85/100`, closing M9-B001 and V8-O001. Multi-style transfer is ready for scope decision but has not begun.

**Exit gate:** 🟢 Passed on 2026-07-19 at `85/100` — the corrected package meets every technical hard gate, contains no automatic blocker, and satisfies all M9 visual minimums. M10 scope definition is required before any multi-style transfer implementation.

## ⚪ M10 — Volcanic Forge second-style transfer

**Decision:** [ADR-021](decisions/ADR-021-volcanic-forge-second-style-transfer.md) accepted Option A on 2026-07-19.

**Goal:** prove the M9 generalized systems can deliver a visibly distinct, warm forged-UI family without rewriting shared component templates or adding a parallel renderer.

**Fixed direction:** reuse angular wide-hex geometry and the seven-component inventory; apply obsidian, brass/forged-metal, and lava material families; warm bottom/inner lighting; seeded soot, crack, and hammered-surface variation; rivet/rune/ember ornaments; engraved-gold typography; molten-core focal treatment; and heat-glow/compression/dim state rules.

**Boundary:** no palette-only reskin, Frostbound-only branch, flattened production assets, concept pixels, unseeded randomness, third-style testing, or authoring workflow.

**Definition gate:** 🟢 Approved on 2026-07-19 — M10-A3 Option B accepted the [M10 implementation specification](implementation/M10_VOLCANIC_FORGE_IMPLEMENTATION_SPEC.md) and [V10 transfer rubric](validation/V10_VOLCANIC_FORGE_TRANSFER_RUBRIC.md), including the explicit lava/ember emission limits. M10-A4 data-binding implementation may begin.

**Review gate:** 🟢 M10-A7 Option A selected on 2026-07-19 — the initial package is returned unscored for M10-R001 remediation. The next delivery must provide complete source/phone/thumbnail surfaces, clean reproduction, canonical inventory mapping, and non-palette-only transfer proof before V10 is re-reviewed.

**Exit gate:** 🟢 V10 passed on 2026-07-19 at `86/100` through a project-owner-authorized automated re-review. All technical hard gates and visual minima passed; `V10-O001` is a non-blocking heat-label/focal-spacing observation. M5-B1 cross-style hardening also passed. Per [ADR-023](decisions/ADR-023-generated-review-reference-workflow.md), R-012a generated and receipted the `1080 × 1920` review-only Volcanic Forge reference. R-013 is now the next Agent-ready task to bind it to formal comparison evidence.

**Re-review gate:** 🔴 V10 failed on 2026-07-19 under Option B. The remediated visuals are diagnostically scored at `78/100`, but a pass is blocked by missing true clean-workspace reproduction, missing recorded seed/zero-baseline output receipts, and unproven no-parallel-renderer compliance. M10-R002 is the next agent-ready remediation.

**Exit gate:** a deterministic, engine-neutral Volcanic Forge package proves shared templates and generalized systems, complete provenance/receipts, target-phone readability, and visual distinction from Frostbound at source, phone, and thumbnail review distances.
