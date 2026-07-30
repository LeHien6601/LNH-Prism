# M12-A3 Production Lab transparent output and review evidence

## Outcome

Passed on 2026-07-30. Production Lab `0.4.0` renders deterministic transparent
PNG derivatives from editable SVG component-family states and creates bounded
visual review surfaces without copying reference pixels into production assets.

## Representative evidence

The ignored `block-forge-puzzle-board` pilot produced:

- 11 isolated editable SVG and transparent PNG state pairs;
- 4 state-comparison sheets;
- 1 engine-neutral slicing preview;
- native `1024x1536`, approximate-phone `360x540`, and thumbnail `180x270`
  reconstruction views;
- geometry, safe-area, exact 8x8 grid, and bridge-anchor overlays;
- side-by-side, adjustable overlay, practical difference,
  reconstruction-only, isolation, state, target-size, and light/dark/checker
  transparency views in `review/index.html`;
- a machine-readable manifest and mobile-readability inspection record.

The evidence manifest rebuilt byte-identically with SHA-256
`8F83A1FD263BA06C6D9634FEB41DA6AF4700D2967F2C59429AC90A1A64563EA9`.
All isolated outputs use 8-bit RGBA PNG, contain transparent pixels, preserve
native dimensions plus declared effect padding, and have zero occupied outer
edge pixels.

## Visual inspection

Codex inspected the native, phone, thumbnail, bridge-state, slicing, and
geometry-overlay PNGs directly.

- Native and approximate-phone hierarchy remained readable.
- Broken, damaged, and repaired bridge states remained distinguishable.
- The geometry surface visibly proved the exact 8x8 square grid and shared
  bridge anchor.
- Slicing borders, stretch center, and content-safe region were visually clear.
- Silhouettes remained identifiable at thumbnail size.
- The prototype `REPAIR` label was too small for comfortable thumbnail reading.
  This is a non-blocking fixture limitation and must not be treated as artistic
  approval.

## Validation

| Command / check | Result |
|---|---|
| `npm run lab -- render-evidence --job block-forge-puzzle-board` | Pass; 11 state assets and review surfaces |
| Repeat evidence render | Pass; identical manifest SHA-256 |
| `npm run test:production-lab` | Pass; 18/18 |
| PNG alpha parser | Pass; RGBA, transparent pixels present |
| Native dimensions and effect padding | Pass for all 11 assets |
| Outer-edge occupancy | Pass; zero for all 11 assets |
| Reference-pixel/image-layer check | Pass |
| Native/phone/thumbnail inspection record | Complete; artistic approval false |

## Boundary and next task

No Unity work, promotion, autonomous approval, reference-pixel extraction, or
engine packaging was added. M12-A4 is next: cross-job drift classification,
immutable approval evidence, stale-source invalidation, concurrency protection,
and interrupted-build recovery.
