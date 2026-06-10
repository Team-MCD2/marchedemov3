import { d as createAstro, c as createComponent, m as maybeRenderHead, r as renderTemplate, b as addAttribute, e as renderComponent, F as Fragment } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BrmqTQSx.mjs';
import { $ as $$AdminTopbar } from '../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import 'clsx';
import { a as RAYONS_LIST, S as SITE } from '../../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
import '../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$EmptyState = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$EmptyState;
  const {
    title,
    description,
    icon = "",
    ctaLabel,
    ctaHref,
    secondaryLabel,
    secondaryHref,
    tone = "neutral"
  } = Astro2.props;
  const toneClass = {
    neutral: { fg: "text-neutral-700", sub: "text-neutral-500" },
    vert: { fg: "text-vert-dark", sub: "text-neutral-500" },
    rouge: { fg: "text-rouge", sub: "text-neutral-500" }
  }[tone];
  const accent = tone === "rouge" ? "#A8261B" : tone === "vert" ? "#1C6B35" : "#1C6B35";
  return renderTemplate`${maybeRenderHead()}<div class="text-center py-10 px-4"> ${icon ? renderTemplate`<p class="text-[36px] mb-2" aria-hidden="true">${icon}</p>` : renderTemplate`<svg width="96" height="96" viewBox="0 0 96 96" fill="none" class="mx-auto mb-3 opacity-90" aria-hidden="true"> <path d="M14 38 L82 38 L74 76 Q73 82 67 82 L29 82 Q23 82 22 76 Z" fill="white"${addAttribute(accent, "stroke")} stroke-width="2.4" stroke-linejoin="round"></path> <path d="M28 38 Q28 18 48 18 Q68 18 68 38" fill="none"${addAttribute(accent, "stroke")} stroke-width="2.4" stroke-linecap="round"></path> <path d="M30 42 L27 78 M40 42 L39 78 M48 42 L48 78 M56 42 L57 78 M66 42 L69 78"${addAttribute(accent, "stroke")} stroke-opacity="0.35" stroke-width="1.5" stroke-linecap="round"></path> <circle cx="40" cy="32" r="6.5"${addAttribute(accent, "fill")} fill-opacity="0.85"></circle> <circle cx="56" cy="30" r="5"${addAttribute(accent, "fill")} fill-opacity="0.55"></circle> <path d="M40 25.5 Q40 22 43 22" stroke="#A8261B" stroke-width="1.6" stroke-linecap="round" fill="none"></path> </svg>`} <p${addAttribute(["font-soft font-bold text-[16px]", toneClass.fg], "class:list")}>${title}</p> ${description && renderTemplate`<p${addAttribute(["mt-1.5 text-[13px] max-w-sm mx-auto", toneClass.sub], "class:list")}>${description}</p>`} ${ctaLabel && ctaHref || secondaryLabel && secondaryHref ? renderTemplate`<div class="mt-5 flex flex-wrap items-center justify-center gap-2"> ${ctaLabel && ctaHref && renderTemplate`<a${addAttribute(ctaHref, "href")} class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vert text-white text-[13px] font-bold hover:bg-vert-dark transition"> ${ctaLabel} </a>`} ${secondaryLabel && secondaryHref && renderTemplate`<a${addAttribute(secondaryHref, "href")} class="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black/10 hover:border-noir text-[13px] font-bold transition"> ${secondaryLabel} </a>`} </div>` : null} </div>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/EmptyState.astro", void 0);

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$ImagesGap = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ImagesGap;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  let allProduits = [];
  let errorMsg = null;
  {
    errorMsg = "SUPABASE_SERVICE_ROLE_KEY non configur\xE9e. Ajoutez-la dans .env.local (dev) ou dans Vercel Environment Variables (prod) puis red\xE9marrez.";
  }
  const total = allProduits.length;
  const withImage = allProduits.filter((p) => !!p.image_url).length;
  const withoutImage = total - withImage;
  const coveragePct = total === 0 ? 0 : Math.round(withImage / total * 100);
  const rayonMeta = /* @__PURE__ */ new Map();
  RAYONS_LIST.forEach((r) => rayonMeta.set(r.slug, { nom: r.nomCourt ?? r.nom, slug: r.slug }));
  const rayonMap = /* @__PURE__ */ new Map();
  for (const p of allProduits) {
    const meta = rayonMeta.get(p.rayon) ?? { nom: p.rayon, slug: p.rayon };
    if (!rayonMap.has(p.rayon)) {
      rayonMap.set(p.rayon, {
        slug: p.rayon,
        nom: meta.nom,
        total: 0,
        withImage: 0,
        withoutImage: 0,
        coveragePct: 0,
        missing: []
      });
    }
    const entry = rayonMap.get(p.rayon);
    entry.total += 1;
    if (p.image_url) entry.withImage += 1;
    else {
      entry.withoutImage += 1;
      entry.missing.push(p);
    }
  }
  for (const entry of rayonMap.values()) {
    entry.coveragePct = entry.total === 0 ? 0 : Math.round(entry.withImage / entry.total * 100);
  }
  const rayonBreakdowns = Array.from(rayonMap.values()).sort((a, b) => {
    if (b.withoutImage !== a.withoutImage) return b.withoutImage - a.withoutImage;
    return a.nom.localeCompare(b.nom, "fr");
  });
  const missingProduits = allProduits.filter((p) => !p.image_url).sort((a, b) => {
    const ra = rayonMeta.get(a.rayon)?.nom ?? a.rayon;
    const rb = rayonMeta.get(b.rayon)?.nom ?? b.rayon;
    const cmp = ra.localeCompare(rb, "fr");
    if (cmp !== 0) return cmp;
    return a.nom.localeCompare(b.nom, "fr");
  });
  function rayonLink(slug) {
    const params = new URLSearchParams({ rayon: slug, statut: "sans-image" });
    return `/admin/produits?${params.toString()}`;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Images manquantes \xB7 ${SITE.name} \u2014 Admin`, "description": "Dashboard de couverture des images produits.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "images-gap" })} <main class="container-mo py-8 md:py-12"> <!-- Hero --> <section class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"> <div> <span class="eyebrow">Couverture images</span> <h1 class="display-sm mt-3 leading-tight">
