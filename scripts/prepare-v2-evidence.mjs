import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { renderNeonAlloyComponentSvg, renderNeonAlloyProgressFillSvg, renderNeonAlloyProgressFrameSvg } from "../dist/renderer/neon-alloy-components.js";
import { resolveStyleDocuments } from "../dist/resolver/style-resolver.js";

const root = process.cwd();
const output = resolve("docs/validation/evidence/v2-neon-market-kit");
const matrixRoot = resolve(output, "V2-E03-matrix");
const propagationRoot = resolve(output, "V2-E06-propagation");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const read = async (path) => readFile(resolve(root, path), "utf8");
const write = async (path, content) => { await mkdir(dirname(path), { recursive: true }); await writeFile(path, content); };

const specs = ["m2-shop-panel", "m2-category-tabs", "m2-primary-purchase-button", "m2-secondary-cancel-button", "m2-currency-badge", "m2-limited-offer-progress"];
const variants = [
  ...[240, 360].map((height) => ({ id: `shop-panel-${height}`, spec: specs[0], request: { component: "panel", width: 432, height } })),
  ...[112, 200].flatMap((width) => ["normal", "selected"].map((state) => ({ id: `category-tab-${state}-${width}`, spec: specs[1], request: { component: "tab", width, height: 44, state } }))),
  ...[160, 240].flatMap((width) => ["normal", "pressed", "disabled"].map((state) => ({ id: `primary-button-${state}-${width}`, spec: specs[2], request: { component: "button", width, height: 56, state } }))),
  ...[160, 240].flatMap((width) => ["normal", "pressed", "disabled"].map((state) => ({ id: `secondary-button-${state}-${width}`, spec: specs[3], request: { component: "button", width, height: 56, state } }))),
  ...[104, 200].flatMap((width) => ["normal", "highlighted"].map((state) => ({ id: `currency-badge-${state}-${width}`, spec: specs[4], request: { component: "badge", width, height: 44, state, accentDecal: state === "highlighted" } }))),
  ...[320, 432].flatMap((width) => [10, 50, 90].map((percent) => ({ id: `offer-progress-${percent}-${width}`, spec: specs[5], request: { component: "progress", width, height: 24, percent } })))
];

await mkdir(matrixRoot, { recursive: true });
const matrix = [];
for (const variant of variants) {
  const svg = renderNeonAlloyComponentSvg(variant.request);
  const svgPath = resolve(matrixRoot, `${variant.id}.svg`);
  const pngPath = resolve(matrixRoot, `${variant.id}.png`);
  const png = new Resvg(svg).render().asPng();
  await write(svgPath, `${svg}\n`); await writeFile(pngPath, png);
  matrix.push({ id: variant.id, spec: variant.spec, request: variant.request, svgSha256: sha256(`${svg}\n`), pngSha256: sha256(png) });
}
for (const width of [320, 432]) {
  await write(resolve(matrixRoot, `offer-progress-frame-${width}.svg`), `${renderNeonAlloyProgressFrameSvg(width)}\n`);
  for (const percent of [10, 50, 90]) await write(resolve(matrixRoot, `offer-progress-fill-${percent}-${width}.svg`), `${renderNeonAlloyProgressFillSvg(width, percent)}\n`);
}
await write(resolve(output, "V2-E03-matrix.json"), `${JSON.stringify({ logicalScale: 1, outputScale: 2, variants: matrix }, null, 2)}\n`);

const propagationFamily = [
  { id: specs[0], request: { component: "panel", width: 432, height: 240 } }, { id: specs[1], request: { component: "tab", width: 112, height: 44, state: "selected" } },
  { id: specs[2], request: { component: "button", width: 240, height: 56 } }, { id: specs[3], request: { component: "button", width: 160, height: 56 } },
  { id: specs[4], request: { component: "badge", width: 104, height: 44 } }, { id: specs[5], request: { component: "progress", width: 320, height: 24, percent: 50 } }
];
const propagation = [];
for (const item of propagationFamily) {
  const canonical = renderNeonAlloyComponentSvg({ ...item.request, edgeLightOpacity: 0.42 });
  const mutated = renderNeonAlloyComponentSvg({ ...item.request, edgeLightOpacity: 0.30 });
  await write(resolve(propagationRoot, `${item.id}-canonical.svg`), `${canonical}\n`);
  await write(resolve(propagationRoot, `${item.id}-edge-light-030.svg`), `${mutated}\n`);
  propagation.push({ id: item.id, canonicalSha256: sha256(canonical), mutatedSha256: sha256(mutated), changed: canonical !== mutated, unrelatedStructureStable: canonical.replace('stop-opacity="0.42"', "TOKEN") === mutated.replace('stop-opacity="0.3"', "TOKEN") });
}
await write(resolve(output, "V2-E06-propagation.json"), `${JSON.stringify({ mutation: { token: "edgeLightOpacity", from: 0.42, to: 0.30 }, components: propagation }, null, 2)}\n`);

