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
| AI analysis | 🟢 M3/V3 gate passed | Frostbound passed V3 at `94/100`; every mandatory minimum was met, no blocker or defect remained, and simplified ornamental fidelity is a non-blocking observation |
| Asset delivery | 🟢 M4-A1 package complete | Frostbound Reward is assembled as 62 independently extractable SVG/PNG modules across five components with stable IDs, hashes, and usage guidance |
| Component showcase | 🟢 Bounded prototype complete | Button and Progress controls use shared deterministic SVG recipes with traceability, boundary enforcement, and desktop/mobile evidence |

| Focus | Current value |
|---|---|
| Active milestone | ⚪ **M9 — Frostbound production-fidelity systems** |
| Next task | 🔵 **Implement M9 shared lighting model** · 🤖 Agent |
| Next agent-ready task | M9-A8 — add a shared lighting model for edge, material, focal, ornament, and typography systems |
| Last reviewed | 2026-07-18 |
| Project owner | 🧭 To be assigned |

## 3. Objective boundaries

### In scope

- Layer-based components: button, panel, progress bar, tab, card, badge, popup, toggle, and icon container.
- Design tokens, reusable material packs, deterministic state generation, and engine-neutral asset delivery.
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
| 🟢 | M3 | AI-assisted analysis and material intake | 🟢 V3 Pass — `94/100` |
| 🟢 | M4 | Modular asset delivery | 🟢 Passed — 62-module engine-neutral package validated |
| 🟢 | M5 | Production hardening and regression suite | 🟢 Passed — Frostbound-only hardening accepted for M5 exit |
| 🟢 | M6 | Optional showcase scaling and workflow review | 🟢 Deferred — Markdown + showcase remain sufficient |
| 🟢 | M7 | Reference-fidelity style expansion | 🟢 V7 Pass — `90.5/100`; 68 engine-neutral modules, evidence, and showroom validated |
| ⚪ | M8 | Frostbound-aligned angular refinement | 🔵 Definition/specification slice is next; retain M7 geometry and improve icy material/focal fidelity |

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
| P1 | Review and approve the V1 visual-review rubric | 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Option A approved by the project owner on 2026-07-16; V1 focuses on reusable high-quality structured SVG |
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
| P0 | Implement M3-S2 deterministic proposal normalizer and reviewer-editable review artifact | 🤖 Agent | 🟢 Complete | Deterministic normalized analysis, pending review JSON, and browser-editable review form separate observations/recommendations, display confidence, enforce immutable legal decisions/mapping gates, and emit accepted/edited proposal-to-token lineage with source and reviewer provenance |
| P0 | Implement M3-S3 Frost Crystal material intake and reviewed draft package | 🤖 Agent | 🟢 Complete | Independent procedural sources contain no concept pixels or component effects; hashes, preflight, isolation previews, four-type reuse plan, and pending approval package validate |
| P0 | Review and approve M3-S3 Frostbound analysis decisions and draft package | 🧭 Product + 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Option A approved on 2026-07-17: all four critical proposals, three material sources and normalization settings, four-type reuse plan, and five-item component inventory accepted as drafted; M3-S4 unblocked |
| P0 | Implement M3-S4 approved Frostbound component family and comparison view | 🤖 Agent | 🟢 Complete | Five approved specs drive a deterministic 26-variant matrix, two panel/button/progress/emblem sizes, independent progress parts at `10/50/75/90`, selected-state and primary/secondary proof, portrait render, and annotated comparison with no concept references in production outputs |
| P0 | Prepare M3-S5 V3 evidence package and preflight | 🤖 Agent | 🟢 Complete | V3-E01–V3-E10, unscored review record, defect log, 54 output receipts, source provenance, four-type material audit, consolidated review views, and automated preflight are ready for scoring |
| P0 | Conduct the M3-S5 V3 human fidelity review | 🧭 Product + 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Option A recorded `94/100`; every mandatory minimum met, no blocker or defect remained, and V3 passed on 2026-07-17 |
| P0 | Define and assemble the engine-neutral modular asset handoff package | 🤖 Agent | 🟢 Complete | `assets/frostbound-reward` contains 62 independently extractable SVG/PNG modules across panel, primary button, secondary button, progress, and emblem; manifest receipts, unique IDs, and package validation pass |
| P0 | Define the M5 production-hardening validation batch | 🤖 Agent | 🟢 Complete | [M5 plan](implementation/M5_PRODUCTION_HARDENING_VALIDATION_PLAN.md) and baseline receipt define clean-workspace reproduction, strict receipt/golden checks, five-run timing, size/matrix controls, and readability evidence |
| P0 | Implement and run the M5 Frostbound reproducibility/regression batch | 🤖 Agent | 🟢 Complete | Passing receipt records clean-workspace assembly, strict byte receipts, five-run timing, package size, state/part matrix, and four target-scale readability views |
| P1 | Remove retired Unity workflow references from active governance (R-002) | 🤖 Agent | 🟢 Complete | Active validation/governance guidance follows ADR-014's engine-neutral boundary; historical records remain auditable and dead Unity-module links are removed |
| P1 | Decide export-manifest compatibility migration (R-004) | 🧭 Project owner + 🛠️ Technical lead | 🟢 Complete | Option A approved on 2026-07-17: legacy `1.0`/`1.1` manifests are archival-only; live outputs move to a versioned engine-neutral successor |
| P1 | Implement engine-neutral export-manifest successor | 🤖 Agent | 🟢 Complete | Export-manifest `1.2`, canonical example, live renderer manifest outputs, and tests are engine-neutral; legacy `1.0`/`1.1` validation remains archival |
| P2 | Define post-A2 M5 hardening slices (R-005) | 🤖 Agent | 🟢 Complete | Remaining migration/rollback, backup/recovery, release procedure, and multi-style coverage work is split into M5-A3 through M5-A6 with owners and exit criteria |
| P1 | Implement manifest migration and rollback drill (M5-A3) | 🤖 Agent | 🟢 Complete | Migration/rollback receipt proves live `1.2` manifest handling, archival legacy evidence retention, failure reporting, and unchanged approved package bytes |
| P2 | Implement package backup and recovery drill (M5-A4) | 🤖 Agent | 🟢 Complete | Recovery evidence restores or rebuilds the Frostbound package from pinned inputs and verifies byte equality |
| P2 | Draft release operating procedure and exception policy (M5-A5) | 🤖 Agent | 🟢 Complete | Checklist defines validation gates, evidence paths, sign-off, exception policy, rollback decision points, and handoff artifacts |
| P2 | Decide multi-style hardening coverage (M5-A6) | 🧭 Project owner + 🛠️ Technical lead | 🟢 Complete | Option A approved: Frostbound-only hardening is sufficient for M5 exit; multi-style coverage is deferred as a future scaling risk |
| P3 | Decide M6 workflow scaling need | 🧭 Project owner + 🛠️ Technical lead | 🟢 Complete | Option A approved: keep Markdown controls and the existing showcase; defer dashboard/workflow scaling until coordination pain appears |
| P3 | Decide next production roadmap direction | 🧭 Project owner + 🛠️ Technical lead | 🟢 Complete | Option A approved: start the next production asset package track, focused on stronger reference fidelity, sharper wide-hexagon UI geometry, and expanded style complexity |
| P0 | Draft M7 reference-fidelity style expansion specification | 🤖 Agent | 🟢 Complete | [Reference brief](reference-briefs/M7_REFERENCE_FIDELITY_STYLE_EXPANSION.md), [implementation specification](implementation/M7_REFERENCE_FIDELITY_IMPLEMENTATION_SPEC.md), and [rubric](validation/M7_REFERENCE_FIDELITY_RUBRIC.md) define target/reference requirements, sharp wide-hexagon button and angular UI language, expanded material/ornament complexity, component inventory, validation rubric, evidence plan, and engine-neutral asset-only handoff boundary |
| P0 | Review and approve M7 reference-fidelity definition | 🧭 Product + 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Option A approved as drafted: M7 reference brief, implementation specification, rubric, seven-component inventory, wide-hexagon shape rules, scoring/blockers, and asset-only handoff requirements are accepted |
| P0 | Extend contracts/templates for angular hex geometry and layer model (M7-A3) | 🤖 Agent | 🟢 Complete | Optional component-spec geometry contracts, an M7 wide-hex contract fixture, and deterministic angular renderer helpers prove wide-hexagon bounds, angular layer order, deterministic states, invalid rounded/capsule rejection, compatibility with existing outputs, and no engine scope |
| P0 | Create M7 material pack and approved component specs (M7-A4) | 🤖 Agent | 🟢 Complete | Approved M7 style, four procedural material sources/pack, seven bounded component specs, source-boundary preflight, seven-component reuse plan, isolation views, and focused validation are recorded without reference pixels or engine scope |
| P0 | Render M7 component matrix, portrait composition, and showroom integration (M7-A5) | 🤖 Agent | 🟢 Complete | 26 SVG/PNG matrix variants, independent progress parts, portrait/target-phone composition, 68-module package, and dedicated showroom validate from the same deterministic renderer outputs |
| P0 | Prepare V7 evidence and conduct the V7 reference-fidelity review (M7-A6) | 🧭 Product + 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Project-owner-authorized automated review passed at `90.5/100`; all mandatory minima and evidence requirements are met, no blocker remains, and two comparative art observations are recorded in [the V7 validation record](validation/records/v7-reference-fidelity-style-expansion.md) |
| P0 | Choose the next production direction after M7 | 🧭 Project owner + 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Option A approved: start the bounded M8 Frostbound-aligned angular refinement described by [ADR-019](decisions/ADR-019-frostbound-aligned-m7-refinement.md) |
| P0 | Draft the M8 Frostbound-aligned refinement specification and review rubric (M8-A1) | 🤖 Agent | 🟢 Complete | [M8 specification](implementation/M8_FROSTBOUND_ALIGNED_REFINEMENT_SPEC.md) and [V8 rubric](validation/M8_FROSTBOUND_ALIGNED_REFINEMENT_RUBRIC.md) define bounded cold-material/focal work, preserved M7 contracts, evidence, acceptance criteria, scores, blockers, and asset-only handoff |
| P0 | Review and approve the M8 refinement definition (M8-A2) | 🧭 Product + 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Option A approved: reusable cold material and editable crystal focal treatment apply across all seven M8 components while M7 geometry, modularity, and evidence boundaries remain fixed |
| P0 | Add M8 cold material and focal contracts (M8-A3) | 🤖 Agent | 🟢 Complete | Approved M8 style/material contracts, three source-neutral procedural cold materials, seven-component reuse plan, editable `crystal-focal` contract, source preflight, and isolation evidence validate without reference pixels or M7 receipt mutation |
| P0 | Render the M8 family, package, and showroom (M8-A4) | 🤖 Agent | 🟢 Complete | Versioned 26-render M8 matrix, 68 modular SVG/PNG assets, Frostbound portrait, receipt manifest, and [showroom](../showcase/m8-frostbound-aligned.html) generated without changing M7 lineage |
| P0 | Prepare the M8 V8 evidence package (M8-A5a) | 🤖 Agent | 🟢 Complete | Added V8-E01–E10 unscored review evidence: hierarchy/state/isolation boards, receipt/audit/handoff reports, and defect/preflight records; M8 renderer/assets remain unchanged |
| P0 | Conduct the M8 V8 production-fidelity review (M8-A5) | 🧭 Product + 🎨 Art + ✦ UI + 🛠️ Technical leads | 🟢 Complete | Project owner approved V8 Pass at `90/100`; all minima met, no blockers, and one non-blocking focal/panel observation is retained in the [V8 record](validation/records/v8-frostbound-aligned-refinement.md) |
| P0 | Define M9 Frostbound production-fidelity system slices (M9-A1) | 🤖 Agent | 🟢 Complete | [M9 specification](implementation/M9_FROSTBOUND_PRODUCTION_FIDELITY_SYSTEMS_SPEC.md) defines M9-A2–A11 in dependency order, including shared lighting and independent three-distance/visual scoring review controls |
| P0 | Implement M9 layered edge-stack contracts and migration (M9-A2) | 🤖 Agent | 🟢 Complete | Versioned registry and reusable presets migrate M9 Frostbound component/progress frames without changing M7/M8 files; ordering, bounds, determinism, and independent frame/fill validation pass |
| P0 | Implement M9 material-response channels and region bindings (M9-A3) | 🤖 Agent | 🟢 Complete | Versioned source-neutral base/edge/highlight/glow/surface response registry and region resolver bind all seven components; provenance, isolation/combined target-size output, renderer integration, and focused validation pass |
| P0 | Implement M9 seeded variation channels and receipts (M9-A4) | 🤖 Agent | 🟢 Complete | Versioned bounded channel registry, explicit unsigned seed resolver/receipt, zero-detail baseline, and region-local renderer metadata validate deterministic same/different-seed behavior across all approved components |
| P0 | Implement M9 structural and ornament separation (M9-A5) | 🤖 Agent | 🟢 Complete | Versioned deterministic ornament anchors/bindings render independently from structure with explicit clipping and mirrored reuse; content bounds remain unchanged |
| P0 | Implement M9 focal-object framework (M9-A6) | 🤖 Agent | 🟢 Complete | Versioned crystal and placeholder focal presets expose independently addressable optional layers and integrate with M9 panel/icon outputs deterministically |
| P0 | Implement M9 typography treatments (M9-A7) | 🤖 Agent | 🟢 Complete | Reusable title/action treatments provide independent face/bevel layers with deterministic width fitting and stable pressed/disabled behavior |
| P0 | Implement M9 shared lighting model (M9-A8) | 🤖 Agent | 🔵 Agent-ready | Versioned shared lighting coherently drives edge, material, focal, ornament, and typography effects within budgets |
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
| ADR-011 | Use the Neon Market Kit and Neon Alloy material direction for V2 | 🟢 Accepted | Exercises the complete M2 component family while extending the proven Neon Core baseline; see [decision record](decisions/ADR-011-v2-neon-market-kit.md) |
| ADR-012 | Use the Frostbound Reward Popup and bounded reconstruction family for V3 | 🟢 Accepted | Tests human-controlled concept analysis, new-theme transfer, action hierarchy, selected-state clarity, and reusable material intake without concept-pixel extraction; see [decision record](decisions/ADR-012-v3-frostbound-reward.md) |
| ADR-014 | Final delivery is engine-neutral modular UI assets | 🟢 Accepted | Project owner requires independently extractable, usable asset modules with no engine integration scope |
| ADR-015 | Archive legacy export manifests and move live output to an engine-neutral successor | 🟢 Accepted | Keeps historical evidence auditable while removing retired engine metadata from the live production contract; see [decision record](decisions/ADR-015-export-manifest-compatibility-policy.md) |
| ADR-016 | Use Frostbound-only hardening coverage for M5 exit | 🟢 Accepted | M5 closes on the fully hardened Frostbound package; multi-style coverage is deferred as a future scaling risk; see [decision record](decisions/ADR-016-m5-frostbound-only-hardening-coverage.md) |
| ADR-017 | Defer M6 dashboard and workflow scaling | 🟢 Accepted | Markdown controls plus the renderer-backed showcase remain sufficient; dashboard work is deferred until coordination pain appears; see [decision record](decisions/ADR-017-defer-m6-dashboard-workflow-scaling.md) |
| ADR-018 | Start M7 reference-fidelity style expansion | 🟢 Accepted | The next production package must improve reference fidelity beyond the current rounded-corner UI language, with sharper wide-hexagon buttons, angular forms, richer style complexity, and engine-neutral asset-only delivery; see [decision record](decisions/ADR-018-reference-fidelity-style-expansion.md) |

