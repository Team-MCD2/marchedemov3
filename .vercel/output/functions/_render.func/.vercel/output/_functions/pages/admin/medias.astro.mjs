import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead, F as Fragment$1, b as addAttribute } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BrmqTQSx.mjs';
import { $ as $$AdminTopbar } from '../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import { $ as $$Breadcrumb } from '../../chunks/Breadcrumb_EdwKG08k.mjs';
import { $ as $$StatCard } from '../../chunks/StatCard_CeQX2K2s.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { a as adminFetch } from '../../chunks/adminFetch_BJhji8N3.mjs';
import { h as humanizeError } from '../../chunks/admin-errors_BTeClwmf.mjs';
import { a as RAYONS_LIST, S as SITE } from '../../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
import '../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../renderers.mjs';

function fmtSize(bytes) {
  if (bytes == null) return "—";
  const n = Number(bytes);
  if (!Number.isFinite(n)) return "—";
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / 1024 / 1024).toFixed(2)} Mo`;
}
function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "2-digit"
    });
  } catch {
    return "—";
  }
}
function MediasManager({ initialFolder, initialFiles, folders }) {
  const [folder, setFolder] = useState(initialFolder);
  const [files, setFiles] = useState(initialFiles ?? []);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const [menuFor, setMenuFor] = useState(null);
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);
  function notify(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }
  const loadFolder = useCallback(async (f) => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/medias?folder=${encodeURIComponent(f)}`);
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch (err) {
      notify("err", `Erreur : ${humanizeError(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);
  function changeFolder(f) {
    if (f === folder) return;
    setFolder(f);
    setFiles([]);
    loadFolder(f);
  }
  const uploadFiles = useCallback(
    async (fileList) => {
      const arr = Array.from(fileList);
      if (arr.length === 0) return;
      const queued = arr.map((f, i) => ({
        id: `${Date.now()}-${i}-${f.name}`,
        name: f.name,
        state: "pending"
      }));
      setUploads((cur) => [...queued, ...cur]);
      for (let i = 0; i < arr.length; i++) {
        const f = arr[i];
        const id = queued[i].id;
        setUploads((cur) => cur.map((u) => u.id === id ? { ...u, state: "uploading" } : u));
        try {
          const form = new FormData();
          form.append("file", f);
          form.append("folder", folder);
          const res = await adminFetch("/api/admin/medias", { method: "POST", body: form });
          if (!res.ok) throw new Error((await res.json()).error || res.statusText);
          const data = await res.json();
          setUploads((cur) => cur.map((u) => u.id === id ? { ...u, state: "done" } : u));
          setFiles((cur) => [data.file, ...cur.filter((x) => x.path !== data.file.path)]);
        } catch (err) {
          setUploads(
            (cur) => cur.map((u) => u.id === id ? { ...u, state: "error", error: humanizeError(err) } : u)
          );
        }
      }
      notify("ok", `Upload terminé (${arr.length} fichier(s)).`);
      setTimeout(() => {
        setUploads((cur) => cur.filter((u) => u.state === "uploading" || u.state === "error"));
      }, 4e3);
    },
    [folder]
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
      const files2 = e.dataTransfer?.files;
      if (files2 && files2.length) uploadFiles(files2);
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
  }, [uploadFiles]);
  async function deleteFile(path) {
    if (!confirm(`Supprimer « ${path} » ?
Cette action est définitive.`)) return;
    const snapshot = files;
    setFiles((cur) => cur.filter((f) => f.path !== path));
    setMenuFor(null);
    try {
      const res = await adminFetch(`/api/admin/medias?path=${encodeURIComponent(path)}`, {
        method: "DELETE"
      });
      if (!res.ok && res.status !== 204) {
        throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
      }
      notify("ok", `« ${path.split("/").pop()} » supprimé.`);
    } catch (err) {
      setFiles(snapshot);
      notify("err", `Erreur : ${humanizeError(err)}`);
    }
  }
  function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => notify("ok", "URL copiée dans le presse-papier.")).catch(() => notify("err", "Impossible de copier."));
    setMenuFor(null);
  }
  function copyRelativePath(path) {
    navigator.clipboard.writeText(`/medias/${path}`).then(() => notify("ok", "Chemin relatif copié.")).catch(() => notify("err", "Impossible de copier."));
    setMenuFor(null);
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto mb-5 no-scrollbar", children: folders.map((f) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => changeFolder(f.id),
        className: [
          "px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition",
          folder === f.id ? "bg-noir text-white" : "bg-white text-neutral-600 hover:bg-neutral-100 border border-black/5"
        ].join(" "),
        children: f.label
      },
      f.id
    )) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: dropRef,
        className: [
          "relative bg-white rounded-3xl shadow-card border-2 border-dashed transition",
          dragging ? "border-vert bg-vert/5" : "border-transparent"
        ].join(" "),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("p", { className: "font-soft font-bold text-[16px]", children: [
                "Dossier ",
                /* @__PURE__ */ jsx("span", { className: "text-vert", children: folder || "racine" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[13px] text-neutral-500 mt-0.5", children: "Glissez-déposez vos images ici, ou cliquez sur « Choisir des fichiers ». Formats acceptés : JPEG, PNG, WebP, AVIF, GIF, SVG. 8 Mo max par fichier." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "shrink-0", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  multiple: true,
                  accept: "image/*",
                  className: "hidden",
                  onChange: (e) => {
                    if (e.target.files) uploadFiles(e.target.files);
                    e.target.value = "";
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => fileInputRef.current?.click(),
                  className: "px-5 py-2 rounded-full bg-vert text-white text-[13px] font-bold hover:bg-vert-dark transition",
                  children: "Choisir des fichiers"
                }
              )
            ] })
          ] }),
          uploads.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-black/5 px-5 md:px-6 py-3 space-y-1 text-[13px]", children: uploads.map((u) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: [
                  "w-2 h-2 rounded-full shrink-0",
                  u.state === "done" ? "bg-vert" : u.state === "error" ? "bg-rouge" : "bg-orange-400 animate-pulse"
                ].join(" ")
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-mono truncate flex-1", children: u.name }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: [
                  "text-[11px] font-bold uppercase tracking-wider",
                  u.state === "done" ? "text-vert" : u.state === "error" ? "text-rouge" : "text-orange-500"
                ].join(" "),
                children: u.state === "done" ? "OK" : u.state === "error" ? "Erreur" : u.state === "uploading" ? "Envoi…" : "En file"
              }
            ),
            u.error && /* @__PURE__ */ jsx("span", { className: "text-[11px] text-rouge truncate", children: u.error })
          ] }, u.id)) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-[13px] text-neutral-500", children: loading ? "Chargement…" : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("strong", { className: "text-noir", children: files.length }),
      " fichier(s) dans ",
      /* @__PURE__ */ jsx("code", { className: "bg-white px-1.5 py-0.5 rounded text-[12px]", children: folder })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-3", children: !loading && files.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-card p-12 text-center text-neutral-500", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-bold text-[15px] text-neutral-600", children: [
        "Aucun fichier dans « ",
        folder,
        " »"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-[13px]", children: "Glissez-déposez ou cliquez sur « Choisir des fichiers » pour commencer." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4", children: files.map((f) => {
      const isImage = (f.mime ?? "").startsWith("image/");
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative aspect-square bg-white", children: [
              isImage ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: f.publicUrl,
                  alt: "",
                  loading: "lazy",
                  className: "absolute inset-0 w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center text-neutral-500", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 p-2 flex gap-1 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/60 via-black/20 to-transparent", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => copyUrl(f.publicUrl),
                    className: "flex-1 px-2 py-1 rounded-full bg-white text-noir text-[11px] font-bold hover:bg-vert hover:text-white transition",
                    title: "Copier l'URL publique",
                    children: "Copier URL"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setMenuFor(menuFor === f.path ? null : f.path),
                    "aria-label": "Plus",
                    className: "w-8 h-8 rounded-full bg-white hover:bg-noir hover:text-white text-noir transition flex items-center justify-center",
                    children: /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "currentColor", children: [
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "6", r: "1.5" }),
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "1.5" }),
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "18", r: "1.5" })
                    ] })
                  }
                )
              ] }),
              menuFor === f.path && /* @__PURE__ */ jsxs("div", { className: "absolute right-2 bottom-12 z-10 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 p-1 text-[12px] min-w-[160px]", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: f.publicUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "block px-3 py-2 rounded-lg hover:bg-white transition",
                    children: "Ouvrir ↗"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => copyRelativePath(f.path),
                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-white transition",
                    children: "Copier le chemin"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteFile(f.path),
                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-rouge/10 text-rouge transition font-bold",
                    children: "Supprimer"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[12px] text-noir truncate", title: f.name, children: f.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[]-neutral-600 flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: fmtSize(f.size) }),
                /* @__PURE__ */ jsx("span", { children: fmtDate(f.updated_at ?? f.created_at) })
              ] })
            ] })
          ]
        },
        f.path
      );
    }) }) }),
    toast && /* @__PURE__ */ jsx(
      "div",
      {
        role: toast.type === "err" ? "alert" : "status",
        "aria-live": toast.type === "err" ? "assertive" : "polite",
        "aria-atomic": "true",
        className: [
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full font-bold text-[13px] shadow-card",
          toast.type === "ok" ? "bg-vert text-white" : "bg-rouge text-white"
        ].join(" "),
        children: toast.msg
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      ` })
  ] });
}

