import type { StyleCompositionBinding, StyleCompositionRequest } from "../renderer/style-composition.js";

export const M11_ENCHANTED_FOREST_LIMITS = { bioluminescenceCoverageMaximum: .30, haloExtentRatioMaximum: .12, haloOpacityMaximum: .40, ornamentMaximum: 6, portraitMoteMaximum: 12 } as const;
export const M11_ENCHANTED_FOREST_LIGHTING = { direction: "inner-canopy", intensity: .44, glow: .30 } as const;

export const M11_ENCHANTED_FOREST_DENSITY_BUDGETS = {
  panel: { clusters: 5, speckles: 4, ornaments: 4, profileStages: 4 },
  "primary-hex-button": { clusters: 2, speckles: 2, ornaments: 2, profileStages: 4 },
  "secondary-hex-button": { clusters: 1, speckles: 1, ornaments: 2, profileStages: 3 },
  tab: { clusters: 1, speckles: 1, ornaments: 2, profileStages: 3 },
  badge: { clusters: 1, speckles: 1, ornaments: 2, profileStages: 3 },
  progress: { clusters: 0, speckles: 0, ornaments: 0, profileStages: 2 },
  "icon-container": { clusters: 2, speckles: 1, ornaments: 2, profileStages: 4 }
} as const;

export const M11_ENCHANTED_FOREST_STATE_RECIPES = {
  normal: { emitter: .24, receiver: .18, edge: .18, relief: 1, cue: "stable-living-presence" },
  pressed: { emitter: .46, receiver: .62, edge: .56, relief: .76, cue: "contained-energy-compression" },
  disabled: { emitter: .07, receiver: .04, edge: .08, relief: .62, cue: "dormant-unavailable" },
  selected: { emitter: .42, receiver: .70, edge: .68, relief: 1.08, cue: "active-attunement" },
  highlighted: { emitter: .42, receiver: .70, edge: .68, relief: 1.08, cue: "active-attunement" }
} as const;

export const M11_ENCHANTED_FOREST_BINDING: StyleCompositionBinding = {
  id: "m11-enchanted-forest",
  version: "0.1.0",
  displayName: "M11 Enchanted Forest",
  colors: [["#071329", "#13251E"], ["#112A46", "#20382B"], ["#0B2038", "#182E24"], ["#173D5A", "#31513B"], ["#315C7A", "#5C7650"], ["#1A6592", "#2A856F"], ["#175A8D", "#359A7B"], ["#63CFF3", "#66D9B2"], ["#9FEFFF", "#B8E0A5"], ["#B9F7FF", "#D4D9A6"], ["#E6FBFF", "#F1E8C8"]],
  validate() { /* M11 limits are data-owned; the renderer retains M7/M8 geometry. */ },
  overlay(request) { return forestLayers(request); }
};

function random(seed: number, index: number): number { let state = (seed + Math.imul(index + 1, 0x9e3779b9)) >>> 0; state ^= state >>> 16; state = Math.imul(state, 0x85ebca6b) >>> 0; state ^= state >>> 13; return (state >>> 0) / 0x100000000; }

export type M11MaterialClusterKind = "stone-chip" | "wood-knot" | "moss-lichen";

export function renderM11MaterialClusterSvg(kind: M11MaterialClusterKind, scale = 1): string {
  const stroke = Math.max(.7, scale * .34).toFixed(2);
  if (kind === "stone-chip") return `<g data-layer="forest-stone-chip-cluster" data-material-family="stone" transform="scale(${scale})"><path d="M-4.8-1.2l2.2-3.1 4.1.5 3.4 2.5-1.2 3.9-4.3 1.8-4.7-2.1Z" fill="#75816E" fill-opacity=".82" stroke="#A6AE91" stroke-width="${stroke}"/><path d="M-2.6-3.4l2.1 2.5 2.8-1.4M-.5-.9l-1.2 3.5" fill="none" stroke="#495C4C" stroke-width="${stroke}" stroke-opacity=".9"/><path d="M-3.8-1.7l2.2-1.5" stroke="#C0C5A9" stroke-width="${stroke}" stroke-opacity=".48"/></g>`;
  if (kind === "wood-knot") return `<g data-layer="forest-wood-knot-cluster" data-material-family="wood" transform="scale(${scale})"><path d="M-6.5 2.8q3.2-2.1 5.8-1.4 2.9.8 7.1-2.2M-6-1.1q3.1-3.1 6.3-1.4 2.8 1.5 6.2-.7M-4.4 4.5q4.1-1.8 8.8-.3" fill="none" stroke="#7F8D57" stroke-width="${stroke}" stroke-opacity=".9"/><path d="M-2.9.7c-.1-2.7 2.2-3.7 4.5-2.5 2 1 1.9 3.5.1 4.8-2.1 1.6-4.5.2-4.6-2.3Z" fill="#435238" fill-opacity=".9"/><path d="M-1.8.5c.2-1.6 1.7-2.2 3-1.4 1.1.7.9 2.1-.1 2.7-.9.5-1.8.2-2.1-.5.1-.7.8-1 1.4-.6" fill="none" stroke="#A0AE70" stroke-width="${stroke}" stroke-opacity=".9"/><path d="M2.3-3.1q1.9 1.2 3.5.1" fill="none" stroke="#A0AE70" stroke-width="${stroke}" stroke-opacity=".55"/></g>`;
  return `<g data-layer="forest-moss-lichen-cluster" data-material-family="moss" transform="scale(${scale})"><path d="M-6.5 3.4l.8-3.1 1.7.5.9-3 2.1 1.1 1.3-3 1.8 2.2 2.2-1.3.6 2.5 2.3.6-1 3.1-2.8-.4-1.6 1.8-2.2-1-2.4 1.2-1.8-1.3Z" fill="#668E58" fill-opacity=".88" stroke="#94BF70" stroke-width="${stroke}"/><ellipse cx="-3.7" cy="-.7" rx="1.35" ry="1" fill="#A8CF79"/><ellipse cx="-.4" cy="-1.7" rx="1.65" ry="1.2" fill="#7FB467"/><ellipse cx="3" cy="-.5" rx="1.45" ry="1.1" fill="#B7D985"/><circle cx="5.1" cy="-2.3" r=".65" fill="#D0E39A"/><circle cx="-1.8" cy="1.6" r=".7" fill="#B8D986"/><path d="M-5.7 3.5q5.8 1.5 11.3-.5" fill="none" stroke="#405B3C" stroke-width="${stroke}"/></g>`;
}

