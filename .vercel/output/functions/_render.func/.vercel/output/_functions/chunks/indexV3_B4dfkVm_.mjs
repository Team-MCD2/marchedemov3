import { d as createAstro, c as createComponent, r as renderTemplate, g as defineScriptVars, b as addAttribute, m as maybeRenderHead, e as renderComponent } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { o as organizationSchema, w as websiteSchema, a as allMagasinsSchema, c as offerSchema, $ as $$Layout } from './Layout_BrmqTQSx.mjs';
import { g as getActivePromos, $ as $$PromoCardV3 } from './PromoCardV3_CPSQHNVV.mjs';
import { $ as $$ProduitCardV3 } from './ProduitCardV3_DIRNWBv4.mjs';
import { $ as $$FAQAccordion } from './FAQAccordion_C1RYWw0L.mjs';
import { $ as $$NewsletterInline } from './NewsletterInline_BH8R9GYB.mjs';
import { g as getHomeEditorialSlides, a as getHomeSeoSettings, b as getActus, $ as $$FeedbackPopup, c as $$ActuCarousel, d as $$PromoHeroV3 } from './home-content_CEQfmucY.mjs';
import 'clsx';
import { g as getCollection } from './_astro_content_BJyRHHIi.mjs';
import { M as MAGASINS, a as RAYONS_LIST } from './site_dG8pplQb.mjs';
import { F as FAQ_HOME } from './faqs_BJZF7VHx.mjs';
import { a as getProduitsByRayon } from './produits-repo_6t_axRFn.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$LocalVideoPlayer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LocalVideoPlayer;
  const { src, title, href } = Astro2.props;
  const isMp4 = src && src.endsWith(".mp4");
  const uniqueId = `video-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="video-player-container relative aspect-[9/16] rounded-3xl overflow-hidden bg-noir ring-1 ring-white/10 w-full"', "> ", ' <button type="button" class="mute-btn absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-[12px] font-pro font-bold tracking-wide hover:bg-black/70 transition-colors"', '> <span class="btn-text">Son Off</span> </button> <div class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none"></div> <div class="absolute inset-x-0 bottom-0 p-4 text-white pointer-events-none"> <p class="font-soft font-bold text-[15px] leading-tight line-clamp-2">', '</p> </div> <!-- Fallback card if video fails --> <div class="fallback-card absolute inset-0 hidden flex flex-col items-center justify-center bg-noir text-white/90 p-6 text-center gap-3"> <p class="font-soft font-bold text-lg">', "</p> ", " </div> </div> <script>(function(){", '\n  const container = document.getElementById(uniqueId);\n  if (container) {\n    const video = container.querySelector(".video-el");\n    const muteBtn = container.querySelector(".mute-btn");\n    const btnText = container.querySelector(".btn-text");\n    const fallbackCard = container.querySelector(".fallback-card");\n\n    if (video) {\n      video.addEventListener("error", () => {\n        video.classList.add("hidden");\n        muteBtn.classList.add("hidden");\n        fallbackCard.classList.remove("hidden");\n      });\n\n      if (muteBtn && btnText) {\n        muteBtn.addEventListener("click", () => {\n          const isMuted = video.muted;\n          video.muted = !isMuted;\n          if (video.muted) {\n            btnText.textContent = "Son Off";\n          } else {\n            btnText.textContent = "Son On";\n            video.play().catch(() => {});\n          }\n        });\n      }\n    } else {\n      fallbackCard.classList.remove("hidden");\n    }\n  }\n})();<\/script>'])), maybeRenderHead(), addAttribute(uniqueId, "id"), src && renderTemplate`<video class="video-el absolute inset-0 w-full h-full object-cover" playsinline muted autoplay loop preload="metadata"> <source${addAttribute(src, "src")}${addAttribute(isMp4 ? "video/mp4" : void 0, "type")}> </video>`, addAttribute(`Muter/D\xE9muter : ${title}`, "aria-label"), title, title, href && renderTemplate`<a${addAttribute(href, "href")} target="_blank" rel="noopener noreferrer" class="text-white/60 text-xs underline">Voir la vidéo sur TikTok ↗</a>`, defineScriptVars({ uniqueId, href }));
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/LocalVideoPlayer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$IndexV3 = createComponent(async ($$result, $$props, $$slots) => {
  const allPromos = await getActivePromos();
  const featuredPromo = allPromos.find((p) => p.data.ticker_semaine) ?? allPromos.find((p) => p.data.mise_en_avant) ?? allPromos[0];
  const promosHome = allPromos.slice(0, 6);
  const promosHero = allPromos.filter((p) => p.data.mise_en_avant).slice(0, 4);
  const heroEditorialSlides = await getHomeEditorialSlides();
  const seoSettings = await getHomeSeoSettings();
  const actus = await getActus(12);
  const videos = (await getCollection("videos", (v) => v.data.actif && v.data.rayon === "home")).sort((a, b) => a.data.ordre - b.data.ordre);
  const maghrebProducts = (await getProduitsByRayon("saveur-mediterranee")).slice(0, 4);
  const asieProducts = (await getProduitsByRayon("saveurs-asie")).slice(0, 4);
  const creoleProducts = (await getProduitsByRayon("saveurs-afrique")).slice(0, 4);
  const indeProducts = (await getProduitsByRayon("epices-du-monde")).slice(0, 4);
  const allMediterranee = await getProduitsByRayon("saveur-mediterranee");
  const italieProducts = allMediterranee.filter((p) => p.origine === "Italie" || p.nom.toLowerCase().includes("italie") || p.nom.toLowerCase().includes("pesto") || p.nom.toLowerCase().includes("pasta")).slice(0, 4);
  if (italieProducts.length < 4) {
    const maghrebSlugs = new Set(maghrebProducts.map((p) => p.slug));
    const remainingMed = allMediterranee.filter((p) => !maghrebSlugs.has(p.slug));
    for (const p of remainingMed) {
      if (italieProducts.length >= 4) break;
      if (!italieProducts.find((ip) => ip.slug === p.slug)) {
        italieProducts.push(p);
      }
    }
  }
  const schemas = [
    organizationSchema(),
    websiteSchema(),
    ...allMagasinsSchema(),
    ...featuredPromo ? [offerSchema(featuredPromo.data)] : []
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": seoSettings.title, "description": seoSettings.description, "ogImage": seoSettings.ogImage, "faqItems": FAQ_HOME, "schema": schemas, "heroImage": "/promos/promo_rectangulaire.webp" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["", " ", `<section class="section bg-neutral-50 pb-8 border-b border-neutral-100"> <div class="container-mo"> <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5"> <!-- Banner 1: Boucherie Halal --> <a href="/rayons/boucherie-halal" class="group relative block aspect-[16/9] md:aspect-auto md:h-[240px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"> <img src="/images/rayons/boucherie-halal.jpg" alt="Boucherie Halal" class="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"> <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white"> <span class="text-[10px] font-black uppercase bg-vert px-2 py-0.5 rounded w-fit mb-1.5">Direct Boucher</span> <h3 class="font-soft font-bold text-[18px] leading-tight">BOUCHERIE HALAL</h3> <p class="text-[12px] text-white/80 leading-snug mt-1">S\xE9lection sur carcasse d'agneau et de b\u0153uf.</p> <span class="mt-3 text-[12px] font-bold text-vert-light group-hover:text-white transition-colors flex items-center gap-1">Voir la s\xE9lection <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"></path></svg></span> </div> </a> <!-- Banner 2: Fruits & L\xE9gumes --> <a href="/rayons/fruits-legumes" class="group relative block aspect-[16/9] md:aspect-auto md:h-[240px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"> <img src="/images/rayons/fruits-legumes.jpg" alt="Fruits & L\xE9gumes" class="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"> <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white"> <span class="text-[10px] font-black uppercase bg-vert px-2 py-0.5 rounded w-fit mb-1.5">Frais et Saisons</span> <h3 class="font-soft font-bold text-[18px] leading-tight">FRUITS &amp; L\xC9GUMES</h3> <p class="text-[12px] text-white/80 leading-snug mt-1">Arrivages r\xE9guliers et produits exotiques.</p> <span class="mt-3 text-[12px] font-bold text-vert-light group-hover:text-white transition-colors flex items-center gap-1">En profiter <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"></path></svg></span> </div> </a> <!-- Banner 3: \xC9picerie du Monde --> <a href="/promos" class="group relative block aspect-[16/9] md:aspect-auto md:h-[240px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"> <img src="/images/rayons/epices-du-monde.jpg" alt="\xC9pices & \xC9picerie du Monde" class="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"> <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white"> <span class="text-[10px] font-black uppercase bg-vert px-2 py-0.5 rounded w-fit mb-1.5">Bons Plans</span> <h3 class="font-soft font-bold text-[18px] leading-tight">\xC9PICERIE DU MONDE</h3> <p class="text-[12px] text-white/80 leading-snug mt-1">S\xE9lection d'\xE9pices, d'huiles et de douceurs orientales.</p> <span class="mt-3 text-[12px] font-bold text-vert-light group-hover:text-white transition-colors flex items-center gap-1">Voir les offres <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"></path></svg></span> </div> </a> </div> <!-- Long horizontal Trampoline Woodsun equivalent promo banner --> <a href="/promos" class="group relative block w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-vert/5 border border-vert/10"> <div class="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6"> <div class="flex items-center gap-5"> <!-- Promo Icon Badge --> <div class="w-16 h-16 rounded-full bg-rouge text-white flex flex-col items-center justify-center font-black select-none flex-shrink-0 border-2 border-white shadow"> <span class="text-[16px] leading-none">-40%</span> </div> <div> <span class="text-[11px] font-black text-rouge uppercase tracking-wider block mb-1">Immanquable de la semaine</span> <h3 class="font-soft font-bold text-[20px] md:text-[24px] text-neutral-900 leading-tight">Agneau entier cost-price A\xEFd el Kebir</h3> <p class="text-[13.5px] text-neutral-600 mt-1 max-w-xl">Disponible en commande exclusive pour vos f\xEAtes de famille, d\xE9coup\xE9 par nos artisans.</p> </div> </div> <div class="flex items-center gap-4 flex-shrink-0"> <div class="text-right select-none leading-none pr-4 border-r border-neutral-200"> <span class="text-[32px] font-black text-rouge align-middle">290</span> <sup class="text-[15px] font-bold text-rouge align-super ml-0.5">\u20AC,00</sup> <span class="text-[10px] text-neutral-400 block mt-1.5">L'unit\xE9 compl\xE8te</span> </div> <span class="btn btn-rouge font-bold text-[13.5px] px-6 py-2.5 rounded-full group-hover:bg-rouge-dark transition-all">
Commander
</span> </div> </div> </a> </div> </section> <section class="section bg-white border-b border-neutral-100 py-12"> <div class="container-mo"> <div class="mb-8 select-none"> <h2 class="font-soft font-black text-[22px] md:text-[26px] text-neutral-900 tracking-tight">
Acheter par rayon
</h2> </div> <!-- Circular visual buttons for Mo's 10 departments --> <div class="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4 md:gap-5 justify-items-center"> `, " </div> </div> </section> ", `<section class="section bg-white border-b border-neutral-100 py-12"> <div class="container-mo"> <div class="mb-8 select-none"> <h2 class="font-soft font-black text-[22px] md:text-[26px] text-neutral-900 tracking-tight">
Nos catalogues et \xE9v\xE9nements
</h2> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <!-- Flyer Card 1: Catalogues --> <a href="/promos" class="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-neutral-100 bg-neutral-50 h-[190px]"> <div class="flex h-full"> <div class="flex-1 p-5 flex flex-col justify-between"> <div> <span class="inline-block px-2 py-0.5 rounded bg-vert text-[9px] font-black text-white uppercase mb-2">PROMOS</span> <h3 class="font-soft font-bold text-[16px] text-neutral-800 leading-snug">Les catalogues du moment</h3> </div> <span class="text-[12px] font-bold text-vert flex items-center gap-1 group-hover:translate-x-1 transition-transform">Consulter <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"></path></svg></span> </div> <div class="w-1/3 relative bg-neutral-200"> <img src="/promos/promo_mobile_marchedemo.jpeg" alt="" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"> </div> </div> </a> <!-- Flyer Card 2: Games/Events --> <a href="/programme-fidelite" class="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-neutral-100 bg-neutral-50 h-[190px]"> <div class="flex h-full"> <div class="flex-1 p-5 flex flex-col justify-between"> <div> <span class="inline-block px-2 py-0.5 rounded bg-rouge text-[9px] font-black text-white uppercase mb-2">EVENTS</span> <h3 class="font-soft font-bold text-[16px] text-neutral-800 leading-snug">Les jeux et animations fid\xE9lit\xE9</h3> </div> <span class="text-[12px] font-bold text-vert flex items-center gap-1 group-hover:translate-x-1 transition-transform">Participer <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"></path></svg></span> </div> <div class="w-1/3 relative bg-rouge/10 flex items-center justify-center text-[48px] select-none">
\u{1F381}
</div> </div> </a> <!-- Flyer Card 3: Weekly Offers --> <a href="/promos" class="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-neutral-100 bg-neutral-50 h-[190px]"> <div class="flex h-full"> <div class="flex-1 p-5 flex flex-col justify-between"> <div> <span class="inline-block px-2 py-0.5 rounded bg-vert text-[9px] font-black text-white uppercase mb-2">OFFRES</span> <h3 class="font-soft font-bold text-[16px] text-neutral-800 leading-snug">Les offres de la semaine \xE0 ne pas manquer</h3> </div> <span class="text-[12px] font-bold text-vert flex items-center gap-1 group-hover:translate-x-1 transition-transform">Voir les remises <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"></path></svg></span> </div> <div class="w-1/3 relative bg-rouge/5 flex flex-col items-center justify-center p-3 select-none text-center"> <span class="text-[28px] font-black text-rouge">-25%</span> <span class="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Cagnott\xE9s</span> </div> </div> </a> </div> </div> </section> <div class="culture-divider" data-culture="maghreb"></div> <section class="section py-16" data-culture="maghreb"> <div class="container-mo relative z-10"> <div class="max-w-3xl mb-12 reveal"> <span class="eyebrow">Saveurs du Maghreb</span> <h2 class="display-lg mt-4 text-balance text-neutral-900" data-watermark="Maghreb">
M\xE9diterran\xE9e &amp; Orient.
</h2> <p class="mt-4 text-[16px] text-neutral-600 leading-relaxed max-w-2xl">
D\xE9couvrez notre s\xE9lection de couscous, d'olives, de dattes d'Alg\xE9rie et de condiments typiques pour voyager au gr\xE9 des saveurs m\xE9diterran\xE9ennes.
</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" data-reveal-stagger> `, ` </div> </div> </section> <div class="culture-divider" data-culture="asie"></div> <section class="section py-16" data-culture="asie"> <div class="container-mo relative z-10"> <div class="max-w-3xl mb-12 reveal"> <span class="eyebrow">Saveurs d'Asie</span> <h2 class="display-lg mt-4 text-balance text-neutral-900" data-watermark="Asie">
Japon, Cor\xE9e, Tha\xEFlande.
</h2> <p class="mt-4 text-[16px] text-neutral-600 leading-relaxed max-w-2xl">
Kimchi authentique, sauces soja, nouilles udon et produits indispensables import\xE9s en direct pour cuisiner toutes vos recettes asiatiques favorites.
</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" data-reveal-stagger> `, ` </div> </div> </section> <div class="culture-divider" data-culture="creole"></div> <section class="section py-16" data-culture="creole"> <div class="container-mo relative z-10"> <div class="max-w-3xl mb-12 reveal"> <span class="eyebrow">Saveurs d'Afrique &amp; Cr\xE9ole</span> <h2 class="display-lg mt-4 text-balance text-neutral-900" data-watermark="Cr\xE9ole">
Afrique de l'Ouest &amp; Antilles.
</h2> <p class="mt-4 text-[16px] text-neutral-600 leading-relaxed max-w-2xl">
Retrouvez le manioc, les bananes plantains, le fufu, le bissap et de nombreuses \xE9pices traditionnelles du continent africain et des \xEEles cr\xE9oles.
</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" data-reveal-stagger> `, ` </div> </div> </section> <div class="culture-divider" data-culture="inde"></div> <section class="section py-16" data-culture="inde"> <div class="container-mo relative z-10"> <div class="max-w-3xl mb-12 reveal"> <span class="eyebrow">Saveurs de l'Inde</span> <h2 class="display-lg mt-4 text-balance text-neutral-900" data-watermark="Inde">
L'atelier d'\xE9pices et de parfums.
</h2> <p class="mt-4 text-[16px] text-neutral-600 leading-relaxed max-w-2xl">
Curry de Madras, riz basmati parfum\xE9, cardamome et safrans de qualit\xE9 sup\xE9rieure pour illuminer vos currys et cr\xE9ations indiennes.
</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" data-reveal-stagger> `, ` </div> </div> </section> <div class="culture-divider" data-culture="italie"></div> <section class="section py-16" data-culture="italie"> <div class="container-mo relative z-10"> <div class="max-w-3xl mb-12 reveal"> <span class="eyebrow">Saveurs d'Italie</span> <h2 class="display-lg mt-4 text-balance text-neutral-900" data-watermark="Italie">
Le go\xFBt de la Dolce Vita.
</h2> <p class="mt-4 text-[16px] text-neutral-600 leading-relaxed max-w-2xl">
P\xE2tes italiennes traditionnelles, sauces pesto fra\xEEches, huile d'olive vierge extra de Sicile et ingr\xE9dients fins de la gastronomie italienne.
</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" data-reveal-stagger> `, ' </div> </div> </section> <div class="culture-divider" data-culture="italie"></div> <section class="section bg-white relative overflow-hidden"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Les actus du march\xE9</span> <h2 class="display-lg mt-4 text-balance">\nCe qui <span class="text-vert">bouge</span> en ce moment.\n</h2> <p class="mt-3 text-[15px] text-neutral-600">\nArrivages saisonniers, \xE9v\xE9nements en magasin, nouveaut\xE9s et inspirations de recettes.\n</p> </div> <a href="/actualites" class="btn btn-secondary shrink-0 btn-sheen font-bold">\nToutes les actus\n</a> </div> ', " </div> </section> ", '<section class="section bg-white border-t border-neutral-100"> <div class="container-mo"> <div class="text-center max-w-3xl mx-auto mb-14 reveal"> <span class="eyebrow !justify-center">Notre magasin</span> <h2 class="display-lg mt-4 text-balance">\nVotre supermarch\xE9 \xE0 Toulouse.<br> <span class="text-vert">Ouvert 7j/7, m\xEAme le dimanche matin.</span> </h2> </div> <div class="max-w-3xl mx-auto"> ', " </div> </div> </section> ", ` <section id="suggestions" class="section bg-white scroll-mt-24"> <div class="container-mo"> <div class="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-neutral-50 border border-black/5"> <!-- Decorative Mo' watermark --> <img src="/logos/favicon-marchedemo.png" alt="" aria-hidden="true" class="absolute -right-12 -bottom-12 w-64 opacity-[0.02] pointer-events-none"> <div class="relative z-10 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 items-start"> <div> <span class="eyebrow !text-vert">Votre avis compte</span> <h2 class="display-lg mt-4 text-balance">
Des conseils ?<br>Nous sommes \xE0 l'\xE9coute.
</h2> <p class="mt-4 text-[15px] leading-relaxed text-neutral-600">
Une remarque sur la propret\xE9, un produit introuvable ou une id\xE9e d'am\xE9lioration ? Partagez vos retours directement avec notre \xE9quipe pour nous aider \xE0 nous am\xE9liorer.
</p> </div> <form id="suggestion-form-el" class="space-y-4"> <!-- Honeypot anti-spam --> <input type="text" name="phone_confirm" class="hidden" tabindex="-1" autocomplete="off" style="display: none !important"> <div class="grid grid-cols-1 gap-4"> <div> <label class="sr-only" for="suggestion-email">Votre adresse email</label> <input id="suggestion-email" type="email" name="email" required placeholder="votre@email.com" class="w-full rounded-2xl px-5 py-3.5 font-pro text-[14.5px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-vert/30 transition bg-white text-noir"> </div> <div> <label class="sr-only" for="suggestion-message">Votre suggestion / message</label> <textarea id="suggestion-message" name="message" required rows="4" placeholder="Votre suggestion ou remarque..." class="w-full rounded-2xl px-5 py-3.5 font-pro text-[14.5px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-vert/30 transition bg-white text-noir resize-none"></textarea> </div> </div> <button type="submit" class="btn btn-primary w-full sm:w-auto font-bold justify-center gap-2">
Envoyer ma suggestion
<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"> <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </button> </form> </div> </div> </div> </section> <script>
    document.addEventListener("astro:page-load", () => {
      const form = document.getElementById("suggestion-form-el");
      if (!form) return;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const button = form.querySelector("button[type='submit']");
        if (button) button.disabled = true;

        try {
          const formData = new FormData(form);
          const email = formData.get("email");
          const message = formData.get("message");
          const phone_confirm = formData.get("phone_confirm");

          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prenom: "Visiteur",
              nom: "Anonyme",
              sujet: "Suggestion Page d'Accueil V3",
              email,
              message,
              phone_confirm
            }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.error || "Une erreur est survenue.");
          }

          if (window.showToast) {
            window.showToast("Merci pour votre suggestion ! Nous allons l'\xE9tudier attentivement.", "success");
          }
          form.reset();
        } catch (err) {
          if (window.showToast) {
            window.showToast(err.message, "error");
          }
        } finally {
          if (button) button.disabled = false;
        }
      });
    });
  <\/script> `, " ", " "])), renderComponent($$result2, "PromoHero", $$PromoHeroV3, { "promos": promosHero, "extraSlides": heroEditorialSlides, "autoAdvanceMs": 3200 }), featuredPromo && renderTemplate`${maybeRenderHead()}<section class="relative overflow-hidden bg-rouge text-white animate-fade-up"> <div class="container-mo py-4 md:py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] md:text-[14px] font-pro"> <span class="inline-flex items-center gap-2 font-bold"> <span class="badge-promo !bg-white !text-rouge !shadow-none !min-w-0 !h-auto !px-2 !py-0.5 !text-[12px]">
