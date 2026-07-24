# M11-R026 automated V11 re-review — 2026-07-25

## Snapshot

| Field | Value |
|---|---|
| Reviewer | Project-owner-authorized automated review |
| Reviewed revision | `f592516` (`feat(renderer): author enchanted forest plate interiors`) |
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
| Active control alignment | `npm run validate:control-drift` reports `M11-R026 / V11 re-review` | Pass |

Technical hard-gate outcome: **Pass**. Technical correctness does not increase visual scores.

## Visual scoring

The observations below are visual-review inferences grounded in the inspected surfaces.

| Dimension | Weight | Score | Weighted | Evidence-backed observation |
|---|---:|---:|---:|---|
| Three-style distinction | 15 | 4/5 | 12 | The dark forest-green composition, weathered stone rails, wood trunks, moss accents, and living seed remain distinct from the cold Frostbound and warm Forge thumbnails. |
| Organic material separation | 15 | 4/5 | 12 | Source panel and construction isolate show independently legible stone planes, chips/pits, wood, moss, and living-light receivers. The planes now read as joined stone rather than a single applied chip, though their palette range remains restrained. |
| Focal hierarchy | 15 | 3/5 | 9 | The seed/root focal remains identifiable and the progress/actions stay unambiguous, but its diagrammatic central treatment has less visual authority than the tall, repeating rail construction. |
| Botanical ornament restraint | 10 | 3/5 | 6 | Vines, leaves, roots, and clusters stay outside content slots and remain bounded, but the repeated side-rail cadence leaves the organic ornament feeling supplemental rather than integrated. |
| Diffuse bioluminescent lighting | 10 | 3/5 | 6 | The emerald/teal light is locally bounded and avoids fire/ice language. It is coherent across the seed and controls but still reads more as thin receiver lines than a diffuse material interaction. |
| Seeded organic variation | 10 | 4/5 | 8 | The independently clipped tonal planes, two-scale chips, pits, and join-following darkening vary by named seed and disappear at the zero baseline. This resolves the prior single-chip rhythm. |
| Typography and state language | 10 | 4/5 | 8 | Labels and the progress value remain readable at phone scale; the normal/pressed/disabled/highlighted and selected receivers are visibly distinct without global-opacity substitution. |
| Portrait composition | 10 | 3/5 | 6 | The reward path is readable at phone scale, but the six large side plates still establish a heavy, repetitive vertical frame that competes with the softer focal and leaves the middle composition relatively sparse. |
| **Total** | **100** |  | **67/100** | Every dimension meets its minimum; the weighted total remains below `85/100`. |

## Decision

**Fail — scored at `67/100`.** No automatic blocker applies and no dimension is below `3/5`, but the total does not meet the required `85/100`.

### V11-B014 — focal/rail hierarchy integration

Fact: M11-R025 gives every panel plate three independently clipped seeded tonal planes, two chip scales, localized pits, an irregular inner-bevel break, and join-following contact darkening. The renderer tests and variation receipts confirm deterministic baseline and nonzero-seed behavior.

Inference: this resolves the prior flat-slab treatment at source distance, but its value is muted at target-phone scale. The tall, repeated side rails still dominate the portrait while the central living focal remains a separate, diagrammatic emblem; the result does not yet achieve the calm, integrated reward hierarchy required for a high V11 score.

## Ordered remediation recommendation

### M11-R027 — integrate focal hierarchy with bounded rail rhythm

- **Priority / eligibility:** P0 — Agent-ready after the managed Apply Review step updates the active controls.
- **Scope:** Rebalance only the existing shared M11 composition seam: introduce bounded, plate-specific value breaks and relief falloff that quiet the rail repetition around the focal zone; deepen the existing living-light-to-stone/wood/moss receiver relationship so the seed reads as an integrated soft focal rather than a separate icon. Reuse existing stone, wood, moss, and living-light families, named layers, seeds, controls, and geometry.
- **Acceptance criteria:** At source and target-phone scale, the central seed/focal becomes the clearest secondary visual anchor after reward information and actions; the six rails remain weathered and independently editable but no longer dominate negative space as a repeated ladder; lighting reads as localized material interaction; controls, semantic slots, IDs, state evidence, zero baseline, reproducibility, and review-reference isolation remain intact.
- **Validation:** Regenerate the 26-entry matrix and 52-module package; run renderer tests, M11 evidence/package validators, contracts, serial reference-boundary validation, and control-drift validation; inspect source panel, target-phone portrait, construction isolate, focal/ornament isolate, state-pair board, and three-style thumbnail before another V11 review.

## Review conclusion

M11-R025 makes a real structural improvement: the panel rails now have deterministic connected stone weathering rather than repeated isolated marks. The technical package remains healthy. The remaining shortfall is bounded to focal/rail hierarchy and diffuse receiver integration at portrait scale; no review-reference or renderer/template expansion is warranted.
