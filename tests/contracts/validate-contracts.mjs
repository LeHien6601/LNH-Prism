import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const schemaDir = join(root, "specs", "schemas");
const exampleDir = join(root, "specs", "examples");
const schemas = new Map();

for (const file of await readdir(schemaDir)) {
  if (!file.endsWith(".json")) continue;
  const schema = JSON.parse(await readFile(join(schemaDir, file), "utf8"));
  schemas.set(file, schema);
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
for (const schema of schemas.values()) ajv.addSchema(schema);

const exampleSchemas = new Map([
  ["style-neon-core.json", "style-spec.schema.json"],
  ["style-neon-market-overlay.json", "style-spec.schema.json"],
  ["style-frostbound-reward.json", "style-spec.schema.json"],
  ["style-m7-reference-fidelity.json", "style-spec.schema.json"],
  ["style-m8-frostbound-aligned.json", "style-spec.schema.json"],
  ["primary-button.json", "component-spec.schema.json"],
  ["primary-button-material-bindings.json", "component-spec.schema.json"],
  ["m2-shop-panel.json", "component-spec.schema.json"], ["m2-category-tabs.json", "component-spec.schema.json"], ["m2-primary-purchase-button.json", "component-spec.schema.json"], ["m2-secondary-cancel-button.json", "component-spec.schema.json"], ["m2-currency-badge.json", "component-spec.schema.json"], ["m2-limited-offer-progress.json", "component-spec.schema.json"],
  ["frostbound-reward-panel.json", "component-spec.schema.json"], ["frostbound-claim-button.json", "component-spec.schema.json"], ["frostbound-later-button.json", "component-spec.schema.json"], ["frostbound-reward-progress.json", "component-spec.schema.json"], ["frostbound-reward-emblem-container.json", "component-spec.schema.json"],
  ["m7-primary-hex-button.contract.json", "component-spec.schema.json"],
  ["m7-reward-panel.json", "component-spec.schema.json"], ["m7-primary-hex-button.json", "component-spec.schema.json"], ["m7-secondary-hex-button.json", "component-spec.schema.json"], ["m7-angular-tab.json", "component-spec.schema.json"], ["m7-faceted-badge.json", "component-spec.schema.json"], ["m7-angular-progress.json", "component-spec.schema.json"], ["m7-icon-container.json", "component-spec.schema.json"],
  ["primary-panel.json", "component-spec.schema.json"],
  ["primary-progress-bar.json", "component-spec.schema.json"],
  ["neon-core-materials.json", "material-pack.schema.json"],
  ["neon-alloy-materials.json", "material-pack.schema.json"],
  ["frost-crystal-materials.draft.json", "material-pack.schema.json"],
  ["frost-crystal-materials.json", "material-pack.schema.json"],
  ["m7-faceted-materials.json", "material-pack.schema.json"],
  ["m8-frostbound-materials.json", "material-pack.schema.json"],
  ["m9-frostbound-edge-stacks.json", "edge-stack.schema.json"],
  ["m9-frostbound-material-responses.json", "material-response.schema.json"],
  ["m9-frostbound-variation.json", "variation.schema.json"],
  ["m9-frostbound-ornament-anchors.json", "ornament-anchor.schema.json"],
  ["m9-frostbound-focal-objects.json", "focal-object.schema.json"],
  ["m9-frostbound-visual-review.json", "visual-review.schema.json"],
  ["style-m10-volcanic-forge.json", "style-spec.schema.json"],
  ["m10-volcanic-forge-materials.json", "material-pack.schema.json"],
  ["m10-volcanic-forge-edge-stacks.json", "edge-stack.schema.json"],
  ["m10-volcanic-forge-material-responses.json", "material-response.schema.json"],
  ["m10-volcanic-forge-variation.json", "variation.schema.json"],
  ["m10-volcanic-forge-ornament-anchors.json", "ornament-anchor.schema.json"],
  ["m10-volcanic-forge-focal-objects.json", "focal-object.schema.json"],
  ["style-m11-enchanted-forest.json", "style-spec.schema.json"],
  ["m11-enchanted-forest-materials.json", "material-pack.schema.json"],
  ["m11-enchanted-forest-edge-stacks.json", "edge-stack.schema.json"],
  ["m11-enchanted-forest-material-responses.json", "material-response.schema.json"],
  ["m11-enchanted-forest-variation.json", "variation.schema.json"],
  ["m11-enchanted-forest-ornament-anchors.json", "ornament-anchor.schema.json"],
  ["m11-enchanted-forest-focal-objects.json", "focal-object.schema.json"],
  ["primary-button-normal.manifest.json", "export-manifest.schema.json"],
  ["archive/legacy-primary-button-normal.manifest.json", "export-manifest.schema.json"],
  ["../../docs/reference-briefs/assets/v3-frostbound-reward-concept.receipt.json", "concept-receipt.schema.json"],
  ["v3-frostbound-analysis.json", "analysis-receipt.schema.json"],
  ["v3-frostbound-analysis-review.json", "analysis-review.schema.json"],
  ["../../docs/validation/records/m3-s3-frostbound-analysis-review.json", "analysis-review.schema.json"]
]);

for (const [exampleFile, schemaFile] of exampleSchemas) {
  const example = JSON.parse(await readFile(join(exampleDir, exampleFile), "utf8"));
  const schema = schemas.get(schemaFile);
  const validate = ajv.getSchema(schema.$id);
  if (!validate(example)) throw new Error(`${exampleFile} failed ${schemaFile}: ${ajv.errorsText(validate.errors)}`);
  console.log(`validated ${exampleFile}`);
}

const styleSchema = schemas.get("style-spec.schema.json");
const validateStyle = ajv.getSchema(styleSchema.$id);
const rootStyle = JSON.parse(await readFile(join(exampleDir, "style-neon-core.json"), "utf8"));
const validOverlay = structuredClone(rootStyle);
validOverlay.id = "neon-market";
validOverlay.name = "Neon Market";
validOverlay.extends = { id: "neon-core", version: "0.1.0" };
validOverlay.tokens = { material: { edgeLightOpacity: 0.42 } };
if (!validateStyle(validOverlay)) throw new Error(`style overlay must allow partial tokens: ${ajv.errorsText(validateStyle.errors)}`);
const incompleteRoot = structuredClone(rootStyle);
incompleteRoot.tokens = { colors: { primary: "#4F84FF" } };
if (validateStyle(incompleteRoot)) throw new Error("style root without extends must reject incomplete tokens.");
const outOfRangeMaterialToken = structuredClone(validOverlay);
outOfRangeMaterialToken.tokens.material.edgeLightOpacity = 0.66;
if (validateStyle(outOfRangeMaterialToken)) throw new Error("style schema must reject out-of-range material tokens.");
console.log("validated style inheritance and material token bounds");

const materialSchema = schemas.get("material-pack.schema.json");
const validateMaterialPack = ajv.getSchema(materialSchema.$id);
const invalidNormalization = JSON.parse(await readFile(join(exampleDir, "neon-core-materials.json"), "utf8"));
invalidNormalization.materials[0].normalization.scale = 4.1;
if (validateMaterialPack(invalidNormalization)) throw new Error("material schema must reject out-of-range normalization scale.");
const componentSchema = schemas.get("component-spec.schema.json");
const validateComponent = ajv.getSchema(componentSchema.$id);
const invalidBinding = JSON.parse(await readFile(join(exampleDir, "primary-button.json"), "utf8"));
invalidBinding.materialBindings = [{ slot: "surface-grain", materialId: "blue-grain-overlay", overrides: { grainOpacity: 0.21 } }];
if (validateComponent(invalidBinding)) throw new Error("component schema must reject out-of-range material binding overrides.");
const roundedM7Hex = JSON.parse(await readFile(join(exampleDir, "m7-primary-hex-button.contract.json"), "utf8"));
roundedM7Hex.geometry.cornerRadius = 18;
if (validateComponent(roundedM7Hex)) throw new Error("component schema must reject rounded/capsule-like M7 wide-hex geometry.");
const missingSafeArea = JSON.parse(await readFile(join(exampleDir, "m7-primary-hex-button.contract.json"), "utf8"));
delete missingSafeArea.geometry.contentSafeArea;
if (validateComponent(missingSafeArea)) throw new Error("component schema must require content safe area for M7 wide-hex geometry.");
console.log("rejected invalid material normalization, bindings, and M7 hex geometry");

const m7Pack = JSON.parse(await readFile(join(exampleDir, "m7-faceted-materials.json"), "utf8"));
const m7MaterialIds = new Set(m7Pack.materials.map(({ id }) => id));
const m7Components = ["m7-reward-panel.json", "m7-primary-hex-button.json", "m7-secondary-hex-button.json", "m7-angular-tab.json", "m7-faceted-badge.json", "m7-angular-progress.json", "m7-icon-container.json"];
for (const file of m7Components) {
  const component = JSON.parse(await readFile(join(exampleDir, file), "utf8"));
  if (component.status !== "approved" || component.style.id !== "m7-reference-fidelity") throw new Error(`${file} must be an approved M7 component spec.`);
  for (const binding of component.materialBindings ?? []) if (!m7MaterialIds.has(binding.materialId)) throw new Error(`${file} binds unknown M7 material ${binding.materialId}.`);
}
const m7Primary = JSON.parse(await readFile(join(exampleDir, "m7-primary-hex-button.json"), "utf8"));
m7Primary.geometry.endCapDepth = 15;
if (validateComponent(m7Primary)) throw new Error("M7 wide-hex component spec must reject shallow end caps.");
console.log("validated M7 approved material bindings, seven-component inventory, and hex bounds");

const edgeStackSchema = schemas.get("edge-stack.schema.json");
const validateEdgeStack = ajv.getSchema(edgeStackSchema.$id);
const m9EdgeStacks = JSON.parse(await readFile(join(exampleDir, "m9-frostbound-edge-stacks.json"), "utf8"));
const presetIds = new Set(m9EdgeStacks.presets.map(({ id }) => id));
if (!m9EdgeStacks.bindings.every(({ presetId }) => presetIds.has(presetId))) throw new Error("M9 edge-stack bindings must reference registered presets.");
for (const preset of m9EdgeStacks.presets) {
  const ordered = [...preset.layers].sort((a, b) => a.order - b.order);
  if (ordered.some((layer, index) => layer !== preset.layers[index])) throw new Error(`${preset.id} layers must be stored in rendering order.`);
}
const invalidEdgeThickness = structuredClone(m9EdgeStacks);
invalidEdgeThickness.presets[0].layers[0].thickness = 13;
if (validateEdgeStack(invalidEdgeThickness)) throw new Error("edge-stack schema must reject thickness above its bounded maximum.");
console.log("validated M9 edge-stack registry, bindings, and bounded-thickness rejection");

const materialResponseSchema = schemas.get("material-response.schema.json");
const validateMaterialResponse = ajv.getSchema(materialResponseSchema.$id);
const m9Responses = JSON.parse(await readFile(join(exampleDir, "m9-frostbound-material-responses.json"), "utf8"));
const responseIds = new Set(m9Responses.responses.map(({ id }) => id));
if (!m9Responses.bindings.every(({ responseId }) => responseIds.has(responseId))) throw new Error("M9 material-response bindings must reference registered responses.");
const invalidMaterialResponse = structuredClone(m9Responses);
invalidMaterialResponse.responses[0].glow.opacity = 1.1;
if (validateMaterialResponse(invalidMaterialResponse)) throw new Error("material-response schema must reject out-of-range channel opacity.");
console.log("validated M9 material-response registry, bindings, and channel bounds");

const variationSchema = schemas.get("variation.schema.json");
const validateVariation = ajv.getSchema(variationSchema.$id);
const m9Variation = JSON.parse(await readFile(join(exampleDir, "m9-frostbound-variation.json"), "utf8"));
const variationPresetIds = new Set(m9Variation.presets.map(({ id }) => id));
if (!m9Variation.bindings.every(({ presetId }) => variationPresetIds.has(presetId))) throw new Error("M9 variation bindings must reference registered presets.");
const invalidVariation = structuredClone(m9Variation);
invalidVariation.presets[0].channels.particleCount = 33;
if (validateVariation(invalidVariation)) throw new Error("variation schema must reject particle count above its bounded maximum.");
console.log("validated M9 variation registry, bindings, and channel bounds");

const visualReviewSchema = schemas.get("visual-review.schema.json");
const validateVisualReview = ajv.getSchema(visualReviewSchema.$id);
const m9VisualReview = JSON.parse(await readFile(join(exampleDir, "m9-frostbound-visual-review.json"), "utf8"));
const invalidVisualReview = structuredClone(m9VisualReview);
invalidVisualReview.technicalPreflight.role = "score-multiplier";
if (validateVisualReview(invalidVisualReview)) throw new Error("M9 visual review must keep technical correctness as a hard gate.");
console.log("validated M9 three-distance review plan and technical-gate boundary");

const m10Bindings = JSON.parse(await readFile(join(exampleDir, "m10-volcanic-forge-system-bindings.json"), "utf8"));
const m10Components = ["primary-hex-button", "secondary-hex-button", "panel", "tab", "badge", "progress", "icon-container"];
const m10Edge = JSON.parse(await readFile(join(exampleDir, "m10-volcanic-forge-edge-stacks.json"), "utf8"));
const m10Responses = JSON.parse(await readFile(join(exampleDir, "m10-volcanic-forge-material-responses.json"), "utf8"));
const m10Variation = JSON.parse(await readFile(join(exampleDir, "m10-volcanic-forge-variation.json"), "utf8"));
for (const registry of [m10Edge, m10Responses, m10Variation]) {
  for (const componentId of m10Components) if (!registry.bindings.some((binding) => binding.componentId === componentId)) throw new Error(`M10 bindings must cover ${componentId}.`);
}
if (m10Variation.presets.some(({ channels }) => channels.particleCount > 0)) throw new Error("M10 controls must not emit ember particles through variation.");
if (m10Bindings.emissionBudget.portraitEmberCount !== 8 || m10Bindings.emissionBudget.controlEmberCount !== 0 || m10Bindings.emissionBudget.lavaOpacityMaximum > .55 || m10Bindings.emissionBudget.glowRadiusRatioMaximum > .12 || m10Bindings.emissionBudget.contentOverlap !== "forbidden") throw new Error("M10 emission budget must enforce the approved limits.");
if (m10Bindings.bindings.lighting.direction !== "bottom" || m10Bindings.bindings.typography.action !== "m10-engraved-gold-action@1.0.0") throw new Error("M10 must bind the approved warm lighting and engraved action typography.");
console.log("validated M10 shared-system bindings, full component coverage, and emission limits");

const m11Bindings = JSON.parse(await readFile(join(exampleDir, "m11-enchanted-forest-system-bindings.json"), "utf8"));
const m11Components = ["primary-hex-button", "secondary-hex-button", "panel", "tab", "badge", "progress", "icon-container"];
const m11Edge = JSON.parse(await readFile(join(exampleDir, "m11-enchanted-forest-edge-stacks.json"), "utf8"));
const m11Responses = JSON.parse(await readFile(join(exampleDir, "m11-enchanted-forest-material-responses.json"), "utf8"));
const m11Variation = JSON.parse(await readFile(join(exampleDir, "m11-enchanted-forest-variation.json"), "utf8"));
for (const registry of [m11Edge, m11Responses, m11Variation]) for (const componentId of m11Components) if (!registry.bindings.some((binding) => binding.componentId === componentId)) throw new Error("M11 bindings must cover " + componentId + ".");
if (m11Variation.presets.some(({ channels }) => channels.particleCount > 0)) throw new Error("M11 variation may not emit particles.");
const m11Budget = m11Bindings.bioluminescenceBudget;
if (m11Budget.coverageMaximum > .30 || m11Budget.haloExtentRatioMaximum > .12 || m11Budget.haloOpacityMaximum > .40 || m11Budget.ornamentMaximum > 6 || m11Budget.portraitMoteMaximum > 12 || m11Budget.contentOverlap !== "forbidden" || m11Budget.semanticText !== "required") throw new Error("M11 bounds must enforce approved limits.");
if (m11Bindings.bindings.lighting.direction !== "inner-canopy" || m11Bindings.bindings.typography.action !== "m11-parchment-sage-action@1.0.0") throw new Error("M11 must bind approved lighting and typography.");
console.log("validated M11 shared-system bindings, component coverage, and organic-lighting limits");

const exportManifestSchema = schemas.get("export-manifest.schema.json");
const validateExportManifest = ajv.getSchema(exportManifestSchema.$id);
const canonicalManifest = JSON.parse(await readFile(join(exampleDir, "primary-button-normal.manifest.json"), "utf8"));
if (canonicalManifest.schemaVersion !== "1.2") {
  throw new Error("canonical export manifest must use the live engine-neutral 1.2 schema.");
}
const legacyManifest = JSON.parse(await readFile(join(exampleDir, "archive", "legacy-primary-button-normal.manifest.json"), "utf8"));
if (!validateExportManifest(legacyManifest)) {
  throw new Error(`archived legacy export manifest must remain valid: ${ajv.errorsText(validateExportManifest.errors)}`);
}
const manifestWithEngineMetadata = structuredClone(canonicalManifest);
manifestWithEngineMetadata.outputs[0].unity = { pixelsPerUnit: 100 };
if (validateExportManifest(manifestWithEngineMetadata)) {
  throw new Error("live export-manifest 1.2 must reject engine import metadata.");
}
const manifestWithoutProvenance = structuredClone(canonicalManifest);
delete manifestWithoutProvenance.provenance;
if (validateExportManifest(manifestWithoutProvenance)) {
  throw new Error("export-manifest.schema.json must reject manifests without provenance.");
}
if (!validateExportManifest.errors?.some(({ keyword, params }) => keyword === "required" && params.missingProperty === "provenance")) {
  throw new Error(`missing-provenance rejection was not explicit: ${ajv.errorsText(validateExportManifest.errors)}`);
}
console.log("rejected export manifest without required provenance");
