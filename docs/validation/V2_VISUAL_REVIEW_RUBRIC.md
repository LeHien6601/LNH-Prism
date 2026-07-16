# V2 Visual-Review Rubric — Neon Market Kit

## Purpose and status

Use this rubric to judge M2's real validation: a coherent Neon Market shop-popup family built from shared tokens, deterministic recipes, and one reusable Neon Alloy material pack.

**Status:** 🟢 Approved — Option A accepted by the project owner on 2026-07-16.

**Review owner:** ✦ UI lead.

**Required reviewers:** 🎨 Art lead and 🛠️ technical lead.
**Not evaluated:** AI analysis (M3) and Unity integration (M4).

Creating this rubric does not pass V2. The gate requires rendered evidence, recorded scores, blocker disposition, and revalidation where needed.

## Preconditions

- ADR-011, the V2 reference brief, M2 implementation specification, and this rubric are approved.
- The `neon-market` style, `neon-alloy-materials` pack, and all six component specs are approved and versioned.
- All required states, values, baseline sizes, and secondary sizes have deterministic outputs.
- One realistic portrait shop scenario, target-phone view, light/dark inspection surfaces, and layer-isolation views are available.
- Manifests validate and bind resolved style ancestry, components, material sources, renderer sources, dependency lock, and output hashes.
- The controlled token-propagation variant exists separately from canonical approved outputs.

If any precondition is absent, record 🔴 Blocked and do not infer missing evidence.

## Evidence package

| Evidence ID | Required artifact | Owner | Pass condition |
|---|---|---|---|
| V2-E01 | Approved ADR-011, V2 reference brief, implementation specification, and rubric | 🧭 / 🎨 / 🛠️ | Scope, controls, and review rules are unambiguous |
| V2-E02 | Versioned schemas, resolved style, six component specs, material pack, and material sources | 🤖 / 🛠️ | Contracts validate; status/IDs/versions and source rights are complete |
| V2-E03 | Full component/state/value matrix at baseline and secondary sizes | 🤖 | Every required output is inspectable at `100%` and `200%` |
| V2-E04 | Portrait Neon Market scenario at logical and `2×` output scale | ✦ | Hierarchy and realistic combined use are reviewable |
| V2-E05 | Light/dark surfaces plus grain/pattern/decal/layer-isolation views | ✦ / 🎨 | Alpha, seams, masks, protected edges, and material contribution are visible |
| V2-E06 | Shared token-propagation before/after proof | 🤖 / 🛠️ | All six components update through one source change without repainting or unrelated drift |
| V2-E07 | State, size, clipping, browser/CLI equivalence, and determinism test report | 🤖 / 🛠️ | All approved automated checks pass |
| V2-E08 | Resolved inheritance, material reuse, provenance, and output-integrity audit | 🛠️ | Complete reproducible chain and reuse map are reviewer-visible |
| V2-E09 | Defect log, retrospective, corrective actions, and revalidation record | ✦ / 🛠️ | Every blocker has a root cause, owner, correction, and proof |

## Scoring

Score each dimension from `0` to `5`; half points are allowed. Multiply each score by its weight.

| Dimension | Weight | What a 5 means | Minimum for gate |
|---|---:|---|---:|
| Visual hierarchy and mobile readability | 15 | Shop title/category, currency, offer progress, and purchase action are immediately readable at target-phone scale | 4 |
| Cross-component consistency and material reuse | 25 | All six components clearly share palette, pattern scale, bevel, edge light, and lighting direction; one pack visibly serves at least four types | 4 |
| Surface, edge, mask, and layer quality | 15 | Clean edges and alpha; no seams, pattern spill, clipped highlights, distorted protected areas, or baked cross-component effects | 4 |
| State, size, and token-propagation behavior | 20 | Required states/sizes preserve intent and one shared token mutation updates all six components without repainting or unrelated drift | 4 |
| Editability, structure, and bounded reuse | 15 | Named SVG layers, independent content/parts, typed material slots, and bounded overrides remain inspectable and reusable | 4 |
| Traceability and reproducibility | 10 | Resolved ancestry, source rights/hashes, renderer/dependency versions, manifests, and output hashes reproduce the reviewed set | 5 |

**Weighted score:** `sum(score / 5 × weight)` out of `100`.

### Gate decision

| Outcome | Requirement |
|---|---|
| 🟢 Pass | Score `≥ 85`, every dimension meets its minimum, all V2 evidence exists, and no blocker remains |
| 🟡 Conditional pass | Score `82–84`, every dimension meets its minimum, no blocker remains, and corrective tasks are owned before M3 starts |
| 🔴 Fail | Score `< 82`, any dimension misses its minimum, required evidence is absent, or any blocker remains |

The mandatory dimension minimums produce a mathematical floor of `82/100`; scores below `82` cannot qualify for Conditional Pass even if no automatic blocker is recorded.

## Automatic blockers

Any item below produces 🔴 Fail regardless of weighted score:

