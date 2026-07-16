import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { RENDERER_VERSION } from "./version.js";

export { RENDERER_VERSION } from "./version.js";
export const BUTTON_HEIGHT_LOGICAL = 56;
export const BUTTON_WIDTHS_LOGICAL = [160, 240] as const;
export const BUTTON_STATES = ["normal", "pressed", "disabled"] as const;

export type ButtonWidthLogical = (typeof BUTTON_WIDTHS_LOGICAL)[number];
export type ButtonState = (typeof BUTTON_STATES)[number];

export interface PrimaryButtonRequest {
  logicalWidth: ButtonWidthLogical;
  state: ButtonState;
}

export interface RenderedPrimaryButton {
  request: PrimaryButtonRequest;
  svg: string;
  png: Uint8Array;
}

interface ExportOutput {
  path: string;
  format: "png" | "svg";
  width: number;
  height: number;
  sha256: string;
  state: ButtonState;
  unity: {
    pixelsPerUnit: number;
    pivot: { x: number; y: number };
    border: { left: number; right: number; top: number; bottom: number };
    atlasGroup: string;
  };
}

interface ExportManifest {
  schemaVersion: "1.0";
  assetId: string;
  generatedAt: string;
  renderer: { name: string; version: string };
  sources: {
    style: { id: string; version: string };
    component: { id: string; version: string };
    materialPacks: Array<{ id: string; version: string }>;
  };
  outputs: ExportOutput[];
}

function sha256(content: Uint8Array | string): string {
  return createHash("sha256").update(content).digest("hex");
}

function stateRecipe(state: ButtonState) {
  switch (state) {
    case "pressed":
      return { fillTop: "#3972E5", fillBottom: "#2859B8", shadowOpacity: 0.38, mainY: 2, shadowY: 4, highlightOpacity: 0.16 };
    case "disabled":
      return { fillTop: "#6E86AE", fillBottom: "#526986", shadowOpacity: 0.24, mainY: 0, shadowY: 4, highlightOpacity: 0 };
    default:
      return { fillTop: "#5B91FF", fillBottom: "#326BDA", shadowOpacity: 0.58, mainY: 0, shadowY: 4, highlightOpacity: 0.42 };
  }
}

/**
 * Builds the canonical V1 SVG source. Each visual effect has a stable group ID
 * so a visual review can isolate the layer without parsing baked pixels.
 */
export function renderPrimaryButtonSvg(request: PrimaryButtonRequest): string {
  const { logicalWidth, state } = request;
  const recipe = stateRecipe(state);
  const radius = 24;
  const mainHeight = 52;
  const inset = 1;
  const mainWidth = logicalWidth - inset * 2;
  const mainRadius = radius - inset;

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
  </defs>
  <g id="layer-shadow" data-layer="shadow">
    <rect x="${inset}" y="${recipe.shadowY}" width="${mainWidth}" height="${mainHeight}" rx="${mainRadius}" fill="#102040" fill-opacity="${recipe.shadowOpacity}"/>
  </g>
  <g id="layer-fill" data-layer="fill">
    <rect x="${inset}" y="${recipe.mainY + inset}" width="${mainWidth}" height="${mainHeight - inset * 2}" rx="${mainRadius}" fill="url(#button-fill-gradient)"/>
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

export function renderPrimaryButton(request: PrimaryButtonRequest): RenderedPrimaryButton {
  const svg = renderPrimaryButtonSvg(request);
  const png = new Resvg(svg, { background: "transparent" }).render().asPng();
  return { request, svg, png };
}

function manifestFor(rendered: RenderedPrimaryButton, outputDirectory: string, rootDirectory: string): ExportManifest {
  const { logicalWidth, state } = rendered.request;
  const pngPath = join(outputDirectory, "primary-button.png");
  const svgPath = join(outputDirectory, "primary-button.svg");
  const outputWidth = logicalWidth * 2;
  const outputHeight = BUTTON_HEIGHT_LOGICAL * 2;
  const unity = { pixelsPerUnit: 100, pivot: { x: 0.5, y: 0.5 }, border: { left: 48, right: 48, top: 48, bottom: 48 }, atlasGroup: "ui-neon-core" };
  const output = (path: string, format: "png" | "svg", content: Uint8Array | string): ExportOutput => ({
    path: relative(rootDirectory, path).replaceAll("\\", "/"),
    format,
    width: outputWidth,
    height: outputHeight,
    sha256: sha256(content),
    state,
    unity
  });

  return {
    schemaVersion: "1.0",
    assetId: `neon-core-primary-button-${state}-${logicalWidth}`,
    generatedAt: new Date().toISOString(),
    renderer: { name: "lnh-prism-renderer", version: RENDERER_VERSION },
    sources: {
      style: { id: "neon-core", version: "0.1.0" },
      component: { id: "primary-button", version: "0.1.0" },
      materialPacks: [{ id: "neon-core-materials", version: "0.1.0" }]
    },
    outputs: [output(svgPath, "svg", rendered.svg), output(pngPath, "png", rendered.png)]
  };
}

export async function writePrimaryButtonProof(outputRoot: string): Promise<ExportManifest[]> {
  const manifests: ExportManifest[] = [];

  for (const logicalWidth of BUTTON_WIDTHS_LOGICAL) {
    for (const state of BUTTON_STATES) {
      const rendered = renderPrimaryButton({ logicalWidth, state });
      const outputDirectory = join(outputRoot, "primary-button", state, String(logicalWidth));
      await mkdir(outputDirectory, { recursive: true });
      await writeFile(join(outputDirectory, "primary-button.svg"), rendered.svg, "utf8");
      await writeFile(join(outputDirectory, "primary-button.png"), rendered.png);
      const manifest = manifestFor(rendered, outputDirectory, outputRoot);
      await writeFile(join(outputDirectory, "primary-button.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
      manifests.push(manifest);
    }
  }

  return manifests;
}
