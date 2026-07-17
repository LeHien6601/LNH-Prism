import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { renderFrostboundComponentSvg, renderFrostboundProgressFillSvg, renderFrostboundProgressFrameSvg } from "../dist/renderer/frostbound-components.js";
import { renderFrostboundScenarioSvg } from "../dist/renderer/frostbound-scenario.js";

const output = resolve("docs/validation/evidence/m3-s4-frostbound-reconstruction");
const matrixDir = resolve(output, "matrix");
await mkdir(matrixDir, { recursive: true });
const requests = [
  { component:"panel", width:432, height:300 }, { component:"panel", width:432, height:420 },
  ...[240,288].flatMap((width) => ["normal","pressed","disabled"].map((state) => ({ component:"primary-button", width, height:64, state, label:"CLAIM" }))),
  ...[160,200].flatMap((width) => ["normal","pressed","disabled"].map((state) => ({ component:"secondary-button", width, height:52, state, label:"LATER" }))),
  ...[320,432].flatMap((width) => [10,50,75,90].map((percent) => ({ component:"progress", width, height:28, percent }))),
  ...[104,144].flatMap((width) => ["normal","selected"].map((state) => ({ component:"emblem", width, height:width, state })))
];
const entries = [];
for (const request of requests) {
  const suffix = request.percent ?? request.state ?? "normal";
  const name = `${request.component}-${request.width}x${request.height}-${suffix}`;
  const svg = `${renderFrostboundComponentSvg({ ...request, instanceId:name })}\n`;
  const png = new Resvg(svg).render().asPng();
  await writeFile(resolve(matrixDir, `${name}.svg`), svg);
  await writeFile(resolve(matrixDir, `${name}.png`), png);
  entries.push({ name, ...request, svgSha256:createHash("sha256").update(svg).digest("hex"), pngSha256:createHash("sha256").update(png).digest("hex") });
}
for (const width of [320,432]) {
  await writeFile(resolve(matrixDir, `progress-frame-${width}.svg`), `${renderFrostboundProgressFrameSvg(width)}\n`);
  for (const percent of [10,50,75,90]) await writeFile(resolve(matrixDir, `progress-fill-${width}-${percent}.svg`), `${renderFrostboundProgressFillSvg(width, percent)}\n`);
}
const scenario = `${renderFrostboundScenarioSvg()}\n`;
await writeFile(resolve(output, "frostbound-reconstruction.svg"), scenario);
await writeFile(resolve(output, "frostbound-reconstruction.png"), new Resvg(scenario).render().asPng());
await writeFile(resolve(output, "matrix.json"), `${JSON.stringify({ schemaVersion:"1.0", count:entries.length, entries }, null, 2)}\n`);
const comparison = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Frostbound concept/reconstruction comparison</title><style>body{font:16px system-ui;background:#07111f;color:#e8f8ff;margin:0;padding:24px}main{display:grid;grid-template-columns:minmax(280px,1fr) minmax(280px,1fr);gap:24px;max-width:1200px;margin:auto}.card{background:#10243a;border:1px solid #4b91bd;border-radius:16px;padding:16px}img{width:100%;max-height:78vh;object-fit:contain;background:#020711}.note{border-left:4px solid #2F9FEF;padding-left:12px}code{font-size:12px}@media(max-width:760px){main{grid-template-columns:1fr}}</style></head><body><main><section class="card"><h1>Concept reference</h1><img src="../../../reference-briefs/assets/v3-frostbound-reward-concept.png" alt="Frostbound concept reference used only for visual comparison"><p class="note">Reference evidence only. No pixels, masks, borders, shadows, or textures are copied into production sources.</p><ul><li>Ice-blue primary action and progress</li><li>Primary action dominates by width and value</li><li>Frost detail repeats without defining silhouettes</li></ul></section><section class="card"><h1>Deterministic reconstruction</h1><img src="frostbound-reconstruction.png" alt="Deterministic Frostbound reconstruction"><p class="note">Built from <code>frostbound-reward@0.1.0</code>, five approved component specs, and <code>frost-crystal-materials@0.1.0</code>.</p><ul><li>Primary/secondary width ratio: 1.44</li><li>Action gap: 24 logical pixels</li><li>Selected emblem changes silhouette, border, and value</li><li>Progress frame/fill remain independent</li></ul></section></main></body></html>`;
await writeFile(resolve(output, "comparison.html"), comparison);
await writeFile(resolve(output, "evidence-index.json"), `${JSON.stringify({ schemaVersion:"1.0", id:"m3-s4-frostbound-reconstruction", status:"ready-for-review", matrixCount:entries.length, artifacts:["matrix.json","frostbound-reconstruction.svg","frostbound-reconstruction.png","comparison.html"], productionBoundary:"Component and scenario SVG/PNG contain no concept reference, path, hash, or pixels; comparison.html alone links the concept as review evidence." }, null, 2)}\n`);
console.log(`Prepared M3-S4 Frostbound reconstruction evidence in ${output}.`);
