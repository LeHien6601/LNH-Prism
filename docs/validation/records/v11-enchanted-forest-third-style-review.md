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

## M11-R004 / V11 re-review — 2026-07-19

Reviewer: project-owner-authorized automated review. Reviewed revision: `e720984` (`fix(styles): deepen enchanted forest material layers`). Inspected `M11-E-source-scale.html`, `M11-E-target-phone.html`, `M11-E-thumbnail.html`, `M11-E-review-reference.html`, the 26-entry matrix, target-phone PNG, material/focal isolate PNGs, manifest, seed receipts, clean-workspace receipt, and generalized-seam proof.

All technical hard gates passed: `npm run validate:m11-a4-package`, `npm run validate:m11-a3-evidence`, `npm run validate:contracts`, focused M11 rendering coverage, serial review-reference boundary coverage, and `npm run validate:control-drift`. The package retains 52 modules, 26 matrix entries, zero plus three named nonzero seeds, the shared composition seam, semantic target-phone text, and production/reference isolation.

| Dimension | Score | Weighted | Observation |
|---|---:|---:|---|
| Three-style distinction | 3/5 | 9 | The dark green botanical family remains distinguishable from Frostbound and Forge at thumbnail scale. |
| Organic material separation | 2/5 | 6 | Stone remains a flat face, wood a small set of parallel lines, and moss mostly dots/curves; the material isolate does not show three convincingly layered, independently legible organic treatments. |
| Focal hierarchy | 3/5 | 9 | The seed roots add support depth and actions remain dominant, but the focal isolate still presents a shallow halo/diamond treatment. |
| Botanical ornament restraint | 3/5 | 6 | Vines and roots remain bounded and outside content slots. |
| Diffuse bioluminescent lighting | 3/5 | 6 | Local green light is coherent and restrained but has little interaction with the material layers. |
| Seeded organic variation | 3/5 | 6 | Deterministic variation is present and readable, but it does not yet carry the material separation. |
| Typography and state language | 3/5 | 6 | Semantic labels and state hierarchy remain readable at target-phone scale. |
| Portrait composition | 3/5 | 6 | The reward hierarchy is legible, but environmental depth remains limited. |
| **Total** |  | **54/100** |  |

**Decision: Fail — scored.** Technical correctness does not change the visual result. `V11-B003` is a bounded visual blocker: integrate independently visible weathered-stone texture, directional dark-wood grain, and moss growth/masking into the actual component faces and their source isolates, and make the focal-root depth visible in its isolate. Preserve shared geometry, stable IDs, seeds, semantic text, module boundaries, and the review-reference boundary. M11-R005 is the next agent-ready remediation.

## M11-R014 / V11 re-review — 2026-07-19

Reviewer: `project-owner-authorized automated review`.

Reviewed revision: `2dae2cf` (`feat(renderer): integrate enchanted forest material surfaces`). Reference receipt SHA-256: `02ae9c86a7bd86debed494cd530cb65d09eec715b6be02aa127f24fb02e3e2b6`.

Evidence inspected: the full-scale source, `320 × 568` target-phone view, thumbnail, generated-reference comparison, production-derived material and living-focal isolates, Frostbound and Forge comparison surfaces, representative normal/pressed/disabled/highlighted matrix states, the 26-entry matrix receipt, 52-module manifest, named seeds and clean-workspace receipt, generalized-seam proof, and production/reference-boundary evidence. The generated concept was used only as comparison evidence; no generated reference pixels entered production assets.

### Technical hard gate

| Gate | Outcome | Evidence |
|---|---|---|
| Deterministic package and provenance | Pass | `validate:m11-a4-package` validated 26 entries, 52 module receipts, named seeds, clean workspace, provenance, seam evidence, technical preflight, and 370 production files clear of review-reference pixels. |
| Required visual surfaces and editable structure | Pass | `validate:m11-a3-evidence` validated the matrix, independent progress parts, material/focal isolates, portrait, and four review surfaces. |
| Contracts and renderer build | Pass | `validate:contracts` and `build:renderer` completed successfully. |
| Focused M11 behavior | Pass | Four focused renderer/material/focal tests passed. |
| Review-reference isolation | Pass | Three serial boundary tests passed, including both Enchanted Forest leak rejection cases. |
| Control alignment | Pass | `validate:control-drift` confirmed M11-R014 and all three review-reference receipts. |

