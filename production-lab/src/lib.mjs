import { createHash } from "node:crypto";
import { mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export const LAB_ROOT = path.resolve(import.meta.dirname, "..");
export const JOBS_ROOT = path.join(LAB_ROOT, "workspace", "jobs");
export const PROJECTS_ROOT = path.join(LAB_ROOT, "workspace", "projects");
export const AUTHORITY_ROLES = Object.freeze([
  "primary-geometry",
  "style-authority",
  "component-authority",
  "screen-composition",
  "state-authority",
  "consistency-review",
  "mood-only"
]);
export const REFERENCE_STATUSES = Object.freeze(["approved", "rejected", "superseded"]);

export function safeJobId(value) {
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(value ?? "")) {
    throw new Error("Job ID must contain 2-63 lowercase letters, numbers, or hyphens.");
  }
  return value;
}

export const safeProjectId = safeJobId;
export const safeReferenceId = safeJobId;

export function jobRoot(jobId) {
  const root = path.resolve(JOBS_ROOT, safeJobId(jobId));
  if (!root.startsWith(`${JOBS_ROOT}${path.sep}`)) {
    throw new Error("Refusing a job path outside the lab workspace.");
  }
  return root;
}

export function projectRoot(projectId) {
  const root = path.resolve(PROJECTS_ROOT, safeProjectId(projectId));
  if (!root.startsWith(`${PROJECTS_ROOT}${path.sep}`)) {
    throw new Error("Refusing a project path outside the lab workspace.");
  }
  return root;
}

export async function ensureDir(directory) {
  await mkdir(directory, { recursive: true });
}

export async function readJson(filename) {
  return JSON.parse(await readFile(filename, "utf8"));
}

export async function writeJson(filename, value) {
  await ensureDir(path.dirname(filename));
  await atomicWriteFile(filename, `${JSON.stringify(value, null, 2)}\n`);
}

