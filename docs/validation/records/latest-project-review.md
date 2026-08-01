# M13-A1 Semantic UI V2 foundation review — 2026-08-01

## Scope and outcome

This review assesses commit `0805529` against CR-003, ADR-026, the active
M13-A1 roadmap contract, and the repository's managed-workflow controls. It is
a diagnostic record only; it does not change milestone status or authorize
implementation.

**Outcome: accepted after remediation.** The product
boundary, package topology, workspace resolution, and ownership policy are
coherent and validated. R-M13-001 closed the reviewed module/manifest bypasses.
R-M13-002 reconciled the active project controls and added mission-drift
validation. M13-A2 is now agent-ready.

## Validation performed

- `npm run validate:v2-boundaries` — pass; five packages and five source files.
- `npm run test:v2-boundaries` — pass; fourteen tests.
- `npm run validate:control-drift` — pass; `semantic-ui-v2`, M13, M13-A2,
  and three review-reference receipts align.
- `npm run test:control-drift` — pass; seven tests, including stale mission,
  legacy active scope, and multiple-active-milestone rejection.
- `npm run agent:brief -- --json` — reports `semantic-ui-v2`, M13, and M13-A2.
- `npm run validate:contracts` — pass.
- `npm run test:renderer` — pass; 56 tests.

## Facts

- CR-003 and ADR-026 make game-owned typed specifications authoritative and
  prohibit V2 dependencies on the legacy renderer and Production Lab.
- Five private workspace packages implement the declared acyclic graph:
  schema, core, wireframe, Unity contract, and CLI.
- The root `validate` command runs the V2 boundary validator and its focused
  tests before legacy validation work.
- M13-A1 contains boundary metadata only. It adds no semantic component
  behavior, game-owned product data, Unity generation, or broad legacy cleanup.
- M12-A6z remains recorded as an independent pending human delivery decision.

## Findings

### R-M13-001 — P1 — Boundary enforcement misses supported module and dependency forms

**Facts:** `scripts/validate-v2-boundaries.mjs` includes `.cjs` in its source
inventory, but its import patterns recognize only ESM `import`/`export` and
literal dynamic `import()`. They do not recognize CommonJS `require()` or
TypeScript `import = require()`. The source inventory also omits `.cts`, `.jsx`,
and `.tsx`. Manifest enforcement checks forbidden dependency names exactly but
does not inspect dependency values such as `file:`, `link:`, or `npm:` aliases.
The focused tests do not cover these forms or exercise the implemented cycle
rejection path.

**Inference:** A future V2 file can use `require()` to cross the package root or
load a forbidden package without being detected. A differently named local or
npm-alias dependency can also reconnect V2 to legacy code while the validator
still passes. As package source grows in M13-A2, this weakens the central
M13-A1 guarantee.

**Recommendation:** Agent-ready; apply first. Extend the boundary validator to:

1. recognize literal `require()` and TypeScript import-assignment specifiers;
2. scan all supported JavaScript/TypeScript module extensions used by the
   workspaces;
3. reject forbidden package subpaths and dependency aliases/specifiers that
   resolve to legacy or repository-local implementation paths;
4. validate package entry-point paths remain inside their package root; and
5. add focused negative tests for CommonJS escape, forbidden subpath/alias,
   local path dependency, and a real dependency cycle.

**Acceptance:** every new negative fixture fails with an actionable diagnostic;
the valid five-package graph and workspace-entry smoke test remain green; legacy
contract and renderer checks remain unchanged.

**Application status — complete on 2026-08-01:** TypeScript 7 token scanning
now covers ESM, CommonJS, TypeScript import assignment, dynamic imports, and all
supported JS/TS module extensions while ignoring comments and string contents.
Non-literal module edges are rejected. Manifest validation rejects undeclared,
local, forbidden, and forbidden-alias dependencies; escaping entry targets;
and policy-consistent cycles. Fourteen focused boundary tests pass, including
syntax false-positive resistance, the original valid graph, and the
workspace-entry smoke test. R-M13-002 was not applied.

### R-M13-002 — P1 — Active overview retains legacy scope as current objective boundaries

**Facts:** `docs/PROJECT_OVERVIEW.md` names M13 as active and states the V2
mission, but its `Objective boundaries` section still lists layer-based art
components, reusable material packs, AI material generation, and visual
comparison as the current in-scope work. Its current-status table labels the M1
render/export architecture and asset pipeline areas as approved without marking
them legacy. The roadmap-at-a-glance table uses the same active marker for both
M12 and M13 even though M12 is awaiting a separate human decision.

**Inference:** A fresh agent can reasonably read the overview as authorizing
new art-pipeline work inside the active V2 milestone, contradicting ADR-026 and
the updated README. Existing control-drift validation checks task alignment but
does not catch this mission/scope drift.

**Recommendation:** Agent-ready; apply after R-M13-001. Replace the active
objective boundaries with the V2 goals/non-goals from ADR-026, label M0–M12
status rows as legacy history, and mark M12 as awaiting its independent human
decision while keeping only M13 active. Add a focused control-drift assertion
that the active overview references the semantic UI mission and does not
present the legacy asset mission as current scope.

**Acceptance:** README, overview, architecture module, roadmap, and agent brief
agree on one active milestone and mission; M12-A6z remains pending rather than
accepted, rejected, or erased; control-drift tests cover the new invariant.

**Application status — complete on 2026-08-01:** Active documentation and the
agent brief now identify `semantic-ui-v2` and M13 consistently. The overview's
objective boundaries contain only the V2 compiler scope, M0–M12 are explicit
legacy history, M12-A6z remains an unmade independent human decision, and
focused negative tests reject stale mission IDs, legacy scope, and multiple
active milestone markers. M13-A2 is the next agent-ready task.

## Readiness and ordering

| Order | Work | Eligibility | Dependency |
|---|---|---|---|
| 1 | R-M13-001 boundary-enforcement hardening | Complete | None |
| 2 | R-M13-002 active-control scope reconciliation | Complete | R-M13-001 complete |
| 3 | M13-A2 semantic schemas and stable IDs | Agent-ready | R-M13-001 and R-M13-002 complete |

No new human decision blocks these remediations. M12-A6z remains a separate
human decision and does not block the ordered M13 technical work.

## What M13-A1 proved

- A clean private workspace boundary can coexist with the legacy repository.
- The intended package dependency direction resolves through npm workspaces.
- Current ESM imports, exact internal dependencies, and package-root escapes
  are checked automatically.
- Active README and architecture records now state the semantic UI ownership
  model and generated-versus-authored boundary.

## What M13-A1 did not prove

- Complete dependency isolation across all supported module/manifest forms.
- Any semantic schema, stable-ID validation behavior, wireframe rendering, CLI
  command, external-project resolution, Unity export, or regeneration safety.
- Acceptance or rejection of the M12 Block Forge delivery package.