Technical hard-gate outcome: **Pass**. No automatic blocker was triggered.

### Visual scoring

| Dimension | Score | Weighted | Observation |
|---|---:|---:|---|
| Three-style distinction | 4/5 | 12 | The organic green ancient-grove family is readily distinguishable from Frostbound crystal and Forge metal/lava at phone and thumbnail scale. |
| Organic material separation | 4/5 | 12 | Connected stone, wood, moss, and living-root regions remain independently identifiable, though several treatments still resolve as broad graphic bands rather than convincing material joins. |
| Focal hierarchy | 4/5 | 12 | The aligned leaf-seed focal, woven root cradle, and portrait placement create a clearer reward path without obscuring actions. |
| Botanical ornament restraint | 3/5 | 6 | Ornament stays bounded, but repeated primitive marks and broad ribbons remain visually busy on compact controls. |
| Diffuse bioluminescent lighting | 3/5 | 6 | Living light is local and non-fire/non-ice, but it only weakly modulates adjacent stone, wood, and moss surfaces. |
| Seeded organic variation | 4/5 | 8 | Variation is visible, deterministic, family-specific, and bounded by named seeds. |
| Typography and state language | 3/5 | 6 | Labels remain readable; pressed motion is visible, but disabled and highlighted responses are too subtle at target-phone scale. |
| Portrait composition | 4/5 | 8 | The taller panel and aligned focal/action stack improve the vertical rhythm, though flat plate-like surface treatments limit depth. |
| **Total** |  | **70/100** | All dimension minima pass; the weighted total does not. |

### Blocker and decision

`V11-B008 — integrated surface craftsmanship and state response`: M11-R013 materially improves connected regions, focal alignment, and portrait hierarchy, but the stone/wood/moss system still reads partly as broad graphic ribbons and flat plates. Repeated primitive marks remain busy on small controls, living light does not convincingly affect neighboring materials, and disabled/highlighted state language is subtle.

**Decision: Fail — scored.** The technical hard gate passes and no dimension is below `3/5`, but `70/100` is below the required `85/100`. M11-R015 is the next agent-ready remediation: reshape the existing regions into material-specific, scale-aware faceted stone breaks, directional wood relief, and moss growth transitions; reduce compact-control clutter; and strengthen bounded normal/pressed/disabled/highlighted living-light response. This remediation must preserve the approved component inventory and material families, shared geometry and seam, stable IDs, named seeds, reproducibility, and review-reference isolation.

## M11-R006 / V11 re-review — 2026-07-19

Reviewer: project-owner-authorized automated review. Reviewed revision: `d1ad719` (`fix(styles): deepen enchanted forest face materials`). Inspected all required source, target-phone, thumbnail, reference-comparison, matrix, isolate, package, seed, clean-workspace, and generalized-seam surfaces.

Technical hard-gate outcome: **Pass**. `validate:m11-a4-package`, `validate:m11-a3-evidence`, contracts, focused M11 renderer coverage, serial review-reference boundary coverage, and control-drift validation all passed. The 52-module package, 26-entry matrix, named seed/baseline receipts, shared geometry/seam, semantic labels, and review-reference boundary remain intact.

