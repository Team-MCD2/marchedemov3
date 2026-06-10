import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';
import { R as RAYONS } from './site_dG8pplQb.mjs';
import { s as supabaseSrcSet } from './image-cdn_DFkHDQ0b.mjs';

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$ProduitCardV3 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProduitCardV3;
  const { produit, linkTo = "produit" } = Astro2.props;
  const rayonData = RAYONS[produit.rayon];
  const accent = rayonData?.accent ?? "#1C6B35";
  const productId = produit.id || produit.slug || "";
  const href = linkTo === "rayon" ? `/rayons/${produit.rayon}` : `/produits/${productId}`;
  const { src: produitSrc, srcset: produitSrcset } = supabaseSrcSet(
    produit.image,
    [400, 600],
    { quality: 72 }
  );
  const produitSizes = "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw";
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = productId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);
  const basePrice = seed % 18 + 1.49;
  const euros = Math.floor(basePrice);
  const centimes = seed % 2 === 0 ? "99" : "49";
  const mockPriceVal = parseFloat(`${euros}.${centimes}`);
  const unitPrice = `${(mockPriceVal / 0.5).toFixed(2)} \u20AC / kg`;
  const words = produit.nom.split(" ");
  const brand = words[0].length > 2 && words[0] === words[0].toUpperCase() ? words[0] : "MARCH\xC9 DE MO'";
  return renderTemplate`${maybeRenderHead()}<div class="produit-card group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-neutral-100 hover:border-vert/20 hover:shadow-lg transition-all duration-300 p-4"${addAttribute(produit.rayon.replace("saveurs-", "").replace("saveur-", ""), "data-culture")}> <!-- Card Header Link --> <a${addAttribute(href, "href")} class="block flex-1 flex flex-col"> <!-- Brand badge --> <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2"> ${brand} </span> <!-- Image wrapper --> <div class="relative aspect-square w-full overflow-hidden bg-white flex items-center justify-center mb-3"> ${produit.image ? renderTemplate`<img${addAttribute(produitSrc, "src")}${addAttribute(produitSrcset, "srcset")}${addAttribute(produitSizes, "sizes")}${addAttribute(produit.nom, "alt")} loading="lazy" decoding="async" width="400" height="400" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">` : renderTemplate`<div class="absolute inset-0 bg-neutral-50 flex flex-col items-center justify-center p-3 text-center rounded-xl border border-dashed border-neutral-200"> <img src="/logos/favicon-marchedemo.png" alt="" aria-hidden="true" width="40" height="40" class="w-10 h-10 opacity-15 mb-2"> <p class="font-bold text-[11px] leading-tight text-neutral-400 line-clamp-2"> ${produit.nom} </p> <span class="text-[9px] text-neutral-400 italic mt-1">Photo à venir</span> </div>`} <!-- Cultural icon/badge stamp --> ${produit.badge && renderTemplate`<span class="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full bg-white/95 text-[9.5px] font-bold tracking-wide uppercase shadow-sm border border-neutral-100"${addAttribute(`color: ${accent}`, "style")}> ${produit.badge} </span>`} </div> <!-- Product name --> <h3 class="font-bold text-[13.5px] leading-snug text-neutral-800 line-clamp-2 min-h-[2.8em] group-hover:text-vert transition-colors mb-1"> ${produit.nom} </h3> <!-- Department / Origin --> <div class="flex items-center justify-between text-[11px] text-neutral-500 mb-4 font-medium"> <span class="flex items-center gap-1"> <span class="w-1.5 h-1.5 rounded-full"${addAttribute(`background-color: ${accent}`, "style")}></span> ${rayonData?.nomCourt ?? produit.rayon} </span> ${produit.origine && renderTemplate`<span>${produit.origine}</span>`} </div> </a> <!-- Card Action Footer (Pricing + Adder) --> <div class="flex items-end justify-between border-t border-neutral-100/80 pt-3"> <!-- Pricing --> <div class="text-left leading-none"> <div class="text-neutral-900 font-black tracking-tight select-none"> <span class="text-[25px] align-middle">${euros}</span> <sup class="text-[13px] font-bold align-super ml-0.5">€,${centimes}</sup> </div> <span class="text-[9.5px] text-neutral-400 block mt-1">${unitPrice}</span> </div> <!-- Add Capsule Button --> <button class="bg-vert hover:bg-vert-dark text-white rounded-full flex items-center justify-center p-2.5 shadow hover:shadow-md transition-all active:scale-95 group/btn" aria-label="Ajouter au panier"${addAttribute(`background-color: ${accent}`, "style")}> <svg class="w-4 h-4 transition-transform group-hover/btn:rotate-90 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> </button> </div> </div>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/ProduitCardV3.astro", void 0);

export { $$ProduitCardV3 as $ };
