import path from "node:path";
import { sha256Value } from "./lib.mjs";

function semver(value, label) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value ?? "")) {
    throw new Error(`${label} must be a semantic version.`);
  }
  return value;
}

export function planPromotion({ project, job, buildManifest, approvalReceipt, componentVersion }) {
  semver(componentVersion, "componentVersion");
  if (job.status !== "built") throw new Error(`Promotion requires a built job; received ${job.status}.`);
  if (buildManifest.approvalId !== approvalReceipt.approvalId) throw new Error("Build and approval IDs do not match.");
  if (buildManifest.jobId !== job.jobId || approvalReceipt.jobId !== job.jobId) throw new Error("Promotion job IDs do not match.");
  const groups = new Map();
  for (const module of buildManifest.modules) {
    if (!/^[a-z][a-z0-9-]*$/.test(module.id ?? "")) throw new Error(`Unstable component ID: ${module.id}`);
    if (!["svg", "png"].includes(module.format)) throw new Error(`Unsupported promotion format: ${module.format}`);
    if (path.isAbsolute(module.path) || module.path.split(/[\\/]/u).includes("..")) throw new Error(`Unsafe module path: ${module.path}`);
    const key = module.id;
    const list = groups.get(key) ?? [];
    list.push(module);
    groups.set(key, list);
  }
  const components = [...groups.entries()].map(([id, modules]) => {
    if ((project.componentInventory ?? []).some((component) => component.id === id && component.version === componentVersion)) {
      throw new Error(`Duplicate component version: ${id}@${componentVersion}`);
    }
    const states = [...new Set(modules.map((module) => module.stateId).filter(Boolean))].sort();
    return {
      id,
      version: componentVersion,
      sourceJobId: job.jobId,
      approvalId: approvalReceipt.approvalId,
      states,
      modules
    };
  }).sort((a, b) => a.id.localeCompare(b.id));
  if (components.length === 0) throw new Error("Promotion requires at least one component module.");
  return {
    schemaVersion: 1,
    projectId: project.projectId,
    jobId: job.jobId,
    approvalId: approvalReceipt.approvalId,
    componentVersion,
    components,
    planSha256: sha256Value(components)
  };
}

export function createPromotionReceipt({ plan, promotedFiles, executedAt, dryRun }) {
  return {
    schemaVersion: 1,
    receiptId: `${plan.jobId}-${plan.approvalId}-${plan.componentVersion}`,
    projectId: plan.projectId,
    jobId: plan.jobId,
    approvalId: plan.approvalId,
    componentVersion: plan.componentVersion,
    dryRun,
    status: dryRun ? "validated-dry-run" : "promoted",
    executedAt,
    planSha256: plan.planSha256,
    components: plan.components.map(({ id, version, states }) => ({ id, version, states })),
    files: promotedFiles
  };
}

export function createPackageManifest({
  project,
  packageVersion,
  componentEntries,
  files,
  approvalReceipts,
  promotionReceipts,
  validationReport,
  knownLimitations
}) {
  semver(packageVersion, "packageVersion");
  if (!Array.isArray(componentEntries) || componentEntries.length === 0) throw new Error("Package requires promoted components.");
  if (!Array.isArray(files) || files.length === 0) throw new Error("Package requires files.");
  if (files.some((file) => /reference|screenshot|comparison/iu.test(file.path))) {
    throw new Error("Reference or comparison evidence is forbidden in the delivery package.");
  }
  return {
    schemaVersion: 1,
    packageId: `${project.projectId}-engine-neutral-assets`,
    packageVersion,
    projectId: project.projectId,
    engineNeutral: true,
    unityIntegration: false,
    components: componentEntries,
    files,
    tokens: project.visualTokens ?? {},
    materials: project.materials ?? [],
    approvals: approvalReceipts,
    promotions: promotionReceipts,
    validation: validationReport,
    knownLimitations
  };
}
