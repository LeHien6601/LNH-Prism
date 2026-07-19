# Enchanted Forest third-style visual-contrast rubric

## Status and scope

Draft for the R-016b definition review. Apply this rubric only to a later Enchanted Forest package that follows the approved [implementation definition](../implementation/ENCHANTED_FOREST_THIRD_STYLE_IMPLEMENTATION_SPEC.md) and [ADR-024](../decisions/ADR-024-enchanted-forest-third-style-contrast.md).

Technical correctness is a hard gate, not a visual-score multiplier. The generated review-only reference informs comparison only; it is not a production source or a requirement to copy pixels.

## Required review surfaces

Inspect all of the following before scoring:

| Distance / surface | Required comparison |
|---|---|
| Source distance | Named layers/material isolates and the full `1080 × 1920` portrait; confirm editable structure and hierarchy. |
| Target phone | Full portrait at target-phone scale; confirm labels, progress, actions, and focal hierarchy remain readable. |
| Thumbnail | Frostbound, Volcanic Forge, Enchanted Forest, and the labeled generated reference; confirm Enchanted Forest is visibly distinct before fine detail is legible. |
| Matrix | Seven-component/state coverage, including independently exportable progress frame/fill. |

## Technical hard gate

All items must pass before a visual result can pass:

- Seven existing components, stable IDs, shared geometry, and style-agnostic composition seam are proven; no style-specific renderer/template/geometry fork exists.
- The complete package has valid module, manifest, provenance, clean-workspace, and deterministic receipt evidence.
- Zero baseline plus three named nonzero variation seeds have reproducible receipt evidence; only declared material/ornament variation changes.
- The review-only reference receipt is present, the reference is labeled on review surfaces, and automated production-source scans reject its filename, hash, identical raster content, and direct links.
- The complete matrix, portrait, source/phone/thumbnail comparisons, material isolates, and focal/ornament evidence are present.

Any hard-gate failure produces **Fail — unscored**.

## Visual scoring

Score each dimension from 1–5, then calculate `weight × score / 5`. A pass requires at least `85/100`, no score below `3/5`, and no automatic blocker.

| Dimension | Weight | What earns 5 | Minimum acceptable (3) |
|---|---:|---|---|
| Three-style distinction | 15 | Thumbnail immediately reads as a third family, not a recolor of either existing style. | Organic direction is recognizable and not palette-only. |
| Organic material separation | 15 | Stone, wood, moss, and light channels are independently legible and convincingly layered. | At least three approved material families are distinct without noisy blending. |
| Focal hierarchy | 15 | Soft seed/grove focal guides attention while actions and reward information remain dominant where intended. | Focal is identifiable and does not compete with primary action or labels. |
| Botanical ornament restraint | 10 | Vines/leaves/roots add authored rhythm at anchors without clutter or content collisions. | Ornament supports structure and stays outside slots. |
| Diffuse bioluminescent lighting | 10 | Emerald/teal illumination unifies the family with restrained, component-local glow. | Lighting is coherent and avoids fire/ice language or global bloom. |
| Seeded organic variation | 10 | Wear, grain, moss, and root detail feel intentional across components and vary only within approved bounds. | Variation is visible, reproducible, and does not damage readability. |
| Typography and state language | 10 | Parchment/sage labels and living-light state transitions are readable, consistent, and clearly non-Forge. | Labels remain readable and states preserve hierarchy. |
| Portrait composition | 10 | The portrait has a calm, legible reward hierarchy with balanced negative space. | Primary/secondary actions, progress, and focal are understandable at phone scale. |
| **Total** | **100** |  |  |

## Automatic visual blockers

- A green/cyan palette swap is the only meaningful distinction from Frostbound or Forge.
- Any dominant ice/crystal, lava/fire, brass/gold engraving, rivet/rune/ember, or metal-heat language remains.
- Bioluminescent coverage, halo extent/opacity, ornament count, or mote count exceeds the approved implementation bounds.
- Glow, ornament, or texture obscures a content slot, text, progress value, or state cue.
- The focal reads as a fireball/metal core rather than soft living light, or makes the primary action ambiguous.
- At thumbnail distance the family cannot be distinguished from both existing styles.

## Record format

The later review record must name the reviewer, reference receipt/hash, inspected surfaces, every hard-gate result with evidence paths, each 1–5 dimension score, weighted total, observations, blockers, and pass/fail decision. A failed score identifies bounded remediation without changing the approved inventory or reference boundary.
