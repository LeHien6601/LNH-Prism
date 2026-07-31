# M12-A6n Block Forge Workshop upgrade-state approval

## Decision

On 2026-07-31, Hien, acting as Product, Art, and UI reviewer, approved the
`block-forge-workshop-ui` evidence.

Production Lab recorded immutable approval:

- Approval ID: `7556278d432508c59583afcb340cd8ef80a263384c7a20be21c322874a4b41b7`
- Status check: `valid`
- Stale-source reason: none

## Accepted scope and limitation

- The approval covers `workshop-status-indicator` and
  `workshop-upgrade-summary`, including their warning, valid, and completed
  states.
- It accepts reuse of promoted `primary-action`, `medium-modal-panel`,
  `town-resource-counter`, and `town-upgrade-offer` foundations.
- It accepts the source-neutral icons, semantic color hierarchy, and state
  distinctions shown by the native, phone, and thumbnail evidence.
- It explicitly accepts that full secondary copy is not comfortably readable
  at thumbnail size; warning, ready, and completed states remain recognizable
  through silhouette, semantic color, action availability, and confirmation.
- Building evolution, smoke, vegetation, paths, and illustration content remain
  excluded.
- It does not approve Victory, Failure, or the cross-screen consistency job.
- It does not authorize assembling an incomplete final Block Forge package.
- Reference pixels remain review evidence only.

## Next task

M12-A6o is agent-ready: build and compare the approved snapshot, validate its
promotion dry-run, and promote the two Workshop families as immutable version
`1.0.0`.