export async function atomicWriteFile(filename, content) {
  await ensureDir(path.dirname(filename));
  const temporary = `${filename}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temporary, content);
    await rename(temporary, filename);
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => {});
    throw error;
  }
}

export async function withFileLock(filename, action) {
  await ensureDir(path.dirname(filename));
  let handle;
  const acquire = async () => open(filename, "wx");
  try {
    handle = await acquire();
    await handle.writeFile(`${JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() })}\n`, "utf8");
  } catch (error) {
    if (error.code === "EEXIST") {
      let stale = false;
      try {
        const lock = JSON.parse(await readFile(filename, "utf8"));
        try {
          process.kill(lock.pid, 0);
        } catch (processError) {
          stale = processError.code === "ESRCH";
        }
      } catch {
        stale = false;
      }
      if (!stale) throw new Error(`Concurrent operation refused; lock already exists: ${filename}`);
      await rm(filename, { force: true });
      handle = await acquire();
      await handle.writeFile(`${JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString(), recoveredStaleLock: true })}\n`, "utf8");
    } else {
      throw error;
    }
  }
  try {
    return await action();
  } finally {
    await handle.close();
    await rm(filename, { force: true });
  }
}

export async function atomicReplaceDirectory(target, prepare) {
  const parent = path.dirname(target);
  const temporary = path.join(parent, `.${path.basename(target)}.${process.pid}.${Date.now()}.tmp`);
  const backup = path.join(parent, `.${path.basename(target)}.${process.pid}.${Date.now()}.bak`);
  await ensureDir(temporary);
  let backedUp = false;
  try {
    await prepare(temporary);
    try {
      await rename(target, backup);
      backedUp = true;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    await rename(temporary, target);
    if (backedUp) await rm(backup, { recursive: true, force: true });
  } catch (error) {
    await rm(temporary, { recursive: true, force: true }).catch(() => {});
    if (backedUp) {
      await rm(target, { recursive: true, force: true }).catch(() => {});
      await rename(backup, target).catch(() => {});
    }
    throw error;
  }
}

export async function sha256(filename) {
  const bytes = await readFile(filename);
  return createHash("sha256").update(bytes).digest("hex");
}

export function sha256Value(value) {
  return createHash("sha256").update(`${JSON.stringify(value)}\n`).digest("hex");
}

export function createApprovalReceipt({
  draft,
  draftSha256,
  job,
  reviewer,
  referenceHashes,
  reviewManifestSha256,
  approvedAt
}) {
  if (typeof reviewer !== "string" || !reviewer.trim()) throw new Error("Reviewer must not be empty.");
  if (draft.unresolved?.length) throw new Error(`Draft has ${draft.unresolved.length} unresolved review item(s).`);
  if (!Array.isArray(referenceHashes) || referenceHashes.length === 0) throw new Error("Approval requires reference hashes.");
  return {
    schemaVersion: 1,
    approvalId: draftSha256,
    projectId: job.projectId ?? draft.projectId ?? null,
    jobId: job.jobId,
    status: "approved",
    reviewer: reviewer.trim(),
    approvedAt,
    source: {
      draftSha256,
      draftSchemaVersion: draft.schemaVersion,
      jobSchemaVersion: job.schemaVersion,
      reviewManifestSha256,
      referenceHashes
    },
    policy: {
      humanApprovalRequired: true,
      autonomousApproval: false,
      invalidatedBySourceChange: true
    },
    approvedSnapshot: draft
  };
}

export function validateApprovalFreshness({
  receipt,
  draftSha256,
  referenceHashes,
  reviewManifestSha256
}) {
  if (receipt?.status !== "approved") throw new Error("Approval receipt is not approved.");
  if (receipt.source?.draftSha256 !== draftSha256) throw new Error("Stale approval: draft hash changed.");
  if (receipt.source?.reviewManifestSha256 !== reviewManifestSha256) throw new Error("Stale approval: review evidence changed.");
  const expected = new Map((receipt.source?.referenceHashes ?? []).map((reference) => [reference.id, reference.sha256]));
  for (const reference of referenceHashes) {
    if (expected.get(reference.id) !== reference.sha256) throw new Error(`Stale approval: reference hash changed for ${reference.id}.`);
  }
  if (expected.size !== referenceHashes.length) throw new Error("Stale approval: reference registry changed.");
  return receipt;
}

function familySignature(family) {
  return sha256Value({
    bounds: { width: family.bounds.width, height: family.bounds.height },
    baseLayers: family.baseLayers,
    textSlots: family.textSlots ?? [],
    iconSlots: family.iconSlots ?? [],
    slicing: family.slicing ?? null,
    effectPadding: family.effectPadding
  });
}

export function auditProjectDrafts(project, drafts) {
  const findings = [];
  const firstFamilies = new Map();
  for (const draft of drafts) {
    const job = project.jobs.find((candidate) => candidate.id === draft.jobId);
    const supportingReference = job?.referenceIds?.[0] ?? null;
    for (const [token, expected] of Object.entries(project.visualTokens ?? {})) {
      const actual = draft.tokens?.[token];
      if (actual !== undefined && JSON.stringify(actual) !== JSON.stringify(expected)) {
        const intentional = draft.intentionalVariations?.some((variation) => variation.token === token);
        findings.push({
          classification: intentional ? "acceptable-intentional-variation" : "blocking-inconsistency",
          projectId: project.projectId,
          jobId: draft.jobId,
          componentId: null,
          stateId: null,
          token,
          supportingReference,
          message: intentional ? `Intentional variation recorded for ${token}.` : `Project token ${token} drifted.`
        });
      }
    }
    for (const family of draft.componentFamilies ?? []) {
      const signature = familySignature(family);
      const first = firstFamilies.get(family.id);
      if (first && first.signature !== signature) {
        findings.push({
          classification: "blocking-inconsistency",
          projectId: project.projectId,
          jobId: draft.jobId,
          componentId: family.id,
          stateId: null,
          token: null,
          supportingReference,
          message: `Component family ${family.id} drifts from job ${first.jobId}.`
        });
      } else if (!first) {
        firstFamilies.set(family.id, { signature, jobId: draft.jobId });
      }
    }
    for (const unresolved of draft.unresolved ?? []) {
      findings.push({
        classification: "unresolved-human-decision",
        projectId: project.projectId,
        jobId: draft.jobId,
        componentId: unresolved.componentId ?? null,
        stateId: unresolved.stateId ?? null,
        token: unresolved.token ?? null,
        supportingReference,
        message: unresolved.question ?? unresolved.message ?? unresolved.id
      });
    }
  }
  for (const component of project.componentInventory ?? []) {
    if (component.status === "approved" && !drafts.some((draft) =>
      (draft.sharedComponentRefs ?? []).some((reference) =>
        reference.id === component.id && reference.version === component.version
      )
    )) {
      findings.push({
        classification: "recommended-correction",
        projectId: project.projectId,
        jobId: null,
        componentId: component.id,
        stateId: null,
        token: null,
        supportingReference: null,
        message: `Approved shared component ${component.id}@${component.version} is not referenced by any audited job.`
      });
    }
  }
  return {
    schemaVersion: 1,
    projectId: project.projectId,
    findingCount: findings.length,
    findings
  };
}

export function imageDimensions(bytes, extension) {
  const ext = extension.toLowerCase();
  if (ext === ".png" && bytes.length >= 24 && bytes.subarray(1, 4).toString() === "PNG") {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  throw new Error("Only PNG and JPEG screenshots with readable dimensions are supported.");
}

function nonEmptyString(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string.`);
  return value;
}

export function createProjectManifest({ projectId, displayName }) {
  return {
    schemaVersion: 1,
    projectId: safeProjectId(projectId),
    displayName: nonEmptyString(displayName, "displayName").trim(),
    support: {
      status: "supported-private-package",
      owner: "lnh-prism",
      packageVersion: "0.6.0",
      engineNeutral: true
    },
    references: [],
    visualTokens: {},
    componentInventory: [],
    stateRequirements: [],
    sizeRequirements: [],
    geometryConstraints: [],
    complexityBudgets: { simple: { min: 5, max: 12 }, medium: { min: 12, max: 30 } },
    outputFormats: ["svg", "png"],
    validationProfile: "production-lab-v1",
    approval: { status: "draft" },
    promotion: { status: "not-promoted" },
    jobs: []
  };
}

