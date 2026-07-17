import { mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const editor="C:/Program Files/Unity/Hub/Editor/6000.3.18f1/Editor/Unity.exe";
const project=resolve("unity/v4-frostbound-reward-claim");
const evidence=resolve("docs/validation/evidence/m4-s3-unity-import");
if(!existsSync(editor)) throw new Error(`Pinned Unity Editor is missing: ${editor}`);
mkdirSync(evidence,{recursive:true});
function run(name,args){
  const result=spawnSync(editor,["-batchmode","-nographics","-projectPath",project,...args],{stdio:"inherit",windowsHide:true});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(`${name} failed with exit code ${result.status}.`);
}
run("initial Frostbound import",["-executeMethod","LNHPrism.Editor.FrostboundUnityImporter.RunBatch","-logFile",resolve(evidence,"initial-import.log")]);
run("unchanged Frostbound import",["-executeMethod","LNHPrism.Editor.FrostboundUnityImporter.RunBatch","-logFile",resolve(evidence,"unchanged-import.log")]);
run("M4-S3 Edit Mode tests",["-runTests","-testPlatform","EditMode","-testResults",resolve(evidence,"edit-mode-results.xml"),"-logFile",resolve(evidence,"edit-mode.log")]);
console.log(`Prepared M4-S3 Unity import evidence in ${evidence}.`);
