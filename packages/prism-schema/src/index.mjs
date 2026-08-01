export const SEMANTIC_SCHEMA_VERSION = "1.0.0";
export const DIAGNOSTIC_SCHEMA_VERSION = "1.0.0";
export const SEMANTIC_ID_PATTERN_SOURCE = "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)+$";
export const SUPPORTED_COMPONENT_TYPES = Object.freeze([
  "screen",
  "safe-area",
  "container",
  "panel",
  "label",
  "image",
  "button",
  "toggle",
  "grid",
  "modal",
  "spacer"
]);

const semanticId = Object.freeze({ type: "string", pattern: SEMANTIC_ID_PATTERN_SOURCE });
const reference = Object.freeze({ type: "string", pattern: SEMANTIC_ID_PATTERN_SOURCE });
const size = Object.freeze({
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 }
  }
});
const layout = Object.freeze({
  type: "object",
  additionalProperties: false,
  properties: {
    anchorPreset: {
      enum: ["top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right", "stretch"]
    },
    pivot: {
      type: "object",
      additionalProperties: false,
      required: ["x", "y"],
      properties: {
        x: { type: "number", minimum: 0, maximum: 1 },
        y: { type: "number", minimum: 0, maximum: 1 }
      }
    },
    preferredSize: size,
    minimumSize: size,
    maximumSize: size,
    siblingOrder: { type: "integer", minimum: 0 },
    safeArea: { type: "boolean" }
  }
});
const instance = {
  type: "object",
  additionalProperties: false,
  required: ["id", "type"],
  properties: {
    id: semanticId,
    type: { enum: [...SUPPORTED_COMPONENT_TYPES] },
    componentId: reference,
    text: { type: "string" },
    actionId: reference,
    navigationTargetId: reference,
    bindingId: reference,
    assetSlotId: reference,
    stateIds: { type: "array", uniqueItems: true, items: reference },
    grid: { $ref: "#/$defs/gridSettings" },
    dismissalPolicy: { enum: ["explicit", "outside-or-explicit", "none"] },
    layout,
    children: { type: "array", items: { $ref: "#/$defs/instance" } }
  }
};

export const semanticProjectSchema = Object.freeze({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://lnhgames.dev/prism/schema/semantic-project/1.0.0",
  title: "LNH Prism semantic UI project",
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "project", "themes", "screens", "components", "actions", "bindings", "assetSlots", "states"],
  properties: {
    schemaVersion: { const: SEMANTIC_SCHEMA_VERSION },
    project: { $ref: "#/$defs/project" },
    themes: { type: "array", items: { $ref: "#/$defs/theme" } },
    screens: { type: "array", items: { $ref: "#/$defs/screen" } },
    components: { type: "array", items: { $ref: "#/$defs/component" } },
    actions: { type: "array", items: { $ref: "#/$defs/action" } },
    bindings: { type: "array", items: { $ref: "#/$defs/binding" } },
    assetSlots: { type: "array", items: { $ref: "#/$defs/assetSlot" } },
    states: { type: "array", items: { $ref: "#/$defs/state" } }
  },
  $defs: {
    semanticId,
    layout,
    instance,
    gridSettings: {
      type: "object",
      additionalProperties: false,
      required: ["columns", "rows"],
      properties: {
        columns: { type: "integer", const: 3 },
        rows: { type: "integer", const: 3 }
      }
    },
    unityExportSettings: {
      type: "object",
      additionalProperties: false,
      required: ["contractVersion", "generatedRoot", "namespace"],
      properties: {
        contractVersion: { type: "string", pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$" },
        generatedRoot: { type: "string", minLength: 1 },
        namespace: { type: "string", pattern: "^[A-Za-z][A-Za-z0-9]*(?:\\.[A-Za-z][A-Za-z0-9]*)*$" }
      }
    },
    project: {
      type: "object",
      additionalProperties: false,
      required: ["id", "name", "defaultThemeId", "unityExport"],
      properties: {
        id: semanticId,
        name: { type: "string", minLength: 1 },
        defaultThemeId: reference,
        unityExport: { $ref: "#/$defs/unityExportSettings" }
      }
    },
    theme: {
      type: "object",
      additionalProperties: false,
      required: ["id", "tokens"],
      properties: {
        id: semanticId,
        tokens: {
          type: "object",
          additionalProperties: false,
          required: ["colors", "spacing"],
          properties: {
            colors: { type: "object", additionalProperties: { type: "string" } },
            spacing: { type: "object", additionalProperties: { type: "number", minimum: 0 } }
          }
        }
      }
    },
    screen: {
      type: "object",
      additionalProperties: false,
      required: ["id", "root"],
      properties: { id: semanticId, root: { $ref: "#/$defs/instance" } }
    },
    component: {
      type: "object",
      additionalProperties: false,
      required: ["id", "root"],
      properties: { id: semanticId, root: { $ref: "#/$defs/instance" } }
    },
    action: {
      type: "object",
      additionalProperties: false,
      required: ["id", "kind"],
      properties: { id: semanticId, kind: { enum: ["invoke", "navigate", "dismiss"] }, targetScreenId: reference }
    },
    binding: {
      type: "object",
      additionalProperties: false,
      required: ["id", "valueType"],
      properties: { id: semanticId, valueType: { enum: ["boolean", "number", "string"] } }
    },
    assetSlot: {
      type: "object",
      additionalProperties: false,
      required: ["id", "kind"],
      properties: { id: semanticId, kind: { enum: ["sprite", "font"] } }
    },
    state: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: { id: semanticId }
    }
  }
});

export function isSemanticId(value) {
  return typeof value === "string" && new RegExp(SEMANTIC_ID_PATTERN_SOURCE, "u").test(value);
}

export const prismSchemaPackage = Object.freeze({
  name: "@lnh-prism/schema",
  version: "0.1.0",
  status: "contracts-active",
  schemaVersion: SEMANTIC_SCHEMA_VERSION
});
