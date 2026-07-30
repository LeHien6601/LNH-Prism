import { createHash } from "node:crypto";
import { inflateSync } from "node:zlib";
import { Resvg } from "@resvg/resvg-js";

export function renderPng(svg, { width } = {}) {
  const options = width ? { fitTo: { mode: "width", value: width } } : {};
  return new Resvg(svg, options).render().asPng();
}

function chunks(bytes) {
  const values = [];
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString("ascii");
    values.push({ type, data: bytes.subarray(offset + 8, offset + 8 + length) });
    offset += 12 + length;
    if (type === "IEND") break;
  }
  return values;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : (pb <= pc ? b : c);
}

export function pngAlphaStats(bytes) {
  if (bytes.subarray(1, 4).toString("ascii") !== "PNG") throw new Error("Expected PNG bytes.");
  const parts = chunks(bytes);
  const ihdr = parts.find((chunk) => chunk.type === "IHDR")?.data;
  if (!ihdr) throw new Error("PNG is missing IHDR.");
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  if (bitDepth !== 8 || ![4, 6].includes(colorType)) {
    throw new Error(`PNG must use 8-bit alpha color; received bitDepth=${bitDepth}, colorType=${colorType}.`);
  }
  const bytesPerPixel = colorType === 6 ? 4 : 2;
  const rowLength = width * bytesPerPixel;
  const compressed = Buffer.concat(parts.filter((chunk) => chunk.type === "IDAT").map((chunk) => chunk.data));
  const raw = inflateSync(compressed);
  const rows = [];
  let inputOffset = 0;
  let previous = Buffer.alloc(rowLength);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[inputOffset];
    inputOffset += 1;
    const source = raw.subarray(inputOffset, inputOffset + rowLength);
    inputOffset += rowLength;
    const row = Buffer.alloc(rowLength);
    for (let x = 0; x < rowLength; x += 1) {
      const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0;
      const up = previous[x] ?? 0;
      const upperLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel] : 0;
      if (filter === 0) row[x] = source[x];
      else if (filter === 1) row[x] = source[x] + left;
      else if (filter === 2) row[x] = source[x] + up;
      else if (filter === 3) row[x] = source[x] + Math.floor((left + up) / 2);
      else if (filter === 4) row[x] = source[x] + paeth(left, up, upperLeft);
      else throw new Error(`Unsupported PNG filter ${filter}.`);
    }
    rows.push(row);
    previous = row;
  }
  let minimumAlpha = 255;
  let maximumAlpha = 0;
  let transparentPixels = 0;
  let edgeOpaquePixels = 0;
  const alphaOffset = bytesPerPixel - 1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = rows[y][x * bytesPerPixel + alphaOffset];
      minimumAlpha = Math.min(minimumAlpha, alpha);
      maximumAlpha = Math.max(maximumAlpha, alpha);
      if (alpha < 255) transparentPixels += 1;
      if ((x === 0 || y === 0 || x === width - 1 || y === height - 1) && alpha > 0) edgeOpaquePixels += 1;
    }
  }
  return {
    width,
    height,
    colorType,
    minimumAlpha,
    maximumAlpha,
    transparentPixels,
    edgeOpaquePixels,
    sha256: createHash("sha256").update(bytes).digest("hex")
  };
}