| Dimension | Score | Weighted | Observation |
|---|---:|---:|---|
| Three-style distinction | 3/5 | 9 | The green organic family remains distinct from Frostbound and Forge. |
| Organic material separation | 3/5 | 9 | The source isolate and component faces now distinguish weathered stone, dark wood grain, moss growth, and living root light. |
| Focal hierarchy | 3/5 | 9 | The seed and roots are identifiable while actions remain readable. |
| Botanical ornament restraint | 2/5 | 4 | Large moss-growth silhouettes and broad face markings compete with the contained UI language instead of acting as restrained anchored ornament. |
| Diffuse bioluminescent lighting | 3/5 | 6 | Local living light is bounded and not fire/ice-like. |
| Seeded organic variation | 3/5 | 6 | Variation is deterministic and visible within approved bounds. |
| Typography and state language | 3/5 | 6 | Labels remain readable and action hierarchy is preserved. |
| Portrait composition | 2/5 | 4 | The enlarged material marks create uneven visual weight in the panel and compete with the calm reward hierarchy. |
| **Total** |  | **53/100** |  |

**Decision: Fail — scored.** The total is below `85/100`; Botanical ornament restraint and Portrait composition are below `3/5`. `V11-B004` requires reducing material-mark scale and opacity, confining moss growth to edge/anchor regions, and rebalancing the face treatments around the content hierarchy while retaining the newly distinct material channels. M11-R007 is the next agent-ready remediation.

## M11-R012 / V11 re-review — 2026-07-19

Reviewer: `project-owner-authorized automated review`. Reviewed revision: `4d84baf` (`feat(renderer): deepen enchanted forest material clusters`). Reference receipt: `enchanted-forest-review-reference-1080x1920.receipt.json`, SHA-256 `02ae9c86a7bd86debed494cd530cb65d09eec715b6be02aa127f24fb02e3e2b6`.

Inspected `M11-E-source-scale.html`, `M11-E-target-phone.html`, `M11-E-thumbnail.html`, `M11-E-review-reference.html`, the target-phone PNG, production-derived material isolate, focal/ornament isolate, Frostbound and Volcanic Forge comparison portraits, representative panel/button normal/pressed/disabled matrix outputs, the 26-entry matrix receipt, 52-module manifest, seed receipts, clean-workspace receipt, generalized-seam proof, and production-reference boundary evidence.

### Technical hard gate

| Requirement | Evidence / validation | Result |
|---|---|---|
| Shared seven-component geometry and no style-specific renderer | `M11-A4-generalized-seam-proof.json`; `src/renderer/style-composition.ts` | Pass |
| Package, manifest, provenance, and clean reproduction | `npm run validate:m11-a4-package`; 26 matrix entries and 52 modules validated | Pass |
| Zero baseline plus three reproducible nonzero seeds | `M11-A4-variation-receipts.json` records `0`, `51731`, `104729`, and `8675309` | Pass |
| Review-reference receipt and production boundary | Serial `review-reference-boundary.test.mjs`; 370 production files clear | Pass |
| Matrix, portrait, isolates, semantic text, and states | `npm run validate:m11-a3-evidence`; focused M11 renderer tests; `npm run validate:contracts` | Pass |

Technical hard-gate outcome: **Pass**. Technical correctness is not used to increase visual scores.

### Visual scoring

| Dimension | Weight | Score | Weighted | Evidence-based observation |
|---|---:|---:|---:|---|
| Three-style distinction | 15 | 4/5 | 12 | At thumbnail distance the dark organic palette, stone chips, wood knots, moss patches, and vines read as a third family distinct from the ice and forge portraits; shared angular geometry remains conspicuous. |
| Organic material separation | 15 | 4/5 | 12 | The production-derived isolate and component faces make stone, wood, moss/lichen, and living light independently legible, but the face marks still sit as sparse decals rather than fully integrated layered surfaces. |
| Focal hierarchy | 15 | 3/5 | 9 | The living seed remains identifiable and does not compete with actions, but the simple diamond, circle, halo, and short roots provide limited grove depth. |
| Botanical ornament restraint | 10 | 3/5 | 6 | Vines and authored clusters stay outside semantic slots, though their isolated sticker-like rhythm is more diagrammatic than structural. |
| Diffuse bioluminescent lighting | 10 | 3/5 | 6 | Emerald/teal light is local, coherent, and avoids fire/ice language, but it has little visible interaction with stone, wood, moss, or the focal roots. |
| Seeded organic variation | 10 | 4/5 | 8 | Component-aware cluster placement visibly varies by recorded seed and preserves readability; repetition remains noticeable because each family uses one small primitive grammar. |
| Typography and state language | 10 | 3/5 | 6 | Semantic labels remain readable and state outputs differ reproducibly, but the state transitions and label treatment remain subtle rather than distinctly living-light. |
| Portrait composition | 10 | 3/5 | 6 | Actions, progress, and focal are understandable at phone scale, but large empty areas and weak material/focal integration keep the reward path visually plain. |
| **Total** | **100** |  | **65/100** |  |

