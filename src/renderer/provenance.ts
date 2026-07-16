import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type V1ComponentId = "primary-button" | "primary-panel" | "primary-progress-bar";

export interface HashedSourceReference {
  id: string;
  version: string;
  path: string;
  sha256: string;
}

export interface V1ManifestSources {
  style: HashedSourceReference;
  component: HashedSourceReference;
  materialPacks: HashedSourceReference[];
}

export interface ProvenanceFile {
  role: "style-spec" | "component-spec" | "material-pack" | "material-source" | "renderer-source" | "renderer-version" | "provenance-engine" | "dependency-lock";
  path: string;
  sha256: string;
}

export interface V1ManifestProvenance {
  sourceTreeSha256: string;
  sourceFiles: ProvenanceFile[];
}

interface VersionedDocument {
  id: string;
  version: string;
  status: string;
  style?: { id: string; version: string };
  sources?: Array<{ id: string; path: string; sha256: string }>;
}

const componentPaths: Record<V1ComponentId, string> = {
  "primary-button": "specs/examples/primary-button.json",
  "primary-panel": "specs/examples/primary-panel.json",
  "primary-progress-bar": "specs/examples/primary-progress-bar.json"
};

const rendererPaths: Record<V1ComponentId, string> = {
  "primary-button": "src/renderer/primary-button.ts",
  "primary-panel": "src/renderer/primary-panel.ts",
  "primary-progress-bar": "src/renderer/primary-progress-bar.ts"
};

const stylePath = "specs/examples/style-neon-core.json";
const materialPackPath = "specs/examples/neon-core-materials.json";

function sha256(content: Uint8Array | string): string {
  return createHash("sha256").update(content).digest("hex");
}

async function readSource(path: string): Promise<{ content: string; sha256: string }> {
  const content = await readFile(resolve(path), "utf8");
  return { content, sha256: sha256(content.replaceAll("\r\n", "\n")) };
}

function parseApprovedDocument(path: string, content: string): VersionedDocument {
  const document = JSON.parse(content) as VersionedDocument;
  if (document.status !== "approved") throw new Error(`${path} must be approved before V1 output can be generated.`);
  if (!document.id || !document.version) throw new Error(`${path} must contain a versioned source identity.`);
  return document;
}

export async function loadV1ManifestProvenance(componentId: V1ComponentId): Promise<{ sources: V1ManifestSources; provenance: V1ManifestProvenance }> {
  const componentPath = componentPaths[componentId];
  const rendererPath = rendererPaths[componentId];
  const [styleSource, componentSource, materialPackSource, rendererSource, rendererVersionSource, provenanceEngine, dependencyLock] = await Promise.all([
    readSource(stylePath),
    readSource(componentPath),
    readSource(materialPackPath),
    readSource(rendererPath),
    readSource("src/renderer/version.ts"),
    readSource("src/renderer/provenance.ts"),
    readSource("package-lock.json")
  ]);

  const style = parseApprovedDocument(stylePath, styleSource.content);
  const component = parseApprovedDocument(componentPath, componentSource.content);
  const materialPack = parseApprovedDocument(materialPackPath, materialPackSource.content);
  if (component.id !== componentId) throw new Error(`${componentPath} declares ${component.id}, expected ${componentId}.`);
  if (component.style?.id !== style.id || component.style.version !== style.version) {
    throw new Error(`${componentPath} does not reference ${style.id}@${style.version}.`);
  }

  const materialSources = materialPack.sources ?? [];
  if (materialSources.length === 0) throw new Error(`${materialPackPath} must reference at least one material source.`);
  const verifiedMaterialFiles: ProvenanceFile[] = [];
  for (const source of materialSources) {
    const materialSource = await readSource(source.path);
    if (materialSource.sha256 !== source.sha256) throw new Error(`${source.path} does not match the SHA-256 declared by ${materialPackPath}.`);
    verifiedMaterialFiles.push({ role: "material-source", path: source.path, sha256: materialSource.sha256 });
  }

  const sourceFiles: ProvenanceFile[] = [
    { role: "style-spec", path: stylePath, sha256: styleSource.sha256 },
    { role: "component-spec", path: componentPath, sha256: componentSource.sha256 },
    { role: "material-pack", path: materialPackPath, sha256: materialPackSource.sha256 },
    ...verifiedMaterialFiles,
    { role: "renderer-source", path: rendererPath, sha256: rendererSource.sha256 },
    { role: "renderer-version", path: "src/renderer/version.ts", sha256: rendererVersionSource.sha256 },
    { role: "provenance-engine", path: "src/renderer/provenance.ts", sha256: provenanceEngine.sha256 },
    { role: "dependency-lock", path: "package-lock.json", sha256: dependencyLock.sha256 }
  ];
  const sourceTreeSha256 = sha256(sourceFiles.map(({ role, path, sha256: hash }) => `${role}:${path}:${hash}`).join("\n"));

  return {
    sources: {
      style: { id: style.id, version: style.version, path: stylePath, sha256: styleSource.sha256 },
      component: { id: component.id, version: component.version, path: componentPath, sha256: componentSource.sha256 },
      materialPacks: [{ id: materialPack.id, version: materialPack.version, path: materialPackPath, sha256: materialPackSource.sha256 }]
    },
    provenance: { sourceTreeSha256, sourceFiles }
  };
}