## 7. Top risks and responses

| Risk | Signal | Response | Owner |
|---|---|---|---|
| 🟡 Scope expands into a general editor | Requests add arbitrary drawing/node features | Apply `CHANGE_CONTROL.md`; defer unless tied to validation evidence | 🧭 Product owner |
| 🟡 Art quality feels too procedural | Review score is below target | Add controlled material/decal layers before increasing renderer complexity | 🎨 Art + ✦ UI leads |
| 🟡 AI output drifts by component | Palette/lighting differs across assets | Normalize into material packs and enforce tokens | 🛠️ Technical lead |
| 🟡 Renderer cannot meet mobile needs | Export size or render time misses budget | Bake raster where needed; keep source specs deterministic | 🛠️ Technical lead |
| 🟡 Asset modules are coupled or hard to find | Consumers need project-specific context to use assets | Keep portable modules, stable IDs, and source-to-output receipts together | 🤖 Agent |
| 🟡 Multi-style hardening remains unproven | A second production package needs release hardening | Treat as an accepted M5 scaling risk per ADR-016; revisit when another production package is selected | 🧭 Product owner + 🛠️ Technical lead |
| 🟡 Dashboard/workflow scaling may become useful later | Markdown review becomes slow, duplicated, or hard to audit | Treat as deferred per ADR-017; create a scoped task only when a concrete coordination problem appears | 🧭 Product owner + 🛠️ Technical lead |
| 🟡 Reference fidelity can drift toward the old rounded baseline | New assets repeat existing rounded-corner button/panel language instead of the selected sharper reference direction | Require M7-A1 to define shape-language rules, especially sharp wide-hexagon buttons and angular containers, before rendering begins | 🎨 Art + ✦ UI + 🛠️ Technical leads |

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
| 2026-07-16 | Approved the V1 rubric with reusable structured SVG as the M1 target and unblocked V1 evidence preparation | Project owner |
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
| 2026-07-17 | Completed M3-S2 deterministic normalization, reviewer-editable pending artifact, decision workflow, and proposal-to-token lineage; queued M3-S3 | Codex |
| 2026-07-17 | Completed M3-S3 Frost Crystal procedural intake, source audit, deterministic preflight/isolation evidence, four-type reuse plan, and pending human approval package; blocked M3-S4 on explicit review | Codex |
| 2026-07-17 | Approved M3-S3 Option A as drafted, recorded accepted proposal/material/reuse/inventory lineage, and unblocked M3-S4 | Project owner / Codex |
| 2026-07-17 | Completed M3-S4 with five approved specs, deterministic Frostbound recipes, a 26-variant matrix, independent progress parts, portrait reconstruction, and annotated concept comparison; queued V3 evidence preparation | Codex |
| 2026-07-17 | Prepared V3-E01–V3-E10 with approved-input, matrix, material, provenance, and no-pixel audits; added consolidated phone/light-dark/state/hierarchy views, an unscored review record, defect log, and passing automated preflight; opened the human V3 gate | Codex |
| 2026-07-17 | Accepted ADR-014 and removed all engine-specific work; M4 now targets engine-neutral modular asset delivery | Project owner / Codex |
| 2026-07-17 | Completed M4-A1 with the tracked Frostbound modular asset package, 62 source/derivative files, stable IDs, SHA-256 receipts, and package validation | Codex |
| 2026-07-17 | Completed M5-A1 production-hardening definition with a fixed Frostbound baseline, batch contract, regression policy, receipt fields, and M5-A2 exit conditions | Codex |
| 2026-07-17 | Defined the `Review:` weakness-assessment record and `Apply Review:` one-task remediation workflow | Codex |
| 2026-07-17 | Applied review R-001: aligned M4 completion and M5-A2 next-task status across active project controls | Codex |
| 2026-07-17 | Completed M5-A2 with clean-workspace byte reproduction, five-run timing, matrix verification, and four readability receipts; queued R-002 | Codex |
| 2026-07-17 | Completed review R-002: aligned active validation governance with ADR-014 and removed dead Unity-module navigation | Codex |
| 2026-07-17 | Approved R-004 Option A: archive legacy export manifests and queue an engine-neutral successor for live output | Project owner / Codex |
| 2026-07-17 | Implemented export-manifest `1.2` as the live engine-neutral manifest and kept legacy validation archival | Codex |
| 2026-07-18 | Completed R-005 by defining M5-A3 through M5-A6 and queued M5-A3 migration/rollback drill | Codex |
| 2026-07-18 | Completed M5-A3 manifest migration/rollback drill with a passing receipt and unchanged approved package bytes; queued M5-A4 backup/recovery drill | Codex |
| 2026-07-18 | Completed M5-A4 package backup/recovery drill with restore and rebuild evidence; queued M5-A5 release procedure | Codex |
| 2026-07-18 | Completed M5-A5 release operating procedure and exception policy; queued M5-A6 multi-style coverage decision | Codex |
| 2026-07-18 | Approved M5-A6 Option A: Frostbound-only hardening is sufficient for M5 exit; queued M6 workflow scaling decision | Project owner / Codex |
| 2026-07-18 | Approved M6 Option A: defer dashboard/workflow scaling; queued next roadmap direction decision | Project owner / Codex |
| 2026-07-18 | Approved next roadmap Option A: start M7 reference-fidelity style expansion with sharper wide-hexagon UI geometry and expanded style complexity; queued M7-A1 specification | Project owner / Codex |
| 2026-07-18 | Completed M7-A1 with a draft reference brief, implementation specification, and visual-fidelity rubric; queued M7 definition review | Codex |
| 2026-07-18 | Approved M7 definition Option A as drafted and queued M7-A3 angular hex contracts/templates | Project owner / Codex |
| 2026-07-18 | Completed M7-A3 with optional geometry contracts, a wide-hex contract fixture, angular renderer helpers, and focused rejection/layer/state tests; queued M7-A4 | Codex |
| 2026-07-18 | Completed M7-A4 with an approved M7 style, four procedural material sources, reusable faceted material pack, seven approved component specs, preflight/reuse/isolation evidence, and focused contract/material validation; queued M7-A5 | Codex |
| 2026-07-18 | Completed M7-A5 with a 26-variant SVG/PNG matrix, independent progress parts, portrait/target-phone composition, 68-module asset package, package validation, and dedicated M7 showroom; queued V7 human fidelity review | Codex |
| 2026-07-18 | Passed M7-A6 at `90.5/100` via the project-owner-authorized automated review; completed the V7 evidence package, asset-only handoff, and comparative Frostbound assessment with two non-blocking art observations | Project owner / Codex |
| 2026-07-18 | Approved Option A: start the bounded M8 Frostbound-aligned angular refinement; preserve M7 geometry and modularity while improving reusable icy material/focal treatment | Project owner / Codex |
| 2026-07-18 | Completed M8-A1 draft specification and V8 rubric; queued M8 definition review before any rendering | Codex |
| 2026-07-18 | Approved M8-A2 Option A as drafted; authorized M8-A3 reusable cold material/focal contract implementation for all seven components | Project owner / Codex |
| 2026-07-18 | Completed M8-A3 cold material/focal contracts, seven-component reuse/preflight/isolation evidence, and focused validation; queued M8-A4 rendering/package/showroom work | Codex |
| 2026-07-18 | Approved Option B: keep M8-A4 bounded and stage the production-fidelity systems as M9 immediately after M8 review, before multi-style transfer | Project owner / Codex |
| 2026-07-18 | Completed M8-A4: generated the versioned cold-material/focal render matrix, modular asset package, portrait, receipt manifest, and showroom; queued V8 review | Codex |
| 2026-07-18 | Chose V8 review Option B: prepare missing review evidence before the human score; M8-A5a is agent-ready and does not authorize renderer or asset changes | Project owner / Codex |
| 2026-07-18 | Approved V8 Option A: M8 passes at `90/100` with no blockers; retained V8-O001 as a non-blocking M9 observation and unblocked M9 definition | Project owner / Codex |
| 2026-07-18 | Completed M9-A1: defined ordered M9-A2–A11 renderer, validation, integration, and human-review slices; opened edge-stack implementation | Codex |
| 2026-07-19 | Completed M9-A2: added reusable versioned edge-stack contracts/presets and M9 Frostbound component/progress frame migration with focused contract and renderer validation; opened material-response implementation | Codex |
| 2026-07-19 | Completed M9-A3: added source-neutral material-response registry/resolver, all-channel isolation surfaces, seven-component region bindings, provenance references, and focused validation; opened seeded variation implementation | Codex |
| 2026-07-19 | Completed M9-A4: added bounded seeded variation presets, region bindings, typed seed receipts, zero baseline, and renderer trace metadata with same/different-seed validation; opened structural/ornament separation | Codex |
| 2026-07-19 | Completed M9-A5: added deterministic independent ornament anchors, clipping/mirroring metadata, and focused structural-bound validation; opened focal-object framework | Codex |
| 2026-07-19 | Completed M9-A6: added versioned focal presets with independently addressable optional layers and M9 panel/icon integration; opened typography treatments | Codex |
