# M5 Engine-Neutral Asset Release Procedure

## Purpose

This procedure releases an engine-neutral LNH Prism asset package. It applies to the current Frostbound Reward package and to future packages that follow the same deterministic source, manifest, and validation model.

The release artifact is the asset package folder itself, not an engine project or runtime integration.

Current package:

| Field | Value |
|---|---|
| Package folder | `assets/frostbound-reward` |
| Package ID/version | `frostbound-reward-assets` / `1.0.0` |
| Package manifest | `assets/frostbound-reward/manifest.json` |
| Source evidence | `docs/validation/evidence/m3-s4-frostbound-reconstruction/matrix` |
| Baseline receipt | `docs/validation/evidence/m5-production-hardening/M5-A1-package-baseline.json` |

## Required release gates

A release may proceed only when every gate below passes or has an approved exception recorded in the release note.

| Gate | Command / evidence | Pass condition |
|---|---|---|
| Contract compatibility | `npm run validate:contracts` | Source contracts, live export-manifest `1.2`, and archival legacy manifests validate; missing provenance remains rejected |
| Package integrity | `npm run validate:asset-package` | The package contains exactly 62 modular files across the approved five components with matching path, byte count, and SHA-256 receipts |
| Reproducibility/regression | `npm run validate:m5-production-hardening` | Clean-workspace assembly matches approved package bytes; five-run timing, matrix, size, and readability evidence pass |
| Manifest migration/rollback | `npm run validate:m5-manifest-migration` | Live `1.2` handling, archival legacy retention, failure checks, and unchanged package bytes pass |
| Backup/recovery | `npm run validate:m5-backup-recovery` | Restore from backup and rebuild from pinned source evidence match approved package bytes |
| Diff hygiene | `git diff --check` | No whitespace errors in the release change |

Recommended quick command order:

```text
npm run validate:contracts
npm run validate:asset-package
npm run validate:m5-production-hardening
npm run validate:m5-manifest-migration
npm run validate:m5-backup-recovery
git diff --check
```

## Required evidence paths

The release note must reference these paths:

- `assets/frostbound-reward`
- `assets/frostbound-reward/manifest.json`
- `docs/validation/evidence/m5-production-hardening/M5-A1-package-baseline.json`
- `docs/validation/evidence/m5-production-hardening/M5-A2-reproducibility-receipt.json`
- `docs/validation/evidence/m5-production-hardening/M5-A3-manifest-migration-rollback-receipt.json`
- `docs/validation/evidence/m5-production-hardening/M5-A4-package-backup-recovery-receipt.json`
- `docs/validation/evidence/m5-production-hardening/readability/`

## Release checklist

1. Confirm the working tree is clean before release validation begins.
2. Confirm `docs/PROJECT_OVERVIEW.md` names the package and current M5 status accurately.
3. Run all required release gates.
4. Inspect the package manifest and confirm:
   - `packageId` is `frostbound-reward-assets`.
   - `packageVersion` is `1.0.0`.
   - The package has 62 modules.
   - Total module bytes remain 436,565.
   - No package paths point outside `assets/frostbound-reward`.
5. Inspect readability views at `docs/validation/evidence/m5-production-hardening/readability/`.
6. Confirm the handoff artifact list below is complete.
7. Record the release note with validation results, evidence links, commit, date, and any exceptions.
8. Do not change the approved package bytes unless the package version, manifest receipts, and baseline are updated together under an approved task.

## Sign-off roles

| Area | Required signer | Responsibility |
|---|---|---|
| Product release | Project owner | Confirms the package is the intended release target and accepts any residual scope risk |
| Technical release | Technical lead | Confirms validation, deterministic receipts, compatibility, and recovery evidence |
| Art/UI release | Art/UI lead | Confirms readability views and component hierarchy remain acceptable |

If a named lead is not assigned, the project owner must explicitly accept that temporary ownership in the release note.

## Exception policy

Exceptions are allowed only when they are explicit, narrow, and traceable. They must not silently redefine the package.

| Exception type | Who may approve | Required record |
|---|---|---|
| Performance regression over the M5-A2 baseline | Project owner + Technical lead | Measured median/p95, reason, impact, mitigation, and whether the package remains releasable |
| Size or module-count change | Project owner + Technical lead | Approved package version bump, updated manifest receipts, updated baseline, and compatibility note |
| Readability issue | Project owner + Art/UI lead | Affected view, severity, accepted risk or corrective task |
| Contract or compatibility issue | Project owner + Technical lead | Failing schema/manifest detail, compatibility impact, migration plan or rollback decision |
| Missing recovery evidence | Project owner + Technical lead | Reason recovery could not run, temporary mitigation, and a blocking follow-up task |

No exception may approve:

- Treating concept pixels as production assets.
- Adding engine-specific runtime/project deliverables to the release scope.
- Shipping changed package bytes without synchronized package-version and receipt updates.
- Removing stable asset IDs without an approved compatibility decision.

## Rollback decision points

Rollback means returning to the last approved `assets/frostbound-reward` package and its matching receipts.

Rollback is required when:

- Any package module path, byte count, or SHA-256 differs from `assets/frostbound-reward/manifest.json` without an approved version update.
- `npm run validate:m5-backup-recovery` fails to restore or rebuild byte-identical assets.
- A live export manifest reintroduces engine integration metadata or omits required provenance/output hashes.
- Required readability views are missing, clipped, or materially unreadable.
- A release-critical exception lacks the required approvers.

Rollback steps:

1. Stop release publication.
2. Preserve the failing receipt/logs under the relevant validation record or release note.
3. Restore the approved package from the current repository package or rerun the pinned package assembler.
4. Run `npm run validate:asset-package` and `npm run validate:m5-backup-recovery`.
5. Record the rollback decision, cause, restored commit, and follow-up task.

## Handoff artifacts

Every release handoff must provide these artifact addresses:

| Artifact | Address |
|---|---|
| Asset package folder | `assets/frostbound-reward` |
| Package manifest | `assets/frostbound-reward/manifest.json` |
| Package usage guide | `assets/frostbound-reward/README.md` |
| Component modules | `assets/frostbound-reward/modules/` |
| Readability evidence | `docs/validation/evidence/m5-production-hardening/readability/` |
| Reproducibility receipt | `docs/validation/evidence/m5-production-hardening/M5-A2-reproducibility-receipt.json` |
| Migration/rollback receipt | `docs/validation/evidence/m5-production-hardening/M5-A3-manifest-migration-rollback-receipt.json` |
| Backup/recovery receipt | `docs/validation/evidence/m5-production-hardening/M5-A4-package-backup-recovery-receipt.json` |

## M5-A5 validation

This procedure completes M5-A5 when it is linked from the M5 plan and the project overview, and `git diff --check` plus package validation pass after the documentation update.