### Blocker and decision

- **V11-B007 — material/focal integration and portrait cohesion:** R011 successfully replaces the generic glyphs with distinct production-derived primitives, but the component faces still read as isolated stone, wood, and moss decals on broad flat fields. The living-light focal remains shallow and does not illuminate or connect to those material regions, so the authored detail does not form a cohesive ancient-grove hierarchy.

**Decision: Fail — scored at `65/100`.** Every visual dimension meets its `3/5` minimum and no automatic visual blocker applies, but the weighted total remains below `85/100`. M11-R013 is the next agent-ready remediation: integrate the existing bounded stone-chip, wood-knot/grain, and moss/lichen primitives into connected edge-anchored component surface regions with family-specific depth/light response; deepen the existing seed/root interaction and rebalance the portrait material rhythm. Do not add component types or material families, and preserve semantic slots, restraint, shared geometry/seam, stable IDs, deterministic seeds, receipts, and the reference-pixel boundary.

## M11-R010 / V11 re-review — 2026-07-19

Reviewer: `project-owner-authorized automated review`. Reviewed revision: `a82fb3c` (`feat(renderer): add enchanted forest material clusters`). Reference receipt: `enchanted-forest-review-reference-1080x1920.receipt.json`, SHA-256 `02ae9c86a7bd86debed494cd530cb65d09eec715b6be02aa127f24fb02e3e2b6`.

Inspected `M11-E-source-scale.html`, `M11-E-target-phone.html`, `M11-E-thumbnail.html`, `M11-E-review-reference.html`, the target-phone PNG, material and focal/ornament isolate PNGs, Frostbound and Volcanic Forge comparison portraits, representative panel/button matrix outputs including normal/pressed/disabled states, the 26-entry matrix receipt, 52-module manifest, seed receipts, clean-workspace receipt, generalized-seam proof, and production-reference boundary evidence.

### Technical hard gate

| Requirement | Evidence / validation | Result |
|---|---|---|
| Shared seven-component geometry and no style-specific renderer | `M11-A4-generalized-seam-proof.json`; `src/renderer/style-composition.ts` | Pass |
| Package, manifest, provenance, and clean reproduction | `npm run validate:m11-a4-package`; 26 matrix entries and 52 modules validated | Pass |
| Zero baseline plus three reproducible nonzero seeds | `M11-A4-variation-receipts.json` records `0`, `51731`, `104729`, and `8675309` | Pass |
| Review-reference receipt and production boundary | Serial `review-reference-boundary.test.mjs`; 370 production files clear | Pass |
| Matrix, portrait, isolates, semantic text, and states | `npm run validate:m11-a3-evidence`; focused M11 renderer tests; `npm run validate:contracts` | Pass |

Technical hard-gate outcome: **Pass**. Technical correctness is not used to increase visual scores.

### Visual scoring