- A screenshot/extracted raster or AI-generated image is used as final component structure.
- A component or state requires its own regenerated surface texture.
- Fewer than four component types demonstrably reuse the approved material pack.
- Geometry, borders, shadows, labels, values, or component-specific lighting are baked into a material source.
- Pattern/grain/decal pixels escape their mask, expose an obvious seam, or distort a protected edge at a required size.
- A required state is manually repainted or generated by AI instead of resolved from deterministic parameters.
- The controlled shared-token mutation does not update all six components, or it changes unrelated geometry/content/IDs.
- Progress frame and fill cannot be independently rendered or low/high values clip incorrectly.
- Content slots do not move with their owning component/state transform.
- Manifest provenance cannot reproduce the reviewed output, including resolved style ancestry and material sources.
- M2 evidence claims AI-analysis or Unity-integration readiness without the later milestone gates.

## Review procedure

1. **Preflight — 🤖 / 🛠️:** verify V2-E01 through V2-E09, contract status, renderer tests, manifests, hashes, and approved matrix completeness.
2. **Inspect components — 🎨 / ✦:** review every component/state/size at `100%`, `200%`, target-phone scale, and on light/dark surfaces.
3. **Inspect material reuse — 🎨 / 🛠️:** compare isolated grain, pattern, decal, edge-light, and bevel layers; verify reuse and bounded differences.
4. **Inspect propagation — ✦ / 🛠️:** compare canonical and controlled token-mutation outputs; reject manual repairs or unrelated changes.
5. **Score independently — all reviewers:** record evidence-linked scores before agreeing on a gate result.
6. **Improve — assigned owner:** classify defects as `spec`, `resolver`, `renderer`, `material`, `export`, `process`, or `reference ambiguity`; correct the smallest blocker root cause immediately.
7. **Revalidate — same reviewers:** append affected evidence/scores and retain the original record unchanged.

## Focused review checklist

### Combined scenario

- [ ] Purchase action dominates secondary/cancel action.
- [ ] Selected tab is obvious without relying on text alone.
- [ ] Currency value and progress remain readable at target-phone scale.
- [ ] Pattern, glow, and bevel do not compete with product/content slots.

### Reuse and structure

- [ ] Neon Alloy is visibly reused on at least four component types.
- [ ] The base family remains coherent with optional decals hidden.
- [ ] Content, surface, lighting, border, extrusion, and shadow remain independently inspectable.
- [ ] Progress frame/fill and all editable icon/text/value slots remain independent.

### Behavior and traceability

- [ ] States and secondary sizes need no manual pixel repair.
- [ ] Shared-token mutation reaches all six components through resolved specs.
- [ ] Unsupported controls/ranges fail rather than silently clamp.
- [ ] Every reviewed output resolves to approved, hashed inputs and a pinned renderer.

## Scorecard template

Copy this section into `docs/validation/records/v2-neon-market-kit.md` when the V2 evidence package is prepared.

```md
# V2 Validation Record — Neon Market Kit

Status: 🟡 In review
Review date: <YYYY-MM-DD>
Reference brief: docs/reference-briefs/V2_NEON_MARKET.md
Implementation specification: docs/implementation/M2_NEON_MARKET_IMPLEMENTATION_SPEC.md
Style/material/component versions: <IDs and versions>
Renderer version: <version>

| Dimension | Weight | Score (0–5) | Weighted result | Evidence | Reviewer | Notes |
|---|---:|---:|---:|---|---|---|
| Visual hierarchy and mobile readability | 15 | | | V2-E03, E04, E05 | 🎨 / ✦ | |
| Cross-component consistency and material reuse | 25 | | | V2-E03, E05, E08 | 🎨 / ✦ | |
| Surface, edge, mask, and layer quality | 15 | | | V2-E03, E05, E07 | 🎨 / 🛠️ | |
| State, size, and token-propagation behavior | 20 | | | V2-E03, E06, E07 | ✦ / 🛠️ | |
| Editability, structure, and bounded reuse | 15 | | | V2-E02, E05, E08 | 🛠️ | |
| Traceability and reproducibility | 10 | | | V2-E02, E07, E08, E09 | 🛠️ | |

Weighted score: <0–100>
Automatic blockers: <none or list>
Decision: 🟢 Pass / 🟡 Conditional pass / 🔴 Fail

| Issue ID | Category | Severity | Corrective action | Owner | Revalidation evidence |
|---|---|---|---|---|---|
| | spec / resolver / renderer / material / export / process / reference ambiguity | | | | |

## Retrospective

- What improved production quality or throughput?
- Which controls or contracts caused avoidable work?
- Which root-cause corrections must land before the next validation?
- Which non-blockers are deferred, with owner and milestone?
```

## Approval checklist

- [x] Evidence IDs and owners are sufficient.
- [x] Dimension weights and minimums reflect M2 priorities.
- [x] `≥ 85` Pass and `82–84` Conditional-pass thresholds are accepted.
- [x] Automatic blockers protect material reuse, deterministic structure, propagation, and provenance.
- [x] AI analysis and Unity integration remain explicitly deferred.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Drafted V2 evidence, scoring, blocker, review, revalidation, and retrospective requirements | Codex |
| 2026-07-16 | Approved Option A and clarified Conditional Pass to the mathematically reachable `82–84` range | Project owner |
