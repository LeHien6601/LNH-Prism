# Prism V2 packages

These packages form the clean Prism Semantic UI V2 boundary. They contain no
game-specific product data and must not import the legacy renderer, material,
showcase, milestone-evidence, or Production Lab implementation.

The allowed dependency graph is declared in
[`prism-v2-boundaries.json`](prism-v2-boundaries.json) and enforced by
`npm run validate:v2-boundaries`.

```text
cli -> core -> schema
cli -> wireframe -> core/schema
cli -> unity-contract -> core/schema
```

The current package entry points expose boundary metadata only. Semantic schema,
validation, preview, CLI behavior, and Unity export behavior belong to later
bounded tasks.
