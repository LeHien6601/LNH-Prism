# M12-A2 Production Lab state and geometry constraints

## Outcome

Passed on 2026-07-30. Production Lab `0.3.0` validates first-class component
families, shared base layers, inherited state overrides, state footprints,
anchors, replaceable text/icon slots, native size and resize behavior, effect
padding, scalable regions, canvas/safe-area containment, touch targets, fixed
size/aspect, grid alignment, and exact Block Forge 8x8 square geometry.

Unity integration, transparent PNG delivery, approval hardening, promotion, and
engine-neutral package assembly remain out of scope.

## Representative evidence

`production-lab/examples/block-forge-state-constraints.json` declares:

- one 640x640 board containing an exact 8x8 grid of 80x80 cells;
- one reusable 80x80 puzzle-unit family;
- broken, damaged, and repaired bridge states sharing a 640x160 footprint and
  one anchor;
- normal, pressed, and disabled button states sharing base construction;
- replaceable text and icon slots;
- effect padding, safe areas, touch target, and scalable-region metadata.

The fixture was applied to the ignored `block-forge-puzzle-board` pilot job.
`validate-job` produced a passing machine-readable report for four component
families, eleven states, and nine geometry constraints.

No screenshot or generated-reference pixels were added to tracked assets.
Visual preview inspection was not applicable to this contract milestone because
family rendering and PNG review surfaces are explicitly M12-A3.

## Validation

| Command | Result |
|---|---|
| `npm run lab -- validate-job --job block-forge-puzzle-board` | Pass; 4 families, 11 states, 9 constraints |
| `npm run test:production-lab` | Pass; 16/16 |
| `npm run build:renderer` | Pass |
| `npm run test:renderer` | Pass; 56/56 |
| `npm run validate:contracts` | Pass |
| `npm run test:review-reference-boundary` | Pass; 3/3 |
| `npm run validate:control-drift` | Pass; M12-A3 aligned |
| `npm run test:control-drift` | Pass; 4/4 |
| `git diff --check` | Pass |

## Negative coverage

Focused tests reject non-8x8 declarations, non-square board bounds, state
footprint drift, state anchor drift, missing inherited layers, canvas escape,
negative effect padding, invalid scalable borders, and insufficient localization
metadata.

## Next task

M12-A3 is agent-ready: deterministic transparent PNG output, alpha and
effect-padding validation, slicing and state previews, plus native, approximate
phone, and thumbnail review surfaces.
