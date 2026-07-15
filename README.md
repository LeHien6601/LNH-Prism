# LNH Prism

LNH Prism is an AI-assisted mobile game UI asset generation system.

> AI creates concepts and reusable materials; deterministic tools create structure and final assets.

The project is currently in **M0 — Foundation and project contracts**. Its first implementation target is a consistent Primary Button, Panel, and Progress Bar that can be regenerated across sizes and states without manual repainting.

## Documentation

- [Project overview and status](docs/PROJECT_OVERVIEW.md)
- [Phased roadmap](docs/ROADMAP.md)
- [System architecture](docs/modules/01-system-architecture.md)
- [Change control](docs/CHANGE_CONTROL.md)
- [All documentation](docs/README.md)

## Repository layout

```text
docs/     Project controls, modules, and roadmap
src/      Renderer, schema, analysis, material, and export implementation
tests/    Unit, schema, golden-render, and integration tests
assets/   Approved source references and validation fixtures only
```

## Immediate next task

Approve the style/component contracts and create the reference brief for the first Primary Button. See the task board in the [project overview](docs/PROJECT_OVERVIEW.md).

## Status

No production code has been added yet. This initial commit establishes the documented scope, quality gates, validation milestones, and governance required before implementation begins.
