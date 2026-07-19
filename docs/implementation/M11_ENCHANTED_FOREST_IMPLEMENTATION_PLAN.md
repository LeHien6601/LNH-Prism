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
| M11-A3 | 🟢 Complete | Rendered the seven-component matrix and `1080 × 1920` portrait through shared templates, with source-scale material/focal isolates and source/phone/thumbnail comparison surfaces. | Required states and independent progress parts are visible; organic materials, restrained lighting/ornament, living focal, and readable semantic text follow the approved bounds. | Render/evidence validator, focused renderer test, contract/reference-boundary/control-drift validation, and visual target-phone inspection passed. |
| M11-A4 | 🟢 Complete | Assembled the engine-neutral SVG/PNG module package, manifest/provenance receipts, clean-workspace reproduction, seed receipts, and unscored technical preflight. | The 52-module bounded package and all V11 hard-gate artifacts reproduce without changing approved M7–M10 outputs. | Package/manifest/hash audit, clean-workspace byte comparison, seed receipt audit, reference-boundary scan, contracts, and control-drift check passed. |
| M11-A5 / V11 | 🟢 Complete — failed | Project-owner-authorized automated review recorded a technical hard-gate pass but visual fail at `41/100`; `V11-B001` identifies a palette-only Frostbound material grammar. | The V11 pass condition was not met: three-style distinction and organic material separation scored `1/5`; botanical ornament and seeded variation scored `2/5`. | [V11 review record](../validation/records/v11-enchanted-forest-third-style-review.md). |
| M11-R001 | 🟢 Complete | Replaced the visible Frostbound crystal-grid face with deterministic dark-wood bands, weathered-stone surfaces, moss variation, and botanical structure through the shared composition seam. | Regenerated source, phone, thumbnail, matrix, package, seeds, provenance, clean-workspace, and reference-boundary evidence remain valid with shared geometry/IDs. | Focused renderer test, regenerated package preflight, contracts, reference-boundary, and control-drift checks passed. |
| M11-R002 / V11 re-review | 🟢 Complete — failed | Authorized automated re-review passed technical hard gates but scored `54/100`; `V11-B002` identified insufficient material separation and seed-support depth. | The V11 pass condition was not met: Organic material separation scored `2/5` and the weighted total was below `85/100`. | Appended review record with evidence paths, scores, observations, and decision. |
| M11-R003 | 🟢 Complete | Added deterministic stone chips, dark-wood grain, moss masks, and layered seed roots through the shared composition seam. | Source, phone, and thumbnail surfaces expose independently editable material-detail and focal-root layers while preserving geometry, IDs, seeds, semantic text, and reference boundary. | Focused renderer/material tests, regenerated package/evidence receipts, technical preflight, reference-boundary, and control-drift checks. |
| M11-R004 / V11 re-review | 🟢 Complete — failed | Authorized automated re-review passed technical hard gates but scored `54/100`; `V11-B003` found that component faces and isolates still lack independently legible organic material layers. | The V11 pass condition was not met: Organic material separation scored `2/5` and the weighted total was below `85/100`. | Appended review record with evidence paths, scores, observations, and decision. |
| M11-R005 | 🔵 Agent-ready | Integrate layered weathered-stone texture, directional dark-wood grain, moss growth/masking, and visible focal roots into component faces and source isolates through the shared seam. | Source, phone, thumbnail, and isolate surfaces show three independently legible organic materials plus deeper focal roots while preserving geometry, IDs, seeds, semantic text, and reference boundary. | Focused renderer/material tests, regenerated evidence/package receipts, technical preflight, reference-boundary, and control-drift checks. |

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
