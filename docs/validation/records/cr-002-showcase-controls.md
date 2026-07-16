# CR-002 Validation Record — Bounded Real-Time Showcase Controls

**Status:** 🟢 Complete — approved prototype boundary met.

| Field | Value |
|---|---|
| Validation date | 2026-07-16 |
| Change request | [CR-002](../../change-requests/CR-002-realtime-showcase-controls.md) |
| Review surface | `showcase/index.html#interactive-lab` |
| Components | `primary-button`, `primary-progress-bar` |
| Runtime | Dependency-free classic browser scripts generated from the compiled shared SVG recipe module |

## Scope verified

- Primary Button accepts integer logical widths `160–240` and normal, pressed, or disabled state.
- Primary Progress Bar accepts integer logical widths `320–432` and values `0–100`.
- Active component ID, parameters, component source version, and renderer version remain read-only.
- Panel resizing, persistence, source-spec mutation, and arbitrary layer/material controls are absent.

## Automated evidence

| Check | Result |
|---|---|
| Renderer suite | 🟢 18 tests pass |
| Browser/CLI equivalence | 🟢 Byte-identical SVG strings at Button widths `160`, `200`, `240`, all states, Progress widths `320`, `376`, `432`, and values `0`, `1`, `10`, `50`, `90`, `99`, `100` |
| Bound enforcement | 🟢 Non-integer and out-of-range Button widths, Progress widths, and Progress values throw `RangeError`; HTML controls expose matching bounds and visible invalid state |
| Low-value geometry | 🟢 Fill and highlight radii reduce with narrow fills; `0%` is empty and `1%` remains within the track |
| Provenance | 🟢 `src/renderer/svg-recipes.ts` is bound into Button and Progress manifest source hashes |
| Static-showcase regression | 🟢 Existing components, independent parts, layer names, and combined scenario remain validated |

## Browser evidence

| Context | Result |
|---|---|
| Desktop `1440 × 1000` | 🟢 Both live SVG previews render cleanly; intermediate widths and state changes update immediately |
| Mobile `390 × 844` | 🟢 Single-column controls, traceability, and previews fit without horizontal overflow (`scrollWidth = clientWidth = 375`) |
| Edge and invalid values | 🟢 `1%` and `99%` render; width `159` shows an accessible invalid state and retains the last valid preview |
| Console | 🟢 No errors or warnings |

Browser automation security policy blocks navigation to `file://` URLs, so the interactive behavior was exercised through a temporary localhost server. The delivered page uses classic relative scripts, data-URL SVG previews, no fetch call, and no runtime package; manual direct-file smoke testing remains advisable when reopening the existing local tab.

## Outcome

The scope-boxed prototype meets CR-002 acceptance criteria and does not introduce a second renderer or general-editor capability. The experiment is closed; further interactive controls require a new review.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Recorded automated equivalence, boundary, provenance, desktop/mobile, accessibility, and residual direct-file evidence | Codex |