export function validateProjectManifest(project) {
  if (project?.schemaVersion !== 1) throw new Error("Unsupported project schemaVersion.");
  safeProjectId(project.projectId);
  nonEmptyString(project.displayName, "displayName");
  if (!Array.isArray(project.references)) throw new Error("references must be an array.");
  if (!Array.isArray(project.jobs)) throw new Error("jobs must be an array.");
  const referenceIds = new Set();
  for (const reference of project.references) {
    safeReferenceId(reference.id);
    if (referenceIds.has(reference.id)) throw new Error(`Duplicate reference ID: ${reference.id}`);
    referenceIds.add(reference.id);
    if (!AUTHORITY_ROLES.includes(reference.authorityRole)) {
      throw new Error(`Unsupported authority role: ${reference.authorityRole}`);
    }
    if (!REFERENCE_STATUSES.includes(reference.status)) {
      throw new Error(`Unsupported reference status: ${reference.status}`);
    }
    if (!/^[a-f0-9]{64}$/.test(reference.sha256 ?? "")) throw new Error(`Invalid SHA-256 for ${reference.id}.`);
    if (!(reference.width > 0) || !(reference.height > 0)) throw new Error(`Invalid dimensions for ${reference.id}.`);
    nonEmptyString(reference.mediaType, `${reference.id}.mediaType`);
    nonEmptyString(reference.version, `${reference.id}.version`);
    nonEmptyString(reference.permittedUse, `${reference.id}.permittedUse`);
    nonEmptyString(reference.provenanceNote, `${reference.id}.provenanceNote`);
    if (reference.status === "superseded" && !reference.supersededBy) {
      throw new Error(`Superseded reference ${reference.id} must declare supersededBy.`);
    }
  }
  const jobIds = new Set();
  for (const job of project.jobs) {
    safeJobId(job.id);
    if (jobIds.has(job.id)) throw new Error(`Duplicate job ID: ${job.id}`);
    jobIds.add(job.id);
    if (!Array.isArray(job.referenceIds) || job.referenceIds.length === 0) {
      throw new Error(`Job ${job.id} must declare at least one reference.`);
    }
    for (const referenceId of job.referenceIds) {
      if (!referenceIds.has(referenceId)) throw new Error(`Job ${job.id} uses unregistered reference ${referenceId}.`);
    }
  }
  return project;
}

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function number(value, label) {
  if (!Number.isFinite(value)) throw new Error(`${label} must be a finite number.`);
  return value;
}

function materialId(value, label) {
  if (!/^[a-z][a-z0-9-]*$/.test(value ?? "")) throw new Error(`Invalid ${label}: ${value}`);
  return value;
}

function validateMaterials(materials = []) {
  if (!Array.isArray(materials)) throw new Error("materials must be an array.");
  const ids = new Set();
  for (const material of materials) {
    materialId(material.id, "material ID");
    if (ids.has(material.id)) throw new Error(`Duplicate material ID: ${material.id}`);
    ids.add(material.id);
    if (!["linear-gradient", "radial-gradient", "glow", "shadow"].includes(material.kind)) {
      throw new Error(`Unsupported material kind ${material.kind}.`);
    }
    if (material.kind.endsWith("gradient")) {
      if (!Array.isArray(material.stops) || material.stops.length < 2) {
        throw new Error(`${material.id} must contain at least two gradient stops.`);
      }
      let previousOffset = -1;
      for (const [index, stop] of material.stops.entries()) {
        const offset = number(stop.offset, `${material.id}.stops[${index}].offset`);
        if (offset < 0 || offset > 1 || offset < previousOffset) {
          throw new Error(`${material.id} gradient offsets must be ordered from 0 to 1.`);
        }
        if (typeof stop.color !== "string" || !stop.color) {
          throw new Error(`${material.id}.stops[${index}].color must be a non-empty string.`);
        }
        if (stop.opacity !== undefined) {
          const opacity = number(stop.opacity, `${material.id}.stops[${index}].opacity`);
          if (opacity < 0 || opacity > 1) throw new Error(`${material.id} stop opacity must be between 0 and 1.`);
        }
        previousOffset = offset;
      }
    } else {
      if (typeof material.color !== "string" || !material.color) {
        throw new Error(`${material.id}.color must be a non-empty string.`);
      }
      const blur = number(material.blur, `${material.id}.blur`);
      if (blur < 0) throw new Error(`${material.id}.blur must be non-negative.`);
      if (material.opacity !== undefined) {
        const opacity = number(material.opacity, `${material.id}.opacity`);
        if (opacity < 0 || opacity > 1) throw new Error(`${material.id}.opacity must be between 0 and 1.`);
      }
      if (material.kind === "shadow") {
        number(material.dx ?? 0, `${material.id}.dx`);
        number(material.dy ?? 0, `${material.id}.dy`);
      }
    }
  }
  return new Map(materials.map((material) => [material.id, material]));
}

const STATE_IDS = new Set([
  "normal", "pressed", "selected", "disabled", "locked",
  "warning", "valid", "invalid", "completed", "broken", "damaged", "repaired"
]);

function positive(value, label) {
  number(value, label);
  if (value <= 0) throw new Error(`${label} must be positive.`);
  return value;
}

function validateBox(box, label, { allowZeroOrigin = true } = {}) {
  number(box?.x, `${label}.x`);
  number(box?.y, `${label}.y`);
  positive(box?.width, `${label}.width`);
  positive(box?.height, `${label}.height`);
  if (!allowZeroOrigin && (box.x < 0 || box.y < 0)) throw new Error(`${label} origin must be non-negative.`);
  return box;
}

function validatePadding(padding, label) {
  for (const side of ["top", "right", "bottom", "left"]) {
    const value = number(padding?.[side], `${label}.${side}`);
    if (value < 0) throw new Error(`${label}.${side} must be non-negative.`);
  }
}

function validateLayerGeometry(layer, label) {
  if (layer.kind === "rect") {
    positive(layer.width, `${label}.width`);
    positive(layer.height, `${label}.height`);
  } else if (layer.kind === "ellipse") {
    positive(layer.rx, `${label}.rx`);
    positive(layer.ry, `${label}.ry`);
  } else if (layer.kind === "path") {
    if (typeof layer.d !== "string" || !/^[Mm][\s\S]*[0-9]/.test(layer.d.trim())) {
      throw new Error(`${label}.d must be non-empty SVG path data beginning with M or m.`);
    }
  } else if (layer.kind === "text") {
    positive(layer.fontSize ?? 16, `${label}.fontSize`);
  }
}

