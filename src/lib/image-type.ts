/**
 * Distinguishes official UA graphic posters (announcement art, citations,
 * infographics — uploaded as .png) from real photography (.jpg).
 * Posters are displayed as contained frames instead of full-bleed crops.
 */
export function isPosterImage(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.toLowerCase().endsWith(".png");
}
