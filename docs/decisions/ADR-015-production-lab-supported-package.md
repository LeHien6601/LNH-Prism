# ADR-015: Production Lab is a supported private package

- Status: Accepted
- Date: 2026-07-30
- Owner: LNH Prism

## Decision

`production-lab/` is a supported private package inside LNH Prism. It has its
own package version, commands, tests, workspace, and local agent instructions.
It must not import parent renderer code or write into parent assets, exports,
showcase, or milestone evidence.

Reference images are managed review evidence inside the ignored lab workspace.
Only an explicit future promotion command may copy approved reconstructed
assets—not references—across the boundary.

## Why

Keeping the lab in this repository makes its contracts and tests reviewable
with LNH Prism while retaining the isolation already enforced by the prototype.
A separately versioned external tool would add release and compatibility
coordination before the workflow contract is mature.

## Consequences

- The root package exposes lab commands and tests.
- `production-lab/package.json` owns the lab version.
- Lab workspace data remains untracked.
- Parent production builds do not consume lab outputs implicitly.
- Promotion, transparent PNG delivery, and engine packaging require later
  reviewed milestones.
- Unity integration remains explicitly deferred.
