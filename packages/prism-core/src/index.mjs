import {
  DIAGNOSTIC_SCHEMA_VERSION,
  isSemanticId,
  prismSchemaPackage,
  SEMANTIC_SCHEMA_VERSION,
  semanticProjectSchema,
  SUPPORTED_COMPONENT_TYPES
} from "@lnh-prism/schema";
import Ajv2020 from "ajv/dist/2020.js";

const COLLECTIONS = ["themes", "screens", "components", "actions", "bindings", "assetSlots", "states"];
const SUPPORTED_COMPONENT_TYPE_SET = new Set(SUPPORTED_COMPONENT_TYPES);
const validateContractShape = new Ajv2020({ allErrors: true, strict: true }).compile(semanticProjectSchema);

function diagnostic(code, path, message, semanticId = null) {
  return { code, path, semanticId, severity: "error", message };
}

function compareDiagnostics(left, right) {
  return left.path.localeCompare(right.path, "en")
    || left.code.localeCompare(right.code, "en")
    || left.message.localeCompare(right.message, "en");
}

export function validateSemanticProject(document, { source = "<memory>" } = {}) {
  const diagnostics = [];
  const identities = new Map();
  const addIdentity = (value, path) => {
    if (!isSemanticId(value)) {
      diagnostics.push(diagnostic(
        "PRISM_ID_INVALID",
        path,
        "Use at least two lowercase dot-separated segments; each segment may contain lowercase letters, numbers, and single hyphens.",
        typeof value === "string" ? value : null
      ));
      return;
    }
    if (identities.has(value)) {
      diagnostics.push(diagnostic(
        "PRISM_ID_DUPLICATE",
        path,
        `Semantic ID ${value} is already declared at ${identities.get(value)}; stable IDs must be globally unique.`,
        value
      ));
      return;
    }
    identities.set(value, path);
  };
  const visitInstance = (instance, path) => {
    if (!instance || typeof instance !== "object" || Array.isArray(instance)) {
      diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", path, "Component instance must be an object."));
      return;
    }
    addIdentity(instance.id, `${path}/id`);
    if (!SUPPORTED_COMPONENT_TYPE_SET.has(instance.type)) {
      diagnostics.push(diagnostic(
        "PRISM_COMPONENT_TYPE_UNSUPPORTED",
        `${path}/type`,
        `Component type ${String(instance.type)} is unsupported; use one of: ${SUPPORTED_COMPONENT_TYPES.join(", ")}.`,
        typeof instance.id === "string" ? instance.id : null
      ));
    }
    if (instance.children !== undefined && !Array.isArray(instance.children)) {
      diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", `${path}/children`, "Component children must be an array.", instance.id ?? null));
      return;
    }
    for (const [index, child] of (instance.children ?? []).entries()) visitInstance(child, `${path}/children/${index}`);
  };

  if (!document || typeof document !== "object" || Array.isArray(document)) {
    diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", "/", "Semantic project must be an object."));
  } else {
    validateContractShape(document);
    for (const error of validateContractShape.errors ?? []) {
      const handledBySpecificDiagnostic = (error.keyword === "const" && error.instancePath === "/schemaVersion")
        || (error.keyword === "pattern" && error.instancePath.endsWith("/id"))
        || (error.keyword === "enum" && error.instancePath.endsWith("/type"));
      if (handledBySpecificDiagnostic) continue;
      const path = error.instancePath || "/";
      diagnostics.push(diagnostic(
        "PRISM_SCHEMA_INVALID",
        path,
        `Contract ${path} ${error.message}; update the document to match semantic schema ${SEMANTIC_SCHEMA_VERSION}.`
      ));
    }
    if (document.schemaVersion !== SEMANTIC_SCHEMA_VERSION) {
      diagnostics.push(diagnostic(
        "PRISM_SCHEMA_VERSION_UNSUPPORTED",
        "/schemaVersion",
        `Schema version ${String(document.schemaVersion)} is unsupported; migrate to ${SEMANTIC_SCHEMA_VERSION}.`
      ));
    }
    if (!document.project || typeof document.project !== "object" || Array.isArray(document.project)) {
      diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", "/project", "Project contract must be an object."));
    } else {
      addIdentity(document.project.id, "/project/id");
      if (!document.project.unityExport || typeof document.project.unityExport !== "object" || Array.isArray(document.project.unityExport)) {
        diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", "/project/unityExport", "Unity export settings must be an object.", document.project.id ?? null));
      }
    }
    for (const collection of COLLECTIONS) {
      const entries = document[collection];
      if (!Array.isArray(entries)) {
        diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", `/${collection}`, `${collection} must be an array.`));
        continue;
      }
      for (const [index, entry] of entries.entries()) {
        const path = `/${collection}/${index}`;
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", path, `${collection} entry must be an object.`));
          continue;
        }
        addIdentity(entry.id, `${path}/id`);
        if (collection === "screens" || collection === "components") visitInstance(entry.root, `${path}/root`);
      }
    }
  }

  diagnostics.sort(compareDiagnostics);
  return {
    diagnosticVersion: DIAGNOSTIC_SCHEMA_VERSION,
    contractVersion: typeof document?.schemaVersion === "string" ? document.schemaVersion : null,
    source,
    valid: diagnostics.length === 0,
    diagnostics
  };
}

export const prismCorePackage = Object.freeze({
  name: "@lnh-prism/core",
  version: "0.1.0",
  status: "contracts-active",
  dependencies: [prismSchemaPackage.name]
});
