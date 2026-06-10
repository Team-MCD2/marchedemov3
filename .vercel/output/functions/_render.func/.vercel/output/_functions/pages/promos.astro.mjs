import { c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { b as breadcrumbSchema, $ as $$Layout } from '../chunks/Layout_D6bhTD9n.mjs';
import { $ as $$Breadcrumb } from '../chunks/Breadcrumb_EdwKG08k.mjs';
import { $ as $$PromoCard } from '../chunks/PromoCard_YssLCAMY.mjs';
import { $ as $$FAQAccordion } from '../chunks/FAQAccordion_C1RYWw0L.mjs';
import { $ as $$NewsletterInline } from '../chunks/NewsletterInline_BH8R9GYB.mjs';
import { a as RAYONS_LIST, S as SITE } from '../chunks/site_dG8pplQb.mjs';
import { F as FAQ_HOME } from '../chunks/faqs_BJZF7VHx.mjs';
import { g as getActivePromos } from '../chunks/PromoCardV3_D2-d6UsM.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Promos = createComponent(async ($$result, $$props, $$slots) => {
  const promos = (await getActivePromos()).sort(
    (a, b) => a.data.mise_en_avant === b.data.mise_en_avant ? 0 : a.data.mise_en_avant ? -1 : 1
  );
  const featured = promos.find((p) => p.data.mise_en_avant);
  const others = promos.filter((p) => p !== featured);
  const bc = breadcrumbSchema([{ name: "Promos de la semaine", url: "/promos" }]);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Promos de la semaine \u2014 jusqu'\xE0 -40% \xB7 ${SITE.name}`, "description": `${promos.length} offres actives cette semaine sur nos rayons boucherie halal, fruits & l\xE9gumes, \xE9picerie du monde. Dans notre magasin toulousain.`, "faqItems": FAQ_HOME, "schema": bc }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "items": [{ name: "Promos" }] })}  ${maybeRenderHead()}<section class="bg-rouge text-white pb-10 relative overflow-hidden"> <div class="container-mo py-12 relative z-10"> <span class="eyebrow !text-white/80">Promos de la semaine</span> <h1 class="display-xl mt-4 text-balance max-w-4xl !text-white" data-split-reveal> <span class="text-white/90">Jusqu'à</span> -40<span class="opacity-80">%</span> </h1> <p class="mt-6 max-w-xl text-[17px] text-white/85 leading-relaxed"> <strong>${promos.length} offres</strong> actives cette semaine, mises à jour
        chaque lundi. Valables dans notre magasin toulousain.
</p> </div> <!-- Watermark --> <div class="absolute -right-20 top-0 bottom-0 w-[560px] opacity-[0.08] pointer-events-none" aria-hidden="true"> <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><circle cx="7" cy="7" r="1"></circle><circle cx="17" cy="17" r="1"></circle><path d="m5 19 14-14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg> </div> </section>  ${featured && renderTemplate`<section class="section-sm bg-blanc"> <div class="container-mo"> <span class="eyebrow !text-rouge">Offre de la semaine</span> <h2 class="display-md mt-4 max-w-2xl text-balance">Le coup de cœur.</h2> <div class="mt-10 max-w-md"> ${renderComponent($$result2, "PromoCard", $$PromoCard, { "slug": featured.slug, "titre": featured.data.titre, "description": featured.data.description, "image": featured.data.image, "prix_original": featured.data.prix_original, "prix_promo": featured.data.prix_promo, "reduction_pct": featured.data.reduction_pct, "rayon": featured.data.rayon, "magasin": featured.data.magasin, "date_fin": featured.data.date_fin, "featured": true })} </div> </div> </section>`} <section class="section bg-white"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"> <div> <span class="eyebrow">Toutes les offres</span> <h2 class="display-md mt-4 text-balance">Les ${others.length} autres promos.</h2> </div> <!-- Filtres (client-side later) --> <div class="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par rayon"> <button class="pill pill-vert cursor-pointer" data-filter="all" aria-pressed="true">Tous</button> ${RAYONS_LIST.slice(0, 5).map((r) => renderTemplate`<button class="pill bg-white border border-black/10 cursor-pointer"${addAttribute(r.slug, "data-filter")}>${r.nomCourt}</button>`)} </div> </div> <div id="promos-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${others.map((p) => renderTemplate`<div${addAttribute(p.data.rayon, "data-rayon")}> ${renderComponent($$result2, "PromoCard", $$PromoCard, { "slug": p.slug, "titre": p.data.titre, "description": p.data.description, "image": p.data.image, "prix_original": p.data.prix_original, "prix_promo": p.data.prix_promo, "reduction_pct": p.data.reduction_pct, "rayon": p.data.rayon, "magasin": p.data.magasin, "date_fin": p.data.date_fin })} </div>`)} </div> </div> </section> ${renderComponent($$result2, "NewsletterInline", $$NewsletterInline, { "variant": "dark" })} ${renderComponent($$result2, "FAQAccordion", $$FAQAccordion, { "items": FAQ_HOME })} ` })} `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/promos.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/promos.astro";
const $$url = "/promos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Promos,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
