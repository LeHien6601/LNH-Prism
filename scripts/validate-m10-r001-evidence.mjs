import {createHash} from "node:crypto";
import {access,readFile} from "node:fs/promises";
import {resolve} from "node:path";
const root=resolve("."),e=resolve(root,"docs/validation/evidence/m10-volcanic-forge"),matrix=JSON.parse(await readFile(resolve(e,"matrix.json"))),manifest=JSON.parse(await readFile(resolve(root,"assets/m10-volcanic-forge/manifest.json"))),hash=x=>createHash("sha256").update(x).digest("hex");
if(matrix.count!==26||manifest.modules.length!==52||!manifest.components.includes("icon-container"))throw Error("M10 matrix or canonical inventory incomplete");
for(const entry of matrix.entries){const svg=await readFile(resolve(e,"matrix",`${entry.name}.svg`));if(hash(svg)!==entry.svgSha256||svg.includes("<image")||!svg.includes("m10-volcanic-forge-0.2.0"))throw Error(`M10 SVG receipt/boundary failure: ${entry.name}`);if(entry.component!=="progress"&&!svg.includes("data-layer=\"forge-ornament\""))throw Error(`missing forge layer: ${entry.name}`);if(entry.component.includes("button")&&svg.includes("data-ember-count=\"8\""))throw Error(`control emits embers: ${entry.name}`);}
for(const file of["M10-E-source-scale.html","M10-E-target-phone.html","M10-E-thumbnail.html","M10-R001-clean-reproduction-receipt.json","m10-volcanic-forge-target-phone.png"])await access(resolve(e,file));
console.log(`validated ${matrix.count} M10 entries, ${manifest.modules.length} modules, canonical inventory, three review surfaces, and bounds.`);
