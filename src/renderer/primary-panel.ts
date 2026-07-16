import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { loadV1ManifestProvenance, type V1ManifestProvenance, type V1ManifestSources } from "./provenance.js";
import { RENDERER_VERSION } from "./version.js";

export const PANEL_WIDTH_LOGICAL = 432;
export const PANEL_HEIGHTS_LOGICAL = [240, 360] as const;
export const PANEL_EXTRUSION_DEPTH_LOGICAL = 7;

export type PanelHeightLogical = (typeof PANEL_HEIGHTS_LOGICAL)[number];

export interface PrimaryPanelRequest {
  logicalHeight: PanelHeightLogical;
}

export interface RenderedPrimaryPanel {
  request: PrimaryPanelRequest;
  svg: string;
  png: Uint8Array;
}

interface PanelExportOutput {
  path: string;
  format: "png" | "svg";
  width: number;
  height: number;
  sha256: string;
  state: "normal";
  unity: {
    pixelsPerUnit: number;
    pivot: { x: number; y: number };
    border: { left: number; right: number; top: number; bottom: number };
    atlasGroup: string;
  };
}

interface PanelExportManifest {
  schemaVersion: "1.0";
  assetId: string;
  generatedAt: string;
  renderer: { name: string; version: string };
  sources: V1ManifestSources;
  provenance: V1ManifestProvenance;
  outputs: PanelExportOutput[];
}

function sha256(content: Uint8Array | string): string {
  return createHash("sha256").update(content).digest("hex");
}

/** Builds the canonical V1 Panel SVG with independently inspectable layers. */
export function renderPrimaryPanelSvg({ logicalHeight }: PrimaryPanelRequest): string {
  const radius = 24;
  const bodyHeight = logicalHeight - 8;
  const contentHeight = logicalHeight - 56;
  const extrusionHeight = bodyHeight + PANEL_EXTRUSION_DEPTH_LOGICAL;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${PANEL_WIDTH_LOGICAL * 2}" height="${logicalHeight * 2}" viewBox="0 0 ${PANEL_WIDTH_LOGICAL} ${logicalHeight}" role="img" aria-label="Neon Core primary panel ${PANEL_WIDTH_LOGICAL} by ${logicalHeight}">
  <defs>
    <linearGradient id="panel-fill-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#244F96"/>
      <stop offset="42%" stop-color="#173A73"/>
      <stop offset="100%" stop-color="#102B59"/>
    </linearGradient>
    <linearGradient id="panel-highlight-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <pattern id="panel-grain-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="3" r="0.7" fill="#D9E8FF" fill-opacity="0.12"/>
      <circle cx="9" cy="7" r="0.55" fill="#07172F" fill-opacity="0.18"/>
      <circle cx="5" cy="11" r="0.4" fill="#7FAAFF" fill-opacity="0.1"/>
    </pattern>
    <clipPath id="panel-surface-clip">
      <rect x="1" y="1" width="430" height="${bodyHeight}" rx="${radius - 1}"/>
    </clipPath>
  </defs>
  <g id="layer-shadow" data-layer="shadow" data-effect="connected-extrusion" data-depth="${PANEL_EXTRUSION_DEPTH_LOGICAL}">
    <rect data-role="extrusion-body" x="1" y="1" width="430" height="${extrusionHeight}" rx="${radius - 1}" fill="#07162E" fill-opacity="0.76"/>
  </g>
  <g id="layer-fill" data-layer="fill">
    <rect x="1" y="1" width="430" height="${bodyHeight}" rx="${radius - 1}" fill="url(#panel-fill-gradient)"/>
  </g>
  <g id="layer-grain" data-layer="texture" clip-path="url(#panel-surface-clip)">
    <rect x="1" y="1" width="430" height="${bodyHeight}" fill="url(#panel-grain-pattern)"/>
  </g>
  <g id="layer-border" data-layer="border">
    <rect x="2" y="2" width="428" height="${bodyHeight - 2}" rx="${radius - 2}" fill="none" stroke="#D9E8FF" stroke-width="2"/>
  </g>
  <g id="layer-highlight" data-layer="highlight">
    <rect x="3" y="3" width="426" height="44" rx="21" fill="url(#panel-highlight-gradient)" clip-path="url(#panel-surface-clip)"/>
  </g>
  <g id="layer-content-slot" data-layer="content" data-slot="editable-content" data-x="24" data-y="24" data-width="384" data-height="${contentHeight}"/>
</svg>`;
}

export function renderPrimaryPanel(request: PrimaryPanelRequest): RenderedPrimaryPanel {
  const svg = renderPrimaryPanelSvg(request);
  const png = new Resvg(svg, { background: "transparent" }).render().asPng();
  return { request, svg, png };
}

function manifestFor(rendered: RenderedPrimaryPanel, outputDirectory: string, rootDirectory: string, traceability: { sources: V1ManifestSources; provenance: V1ManifestProvenance }): PanelExportManifest {
  const { logicalHeight } = rendered.request;
  const pngPath = join(outputDirectory, "primary-panel.png");
  const svgPath = join(outputDirectory, "primary-panel.svg");
  const outputWidth = PANEL_WIDTH_LOGICAL * 2;
  const outputHeight = logicalHeight * 2;
  const unity = {
    pixelsPerUnit: 100,
    pivot: { x: 0.5, y: 0.5 },
    border: { left: 48, right: 48, top: 48, bottom: 48 },
    atlasGroup: "ui-neon-core"
  };
  const output = (path: string, format: "png" | "svg", content: Uint8Array | string): PanelExportOutput => ({
    path: relative(rootDirectory, path).replaceAll("\\", "/"),
    format,
    width: outputWidth,
    height: outputHeight,
    sha256: sha256(content),
    state: "normal",
    unity
  });

  return {
    schemaVersion: "1.0",
    assetId: `neon-core-primary-panel-${logicalHeight}`,
    generatedAt: new Date().toISOString(),
    renderer: { name: "lnh-prism-renderer", version: RENDERER_VERSION },
    sources: traceability.sources,
    provenance: traceability.provenance,
    outputs: [output(svgPath, "svg", rendered.svg), output(pngPath, "png", rendered.png)]
  };
}

export async function writePrimaryPanelProof(outputRoot: string): Promise<PanelExportManifest[]> {
  const manifests: PanelExportManifest[] = [];
  const traceability = await loadV1ManifestProvenance("primary-panel");
  for (const logicalHeight of PANEL_HEIGHTS_LOGICAL) {
    const rendered = renderPrimaryPanel({ logicalHeight });
    const outputDirectory = join(outputRoot, "primary-panel", String(logicalHeight));
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(join(outputDirectory, "primary-panel.svg"), rendered.svg, "utf8");
    await writeFile(join(outputDirectory, "primary-panel.png"), rendered.png);
    const manifest = manifestFor(rendered, outputDirectory, outputRoot, traceability);
    await writeFile(join(outputDirectory, "primary-panel.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    manifests.push(manifest);
  }
  return manifests;
}