Images manquantes
</h1> <p class="mt-2 text-[14.5px] text-neutral-500 max-w-xl">
Triez les produits sans photo, puis comblez-les en masse via l'import DnD auto-match
            ou un par un depuis la fiche produit.
</p> </div> <div class="flex gap-2"> <a href="/admin/produits?statut=sans-image" class="px-4 py-2 rounded-full bg-noir text-white font-bold text-[13px] hover:bg-noir-soft transition">
Voir les ${withoutImage} produit(s) sans image →
</a> </div> </section> ${errorMsg ? renderTemplate`<div class="bg-rouge/5 border border-rouge/30 text-rouge rounded-3xl p-6 md:p-8"> <p class="font-bold text-[15px]">⚠ Supabase indisponible</p> <p class="text-[14px] mt-2 whitespace-pre-line">${errorMsg}</p> </div>` : total === 0 ? renderTemplate`<div class="bg-white rounded-3xl shadow-card overflow-hidden"> ${renderComponent($$result2, "EmptyState", $$EmptyState, { "title": "Catalogue vide", "description": "Aucun produit n'est encore enregistr\xE9 dans Supabase. Commencez par cr\xE9er ou importer le premier \u2014 la couverture d'images se mettra \xE0 jour automatiquement.", "ctaLabel": "Cr\xE9er un produit", "ctaHref": "/admin/produits#new", "secondaryLabel": "Importer JSON / CSV", "secondaryHref": "/admin/produits#import" })} </div>` : withoutImage === 0 ? renderTemplate`<div class="bg-white rounded-3xl shadow-card overflow-hidden"> ${renderComponent($$result2, "EmptyState", $$EmptyState, { "tone": "vert", "icon": "\u{1F389}", "title": "Toutes les images sont en place", "description": "Chaque produit actif du catalogue a une image. Bravo ! Cette page restera utile d\xE8s qu'un nouvel ajout sera fait.", "ctaLabel": "Voir le catalogue", "ctaHref": "/admin/catalogue" })} </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`  <section class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"> <div class="bg-white rounded-3xl p-6 shadow-card"> <p class="text-[]-neutral-600 font-bold">Couverture</p> <div class="flex items-baseline gap-2 mt-3"> <span class="font-soft font-bold text-[42px] leading-none text-vert">${coveragePct}</span> <span class="text-[20px] font-bold text-vert">%</span> </div> <div class="mt-3 h-1.5 bg-neutral-100 rounded-full overflow-hidden"> <div class="h-full bg-vert"${addAttribute(`width:${coveragePct}%`, "style")}></div> </div> </div> <div class="bg-white rounded-3xl p-6 shadow-card"> <p class="text-[]-neutral-600 font-bold">Avec image</p> <div class="flex items-baseline gap-2 mt-3"> <span class="font-soft font-bold text-[42px] leading-none text-noir">${withImage}</span> <span class="text-[13px] text-neutral-500">/ ${total}</span> </div> <p class="mt-3 text-[]-neutral-600">produits illustrés</p> </div> <div class="bg-white rounded-3xl p-6 shadow-card"> <p class="text-[]-neutral-600 font-bold">Sans image</p> <div class="flex items-baseline gap-2 mt-3"> <span${addAttribute(`font-soft font-bold text-[42px] leading-none ${withoutImage > 0 ? "text-rouge" : "text-neutral-300"}`, "class")}> ${withoutImage} </span> <span class="text-[13px] text-neutral-500">à combler</span> </div> <p class="mt-3 text-[]-neutral-600">manquent dans le catalogue vitrine</p> </div> <div class="bg-white rounded-3xl p-6 shadow-card"> <p class="text-[]-neutral-600 font-bold">Rayons concernés</p> <div class="flex items-baseline gap-2 mt-3"> <span class="font-soft font-bold text-[42px] leading-none text-noir"> ${rayonBreakdowns.filter((r) => r.withoutImage > 0).length} </span> <span class="text-[13px] text-neutral-500">/ ${rayonBreakdowns.length}</span> </div> <p class="mt-3 text-[]-neutral-600">ont au moins un manque</p> </div> </section>  <section class="mt-10 grid md:grid-cols-3 gap-4 md:gap-5"> <a href="/admin/produits?statut=sans-image" class="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"> <div class="w-10 h-10 rounded-full bg-noir text-white flex items-center justify-center mb-3"> <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </div> <h3 class="font-soft font-bold text-[17px]">Auto-match de masse</h3> <p class="mt-2 text-[13.5px] text-neutral-500 leading-relaxed">
Glissez-déposez N images, elles sont associées automatiquement aux produits par similarité
                nom de fichier ↔ nom/slug.
</p> <span class="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-vert group-hover:underline">
Ouvrir le catalogue →
</span> </a> <a href="/admin/medias?folder=produits" class="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"> <div class="w-10 h-10 rounded-full bg-vert text-white flex items-center justify-center mb-3"> <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect> <circle cx="8.5" cy="8.5" r="1.5"></circle> <path d="M21 15l-5-5L5 21" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </div> <h3 class="font-soft font-bold text-[17px]">Bibliothèque d'images</h3> <p class="mt-2 text-[13.5px] text-neutral-500 leading-relaxed">
Parcourir et uploader des images dans <code class="bg-white px-1 rounded text-[12px]">medias/produits/</code>.
                Copier l'URL publique pour la coller dans une fiche produit.
</p> <span class="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-vert group-hover:underline">
Ouvrir la bibliothèque →
</span> </a> <a href="/admin/produits" class="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"> <div class="w-10 h-10 rounded-full bg-rouge text-white flex items-center justify-center mb-3"> <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </div> <h3 class="font-soft font-bold text-[17px]">Import CSV / JSON</h3> <p class="mt-2 text-[13.5px] text-neutral-500 leading-relaxed">
Utile pour mettre à jour une grande série d'URLs <code class="bg-white px-1 rounded text-[12px]">image_url</code>
en une passe, en conservant slug, nom et rayon.
</p> <span class="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-vert group-hover:underline">
Ouvrir l'import →
</span> </a> </section>  <section class="mt-10"> <div class="flex items-end justify-between flex-wrap gap-2 mb-4"> <div> <span class="eyebrow">Par rayon</span> <h2 class="font-soft font-bold text-[22px] mt-2">Où sont les trous ?</h2> </div> <p class="text-[]-neutral-600">
Les rayons avec le plus de manques s'affichent en premier.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${rayonBreakdowns.map((r) => renderTemplate`<a${addAttribute(r.withoutImage > 0 ? rayonLink(r.slug) : `/admin/produits?rayon=${r.slug}`, "href")}${addAttribute(`bg-white rounded-2xl p-5 shadow-card transition-all hover:-translate-y-0.5 ${r.withoutImage > 0 ? "hover:shadow-card-hover" : "opacity-70"}`, "class")}> <div class="flex items-center justify-between gap-3"> <p class="font-bold text-[15px] text-noir truncate">${r.nom}</p> <span${addAttribute([
    "shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold",
    r.withoutImage === 0 ? "bg-vert/15 text-vert-dark" : r.coveragePct >= 80 ? "bg-yellow-100 text-yellow-800" : "bg-rouge/10 text-rouge"
  ], "class:list")}> ${r.withoutImage === 0 ? "Complet" : `${r.withoutImage} \xE0 combler`} </span> </div> <div class="mt-3 h-1.5 bg-neutral-100 rounded-full overflow-hidden"> <div${addAttribute([
    "h-full",
    r.coveragePct === 100 ? "bg-vert" : r.coveragePct >= 80 ? "bg-yellow-400" : "bg-rouge"
  ], "class:list")}${addAttribute(`width:${r.coveragePct}%`, "style")}></div> </div> <div class="mt-2 flex items-center justify-between text-[]-neutral-600"> <span>${r.withImage}/${r.total} illustrés</span> <span class="font-bold text-neutral-700">${r.coveragePct}%</span> </div> </a>`)} </div> </section>  ${missingProduits.length > 0 && renderTemplate`<section class="mt-10 bg-white rounded-3xl shadow-card overflow-hidden"> <header class="bg-white px-5 py-3 border-b border-black/5 flex items-center justify-between flex-wrap gap-2"> <h2 class="font-soft font-bold text-[16px]">
