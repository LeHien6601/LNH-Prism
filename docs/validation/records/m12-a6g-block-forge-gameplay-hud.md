# M12-A6g Block Forge gameplay HUD

## Result

Technical preparation passed on 2026-07-30. The bounded
`block-forge-gameplay-hud` job uses approved composition, state, component, and
style authorities and stops at `review-required`.

## Registered authorities

- `gameplay-main-v2@2.0.0` — `screen-composition`
- `gameplay-states-v1@1.0.0` — `state-authority`
- `ui-system-v2@2.0.0` — `component-authority`
- `art-direction-v2@2.0.0` — `style-authority`

The existing puzzle authority remains registered project-wide.

## Reconstruction

- All seven promoted puzzle, bridge, action, and panel families are referenced
  rather than reconstructed.
- `repair-progress-hud` provides normal, warning, and completed states.
- `turn-counter` provides normal and warning states.
- `exit-control` provides normal and pressed states.
- Editable text/icon slots, shared footprints, safe regions, effect padding,
  and scalable HUD borders are preserved.

## Evidence

| Check | Result |
|---|---|
| Job validation | Pass; three families, seven states, six constraints |
| Transparent evidence | Pass; seven deterministic SVG/PNG state pairs |
| Preview | Pass; seven family states rendered |
| Native/phone/thumbnail inspection | Pass |
| State/isolation/slicing evidence | Pass |
| Reference-pixel boundary | Pass |
| Project audit | Pass; five references, zero findings |

## Visual limitation

The evidence isolates newly reconstructed HUD families and records promoted
composition dependencies by reference; it does not flatten the complete
gameplay screen into a new asset. Human review must judge whether the simplified
source-neutral icons and material depth preserve sufficient gameplay hierarchy.

## Next task

M12-A6h is a human decision: Hien approves the gameplay HUD evidence or returns
it with a bounded reason.
