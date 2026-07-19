# M11 Enchanted Forest implementation and evidence plan

## Status

R-020 planning complete. This plan sequences approved M11 work from [ADR-024](../decisions/ADR-024-enchanted-forest-third-style-contrast.md), [ADR-025](../decisions/ADR-025-enchanted-forest-definition-approval.md), the [implementation definition](ENCHANTED_FOREST_THIRD_STYLE_IMPLEMENTATION_SPEC.md), and [V11 rubric](../validation/ENCHANTED_FOREST_THIRD_STYLE_RUBRIC.md). It authorizes no work beyond the individual task currently marked Agent-ready in `PROJECT_OVERVIEW.md`.

## Fixed controls

- Reuse exactly panel, primary hex button, secondary hex button, progress frame/fill, tab, badge, and icon container through shared angular wide-hex geometry and the style-agnostic composition seam.
- Keep stone, wood, moss, bioluminescence, variation, ornament, focal, typography, lighting, and state layers independently editable and provenance-bound.
- Keep the Enchanted Forest generated reference review-only. Its filename, hash, identical raster content, direct links, and raster SVG `<image>` use are forbidden in production assets.
- Use explicit named seeds, including a zero baseline and at least three nonzero seeds. Variation may affect only declared material/ornament masks.
- At target-phone scale, required labels/progress values remain semantic text, unobscured, and must later score at least `3/5` for Mobile-scale readability and state distinction.

## Ordered slices

| ID | Execution | Scope | Acceptance criteria | Validation |
|---|---|---|---|---|
| R-020 | 🟢 Complete | Define the M11 sequence, ownership, dependencies, evidence, and exit gate. | Each M11 hard-gate surface has one owning slice; no slice combines unrelated contract, render, package, and review work. | Cross-link/dependency scan and `git diff --check`. |
| R-018 / M11-A1 | 🟢 Complete | Generalized review-reference production-boundary validation for registered styles and added Enchanted Forest registration/negative cases. No renderer, material, or package work changed. | Forge remains covered; Enchanted Forest filename, SHA-256, identical raster, direct SVG link, and raster `<image>` leaks fail deterministically. | Focused negative tests for both references and existing M10 package validation passed with 318 production files clear. |
| R-019 / M11-A2 | 🟢 Complete | Added Enchanted Forest versioned style/material/variation/ornament/focal/typography/lighting/state bindings and contract coverage through the existing composition seam. | Stable IDs, shared geometry, named zero/nonzero seed behavior, independent editable layers, source provenance, and all approved bounds validate; no M11 renderer/template branch exists. | `build:renderer`, contract validation, focused renderer seed tests, reference-boundary checks, and control-drift validation passed. |
| M11-A3 | 🔵 Agent-ready | Render the seven-component matrix and `1080 × 1920` portrait through shared templates; create source-scale material/focal isolates and source/phone/thumbnail comparison surfaces. | Required states and independent progress parts are visible; organic materials, restrained lighting/ornament, living focal, and readable semantic text follow the approved bounds. | Focused renderer tests, clipping/slot/readability checks, three-distance evidence existence and provenance checks. |
| M11-A4 | 🔵 Agent-ready after M11-A3 | Assemble engine-neutral SVG/PNG modules, manifest/provenance receipts, clean-workspace reproduction, seed receipts, technical preflight, and comparison evidence. | Complete bounded package and all V11 hard-gate artifacts reproduce without changing approved M7–M10 outputs. | Package/manifest/hash audit, clean-workspace byte comparison, seed receipt audit, reference-boundary scan, control-drift check. |
| M11-A5 / V11 | 🟣 Human decision | Conduct the Enchanted Forest third-style review against the approved rubric. | Every hard gate passes; visual score is `≥85/100`, no dimension is below `3/5`, no blocker is open, and Mobile-scale readability/state distinction is `≥3/5`. | Recorded review with all scores, evidence paths, observations, and decision. |

## Evidence ownership map

| Required V11 evidence | Owning slice |
|---|---|
| Generated-reference receipt, registration, and no-production-pixel scan | M11-A1 |
| Style/material/variation/ornament/focal/typography/lighting/state definitions and source provenance | M11-A2 |
| Seven-component/state matrix; independent progress frame/fill; material/focal/ornament isolates; source/phone/thumbnail surfaces | M11-A3 |
| Modular package, manifest/hash receipts, clean workspace, seed/baseline receipts, technical preflight | M11-A4 |
| Technical hard-gate outcome, visual scores, observations, and pass/fail record | M11-A5 / V11 |

## Dependency and non-goal rules

M11-A1 must finish before any Enchanted Forest binding or production source exists. M11-A2 must finish before rendering. M11-A3 must finish before package/evidence work. M11-A4 must finish before V11 scoring. A failure returns only the smallest owning slice for remediation.

No slice authorizes an editor, engine integration, a new component type, geometry/template rewrite, unseeded randomness, flattened production-only effects, or any use of generated-reference pixels.

## Exit gate

M11 passes only when M11-A5 records all hard gates passing and a V11 score of at least `85/100`, with no dimension below `3/5`, no automatic blocker, and Mobile-scale readability and state distinction at least `3/5`.
