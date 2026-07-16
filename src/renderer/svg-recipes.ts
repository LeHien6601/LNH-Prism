export const BUTTON_HEIGHT_LOGICAL = 56;
export const BUTTON_WIDTHS_LOGICAL = [160, 240] as const;
export const BUTTON_WIDTH_BOUNDS = { min: 160, max: 240 } as const;
export const BUTTON_STATES = ["normal", "pressed", "disabled"] as const;

export type ButtonWidthLogical = number;
export type ButtonState = (typeof BUTTON_STATES)[number];

export interface PrimaryButtonRequest {
  logicalWidth: ButtonWidthLogical;
  state: ButtonState;
}

export const PROGRESS_HEIGHT_LOGICAL = 24;
export const PROGRESS_WIDTHS_LOGICAL = [320, 432] as const;
export const PROGRESS_WIDTH_BOUNDS = { min: 320, max: 432 } as const;
export const PROGRESS_PERCENTAGES = [10, 50, 90] as const;
export const PROGRESS_REVIEW_PERCENTAGES = [0, 1, 10, 50, 90, 99, 100] as const;
export const FRAME_EXTRUSION_DEPTH_LOGICAL = 2;

export type ProgressWidthLogical = number;
export type ProgressPercentage = number;

export interface ProgressBarRequest {
  logicalWidth: ProgressWidthLogical;
  percent: ProgressPercentage;
}

export interface ProgressFillGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

function assertIntegerInRange(name: string, value: number, min: number, max: number): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}; received ${value}.`);
  }
}

function stateRecipe(state: ButtonState) {
  switch (state) {
    case "pressed":
      return { fillTop: "#3972E5", fillBottom: "#2859B8", extrusionOpacity: 0.5, extrusionDepth: 2, mainY: 2, highlightOpacity: 0.16 };
    case "disabled":
      return { fillTop: "#6E86AE", fillBottom: "#526986", extrusionOpacity: 0.34, extrusionDepth: 4, mainY: 0, highlightOpacity: 0 };
    default:
      return { fillTop: "#5B91FF", fillBottom: "#326BDA", extrusionOpacity: 0.72, extrusionDepth: 4, mainY: 0, highlightOpacity: 0.42 };
  }
}

export function renderPrimaryButtonSvg(request: PrimaryButtonRequest): string {
  const { logicalWidth, state } = request;
  assertIntegerInRange("Primary Button width", logicalWidth, BUTTON_WIDTH_BOUNDS.min, BUTTON_WIDTH_BOUNDS.max);
  if (!BUTTON_STATES.includes(state)) throw new RangeError(`Primary Button state is unsupported: ${state}.`);
  const recipe = stateRecipe(state);
  const radius = 24;
  const mainHeight = 52;
  const inset = 1;
  const mainWidth = logicalWidth - inset * 2;
  const mainRadius = radius - inset;
  const surfaceY = recipe.mainY + inset;
  const surfaceHeight = mainHeight - inset * 2;
  const extrusionHeight = surfaceHeight + recipe.extrusionDepth;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${logicalWidth * 2}" height="${BUTTON_HEIGHT_LOGICAL * 2}" viewBox="0 0 ${logicalWidth} ${BUTTON_HEIGHT_LOGICAL}" role="img" aria-label="Neon Core primary button ${state}">
  <defs>
    <linearGradient id="button-fill-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${recipe.fillTop}"/>
      <stop offset="100%" stop-color="${recipe.fillBottom}"/>
    </linearGradient>
    <linearGradient id="button-highlight-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="${recipe.highlightOpacity}"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="button-extrusion-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#193765"/>
      <stop offset="100%" stop-color="#09172E"/>
    </linearGradient>
  </defs>
  <g id="layer-shadow" data-layer="shadow" data-effect="connected-extrusion" data-depth="${recipe.extrusionDepth}">
    <rect data-role="extrusion-body" x="${inset}" y="${surfaceY}" width="${mainWidth}" height="${extrusionHeight}" rx="${mainRadius}" fill="url(#button-extrusion-gradient)" fill-opacity="${recipe.extrusionOpacity}"/>
  </g>
  <g id="layer-fill" data-layer="fill">
    <rect x="${inset}" y="${surfaceY}" width="${mainWidth}" height="${surfaceHeight}" rx="${mainRadius}" fill="url(#button-fill-gradient)"/>
  </g>
  <g id="layer-border" data-layer="border">
    <rect x="${inset + 1}" y="${recipe.mainY + inset + 1}" width="${mainWidth - 2}" height="${mainHeight - inset * 2 - 2}" rx="${mainRadius - 1}" fill="none" stroke="#D9E8FF" stroke-width="2"/>
  </g>
  <g id="layer-highlight" data-layer="highlight">
    <path d="M ${radius} ${recipe.mainY + inset + 1} H ${logicalWidth - radius} A ${mainRadius - 1} ${mainRadius - 1} 0 0 1 ${logicalWidth - inset - 1} ${radius} V ${radius + 2} H ${inset + 1} V ${radius} A ${mainRadius - 1} ${mainRadius - 1} 0 0 1 ${radius} ${recipe.mainY + inset + 1} Z" fill="url(#button-highlight-gradient)"/>
  </g>
  <g id="layer-content-slot" data-layer="content" data-slot="editable-label" transform="translate(0 ${state === "pressed" ? 2 : 0})"/>
</svg>`;
}

