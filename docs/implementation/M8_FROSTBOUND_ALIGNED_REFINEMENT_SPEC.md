# M8 Implementation Specification — Frostbound-aligned Angular Refinement

## Document control

| Field | Value |
|---|---|
| Status | 🟡 Draft for definition review |
| Date | 2026-07-18 |
| Milestone | M8 — Frostbound-aligned angular refinement |
| Decision source | [ADR-019](../decisions/ADR-019-frostbound-aligned-m7-refinement.md) |
| Baseline | M7 package passed V7 at `90.5/100` |
| Output boundary | Engine-neutral modular SVG/PNG assets only |

## 1. Purpose

M8 is a narrow art-direction refinement of the approved M7 package. It must retain the sharp wide-hex geometry, seven component boundaries, deterministic renderer ownership, stable modular handoff, and asset-only showroom workflow while addressing the two V7 observations:

1. the existing forge/tech family should gain a colder, more crystalline Frostbound-aligned material/focal direction; and
2. the reward focal area should read more strongly than the interior panel pattern.

The Frostbound concept is comparison evidence only. No concept pixels, crops, traces, hashes, or embedded raster references may enter material sources or production outputs.

## 2. Fixed constraints

- Retain M7 wide-hex buttons, angular containers, component IDs, states, proof sizes, and independent progress frame/fill parts.
- Add only source-neutral reusable material definitions and renderer-owned layers; do not bake geometry, labels, icons, values, borders, shadows, or state effects into a material source.
- Keep SVG canonical and PNG deterministic derivative outputs at the existing `540 × 960` logical / `1080 × 1920` review scale.
- Keep outputs visible in the showroom and listed under exact asset folders.
- Preserve M7 package compatibility; any changed asset must use an explicit versioned M8 manifest/receipt rather than silently replacing M7 provenance.
- Unity and any other engine integration are not evaluated or required.

## 3. Bounded refinement inventory

| Target | Required M8 change | Must remain independent |
|---|---|---|
| M8 cold material pack | Reusable procedural ice grain, crystalline facet pattern, and cold edge accent with rights/settings/provenance | Source definitions, normalization, isolation previews |
| Reward focal treatment | Faceted crystal/emblem layer that increases central reward focus | Focal/emblem geometry, glow/edge, content slot, optional ornament |
| Reward panel | Calmer selectable interior pattern density/value and cold frame/edge response | Panel silhouette, content safe area, frame, plate, material layers |
| Primary/secondary actions | Cold-blue hierarchy variant while retaining wide-hex silhouette and state behavior | Buttons, content slots, pressed/disabled state rules |
| Progress, tab, badge, icon container | Consistent cold-material propagation and selected/highlighted hierarchy | Progress frame/fill, component states, editable slots |

No new general editor, screen family, character art, background system, or engine package is in scope.

## 4. Design rules

### 4.1 Material/focal direction

- Use controlled pale cyan, ice blue, and restrained crystal-white highlights; the primary action may retain a distinct value accent only when it remains clearly related to the cold material family.
- Crystal facets, frost grain, and cold edge energy must be reusable across at least four component types.
- The reward focal treatment must be visually dominant over the panel pattern at target-phone scale, but its icon/content slot remains editable and unbaked.
- Panel pattern density/contrast must be bounded by style tokens and remain mask-safe at both M7 proof sizes.

### 4.2 Structure and compatibility

- M7 shape language, canonical layer order, safe-area rules, state offsets, and progress clipping remain mandatory.
- M8 may add named `crystal-focal` and `cold-edge-accent` layers where applicable. They must sit above surface material layers and below editable content.
- Existing M7 output hashes remain historical evidence. M8 must generate a new versioned output/manifest receipt rather than mutate M7 evidence.

## 5. Delivery slices

| Slice | Work | Acceptance criteria | Dependency |
|---|---|---|---|
| M8-A1 | Draft definition package | This specification and the M8 rubric define scope, blockers, evidence, and handoff | ADR-019 |
| M8-A2 | Approve M8 definition | Project owner records approval or requested changes | M8-A1 |
| M8-A3 | Add M8 cold material/focal contracts | Versioned style/material/component additions validate; sources have provenance and no leakage | M8-A2 |
| M8-A4 | Render M8 family/package/showroom | Seven-component M8 matrix, portrait, receipts, and asset-only package validate | M8-A3 |
| M8-A5 | Prepare evidence and conduct V8 review | Scorecard, blocker disposition, and revalidation record are complete | M8-A4 |

Do not begin M8-A3 until M8-A2 is approved.

## 6. Automated validation requirements

- Existing M7 and prior validation remains green.
- M8 materials reject reference pixels, component geometry/effects, missing provenance, and invalid normalization bounds.
- Cold material reuse spans at least four component types; isolation views prove grain, facets, edge accent, and focal treatment are independently inspectable.
- The central focal treatment has a named layer and editable slot; no text/icon/value is baked into it.
- Wide-hex silhouettes, safe areas, state rules, and independent progress frame/fill remain valid at baseline and proof sizes.
- M8 output/package manifests bind approved M8 inputs, renderer/dependencies, output hashes, showroom paths, and exact asset addresses.

## 7. Risks and controls

| Risk | Control |
|---|---|
| Frostbound comparison becomes pixel imitation | No-reference-pixel audit and automatic blocker |
| Icy materials reduce readability | Target-phone/light-dark review and hierarchy minimum |
| New focal layer becomes a baked screen asset | Require separate named geometry/content/material layers and module receipt |
| M8 silently overwrites M7 lineage | Require versioned M8 package/manifest and retain M7 evidence |
| Scope expands into another full system | Seven-component family only; no new screen/editor/engine scope |

## 8. Approval checklist

- [ ] Cold material and focal treatment are sufficiently specific and bounded.
- [ ] M7 geometry, modularity, and package lineage are preserved.
- [ ] The Frostbound concept remains evidence-only.
- [ ] Evidence, scoring, blockers, and asset-only handoff requirements are accepted.
- [ ] M8-A3 may begin after approval.
