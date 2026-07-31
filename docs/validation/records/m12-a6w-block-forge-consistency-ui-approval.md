# M12-A6w Block Forge cross-screen consistency UI approval

## Decision

On 2026-07-31, Hien, acting as Product, Art, and UI reviewer, approved the
`block-forge-consistency-ui` evidence.

Production Lab recorded immutable approval:

- Approval ID: `2f6a5b4315d030bb43339eb293780724e3d7e12b9cae503c9ad94a811a6c66f6`
- Status check: `valid`
- Stale-source reason: none

## Accepted scope and limitation

- The approval covers `secondary-action` and `review-status-indicator`.
- It accepts reuse of promoted `primary-action` and `medium-modal-panel`
  foundations.
- It accepts the editable Retry-versus-Town hierarchy and green reviewed-status
  cue shown by native, phone, and thumbnail evidence.
- It explicitly accepts that detailed action labels are not comfortably
  readable at thumbnail size; the action hierarchy and reviewed cue remain
  recognizable.
- Screen compositions, buildings, gameplay board, modal illustrations, bridge
  art, and environment content remain excluded.
- It does not authorize a full-screen reconstruction or incomplete final
  Block Forge package.
- Reference pixels remain review evidence only.

## Next task

M12-A6x is agent-ready: build and compare the approved snapshot, validate its
promotion dry-run, and promote the two consistency families as immutable version
`1.0.0` components.