| Dimension | Weight | Score | Weighted | Evidence-based observation |
|---|---:|---:|---:|---|
| Three-style distinction | 15 | 3/5 | 9 | The dark organic palette, vines, and material marks distinguish the family from Frostbound and Forge at thumbnail distance, but the shared angular composition remains visually dominant. |
| Organic material separation | 15 | 3/5 | 9 | Stone, wood, moss, and root-light channels are named and separately visible, but production faces reduce them to sparse flat glyphs rather than convincingly layered materials. |
| Focal hierarchy | 15 | 3/5 | 9 | The seed/halo is identifiable and does not compete with actions, but it remains a simple diamond-and-circle treatment without strong living-grove depth. |
| Botanical ornament restraint | 10 | 3/5 | 6 | Vines and clusters remain restrained and avoid content slots, though their rhythm is sparse and diagrammatic. |
| Diffuse bioluminescent lighting | 10 | 3/5 | 6 | Emerald/teal light is bounded, coherent, and avoids fire/ice language; material interaction remains shallow. |
| Seeded organic variation | 10 | 3/5 | 6 | Cluster placement visibly varies by recorded seed and preserves readability, but the marks do not yet feel richly authored. |
| Typography and state language | 10 | 3/5 | 6 | Semantic labels remain readable and normal/pressed/disabled hierarchy is preserved at target-phone scale. |
| Portrait composition | 10 | 3/5 | 6 | Actions, progress, and focal are understandable, but large empty areas and a weak focal-to-action path keep the composition visually plain. |
| **Total** | **100** |  | **57/100** |  |

### Blocker and decision

- **V11-B006 — authored cluster fidelity:** the R009 clusters are deterministic, component-scaled, and restrained, but visually resolve as dots, short lines, and small geometric pieces. They do not yet provide convincing weathered-stone chips, wood knots/grain fragments, moss/lichen patches, or an authored material rhythm across the seven components.

**Decision: Fail — scored at `57/100`.** Every visual dimension meets the `3/5` minimum and no automatic visual blocker applies, but the weighted total remains below `85/100`. M11-R011 is the next agent-ready remediation: replace the generic cluster glyphs with a bounded reusable library of distinctly legible stone-chip, wood-knot/grain, and moss/lichen cluster primitives; use seeded component-aware placement/density, derive the material isolate from the same primitives, and preserve restraint, semantic slots, shared geometry/seam, stable IDs, receipts, and the reference-pixel boundary.

## M11-R008 / V11 re-review — 2026-07-19

Reviewer: project-owner-authorized automated review. Reviewed revision: `177604b` (`fix(styles): restrain enchanted forest face treatment`). All required source, phone, thumbnail, reference-comparison, matrix, isolate, package, seed, clean-workspace, and generalized-seam surfaces were inspected.

Technical hard-gate outcome: **Pass**. Package/evidence validation, focused renderer coverage, serial review-reference boundary coverage, and control-drift validation passed. The 52-module package, 26-entry matrix, seed/baseline receipts, shared seam, semantic labels, and production/reference boundary are unchanged.

| Dimension | Score | Weighted | Observation |
|---|---:|---:|---|
| Three-style distinction | 3/5 | 9 | The organic green family remains distinct from Frostbound and Forge. |
| Organic material separation | 3/5 | 9 | Stone, wood, moss, and root-light channels remain independently legible. |
| Focal hierarchy | 3/5 | 9 | The seed remains identifiable without obscuring actions or labels. |
| Botanical ornament restraint | 3/5 | 6 | The restraint layer improves containment at anchors, meeting the minimum without creating collisions. |
| Diffuse bioluminescent lighting | 3/5 | 6 | Local living light is coherent and bounded. |
| Seeded organic variation | 3/5 | 6 | Variation remains visible, deterministic, and bounded. |
| Typography and state language | 3/5 | 6 | Labels and state hierarchy are readable at target-phone scale. |
| Portrait composition | 3/5 | 6 | The hierarchy is now understandable, but still visually plain and materially repetitive. |
| **Total** |  | **57/100** |  |

**Decision: Fail — scored.** Every visual minimum is now met, but the weighted total is below `85/100`. `V11-B005` requires one bounded authored-detail refinement: replace repeated broad line motifs with smaller, component-scaled stone/wood/moss clusters that vary by seed and preserve the established restraint. M11-R009 is the next agent-ready remediation.

## M11-R008 / V11 re-review — 2026-07-19

