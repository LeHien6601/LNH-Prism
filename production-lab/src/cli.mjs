#!/usr/bin/env node
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  componentSvg,
  AUTHORITY_ROLES,
  atomicWriteFile,
  createProjectManifest,
  ensureDir,
  escapeXml,
  familyStateSvg,
  imageDimensions,
  jobRoot,
  parseArgs,
  projectRoot,
  readJson,
  safeJobId,
  safeProjectId,
  safeReferenceId,
  screenSvg,
  sha256,
  slicingPreviewSvg,
  stateSheetSvg,
  reviewScreenSvg,
  validateDraft,
  validateProjectManifest,
  writeJson
} from "./lib.mjs";
import { pngAlphaStats, renderPng } from "./raster.mjs";

function required(values, key) {
  if (!values[key]) throw new Error(`Missing required --${key}.`);
  return values[key];
}

async function pathExists(filename) {
  try {
    await access(filename);
    return true;
  } catch {
    return false;
  }
}

async function loadProject(projectId) {
  const root = projectRoot(projectId);
  const filename = path.join(root, "project.json");
  return { root, filename, project: validateProjectManifest(await readJson(filename)) };
}

async function initProject(values) {
  const projectId = safeProjectId(required(values, "project"));
  const root = projectRoot(projectId);
  const filename = path.join(root, "project.json");
  if (await pathExists(filename)) throw new Error(`Project ${projectId} already exists.`);
  const project = createProjectManifest({ projectId, displayName: required(values, "name") });
  await writeJson(filename, project);
  console.log(`Initialized project ${projectId}.`);
}

async function addReference(values) {
  const { root, filename, project } = await loadProject(required(values, "project"));
  const referenceId = safeReferenceId(required(values, "reference"));
  if (project.references.some((reference) => reference.id === referenceId)) {
    throw new Error(`Reference ${referenceId} already exists.`);
  }
  const authorityRole = required(values, "role");
  if (!AUTHORITY_ROLES.includes(authorityRole)) throw new Error(`Unsupported authority role: ${authorityRole}`);
  const input = path.resolve(required(values, "input"));
  await access(input);
  const extension = path.extname(input).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(extension)) throw new Error("Reference must be PNG or JPEG.");
  const bytes = await readFile(input);
  const dimensions = imageDimensions(bytes, extension);
  const managedRelativePath = `references/${referenceId}/source${extension}`;
  const target = path.join(root, ...managedRelativePath.split("/"));
  if (await pathExists(target)) throw new Error(`Managed reference target already exists for ${referenceId}.`);
  await atomicWriteFile(target, bytes);
  project.references.push({
    id: referenceId,
    path: managedRelativePath,
    originalPath: input,
    sha256: await sha256(target),
    width: dimensions.width,
    height: dimensions.height,
    mediaType: extension === ".png" ? "image/png" : "image/jpeg",
    status: values.status ?? "approved",
    authorityRole,
    permittedUse: values.use ?? "analysis-and-comparison-only",
    version: required(values, "version"),
    provenanceNote: required(values, "note"),
    supersededBy: values["superseded-by"]
  });
  validateProjectManifest(project);
  await writeJson(filename, project);
  console.log(`Registered ${referenceId} as ${authorityRole}.`);
}

async function listReferences(values) {
  const { project } = await loadProject(required(values, "project"));
  console.log(JSON.stringify(project.references, null, 2));
}

async function validateReferences(values) {
  const { root, project } = await loadProject(required(values, "project"));
  for (const reference of project.references) {
    const filename = path.resolve(root, ...reference.path.split("/"));
    if (!filename.startsWith(`${root}${path.sep}`)) throw new Error(`Unsafe managed path for ${reference.id}.`);
    await access(filename);
    if (await sha256(filename) !== reference.sha256) throw new Error(`Changed reference hash: ${reference.id}`);
  }
  console.log(`Validated ${project.references.length} registered reference(s).`);
}

