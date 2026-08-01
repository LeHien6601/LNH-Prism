import { prismSchemaPackage } from "@lnh-prism/schema";

export const prismCorePackage = Object.freeze({
  name: "@lnh-prism/core",
  version: "0.1.0",
  status: "boundary-only",
  dependencies: [prismSchemaPackage.name]
});
