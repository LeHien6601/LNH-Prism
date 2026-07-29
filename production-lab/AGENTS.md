# Production Lab Agent Router

This directory is an isolated Codex-native screenshot reconstruction lab.

For screenshot analysis, component reconstruction, screen matching, comparison,
or job iteration, use `.agents/skills/reconstruct-game-ui/SKILL.md`.

Do not add model API clients, provider adapters, API-key handling, or autonomous
approval. Codex performs the visual reasoning directly; deterministic scripts
only manage jobs, validate contracts, render editable SVG, and prepare evidence.

Never import from or write to the parent LNH Prism project. Reference screenshot
pixels may be inspected and shown in comparison evidence but must not appear in
component or composition outputs.
