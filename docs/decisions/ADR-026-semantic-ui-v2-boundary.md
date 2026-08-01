# ADR-026: Prism V2 is a semantic UI compiler with a clean package boundary

- Status: Accepted
- Date: 2026-08-01
- Owner: LNH Prism
- Change request: [CR-003](../change-requests/CR-003-semantic-ui-v2-boundary.md)

## Decision

> Prism V2 compiles game-owned semantic UI specifications into validated
> wireframe evidence and engine-specific generated views. Prism V2 does not
> create production artwork. Written, typed game specifications are
> authoritative; reference images are optional review evidence.

V2 is implemented as an isolated package family under `packages/`. It must not
import the legacy renderer, material system, asset packages, showroom,
milestone evidence, or Production Lab implementation.

## Goals

- Define versioned semantic UI contracts and stable semantic IDs.
- Parse, normalize, and validate game-owned specifications with actionable
  machine-readable diagnostics.
- Produce deterministic primitive wireframes and reproducible export metadata.
- Provide an engine-neutral Unity export contract and, later, a separate Unity
  adapter that reuses LNH Core UI behavior.
- Support safe regeneration through explicit generated-versus-authored
  ownership.

## Non-goals

- Production artwork generation or screenshot reconstruction.
- A general UI editor or general-purpose layout constraint solver.
- Game behavior inference from screenshots or display names.
- Game-specific screens, product rules, bindings, themes, or assets in Prism.
- Unity generation or adapter implementation in M13-A1.
- Broad deletion or refactoring of the legacy asset pipeline.

## Ownership boundaries

Prism owns schemas, compiler behavior, validation diagnostics, wireframe
generation, CLI contracts, export contracts, adapters, versions, migrations,
and public fixtures. A game repository owns its product documents, Prism input
specifications, navigation/actions/bindings, theme and asset manifests,
generated engine output, authored controllers, and all product assets.

Prism may contain minimal public-contract fixtures under tests or examples, but
fixtures are never authoritative product data.

## Dependency direction

```text
@lnh-prism/cli -> @lnh-prism/core -> @lnh-prism/schema
@lnh-prism/cli -> @lnh-prism/wireframe -> core/schema
@lnh-prism/cli -> @lnh-prism/unity-contract -> core/schema

future Unity adapter -> com.lnhgames.ui + generated Unity contract
game project tooling -> pinned Prism CLI
game runtime -> Prism Unity adapter -> LNH Core UI
```

Dependencies are acyclic. V2 packages may consume external, pinned libraries
when needed, but cannot depend on the root `lnh-prism` package or the
`lnh-prism-production-lab` package. Cross-package imports use declared package
names rather than relative paths.

## Generated and authored file policy

- Generated files live only in a configured game-owned output subtree.
- Each generated file records its semantic source identity and owning tool
  version where the target format permits it.
- Prism replaces only its declared generated subtree using staging and atomic
  replacement.
- Authored presenters, controllers, assets, and unrelated engine content remain
  outside that subtree and are never rewritten by regeneration.
- Validation may regenerate into staging and report stale committed output; a
  validation-only command must not silently rewrite game files.

## Versioning policy

- CLI, schema, Unity contract, and future adapter versions are explicit and may
  evolve independently.
- Package manifests use semantic versions. The initial private boundary is
  `0.1.0`; it is not a public compatibility promise.
- Schema documents carry their own schema version. Incompatible schema changes
  require a new major schema version and a documented migration path.
- External game projects pin tool, schema, contract, and adapter versions in a
  committed lock file. Local checkout overrides are ignored, optional, and
  never authoritative.
- Releases identify their source commit; identical pinned inputs must produce
  equivalent normalized output.

## Compatibility expectations

- Stable semantic IDs are compatibility surfaces and cannot be silently
  renamed.
- A CLI must reject unsupported schema versions with setup or migration
  guidance rather than guessing.
- Additive schema changes may remain compatible only when defaults are explicit
  and deterministic.
- Generated-output migrations preserve unchanged identities and engine metadata
  wherever the target supports them.
- The future Unity adapter must reuse `com.lnhgames.ui`; it cannot introduce a
  competing navigation, lifecycle, or safe-area framework.

## Legacy policy

Legacy V1 code and evidence remain in place for auditability and existing
validation. They are frozen as non-authoritative for V2. Reuse is permitted only
after extracting a small source-neutral utility behind a V2-owned contract and
proving that no art-pipeline dependency crosses the boundary.

Before broad legacy cleanup, preserve a tag such as
`prism-v1-legacy-baseline`. This decision does not create that tag.

## Consequences

- The repository temporarily contains two clearly separated product eras.
- Some deterministic hardening will initially be duplicated or extracted in
  later bounded tasks rather than imported from coupled legacy modules.
- Unity integration remains future work even though its engine-neutral contract
  has a package boundary.
- M12-A6z remains an independent pending human delivery decision.