function validateSlot(slot, label, kind) {
  materialId(slot.id, `${kind} slot ID`);
  validateBox(slot.bounds, `${label}.bounds`, { allowZeroOrigin: false });
  if (kind === "text") {
    if (!["left", "center", "right"].includes(slot.alignment)) throw new Error(`${label}.alignment is invalid.`);
    positive(slot.minimumSize, `${label}.minimumSize`);
    positive(slot.preferredSize, `${label}.preferredSize`);
    if (slot.minimumSize > slot.preferredSize) throw new Error(`${label} minimumSize exceeds preferredSize.`);
    if (!["none", "word", "character"].includes(slot.wrapping)) throw new Error(`${label}.wrapping is invalid.`);
    if (!Array.isArray(slot.fallbackFontFamilies) || slot.fallbackFontFamilies.length === 0) {
      throw new Error(`${label}.fallbackFontFamilies must not be empty.`);
    }
    if (typeof slot.localizationExpansion !== "number" || slot.localizationExpansion < 1) {
      throw new Error(`${label}.localizationExpansion must be at least 1.`);
    }
  }
}

function validateSlicing(slicing, family) {
  if (!slicing) return;
  validatePadding(slicing.fixedBorders, `${family.id}.slicing.fixedBorders`);
  validateBox(slicing.stretchRegion, `${family.id}.slicing.stretchRegion`, { allowZeroOrigin: false });
  validateBox(slicing.contentSafeRegion, `${family.id}.slicing.contentSafeRegion`, { allowZeroOrigin: false });
  positive(slicing.minimumWidth, `${family.id}.slicing.minimumWidth`);
  positive(slicing.minimumHeight, `${family.id}.slicing.minimumHeight`);
  if (slicing.tiling !== undefined && !["stretch", "tile-x", "tile-y", "tile-both"].includes(slicing.tiling)) {
    throw new Error(`${family.id}.slicing.tiling is invalid.`);
  }
  const { width, height } = family.bounds;
  const borders = slicing.fixedBorders;
  if (borders.left + borders.right >= width || borders.top + borders.bottom >= height) {
    throw new Error(`${family.id} slicing borders consume the component.`);
  }
}

function validateFamily(family, canvas, familyIds) {
  materialId(family.id, "component family ID");
  if (familyIds.has(family.id)) throw new Error(`Duplicate component family ID: ${family.id}`);
  familyIds.add(family.id);
  validateBox(family.bounds, `${family.id}.bounds`);
  if (!family.allowOverflow && (
    family.bounds.x < 0 || family.bounds.y < 0 ||
    family.bounds.x + family.bounds.width > canvas.width ||
    family.bounds.y + family.bounds.height > canvas.height
  )) throw new Error(`${family.id} must be contained within the declared canvas.`);
  positive(family.nativeSize?.width, `${family.id}.nativeSize.width`);
  positive(family.nativeSize?.height, `${family.id}.nativeSize.height`);
  if (family.anchor) {
    number(family.anchor.x, `${family.id}.anchor.x`);
    number(family.anchor.y, `${family.id}.anchor.y`);
  }
  if (!["none", "uniform", "horizontal", "vertical", "scalable-region"].includes(family.allowedResize)) {
    throw new Error(`${family.id}.allowedResize is invalid.`);
  }
  validatePadding(family.effectPadding, `${family.id}.effectPadding`);
  validateBox(family.contentSafeRegion, `${family.id}.contentSafeRegion`, { allowZeroOrigin: false });
  if (!Array.isArray(family.baseLayers) || family.baseLayers.length === 0) {
    throw new Error(`${family.id} must define shared baseLayers.`);
  }
  const layerIds = new Set();
  for (const layer of family.baseLayers) {
    materialId(layer.id, `${family.id} layer ID`);
    if (layerIds.has(layer.id)) throw new Error(`Duplicate layer ID ${layer.id} in ${family.id}.`);
    layerIds.add(layer.id);
    if (!["rect", "ellipse", "path", "text"].includes(layer.kind)) throw new Error(`Unsupported layer kind ${layer.kind}.`);
    if ("sourceImage" in layer || "imageHref" in layer || layer.kind === "image") {
      throw new Error(`Reference pixels are forbidden in ${family.id}/${layer.id}.`);
    }
    validateLayerGeometry(layer, `${family.id}.${layer.id}`);
  }
  const slotIds = new Set();
  for (const [kind, slots] of [["text", family.textSlots ?? []], ["icon", family.iconSlots ?? []]]) {
    if (!Array.isArray(slots)) throw new Error(`${family.id}.${kind}Slots must be an array.`);
    for (const slot of slots) {
      validateSlot(slot, `${family.id}.${kind}Slots.${slot.id}`, kind);
      if (slotIds.has(slot.id)) throw new Error(`Duplicate slot ID ${slot.id} in ${family.id}.`);
      slotIds.add(slot.id);
    }
  }
  if (!Array.isArray(family.states) || family.states.length === 0) throw new Error(`${family.id} must define states.`);
  const stateIds = new Set();
  for (const state of family.states) {
    if (!STATE_IDS.has(state.id)) throw new Error(`Unsupported state ${state.id} in ${family.id}.`);
    if (stateIds.has(state.id)) throw new Error(`Duplicate state ${state.id} in ${family.id}.`);
    stateIds.add(state.id);
    if (state.bounds && JSON.stringify(state.bounds) !== JSON.stringify(family.bounds)) {
      throw new Error(`${family.id}/${state.id} must preserve the shared footprint.`);
    }
    if (state.anchor && JSON.stringify(state.anchor) !== JSON.stringify(family.anchor)) {
      throw new Error(`${family.id}/${state.id} must preserve the shared anchor.`);
    }
    if (!Array.isArray(state.layerOverrides)) throw new Error(`${family.id}/${state.id}.layerOverrides must be an array.`);
    const overridden = new Set();
    for (const override of state.layerOverrides) {
      if (!layerIds.has(override.layerId)) throw new Error(`Unknown layer ${override.layerId} in ${family.id}/${state.id}.`);
      if (overridden.has(override.layerId)) throw new Error(`Duplicate override for ${override.layerId} in ${family.id}/${state.id}.`);
      overridden.add(override.layerId);
      if (!override.properties || typeof override.properties !== "object" || Array.isArray(override.properties)) {
        throw new Error(`${family.id}/${state.id} override properties are invalid.`);
      }
    }
  }
  validateSlicing(family.slicing, family);
}

