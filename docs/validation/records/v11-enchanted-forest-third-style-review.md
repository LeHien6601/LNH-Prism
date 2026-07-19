# V11 Enchanted Forest third-style review

## Authorization and evidence

| Field | Value |
|---|---|
| Reviewer | project-owner-authorized automated review |
| Review date | 2026-07-19 |
| Reviewed revision | `7ecd2b1` (`feat(assets): package enchanted forest modules`) |
| Decision | **Fail — scored** |
| Generated reference | `docs/reference-briefs/assets/enchanted-forest-review-reference-1080x1920.png` — review-only, SHA-256 `02ae9c86a7bd86debed494cd530cb65d09eec715b6be02aa127f24fb02e3e2b6` |
| Inspected surfaces | `M11-E-source-scale.html`, `M11-E-target-phone.html`, `M11-E-thumbnail.html`, `M11-E-review-reference.html`, 26-entry `matrix.json`, material/focal isolate PNGs, target-phone PNG, package manifest, seed receipts, and clean-workspace receipt |

## Technical hard gate

| Requirement | Evidence | Result |
|---|---|---|
| Shared seven-component geometry and no style-specific renderer | `M11-A4-generalized-seam-proof.json`; `src/renderer/style-composition.ts` | Pass |
| Valid package, manifest, provenance, and clean reproduction | 52-module `assets/m11-enchanted-forest/manifest.json`; `M11-A4-clean-workspace-receipt.json` | Pass |
| Zero baseline plus three reproducible nonzero seeds | `M11-A4-variation-receipts.json` records `0`, `51731`, `104729`, and `8675309` | Pass |
| Review-reference receipt, comparison role, and production boundary | receipt above; `M11-E-review-reference.html`; `npm run test:review-reference-boundary` | Pass |
| Matrix, portrait, isolates, semantic text, and target-phone evidence | `matrix.json`, target-phone SVG/PNG, isolate surfaces, `npm run validate:m11-a3-evidence` | Pass |

Technical hard-gate outcome: **Pass**. Technical correctness is not used to increase visual scores.

## Visual scoring

| Dimension | Weight | Score | Weighted | Evidence-based observation |
|---|---:|---:|---:|---|
| Three-style distinction | 15 | 1/5 | 3 | Thumbnail reads primarily as Frostbound’s shared blue/cyan composition recolored green; the material grammar does not establish a third family. |
| Organic material separation | 15 | 1/5 | 3 | Source isolates name stone, wood, moss, and light, but the rendered panel/control faces retain the inherited crystalline grid and do not make weathered stone, dark wood, and moss independently legible. |
| Focal hierarchy | 15 | 3/5 | 9 | The seed is identifiable and actions remain dominant, but the simple diamond/halo does not yet carry an ancient-grove hierarchy. |
| Botanical ornament restraint | 10 | 2/5 | 4 | The sparse vine marks stay out of slots, but they read as a thin decorative overlay rather than authored botanical structure. |
| Diffuse bioluminescent lighting | 10 | 3/5 | 6 | Local emerald/teal light is restrained and avoids fire/ice; it is visually subordinate to the inherited edge/highlight treatment. |
| Seeded organic variation | 10 | 2/5 | 4 | Receipts prove deterministic variation, but visible variation is limited to scattered speckles while the crystal-grid material remains dominant. |
| Typography and state language | 10 | 3/5 | 6 | Labels are readable at target-phone scale and the primary/secondary hierarchy remains clear; the typography/state treatment has limited distinct living-light character. |
| Portrait composition | 10 | 3/5 | 6 | The phone hierarchy is legible, but the panel composition remains visually close to Frostbound. |
| **Total** | **100** |  | **41/100** |  |

## Blockers and decision

- **V11-B001 — automatic blocker:** a green/cyan palette swap is the only meaningful distinction from Frostbound. The phone and thumbnail surfaces preserve Frostbound’s crystalline grid, edge/highlight behavior, and overall material grammar; sparse vine/speckle overlays do not make the UI read as weathered stone, dark wood, moss, and living light.
- Visual minima fail for Three-style distinction and Organic material separation (`1/5` each), Botanical ornament restraint and Seeded organic variation (`2/5` each), and the weighted total is below `85/100`.

**Decision:** Fail — scored at `41/100`. Do not advance M11 to pass. The required remediation is M11-R001, limited to replacing inherited Frostbound material grammar with independently visible deterministic stone, wood, moss, and botanical treatments through the existing shared composition seam. Preserve geometry, IDs, module boundaries, seeds, semantic text, reference boundary, and all passing technical receipts.

## M11-R002 / V11 re-review — 2026-07-19

Reviewer: project-owner-authorized automated review. Reviewed revision: `c28a2df` (`fix(styles): strengthen enchanted forest material language`). The same technical hard gates and evidence surfaces were re-run and inspected; all passed.

| Dimension | Score | Weighted | Observation |
|---|---:|---:|---|
| Three-style distinction | 3/5 | 9 | The visible crystalline grid is removed and the dark green wood/moss treatment reads as a third family at thumbnail scale. |
| Organic material separation | 2/5 | 6 | Wood bands and moss marks are visible, but weathered stone, wood grain, and moss still read as flat graphic strokes rather than layered materials. |
| Focal hierarchy | 3/5 | 9 | The seed remains identifiable without competing with actions, but lacks grove-depth/support detail. |
| Botanical ornament restraint | 3/5 | 6 | Vines remain outside slots and are restrained. |
| Diffuse bioluminescent lighting | 3/5 | 6 | Local light is bounded and coherent but lacks material interaction. |
| Seeded organic variation | 3/5 | 6 | Deterministic speckles are visible without harming readability. |
| Typography and state language | 3/5 | 6 | Labels are readable after the contrast correction. |
| Portrait composition | 3/5 | 6 | Functional hierarchy is legible but lacks the layered environmental depth of the approved direction. |
| **Total** |  | **54/100** |  |

**Decision: Fail — scored.** No automatic palette-only blocker remains, but the total is below `85/100` and Organic material separation is below `3/5`. `V11-B002` requires deterministic, independently visible stone texture, dark-wood grain, moss growth/masking, and deeper seed-support layering through the shared seam; do not alter geometry, IDs, seeds, semantic text, or production/reference boundaries.