export function renderM11LivingFocalSvg(component: "panel" | "icon-container", cx: number, cy: number, focalRadius: number, state: keyof typeof M11_ENCHANTED_FOREST_STATE_RECIPES = "normal"): string {
  const seedHeight = Math.max(22, focalRadius * .78), seedWidth = seedHeight * .62;
  const recipe = M11_ENCHANTED_FOREST_STATE_RECIPES[state];
  return `<g id="m11-${component}-luminous-seed" data-layer="luminous-seed-focal" data-focal="m11-luminous-seed" data-focal-state="${state}" data-state-contract="${recipe.cue}" data-emitter-opacity="${recipe.emitter}" data-halo-opacity=".40" data-halo-extent-ratio=".12"><circle cx="${cx}" cy="${cy}" r="${focalRadius}" fill="#65D5A4" fill-opacity="${recipe.emitter}"/><circle cx="${cx}" cy="${cy}" r="${focalRadius * .68}" fill="none" stroke="#66D9B2" stroke-width="2" stroke-opacity="${Math.min(.6, recipe.emitter + .1).toFixed(2)}"/><path d="M${cx} ${cy - seedHeight}C${cx + seedWidth} ${cy - seedHeight * .38} ${cx + seedWidth} ${cy + seedHeight * .42} ${cx} ${cy + seedHeight}C${cx - seedWidth} ${cy + seedHeight * .42} ${cx - seedWidth} ${cy - seedHeight * .38} ${cx} ${cy - seedHeight}Z" fill="#294B38" stroke="#B9D995" stroke-width="2.4"/><path d="M${cx} ${cy - seedHeight * .72}V${cy + seedHeight * .66}M${cx} ${cy - seedHeight * .15}q${seedWidth * .36}-${seedHeight * .18} ${seedWidth * .58}-${seedHeight * .48}M${cx} ${cy + seedHeight * .12}q-${seedWidth * .36}-${seedHeight * .14}-${seedWidth * .58}-${seedHeight * .43}" fill="none" stroke="#8CCB7A" stroke-width="1.6"/><ellipse cx="${cx}" cy="${cy}" rx="${seedWidth * .25}" ry="${seedHeight * .32}" fill="#B8F0B2" fill-opacity="${Math.min(.92, .58 + recipe.emitter).toFixed(2)}"/></g><g id="m11-${component}-seed-support" data-layer="forest-focal-support" data-focal-depth="woven-root-cradle" fill="none" stroke="#6E8C5D" stroke-width="2.2"><path d="M${cx - focalRadius * .72} ${cy + seedHeight * .72}Q${cx} ${cy + focalRadius * 1.18} ${cx + focalRadius * .72} ${cy + seedHeight * .72}"/><path d="M${cx - focalRadius * .54} ${cy + seedHeight * .58}Q${cx} ${cy + focalRadius * .9} ${cx + focalRadius * .54} ${cy + seedHeight * .58}" stroke="#A0B96F" stroke-opacity=".75"/></g><g id="m11-${component}-seed-roots" data-layer="forest-focal-roots" data-focal-depth="seed-support-roots" fill="none" stroke="#89AE63" stroke-opacity=".82" stroke-width="1.8"><path d="M${cx - seedWidth * .42} ${cy + seedHeight * .62}Q${cx - focalRadius * .35} ${cy + focalRadius * 1.15} ${cx - focalRadius * 1.08} ${cy + focalRadius * 1.28}M${cx + seedWidth * .42} ${cy + seedHeight * .62}Q${cx + focalRadius * .35} ${cy + focalRadius * 1.15} ${cx + focalRadius * 1.08} ${cy + focalRadius * 1.28}M${cx - seedWidth * .12} ${cy + seedHeight * .8}Q${cx - focalRadius * .08} ${cy + focalRadius * 1.34} ${cx - focalRadius * .58} ${cy + focalRadius * 1.62}M${cx + seedWidth * .12} ${cy + seedHeight * .8}Q${cx + focalRadius * .08} ${cy + focalRadius * 1.34} ${cx + focalRadius * .58} ${cy + focalRadius * 1.62}"/><path data-layer="forest-focal-light-interaction" d="M${cx - focalRadius * .48} ${cy + focalRadius * 1.08}Q${cx - focalRadius * .84} ${cy + focalRadius * 1.28} ${cx - focalRadius * 1.24} ${cy + focalRadius * 1.18}M${cx + focalRadius * .48} ${cy + focalRadius * 1.08}Q${cx + focalRadius * .84} ${cy + focalRadius * 1.28} ${cx + focalRadius * 1.24} ${cy + focalRadius * 1.18}" stroke="#66D9B2" stroke-opacity="${Math.min(.72, recipe.receiver + .22).toFixed(2)}"/></g>`;
}

