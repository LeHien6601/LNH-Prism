export const BROWSER_RECIPE_EXPORTS = [
  "BUTTON_HEIGHT_LOGICAL",
  "BUTTON_WIDTH_BOUNDS",
  "BUTTON_STATES",
  "PROGRESS_HEIGHT_LOGICAL",
  "PROGRESS_WIDTH_BOUNDS",
  "PROGRESS_REVIEW_PERCENTAGES",
  "renderPrimaryButtonSvg",
  "getProgressFillGeometry",
  "renderProgressFrameSvg",
  "renderProgressFillSvg",
  "renderPrimaryProgressBarSvg"
];

export function buildClassicBrowserRecipes(compiledModule) {
  if (/^\s*import\s/m.test(compiledModule)) throw new Error("Browser SVG recipes must remain dependency-free.");
  const body = compiledModule
    .replace(/^export\s+/gm, "")
    .replace(/^\s*export\s*\{\s*\};?\s*$/gm, "");
  return `/* Generated from dist/renderer/svg-recipes.js. Do not edit. */\n(function (global) {\n${body}\n  global.LNHPrismRecipes = Object.freeze({ ${BROWSER_RECIPE_EXPORTS.join(", ")} });\n})(globalThis);\n`;
}