function validateGeometryConstraints(constraints, families, canvas) {
  if (!Array.isArray(constraints)) throw new Error("geometryConstraints must be an array.");
  const byId = new Map(families.map((family) => [family.id, family]));
  const ids = new Set();
  for (const constraint of constraints) {
    materialId(constraint.id, "geometry constraint ID");
    if (ids.has(constraint.id)) throw new Error(`Duplicate geometry constraint ID: ${constraint.id}`);
    ids.add(constraint.id);
    const family = constraint.familyId ? byId.get(constraint.familyId) : undefined;
    if (constraint.familyId && !family) throw new Error(`Unknown family ${constraint.familyId} in ${constraint.id}.`);
    if (constraint.kind === "square-grid") {
      positive(constraint.rows, `${constraint.id}.rows`);
      positive(constraint.columns, `${constraint.id}.columns`);
      positive(constraint.cellSize, `${constraint.id}.cellSize`);
      if (!Number.isInteger(constraint.rows) || !Number.isInteger(constraint.columns)) throw new Error(`${constraint.id} rows and columns must be integers.`);
      if (constraint.rows !== 8 || constraint.columns !== 8) throw new Error(`${constraint.id} must declare the Block Forge 8x8 grid.`);
      if (family.bounds.width !== constraint.columns * constraint.cellSize || family.bounds.height !== constraint.rows * constraint.cellSize) {
        throw new Error(`${constraint.id} family bounds do not match exact square cells.`);
      }
    } else if (constraint.kind === "fixed-aspect-ratio") {
      positive(constraint.ratio, `${constraint.id}.ratio`);
      if (Math.abs(family.bounds.width / family.bounds.height - constraint.ratio) > 1e-9) {
        throw new Error(`${constraint.id} fixed aspect ratio is not satisfied.`);
      }
    } else if (constraint.kind === "fixed-size") {
      positive(constraint.width, `${constraint.id}.width`);
      positive(constraint.height, `${constraint.id}.height`);
      if (family.bounds.width !== constraint.width || family.bounds.height !== constraint.height) {
        throw new Error(`${constraint.id} fixed size is not satisfied.`);
      }
    } else if (constraint.kind === "minimum-touch-target") {
      positive(constraint.minimumWidth, `${constraint.id}.minimumWidth`);
      positive(constraint.minimumHeight, `${constraint.id}.minimumHeight`);
      if (family.bounds.width < constraint.minimumWidth || family.bounds.height < constraint.minimumHeight) {
        throw new Error(`${constraint.id} minimum touch target is not satisfied.`);
      }
    } else if (constraint.kind === "grid-alignment") {
      positive(constraint.gridSize, `${constraint.id}.gridSize`);
      for (const value of [family.bounds.x, family.bounds.y, family.bounds.width, family.bounds.height]) {
        if (value % constraint.gridSize !== 0) throw new Error(`${constraint.id} grid alignment is not satisfied.`);
      }
    } else if (constraint.kind === "safe-area") {
      validateBox(constraint.bounds, `${constraint.id}.bounds`, { allowZeroOrigin: false });
      if (constraint.bounds.x + constraint.bounds.width > canvas.width || constraint.bounds.y + constraint.bounds.height > canvas.height) {
        throw new Error(`${constraint.id} safe area escapes the canvas.`);
      }
      if (family && (
        family.bounds.x < constraint.bounds.x || family.bounds.y < constraint.bounds.y ||
        family.bounds.x + family.bounds.width > constraint.bounds.x + constraint.bounds.width ||
        family.bounds.y + family.bounds.height > constraint.bounds.y + constraint.bounds.height
      )) throw new Error(`${constraint.id} family escapes the safe area.`);
    } else if (constraint.kind === "shared-footprint") {
      for (const stateId of constraint.stateIds ?? []) {
        if (!family.states.some((state) => state.id === stateId)) throw new Error(`${constraint.id} references missing state ${stateId}.`);
      }
    } else if (constraint.kind === "consistent-anchor") {
      if (!family.anchor) throw new Error(`${constraint.id} requires a declared family anchor.`);
      for (const state of family.states) {
        if (state.anchor && JSON.stringify(state.anchor) !== JSON.stringify(family.anchor)) {
          throw new Error(`${constraint.id} state anchor drift is not permitted.`);
        }
      }
    } else {
      throw new Error(`Unsupported geometry constraint kind: ${constraint.kind}`);
    }
  }
}

