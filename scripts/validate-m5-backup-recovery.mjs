import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { performance } from "node:perf_hooks";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const packageDir = join(root, "assets", "frostbound-reward");
const packageManifestPath = join(packageDir, "manifest.json");
const sourceMatrixDir = join(root, "docs", "validation", "evidence", "m3-s4-frostbound-reconstruction", "matrix");
const assemblerPath = join(root, "scripts", "prepare-asset-package.mjs");
const evidenceDir = join(root, "docs", "validation", "evidence", "m5-production-hardening");
const receiptPath = join(evidenceDir, "M5-A4-package-backup-recovery-receipt.json");

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function repositoryPath(path) {
  return relative(root, path).replaceAll("\\", "/");
}

function packageRelativePath(manifestPath) {
  return manifestPath.replace(/^assets\/frostbound-reward\//, "");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function fileSha256(path) {
  return sha256(await readFile(path));
}

async function timed(label, action) {
  const started = performance.now();
  const result = await action();
  return { label, durationMs: Number((performance.now() - started).toFixed(3)), result };
}

async function gitCommit() {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: root });
    return stdout.trim();
  } catch {
    return "unknown";
  }
}

async function packageIntegrity(packageRoot, approvedManifest) {
  const manifestPath = join(packageRoot, "manifest.json");
  const manifestBytes = await readFile(manifestPath);
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const mismatches = [];
  const seenAssetIds = new Set();
  const expectedById = new Map(approvedManifest.modules.map((entry) => [entry.assetId, entry]));
  let totalBytes = 0;
  const formats = {};

  if (manifest.packageId !== approvedManifest.packageId) {
    mismatches.push(`packageId ${manifest.packageId} !== ${approvedManifest.packageId}`);
  }
  if (manifest.packageVersion !== approvedManifest.packageVersion) {
    mismatches.push(`packageVersion ${manifest.packageVersion} !== ${approvedManifest.packageVersion}`);
  }
  if (manifest.modules.length !== approvedManifest.modules.length) {
    mismatches.push(`module count ${manifest.modules.length} !== ${approvedManifest.modules.length}`);
  }

  for (const entry of manifest.modules) {
    if (seenAssetIds.has(entry.assetId)) mismatches.push(`${entry.assetId}: duplicate assetId`);
    seenAssetIds.add(entry.assetId);
    const expected = expectedById.get(entry.assetId);
    if (!expected) {
      mismatches.push(`${entry.assetId}: unexpected module`);
      continue;
    }
    const fullPath = join(packageRoot, packageRelativePath(entry.path));
    const moduleStat = await stat(fullPath);
    const moduleSha256 = await fileSha256(fullPath);
    totalBytes += moduleStat.size;
    formats[entry.format] = (formats[entry.format] ?? 0) + 1;
    if (entry.path !== expected.path) mismatches.push(`${entry.assetId}: path ${entry.path} !== ${expected.path}`);
    if (entry.bytes !== expected.bytes) mismatches.push(`${entry.path}: manifest bytes ${entry.bytes} !== ${expected.bytes}`);
    if (entry.sha256 !== expected.sha256) mismatches.push(`${entry.path}: manifest sha256 ${entry.sha256} !== ${expected.sha256}`);
    if (moduleStat.size !== expected.bytes) mismatches.push(`${entry.path}: file bytes ${moduleStat.size} !== ${expected.bytes}`);
    if (moduleSha256 !== expected.sha256) mismatches.push(`${entry.path}: file sha256 ${moduleSha256} !== ${expected.sha256}`);
  }

  for (const entry of approvedManifest.modules) {
    if (!seenAssetIds.has(entry.assetId)) mismatches.push(`${entry.assetId}: missing module`);
  }

  return {
    manifestSha256: sha256(manifestBytes),
    packageId: manifest.packageId,
    packageVersion: manifest.packageVersion,
    modules: manifest.modules.length,
    totalBytes,
    formats,
    mismatches
  };
}

async function listSourceMatrix() {
  const files = (await readdir(sourceMatrixDir)).filter((file) => /\.(svg|png)$/i.test(file)).sort((a, b) => a.localeCompare(b));
  const byFormat = {};
  for (const file of files) {
    const format = file.split(".").at(-1).toLowerCase();
    byFormat[format] = (byFormat[format] ?? 0) + 1;
  }
  return { path: repositoryPath(sourceMatrixDir), files: files.length, formats: byFormat };
}

const approvedManifest = await readJson(packageManifestPath);
const approvedBefore = await packageIntegrity(packageDir, approvedManifest);
if (approvedBefore.mismatches.length) {
  throw new Error(`approved package is not valid before recovery drill: ${approvedBefore.mismatches.join("; ")}`);
}

const tempRoot = join(tmpdir(), `lnh-prism-m5-a4-${process.pid}`);
const backupRoot = join(tempRoot, "backup", "frostbound-reward");
const recoveredRoot = join(tempRoot, "recovered", "frostbound-reward");
const rebuildRoot = join(tempRoot, "rebuild-workspace");

