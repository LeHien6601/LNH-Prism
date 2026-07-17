# ADR-018 — Start M7 reference-fidelity style expansion

## Status

Accepted — 2026-07-18

## Context

M0 through M6 are resolved: the project has deterministic rendering, reusable material handling, AI-assisted analysis controls, engine-neutral modular asset delivery, production hardening, and a deferred workflow-scaling decision.

The project owner selected Option A for the next roadmap direction: start another production asset package track. The owner also identified an art-direction weakness in the current visual result: existing UI elements lean too much toward rounded-corner forms and do not match the intended reference design closely enough. The next style direction should increase complexity and move toward sharper, wider hexagonal forms, especially for buttons.

## Decision

Start **M7 — Reference-fidelity style expansion** as the next production roadmap track.

The first task is a specification and rubric, not immediate rendering. M7-A1 must define:

- The target/reference requirements and fixed asset-only boundary.
- A sharper shape language, including wide-hexagon button geometry instead of rounded-corner buttons.
- Angular panel/container expectations where appropriate.
- Expanded material, ornament, lighting, edge, and state complexity.
- A component inventory for the next production package.
- A visual-fidelity validation rubric and evidence plan.
- Engine-neutral modular asset outputs, showroom visibility, and file/folder handoff expectations.

## Consequences

- The next agent-ready task is M7-A1: draft the reference-fidelity style expansion specification.
- Frostbound Reward remains the approved hardened package; M7 is a new validation target, not a retroactive failure of M3/M4/M5.
- Renderer/template changes are deferred until the M7 specification identifies the required geometry, materials, component inventory, and validation threshold.
- No Unity or engine integration work is in scope.

## Follow-up

Use `Next:` to start M7-A1.
