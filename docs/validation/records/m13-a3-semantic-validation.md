# M13-A3 semantic reference and hierarchy validation

- Date: 2026-08-01
- Mission: `semantic-ui-v2`
- Schema version: `1.0.0`
- Diagnostic version: `1.0.0`
- Status: Complete

## Delivered boundary

`@lnh-prism/core` now validates semantic relationships after schema and stable
identity collection. References are resolved against typed registries for
themes, screens, reusable components, actions, bindings, asset slots, and
states. Navigate actions require a target screen.

The hierarchy pass enforces screen root types, exactly one direct safe-area
root, legal safe-area placement, leaf component boundaries, and non-nested
modal layers. It detects cycles in reusable-component reference graphs and in
in-memory child object graphs without entering JSON Schema recursion.

Bounded type rules require an action or navigation target for buttons, a
binding for toggles, settings plus either nine children or a reusable template
for fixed 3x3 grids, and an explicit dismissal policy for modals. Diagnostics
retain the M13-A2 shape and deterministic path/code/message ordering.

## Coverage

The generic public fixture remains valid and now contains nine explicit grid
children. Focused tests cover every typed reference category, missing navigate
targets, button/toggle/grid/modal requirements, grid cardinality, safe-area
placement, leaf hierarchy, modal nesting, reusable-component cycles, and
in-memory child cycles.

## Validation

- `npm run validate:v2-contracts` — pass; deterministic valid JSON result.
- `npm run test:semantic-contracts` — pass; seventeen tests.
- `npm run validate:v2-boundaries` — pass; five isolated packages and five source files.
- `npm run test:v2-boundaries` — pass; fourteen tests.
- `npm run validate:control-drift` — pass; M13-A4 is the next agent-ready task.
- `npm run validate:contracts` — pass.
- `npm run test:renderer` — pass; 56 tests.
- `npm run agent:brief -- --json` — reports `semantic-ui-v2`, M13, and M13-A4.

## Deferred

Layout geometry, overlap/tap-size checks, wireframes, CLI and external-project
workflows, Unity export/generation, game-specific authoritative data, and broad
legacy cleanup remain outside M13-A3. M13-A4 owns deterministic primitive
wireframes and multi-size evidence.
