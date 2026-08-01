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
const LEAF_COMPONENT_TYPES = new Set(["label", "image", "button", "toggle", "spacer"]);
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
  const instances = [];
  const activeInstances = new WeakSet();
  let hasObjectHierarchyCycle = false;
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
  const visitInstance = (instance, path, context) => {
    if (!instance || typeof instance !== "object" || Array.isArray(instance)) {
      diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", path, "Component instance must be an object."));
      return;
    }
    if (activeInstances.has(instance)) {
      hasObjectHierarchyCycle = true;
      diagnostics.push(diagnostic(
        "PRISM_HIERARCHY_CYCLE",
        path,
        "Component children form an object cycle; remove the child link that returns to an ancestor.",
        typeof instance.id === "string" ? instance.id : null
      ));
      return;
    }
    activeInstances.add(instance);
    addIdentity(instance.id, `${path}/id`);
    instances.push({ instance, path, ...context });
    if (!SUPPORTED_COMPONENT_TYPE_SET.has(instance.type)) {
      diagnostics.push(diagnostic(
        "PRISM_COMPONENT_TYPE_UNSUPPORTED",
        `${path}/type`,
        `Component type ${String(instance.type)} is unsupported; use one of: ${SUPPORTED_COMPONENT_TYPES.join(", ")}.`,
        typeof instance.id === "string" ? instance.id : null
      ));
    }
    const isScreenRoot = context.rootKind === "screen" && context.depth === 0;
    if (instance.type === "screen" && !isScreenRoot) {
      diagnostics.push(diagnostic(
        "PRISM_HIERARCHY_TYPE_PLACEMENT",
        `${path}/type`,
        "The screen type is allowed only at a screen contract root.",
        instance.id ?? null
      ));
    }
    if (isScreenRoot && instance.type !== "screen") {
      diagnostics.push(diagnostic(
        "PRISM_HIERARCHY_ROOT_TYPE",
        `${path}/type`,
        "A screen contract root must use component type screen.",
        instance.id ?? null
      ));
    }
    if (instance.type === "safe-area" && !(context.rootKind === "screen" && context.depth === 1 && context.parentType === "screen")) {
      diagnostics.push(diagnostic(
        "PRISM_SAFE_AREA_PLACEMENT",
        `${path}/type`,
        "A safe-area must be a direct child of a screen root.",
        instance.id ?? null
      ));
    }
    if (instance.type === "modal" && context.modalAncestor) {
      diagnostics.push(diagnostic(
        "PRISM_MODAL_NESTED",
        `${path}/type`,
        "A modal cannot be nested inside another modal layer.",
        instance.id ?? null
      ));
    }
    if (instance.children !== undefined && !Array.isArray(instance.children)) {
      diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", `${path}/children`, "Component children must be an array.", instance.id ?? null));
      activeInstances.delete(instance);
      return;
    }
    const children = instance.children ?? [];
    if (LEAF_COMPONENT_TYPES.has(instance.type) && children.length > 0) {
      diagnostics.push(diagnostic(
        "PRISM_HIERARCHY_CHILDREN_UNSUPPORTED",
        `${path}/children`,
        `Component type ${instance.type} cannot contain child instances.`,
        instance.id ?? null
      ));
    }
    if (isScreenRoot && children.filter(child => child?.type === "safe-area").length !== 1) {
      diagnostics.push(diagnostic(
        "PRISM_SAFE_AREA_ROOT_REQUIRED",
        `${path}/children`,
        "A screen root must contain exactly one direct safe-area child.",
        instance.id ?? null
      ));
    }
    for (const [index, child] of children.entries()) {
      visitInstance(child, `${path}/children/${index}`, {
        rootKind: context.rootKind,
        componentOwnerId: context.componentOwnerId,
        depth: context.depth + 1,
        parentType: instance.type,
        modalAncestor: context.modalAncestor || instance.type === "modal"
      });
    }
    activeInstances.delete(instance);
  };

  if (!document || typeof document !== "object" || Array.isArray(document)) {
    diagnostics.push(diagnostic("PRISM_CONTRACT_REQUIRED", "/", "Semantic project must be an object."));
  } else {
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
        if (collection === "screens" || collection === "components") {
          visitInstance(entry.root, `${path}/root`, {
            rootKind: collection === "screens" ? "screen" : "component",
            componentOwnerId: collection === "components" ? entry.id : null,
            depth: 0,
            parentType: null,
            modalAncestor: false
          });
        }
      }
    }
    if (!hasObjectHierarchyCycle) {
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
    }

    const registries = Object.fromEntries(COLLECTIONS.map(collection => [
      collection,
      new Set((Array.isArray(document[collection]) ? document[collection] : [])
        .map(entry => entry?.id)
        .filter(isSemanticId))
    ]));
    const checkReference = (value, path, registry, kind, semanticId = null) => {
      if (value === undefined || !isSemanticId(value) || registry.has(value)) return;
      diagnostics.push(diagnostic(
        "PRISM_REFERENCE_NOT_FOUND",
        path,
        `${kind} reference ${value} does not match a declared ${kind.toLowerCase()}; declare it or update the reference.`,
        semanticId
      ));
    };

    checkReference(document.project?.defaultThemeId, "/project/defaultThemeId", registries.themes, "Theme", document.project?.id ?? null);
    for (const [index, action] of (Array.isArray(document.actions) ? document.actions : []).entries()) {
      if (!action || typeof action !== "object") continue;
      checkReference(action.targetScreenId, `/actions/${index}/targetScreenId`, registries.screens, "Screen", action.id ?? null);
      if (action.kind === "navigate" && action.targetScreenId === undefined) {
        diagnostics.push(diagnostic(
          "PRISM_ACTION_TARGET_REQUIRED",
          `/actions/${index}/targetScreenId`,
          "A navigate action requires a targetScreenId.",
          action.id ?? null
        ));
      }
    }
    for (const { instance, path } of instances) {
      checkReference(instance.componentId, `${path}/componentId`, registries.components, "Component", instance.id ?? null);
      checkReference(instance.actionId, `${path}/actionId`, registries.actions, "Action", instance.id ?? null);
      checkReference(instance.navigationTargetId, `${path}/navigationTargetId`, registries.screens, "Screen", instance.id ?? null);
      checkReference(instance.bindingId, `${path}/bindingId`, registries.bindings, "Binding", instance.id ?? null);
      checkReference(instance.assetSlotId, `${path}/assetSlotId`, registries.assetSlots, "Asset slot", instance.id ?? null);
      for (const [index, stateId] of (Array.isArray(instance.stateIds) ? instance.stateIds : []).entries()) {
        checkReference(stateId, `${path}/stateIds/${index}`, registries.states, "State", instance.id ?? null);
      }
      if (instance.type === "button" && instance.actionId === undefined && instance.navigationTargetId === undefined) {
        diagnostics.push(diagnostic(
          "PRISM_BUTTON_TARGET_REQUIRED",
          path,
          "A button requires an actionId or navigationTargetId.",
          instance.id ?? null
        ));
      }
      if (instance.type === "toggle" && instance.bindingId === undefined) {
        diagnostics.push(diagnostic(
          "PRISM_TOGGLE_BINDING_REQUIRED",
          `${path}/bindingId`,
          "A toggle requires a bindingId.",
          instance.id ?? null
        ));
      }
      if (instance.type === "grid") {
        if (!instance.grid) {
          diagnostics.push(diagnostic(
            "PRISM_GRID_CONFIGURATION_REQUIRED",
            `${path}/grid`,
            "A grid requires bounded grid settings.",
            instance.id ?? null
          ));
        } else {
          const expectedChildren = instance.grid.columns * instance.grid.rows;
          const childCount = Array.isArray(instance.children) ? instance.children.length : 0;
          if (instance.componentId === undefined && childCount !== expectedChildren) {
            diagnostics.push(diagnostic(
              "PRISM_GRID_CONTENT_REQUIRED",
              `${path}/children`,
              `A ${instance.grid.columns}x${instance.grid.rows} grid requires ${expectedChildren} children or a reusable componentId template; found ${childCount}.`,
              instance.id ?? null
            ));
          }
        }
      }
      if (instance.type === "modal" && instance.dismissalPolicy === undefined) {
        diagnostics.push(diagnostic(
          "PRISM_MODAL_DISMISSAL_REQUIRED",
          `${path}/dismissalPolicy`,
          "A modal requires an explicit dismissalPolicy.",
          instance.id ?? null
        ));
      }
    }

    const componentEdges = new Map([...registries.components].map(id => [id, []]));
    for (const { instance, path, componentOwnerId } of instances) {
      if (componentEdges.has(componentOwnerId) && isSemanticId(instance.componentId) && registries.components.has(instance.componentId)) {
        componentEdges.get(componentOwnerId).push({ target: instance.componentId, path: `${path}/componentId`, semanticId: instance.id ?? null });
      }
    }
    const completeComponents = new Set();
    const visitingComponents = [];
    const visitComponent = componentId => {
      if (completeComponents.has(componentId)) return;
      visitingComponents.push(componentId);
      const edges = [...(componentEdges.get(componentId) ?? [])].sort((left, right) => left.path.localeCompare(right.path, "en"));
      for (const edge of edges) {
        const cycleStart = visitingComponents.indexOf(edge.target);
        if (cycleStart !== -1) {
          const cycle = [...visitingComponents.slice(cycleStart), edge.target];
          diagnostics.push(diagnostic(
            "PRISM_HIERARCHY_CYCLE",
            edge.path,
            `Reusable components form a cycle (${cycle.join(" -> ")}); remove one componentId reference.`,
            edge.semanticId
          ));
        } else {
          visitComponent(edge.target);
        }
      }
      visitingComponents.pop();
      completeComponents.add(componentId);
    };
    for (const componentId of [...registries.components].sort((left, right) => left.localeCompare(right, "en"))) visitComponent(componentId);
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
  status: "semantic-validation-active",
  dependencies: [prismSchemaPackage.name]
});
