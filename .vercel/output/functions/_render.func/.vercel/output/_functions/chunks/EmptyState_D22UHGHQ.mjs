import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useCallback } from 'react';
import { a as adminFetch } from './adminFetch_BJhji8N3.mjs';

/**
 * imageOptimize — client-side resize + re-encode for admin uploads.
 *
 * Why
 * ---
 * The admin upload endpoint caps files at 8 MB and Supabase Storage
 * bandwidth is finite. Modern phone cameras routinely produce 6–12 MB
 * JPEGs at 4000+ px on the long edge — way more than any product
 * thumbnail or rayon hero needs (the public site never serves wider
 * than ~1280 px). Resizing in-browser before upload :
 *
 *   - Cuts payloads 5–20× → faster uploads on shop-floor 4G
 *   - Sidesteps the 8 MB rejection without owner intervention
 *   - Strips EXIF (privacy / GPS) for free
 *
 * Strategy
 * --------
 * Decode → letterbox-fit a Canvas at `MAX_EDGE` longest edge → encode
 * to WebP at `QUALITY`. Keeps the original `File.name` so the server-
 * side filename slugifier still produces predictable storage keys ;
 * the extension is rewritten to `.webp` only when the body actually
 * was re-encoded.
 *
 * Bypass conditions (returns the original `File` unchanged) :
 *   - SVG : already vector, would lose quality
 *   - GIF : may be animated, canvas would freeze it
 *   - Already small (< MIN_BYTES_TO_OPTIMIZE) AND already small-pixel
 *   - Re-encoding produced a larger blob (rare, e.g. tiny PNG icons)
 *   - Browser doesn't support `canvas.toBlob` or `createImageBitmap`
 *     (very old browsers — fall back gracefully to the raw file)
 */

const MAX_EDGE = 2048;
const QUALITY = 0.85;
const MIN_BYTES_TO_OPTIMIZE = 250 * 1024; /* 250 KB */
const SKIP_MIME = new Set(["image/svg+xml", "image/gif"]);

/**
 * @param {File} file
 * @returns {Promise<{ file: File, optimized: boolean, originalBytes: number, finalBytes: number }>}
 */
