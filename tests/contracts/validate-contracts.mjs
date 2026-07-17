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
  ["primary-button.json", "component-spec.schema.json"],
  ["primary-button-material-bindings.json", "component-spec.schema.json"],
  ["m2-shop-panel.json", "component-spec.schema.json"], ["m2-category-tabs.json", "component-spec.schema.json"], ["m2-primary-purchase-button.json", "component-spec.schema.json"], ["m2-secondary-cancel-button.json", "component-spec.schema.json"], ["m2-currency-badge.json", "component-spec.schema.json"], ["m2-limited-offer-progress.json", "component-spec.schema.json"],
  ["frostbound-reward-panel.json", "component-spec.schema.json"], ["frostbound-claim-button.json", "component-spec.schema.json"], ["frostbound-later-button.json", "component-spec.schema.json"], ["frostbound-reward-progress.json", "component-spec.schema.json"], ["frostbound-reward-emblem-container.json", "component-spec.schema.json"],
  ["primary-panel.json", "component-spec.schema.json"],
  ["primary-progress-bar.json", "component-spec.schema.json"],
  ["neon-core-materials.json", "material-pack.schema.json"],
  ["neon-alloy-materials.json", "material-pack.schema.json"],
  ["frost-crystal-materials.draft.json", "material-pack.schema.json"],
  ["frost-crystal-materials.json", "material-pack.schema.json"],
  ["primary-button-normal.manifest.json", "export-manifest.schema.json"],
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
console.log("rejected invalid material normalization and bindings");

const exportManifestSchema = schemas.get("export-manifest.schema.json");
const validateExportManifest = ajv.getSchema(exportManifestSchema.$id);
const canonicalManifest = JSON.parse(await readFile(join(exampleDir, "primary-button-normal.manifest.json"), "utf8"));
const manifestWithoutProvenance = structuredClone(canonicalManifest);
delete manifestWithoutProvenance.provenance;
if (validateExportManifest(manifestWithoutProvenance)) {
  throw new Error("export-manifest.schema.json must reject manifests without provenance.");
}
if (!validateExportManifest.errors?.some(({ keyword, params }) => keyword === "required" && params.missingProperty === "provenance")) {
  throw new Error(`missing-provenance rejection was not explicit: ${ajv.errorsText(validateExportManifest.errors)}`);
}
console.log("rejected export manifest without required provenance");