export function resolveComponentState(family, stateId) {
  const state = family.states.find((candidate) => candidate.id === stateId);
  if (!state) throw new Error(`Unknown state ${stateId} for ${family.id}.`);
  const overrides = new Map(state.layerOverrides.map((override) => [override.layerId, override.properties]));
  return {
    familyId: family.id,
    stateId,
    bounds: family.bounds,
    layers: family.baseLayers.map((layer) => ({ ...layer, ...(overrides.get(layer.id) ?? {}) }))
  };
}

export function validateDraft(draft, { requireResolved = false } = {}) {
  if (draft.schemaVersion !== 1) throw new Error("Unsupported draft schemaVersion.");
  positive(draft.canvas?.width, "canvas.width");
  positive(draft.canvas?.height, "canvas.height");
  if (!Array.isArray(draft.components)) throw new Error("components must be an array.");
  const materials = validateMaterials(draft.materials);
  if (requireResolved && draft.unresolved?.length) {
    throw new Error(`Draft has ${draft.unresolved.length} unresolved review item(s).`);
  }

  const ids = new Set();
  for (const component of draft.components) {
    if (!/^[a-z][a-z0-9-]*$/.test(component.id ?? "")) {
      throw new Error(`Invalid component ID: ${component.id}`);
    }
    if (ids.has(component.id)) throw new Error(`Duplicate component ID: ${component.id}`);
    ids.add(component.id);
    for (const key of ["x", "y", "width", "height"]) number(component.bounds?.[key], `${component.id}.bounds.${key}`);
    positive(component.bounds.width, `${component.id}.bounds.width`);
    positive(component.bounds.height, `${component.id}.bounds.height`);
    if (!component.allowOverflow && (
      component.bounds.x < 0 || component.bounds.y < 0 ||
      component.bounds.x + component.bounds.width > draft.canvas.width ||
      component.bounds.y + component.bounds.height > draft.canvas.height
    )) throw new Error(`${component.id} must be contained within the declared canvas.`);
    if (!Array.isArray(component.layers) || component.layers.length === 0) {
      throw new Error(`${component.id} must contain at least one editable layer.`);
    }
    const layerIds = new Set();
    for (const layer of component.layers) {
      if (!/^[a-z][a-z0-9-]*$/.test(layer.id ?? "")) throw new Error(`Invalid layer ID in ${component.id}.`);
      if (layerIds.has(layer.id)) throw new Error(`Duplicate layer ID ${layer.id} in ${component.id}.`);
      layerIds.add(layer.id);
      if (!["rect", "ellipse", "path", "text"].includes(layer.kind)) {
        throw new Error(`Unsupported layer kind ${layer.kind} in ${component.id}.`);
      }
      validateLayerGeometry(layer, `${component.id}.${layer.id}`);
      if ("sourceImage" in layer || "imageHref" in layer || layer.kind === "image") {
        throw new Error(`Reference pixels are forbidden in ${component.id}/${layer.id}.`);
      }
      for (const field of ["fillMaterial", "strokeMaterial", "filter"]) {
        if (layer[field] !== undefined && !materials.has(layer[field])) {
          throw new Error(`Unknown material ${layer[field]} in ${component.id}/${layer.id}.`);
        }
      }
      if (layer.fillMaterial && !materials.get(layer.fillMaterial).kind.endsWith("gradient")) {
        throw new Error(`Fill material ${layer.fillMaterial} must be a gradient.`);
      }
      if (layer.strokeMaterial && !materials.get(layer.strokeMaterial).kind.endsWith("gradient")) {
        throw new Error(`Stroke material ${layer.strokeMaterial} must be a gradient.`);
      }
      if (layer.filter && !["glow", "shadow"].includes(materials.get(layer.filter).kind)) {
        throw new Error(`Filter material ${layer.filter} must be a glow or shadow.`);
      }
      if (layer.blendMode !== undefined && !["normal", "screen", "multiply", "overlay", "lighten", "color-dodge"].includes(layer.blendMode)) {
        throw new Error(`Unsupported blend mode ${layer.blendMode} in ${component.id}/${layer.id}.`);
      }
    }
  }
  const families = draft.componentFamilies ?? [];
  if (!Array.isArray(families)) throw new Error("componentFamilies must be an array.");
  const familyIds = new Set();
  for (const family of families) validateFamily(family, draft.canvas, familyIds);
  validateGeometryConstraints(draft.geometryConstraints ?? [], families, draft.canvas);
  return draft;
}

function coordinate(value, fallback) {
  if (value === undefined) return fallback;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^-?\d+(?:\.\d+)?%$/.test(value)) return value;
  throw new Error(`Invalid material coordinate: ${value}`);
}

