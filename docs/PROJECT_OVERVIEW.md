# Project Overview and Control Page

## 1. Mission

Build an adaptable but controlled UI asset pipeline for mobile games. The pipeline should accept an art direction and produce reusable UI assets whose geometry, states, sizes, and export metadata remain deterministic and editable.

The project succeeds when a small team can produce a coherent UI family faster than manually painting every variant, without accepting the inconsistency and rework of extracting components from AI-generated full-screen images.

## 2. Current status

| Area | State | Evidence / next action |
|---|---|---|
| Product framing | 🟢 Approved baseline | Core principle and system boundary are recorded in `README.md` |
| Architecture | 🟢 M1 render/export stack approved | TypeScript + SVG + `@resvg/resvg-js` + JSON manifests accepted in [ADR-009](decisions/ADR-009-v1-render-export-stack.md) |
| Renderer | 🟢 V1 gate passed and corrections closed | Button, Panel, and independent Progress Bar frame/fill passed V1 at `93/100`; V1-D003 connected extrusion treatment is complete |
| Materials | ⚪ Not started | Define first material pack after renderer baseline |
| AI analysis | ⚪ Not started | Add only after manual style specification is proven |
| Unity export | ⚪ Deferred to M4 | M1/V1 requires no Unity integration; M4 owns importer, runtime, slicing, pivot, and re-export validation |
| Component showcase | 🟢 Bounded prototype complete | Button and Progress controls use shared deterministic SVG recipes with traceability, boundary enforcement, and desktop/mobile evidence |

| Focus | Current value |
|---|---|
| Active milestone | ⚪ **M2 ready for definition** — CR-002 post-M1 experiment closed |
| Next task | 🟣 **Choose the V2 validation target and first material direction** · 🧭 Product + 🎨 Art lead |
| Next agent-ready task | ⚪ None until the V2 target screen and material direction are approved |
| Last reviewed | 2026-07-16 |
| Project owner | 🧭 To be assigned |

## 3. Objective boundaries

### In scope

- Layer-based components: button, panel, progress bar, tab, card, badge, popup, toggle, and icon container.
- Design tokens, reusable material packs, deterministic state generation, and Unity-ready export.
- AI-supported concept generation, material generation/import, analysis suggestions, and visual comparison.
- Repeatable validation using real game UI assets.

### Out of scope until a reviewed change request approves it

- A general-purpose design editor comparable to Figma, Photoshop, or Substance Designer.
- Fully autonomous UI layout/design decisions.
- Treating extracted pixels from concept screenshots as final production assets.
- Character art, backgrounds, logos, or broad game-content pipelines.

## 4. Roadmap at a glance

| State | Milestone | Outcome | Gate |
|---|---|---|---|
| 🟢 | M0 | Contracts, repository, reference brief | 🟢 Architecture review accepted |
| 🟢 | M1 | MVP renderer and three core templates | 🟢 V1 Pass — `93/100` |
| ⚪ | M2 | Tokens, variants, states, material packs | 🟣 Validation V2 review |
| ⚪ | M3 | AI-assisted analysis and material intake | 🟣 Human-reviewed fidelity test |
| ⚪ | M4 | Unity export and import metadata | 🟣 Unity integration test |
| ⚪ | M5 | Production hardening and regression suite | 🟣 Production readiness review |
| ⚪ | M6 | Optional showcase scaling and workflow review | 🟣 Operations review |

Detailed tasks and exit conditions are in [ROADMAP.md](ROADMAP.md).

## 5. Near-term task board