async function optimizeImage(file) {
  const originalBytes = file.size;
  const passthrough = (reason) => ({
    file,
    optimized: false,
    originalBytes,
    finalBytes: originalBytes,
    reason,
  });

  if (!file || !file.type || !file.type.startsWith("image/")) {
    return passthrough("not-an-image");
  }
  if (SKIP_MIME.has(file.type)) {
    return passthrough(`skip-mime:${file.type}`);
  }
  if (typeof window === "undefined" || !window.createImageBitmap) {
    return passthrough("no-bitmap-support");
  }

  let bitmap;
  try {
    bitmap = await window.createImageBitmap(file);
  } catch {
    return passthrough("decode-failed");
  }
  const { width, height } = bitmap;
  const longEdge = Math.max(width, height);

  /* If the image is already small (under both byte and pixel
   * thresholds) we skip the round-trip — re-encoding rarely beats
   * the source for already-optimized assets. */
  if (originalBytes < MIN_BYTES_TO_OPTIMIZE && longEdge <= MAX_EDGE) {
    bitmap.close?.();
    return passthrough("already-small");
  }

  const scale = longEdge > MAX_EDGE ? MAX_EDGE / longEdge : 1;
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  /* Prefer OffscreenCanvas when available (no DOM mutation) ; fall
   * back to a regular <canvas> for browsers without it. */
  let canvas;
  if (typeof OffscreenCanvas !== "undefined") {
    canvas = new OffscreenCanvas(targetW, targetH);
  } else {
    canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return passthrough("no-2d-ctx");
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  /* WebP gives the best quality/byte ratio across our use-cases.
   * Some browsers fall back silently to PNG if WebP isn't supported ;
   * we detect that by checking the resulting blob's `type`. */
  const blob = await canvasToBlob(canvas, "image/webp", QUALITY);
  if (!blob) return passthrough("canvas-toblob-failed");

  /* Re-encoding inflated the file (common for already-optimized icons
   * where headers + recompression beat a small source). Keep the
   * original. */
  if (blob.size >= originalBytes) {
    return passthrough("inflated");
  }

  const baseName = file.name.replace(/\.[a-z0-9]{1,5}$/i, "");
  const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/jpeg" ? "jpg" : "png";
  const optimized = new File([blob], `${baseName}.${ext}`, {
    type: blob.type || "image/webp",
    lastModified: Date.now(),
  });
  return {
    file: optimized,
    optimized: true,
    originalBytes,
    finalBytes: optimized.size,
    width: targetW,
    height: targetH,
  };
}

/**
 * @param {HTMLCanvasElement | OffscreenCanvas} canvas
 * @param {string} mime
 * @param {number} quality
 * @returns {Promise<Blob | null>}
 */
function canvasToBlob(canvas, mime, quality) {
  if (typeof canvas.convertToBlob === "function") {
    return canvas.convertToBlob({ type: mime, quality }).catch(() => null);
  }
  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== "function") return resolve(null);
    canvas.toBlob((b) => resolve(b), mime, quality);
  });
}

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/quicktime,video/webm";
const MAX_BYTES = 8 * 1024 * 1024;
function InlineImageUpload({
  folder,
  value,
  onChange,
  renameTo,
  label = "Image",
  hint
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualUrl, setManualUrl] = useState(value ?? "");
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    setManualUrl(value ?? "");
  }, [value]);
  const uploadOne = useCallback(
    async (file) => {
      if (!file) return;
      setError(null);
      if (!file.type || !ACCEPT.split(",").includes(file.type)) {
        setError(`Type non accepté : ${file.type || "inconnu"}`);
        return;
      }
      const isVideo = file.type.startsWith("video/");
      const maxAllowed = isVideo ? 30 * 1024 * 1024 : MAX_BYTES * 2;
      if (file.size > maxAllowed) {
        setError(`Fichier beaucoup trop gros (${(file.size / 1024 / 1024).toFixed(1)} Mo)`);
        return;
      }
      if (folder === "home" && !isVideo) {
        try {
          const dims = await new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              const res = { w: img.width, h: img.height };
              URL.revokeObjectURL(img.src);
              resolve(res);
            };
            img.onerror = () => {
              URL.revokeObjectURL(img.src);
              resolve(null);
            };
          });
          if (!dims) {
            setError("Impossible de valider les dimensions de l'image.");
            return;
          }
          if (dims.w !== 1600 || dims.h !== 900) {
            setError(`Dimensions de votre fichier : ${dims.w}×${dims.h} px. L'image pour les slides PromoHero doit faire exactement 1600×900 pixels.`);
            return;
          }
        } catch (e) {
          setError("Erreur lors de la validation de l'image.");
          return;
        }
      }
      setUploading(true);
      try {
        let toSend = file;
        let optimized = false;
        let originalBytes = file.size;
        let finalBytes = file.size;
        if (!isVideo) {
          const opt = await optimizeImage(file);
          toSend = opt.file;
          optimized = opt.optimized;
          originalBytes = opt.originalBytes;
          finalBytes = opt.finalBytes;
          if (toSend.size > MAX_BYTES) {
            throw new Error(
              `Fichier trop gros après optimisation (${(toSend.size / 1024 / 1024).toFixed(1)} Mo > 8 Mo).`
            );
          }
        } else {
          if (file.size > 30 * 1024 * 1024) {
            throw new Error(`Fichier vidéo trop gros (${(file.size / 1024 / 1024).toFixed(1)} Mo > 30 Mo).`);
          }
        }
        const form = new FormData();
        form.append("file", toSend);
        form.append("folder", folder);
        if (renameTo) form.append("renameTo", renameTo);
        form.append("upsert", "1");
        const res = await adminFetch("/api/admin/medias", { method: "POST", body: form });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || res.statusText);
        }
        const data = await res.json();
        onChange?.(data.file.publicUrl);
        if (optimized) {
          const saved = ((1 - finalBytes / originalBytes) * 100).toFixed(0);
          console.info(
            `[InlineImageUpload] Optimisé ${(originalBytes / 1024).toFixed(0)} Ko → ${(finalBytes / 1024).toFixed(0)} Ko (−${saved}%)`
          );
        }
      } catch (err) {
        setError(err?.message || "Erreur d'upload");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, renameTo]
  );
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragEnter = (e) => {
      e.preventDefault();
      if (e.dataTransfer?.types?.includes("Files")) setDragging(true);
    };
    const onDragOver = (e) => {
      e.preventDefault();
    };
    const onDragLeave = (e) => {
      if (e.target === el) setDragging(false);
    };
    const onDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) uploadOne(file);
    };
    el.addEventListener("dragenter", onDragEnter);
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragenter", onDragEnter);
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, [uploadOne]);
  function clear() {
    setError(null);
    onChange?.("");
  }
  function onManualApply() {
    const next = manualUrl.trim();
    if (next && next !== value) onChange?.(next);
  }
  const hasImage = !!value;
  const isVideoUrl = hasImage && (value.match(/\.(mp4|webm|mov|ogg)/i) || value.includes("/video/upload/"));
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: label }),
      hasImage && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: clear,
          className: "text-[]-neutral-600 hover:text-rouge transition",
          children: "Retirer"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: dropRef,
        className: [
          "relative rounded-2xl border-2 border-dashed transition overflow-hidden",
          dragging ? "border-vert bg-vert/5" : "border-black/15 bg-white/50",
          uploading ? "opacity-70 pointer-events-none" : ""
        ].join(" "),
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "shrink-0 w-20 h-20 rounded-xl bg-white ring-1 ring-black/5 overflow-hidden flex items-center justify-center", children: hasImage ? isVideoUrl ? /* @__PURE__ */ jsx(
            "video",
            {
              src: value,
              className: "w-full h-full object-cover",
              muted: true,
              playsInline: true
            }
          ) : /* @__PURE__ */ jsx(
            "img",
            {
              src: value,
              alt: "",
              className: "w-full h-full object-cover",
              onError: (e) => {
                e.currentTarget.style.display = "none";
              }
            }
          ) : /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "w-8 h-8 text-neutral-300",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.5",
              children: [
                /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
                /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                /* @__PURE__ */ jsx("path", { d: "m21 15-5-5L5 21", strokeLinecap: "round", strokeLinejoin: "round" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-neutral-600 leading-snug", children: [
              /* @__PURE__ */ jsx("strong", { className: "text-noir", children: "Déposez" }),
              " une image ici,",
              " ",
              /* @__PURE__ */ jsx("strong", { className: "text-noir", children: "ou" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ACCEPT,
                  className: "hidden",
                  onChange: (e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadOne(f);
                    e.target.value = "";
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => fileInputRef.current?.click(),
                  className: "px-3 py-1.5 rounded-full bg-vert text-white text-[12px] font-bold hover:bg-vert-dark transition disabled:opacity-60",
                  disabled: uploading,
                  children: uploading ? "Envoi…" : hasImage ? "Remplacer…" : "Choisir un fichier"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowManual((v) => !v),
                  className: "px-3 py-1.5 rounded-full bg-white border border-black/10 text-[12px] font-bold text-neutral-600 hover:border-noir hover:text-noir transition",
                  "aria-expanded": showManual,
                  children: showManual ? "Masquer URL" : "Coller une URL"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "p",
              {
                "aria-live": "polite",
                className: "mt-1.5 text-[]-neutral-600 leading-snug min-h-[1em]",
                children: error ? /* @__PURE__ */ jsx("span", { className: "text-rouge font-bold", children: error }) : hint ?? "JPEG, PNG, WebP, AVIF, GIF ou SVG. 8 Mo max."
              }
            )
          ] })
        ] })
      }
    ),
    showManual && /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: manualUrl,
          onChange: (e) => setManualUrl(e.target.value),
          onBlur: onManualApply,
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onManualApply();
            }
          },
          className: "input flex-1",
          placeholder: "/images/promos/agneau.jpg ou https://…"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onManualApply,
          className: "px-3 py-2 rounded-full bg-noir text-white text-[12px] font-bold hover:bg-noir-soft transition",
          children: "Appliquer"
        }
      )
    ] })
  ] });
}

