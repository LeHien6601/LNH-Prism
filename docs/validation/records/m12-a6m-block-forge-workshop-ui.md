# M12-A6m Block Forge Workshop upgrade states

## Result

Technical preparation passed on 2026-07-31. The bounded
`block-forge-workshop-ui` job uses approved Workshop state, component, and style
authorities and stops at `review-required`.

## Registered authorities

- `workshop-states-v1@1.0.0` — `state-authority`
- `ui-system-v2@2.0.0` — `component-authority`
- `art-direction-v2@2.0.0` — `style-authority`

The existing puzzle, gameplay, and Town authorities remain registered
project-wide.

## Reconstruction

- Promoted `primary-action`, `medium-modal-panel`, `town-resource-counter`, and
  `town-upgrade-offer` foundations are referenced rather than reconstructed.
- `workshop-status-indicator` provides warning, valid, and completed states.
- `workshop-upgrade-summary` provides warning, valid, and completed states.
- Editable text/icon slots, shared footprints, safe regions, effect padding,
  and scalable borders are preserved.
- Building evolution, smoke, vegetation, paths, and illustration content are
  excluded.

## Evidence

| Check | Result |
|---|---|
| Job validation | Pass; two families, six states, four constraints |
| Transparent evidence | Pass; six deterministic SVG/PNG state pairs |
| Preview | Pass; six family states rendered |
| Native/phone/thumbnail inspection | Pass with one human-review consideration |
| State/isolation/slicing evidence | Pass |
| Reference-pixel boundary | Pass |
| Project audit | Pass; seven references, zero findings |

## Visual limitation

The full requirement and benefit copy remains readable at phone size but is not
comfortably readable at thumbnail size. Warning, ready, and completed states
remain recognizable through shared silhouettes, gray/cream/green semantic
color, action availability, and confirmation symbols. Human review must decide
whether state recognition is sufficient for the thumbnail surface.

## Next task

M12-A6n is a human decision: Hien approves the Workshop upgrade-state evidence
or returns it with a bounded reason.
