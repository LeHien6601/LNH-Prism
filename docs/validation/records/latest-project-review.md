# M11-R028 automated V11 re-review — 2026-07-25

## Snapshot

| Field | Value |
|---|---|
| Reviewer | Project-owner-authorized automated review |
| Reviewed revision | `e07dab0` (`feat(renderer): rebalance enchanted forest focal rails`) |
| Branch / upstream | `main` synchronized with `origin/main` at review start |
| Working tree at start | Clean |
| Reference receipt | `enchanted-forest-review-reference-1080x1920.receipt.json`; SHA-256 `02ae9c86a7bd86debed494cd530cb65d09eec715b6be02aa127f24fb02e3e2b6` |
| Required surfaces inspected | Labeled review-only reference comparison, source panel, target-phone portrait, material/construction isolate, focal/ornament isolate, state-pair board, three-style thumbnail comparison, 26-entry matrix, 52-module package, seed receipts, generalized-seam proof, and technical preflight |

## Technical hard gate

These are facts established by the evidence and validations run for this review.

| Requirement | Evidence / validation | Result |
|---|---|---|
| Shared seven-component geometry, stable IDs, and no style fork | `M11-A4-generalized-seam-proof.json`; shared `style-composition` renderer | Pass |
| Package, manifest, provenance, and clean reproduction | `npm run validate:m11-a4-package`; 26 entries and 52 modules validated | Pass |
| Zero baseline and three deterministic nonzero seeds | `M11-A4-variation-receipts.json`: `0`, `51731`, `104729`, `8675309` | Pass |
| Review-reference boundary | `npm run test:review-reference-boundary`; 370 production files clear and all registered leak forms rejected | Pass |
| Matrix, portrait, isolates, semantic text, and states | `npm run test:renderer`; `npm run validate:m11-a3-evidence`; `npm run validate:contracts` | Pass |
| Active control alignment | `npm run validate:control-drift` reports `M11-R028 / V11 re-review` | Pass |

Technical hard-gate outcome: **Pass**. Technical correctness does not increase visual scores.

## Visual scoring

The observations below are visual-review inferences grounded in the inspected surfaces.

| Dimension | Weight | Score | Weighted | Evidence-backed observation |
|---|---:|---:|---:|---|
| Three-style distinction | 15 | 4/5 | 12 | The dark forest-green composition, weathered stone rails, wood trunks, moss accents, and living seed remain distinct from the cold Frostbound and warm Forge thumbnails. |
| Organic material separation | 15 | 4/5 | 12 | Source panel and construction isolate show independently legible stone planes, chips/pits, wood, moss, and living-light receivers. The focal-zone falloff retains the joined-stone reading without introducing blended noise. |
| Focal hierarchy | 15 | 3/5 | 9 | The seed/root focal is identifiable and actions remain unambiguous, but at target-phone scale it still reads as a self-contained icon rather than as the material consequence of the surrounding stone, wood, and moss. |
| Botanical ornament restraint | 10 | 3/5 | 6 | Vines, leaves, roots, and clusters stay outside content slots and remain bounded. Their rhythm continues to be secondary to the panel rail cadence. |
| Diffuse bioluminescent lighting | 10 | 3/5 | 6 | The new localized stone/moss receivers are deterministic and bounded; at phone scale they remain subdued and the focal-to-material relation still reads primarily as thin line work. |
| Seeded organic variation | 10 | 4/5 | 8 | Connected planes, two-scale chips, pits, join-following darkening, and focal-zone falloff vary by named seed and disappear at the zero baseline. |
| Typography and state language | 10 | 4/5 | 8 | Labels and progress remain readable at phone scale; normal/pressed/disabled/highlighted and selected receiver states are visibly distinct without global-opacity substitution. |
| Portrait composition | 10 | 3/5 | 6 | Focal-zone attenuation reduces the central rail emphasis, but the reward portrait still has a broad empty middle and the seed’s material relationship is not yet strong enough to organize that space. |
| **Total** | **100** |  | **67/100** | Every dimension meets its minimum; the weighted total remains below `85/100`. |

## Decision

**Fail — scored at `67/100`.** No automatic blocker applies and no dimension is below `3/5`, but the total does not meet the required `85/100`.

### V11-B015 — focal material convergence

Fact: M11-R027 adds six independently clipped focal-zone relief-falloff layers and six localized stone/moss receiver pairs through the existing shared composition seam. The renderer tests, package receipts, and named seed receipts remain valid.

Inference: the falloff successfully quiets the central rails at source scale, but the receiver lines are too subtle at target-phone scale to bind the seed to a readable stone/wood/moss convergence. The focal still appears as an isolated emblem set into empty space rather than a soft living event that organizes the portrait.

## Ordered remediation recommendation

### M11-R029 — deepen bounded living-focal convergence

- **Priority / eligibility:** P0 — Agent-ready after the managed Apply Review step updates the active controls.
- **Scope:** Reuse the existing luminous seed, root cradle, stone plates, wood trunks, moss seams, and named receiver layers. Add bounded, independently named focal-adjacent relief/occlusion and short material-directed convergence paths at the existing root/stone/wood/moss anchors; increase only local receiver contrast within approved lighting limits. Do not add component types, alter geometry, broaden halo coverage, or introduce a renderer/template fork.
- **Acceptance criteria:** At source and target-phone scale, the seed reads as a soft living focal embedded in and feeding existing stone, wood, and moss materials; the relation is legible without obscuring controls or semantic text; rail weathering remains quiet near the focal zone; zero baseline, named seeds, state evidence, stable IDs, shared seam, material families, reproducibility, and review-reference isolation remain intact.
- **Validation:** Regenerate the 26-entry matrix and 52-module package; run renderer tests, M11 evidence/package validators, contracts, serial reference-boundary validation, and control-drift validation; inspect source panel, target-phone portrait, construction isolate, focal/ornament isolate, state pairs, and three-style thumbnail before another V11 review.

## Review conclusion

M11-R027 preserves the deterministic package and makes a measured rail-hierarchy improvement, but it does not yet create enough focal material convergence at target-phone scale to improve the weighted V11 result. The remaining work is narrowly bounded to existing focal and material-receiver layers.
