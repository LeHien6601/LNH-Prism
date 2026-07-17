# M5 Production-Hardening Validation Plan

## Status

M5-A1 definition and M5-A2 implementation are complete. The passing receipt is recorded at `docs/validation/evidence/m5-production-hardening/M5-A2-reproducibility-receipt.json`; deferred hardening slices remain out of scope.

## Purpose

Validate that the Frostbound Reward asset package can be reproduced from pinned repository inputs, detected when it drifts, and assessed with measured—not assumed—delivery characteristics.

## Fixed validation target

| Field | Value |
|---|---|
| Package | `assets/frostbound-reward` |
| Package ID/version | `frostbound-reward-assets` / `1.0.0` |
| Components | Panel, Primary Button, Secondary Button, Progress, Emblem |
| Source evidence | `m3-s4-frostbound-reconstruction` |
| Baseline receipt | `docs/validation/evidence/m5-production-hardening/M5-A1-package-baseline.json` |

The package remains engine-neutral. No runtime project, importer, atlas, prefab, scene, or device build is part of M5.

## M5-A2 batch contract

M5-A2 must implement one deterministic command that writes a versioned receipt under `docs/validation/evidence/m5-production-hardening/` and performs all of the following:

1. Build the renderer and validate source contracts.
2. Create a fresh temporary copy of the repository inputs required by the package assembler; it must not reuse the checked-in package directory.
3. Run the package assembler in that clean copy and validate its manifest.
4. Compare every module path, byte count, and SHA-256 receipt against the approved package manifest. Any addition, omission, duplicate stable ID, or byte mismatch fails.
5. Run the package assembly five times from the same pinned inputs. Record each duration, median, and p95 in milliseconds; the five manifests must be byte-identical.
6. Record package size, largest file, format counts, Node version, platform, architecture, commit, and lockfile hash.
7. Confirm the full component/state matrix is present: normal/pressed/disabled primary and secondary buttons; normal/selected emblems; two panel heights; Progress frame plus independent fill at 10/50/75/90 for both widths.
8. Produce or reuse four deterministic readability views at `1080 × 1920`: light surface, dark surface, primary hierarchy, and independent Progress parts. The receipt must name each source asset; each view must be free of clipping and preserve legible label/content contrast at the target scale.

## Baseline and regression policy

- **Correctness gate:** strict byte equality against the approved package manifest. No pixel tolerance applies to packaged assets.
- **Performance baseline:** M5-A2 establishes the first five-run median/p95 result. Later releases fail if median or p95 regresses by more than 20% without an approved exception recorded with the receipt.
- **Size baseline:** the approved package remains exactly 62 files and 436,565 bytes. A future intentional change must update the package version, manifest receipts, and the approved baseline together.
- **Readability gate:** all four required views must pass the documented no-clipping and target-scale readability check. Any missing view, clipped module, unreadable label, or ambiguous Progress part fails.

## Required receipt fields

`schemaVersion`, `id`, `status`, `packageId`, `packageVersion`, `gitCommit`, `nodeVersion`, `platform`, `architecture`, `lockfileSha256`, `baseline`, `cleanWorkspace`, `byteComparison`, `runs`, `matrix`, `readability`, `defects`, and `generatedAt`.

## Exit conditions for M5-A2

- The command is runnable locally without an engine installation.
- Clean-workspace output matches all approved package receipts.
- Five-run reproducibility and timing results are recorded.
- The exact size baseline and state/part matrix are confirmed.
- Readability views and any defects are recorded.

## Deferred M5 work

M5-A2 establishes the reproducibility/regression batch only. Migration/rollback drills, backup/recovery practice, release operating procedures, and broader multi-style coverage remain later M5 slices and must not be claimed as complete from this batch.
