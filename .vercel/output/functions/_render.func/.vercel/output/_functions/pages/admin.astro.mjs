import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, s as spreadAttributes, r as renderTemplate, e as renderComponent, F as Fragment } from '../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BrmqTQSx.mjs';
import { $ as $$AdminTopbar } from '../chunks/AdminTopbar_C-Ia9XuP.mjs';
import { $ as $$StatCard } from '../chunks/StatCard_CeQX2K2s.mjs';
import 'clsx';
import { S as SITE } from '../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../chunks/auth_YbJ1phUF.mjs';
import '../chunks/supabase_DGRgIA0P.mjs';
import { a as activityTableStatus, r as recentActivity, d as dailyActivityCounts } from '../chunks/admin-activity_7EJyrd7K.mjs';
import { g as getCollection } from '../chunks/_astro_content_BJyRHHIi.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$3 = createAstro("https://marchedemov2.vercel.app");
const $$QuickAction = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$QuickAction;
  const { href, label, sublabel, icon, tone = "vert", newTab } = Astro2.props;
  const toneToClass = {
    vert: { bg: "bg-vert/10", text: "text-vert-dark", ring: "hover:ring-vert/40" },
    noir: { bg: "bg-noir/10", text: "text-noir", ring: "hover:ring-noir/40" },
    rouge: { bg: "bg-rouge/10", text: "text-rouge", ring: "hover:ring-rouge/40" },
    orange: { bg: "bg-orange-100", text: "text-orange-700", ring: "hover:ring-orange-300" }
  }[tone];
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${spreadAttributes(newTab ? { target: "_blank", rel: "noopener" } : {})}${addAttribute([
    "group relative flex items-start gap-3 bg-white rounded-2xl p-4 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-card",
    toneToClass.ring
  ], "class:list")}> ${icon && renderTemplate`<span${addAttribute([
    "w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0",
    toneToClass.bg,
    toneToClass.text
  ], "class:list")} aria-hidden="true"> ${icon} </span>`} <span class="min-w-0"> <span class="block font-bold text-[14px] text-noir leading-tight truncate">${label}</span> ${sublabel && renderTemplate`<span class="block text-[12px] text-neutral-500 mt-0.5 truncate">${sublabel}</span>`} </span> <span class="ml-auto text-neutral-300 group-hover:text-vert transition" aria-hidden="true">→</span> </a>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/QuickAction.astro", void 0);

