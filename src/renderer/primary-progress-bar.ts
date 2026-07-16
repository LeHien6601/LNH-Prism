import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { loadV1ManifestProvenance, type V1ManifestProvenance, type V1ManifestSources } from "./provenance.js";
import {
  PROGRESS_HEIGHT_LOGICAL,
  PROGRESS_PERCENTAGES,
  PROGRESS_WIDTHS_LOGICAL,
  renderPrimaryProgressBarSvg,
  renderProgressFillSvg,
  renderProgressFrameSvg,
  type ProgressBarRequest,
  type ProgressWidthLogical
} from "./svg-recipes.js";
import { RENDERER_VERSION } from "./version.js";

export {
  FRAME_EXTRUSION_DEPTH_LOGICAL,
  PROGRESS_HEIGHT_LOGICAL,
  PROGRESS_PERCENTAGES,
  PROGRESS_REVIEW_PERCENTAGES,
  PROGRESS_WIDTH_BOUNDS,
  PROGRESS_WIDTHS_LOGICAL,
  getProgressFillGeometry,
  renderPrimaryProgressBarSvg,
  renderProgressFillSvg,
  renderProgressFrameSvg
} from "./svg-recipes.js";
export type { ProgressBarRequest, ProgressFillGeometry, ProgressPercentage, ProgressWidthLogical } from "./svg-recipes.js";

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
