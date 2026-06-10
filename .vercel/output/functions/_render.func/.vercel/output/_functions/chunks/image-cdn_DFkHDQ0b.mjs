const TRANSFORMS_ENABLED = ("off").toString().toLowerCase() === "on";
const OBJECT_PUBLIC_RE = /\/storage\/v1\/object\/public\//i;
const RENDER_PUBLIC_RE = /\/storage\/v1\/render\/image\/public\//i;
function supabaseImage(src, opts = {}) {
  if (!src || typeof src !== "string") return src ?? "";
  if (!TRANSFORMS_ENABLED) return src;
  if (!/^https?:\/\//i.test(src)) return src;
  let url;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  const isObjectPath = OBJECT_PUBLIC_RE.test(url.pathname);
  const isRenderPath = RENDER_PUBLIC_RE.test(url.pathname);
  if (!isObjectPath && !isRenderPath) return src;
  if (isObjectPath) {
    url.pathname = url.pathname.replace(
      OBJECT_PUBLIC_RE,
      "/storage/v1/render/image/public/"
    );
  }
  const width = clampInt(opts.width, 16, 4096);
  const height = clampInt(opts.height, 16, 4096);
  const quality = clampInt(opts.quality ?? 72, 20, 100);
  const format = opts.format ?? "webp";
  const resize = opts.resize ?? "cover";
  if (width) url.searchParams.set("width", String(width));
  if (height) url.searchParams.set("height", String(height));
  url.searchParams.set("quality", String(quality));
  if (format !== "origin") url.searchParams.set("format", format);
  if (width && height) url.searchParams.set("resize", resize);
  return url.toString();
}
function supabaseSrcSet(src, widths, opts = {}) {
  const empty = { src: src ?? "", srcset: "" };
  if (!src || typeof src !== "string") return empty;
  if (!isSupabaseStorageUrl(src)) return { src, srcset: "" };
  if (!widths.length) return { src, srcset: "" };
  const sorted = [...widths].filter((w) => Number.isFinite(w) && w > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return { src, srcset: "" };
  const entries = sorted.map((w) => `${supabaseImage(src, { ...opts, width: w })} ${w}w`);
  const largest = supabaseImage(src, { ...opts, width: sorted[sorted.length - 1] });
  return { src: largest, srcset: entries.join(", ") };
}
function clampInt(n, min, max) {
  if (n == null || !Number.isFinite(n)) return void 0;
  const i = Math.round(n);
  return Math.max(min, Math.min(max, i));
}
function isSupabaseStorageUrl(src) {
  if (!src || typeof src !== "string") return false;
  if (!/^https?:\/\//i.test(src)) return false;
  try {
    const u = new URL(src);
    return OBJECT_PUBLIC_RE.test(u.pathname) || RENDER_PUBLIC_RE.test(u.pathname);
  } catch {
    return false;
  }
}

export { supabaseSrcSet as s };
