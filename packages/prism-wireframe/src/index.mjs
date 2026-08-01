import { prismCorePackage } from "@lnh-prism/core";
import { prismSchemaPackage } from "@lnh-prism/schema";

export const prismWireframePackage = Object.freeze({
  name: "@lnh-prism/wireframe",
  version: "0.1.0",
  status: "boundary-only",
  dependencies: [prismCorePackage.name, prismSchemaPackage.name]
});
