/* Generated from deterministic M2 material and component recipes. Do not edit. */
(function (global) {
const normalizationBounds = {
    scale: [0.5, 4], offsetX: [0, 1], offsetY: [0, 1], contrast: [0.5, 1.5], saturation: [0, 1.5]
};
function validateMaterialNormalization(normalization) {
    for (const [name, value] of Object.entries(normalization)) {
        if (value === undefined)
            continue;
        const [minimum, maximum] = normalizationBounds[name];
        if (typeof value !== "number" || value < minimum || value > maximum) {
            throw new RangeError(`Material normalization ${name} must be between ${minimum} and ${maximum}; received ${value}.`);
        }
    }
}
function preflightNeonAlloySource(source) {
    if (!source.id || !source.rights)
        throw new Error("Material source must declare an ID and rights.");
    if (source.colorSpace !== "sRGB")
        throw new Error(`${source.id} must use sRGB.`);
    if (source.containsComponentGeometry)
        throw new Error(`${source.id} must not contain component geometry.`);
    if (source.alpha.minimum < 0 || source.alpha.maximum > 0.3 || source.alpha.minimum > source.alpha.maximum) {
        throw new Error(`${source.id} has unsupported alpha bounds.`);
    }
    validateMaterialNormalization({ contrast: source.contrast });
    if (source.kind === "procedural-tile") {
        if (!source.tile || source.tile.units !== "logical-pixels" || source.tile.width < 16 || source.tile.width > 64 || source.tile.height < 16 || source.tile.height > 64) {
            throw new Error(`${source.id} must declare a 16-64 logical-pixel tile.`);
        }
        if (!source.edgeSignature || source.edgeSignature.top !== source.edgeSignature.bottom || source.edgeSignature.left !== source.edgeSignature.right) {
            throw new Error(`${source.id} is not tile-safe at its edges.`);
        }
    }
    else if (!source.transparentBackground) {
        throw new Error(`${source.id} decal must retain a transparent background.`);
    }
}
function materialPattern(sourceId) {
    switch (sourceId) {
        case "alloy-grain":
            return `<pattern id="material-alloy-grain" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="4" cy="6" r="0.7" fill="#D7F7FF" fill-opacity="0.10"/><circle cx="20" cy="15" r="0.55" fill="#061A2A" fill-opacity="0.10"/><circle cx="28" cy="27" r="0.4" fill="#6FE7FF" fill-opacity="0.08"/></pattern>`;
        case "alloy-circuit-pattern":
            return `<pattern id="material-alloy-circuit-pattern" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M0 16H8V8H16V16H24V24H32M16 0V8M16 24V32" fill="none" stroke="#59E8FF" stroke-opacity="0.18" stroke-width="1"/><circle cx="16" cy="8" r="1.25" fill="#B5FAFF" fill-opacity="0.22"/></pattern>`;
        case "alloy-holo-accent":
            return `<linearGradient id="material-alloy-holo-accent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A7FFFF" stop-opacity="0"/><stop offset="50%" stop-color="#A7FFFF" stop-opacity="0.3"/><stop offset="100%" stop-color="#A7FFFF" stop-opacity="0"/></linearGradient>`;
    }
}
function renderNeonAlloyIsolationSvg(sourceId, normalization = {}) {
    validateMaterialNormalization(normalization);
    const scale = normalization.scale ?? 1;
    const offsetX = normalization.offsetX ?? 0;
    const offsetY = normalization.offsetY ?? 0;
    const opacity = sourceId === "alloy-grain" ? 0.1 : sourceId === "alloy-circuit-pattern" ? 0.18 : 0.3;
    const paint = sourceId === "alloy-holo-accent" ? "url(#material-alloy-holo-accent)" : `url(#material-${sourceId})`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="Neon Alloy ${sourceId} isolation"><defs>${materialPattern(sourceId)}<clipPath id="material-isolation-mask"><rect x="8" y="8" width="112" height="112" rx="16"/></clipPath></defs><rect width="128" height="128" fill="#082033"/><g id="material-${sourceId}-isolation" data-material-source="${sourceId}" clip-path="url(#material-isolation-mask)" transform="translate(${offsetX * 32} ${offsetY * 32}) scale(${scale})"><rect x="0" y="0" width="128" height="128" fill="${paint}" fill-opacity="${opacity}"/></g></svg>`;
}
function renderMaskedNeonAlloyLayer(sourceId, maskId, width, height, normalization = {}) {
    if (!/^[a-z][a-z0-9-]*$/.test(maskId))
        throw new Error(`Material mask ID is invalid: ${maskId}.`);
    if (width <= 0 || height <= 0)
        throw new RangeError("Material mask dimensions must be positive.");
    validateMaterialNormalization(normalization);
    const opacity = sourceId === "alloy-grain" ? 0.1 : 0.08;
    return `<g id="layer-${sourceId}" data-material-source="${sourceId}" clip-path="url(#${maskId})"><defs>${materialPattern(sourceId)}</defs><rect width="${width}" height="${height}" fill="url(#material-${sourceId})" fill-opacity="${opacity}"/></g>`;
}


const supportedStates = {
    button: ["normal", "pressed", "disabled"], panel: ["normal"], progress: ["normal"], tab: ["normal", "selected"], badge: ["normal", "highlighted"]
};
const bounds = {
    button: { width: [160, 240], height: [56, 56] }, panel: { width: [432, 432], height: [240, 360] }, progress: { width: [320, 432], height: [24, 24] }, tab: { width: [112, 200], height: [44, 44] }, badge: { width: [104, 200], height: [44, 44] }
};
function assertRequest(request) {
    const state = request.state ?? "normal";
    const size = bounds[request.component];
    if (!Number.isInteger(request.width) || request.width < size.width[0] || request.width > size.width[1] || !Number.isInteger(request.height) || request.height < size.height[0] || request.height > size.height[1])
        throw new RangeError(`${request.component} dimensions are outside its bounded M2 range.`);
    if (!supportedStates[request.component].includes(state))
        throw new RangeError(`${request.component} does not support ${state}.`);
    const percent = request.percent ?? 100;
    if (request.edgeLightOpacity !== undefined && (request.edgeLightOpacity < 0 || request.edgeLightOpacity > 0.65))
        throw new RangeError("edgeLightOpacity must be between 0 and 0.65.");
    if (request.component === "progress" && (!Number.isInteger(percent) || percent < 0 || percent > 100))
        throw new RangeError("Progress percent must be an integer from 0 to 100.");
    return { ...request, state, percent, accentDecal: request.accentDecal ?? false };
}
function stateRecipe(component, state) {
    if (state === "pressed")
        return { y: 2, edge: 0.26, bevel: 0.18, extrusion: 2, saturation: 1 };
    if (state === "disabled")
        return { y: 0, edge: 0.12, bevel: 0.12, extrusion: 3, saturation: 0.55 };
    if (state === "selected" || state === "highlighted")
        return { y: 0, edge: 0.58, bevel: 0.34, extrusion: 4, saturation: 1.15 };
    return { y: 0, edge: component === "button" ? 0.42 : 0.3, bevel: 0.28, extrusion: 4, saturation: 1 };
}
/** Shared M2 SVG recipe for Button, Panel, Progress, Tab, and Badge. */
function renderNeonAlloyComponentSvg(input) {
    const request = assertRequest(input);
    const { component, width, height, state, percent, accentDecal } = request;
    const recipe = stateRecipe(component, state);
    if (request.edgeLightOpacity !== undefined)
        recipe.edge = request.edgeLightOpacity;
    const radius = component === "progress" ? 12 : component === "tab" ? 12 : 16;
    const surfaceHeight = height - recipe.extrusion;
    const fillWidth = component === "progress" ? Math.round((width - 10) * percent / 100) : width - 2;
    const fillX = component === "progress" ? 5 : 1;
    const fillHeight = component === "progress" ? 12 : surfaceHeight - 2;
    const fillY = component === "progress" ? 5 : recipe.y + 1;
    const fillRadius = Math.min(radius - 2, fillWidth / 2, fillHeight / 2);
    const maskId = `${component}-surface-mask`;
    const decal = accentDecal ? `<g id="layer-accent-decal" data-layer="decal" clip-path="url(#${maskId})"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${fillHeight}" fill="url(#alloy-decal-gradient)" fill-opacity="0.18"/></g>` : "";
    const materialLayers = `${renderMaskedNeonAlloyLayer("alloy-grain", maskId, width, height)}\n${renderMaskedNeonAlloyLayer("alloy-circuit-pattern", maskId, width, height)}`;
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Neon Alloy ${component} ${state}">
  <defs><linearGradient id="alloy-base-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#23566B"/><stop offset="100%" stop-color="#0A2436"/></linearGradient><linearGradient id="alloy-edge-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B5FAFF" stop-opacity="${recipe.edge}"/><stop offset="100%" stop-color="#B5FAFF" stop-opacity="0"/></linearGradient><linearGradient id="alloy-decal-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A7FFFF" stop-opacity="0"/><stop offset="50%" stop-color="#A7FFFF" stop-opacity="1"/><stop offset="100%" stop-color="#A7FFFF" stop-opacity="0"/></linearGradient><clipPath id="${maskId}"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight - 2}" rx="${radius - 1}"/></clipPath></defs>
  <g id="layer-outer-shadow" data-layer="shadow"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight + recipe.extrusion - 2}" rx="${radius - 1}" fill="#04131E" fill-opacity="0.78"/></g>
  <g id="layer-connected-extrusion" data-layer="extrusion" data-depth="${recipe.extrusion}"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight + recipe.extrusion - 2}" rx="${radius - 1}" fill="#0A3040" fill-opacity="0.75"/></g>
  <g id="layer-border" data-layer="border"><rect x="1" y="${recipe.y + 1}" width="${width - 2}" height="${surfaceHeight - 2}" rx="${radius - 1}" fill="none" stroke="#A8F4FF" stroke-opacity="0.72" stroke-width="2"/></g>
  <g id="layer-base-fill" data-layer="fill" data-saturation="${recipe.saturation}"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${fillHeight}" rx="${fillRadius}" fill="url(#alloy-base-gradient)"/></g>
  ${materialLayers}
  <g id="layer-bevel-highlight" data-layer="bevel" clip-path="url(#${maskId})"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${Math.min(8, fillHeight)}" rx="${fillRadius}" fill="#D3FFFF" fill-opacity="${recipe.bevel}"/></g>
  <g id="layer-edge-highlight" data-layer="highlight" clip-path="url(#${maskId})"><rect x="${fillX}" y="${fillY}" width="${fillWidth}" height="${Math.min(14, fillHeight)}" rx="${fillRadius}" fill="url(#alloy-edge-gradient)"/></g>
  ${decal}
  <g id="layer-content-slot" data-layer="content" data-slot="editable-${component}-content" transform="translate(0 ${recipe.y})"/>
</svg>`;
}
const NEON_ALLOY_LAYER_IDS = ["layer-outer-shadow", "layer-connected-extrusion", "layer-border", "layer-base-fill", "layer-alloy-grain", "layer-alloy-circuit-pattern", "layer-bevel-highlight", "layer-edge-highlight", "layer-accent-decal", "layer-content-slot"];
function renderNeonAlloyProgressFrameSvg(width) {
    const svg = renderNeonAlloyComponentSvg({ component: "progress", width, height: 24, percent: 0 });
    return svg.replace(/(<svg[^>]*>)/, '$1\n  <g id="part-frame" data-part="frame">').replace("</svg>", "  </g>\n</svg>");
}
function renderNeonAlloyProgressFillSvg(width, percent, edgeLightOpacity = 0.42) {
    if (!Number.isInteger(width) || width < 320 || width > 432 || !Number.isInteger(percent) || percent < 0 || percent > 100)
        throw new RangeError("Progress fill request is outside its bounded M2 range.");
    if (edgeLightOpacity < 0 || edgeLightOpacity > 0.65)
        throw new RangeError("edgeLightOpacity must be between 0 and 0.65.");
    const fillWidth = Math.round((width - 10) * percent / 100);
    const radius = Math.min(6, fillWidth / 2);
    return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="48" viewBox="0 0 ${width} 24"><defs><linearGradient id="progress-value" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#59E8FF" stop-opacity="${edgeLightOpacity}"/><stop offset="100%" stop-color="#176A88"/></linearGradient><clipPath id="progress-fill-mask"><rect x="5" y="5" width="${fillWidth}" height="12" rx="${radius}"/></clipPath></defs><g id="part-fill" data-part="fill" clip-path="url(#progress-fill-mask)"><g id="layer-base-fill" data-layer="fill"><rect x="5" y="5" width="${fillWidth}" height="12" rx="${radius}" fill="url(#progress-value)"/></g>${renderMaskedNeonAlloyLayer("alloy-grain", "progress-fill-mask", width, 24)}${renderMaskedNeonAlloyLayer("alloy-circuit-pattern", "progress-fill-mask", width, 24)}</g></svg>`;
}

  global.LNHPrismM2Recipes = Object.freeze({ renderNeonAlloyComponentSvg });
})(globalThis);
