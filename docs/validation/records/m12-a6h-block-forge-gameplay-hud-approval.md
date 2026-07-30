# M12-A6h Block Forge gameplay HUD approval

## Decision

On 2026-07-30, Hien, acting as Product, Art, and UI reviewer, approved the
`block-forge-gameplay-hud` evidence.

Production Lab recorded immutable approval:

- Approval ID: `75bef9c8730d019552f5790ae73a254b50b12a522f63a3ac6081ab266012538a`
- Status check: `valid`
- Stale-source reason: none

## Accepted scope and limitation

- The approval covers `repair-progress-hud`, `turn-counter`, and
  `exit-control`, including their seven recorded states.
- It accepts reuse of all seven previously promoted puzzle, bridge, action, and
  panel families.
- It accepts the source-neutral icons, material depth, and gameplay hierarchy
  shown by the native, phone, and thumbnail evidence.
- The evidence isolates the new HUD families rather than flattening a complete
  gameplay screen into a production asset.
- It does not approve Town, Workshop, Victory, Failure, or the cross-screen
  consistency job.
- It does not authorize assembling an incomplete final Block Forge package.
- Reference pixels remain review evidence only.

## Next task

M12-A6i is agent-ready: build and compare the approved snapshot, validate its
promotion dry-run, and promote the three HUD families as immutable version
`1.0.0`.
