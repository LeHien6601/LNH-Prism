# M12-A6t Block Forge Failure modal approval

## Decision

On 2026-07-31, Hien, acting as Product, Art, and UI reviewer, approved the
`block-forge-failure-modal` evidence.

Production Lab recorded immutable approval:

- Approval ID: `afd95e3f8f08cf007a1e0a714a90606995a0cf6d69d33990bf7a69e478bd36b5`
- Status check: `valid`
- Stale-source reason: none

## Accepted scope and limitation

- The approval covers `failure-heading` and `failure-progress-summary`.
- It accepts reuse of promoted `medium-modal-panel` and `primary-action`
  foundations.
- It accepts the editable clock-led failure message, source-neutral target
  marker, and incomplete-progress hierarchy shown by native, phone, and
  thumbnail evidence.
- It explicitly accepts that detailed secondary progress copy is not
  comfortably readable at thumbnail size; the Failure cue and incomplete
  progress silhouette remain recognizable.
- Gameplay board, environment, bridge illustration, particles, and background
  art remain excluded.
- It does not authorize a full-screen reconstruction or incomplete final
  Block Forge package.
- Reference pixels remain review evidence only.

## Next task

M12-A6u is agent-ready: build and compare the approved snapshot, validate its
promotion dry-run, and promote the two Failure families as immutable version
`1.0.0` components.