const $$Astro$2 = createAstro("https://marchedemov2.vercel.app");
const $$ActivityFeed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ActivityFeed;
  const { rows, emptyHint } = Astro2.props;
  function actionLabel(row) {
    const v = `${row.entity}.${row.action}`;
    const map = {
      "promo.create": "a cr\xE9\xE9 une promo",
      "promo.update": "a modifi\xE9 la promo",
      "promo.delete": "a supprim\xE9 la promo",
      "promo.bulk": "action group\xE9e sur les promos",
      "promo.reorder": "a r\xE9organis\xE9 les promos",
      "promo.import": "a import\xE9 des promos",
      "produit.create": "a cr\xE9\xE9 un produit",
      "produit.update": "a modifi\xE9 le produit",
      "produit.delete": "a supprim\xE9 le produit",
      "produit.bulk": "action group\xE9e sur les produits",
      "produit.reorder": "a r\xE9organis\xE9 les produits",
      "produit.import": "a import\xE9 des produits",
      "media.upload": "a upload\xE9 une image",
      "media.delete": "a supprim\xE9 une image"
    };
    return map[v] ?? v;
  }
  function entityHref(row) {
    if (row.entity === "promo") return "/admin/promos";
    if (row.entity === "produit") return "/admin/produits";
    if (row.entity === "media") return "/admin/medias";
    return null;
  }
  function entityIcon(row) {
    if (row.entity === "promo") return "\u{1F3F7}";
    if (row.entity === "produit") return "\u{1F6D2}";
    if (row.entity === "media") return "\u{1F5BC}";
    return "\u2022";
  }
  function relTime(iso) {
    const t = new Date(iso).getTime();
    if (!Number.isFinite(t)) return "";
    const diff = Date.now() - t;
    const s = Math.floor(diff / 1e3);
    if (s < 60) return `il y a ${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `il y a ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `il y a ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `il y a ${d} j`;
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }
  return renderTemplate`${rows.length === 0 ? renderTemplate`${maybeRenderHead()}<div class="text-center py-10"><p class="text-[28px] mb-2" aria-hidden="true">📜</p><p class="font-soft font-bold text-[14px] text-neutral-600">Aucune activité enregistrée</p><p class="mt-1 text-[12px] text-neutral-400">${emptyHint ?? "Les \xE9critures admin appara\xEEtront ici."}</p></div>` : renderTemplate`<ul class="divide-y divide-black/5">${rows.map((r) => {
    const href = entityHref(r);
    const Inner = renderTemplate`<li class="py-2.5 flex items-start gap-3"><span class="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[12px] shrink-0" aria-hidden="true">${entityIcon(r)}</span><div class="min-w-0 flex-1"><p class="text-[12.5px] leading-snug"><span class="text-neutral-500">${r.actor}</span>${" "}<span class="text-neutral-700">${actionLabel(r)}</span>${r.entity_label && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${" "}<strong class="text-noir">« ${r.entity_label} »</strong>` })}`}</p><p class="text-[11px] text-neutral-400 mt-0.5">${relTime(r.created_at)}</p></div></li>`;
    return href ? renderTemplate`<a${addAttribute(href, "href")} class="block hover:bg-white/40 -mx-2 px-2 rounded-lg transition">${Inner}</a>` : Inner;
  })}</ul>`}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/ActivityFeed.astro", void 0);

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$Sparkline = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Sparkline;
  const {
    values,
    labels = [],
    width = 120,
    height = 32,
    color = "currentColor",
    ariaLabel = "\xC9volution"
  } = Astro2.props;
  const N = Math.max(values.length, 1);
  const max = Math.max(1, ...values);
  const barW = width / N;
  const gap = Math.max(1, barW * 0.2);
  const innerBarW = Math.max(1, barW - gap);
  function barH(v) {
    if (max === 0) return 0;
    return Math.max(1, Math.round(v / max * (height - 4) || 0));
  }
  const total = values.reduce((a, b) => a + b, 0);
  const last = values[values.length - 1] ?? 0;
  const lastX = (N - 1) * barW + innerBarW / 2;
  const lastY = height - barH(last) - 1;
  return renderTemplate`${maybeRenderHead()}<svg class="sparkline"${addAttribute(width, "width")}${addAttribute(height, "height")}${addAttribute(`0 0 ${width} ${height}`, "viewBox")} role="img"${addAttribute(`${ariaLabel} : ${total} actions au total, ${last} aujourd'hui`, "aria-label")}${addAttribute(`color:${color}`, "style")}> <line x1="0"${addAttribute(height - 0.5, "y1")}${addAttribute(width, "x2")}${addAttribute(height - 0.5, "y2")} stroke="currentColor" stroke-opacity="0.15"></line> ${values.map((v, i) => {
    const x = i * barW + gap / 2;
    const h = barH(v);
    const y = height - h - 1;
    return renderTemplate`<rect${addAttribute(x, "x")}${addAttribute(y, "y")}${addAttribute(innerBarW, "width")}${addAttribute(h, "height")}${addAttribute(Math.min(2, innerBarW / 2), "rx")} fill="currentColor"${addAttribute(v === 0 ? 0.18 : 0.7, "fill-opacity")}> <title>${labels[i] ? `${labels[i]} : ${v}` : String(v)}</title> </rect>`;
  })} ${last > 0 && renderTemplate`<circle${addAttribute(lastX, "cx")}${addAttribute(lastY, "cy")}${addAttribute(2.5, "r")} fill="currentColor"></circle>`} </svg>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/Sparkline.astro", void 0);

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString();
  async function safeCount(table, filter) {
    return 0;
  }
  const [
    promosTotal,
    promosActives,
    promosNew7d,
    produitsTotal,
    produitsActifs,
    produitsNew7d,
    produitsSansImage
  ] = await Promise.all([
    safeCount(),
    safeCount(),
    safeCount(),
    safeCount(),
    safeCount(),
    safeCount(),
    safeCount()
  ]);
  const activityStatus = await activityTableStatus();
  const activityRows = activityStatus.available ? await recentActivity(20) : [];
  const activity7d = activityRows.filter((r) => r.created_at >= sevenDaysAgo).length;
  const dailyBuckets = activityStatus.available ? await dailyActivityCounts(14) : null;
  const dayLabelFmt = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short"
  });
  const sparkLabels = (dailyBuckets ?? []).map(
    (b) => dayLabelFmt.format(/* @__PURE__ */ new Date(`${b.date}T00:00:00Z`))
  );
  const produitsDaily = (dailyBuckets ?? []).map((b) => b.byEntity.produit);
  const promosDaily = (dailyBuckets ?? []).map((b) => b.byEntity.promo);
  const totalDaily = (dailyBuckets ?? []).map((b) => b.total);
  const produits14d = produitsDaily.reduce((a, b) => a + b, 0);
  const promos14d = promosDaily.reduce((a, b) => a + b, 0);
  const total14d = totalDaily.reduce((a, b) => a + b, 0);
  let recentPromos = [];
  let promosError = null;
  if (recentPromos.length === 0) {
    const fallback = await getCollection("promos");
    recentPromos = fallback.map((p) => ({ ...p.data, id: p.id })).slice(0, 5);
  }
  let recentProduits = [];
  const postes = await getCollection("postes");
  const articles = await getCollection("articles");
  const activePostes = postes.filter((p) => p.data.actif).length;
  const activeArticles = articles.filter((a) => a.data.actif).length;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Tableau de bord \xB7 ${SITE.name} \u2014 Admin`, "description": "Tableau de bord d'administration du site.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "dashboard", "subtitle": "Tableau de bord" })} <main class="container-mo py-6 md:py-10"> <!-- Hero --> <section class="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 md:mb-8"> <div> <span class="eyebrow">Tableau de bord</span> <h1 class="font-soft font-bold text-[26px] md:text-[32px] leading-tight mt-2">
Bienvenue.
</h1> <p class="mt-1.5 text-[13px] md:text-[14px] text-neutral-500 max-w-xl">
Une vue d'ensemble de l'activité du site. Tous les chiffres sont en temps réel.
</p> </div> <div class="flex items-center gap-3 text-[12.5px] text-neutral-500 shrink-0"> ${renderTemplate`<span class="inline-flex items-center gap-2 bg-rouge/10 text-rouge px-3 py-1.5 rounded-full font-bold"> <span class="w-1.5 h-1.5 rounded-full bg-rouge"></span> ${"Supabase non configur\xE9"} </span>`} </div> </section> ${!activityStatus.available && activityStatus.reason === "missing" && renderTemplate`<section class="mb-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-start gap-3 md:gap-4" data-admin-banner="activity-missing"> <div class="shrink-0 w-9 h-9 rounded-full bg-orange-100 text-orange-700 text-[18px] flex items-center justify-center">⚠</div> <div class="flex-1 min-w-0"> <p class="font-bold text-[14px] text-orange-900">Table <code class="bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded">admin_activity</code> absente</p> <p class="text-[12.5px] text-orange-800 mt-1">
Le flux d'activité et les cartes « Activité 7j » resteront vides tant que la migration
<code class="bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded text-[12px]">supabase/migrations/002_admin_activity.sql</code>
n'est pas appliquée. Ouvrez Supabase Studio → SQL Editor → collez le fichier → Run.
</p> <div class="mt-3 flex flex-wrap items-center gap-2"> <button type="button" data-activity-copy class="inline-flex items-center gap-1.5 text-[12px] font-bold bg-orange-900 text-white hover:bg-orange-800 px-3 py-1.5 rounded-full transition"> <span data-activity-copy-label>Copier le chemin du fichier</span> </button> <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[12px] font-bold text-orange-900 hover:underline">
Ouvrir Supabase Studio ↗
</a> </div> </div> </section>`} ${!activityStatus.available && activityStatus.reason === "unknown" && renderTemplate`<section class="mb-6 bg-rouge/5 border border-rouge/20 rounded-2xl p-4 md:p-5" data-admin-banner="activity-error"> <p class="font-bold text-[13px] text-rouge">Audit trail indisponible</p> <p class="text-[12.5px] text-neutral-700 mt-1">
La table <code class="bg-rouge/10 px-1.5 py-0.5 rounded text-[12px]">admin_activity</code> existe mais n'a pas pu être lue
${activityStatus.detail ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` : <em>${activityStatus.detail}</em>` })}` : null}.
            Les écritures continuent de fonctionner, seule la traçabilité est masquée.
</p> </section>`} <!-- Stat cards --> <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"> ${renderComponent($$result2, "StatCard", $$StatCard, { "label": "Promos actives", "value": promosActives, "total": promosTotal, "delta": promosNew7d, "deltaSuffix": "nouvelles 7j", "href": "/admin/promos", "tone": "rouge", "icon": "\u{1F3F7}", "hint": promosTotal === 0 ? "Aucune promo en base" : void 0 })} ${renderComponent($$result2, "StatCard", $$StatCard, { "label": "Produits actifs", "value": produitsActifs, "total": produitsTotal, "delta": produitsNew7d, "deltaSuffix": "nouveaux 7j", "href": "/admin/catalogue", "tone": "vert", "icon": "\u{1F6D2}", "hint": produitsTotal === 0 ? "Aucun produit en base" : void 0 })} ${renderComponent($$result2, "StatCard", $$StatCard, { "label": "Sans image", "value": produitsSansImage, "total": produitsTotal, "href": "/admin/images-gap", "tone": "orange", "icon": "\u{1F5BC}", "hint": produitsTotal === 0 ? void 0 : `${produitsTotal > 0 ? Math.round(produitsSansImage / produitsTotal * 100) : 0} % du catalogue` })} ${renderComponent($$result2, "StatCard", $$StatCard, { "label": "Activit\xE9 7j", "value": activity7d, "delta": activity7d, "deltaSuffix": "actions", "tone": "noir", "icon": "\u{1F4DC}", "hint": activityRows.length === 0 ? "Migration 002 \xE0 appliquer" : "\xC9critures admin" })} </section> ${dailyBuckets && total14d > 0 && renderTemplate`<section class="mt-6 md:mt-8"> <div class="flex items-center justify-between mb-3"> <h2 class="eyebrow">Activité 14 jours</h2> <span class="text-[11.5px] text-neutral-500">
Source : audit trail · ${total14d} actions
</span> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-3"> <div class="bg-white rounded-3xl p-4 md:p-5 shadow-card flex items-center gap-4"> <div class="flex-1 min-w-0"> <p class="text-[]-neutral-600">Produits</p> <p class="font-soft font-bold text-[24px] leading-tight mt-1">${produits14d}</p> <p class="text-[11.5px] text-neutral-500">écritures sur 14 j</p> </div> <div class="text-vert-dark shrink-0"> ${renderComponent($$result2, "Sparkline", $$Sparkline, { "values": produitsDaily, "labels": sparkLabels, "ariaLabel": "Activit\xE9 produits 14 jours", "width": 120, "height": 36 })} </div> </div> <div class="bg-white rounded-3xl p-4 md:p-5 shadow-card flex items-center gap-4"> <div class="flex-1 min-w-0"> <p class="text-[]-neutral-600">Promos</p> <p class="font-soft font-bold text-[24px] leading-tight mt-1">${promos14d}</p> <p class="text-[11.5px] text-neutral-500">écritures sur 14 j</p> </div> <div class="text-rouge shrink-0"> ${renderComponent($$result2, "Sparkline", $$Sparkline, { "values": promosDaily, "labels": sparkLabels, "ariaLabel": "Activit\xE9 promos 14 jours", "width": 120, "height": 36 })} </div> </div> <div class="bg-white rounded-3xl p-4 md:p-5 shadow-card flex items-center gap-4"> <div class="flex-1 min-w-0"> <p class="text-[]-neutral-600">Toutes entités</p> <p class="font-soft font-bold text-[24px] leading-tight mt-1">${total14d}</p> <p class="text-[11.5px] text-neutral-500">écritures sur 14 j</p> </div> <div class="text-noir shrink-0"> ${renderComponent($$result2, "Sparkline", $$Sparkline, { "values": totalDaily, "labels": sparkLabels, "ariaLabel": "Activit\xE9 totale 14 jours", "width": 120, "height": 36 })} </div> </div> </div> </section>`} <!-- Quick actions strip --> <section class="mt-6 md:mt-8"> <div class="flex items-center justify-between mb-3"> <h2 class="eyebrow">Actions rapides</h2> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"> ${renderComponent($$result2, "QuickAction", $$QuickAction, { "href": "/admin/promos#new", "icon": "\u2795", "label": "Nouvelle promo", "sublabel": "Cr\xE9e + applique", "tone": "rouge" })} ${renderComponent($$result2, "QuickAction", $$QuickAction, { "href": "/admin/produits#new", "icon": "\u2795", "label": "Nouveau produit", "sublabel": "Catalogue Supabase", "tone": "vert" })} ${renderComponent($$result2, "QuickAction", $$QuickAction, { "href": "/admin/inventaire/inventaire", "icon": "\u{1F4E6}", "label": "Gestion Inventaire", "sublabel": "Scanner & Codes-barres", "tone": "vert" })} ${renderComponent($$result2, "QuickAction", $$QuickAction, { "href": "/admin/medias", "icon": "\u{1F4E4}", "label": "Uploader des images", "sublabel": "Drag & drop", "tone": "orange" })} ${renderComponent($$result2, "QuickAction", $$QuickAction, { "href": "/admin/generateur-affiche", "icon": "\u{1F5A8}", "label": "Cr\xE9er Affiches", "sublabel": "A4 & \xC9tiquettes", "tone": "vert" })} ${renderComponent($$result2, "QuickAction", $$QuickAction, { "href": "/admin/import-produits", "icon": "\u{1F4E5}", "label": "Importer CSV / JSON", "sublabel": "Mise \xE0 jour de masse", "tone": "noir" })} ${renderComponent($$result2, "QuickAction", $$QuickAction, { "href": "/admin/catalogue", "icon": "\u{1F333}", "label": "Naviguer le catalogue", "sublabel": "Par rayon \u2192 cat\xE9gorie", "tone": "vert" })} </div> </section> <!-- Two-column : recent activity + recent items --> <section class="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5"> <!-- Activity feed --> <div class="bg-white rounded-3xl p-5 md:p-6 shadow-card"> <div class="flex items-center justify-between mb-2"> <div> <h2 class="eyebrow">Activité récente</h2> <p class="text-[]-neutral-600 mt-0.5">
Toutes les écritures admin, ordre antéchronologique.
</p> </div> ${activityRows.length > 0 && renderTemplate`<span class="text-[]-neutral-600 tabular-nums">${activityRows.length} entrée(s)</span>`} </div> ${renderComponent($$result2, "ActivityFeed", $$ActivityFeed, { "rows": activityRows, "emptyHint": "Appliquez supabase/migrations/002_admin_activity.sql, puis effectuez une \xE9criture pour voir le flux." })} </div> <!-- Recent items column --> <div class="grid grid-cols-1 gap-5"> <!-- Recent promos --> <div class="bg-white rounded-3xl p-5 md:p-6 shadow-card"> <div class="flex items-center justify-between"> <h3 class="eyebrow">Promos modifiées</h3> <a href="/admin/promos" class="text-[11px] text-vert font-bold hover:underline">Gérer →</a> </div> ${recentPromos.length === 0 ? renderTemplate`<p class="mt-4 text-[]-neutral-600">Aucune promo en base.</p>` : renderTemplate`<ul class="mt-3 divide-y divide-black/5"> ${recentPromos.map((p) => renderTemplate`<li class="py-2.5 flex items-center justify-between gap-3 min-w-0"> <div class="min-w-0 flex-1"> <p class="font-bold text-[13px] truncate">${p.titre}</p> <p class="text-[]-neutral-600 truncate">
−${p.reduction_pct}% · ${p.magasin ?? "tous"} </p> </div> <span${addAttribute([
    "px-2 py-0.5 rounded-full text-[]-neutral-600"
  ], "class:list")}> ${p.actif ? "Actif" : "Inactif"} </span> </li>`)} </ul>`} </div> <!-- Recent produits --> <div class="bg-white rounded-3xl p-5 md:p-6 shadow-card"> <div class="flex items-center justify-between"> <h3 class="eyebrow">Produits modifiés</h3> <a href="/admin/produits" class="text-[11px] text-vert font-bold hover:underline">Gérer →</a> </div> ${recentProduits.length === 0 ? renderTemplate`<p class="mt-4 text-[]-neutral-600">Aucun produit modifié récemment.</p>` : renderTemplate`<ul class="mt-3 divide-y divide-black/5"> ${recentProduits.map((p) => renderTemplate`<li class="py-2.5 flex items-center justify-between gap-3 min-w-0"> <div class="min-w-0 flex-1"> <p class="font-bold text-[13px] truncate">${p.nom}</p> <p class="text-[]-neutral-600 truncate">${p.rayon}</p> </div> ${!p.image_url ? renderTemplate`<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 shrink-0">
Sans image
</span>` : !p.actif ? renderTemplate`<span class="px-2 py-0.5 rounded-full text-[]-neutral-600 shrink-0">
Inactif
</span>` : renderTemplate`<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-vert/10 text-vert-dark shrink-0">
OK
</span>`} </li>`)} </ul>`} </div> </div> </section> <!-- Workflow note --> <section class="mt-6 md:mt-8 bg-white rounded-3xl p-5 md:p-6 shadow-card"> <h2 class="eyebrow">Comment gérer le contenu</h2> <div class="mt-3 grid md:grid-cols-2 gap-5 text-[13px] text-neutral-700 leading-relaxed"> <div> <p class="font-bold text-noir mb-1.5">✓ Via l'admin (temps réel)</p> <ul class="space-y-1 text-[12.5px]"> <li>• <strong>Promos</strong> → <a href="/admin/promos" class="text-vert hover:underline">/admin/promos</a> — table Supabase, modifs instantanées.</li> <li>• <strong>Produits</strong> → <a href="/admin/catalogue" class="text-vert hover:underline">/admin/catalogue</a> — drill-down par rayon.</li> <li>• <strong>Images</strong> → <a href="/admin/medias" class="text-vert hover:underline">/admin/medias</a> — Supabase Storage.</li> </ul> </div> <div> <p class="font-bold text-noir mb-1.5">✎ Via Git (déploiement)</p> <ul class="space-y-1 text-[12.5px]"> <li>• <strong>Offres d'emploi</strong> (${activePostes}/${postes.length}) : <code class="bg-white px-1.5 py-0.5 rounded text-[12px]">src/content/postes/*.md</code></li> <li>• <strong>Vidéos TikTok</strong> : <code class="bg-white px-1.5 py-0.5 rounded text-[12px]">src/content/videos/*.json</code></li> <li>• <strong>Articles blog</strong> (${activeArticles}/${articles.length}) : <code class="bg-white px-1.5 py-0.5 rounded text-[12px]">src/content/articles/*.md</code></li> </ul> </div> </div> ${promosError} </section> </main> </div> ` })} `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
