import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_D6bhTD9n.mjs';
import { $ as $$AdminTopbar } from '../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import { P as ProduitsManager } from '../../chunks/ProduitsManager_QbemsIGH.mjs';
import { a as RAYONS_LIST, S as SITE } from '../../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
import '../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$Produits = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Produits;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  let initialProduits = [];
  let errorMsg = null;
  {
    errorMsg = "SUPABASE_SERVICE_ROLE_KEY non configur\xE9e. Ajoutez-la dans .env.local (dev) ou dans Vercel Environment Variables (prod) puis red\xE9marrez.";
  }
  const rayonsOptions = RAYONS_LIST.map((r) => ({
    slug: r.slug,
    nom: r.nomCourt ?? r.nom
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Catalogue produits \xB7 ${SITE.name} \u2014 Admin`, "description": "Administration du catalogue de produits.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "produits" })} <main class="container-mo py-8 md:py-12"> <section class="mb-8"> <span class="eyebrow">Catalogue</span> <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3"> <h1 class="display-sm leading-tight">
Produits & catalogue
</h1> <p class="text-[13px] text-neutral-500 max-w-md md:text-right">
Catalogue vitrine (pas de prix de vente public). Stocké dans
<code class="bg-white px-1.5 py-0.5 rounded text-[12px]">public.produits</code>.
</p> </div> </section> ${errorMsg ? renderTemplate`<div class="bg-rouge/5 border border-rouge/30 text-rouge rounded-3xl p-6 md:p-8"> <p class="font-bold text-[15px]">⚠ Supabase indisponible</p> <p class="text-[14px] mt-2 whitespace-pre-line">${errorMsg}</p> </div>` : renderTemplate`${renderComponent($$result2, "ProduitsManager", ProduitsManager, { "client:load": true, "initialProduits": initialProduits, "rayonsOptions": rayonsOptions, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/ProduitsManager.jsx", "client:component-export": "default" })}`} </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/produits.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/produits.astro";
const $$url = "/admin/produits";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Produits,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
