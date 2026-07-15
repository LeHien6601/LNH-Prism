# AI-Assisted Mobile Game UI Asset Generation System

**Core principle:** AI creates concepts and reusable materials; deterministic tools create structure and final assets.

This documentation package defines the plan for a production-oriented system that turns a game UI style direction into consistent, editable, Unity-ready UI assets. It deliberately treats AI-generated screens as references—not as final assets to cut apart.

## Project snapshot

| Field | Current value |
|---|---|
| Status | 🟡 In progress — M0 contract baseline drafted; review is pending |
| Active milestone | 🟡 M0: Foundation and project contracts |
| Next task | 🔵 Prepare the V1 visual-review rubric draft |
| North-star outcome | Generate consistent UI components, states, and size variants from reusable styles/materials |
| First production validation | Build a real Primary Button, Panel, and Progress Bar in one selected style |

## Navigation

| Document | Purpose |
|---|---|
| [Project overview](PROJECT_OVERVIEW.md) | Current state, roadmap, tasks, risks, decisions, and governance |
| [Roadmap](ROADMAP.md) | Phased delivery plan and quality gates |
| [System architecture](modules/01-system-architecture.md) | System boundaries, data flow, contracts, and repository shape |
| [Design analysis](modules/02-design-analysis.md) | Concept/screenshot analysis into a controlled style specification |
| [Component renderer](modules/03-component-renderer.md) | Deterministic structure, layers, states, and size variants |
| [Materials & textures](modules/04-materials-textures.md) | Reusable procedural and AI-sourced materials |
| [Validation lab](modules/05-validation-lab.md) | Real-asset validation milestones and review loops |
| [V1 visual-review rubric](validation/V1_VISUAL_REVIEW_RUBRIC.md) | Draft scorecard and evidence requirements for the first real validation |
| [Unity export](modules/06-unity-export.md) | Assets, metadata, slicing, naming, and importer integration |
| [Production hardening](modules/07-production-hardening.md) | Reliability, regression testing, performance, and operations |
| [Change control](CHANGE_CONTROL.md) | Rules for new ideas, reviews, traceability, and scope protection |
| [Dashboard proposal](DASHBOARD_PLAN.md) | When and how to introduce a simple HTML status dashboard |
| [Skill capability assessment](SKILL_CAPABILITY_ASSESSMENT.md) | Installed skills, roadmap coverage, and deferred integrations |

## Document conventions

- **Status key:** 🟢 complete/approved · 🔵 agent-ready · 🟡 active/draft/proposed · 🟣 human decision/review · 🔴 blocked · ⚪ deferred/not started.
- **Role key:** 🤖 agent · 🧭 product · 🛠️ technical · 🎨 art · ✦ UI · 🎮 Unity.
- **M0–M6** means a delivery milestone in `ROADMAP.md`.
- **Validation task** means a real deliverable, not a synthetic demo.
- **Gate** means a required review before work proceeds.
- **Decision ID** is permanent, for example `ADR-003`.
- **Change ID** is permanent, for example `CR-012`.

All documents have a change history. Update the overview first whenever project status, the active milestone, next task, key risk, or decision changes.