| Priority | Task | Owner | Execution | Exit condition |
|---|---|---|---|---|
| P0 | Draft versioned M0 contracts: style, component, material pack, and export manifest | 🤖 Agent | 🟢 Complete | Schemas and examples validate; 🟢 approved |
| P0 | Review and approve schemas and IDs | 🧭 Product + 🛠️ technical lead | 🟢 Complete | Approved by project owner on 2026-07-15 |
| P0 | Select one style reference and target device scale | 🎨 Art lead | 🟢 Complete | Neon Core selected; `540 × 960` logical portrait canvas and `1080 × 1920` 2× output recorded in the V1 reference brief |
| P0 | Define V1 assets: Primary Button, Panel, Progress Bar | ✦ UI lead | 🟢 Complete | Option A focused briefs approved for `primary-button`, `primary-panel`, and `primary-progress-bar` |
| P1 | Prepare a V1 visual-review rubric draft | 🤖 Agent | 🟢 Complete | V1 rubric defines evidence, scoring, blockers, review roles, and revalidation record |
| P1 | Choose render/export technology | 🛠️ Technical lead | 🟢 Complete | TypeScript + SVG + `@resvg/resvg-js` + JSON manifests accepted in [ADR-009](decisions/ADR-009-v1-render-export-stack.md) |
| P1 | Prove V1 SVG renderer with the Primary Button | 🤖 Agent | 🟢 Complete | Six SVG/PNG outputs cover two sizes and three states; named layers, pinned renderer provenance, manifest hashes, and determinism tests pass |
| P1 | Render the V1 Primary Panel template | 🤖 Agent | 🟢 Complete | SVG and PNG outputs cover both accepted heights with independent shadow, border, fill, grain, highlight, and content layers; manifest and focused tests pass |
| P1 | Align content slots and sync completed components to showcase | 🤖 Agent | 🟢 Complete | Button labels share one centered slot and move `y: +2` when pressed; both Primary Panel sizes and top-to-bottom SVG layer names appear from renderer output |
| P1 | Render the V1 Progress Bar template | 🤖 Agent | 🟢 Complete | Frame and fill remain independently renderable at two widths and 10%, 50%, and 90%; manifests and focused tests pass |
| P1 | Add the completed Progress Bar to the showcase | 🤖 Agent | 🟢 Complete | Both widths and all percentages use independent renderer frame/fill outputs; part separation, layer order, and combined scenario are visible |
| P1 | Review and approve the V1 visual-review rubric | 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Option A approved by the project owner on 2026-07-16; V1 focuses on reusable high-quality structured SVG and defers Unity integration to M4 |
| P1 | Prepare the V1 validation evidence package and record | 🤖 Agent | 🟢 Complete | V1-E01 through V1-E06, light/dark review surfaces, SVG structure checks, defect history, and an unscored traceable record are ready |
| P1 | Conduct the V1 SVG quality review and record scores | 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Review recorded at 91/100 with no blockers; rubric outcome is Fail because Traceability scored 4 below its mandatory minimum of 5 |
| P0 | Audit and close the V1 traceability evidence gap (V1-D004) | 🤖 Agent | 🟢 Complete | Approved inputs, material provenance, renderer/dependency sources, and output hashes are bound in manifests; audit and reviewer-visible chain are ready for re-scoring |
| P0 | Re-score V1 Traceability and reproducibility after V1-D004 | 🧭 Project owner + 🛠️ technical lead | 🟢 Complete | Appended `5/5`; recomputed V1 at `93/100`; no blockers; 🟢 Pass approved without overwriting the original failed review |
| P1 | Improve the connected 3D shadow treatment (V1-D003) | 🤖 Agent | 🟢 Complete | Connected, parameterized extrusion layers remain independently editable and pass desktop/mobile light/dark review at accepted sizes/states |
| P2 | Review bounded real-time showcase controls (CR-002) | 🧭 Product + 🛠️ technical lead | 🟢 Complete | Option A approved on 2026-07-16 as one scope-boxed shared-renderer prototype |
| P2 | Implement the CR-002 shared-renderer prototype | 🤖 Agent | 🟢 Complete | Shared recipes, bounded controls, read-only traceability, exact browser/CLI equivalence, edge tests, and responsive QA are recorded in the [validation record](validation/records/cr-002-showcase-controls.md) |
| P0 | Choose the V2 validation target and first material direction | 🧭 Product + 🎨 Art lead | 🟣 Human decision | Select shop or reward popup context, required component family, and one reusable material direction before M2 implementation tasks are drafted |
| P0 | Require export-manifest provenance at the contract root | 🤖 Agent | 🟢 Complete | Schema and canonical example require a full provenance receipt; a negative contract test rejects omission; all renderer manifests remain valid |

## 6. Decision register

| ID | Decision | Status | Rationale |
|---|---|---|---|
| ADR-001 | AI concepts are references, not extraction sources | 🟢 Accepted | Preserves editability and avoids baked lighting/background contamination |
| ADR-002 | Geometry and final rendering are deterministic | 🟢 Accepted | Ensures consistent sizing, states, and repeatable output |
| ADR-003 | AI textures are reusable material inputs | 🟢 Accepted | Controls cost and style variance |
| ADR-004 | Start with layer presets, not a node editor | 🟢 Accepted | Delivers production value while containing scope |
| ADR-005 | Validate with real assets at every major phase | 🟢 Accepted | Prevents a technically impressive but unusable tool |
| ADR-006 | Use JSON Schema Draft 2020-12 for M0 source contracts | 🟢 Accepted | Portable validation baseline; approved with M0 schemas on 2026-07-15 |
| ADR-007 | Use Neon Core for V1 at `540 × 960` logical / `1080 × 1920` output | 🟢 Accepted | Low-risk deterministic baseline aligned with the existing style contract example |
| ADR-008 | Use focused baseline V1 component briefs | 🟢 Accepted | Proves deterministic core behavior before optional content slots and additional variants |
| ADR-009 | Use TypeScript + SVG + resvg + JSON manifests for V1 | 🟢 Accepted | Keeps source structure editable while providing deterministic headless PNG output; see [decision record](decisions/ADR-009-v1-render-export-stack.md) |
| ADR-010 | Defer Unity integration validation to M4 | 🟢 Accepted | M1/V1 measures reusable structured SVG quality, editability, consistency, and reproducibility; see [decision record](decisions/ADR-010-defer-unity-integration-to-m4.md) |

