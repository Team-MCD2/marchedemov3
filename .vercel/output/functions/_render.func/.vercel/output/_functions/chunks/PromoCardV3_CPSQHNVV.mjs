import { g as getCollection } from './_astro_content_BJyRHHIi.mjs';
import './supabase_DGRgIA0P.mjs';
import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';
import { R as RAYONS } from './site_dG8pplQb.mjs';
import { s as supabaseSrcSet } from './image-cdn_DFkHDQ0b.mjs';

async function fromContentCollection() {
  const items = await getCollection("promos");
  return items.filter((p) => p.data.actif).map((p) => ({
    id: String(p.id),
    slug: String(p.id),
    /* Content Collection uses id as slug */
    collection: "promos",
    data: {
      id: p.data.id,
      titre: p.data.titre,
      description: p.data.description ?? "",
      image: p.data.image,
      prix_original: Number(p.data.prix_original),
      prix_promo: Number(p.data.prix_promo),
      reduction_pct: Number(p.data.reduction_pct),
      rayon: p.data.rayon,
      magasin: p.data.magasin,
      date_debut: p.data.date_debut,
      date_fin: p.data.date_fin,
      mise_en_avant: !!p.data.mise_en_avant,
      /* Content Collection items never carry the ticker flag — only
       * Supabase rows can occupy the homepage urgent banner. */
      ticker_semaine: false,
      actif: !!p.data.actif,
      ordre: 0
      /* Content Collection doesn't have ordre — default 0 */
    }
  }));
}
async function getActivePromos() {
  return fromContentCollection();
}
async function getPromosForRayon(slug) {
  const all = await getActivePromos();
  return all.filter((p) => p.data.rayon === slug);
}

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$PromoCardV3 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PromoCardV3;
  const {
    slug,
    titre,
    description = "",
    image,
    prix_original,
    prix_promo,
    reduction_pct,
    rayon,
    magasin,
    date_fin,
    featured = false
  } = Astro2.props;
  const pPromo = typeof prix_promo === "number" ? prix_promo : parseFloat(prix_promo);
  const pOriginal = typeof prix_original === "number" ? prix_original : parseFloat(prix_original);
  const promoEuros = Math.floor(pPromo);
  const promoCentimes = Math.round((pPromo - promoEuros) * 100).toString().padStart(2, "0");
  const origEuros = Math.floor(pOriginal);
  const origCentimes = Math.round((pOriginal - origEuros) * 100).toString().padStart(2, "0");
  const rayonData = RAYONS[rayon];
  const rayonNom = rayonData?.nomCourt ?? rayon;
  const rayonSlug = rayonData?.slug ?? rayon;
  rayonData?.accent ?? "#1C6B35";
  const href = slug ? `/produits/${slug}` : `/rayons/${rayonSlug}`;
  const { src: promoSrc, srcset: promoSrcset } = supabaseSrcSet(
    image,
    [600, 900],
    { quality: 75 }
  );
  const promoSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  const mockWeight = 0.5;
  const unitPrice = `${(pPromo / mockWeight).toFixed(2)} \u20AC / kg`;
  const words = titre.split(" ");
  const brand = words[0].length > 2 && words[0] === words[0].toUpperCase() ? words[0] : "MARCH\xC9 DE MO'";
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(`promo-card group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-neutral-100 hover:border-rouge/20 hover:shadow-lg transition-all duration-300 p-4 ${featured ? "ring-2 ring-rouge/15 bg-rouge/[0.01]" : ""}`, "class")}${addAttribute(rayon.replace("saveurs-", "").replace("saveur-", ""), "data-culture")}> <!-- Card Link Wrap --> <a${addAttribute(href, "href")} class="block flex-1 flex flex-col"> <!-- Brand --> <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2"> ${brand} </span> <!-- Image + Circular Discount Stamp --> <div class="relative aspect-[4/3] w-full overflow-hidden bg-white rounded-xl mb-4"> <img${addAttribute(promoSrc, "src")}${addAttribute(promoSrcset, "srcset")}${addAttribute(promoSizes, "sizes")}${addAttribute(titre, "alt")} loading="lazy" decoding="async" width="600" height="450" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"> <!-- Circular Promo Sticker in Rouge MDM --> <div class="absolute top-3 left-3 w-12 h-12 rounded-full bg-rouge text-white flex flex-col items-center justify-center shadow-lg border border-white/20 select-none animate-pulse-glow"> <span class="text-[14px] font-black leading-none">-${reduction_pct}%</span> </div> <!-- Rayon tag --> <span class="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-white/95 text-[10px] font-bold text-neutral-800 shadow-sm"> ${rayonNom} </span> </div> <!-- Product Title --> <h3 class="font-bold text-[15.5px] leading-snug text-neutral-900 line-clamp-2 min-h-[2.8em] group-hover:text-rouge transition-colors mb-1.5"> ${titre} </h3> ${description && renderTemplate`<p class="text-[12.5px] text-neutral-500 line-clamp-2 leading-relaxed mb-4">${description}</p>`} </a> <!-- Action Pricing Footer --> <div class="flex items-end justify-between border-t border-neutral-100 pt-3.5 mt-auto"> <!-- Pricing details --> <div class="flex flex-col"> <!-- Promo and original prices side-by-side --> <div class="flex items-baseline gap-2"> <div class="text-rouge font-black tracking-tight leading-none select-none"> <span class="text-[27px]">${promoEuros}</span> <sup class="text-[14px] font-bold align-super ml-0.5">€,${promoCentimes}</sup> </div> <span class="text-[13px] text-neutral-400 line-through leading-none font-medium"> ${origEuros}€,${origCentimes} </span> </div> <span class="text-[9.5px] text-neutral-400 block mt-1.5">${unitPrice}</span> </div> <!-- Capsule Button --> <button class="bg-rouge hover:bg-rouge-dark text-white rounded-full flex items-center justify-center p-2.5 shadow hover:shadow-md transition-all active:scale-95 group/btn" aria-label="Ajouter la promotion au panier"> <svg class="w-4 h-4 transition-transform group-hover/btn:rotate-90 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> </button> </div> </article>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/PromoCardV3.astro", void 0);

export { $$PromoCardV3 as $, getPromosForRayon as a, getActivePromos as g };
