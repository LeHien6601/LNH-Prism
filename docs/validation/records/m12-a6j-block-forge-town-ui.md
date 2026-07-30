# M12-A6j Block Forge Town functional UI

## Result

Technical preparation passed on 2026-07-31. The bounded
`block-forge-town-ui` job uses approved Town composition, component, and style
authorities and stops at `review-required`.

## Registered authorities

- `town-v1@1.0.0` — `screen-composition`
- `ui-system-v2@2.0.0` — `component-authority`
- `art-direction-v2@2.0.0` — `style-authority`

The existing puzzle and gameplay authorities remain registered project-wide.

## Reconstruction

- Promoted `primary-action`, `small-info-panel`, and `medium-modal-panel`
  foundations are referenced rather than reconstructed.
- `town-resource-counter` provides normal and warning states.
- `town-settings-control` provides normal and pressed states.
- `town-upgrade-offer` provides normal and disabled states.
- `town-level-node` provides completed, selected, and locked states.
- Editable text/icon slots, shared footprints, safe regions, effect padding,
  and scalable counter/offer borders are preserved.
- Environment, building, foliage, path, and prop art are excluded.

## Evidence

| Check | Result |
|---|---|
| Job validation | Pass; four families, nine states, eight constraints |
| Transparent evidence | Pass; nine deterministic SVG/PNG state pairs |
| Preview | Pass; nine family states rendered |
| Native/phone/thumbnail inspection | Pass with one human-review consideration |
| State/isolation/slicing evidence | Pass |
| Reference-pixel boundary | Pass |
| Project audit | Pass; six references, zero findings |

## Visual limitation

The compact upgrade-offer copy remains readable at phone size but is not
comfortably readable at thumbnail size. Its card silhouette, upgrade arrow,
resource cost, and turn-reward grouping remain recognizable. Human review must
decide whether thumbnail text readability is required for this secondary Town
control.

## Next task

M12-A6k is a human decision: Hien approves the Town functional-UI evidence or
returns it with a bounded reason.