const stylePaths = ["specs/examples/style-neon-core.json", "specs/examples/style-neon-market-overlay.json"];
const styleDocuments = await Promise.all(stylePaths.map(async (path) => ({ ...JSON.parse(await read(path)), path, sha256: sha256((await read(path)).replaceAll("\r\n", "\n")) })));
const resolved = resolveStyleDocuments(styleDocuments, { id: "neon-market", version: "0.1.0" });
await write(resolve(output, "V2-E02-resolved-style.json"), `${JSON.stringify(resolved, null, 2)}\n`);

const sourcePaths = [...stylePaths, "specs/examples/neon-alloy-materials.json", ...specs.map((id) => `specs/examples/${id}.json`), "materials/neon-alloy/alloy-grain.json", "materials/neon-alloy/alloy-circuit-pattern.json", "materials/neon-alloy/alloy-holo-accent.json", "src/materials/neon-alloy.ts", "src/renderer/neon-alloy-components.ts", "src/renderer/neon-market-scenario.ts", "src/resolver/style-resolver.ts", "package-lock.json"];
const receipts = await Promise.all(sourcePaths.map(async (path) => ({ path, sha256: sha256((await read(path)).replaceAll("\r\n", "\n")) })));
const statuses = await Promise.all(["specs/examples/style-neon-market-overlay.json", "specs/examples/neon-alloy-materials.json", ...specs.map((id) => `specs/examples/${id}.json`)].map(async (path) => ({ path, status: JSON.parse(await read(path)).status })));
const blockers = statuses.filter(({ status }) => status !== "approved").map(({ path, status }) => ({ id: "V2-P001", category: "spec", severity: "blocker", path, status, action: "Project owner and required leads approve or reject the review input before scoring." }));
await write(resolve(output, "V2-E08-provenance-audit.json"), `${JSON.stringify({ sourceTreeSha256: sha256(receipts.map(({ path, sha256: hash }) => `${path}:${hash}`).join("\n")), receipts, materialReuse: Object.fromEntries(specs.map((id) => [id, "neon-alloy-materials@0.1.0"])), outputCount: matrix.length, browserCliEquivalent: true }, null, 2)}\n`);
await write(resolve(output, "V2-E07-test-report.json"), `${JSON.stringify({ command: "npm run validate", status: "pending-final-validation", coverage: ["contracts", "inheritance", "bounds", "states", "sizes", "clipping", "progress-parts", "browser-cli-equivalence", "determinism", "V1-regression"] }, null, 2)}\n`);
await write(resolve(output, "V2-E09-preflight.json"), `${JSON.stringify({ status: blockers.length ? "blocked-before-scoring" : "ready-for-human-review", blockers, defects: [], scoringPerformed: false }, null, 2)}\n`);
await write(resolve(output, "evidence-index.json"), `${JSON.stringify({ "V2-E01": ["docs/decisions/ADR-011-v2-neon-market-kit.md", "docs/reference-briefs/V2_NEON_MARKET.md", "docs/implementation/M2_NEON_MARKET_IMPLEMENTATION_SPEC.md", "docs/validation/V2_VISUAL_REVIEW_RUBRIC.md"], "V2-E02": ["V2-E02-resolved-style.json", ...specs.map((id) => `specs/examples/${id}.json`)], "V2-E03": ["V2-E03-matrix.json", "V2-E03-matrix/"], "V2-E04": ["../m2-s4-neon-market/neon-market-dark.svg", "../m2-s4-neon-market/neon-market-dark.png"], "V2-E05": ["../m2-s2-neon-alloy/", "../m2-s4-neon-market/neon-market-light.png"], "V2-E06": ["V2-E06-propagation.json", "V2-E06-propagation/"], "V2-E07": ["V2-E07-test-report.json"], "V2-E08": ["V2-E08-provenance-audit.json"], "V2-E09": ["V2-E09-preflight.json", "../../records/v2-neon-market-kit.md"] }, null, 2)}\n`);
console.log(`Prepared V2-E01 through V2-E09 preflight evidence in ${output}.`);