async function createJob(values) {
  const { filename, project } = await loadProject(required(values, "project"));
  const jobId = safeJobId(required(values, "job"));
  if (project.jobs.some((job) => job.id === jobId) || await pathExists(path.join(jobRoot(jobId), "job.json"))) {
    throw new Error(`Job ${jobId} already exists.`);
  }
  const referenceIds = required(values, "references").split(",").map((id) => safeReferenceId(id.trim()));
  const references = referenceIds.map((id) => {
    const reference = project.references.find((entry) => entry.id === id);
    if (!reference) throw new Error(`Unregistered reference: ${id}`);
    if (reference.status !== "approved") throw new Error(`Reference ${id} is ${reference.status}, not approved.`);
    return reference;
  });
  const root = jobRoot(jobId);
  await writeJson(path.join(root, "job.json"), {
    schemaVersion: 2,
    projectId: project.projectId,
    jobId,
    status: "draft",
    createdAt: new Date().toISOString(),
    referenceIds,
    reference: {
      path: references[0].originalPath,
      sha256: references[0].sha256,
      width: references[0].width,
      height: references[0].height,
      mediaType: references[0].mediaType,
      permittedUse: references[0].permittedUse
    },
    references: references.map(({ id, path: managedPath, sha256: hash, authorityRole, version, width, height, mediaType, permittedUse, provenanceNote }) => ({
      id,
      projectPath: managedPath,
      sha256: hash,
      authorityRole,
      version,
      width,
      height,
      mediaType,
      permittedUse,
      provenanceNote
    })),
    scope: required(values, "scope"),
    excludedContent: values.exclude ? values.exclude.split(",").map((item) => item.trim()) : [],
    unresolved: []
  });
  project.jobs.push({ id: jobId, referenceIds, status: "draft" });
  validateProjectManifest(project);
  await writeJson(filename, project);
  console.log(`Created job ${jobId} with ${referenceIds.length} reference authority record(s).`);
}

async function projectStatus(values) {
  const { project } = await loadProject(required(values, "project"));
  console.log(JSON.stringify({
    projectId: project.projectId,
    displayName: project.displayName,
    approvalStatus: project.approval.status,
    promotionStatus: project.promotion.status,
    referenceCount: project.references.length,
    jobCount: project.jobs.length
  }, null, 2));
}

async function auditProject(values) {
  await validateReferences(values);
  const { project } = await loadProject(required(values, "project"));
  const findings = [];
  for (const job of project.jobs) {
    const authorities = new Set(job.referenceIds.map((id) =>
      project.references.find((reference) => reference.id === id)?.authorityRole
    ));
    if (!authorities.has("primary-geometry")) {
      findings.push({ classification: "unresolved-human-decision", jobId: job.id, message: "No primary-geometry authority is registered." });
    }
  }
  const report = { schemaVersion: 1, projectId: project.projectId, findingCount: findings.length, findings };
  await writeJson(path.join(projectRoot(project.projectId), "audit-report.json"), report);
  console.log(JSON.stringify(report, null, 2));
}

async function validateJob(values) {
  const requestedJobId = safeJobId(required(values, "job"));
  const root = jobRoot(requestedJobId);
  const draft = validateDraft(await readJson(path.join(root, "analysis", "draft.json")));
  if (draft.jobId !== requestedJobId) throw new Error(`Draft jobId ${draft.jobId} does not match ${requestedJobId}.`);
  const report = {
    schemaVersion: 1,
    projectId: draft.projectId ?? null,
    jobId: draft.jobId,
    status: "valid",
    canvas: draft.canvas,
    componentCount: draft.components.length,
    componentFamilyCount: draft.componentFamilies?.length ?? 0,
    stateCount: (draft.componentFamilies ?? []).reduce((sum, family) => sum + family.states.length, 0),
    geometryConstraintCount: draft.geometryConstraints?.length ?? 0,
    checks: {
      positiveFiniteGeometry: "pass",
      canvasContainment: "pass",
      stableIds: "pass",
      stateInheritance: "pass",
      sharedStateFootprints: "pass",
      slots: "pass",
      effectPadding: "pass",
      scalableRegions: "pass",
      declaredGeometryConstraints: "pass",
      referencePixelBoundary: "pass"
    }
  };
  await writeJson(path.join(root, "validation", "constraint-report.json"), report);
  console.log(JSON.stringify(report, null, 2));
}

