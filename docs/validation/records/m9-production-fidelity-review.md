# M9 Production-Fidelity Review Record

## Review authority and evidence

**Review mode:** project-owner-authorized automated review on 2026-07-19.

**Evidence:** `docs/validation/evidence/m9-frostbound-production-fidelity/`, including source-scale, target-phone, and thumbnail surfaces; the M9 package validator; M9 renderer tests; and contract validation.

## Technical hard gates

| Check | Result | Evidence |
|---|---|---|
| Deterministic reproduction, IDs, provenance, engine-neutral modules, editable structure, recorded seeds, and no reference pixels | Pass | `npm run validate:m9-a10-package`, package manifest, and matrix receipts |
| Functional bounds and target-phone readability | **Fail** | The action typography is emitted before the inherited inner plate and is covered in the rendered primary/secondary button outputs. |

**Automatic blocker:** M9-B001 — target-phone action readability fails. No pass is possible while this blocker remains.

## Visual score

| Dimension | Weight | Score / 5 | Weighted points | Evidence |
|---|---:|---:|---:|---|
| Silhouette and angular-language fidelity | 10 | 4 | 8 | Angular panel/button family remains coherent. |
| Material separation and response depth | 15 | 4 | 12 | Independent edge, surface, highlight, glow, and variation layers are inspectable. |
| Edge depth and bevel hierarchy | 15 | 4 | 12 | Layered edge stacks remain distinct at source scale. |
| Shared-lighting coherence | 10 | 4 | 8 | Shared cold top-rim model is present in matrix SVGs. |
| Focal-object strength and hierarchy | 15 | 2 | 6 | Panel focal competes with the icon focal and is partly obscured by the progress treatment. |
| Ornament placement and structural restraint | 10 | 4 | 8 | Corner ornaments stay subordinate and symmetric. |
| Controlled seeded variation | 10 | 3 | 6 | Variation is bounded and readable, but subtle. |
| Composition and visual hierarchy | 10 | 2 | 4 | Duplicate focal placement and the obscured panel focal weaken the review path. |
| Mobile-scale readability | 5 | 1 | 1 | Primary and secondary action labels are not visible in the rendered package. |
| **Total** | **100** |  | **65 / 100** |  |

## V8-O001 assessment

**Fail.** At target-phone and thumbnail scale, the intended crystal focal is split between two placements; the panel focal is partially covered and does not establish one dominant reading path over the panel pattern.

## Decision

**Fail.** The `65/100` visual result is below the `85/100` threshold, three dimensions are below `3/5`, and automatic blocker M9-B001 is open. M9 remains closed to multi-style transfer.

## Required remediation

**M9-R001 — Correct M9 action/focal layer order and revalidate package** is agent-ready. It must move action typography above inherited plate layers, establish one unobstructed panel focal at target-phone scale, regenerate the M9 package/evidence, and pass focused readability, package, and receipt validation. A fresh M9-A12 human/authorized review is then required.

## M9-R001 revalidation

**Status:** complete on 2026-07-19. The corrected package now emits typography and shared lighting after inherited component layers, uses explicit component coordinates for composed text, and keeps one panel focal while removing the competing icon focal from the composition. `npm run validate:m9-a10-package`, focused M9 renderer tests, and contract validation pass. This record preserves the failed M9-A11 result; M9-A12 must make the new review decision.

## M9-A12 corrected-package automated review

**Review authority:** project-owner-authorized automated review on 2026-07-19.

**Review surfaces inspected:**

- Source scale: `docs/validation/evidence/m9-frostbound-production-fidelity/M9-E-source-scale.html` and `matrix/panel-488x660-normal.png`.
- Target-phone scale: `docs/validation/evidence/m9-frostbound-production-fidelity/M9-E-target-phone.html` and `m9-frostbound-reward-composition.png` at its 270 px phone presentation.
- Thumbnail scale: `docs/validation/evidence/m9-frostbound-production-fidelity/M9-E-thumbnail.html` and its 135 px composition presentation.

### Technical hard gates

| Check | Result | Evidence |
|---|---|---|
| Deterministic reproduction, stable IDs, full provenance/receipts, engine-neutral modules, editable structure, recorded seeds, and no reference pixels | Pass | `npm run prepare:m9-a10-package`; `npm run validate:m9-a10-package` reports 26 matrix entries, 68 modules, all three review surfaces, and unscored evidence. |
| Functional bounds and target-phone readability | Pass | Corrected primary and secondary action typography renders after inherited plate layers; `CLAIM` and `CONTINUE` are visible in the target-phone surface. |
| Contract and focused-system coverage | Pass | `npm run validate:contracts` and `node --test tests/renderer/m9-*.test.mjs` pass, including the focal, layer-order, ornament, and typography checks. |

**Automatic blockers:** none. M9-B001 is closed.

### Visual score

| Dimension | Weight | Score / 5 | Weighted points | Evidence |
|---|---:|---:|---:|---|
| Silhouette and angular-language fidelity | 10 | 5 | 10 | The thumbnail retains a clear angular panel and action silhouette. |
| Material separation and response depth | 15 | 4 | 12 | Base, edge, surface, highlight, glow, and bounded variation remain independently inspectable at source scale. |
| Edge depth and bevel hierarchy | 15 | 5 | 15 | Layered cold rim, inset, and extrusion stacks stay distinct at source and phone scales. |
| Shared-lighting coherence | 10 | 4 | 8 | Top-rim highlights, focal light, and action treatment share one restrained cold direction. |
| Focal-object strength and hierarchy | 15 | 5 | 15 | One unobstructed crystal focal reads before the supporting panel pattern. |
| Ornament placement and structural restraint | 10 | 4 | 8 | Corner geometry and pattern stay contained within the structural panel without competing with the focal. |
| Controlled seeded variation | 10 | 3 | 6 | Variation is deliberately subtle, bounded, and does not impair readability. |
| Composition and visual hierarchy | 10 | 4 | 8 | Title, focal, progress, primary action, and secondary action form a consistent vertical path. |
| Mobile-scale readability | 5 | 3 | 3 | Both action labels are visible above their plates at the target-phone presentation; the secondary treatment remains intentionally quieter. |
| **Total** | **100** |  | **85 / 100** |  |

### V8-O001 assessment

**Pass.** At target-phone and thumbnail scale, the single crystal is the dominant focal cue. The panel pattern remains supporting detail, and the two action shapes remain visibly separated.

### Decision

**Pass.** The corrected package meets every technical hard gate, has no automatic blocker, keeps every visual dimension at or above `3/5`, and scores `85/100`. M9 is complete and Frostbound is ready for a human decision on second-style transfer scope; that transfer has not begun.
