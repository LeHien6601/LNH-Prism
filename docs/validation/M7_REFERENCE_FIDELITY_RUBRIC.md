# M7 Visual-Fidelity Rubric — Reference-Fidelity Style Expansion

## Purpose and status

Use this rubric to judge M7's real validation: a sharper, more complex, reference-faithful asset package that replaces the rounded-corner baseline with a wide-hexagon/angular UI language while preserving deterministic, modular, engine-neutral assets.

**Status:** 🟡 Draft — pending definition review.

**Review owner:** ✦ UI lead.

**Required reviewers:** 🧭 Product, 🎨 Art, ✦ UI, and 🛠️ technical leads.

**Not evaluated:** Unity or any engine integration.

Creating this rubric does not pass M7. The gate requires rendered evidence, recorded scores, blocker disposition, and revalidation where needed.

## Preconditions

- ADR-018, the M7 reference brief, this implementation specification, and this rubric are approved.
- The M7 style spec, material pack, and seven component specs are approved and versioned.
- Required states, values, baseline sizes, and secondary proof sizes have deterministic outputs.
- The portrait composition, target-phone views, light/dark inspection surfaces, layer-isolation views, and showroom/handoff evidence exist.
- Manifests validate and bind approved specs, material sources, renderer sources, dependency lock, and output hashes.

If any precondition is absent, record 🔴 Blocked and do not infer missing evidence.

## Evidence package

| Evidence ID | Required artifact | Owner | Pass condition |
|---|---|---|---|
| V7-E01 | Approved ADR-018, M7 reference brief, implementation specification, and rubric | 🧭 / 🎨 / ✦ / 🛠️ | Scope, shape language, non-goals, and review controls are unambiguous |
| V7-E02 | Versioned M7 style, material pack, material sources, and seven component specs | 🤖 / 🛠️ | Contracts validate; IDs, versions, statuses, bounds, and source rights are complete |
| V7-E03 | Full component/state/value matrix at baseline and secondary proof sizes | 🤖 | Every required output is inspectable at `100%` and `200%` |
| V7-E04 | Portrait composition at logical and `2×` output scale | ✦ | Combined hierarchy and realistic use are reviewable |
| V7-E05 | Wide-hexagon/angular shape-fidelity board | 🎨 / ✦ | Buttons, panels, tabs, badges, progress, and icon containers visibly follow the approved angular language |
| V7-E06 | Light/dark, target-phone, layer-isolation, and material-isolation views | 🎨 / 🛠️ | Readability, alpha, masks, seams, protected edges, and material contribution are visible |
| V7-E07 | State, size, clipping, browser/showroom equivalence, and determinism test report | 🤖 / 🛠️ | All approved automated checks pass |
| V7-E08 | Material reuse, no-reference-pixel, provenance, and output-integrity audit | 🛠️ | Complete reproducible chain; one material pack serves at least four component types |
| V7-E09 | Asset-only handoff evidence | 🤖 / 🛠️ | Showroom displays outputs or exact asset file/folder addresses are recorded; no engine project is required |
| V7-E10 | Defect log, retrospective, corrective actions, and revalidation record | ✦ / 🛠️ | Every blocker has root cause, owner, correction, and proof |

## Scoring

Score each dimension from `0` to `5`; half points are allowed.

| Dimension | Weight | What a 5 means | Minimum for gate |
|---|---:|---|---:|
| Shape fidelity and angular silhouette | 20 | Wide-hexagon buttons and angular components clearly replace the rounded baseline and match the approved reference intent | 4 |
| Visual hierarchy and mobile readability | 15 | Primary action, secondary action, progress/value, tabs, badges, and icon containers read immediately at target-phone scale | 4 |
| Style complexity and material richness | 15 | Layered bevels, edge energy, plate detail, grain/pattern, and ornament feel richer while remaining controlled | 4 |
| Cross-component consistency and material reuse | 15 | One reusable material language visibly serves at least four component types without component-specific baked effects | 4 |
| Deterministic structure, states, and modularity | 20 | Named layers, independent parts, bounded states/sizes, safe content areas, progress frame/fill separation, and modular outputs remain inspectable | 4 |
| Traceability, reproducibility, and asset handoff | 15 | Approved inputs, material provenance, renderer/dependencies, manifests, output hashes, showroom/file addresses, and package validation form a complete chain | 5 |

**Weighted score:** `sum(score / 5 × weight)` out of `100`.

| Outcome | Requirement |
|---|---|
| 🟢 Pass | `≥ 85`, every dimension meets its minimum, all V7 evidence exists, and no blocker remains |
| 🟡 Conditional pass | `83–84`, every dimension meets its minimum, no blocker remains, and corrective tasks are owned before the next production package |
| 🔴 Fail | `< 83`, any minimum/evidence requirement is missed, or a blocker remains |

The mandatory minimums produce a mathematical floor of `83/100`.

## Automatic blockers

Any item below produces 🔴 Fail regardless of weighted score:

- Primary M7 buttons read as rounded pills, rounded rectangles, or soft capsules rather than wide hexagons.
- Reference/concept pixels, crops, traces, hashes, or embedded raster references appear in production component structure or material sources.
- A component/state/size requires manual repainting or a regenerated AI texture.
- Fewer than four component types demonstrably reuse the approved M7 material pack.
- Geometry, borders, shadows, labels, icons, values, or component-specific lighting are baked into a material source.
- Pattern/grain/decal pixels escape their masks, expose seams, or distort protected edges at required sizes.
- Content safe areas overlap angled caps or clip labels/icons at baseline or secondary proof sizes.
- Primary/secondary hierarchy, selected state, or disabled state relies on text alone.
- Progress frame/fill are not independent or required values clip incorrectly.
- Browser/showroom preview and CLI output disagree for the approved matrix.
- Manifest provenance cannot reproduce the reviewed output.
- Evidence claims engine readiness or includes engine integration as a completion requirement.
- Final outputs are not visible in the showroom and no exact file/folder handoff address is supplied.

## Review procedure

1. Preflight V7-E01 through V7-E10, statuses, hashes, tests, manifests, and package completeness.
2. Inspect the shape-fidelity board first; reject rounded baseline drift before scoring surface polish.
3. Inspect every component/state/size at `100%`, `200%`, target-phone scale, and on light/dark surfaces.
4. Inspect material and layer isolation; verify optional ornament can be hidden without destroying the family.
5. Audit material sources and outputs for reference-pixel leakage and component-specific baked effects.
6. Trace a sample of outputs from approved specs through renderer/dependency versions to manifests and output hashes.
7. Score independently, classify defects, correct the smallest blocker root cause, and append revalidation without overwriting the original review.

## Focused review checklist

### Shape fidelity

- [ ] Primary button reads as a wide hexagon at phone scale.
- [ ] Secondary button belongs to the same angular family.
- [ ] Panel/container language is chamfered or faceted rather than rounded.
- [ ] Tabs, badges, progress frame, and icon container share the same angular vocabulary.

### Style complexity

- [ ] Bevels, edge lights, shadows, and surface detail are independently inspectable.
- [ ] Ornament/decal layers add richness but are not required for component structure.
- [ ] Materials do not overpower labels, icons, values, or progress readability.
- [ ] The family remains coherent with optional ornaments hidden.

### Reuse and handoff

- [ ] One material pack is reused on at least four component types.
- [ ] States and secondary proof sizes need no manual pixel repair.
- [ ] Progress frame/fill and all editable icon/text/value slots remain independent.
- [ ] Outputs are visible in the showroom or exact asset file/folder addresses are recorded.

## Scorecard template

Copy this section into `docs/validation/records/v7-reference-fidelity-style-expansion.md` when the V7 evidence package is prepared.

```md
# V7 Validation Record — Reference-Fidelity Style Expansion

Status: 🟡 In review
Review date: <YYYY-MM-DD>
Reference brief: docs/reference-briefs/M7_REFERENCE_FIDELITY_STYLE_EXPANSION.md
Implementation specification: docs/implementation/M7_REFERENCE_FIDELITY_IMPLEMENTATION_SPEC.md
Style/material/component versions: <IDs and versions>
Renderer version: <version>

| Dimension | Weight | Score (0–5) | Weighted result | Evidence | Reviewer | Notes |
|---|---:|---:|---|---|---|---|
| Shape fidelity and angular silhouette | 20 | | | V7-E03, E05, E06 | 🎨 / ✦ | |
| Visual hierarchy and mobile readability | 15 | | | V7-E04, E06 | 🎨 / ✦ | |
| Style complexity and material richness | 15 | | | V7-E05, E06, E08 | 🎨 / ✦ | |
| Cross-component consistency and material reuse | 15 | | | V7-E03, E06, E08 | 🎨 / 🛠️ | |
| Deterministic structure, states, and modularity | 20 | | | V7-E02, E03, E07 | ✦ / 🛠️ | |
| Traceability, reproducibility, and asset handoff | 15 | | | V7-E07, E08, E09, E10 | 🛠️ | |

Weighted score: <0–100>
Automatic blockers: <none or list>
Decision: 🟢 Pass / 🟡 Conditional pass / 🔴 Fail

| Issue ID | Category | Severity | Corrective action | Owner | Revalidation evidence |
|---|---|---|---|---|---|
| | spec / renderer / material / export / process / reference ambiguity | | | | |

## Retrospective

- Did the result clearly move away from rounded baseline geometry?
- Which style-complexity controls improved quality most?
- Which controls caused avoidable implementation cost?
- Which corrections must land before the next asset package?
```

## Approval checklist

- [ ] Evidence IDs and owners are sufficient.
- [ ] Shape-fidelity blocker rules protect the wide-hexagon direction.
- [ ] Dimension weights and minimums reflect M7 priorities.
- [ ] `≥85` Pass and `83–84` Conditional-pass thresholds are accepted.
- [ ] Asset-only/showroom or file-address handoff is mandatory.
- [ ] Unity and engine integration remain explicitly out of scope.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-18 | Drafted M7 evidence, scoring, blocker, review, and handoff requirements | Codex |
