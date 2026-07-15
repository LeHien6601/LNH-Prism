# V1 Acceptance Briefs — Focused Core Components

## Decision

**Status:** 🟢 Approved by project owner on 2026-07-15.  
**Selected scope:** Option A — focused baseline V1 briefs.  
**Reference:** [V1 Neon Core](../reference-briefs/V1_NEON_CORE.md).

The V1 objective is to prove deterministic structure, independent layers, resize behavior, and state generation. It does not attempt to validate a full UI kit.

## Shared rules

| Requirement | Acceptance rule |
|---|---|
| Coordinate system | All dimensions below use logical pixels on the `540 × 960` portrait canvas; render at 2× output |
| Style | Use approved Neon Core tokens, top highlight, deep-navy shadow, and low-opacity reusable grain |
| Layering | Keep shadow, border, fill, grain, highlight, and content independent where applicable |
| Inspection | Review baseline and secondary renders at 100% and 200%, over light and dark backgrounds |
| Source control | Every output links to its style/component/material versions and export manifest |
| Exclusions | No baked text, screenshot extraction, unique AI texture per component, heavy decals, or undocumented manual repair |

## Primary Button — `primary-button`

| Field | Acceptance brief |
|---|---|
| Baseline size | `160 × 56` logical |
| Secondary size | `240 × 56` logical |
| Sizing mode | Nine-slice/stretch-safe horizontal expansion |
| States | `normal`, `pressed`, `disabled` |
| Content | Editable centered label; optional future icon slot is excluded from V1 validation |
| Pressed recipe | Content offset `y: +2` logical pixels; reduce outer-shadow emphasis; no AI regeneration |
| Disabled recipe | Lower visual emphasis and disable top highlight through deterministic layer parameters |
| Pass conditions | Corners/border preserve thickness at both widths; label remains centered; all states are visually distinct; no edge/alpha defect |

## Panel — `primary-panel`

| Field | Acceptance brief |
|---|---|
| Baseline size | `432 × 240` logical |
| Secondary size | `432 × 360` logical |
| Sizing mode | Nine-slice/stretch-safe vertical expansion |
| Layers | Independent outer shadow, border, base fill, low-opacity grain, top highlight, and content slot |
| Content | Empty editable content slot; title, tabs, and decorative frame variants are excluded from V1 |
| Pass conditions | Corners remain undistorted; center fill extends cleanly; shadow/highlight do not scale into artifacts; no background spill on either review background |

## Progress Bar — `primary-progress-bar`

| Field | Acceptance brief |
|---|---|
| Baseline size | `320 × 24` logical |
| Secondary size | `432 × 24` logical |
| Sizing mode | Stretch-safe horizontal expansion; frame and fill are separate renderables |
| Fill inspection | Render at `10%`, `50%`, and `90%` progress for each supported width |
| Content | Numeric/percentage label is excluded from V1; it remains a future content-slot decision |
| Pass conditions | Frame is unchanged by fill percentage; fill stays clipped within its frame; 10% remains readable; 90% does not overlap or clip border; resize does not distort end caps |

## V1 completion evidence

- [ ] Component specs exist for all three IDs and reference `neon-core`.
- [ ] Baseline and secondary-size PNG renders exist for each component.
- [ ] Button normal/pressed/disabled renders exist.
- [ ] Progress renders exist at 10%, 50%, and 90% fill.
- [ ] Each asset has an export manifest and material provenance.
- [ ] V1 scorecard evidence V1-E02 through V1-E05 is prepared before visual review.

## Next decision

Choose the render/export technology that will implement these briefs. The selection must support deterministic masks, gradients, strokes, shadows, clipping, raster PNG export, and a credible path to Unity metadata.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Recorded Option A focused V1 component acceptance briefs | Project owner |
