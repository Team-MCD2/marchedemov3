import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useMemo } from 'react';
import { s as subscribeAdminEvents, A as ADMIN_EVENT, p as publishAdminEvent } from './admin-bus_D3U38ckw.mjs';
import { a as adminFetch, c as clearDraft, l as loadDraft, s as saveDraft } from './adminFetch_BJhji8N3.mjs';
import { o as optimizeImage, E as EmptyState, I as InlineImageUpload } from './EmptyState_D22UHGHQ.mjs';
import { E as ExportMenu, F as FilterChip, B as BulkActionsBar, M as MobileActionBar, U as UndoSnackbar } from './MobileActionBar_DUJb_s5V.mjs';
import { u as useAdminListState, c as compareRows } from './useAdminListState_Ty28nw7s.mjs';
import { h as humanizeError } from './admin-errors_BTeClwmf.mjs';
import { T as TAXONOMIE } from './taxonomie_BqHH0ZpJ.mjs';

const CONFIDENCE_COLORS = {
  high: "bg-vert/15 text-vert-dark border-vert/30",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-orange-100 text-orange-800 border-orange-300",
  none: "bg-neutral-100 text-neutral-500 border-neutral-300"
};
const CONFIDENCE_LABELS = {
  high: "Fiable",
  medium: "À vérifier",
  low: "Faible",
  none: "Aucun"
};
function MassImageMatchModal({ onClose, onApplied, rayonsOptions = [] }) {
  const [step, setStep] = useState("drop");
  const [files, setFiles] = useState([]);
  const [matches, setMatches] = useState({});
  const [choices, setChoices] = useState({});
  const [overwrite, setOverwrite] = useState(false);
  const [rayonHint, setRayonHint] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [applySummary, setApplySummary] = useState(null);
  const [err, setErr] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    return () => {
      files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
  }, []);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && step !== "uploading" && step !== "applying") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);
  function addFiles(list) {
    const images = list.filter((f) => f && f.type && f.type.startsWith("image/"));
    if (images.length === 0) return;
    const now = Date.now();
    setFiles((prev) => [
      ...prev,
      ...images.map((f, i) => ({
        id: `${now}-${i}-${f.name}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        status: "pending"
      }))
    ]);
  }
  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files || []));
  }
  function onPick(e) {
    addFiles(Array.from(e.target.files || []));
    if (inputRef.current) inputRef.current.value = "";
  }
  function removeFile(id) {
    setFiles((prev) => {
      const drop = prev.find((f) => f.id === id);
      if (drop?.previewUrl) URL.revokeObjectURL(drop.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }
  async function uploadAndMatch() {
    if (files.length === 0) return;
    setErr(null);
    setStep("uploading");
    setProgress({ done: 0, total: files.length });
    const CONCURRENCY = 3;
    const queue = [...files];
    const uploaded = [];
    async function uploadOne(f) {
      setFiles(
        (prev) => prev.map((x) => x.id === f.id ? { ...x, status: "uploading" } : x)
      );
      try {
        const opt = await optimizeImage(f.file);
        const fd = new FormData();
        fd.append("file", opt.file);
        fd.append("folder", "produits");
        fd.append("upsert", "1");
        const res = await adminFetch("/api/admin/medias", { method: "POST", body: fd });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || res.statusText);
        }
        const { file: meta } = await res.json();
        const next = {
          ...f,
          status: "uploaded",
          safeName: meta.name,
          path: meta.path,
          publicUrl: meta.publicUrl
        };
        uploaded.push(next);
        setFiles((prev) => prev.map((x) => x.id === f.id ? next : x));
      } catch (e) {
        setFiles(
          (prev) => prev.map((x) => x.id === f.id ? { ...x, status: "failed", error: e.message } : x)
        );
      } finally {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }
    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      while (queue.length > 0) {
        const next = queue.shift();
        if (next) await uploadOne(next);
      }
    });
    await Promise.all(workers);
    if (uploaded.length === 0) {
      setErr("Aucun fichier n'a pu être uploadé. Rien à matcher.");
      setStep("drop");
      return;
    }
    try {
      const res = await adminFetch("/api/admin/produits/match-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filenames: uploaded.map((u) => u.safeName),
          options: {
            onlyMissingImages: !overwrite,
            rayonHint: rayonHint || void 0,
            minScore: 0.5,
            max: 5
          }
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || res.statusText);
      }
      const data = await res.json();
      const results = data.matches ?? [];
      const byFilename = new Map(results.map((r) => [r.filename, r]));
      const byId = {};
      const choicesInit = {};
      for (const u of uploaded) {
        const r = byFilename.get(u.safeName);
        byId[u.id] = r;
        if (r?.best && (r.confidence === "high" || r.confidence === "medium")) {
          choicesInit[u.id] = { productId: r.best.product.id, skip: false };
        } else {
          choicesInit[u.id] = { productId: null, skip: true };
        }
      }
      setMatches(byId);
      setChoices(choicesInit);
      setStep("review");
    } catch (e) {
      setErr(`Matching échoué : ${e.message}`);
      setStep("drop");
    }
  }
  function setChoice(fileId, patch) {
    setChoices((prev) => ({ ...prev, [fileId]: { ...prev[fileId], ...patch } }));
  }
  function selectAllGreen() {
    setChoices((prev) => {
      const next = { ...prev };
      for (const f of files) {
        const r = matches[f.id];
        if (r?.best && r.confidence === "high") {
          next[f.id] = { productId: r.best.product.id, skip: false };
        }
      }
      return next;
    });
  }
  function skipAll() {
    setChoices((prev) => {
      const next = { ...prev };
      for (const f of files) {
        next[f.id] = { productId: null, skip: true };
      }
      return next;
    });
  }
  async function applyMatches(toApply) {
    if (toApply.length === 0) {
      setErr("Aucun match à appliquer.");
      return;
    }
    setErr(null);
    setStep("applying");
    setProgress({ done: 0, total: toApply.length });
    let applied = 0;
    let failed = 0;
    for (const item of toApply) {
      try {
        const res = await adminFetch(`/api/admin/produits/${item.productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: item.publicUrl })
        });
        if (!res.ok) throw new Error();
        applied++;
      } catch {
        failed++;
      } finally {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }
    const skipped = files.length - toApply.length;
    const summary = {
      applied,
      failed,
      skipped,
      uploaded: files.filter((f) => f.status === "uploaded").length
    };
    setApplySummary(summary);
    setStep("done");
    if (applied > 0) onApplied?.(summary);
  }
  async function applySelected() {
    const toApply = files.filter((f) => {
      const c = choices[f.id];
      return c && !c.skip && c.productId && f.publicUrl;
    }).map((f) => ({ productId: choices[f.id].productId, publicUrl: f.publicUrl }));
    if (toApply.length === 0) {
      setErr("Aucun match sélectionné.");
      return;
    }
    return applyMatches(toApply);
  }
  async function applyAllConfident() {
    const toApply = [];
    for (const f of files) {
      const r = matches[f.id];
      if (!f.publicUrl) continue;
      if (!r?.best || r.confidence !== "high") continue;
      toApply.push({ productId: r.best.product.id, publicUrl: f.publicUrl });
    }
    if (toApply.length === 0) {
      setErr("Aucun match confiant à appliquer.");
      return;
    }
    return applyMatches(toApply);
  }
  const stats = useMemo(() => {
    if (step !== "review") return null;
    let high = 0, medium = 0, low = 0, none = 0;
    for (const f of files) {
      const r = matches[f.id];
      if (!r || !r.best) {
        none++;
        continue;
      }
      if (r.confidence === "high") high++;
      else if (r.confidence === "medium") medium++;
      else low++;
    }
    return { high, medium, low, none };
  }, [step, files, matches]);
  const selectedCount = useMemo(() => {
    if (step !== "review") return 0;
    return files.reduce((acc, f) => {
      const c = choices[f.id];
      return acc + (c && !c.skip && c.productId ? 1 : 0);
    }, 0);
  }, [step, files, choices]);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-soft font-bold text-[20px]", children: "Importer images (auto-match)" }),
        /* @__PURE__ */ jsx("p", { className: "text-[]-neutral-600 mt-0.5", children: "Glissez plusieurs images — elles seront uploadées puis associées automatiquement aux produits par nom de fichier." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          "aria-label": "Fermer",
          disabled: step === "uploading" || step === "applying",
          className: "w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [
      err && /* @__PURE__ */ jsx("div", { className: "bg-rouge/5 border border-rouge/20 text-rouge rounded-2xl p-3 text-[13px]", children: err }),
      step === "drop" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onDragOver: (e) => {
              e.preventDefault();
              setDragging(true);
            },
            onDragLeave: () => setDragging(false),
            onDrop,
            className: `border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition ${dragging ? "border-vert bg-vert/5" : "border-black/15 bg-white/40"}`,
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 mx-auto text-neutral-500 mb-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12", strokeLinecap: "round", strokeLinejoin: "round" }) }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[15px] text-noir", children: "Déposez vos images ici" }),
              /* @__PURE__ */ jsx("p", { className: "text-[13px] text-neutral-500 mt-1", children: "JPG, PNG, WebP, AVIF · max 8 Mo par fichier" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  type: "file",
                  multiple: true,
                  accept: "image/*",
                  onChange: onPick,
                  className: "hidden",
                  id: "mass-image-input"
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "mass-image-input",
                  className: "inline-block mt-4 px-5 py-2 rounded-full bg-noir text-white font-bold text-[13px] cursor-pointer hover:bg-noir-soft transition",
                  children: "… ou choisir des fichiers"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-4 flex flex-wrap gap-4 items-center", children: [
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-[13px]", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: overwrite,
                onChange: (e) => setOverwrite(e.target.checked),
                className: "w-4 h-4 rounded accent-vert"
              }
            ),
            /* @__PURE__ */ jsxs("span", { children: [
              "Écraser les images existantes",
              /* @__PURE__ */ jsx("span", { className: "text-neutral-500", children: " (sinon seuls les produits sans image seront candidats)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-[13px]", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neutral-500", children: "Rayon ciblé :" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: rayonHint,
                onChange: (e) => setRayonHint(e.target.value),
                className: "px-3 py-1 rounded-full border border-black/10 text-[12px] bg-white",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "— tous —" }),
                  rayonsOptions.map((r) => /* @__PURE__ */ jsx("option", { value: r.slug, children: r.nom }, r.slug))
                ]
              }
            )
          ] })
        ] }),
        files.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[]-neutral-600 uppercase tracking-wider font-bold mb-2", children: [
            files.length,
            " fichier(s) prêt(s)"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3", children: files.map((f) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: f.previewUrl,
                alt: "",
                className: "w-full aspect-square object-cover rounded-xl ring-1 ring-black/10"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => removeFile(f.id),
                className: "absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-rouge text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition",
                "aria-label": "Retirer",
                children: "×"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-[]-neutral-600 truncate", children: f.file.name })
          ] }, f.id)) })
        ] })
      ] }),
      step === "uploading" && /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-bold text-[15px] text-noir", children: [
          "Upload en cours… ",
          progress.done,
          " / ",
          progress.total
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 max-w-md mx-auto h-2 bg-neutral-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-vert transition-all",
            style: { width: `${progress.total === 0 ? 0 : progress.done / progress.total * 100}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-3xl mx-auto", children: files.map((f) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: f.previewUrl,
              alt: "",
              className: `w-full aspect-square object-cover rounded-xl ring-1 ring-black/10 ${f.status === "failed" ? "opacity-40" : ""}`
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-end justify-center pb-1", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-[10px] px-2 py-0.5 rounded-full font-bold ${f.status === "uploaded" ? "bg-vert text-white" : f.status === "uploading" ? "bg-yellow-400 text-noir" : f.status === "failed" ? "bg-rouge text-white" : "bg-neutral-200 text-neutral-600"}`,
              children: f.status === "uploaded" ? "OK" : f.status === "uploading" ? "…" : f.status === "failed" ? "ERR" : "en attente"
            }
          ) })
        ] }, f.id)) })
      ] }),
      step === "review" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 text-[12px]", children: stats && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(Badge, { tone: "high", children: [
              stats.high,
              " fiables"
            ] }),
            /* @__PURE__ */ jsxs(Badge, { tone: "medium", children: [
              stats.medium,
              " à vérifier"
            ] }),
            /* @__PURE__ */ jsxs(Badge, { tone: "low", children: [
              stats.low,
              " faibles"
            ] }),
            /* @__PURE__ */ jsxs(Badge, { tone: "none", children: [
              stats.none,
              " sans match"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
            stats && stats.high > 0 && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: applyAllConfident,
                title: "Appliquer immédiatement toutes les correspondances fiables sans passer par la revue",
                className: "px-3 py-1 rounded-full bg-vert text-white font-bold text-[12px] hover:bg-vert-dark transition inline-flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("path", { d: "m5 13 4 4L19 7", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                  "Appliquer les ",
                  stats.high,
                  " fiables"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: selectAllGreen,
                className: "px-3 py-1 rounded-full bg-vert/10 text-vert-dark font-bold text-[12px] hover:bg-vert/20 transition",
                children: "Sélectionner les fiables"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: skipAll,
                className: "px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 font-bold text-[12px] hover:bg-neutral-200 transition",
                children: "Tout ignorer"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border border-black/10 rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-[13px]", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-white text-left text-neutral-500", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold w-16", children: "Fichier" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Nom" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Match" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold w-28", children: "Score" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold w-32", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: files.map((f) => /* @__PURE__ */ jsx(
            ReviewRow,
            {
              file: f,
              match: matches[f.id],
              choice: choices[f.id],
              onChoose: (patch) => setChoice(f.id, patch)
            },
            f.id
          )) })
        ] }) })
      ] }),
      step === "applying" && /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-bold text-[15px] text-noir", children: [
          "Application en cours… ",
          progress.done,
          " / ",
          progress.total
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 max-w-md mx-auto h-2 bg-neutral-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-vert transition-all",
            style: { width: `${progress.total === 0 ? 0 : progress.done / progress.total * 100}%` }
          }
        ) })
      ] }),
      step === "done" && applySummary && /* @__PURE__ */ jsxs("div", { className: "text-center py-6", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 mx-auto text-vert mb-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M20 6 9 17l-5-5", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-bold text-[16px] text-noir", children: "Import terminé" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-neutral-600 mt-2", children: [
          /* @__PURE__ */ jsx("strong", { className: "text-vert-dark", children: applySummary.applied }),
          " image(s) associée(s),",
          " ",
          /* @__PURE__ */ jsx("strong", { children: applySummary.skipped }),
          " ignorée(s)",
          applySummary.failed > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            ", ",
            /* @__PURE__ */ jsx("strong", { className: "text-rouge", children: applySummary.failed }),
            " en erreur"
          ] }),
          "."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "shrink-0 bg-white border-t border-black/5 px-6 py-4 flex gap-3 justify-end", children: [
      step === "drop" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-5 py-2 rounded-full bg-white border-2 border-black/10 font-bold text-[13px] hover:border-noir transition",
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: files.length === 0,
            onClick: uploadAndMatch,
            className: "px-5 py-2 rounded-full bg-vert text-white font-bold text-[13px] hover:bg-vert-dark transition disabled:opacity-40",
            children: [
              "Uploader & matcher (",
              files.length,
              ")"
            ]
          }
        )
      ] }),
      step === "review" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-5 py-2 rounded-full bg-white border-2 border-black/10 font-bold text-[13px] hover:border-noir transition",
            children: "Fermer sans appliquer"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: selectedCount === 0,
            onClick: applySelected,
            className: "px-5 py-2 rounded-full bg-vert text-white font-bold text-[13px] hover:bg-vert-dark transition disabled:opacity-40",
            children: [
              "Appliquer ",
              selectedCount,
              " match(es)"
            ]
          }
        )
      ] }),
      step === "done" && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-5 py-2 rounded-full bg-noir text-white font-bold text-[13px] hover:bg-noir-soft transition",
          children: "Fermer"
        }
      )
    ] })
  ] }) });
}
function Badge({ tone, children }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-block px-2 py-0.5 rounded-full border text-[11px] font-bold ${CONFIDENCE_COLORS[tone] ?? CONFIDENCE_COLORS.none}`,
      children
    }
  );
}
function ReviewRow({ file, match, choice, onChoose }) {
  const candidates = match?.candidates ?? [];
  const confidence = match?.confidence ?? "none";
  const best = match?.best;
  const selected = choice && !choice.skip && choice.productId;
  const currentProduct = candidates.find((c) => c.product.id === choice?.productId) ?? best;
  return /* @__PURE__ */ jsxs("tr", { className: `border-t border-black/5 ${selected ? "bg-vert/5" : ""}`, children: [
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: file.publicUrl ? /* @__PURE__ */ jsx(
      "img",
      {
        src: file.publicUrl,
        alt: "",
        className: "w-12 h-12 rounded-lg object-cover ring-1 ring-black/10"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-white" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2 font-mono text-[11px] text-neutral-600 max-w-xs truncate", children: file.safeName || file.file.name }),
    /* @__PURE__ */ jsxs("td", { className: "px-3 py-2", children: [
      candidates.length > 0 ? /* @__PURE__ */ jsxs(
        "select",
        {
          value: choice?.productId ?? "",
          onChange: (e) => onChoose({ productId: e.target.value || null, skip: !e.target.value }),
          className: "w-full max-w-md px-2 py-1 rounded-lg border border-black/10 text-[12px] bg-white",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "— Ignorer —" }),
            candidates.map((c) => /* @__PURE__ */ jsxs("option", { value: c.product.id, children: [
              c.product.nom,
              c.hasImage ? " (déjà illustré)" : "",
              c.product.rayon ? ` · ${c.product.rayon}` : "",
              " · ",
              (c.score * 100).toFixed(0),
              "%"
            ] }, c.product.id))
          ]
        }
      ) : /* @__PURE__ */ jsx("span", { className: "text-neutral-500 text-[12px] italic", children: "Aucun candidat ≥ 50%" }),
      currentProduct?.hasImage && selected && !choice?.skip && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-orange-700", children: "⚠ Ce produit a déjà une image — elle sera remplacée." })
    ] }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxs(Badge, { tone: confidence, children: [
      CONFIDENCE_LABELS[confidence],
      best ? ` ${(best.score * 100).toFixed(0)}%` : ""
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChoose(
          choice?.skip ? { productId: best?.product.id ?? null, skip: !best } : { productId: null, skip: true }
        ),
        className: `px-3 py-1 rounded-full text-[12px] font-bold transition ${selected ? "bg-vert text-white hover:bg-vert-dark" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`,
        children: selected ? "Appliquer" : "Ignorer"
      }
    ) })
  ] });
}

function ProductImageSearchModal({
  produit,
  onCancel,
  onSaved,
  onToast
}) {
  const [query, setQuery] = useState(() => (produit?.nom ?? "").trim());
  const [results, setResults] = useState(
    /** @type {any[]} */
    []
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(
    /** @type {string | null} */
    null
  );
  const [saving, setSaving] = useState(
    /** @type {string | null} */
    null
  );
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(
    /** @type {HTMLInputElement | null} */
    null
  );
  const abortRef = useRef(
    /** @type {AbortController | null} */
    null
  );
  useEffect(() => {
    if (query) runSearch(query);
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => abortRef.current?.abort();
  }, []);
  async function runSearch(q) {
    const trimmed = String(q || "").trim();
    if (!trimmed) {
      setResults([]);
      setErr("Saisissez un terme de recherche.");
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setErr(null);
    setHasSearched(true);
    try {
      const url = new URL("/api/admin/produits/image-search", window.location.origin);
      url.searchParams.set("q", trimmed);
      url.searchParams.set("pageSize", "16");
      const res = await adminFetch(url.toString(), { signal: ctrl.signal });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResults(Array.isArray(data?.results) ? data.results : []);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setErr(e?.message ?? "Échec de la recherche");
      setResults([]);
    } finally {
      if (abortRef.current === ctrl) abortRef.current = null;
      setLoading(false);
    }
  }
  async function applyImage(candidate) {
    if (!produit?.id) {
      setErr("Produit non enregistré en base (pas d'id).");
      return;
    }
    setSaving(candidate.code || candidate.imageUrl);
    setErr(null);
    try {
      const res = await adminFetch(`/api/admin/produits/${produit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: candidate.imageUrl })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const payload = await res.json();
      const updated = payload?.produit ?? { ...produit, image_url: candidate.imageUrl };
      onToast?.("success", `Image associée à « ${produit.nom} »`);
      onSaved?.(updated);
    } catch (e) {
      setErr(e?.message ?? "Échec de l'enregistrement");
      onToast?.("error", `Échec : ${e?.message ?? "erreur inconnue"}`);
    } finally {
      setSaving(null);
    }
  }
  function onSubmit(e) {
    e.preventDefault();
    runSearch(query);
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-soft font-bold text-[20px] truncate", children: "Chercher une image" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[]-neutral-600 mt-0.5 truncate", children: [
          "pour ",
          /* @__PURE__ */ jsx("strong", { children: produit?.nom ?? "—" }),
          " · source OpenFoodFacts (CC-BY-SA)"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          "aria-label": "Fermer",
          className: "w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "px-6 pt-4 pb-3 border-b border-black/5 flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: inputRef,
          type: "search",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Ex. riz basmati parfumé, dattes medjool, pois chiches…",
          className: "flex-1 px-4 py-2 border border-black/10 rounded-full text-[14px] bg-white focus:outline-none focus:border-vert"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading || !query.trim(),
          className: "px-5 py-2 rounded-full bg-vert text-white font-bold text-[13px] hover:bg-vert-dark transition disabled:opacity-50 inline-flex items-center gap-1.5",
          children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("svg", { className: "w-3.5 h-3.5 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", strokeOpacity: "0.25" }),
              /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 1-9 9", strokeLinecap: "round" })
            ] }),
            "Recherche…"
          ] }) : "Chercher"
        }
      )
    ] }),
    produit?.image_url && /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 flex items-center gap-3 bg-white border-b border-black/5", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: produit.image_url,
          alt: "",
          className: "w-10 h-10 object-cover rounded-lg ring-1 ring-black/5",
          onError: (e) => e.currentTarget.style.visibility = "hidden"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-[]-neutral-600", children: "Image actuelle — cliquez sur un résultat pour la remplacer." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [
      err && /* @__PURE__ */ jsxs("div", { className: "mb-4 bg-rouge/5 border border-rouge/20 text-rouge rounded-2xl p-3 text-[13px]", children: [
        /* @__PURE__ */ jsx("strong", { children: "Erreur :" }),
        " ",
        err
      ] }),
      loading && results.length === 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "aspect-square rounded-2xl bg-white animate-pulse"
        },
        i
      )) }),
      !loading && hasSearched && results.length === 0 && !err && /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-neutral-500 text-[13px]", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-neutral-500 text-[14px]", children: "Aucun résultat" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1", children: "Essayez un terme plus court (ex. « dattes » au lieu de « dattes medjool premium ») ou retirez les marques." })
      ] }),
      results.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: results.map((r) => {
        const isSaving = saving === (r.code || r.imageUrl);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => applyImage(r),
            disabled: !!saving,
            className: `group relative text-left bg-white rounded-2xl overflow-hidden ring-1 ring-black/5 hover:ring-vert transition ${isSaving ? "opacity-60 cursor-wait" : ""} ${saving && !isSaving ? "opacity-40 cursor-not-allowed" : ""}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-white flex items-center justify-center", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: r.thumbUrl || r.imageUrl,
                    alt: r.name,
                    loading: "lazy",
                    className: "w-full h-full object-contain p-2",
                    onError: (e) => {
                      e.currentTarget.style.display = "none";
                      const sib = e.currentTarget.nextElementSibling;
                      if (sib) sib.textContent = "Image indisponible";
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "hidden text-[]-neutral-600" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2 border-t border-black/5", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[12.5px] font-bold text-noir line-clamp-2 leading-tight", children: r.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-neutral-500 mt-1 truncate", children: [r.brands, r.origine].filter(Boolean).join(" · ") || r.attribution })
              ] }),
              isSaving && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/80 flex items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { className: "w-6 h-6 animate-spin text-vert", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", strokeOpacity: "0.25" }),
                /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 1-9 9", strokeLinecap: "round" })
              ] }) })
            ]
          },
          r.code || r.imageUrl
        );
      }) }),
      !hasSearched && !loading && /* @__PURE__ */ jsx("div", { className: "text-center py-10 text-neutral-500 text-[13px]", children: /* @__PURE__ */ jsx("p", { children: "La recherche démarre automatiquement avec le nom du produit." }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sticky bottom-0 bg-white border-t border-black/5 px-6 py-3 flex items-center justify-between flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[]-neutral-600", children: [
        "Les images proviennent d'OpenFoodFacts sous licence CC-BY-SA 3.0. Attribution déjà déclarée dans ",
        /* @__PURE__ */ jsx("code", { className: "bg-white px-1 rounded", children: "CREDITS.md" }),
        "."
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "px-4 py-1.5 rounded-full bg-white border-2 border-black/10 font-bold text-[12px] hover:border-noir transition",
          children: "Fermer"
        }
      )
    ] })
  ] }) });
}

const EMPTY_PRODUIT = {
  id: null,
  slug: "",
  nom: "",
  description: "",
  image_url: "",
  prix_indicatif: "",
  unite: "",
  rayon: "",
  categorie: "",
  sous_categorie: "",
  origine: "",
  badge: "",
  actif: true,
  ordre: 0
};
function fmtPrice(n) {
  if (n == null || n === "") return "—";
  const num = typeof n === "number" ? n : parseFloat(n);
  if (!Number.isFinite(num)) return "—";
  return num.toFixed(2).replace(".", ",") + " €";
}
function slugifyLocal(raw) {
  if (!raw) return "";
  return String(raw).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function ProduitsManager({ initialProduits, rayonsOptions, scope = null }) {
  const [produits, setProduits] = useState(initialProduits ?? []);
  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);
  const [massMatching, setMassMatching] = useState(false);
  const [imageSearching, setImageSearching] = useState(
    /** @type {null | object} */
    null
  );
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(() => /* @__PURE__ */ new Set());
  const [reorderMode, setReorderMode] = useState(false);
  const [undoData, setUndoData] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const searchInputRef = useRef(null);
  const STATUT_OPTS = ["all", "active", "inactive", "sans-image", "avec-image"];
  const SORT_OPTS = ["ordre", "nom", "slug", "rayon", "categorie", "prix_indicatif", "actif", "updated_at"];
  const RECENT_OPTS = ["", "24h", "7d"];
  const { state: listState, set: setFilter, reset: resetFilter, activeCount } = useAdminListState({
    defaults: { q: "", rayon: "", statut: "all", recent: "", sort: "ordre", dir: "asc" },
    allowed: { statut: STATUT_OPTS, recent: RECENT_OPTS, dir: ["asc", "desc"], sort: SORT_OPTS },
    storageKey: "admin.produits.list"
  });
  const filter = listState;
  const sort = useMemo(() => ({ field: listState.sort, dir: listState.dir }), [listState.sort, listState.dir]);
  function setSort(field, dir) {
    setFilter({ sort: field, dir });
  }
  const canReorder = sort.field === "ordre" && sort.dir === "asc";
  const rayonNom = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rayonsOptions.forEach((r) => m.set(r.slug, r.nom));
    return (slug) => m.get(slug) ?? slug;
  }, [rayonsOptions]);
  const filtered = useMemo(() => {
    return produits.filter((p) => {
      if (scope?.rayon && p.rayon !== scope.rayon) return false;
      if (scope?.categorie && p.categorie !== scope.categorie) return false;
      if (scope?.sous_categorie && p.sous_categorie !== scope.sous_categorie) return false;
      if (scope?.view === "orphelins") {
        if (scope?.sous_categorie) ; else if (scope?.categorie) {
          const known = scope.knownSousCategorieLabels ?? [];
          if (!p.sous_categorie) return true;
          if (known.includes(p.sous_categorie)) return false;
        } else if (scope?.rayon) {
          const known = scope.knownCategorieLabels ?? [];
          if (!p.categorie) return true;
          if (known.includes(p.categorie)) return false;
        }
      }
      if (!scope?.rayon && filter.rayon && p.rayon !== filter.rayon) return false;
      if (filter.statut === "active" && !p.actif) return false;
      if (filter.statut === "inactive" && p.actif) return false;
      if (filter.statut === "sans-image" && p.image_url) return false;
      if (filter.statut === "avec-image" && !p.image_url) return false;
      if (filter.recent) {
        const ts = Date.parse(p.updated_at ?? p.created_at ?? "");
        if (!Number.isFinite(ts)) return false;
        const windowMs = filter.recent === "7d" ? 7 * 864e5 : 864e5;
        if (Date.now() - ts > windowMs) return false;
      }
      if (filter.q) {
        const q = filter.q.toLowerCase();
        const hay = `${p.nom} ${p.slug} ${p.description ?? ""} ${p.origine ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [produits, filter, scope]);
  function openNewProduit() {
    setEditing({
      ...EMPTY_PRODUIT,
      rayon: scope?.rayon ?? "",
      categorie: scope?.categorie ?? "",
      sous_categorie: scope?.sous_categorie ?? ""
    });
  }
  const grouped = useMemo(() => {
    const sorted = [...filtered];
    if (sort.field && sort.field !== "ordre") {
      sorted.sort((a, b) => compareRows(a, b, sort.field, sort.dir));
    } else if (sort.dir === "desc") {
      sorted.reverse();
    }
    const map = /* @__PURE__ */ new Map();
    sorted.forEach((p) => {
      if (!map.has(p.rayon)) map.set(p.rayon, []);
      map.get(p.rayon).push(p);
    });
    return Array.from(map.entries()).sort(
      (a, b) => rayonNom(a[0]).localeCompare(rayonNom(b[0]), "fr")
    );
  }, [filtered, rayonNom, sort]);
  function toggleSelected(id) {
    setSelected((cur) => {
      const nxt = new Set(cur);
      if (nxt.has(id)) nxt.delete(id);
      else nxt.add(id);
      return nxt;
    });
  }
  function toggleSelectRayon(rayonSlug) {
    const ids = filtered.filter((p) => p.rayon === rayonSlug).map((p) => p.id);
    if (ids.length === 0) return;
    const allInRayonSelected = ids.every((id) => selected.has(id));
    setSelected((cur) => {
      const nxt = new Set(cur);
      if (allInRayonSelected) ids.forEach((id) => nxt.delete(id));
      else ids.forEach((id) => nxt.add(id));
      return nxt;
    });
  }
  function clearSelection() {
    setSelected(/* @__PURE__ */ new Set());
  }
  function notify(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3800);
  }
  async function toggleActif(row) {
    const next = { ...row, actif: !row.actif };
    setProduits((cur) => cur.map((p) => p.id === row.id ? next : p));
    try {
      const res = await adminFetch(`/api/admin/produits/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: next.actif })
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const { produit } = await res.json();
      setProduits((cur) => cur.map((p) => p.id === row.id ? produit : p));
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: "produit:toggle-actif", ids: [row.id] });
    } catch (err) {
      setProduits((cur) => cur.map((p) => p.id === row.id ? row : p));
      notify("err", `Erreur : ${humanizeError(err)}`);
    }
  }
  function deleteProduit(row) {
    if (pendingDelete) {
      clearTimeout(pendingDelete.timer);
      void commitPendingDelete(pendingDelete.row);
    }
    setProduits((cur) => cur.filter((p) => p.id !== row.id));
    const timer = setTimeout(() => {
      void commitPendingDelete(row);
    }, 8e3);
    setPendingDelete({ row, timer, deadline: Date.now() + 8e3 });
  }
  async function commitPendingDelete(row) {
    setPendingDelete((cur) => cur && cur.row.id === row.id ? null : cur);
    try {
      const res = await adminFetch(`/api/admin/produits/${row.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
      }
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: "produit:deleted", ids: [row.id] });
      notify("ok", `« ${row.nom} » supprimé.`);
    } catch (err) {
      setProduits((cur) => cur.some((p) => p.id === row.id) ? cur : [...cur, row]);
      notify("err", `Erreur : ${humanizeError(err)}`);
    }
  }
  function undoPendingDelete() {
    if (!pendingDelete) return;
    clearTimeout(pendingDelete.timer);
    const { row } = pendingDelete;
    setPendingDelete(null);
    setProduits((cur) => cur.some((p) => p.id === row.id) ? cur : [...cur, row]);
    notify("ok", `« ${row.nom} » restauré.`);
  }
  async function saveProduit(form) {
    const isNew = !form.id;
    const payload = {
      slug: form.slug,
      nom: form.nom,
      description: form.description,
      image_url: form.image_url || null,
      prix_indicatif: form.prix_indicatif === "" ? null : Number(form.prix_indicatif),
      unite: form.unite || null,
      rayon: form.rayon,
      categorie: form.categorie || null,
      sous_categorie: form.sous_categorie || null,
      origine: form.origine || null,
      badge: form.badge || null,
      actif: form.actif !== false,
      ordre: Number(form.ordre) || 0
    };
    const draftKey = isNew ? "admin.draft.produit.new" : `admin.draft.produit.${form.id}`;
    try {
      let res;
      if (isNew) {
        res = await adminFetch(`/api/admin/produits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          draftKey,
          draftValue: form
        });
      } else {
        res = await adminFetch(`/api/admin/produits/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          draftKey,
          draftValue: form
        });
      }
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const { produit } = await res.json();
      if (isNew) {
        setProduits((cur) => [...cur, produit]);
      } else {
        setProduits((cur) => cur.map((p) => p.id === produit.id ? produit : p));
      }
      clearDraft(draftKey);
      setEditing(null);
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, {
        entity: isNew ? "produit:created" : "produit:updated",
        ids: produit?.id ? [produit.id] : void 0
      });
      notify("ok", isNew ? "Produit créé." : "Produit mis à jour.");
    } catch (err) {
      notify("err", `Erreur : ${humanizeError(err)}`);
    }
  }
  async function bulkImport(arr) {
    try {
      const res = await adminFetch(`/api/admin/produits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produits: arr })
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const { count } = await res.json();
      const refreshed = await adminFetch(`/api/admin/produits`).then((r) => r.json());
      setProduits(refreshed.produits ?? []);
      setImporting(false);
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: "produit:bulk-import" });
      notify("ok", `${count} produit(s) importé(s).`);
    } catch (err) {
      notify("err", `Erreur import : ${humanizeError(err)}`);
    }
  }
  async function refreshProduits() {
    try {
      const res = await adminFetch(`/api/admin/produits`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setProduits(data.produits ?? []);
    } catch (err) {
      notify("err", `Erreur rafraîchissement : ${humanizeError(err)}`);
    }
  }
  async function onMassMatchApplied(summary) {
    await refreshProduits();
    publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: "produit:mass-image-match" });
    const parts = [`${summary.applied} image(s) associée(s)`];
    if (summary.failed > 0) parts.push(`${summary.failed} échec(s)`);
    if (summary.skipped > 0) parts.push(`${summary.skipped} ignorée(s)`);
    notify("ok", parts.join(" · "));
  }
  async function bulkAction(action) {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const snapshot = produits;
    if (action === "delete") {
      if (!confirm(`Supprimer ${ids.length} produit(s) ? Vous aurez 8 s pour annuler.`)) return;
      setProduits((cur) => cur.filter((p) => !selected.has(p.id)));
      clearSelection();
    } else if (action === "activate" || action === "deactivate") {
      const val = action === "activate";
      setProduits(
        (cur) => cur.map((p) => selected.has(p.id) ? { ...p, actif: val } : p)
      );
    }
    try {
      const res = await adminFetch(`/api/admin/produits/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action })
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const { affected } = await res.json();
      if (action === "delete") {
        const msg = `${affected} produit(s) supprimé(s).`;
        if (undoData?.timer) clearTimeout(undoData.timer);
        const timer = setTimeout(() => setUndoData(null), 8e3);
        setUndoData({
          snapshot: snapshot.filter((p) => ids.includes(p.id)),
          message: msg,
          timer
        });
        notify("ok", msg);
      } else {
        clearSelection();
        notify("ok", `${affected} produit(s) mis à jour.`);
      }
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: `produit:bulk-${action}`, ids });
    } catch (err) {
      setProduits(snapshot);
      notify("err", `Erreur : ${humanizeError(err)}`);
    }
  }
  async function bulkPatch(patch) {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const snapshot = produits;
    setProduits((cur) => cur.map((p) => selected.has(p.id) ? { ...p, ...patch } : p));
    try {
      const res = await adminFetch(`/api/admin/produits/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "patch", patch })
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const { affected } = await res.json();
      clearSelection();
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: "produit:bulk-patch", ids });
      notify("ok", `${affected} produit(s) mis à jour.`);
    } catch (err) {
      setProduits(snapshot);
      notify("err", `Erreur : ${humanizeError(err)}`);
    }
  }
  async function undoBulkDelete() {
    if (!undoData) return;
    const rows = undoData.snapshot;
    if (undoData.timer) clearTimeout(undoData.timer);
    setUndoData(null);
    try {
      const res = await adminFetch(`/api/admin/produits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produits: rows })
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      await refreshProduits();
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: "produit:undo-bulk-delete" });
      notify("ok", `${rows.length} produit(s) restauré(s).`);
    } catch (err) {
      notify("err", `Restauration impossible : ${humanizeError(err)}`);
    }
  }
  async function persistReorder(rows) {
    const payload = rows.map((p, i) => ({ id: p.id, ordre: i }));
    try {
      const res = await adminFetch(`/api/admin/produits/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: payload })
      });
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, { entity: "produit:reordered" });
    } catch (err) {
      notify("err", `Erreur réorganisation : ${humanizeError(err)}`);
    }
  }
  function moveRowInRayon(id, delta) {
    const row = produits.find((p) => p.id === id);
    if (!row) return;
    const rayonItems = grouped.find(([r]) => r === row.rayon)?.[1] ?? [];
    const idx = rayonItems.findIndex((p) => p.id === id);
    const target = idx + delta;
    if (idx < 0 || target < 0 || target >= rayonItems.length) return;
    const nextRayon = [...rayonItems];
    const [moved] = nextRayon.splice(idx, 1);
    nextRayon.splice(target, 0, moved);
    applyRayonReorder(row.rayon, nextRayon);
  }
  function applyRayonReorder(rayonSlug, nextRayonItems) {
    const newRayonOrderIds = nextRayonItems.map((p) => p.id);
    produits.filter((p) => p.rayon !== rayonSlug);
    const reindexed = [];
    let cursor = 0;
    for (const p of produits) {
      if (p.rayon !== rayonSlug) {
        reindexed.push(p);
      } else {
        const nextId = newRayonOrderIds[cursor++];
        const nextRow = produits.find((q) => q.id === nextId);
        if (nextRow) reindexed.push(nextRow);
      }
    }
    const withOrdre = reindexed.map((p, i) => ({ ...p, ordre: i }));
    setProduits(withOrdre);
    persistReorder(withOrdre);
  }
  function onDragStart(id) {
    setDragId(id);
  }
  function onDragOverRow(e, id) {
    if (!dragId || dragId === id) return;
    const a = produits.find((p) => p.id === dragId);
    const b = produits.find((p) => p.id === id);
    if (!a || !b || a.rayon !== b.rayon) return;
    e.preventDefault();
    setDragOverId(id);
  }
  function onDropRow(id) {
    if (!dragId || dragId === id) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const a = produits.find((p) => p.id === dragId);
    const b = produits.find((p) => p.id === id);
    if (!a || !b || a.rayon !== b.rayon) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const rayonItems = grouped.find(([r]) => r === a.rayon)?.[1] ?? [];
    const from = rayonItems.findIndex((p) => p.id === dragId);
    const to = rayonItems.findIndex((p) => p.id === id);
    if (from < 0 || to < 0) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const next = [...rayonItems];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setDragId(null);
    setDragOverId(null);
    applyRayonReorder(a.rayon, next);
  }
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash;
    if (h === "#new") {
      openNewProduit();
    } else if (h === "#import") {
      setImporting(true);
    } else {
      return;
    }
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch {
    }
  }, []);
  useEffect(() => {
    function onKey(e) {
      if (editing || importing || massMatching || imageSearching) return;
      const target = e.target;
      const tag = target?.tagName?.toLowerCase();
      const editable = tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
      if (editable) {
        if (e.key === "Escape" && selected.size > 0) {
          e.preventDefault();
          clearSelection();
        }
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if ((e.key === "n" || e.key === "N") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openNewProduit();
      } else if (e.key === "Escape") {
        if (selected.size > 0) {
          e.preventDefault();
          clearSelection();
        } else if (reorderMode) {
          setReorderMode(false);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, importing, massMatching, imageSearching, selected.size, reorderMode]);
  useEffect(() => {
    return subscribeAdminEvents([ADMIN_EVENT.PRODUITS_UPDATED], () => {
      void refreshProduits();
    });
  }, []);
  useEffect(() => {
    setSelected((cur) => {
      let changed = false;
      const nxt = /* @__PURE__ */ new Set();
      for (const id of cur) {
        if (produits.some((p) => p.id === id)) nxt.add(id);
        else changed = true;
      }
      return changed ? nxt : cur;
    });
  }, [produits]);
  return /* @__PURE__ */ jsxs("div", { className: "pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsxs("div", { id: "produits-toolbar", className: "sticky top-0 z-30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pt-2 pb-3 bg-white/85 backdrop-blur-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-card p-4 md:p-5 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-[280px] relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: searchInputRef,
                type: "search",
                placeholder: "Rechercher nom, slug, origine…  (raccourci : /)",
                value: filter.q,
                onChange: (e) => setFilter({ q: e.target.value }),
                className: "w-full px-4 py-2 pr-9 rounded-full border border-black/10 text-[14px] focus:border-vert focus:outline-none bg-white shadow-inner",
                "aria-label": "Recherche"
              }
            ),
            filter.q && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setFilter({ q: "" }),
                "aria-label": "Effacer la recherche",
                className: "absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-neutral-500 hover:bg-neutral-100 flex items-center justify-center",
                children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            !scope?.rayon && /* @__PURE__ */ jsxs(
              "select",
              {
                value: filter.rayon,
                onChange: (e) => setFilter({ rayon: e.target.value }),
                className: "px-3 py-2 rounded-full border border-black/10 text-[13px] bg-white cursor-pointer hover:border-noir transition",
                "aria-label": "Filtrer par rayon",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Tous rayons" }),
                  rayonsOptions.map((r) => /* @__PURE__ */ jsx("option", { value: r.slug, children: r.nom }, r.slug))
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filter.statut,
                onChange: (e) => setFilter({ statut: e.target.value }),
                className: "px-3 py-2 rounded-full border border-black/10 text-[13px] bg-white cursor-pointer hover:border-noir transition",
                "aria-label": "Filtrer par statut",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "Tous statuts" }),
                  /* @__PURE__ */ jsx("option", { value: "active", children: "Actifs" }),
                  /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactifs" }),
                  /* @__PURE__ */ jsx("option", { value: "sans-image", children: "Sans image" }),
                  /* @__PURE__ */ jsx("option", { value: "avec-image", children: "Avec image" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: `${sort.field}:${sort.dir}`,
                onChange: (e) => {
                  const [f, d] = e.target.value.split(":");
                  setSort(f, d);
                },
                className: "px-3 py-2 rounded-full border border-black/10 text-[13px] bg-white cursor-pointer hover:border-noir transition",
                "aria-label": "Trier",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "ordre:asc", children: "Tri : ordre manuel" }),
                  /* @__PURE__ */ jsx("option", { value: "nom:asc", children: "Tri : nom A→Z" }),
                  /* @__PURE__ */ jsx("option", { value: "nom:desc", children: "Tri : nom Z→A" }),
                  /* @__PURE__ */ jsx("option", { value: "prix_indicatif:asc", children: "Tri : prix croissant" }),
                  /* @__PURE__ */ jsx("option", { value: "prix_indicatif:desc", children: "Tri : prix décroissant" }),
                  /* @__PURE__ */ jsx("option", { value: "updated_at:desc", children: "Tri : récents" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  const next = filter.recent === "" ? "24h" : filter.recent === "24h" ? "7d" : "";
                  setFilter({ recent: next });
                },
                "aria-pressed": filter.recent !== "",
                title: "Filtrer par date de modification (24 h / 7 j)",
                className: `px-3 py-2 rounded-full text-[13px] font-bold transition inline-flex items-center gap-1.5 ${filter.recent ? "bg-vert text-white hover:bg-vert-dark" : "bg-white border border-black/10 hover:border-noir text-noir"}`,
                children: [
                  /* @__PURE__ */ jsxs("svg", { className: "w-3.5 h-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
                    /* @__PURE__ */ jsx("path", { d: "M12 7v5l3 2", strokeLinecap: "round", strokeLinejoin: "round" })
                  ] }),
                  filter.recent === "24h" ? "24 h" : filter.recent === "7d" ? "7 j" : "Récents"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-black/5 pt-3 flex flex-wrap items-center justify-between gap-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            canReorder && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setReorderMode((m) => !m),
                "aria-pressed": reorderMode,
                title: reorderMode ? "Sortir du mode réorganisation (Esc)" : "Activer le glisser-déposer dans chaque rayon",
                className: `px-4 py-2 rounded-full text-[13px] font-bold transition inline-flex items-center gap-1.5 ${reorderMode ? "bg-rouge text-white hover:bg-rouge/90 shadow-sm" : "bg-white border-2 border-black/10 hover:border-noir"}`,
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                  reorderMode ? "Terminer" : "Réorganiser"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setMassMatching(true),
                className: "px-4 py-2 rounded-full bg-white border-2 border-noir text-[13px] font-bold hover:bg-noir hover:text-white transition inline-flex items-center gap-1.5 shadow-sm",
                title: "Glisser-déposer plusieurs images et les associer automatiquement aux produits",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                  "Images (auto-match)"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setImporting(true),
                className: "px-4 py-2 rounded-full bg-white border-2 border-black/10 text-[13px] font-bold hover:border-vert hover:text-vert transition",
                title: "Importer un CSV ou JSON (fichier ou copier/coller)",
                children: "Importer CSV/JSON"
              }
            ),
            /* @__PURE__ */ jsx(ExportMenu, { rows: filtered, totalRows: produits.length })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: openNewProduit,
              title: "Créer un produit (n)",
              className: "px-4 py-2 rounded-full bg-vert text-white text-[13px] font-bold hover:bg-vert-dark transition shadow-sm hover:shadow",
              children: "+ Nouveau produit"
            }
          )
        ] })
      ] }),
      activeCount > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[]-neutral-600", children: "Filtres actifs :" }),
        filter.q && /* @__PURE__ */ jsx(FilterChip, { label: `« ${filter.q} »`, onRemove: () => setFilter({ q: "" }) }),
        !scope?.rayon && filter.rayon && /* @__PURE__ */ jsx(
          FilterChip,
          {
            label: `Rayon : ${rayonNom(filter.rayon)}`,
            onRemove: () => setFilter({ rayon: "" })
          }
        ),
        filter.statut !== "all" && /* @__PURE__ */ jsx(
          FilterChip,
          {
            label: `Statut : ${{
              active: "actifs",
              inactive: "inactifs",
              "sans-image": "sans image",
              "avec-image": "avec image"
            }[filter.statut] ?? filter.statut}`,
            onRemove: () => setFilter({ statut: "all" })
          }
        ),
        filter.recent && /* @__PURE__ */ jsx(
          FilterChip,
          {
            label: `Modifiés : ${filter.recent === "24h" ? "24 h" : "7 j"}`,
            onRemove: () => setFilter({ recent: "" })
          }
        ),
        (sort.field !== "ordre" || sort.dir !== "asc") && /* @__PURE__ */ jsx(
          FilterChip,
          {
            tone: "sort",
            label: `Tri : ${sort.field} ${sort.dir === "asc" ? "↑" : "↓"}`,
            onRemove: () => setSort("ordre", "asc")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: resetFilter,
            className: "text-[]-neutral-600 hover:text-rouge transition underline underline-offset-2",
            children: "Tout réinitialiser"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-neutral-500", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-noir", children: filtered.length }),
        " produit(s) affiché(s)",
        produits.length !== filtered.length && /* @__PURE__ */ jsxs("span", { children: [
          " sur ",
          /* @__PURE__ */ jsx("strong", { className: "text-noir", children: produits.length }),
          " au total"
        ] })
      ] }),
      reorderMode && /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 rounded-full bg-rouge/10 text-rouge font-bold text-[11px] uppercase tracking-wider", children: "→ Mode réorganisation : glissez dans le même rayon ou utilisez ↑↓" })
    ] }),
    grouped.length === 0 ? /* @__PURE__ */ jsx("div", { className: "mt-4 bg-white rounded-3xl shadow-card overflow-hidden", children: scope?.view === "orphelins" ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        tone: "vert",
        icon: "🎉",
        title: "Aucun produit orphelin",
        description: "Tous les produits de ce scope sont correctement rattachés à la taxonomie. Beau travail !"
      }
    ) : scope?.displayLabel ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: `Aucun produit dans ${scope.displayLabel}`,
        description: "Cette catégorie est vide. Ajoutez le premier produit pour la peupler — il sera automatiquement rattaché au scope actuel.",
        primaryLabel: "+ Ajouter le premier produit",
        primaryOnClick: openNewProduit,
        secondaryLabel: "Importer en masse",
        secondaryOnClick: () => setImporting(true)
      }
    ) : filter.q || filter.recent || filter.statut !== "all" || filter.rayon ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: "🔎",
        title: "Aucun produit ne correspond aux filtres",
        description: "Essayez d'élargir la recherche, ou réinitialisez les filtres pour voir tout le catalogue.",
        primaryLabel: "Réinitialiser les filtres",
        primaryOnClick: resetFilter
      }
    ) : /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "Aucun produit",
        description: "Créez votre premier produit ou importez un fichier JSON / CSV pour commencer à remplir le catalogue.",
        primaryLabel: "+ Nouveau produit",
        primaryOnClick: openNewProduit,
        secondaryLabel: "Importer JSON / CSV",
        secondaryOnClick: () => setImporting(true)
      }
    ) }) : /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-6", children: grouped.map(([rayonSlug, items]) => {
      const rayonIds = items.map((p) => p.id);
      const allRayonSelected = rayonIds.length > 0 && rayonIds.every((id) => selected.has(id));
      const someRayonSelected = rayonIds.some((id) => selected.has(id));
      return /* @__PURE__ */ jsxs("section", { className: "bg-white rounded-3xl shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxs("header", { className: "bg-white px-5 py-3 border-b border-black/5 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer select-none", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: allRayonSelected,
                ref: (el) => {
                  if (el) el.indeterminate = someRayonSelected && !allRayonSelected;
                },
                onChange: () => toggleSelectRayon(rayonSlug),
                "aria-label": `Tout sélectionner dans ${rayonNom(rayonSlug)}`,
                className: "w-4 h-4 accent-vert"
              }
            ),
            /* @__PURE__ */ jsx("h2", { className: "font-soft font-bold text-[16px]", children: rayonNom(rayonSlug) })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[]-neutral-600", children: [
            items.length,
            " produit(s)"
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-black/5", children: items.map((p, i) => {
          const isSel = selected.has(p.id);
          const isDragOver = reorderMode && dragOverId === p.id;
          return /* @__PURE__ */ jsxs(
            "li",
            {
              onDragOver: reorderMode ? (e) => onDragOverRow(e, p.id) : void 0,
              onDrop: reorderMode ? () => onDropRow(p.id) : void 0,
              className: [
                "flex items-center gap-3 px-4 md:px-5 py-2 transition",
                isSel ? "bg-vert/5" : "hover:bg-white/50",
                isDragOver ? "outline outline-2 outline-vert -outline-offset-2" : ""
              ].join(" "),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isSel,
                    onChange: () => toggleSelected(p.id),
                    "aria-label": `Sélectionner ${p.nom}`,
                    className: "w-4 h-4 accent-vert cursor-pointer shrink-0"
                  }
                ),
                reorderMode && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      draggable: true,
                      onDragStart: () => onDragStart(p.id),
                      onDragEnd: () => {
                        setDragId(null);
                        setDragOverId(null);
                      },
                      className: "cursor-grab active:cursor-grabbing text-neutral-500 hover:text-noir select-none",
                      title: "Glisser pour déplacer (dans ce rayon)",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "currentColor", children: [
                        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "6", r: "1.5" }),
                        /* @__PURE__ */ jsx("circle", { cx: "15", cy: "6", r: "1.5" }),
                        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "12", r: "1.5" }),
                        /* @__PURE__ */ jsx("circle", { cx: "15", cy: "12", r: "1.5" }),
                        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "18", r: "1.5" }),
                        /* @__PURE__ */ jsx("circle", { cx: "15", cy: "18", r: "1.5" })
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => moveRowInRayon(p.id, -1),
                        disabled: i === 0,
                        "aria-label": "Monter d'un rang",
                        className: "w-4 h-4 text-neutral-500 hover:text-noir disabled:opacity-30 transition flex items-center justify-center",
                        children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", viewBox: "0 0 10 6", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M5 0 10 6H0z" }) })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => moveRowInRayon(p.id, 1),
                        disabled: i === items.length - 1,
                        "aria-label": "Descendre d'un rang",
                        className: "w-4 h-4 text-neutral-500 hover:text-noir disabled:opacity-30 transition flex items-center justify-center",
                        children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", viewBox: "0 0 10 6", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M5 6 0 0h10z" }) })
                      }
                    )
                  ] })
                ] }),
                p.image_url ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: p.image_url,
                    alt: "",
                    className: "w-12 h-12 rounded-lg object-cover ring-1 ring-black/5 shrink-0",
                    loading: "lazy"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-white flex items-center justify-center text-neutral-300 shrink-0", children: "—" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-bold text-noir truncate", children: p.nom }),
                    p.badge && /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-0.5 rounded-full bg-rouge/10 text-rouge font-bold text-[10px] uppercase tracking-wider", children: p.badge }),
                    p.origine && /* @__PURE__ */ jsxs("span", { className: "text-[]-neutral-600", children: [
                      "· ",
                      p.origine
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[]-neutral-600 truncate", children: [
                    p.slug,
                    p.prix_indicatif != null && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-neutral-600", children: [
                      "— indicatif : ",
                      /* @__PURE__ */ jsxs("strong", { children: [
                        fmtPrice(p.prix_indicatif),
                        p.unite ? " / " + p.unite : ""
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleActif(p),
                      className: `px-2.5 md:px-3 py-1 rounded-full text-[]-neutral-600 hover:bg-neutral-300"
                        }`,
                      title: p.actif ? "Produit actif (cliquer pour désactiver)" : "Produit inactif (cliquer pour activer)",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "md:hidden", children: p.actif ? "●" : "○" }),
                        /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: p.actif ? "● Actif" : "○ Inactif" })
                      ]
                    }
                  ),
                  !p.image_url && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setImageSearching(p),
                      className: "p-1 md:px-3 md:py-1 rounded-full bg-white border border-vert text-vert text-[12px] font-bold hover:bg-vert hover:text-white transition inline-flex items-center justify-center gap-1 w-8 h-8 md:w-auto md:h-auto",
                      title: "Chercher une image pour ce produit via OpenFoodFacts",
                      children: [
                        /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                          /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
                          /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3", strokeLinecap: "round" })
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Image" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setEditing(p),
                      className: "px-2.5 md:px-3 py-1 rounded-full bg-noir text-white text-[12px] font-bold hover:bg-noir-soft transition flex items-center justify-center gap-1 min-w-[32px] md:min-w-0",
                      title: "Éditer le produit",
                      children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 md:hidden shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                        /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Éditer" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => deleteProduit(p),
                      "aria-label": "Supprimer",
                      className: "w-8 h-8 rounded-full text-neutral-500 hover:bg-rouge/10 hover:text-rouge transition flex items-center justify-center shrink-0",
                      title: "Supprimer",
                      children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", strokeLinecap: "round", strokeLinejoin: "round" }) })
                    }
                  )
                ] })
              ]
            },
            p.id
          );
        }) })
      ] }, rayonSlug);
    }) }),
    /* @__PURE__ */ jsx(
      BulkActionsBar,
      {
        count: selected.size,
        onClear: clearSelection,
        actions: [
          { label: "Activer", onClick: () => bulkAction("activate") },
          { label: "Désactiver", onClick: () => bulkAction("deactivate") },
          {
            label: "Changer de rayon…",
            onClick: () => {
              const current = Array.from(new Set(
                produits.filter((p) => selected.has(p.id)).map((p) => p.rayon)
              ));
              const list = rayonsOptions.map((r) => `${r.slug} (${r.nom})`).join("\n");
              const hint = current.length === 1 ? `

Actuel : ${current[0]}` : "";
              const choice = prompt(
                `Entrez le slug du rayon cible :

${list}${hint}`,
                current[0] ?? ""
              );
              if (!choice) return;
              const ok = rayonsOptions.some((r) => r.slug === choice);
              if (!ok) {
                notify("err", `Rayon inconnu : ${choice}`);
                return;
              }
              bulkPatch({ rayon: choice });
            }
          },
          { label: "Supprimer", tone: "danger", onClick: () => bulkAction("delete") }
        ]
      }
    ),
    undoData && /* @__PURE__ */ jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
        className: "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-noir text-white text-[13px] font-bold shadow-2xl flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsx("span", { children: undoData.message }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: undoBulkDelete,
              className: "px-3 py-1 rounded-full bg-vert hover:bg-vert-dark transition",
              children: "Annuler"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      MobileActionBar,
      {
        label: "Produit",
        toolbarId: "produits-toolbar",
        filterCount: (filter.q ? 1 : 0) + (filter.rayon ? 1 : 0) + (filter.statut !== "all" ? 1 : 0) + (filter.recent ? 1 : 0),
        onNew: () => setEditing({ ...EMPTY_PRODUIT })
      }
    ),
    pendingDelete && /* @__PURE__ */ jsx(
      UndoSnackbar,
      {
        row: pendingDelete.row,
        deadline: pendingDelete.deadline,
        label: `« ${pendingDelete.row.nom} » supprimé.`,
        onUndo: undoPendingDelete
      }
    ),
    editing && /* @__PURE__ */ jsx(
      EditModal,
      {
        produit: editing,
        rayonsOptions,
        onCancel: () => setEditing(null),
        onSave: saveProduit
      }
    ),
    importing && /* @__PURE__ */ jsx(
      ImportModal,
      {
        currentProduits: produits,
        onCancel: () => setImporting(false),
        onImport: bulkImport
      }
    ),
    massMatching && /* @__PURE__ */ jsx(
      MassImageMatchModal,
      {
        rayonsOptions,
        onClose: () => setMassMatching(false),
        onApplied: onMassMatchApplied
      }
    ),
    imageSearching && /* @__PURE__ */ jsx(
      ProductImageSearchModal,
      {
        produit: imageSearching,
        onCancel: () => setImageSearching(null),
        onToast: (level, msg) => notify(level === "error" ? "err" : "ok", msg),
        onSaved: (updated) => {
          setProduits(
            (list) => list.map((p) => p.id === updated.id ? { ...p, ...updated } : p)
          );
          publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, {
            entity: "produit:image-searched",
            ids: updated?.id ? [updated.id] : void 0
          });
          setImageSearching(null);
        }
      }
    ),
    toast && /* @__PURE__ */ jsx(
      "div",
      {
        role: toast.type === "err" ? "alert" : "status",
        "aria-live": toast.type === "err" ? "assertive" : "polite",
        "aria-atomic": "true",
        className: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full font-bold text-[13px] shadow-card ${toast.type === "ok" ? "bg-vert text-white" : "bg-rouge text-white"}`,
        children: toast.msg
      }
    )
  ] });
}
function EditModal({ produit, rayonsOptions, onCancel, onSave }) {
  const isNew = !produit.id;
  const draftKey = isNew ? "admin.draft.produit.new" : `admin.draft.produit.${produit.id}`;
  const [form, setForm] = useState(() => {
    const draft = loadDraft(draftKey);
    return draft && typeof draft === "object" ? { ...produit, ...draft } : { ...produit };
  });
  const [draftRestored, setDraftRestored] = useState(() => loadDraft(draftKey) != null);
  const [saving, setSaving] = useState(false);
  const [slugStatus, setSlugStatus] = useState(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugTouched, setSlugTouched] = useState(
    !!(produit.id || produit.slug) || !!loadDraft(draftKey)
  );
  const formRef = useRef(null);
  const categoriesOptions = form.rayon ? Object.keys(TAXONOMIE[form.rayon] || {}) : [];
  const subCategoriesOptions = form.rayon && form.categorie ? TAXONOMIE[form.rayon][form.categorie] || [] : [];
  useEffect(() => {
    const h = setTimeout(() => saveDraft(draftKey, form), 400);
    return () => clearTimeout(h);
  }, [form, draftKey]);
  function set(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "nom" && isNew && !slugTouched) {
        next.slug = slugifyLocal(value);
      }
      return next;
    });
  }
  useEffect(() => {
    const s = (form.slug || "").trim();
    if (!isNew && s === (produit.slug || "")) {
      setSlugStatus(null);
      return;
    }
    if (!s || !/^[a-z0-9-]+$/.test(s)) {
      setSlugStatus(null);
      return;
    }
    let cancelled = false;
    setSlugChecking(true);
    const h = setTimeout(async () => {
      try {
        const qs = new URLSearchParams({ slug: s });
        if (!isNew && produit.id) qs.set("exceptId", String(produit.id));
        const res = await adminFetch(`/api/admin/produits/slug-check?${qs.toString()}`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        if (!cancelled) setSlugStatus(!!data.available);
      } catch {
        if (!cancelled) setSlugStatus(null);
      } finally {
        if (!cancelled) setSlugChecking(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(h);
    };
  }, [form.slug, isNew, produit.id, produit.slug]);
  const slugFormatInvalid = form.slug && !/^[a-z0-9-]+$/.test(form.slug) ? "Lettres min., chiffres, tirets uniquement." : null;
  const slugError = slugFormatInvalid || (slugStatus === false ? "Ce slug est déjà pris." : null);
  const canSave = !saving && !slugError;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        if (canSave) formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, canSave]);
  async function submit(e) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }
  function discardDraft() {
    clearDraft(draftKey);
    setForm({ ...produit });
    setDraftRestored(false);
    if (isNew) setSlugTouched(false);
  }
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between z-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-soft font-bold text-[20px]", children: isNew ? "Nouveau produit" : `Éditer « ${produit.nom} »` }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            "aria-label": "Fermer",
            className: "w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
          }
        )
      ] }),
      draftRestored && /* @__PURE__ */ jsxs(
        "div",
        {
          role: "status",
          "aria-live": "polite",
          className: "px-6 py-2.5 bg-orange-50 border-b border-orange-200 text-[12px] text-orange-900 flex items-center justify-between gap-3",
          children: [
            /* @__PURE__ */ jsx("span", { children: "↺ Brouillon restauré depuis votre dernière session." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: discardDraft,
                className: "font-bold text-orange-900 hover:underline shrink-0",
                children: "Repartir des valeurs initiales"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs("form", { ref: formRef, onSubmit: submit, className: "p-6 space-y-5", children: [
        /* @__PURE__ */ jsx(Field, { label: "Nom du produit", required: true, children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            required: true,
            value: form.nom,
            onChange: (e) => set("nom", e.target.value),
            className: "input",
            placeholder: "Riz basmati parfumé"
          }
        ) }),
        /* @__PURE__ */ jsxs(
          Field,
          {
            label: "Slug",
            required: true,
            hint: "Identifiant unique, sans espaces/majuscules.",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    required: true,
                    pattern: "[a-z0-9\\-]+",
                    value: form.slug,
                    onChange: (e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value);
                    },
                    className: `input pr-20 ${slugError ? "!border-rouge" : slugStatus === true ? "!border-vert" : ""}`,
                    placeholder: "riz-basmati-parfume",
                    "aria-invalid": !!slugError,
                    "aria-describedby": slugError ? "produit-slug-error" : void 0
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wider pointer-events-none", children: slugChecking ? /* @__PURE__ */ jsx("span", { className: "text-neutral-500", children: "…" }) : slugStatus === true ? /* @__PURE__ */ jsx("span", { className: "text-vert", children: "✓ libre" }) : slugStatus === false ? /* @__PURE__ */ jsx("span", { className: "text-rouge", children: "✗ pris" }) : null })
              ] }),
              slugError && /* @__PURE__ */ jsx("p", { id: "produit-slug-error", className: "mt-1 text-[12px] font-bold text-rouge", children: slugError })
            ]
          }
        ),
        /* @__PURE__ */ jsx(Field, { label: "Description", children: /* @__PURE__ */ jsx(
          "textarea",
          {
            value: form.description ?? "",
            onChange: (e) => set("description", e.target.value),
            className: "input min-h-[70px] resize-y",
            placeholder: "Courte description (origine, variété, suggestion d'usage)."
          }
        ) }),
        /* @__PURE__ */ jsx(
          InlineImageUpload,
          {
            folder: "produits",
            value: form.image_url,
            onChange: (url) => set("image_url", url),
            renameTo: form.slug || form.nom,
            label: "Image du produit",
            hint: "Déposer une image l'envoie dans Supabase Storage. JPEG, PNG, WebP, AVIF. 8 Mo max."
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(Field, { label: "Rayon", required: true, children: /* @__PURE__ */ jsxs(
            "select",
            {
              required: true,
              value: form.rayon,
              onChange: (e) => set("rayon", e.target.value),
              className: "input",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "— Choisir —" }),
                rayonsOptions.map((r) => /* @__PURE__ */ jsx("option", { value: r.slug, children: r.nom }, r.slug))
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { label: "Origine", hint: "Pays ou région.", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.origine ?? "",
              onChange: (e) => set("origine", e.target.value),
              className: "input",
              placeholder: "Sénégal, Inde, Portugal…"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(Field, { label: "Catégorie", hint: "Niveau 1 de la taxonomie (drill-down sur la page rayon).", children: categoriesOptions.length > 0 ? /* @__PURE__ */ jsxs(
            "select",
            {
              value: form.categorie ?? "",
              onChange: (e) => {
                set("categorie", e.target.value);
                set("sous_categorie", "");
              },
              className: "input",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "— Choisir —" }),
                categoriesOptions.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
              ]
            }
          ) : /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.categorie ?? "",
              onChange: (e) => set("categorie", e.target.value),
              className: "input",
              placeholder: "Fruits, Viandes, Épices…"
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { label: "Sous-catégorie", hint: "Niveau 2 optionnel (ex : « Dattes » sous « Fruits »).", children: subCategoriesOptions.length > 0 ? /* @__PURE__ */ jsxs(
            "select",
            {
              value: form.sous_categorie ?? "",
              onChange: (e) => set("sous_categorie", e.target.value),
              className: "input",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "— Choisir —" }),
                subCategoriesOptions.map((sc) => /* @__PURE__ */ jsx("option", { value: sc, children: sc }, sc))
              ]
            }
          ) : /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.sous_categorie ?? "",
              onChange: (e) => set("sous_categorie", e.target.value),
              className: "input",
              placeholder: "Dattes, Exotiques…"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx(Field, { label: "Prix indicatif (€)", hint: "Optionnel. Non affiché publiquement par défaut.", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              step: "0.01",
              min: "0",
              value: form.prix_indicatif ?? "",
              onChange: (e) => set("prix_indicatif", e.target.value),
              className: "input",
              placeholder: "2.90"
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { label: "Unité", hint: "kg, pièce, litre, 500 g…", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.unite ?? "",
              onChange: (e) => set("unite", e.target.value),
              className: "input",
              placeholder: "kg"
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { label: "Badge", hint: "Bio, AOP, Artisanal…", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.badge ?? "",
              onChange: (e) => set("badge", e.target.value),
              className: "input",
              placeholder: "Bio"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-5 items-center", children: [
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-[14px]", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: !!form.actif,
                onChange: (e) => set("actif", e.target.checked),
                className: "w-4 h-4 rounded accent-vert"
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Actif (visible sur le site)" })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Ordre", hint: "Petit = en premier.", inline: true, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              step: "1",
              value: form.ordre ?? 0,
              onChange: (e) => set("ordre", e.target.value),
              className: "input w-20"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-3 sticky bottom-0 bg-white border-t border-black/5 -mx-6 px-6 py-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onCancel,
              className: "px-5 py-2 rounded-full bg-white border-2 border-black/10 font-bold text-[13px] hover:border-noir transition",
              children: "Annuler"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: !canSave,
              className: "flex-1 px-5 py-2 rounded-full bg-vert text-white font-bold text-[13px] hover:bg-vert-dark transition disabled:opacity-50",
              title: "Ctrl/Cmd + S pour enregistrer",
              children: saving ? "Enregistrement…" : isNew ? "Créer le produit" : "Enregistrer"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .input {
          width: 100%;
          padding: 0.5rem 0.9rem;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 0.75rem;
          background: white;
          font-size: 14px;
          color: #111;
        }
        .input:focus { outline: none; border-color: #1C6B35; }
      ` })
  ] });
}
function Field({ label, hint, required, inline, children }) {
  return /* @__PURE__ */ jsxs("div", { className: inline ? "inline-flex items-center gap-2" : "", children: [
    /* @__PURE__ */ jsxs("label", { className: "block text-[]-neutral-600 uppercase tracking-wider mb-1.5", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-rouge ml-1", children: "*" })
    ] }),
    children,
    hint && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[]-neutral-600 leading-snug", children: hint })
  ] });
}
function detectFormat(text) {
  const clean = text.replace(/^\uFEFF/, "").trimStart();
  if (!clean) return "empty";
  const c0 = clean[0];
  if (c0 === "[" || c0 === "{") return "json";
  return "csv";
}
function parseCSV(raw) {
  const text = raw.replace(/^\uFEFF/, "");
  const firstLine = text.split(/\r?\n/)[0] ?? "";
  const semis = (firstLine.match(/;/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  const sep = semis > commas ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const n = text.length;
  for (let i = 0; i < n; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else {
      if (c === '"' && cell === "") {
        inQuotes = true;
      } else if (c === sep) {
        row.push(cell);
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell);
        cell = "";
        if (row.some((v) => v !== "")) rows.push(row);
        row = [];
      } else {
        cell += c;
      }
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    if (row.some((v) => v !== "")) rows.push(row);
  }
  if (rows.length < 2) throw new Error("CSV vide ou sans en-tête");
  const headers = rows[0].map(
    (h) => String(h).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  );
  return rows.slice(1).map((r, idx) => {
    const obj = {};
    headers.forEach((h, i) => {
      if (!h) return;
      const v = (r[i] ?? "").trim();
      if (v !== "") obj[h] = v;
    });
    if ("actif" in obj) {
      const t = String(obj.actif).toLowerCase();
      obj.actif = !(t === "0" || t === "false" || t === "non" || t === "n" || t === "");
    }
    return obj;
  });
}
function ImportModal({ currentProduits, onCancel, onImport }) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [format, setFormat] = useState(null);
  const [err, setErr] = useState(null);
  const fileInputRef = useRef(null);
  function onPaste(v) {
    setText(v);
    if (!v.trim()) {
      setParsed(null);
      setErr(null);
      setFormat(null);
      return;
    }
    const fmt = detectFormat(v);
    setFormat(fmt);
    try {
      if (fmt === "json") {
        const obj = JSON.parse(v);
        const arr = Array.isArray(obj) ? obj : obj.produits;
        if (!Array.isArray(arr)) throw new Error("JSON doit être un tableau ou { produits: [...] }");
        setParsed(arr);
      } else if (fmt === "csv") {
        setParsed(parseCSV(v));
      } else {
        setParsed(null);
      }
      setErr(null);
    } catch (e) {
      setParsed(null);
      setErr(e.message);
    }
  }
  async function onFilePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const txt = await file.text();
      onPaste(txt);
    } catch (readErr) {
      setErr(`Lecture du fichier échouée : ${humanizeError(readErr)}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }
  const existingSlugs = new Set(currentProduits.map((p) => p.slug));
  const diff = parsed ? parsed.map((p) => ({
    ...p,
    _action: existingSlugs.has(p.slug) ? "Mise à jour" : "Création"
  })) : [];
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-3xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between z-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-soft font-bold text-[20px]", children: "Importer des produits" }),
        /* @__PURE__ */ jsx("p", { className: "text-[]-neutral-600 mt-0.5", children: "Coller du JSON ou CSV, ou charger un fichier. Format détecté automatiquement." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          "aria-label": "Fermer",
          className: "w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-4 text-[13px] text-neutral-600 leading-relaxed", children: [
        /* @__PURE__ */ jsx("strong", { children: "JSON :" }),
        " tableau ",
        /* @__PURE__ */ jsx("code", { className: "bg-white px-1 rounded", children: "[...]" }),
        " ou ",
        /* @__PURE__ */ jsx("code", { className: "bg-white px-1 rounded", children: `{ produits: [...] }` }),
        ".",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("strong", { children: "CSV :" }),
        " une ligne d'en-tête puis une ligne par produit. Séparateur ",
        /* @__PURE__ */ jsx("code", { children: "," }),
        " ou ",
        /* @__PURE__ */ jsx("code", { children: ";" }),
        " auto-détecté.",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("strong", { children: "Champs requis :" }),
        " slug, nom, rayon.",
        /* @__PURE__ */ jsx("strong", { children: " Optionnels :" }),
        " description, image_url, prix_indicatif, unite, categorie, sous_categorie, origine, badge, actif, ordre.",
        /* @__PURE__ */ jsx("br", {}),
        "Les slugs existants sont mis à jour, les nouveaux créés."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: ".csv,.json,text/csv,application/json",
            onChange: onFilePick,
            className: "hidden",
            id: "import-file-input"
          }
        ),
        /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: "import-file-input",
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black/10 font-bold text-[13px] cursor-pointer hover:border-noir transition",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12", strokeLinecap: "round", strokeLinejoin: "round" }) }),
              "Charger un fichier"
            ]
          }
        ),
        format && format !== "empty" && /* @__PURE__ */ jsxs("span", { className: "inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] uppercase tracking-wider", children: [
          "Format détecté : ",
          format
        ] }),
        text && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onPaste(""),
            className: "text-[]-neutral-600 hover:text-rouge transition",
            children: "Vider"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: text,
          onChange: (e) => onPaste(e.target.value),
          className: "w-full min-h-[220px] font-mono text-[12px] px-4 py-3 border border-black/10 rounded-2xl bg-white resize-y focus:outline-none focus:border-vert",
          placeholder: 'slug,nom,rayon,categorie,sous_categorie,origine\nriz-basmati,Riz basmati parfumé,produits-courants,"Céréales",,Inde\n\n-- ou JSON --\n[{"slug":"riz-basmati","nom":"Riz basmati","rayon":"produits-courants"}]',
          spellCheck: false
        }
      ),
      err && /* @__PURE__ */ jsxs("div", { className: "bg-rouge/5 border border-rouge/20 text-rouge rounded-2xl p-3 text-[13px]", children: [
        /* @__PURE__ */ jsxs("strong", { children: [
          format === "csv" ? "CSV" : "JSON",
          " invalide :"
        ] }),
        " ",
        err
      ] }),
      parsed && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-black/5 rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white px-4 py-2 text-[]-neutral-600 uppercase tracking-wider", children: [
          "Prévisualisation · ",
          parsed.length,
          " ligne(s)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-64 overflow-y-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-[12px]", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-white sticky top-0", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-neutral-500", children: [
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Action" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Slug" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Nom" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Rayon" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Catégorie" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-bold", children: "Origine" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: diff.map((p, i) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-black/5", children: [
            /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5", children: /* @__PURE__ */ jsx(
              "span",
              {
                className: `inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${p._action === "Création" ? "bg-vert/15 text-vert-dark" : "bg-blue-100 text-blue-700"}`,
                children: p._action
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5 font-mono", children: p.slug }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5", children: p.nom }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5 text-neutral-500", children: p.rayon }),
            /* @__PURE__ */ jsxs("td", { className: "px-3 py-1.5 text-neutral-500", children: [
              p.categorie ?? "—",
              p.sous_categorie ? /* @__PURE__ */ jsxs("span", { className: "text-neutral-500", children: [
                " / ",
                p.sous_categorie
              ] }) : null
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-1.5 text-neutral-500", children: p.origine ?? "—" })
          ] }, i)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            className: "px-5 py-2 rounded-full bg-white border-2 border-black/10 font-bold text-[13px] hover:border-noir transition",
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => parsed && onImport(parsed),
            disabled: !parsed || parsed.length === 0,
            className: "flex-1 px-5 py-2 rounded-full bg-vert text-white font-bold text-[13px] hover:bg-vert-dark transition disabled:opacity-50",
            children: [
              "Publier ",
              parsed?.length ?? 0,
              " produit(s)"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}

export { ProduitsManager as P };
