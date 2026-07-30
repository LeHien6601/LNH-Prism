# M12-A5 Production Lab promotion and packaging

## Result

Passed on 2026-07-30. Production Lab `0.6.0` now validates a promotion without
mutation, promotes only a current approved build into immutable semantic
component versions, records copied-file hashes in a promotion receipt, assembles
a complete engine-neutral delivery package, and validates every packaged byte.

## Controls

- Promotion requires a `built` job and matching job, approval, and build IDs.
- Approval freshness and every build-module hash are revalidated before use.
- Only safe SVG/PNG modules are eligible; SVG image layers are rejected.
- Dry-run emits a deterministic plan receipt and writes nothing.
- Execution uses an exclusive project lock, staging, rollback, immutable
  component versions, and an immutable promotion receipt.
- Packages contain promoted components, visual tokens, materials, approval and
  promotion provenance, project validation, and known limitations.
- Reference, screenshot, and comparison paths are excluded and rejected.
- Package validation checks identity, engine-neutral scope, path safety, byte
  counts, SHA-256 receipts, and SVG image-layer absence.

## Evidence

| Check | Result |
|---|---|
| `npm run test:production-lab` | Pass; 26 tests |
| Isolated fixture promotion plan | Pass; dry-run and execution receipt shapes validated |
| Duplicate/stale/unsafe promotion fixtures | Pass; rejected |
| Engine-neutral manifest fixture | Pass; complete metadata retained |
| Reference-evidence package fixture | Pass; rejected |
| Real `block-forge-puzzle-board` dry-run | Expected rejection: job is `review-required`, not `built` |

No real project component was promoted and no real package was assembled. The
pilot still requires named human review and approval; the task did not invent a
reviewer or bypass that gate.

## Next task

M12-A6 is a human decision: assign named product, art, and UI reviewers and
approve the bounded Block Forge pilot jobs before build, promotion, or package
execution.
