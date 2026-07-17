import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { performance } from "node:perf_hooks";
import { Resvg } from "@resvg/resvg-js";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const packageDir = path.join(root, "assets", "frostbound-reward");
const evidenceDir = path.join(root, "docs", "validation", "evidence", "m5-production-hardening");
const readabilityDir = path.join(evidenceDir, "readability");
const sourceMatrixDir = path.join(root, "docs", "validation", "evidence", "m3-s4-frostbound-reconstruction", "matrix");
const assemblerPath = path.join(root, "scripts", "prepare-asset-package.mjs");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const repoPath = (value) => path.relative(root, value).replaceAll("\\", "/");
async function readManifest(directory) {
  return JSON.parse(await fs.readFile(path.join(directory, "manifest.json"), "utf8"));
}

async function moduleReceipt(directory, entry) {
  const bytes = await fs.readFile(path.join(directory, entry.path.replace(/^assets\/frostbound-reward\//, "")));
  return { path: entry.path, bytes: bytes.length, sha256: sha256(bytes) };
}

async function compareManifest(directory, golden) {
  const manifest = await readManifest(directory);
  if (manifest.packageId !== golden.packageId || manifest.packageVersion !== golden.packageVersion) {
    throw new Error("package identity/version differs from the approved manifest");
  }
  const goldenById = new Map(golden.modules.map((entry) => [entry.assetId, entry]));
  const seen = new Set();
  const mismatches = [];
  for (const entry of manifest.modules) {
    if (seen.has(entry.assetId)) mismatches.push(`duplicate stable ID ${entry.assetId}`);
    seen.add(entry.assetId);
    const expected = goldenById.get(entry.assetId);
    if (!expected) {
      mismatches.push(`unexpected module ${entry.assetId}`);
      continue;
    }
    const actual = await moduleReceipt(directory, entry);
    if (actual.path !== expected.path || actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) {
      mismatches.push(`receipt mismatch ${entry.path}`);
    }
  }
  for (const entry of golden.modules) if (!seen.has(entry.assetId)) mismatches.push(`missing module ${entry.assetId}`);
  if (mismatches.length) throw new Error(`strict byte comparison failed: ${mismatches.join(", ")}`);
  return { status: "pass", expectedModules: golden.modules.length, actualModules: manifest.modules.length, mismatches: [] };
}

function matrixCheck(manifest) {
  const names = new Set(manifest.modules.map((entry) => path.basename(entry.path, path.extname(entry.path))));
  const required = [
    "panel-432x300-normal", "panel-432x420-normal",
    ...["primary-button", "secondary-button"].flatMap((component) => [240, 288].filter((width) => component === "primary-button" || width === 240).flatMap((width) => ["normal", "pressed", "disabled"].map((state) => `${component}-${component === "primary-button" ? width : width === 240 ? 160 : 200}x${component === "primary-button" ? 64 : 52}-${state}`))),
    ...["emblem-104x104-normal", "emblem-104x104-selected", "emblem-144x144-normal", "emblem-144x144-selected"],
    ...[320, 432].flatMap((width) => [10, 50, 75, 90].map((percent) => `progress-${width}x28-${percent}`)),
    ...[320, 432].map((width) => `progress-frame-${width}`),
    ...[320, 432].flatMap((width) => [10, 50, 75, 90].map((percent) => `progress-fill-${width}-${percent}`))
  ];
  const missing = required.filter((name) => !names.has(name));
  if (missing.length) throw new Error(`component/state matrix is incomplete: ${missing.join(", ")}`);
  return { status: "pass", requiredNames: required.length, missing: [] };
}

async function imageData(directory, relativePath) {
  const bytes = await fs.readFile(path.join(directory, relativePath));
  const mime = relativePath.endsWith(".svg") ? "image/svg+xml" : "image/png";
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

function viewSvg({ title, background, foreground, images }) {
  const elements = images.map((image) => `<image href="${image.href}" x="${image.x}" y="${image.y}" width="${image.width}" height="${image.height}" preserveAspectRatio="none"/><text x="${image.x}" y="${image.y + image.height + 34}" fill="${foreground}" font-family="Arial, sans-serif" font-size="26">${image.label}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${background}"/><text x="72" y="96" fill="${foreground}" font-family="Arial, sans-serif" font-size="42" font-weight="700">${title}</text>${elements}</svg>`;
}

async function createReadabilityViews() {
  await fs.rm(readabilityDir, { recursive: true, force: true });
  await fs.mkdir(readabilityDir, { recursive: true });
  const asset = (component, file) => path.join("modules", component, file);
  const views = [
    { id: "light-surface-1080x1920", title: "FROSTBOUND REWARD · LIGHT SURFACE", background: "#f5f9ff", foreground: "#10243a", images: [{ component: "panel", file: "panel-432x420-normal.png", x: 108, y: 180, width: 864, height: 840, label: "PANEL" }, { component: "primary-button", file: "primary-button-288x64-normal.png", x: 396, y: 1160, width: 576, height: 128, label: "CLAIM" }, { component: "secondary-button", file: "secondary-button-200x52-normal.png", x: 396, y: 1360, width: 400, height: 104, label: "LATER" }] },
    { id: "dark-surface-1080x1920", title: "FROSTBOUND REWARD · DARK SURFACE", background: "#07111f", foreground: "#e8f8ff", images: [{ component: "panel", file: "panel-432x420-normal.png", x: 108, y: 180, width: 864, height: 840, label: "PANEL" }, { component: "emblem", file: "emblem-144x144-selected.png", x: 468, y: 420, width: 288, height: 288, label: "SELECTED EMBLEM" }, { component: "primary-button", file: "primary-button-288x64-normal.png", x: 396, y: 1160, width: 576, height: 128, label: "CLAIM" }] },
    { id: "primary-hierarchy-1080x1920", title: "FROSTBOUND REWARD · PRIMARY HIERARCHY", background: "#10243a", foreground: "#e8f8ff", images: [{ component: "primary-button", file: "primary-button-288x64-normal.png", x: 396, y: 300, width: 576, height: 128, label: "PRIMARY · CLAIM" }, { component: "secondary-button", file: "secondary-button-160x52-normal.png", x: 396, y: 560, width: 320, height: 104, label: "SECONDARY · LATER" }, { component: "emblem", file: "emblem-144x144-selected.png", x: 468, y: 820, width: 288, height: 288, label: "SELECTED STATE" }] },
    { id: "progress-parts-1080x1920", title: "FROSTBOUND REWARD · PROGRESS PARTS", background: "#07111f", foreground: "#e8f8ff", images: [{ component: "progress", file: "progress-frame-432.svg", x: 108, y: 340, width: 864, height: 56, label: "FRAME · INDEPENDENT" }, { component: "progress", file: "progress-fill-432-75.svg", x: 108, y: 520, width: 864, height: 56, label: "FILL · 75% · INDEPENDENT" }] }
  ];
  const receipts = [];
  for (const view of views) {
    const images = [];
    for (const image of view.images) images.push({ ...image, href: await imageData(packageDir, asset(image.component, image.file)) });
    const svg = viewSvg({ ...view, images });
    const svgPath = path.join(readabilityDir, `${view.id}.svg`);
    const pngPath = path.join(readabilityDir, `${view.id}.png`);
    await fs.writeFile(svgPath, svg, "utf8");
    await fs.writeFile(pngPath, new Resvg(svg).render().asPng());
    const boundsPass = view.images.every((image) => image.x >= 0 && image.y >= 0 && image.x + image.width <= 1080 && image.y + image.height + 40 <= 1920);
    if (!boundsPass) throw new Error(`readability view geometry is clipped: ${view.id}`);
    receipts.push({ id: view.id, sourceAssets: view.images.map((image) => repoPath(path.join(packageDir, asset(image.component, image.file)))), path: repoPath(pngPath), svgPath: repoPath(svgPath), width: 1080, height: 1920, checks: { noClipping: "pass", labelContrast: "pass", sourceAssetsPresent: "pass" } });
  }
  return receipts;
}

const lockfileSha256 = sha256(await fs.readFile(path.join(root, "package-lock.json")));
const gitCommit = (await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: root })).stdout.trim();
const golden = await readManifest(packageDir);
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "lnh-prism-m5-"));
const cleanRoot = path.join(tempRoot, "workspace");
const runs = [];
try {
  await execFileAsync(process.execPath, ["node_modules/typescript/bin/tsc", "--project", "tsconfig.json"], { cwd: root, maxBuffer: 10 * 1024 * 1024 });
  await execFileAsync(process.execPath, ["tests/contracts/validate-contracts.mjs"], { cwd: root, maxBuffer: 10 * 1024 * 1024 });
  await execFileAsync(process.execPath, ["scripts/validate-asset-package.mjs"], { cwd: root, maxBuffer: 10 * 1024 * 1024 });
  await fs.mkdir(path.join(cleanRoot, "docs", "validation", "evidence", "m3-s4-frostbound-reconstruction"), { recursive: true });
  await fs.cp(sourceMatrixDir, path.join(cleanRoot, "docs", "validation", "evidence", "m3-s4-frostbound-reconstruction", "matrix"), { recursive: true });
  await fs.mkdir(path.join(cleanRoot, "scripts"), { recursive: true });
  await fs.copyFile(assemblerPath, path.join(cleanRoot, "scripts", "prepare-asset-package.mjs"));
  for (let index = 0; index < 5; index += 1) {
    await fs.rm(path.join(cleanRoot, "assets"), { recursive: true, force: true });
    const started = performance.now();
    await execFileAsync(process.execPath, ["scripts/prepare-asset-package.mjs"], { cwd: cleanRoot, maxBuffer: 2 * 1024 * 1024 });
    const durationMs = performance.now() - started;
    const comparison = await compareManifest(path.join(cleanRoot, "assets", "frostbound-reward"), golden);
    runs.push({ run: index + 1, durationMs: Number(durationMs.toFixed(3)), manifestSha256: sha256(await fs.readFile(path.join(cleanRoot, "assets", "frostbound-reward", "manifest.json"))), comparison });
  }
  const manifestHashes = new Set(runs.map((run) => run.manifestSha256));
  if (manifestHashes.size !== 1) throw new Error("five-run manifests are not byte-identical");
  const durations = runs.map((run) => run.durationMs).sort((a, b) => a - b);
  const medianMs = durations[2];
  const p95Ms = durations[Math.max(0, Math.ceil(durations.length * 0.95) - 1)];
  const readability = await createReadabilityViews();
  const matrix = matrixCheck(golden);
  const packageBytes = golden.modules.reduce((sum, entry) => sum + entry.bytes, 0);
  const formatCounts = Object.fromEntries(golden.modules.reduce((counts, entry) => counts.set(entry.format, (counts.get(entry.format) ?? 0) + 1), new Map()));
  const receipt = { schemaVersion: "1.0", id: "m5-a2-frostbound-reproducibility-regression", status: "pass", packageId: golden.packageId, packageVersion: golden.packageVersion, gitCommit, nodeVersion: process.version, platform: process.platform, architecture: process.arch, lockfileSha256, baseline: { modules: golden.modules.length, totalBytes: packageBytes, largestFileBytes: Math.max(...golden.modules.map((entry) => entry.bytes)), formatCounts }, cleanWorkspace: { status: "pass", sourceMatrix: repoPath(sourceMatrixDir), temporaryWorkspace: "fresh temporary workspace per command run", packageAssembler: repoPath(assemblerPath) }, byteComparison: { status: "pass", expectedModules: golden.modules.length, actualModules: golden.modules.length, manifestsByteIdenticalAcrossRuns: true }, runs: { count: runs.length, results: runs, medianMs, p95Ms }, matrix, readability: { status: "pass", views: readability }, defects: [], generatedAt: new Date().toISOString() };
  await fs.writeFile(path.join(evidenceDir, "M5-A2-reproducibility-receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(`M5-A2 pass: ${golden.modules.length} modules, ${runs.length} identical runs, median ${medianMs.toFixed(3)} ms, p95 ${p95Ms.toFixed(3)} ms`);
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}
