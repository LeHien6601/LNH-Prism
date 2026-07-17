import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const schemaPath = join(root, "specs", "schemas", "export-manifest.schema.json");
const liveManifestPath = join(root, "specs", "examples", "primary-button-normal.manifest.json");
const legacyManifestPath = join(root, "specs", "examples", "archive", "legacy-primary-button-normal.manifest.json");
const packageManifestPath = join(root, "assets", "frostbound-reward", "manifest.json");
const evidenceDir = join(root, "docs", "validation", "evidence", "m5-production-hardening");
const receiptPath = join(evidenceDir, "M5-A3-manifest-migration-rollback-receipt.json");

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function fileSha256(path) {
  return sha256(await readFile(path));
}

function repositoryPath(path) {
  return relative(root, path).replaceAll("\\", "/");
}

function gitCommit() {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createValidator(schema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addSchema(schema);
  return ajv.getSchema(schema.$id);
}

function errorsText(validate) {
  return validate.errors?.map((error) => {
    const path = error.instancePath || "/";
    if (error.keyword === "required") return `${path} missing ${error.params.missingProperty}`;
    if (error.keyword === "additionalProperties") return `${path} disallows ${error.params.additionalProperty}`;
    return `${path} ${error.message}`;
  }).join("; ") ?? "unknown validation error";
}

function validateOrThrow(validate, value, label) {
  if (!validate(value)) throw new Error(`${label} failed export-manifest schema: ${errorsText(validate)}`);
}

function expectFailure(validate, value, label, expectedFragments) {
  if (validate(value)) throw new Error(`${label} unexpectedly passed.`);
  const text = errorsText(validate);
  for (const fragment of expectedFragments) {
    if (!text.includes(fragment)) {
      throw new Error(`${label} failed, but not with expected evidence "${fragment}": ${text}`);
    }
  }
  return { id: label, status: "pass", error: text };
}

function assertLiveManifest(manifest) {
  assert(manifest.schemaVersion === "1.2", "live manifest must use schemaVersion 1.2.");
  assert(!("unityIntegration" in manifest), "live manifest must not contain root engine integration metadata.");
  for (const output of manifest.outputs) {
    assert(output.role, `live output ${output.path} must declare a role.`);
    assert(output.sha256, `live output ${output.path} must include sha256.`);
    assert(!("unity" in output), `live output ${output.path} must not contain engine import metadata.`);
  }
  for (const ref of [manifest.sources.style, manifest.sources.component, ...manifest.sources.materialPacks]) {
    assert(ref.path, `live source ${ref.id} must include a repository path.`);
    assert(ref.sha256, `live source ${ref.id} must include sha256.`);
  }
}

function assertArchivedLegacy(path, manifest) {
  const rel = repositoryPath(path);
  assert(rel.startsWith("specs/examples/archive/"), `legacy manifest must be retained under specs/examples/archive/: ${rel}`);
  assert(["1.0", "1.1"].includes(manifest.schemaVersion), `archived legacy manifest must be 1.0 or 1.1: ${manifest.schemaVersion}`);
}

function migrateLegacyToLive12(legacy, liveReference) {
  const migrated = structuredClone(legacy);
  migrated.schemaVersion = "1.2";
  migrated.sources = structuredClone(liveReference.sources);
  delete migrated.unityIntegration;
  migrated.outputs = legacy.outputs.map((output, index) => {
    const reference = liveReference.outputs[index] ?? liveReference.outputs[0];
    const migratedOutput = {
      path: output.path,
      format: output.format,
      width: output.width,
      height: output.height,
      sha256: output.sha256,
      role: reference.role ?? "raster-derivative",
      state: output.state ?? reference.state,
      part: reference.part ?? "whole"
    };
    if (output.unity?.border) {
      migratedOutput.slice = Object.fromEntries(
        Object.entries(output.unity.border).map(([key, value]) => [key, Number(value)])
      );
    }
    return migratedOutput;
  });
  return migrated;
}

async function packageIntegrity() {
  const manifestBytes = await readFile(packageManifestPath);
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const mismatches = [];
  let totalBytes = 0;
  const seenAssetIds = new Set();
  const formats = {};

  for (const module of manifest.modules) {
    if (seenAssetIds.has(module.assetId)) mismatches.push(`${module.assetId}: duplicate assetId`);
    seenAssetIds.add(module.assetId);
    const modulePath = join(root, module.path);
    const moduleStat = await stat(modulePath);
    const moduleSha256 = await fileSha256(modulePath);
    totalBytes += moduleStat.size;
    formats[module.format] = (formats[module.format] ?? 0) + 1;
    if (moduleStat.size !== module.bytes) {
      mismatches.push(`${module.path}: bytes ${moduleStat.size} !== receipt ${module.bytes}`);
    }
    if (moduleSha256 !== module.sha256) {
      mismatches.push(`${module.path}: sha256 ${moduleSha256} !== receipt ${module.sha256}`);
    }
  }

  return {
    manifestPath: repositoryPath(packageManifestPath),
    manifestSha256: sha256(manifestBytes),
    packageId: manifest.packageId,
    packageVersion: manifest.packageVersion,
    modules: manifest.modules.length,
    totalBytes,
    formats,
    mismatches
  };
}

const schema = await readJson(schemaPath);
const validateExportManifest = createValidator(schema);
const liveManifest = await readJson(liveManifestPath);
const legacyManifest = await readJson(legacyManifestPath);
const legacyBeforeSha256 = await fileSha256(legacyManifestPath);
const packageBefore = await packageIntegrity();

validateOrThrow(validateExportManifest, liveManifest, "live 1.2 manifest");
assertLiveManifest(liveManifest);
validateOrThrow(validateExportManifest, legacyManifest, "archived legacy manifest");
assertArchivedLegacy(legacyManifestPath, legacyManifest);
assert(packageBefore.mismatches.length === 0, `approved package had integrity mismatches before drill: ${packageBefore.mismatches.join("; ")}`);

const negativeChecks = [];
const liveWithEngineMetadata = structuredClone(liveManifest);
liveWithEngineMetadata.outputs[0].unity = { pixelsPerUnit: 100 };
negativeChecks.push(expectFailure(validateExportManifest, liveWithEngineMetadata, "live-1.2-engine-metadata-rejection", ["unity"]));

const liveWithoutProvenance = structuredClone(liveManifest);
delete liveWithoutProvenance.provenance;
negativeChecks.push(expectFailure(validateExportManifest, liveWithoutProvenance, "live-1.2-missing-provenance-rejection", ["provenance"]));

const liveWithoutOutputHash = structuredClone(liveManifest);
delete liveWithoutOutputHash.outputs[0].sha256;
negativeChecks.push(expectFailure(validateExportManifest, liveWithoutOutputHash, "live-1.2-missing-output-hash-rejection", ["sha256"]));

let archiveRuleFailure = "";
try {
  assertArchivedLegacy(join(root, "specs", "examples", "legacy-primary-button-normal.manifest.json"), legacyManifest);
  throw new Error("legacy archive rule unexpectedly passed.");
} catch (error) {
  archiveRuleFailure = error.message;
}
assert(archiveRuleFailure.includes("specs/examples/archive/"), `archive rule failure was not clear: ${archiveRuleFailure}`);
negativeChecks.push({ id: "legacy-archive-rule-rejection", status: "pass", error: archiveRuleFailure });

const tempRoot = join(tmpdir(), `lnh-prism-m5-a3-${process.pid}`);
await rm(tempRoot, { recursive: true, force: true });
await mkdir(tempRoot, { recursive: true });

const tempLegacyPath = join(tempRoot, "legacy-primary-button-normal.manifest.json");
const tempMigratedPath = join(tempRoot, "primary-button-normal.migrated-1.2.manifest.json");
await cp(legacyManifestPath, tempLegacyPath);
const migratedManifest = migrateLegacyToLive12(legacyManifest, liveManifest);
validateOrThrow(validateExportManifest, migratedManifest, "migrated live 1.2 manifest");
assertLiveManifest(migratedManifest);
await writeFile(tempMigratedPath, `${JSON.stringify(migratedManifest, null, 2)}\n`, "utf8");

const tempLegacyAfterSha256 = await fileSha256(tempLegacyPath);
const legacyAfterSha256 = await fileSha256(legacyManifestPath);
const packageAfter = await packageIntegrity();

assert(tempLegacyAfterSha256 === legacyBeforeSha256, "rollback drill did not preserve the temporary legacy manifest bytes.");
assert(legacyAfterSha256 === legacyBeforeSha256, "rollback drill changed archived legacy evidence bytes.");
assert(packageAfter.manifestSha256 === packageBefore.manifestSha256, "approved package manifest bytes changed during migration drill.");
assert(packageAfter.mismatches.length === 0, `approved package has integrity mismatches after drill: ${packageAfter.mismatches.join("; ")}`);

const receipt = {
  schemaVersion: "1.0",
  id: "m5-a3-manifest-migration-rollback",
  status: "pass",
  generatedAt: new Date().toISOString(),
  gitCommit: gitCommit(),
  nodeVersion: process.version,
  platform: process.platform,
  architecture: process.arch,
  liveManifest: {
    path: repositoryPath(liveManifestPath),
    schemaVersion: liveManifest.schemaVersion,
    validation: "pass",
    engineMetadataRejected: "pass",
    provenanceRequired: "pass",
    outputHashesRequired: "pass"
  },
  archivedLegacy: {
    path: repositoryPath(legacyManifestPath),
    schemaVersion: legacyManifest.schemaVersion,
    validation: "pass",
    archiveRule: "pass",
    rollbackPreserved: "pass",
    beforeSha256: legacyBeforeSha256,
    afterSha256: legacyAfterSha256
  },
  migration: {
    status: "pass",
    source: repositoryPath(legacyManifestPath),
    migratedFixture: relative(root, tempMigratedPath).replaceAll("\\", "/"),
    migratedSchemaVersion: migratedManifest.schemaVersion,
    removedEngineMetadata: migratedManifest.outputs.every((output) => !("unity" in output)),
    rootEngineMetadataAbsent: !("unityIntegration" in migratedManifest),
    outputCount: migratedManifest.outputs.length,
    outputRoles: [...new Set(migratedManifest.outputs.map((output) => output.role))]
  },
  rollback: {
    status: "pass",
    temporaryWorkspace: tempRoot,
    temporaryLegacySha256: tempLegacyAfterSha256,
    archivedLegacyUnchanged: "pass",
    approvedPackageUnchanged: "pass"
  },
  packageIntegrity: {
    status: "pass",
    manifestPath: packageBefore.manifestPath,
    packageId: packageBefore.packageId,
    packageVersion: packageBefore.packageVersion,
    beforeManifestSha256: packageBefore.manifestSha256,
    afterManifestSha256: packageAfter.manifestSha256,
    modules: packageAfter.modules,
    totalBytes: packageAfter.totalBytes,
    formats: packageAfter.formats,
    mismatches: packageAfter.mismatches
  },
  negativeChecks,
  defects: []
};

await mkdir(evidenceDir, { recursive: true });
await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
await rm(tempRoot, { recursive: true, force: true });

console.log(`M5-A3 manifest migration/rollback drill passed: ${repositoryPath(receiptPath)}`);