Liste complète · ${missingProduits.length} produit(s) sans image
</h2> <a href="/admin/produits?statut=sans-image" class="text-[12px] font-bold text-vert hover:underline">
Gérer dans l'admin produits →
</a> </header> <div class="max-h-[560px] overflow-y-auto"> <table class="w-full text-[13px]"> <thead class="bg-white sticky top-0 border-b border-black/5"> <tr class="text-left text-neutral-500"> <th class="px-4 py-2 font-bold">Produit</th> <th class="px-4 py-2 font-bold">Rayon</th> <th class="px-4 py-2 font-bold">Catégorie</th> <th class="px-4 py-2 font-bold">Origine</th> <th class="px-4 py-2 font-bold w-28 text-right">Actions</th> </tr> </thead> <tbody> ${missingProduits.map((p) => renderTemplate`<tr class="border-t border-black/5 hover:bg-white/50 transition"> <td class="px-4 py-2"> <div class="flex items-center gap-3"> <div class="w-10 h-10 rounded-lg bg-white border border-dashed border-black/20 flex items-center justify-center text-neutral-300 shrink-0">
—
</div> <div class="min-w-0"> <p${addAttribute(`font-bold text-noir truncate ${p.actif ? "" : "text-neutral-500 line-through"}`, "class")}> ${p.nom} </p> <p class="text-[]-neutral-600 truncate">${p.slug}</p> </div> </div> </td> <td class="px-4 py-2 text-neutral-600"> ${rayonMeta.get(p.rayon)?.nom ?? p.rayon} </td> <td class="px-4 py-2 text-neutral-600"> ${p.categorie ?? "\u2014"} ${p.sous_categorie && renderTemplate`<span class="text-neutral-500"> / ${p.sous_categorie}</span>`} </td> <td class="px-4 py-2 text-neutral-600">${p.origine ?? "\u2014"}</td> <td class="px-4 py-2 text-right"> <a${addAttribute(`/admin/produits?q=${encodeURIComponent(p.slug)}`, "href")} class="inline-block px-3 py-1 rounded-full bg-noir text-white text-[11px] font-bold hover:bg-noir-soft transition">
Éditer
</a> </td> </tr>`)} </tbody> </table> </div> </section>`}` })}`} </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/images-gap.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/images-gap.astro";
const $$url = "/admin/images-gap";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImagesGap,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
