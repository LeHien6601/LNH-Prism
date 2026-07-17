# M5 Production-Hardening Validation Plan

## Status

M5-A1 definition, M5-A2 implementation, and post-A2 slice definition are complete. The passing M5-A2 receipt is recorded at `docs/validation/evidence/m5-production-hardening/M5-A2-reproducibility-receipt.json`; M5-A3 through M5-A6 define the remaining hardening work.

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

## Post-A2 hardening slices

M5-A2 establishes the reproducibility/regression batch only. The remaining hardening work is split into ordered slices so each can be implemented and validated independently.

| Slice | Task | Owner | Execution | Exit condition |
|---|---|---|---|---|
| M5-A3 | Implement manifest migration and rollback drill | Agent | Agent-ready | A deterministic command or validation fixture proves live `1.2` manifests can be migrated/checked from archived legacy evidence where applicable, rollback preserves archived evidence, and failures are reported without altering approved packages |
| M5-A4 | Implement package backup and recovery drill | Agent | Blocked on M5-A3 | A recoverable backup/rebuild procedure restores the Frostbound package from pinned sources and receipts, verifies byte equality, and records recovery evidence |
| M5-A5 | Draft release operating procedure and exception policy | Agent | Blocked on M5-A4 | A release checklist defines required validation, evidence paths, owner sign-off, regression exceptions, rollback decision points, and handoff artifacts for engine-neutral asset packages |
| M5-A6 | Define multi-style hardening coverage plan | Project owner + Technical lead | Human decision | Choose which additional style/package, if any, must run through the M5 hardening suite before calling M5 complete |

### M5-A3 acceptance criteria

- Uses existing checked-in evidence and contracts; does not introduce engine integration.
- Distinguishes live `1.2` production manifests from archival `1.0`/`1.1` evidence.
- Records a migration/rollback receipt under `docs/validation/evidence/m5-production-hardening/`.
- Fails clearly when required provenance, output hashes, or legacy archive rules are missing.
- Leaves approved asset package bytes unchanged unless an explicit future package version update is approved.

### M5-A4 acceptance criteria

- Documents the backup source set and recovery destination.
- Rebuilds or restores the Frostbound package from pinned repository inputs and receipts.
- Compares recovered files against the approved package manifest by path, byte count, and SHA-256.
- Records recovery timing, environment, and defects.

### M5-A5 acceptance criteria

- Defines the release checklist for an engine-neutral asset package.
- Lists required validation commands, evidence records, and acceptance gates.
- Defines who can approve performance, size, readability, or compatibility exceptions.
- Includes rollback decision points and artifact handoff paths.

### M5-A6 decision criteria

- Decide whether one hardened Frostbound package is enough for M5 exit or whether another style/package must be covered.
- If extra coverage is required, choose the target and split it into an agent-ready implementation task.
- If extra coverage is deferred, record the release rationale and remaining risk.
