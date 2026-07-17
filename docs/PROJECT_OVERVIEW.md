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
| Materials | 🟢 V2 gate passed | Neon Market and Neon Alloy passed V2 at `93/100`; shared material reuse, propagation, structure, and traceability met every mandatory minimum |
| AI analysis | 🟡 M3-S1 complete | Concept, analysis, and review contracts enforce source evidence, normalized regions, legal review transitions, and critical-proposal mapping gates; M3-S2 is next |
| Unity export | ⚪ Deferred to M4 | M1/V1 requires no Unity integration; M4 owns importer, runtime, slicing, pivot, and re-export validation |
| Component showcase | 🟢 Bounded prototype complete | Button and Progress controls use shared deterministic SVG recipes with traceability, boundary enforcement, and desktop/mobile evidence |

| Focus | Current value |
|---|---|
| Active milestone | 🟡 **M3 implementation** — M3-S1 contracts complete; M3-S2 may begin |
| Next task | 🔵 **Implement M3-S2 deterministic proposal normalizer and reviewer-editable review artifact** · 🤖 Agent |
| Next agent-ready task | 🔵 **M3-S2** — observation/recommendation separation, confidence display, dispositions, and proposal-to-token lineage are test-covered |
| Last reviewed | 2026-07-17 |
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
| 🟢 | M2 | Tokens, variants, states, material packs | 🟢 V2 Pass — `93/100` |
| 🟡 | M3 | AI-assisted analysis and material intake | 🟣 Human-reviewed fidelity test |
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
| P0 | Choose the V2 validation target and first material direction | 🧭 Product + 🎨 Art lead | 🟢 Complete | Option A approved: Neon Market Kit at the existing portrait scale with one reusable Neon Alloy material pack; see [ADR-011](decisions/ADR-011-v2-neon-market-kit.md) |
| P0 | Draft the M2 implementation specification and V2 review rubric | 🤖 Agent | 🟢 Complete | [Implementation specification](implementation/M2_NEON_MARKET_IMPLEMENTATION_SPEC.md) and [V2 rubric](validation/V2_VISUAL_REVIEW_RUBRIC.md) define versioned requirements, bounded controls, delivery slices, evidence, scoring, blockers, and non-goals |
| P0 | Review and approve the M2 implementation specification and V2 rubric | 🧭 Product + 🎨 Art + 🛠️ technical leads | 🟢 Complete | Option A approved on 2026-07-16; all scope, contract, bounds, slice, evidence, and blocker rules accepted; Conditional Pass clarified to `82–84` |
| P0 | Implement M2-S1 contract extensions and deterministic style resolver | 🤖 Agent | 🟢 Complete | V1 examples remain valid; additive inheritance/material/binding contracts validate; valid overlays resolve deterministically; missing parents, version mismatches, cycles, invalid bounds/bindings, and incomplete resolved styles fail; ancestor provenance is test-covered |
| P0 | Implement M2-S2 Neon Alloy sources, normalization, and masking primitives | 🤖 Agent | 🟢 Complete | Source preflight, tile/edge tests, deterministic hashes, isolated layer previews, and bounded normalization controls are ready for renderer integration |
| P0 | Upgrade shared templates and add Tab/Badge templates for M2-S3 | 🤖 Agent | 🟢 Complete | Shared Panel/Button/Progress recipes and new Tab/Badge recipes implement stable M2 material layers, state/size rules, clipping, and deterministic output coverage |
| P0 | Create six component specs and assemble the M2-S4 Neon Market scenario | 🤖 Agent | 🟢 Complete | CLI/browser equivalence, complete family/state matrix, scenario preview, and target-phone/light-dark inspection assets are ready for the V2 evidence package |
| P0 | Prepare the M2-S5 V2 evidence package and preflight | 🤖 Agent | 🟢 Complete | Produced V2-E01–V2-E09 with 28 matrix variants, propagation/provenance/progress-part proof, an unscored record, and V2-P001 for draft review inputs |
| P0 | Conduct the M2-S5 V2 evidence review | 🧭 Product + 🎨 Art + 🛠️ technical leads | 🟢 Complete | Guided evidence review recorded `93/100`, every mandatory minimum met, no blockers, and 🟢 Pass on 2026-07-17 |
| P0 | Select the V3 concept screen and bounded reconstruction target | 🧭 Product + 🎨 Art lead | 🟢 Complete | Option A approved: Frostbound Reward Popup at `540 × 960` logical / `1080 × 1920`, with bounded Panel–primary/secondary Button–Progress plus reward-emblem container reconstruction and no concept-pixel extraction; see [ADR-012](decisions/ADR-012-v3-frostbound-reward.md) |
| P0 | Draft the M3 implementation specification and V3 review rubric | 🤖 Agent | 🟢 Complete | [Implementation specification](implementation/M3_FROSTBOUND_ANALYSIS_IMPLEMENTATION_SPEC.md) and [V3 rubric](validation/V3_CONCEPT_RECONSTRUCTION_RUBRIC.md) define human-controlled proposals, source/confidence annotations, material intake, bounded reconstruction, evidence, scoring, and blockers |
| P0 | Review and approve the M3 implementation specification and V3 rubric | 🧭 Product + 🎨 Art + ✦ UI + 🛠️ technical leads | 🟢 Complete | Option A approved on 2026-07-17: proposal model, human controls, full reconstruction inventory, material boundary, ordered slices, V3-E01–V3-E10, `≥85` Pass, `83–84` Conditional Pass, and automatic blockers accepted as drafted |
| P0 | Implement M3-S1 analysis, annotation, and review contracts | 🤖 Agent | 🟢 Complete | Concept, analysis, and review schemas plus Frostbound fixtures validate; semantic tests reject missing evidence, escaped normalized regions, mismatched hashes, illegal/inconsistent transitions, unresolved critical mapping, duplicate/drifting review data, and analysis binding mismatches |
| P0 | Implement M3-S2 deterministic proposal normalizer and reviewer-editable review artifact | 🤖 Agent | 🔵 Agent-ready | Observation/recommendation separation, confidence display, dispositions, and proposal-to-token lineage are test-covered |
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
| ADR-011 | Use the Neon Market Kit and Neon Alloy material direction for V2 | 🟢 Accepted | Exercises the complete M2 component family while extending the proven Neon Core baseline; see [decision record](decisions/ADR-011-v2-neon-market-kit.md) |
| ADR-012 | Use the Frostbound Reward Popup and bounded reconstruction family for V3 | 🟢 Accepted | Tests human-controlled concept analysis, new-theme transfer, action hierarchy, selected-state clarity, and reusable material intake without concept-pixel extraction; see [decision record](decisions/ADR-012-v3-frostbound-reward.md) |

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
| 2026-07-16 | Approved Option A for V2: Neon Market Kit with one reusable Neon Alloy pack; queued the M2 specification and V2 rubric as the next agent-ready task | Project owner / Codex |
| 2026-07-16 | Drafted the M2 Neon Market implementation specification and V2 review rubric; queued human scope, contract, art-control, and quality-gate approval before M2-S1 | Codex |
| 2026-07-16 | Approved M2 Option A, clarified Conditional Pass to `82–84`, closed the definition gate, and queued M2-S1 contract/resolver implementation | Project owner / Codex |
| 2026-07-16 | Completed M2-S1 with additive inheritance/material/binding contracts, deterministic resolved-style provenance, and focused rejection coverage; queued M2-S2 | Codex |
| 2026-07-16 | Completed M2-S2 with Neon Alloy procedural sources, bounded normalization and masking utilities, source hashes, seam/edge preflight, and deterministic isolation evidence; queued M2-S3 | Codex |
| 2026-07-16 | Completed M2-S3 with shared deterministic Neon Alloy Button/Panel/Progress/Tab/Badge recipes, stable layer ordering, state/size bounds, clipping, and output tests; queued M2-S4 | Codex |
| 2026-07-16 | Completed M2-S4 with six versioned draft component specs, deterministic Neon Market dark/light scenario previews, and browser/CLI recipe equivalence; queued the human V2 review | Codex |
| 2026-07-16 | Selected staged V2 review Option A: prepare the complete evidence/preflight package before human scoring; queued the bounded agent task | Project owner |
| 2026-07-16 | Prepared and validated V2-E01–V2-E09, including the full matrix, shared-token propagation, independent progress parts, browser/CLI equivalence, source/output receipts, and an unscored record; V2-P001 awaits human input approval | Codex |
| 2026-07-16 | Approved `neon-market`, `neon-alloy-materials`, and all six M2 component specs at `0.1.0`; closed V2-P001 and opened formal V2 scoring | Project owner |
| 2026-07-16 | Verified the reported light-surface black regions were a preview-tool artifact, closed V2-P002 with direct RGBA checks and regression coverage, and retained formal V2 scoring as the next task | Codex |
| 2026-07-17 | Confirmed the six V2 scores, recorded 🟢 Pass at `93/100` with no blockers, closed M2, and opened the human V3 target-selection decision | Project owner / Codex |
| 2026-07-17 | Approved Frostbound Reward Option A, stored its concept receipt, drafted the M3 implementation specification and V3 rubric, and opened the human definition review | Project owner / Codex |
| 2026-07-17 | Approved M3 definition Option A as drafted and unblocked M3-S1 analysis, annotation, and review contracts | Project owner / Codex |
| 2026-07-17 | Completed M3-S1 concept/analysis/review contracts, fixtures, semantic validation, and focused rejection coverage; queued M3-S2 | Codex |