await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

let receipt;
try {
  const backup = await timed("backup-approved-package", async () => {
    await mkdir(join(tempRoot, "backup"), { recursive: true });
    await cp(packageDir, backupRoot, { recursive: true });
    return await packageIntegrity(backupRoot, approvedManifest);
  });
  if (backup.result.mismatches.length) throw new Error(`backup verification failed: ${backup.result.mismatches.join("; ")}`);

  const restore = await timed("restore-backup-to-recovery-destination", async () => {
    await mkdir(join(tempRoot, "recovered"), { recursive: true });
    await cp(backupRoot, recoveredRoot, { recursive: true });
    return await packageIntegrity(recoveredRoot, approvedManifest);
  });
  if (restore.result.mismatches.length) throw new Error(`restored package verification failed: ${restore.result.mismatches.join("; ")}`);

  await mkdir(join(rebuildRoot, "docs", "validation", "evidence", "m3-s4-frostbound-reconstruction"), { recursive: true });
  await cp(sourceMatrixDir, join(rebuildRoot, "docs", "validation", "evidence", "m3-s4-frostbound-reconstruction", "matrix"), { recursive: true });
  await mkdir(join(rebuildRoot, "scripts"), { recursive: true });
  await cp(assemblerPath, join(rebuildRoot, "scripts", "prepare-asset-package.mjs"));

  const rebuild = await timed("rebuild-from-pinned-source-matrix", async () => {
    await execFileAsync(process.execPath, ["scripts/prepare-asset-package.mjs"], { cwd: rebuildRoot, maxBuffer: 2 * 1024 * 1024 });
    return await packageIntegrity(join(rebuildRoot, "assets", "frostbound-reward"), approvedManifest);
  });
  if (rebuild.result.mismatches.length) throw new Error(`rebuilt package verification failed: ${rebuild.result.mismatches.join("; ")}`);

  const approvedAfter = await packageIntegrity(packageDir, approvedManifest);
  if (approvedAfter.manifestSha256 !== approvedBefore.manifestSha256) {
    throw new Error("approved package manifest changed during backup/recovery drill.");
  }
  if (approvedAfter.mismatches.length) {
    throw new Error(`approved package is not valid after recovery drill: ${approvedAfter.mismatches.join("; ")}`);
  }

  const timings = [backup, restore, rebuild].map(({ label, durationMs }) => ({ label, durationMs }));
  receipt = {
    schemaVersion: "1.0",
    id: "m5-a4-package-backup-recovery",
    status: "pass",
    packageId: approvedManifest.packageId,
    packageVersion: approvedManifest.packageVersion,
    generatedAt: new Date().toISOString(),
    gitCommit: await gitCommit(),
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    backupSourceSet: {
      approvedPackage: repositoryPath(packageDir),
      approvedManifest: repositoryPath(packageManifestPath),
      sourceMatrix: await listSourceMatrix(),
      packageAssembler: repositoryPath(assemblerPath),
      packageManifestSha256: approvedBefore.manifestSha256
    },
    recoveryDestination: {
      type: "temporary workspace",
      restoredPackage: "temp/backup-recovery/recovered/frostbound-reward",
      rebuiltPackage: "temp/backup-recovery/rebuild-workspace/assets/frostbound-reward",
      retainedInRepository: false
    },
    restoreFromBackup: {
      status: "pass",
      backupModules: backup.result.modules,
      restoredModules: restore.result.modules,
      restoredTotalBytes: restore.result.totalBytes,
      restoredManifestSha256: restore.result.manifestSha256,
      mismatches: restore.result.mismatches
    },
    rebuildFromPinnedInputs: {
      status: "pass",
      sourceEvidence: "docs/validation/evidence/m3-s4-frostbound-reconstruction/matrix",
      assembler: "scripts/prepare-asset-package.mjs",
      rebuiltModules: rebuild.result.modules,
      rebuiltTotalBytes: rebuild.result.totalBytes,
      rebuiltManifestSha256: rebuild.result.manifestSha256,
      mismatches: rebuild.result.mismatches
    },
    approvedPackageIntegrity: {
      status: "pass",
      beforeManifestSha256: approvedBefore.manifestSha256,
      afterManifestSha256: approvedAfter.manifestSha256,
      modules: approvedAfter.modules,
      totalBytes: approvedAfter.totalBytes,
      formats: approvedAfter.formats,
      unchanged: true
    },
    timing: {
      status: "pass",
      steps: timings,
      totalMs: Number(timings.reduce((sum, step) => sum + step.durationMs, 0).toFixed(3))
    },
    defects: []
  };

  await mkdir(evidenceDir, { recursive: true });
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  console.log(`M5-A4 package backup/recovery drill passed: ${repositoryPath(receiptPath)}`);
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
