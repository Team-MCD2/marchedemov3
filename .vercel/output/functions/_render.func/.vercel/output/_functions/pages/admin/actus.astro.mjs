import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BrmqTQSx.mjs';
import { $ as $$AdminTopbar } from '../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useRef, useMemo } from 'react';
import { E as EmptyState, I as InlineImageUpload } from '../../chunks/EmptyState_D22UHGHQ.mjs';
import { S as SortableHeader } from '../../chunks/SortableHeader_Bs-ZP3vN.mjs';
import { a as adminFetch } from '../../chunks/adminFetch_BJhji8N3.mjs';
import { u as useAdminListState, c as compareRows } from '../../chunks/useAdminListState_Ty28nw7s.mjs';
import { s as subscribeAdminEvents, A as ADMIN_EVENT, p as publishAdminEvent } from '../../chunks/admin-bus_D3U38ckw.mjs';
import { a as RAYONS_LIST, S as SITE } from '../../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
import '../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../renderers.mjs';

const EMPTY_ACTU = {
  id: null,
  slug: "",
  type: "article",
  titre: "",
  resume: "",
  image: "",
  image_alt: "",
  rayon: "",
  date: "",
  href: "",
  badge_label: "",
  actif: true,
  contenu: "",
  auteur: "L'équipe Marché de Mo'"
};
const ACTU_TYPES = [
  { slug: "article", nom: "Actualité / Blog" },
  { slug: "recette", nom: "Recette" },
  { slug: "arrivage", nom: "Arrivage" },
  { slug: "nouveaute", nom: "Nouveauté" },
  { slug: "evenement", nom: "Événement" }
];
function slugifyLocal(raw) {
  if (!raw) return "";
  return String(raw).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}