function materialClusterAnchors(request: StyleCompositionRequest): Array<[number, number]> {
  if (request.component === "panel") return [[.12, .14], [.35, .10], [.66, .12], [.88, .18], [.10, .42], [.90, .46], [.14, .72], [.38, .85], [.72, .83], [.88, .72]];
  if (request.component === "icon-container") return [[.18, .18], [.78, .18], [.16, .72], [.78, .76], [.5, .12]];
  if (request.component === "progress") return [[.12, .24], [.28, .72], [.72, .26], [.88, .68]];
  return [[.12, .25], [.24, .72], [.76, .28], [.88, .68], [.16, .52], [.84, .50]];
}

function stateRecipe(request: StyleCompositionRequest) {
  const state = String(request.state ?? "normal") as keyof typeof M11_ENCHANTED_FOREST_STATE_RECIPES;
  return { state, ...(M11_ENCHANTED_FOREST_STATE_RECIPES[state] ?? M11_ENCHANTED_FOREST_STATE_RECIPES.normal) };
}

export function renderM11ConstructionProfilesSvg(request: StyleCompositionRequest, face = forestFace(request), seed = request.variationSeed ?? 51731): string {
  const w = request.width, h = request.height, cx = w / 2, cy = h / 2;
  const budget = M11_ENCHANTED_FOREST_DENSITY_BUDGETS[request.component];
  const recipe = stateRecipe(request);
  const clipId = `m11-${request.component}-construction-clip`;
  const stoneGradientId = `m11-${request.component}-stone-construction-depth`;
  const woodGradientId = `m11-${request.component}-wood-construction-depth`;
  const mossWidth = Math.max(1.4, Math.min(4.2, h * .028)).toFixed(1);
  const receiverWidth = Math.max(2.4, Math.min(8, h * .07)).toFixed(1);
  const phase = (random(seed || 51731, 151) - .5) * .025;
  const metadata = `data-layer="forest-integrated-material-regions" data-integration="construction-profile-connected" data-variation-seed="${seed}" data-density-class="${request.component}" data-cluster-budget="${budget.clusters}" data-speckle-budget="${budget.speckles}" data-ornament-budget="${budget.ornaments}" data-profile-stages="${budget.profileStages}" data-state-contract="${recipe.cue}" data-state="${recipe.state}"`;
  const definitions = `<defs><linearGradient id="${stoneGradientId}" x2="1" y2="1"><stop stop-color="#BAC0A1" stop-opacity=".76"/><stop offset=".42" stop-color="#697765" stop-opacity=".72"/><stop offset="1" stop-color="#263C33" stop-opacity=".92"/></linearGradient><linearGradient id="${woodGradientId}" x2=".8" y2=".2"><stop stop-color="#172B21"/><stop offset=".45" stop-color="#4A5B3D"/><stop offset=".7" stop-color="#293C2C"/><stop offset="1" stop-color="#12251C"/></linearGradient></defs><clipPath id="${clipId}"><path d="${face}"/></clipPath>`;
  if (request.component === "panel") {
    const panelPlates = [
      `M0 ${h * .02}H${w * .18}L${w * .165} ${h * .075} ${w * .178} ${h * .11} ${w * .145} ${h * (.16 + phase)} ${w * .17} ${h * .29}H0Z`,
      `M0 ${h * .34}H${w * .14}L${w * .155} ${h * .39} ${w * .13} ${h * .43} ${w * .17} ${h * (.48 + phase)} ${w * .135} ${h * .62}H0Z`,
      `M0 ${h * .68}H${w * .16}L${w * .145} ${h * .74} ${w * .12} ${h * .78} ${w * .11} ${h * (.86 + phase)} ${w * .19} ${h * .98}H0Z`,
      `M${w} ${h * .02}H${w * .82}L${w * .835} ${h * .075} ${w * .822} ${h * .11} ${w * .855} ${h * (.16 + phase)} ${w * .83} ${h * .29}H${w}Z`,
      `M${w} ${h * .34}H${w * .86}L${w * .845} ${h * .39} ${w * .87} ${h * .43} ${w * .83} ${h * (.48 + phase)} ${w * .865} ${h * .62}H${w}Z`,
      `M${w} ${h * .68}H${w * .84}L${w * .855} ${h * .74} ${w * .88} ${h * .78} ${w * .89} ${h * (.86 + phase)} ${w * .81} ${h * .98}H${w}Z`
    ];
    const leftRail = panelPlates.slice(0, 3).join("");
    const rightRail = panelPlates.slice(3).join("");
    const plateInteriorDefinitions = panelPlates.map((path, index) => `<clipPath id="m11-panel-stone-plate-${index + 1}-clip"><path d="${path}"/></clipPath>`).join("");
    const plateJoinPaths = [
      `M${w * .18} ${h * .02}L${w * .165} ${h * .075} ${w * .178} ${h * .11} ${w * .145} ${h * (.16 + phase)} ${w * .17} ${h * .29}`,
      `M${w * .14} ${h * .34}L${w * .155} ${h * .39} ${w * .13} ${h * .43} ${w * .17} ${h * (.48 + phase)} ${w * .135} ${h * .62}`,
      `M${w * .16} ${h * .68}L${w * .145} ${h * .74} ${w * .12} ${h * .78} ${w * .11} ${h * (.86 + phase)} ${w * .19} ${h * .98}`,
      `M${w * .82} ${h * .02}L${w * .835} ${h * .075} ${w * .822} ${h * .11} ${w * .855} ${h * (.16 + phase)} ${w * .83} ${h * .29}`,
      `M${w * .86} ${h * .34}L${w * .845} ${h * .39} ${w * .87} ${h * .43} ${w * .83} ${h * (.48 + phase)} ${w * .865} ${h * .62}`,
      `M${w * .84} ${h * .68}L${w * .855} ${h * .74} ${w * .88} ${h * .78} ${w * .89} ${h * (.86 + phase)} ${w * .81} ${h * .98}`
    ];
    const plateInteriors = seed === 0 ? "" : panelPlates.map((_, index) => {
      const right = index >= 3;
      const band = index % 3;
      const direction = right ? -1 : 1;
      const outerX = right ? w : 0;
      const [startRatio, endRatio] = [[.02, .29], [.34, .62], [.68, .98]][band];
      const startY = h * startRatio, endY = h * endRatio, span = endY - startY;
      const focalProximity = band === 1 ? 1 : .28;
      const railFalloffOpacity = (.08 + focalProximity * .22).toFixed(2);
      const splitOne = startY + span * (.31 + random(seed, 220 + index) * .08);
      const splitTwo = startY + span * (.65 + random(seed, 240 + index) * .08);
      const planeX = (amount: number, variationIndex: number) => outerX + direction * w * (amount + random(seed, variationIndex + index) * .018);
      const tonalPlanes = [
        `<path data-layer="forest-stone-connected-tonal-plane" data-plane-index="1" d="M${outerX} ${startY}L${planeX(.145, 260).toFixed(2)} ${(startY + span * .04).toFixed(2)} ${planeX(.128, 280).toFixed(2)} ${splitOne.toFixed(2)}H${outerX}Z" fill="#D0D1AE" fill-opacity="${(.16 + random(seed, 300 + index) * .07).toFixed(2)}"/>`,
        `<path data-layer="forest-stone-connected-tonal-plane" data-plane-index="2" d="M${outerX} ${splitOne.toFixed(2)}L${planeX(.128, 320).toFixed(2)} ${splitOne.toFixed(2)} ${planeX(.155, 340).toFixed(2)} ${splitTwo.toFixed(2)}H${outerX}Z" fill="#435649" fill-opacity="${(.22 + random(seed, 360 + index) * .08).toFixed(2)}"/>`,
        `<path data-layer="forest-stone-connected-tonal-plane" data-plane-index="3" d="M${outerX} ${splitTwo.toFixed(2)}L${planeX(.155, 380).toFixed(2)} ${splitTwo.toFixed(2)} ${planeX(.12, 400).toFixed(2)} ${(endY - span * .03).toFixed(2)}L${outerX} ${endY}Z" fill="#929B85" fill-opacity="${(.13 + random(seed, 420 + index) * .08).toFixed(2)}"/>`,
        `<path data-layer="forest-stone-focal-zone-relief-falloff" data-focal-proximity="${focalProximity}" d="M${outerX} ${startY}H${planeX(.165, 800).toFixed(2)}V${endY.toFixed(2)}H${outerX}Z" fill="#0D2119" fill-opacity="${railFalloffOpacity}"/>`,
        `<path data-layer="forest-focal-zone-stone-receiver" data-receiver-zone="inner-rail" d="M${planeX(.15, 820).toFixed(2)} ${(startY + span * .47).toFixed(2)}Q${planeX(.08, 840).toFixed(2)} ${(startY + span * .52).toFixed(2)} ${planeX(.13, 860).toFixed(2)} ${(startY + span * .58).toFixed(2)}" fill="none" stroke="#73D5A8" stroke-width="${(3 + focalProximity * 2).toFixed(1)}" stroke-opacity="${(recipe.receiver * (.14 + focalProximity * .28)).toFixed(2)}"/>`,
        `<path data-layer="forest-focal-zone-moss-receiver" data-receiver-zone="inner-rail" d="M${planeX(.15, 820).toFixed(2)} ${(startY + span * .47).toFixed(2)}Q${planeX(.10, 880).toFixed(2)} ${(startY + span * .55).toFixed(2)} ${planeX(.14, 900).toFixed(2)} ${(startY + span * .62).toFixed(2)}" fill="none" stroke="#C4F3B7" stroke-width="${(1.2 + focalProximity).toFixed(1)}" stroke-opacity="${(recipe.receiver * (.10 + focalProximity * .22)).toFixed(2)}"/>`
      ].join("");
      const chipX = outerX + direction * w * (.085 + random(seed, 440 + index) * .045);
      const chipY = startY + span * (.23 + random(seed, 460 + index) * .18);
      const secondChipX = outerX + direction * w * (.12 + random(seed, 480 + index) * .035);
      const secondChipY = startY + span * (.64 + random(seed, 500 + index) * .18);
      const chipScale = 1.25 + random(seed, 520 + index) * .5;
      const secondChipScale = .62 + random(seed, 540 + index) * .36;
      const chipRotation = Math.round((random(seed, 560 + index) - .5) * 34);
      const secondChipRotation = Math.round((random(seed, 580 + index) - .5) * 42);
      const pits = Array.from({ length: 3 }, (_unused, pitIndex) => {
        const pitX = outerX + direction * w * (.055 + random(seed, 600 + index * 7 + pitIndex) * .095);
        const pitY = startY + span * (.16 + random(seed, 640 + index * 7 + pitIndex) * .68);
        const pitRadius = 1.2 + random(seed, 680 + index * 7 + pitIndex) * 1.7;
        return `<ellipse data-layer="forest-stone-plate-pit" cx="${pitX.toFixed(2)}" cy="${pitY.toFixed(2)}" rx="${pitRadius.toFixed(2)}" ry="${(pitRadius * .72).toFixed(2)}" fill="#172B23" fill-opacity=".62" stroke="#BCC2A2" stroke-width=".65" stroke-opacity=".32"/>`;
      }).join("");
      return `<g data-layer="forest-stone-plate-interior" data-plate-index="${index + 1}" data-material-family="stone" data-variation-seed="${seed}" data-weathering-scale="connected-multi-scale" clip-path="url(#m11-panel-stone-plate-${index + 1}-clip)">${tonalPlanes}<g data-layer="forest-stone-plate-chip" data-chip-scale="primary" transform="translate(${chipX.toFixed(2)} ${chipY.toFixed(2)}) rotate(${chipRotation})">${renderM11MaterialClusterSvg("stone-chip", Number(chipScale.toFixed(3)))}</g><g data-layer="forest-stone-plate-chip" data-chip-scale="secondary" transform="translate(${secondChipX.toFixed(2)} ${secondChipY.toFixed(2)}) rotate(${secondChipRotation})">${renderM11MaterialClusterSvg("stone-chip", Number(secondChipScale.toFixed(3)))}</g><g data-layer="forest-stone-plate-pits" data-pit-count="3">${pits}</g><path data-layer="forest-stone-plate-contact-darkening" data-join-following="true" d="${plateJoinPaths[index]}" fill="none" stroke="#091A15" stroke-width="${(6.5 + random(seed, 720 + index) * 2).toFixed(1)}" stroke-opacity=".56" stroke-linecap="round" stroke-linejoin="round"/><path data-layer="forest-stone-irregular-inner-bevel-break" d="${plateJoinPaths[index]}" fill="none" stroke="#D9D9B2" stroke-width="1.5" stroke-opacity="${(.28 * recipe.relief).toFixed(2)}" stroke-dasharray="${(13 + random(seed, 740 + index) * 8).toFixed(1)} ${(5 + random(seed, 760 + index) * 5).toFixed(1)} ${(7 + random(seed, 780 + index) * 6).toFixed(1)} 6"/></g>`;
    }).join("");
    const woodLeft = `M${w * .135} ${h * .08}C${w * .205} ${h * .18} ${w * .145} ${h * .35} ${w * .205} ${h * .47}S${w * .15} ${h * .76} ${w * .19} ${h * .92}`;
    const woodRight = `M${w * .865} ${h * .08}C${w * .795} ${h * .18} ${w * .855} ${h * .35} ${w * .795} ${h * .47}S${w * .85} ${h * .76} ${w * .81} ${h * .92}`;
    return `<g id="m11-${request.component}-integrated-material-regions" ${metadata}>${definitions}<defs>${plateInteriorDefinitions}</defs><g clip-path="url(#${clipId})"><g data-layer="forest-stone-surface-region" data-material-family="stone" data-construction-profile="structural-plate,connected-tonal-planes,multi-scale-chips,pitted-weathering,irregular-inner-bevel,join-following-contact-darkening,fracture-field,contact-occlusion,light-facing-bevel"><path d="${leftRail}${rightRail}" fill="url(#${stoneGradientId})"/>${plateInteriors}<path data-layer="forest-stone-contact-occlusion" d="M${w * .19} ${h * .02}L${w * .145} ${h * .12} ${w * .18} ${h * .29} ${w * .13} ${h * .48} ${w * .17} ${h * .67} ${w * .11} ${h * .86}M${w * .81} ${h * .02}L${w * .855} ${h * .12} ${w * .82} ${h * .29} ${w * .87} ${h * .48} ${w * .83} ${h * .67} ${w * .89} ${h * .86}" fill="none" stroke="#10241C" stroke-width="5" stroke-opacity=".62"/><path data-layer="forest-stone-fracture-field" d="M${w * .035} ${h * .15}l${w * .055} ${h * .018} ${w * .035}-${h * .03}M${w * .04} ${h * .51}l${w * .07}-${h * .018} ${w * .028} ${h * .034}M${w * .865} ${h * .31}l${w * .045} ${h * .026} ${w * .05}-${h * .02}M${w * .87} ${h * .74}l${w * .06}-${h * .028} ${w * .035} ${h * .022}" fill="none" stroke="#D0D1AE" stroke-width="1.5" stroke-opacity="${(.4 * recipe.relief).toFixed(2)}"/><path data-layer="forest-stone-light-facing-bevel" d="M0 0H${w * .19}M${w * .81} 0H${w}" stroke="#D9D9B2" stroke-width="2.2" stroke-opacity="${(.38 * recipe.relief).toFixed(2)}"/></g><g data-layer="forest-wood-surface-region" data-material-family="wood" data-growth-vector="vertical-canopy" data-construction-profile="growth-vector-body,tapered-relief,anchored-knot,masked-termination"><path data-layer="forest-wood-growth-body" d="${woodLeft}M${woodRight}" fill="none" stroke="url(#${woodGradientId})" stroke-width="${Math.max(13, w * .033).toFixed(1)}" stroke-linecap="round"/><path data-layer="forest-wood-relief-bands" d="${woodLeft}M${woodRight}" fill="none" stroke="#8A9C61" stroke-width="2" stroke-opacity="${(.62 * recipe.relief).toFixed(2)}" stroke-dasharray="${Math.max(18, h * .055).toFixed(0)} ${Math.max(8, h * .022).toFixed(0)}"/></g><g data-layer="forest-moss-surface-region" data-material-family="moss" data-substrate="stone-wood-damp-seam" data-construction-profile="anchored-substrate,irregular-transition,receiver-tint"><path data-layer="forest-moss-substrate" d="M${w * .145} ${h * .12}Q${w * .18} ${h * (.16 + phase)} ${w * .205} ${h * .22}M${w * .83} ${h * .67}Q${w * .86} ${h * .73} ${w * .85} ${h * .82}" fill="none" stroke="#47673F" stroke-width="${Number(mossWidth) + 4}" stroke-opacity=".72"/><path data-layer="forest-moss-coverage-transition" d="M${w * .145} ${h * .12}Q${w * .18} ${h * (.16 + phase)} ${w * .205} ${h * .22}M${w * .83} ${h * .67}Q${w * .86} ${h * .73} ${w * .85} ${h * .82}" fill="none" stroke="#98C676" stroke-width="${mossWidth}" stroke-dasharray="13 4 7 5"/></g><g data-layer="forest-living-light-surface-response" data-material-family="living-light" data-light-response="focal-to-stone-wood-moss-receivers" data-receiver-opacity="${recipe.receiver}"><path data-layer="forest-wood-light-receiver" d="M${cx - w * .02} ${cy + h * .05}Q${w * .28} ${h * .48} ${w * .185} ${h * .57}M${cx + w * .02} ${cy + h * .05}Q${w * .72} ${h * .48} ${w * .815} ${h * .57}" fill="none" stroke="#66D9B2" stroke-width="${receiverWidth}" stroke-opacity="${recipe.receiver}"/><path data-layer="forest-moss-light-receiver" d="M${w * .145} ${h * .12}Q${w * .18} ${h * .16} ${w * .205} ${h * .22}M${w * .83} ${h * .67}Q${w * .86} ${h * .73} ${w * .85} ${h * .82}" fill="none" stroke="#B8F0B2" stroke-width="${Number(mossWidth) + 2}" stroke-opacity="${(recipe.receiver * .8).toFixed(2)}"/><path data-layer="forest-stone-light-receiver" d="M${w * .13} ${h * .48}L${w * .17} ${h * .67}M${w * .87} ${h * .48}L${w * .83} ${h * .67}" stroke="#A9E7BE" stroke-width="3" stroke-opacity="${(recipe.receiver * .68).toFixed(2)}"/></g></g></g>`;
  }
  const primary = request.component === "primary-hex-button";
  const icon = request.component === "icon-container";
  const progress = request.component === "progress";
  const cap = progress ? w * .06 : icon ? w * .19 : primary ? w * .17 : w * .13;
  const bodyInset = cap * .72;
  const stonePaths = icon
    ? `M0 0H${w}V${h * .15}L${w * .82} ${h * .22} ${w * .18} ${h * .22} 0 ${h * .15}ZM0 ${h}H${w}V${h * .85}L${w * .82} ${h * .78} ${w * .18} ${h * .78} 0 ${h * .85}Z`
    : `M0 0H${cap}L${bodyInset} ${cy} ${cap} ${h}H0ZM${w} 0H${w - cap}L${w - bodyInset} ${cy} ${w - cap} ${h}H${w}Z`;
  const mossPath = icon ? `M${w * .12} ${h * .2}Q${w * .23} ${h * .1} ${w * .35} ${h * .2}` : `M${bodyInset} ${h * .24}Q${cap} ${h * .12} ${cap * 1.45} ${h * .2}`;
  const receiverPath = icon ? `M${w * .18} ${h * .22}Q${cx} ${h * .08} ${w * .82} ${h * .22}M${w * .18} ${h * .78}Q${cx} ${h * .92} ${w * .82} ${h * .78}` : `M${bodyInset} ${cy}H${w - bodyInset}`;
  const activeState = recipe.state === "pressed" || recipe.state === "selected" || recipe.state === "highlighted";
  const statePulse = activeState ? `<path data-layer="forest-state-receiver-pulse" data-state-response="${recipe.state}" d="${receiverPath}" fill="none" stroke="#D8FFD0" stroke-width="${Number(receiverWidth) + 2}" stroke-opacity="${Math.min(.82, recipe.receiver + .12).toFixed(2)}"/>` : "";
  return `<g id="m11-${request.component}-integrated-material-regions" ${metadata}>${definitions}<g clip-path="url(#${clipId})"><g data-layer="forest-wood-surface-region" data-material-family="wood" data-growth-vector="horizontal-action" data-construction-profile="growth-vector-body,single-recessed-relief,masked-termination"><path data-layer="forest-wood-growth-body" d="M${bodyInset} ${cy}H${w - bodyInset}" stroke="url(#${woodGradientId})" stroke-width="${Math.max(8, h * (progress ? .5 : .62)).toFixed(1)}" stroke-linecap="round"/><path data-layer="forest-wood-relief-bands" data-band-count="1" d="M${bodyInset * 1.22} ${cy + h * .13}Q${cx} ${cy + h * (.16 - phase)} ${w - bodyInset * 1.22} ${cy + h * .13}" fill="none" stroke="#8A9C61" stroke-width="1.15" stroke-opacity="${(.46 * recipe.relief).toFixed(2)}"/></g><g data-layer="forest-stone-surface-region" data-material-family="stone" data-construction-profile="structural-end-plate,contact-occlusion,light-facing-bevel"><path d="${stonePaths}" fill="url(#${stoneGradientId})" fill-opacity="${progress ? .7 : .86}"/><path data-layer="forest-stone-contact-occlusion" d="M${bodyInset} ${h * .18}V${h * .82}M${w - bodyInset} ${h * .18}V${h * .82}" stroke="#10241C" stroke-width="3" stroke-opacity=".65"/><path data-layer="forest-stone-light-facing-bevel" d="M0 1H${cap}M${w - cap} 1H${w}" stroke="#D9D9B2" stroke-width="1.5" stroke-opacity="${(.42 * recipe.relief).toFixed(2)}"/></g>${progress ? "" : `<g data-layer="forest-moss-surface-region" data-material-family="moss" data-substrate="stone-wood-end-seam" data-construction-profile="anchored-substrate,irregular-transition,receiver-tint"><path data-layer="forest-moss-substrate" d="${mossPath}" fill="none" stroke="#3E613C" stroke-width="${Number(mossWidth) + 3}"/><path data-layer="forest-moss-coverage-transition" d="${mossPath}" fill="none" stroke="#9AC979" stroke-width="${mossWidth}" stroke-dasharray="8 3 4 3"/></g>`}<g data-layer="forest-living-light-surface-response" data-material-family="living-light" data-light-response="state-bound-material-receivers" data-receiver-opacity="${recipe.receiver}" data-edge-opacity="${recipe.edge}">${statePulse}<path data-layer="forest-wood-light-receiver" d="${receiverPath}" fill="none" stroke="#66D9B2" stroke-width="${receiverWidth}" stroke-opacity="${recipe.receiver}"/><path data-layer="forest-edge-light-receiver" d="M${bodyInset} ${h * .12}L${bodyInset * .72} ${cy} ${bodyInset} ${h * .88}M${w - bodyInset} ${h * .12}L${w - bodyInset * .72} ${cy} ${w - bodyInset} ${h * .88}" fill="none" stroke="#B8F0B2" stroke-width="${activeState ? "2.8" : "2"}" stroke-opacity="${recipe.edge}"/>${progress ? "" : `<path data-layer="forest-moss-light-receiver" d="${mossPath}" fill="none" stroke="#C4F3B7" stroke-width="${Number(mossWidth) + 1}" stroke-opacity="${(recipe.receiver * .72).toFixed(2)}"/>`}</g></g></g>`;
}

