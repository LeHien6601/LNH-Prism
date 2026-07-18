# M8 Visual-Fidelity Rubric — Frostbound-aligned Angular Refinement

## Purpose and status

**Status:** 🟡 Draft for definition review.

Use this rubric to review whether M8 improves the two recorded V7 observations while retaining the M7 system’s angular silhouette, deterministic structure, modular assets, and engine-neutral handoff.

**Not evaluated:** Unity or any engine integration.

## Preconditions

- ADR-019, the M8 implementation specification, and this rubric are approved.
- Versioned M8 style/material/component inputs and source provenance exist.
- All seven M8 components have deterministic baseline/proof outputs; progress frame and fill remain independent.
- M8 package manifests, showroom, exact asset addresses, target-phone/light-dark views, material/layer isolation, and no-reference-pixel audit exist.

## Evidence package

| ID | Required artifact | Pass condition |
|---|---|---|
| V8-E01 | ADR-019, M8 spec, rubric, approval record | Scope and non-goals are unambiguous |
| V8-E02 | Versioned M8 style, material pack/sources, component specs | Approved, bounded, traceable inputs |
| V8-E03 | Seven-component state/size/value matrix | All M8 outputs inspectable at baseline and proof sizes |
| V8-E04 | Portrait comparison and target-phone hierarchy views | Reward focal point reads over panel pattern |
| V8-E05 | Cold-material and crystal-focal isolation board | Each contribution is independently inspectable and editable |
| V8-E06 | Light/dark, selected/disabled, and progress-part views | Readability, clipping, masks, and state hierarchy remain clear |
| V8-E07 | Determinism, bounds, package, and showroom equivalence report | All automated checks pass |
| V8-E08 | Material reuse, no-reference-pixel, provenance, and output audit | Complete reproducible chain and at least four-type reuse |
| V8-E09 | Asset-only handoff evidence | Showroom plus exact M8 asset folders; no engine project |
| V8-E10 | Defect/correction/revalidation record | Every blocker is retained with proof of disposition |

## Scorecard

Score each dimension `0–5`, using half points. The weighted score is `sum(score / 5 × weight)`.

| Dimension | Weight | Minimum | A 5 means |
|---|---:|---:|---|
| Frostbound-aligned material and focal fidelity | 20 | 4 | Cold/crystal language and editable reward focus are compelling without concept imitation |
| Visual hierarchy and target-phone readability | 15 | 4 | Reward focus/action/value read immediately; panel detail supports rather than competes |
| Angular continuity and cross-component consistency | 15 | 4 | M7 wide-hex/faceted language stays intact across all seven components |
| Material reuse and controlled complexity | 15 | 4 | One reusable M8 material language serves at least four types with inspectable layers |
| Deterministic structure, states, and modularity | 20 | 4 | Safe areas, states, independent parts, named layers, and modules remain editable |
| Traceability, reproducibility, and asset handoff | 15 | 5 | Versioned M8 inputs/receipts, hashes, showroom, and exact asset paths reproduce output |

| Outcome | Requirement |
|---|---|
| 🟢 Pass | `≥85`, every minimum met, all evidence present, no blocker |
| 🟡 Conditional pass | `83–84`, every minimum met, no blocker, owned corrective task exists |
| 🔴 Fail | `<83`, any minimum/evidence gap, or any blocker |

## Automatic blockers

- M8 uses Frostbound concept pixels, crops, traces, hashes, or embedded raster references in production sources or outputs.
- M8 removes or rounds M7 wide-hex/angular geometry, or clips safe content at proof sizes.
- Cold/crystal materials bake component geometry, text, icons, borders, shadows, or state effects.
- The focal treatment is baked, not independently editable, or does not improve focal hierarchy over the panel pattern.
- Fewer than four component types reuse approved M8 materials.
- Progress frame/fill lose independence, state hierarchy relies on text alone, or material masks/seams fail.
- M8 overwrites M7 output provenance instead of producing versioned M8 receipts.
- Showroom or exact asset folders are absent, or engine integration is claimed as completion.

## Review procedure

1. Preflight V8-E01 through E10 and retain the M7 baseline record for comparison.
2. Inspect the reward focal and panel-detail relationship at target-phone scale before surface polish scoring.
3. Inspect material/focal isolation, all states/proof sizes, and light/dark surfaces.
4. Audit M8 source/output provenance and concept-pixel boundary.
5. Score, record defects without overwriting them, and create the smallest corrective task for any failed requirement.
