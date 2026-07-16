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
