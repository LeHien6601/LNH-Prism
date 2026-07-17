import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderFrostboundComponentSvg, renderFrostboundProgressFillSvg, renderFrostboundProgressFrameSvg } from "../dist/renderer/frostbound-components.js";
import { renderFrostboundScenarioSvg } from "../dist/renderer/frostbound-scenario.js";

const output = resolve("docs/validation/evidence/m3-s4-frostbound-reconstruction");
const matrix = JSON.parse(await readFile(resolve(output,"matrix.json"),"utf8"));
const index = JSON.parse(await readFile(resolve(output,"evidence-index.json"),"utf8"));
if (matrix.count !== 26 || matrix.entries.length !== 26) throw new Error("M3-S4 matrix must contain all 26 bounded variants.");
for (const entry of matrix.entries) {
  const svg = `${renderFrostboundComponentSvg({ component:entry.component, width:entry.width, height:entry.height, state:entry.state, percent:entry.percent, label:entry.label, instanceId:entry.name })}\n`;
  const actual = await readFile(resolve(output,"matrix",`${entry.name}.svg`),"utf8");
  if (actual !== svg || createHash("sha256").update(actual).digest("hex") !== entry.svgSha256) throw new Error(`${entry.name} SVG drifted.`);
  const png = await readFile(resolve(output,"matrix",`${entry.name}.png`));
  if (createHash("sha256").update(png).digest("hex") !== entry.pngSha256) throw new Error(`${entry.name} PNG drifted.`);
}
for (const width of [320,432]) {
  if (await readFile(resolve(output,"matrix",`progress-frame-${width}.svg`),"utf8") !== `${renderFrostboundProgressFrameSvg(width)}\n`) throw new Error(`Progress frame ${width} drifted.`);
  for (const percent of [10,50,75,90]) if (await readFile(resolve(output,"matrix",`progress-fill-${width}-${percent}.svg`),"utf8") !== `${renderFrostboundProgressFillSvg(width,percent)}\n`) throw new Error(`Progress fill ${width}/${percent} drifted.`);
}
const scenario = await readFile(resolve(output,"frostbound-reconstruction.svg"),"utf8");
if (scenario !== `${renderFrostboundScenarioSvg()}\n`) throw new Error("Frostbound portrait reconstruction drifted.");
for (const prohibited of ["19d55d8ed0d1a2b8949bcd135ecd95ad2d0b5920846a843b652949eb02712383","v3-frostbound-reward-concept","<image"]) if (scenario.includes(prohibited)) throw new Error(`Production reconstruction contains prohibited concept reference: ${prohibited}.`);
const comparison = await readFile(resolve(output,"comparison.html"),"utf8");
for (const required of ["Reference evidence only","Primary/secondary width ratio: 1.44","Action gap: 24 logical pixels","Progress frame/fill remain independent"]) if (!comparison.includes(required)) throw new Error(`Comparison is missing ${required}.`);
if (index.status !== "ready-for-review" || matrix.entries.filter(({component})=>component==="emblem").length !== 4) throw new Error("M3-S4 evidence index or selected-state matrix is incomplete.");
console.log("validated M3-S4 26-variant matrix, independent progress parts, portrait reconstruction, comparison annotations, and no-concept production boundary");
