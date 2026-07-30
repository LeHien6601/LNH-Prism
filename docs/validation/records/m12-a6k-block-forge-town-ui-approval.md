# M12-A6k Block Forge Town functional-UI approval

## Decision

On 2026-07-31, Hien, acting as Product, Art, and UI reviewer, approved the
`block-forge-town-ui` evidence.

Production Lab recorded immutable approval:

- Approval ID: `1aaf50b99595fc8fb62101970bcd228017c403161e63122cfbdab6ae3d4b0b08`
- Status check: `valid`
- Stale-source reason: none

## Accepted scope and limitation

- The approval covers `town-resource-counter`, `town-settings-control`,
  `town-upgrade-offer`, and `town-level-node`, including their nine recorded
  states.
- It accepts reuse of promoted `primary-action`, `small-info-panel`, and
  `medium-modal-panel` foundations.
- It accepts the source-neutral icons, material hierarchy, and functional state
  distinctions shown by the native, phone, and thumbnail evidence.
- It explicitly accepts that compact secondary upgrade-offer copy is not
  comfortably readable at thumbnail size; the control silhouette, upgrade
  action, resource cost, and turn-reward grouping remain recognizable.
- Environment, building, foliage, path, and prop art remain excluded.
- It does not approve Workshop, Victory, Failure, or the cross-screen
  consistency job.
- It does not authorize assembling an incomplete final Block Forge package.
- Reference pixels remain review evidence only.

## Next task

M12-A6l is agent-ready: build and compare the approved snapshot, validate its
promotion dry-run, and promote the four Town families as immutable version
`1.0.0`.
