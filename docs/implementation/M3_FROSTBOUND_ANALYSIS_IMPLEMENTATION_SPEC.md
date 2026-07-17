# M3 Implementation Specification — Frostbound Concept Analysis

## Document control

| Field | Value |
|---|---|
| Status | 🟢 Approved — Option A |
| Date | 2026-07-17 |
| Milestone | M3 — AI-assisted design analysis and material intake |
| Validation target | V3 — Frostbound Reward Popup |
| Decision source | [ADR-012](../decisions/ADR-012-v3-frostbound-reward.md) |
| Product/art reference | [V3 reference brief](../reference-briefs/V3_FROSTBOUND_REWARD.md) |
| Implementation state | 🟢 Complete — V3 Pass at `94/100` |

## 1. Intended outcome

M3 will turn a primary concept reference into an editable, source-annotated proposal; route every proposal through human review; and rebuild the approved family with versioned specs, reusable materials, and deterministic rendering. Raw AI analysis remains trace evidence and never becomes an implicitly approved production input.

## 2. Required deliverables

- immutable concept receipt with file hash, dimensions, usage boundary, and generation provenance;
- structured analysis proposal covering palette, spacing, silhouette/radius, strokes, lighting, materials, hierarchy, and component tree;
- reference annotations and confidence for every proposal;
- reviewer disposition for every critical proposal: `accepted`, `edited`, `rejected`, or `unresolved`;
- one approved `frostbound-reward` style spec and one approved reusable `frost-crystal-materials` pack;
- deterministic reward panel, primary/secondary button, progress bar, and reward-emblem container specs;
- concept/render comparison and complete V3 evidence package.

## 3. Explicit non-goals

- Pixel extraction, screenshot slicing, automated vector tracing, or concept-derived production masks/textures.
- Automatic approval, silent confidence thresholds, or AI-authored changes to approved specs.
- Pixel-perfect reproduction of the concept raster.
- Free-form drawing, a node editor, per-component AI textures, typography/font selection, animation, game logic, or Unity integration.
- Changing existing V1/V2 contracts incompatibly.

## 4. Analysis proposal model

Each proposal must include:

| Field | Requirement |
|---|---|
| `proposalId` | Stable ID unique within the analysis receipt |
| `category` | `palette`, `spacing`, `shape`, `stroke`, `lighting`, `material`, `hierarchy`, or `component-tree` |
| `observation` | What is directly visible, without recommendation language |
| `recommendation` | Controlled token/spec candidate or `null` |
| `evidence` | Normalized source region and/or concise verbal evidence |
| `confidence` | `high`, `medium`, or `low` |
| `critical` | Whether acceptance affects reconstruction or validation |
| `disposition` | `pending`, `accepted`, `edited`, `rejected`, or `unresolved` |
| `reviewerNote` | Required for `edited`, `rejected`, and critical `unresolved` entries |

Source regions use normalized `x`, `y`, `width`, and `height` values in `0–1`, bound to the concept SHA-256. High confidence means directly observable; medium means a constrained inference; low means a product/art decision. Confidence must never auto-approve a proposal.

## 5. Review and mapping rules

1. Preserve raw analysis as an immutable receipt.
2. Render observation and recommendation separately in the review form.
3. Allow reviewers to edit every proposed production value.
4. Block style/material/component draft generation while any critical proposal is `pending` or `unresolved`.
5. Map only accepted or reviewer-edited proposals into versioned draft artifacts.
6. Record rejected proposals and their rationale without mapping them.
7. Bind every mapped critical field to proposal IDs and reviewer identity/date.
8. Require a second explicit human approval to move draft artifacts to `approved`.

## 6. Bounded reconstruction requirements

| Artifact | Required behavior |
|---|---|
| Reward panel | Two approved heights; independent shadow, border, base, reusable frost detail, edge light, ornament, header/content slots |
| Primary claim button | Normal/pressed/disabled; dominant scale, fill, contrast, and edge-light recipe |
| Secondary later button | Normal/pressed/disabled; bounded subordinate recipe using the same material family |
| Reward progress | Independent frame/fill; `10/50/75/90`; consistent filled/unfilled contrast |
| Reward-emblem container | Normal/selected; selected state differs through silhouette/border/value contrast and not text alone |

Exact baseline sizes and token values are review outputs, not AI defaults. The implementation must reject unapproved IDs/versions and values outside template bounds.

## 7. Material intake boundary

The Frost Crystal pack may contain reusable frost grain, crystal-facet pattern, rune ornament/decal, and source-neutral detail overlays. It must not contain panel/button/progress geometry, labels, shadows, borders, unique component highlights, or pixels cropped from the concept.

Every imported/generated material source requires source type, rights status, prompt/settings when AI-generated, SHA-256, color-space/resolution receipt, seamlessness result where applicable, and normalization settings. At least four component types must reuse the approved pack.

## 8. Implementation slices