function forestFace(request: StyleCompositionRequest): string {
  const inset = 4, top = inset, bottom = request.height - 6, mid = (top + bottom) / 2;
  const hex = request.component.includes("button");
  const cap = request.component === "primary-hex-button" ? Math.min(44, Math.max(24, Math.round(request.height * .5))) : Math.min(36, Math.max(20, Math.round(request.height * .45)));
  if (hex) return `M${inset + cap} ${top}H${request.width - inset - cap}L${request.width - inset} ${mid}L${request.width - inset - cap} ${bottom}H${inset + cap}L${inset} ${mid}Z`;
  const chamfer = request.component === "icon-container" ? Math.round(request.width * .24) : Math.min(34, Math.max(16, Math.round(request.height * .32)));
  return `M${inset + chamfer} ${top}H${request.width - inset - chamfer}L${request.width - inset} ${top + chamfer}V${bottom - chamfer}L${request.width - inset - chamfer} ${bottom}H${inset + chamfer}L${inset} ${bottom - chamfer}V${top + chamfer}Z`;
}
function forestLayers(request: StyleCompositionRequest): string {
  const seed = request.variationSeed ?? 51731;
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError("Variation seed must be an unsigned 32-bit integer.");
  const cx = request.width / 2, cy = request.height / 2, focal = request.component === "panel" || request.component === "icon-container";
  const control = request.component.includes("button") || request.component === "tab" || request.component === "badge";
  const face = forestFace(request);
  const material = '<g id="m11-' + request.component + '-material-stack" data-layer="forest-material-stack" data-material-families="weathered-stone,dark-wood,moss-lichen"><path d="' + face + '" fill="#20382B"/></g>';
  const detail = '<g id="m11-' + request.component + '-material-detail" data-layer="forest-material-detail" data-material-channels="stone-chips,wood-grain,moss-mask" data-detail-scale="component"><path d="M' + (request.width * .17) + ' ' + (request.height * .18) + 'l' + (request.width * .08) + ' ' + (request.height * .05) + 'M' + (request.width * .62) + ' ' + (request.height * .16) + 'l' + (request.width * .07) + ' ' + (request.height * .06) + 'M' + (request.width * .28) + ' ' + (request.height * .70) + 'l' + (request.width * .07) + ' ' + (request.height * .04) + '" stroke="#6B8063" stroke-width="1.2" stroke-opacity=".72"/></g>';
  const faceTexture = `<g id="m11-${request.component}-material-face-depth" data-layer="forest-material-face-depth" data-material-source="shared-face-geometry"><clipPath id="m11-${request.component}-face-clip"><path d="${face}"/></clipPath><g clip-path="url(#m11-${request.component}-face-clip)"><g data-layer="forest-weathered-stone"><path d="M${request.width * .12} ${request.height * .22}l${request.width * .045} ${request.height * .025} -${request.width * .025} ${request.height * .04} -${request.width * .045} -${request.height * .018}ZM${request.width * .77} ${request.height * .73}l${request.width * .05} ${request.height * .02} -${request.width * .018} ${request.height * .045} -${request.width * .052} -${request.height * .018}Z" fill="#7C8D70" fill-opacity=".45"/><path d="M${request.width * .32} ${request.height * .14}l${request.width * .018} ${request.height * .026} -${request.width * .02} ${request.height * .028}M${request.width * .68} ${request.height * .82}l${request.width * .02} -${request.height * .028} ${request.width * .021} ${request.height * .025}" fill="none" stroke="#9BA687" stroke-width="1" stroke-opacity=".55"/></g><g data-layer="forest-dark-wood-grain"><path d="M${request.width * .11} ${request.height * .46}q${request.width * .045} -${request.height * .018} ${request.width * .09} 0M${request.width * .42} ${request.height * .51}q${request.width * .04} ${request.height * .018} ${request.width * .08} 0M${request.width * .72} ${request.height * .47}q${request.width * .045} -${request.height * .016} ${request.width * .09} 0" fill="none" stroke="#72854C" stroke-width="1.1" stroke-opacity=".62"/></g><g data-layer="forest-moss-growth-mask" fill="#9BCB78" fill-opacity=".48"><ellipse cx="${request.width * .18}" cy="${request.height * .31}" rx="${Math.max(2, request.width * .014)}" ry="${Math.max(1.5, request.height * .012)}"/><ellipse cx="${request.width * .82}" cy="${request.height * .69}" rx="${Math.max(2, request.width * .014)}" ry="${Math.max(1.5, request.height * .012)}"/></g></g></g>`;
  const restraint = `<g id="m11-${request.component}-material-restraint" data-layer="forest-material-restraint" data-restraint="edge-anchored-low-opacity"><clipPath id="m11-${request.component}-restraint-clip"><path d="${face}"/></clipPath><g clip-path="url(#m11-${request.component}-restraint-clip)"><path d="M0 0H${request.width}V${request.height}H0Z" fill="#20382B" fill-opacity=".42"/><g data-layer="forest-moss-edge-anchor" fill="#20382B" fill-opacity=".78"><path d="M${request.width * .1} ${request.height * .28}q${request.width * .06} -${request.height * .05} ${request.width * .13} 0q${request.width * .05} ${request.height * .04} ${request.width * .11} -.01l-${request.width * .03} ${request.height * .05}q-${request.width * .14} ${request.height * .04} -${request.width * .25} -.02Z"/><path d="M${request.width * .63} ${request.height * .74}q${request.width * .08} -${request.height * .06} ${request.width * .17} -.01q${request.width * .08} ${request.height * .04} ${request.width * .14} -.03l-${request.width * .02} ${request.height * .06}q-${request.width * .16} ${request.height * .045} -${request.width * .3} -.01Z"/></g><path d="M${request.width * .08} ${request.height * .17}q${request.width * .045} -${request.height * .028} ${request.width * .09} 0M${request.width * .78} ${request.height * .82}q${request.width * .045} -${request.height * .028} ${request.width * .09} 0" fill="none" stroke="#9BCB78" stroke-width="1.5" stroke-opacity=".42"/></g></g>`;
  const budget = M11_ENCHANTED_FOREST_DENSITY_BUDGETS[request.component];
  const integratedRegions = renderM11ConstructionProfilesSvg(request, face, seed);
  const clusterScale = request.component === "panel" ? 2.1 : request.component === "icon-container" ? 1.35 : request.component === "progress" ? .82 : 1.05;
  const anchors = materialClusterAnchors(request);
  const clusterCount = budget.clusters;
  const kinds: M11MaterialClusterKind[] = ["stone-chip", "wood-knot", "moss-lichen"];
  const clusters = seed === 0 || clusterCount === 0 ? "" : '<g id="m11-' + request.component + '-authored-material-clusters" data-layer="forest-authored-material-clusters" data-material-families="stone,wood,moss" data-variation-seed="' + seed + '" data-cluster-count="' + clusterCount + '" data-cluster-scale="component" data-placement="construction-anchor-budgeted"><clipPath id="m11-' + request.component + '-cluster-clip"><path d="' + face + '"/></clipPath><g clip-path="url(#m11-' + request.component + '-cluster-clip)">' + Array.from({ length: clusterCount }, (_, index) => { const anchor = anchors[index % anchors.length], jitterX = (random(seed, index * 5) - .5) * .035, jitterY = (random(seed, index * 5 + 1) - .5) * .04, x = request.width * (anchor[0] + jitterX), y = request.height * (anchor[1] + jitterY), scale = clusterScale * (.82 + random(seed, index * 5 + 2) * .28), rotation = Math.round((random(seed, index * 5 + 3) - .5) * 20), kind = kinds[(index + Math.floor(random(seed, 91) * kinds.length)) % kinds.length]; return '<g data-layer="forest-authored-cluster" data-cluster-kind="' + kind + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rotation + ')">' + renderM11MaterialClusterSvg(kind, Number(scale.toFixed(3))) + '</g>'; }).join("") + '</g></g>';
  const speckles = seed === 0 ? "" : Array.from({ length: budget.speckles }, (_, index) => '<circle cx="' + (16 + random(seed, index * 2) * (request.width - 32)).toFixed(2) + '" cy="' + (14 + random(seed, index * 2 + 1) * (request.height - 28)).toFixed(2) + '" r="' + (.8 + random(seed, index + 16) * 1.2).toFixed(1) + '"/>').join("");
  const variation = '<g id="m11-' + request.component + '-moss-variation" data-layer="forest-variation" data-variation-seed="' + seed + '" data-variation-baseline="' + (seed === 0) + '" data-speckle-count="' + budget.speckles + '" fill="#A6CC72" fill-opacity=".3">' + speckles + "</g>";
  const topOrnament = budget.ornaments >= 2 ? '<path d="M12 18c8-8 14-8 20-2M' + (request.width - 12) + ' 18c-8-8-14-8-20-2"/><path d="M24 14l5-5M' + (request.width - 24) + ' 14l-5-5"/>' : "";
  const bottomOrnament = budget.ornaments >= 4 ? '<path d="M18 ' + (request.height - 18) + 'c8-7 15-7 22-1M' + (request.width - 18) + ' ' + (request.height - 18) + 'c-8-7-15-7-22-1"/>' : "";
  const ornament = budget.ornaments === 0 ? "" : '<g id="m11-' + request.component + '-leaf-vine-ornament" data-layer="forest-ornament" data-ornament="leaf-vine" data-ornament-count="' + budget.ornaments + '" fill="none" stroke="#76B86D" stroke-opacity=".68" stroke-width="1.6">' + topOrnament + bottomOrnament + '</g>';
  const typography = control ? '<g id="m11-' + request.component + '-parchment-typography" data-layer="forest-typography" data-typography-preset="m11-parchment-sage-action" data-semantic-text="required"><path d="M' + (cx - 28) + " " + (request.height / 2 + 13) + 'h56" stroke="#EDE3B4" stroke-opacity=".42"/></g>' : "";
  const focalRadius = Math.min(request.width, request.height) * (request.component === "panel" ? .105 : .19);
  const focalState = String(request.state ?? "normal") as keyof typeof M11_ENCHANTED_FOREST_STATE_RECIPES;
  const focalLayers = focal ? renderM11LivingFocalSvg(request.component as "panel" | "icon-container", cx, cy, focalRadius, focalState) : "";
  return material + integratedRegions + clusters + variation + ornament + typography + focalLayers;
}