const PREVIEW_CATEGORIES = {
  promos: { label: "Promos", color: "#8B1919", bg: "#FCE7E7" },
  nouveautes: { label: "Nouveautés", color: "#1C6B35", bg: "#E5F3EB" },
  recettes: { label: "Recettes", color: "#A68332", bg: "#FAF4E4" },
  engagements: { label: "Engagements", color: "#2563EB", bg: "#E3EBFB" },
  evenements: { label: "Événements", color: "#7D4500", bg: "#F5E9D4" },
  article: { label: "Actualité", color: "#1C6B35", bg: "#E5F3EB" },
  recette: { label: "Recette", color: "#A68332", bg: "#FAF4E4" },
  arrivage: { label: "Arrivage", color: "#8B1919", bg: "#FCE7E7" },
  nouveaute: { label: "Nouveauté", color: "#1C6B35", bg: "#E5F3EB" },
  evenement: { label: "Événement", color: "#7D4500", bg: "#F5E9D4" }
};
function renderMarkdown(text) {
  if (!text) return "";
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/^\s*&gt;\s*(.*$)/gim, "<blockquote>$1</blockquote>");
  let lines = html.split("\n");
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.substring(2);
      if (!inList) {
        lines[i] = "<ul><li>" + content + "</li>";
        inList = true;
      } else {
        lines[i] = "<li>" + content + "</li>";
      }
    } else {
      if (inList) {
        lines[i - 1] = lines[i - 1] + "</ul>";
        inList = false;
      }
    }
  }
  if (inList) {
    lines[lines.length - 1] = lines[lines.length - 1] + "</ul>";
  }
  html = lines.join("\n");
  html = html.split(/\n{2,}/).map((block) => {
    block = block.trim();
    if (!block) return "";
    if (block.startsWith("<h") || block.startsWith("<ul") || block.startsWith("<ol") || block.startsWith("<blockquote")) {
      return block;
    }
    return "<p>" + block + "</p>";
  }).join("\n");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/\n/g, "<br />");
  return html;
}
function ActusManager({ initialActus, rayonsOptions }) {
  const [actus, setActus] = useState(initialActus ?? []);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  useEffect(() => {
    return subscribeAdminEvents([ADMIN_EVENT.ACTUS_UPDATED], async () => {
      try {
        const res = await adminFetch("/api/admin/actus");
        if (res.ok) {
          const data = await res.json();
          setActus(data.actus ?? []);
        }
      } catch (err) {
        console.warn("[actus-sync] failed to refresh", err);
      }
    });
  }, []);
  const [formTab, setFormTab] = useState("form");
  const searchInputRef = useRef(null);
  const TYPE_LABELS = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    ACTU_TYPES.forEach((t) => m.set(t.slug, t.nom));
    return (slug) => m.get(slug) ?? slug;
  }, []);
  const RAYON_LABELS = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rayonsOptions.forEach((r) => m.set(r.slug, r.nom));
    return (slug) => m.get(slug) ?? slug;
  }, [rayonsOptions]);
  const STATUT_OPTS = ["all", "active", "inactive"];
  const TYPE_OPTS = ["all", ...ACTU_TYPES.map((t) => t.slug)];
  const SORT_OPTS = ["date", "titre", "type", "rayon", "actif"];
  const { state: listState, set: setFilter, reset: resetFilter, activeCount } = useAdminListState({
    defaults: { q: "", type: "all", rayon: "", statut: "all", sort: "date", dir: "desc" },
    allowed: { statut: STATUT_OPTS, type: TYPE_OPTS, dir: ["asc", "desc"], sort: SORT_OPTS },
    storageKey: "admin.actus.list"
  });
  const filter = listState;
  const sort = useMemo(() => ({ field: listState.sort, dir: listState.dir }), [listState.sort, listState.dir]);
  function setSort(field, dir) {
    setFilter({ sort: field, dir });
  }
  const filtered = useMemo(() => {
    const base = actus.filter((a) => {
      if (filter.type !== "all" && a.type !== filter.type) return false;
      if (filter.rayon && a.rayon !== filter.rayon) return false;
      if (filter.statut === "active" && !a.actif) return false;
      if (filter.statut === "inactive" && a.actif) return false;
      if (filter.q) {
        const q = filter.q.toLowerCase();
        const hay = `${a.titre} ${a.slug} ${a.resume ?? ""} ${a.badge_label ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort.field) {
      base.sort((a, b) => compareRows(a, b, sort.field, sort.dir));
    }
    return base;
  }, [actus, filter, sort]);
  function notify(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3800);
  }
  async function toggleActuActive(row) {
    const nextActif = !row.actif;
    setActus((cur) => cur.map((item) => item.id === row.id ? { ...item, actif: nextActif } : item));
    try {
      const res = await adminFetch(`/api/admin/actus/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: nextActif })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      publishAdminEvent(ADMIN_EVENT.ACTUS_UPDATED, {
        entity: "actu:toggle-actif",
        ids: [row.id]
      });
      notify("ok", `Actualité ${nextActif ? "activée" : "masquée"} avec succès.`);
    } catch (e) {
      setActus((cur) => cur.map((item) => item.id === row.id ? { ...item, actif: row.actif } : item));
      notify("err", `Erreur : ${e.message}`);
    }
  }
  async function handleSave(e) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.titre.trim()) return notify("err", "Le titre est obligatoire.");
    if (!editing.slug.trim()) return notify("err", "Le slug est obligatoire.");
    if (!editing.image.trim()) return notify("err", "L'image est obligatoire.");
    const isNew = !editing.id;
    const url = isNew ? "/api/admin/actus" : `/api/admin/actus/${editing.id}`;
    const method = isNew ? "POST" : "PATCH";
    const payload = {
      ...editing,
      rayon: editing.rayon || null,
      badge_label: editing.badge_label || null,
      date: editing.date ? new Date(editing.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);
      const saved = data.actu;
      if (isNew) {
        setActus((cur) => [saved, ...cur]);
        notify("ok", "Actualité créée avec succès !");
      } else {
        setActus((cur) => cur.map((item) => item.id === saved.id ? saved : item));
        notify("ok", "Actualité modifiée avec succès !");
      }
      publishAdminEvent(ADMIN_EVENT.ACTUS_UPDATED, {
        entity: isNew ? "actu:created" : "actu:updated",
        ids: saved?.id ? [saved.id] : void 0
      });
      setEditing(null);
    } catch (err) {
      notify("err", `Erreur d'enregistrement : ${err.message}`);
    }
  }
  async function handleDelete(id) {
    try {
      const res = await adminFetch(`/api/admin/actus/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      setActus((cur) => cur.filter((item) => item.id !== id));
      publishAdminEvent(ADMIN_EVENT.ACTUS_UPDATED, {
        entity: "actu:deleted",
        ids: [id]
      });
      notify("ok", "Actualité supprimée avec succès.");
      setPendingDelete(null);
    } catch (e) {
      notify("err", `Erreur de suppression : ${e.message}`);
    }
  }
  function handleSuggestSlug() {
    if (!editing) return;
    setEditing((cur) => ({
      ...cur,
      slug: slugifyLocal(cur.titre)
    }));
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    toast && /* @__PURE__ */ jsx(
      "div",
      {
        className: [
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl transition-all border",
          toast.type === "ok" ? "bg-vert/10 border-vert/30 text-vert-dark" : "bg-rouge/10 border-rouge/30 text-rouge"
        ].join(" "),
        role: "alert",
        children: /* @__PURE__ */ jsx("span", { className: "text-[14px] font-bold", children: toast.msg })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-neutral-50 p-4 rounded-3xl border border-neutral-100", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: searchInputRef,
              type: "text",
              value: filter.q,
              onChange: (e) => setFilter("q", e.target.value),
              className: "w-full bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-full py-2.5 pl-10 pr-4 text-[13px] outline-none",
              placeholder: "Rechercher par titre, résumé..."
            }
          ),
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
              ]
            }
          ),
          filter.q && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setFilter("q", ""),
              className: "absolute right-3 top-3 text-neutral-500 hover:text-neutral-600 text-[12px] font-bold",
              children: "Vider"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filter.type,
              onChange: (e) => setFilter("type", e.target.value),
              className: "bg-white border border-black/10 rounded-full py-2.5 px-4 text-[13px] font-medium outline-none focus:border-noir transition",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Tous les types" }),
                ACTU_TYPES.map((t) => /* @__PURE__ */ jsx("option", { value: t.slug, children: t.nom }, t.slug))
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filter.rayon,
              onChange: (e) => setFilter("rayon", e.target.value),
              className: "bg-white border border-black/10 rounded-full py-2.5 px-4 text-[13px] font-medium outline-none focus:border-noir transition",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Tous les rayons" }),
                rayonsOptions.map((r) => /* @__PURE__ */ jsx("option", { value: r.slug, children: r.nom }, r.slug))
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filter.statut,
              onChange: (e) => setFilter("statut", e.target.value),
              className: "bg-white border border-black/10 rounded-full py-2.5 px-4 text-[13px] font-medium outline-none focus:border-noir transition",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Tous les statuts" }),
                /* @__PURE__ */ jsx("option", { value: "active", children: "Actif" }),
                /* @__PURE__ */ jsx("option", { value: "inactive", children: "Masqué" })
              ]
            }
          ),
          activeCount > 0 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: resetFilter,
              className: "text-[]-neutral-600 hover:text-noir px-2 transition",
              children: [
                "Réinitialiser (",
                activeCount,
                ")"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            const defaultDate = /* @__PURE__ */ new Date();
            const tzOffset = defaultDate.getTimezoneOffset() * 6e4;
            const localISOTime = new Date(defaultDate.getTime() - tzOffset).toISOString().slice(0, 16);
            setEditing({ ...EMPTY_ACTU, date: localISOTime });
            setFormTab("form");
          },
          className: "px-5 py-2.5 rounded-full bg-vert text-white text-[13px] font-bold hover:bg-vert-dark transition shadow-md hover:shadow-lg flex items-center gap-2 justify-center",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5v14" }) }),
            "Nouvelle actualité"
          ]
        }
      )
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "Aucune actualité trouvée",
        desc: "Essayez de modifier vos filtres ou créez une nouvelle actualité.",
        onClear: activeCount > 0 ? resetFilter : null
      }
    ) : /* @__PURE__ */ jsx("div", { className: "bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-[13px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold", children: [
        /* @__PURE__ */ jsx("th", { className: "p-4 w-20", children: "Image" }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: /* @__PURE__ */ jsx(
          SortableHeader,
          {
            label: "Titre",
            field: "titre",
            currentField: sort.field,
            currentDir: sort.dir,
            onSort: setSort
          }
        ) }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: /* @__PURE__ */ jsx(
          SortableHeader,
          {
            label: "Type",
            field: "type",
            currentField: sort.field,
            currentDir: sort.dir,
            onSort: setSort
          }
        ) }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: /* @__PURE__ */ jsx(
          SortableHeader,
          {
            label: "Rayon",
            field: "rayon",
            currentField: sort.field,
            currentDir: sort.dir,
            onSort: setSort
          }
        ) }),
        /* @__PURE__ */ jsx("th", { className: "p-4", children: /* @__PURE__ */ jsx(
          SortableHeader,
          {
            label: "Date",
            field: "date",
            currentField: sort.field,
            currentDir: sort.dir,
            onSort: setSort
          }
        ) }),
        /* @__PURE__ */ jsx("th", { className: "p-4 text-center", children: /* @__PURE__ */ jsx(
          SortableHeader,
          {
            label: "Actif",
            field: "actif",
            currentField: sort.field,
            currentDir: sort.dir,
            onSort: setSort
          }
        ) }),
        /* @__PURE__ */ jsx("th", { className: "p-4 text-right w-28", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-neutral-100", children: filtered.map((actu) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-neutral-50/50 group transition", children: [
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden border border-black/5", children: actu.image ? /* @__PURE__ */ jsx("img", { src: actu.image, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-[]-neutral-600 font-bold", children: "N/A" }) }) }),
        /* @__PURE__ */ jsxs("td", { className: "p-4 max-w-xs", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-noir truncate", title: actu.titre, children: actu.titre }),
          /* @__PURE__ */ jsx("div", { className: "text-[]-neutral-600 truncate font-mono", children: actu.slug })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 rounded-full bg-neutral-100 font-medium text-neutral-600 text-[11px]", children: TYPE_LABELS(actu.type) }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: actu.rayon ? /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 rounded-full bg-vert-light/35 text-vert-dark font-medium text-[11px]", children: RAYON_LABELS(actu.rayon) }) : /* @__PURE__ */ jsx("span", { className: "text-neutral-500 text-[12px]", children: "—" }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-neutral-600 font-medium", children: fmtDate(actu.date) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => toggleActuActive(actu),
            className: [
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-1 focus:ring-vert/20",
              actu.actif ? "bg-vert" : "bg-neutral-200"
            ].join(" "),
            role: "switch",
            "aria-checked": actu.actif,
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: [
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  actu.actif ? "translate-x-4" : "translate-x-0"
                ].join(" ")
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100 transition", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const dateObj = new Date(actu.date);
                const tzOffset = dateObj.getTimezoneOffset() * 6e4;
                const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
                setEditing({
                  ...actu,
                  rayon: actu.rayon || "",
                  date: localISOTime,
                  badge_label: actu.badge_label || "",
                  resume: actu.resume || "",
                  image_alt: actu.image_alt || "",
                  href: actu.href || "",
                  contenu: actu.contenu || "",
                  auteur: actu.auteur || "L'équipe Marché de Mo'"
                });
                setFormTab("form");
              },
              className: "p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-noir transition",
              title: "Modifier",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setPendingDelete(actu.id),
              className: "p-1.5 rounded-full hover:bg-rouge/10 text-neutral-500 hover:text-rouge transition",
              title: "Supprimer",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" }) })
            }
          )
        ] }) })
      ] }, actu.id || actu.slug)) })
    ] }) }) }),
    editing && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "w-full max-w-5xl bg-white rounded-3xl shadow-2xl h-[90vh] flex flex-col overflow-hidden animate-slide-in relative",
        role: "dialog",
        "aria-modal": "true",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-neutral-100", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[16px] font-bold text-noir", children: editing.id ? "Modifier l'actualité" : "Nouvelle actualité" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setEditing(null),
                className: "p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-noir transition",
                children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex border-b border-neutral-100 bg-neutral-50 px-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setFormTab("form"),
                className: `py-3 px-5 text-[13px] font-bold border-b-2 transition-all ${formTab === "form" ? "border-vert text-vert" : "border-transparent text-neutral-500 hover:text-noir"}`,
                children: "Édition de l'article"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setFormTab("preview"),
                className: `py-3 px-5 text-[13px] font-bold border-b-2 transition-all ${formTab === "preview" ? "border-vert text-vert" : "border-transparent text-neutral-500 hover:text-noir"}`,
                children: "Aperçu Visuel"
              }
            )
          ] }),
          formTab === "form" ? (
            /* Form Pane */
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "flex-1 overflow-y-auto p-6 space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Titre" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      value: editing.titre,
                      onChange: (e) => setEditing((cur) => ({ ...cur, titre: e.target.value })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none",
                      placeholder: "Ex : Arrivage de Dattes Medjool"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Slug" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleSuggestSlug,
                        className: "text-[11px] font-bold text-vert hover:text-vert-dark transition",
                        children: "Générer depuis le titre"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      value: editing.slug,
                      onChange: (e) => setEditing((cur) => ({ ...cur, slug: e.target.value.toLowerCase() })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none font-mono",
                      placeholder: "dattes-medjool-arrivage"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Type" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: editing.type,
                      onChange: (e) => setEditing((cur) => ({ ...cur, type: e.target.value })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none",
                      children: ACTU_TYPES.map((t) => /* @__PURE__ */ jsx("option", { value: t.slug, children: t.nom }, t.slug))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Rayon associé (Optionnel)" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: editing.rayon,
                      onChange: (e) => setEditing((cur) => ({ ...cur, rayon: e.target.value })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Aucun rayon" }),
                        rayonsOptions.map((r) => /* @__PURE__ */ jsx("option", { value: r.slug, children: r.nom }, r.slug))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Date de publication" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "datetime-local",
                      value: editing.date,
                      onChange: (e) => setEditing((cur) => ({ ...cur, date: e.target.value })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Auteur" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: editing.auteur,
                      onChange: (e) => setEditing((cur) => ({ ...cur, auteur: e.target.value })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none",
                      placeholder: "Ex : L'équipe Marché de Mo'"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Badge personnalisé (Optionnel)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: editing.badge_label,
                      onChange: (e) => setEditing((cur) => ({ ...cur, badge_label: e.target.value })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none",
                      placeholder: "Ex : Exclu Web"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Lien redirection (Optionnel)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: editing.href,
                      onChange: (e) => setEditing((cur) => ({ ...cur, href: e.target.value })),
                      className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none",
                      placeholder: "Ex : /rayons/fruits-legumes"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Résumé / Description courte" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: editing.resume,
                    onChange: (e) => setEditing((cur) => ({ ...cur, resume: e.target.value })),
                    rows: "3",
                    className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none resize-y",
                    placeholder: "Courte description d'accroche..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-[]-neutral-600 uppercase tracking-wider flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "Corps de l'article (Markdown)" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[]-neutral-600 normal-case font-normal", children: "Supporte : #, ##, ###, **, *, [liens](url), listes (-)" })
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: editing.contenu,
                    onChange: (e) => setEditing((cur) => ({ ...cur, contenu: e.target.value })),
                    rows: "10",
                    className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none resize-y font-mono",
                    placeholder: "Écrivez le corps de l'article en Markdown ici..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "border border-neutral-100 rounded-3xl p-4 bg-neutral-50/30", children: /* @__PURE__ */ jsx(
                InlineImageUpload,
                {
                  folder: "actus",
                  value: editing.image,
                  onChange: (url) => setEditing((cur) => ({ ...cur, image: url })),
                  renameTo: editing.slug,
                  label: "Image d'illustration",
                  hint: "Sélectionnez une image d'illustration. Recommandé : format rectangulaire."
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[]-neutral-600 uppercase tracking-wider", children: "Texte alternatif de l'image (Accessibilité)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: editing.image_alt,
                    onChange: (e) => setEditing((cur) => ({ ...cur, image_alt: e.target.value })),
                    className: "w-full bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-black/10 hover:border-black/20 focus:border-noir focus:ring-1 focus:ring-noir transition rounded-2xl py-2.5 px-4 text-[13px] outline-none",
                    placeholder: "Ex : Cagette de dattes fraîches"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    id: "actu-actif",
                    checked: editing.actif,
                    onChange: (e) => setEditing((cur) => ({ ...cur, actif: e.target.checked })),
                    className: "w-4 h-4 rounded text-vert focus:ring-vert border-black/15 transition cursor-pointer"
                  }
                ),
                /* @__PURE__ */ jsx("label", { htmlFor: "actu-actif", className: "text-[13px] font-bold text-noir select-none cursor-pointer", children: "Activer immédiatement (visible sur le site)" })
              ] })
            ] })
          ) : (
            /* Preview Pane */
            /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 md:p-10 space-y-6 bg-[#FFFFFF]", children: [
              /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
                  .preview-prose h2 {
                    font-family: system-ui, -apple-system, sans-serif;
                    font-weight: 700;
                    font-size: 24px;
                    margin-top: 2rem;
                    margin-bottom: 0.75rem;
                    color: #0A0A0A;
                    position: relative;
                    padding-left: 1rem;
                  }
                  .preview-prose h2::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0.4rem;
                    bottom: 0.4rem;
                    width: 4px;
                    background: #1C6B35;
                    border-radius: 2px;
                  }
                  .preview-prose h3 {
                    font-weight: 700;
                    font-size: 18px;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: #0A0A0A;
                  }
                  .preview-prose p {
                    font-size: 15px;
                    line-height: 1.7;
                    color: rgb(64, 64, 64);
                    margin: 0.8rem 0;
                  }
                  .preview-prose ul {
                    margin: 0.75rem 0 1rem 1.25rem;
                    list-style-type: disc;
                  }
                  .preview-prose li {
                    font-size: 15px;
                    line-height: 1.7;
                    margin: 0.3rem 0;
                    color: rgb(64, 64, 64);
                  }
                  .preview-prose strong {
                    color: #0A0A0A;
                    font-weight: 700;
                  }
                  .preview-prose a {
                    color: #1C6B35;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                  }
                  .preview-prose blockquote {
                    margin: 1.25rem 0;
                    padding: 0.75rem 1rem;
                    border-left: 3px solid #1C6B35;
                    background: #F6F2EB;
                    border-radius: 0 0.5rem 0.5rem 0;
                    font-style: italic;
                    color: #3A3A3A;
                  }
                ` } }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    style: {
                      color: (PREVIEW_CATEGORIES[editing.type] || PREVIEW_CATEGORIES.article).color,
                      backgroundColor: (PREVIEW_CATEGORIES[editing.type] || PREVIEW_CATEGORIES.article).bg
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "w-1.5 h-1.5 rounded-full",
                          style: { backgroundColor: (PREVIEW_CATEGORIES[editing.type] || PREVIEW_CATEGORIES.article).color }
                        }
                      ),
                      editing.badge_label || (PREVIEW_CATEGORIES[editing.type] || PREVIEW_CATEGORIES.article).label
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-[]-neutral-600", children: [
                  Math.max(1, Math.round((editing.contenu || "").split(/\s+/).filter(Boolean).length / 230)),
                  " min de lecture"
                ] })
              ] }),
              /* @__PURE__ */ jsx("h1", { className: "font-soft font-bold text-[28px] md:text-[36px] text-neutral-900 leading-tight", children: editing.titre || "Titre de l'actualité" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-[13px] text-neutral-500", children: [
                /* @__PURE__ */ jsx("span", { children: editing.auteur || "L'équipe Marché de Mo'" }),
                /* @__PURE__ */ jsx("span", { children: "·" }),
                /* @__PURE__ */ jsx("span", { children: fmtDate(editing.date || (/* @__PURE__ */ new Date()).toISOString()) })
              ] }),
              editing.image && /* @__PURE__ */ jsx("div", { className: "aspect-[16/9] md:aspect-[2/1] rounded-3xl overflow-hidden shadow-sm bg-neutral-100", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: editing.image,
                  alt: editing.image_alt || editing.titre,
                  className: "w-full h-full object-cover"
                }
              ) }),
              editing.resume && /* @__PURE__ */ jsx("p", { className: "font-soft text-[18px] md:text-[21px] leading-relaxed text-neutral-800 font-medium border-l-4 border-vert pl-4 italic bg-neutral-50/50 py-3 pr-4 rounded-r-2xl", children: editing.resume }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "preview-prose mt-6",
                  dangerouslySetInnerHTML: { __html: renderMarkdown(editing.contenu) }
                }
              )
            ] })
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setEditing(null),
                className: "px-5 py-2.5 rounded-full border border-black/10 hover:border-noir hover:bg-neutral-100 text-[13px] font-bold text-neutral-600 hover:text-noir transition",
                children: "Annuler"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleSave,
                className: "px-6 py-2.5 rounded-full bg-vert hover:bg-vert-dark text-white text-[13px] font-bold transition shadow-md hover:shadow-lg",
                children: "Enregistrer"
              }
            )
          ] })
        ]
      }
    ) }),
    pendingDelete && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-[16px] font-bold text-noir", children: "Supprimer cette actualité ?" }),
      /* @__PURE__ */ jsx("p", { className: "text-[13px] text-neutral-500 leading-normal", children: "Cette action est irréversible. L'actualité sera définitivement retirée de Supabase et n'apparaîtra plus sur le site." }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setPendingDelete(null),
            className: "px-4 py-2 rounded-full border border-black/10 text-[12px] font-bold text-neutral-600 hover:text-noir transition",
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(pendingDelete),
            className: "px-4 py-2 rounded-full bg-rouge text-white text-[12px] font-bold hover:bg-rouge-soft transition",
            children: "Supprimer"
          }
        )
      ] })
    ] }) })
  ] });
}

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$Actus = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Actus;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  let initialActus = [];
  let errorMsg = null;
  {
    errorMsg = "SUPABASE_SERVICE_ROLE_KEY non configur\xE9e. Ajoutez-la dans .env.local (dev) ou dans Vercel Environment Variables (prod) puis red\xE9marrez le serveur.";
  }
  const rayonsOptions = RAYONS_LIST.map((r) => ({
    slug: r.slug,
    nom: r.nomCourt ?? r.nom
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Gestion des actualit\xE9s \xB7 ${SITE.name} \u2014 Admin`, "description": "Administration des actualit\xE9s et du blog du site.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "actus" })} <main class="container-mo py-8 md:py-12"> <section class="mb-8"> <span class="eyebrow">Actualités</span> <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3"> <h1 class="display-sm leading-tight">
Gestion des actualités & blog
</h1> <p class="text-[13px] text-neutral-500 max-w-md md:text-right">
Les actualités sont stockées dans Supabase (<code class="bg-white px-1.5 py-0.5 rounded text-[12px]">public.actus</code>).
            Vous pouvez y gérer les articles de blog, recettes, arrivages et événements.
</p> </div> </section> ${errorMsg ? renderTemplate`<div class="bg-rouge/5 border border-rouge/30 text-rouge rounded-3xl p-6 md:p-8 space-y-4"> <p class="font-bold text-[15px]">⚠ Supabase ou table indisponible</p> <p class="text-[14px] leading-relaxed whitespace-pre-line">${errorMsg}</p> </div>` : renderTemplate`${renderComponent($$result2, "ActusManager", ActusManager, { "client:load": true, "initialActus": initialActus, "rayonsOptions": rayonsOptions, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/ActusManager.jsx", "client:component-export": "default" })}`} </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/actus.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/actus.astro";
const $$url = "/admin/actus";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Actus,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
