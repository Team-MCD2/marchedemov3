import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_D6bhTD9n.mjs';
import { $ as $$AdminTopbar } from '../../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import { $ as $$Breadcrumb } from '../../../chunks/Breadcrumb_EdwKG08k.mjs';
import { P as ProduitsManager } from '../../../chunks/ProduitsManager_QbemsIGH.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { a as RAYONS_LIST, R as RAYONS, S as SITE } from '../../../chunks/site_dG8pplQb.mjs';
import { c as categorieLabelFromSlug, s as sousCategorieLabelFromSlug, T as TAXONOMIE, a as slugifyCat } from '../../../chunks/taxonomie_BqHH0ZpJ.mjs';
import { i as isAuthenticated } from '../../../chunks/auth_YbJ1phUF.mjs';
import '../../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../../renderers.mjs';

const STORAGE_KEY = "admin.catalogue.tree.expanded";
function readExpanded() {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeExpanded(map) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
  }
}
function norm(s) {
  return (s ?? "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function matchesRec(node, q) {
  if (!q) return true;
  if (norm(node.label).includes(q)) return true;
  if (node.children) {
    return node.children.some((c) => matchesRec(c, q));
  }
  return false;
}
function AdminCatalogueTree({ tree = [], activePath = "", publicUrl = null }) {
  const [expanded, setExpanded] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [focusedId, setFocusedId] = useState(null);
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = readExpanded();
    setExpanded((cur) => ({ ...stored, ...cur }));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!activePath) return;
    const [rayonSlug, catSlug] = activePath.split("/");
    setExpanded((cur) => {
      const nxt = { ...cur };
      if (rayonSlug) nxt[rayonSlug] = true;
      if (rayonSlug && catSlug) nxt[`${rayonSlug}/${catSlug}`] = true;
      return nxt;
    });
  }, [activePath]);
  useEffect(() => {
    if (!hydrated) return;
    writeExpanded(expanded);
  }, [expanded, hydrated]);
  function toggleExpanded(id) {
    setExpanded((cur) => ({ ...cur, [id]: !cur[id] }));
  }
  function setExpandedValue(id, value) {
    setExpanded((cur) => ({ ...cur, [id]: value }));
  }
  const q = norm(query.trim());
  const visibleTree = useMemo(() => {
    if (!q) return tree;
    return tree.map((rayon) => {
      if (norm(rayon.label).includes(q)) return rayon;
      const kids = (rayon.children ?? []).map((cat) => {
        if (norm(cat.label).includes(q)) return cat;
        const subs = (cat.children ?? []).filter((s) => matchesRec(s, q));
        if (subs.length) return { ...cat, children: subs };
        return null;
      }).filter(Boolean);
      return kids.length ? { ...rayon, children: kids } : null;
    }).filter(Boolean);
  }, [tree, q]);
  const searchExpanded = useMemo(() => {
    if (!q) return null;
    const map = {};
    for (const r of visibleTree) {
      map[r.slug] = true;
      for (const c of r.children ?? []) {
        map[`${r.slug}/${c.slug}`] = true;
      }
    }
    return map;
  }, [visibleTree, q]);
  const effectiveExpanded = searchExpanded ?? expanded;
  const flatVisible = useMemo(() => {
    const out = [];
    for (const r of visibleTree) {
      out.push({ id: r.slug, depth: 0, node: r, kind: "rayon" });
      if (effectiveExpanded[r.slug]) {
        for (const c of r.children ?? []) {
          const catId = `${r.slug}/${c.slug}`;
          out.push({ id: catId, depth: 1, node: c, kind: "cat" });
          if (effectiveExpanded[catId] && c.children) {
            for (const s of c.children) {
              out.push({ id: `${catId}/${s.slug}`, depth: 2, node: s, kind: "sub" });
            }
          }
        }
      }
    }
    return out;
  }, [visibleTree, effectiveExpanded]);
  useEffect(() => {
    if (activePath && flatVisible.some((r) => r.id === activePath)) {
      setFocusedId(activePath);
    } else if (!focusedId && flatVisible[0]) {
      setFocusedId(flatVisible[0].id);
    }
  }, [activePath]);
  const onKeyDown = useCallback(
    (e) => {
      const idx = flatVisible.findIndex((r) => r.id === focusedId);
      const cur = idx >= 0 ? flatVisible[idx] : null;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = flatVisible[Math.min(idx + 1, flatVisible.length - 1)];
        if (next) setFocusedId(next.id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = flatVisible[Math.max(idx - 1, 0)];
        if (prev) setFocusedId(prev.id);
      } else if (e.key === "Home") {
        e.preventDefault();
        if (flatVisible[0]) setFocusedId(flatVisible[0].id);
      } else if (e.key === "End") {
        e.preventDefault();
        const last = flatVisible[flatVisible.length - 1];
        if (last) setFocusedId(last.id);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!cur) return;
        if (cur.node.children && cur.node.children.length) {
          if (!effectiveExpanded[cur.id]) {
            setExpandedValue(cur.id, true);
          } else {
            const childIdx = idx + 1;
            if (flatVisible[childIdx] && flatVisible[childIdx].depth > cur.depth) {
              setFocusedId(flatVisible[childIdx].id);
            }
          }
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!cur) return;
        if (cur.node.children && cur.node.children.length && effectiveExpanded[cur.id]) {
          setExpandedValue(cur.id, false);
        } else if (cur.depth > 0) {
          for (let i = idx - 1; i >= 0; i--) {
            if (flatVisible[i].depth < cur.depth) {
              setFocusedId(flatVisible[i].id);
              break;
            }
          }
        }
      } else if (e.key === "Enter" || e.key === " ") {
        if (!cur) return;
        if (cur.node.href) {
          e.preventDefault();
          window.location.href = cur.node.href;
        }
      }
    },
    [flatVisible, focusedId, effectiveExpanded]
  );
  useEffect(() => {
    function onKey(e) {
      if (e.key !== "/") return;
      const t = e.target;
      const tag = t?.tagName?.toLowerCase();
      const editable = tag === "input" || tag === "textarea" || tag === "select" || t?.isContentEditable;
      if (editable) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const totalRayons = tree.length;
  const totalProduits = tree.reduce((s, r) => s + (r.counts?.total ?? 0), 0);
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      "aria-label": "Arborescence du catalogue",
      className: "bg-white rounded-3xl shadow-card overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-black/5 bg-white", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-soft font-bold text-[14px] text-noir", children: [
            "Catalogue",
            /* @__PURE__ */ jsxs("span", { className: "ml-2 text-[]-neutral-600", children: [
              totalProduits,
              " produit(s) · ",
              totalRayons,
              " rayons"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: searchRef,
                type: "search",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Filtrer…  (raccourci : /)",
                "aria-label": "Rechercher dans l'arbre",
                className: "w-full px-3 py-1.5 pr-7 rounded-full border border-black/10 text-[12px] focus:border-vert focus:outline-none bg-white"
              }
            ),
            query && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setQuery(""),
                "aria-label": "Effacer la recherche",
                className: "absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-neutral-500 hover:bg-neutral-100 flex items-center justify-center",
                children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 border-b border-black/5 flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsx(
            TopLink,
            {
              href: "/admin/catalogue",
              label: "Tous les rayons",
              active: activePath === "",
              count: totalProduits
            }
          ),
          /* @__PURE__ */ jsx(TopLink, { href: "/admin/produits", label: "Vue plate (tous les produits) →", muted: true }),
          publicUrl && /* @__PURE__ */ jsx(
            TopLink,
            {
              href: publicUrl,
              label: "Voir sur le site public ↗",
              muted: true,
              external: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: containerRef,
            role: "tree",
            "aria-label": "Rayons et catégories",
            tabIndex: 0,
            onKeyDown,
            className: "py-1 max-h-[70vh] overflow-y-auto focus:outline-none",
            children: visibleTree.length === 0 ? /* @__PURE__ */ jsxs("p", { className: "px-4 py-6 text-[]-neutral-600 italic", children: [
              "Aucun nœud ne correspond à « ",
              query,
              " »."
            ] }) : visibleTree.map((rayon) => /* @__PURE__ */ jsx(
              TreeRayon,
              {
                rayon,
                activePath,
                expanded: effectiveExpanded,
                onToggle: toggleExpanded,
                focusedId,
                setFocusedId,
                searching: !!q
              },
              rayon.slug
            ))
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 border-t border-black/5 bg-white/50 flex items-center gap-3 text-[]-neutral-600 flex-wrap", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-vert" }),
            "actifs"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-orange-400" }),
            "sans image"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-rouge" }),
            "orphelins"
          ] })
        ] })
      ]
    }
  );
}
function TopLink({ href, label, active = false, muted = false, count, external = false }) {
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      ...external ? { target: "_blank", rel: "noopener" } : {},
      className: `px-2 py-1.5 rounded-lg text-[]-neutral-600 hover:bg-neutral-100"
          : "text-noir hover:bg-white"
      }`,
      "aria-current": active ? "page" : void 0,
      children: [
        /* @__PURE__ */ jsx("span", { children: label }),
        count != null && /* @__PURE__ */ jsx("span", { className: `text-[]-neutral-600"}`, children: count })
      ]
    }
  );
}
function TreeRayon({ rayon, activePath, expanded, onToggle, focusedId, setFocusedId, searching }) {
  const rayonId = rayon.slug;
  const isOpen = !!expanded[rayonId];
  const isActive = activePath === rayonId || activePath.startsWith(`${rayonId}/`);
  const isSelf = activePath === rayonId;
  const focused = focusedId === rayonId;
  return /* @__PURE__ */ jsxs("div", { role: "none", children: [
    /* @__PURE__ */ jsx(
      Row,
      {
        id: rayonId,
        depth: 0,
        label: rayon.label,
        accent: rayon.accent,
        href: rayon.href,
        counts: rayon.counts,
        hasChildren: !!(rayon.children && rayon.children.length),
        expanded: isOpen,
        onToggle: () => onToggle(rayonId),
        isActive: isSelf,
        isOnActivePath: isActive && !isSelf,
        focused,
        onFocus: () => setFocusedId(rayonId)
      }
    ),
    isOpen && rayon.children?.map((cat) => /* @__PURE__ */ jsx(
      TreeCat,
      {
        rayonSlug: rayon.slug,
        cat,
        activePath,
        expanded,
        onToggle,
        focusedId,
        setFocusedId,
        searching
      },
      cat.slug
    ))
  ] });
}
function TreeCat({ rayonSlug, cat, activePath, expanded, onToggle, focusedId, setFocusedId }) {
  const catId = `${rayonSlug}/${cat.slug}`;
  const isOpen = !!expanded[catId];
  const isActive = activePath === catId || activePath.startsWith(`${catId}/`);
  const isSelf = activePath === catId;
  const focused = focusedId === catId;
  return /* @__PURE__ */ jsxs("div", { role: "none", children: [
    /* @__PURE__ */ jsx(
      Row,
      {
        id: catId,
        depth: 1,
        label: cat.label,
        href: cat.href,
        counts: cat.counts,
        isOrphan: cat.isOrphan,
        hasChildren: !!(cat.children && cat.children.length),
        expanded: isOpen,
        onToggle: () => onToggle(catId),
        isActive: isSelf,
        isOnActivePath: isActive && !isSelf,
        focused,
        onFocus: () => setFocusedId(catId)
      }
    ),
    isOpen && cat.children?.map((sub) => {
      const subId = `${catId}/${sub.slug}`;
      const subActive = activePath === subId;
      const subFocused = focusedId === subId;
      return /* @__PURE__ */ jsx(
        Row,
        {
          id: subId,
          depth: 2,
          label: sub.label,
          href: sub.href,
          counts: sub.counts,
          isOrphan: sub.isOrphan,
          hasChildren: false,
          isActive: subActive,
          focused: subFocused,
          onFocus: () => setFocusedId(subId)
        },
        sub.slug
      );
    })
  ] });
}
function Row({
  depth,
  label,
  accent,
  href,
  counts,
  hasChildren,
  expanded,
  onToggle,
  isActive,
  isOnActivePath,
  focused,
  onFocus,
  isOrphan
}) {
  const rowRef = useRef(null);
  useEffect(() => {
    if (focused && rowRef.current) {
      rowRef.current.focus({ preventScroll: false });
      rowRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [focused]);
  const padLeft = 8 + depth * 14;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "treeitem",
      "aria-expanded": hasChildren ? !!expanded : void 0,
      "aria-selected": isActive,
      tabIndex: focused ? 0 : -1,
      ref: rowRef,
      onFocus,
      className: `group flex items-center gap-1 pr-2 py-1 rounded-lg mx-2 transition outline-none ${isActive ? "bg-noir text-white" : isOnActivePath ? "bg-white text-noir" : focused ? "bg-white text-noir" : "hover:bg-white/60"} ${isOrphan ? "italic" : ""}`,
      style: { paddingLeft: padLeft },
      children: [
        hasChildren ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              onToggle?.();
            },
            "aria-label": expanded ? "Replier" : "Déplier",
            className: `w-5 h-5 shrink-0 rounded flex items-center justify-center text-[]-neutral-600 hover:bg-black/5"
          }`,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: `w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`,
                viewBox: "0 0 10 10",
                fill: "currentColor",
                children: /* @__PURE__ */ jsx("path", { d: "M3 1l4 4-4 4V1z" })
              }
            )
          }
        ) : /* @__PURE__ */ jsx("span", { className: "w-5 h-5 shrink-0" }),
        accent && /* @__PURE__ */ jsx(
          "span",
          {
            className: "w-2 h-2 rounded-full shrink-0",
            style: { backgroundColor: accent },
            "aria-hidden": "true"
          }
        ),
        !accent && isOrphan && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-rouge shrink-0", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href,
            onClick: (e) => {
              e.stopPropagation();
            },
            className: `flex-1 min-w-0 truncate text-[12px] ${isActive ? "font-bold" : depth === 0 ? "font-bold" : "font-semibold"}`,
            children: label
          }
        ),
        counts && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 shrink-0 text-[10px]", children: [
          counts.orphelin > 0 && /* @__PURE__ */ jsxs(
            "span",
            {
              className: "px-1.5 py-0.5 rounded-full bg-rouge/10 text-rouge font-bold",
              title: `${counts.orphelin} produit(s) orphelin(s)`,
              children: [
                counts.orphelin,
                "⚠"
              ]
            }
          ),
          counts.sansImage > 0 && /* @__PURE__ */ jsxs(
            "span",
            {
              className: `px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/15 text-white" : "bg-orange-100 text-orange-700"}`,
              title: `${counts.sansImage} produit(s) sans image`,
              children: [
                counts.sansImage,
                "🖼"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-1.5 py-0.5 rounded-full font-bold tabular-nums ${isActive ? "bg-white/20 text-white" : counts.total === 0 ? "bg-neutral-100 text-neutral-500" : "bg-vert/15 text-vert-dark"}`,
              title: counts.actif != null ? `${counts.actif} actif(s) sur ${counts.total}` : `${counts.total} produit(s)`,
              children: counts.actif != null && counts.actif !== counts.total ? `${counts.actif}/${counts.total}` : counts.total
            }
          )
        ] })
      ]
    }
  );
}

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  const rawPath = Astro2.params.path ?? "";
  const parts = rawPath.split("/").filter(Boolean);
  let [rayonSlug, catSlug, subSlug] = parts;
  const rayon = rayonSlug ? RAYONS[rayonSlug] : null;
  if (rayonSlug && !rayon) {
    return Astro2.redirect("/admin/catalogue");
  }
  const catLabel = rayonSlug && catSlug ? categorieLabelFromSlug(rayonSlug, catSlug) : null;
  if (catSlug && !catLabel) {
    return Astro2.redirect(`/admin/catalogue/${rayonSlug}`);
  }
  const subLabel = rayonSlug && catSlug && subSlug ? sousCategorieLabelFromSlug(rayonSlug, catSlug, subSlug) : null;
  if (subSlug && !subLabel) {
    return Astro2.redirect(`/admin/catalogue/${rayonSlug}/${catSlug}`);
  }
  const viewParam = Astro2.url.searchParams.get("view");
  const orphansView = viewParam === "orphelins";
  if (orphansView && subSlug) {
    return Astro2.redirect(`/admin/catalogue/${rayonSlug}/${catSlug}/${subSlug}`);
  }
  let produitsAll = [];
  let promosAll = [];
  let errorMsg = null;
  {
    errorMsg = "SUPABASE_SERVICE_ROLE_KEY non configur\xE9e. Ajoutez-la dans .env.local (dev) ou dans Vercel Environment Variables (prod) puis red\xE9marrez.";
  }
  function summarizeProduits(rows) {
    return {
      total: rows.length,
      actif: rows.filter((p) => p.actif).length,
      sansImage: rows.filter((p) => !p.image_url).length,
      orphelin: 0
    };
  }
  const tree = RAYONS_LIST.map((r) => {
    const rayonProduits = produitsAll.filter((p) => p.rayon === r.slug);
    const taxonomieRayon = TAXONOMIE[r.slug] ?? {};
    const catLabels = Object.keys(taxonomieRayon);
    const knownCatLabels2 = new Set(catLabels);
    const catChildren = catLabels.map((cl) => {
      const catProduits = rayonProduits.filter((p) => p.categorie === cl);
      const subs = taxonomieRayon[cl];
      let subChildren;
      let subOrphelin = 0;
      if (Array.isArray(subs) && subs.length > 0) {
        const knownSubLabels2 = new Set(subs);
        subChildren = subs.map((sl) => {
          const subProduits = catProduits.filter((p) => p.sous_categorie === sl);
          return {
            kind: "sub",
            slug: slugifyCat(sl),
            label: sl,
            href: `/admin/catalogue/${r.slug}/${slugifyCat(cl)}/${slugifyCat(sl)}`,
            counts: summarizeProduits(subProduits)
          };
        });
        const orphanSub = catProduits.filter(
          (p) => p.sous_categorie && !knownSubLabels2.has(p.sous_categorie)
        );
        const missingSub = catProduits.filter((p) => !p.sous_categorie);
        subOrphelin = orphanSub.length + missingSub.length;
        if (subOrphelin > 0) {
          subChildren.push({
            kind: "orphelins",
            slug: "__orphelins",
            label: "Orphelins",
            href: `/admin/catalogue/${r.slug}/${slugifyCat(cl)}?view=orphelins`,
            isOrphan: true,
            counts: {
              total: subOrphelin,
              actif: [...orphanSub, ...missingSub].filter((p) => p.actif).length,
              sansImage: [...orphanSub, ...missingSub].filter((p) => !p.image_url).length,
              orphelin: 0
            }
          });
        }
      }
      const counts2 = summarizeProduits(catProduits);
      counts2.orphelin = subOrphelin;
      return {
        kind: "cat",
        slug: slugifyCat(cl),
        label: cl,
        href: `/admin/catalogue/${r.slug}/${slugifyCat(cl)}`,
        counts: counts2,
        children: subChildren
      };
    });
    const orphanCat = rayonProduits.filter(
      (p) => p.categorie && !knownCatLabels2.has(p.categorie)
    );
    const missingCat = rayonProduits.filter((p) => !p.categorie);
    const catOrphelin = orphanCat.length + missingCat.length;
    if (catOrphelin > 0) {
      catChildren.push({
        kind: "orphelins",
        slug: "__orphelins",
        label: "Orphelins",
        href: `/admin/catalogue/${r.slug}?view=orphelins`,
        isOrphan: true,
        counts: {
          total: catOrphelin,
          actif: [...orphanCat, ...missingCat].filter((p) => p.actif).length,
          sansImage: [...orphanCat, ...missingCat].filter((p) => !p.image_url).length,
          orphelin: 0
        }
      });
    }
    const rayonPromos = promosAll.filter((p) => p.rayon === r.slug);
    const counts = summarizeProduits(rayonProduits);
    counts.orphelin = catOrphelin + catChildren.reduce((s, c) => s + (c.counts?.orphelin ?? 0), 0);
    return {
      kind: "rayon",
      slug: r.slug,
      label: r.nom,
      nomCourt: r.nomCourt,
      accent: r.accent ?? null,
      href: `/admin/catalogue/${r.slug}`,
      counts: {
        ...counts,
        promosActives: rayonPromos.filter((p) => p.actif).length,
        promosTotales: rayonPromos.length
      },
      children: catChildren
    };
  });
  const activePath = rawPath;
  const knownCatLabels = rayonSlug ? Object.keys(TAXONOMIE[rayonSlug] ?? {}) : [];
  const knownSubLabels = rayonSlug && catLabel ? TAXONOMIE[rayonSlug]?.[catLabel] ?? [] : [];
  const scope = {
    rayon: rayonSlug ?? null,
    categorie: catLabel,
    sous_categorie: subLabel,
    displayLabel: subLabel ?? catLabel ?? rayon?.nom ?? null,
    view: orphansView ? "orphelins" : null,
    knownCategorieLabels: knownCatLabels,
    knownSousCategorieLabels: knownSubLabels
  };
  let scopedProduits = produitsAll;
  if (scope.rayon) scopedProduits = scopedProduits.filter((p) => p.rayon === scope.rayon);
  if (scope.categorie) scopedProduits = scopedProduits.filter((p) => p.categorie === scope.categorie);
  if (scope.sous_categorie)
    scopedProduits = scopedProduits.filter((p) => p.sous_categorie === scope.sous_categorie);
  const scopedCount = scopedProduits.length;
  let publicUrl = null;
  if (rayonSlug) {
    const publicParts = [rayonSlug];
    if (catSlug) publicParts.push(catSlug);
    if (subSlug) publicParts.push(subSlug);
    publicUrl = `/rayons/${publicParts.join("/")}`;
  }
  const breadcrumbItems = [
    { name: "Admin", href: "/admin" },
    { name: "Catalogue", href: "/admin/catalogue" }
  ];
  if (rayon) {
    breadcrumbItems.push({
      name: rayon.nom,
      href: `/admin/catalogue/${rayonSlug}`
    });
  }
  if (catLabel) {
    breadcrumbItems.push({
      name: catLabel,
      href: subSlug ? `/admin/catalogue/${rayonSlug}/${catSlug}` : void 0
    });
  }
  if (subLabel) {
    breadcrumbItems.push({ name: subLabel });
  }
  if (orphansView) {
    breadcrumbItems.push({ name: "Orphelins" });
  }
  if (breadcrumbItems.length > 0) {
    const last = { ...breadcrumbItems[breadcrumbItems.length - 1] };
    delete last.href;
    breadcrumbItems[breadcrumbItems.length - 1] = last;
  }
  const rayonsOptions = RAYONS_LIST.map((r) => ({
    slug: r.slug,
    nom: r.nomCourt ?? r.nom
  }));
  const pageTitle = (() => {
    if (orphansView) return `Orphelins \xB7 ${catLabel ?? rayon?.nom ?? "Catalogue"} \u2014 Admin`;
    if (subLabel) return `${subLabel} \xB7 ${rayon?.nom} \u2014 Admin`;
    if (catLabel) return `${catLabel} \xB7 ${rayon?.nom} \u2014 Admin`;
    if (rayon) return `${rayon.nom} \u2014 Admin`;
    return `Catalogue \u2014 Admin \xB7 ${SITE.name}`;
  })();
  const headerTitle = orphansView ? `Orphelins ${catLabel ?? rayon?.nom ?? ""}` : subLabel ?? catLabel ?? rayon?.nom ?? "Tous les rayons";
  const currentRayonPromosActives = rayonSlug ? promosAll.filter((p) => p.rayon === rayonSlug && p.actif).length : 0;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": "Administration du catalogue March\xE9 de Mo' \u2014 arborescence par rayon.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "catalogue", "subtitle": rayon ? `Catalogue \xB7 ${rayon.nom}` : "Catalogue" })} <main class="container-mo py-4 md:py-6"> ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": breadcrumbItems })} ${errorMsg ? renderTemplate`<div class="bg-rouge/10 border border-rouge/30 text-rouge px-5 py-4 rounded-2xl text-[13px]"> ${errorMsg} </div>` : renderTemplate`<div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 md:gap-6"> <!-- Left : tree --> <aside class="lg:sticky lg:top-20 lg:self-start"> ${renderComponent($$result2, "AdminCatalogueTree", AdminCatalogueTree, { "client:load": true, "tree": tree, "activePath": activePath, "publicUrl": publicUrl, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/AdminCatalogueTree.jsx", "client:component-export": "default" })} </aside> <!-- Right : scoped list --> <section class="min-w-0"> <!-- Scope header card --> <div class="bg-white rounded-3xl shadow-card p-5 md:p-6 mb-4 flex items-start justify-between gap-4 flex-wrap"> <div class="min-w-0"> <p class="text-[]-neutral-600"> ${orphansView ? "Produits orphelins" : subLabel ? "Sous-cat\xE9gorie" : catLabel ? "Cat\xE9gorie" : rayon ? "Rayon" : "Catalogue complet"} </p> <h1 class="font-soft font-bold text-[22px] md:text-[26px] mt-1 leading-tight truncate"> ${headerTitle} </h1> <p class="mt-1 text-[13px] text-neutral-500"> <strong class="text-noir">${scopedCount}</strong> produit(s) dans ce scope
