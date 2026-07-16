import { renderNeonAlloyComponentSvg } from "./neon-alloy-components.js";

function image(svg: string, x: number, y: number, width: number, height: number): string {
  return `<image href="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" x="${x}" y="${y}" width="${width}" height="${height}"/>`;
}

/** Deterministic M2-S4 portrait shop composition from the shared component recipes. */
export function renderNeonMarketScenarioSvg(surface: "dark" | "light" = "dark"): string {
  const backdrop = surface === "dark" ? "#06131F" : "#E7F6FF";
  const panel = renderNeonAlloyComponentSvg({ component: "panel", width: 432, height: 360, accentDecal: true });
  const tabNormal = renderNeonAlloyComponentSvg({ component: "tab", width: 112, height: 44 });
  const tabSelected = renderNeonAlloyComponentSvg({ component: "tab", width: 112, height: 44, state: "selected" });
  const badge = renderNeonAlloyComponentSvg({ component: "badge", width: 160, height: 44, state: "highlighted", accentDecal: true });
  const primary = renderNeonAlloyComponentSvg({ component: "button", width: 240, height: 56 });
  const secondary = renderNeonAlloyComponentSvg({ component: "button", width: 160, height: 56, state: "pressed" });
  const progress = renderNeonAlloyComponentSvg({ component: "progress", width: 320, height: 24, percent: 50 });
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 540 960" role="img" aria-label="Neon Market scenario on ${surface} surface"><rect width="540" height="960" fill="${backdrop}"/><text x="270" y="92" text-anchor="middle" fill="#C9FAFF" font-family="sans-serif" font-size="28" font-weight="700">NEON MARKET</text>${image(panel, 54, 180, 432, 360)}${image(badge, 326, 202, 160, 44)}${image(tabSelected, 70, 258, 112, 44)}${image(tabNormal, 190, 258, 112, 44)}${image(tabNormal, 310, 258, 112, 44)}${image(progress, 110, 420, 320, 24)}${image(primary, 150, 480, 240, 56)}${image(secondary, 190, 550, 160, 56)}<text x="126" y="286" fill="#D9FFFF" font-family="sans-serif" font-size="13">FEATURED</text><text x="238" y="286" fill="#D9FFFF" font-family="sans-serif" font-size="13">SKINS</text><text x="352" y="286" fill="#D9FFFF" font-family="sans-serif" font-size="13">BOOSTS</text><text x="406" y="230" fill="#D9FFFF" font-family="sans-serif" font-size="15">1,250</text><text x="270" y="514" text-anchor="middle" fill="#F2FFFF" font-family="sans-serif" font-size="18" font-weight="700">BUY NOW</text><text x="270" y="585" text-anchor="middle" fill="#D9FFFF" font-family="sans-serif" font-size="15">CANCEL</text><text x="270" y="410" text-anchor="middle" fill="#D9FFFF" font-family="sans-serif" font-size="14">LIMITED OFFER · 50%</text></svg>`;
}
