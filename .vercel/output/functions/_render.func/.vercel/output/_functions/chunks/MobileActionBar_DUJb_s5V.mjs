import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';

function FilterChip({ label, onRemove, tone = "default" }) {
  const toneCls = tone === "sort" ? "bg-vert/10 text-vert-dark" : "bg-white border border-black/10 text-neutral-700";
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full text-[12px] font-bold ${toneCls}`,
      children: [
        /* @__PURE__ */ jsx("span", { children: label }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            "aria-label": `Retirer le filtre ${typeof label === "string" ? label : ""}`,
            className: "w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center",
            children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
}

function BulkActionsBar({ count, onClear, actions = [] }) {
  if (!count || count <= 0) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "region",
      "aria-label": "Actions groupées",
      "aria-live": "polite",
      className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-2rem)] bg-noir text-white rounded-full shadow-2xl pl-5 pr-2 py-2 flex items-center gap-3",
      children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[13px] font-bold whitespace-nowrap", children: [
          count,
          " sélectionné",
          count > 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block h-5 w-px bg-white/20" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 overflow-x-auto no-scrollbar", children: actions.map((a, i) => {
          const tone = a.tone || "default";
          const base = "px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition disabled:opacity-50";
          const toneCls = tone === "primary" ? "bg-vert text-white hover:bg-vert-dark" : tone === "danger" ? "bg-rouge text-white hover:bg-rouge/90" : "bg-white/10 text-white hover:bg-white/20";
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: a.onClick,
              disabled: a.disabled,
              className: `${base} ${toneCls}`,
              title: a.title ?? a.label,
              children: a.label
            },
            i
          );
        }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClear,
            "aria-label": "Effacer la s\\u00e9lection (Esc)",
            title: "Effacer la s\\u00e9lection (Esc)",
            className: "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
}

function UndoSnackbar({ label, deadline, onUndo, row }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setNow(Date.now());
      if (Date.now() < deadline) {
        raf = window.setTimeout(tick, 100);
      }
    };
    tick();
    return () => {
      if (raf) clearTimeout(raf);
    };
  }, [deadline, row?.id]);
  const total = 8e3;
  const remaining = Math.max(0, deadline - now);
  const fraction = Math.max(0, Math.min(1, remaining / total));
  const RADIUS = 8;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - fraction);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-noir text-white text-[13px] font-bold shadow-2xl flex items-center gap-3 max-w-[calc(100vw-2rem)]",
      children: [
        /* @__PURE__ */ jsx("span", { className: "truncate", children: label }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: onUndo,
            className: "relative inline-flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-full bg-vert hover:bg-vert-dark transition shrink-0",
            "aria-label": `Annuler la suppression — ${Math.ceil(remaining / 1e3)} s restantes`,
            children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 20 20",
                  "aria-hidden": "true",
                  className: "shrink-0",
                  children: [
                    /* @__PURE__ */ jsx(
                      "circle",
                      {
                        cx: "10",
                        cy: "10",
                        r: RADIUS,
                        fill: "none",
                        stroke: "currentColor",
                        strokeOpacity: "0.25",
                        strokeWidth: "2"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "circle",
                      {
                        cx: "10",
                        cy: "10",
                        r: RADIUS,
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeDasharray: CIRC,
                        strokeDashoffset: dashOffset,
                        transform: "rotate(-90 10 10)",
                        style: { transition: "stroke-dashoffset 100ms linear" }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Annuler" })
            ]
          }
        )
      ]
    }
  );
}

/**
 * exportRows — tiny CSV/JSON export helpers for the admin list views.
 *
 * Companion to the existing import flow in `ProduitsManager.jsx` and
 * `PromosManager.jsx` : the CSV emitted here is shaped exactly so the
 * import drawer can ingest it back unchanged. That round-trip is the
 * point — owners want to mass-edit in Excel / Sheets / Numbers.
 *
 * Behaviour
 * ---------
 *   - CSV uses RFC-4180-ish quoting: every cell is wrapped in double
 *     quotes ; embedded `"` are doubled. Comma is the separator (matches
 *     the importer's auto-detect priority).
 *   - First line is a header derived from the `columns` array.
 *   - JSON is plain `JSON.stringify(rows, null, 2)`.
 *   - Triggers a browser download via a transient <a download> ; cleans
 *     up the object URL on next tick.
 */

/**
 * @param {string} value
 */
function csvCell(value) {
  if (value == null) return '""';
  const s = String(value);
  /* Escape doubled-quotes ; quote everything (cheaper than checking
   * for special chars and getting the rules wrong on edge cases like
   * embedded newlines or NBSP). */
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * @param {Array<Record<string, unknown>>} rows
 * @param {Array<{ key: string, header?: string }>} columns
 * @returns {string}
 */
function rowsToCsv(rows, columns) {
  const headerLine = columns.map((c) => csvCell(c.header ?? c.key)).join(",");
  const bodyLines = rows.map((r) =>
    columns.map((c) => csvCell(r?.[c.key] ?? "")).join(","),
  );
  return [headerLine, ...bodyLines].join("\r\n") + "\r\n";
}

/**
 * Trigger a browser download for the given text payload.
 *
 * @param {string} filename
 * @param {string} content
 * @param {string} mimeType
 */
function downloadText(filename, content, mimeType) {
  if (typeof window === "undefined") return;
  /* Prepend a UTF-8 BOM for CSV so Excel on Windows opens accents
   * correctly without the user picking encoding manually. */
  const isCsv = mimeType.startsWith("text/csv");
  const payload = isCsv ? `\uFEFF${content}` : content;
  const blob = new Blob([payload], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  /* Firefox needs the anchor in the DOM to honour the download
   * attribute reliably. */
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

/**
 * @param {string} prefix - e.g. "produits"
 */
function timestampedFilename(prefix, ext) {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  return `${prefix}-${stamp}.${ext}`;
}

function ExportMenu({ rows, totalRows, kind = "produits" }) {
  const [open, setOpen] = useState(false);
  const empty = !rows || rows.length === 0;
  const columns = kind === "promos" ? PROMO_COLUMNS : PRODUIT_COLUMNS;
  function exportAs(format) {
    if (empty) return;
    const filename = timestampedFilename(kind, format);
    if (format === "csv") {
      const csv = rowsToCsv(rows, columns);
      downloadText(filename, csv, "text/csv");
    } else {
      const slim = rows.map((r) => Object.fromEntries(
        columns.map((c) => [c.key, r[c.key] ?? null])
      ));
      downloadText(filename, JSON.stringify(slim, null, 2), "application/json");
    }
    setOpen(false);
  }
  return /* @__PURE__ */ jsxs(
    "details",
    {
      className: "relative",
      open,
      onToggle: (e) => setOpen(e.currentTarget.open),
      children: [
        /* @__PURE__ */ jsxs(
          "summary",
          {
            className: `list-none cursor-pointer px-4 py-2 rounded-full text-[13px] font-bold border-2 transition inline-flex items-center gap-1.5 ${empty ? "bg-white border-black/10 text-neutral-500 cursor-not-allowed" : "bg-white border-black/10 hover:border-vert hover:text-vert"}`,
            title: empty ? "Aucune ligne à exporter" : `Exporter ${rows.length} ligne(s)`,
            "aria-disabled": empty || void 0,
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4M7 10l5 5 5-5M12 15V3", strokeLinecap: "round", strokeLinejoin: "round" }) }),
              "Exporter",
              /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 opacity-60", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ]
          }
        ),
        !empty && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-black/5 p-2 z-30", children: [
          /* @__PURE__ */ jsx("p", { className: "px-3 pt-1 pb-2 text-[]-neutral-600", children: rows.length === totalRows ? `${rows.length} ligne(s)` : `${rows.length} sur ${totalRows} (filtrées)` }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => exportAs("csv"),
              className: "block w-full text-left px-3 py-2 rounded-lg text-[13px] hover:bg-white",
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: "CSV" }),
                /* @__PURE__ */ jsx("span", { className: "block text-[]-neutral-600", children: "Excel · Numbers · Sheets" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => exportAs("json"),
              className: "block w-full text-left px-3 py-2 rounded-lg text-[13px] hover:bg-white",
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: "JSON" }),
                /* @__PURE__ */ jsx("span", { className: "block text-[]-neutral-600", children: "Réimportable tel quel" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const PRODUIT_COLUMNS = [
  { key: "slug" },
  { key: "nom" },
  { key: "rayon" },
  { key: "categorie" },
  { key: "sous_categorie" },
  { key: "origine" },
  { key: "badge" },
  { key: "unite" },
  { key: "prix_indicatif" },
  { key: "image_url" },
  { key: "description" },
  { key: "actif" },
  { key: "ordre" }
];
const PROMO_COLUMNS = [
  { key: "slug" },
  { key: "titre" },
  { key: "rayon" },
  { key: "magasin" },
  { key: "prix_original" },
  { key: "prix_promo" },
  { key: "reduction_pct" },
  { key: "date_debut" },
  { key: "date_fin" },
  { key: "mise_en_avant" },
  { key: "image_url" },
  { key: "description" },
  { key: "actif" },
  { key: "ordre" }
];

function MobileActionBar({
  label = "Nouveau",
  onNew,
  filterCount = 0,
  toolbarId
}) {
  function scrollToToolbar() {
    const el = toolbarId ? document.getElementById(toolbarId) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const focusable = el.querySelector("input, select, button");
      if (focusable instanceof HTMLElement) {
        setTimeout(() => focusable.focus({ preventScroll: true }), 300);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "toolbar",
      "aria-label": "Actions rapides",
      className: "md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-black/10 px-3 py-2 flex items-center gap-2",
      style: { paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" },
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: scrollToToolbar,
            "aria-label": "Filtres et recherche",
            className: "relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-full text-[12px] font-bold bg-white border border-black/10 hover:border-noir transition",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M3 6h18M6 12h12M10 18h4", strokeLinecap: "round", strokeLinejoin: "round" }) }),
              "Filtres",
              filterCount > 0 && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-label": `${filterCount} filtre(s) actif(s)`,
                  className: "absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rouge text-white text-[10px] font-bold flex items-center justify-center",
                  children: filterCount
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: scrollToToolbar,
            "aria-label": "Trier",
            className: "flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-full text-[12px] font-bold bg-white border border-black/10 hover:border-noir transition",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M3 6h13M3 12h9M3 18h5M17 4v16m0 0-3-3m3 3 3-3", strokeLinecap: "round", strokeLinejoin: "round" }) }),
              "Trier"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: onNew,
            className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-[12px] font-bold bg-vert text-white hover:bg-vert-dark transition",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14", strokeLinecap: "round" }) }),
              label
            ]
          }
        )
      ]
    }
  );
}

export { BulkActionsBar as B, ExportMenu as E, FilterChip as F, MobileActionBar as M, UndoSnackbar as U };