function materialSvg(material) {
  if (material.kind === "linear-gradient") {
    const stops = material.stops.map((stop) => `<stop offset="${stop.offset * 100}%" stop-color="${escapeXml(stop.color)}" stop-opacity="${stop.opacity ?? 1}"/>`).join("");
    return `<linearGradient id="${escapeXml(material.id)}" x1="${coordinate(material.x1, "0%")}" y1="${coordinate(material.y1, "0%")}" x2="${coordinate(material.x2, "100%")}" y2="${coordinate(material.y2, "100%")}">${stops}</linearGradient>`;
  }
  if (material.kind === "radial-gradient") {
    const stops = material.stops.map((stop) => `<stop offset="${stop.offset * 100}%" stop-color="${escapeXml(stop.color)}" stop-opacity="${stop.opacity ?? 1}"/>`).join("");
    return `<radialGradient id="${escapeXml(material.id)}" cx="${coordinate(material.cx, "50%")}" cy="${coordinate(material.cy, "50%")}" r="${coordinate(material.r, "50%")}">${stops}</radialGradient>`;
  }
  const opacity = material.opacity ?? 1;
  if (material.kind === "shadow") {
    return `<filter id="${escapeXml(material.id)}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="${material.blur}" result="blur"/><feOffset in="blur" dx="${material.dx ?? 0}" dy="${material.dy ?? 0}" result="offset-blur"/><feFlood flood-color="${escapeXml(material.color)}" flood-opacity="${opacity}" result="color"/><feComposite in="color" in2="offset-blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  }
  return `<filter id="${escapeXml(material.id)}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="${material.blur}" result="blur"/><feFlood flood-color="${escapeXml(material.color)}" flood-opacity="${opacity}" result="color"/><feComposite in="color" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}

function defsSvg(materials = []) {
  if (!materials.length) return "";
  return `  <defs>\n    ${materials.map(materialSvg).join("\n    ")}\n  </defs>\n`;
}

function layerSvg(layer) {
  const style = layer.blendMode && layer.blendMode !== "normal" ? ` style="mix-blend-mode:${layer.blendMode}"` : "";
  const filter = layer.filter ? ` filter="url(#${escapeXml(layer.filter)})"` : "";
  const common = `id="${escapeXml(layer.id)}" opacity="${layer.opacity ?? 1}"${filter}${style}`;
  const fill = layer.fillMaterial ? `url(#${escapeXml(layer.fillMaterial)})` : (layer.fill ?? "none");
  const stroke = layer.strokeMaterial ? `url(#${escapeXml(layer.strokeMaterial)})` : (layer.stroke ?? "none");
  const paint = `fill="${escapeXml(fill)}" stroke="${escapeXml(stroke)}" stroke-width="${layer.strokeWidth ?? 0}"`;
  if (layer.kind === "rect") {
    return `<rect ${common} x="${layer.x ?? 0}" y="${layer.y ?? 0}" width="${number(layer.width, `${layer.id}.width`)}" height="${number(layer.height, `${layer.id}.height`)}" rx="${layer.radius ?? 0}" ${paint}/>`;
  }
  if (layer.kind === "ellipse") {
    return `<ellipse ${common} cx="${number(layer.cx, `${layer.id}.cx`)}" cy="${number(layer.cy, `${layer.id}.cy`)}" rx="${number(layer.rx, `${layer.id}.rx`)}" ry="${number(layer.ry, `${layer.id}.ry`)}" ${paint}/>`;
  }
  if (layer.kind === "path") {
    return `<path ${common} d="${escapeXml(layer.d)}" ${paint}/>`;
  }
  return `<text ${common} x="${layer.x ?? 0}" y="${layer.y ?? 0}" fill="${escapeXml(layer.fill ?? "#ffffff")}" font-family="${escapeXml(layer.fontFamily ?? "sans-serif")}" font-size="${layer.fontSize ?? 16}" text-anchor="${escapeXml(layer.textAnchor ?? "start")}">${escapeXml(layer.value ?? "")}</text>`;
}

export function componentSvg(component, materials = []) {
  const { width, height } = component.bounds;
  const layers = component.layers.map(layerSvg).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-component-id="${escapeXml(component.id)}">
${defsSvg(materials)}
  ${layers}
</svg>
`;
}

export function familyStateSvg(family, stateId, materials = []) {
  const resolved = resolveComponentState(family, stateId);
  const padding = family.effectPadding;
  const width = family.bounds.width + padding.left + padding.right;
  const height = family.bounds.height + padding.top + padding.bottom;
  const layers = resolved.layers.map(layerSvg).join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-component-family-id="${escapeXml(family.id)}" data-state-id="${escapeXml(stateId)}">
${defsSvg(materials)}
  <g id="${escapeXml(family.id)}-${escapeXml(stateId)}" transform="translate(${padding.left} ${padding.top})">
    ${layers}
  </g>
</svg>
`;
}

export function stateSheetSvg(family, materials = []) {
  const gap = 32;
  const labelHeight = 36;
  const itemWidth = family.bounds.width + family.effectPadding.left + family.effectPadding.right;
  const itemHeight = family.bounds.height + family.effectPadding.top + family.effectPadding.bottom;
  const width = family.states.length * itemWidth + Math.max(0, family.states.length - 1) * gap;
  const height = itemHeight + labelHeight;
  const states = family.states.map((state, index) => {
    const resolved = resolveComponentState(family, state.id);
    const x = index * (itemWidth + gap);
    const layers = resolved.layers.map(layerSvg).join("\n        ");
    return `    <g id="${escapeXml(family.id)}-${escapeXml(state.id)}" transform="translate(${x + family.effectPadding.left} ${labelHeight + family.effectPadding.top})">
        ${layers}
      </g>
      <text x="${x + itemWidth / 2}" y="24" fill="#ffffff" font-family="sans-serif" font-size="18" text-anchor="middle">${escapeXml(state.id)}</text>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-review-surface="state-comparison">
${defsSvg(materials)}
  <rect width="100%" height="100%" fill="#20242b"/>
${states}
</svg>
`;
}

export function slicingPreviewSvg(family, materials = []) {
  if (!family.slicing) throw new Error(`${family.id} does not declare slicing metadata.`);
  const stateId = family.states[0].id;
  const resolved = resolveComponentState(family, stateId);
  const { width, height } = family.bounds;
  const borders = family.slicing.fixedBorders;
  const safe = family.slicing.contentSafeRegion;
  const layers = resolved.layers.map(layerSvg).join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-review-surface="slicing-preview" data-component-family-id="${escapeXml(family.id)}">
${defsSvg(materials)}
  <g id="${escapeXml(family.id)}-${escapeXml(stateId)}">
    ${layers}
  </g>
  <g id="slicing-guides" fill="none" pointer-events="none">
    <path d="M ${borders.left} 0 V ${height} M ${width - borders.right} 0 V ${height} M 0 ${borders.top} H ${width} M 0 ${height - borders.bottom} H ${width}" stroke="#00e5ff" stroke-width="2" stroke-dasharray="8 6"/>
    <rect x="${safe.x}" y="${safe.y}" width="${safe.width}" height="${safe.height}" stroke="#ffe066" stroke-width="2" stroke-dasharray="6 4"/>
    <rect x="${family.slicing.stretchRegion.x}" y="${family.slicing.stretchRegion.y}" width="${family.slicing.stretchRegion.width}" height="${family.slicing.stretchRegion.height}" stroke="#ff5edb" stroke-width="2"/>
  </g>
</svg>
`;
}

export function reviewScreenSvg(draft, { overlays = false } = {}) {
  const legacy = draft.components.map((component) => {
    const layers = component.layers.map(layerSvg).join("\n      ");
    return `    <g id="${escapeXml(component.id)}" transform="translate(${component.bounds.x} ${component.bounds.y})">\n      ${layers}\n    </g>`;
  });
  const families = (draft.componentFamilies ?? []).map((family) => {
    const state = resolveComponentState(family, family.states[0].id);
    const layers = state.layers.map(layerSvg).join("\n      ");
    const grid = (draft.geometryConstraints ?? []).find((constraint) =>
      constraint.kind === "square-grid" && constraint.familyId === family.id
    );
    const gridGuides = grid ? [
      ...Array.from({ length: grid.columns - 1 }, (_, index) => `<path d="M ${(index + 1) * grid.cellSize} 0 V ${family.bounds.height}"/>`),
      ...Array.from({ length: grid.rows - 1 }, (_, index) => `<path d="M 0 ${(index + 1) * grid.cellSize} H ${family.bounds.width}"/>`)
    ].join("") : "";
    const anchorGuide = family.anchor
      ? `<path d="M ${family.anchor.x - 12} ${family.anchor.y} H ${family.anchor.x + 12} M ${family.anchor.x} ${family.anchor.y - 12} V ${family.anchor.y + 12}"/><circle cx="${family.anchor.x}" cy="${family.anchor.y}" r="6"/>`
      : "";
    const guides = overlays ? `<rect id="${escapeXml(family.id)}-bounds" width="${family.bounds.width}" height="${family.bounds.height}" fill="none" stroke="#00e5ff" stroke-width="2" stroke-dasharray="8 6"/>
      <rect id="${escapeXml(family.id)}-safe" x="${family.contentSafeRegion.x}" y="${family.contentSafeRegion.y}" width="${family.contentSafeRegion.width}" height="${family.contentSafeRegion.height}" fill="none" stroke="#ffe066" stroke-width="2" stroke-dasharray="5 4"/>` : "";
    const constraintGuides = overlays && (gridGuides || anchorGuide)
      ? `<g id="${escapeXml(family.id)}-constraint-guides" fill="none" stroke="#76ff7a" stroke-width="2">${gridGuides}${anchorGuide}</g>`
      : "";
    return `    <g id="${escapeXml(family.id)}" transform="translate(${family.bounds.x} ${family.bounds.y})">\n      ${layers}\n      ${guides}\n      ${constraintGuides}\n    </g>`;
  });
  const safeArea = overlays ? `  <rect id="canvas-safe-area" x="64" y="96" width="${draft.canvas.width - 128}" height="${draft.canvas.height - 192}" fill="none" stroke="#ff5edb" stroke-width="3" stroke-dasharray="12 8"/>\n` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${draft.canvas.width}" height="${draft.canvas.height}" viewBox="0 0 ${draft.canvas.width} ${draft.canvas.height}" data-job-id="${escapeXml(draft.jobId)}" data-review-overlays="${overlays}">
${defsSvg(draft.materials)}
  <rect id="screen-background" width="100%" height="100%" fill="${escapeXml(draft.tokens?.background ?? "#10131c")}"/>
${[...legacy, ...families].join("\n")}
${safeArea}</svg>
`;
}

export function screenSvg(draft) {
  const symbols = draft.components.map((component) => {
    const layers = component.layers.map(layerSvg).join("\n      ");
    return `    <g id="${escapeXml(component.id)}" transform="translate(${component.bounds.x} ${component.bounds.y})">\n      ${layers}\n    </g>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${draft.canvas.width}" height="${draft.canvas.height}" viewBox="0 0 ${draft.canvas.width} ${draft.canvas.height}" data-job-id="${escapeXml(draft.jobId)}">
${defsSvg(draft.materials)}
  <rect id="screen-background" width="100%" height="100%" fill="${escapeXml(draft.tokens?.background ?? "#10131c")}"/>
${symbols}
</svg>
`;
}

export function parseArgs(argv) {
  const [command, ...rest] = argv;
  const values = {};
  for (let index = 0; index < rest.length; index += 1) {
    const item = rest[index];
    if (!item.startsWith("--")) throw new Error(`Unexpected argument: ${item}`);
    const key = item.slice(2);
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    values[key] = value;
    index += 1;
  }
  return { command, values };
}