${rayonSlug && currentRayonPromosActives > 0 && renderTemplate`<span>
· <strong class="text-noir">${currentRayonPromosActives}</strong> promo(s)
                    active(s)
<a${addAttribute(`/admin/promos?rayon=${rayonSlug}`, "href")} class="ml-2 text-rouge hover:underline font-bold">
Voir →
</a> </span>`} </p> </div> <div class="flex items-center gap-2 flex-wrap shrink-0"> ${publicUrl && !orphansView && renderTemplate`<a${addAttribute(publicUrl, "href")} target="_blank" rel="noopener" class="px-3 py-1.5 rounded-full bg-white border-2 border-black/10 text-[12px] font-bold hover:border-vert hover:text-vert transition inline-flex items-center gap-1">
Voir sur le site public ↗
</a>`} ${!orphansView && rayonSlug && renderTemplate`<a${addAttribute(`/admin/catalogue/${rayonSlug}${catSlug ? "/" + catSlug : ""}?view=orphelins`, "href")} class="px-3 py-1.5 rounded-full bg-rouge/10 text-rouge text-[12px] font-bold hover:bg-rouge/20 transition">
Orphelins ⚠
</a>`} ${orphansView && renderTemplate`<a${addAttribute(`/admin/catalogue/${rayonSlug}${catSlug ? "/" + catSlug : ""}`, "href")} class="px-3 py-1.5 rounded-full bg-white border-2 border-black/10 text-[12px] font-bold hover:border-noir transition">
← Retour
</a>`} </div> </div> <!-- Scoped products --> ${renderComponent($$result2, "ProduitsManager", ProduitsManager, { "client:load": true, "initialProduits": scopedProduits, "rayonsOptions": rayonsOptions, "scope": scope, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/ProduitsManager.jsx", "client:component-export": "default" })} </section> </div>`} </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/catalogue/[...path].astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/catalogue/[...path].astro";
const $$url = "/admin/catalogue/[...path]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