function svgShell(logicalWidth: ProgressWidthLogical, label: string, content: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${logicalWidth * 2}" height="${PROGRESS_HEIGHT_LOGICAL * 2}" viewBox="0 0 ${logicalWidth} ${PROGRESS_HEIGHT_LOGICAL}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="progress-track-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#183A70"/>
      <stop offset="100%" stop-color="#0A2044"/>
    </linearGradient>
    <linearGradient id="progress-fill-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#72A5FF"/>
      <stop offset="100%" stop-color="#326BDA"/>
    </linearGradient>
    <linearGradient id="progress-highlight-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.48"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="progress-inner-clip">
      <rect x="5" y="5" width="${logicalWidth - 10}" height="12" rx="6"/>
    </clipPath>
  </defs>
${content}
</svg>`;
}

function frameLayers(logicalWidth: ProgressWidthLogical): string {
  return `    <g id="layer-frame-shadow" data-layer="shadow" data-effect="connected-extrusion" data-depth="${FRAME_EXTRUSION_DEPTH_LOGICAL}">
      <rect data-role="extrusion-body" x="1" y="1" width="${logicalWidth - 2}" height="${20 + FRAME_EXTRUSION_DEPTH_LOGICAL}" rx="10" fill="#07162E" fill-opacity="0.82"/>
    </g>
    <g id="layer-frame-fill" data-layer="fill">
      <rect x="1" y="1" width="${logicalWidth - 2}" height="20" rx="10" fill="url(#progress-track-gradient)"/>
    </g>
    <g id="layer-frame-border" data-layer="border">
      <rect x="2" y="2" width="${logicalWidth - 4}" height="18" rx="9" fill="none" stroke="#D9E8FF" stroke-width="2"/>
    </g>`;
}

export function getProgressFillGeometry({ logicalWidth, percent }: ProgressBarRequest): ProgressFillGeometry {
  assertIntegerInRange("Primary Progress Bar width", logicalWidth, PROGRESS_WIDTH_BOUNDS.min, PROGRESS_WIDTH_BOUNDS.max);
  assertIntegerInRange("Primary Progress Bar percent", percent, 0, 100);
  const width = ((logicalWidth - 10) * percent) / 100;
  return { x: 5, y: 5, width, height: 12, radius: Math.min(6, width / 2) };
}

function fillLayers(request: ProgressBarRequest): string {
  const geometry = getProgressFillGeometry(request);
  const highlightRadius = Math.min(3, geometry.width / 2);
  return `    <defs>
      <clipPath id="progress-fill-shape-clip">
        <rect x="${geometry.x}" y="${geometry.y}" width="${geometry.width}" height="${geometry.height}" rx="${geometry.radius}"/>
      </clipPath>
    </defs>
    <g id="layer-progress-fill" data-layer="fill" data-percent="${request.percent}" clip-path="url(#progress-inner-clip)">
      <rect x="${geometry.x}" y="${geometry.y}" width="${geometry.width}" height="${geometry.height}" rx="${geometry.radius}" fill="url(#progress-fill-gradient)"/>
    </g>
    <g id="layer-progress-highlight" data-layer="highlight" clip-path="url(#progress-fill-shape-clip)">
      <rect x="${geometry.x}" y="${geometry.y}" width="${geometry.width}" height="6" rx="${highlightRadius}" fill="url(#progress-highlight-gradient)"/>
    </g>`;
}

export function renderProgressFrameSvg(logicalWidth: ProgressWidthLogical): string {
  assertIntegerInRange("Primary Progress Bar width", logicalWidth, PROGRESS_WIDTH_BOUNDS.min, PROGRESS_WIDTH_BOUNDS.max);
  return svgShell(logicalWidth, `Neon Core progress frame ${logicalWidth} by ${PROGRESS_HEIGHT_LOGICAL}`, `  <g id="part-frame" data-part="frame">\n${frameLayers(logicalWidth)}\n  </g>`);
}

export function renderProgressFillSvg(request: ProgressBarRequest): string {
  return svgShell(request.logicalWidth, `Neon Core progress fill ${request.percent} percent`, `  <g id="part-fill" data-part="fill">\n${fillLayers(request)}\n  </g>`);
}

export function renderPrimaryProgressBarSvg(request: ProgressBarRequest): string {
  return svgShell(request.logicalWidth, `Neon Core progress bar ${request.percent} percent`, `  <g id="part-frame" data-part="frame">\n${frameLayers(request.logicalWidth)}\n  </g>\n  <g id="part-fill" data-part="fill">\n${fillLayers(request)}\n  </g>`);
}
