import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, e as renderComponent } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';
import { R as RAYONS } from './site_dG8pplQb.mjs';
import { s as supabaseSrcSet } from './image-cdn_DFkHDQ0b.mjs';
import { $ as $$ProduitCardV3 } from './ProduitCardV3_DIRNWBv4.mjs';

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$ProduitCardV2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProduitCardV2;
  const { produit, linkTo = "produit" } = Astro2.props;
  const rayonData = RAYONS[produit.rayon];
  const accent = rayonData?.accent ?? "#1C6B35";
  const productId = produit.id || produit.slug || "";
  const href = linkTo === "rayon" ? `/rayons/${produit.rayon}` : `/produits/${productId}`;
  const { src: produitSrc, srcset: produitSrcset } = supabaseSrcSet(
    produit.image,
    [400, 600, 800],
    { quality: 72 }
  );
  const produitSizes = "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} data-tilt data-tilt-max="3" class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"> <div class="relative aspect-square overflow-hidden bg-white"> ${produit.image ? renderTemplate`<img${addAttribute(produitSrc, "src")}${addAttribute(produitSrcset, "srcset")}${addAttribute(produitSizes, "sizes")}${addAttribute(produit.nom, "alt")} loading="lazy" decoding="async" width="600" height="600" class="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500">` : renderTemplate`<div class="absolute inset-0 bg-gradient-to-br from-white via-neutral-100 to-[#EEEAE0] flex flex-col items-center justify-center p-5 text-center"> <img src="/logos/favicon-marchedemo.png" alt="" aria-hidden="true" width="64" height="64" class="w-14 h-14 opacity-15 mb-3" loading="lazy"> <p class="font-soft font-bold text-[12px] md:text-[13px] leading-tight text-neutral-500 uppercase tracking-wider line-clamp-3"> ${produit.nom} </p> <span class="mt-2 text-[10px] text-neutral-500 italic">Photo à venir</span> </div>`} ${produit.badge && renderTemplate`<span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-pro font-bold tracking-wide uppercase shadow-sm"${addAttribute(`color: ${accent}`, "style")}> ${produit.badge} </span>`} </div> <div class="p-4 flex flex-col gap-2"> <h3 class="font-soft font-bold text-[15px] leading-tight text-noir text-balance line-clamp-2 min-h-[2.4em]"> ${produit.nom} </h3> <div class="flex items-center justify-between gap-2 text-[12px]"> <span class="inline-flex items-center gap-1.5 font-pro font-bold tracking-wide uppercase"${addAttribute(`color: ${accent}`, "style")}> <span class="w-1.5 h-1.5 rounded-full"${addAttribute(`background: ${accent}`, "style")}></span> ${rayonData?.nomCourt ?? produit.rayon} </span> ${produit.origine && renderTemplate`<span class="text-neutral-500 font-pro truncate">${produit.origine}</span>`} </div> </div> </a>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/ProduitCardV2.astro", void 0);

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$ProduitCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProduitCard;
  const props = Astro2.props;
  return renderTemplate`${renderTemplate`${renderComponent($$result, "ProduitCardV3", $$ProduitCardV3, { ...props })}` }`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/ProduitCard.astro", void 0);

export { $$ProduitCard as $ };