async function renderEvidence(values) {
  const requestedJobId = safeJobId(required(values, "job"));
  const root = jobRoot(requestedJobId);
  const draftPath = path.join(root, "analysis", "draft.json");
  const draft = validateDraft(await readJson(draftPath));
  if (draft.jobId !== requestedJobId) throw new Error(`Draft jobId ${draft.jobId} does not match ${requestedJobId}.`);
  if (!(draft.componentFamilies?.length > 0)) throw new Error("Evidence rendering requires componentFamilies.");
  const outputRoot = path.join(root, "review");
  const assets = [];
  for (const family of draft.componentFamilies) {
    for (const state of family.states) {
      const svg = familyStateSvg(family, state.id, draft.materials);
      const relativeBase = `isolated/${family.id}-${state.id}`;
      const svgPath = path.join(outputRoot, `${relativeBase}.svg`);
      const pngPath = path.join(outputRoot, `${relativeBase}.png`);
      await atomicWriteFile(svgPath, svg);
      const png = renderPng(svg);
      await atomicWriteFile(pngPath, png);
      const alpha = pngAlphaStats(png);
      const expectedWidth = family.bounds.width + family.effectPadding.left + family.effectPadding.right;
      const expectedHeight = family.bounds.height + family.effectPadding.top + family.effectPadding.bottom;
      if (alpha.width !== expectedWidth || alpha.height !== expectedHeight) throw new Error(`Native dimensions drifted for ${family.id}/${state.id}.`);
      if (alpha.transparentPixels === 0 || alpha.minimumAlpha === 255) throw new Error(`Transparent alpha is missing for ${family.id}/${state.id}.`);
      if (alpha.edgeOpaquePixels > 0) throw new Error(`Effect padding is clipped for ${family.id}/${state.id}.`);
      if (svg.includes("<image")) throw new Error(`Reference pixels are forbidden in ${family.id}/${state.id}.`);
      assets.push({
        familyId: family.id,
        stateId: state.id,
        svgPath: `${relativeBase}.svg`,
        pngPath: `${relativeBase}.png`,
        svgSha256: await sha256(svgPath),
        pngSha256: alpha.sha256,
        nativeDimensions: { width: alpha.width, height: alpha.height },
        alpha
      });
    }
    const sheet = stateSheetSvg(family, draft.materials);
    await atomicWriteFile(path.join(outputRoot, `states/${family.id}.svg`), sheet);
    await atomicWriteFile(path.join(outputRoot, `states/${family.id}.png`), renderPng(sheet));
    if (family.slicing) {
      const slicing = slicingPreviewSvg(family, draft.materials);
      await atomicWriteFile(path.join(outputRoot, `slicing/${family.id}.svg`), slicing);
      await atomicWriteFile(path.join(outputRoot, `slicing/${family.id}.png`), renderPng(slicing));
    }
  }
  const nativeSvg = reviewScreenSvg(draft);
  const overlaySvg = reviewScreenSvg(draft, { overlays: true });
  await atomicWriteFile(path.join(outputRoot, "screens/native.svg"), nativeSvg);
  await atomicWriteFile(path.join(outputRoot, "screens/geometry-overlays.svg"), overlaySvg);
  for (const [id, width] of [["native", draft.canvas.width], ["phone", 360], ["thumbnail", 180]]) {
    await atomicWriteFile(path.join(outputRoot, `screens/${id}.png`), renderPng(nativeSvg, { width }));
  }
  await atomicWriteFile(path.join(outputRoot, "screens/geometry-overlays.png"), renderPng(overlaySvg));

  const job = await readJson(path.join(root, "job.json"));
  const reference = job.references?.[0];
  const referenceUrl = reference
    ? pathToFileURL(path.resolve(projectRoot(job.projectId), ...reference.projectPath.split("/"))).href
    : pathToFileURL(path.resolve(root, job.reference.path)).href;
  const stateLinks = draft.componentFamilies.map((family) =>
    `<a href="states/${family.id}.svg">${escapeXml(family.id)} states</a>`
  ).join("");
  const isolatedLinks = assets.map((asset) =>
    `<a href="${asset.pngPath}">${escapeXml(asset.familyId)}/${escapeXml(asset.stateId)}</a>`
  ).join("");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escapeXml(requestedJobId)} review</title>
