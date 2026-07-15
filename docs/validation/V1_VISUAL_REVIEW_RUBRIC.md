# V1 Visual-Review Rubric — Core UI Components

## Purpose

Use this rubric for **V1**, the first real LNH Prism validation: one Primary Button, Panel, and Progress Bar built from deterministic specifications and shown in a target mobile UI context.

**Status:** 🟡 Draft — requires 🟣 art/UI/technical review before V1 use.  
**Review owner:** ✦ UI lead.  
**Required reviewers:** 🎨 art lead, 🛠️ technical lead; 🎮 Unity reviewer once the sample scene exists.

## Preconditions

- The V1 reference brief, target device scale, and component acceptance briefs are approved.
- Each asset has a versioned style spec, component spec, and export manifest.
- Button states include normal, pressed, and disabled.
- The Button, Panel, and Progress Bar are rendered at their baseline size and one additional supported size.
- The review package contains light and dark background previews; the Unity sample scene is required for integration sign-off.

If a precondition is missing, record **🔴 Blocked**. Do not substitute an assumption for an approved art/UI decision.

## Evidence package

| Evidence ID | Required artifact | Owner | Pass condition |
|---|---|---|---|
| V1-E01 | Approved reference brief and target device scale | 🎨 / ✦ | Source of visual intent is unambiguous |
| V1-E02 | Versioned style/component/material specs | 🤖 / 🛠️ | IDs and versions match the manifests |
| V1-E03 | Baseline and secondary-size renders for all three components | 🤖 | Assets are inspectable at 100% and 200% |
| V1-E04 | Button normal/pressed/disabled renders | 🤖 | States are distinct and parameter-driven |
| V1-E05 | Light and dark background composites | ✦ | Alpha, edge, and shadow behavior is visible |
| V1-E06 | Unity sample-scene screenshots/video | 🎮 | Slicing, pivots, and runtime readability are visible |
| V1-E07 | Defect log and revalidation record | ✦ / 🛠️ | Every blocker has a disposition |

## Scoring

Score each criterion from 0 to 5, then multiply by its weight. Scores may be recorded in 0.5 increments.

| Dimension | Weight | What a 5 means | Minimum for gate |
|---|---:|---|---:|
| Visual hierarchy and mobile readability | 20 | Primary action, values, and progress are immediately readable at the target phone scale | 4 |
| Style consistency | 20 | Palette, radius, border, lighting, and material strength read as one family across all components | 4 |
| Edge, alpha, and layer quality | 15 | Clean anti-aliased edges; no background color spill, halos, baked cross-component effects, or unintended pixels | 4 |
| State and size behavior | 15 | Button states and two sizes preserve intent; protected corners/borders do not distort | 4 |
| Editability and reuse | 15 | Token, size, and state changes are demonstrated without manual repainting; Progress frame and fill remain independent | 4 |
| Traceability and reproducibility | 10 | Source versions, material provenance, renderer version, hashes, and output metadata are complete | 5 |
| Unity integration | 5 | Correct pivot, slicing, state use, and readability in the sample scene | 4 |

**Weighted score:** `sum(score / 5 × weight)` out of 100.

### Gate decision

| Outcome | Requirement |
|---|---|
| 🟢 Pass | Score ≥ 85, every dimension meets its minimum, and no blocker remains |
| 🟡 Conditional pass | Score 75–84 with no blocker; corrective tasks have owners and dates before the next milestone starts |
| 🔴 Fail | Score < 75, any dimension misses its minimum, or any blocker remains |

## Automatic blockers

Any of the following produces a 🔴 Fail regardless of score:

- A concept screenshot or extracted raster is used as the final reusable component source.
- A button/panel/progress component has visible background spill, halo, clipped edge, or transparency defect on either review background.
- Button text is irreversibly baked into a reusable control without an approved exception.
- Pressed/disabled state requires a fresh AI generation rather than deterministic state parameters.
- Progress frame and fill cannot be independently resized or rendered.
- Manifest/spec IDs, versions, or source provenance cannot reproduce the reviewed output.
- Unity slicing, pivot, or state usage requires undocumented per-asset repair.

## Review procedure

1. **Prepare — 🤖 / 🛠️:** collect V1-E01 through V1-E06; validate specifications before visual review.
2. **Inspect — 🎨 / ✦:** review all components at 100% and 200%, then in target-phone context. Score the first six dimensions independently before discussing a final score.
3. **Integrate — 🎮:** review Unity sample-scene evidence and score integration.
4. **Decide — ✦ + 🛠️:** calculate weighted score, identify blockers, and record Pass, Conditional pass, or Fail.
5. **Improve — assigned owner:** categorize every issue as `spec`, `renderer`, `material`, `export`, `process`, or `reference ambiguity`; fix the smallest root cause first.
6. **Revalidate — same reviewers:** repeat only the affected evidence and scores; retain the original record for traceability.

## Scorecard template

Copy this section into `docs/validation/records/v1-<feature-id>.md` when V1 begins.

```md
# V1 Validation Record — <feature-id>

Status: 🟡 In review
Review date: <YYYY-MM-DD>
Reference brief: <path/link>
Target device scale: <value>
Style/component/material versions: <IDs and versions>
Renderer version: <version>

| Dimension | Weight | Score (0–5) | Weighted result | Evidence | Reviewer | Notes |
|---|---:|---:|---:|---|---|---|
| Visual hierarchy and mobile readability | 20 | | | V1-E03, V1-E06 | 🎨 / ✦ | |
| Style consistency | 20 | | | V1-E03 | 🎨 / ✦ | |
| Edge, alpha, and layer quality | 15 | | | V1-E03, V1-E05 | 🎨 / ✦ | |
| State and size behavior | 15 | | | V1-E03, V1-E04 | ✦ / 🛠️ | |
| Editability and reuse | 15 | | | V1-E02, V1-E04 | 🛠️ | |
| Traceability and reproducibility | 10 | | | V1-E02, V1-E07 | 🛠️ | |
| Unity integration | 5 | | | V1-E06 | 🎮 | |

Weighted score: <0–100>
Automatic blockers: <none or list>
Decision: 🟢 Pass / 🟡 Conditional pass / 🔴 Fail

| Issue ID | Category | Severity | Corrective action | Owner | Revalidation evidence |
|---|---|---|---|---|---|
| | spec / renderer / material / export / process / reference ambiguity | | | | |
```

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial V1 rubric draft | Codex |
