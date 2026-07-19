import {createHash} from "node:crypto";
import {readFile,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
const evidence=resolve("docs/validation/evidence/m10-volcanic-forge"),matrixPath=resolve(evidence,"matrix.json"),matrix=JSON.parse(await readFile(matrixPath,"utf8")),hash=value=>createHash("sha256").update(value).digest("hex");
for(const entry of matrix.entries){entry.svgSha256=hash(await readFile(resolve(evidence,"matrix",`${entry.name}.svg`)));entry.pngSha256=hash(await readFile(resolve(evidence,"matrix",`${entry.name}.png`)));}
await writeFile(matrixPath,`${JSON.stringify(matrix,null,2)}\n`);
