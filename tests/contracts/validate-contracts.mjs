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
  ["primary-button.json", "component-spec.schema.json"],
  ["primary-panel.json", "component-spec.schema.json"],
  ["primary-progress-bar.json", "component-spec.schema.json"],
  ["neon-core-materials.json", "material-pack.schema.json"],
  ["primary-button-normal.manifest.json", "export-manifest.schema.json"]
]);

for (const [exampleFile, schemaFile] of exampleSchemas) {
  const example = JSON.parse(await readFile(join(exampleDir, exampleFile), "utf8"));
  const schema = schemas.get(schemaFile);
  const validate = ajv.getSchema(schema.$id);
  if (!validate(example)) throw new Error(`${exampleFile} failed ${schemaFile}: ${ajv.errorsText(validate.errors)}`);
  console.log(`validated ${exampleFile}`);
}

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