<style>
:root{color-scheme:dark}body{margin:0;background:#14171c;color:#f7f7f7;font:14px system-ui}.bar{position:sticky;top:0;z-index:2;padding:12px 16px;background:#20242b;display:flex;gap:14px;align-items:center;flex-wrap:wrap}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;padding:16px}.card{background:#20242b;border:1px solid #3d4552;border-radius:10px;padding:12px}.stage{position:relative;max-width:520px;margin:auto;aspect-ratio:${draft.canvas.width}/${draft.canvas.height};overflow:hidden;background:#000}.stage img,.stage object{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.reconstruction{opacity:.5}.checker{background-color:#ddd;background-image:linear-gradient(45deg,#aaa 25%,transparent 25%),linear-gradient(-45deg,#aaa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#aaa 75%),linear-gradient(-45deg,transparent 75%,#aaa 75%);background-size:24px 24px;background-position:0 0,0 12px,12px -12px,-12px 0}.light{background:#f5f5f5}.dark{background:#111}.links{display:flex;flex-wrap:wrap;gap:8px}.links a{color:#71d7ff}
</style></head><body>
<div class="bar"><strong>${escapeXml(requestedJobId)}</strong><label>Overlay <input id="opacity" type="range" min="0" max="100" value="50"></label><span>Reference is review-only; outputs contain reconstructed geometry.</span></div>
<div class="grid">
<section class="card"><h2>Side by side</h2><div class="grid"><img src="${referenceUrl}" alt="Approved review reference" style="width:100%"><object data="screens/native.svg" type="image/svg+xml"></object></div></section>
<section class="card"><h2>Adjustable overlay</h2><div class="stage"><img src="${referenceUrl}" alt="Approved review reference"><object class="reconstruction" data="screens/native.svg" type="image/svg+xml"></object></div></section>
<section class="card"><h2>Difference view</h2><div class="stage"><img src="${referenceUrl}" alt="Approved review reference"><object class="reconstruction" style="mix-blend-mode:difference;opacity:1" data="screens/native.svg" type="image/svg+xml"></object></div></section>
<section class="card"><h2>Reconstruction only</h2><object data="screens/native.svg" type="image/svg+xml" style="width:100%"></object></section>
<section class="card"><h2>Geometry and safe areas</h2><object data="screens/geometry-overlays.svg" type="image/svg+xml" style="width:100%"></object></section>
<section class="card"><h2>Target sizes</h2><div class="links"><a href="screens/native.png">native</a><a href="screens/phone.png">phone</a><a href="screens/thumbnail.png">thumbnail</a></div></section>
<section class="card"><h2>Transparency backgrounds</h2><div class="grid"><div class="light"><img src="${assets[0].pngPath}" style="width:100%"></div><div class="dark"><img src="${assets[0].pngPath}" style="width:100%"></div><div class="checker"><img src="${assets[0].pngPath}" style="width:100%"></div></div></section>
<section class="card"><h2>State comparisons</h2><div class="links">${stateLinks}</div></section>
<section class="card"><h2>Component isolation</h2><div class="links">${isolatedLinks}</div></section>
</div><script>const slider=document.querySelector("#opacity");const layer=document.querySelector(".reconstruction");slider.addEventListener("input",()=>layer.style.opacity=slider.value/100);</script></body></html>`;
  await atomicWriteFile(path.join(outputRoot, "index.html"), html);
  const manifest = {
    schemaVersion: 1,
    projectId: draft.projectId ?? null,
    jobId: draft.jobId,
    draftSha256: await sha256(draftPath),
    renderer: { id: "@resvg/resvg-js", version: "2.6.2" },
    assets,
    reviewSurfaces: {
      index: "index.html",
      stateSheets: draft.componentFamilies.map((family) => `states/${family.id}.svg`),
      slicingPreviews: draft.componentFamilies.filter((family) => family.slicing).map((family) => `slicing/${family.id}.svg`),
      screens: ["screens/native.png", "screens/phone.png", "screens/thumbnail.png", "screens/geometry-overlays.png"]
    }
  };
  await writeJson(path.join(outputRoot, "manifest.json"), manifest);
  await writeJson(path.join(outputRoot, "mobile-readability.json"), {
    schemaVersion: 1,
    projectId: draft.projectId ?? null,
    jobId: draft.jobId,
    status: "inspection-required",
    inspected: { native: false, phone: false, thumbnail: false },
    checks: ["text-hierarchy", "silhouette-recognition", "target-state-recognition", "icon-readability", "touch-target-declarations", "interactive-separation", "excessive-detail", "effect-visibility"]
  });
  console.log(`Rendered ${assets.length} transparent state asset(s) and review surfaces.`);
}

async function recordMobileReview(values) {
  const requestedJobId = safeJobId(required(values, "job"));
  const root = jobRoot(requestedJobId);
  const reviewPath = path.join(root, "review", "mobile-readability.json");
  const report = await readJson(reviewPath);
  const reviewer = required(values, "reviewer").trim();
  if (!reviewer) throw new Error("Reviewer must not be empty.");
  report.status = "inspected";
  report.inspected = { native: true, phone: true, thumbnail: true };
  report.reviewer = reviewer;
  report.inspectedAt = new Date().toISOString();
  report.findings = required(values, "findings");
  report.artisticApproval = false;
  await writeJson(reviewPath, report);
  console.log(`Recorded native, phone, and thumbnail inspection for ${requestedJobId}.`);
}

async function initJob(values) {
  const jobId = safeJobId(required(values, "job"));
  const input = path.resolve(required(values, "input"));
  await access(input);
  const extension = path.extname(input).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(extension)) throw new Error("Input must be PNG or JPEG.");
  const root = jobRoot(jobId);
  if (await pathExists(path.join(root, "job.json"))) throw new Error(`Job ${jobId} already exists.`);
  const inputDir = path.join(root, "input");
  await ensureDir(inputDir);
  const target = path.join(inputDir, `reference${extension}`);
  const bytes = await readFile(input);
  const dimensions = imageDimensions(bytes, extension);
  await atomicWriteFile(target, bytes);
  await writeJson(path.join(root, "job.json"), {
    schemaVersion: 1,
    jobId,
    status: "intake-complete",
    createdAt: new Date().toISOString(),
    reference: {
      path: `input/reference${extension}`,
      originalName: path.basename(input),
      mediaType: extension === ".png" ? "image/png" : "image/jpeg",
      ...dimensions,
      sha256: await sha256(target),
      permittedUse: "analysis-and-comparison-only"
    }
  });
  console.log(`Initialized ${jobId} (${dimensions.width}x${dimensions.height}).`);
}

async function prepareJob(values) {
  const root = jobRoot(required(values, "job"));
  const job = await readJson(path.join(root, "job.json"));
  const draft = {
    schemaVersion: 1,
    jobId: job.jobId,
    referenceSha256: job.reference.sha256,
    canvas: { width: job.reference.width, height: job.reference.height },
    observations: [],
    tokens: { background: "#10131c", palette: [], spacing: [], radii: [] },
    components: [],
    unresolved: [
      {
        id: "codex-visual-analysis-required",
        question: "Codex must inspect the screenshot and reconstruct its component inventory, geometry, tokens, text slots, and visible states.",
        owner: "codex"
      }
    ],
    analysisAgent: {
      kind: "codex-direct",
      skill: "reconstruct-game-ui",
      preparedAt: new Date().toISOString()
    },
    policy: {
      sourcePixelsInProduction: false,
      editableGeometryRequired: true,
      humanApprovalRequired: true
    }
  };
  validateDraft(draft);
  await writeJson(path.join(root, "analysis", "draft.json"), draft);
  const authorityPacket = (job.references ?? []).map((reference) =>
    `- ${reference.id}: role=${reference.authorityRole}; version=${reference.version}; sha256=${reference.sha256}; path=${path.resolve(projectRoot(job.projectId), ...reference.projectPath.split("/"))}`
  ).join("\n");
  const task = `# Codex task: reconstruct ${job.jobId}

Use \`$reconstruct-game-ui\` to process this job.

- Reference: \`${path.resolve(root, job.reference.path)}\`
- Canvas: \`${job.reference.width} x ${job.reference.height}\`
- Reference SHA-256: \`${job.reference.sha256}\`
- Draft to edit: \`${path.join(root, "analysis", "draft.json")}\`

Project ID: \`${job.projectId ?? "legacy-project"}\`
Component scope: ${job.scope ?? "legacy bounded reconstruction"}
Excluded content: ${(job.excludedContent ?? []).join(", ") || "none declared"}

Registered reference authority:
${authorityPacket || "- legacy-reference: primary-geometry"}

Written rules override generated references. Reject unregistered, rejected, or
superseded references rather than averaging conflicting styles. Record required
states, geometry constraints, review sizes, slots, and unresolved decisions.
Expected output is editable deterministic SVG and review evidence.

Inspect the reference image directly. Populate observations, tokens, components,
editable layers, states, and unresolved human decisions. Then generate and
inspect the preview comparison. Do not use reference pixels in generated assets.
`;
  await atomicWriteFile(path.join(root, "analysis", "CODEX_TASK.md"), task);
  job.status = "analysis-review-required";
  job.updatedAt = new Date().toISOString();
  await writeJson(path.join(root, "job.json"), job);
  console.log(`Prepared Codex-native analysis task for ${job.jobId}.`);
}

