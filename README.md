# LNH Prism

LNH Prism V2 is a semantic UI specification, validation, deterministic
wireframe, packaging, and Unity-integration system for game-owned UI projects.

> Prism compiles written, typed game specifications into validated wireframe
> evidence and engine-specific generated views. It does not create production
> artwork.

## Current direction

**Active mission:** `semantic-ui-v2`

Written game specifications are authoritative. Game repositories own their
product documents, semantic UI specifications, actions, bindings, assets, and
generated engine output. Prism owns only the versioned schemas, compiler,
wireframe tooling, CLI, and engine adapters that consume those inputs.

M13 establishes this V2 boundary as a clean package family. Schema version
`1.0.0`, the bounded semantic component contracts, and stable-ID diagnostics
are implemented. Cross-reference and hierarchy validation, wireframes, CLI
commands, and Unity export behavior remain separate later tasks.

## V2 package boundary

```text
@lnh-prism/cli -> @lnh-prism/core -> @lnh-prism/schema
@lnh-prism/cli -> @lnh-prism/wireframe -> core/schema
@lnh-prism/cli -> @lnh-prism/unity-contract -> core/schema
```

Run `npm run validate:v2-boundaries` to verify the package graph and reject
imports from the legacy renderer, Production Lab, or other repository-owned
implementation paths.

## Product boundary

Prism V2:

- validates typed semantic UI specifications;
- produces deterministic wireframe evidence;
- packages stable, engine-neutral export contracts;
- supports generated-versus-authored ownership boundaries;
- preserves stable semantic IDs and reproducible metadata.

Prism V2 does not generate final art, infer product behavior from screenshots,
replace LNH Core UI capabilities, or own game-specific specifications and
assets.

## Legacy system

The root `src/`, `specs/`, `materials/`, `assets/`, `showcase/`, and
`production-lab/` areas remain historical and supported evidence for the V1
asset-generation pipeline. They are not V2 dependencies and are not being
deleted or broadly refactored during the semantic UI MVP. Before any later
cleanup, preserve a repository tag such as `prism-v1-legacy-baseline`.

## Documentation

- [Project overview and status](docs/PROJECT_OVERVIEW.md)
- [Semantic UI V2 architecture decision](docs/decisions/ADR-026-semantic-ui-v2-boundary.md)
- [System architecture](docs/modules/01-system-architecture.md)
- [Phased roadmap](docs/ROADMAP.md)
- [Change control](docs/CHANGE_CONTROL.md)
- [Agent instructions](AGENTS.md)