function EmptyState({
  title,
  description,
  icon,
  illustration,
  primaryLabel,
  primaryHref,
  primaryOnClick,
  secondaryLabel,
  secondaryHref,
  secondaryOnClick,
  tone = "neutral"
}) {
  const titleColor = tone === "vert" ? "text-vert-dark" : tone === "rouge" ? "text-rouge" : "text-neutral-700";
  return /* @__PURE__ */ jsxs("div", { className: "text-center py-10 px-4", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto", "aria-hidden": "true", children: icon ? /* @__PURE__ */ jsx("p", { className: "text-[36px] mb-2", children: icon }) : illustration ? illustration : /* @__PURE__ */ jsx(DefaultIllustration, { tone }) }),
    /* @__PURE__ */ jsx("p", { className: `font-soft font-bold text-[16px] ${titleColor}`, children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-[13px] text-neutral-500 max-w-sm mx-auto", children: description }),
    (primaryLabel || secondaryLabel) && /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-center gap-2", children: [
      primaryLabel && (primaryHref ? /* @__PURE__ */ jsx(
        "a",
        {
          href: primaryHref,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vert text-white text-[13px] font-bold hover:bg-vert-dark transition",
          children: primaryLabel
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: primaryOnClick,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vert text-white text-[13px] font-bold hover:bg-vert-dark transition",
          children: primaryLabel
        }
      )),
      secondaryLabel && (secondaryHref ? /* @__PURE__ */ jsx(
        "a",
        {
          href: secondaryHref,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black/10 hover:border-noir text-[13px] font-bold transition",
          children: secondaryLabel
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: secondaryOnClick,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black/10 hover:border-noir text-[13px] font-bold transition",
          children: secondaryLabel
        }
      ))
    ] })
  ] });
}
function DefaultIllustration({ tone }) {
  const accent = tone === "rouge" ? "#A8261B" : tone === "vert" ? "#1C6B35" : "#1C6B35";
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "96",
      height: "96",
      viewBox: "0 0 96 96",
      fill: "none",
      className: "mx-auto mb-3 opacity-90",
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M14 38 L82 38 L74 76 Q73 82 67 82 L29 82 Q23 82 22 76 Z",
            fill: "white",
            stroke: accent,
            strokeWidth: "2.4",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M28 38 Q28 18 48 18 Q68 18 68 38",
            fill: "none",
            stroke: accent,
            strokeWidth: "2.4",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M30 42 L27 78 M40 42 L39 78 M48 42 L48 78 M56 42 L57 78 M66 42 L69 78",
            stroke: accent,
            strokeOpacity: "0.35",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx("circle", { cx: "40", cy: "32", r: "6.5", fill: accent, fillOpacity: "0.85" }),
        /* @__PURE__ */ jsx("circle", { cx: "56", cy: "30", r: "5", fill: accent, fillOpacity: "0.55" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M40 25.5 Q40 22 43 22",
            stroke: "#A8261B",
            strokeWidth: "1.6",
            strokeLinecap: "round",
            fill: "none"
          }
        )
      ]
    }
  );
}

export { EmptyState as E, InlineImageUpload as I, optimizeImage as o };
