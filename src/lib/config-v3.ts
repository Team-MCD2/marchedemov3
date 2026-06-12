/**
 * Marché de Mo' V3 Storefront Configuration
 * Centralised layout and design toggle.
 *
 * `isV3Active` is the BUILD-TIME default for the whole site:
 *   true  → E.Leclerc-like storefront layout (V3)
 *   false → original V2 storefront layout
 *
 * At request time, a visitor (or you, while comparing) can override the
 * default per-browser via the floating toggle button rendered in
 * `Layout.astro`. The button sets the `mdm_storefront` cookie to "v2" or
 * "v3" and reloads. `resolveV3()` reads that cookie and wins over the
 * default — but ONLY on server-rendered pages (`prerender = false`, e.g.
 * the homepage). Statically prerendered pages keep the build default,
 * which is fine: the homepage is the main comparison surface.
 */
export const configV3 = {
  isV3Active: true,
};

export const STOREFRONT_COOKIE = "mdm_storefront";

/** Minimal shape of Astro.cookies — avoids importing astro types here. */
interface CookieReader {
  get(name: string): { value?: string } | undefined;
}

/**
 * Resolve whether V3 is active for THIS request.
 * Priority: per-request cookie override → build-time default.
 * Pass `Astro.cookies`. Safe to call with `undefined` (→ default).
 */
export function resolveV3(cookies?: CookieReader): boolean {
  try {
    const v = cookies?.get(STOREFRONT_COOKIE)?.value;
    if (v === "v2") return false;
    if (v === "v3") return true;
  } catch {
    /* no request context (prerender) → fall through to default */
  }
  return configV3.isV3Active;
}
