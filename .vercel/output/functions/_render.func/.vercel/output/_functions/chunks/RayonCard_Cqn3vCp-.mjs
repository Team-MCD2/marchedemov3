import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, f as renderTransition, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$RayonCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$RayonCard;
  const { rayon, large = false } = Astro2.props;
  const accent = rayon.accent ?? "#1C6B35";
  const uniqueSlides = Array.from(new Set(rayon.heroSlideshow ?? []));
  const slideshowActive = uniqueSlides.length >= 2;
  const slideCount = Math.min(uniqueSlides.length, 4);
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/rayons/${rayon.slug}`, "href")} data-tilt data-tilt-max="4"${addAttribute(`group relative overflow-hidden rounded-3xl bg-white shadow-card hover:shadow-card-hover hover:scale-[1.03] hover:-translate-y-1.5 ${large ? "md:col-span-2 md:aspect-[8/5]" : "md:aspect-[4/5]"} aspect-[4/3]`, "class")} style="transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"> <div class="absolute inset-0 overflow-hidden"> ${slideshowActive ? renderTemplate`<div class="rayon-slideshow absolute inset-0 w-full h-full group-hover:scale-[1.05] transition-transform" style="transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);"${addAttribute(slideCount, "data-slides")}${addAttribute(renderTransition($$result, "43d5gtln", "", `rayon-card-${rayon.slug}`), "data-astro-transition-scope")}> ${uniqueSlides.slice(0, 4).map((src, i) => {
    const defer = i >= 2;
    return renderTemplate`<img${addAttribute(defer ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" : src, "src")}${addAttribute(defer ? src : void 0, "data-defer-src")}${addAttribute(i === 0 ? rayon.imageAlt : "", "alt")}${addAttribute(i > 0 ? "true" : void 0, "aria-hidden")} loading="lazy" decoding="async" width="1280" height="1600" class="rayon-slide">`;
  })} </div>` : renderTemplate`<img${addAttribute(rayon.image, "src")}${addAttribute(rayon.imageAlt, "alt")} loading="lazy" decoding="async" width="1280" height="1600" class="w-full h-full object-cover group-hover:scale-[1.07] transition-transform" style="transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);"${addAttribute(renderTransition($$result, "v3orluie", "", `rayon-card-${rayon.slug}`), "data-astro-transition-scope")}>`} <!-- Gradient overlay --> <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div> <!-- Content on image --> <div class="absolute inset-0 p-6 md:p-8 flex flex-col justify-between"> <div class="flex items-start justify-between gap-3"> <span class="pill text-white"${addAttribute(`background: ${accent}`, "style")}> ${rayon.eyebrow} </span> ${rayon.culturel && renderTemplate`<span class="pill pill-noir backdrop-blur bg-black/40 border border-white/20">
DA culturelle
</span>`} </div> <div> <h3 class="font-soft font-bold text-[28px] md:text-[32px] leading-none text-white drop-shadow-sm"> ${rayon.nom} </h3> <p class="mt-2 text-white/85 text-[14px] leading-snug max-w-[34ch]"> ${rayon.tagline} </p> <div class="mt-4 inline-flex items-center gap-2 text-white font-bold text-[13.5px] group-hover:translate-x-1.5 transition-transform" style="transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);">
Découvrir le rayon
<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"> <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </div> </div> </div> </div> </a>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/RayonCard.astro", "self");

export { $$RayonCard as $ };