async function approveJob(values) {
  const root = jobRoot(required(values, "job"));
  const reviewer = required(values, "reviewer").trim();
  if (!reviewer) throw new Error("Reviewer must not be empty.");
  const draftPath = path.join(root, "analysis", "draft.json");
  const draft = validateDraft(await readJson(draftPath), { requireResolved: true });
  const approval = {
    ...draft,
    approval: {
      reviewer,
      approvedAt: new Date().toISOString(),
      draftSha256: await sha256(draftPath)
    }
  };
  await writeJson(path.join(root, "approved", "style-and-components.json"), approval);
  const job = await readJson(path.join(root, "job.json"));
  job.status = "approved";
  job.updatedAt = new Date().toISOString();
  await writeJson(path.join(root, "job.json"), job);
  console.log(`Approved ${job.jobId} for deterministic reconstruction.`);
}

async function buildJob(values) {
  const root = jobRoot(required(values, "job"));
  const approvedPath = path.join(root, "approved", "style-and-components.json");
  const draft = validateDraft(await readJson(approvedPath), { requireResolved: true });
  const componentDir = path.join(root, "components", "editable-svg");
  await ensureDir(componentDir);
  const modules = [];
  for (const component of draft.components) {
    const filename = path.join(componentDir, `${component.id}.svg`);
    await writeFile(filename, componentSvg(component, draft.materials), "utf8");
    modules.push({
      id: component.id,
      role: component.role,
      path: `components/editable-svg/${component.id}.svg`,
      bounds: component.bounds,
      sha256: await sha256(filename)
    });
  }
  const screenPath = path.join(root, "composition", "reconstructed-screen.svg");
  await ensureDir(path.dirname(screenPath));
  await writeFile(screenPath, screenSvg(draft), "utf8");
  await writeJson(path.join(root, "components", "manifest.json"), {
    schemaVersion: 1,
    jobId: draft.jobId,
    approvedSourceSha256: await sha256(approvedPath),
    modules,
    composition: {
      path: "composition/reconstructed-screen.svg",
      sha256: await sha256(screenPath)
    }
  });
  const job = await readJson(path.join(root, "job.json"));
  job.status = "reconstructed";
  job.updatedAt = new Date().toISOString();
  await writeJson(path.join(root, "job.json"), job);
  console.log(`Built ${modules.length} editable component(s) and one screen composition.`);
}

