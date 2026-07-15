# Skill Capability Assessment

## Assessment summary

**Assessed:** 2026-07-15  
**Project stage:** M0 — Foundation and project contracts

LNH Prism already had strong support for AI image generation and game UI asset-sheet review. The additions below close the most immediate workflow gaps: visual QA for the future dashboard, desktop/reference capture, and a security-focused review before the system begins importing untrusted sources or exposing a local tool.

## Installed skill inventory

| Skill | Status | Primary contribution to LNH Prism |
|---|---|---|
| `game-image-asset-master` | Existing | Concept/reference screens, separated UI sheets, alpha/slicing review, art-direction consistency |
| `imagegen` | Existing system skill | AI concept and reusable material generation/editing |
| `skill-creator` | Existing system skill | Create narrowly scoped LNH Prism-specific skills when repeated workflows stabilize |
| `skill-installer` | Existing system skill | Evaluate and install external/curated skills |
| `playwright` | Installed 2026-07-15 | Browser automation and visual QA for the optional dashboard and browser-based renderer/tools |
| `screenshot` | Installed 2026-07-15 | Desktop, Unity, and reference capture when a tool-specific capture is unavailable |
| `security-threat-model` | Installed 2026-07-15 | Repository-grounded threat model before local/networked interfaces or untrusted asset ingestion expand |
| `senior-engineering-delivery` | Created 2026-07-15 | Focused implementation, validation, diff review, and Conventional Commit workflow |

## Roadmap coverage

| Roadmap concern | Coverage | Guidance |
|---|---|---|
| AI concept/material generation | Covered | Use `imagegen`; maintain prompt/source/version provenance in Material Packs |
| UI asset and component-sheet art QA | Covered | Use `game-image-asset-master`; preserve the rule that concepts are not final extracted assets |
| Deterministic renderer and contracts | Partially covered | Implement in M0/M1; create a project-specific contract skill only after schemas and validation workflow are stable |
| Dashboard interaction/visual QA | Covered | Use `playwright` when M6 is approved; test relevant desktop and mobile viewports |
| Unity handoff screenshot review | Covered for visual inspection | Use `screenshot` for runtime evidence; Unity automation is intentionally deferred |
| Unity importer/control | Deferred | Select an integration only in M4 after supported Unity version, project setup, and import workflow are known |
| Security / untrusted inputs | Covered for assessment | Run `security-threat-model` before accepting arbitrary local files, remote uploads, or networked dashboard features |
| Figma design handoff | Deferred | Install an official Figma skill/plugin only if Figma becomes an approved source of truth |
| Golden image / renderer regression | Project implementation needed | Add renderer-specific golden-image tests in M5; Playwright is supplementary, not a substitute |

## Why these skills were selected

- The [OpenAI Playwright skill](https://github.com/openai/skills/tree/main/skills/.curated/playwright) supports terminal-driven browser automation, snapshots, screenshots, and UI-flow debugging—directly useful once LNH Prism has an HTML dashboard or browser UI.
- The [OpenAI Screenshot skill](https://github.com/openai/skills/tree/main/skills/.curated/screenshot) provides platform-aware desktop/window/region capture, useful for comparing Unity output or reference tools when a direct integration is unavailable.
- The [OpenAI Security Threat Model skill](https://github.com/openai/skills/tree/main/skills/.curated/security-threat-model) requires an evidence-grounded review of trust boundaries and asset ingestion, which fits LNH Prism before it handles externally generated textures or optional services.

An external game-asset workflow, [Agent Sprite Forge](https://github.com/0x0funky/agent-sprite-forge), was reviewed but not installed. Its sprite/map/Godot-heavy scope overlaps the existing game-image skill and does not directly improve Prism's deterministic mobile UI renderer. Avoiding it protects the project from unrelated scope.

## Deferred decision: Unity automation

The reviewed Unity-MCP option is broad and requires a separate Unity/MCP installation and version-specific project configuration. It should be evaluated at M4 using these decision criteria:

1. Supported Unity editor and target platform versions are explicitly selected.
2. The team agrees whether import configuration should be automated or manifest-guided.
3. The integration can preserve stable asset IDs and re-export safety.
4. A minimal sample project is available for V4 validation.

## Recommended project-specific skills

`senior-engineering-delivery` is now available globally for disciplined implementation work and Conventional Commit messages. Create the following additional project-specific skills only after M1/M2 validations establish stable practices:

- `lnh-prism-specs`: validates style/component/material/export contracts and trace manifests.
- `lnh-prism-visual-validation`: applies the V1–V5 rubric and creates a repeatable review record.
- `lnh-prism-unity-handoff`: validates naming, 9-slice metadata, states, pivots, and manifest completeness.

This sequencing avoids encoding premature assumptions into reusable instructions.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial skills assessment and installation record | Codex |
