import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, e as renderComponent } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BrmqTQSx.mjs';
import { $ as $$AdminTopbar } from '../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import 'clsx';
import { R as RAYONS, S as SITE } from '../../chunks/site_dG8pplQb.mjs';
/* empty css                                      */
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
import { B as BANNERS } from '../../chunks/banners_NPz71Uf_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$BannerCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BannerCard;
  const { banner } = Astro2.props;
  const { slug, label, kind, image, tagline, palette, rayonScope, crossRefRayons } = banner;
  const primaryRayonHref = rayonScope[0] ? `/rayons/${rayonScope[0]}` : "/rayons";
  function rayonLabel(slugIn) {
    const r = RAYONS[slugIn];
    return r?.nomCourt ?? slugIn;
  }
  const kindStyles = kind === "culture" ? { bg: "bg-vert/10", text: "text-vert-dark", label: "Culture" } : { bg: "bg-rouge/10", text: "text-rouge", label: "Cat\xE9gorie" };
  return renderTemplate`${maybeRenderHead()}<article class="banner-card group block bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm"${addAttribute(slug, "data-culture")} data-astro-cid-7zfdlj5x> <a${addAttribute(primaryRayonHref, "href")} class="block"${addAttribute(`Voir cette banni\xE8re sur le site public \u2014 ${primaryRayonHref}`, "title")} data-astro-cid-7zfdlj5x> <div class="banner-card__thumb relative overflow-hidden aspect-[1/3.4]"${addAttribute(`background: linear-gradient(180deg, ${palette.from}, ${palette.to});`, "style")} data-astro-cid-7zfdlj5x> <img${addAttribute(image, "src")}${addAttribute(`Banni\xE8re ${label}`, "alt")} loading="lazy" decoding="async" class="absolute inset-0 w-full h-full object-cover" width="200" height="680" data-astro-cid-7zfdlj5x> </div> </a> <div class="p-4 md:p-5 flex flex-col gap-3" data-astro-cid-7zfdlj5x> <!-- Header : kind badge + label + tagline --> <div data-astro-cid-7zfdlj5x> <div class="flex items-center justify-between gap-2 mb-1" data-astro-cid-7zfdlj5x> <span${addAttribute([
    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
    kindStyles.bg,
    kindStyles.text
  ], "class:list")} data-astro-cid-7zfdlj5x> ${kindStyles.label} </span> <code class="text-[10.5px] text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded" data-astro-cid-7zfdlj5x> ${slug} </code> </div> <h3 class="font-soft font-bold text-[17px] text-noir leading-tight" data-astro-cid-7zfdlj5x>${label}</h3> <p class="mt-1 text-[12.5px] text-neutral-500 leading-snug" data-astro-cid-7zfdlj5x>${tagline}</p> </div> <!-- Palette swatches --> <div data-astro-cid-7zfdlj5x> <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5" data-astro-cid-7zfdlj5x>
Palette
</p> <div class="flex items-center gap-1.5" data-astro-cid-7zfdlj5x> <span class="w-7 h-7 rounded-full ring-1 ring-black/10"${addAttribute(`background: ${palette.from};`, "style")}${addAttribute(`from : ${palette.from}`, "title")}${addAttribute(`Jeton 'from' : ${palette.from}`, "aria-label")} data-astro-cid-7zfdlj5x></span> <span class="w-7 h-7 rounded-full ring-1 ring-black/10"${addAttribute(`background: ${palette.to};`, "style")}${addAttribute(`to : ${palette.to}`, "title")}${addAttribute(`Jeton 'to' : ${palette.to}`, "aria-label")} data-astro-cid-7zfdlj5x></span> <span class="w-7 h-7 rounded-full ring-1 ring-black/10"${addAttribute(`background: ${palette.accent};`, "style")}${addAttribute(`accent : ${palette.accent}`, "title")}${addAttribute(`Jeton 'accent' : ${palette.accent}`, "aria-label")} data-astro-cid-7zfdlj5x></span> <span${addAttribute([
    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ml-1",
    palette.text === "light" ? "bg-noir text-white border-black/20" : "bg-white text-noir border-black/20"
  ], "class:list")}${addAttribute(`Texte au-dessus du gradient : ${palette.text === "light" ? "blanc" : "noir"}`, "title")} data-astro-cid-7zfdlj5x> ${palette.text === "light" ? "Texte clair" : "Texte sombre"} </span> </div> </div> <!-- Scope --> <div data-astro-cid-7zfdlj5x> <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5" data-astro-cid-7zfdlj5x>
Affiché sur
</p> ${rayonScope.length > 0 ? renderTemplate`<div class="flex flex-wrap gap-1.5" data-astro-cid-7zfdlj5x> ${rayonScope.map((s) => renderTemplate`<a${addAttribute(`/rayons/${s}`, "href")} class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-vert/10 text-vert-dark text-[11px] font-bold hover:bg-vert/20 transition"${addAttribute(`Voir /rayons/${s}`, "title")} data-astro-cid-7zfdlj5x> ${rayonLabel(s)} </a>`)} </div>` : renderTemplate`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-bold italic" data-astro-cid-7zfdlj5x>
Transversal — /rayons
</span>`} </div> ${crossRefRayons && crossRefRayons.length > 0 && renderTemplate`<div data-astro-cid-7zfdlj5x> <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5" data-astro-cid-7zfdlj5x>
Référencé aussi sur
</p> <div class="flex flex-wrap gap-1.5" data-astro-cid-7zfdlj5x> ${crossRefRayons.map((s) => renderTemplate`<a${addAttribute(`/rayons/${s}`, "href")} class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium italic hover:bg-neutral-200 transition" data-astro-cid-7zfdlj5x> ${rayonLabel(s)} </a>`)} </div> </div>`} <!-- Asset path --> <details class="border-t border-black/5 pt-3 mt-1" data-astro-cid-7zfdlj5x> <summary class="cursor-pointer text-[11px] text-neutral-400 font-bold uppercase tracking-wider flex items-center justify-between" data-astro-cid-7zfdlj5x>
Détails techniques
<span class="text-vert" data-astro-cid-7zfdlj5x>▾</span> </summary> <dl class="mt-2 grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-[11.5px]" data-astro-cid-7zfdlj5x> <dt class="text-neutral-400" data-astro-cid-7zfdlj5x>Fichier</dt> <dd data-astro-cid-7zfdlj5x> <code class="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-[10.5px]" data-astro-cid-7zfdlj5x> ${image} </code> </dd> <dt class="text-neutral-400" data-astro-cid-7zfdlj5x>Data attr</dt> <dd data-astro-cid-7zfdlj5x> <code class="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-[10.5px]" data-astro-cid-7zfdlj5x>
data-culture="${slug}"
</code> </dd> </dl> </details> </div> </article> `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/BannerCard.astro", void 0);

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$Banners = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Banners;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  const cultures = BANNERS.filter((b) => b.kind === "culture");
  const categories = BANNERS.filter((b) => b.kind === "category");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Banni\xE8res (cultures & cat\xE9gories) \xB7 ${SITE.name} \u2014 Admin`, "description": "Galerie des banni\xE8res culturelles et cat\xE9gorielles utilis\xE9es sur le site public.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "banners" })} <main class="container-mo py-8 md:py-12"> <!-- Hero --> <section class="mb-10"> <span class="eyebrow">Bibliothèque visuelle</span> <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3"> <div class="max-w-2xl"> <h1 class="display-sm leading-tight">
Bannières culturelles & catégorielles
</h1> <p class="text-[13.5px] text-neutral-500 mt-3 leading-relaxed"> ${BANNERS.length} bannières au total · ${cultures.length} cultures
              (${cultures.map((c) => c.label).join(", ")}) ·
${categories.length} catégories (${categories.map((c) => c.label).join(", ")}).
              Chaque bannière expose une palette (4 jetons CSS) que le
              site public réutilise pour teinter les chips, les badges en
              ligne et les fonds de sous-sections.
</p> </div> <p class="text-[]-neutral-600 max-w-xs md:text-right leading-relaxed">
Stockage : <code class="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">src/lib/banners.ts</code>
+ fichiers dans <code class="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">public/images/banners/</code>.
            Édition via PR pour le moment ; passage en base prévu après
            validation du design (migration 007).
</p> </div> </section> <!-- Filter / anchor nav --> <nav class="flex items-center gap-2 mb-8 flex-wrap" aria-label="Filtrer par type"> <a href="#section-cultures" class="px-4 py-2 rounded-full bg-vert text-white text-[13px] font-bold shadow-sm hover:-translate-y-0.5 transition">
Cultures · ${cultures.length} </a> <a href="#section-categories" class="px-4 py-2 rounded-full bg-white border border-black/10 text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 hover:-translate-y-0.5 transition">
Catégories · ${categories.length} </a> </nav> ${cultures.length > 0 && renderTemplate`<section id="section-cultures" class="mb-12 scroll-mt-24"> <div class="flex flex-wrap items-center gap-3 mb-5"> <span class="text-[22px]" aria-hidden="true">🎭</span> <h2 class="font-soft font-bold text-[20px] text-noir">Cultures</h2> <span class="text-[]-neutral-600 font-pro"> ${cultures.length} bannières — chips affichés sur les rayons culturels parents
</span> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"> ${cultures.map((b) => renderTemplate`${renderComponent($$result2, "BannerCard", $$BannerCard, { "banner": b })}`)} </div> </section>`} ${categories.length > 0 && renderTemplate`<section id="section-categories" class="mb-12 scroll-mt-24"> <div class="flex flex-wrap items-center gap-3 mb-5"> <span class="text-[22px]" aria-hidden="true">🏷</span> <h2 class="font-soft font-bold text-[20px] text-noir">Catégories</h2> <span class="text-[]-neutral-600 font-pro"> ${categories.length} bannières — chips transverses ou attachées à un rayon
</span> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"> ${categories.map((b) => renderTemplate`${renderComponent($$result2, "BannerCard", $$BannerCard, { "banner": b })}`)} </div> </section>`} <!-- Phase 2 reminder --> <aside class="rounded-3xl border border-dashed border-vert/30 bg-vert/5 p-6 md:p-7 mt-8"> <div class="flex items-start gap-4"> <span class="shrink-0 w-10 h-10 rounded-full bg-vert/15 text-vert flex items-center justify-center text-[18px]" aria-hidden="true">
🔮
</span> <div> <p class="font-soft font-bold text-[15px] text-noir">
Édition en base de données — Phase 2
</p> <p class="text-[13px] text-neutral-600 mt-1.5 leading-relaxed max-w-3xl">
Pour l'instant les bannières sont en lecture seule (statique).
              Quand la direction artistique sera validée, on activera la
<strong>migration 007</strong>
(table <code class="bg-white px-1 rounded text-[11px]">public.banners</code>)
              et l'API CRUD associée, ce qui permettra à l'équipe de
              remplacer une bannière ou d'ajuster sa palette directement
              depuis cette page, sans déploiement.
</p> </div> </div> </aside> </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/banners.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/banners.astro";
const $$url = "/admin/banners";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Banners,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
