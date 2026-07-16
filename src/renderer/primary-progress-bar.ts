import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { loadV1ManifestProvenance, type V1ManifestProvenance, type V1ManifestSources } from "./provenance.js";
import { RENDERER_VERSION } from "./version.js";

export const PROGRESS_HEIGHT_LOGICAL = 24;
export const PROGRESS_WIDTHS_LOGICAL = [320, 432] as const;
export const PROGRESS_PERCENTAGES = [10, 50, 90] as const;

export type ProgressWidthLogical = (typeof PROGRESS_WIDTHS_LOGICAL)[number];
export type ProgressPercentage = (typeof PROGRESS_PERCENTAGES)[number];

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

interface ProgressExportOutput {
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

interface ProgressExportManifest {
  schemaVersion: "1.0";
  assetId: string;
  generatedAt: string;
  renderer: { name: string; version: string };
  sources: V1ManifestSources;
  provenance: V1ManifestProvenance;
  outputs: ProgressExportOutput[];
}

function sha256(content: Uint8Array | string): string {
  return createHash("sha256").update(content).digest("hex");
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
  return `    <g id="layer-frame-shadow" data-layer="shadow">
      <rect x="1" y="4" width="${logicalWidth - 2}" height="19" rx="9.5" fill="#07162E" fill-opacity="0.72"/>
    </g>
    <g id="layer-frame-fill" data-layer="fill">
      <rect x="1" y="1" width="${logicalWidth - 2}" height="20" rx="10" fill="url(#progress-track-gradient)"/>
    </g>
    <g id="layer-frame-border" data-layer="border">
      <rect x="2" y="2" width="${logicalWidth - 4}" height="18" rx="9" fill="none" stroke="#D9E8FF" stroke-width="2"/>
    </g>`;
}

export function getProgressFillGeometry({ logicalWidth, percent }: ProgressBarRequest): ProgressFillGeometry {
  return { x: 5, y: 5, width: ((logicalWidth - 10) * percent) / 100, height: 12, radius: 6 };
}

function fillLayers(request: ProgressBarRequest): string {
  const geometry = getProgressFillGeometry(request);
  return `    <defs>
      <clipPath id="progress-fill-shape-clip">
        <rect x="${geometry.x}" y="${geometry.y}" width="${geometry.width}" height="${geometry.height}" rx="${geometry.radius}"/>
      </clipPath>
    </defs>
    <g id="layer-progress-fill" data-layer="fill" data-percent="${request.percent}" clip-path="url(#progress-inner-clip)">
      <rect x="${geometry.x}" y="${geometry.y}" width="${geometry.width}" height="${geometry.height}" rx="${geometry.radius}" fill="url(#progress-fill-gradient)"/>
    </g>
    <g id="layer-progress-highlight" data-layer="highlight" clip-path="url(#progress-fill-shape-clip)">
      <rect x="${geometry.x}" y="${geometry.y}" width="${geometry.width}" height="6" rx="3" fill="url(#progress-highlight-gradient)"/>
    </g>`;
}

export function renderProgressFrameSvg(logicalWidth: ProgressWidthLogical): string {
  return svgShell(logicalWidth, `Neon Core progress frame ${logicalWidth} by ${PROGRESS_HEIGHT_LOGICAL}`, `  <g id="part-frame" data-part="frame">\n${frameLayers(logicalWidth)}\n  </g>`);
}

export function renderProgressFillSvg(request: ProgressBarRequest): string {
  return svgShell(request.logicalWidth, `Neon Core progress fill ${request.percent} percent`, `  <g id="part-fill" data-part="fill">\n${fillLayers(request)}\n  </g>`);
}

export function renderPrimaryProgressBarSvg(request: ProgressBarRequest): string {
  return svgShell(request.logicalWidth, `Neon Core progress bar ${request.percent} percent`, `  <g id="part-frame" data-part="frame">\n${frameLayers(request.logicalWidth)}\n  </g>\n  <g id="part-fill" data-part="fill">\n${fillLayers(request)}\n  </g>`);
}

function renderPng(svg: string): Uint8Array {
  return new Resvg(svg, { background: "transparent" }).render().asPng();
}

function manifestFor(logicalWidth: ProgressWidthLogical, rootDirectory: string, outputs: ProgressExportOutput[], traceability: { sources: V1ManifestSources; provenance: V1ManifestProvenance }): ProgressExportManifest {
  return {
    schemaVersion: "1.0",
    assetId: `neon-core-primary-progress-bar-${logicalWidth}`,
    generatedAt: new Date().toISOString(),
    renderer: { name: "lnh-prism-renderer", version: RENDERER_VERSION },
    sources: traceability.sources,
    provenance: traceability.provenance,
    outputs: outputs.map((output) => ({ ...output, path: relative(rootDirectory, output.path).replaceAll("\\", "/") }))
  };
}

export async function writePrimaryProgressBarProof(outputRoot: string): Promise<ProgressExportManifest[]> {
  const manifests: ProgressExportManifest[] = [];
  const traceability = await loadV1ManifestProvenance("primary-progress-bar");
  const unity = {
    pixelsPerUnit: 100,
    pivot: { x: 0.5, y: 0.5 },
    border: { left: 24, right: 24, top: 12, bottom: 12 },
    atlasGroup: "ui-neon-core"
  };

  for (const logicalWidth of PROGRESS_WIDTHS_LOGICAL) {
    const outputDirectory = join(outputRoot, "primary-progress-bar", String(logicalWidth));
    await mkdir(outputDirectory, { recursive: true });
    const outputs: ProgressExportOutput[] = [];
    const writeOutputPair = async (baseName: string, svg: string) => {
      const svgPath = join(outputDirectory, `${baseName}.svg`);
      const pngPath = join(outputDirectory, `${baseName}.png`);
      const png = renderPng(svg);
      await writeFile(svgPath, svg, "utf8");
      await writeFile(pngPath, png);
      const base = { width: logicalWidth * 2, height: PROGRESS_HEIGHT_LOGICAL * 2, state: "normal" as const, unity };
      outputs.push({ ...base, path: svgPath, format: "svg", sha256: sha256(svg) });
      outputs.push({ ...base, path: pngPath, format: "png", sha256: sha256(png) });
    };

    await writeOutputPair("primary-progress-bar-frame", renderProgressFrameSvg(logicalWidth));
    for (const percent of PROGRESS_PERCENTAGES) {
      const request = { logicalWidth, percent };
      await writeOutputPair(`primary-progress-bar-fill-${percent}`, renderProgressFillSvg(request));
      await writeOutputPair(`primary-progress-bar-preview-${percent}`, renderPrimaryProgressBarSvg(request));
    }

    const manifest = manifestFor(logicalWidth, outputRoot, outputs, traceability);
    await writeFile(join(outputDirectory, "primary-progress-bar.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    manifests.push(manifest);
  }
  return manifests;
}

export function renderPrimaryProgressBarPng(request: ProgressBarRequest): Uint8Array {
  return renderPng(renderPrimaryProgressBarSvg(request));
}
