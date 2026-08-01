import { prismCorePackage } from "@lnh-prism/core";
import { prismSchemaPackage } from "@lnh-prism/schema";
import { prismUnityContractPackage } from "@lnh-prism/unity-contract";
import { prismWireframePackage } from "@lnh-prism/wireframe";

export const prismCliPackage = Object.freeze({
  name: "@lnh-prism/cli",
  version: "0.1.0",
  status: "boundary-only",
  dependencies: [
    prismCorePackage.name,
    prismSchemaPackage.name,
    prismUnityContractPackage.name,
    prismWireframePackage.name
  ]
});
