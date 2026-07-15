# LNH Prism

LNH Prism is an AI-assisted mobile game UI asset generation system.

> AI creates concepts and reusable materials; deterministic tools create structure and final assets.

The project is currently in **M1 — Deterministic MVP renderer**. Its first implementation target is a consistent Primary Button, Panel, and Progress Bar that can be regenerated across sizes and states without manual repainting.

## Documentation

- [Project overview and status](docs/PROJECT_OVERVIEW.md)
- [Agent instructions and quick commands](AGENTS.md)
- [Phased roadmap](docs/ROADMAP.md)
- [System architecture](docs/modules/01-system-architecture.md)
- [M0 contract specifications](specs/README.md)
- [V1 render/export decision](docs/decisions/ADR-009-v1-render-export-stack.md)
- [Change control](docs/CHANGE_CONTROL.md)
- [Skill capability assessment](docs/SKILL_CAPABILITY_ASSESSMENT.md)
- [All documentation](docs/README.md)

## Repository layout

```text
docs/     Project controls, modules, and roadmap
src/      Renderer, schema, analysis, material, and export implementation
tests/    Unit, schema, golden-render, and integration tests
assets/   Approved source references and validation fixtures only
```

## Immediate next task

Prove the approved TypeScript + SVG + resvg renderer with the Primary Button. See the task board in the [project overview](docs/PROJECT_OVERVIEW.md).

## Status

No production renderer code has been added yet. The project has approved its contracts, V1 reference and briefs, visual review rubric, and render/export stack; the next task is the bounded M1 Primary Button proof.