function slugifyCat(label) {
  if (!label) return "";
  return String(label).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "with", label: "Avec image" },
  { id: "without", label: "Sans image" }
];
function ImageThumb({ src, alt, accent }) {
  const [loaded, setLoaded] = useState(false);
  if (!src) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "aspect-square w-full rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-dashed border-rouge/30 bg-rouge/5",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxs("svg", { className: "w-7 h-7 text-rouge/60", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
            /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
            /* @__PURE__ */ jsx("path", { d: "M21 15l-5-5L5 21", strokeLinecap: "round", strokeLinejoin: "round" }),
            /* @__PURE__ */ jsx("line", { x1: "3", y1: "3", x2: "21", y2: "21", strokeLinecap: "round", strokeLinejoin: "round" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-rouge/80 uppercase tracking-wider", children: "Sans image" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "aspect-square w-full rounded-2xl overflow-hidden bg-white relative",
      style: { "--accent": accent || "#1C6B35" },
      children: [
        !loaded && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 animate-pulse bg-gradient-to-br from-black/5 to-black/10" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src,
            alt: alt || "",
            loading: "lazy",
            decoding: "async",
            onLoad: () => setLoaded(true),
            className: `w-full h-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`
          }
        )
      ]
    }
  );
}
function ProductCard({ p, rayon }) {
  const catSlug = slugifyCat(p.categorie || "");
  const subSlug = slugifyCat(p.sous_categorie || "");
  const href = [
    "/admin/catalogue",
    p.rayon,
    catSlug || null,
    subSlug || null
  ].filter(Boolean).join("/");
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      className: "group flex flex-col gap-2 rounded-2xl p-2 hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-vert/40",
      title: `Ouvrir « ${p.nom} » dans le catalogue`,
      children: [
        /* @__PURE__ */ jsx(ImageThumb, { src: p.image_url, alt: p.nom, accent: rayon?.accent }),
        /* @__PURE__ */ jsxs("div", { className: "px-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-noir leading-tight line-clamp-2", children: p.nom }),
          (p.categorie || p.sous_categorie) && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[]-neutral-600 line-clamp-1", children: [p.categorie, p.sous_categorie].filter(Boolean).join(" · ") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-1.5 flex-wrap", children: [
            !p.actif && /* @__PURE__ */ jsx("span", { className: "inline-block px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[9px] font-bold uppercase tracking-wider", children: "Inactif" }),
            !p.image_url && /* @__PURE__ */ jsx("span", { className: "inline-block px-1.5 py-0.5 rounded-full bg-rouge/10 text-rouge text-[9px] font-bold uppercase tracking-wider", children: "⚠ Sans image" })
          ] })
        ] })
      ]
    }
  );
}
function PromoCard({ p }) {
  const img = p.image_url || null;
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: "/admin/promos",
      className: "group flex flex-col gap-2 rounded-2xl p-2 hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-rouge/40",
      title: `Ouvrir « ${p.titre} » dans les promos`,
      children: [
        /* @__PURE__ */ jsx(ImageThumb, { src: img, alt: p.titre, accent: "#8B1919" }),
        /* @__PURE__ */ jsxs("div", { className: "px-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-noir leading-tight line-clamp-2", children: p.titre }),
          p.rayon && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[]-neutral-600 line-clamp-1 capitalize", children: p.rayon.replace(/-/g, " ") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-1.5 flex-wrap", children: [
            !p.actif && /* @__PURE__ */ jsx("span", { className: "inline-block px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[9px] font-bold uppercase tracking-wider", children: "Inactif" }),
            !img && /* @__PURE__ */ jsx("span", { className: "inline-block px-1.5 py-0.5 rounded-full bg-rouge/10 text-rouge text-[9px] font-bold uppercase tracking-wider", children: "⚠ Sans image" })
          ] })
        ] })
      ]
    }
  );
}
function SectionCard({ id, accent, title, subtitle, count, withImageCount, children, empty }) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id,
      className: "rounded-3xl bg-white border border-black/5 shadow-sm p-4 md:p-6 scroll-mt-28",
      children: [
        /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-3 mb-4 flex-wrap", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "inline-block w-3 h-3 rounded-full shrink-0",
              style: { background: accent || "#1C6B35" },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx("h2", { className: "text-[18px] md:text-[22px] font-soft font-bold text-noir", children: title }),
          subtitle && /* @__PURE__ */ jsx("span", { className: "text-[]-neutral-600", children: subtitle }),
          /* @__PURE__ */ jsxs("span", { className: "ml-auto text-[]-neutral-600 tabular-nums", children: [
            /* @__PURE__ */ jsx("strong", { className: "text-noir", children: withImageCount }),
            /* @__PURE__ */ jsxs("span", { className: "text-neutral-500", children: [
              " / ",
              count
            ] }),
            " avec image"
          ] })
        ] }),
        empty ? /* @__PURE__ */ jsx("p", { className: "text-[13px] text-neutral-500 italic px-2 py-6 text-center", children: empty }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3", children })
      ]
    }
  );
}
function CatalogueImagesView({ initialPromos, initialProduits, rayons }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const searchRef = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if (e.key !== "/") return;
      const t = e.target;
      const tag = t?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const q = query.trim().toLowerCase();
  function matchesFilter(row) {
    if (filter === "all") return true;
    const hasImage = Boolean(row.image_url);
    return filter === "with" ? hasImage : !hasImage;
  }
  function matchesQuery(row, isPromo) {
    if (!q) return true;
    const hay = isPromo ? [row.titre, row.slug, row.rayon] : [row.nom, row.slug, row.categorie, row.sous_categorie];
    return hay.some((v) => v && String(v).toLowerCase().includes(q));
  }
  const promosFiltered = useMemo(
    () => (initialPromos ?? []).filter(
      (p) => matchesFilter(p) && matchesQuery(p, true)
    ),
    [initialPromos, filter, q]
  );
  const produitsByRayon = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const p of initialProduits ?? []) {
      if (!matchesFilter(p)) continue;
      if (!matchesQuery(p, false)) continue;
      const key = p.rayon || "__none__";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    return map;
  }, [initialProduits, filter, q]);
  const totals = useMemo(() => {
    const totalProduits = (initialProduits ?? []).length;
    const produitsWith = (initialProduits ?? []).filter((p) => !!p.image_url).length;
    const totalPromos = (initialPromos ?? []).length;
    const promosWith = (initialPromos ?? []).filter((p) => !!p.image_url).length;
    return { totalProduits, produitsWith, totalPromos, promosWith };
  }, [initialProduits, initialPromos]);
  function rayonCounts(rayonSlug) {
    const all = (initialProduits ?? []).filter((p) => p.rayon === rayonSlug);
    const withImage = all.filter((p) => !!p.image_url).length;
    return { total: all.length, withImage };
  }
  const sortedRayons = (rayons ?? []).slice().sort((a, b) => a.ordre - b.ordre);
  const knownSlugs = new Set(sortedRayons.map((r) => r.slug));
  const orphanRayonSlugs = Array.from(
    new Set(
      (initialProduits ?? []).map((p) => p.rayon).filter((r) => r && !knownSlugs.has(r))
    )
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-[64px] md:top-[72px] z-20 bg-white/90 backdrop-blur-sm -mx-4 md:mx-0 px-4 md:px-0 py-3 border-b border-black/5 md:border-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                /* @__PURE__ */ jsx("path", { d: "M21 21l-4.3-4.3", strokeLinecap: "round" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: searchRef,
              type: "search",
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Filtrer (raccourci : /)",
              className: "w-full pl-9 pr-3 py-2 bg-white rounded-full border-2 border-black/10 text-[13px] focus:border-noir focus:outline-none transition"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 flex-wrap", children: FILTERS.map((f) => {
          const active = filter === f.id;
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setFilter(f.id),
              "aria-pressed": active,
              className: `px-3 py-1.5 rounded-full text-[12px] font-bold transition ${active ? "bg-noir text-white" : "bg-white border-2 border-black/10 hover:border-noir text-noir"}`,
              children: f.label
            },
            f.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "#promos",
            className: "shrink-0 px-2.5 py-1 rounded-full bg-white border-2 border-black/10 hover:border-noir text-[11px] font-bold transition",
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "inline-block w-2 h-2 rounded-full mr-1 align-middle",
                  style: { background: "#8B1919" }
                }
              ),
              "Promos"
            ]
          }
        ),
        sortedRayons.map((r) => {
          const { total, withImage } = rayonCounts(r.slug);
          if (total === 0) return null;
          return /* @__PURE__ */ jsxs(
            "a",
            {
              href: `#${r.slug}`,
              className: "shrink-0 px-2.5 py-1 rounded-full bg-white border-2 border-black/10 hover:border-noir text-[11px] font-bold transition whitespace-nowrap",
              title: `${r.nom} — ${withImage}/${total} avec image`,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "inline-block w-2 h-2 rounded-full mr-1 align-middle",
                    style: { background: r.accent || "#1C6B35" }
                  }
                ),
                r.nomCourt || r.nom,
                /* @__PURE__ */ jsxs("span", { className: "ml-1 text-neutral-500 font-normal", children: [
                  withImage,
                  "/",
                  total
                ] })
              ]
            },
            r.slug
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      SectionCard,
      {
        id: "promos",
        accent: "#8B1919",
        title: "Promos",
        subtitle: totals.totalPromos > 0 ? `${totals.totalPromos} promo(s) enregistrée(s)` : "aucune promo",
        count: totals.totalPromos,
        withImageCount: totals.promosWith,
        empty: promosFiltered.length === 0 ? "Aucune promo ne correspond aux filtres." : null,
        children: promosFiltered.map((p) => /* @__PURE__ */ jsx(PromoCard, { p }, p.id))
      }
    ),
    sortedRayons.map((r) => {
      const { total, withImage } = rayonCounts(r.slug);
      const items = produitsByRayon.get(r.slug) ?? [];
      if (total === 0) return null;
      return /* @__PURE__ */ jsx(
        SectionCard,
        {
          id: r.slug,
          accent: r.accent,
          title: r.nom,
          subtitle: r.nomCourt && r.nomCourt !== r.nom ? r.nomCourt : null,
          count: total,
          withImageCount: withImage,
          empty: items.length === 0 ? "Aucun produit ne correspond aux filtres." : null,
          children: items.map((p) => /* @__PURE__ */ jsx(ProductCard, { p, rayon: r }, p.id))
        },
        r.slug
      );
    }),
    orphanRayonSlugs.map((rSlug) => {
      const items = produitsByRayon.get(rSlug) ?? [];
      if (items.length === 0) return null;
      return /* @__PURE__ */ jsx(
        SectionCard,
        {
          id: `orphan-${rSlug}`,
          accent: "#C0392B",
          title: `Rayon inconnu : ${rSlug}`,
          subtitle: "à reclasser",
          count: items.length,
          withImageCount: items.filter((p) => !!p.image_url).length,
          children: items.map((p) => /* @__PURE__ */ jsx(ProductCard, { p, rayon: null }, p.id))
        },
        `orphan-${rSlug}`
      );
    })
  ] });
}

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$Medias = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Medias;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  const mode = Astro2.url.searchParams.get("mode") === "storage" ? "storage" : "catalogue";
  let errorMsg = null;
  let produits = [];
  let promos = [];
  const DEFAULT_FOLDER = "promos";
  let initialStorageFiles = [];
  const FOLDERS = [
    { id: "promos", label: "Promos" },
    { id: "produits", label: "Produits" },
    { id: "rayons", label: "Rayons" },
    { id: "recettes", label: "Recettes" },
    { id: "home", label: "Accueil" },
    { id: "magasins", label: "Magasins" },
    { id: "postes", label: "Recrutement" }
  ];
  {
    errorMsg = "SUPABASE_SERVICE_ROLE_KEY non configur\xE9e.";
  }
  const totalProduits = produits.length;
  const produitsWithImage = produits.filter((p) => !!p.image_url).length;
  const produitsWithoutImage = totalProduits - produitsWithImage;
  const totalPromos = promos.length;
  const promosActives = promos.filter((p) => p.actif).length;
  const promosWithImage = promos.filter((p) => !!p.image_url).length;
  const breadcrumbItems = [
    { name: "Admin", href: "/admin" },
    { name: "Images" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Gestion des images \xB7 ${SITE.name} \u2014 Admin`, "description": "Toutes les images du catalogue, sourc\xE9es depuis la base, group\xE9es par rayon.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "medias", "subtitle": "Images & m\xE9dias" })} <main class="container-mo py-4 md:py-6"> ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": breadcrumbItems })} <section class="mb-6"> <span class="eyebrow">Images</span> <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3"> <div> <h1 class="display-sm leading-tight">Images & médias</h1> <p class="mt-2 text-[14px] text-neutral-500 max-w-2xl">
Chaque image référencée par une promo ou un produit en base, groupée par rayon.
              Un clic ouvre le rayon concerné dans le catalogue pour y gérer le produit.
</p> </div> <p class="text-[]-neutral-600 md:text-right">
Bucket public <code class="bg-white px-1.5 py-0.5 rounded text-[11px]">medias</code> sur Supabase Storage.<br>
Données <strong class="text-noir">${totalProduits}</strong> produits + <strong class="text-noir">${totalPromos}</strong> promos, rafraîchies à chaque chargement.
</p> </div> </section> ${errorMsg ? renderTemplate`<div class="bg-rouge/5 border border-rouge/30 text-rouge rounded-3xl p-6 md:p-8"> <p class="font-bold text-[15px]">⚠ Supabase indisponible</p> <p class="text-[14px] mt-2 whitespace-pre-line">${errorMsg}</p> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate`<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"> ${renderComponent($$result3, "StatCard", $$StatCard, { "label": "Produits avec image", "value": produitsWithImage, "total": totalProduits, "tone": "vert", "icon": "\u{1F5BC}", "hint": totalProduits > 0 ? `${Math.round(produitsWithImage / totalProduits * 100)} % de couverture` : void 0 })} ${renderComponent($$result3, "StatCard", $$StatCard, { "label": "Produits sans image", "value": produitsWithoutImage, "tone": produitsWithoutImage > 0 ? "orange" : "neutral", "icon": "\u26A0", "href": produitsWithoutImage > 0 ? "/admin/images-gap" : void 0, "hint": produitsWithoutImage === 0 ? "couverture compl\xE8te" : "\xE0 compl\xE9ter" })} ${renderComponent($$result3, "StatCard", $$StatCard, { "label": "Promos actives avec image", "value": promosWithImage, "total": promosActives, "tone": "rouge", "icon": "\u{1F3F7}" })} ${renderComponent($$result3, "StatCard", $$StatCard, { "label": "Rayons", "value": RAYONS_LIST.length, "tone": "noir", "icon": "\u{1F5C2}", "hint": "arborescence publique" })} </div> <div class="flex items-center gap-1 mb-5 bg-white rounded-full p-1 shadow-sm w-fit"> <a href="/admin/medias"${addAttribute([
    "px-4 py-1.5 rounded-full text-[13px] font-bold transition",
    mode === "catalogue" ? "bg-noir text-white" : "text-noir hover:bg-white"
  ], "class:list")}${addAttribute(mode === "catalogue" ? "page" : void 0, "aria-current")}>
Par catalogue
</a> <a href="/admin/medias?mode=storage"${addAttribute([
    "px-4 py-1.5 rounded-full text-[13px] font-bold transition",
    mode === "storage" ? "bg-noir text-white" : "text-noir hover:bg-white"
  ], "class:list")}${addAttribute(mode === "storage" ? "page" : void 0, "aria-current")} title="Gestion brute des fichiers du bucket (upload, suppression)">
Fichiers storage
</a> </div> ${mode === "catalogue" ? renderTemplate`${renderComponent($$result3, "CatalogueImagesView", CatalogueImagesView, { "client:load": true, "initialPromos": promos, "initialProduits": produits, "rayons": RAYONS_LIST, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/CatalogueImagesView.jsx", "client:component-export": "default" })}` : renderTemplate`${renderComponent($$result3, "MediasManager", MediasManager, { "client:load": true, "initialFolder": DEFAULT_FOLDER, "initialFiles": initialStorageFiles, "folders": FOLDERS, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/MediasManager.jsx", "client:component-export": "default" })}`}` })}`} </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/medias.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/medias.astro";
const $$url = "/admin/medias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Medias,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
