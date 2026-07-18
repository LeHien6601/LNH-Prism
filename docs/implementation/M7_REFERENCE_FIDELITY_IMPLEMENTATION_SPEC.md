# M7 Implementation Specification — Reference-Fidelity Style Expansion

## Document control

| Field | Value |
|---|---|
| Status | 🟢 Approved — Option A |
| Date | 2026-07-18 |
| Milestone | M7 — Reference-fidelity style expansion |
| Validation target | V7 — angular reference-fidelity asset package |
| Decision source | [ADR-018](../decisions/ADR-018-reference-fidelity-style-expansion.md) |
| Product/art reference | [M7 reference brief](../reference-briefs/M7_REFERENCE_FIDELITY_STYLE_EXPANSION.md) |
| Review rubric | [M7 visual-fidelity rubric](../validation/M7_REFERENCE_FIDELITY_RUBRIC.md) |
| Implementation state | M7 complete; V7 passed at `90.5/100` through project-owner-authorized automated review |

## 1. Intended outcome

M7 will prove that LNH Prism can move beyond the current rounded-corner UI language and produce a sharper, more complex, reference-faithful mobile UI asset package while preserving deterministic structure and asset-only handoff.

The package must demonstrate a coherent angular family: wide-hexagon buttons, chamfered panels, faceted badges/tabs, an angular progress frame, and a reusable icon container. The result must remain modular, traceable, and reusable rather than a painted screenshot reconstruction.

## 2. Required deliverables

- one approved M7 reference brief and one approved M7 implementation specification;
- one approved reusable M7 style specification;
- one approved reusable material pack for faceted metal/crystal/energy treatment;
- seven bounded component specifications from the M7 inventory;
- deterministic SVG/PNG outputs for required states, values, and secondary proof sizes;
- one portrait review composition showing realistic combined use;
- showroom visibility or exact asset file/folder handoff addresses;
- V7 evidence package and completed human visual-fidelity review record.

## 3. Explicit non-goals

- Unity or other engine integration.
- Screenshot slicing, raster tracing, or using reference pixels as final component structure.
- Pixel-perfect imitation of a reference raster.
- Free-form drawing tools, arbitrary node graphs, font selection, animation, layout/game logic, or a general editor.
- Unbounded component catalogs beyond the seven-component M7 validation package.
- Manually repainting state/size variants instead of deterministic parameter changes.

## 4. Component inventory

| Spec ID | Template family | Required variants/states | Baseline logical size | Secondary proof |
|---|---|---|---:|---:|
| `m7-reward-panel` | panel | `normal` | `488 × 660` | `488 × 760` |
| `m7-primary-hex-button` | button | `normal`, `pressed`, `disabled` | `320 × 68` | `260 × 62` |
| `m7-secondary-hex-button` | button | `normal`, `pressed`, `disabled` | `232 × 56` | `188 × 52` |
| `m7-angular-tab` | tab | `normal`, `selected` | `148 × 52` | `184 × 52` |
| `m7-faceted-badge` | badge | `normal`, `highlighted` | `164 × 48` | `212 × 48` |
| `m7-angular-progress` | progress-bar | values `10`, `50`, `90` | `344 × 28` | `420 × 28` |
| `m7-icon-container` | icon-container | `normal`, `selected` | `92 × 92` | `116 × 116` |

These sizes are review baselines and proof sizes, not open editor ranges. Any intermediate sizing must be covered by explicit bounded-template rules and tests.

## 5. Shape-language requirements

### 5.1 Wide-hexagon buttons

The primary visual correction for M7 is button silhouette. The primary and secondary buttons must use a wide-hexagon structure:

- six-point outline with sharp angled end caps;
- minimal anti-alias relief only: visual corner radius `0–4`;
- end-cap depth scaled from height, with baseline target `24–44` logical pixels;
- separate outer frame, inner plate, bevel, edge-light, content, shadow, and optional ornament layers;
- content safe area that excludes angled caps;
- pressed state represented by deterministic depth, highlight, and `y` offset changes, not a repainted image.

Rounded pill, soft rectangle, or capsule-like button outputs are an automatic style-fidelity defect.

### 5.2 Angular containers

Panels, tabs, badges, progress frames, and icon containers should share the same angular family:

- chamfered corners or faceted side cuts;
- layered frame/body construction;
- protected content slots;
- optional corner bolts, runes, plate seams, or cut marks as separate masked/decal layers;
- no baked text, icons, shadows, or component-specific lighting inside material sources.

## 6. Material and ornament model

The M7 material pack should be reusable across at least four component types and may include:

| Source ID | Type | Role | Required boundary |
|---|---|---|---|
| `m7-faceted-grain` | procedural or artist-provided | subtle surface detail | tile-safe; no component geometry |
| `m7-angular-plate-pattern` | procedural or artist-provided | faceted plate/panel texture | mask-safe; no text/icons |
| `m7-energy-edge-accent` | procedural or artist-provided | edge/decal accent | transparent, clamp-safe, reusable |
| `m7-ornament-marks` | procedural or artist-provided | optional runes/cuts/bolts | optional per component; not required for family coherence |

Deterministic renderer/style recipes own base gradients, bevels, edge lights, state lighting, borders, connected shadows, and clipping. Material sources must not bake component-specific silhouettes or state effects.

## 7. Canonical layer model

Required top-to-bottom order for applicable M7 component outputs:

1. `content`
2. `ornament-decal`
3. `edge-energy-accent`
4. `top-bevel-highlight`
5. `side-bevel-shade`
6. `surface-pattern`
7. `surface-grain`
8. `inner-plate-fill`
9. `outer-frame`
10. `connected-depth`
11. `outer-shadow`

