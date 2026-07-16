import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { loadV1ManifestProvenance, type V1ManifestProvenance, type V1ManifestSources } from "./provenance.js";
import {
  BUTTON_HEIGHT_LOGICAL,
  BUTTON_STATES,
  BUTTON_WIDTHS_LOGICAL,
  renderPrimaryButtonSvg,
  type ButtonState,
  type PrimaryButtonRequest
} from "./svg-recipes.js";
import { RENDERER_VERSION } from "./version.js";

export { RENDERER_VERSION } from "./version.js";
export { BUTTON_HEIGHT_LOGICAL, BUTTON_STATES, BUTTON_WIDTH_BOUNDS, BUTTON_WIDTHS_LOGICAL, renderPrimaryButtonSvg } from "./svg-recipes.js";
export type { ButtonState, ButtonWidthLogical, PrimaryButtonRequest } from "./svg-recipes.js";

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
  sources: V1ManifestSources;
  provenance: V1ManifestProvenance;
  outputs: ExportOutput[];
}

function sha256(content: Uint8Array | string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function renderPrimaryButton(request: PrimaryButtonRequest): RenderedPrimaryButton {
  const svg = renderPrimaryButtonSvg(request);
  const png = new Resvg(svg, { background: "transparent" }).render().asPng();
  return { request, svg, png };
}

function manifestFor(rendered: RenderedPrimaryButton, outputDirectory: string, rootDirectory: string, traceability: { sources: V1ManifestSources; provenance: V1ManifestProvenance }): ExportManifest {
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
    sources: traceability.sources,
    provenance: traceability.provenance,
    outputs: [output(svgPath, "svg", rendered.svg), output(pngPath, "png", rendered.png)]
  };
}

export async function writePrimaryButtonProof(outputRoot: string): Promise<ExportManifest[]> {
  const manifests: ExportManifest[] = [];
  const traceability = await loadV1ManifestProvenance("primary-button");

  for (const logicalWidth of BUTTON_WIDTHS_LOGICAL) {
    for (const state of BUTTON_STATES) {
      const rendered = renderPrimaryButton({ logicalWidth, state });
      const outputDirectory = join(outputRoot, "primary-button", state, String(logicalWidth));
      await mkdir(outputDirectory, { recursive: true });
      await writeFile(join(outputDirectory, "primary-button.svg"), rendered.svg, "utf8");
      await writeFile(join(outputDirectory, "primary-button.png"), rendered.png);
      const manifest = manifestFor(rendered, outputDirectory, outputRoot, traceability);
      await writeFile(join(outputDirectory, "primary-button.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
      manifests.push(manifest);
    }
  }

  return manifests;
}
