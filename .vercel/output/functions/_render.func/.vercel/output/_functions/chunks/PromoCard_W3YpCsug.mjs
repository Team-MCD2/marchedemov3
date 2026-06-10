import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, e as renderComponent } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';
import { R as RAYONS } from './site_dG8pplQb.mjs';
import { s as supabaseSrcSet } from './image-cdn_DFkHDQ0b.mjs';
import { $ as $$PromoCardV3 } from './PromoCardV3_CPSQHNVV.mjs';

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$PromoCardV2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PromoCardV2;
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
  function fmtPrice(v) {
    const n = typeof v === "number" ? v : parseFloat(v);
    if (!Number.isFinite(n)) return String(v);
    return n.toFixed(2).replace(".", ",");
  }
  const prixPromoStr = fmtPrice(prix_promo);
  const prixOriginalStr = fmtPrice(prix_original);
  const rayonData = RAYONS[rayon];
  const rayonNom = rayonData?.nomCourt ?? rayon;
  const rayonSlug = rayonData?.slug ?? rayon;
  const magasinLabel = "Toulouse Sud \u2014 C\xE9pi\xE8re";
  const fin = new Date(date_fin);
  const finStr = isNaN(fin.getTime()) ? date_fin : fin.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const { src: promoSrc, srcset: promoSrcset } = supabaseSrcSet(
    image,
    [600, 900, 1200],
    { quality: 75 }
  );
  const promoSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(`promo-card group ${featured ? "ring-2 ring-rouge/20" : ""}`, "class")}> <!-- Image --> <a${addAttribute(slug ? `/produits/${slug}` : `/rayons/${rayonSlug}`, "href")} class="relative block aspect-[4/3] overflow-hidden bg-white"> <img${addAttribute(promoSrc, "src")}${addAttribute(promoSrcset, "srcset")}${addAttribute(promoSizes, "sizes")}${addAttribute(titre, "alt")} loading="lazy" decoding="async" width="1200" height="900" class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"> <!-- Badge réduction : animation d'entrée "tampon" (scale + rotation). --> <div class="absolute top-4 left-4 badge-promo badge-stamp">
-${reduction_pct}%
</div> <!-- Pill rayon --> <div class="absolute bottom-4 left-4"> <span class="pill pill-vert bg-white/95">${rayonNom}</span> </div> </a> <!-- Infos --> <div class="p-5 md:p-6 flex-1 flex flex-col"> <h3 class="font-soft font-bold text-[18px] md:text-[20px] leading-snug text-noir text-balance"> ${titre} </h3> ${description && renderTemplate`<p class="text-[13.5px] text-neutral-500 mt-1.5 line-clamp-2">${description}</p>`} <div class="mt-4 flex items-end gap-2"> <span class="font-soft font-bold text-[28px] md:text-[32px] text-vert leading-none"> ${prixPromoStr} €
</span> <span class="text-[15px] text-neutral-500 line-through pb-1">${prixOriginalStr} €</span> </div> <div class="mt-4 pt-4 border-t border-black/5 flex items-center justify-between text-[12px] text-neutral-500"> <span class="inline-flex items-center gap-1.5"> <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z"></path> <circle cx="12" cy="10" r="3"></circle> </svg> ${magasinLabel} </span> <span class="inline-flex items-center gap-1.5"> <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline> </svg>
jusqu'au ${finStr} </span> </div> </div> </article>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/PromoCardV2.astro", void 0);

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$PromoCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PromoCard;
  const props = Astro2.props;
  return renderTemplate`${renderTemplate`${renderComponent($$result, "PromoCardV3", $$PromoCardV3, { ...props })}` }`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/PromoCard.astro", void 0);

export { $$PromoCard as $ };
