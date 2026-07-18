import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { renderM7AngularComponentSvg, renderM7AngularProgressFillSvg, renderM7AngularProgressFrameSvg, renderM7AngularProgressSvg } from "../dist/renderer/m7-angular-components.js";

const evidence = resolve("docs/validation/evidence/m7-a5-reference-fidelity");
const matrixDir = resolve(evidence, "matrix");
const packageDir = resolve("assets/m7-reference-fidelity");
const modulesDir = resolve(packageDir, "modules");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const writeRender = async (directory, name, svg) => {
  const normalized = `${svg}\n`;
  const png = new Resvg(normalized).render().asPng();
  await writeFile(resolve(directory, `${name}.svg`), normalized);
  await writeFile(resolve(directory, `${name}.png`), png);
  return { name, svgSha256: hash(normalized), pngSha256: hash(png) };
};
const requests = [
  ...[[488, 660], [488, 760]].map(([width, height]) => ({ component: "panel", width, height })),
  ...[320, 260].flatMap((width, index) => ["normal", "pressed", "disabled"].map((state) => ({ component: "primary-hex-button", width, height: index ? 62 : 68, state }))),
  ...[232, 188].flatMap((width, index) => ["normal", "pressed", "disabled"].map((state) => ({ component: "secondary-hex-button", width, height: index ? 52 : 56, state }))),
  ...[[148, "normal"], [184, "selected"]].map(([width, state]) => ({ component: "tab", width, height: 52, state })),
  ...[[164, "normal"], [212, "highlighted"]].map(([width, state]) => ({ component: "badge", width, height: 48, state })),
  ...[[92, "normal"], [116, "selected"]].map(([width, state]) => ({ component: "icon-container", width, height: width, state })),
  ...[344, 420].flatMap((width) => [10, 50, 90].map((percent) => ({ component: "progress", width, height: 28, percent })))
];
await mkdir(matrixDir, { recursive: true });
const entries = [];
for (const request of requests) {
  const suffix = request.percent ?? request.state ?? "normal";
  const name = `${request.component}-${request.width}x${request.height}-${suffix}`;
  const render = request.component === "progress" ? renderM7AngularProgressSvg : renderM7AngularComponentSvg;
  entries.push({ ...request, ...(await writeRender(matrixDir, name, render({ ...request, instanceId: `m7-${name}` }))) });
}
for (const width of [344, 420]) {
  await writeRender(matrixDir, `progress-frame-${width}`, renderM7AngularProgressFrameSvg({ component: "progress", width, height: 28, instanceId: `m7-progress-frame-${width}` }));
  for (const percent of [10, 50, 90]) await writeRender(matrixDir, `progress-fill-${width}-${percent}`, renderM7AngularProgressFillSvg({ component: "progress", width, height: 28, percent, instanceId: `m7-progress-fill-${width}-${percent}` }));
}
const inner = (svg) => svg.replace(/^.*?<svg[^>]*>/s, "").replace(/<\/svg>\s*$/s, "");
const placed = (request, x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${inner((request.component === "progress" ? renderM7AngularProgressSvg : renderM7AngularComponentSvg)({ ...request, instanceId: `m7-composition-${request.component}-${x}-${y}` }))}</g>`;
const portrait = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 540 960" role="img" aria-label="M7 angular reward composition" data-style="m7-reference-fidelity@0.1.0"><defs><linearGradient id="m7-scene" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#081322"/><stop offset="1" stop-color="#020812"/></linearGradient></defs><rect width="540" height="960" fill="url(#m7-scene)"/><text x="270" y="66" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="800" fill="#D9FBFF" letter-spacing="3">FORGE REWARD</text>${placed({component:"panel",width:488,height:660},26,106)}${placed({component:"icon-container",width:116,height:116,state:"selected"},212,144)}${placed({component:"badge",width:212,height:48,state:"highlighted"},164,286)}${placed({component:"tab",width:184,height:52,state:"selected"},178,352)}${placed({component:"progress",width:420,height:28,percent:90},60,438)}${placed({component:"primary-hex-button",width:320,height:68,state:"normal"},110,560)}${placed({component:"secondary-hex-button",width:232,height:56,state:"normal"},154,650)}<text x="270" y="605" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="800" fill="#fff">CLAIM</text><text x="270" y="685" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="700" fill="#D9FBFF">CONTINUE</text><text x="270" y="478" text-anchor="middle" font-family="system-ui" font-size="13" fill="#D9FBFF">90% FORGED</text></svg>`;
await writeRender(evidence, "m7-angular-reward-composition", portrait);
await writeFile(resolve(evidence, "matrix.json"), `${JSON.stringify({ schemaVersion: "1.0", id: "m7-angular-component-matrix", style: "m7-reference-fidelity@0.1.0", count: entries.length, entries }, null, 2)}\n`);
await rm(packageDir, { recursive: true, force: true });
await mkdir(modulesDir, { recursive: true });
const files = [];
for (const file of (await readdir(matrixDir)).filter((name) => /\.(svg|png)$/.test(name)).sort()) {
  const stem = file.replace(/\.(svg|png)$/, "");
  const component = stem.startsWith("primary-hex-button") ? "primary-hex-button" : stem.startsWith("secondary-hex-button") ? "secondary-hex-button" : stem.startsWith("progress") ? "progress" : stem.startsWith("icon-container") ? "icon-container" : stem.startsWith("m7-angular") ? "composition" : stem.startsWith("panel") ? "panel" : stem.startsWith("tab") ? "tab" : "badge";
  const directory = resolve(modulesDir, component); await mkdir(directory, { recursive: true });
  await cp(resolve(matrixDir, file), resolve(directory, file)); const bytes = await readFile(resolve(directory, file));
  files.push({ assetId: `lnh-prism:asset:m7-reference-fidelity:${stem}:${file.split(".").pop()}`, component, source: `docs/validation/evidence/m7-a5-reference-fidelity/matrix/${file}`, path: `assets/m7-reference-fidelity/modules/${component}/${file}`, format: file.split(".").pop(), bytes: bytes.length, sha256: hash(bytes) });
}
const manifest = { schemaVersion: "1.0", packageId: "m7-reference-fidelity-assets", packageVersion: "1.0.0", styleId: "m7-reference-fidelity", sourceEvidence: "m7-a5-reference-fidelity", components: ["panel", "primary-hex-button", "secondary-hex-button", "tab", "badge", "progress", "icon-container"], modules: files, usage: { svg: "Editable deterministic source.", png: "Matching deterministic raster derivative.", progress: "Compose matching frame and fill modules at the same width.", extraction: "Each component folder is independently portable with stable IDs and receipts." } };
await writeFile(resolve(packageDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(resolve(packageDir, "README.md"), "# M7 Reference Fidelity Asset Package\n\nEngine-neutral angular UI modules. See `manifest.json` for stable IDs, hashes, and source receipts. Progress frame and fill are separate.\n");
const showroom = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>M7 Angular Asset Showroom</title><style>body{margin:0;background:#06101d;color:#e6fbff;font:16px system-ui;padding:28px}main{max-width:1180px;margin:auto}.hero,.card{background:#10233b;border:1px solid #4cbfd7;padding:20px;margin:16px 0;clip-path:polygon(18px 0,calc(100% - 18px) 0,100% 18px,100% calc(100% - 18px),calc(100% - 18px) 100%,18px 100%,0 calc(100% - 18px),0 18px)}.hero img{display:block;width:min(100%,540px);margin:auto}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.card img{width:100%;height:auto}.note{color:#9ac5d8}code{color:#9df4ff}</style><main><section class="hero"><h1>M7 Angular Reference-Fidelity Showroom</h1><p class="note">Deterministic, engine-neutral SVG/PNG modules. Sharp wide-hex buttons and faceted containers replace the prior rounded baseline.</p><img src="../docs/validation/evidence/m7-a5-reference-fidelity/m7-angular-reward-composition.png" alt="M7 angular reward composition"></section><section class="grid"><article class="card"><h2>Primary states</h2><img src="../docs/validation/evidence/m7-a5-reference-fidelity/matrix/primary-hex-button-320x68-normal.png" alt="Primary wide hex button"></article><article class="card"><h2>Secondary states</h2><img src="../docs/validation/evidence/m7-a5-reference-fidelity/matrix/secondary-hex-button-232x56-normal.png" alt="Secondary wide hex button"></article><article class="card"><h2>Progress parts</h2><img src="../docs/validation/evidence/m7-a5-reference-fidelity/matrix/progress-420x28-90.png" alt="Angular progress at 90 percent"><p class="note">Separate <code>frame</code> and <code>fill</code> modules are in the asset package.</p></article><article class="card"><h2>Faceted supporting components</h2><img src="../docs/validation/evidence/m7-a5-reference-fidelity/matrix/icon-container-116x116-selected.png" alt="Selected faceted icon container"></article></section><p>Asset package: <code>assets/m7-reference-fidelity</code></p></main>`;
await writeFile(resolve("showcase/m7-reference-fidelity.html"), showroom);
console.log(`Prepared ${entries.length} M7 matrix entries, portrait views, showroom, and ${files.length} modular assets.`);
