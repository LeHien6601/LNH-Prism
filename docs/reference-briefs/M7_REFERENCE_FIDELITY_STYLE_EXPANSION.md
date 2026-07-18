# M7 Reference Brief — Reference-Fidelity Style Expansion

## Document control

| Field | Value |
|---|---|
| Status | 🟢 Approved — Option A |
| Date | 2026-07-18 |
| Milestone | M7 — Reference-fidelity style expansion |
| Decision source | [ADR-018](../decisions/ADR-018-reference-fidelity-style-expansion.md) |
| Target scale | `540 × 960` logical portrait canvas with `1080 × 1920` 2× review output |
| Output boundary | Engine-neutral modular UI assets only |

## 1. Direction

M7 tests whether LNH Prism can produce a more reference-faithful and visually complex UI package than the current rounded-corner baseline. The target direction is a sharp, premium mobile-game UI family built around wide hexagonal action shapes, angular containers, faceted edges, layered metallic/crystal materials, and clear target-phone readability.

This brief intentionally starts from product-owner art direction rather than a new raster concept. A later concept or style board may be attached as evidence, but it must remain a reference input only. Its pixels cannot become production component sources.

## 2. Fixed constraints

- Final deliverables are assets, not engine integration.
- Every final component must remain deterministic, modular, and independently extractable.
- SVG remains the canonical structured source; PNG remains a deterministic derivative for review/handoff.
- Text and icon content stay editable and must not be baked into surfaces.
- The showroom must expose final outputs, or the handoff must list exact file/folder addresses.
- AI may support material/reference exploration, but geometry, states, manifests, and export metadata remain deterministic.

## 3. Shape language

| Element | Required direction |
|---|---|
| Primary buttons | Wide hexagonal silhouette with sharp angled end caps, not rounded pills |
| Secondary buttons | Same angular family at lower emphasis; may use slimmer proportions |
| Panels | Angular or chamfered container silhouette with layered frame and inset body |
| Tabs / badges | Faceted clipped-corner shapes that visually belong to the button family |
| Progress frame | Angular frame with independent fill, protected end caps, and readable low/high values |
| Icon containers | Small faceted gem/tech frames, not circular-only medallions |

### Wide-hexagon baseline

The primary-action baseline should feel broad and weapon-panel-like rather than soft:

- recommended logical width range: `260–360`;
- recommended logical height range: `58–76`;
- angled end-cap depth: `24–44`, scaled with height;
- corner radius: `0–4` only for anti-alias relief, never a rounded-corner visual identity;
- content safe area must avoid angled caps and remain centered at pressed/disabled states.

## 4. Style complexity targets

M7 should increase complexity through controlled, inspectable layers:

- faceted bevels with separate top/side edge values;
- metallic or crystal material grain reused across at least four component types;
- inner plate, outer frame, edge highlight, and shadow separated as named layers;
- ornamental bolts/runes/cut marks/decal slots that are optional and mask-safe;
- stronger primary/secondary/value hierarchy without relying on text alone;
- state changes through deterministic lighting, depth, offset, saturation, and contrast parameters.

## 5. Component inventory

M7-A1 should define the final bounded inventory using this draft set unless the definition review changes it:

| Draft spec ID | Template family | Required states/values | Baseline logical size | Secondary proof |
|---|---|---|---:|---:|
| `m7-reward-panel` | panel | `normal` | `488 × 660` | `488 × 760` |
| `m7-primary-hex-button` | button | `normal`, `pressed`, `disabled` | `320 × 68` | `260 × 62` |
| `m7-secondary-hex-button` | button | `normal`, `pressed`, `disabled` | `232 × 56` | `188 × 52` |
| `m7-angular-tab` | tab | `normal`, `selected` | `148 × 52` | `184 × 52` |
| `m7-faceted-badge` | badge | `normal`, `highlighted` | `164 × 48` | `212 × 48` |
| `m7-angular-progress` | progress-bar | values `10`, `50`, `90` | `344 × 28` | `420 × 28` |
| `m7-icon-container` | icon-container | `normal`, `selected` | `92 × 92` | `116 × 116` |

The inventory is intentionally package-sized: enough to prove a richer family, but still bounded for one validation package.

## 6. Review questions

- Does the wide-hexagon direction correctly replace the rounded baseline?
- Is the component inventory sufficient without becoming a general UI kit?
- Are the material/detail layers complex enough to address the fidelity weakness?
- Are the size constraints practical for portrait mobile screens?
- Are any reference-specific motifs missing before implementation starts?

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-18 | Drafted reference-fidelity brief from project owner direction | Codex |
| 2026-07-18 | Approved Option A as drafted for M7 implementation | Project owner |
