# M12-A6d Block Forge UI families

## Result

Technical preparation passed on 2026-07-30. The bounded
`block-forge-ui-families` job uses the approved UI component and art-direction
references and stops at `review-required`.

## Reconstruction

- `primary-action@1.0.0` is referenced from the promoted project library and is
  not reconstructed independently.
- `small-info-panel` provides normal and selected states.
- `medium-modal-panel` provides normal and selected states.
- `popup-panel` provides normal and selected states.
- All three families preserve editable named layers, replaceable text/icon
  slots, content-safe regions, effect padding, and scalable-region metadata.
- Reference observations and recommendations remain separate from production
  geometry; no reference pixels are embedded or linked.

## Evidence

| Check | Result |
|---|---|
| Job validation | Pass; three families, six states, six geometry constraints |
| Transparent evidence | Pass; six deterministic SVG/PNG state pairs |
| Preview | Pass; six family states rendered in the comparison overlay |
| Native inspection | Pass; three panel roles remain distinct |
| Phone inspection | Pass; content and frame hierarchy remain clear |
| 180-pixel thumbnail inspection | Pass; silhouettes remain recognizable |
| Slicing/state/isolation surfaces | Pass |
| Project audit | Pass; zero findings |
| Production Lab tests | Pass; 27 tests |

The audit now treats a registered `component-authority` as valid bounded
geometry authority for component-family jobs. Primary puzzle geometry remains
required for puzzle jobs.

## Visual limitation

The reconstruction intentionally uses source-neutral flat editable geometry
rather than reproducing painted wood grain or reference pixels. Human review
must judge whether the retained silhouette, hierarchy, palette roles, and
panel-family distinctions are sufficient for this pilot.

## Next task

M12-A6e is a human decision: Hien approves the UI-family evidence or returns it
with a bounded reason.
