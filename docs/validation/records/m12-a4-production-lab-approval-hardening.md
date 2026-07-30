# M12-A4 Production Lab audit and approval hardening

## Outcome

Passed on 2026-07-30. Production Lab `0.5.0` now separates technical evidence
from named human approval, invalidates stale approvals, classifies project drift,
serializes sensitive operations, and preserves the last complete build after an
interruption.

The real `block-forge-puzzle-board` pilot remains `review-required`. No human
reviewer was supplied, so no approval or production build was created.

## Implemented controls

- Project audit reports `blocking-inconsistency`, `recommended-correction`,
  `acceptable-intentional-variation`, and `unresolved-human-decision`.
- Every finding includes project, job, component, state, token, and supporting
  reference fields where applicable.
- Approval requires a named reviewer, zero unresolved decisions, completed
  native/phone/thumbnail inspection, current registered reference bytes, and a
  current review manifest.
- Approvals are immutable, hash-addressed receipts. A hash-verified
  `approved/current.json` pointer selects the current receipt without rewriting
  history.
- Draft, reference registry/bytes, or review-manifest changes invalidate
  approval before build and move status to `revision-required`.
- Named reviewers can record `revision-required` or `rejected` decisions.
- Approval and build use exclusive locks; abandoned locks from dead processes
  are recovered while active concurrent operations are refused.
- Builds render into a staging directory and atomically replace the live output
  only after validation. Simulated interruption preserves the prior complete
  manifest and removes partial staging data.

## Representative evidence

`project-audit --project block-forge` validated all three registered reference
hashes and returned zero findings for the one bounded pilot job. Focused
fixtures separately exercised every finding classification.

The approval freshness fixture passed with current hashes and rejected changed
draft and reference hashes. The lock fixture rejected a simultaneous operation,
released normally, and recovered a dead-process lock. The interrupted-build
fixture retained the previous complete output.

## Validation

| Command / check | Result |
|---|---|
| `npm run lab -- project-audit --project block-forge` | Pass; 3 references, 0 findings |
| `npm run lab -- validate-job --job block-forge-puzzle-board` | Pass; status normalized to `review-required` |
| `npm run test:production-lab` | Pass; 22/22 |
| `npm run build:renderer` | Pass |
| `npm run test:renderer` | Pass; 56/56 |
| `npm run validate:contracts` | Pass |
| `npm run test:review-reference-boundary` | Pass; 3/3 |
| `npm run validate:control-drift` | Pass; M12-A5 aligned |
| `npm run test:control-drift` | Pass; 4/4 |
| `git diff --check` | Pass |
| Approval freshness negative tests | Pass |
| Four audit classifications | Pass |
| Concurrent and stale lock tests | Pass |
| Simulated interrupted-build rollback | Pass |

## Boundary and next task

No autonomous approval, promotion, Unity work, engine packaging, or reference
pixel extraction was added. M12-A5 is next: controlled promotion, a versioned
project component library, promotion receipts, and a complete engine-neutral
delivery package.