-${featuredPromo.data.reduction_pct}%
</span>
Offre de la semaine
</span> <span> <strong>${featuredPromo.data.titre}</strong> ·
${featuredPromo.data.prix_promo} € au lieu de ${featuredPromo.data.prix_original} €
</span> <a href="/promos" class="ml-auto font-bold underline underline-offset-4 hover:opacity-80 transition">
Voir toutes les promos →
</a> </div> </section>`, RAYONS_LIST.map((r) => {
    const rayonImg = `/images/rayons/${r.slug}.jpg`;
    return renderTemplate`<a${addAttribute(`/rayons/${r.slug}`, "href")} class="group flex flex-col items-center text-center w-full max-w-[100px]"> <!-- Circular masked image frame --> <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-50 shadow-sm border border-neutral-200/50 group-hover:border-vert/30 group-hover:shadow-md transition-all duration-300 relative flex items-center justify-center mb-2"> <img${addAttribute(rayonImg, "src")} alt="" class="w-[102%] h-[102%] object-cover group-hover:scale-105 transition-transform duration-500"> </div> <span class="text-[11.5px] font-bold text-neutral-700 leading-snug group-hover:text-vert transition-colors break-words"> ${r.nomCourt} </span> </a>`;
  }), promosHome.length > 0 && renderTemplate`<section class="section bg-neutral-50/50 border-b border-neutral-100"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow !text-rouge">Promos de la semaine</span> <h2 class="display-lg mt-4 text-balance">
Les <span class="text-rouge">vraies promos</span> de la semaine.
</h2> <p class="mt-3 text-[15px] text-neutral-600">
Mises à jour chaque semaine. Affichées à l'euro près dans notre magasin de Toulouse.
</p> </div> <a href="/promos" class="btn btn-rouge shrink-0 font-bold">
Toutes les promos
</a> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-stagger> ${promosHome.map((p) => renderTemplate`<div class="reveal"> ${renderComponent($$result2, "PromoCard", $$PromoCardV3, { "slug": p.slug, "titre": p.data.titre, "description": p.data.description, "image": p.data.image, "prix_original": p.data.prix_original, "prix_promo": p.data.prix_promo, "reduction_pct": p.data.reduction_pct, "rayon": p.data.rayon, "magasin": p.data.magasin, "date_fin": p.data.date_fin, "featured": p.data.mise_en_avant })} </div>`)} </div> </div> </section>`, maghrebProducts.map((p) => renderTemplate`<div class="reveal"> ${renderComponent($$result2, "ProduitCard", $$ProduitCardV3, { "produit": p })} </div>`), asieProducts.map((p) => renderTemplate`<div class="reveal"> ${renderComponent($$result2, "ProduitCard", $$ProduitCardV3, { "produit": p })} </div>`), creoleProducts.map((p) => renderTemplate`<div class="reveal"> ${renderComponent($$result2, "ProduitCard", $$ProduitCardV3, { "produit": p })} </div>`), indeProducts.map((p) => renderTemplate`<div class="reveal"> ${renderComponent($$result2, "ProduitCard", $$ProduitCardV3, { "produit": p })} </div>`), italieProducts.map((p) => renderTemplate`<div class="reveal"> ${renderComponent($$result2, "ProduitCard", $$ProduitCardV3, { "produit": p })} </div>`), renderComponent($$result2, "ActuCarousel", $$ActuCarousel, { "actus": actus }), videos.length > 0 && renderTemplate`<section class="section bg-blanc animate-fade-up"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Marché de Mo' en vidéos</span> <h2 class="display-lg mt-4 text-balance">
Rencontrez nos équipes et nos rayons.
</h2> </div> <a href="https://www.tiktok.com/@marchedemo" target="_blank" rel="noopener noreferrer" class="btn btn-secondary shrink-0 font-bold">
Nous suivre sur TikTok
</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-stagger> ${videos.slice(0, 3).map((v) => {
    return renderTemplate`${renderComponent($$result2, "LocalVideoPlayer", $$LocalVideoPlayer, { "src": v.data.src_local, "title": v.data.titre, "href": v.data.url_tiktok })}`;
  })} </div> </div> </section>`, Object.values(MAGASINS).map((m) => renderTemplate`<div class="group relative overflow-hidden rounded-3xl bg-noir text-white shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row"> <!-- Image Area --> <div class="md:w-1/2 relative overflow-hidden bg-neutral-900 aspect-video md:aspect-auto"> <img${addAttribute(m.photo || "/images/magasins/toulouse-sud.jpg", "src")}${addAttribute(`${m.nom} \u2014 ext\xE9rieur`, "alt")} loading="lazy" class="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-[1.03] transition-all duration-700"> <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/95 via-black/50 to-transparent"></div> </div> <!-- Content Area --> <div class="md:w-1/2 p-8 md:p-10 flex flex-col justify-between relative z-10 bg-noir"> <div> ${m.badge && renderTemplate`<span class="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-vert text-white text-[10px] font-black uppercase tracking-wider"> ${m.badge} </span>`} <h3 class="font-soft font-bold text-[24px] md:text-[28px] leading-tight !text-white"> ${m.nomCourt} </h3> <p class="mt-2 text-white/80 text-[13.5px]"> ${m.adresseLigne1}, ${m.codePostal} ${m.ville} </p> <div class="mt-6 space-y-2 text-[13px] text-white/70 font-medium"> <div class="flex items-center gap-2"> <svg class="w-4 h-4 text-vert animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> <span>Horaires : ${m.horaires.lundiJeudi} (Lun-Jeu)</span> </div> <div class="pl-6 text-[12.5px] text-white/50 space-y-0.5"> <div>Vendredi : ${m.horaires.vendredi}</div> <div>Samedi : ${m.horaires.samedi}</div> <div>Dimanche : ${m.horaires.dimanche}</div> </div> <div class="flex items-center gap-2 pt-2"> <svg class="w-4 h-4 text-vert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span>${m.surface} · ${m.parking}</span> </div> </div> </div> <div class="mt-8 flex flex-wrap gap-3"> <button id="mon-magasin-btn-home" class="btn btn-primary font-bold text-[13px] justify-center px-6 py-3" onclick="document.getElementById('mon-magasin-btn').click()">
Plan d'accès &amp; horaires
</button> <a${addAttribute(m.mapsLink, "href")} target="_blank" rel="noopener noreferrer" class="btn btn-ghost !text-white !border-white/20 hover:!border-white font-bold text-[13px] justify-center px-6 py-3">
Calculer l'itinéraire
</a> </div> </div> </div>`), renderComponent($$result2, "NewsletterInline", $$NewsletterInline, { "variant": "dark" }), renderComponent($$result2, "FAQAccordion", $$FAQAccordion, { "items": FAQ_HOME }), renderComponent($$result2, "FeedbackPopup", $$FeedbackPopup, {})) })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/indexV3.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/indexV3.astro";
const $$url = "/indexV3";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$IndexV3,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$IndexV3 as $, _page as _ };