| Slice | Work | Exit evidence |
|---|---|---|
| M3-S1 | Define analysis/annotation/review contracts and fixtures | Valid receipts pass; missing evidence, invalid regions, illegal status transitions, and unresolved critical proposals fail |
| M3-S2 | Implement deterministic proposal normalizer and reviewer-editable review artifact | Observation/recommendation separation, confidence display, dispositions, and proposal-to-token lineage are test-covered |
| M3-S3 | Intake/normalize Frost Crystal materials and create reviewed style/material/component drafts | No concept pixels enter sources; preflight, hashes, reuse plan, and human approval package are ready |
| M3-S4 | Reconstruct the approved component family and comparison view | Deterministic outputs, bounded variants, hierarchy/selected-state proof, and concept/render annotations are complete |
| M3-S5 | Prepare V3 evidence and conduct the human gate review | V3-E01–V3-E10, scorecard, defect log, corrections, and revalidation are complete |

Each slice is one task. Do not start a later slice until its dependency and required human approval are recorded.

## 9. Automated validation

- Concept receipt hash and dimensions match the stored reference.
- Proposal IDs, categories, normalized regions, confidence, and dispositions validate.
- Observations cannot populate production fields directly.
- Critical `pending`/`unresolved` proposals block draft mapping.
- Only accepted/edited proposals map; mapping preserves proposal/reviewer lineage.
- Approved artifact IDs/versions are immutable inputs to rendering.
- Final SVG/PNG outputs contain no concept raster reference or concept-derived hash.
- Material-source preflight, masking, seams, deterministic output, state/size, and frame/fill tests pass.
- Primary/secondary hierarchy and selected-state comparison views exist at target-phone scale.
- Manifests bind concept receipt, raw analysis, review record, approved specs/materials, renderer/dependencies, and outputs.

## 10. V3 evidence

Prepare V3-E01 through V3-E10 exactly as defined in [the V3 rubric](../validation/V3_CONCEPT_RECONSTRUCTION_RUBRIC.md). V3 cannot pass on visual similarity alone; reviewer control, source lineage, deterministic structure, reusable material intake, and absence of concept-pixel reuse are mandatory.

## 11. Risks and controls

| Risk | Signal | Control |
|---|---|---|
| False precision | Inferred values appear exact without evidence | Confidence, region evidence, unknown state, and reviewer edit |
| Rubber-stamp review | Proposals move directly into production | Separate review and artifact-approval transitions |
| Pixel leakage | Concept hash/path appears in a production asset | Source audit and automatic blocker |
| Overfitting | Geometry mimics raster artifacts instead of reusable rules | Bounded templates, secondary sizes, and structure/reuse scoring |
| Hierarchy drift | Primary/secondary or selected state remains ambiguous | Dedicated comparison evidence and mandatory minimum |

## 12. Approval outcome

On 2026-07-17, the project owner approved Option A as drafted. The approval covers the proposal model, human-control points, full Panel–Button–Progress plus reward-emblem-container inventory, material boundary, ordered M3-S1 through M3-S5 slices, V3-E01 through V3-E10, scoring thresholds, and automatic blockers.

M3-S1 through M3-S5 are complete. The approved inputs drive five versioned component specs, a deterministic 26-variant family, independent progress frame/fill outputs, hierarchy and selected-state proof, a `540 × 960` portrait reconstruction, and an evidence-only annotated concept comparison. V3-E01 through V3-E10 bind consolidated review views, approved-input and material audits, source and 54-output receipts, no-concept-leakage validation, and preserved defect/revalidation history. On 2026-07-17, the human review recorded 🟢 Pass at `94/100`; every mandatory minimum was met and no blocker or defect remained.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Drafted M3 analysis, review, material-intake, reconstruction, and validation requirements | Codex |
| 2026-07-17 | Approved Option A as drafted and authorized M3-S1 | Project owner |
| 2026-07-17 | Completed M3-S1 concept, analysis, and review contracts with fixtures and focused semantic rejection coverage | Codex |
| 2026-07-17 | Completed M3-S2 deterministic normalization, editable pending-review artifact, immutable decision flow, and accepted/edited token lineage | Codex |
| 2026-07-17 | Completed M3-S3 with three independent procedural Frost Crystal sources, deterministic source preflight/isolation evidence, a four-component-type reuse plan, and a pending human approval package | Codex |
| 2026-07-17 | Approved M3-S3 Option A as drafted, preserved pending history, recorded accepted proposal/package lineage, approved `frost-crystal-materials@0.1.0`, and authorized M3-S4 | Project owner / Codex |
| 2026-07-17 | Completed M3-S4 approved Frostbound specs, deterministic 26-variant family, independent progress parts, portrait reconstruction, hierarchy/selected proof, and annotated comparison evidence | Codex |
| 2026-07-17 | Prepared the complete unscored V3-E01–V3-E10 evidence package and passing automated preflight for the human fidelity gate | Codex |
| 2026-07-17 | Recorded the human V3 review at `94/100`, no blockers or defects, and completed M3 | Project owner / Codex |