Progress frame and fill must remain independently renderable. Optional layers may be omitted when inapplicable, but retained layers must keep stable IDs and relative order.

## 8. State and hierarchy rules

| Variant/state | Deterministic rule |
|---|---|
| Primary normal | Strongest edge accent, deepest frame, highest contrast, widest silhouette |
| Primary pressed | Content `y: +2`; reduced edge light/depth; stronger inner shade |
| Primary disabled | Lower saturation and contrast; reduced edge accent; geometry unchanged |
| Secondary normal | Same hex family with lower scale, lower contrast, and less edge energy |
| Secondary pressed/disabled | Same deterministic recipe family as primary |
| Tab selected | Uses selected edge/body contrast and does not rely on text alone |
| Badge highlighted | Uses bounded accent/decal emphasis while preserving value readability |
| Icon selected | Distinct frame/edge/value contrast, not text-only or icon-only |
| Progress values | Frame unchanged; fill clipped cleanly at `10`, `50`, and `90` percent |

## 9. Implementation sequence

| Slice | Work | Exit evidence | Next dependency |
|---|---|---|---|
| M7-A1 | Draft reference brief, implementation specification, and rubric | Draft docs define target/reference constraints, inventory, shape language, evidence, blockers, and review procedure | Human definition review |
| M7-A2 | Review and approve M7 definition | Project owner/art/UI/technical approval or requested edits are recorded | M7-A1 |
| M7-A3 | Extend contracts/templates for angular hex geometry and layer model | 🟢 Complete — optional component-spec geometry, wide-hex contract fixture, M7 angular renderer helper, and focused tests prove bounds, layer order, states, invalid shapes, and compatibility | M7-A2 |
| M7-A4 | Create M7 material pack and approved component specs | Complete — approved M7 style, four procedural sources, reusable material pack, seven approved component specs, source preflight, reuse plan, and isolation views validate | M7-A3 |
| M7-A5 | Render component matrix, portrait composition, and showroom integration | Complete — 26 required matrix renders, independent progress parts, portrait/target-phone composition, 68-module asset package, and showroom outputs validate | M7-A4 |
| M7-A6 | Prepare V7 evidence and conduct human visual-fidelity review | Scorecard, blocker disposition, package validation, and revalidation record are complete | M7-A5 |

Each slice is one task. Do not start implementation slices until M7-A2 approves the definition.

## 10. Automated validation requirements

- Existing approved package validation remains green.
- Component specs reject rounded/capsule button silhouettes for M7 hex buttons.
- End-cap depth, safe content area, bevel widths, ornament bounds, and state offsets are range-checked.
- Named layer order is stable for every M7 component.
- Progress frame/fill remain independent and values clip correctly.
- Material sources are audited for component geometry, text, icon, shadow, border, and state-effect leakage.
- The material pack is reused across at least four component types.
- Browser/showroom preview and CLI output resolve from the same approved inputs.
- Manifest provenance binds approved reference brief, style/material/component specs, renderer/dependencies, and output hashes.
- No reference/concept raster hash appears in production assets unless it is only an evidence/reference receipt.

## 11. V7 evidence package

Prepare V7-E01 through V7-E10 exactly as defined in [the M7 rubric](../validation/M7_REFERENCE_FIDELITY_RUBRIC.md). V7 cannot pass on beauty or screenshot similarity alone; it must pass shape fidelity, modularity, deterministic state behavior, material reuse, traceability, package validation, and asset-only handoff.

## 12. Risks and controls

| Risk | Signal | Control |
|---|---|---|
| Rounded baseline survives | Buttons still read as pills/rounded rectangles | Hex-shape blockers and explicit end-cap/safe-area checks |
| Complexity becomes manual paint | Ornament or lighting only works for one size/state | Require named layers, bounded controls, and propagation evidence |
| Rich materials hurt readability | Pattern/edge energy competes with labels/icons | Target-phone review and readability scoring minimum |
| Geometry breaks reuse | Angled caps clip content or fail secondary sizes | Safe-area and proof-size tests |
| Reference imitation leaks pixels | Reference image is cropped/traced into assets | No-pixel-leak audit and automatic blocker |
| Asset handoff gets vague | Outputs exist only inside a build flow | Showroom visibility or exact asset folder/file addresses required |

## 13. Approval checklist

Use this checklist during M7-A2:

- [x] Wide-hexagon shape language is accepted as the primary correction.
- [x] Seven-component inventory is accepted as drafted.
- [x] Material/ornament complexity is sufficient but bounded.
- [x] Evidence IDs, scoring, blockers, and review roles are accepted.
- [x] Engine-neutral asset-only delivery remains the final boundary.
- [x] Implementation may begin after this approval is recorded.

## 14. Approval outcome

On 2026-07-18, the project owner approved Option A as drafted. The approval covers the M7 reference brief, seven-component inventory, wide-hexagon button correction, angular component family, material/ornament model, canonical layer order, implementation slices M7-A3 through M7-A6, automated validation requirements, V7-E01 through V7-E10 evidence package, scoring thresholds, automatic blockers, and engine-neutral asset-only handoff requirements.

M7 passed V7 at `90.5/100` through the project-owner-authorized automated review. The package remains asset-only; do not add Unity or other engine integration scope.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-18 | Drafted M7 reference-fidelity implementation specification | Codex |
| 2026-07-18 | Approved Option A as drafted and authorized M7-A3 | Project owner |
| 2026-07-18 | Completed M7-A3 optional geometry contracts, wide-hex fixture, angular template helper, and focused validation | Codex |
| 2026-07-18 | Completed M7-A4 approved material pack, component specs, source preflight, reuse plan, and isolation evidence | Codex |
| 2026-07-18 | Completed M7-A5 matrix, independent progress exports, portrait composition, modular asset package, and showroom integration | Codex |