Reviewer: project-owner-authorized automated review. Reviewed revision: `177604b` (`fix(styles): restrain enchanted forest face treatment`). All required source, phone, thumbnail, reference-comparison, matrix, isolate, package, seed, clean-workspace, and generalized-seam surfaces were inspected.

Technical hard-gate outcome: **Pass**. Package/evidence validation, focused renderer coverage, serial review-reference boundary coverage, and control-drift validation passed. The 52-module package, 26-entry matrix, seed/baseline receipts, shared seam, semantic labels, and production/reference boundary are unchanged.

| Dimension | Score | Weighted | Observation |
|---|---:|---:|---|
| Three-style distinction | 3/5 | 9 | The organic green family remains distinct from Frostbound and Forge. |
| Organic material separation | 3/5 | 9 | Stone, wood, moss, and root-light channels remain independently legible. |
| Focal hierarchy | 3/5 | 9 | The seed remains identifiable without obscuring actions or labels. |
| Botanical ornament restraint | 3/5 | 6 | The restraint layer improves containment at anchors, meeting the minimum without creating collisions. |
| Diffuse bioluminescent lighting | 3/5 | 6 | Local living light is coherent and bounded. |
| Seeded organic variation | 3/5 | 6 | Variation remains visible, deterministic, and bounded. |
| Typography and state language | 3/5 | 6 | Labels and state hierarchy are readable at target-phone scale. |
| Portrait composition | 3/5 | 6 | The hierarchy is now understandable, but still visually plain and materially repetitive. |
| **Total** |  | **57/100** |  |

**Decision: Fail — scored.** Every visual minimum is now met, but the weighted total is below `85/100`. `V11-B005` requires one bounded authored-detail refinement: replace repeated broad line motifs with smaller, component-scaled stone/wood/moss clusters that vary by seed and preserve the established restraint. M11-R009 is the next agent-ready remediation.

## M11-R006 / V11 re-review — 2026-07-19

Reviewer: project-owner-authorized automated review. Reviewed revision: `d1ad719` (`fix(styles): deepen enchanted forest face materials`). Inspected all required source, target-phone, thumbnail, reference-comparison, matrix, isolate, package, seed, clean-workspace, and generalized-seam surfaces.

Technical hard-gate outcome: **Pass**. `validate:m11-a4-package`, `validate:m11-a3-evidence`, contracts, focused M11 renderer coverage, serial review-reference boundary coverage, and control-drift validation all passed. The 52-module package, 26-entry matrix, named seed/baseline receipts, shared geometry/seam, semantic labels, and review-reference boundary remain intact.

| Dimension | Score | Weighted | Observation |
|---|---:|---:|---|
| Three-style distinction | 3/5 | 9 | The green organic family remains distinct from Frostbound and Forge. |
| Organic material separation | 3/5 | 9 | The source isolate and component faces now distinguish weathered stone, dark wood grain, moss growth, and living root light. |
| Focal hierarchy | 3/5 | 9 | The seed and roots are identifiable while actions remain readable. |
| Botanical ornament restraint | 2/5 | 4 | Large moss-growth silhouettes and broad face markings compete with the contained UI language instead of acting as restrained anchored ornament. |
| Diffuse bioluminescent lighting | 3/5 | 6 | Local living light is bounded and not fire/ice-like. |
| Seeded organic variation | 3/5 | 6 | Variation is deterministic and visible within approved bounds. |
| Typography and state language | 3/5 | 6 | Labels remain readable and action hierarchy is preserved. |
| Portrait composition | 2/5 | 4 | The enlarged material marks create uneven visual weight in the panel and compete with the calm reward hierarchy. |
| **Total** |  | **53/100** |  |

**Decision: Fail — scored.** The total is below `85/100`; Botanical ornament restraint and Portrait composition are below `3/5`. `V11-B004` requires reducing material-mark scale and opacity, confining moss growth to edge/anchor regions, and rebalancing the face treatments around the content hierarchy while retaining the newly distinct material channels. M11-R007 is the next agent-ready remediation.