async function previewJob(values) {
  const root = jobRoot(required(values, "job"));
  const draft = validateDraft(await readJson(path.join(root, "analysis", "draft.json")));
  const componentDir = path.join(root, "preview", "components");
  await ensureDir(componentDir);
  for (const component of draft.components) {
    await writeFile(path.join(componentDir, `${component.id}.svg`), componentSvg(component, draft.materials), "utf8");
  }
  const screenPath = path.join(root, "preview", "reconstructed-screen.svg");
  await writeFile(screenPath, screenSvg(draft), "utf8");

  const job = await readJson(path.join(root, "job.json"));
  const referencePath = `../${job.reference.path.replaceAll("\\", "/")}`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${job.jobId} draft comparison</title>
<style>html,body{margin:0;background:#151821;color:#fff;font:14px system-ui}.bar{padding:12px 16px}.stage{position:relative;margin:auto;width:min(100vw,${draft.canvas.width}px);aspect-ratio:${draft.canvas.width}/${draft.canvas.height};overflow:hidden}.stage img,.stage object{position:absolute;inset:0;width:100%;height:100%}.stage object{opacity:.5}.hint{opacity:.7}</style></head>
<body><div class="bar"><strong>${job.jobId}</strong> <span class="hint">Codex draft: reference with 50% reconstruction overlay</span></div>
<div class="stage"><img src="${referencePath}" alt="Review reference"><object data="../preview/reconstructed-screen.svg" type="image/svg+xml" aria-label="Draft reconstruction"></object></div></body></html>
`;
  const comparisonDir = path.join(root, "comparison");
  await ensureDir(comparisonDir);
  await writeFile(path.join(comparisonDir, "overlay.html"), html, "utf8");
  console.log(`Previewed ${draft.components.length} component(s) for Codex inspection.`);
}

async function compareJob(values) {
  const root = jobRoot(required(values, "job"));
  const job = await readJson(path.join(root, "job.json"));
  const approved = await readJson(path.join(root, "approved", "style-and-components.json"));
  const manifest = await readJson(path.join(root, "components", "manifest.json"));
  const totalArea = approved.canvas.width * approved.canvas.height;
  const componentArea = approved.components.reduce(
    (sum, component) => sum + component.bounds.width * component.bounds.height,
    0
  );
  const report = {
    schemaVersion: 1,
    jobId: job.jobId,
    referenceSha256: job.reference.sha256,
    reconstructionSha256: manifest.composition.sha256,
    metrics: {
      canvasWidth: approved.canvas.width,
      canvasHeight: approved.canvas.height,
      componentCount: approved.components.length,
      declaredComponentAreaRatio: Number((componentArea / totalArea).toFixed(6))
    },
    visualScoring: {
      status: "human-or-vision-provider-required",
      requiredChecks: ["layout", "silhouette", "palette", "typography", "material", "state-readability"]
    }
  };
  const comparisonDir = path.join(root, "comparison");
  await writeJson(path.join(comparisonDir, "report.json"), report);
  const referencePath = `../${job.reference.path.replaceAll("\\", "/")}`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${job.jobId} comparison</title>
<style>html,body{margin:0;background:#151821;color:#fff;font:14px system-ui}.bar{padding:12px 16px}.stage{position:relative;margin:auto;width:min(100vw,${approved.canvas.width}px);aspect-ratio:${approved.canvas.width}/${approved.canvas.height};overflow:hidden}.stage img,.stage object{position:absolute;inset:0;width:100%;height:100%}.stage object{opacity:.5}.hint{opacity:.7}</style></head>
<body><div class="bar"><strong>${job.jobId}</strong> <span class="hint">Reference with 50% reconstruction overlay</span></div>
<div class="stage"><img src="${referencePath}" alt="Review reference"><object data="../composition/reconstructed-screen.svg" type="image/svg+xml" aria-label="Reconstruction"></object></div></body></html>
`;
  await ensureDir(comparisonDir);
  await writeFile(path.join(comparisonDir, "overlay.html"), html, "utf8");
  console.log("Created comparison/overlay.html and comparison/report.json.");
}

async function main() {
  const { command, values } = parseArgs(process.argv.slice(2));
  const actions = {
    "project-init": initProject,
    "reference-add": addReference,
    "reference-list": listReferences,
    "reference-validate": validateReferences,
    "job-create": createJob,
    "project-status": projectStatus,
    "project-audit": auditProject,
    "validate-job": validateJob,
    "render-evidence": renderEvidence,
    "record-mobile-review": recordMobileReview,
    init: initJob,
    prepare: prepareJob,
    analyze: prepareJob,
    preview: previewJob,
    approve: approveJob,
    build: buildJob,
    compare: compareJob
  };
  if (!actions[command]) {
    throw new Error("Usage: lab <project-init|reference-add|reference-list|reference-validate|job-create|project-status|project-audit|validate-job|render-evidence|record-mobile-review|init|prepare|preview|approve|build|compare> [options]");
  }
  await actions[command](values);
}

main().catch((error) => {
  console.error(`Production Lab: ${error.message}`);
  process.exitCode = 1;
});