## 7. Top risks and responses

| Risk | Signal | Response | Owner |
|---|---|---|---|
| 🟡 Scope expands into a general editor | Requests add arbitrary drawing/node features | Apply `CHANGE_CONTROL.md`; defer unless tied to validation evidence | 🧭 Product owner |
| 🟡 Art quality feels too procedural | Review score is below target | Add controlled material/decal layers before increasing renderer complexity | 🎨 Art + ✦ UI leads |
| 🟡 AI output drifts by component | Palette/lighting differs across assets | Normalize into material packs and enforce tokens | 🛠️ Technical lead |
| 🟡 Renderer cannot meet mobile needs | Export size or render time misses budget | Bake raster where needed; keep source specs deterministic | 🛠️ Technical lead |
| 🟡 Unity handoff is fragile | Missing borders/pivots or naming collisions | Add export manifest and integration tests before scaling | 🎮 Unity engineer |

## 8. Review cadence

- **Weekly:** update task board, risks, and blocked decisions.
- **At every gate:** review evidence against the milestone exit criteria; record pass, conditional pass, or fail.
- **After every validation asset:** hold a short retrospective and create corrective tasks before the next validation begins.
- **Monthly:** confirm the roadmap still serves the mission; process changes require a change request.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial control page created | Codex |
| 2026-07-15 | Added execution eligibility and agent-ready M0 task queue | Codex |
| 2026-07-15 | Drafted and validated M0 source contracts; queued V1 rubric work | Codex |
| 2026-07-15 | Added visual status and role indicators for rapid scanning | Codex |
| 2026-07-15 | Drafted the V1 visual-review rubric; human M0 decisions are now next | Codex |
| 2026-07-15 | Approved M0 schemas and examples; advanced to style-reference decision | Project owner |
| 2026-07-15 | Added `Guide:` command for pending human-decision tasks | Codex |
| 2026-07-15 | Selected Neon Core V1 reference and target scale; advanced to V1 asset-brief decision | Project owner |
| 2026-07-15 | Approved focused V1 component briefs; advanced to render/export technology decision | Project owner |
| 2026-07-15 | Accepted V1 render/export stack; completed M0 and queued the bounded M1 renderer proof | Project owner |
| 2026-07-15 | Completed deterministic Primary Button renderer proof; queued Primary Panel template | Codex |
| 2026-07-16 | Replaced the deferred status dashboard with a renderer-backed component showcase | Project owner |
| 2026-07-16 | Completed deterministic Primary Panel proof; queued showcase alignment/sync before Progress Bar | Codex |
| 2026-07-16 | Aligned showcase button content slots, added Panel previews, and exposed SVG layer order | Codex |
| 2026-07-16 | Completed independent V1 Progress Bar frame/fill renderer proof; queued showcase sync | Codex |
| 2026-07-16 | Added all Progress Bar widths/fills, independent-part inspection, layer order, and real-scenario use to the showcase; queued V1 rubric approval | Codex |
| 2026-07-16 | Corrected Progress Bar highlight cap overflow found during showcase review and added an all-variant clipping regression test | Codex |
| 2026-07-16 | Approved the V1 rubric with reusable structured SVG as the M1 target, deferred Unity integration to M4, and unblocked V1 evidence preparation | Project owner |
| 2026-07-16 | Prepared the reproducible V1-E01–V1-E06 package, light/dark SVG review page, structural validator, defect log, and unscored human record | Codex |
| 2026-07-16 | Recorded the 91/100 V1 review; gate failed because Traceability scored below its mandatory minimum; queued traceability and connected-shadow corrections and registered CR-002 | Project owner / Codex |
| 2026-07-16 | Closed V1-D004 with approved and hashed source bindings, real material provenance, a reviewer-visible traceability chain, and reproducibility enforcement; queued human re-scoring | Codex |
| 2026-07-16 | Approved the appended Traceability `5/5` re-score, recorded V1 Pass at `93/100` with no blockers, and advanced to non-blocking V1-D003 | Project owner / Codex |
| 2026-07-16 | Closed V1-D003 with connected parameterized extrusion layers, renderer regressions, and desktop/mobile light/dark visual revalidation; queued CR-002 for human review | Codex |
| 2026-07-16 | Approved CR-002 Option A and queued its scope-boxed shared-renderer Button/Progress prototype as the next agent-ready task | Project owner / Codex |
| 2026-07-16 | Completed CR-002 with shared browser/CLI SVG recipes, bounded controls, traceability, 18 tests, and responsive browser evidence; advanced to the V2 target/material decision | Codex |
| 2026-07-16 | Corrected the export-manifest contract so provenance is mandatory, documented the intentional `1.0` tightening, and added negative omission coverage | Project owner / Codex |
