import { d as createAstro, c as createComponent, m as maybeRenderHead, e as renderComponent, r as renderTemplate, b as addAttribute, F as Fragment } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { o as organizationSchema, w as websiteSchema, a as allMagasinsSchema, c as offerSchema, $ as $$Layout } from './Layout_BrmqTQSx.mjs';
import { $ as $$RayonCard } from './RayonCard_Cqn3vCp-.mjs';
import { $ as $$ProduitCard } from './ProduitCard_CZf1dU_T.mjs';
import { $ as $$RecetteCard } from './RecetteCard_DgLDFByk.mjs';
import { $ as $$Stats } from './Stats_CeVfZCmO.mjs';
import { $ as $$FAQAccordion } from './FAQAccordion_C1RYWw0L.mjs';
import { $ as $$NewsletterInline } from './NewsletterInline_BH8R9GYB.mjs';
import { d as $$PromoHeroV3, g as getHomeEditorialSlides, e as getHomeMarqueeItems, a as getHomeSeoSettings, b as getActus, $ as $$FeedbackPopup, c as $$ActuCarousel } from './home-content_CEQfmucY.mjs';
import { L as LocalVideoPlayer } from './LocalVideoPlayer_DdeAx5vq.mjs';
import { $ as $$PromoCard } from './PromoCard_W3YpCsug.mjs';
/* empty css                           */
import { s as supabaseSrcSet } from './image-cdn_DFkHDQ0b.mjs';
import 'clsx';
import { g as getCollection } from './_astro_content_BJyRHHIi.mjs';
import { M as MAGASINS, E as ENGAGEMENTS, a as RAYONS_LIST } from './site_dG8pplQb.mjs';
import { b as getRecettesVedettes } from './recettes_-ecohakO.mjs';
import { F as FAQ_HOME } from './faqs_BJZF7VHx.mjs';
import { g as getActivePromos } from './PromoCardV3_CPSQHNVV.mjs';
import { b as getProduitsVedettes } from './produits-repo_6t_axRFn.mjs';

const $$Astro$3 = createAstro("https://marchedemov2.vercel.app");
const $$PromoCarousel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$PromoCarousel;
  const { promos } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="promo-carousel relative -mx-5 md:-mx-8 lg:mx-0" data-astro-cid-smibyvby>   <button type="button" class="promo-nav promo-nav-prev" aria-label="Promo précédente" data-promo-prev data-astro-cid-smibyvby> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-smibyvby> <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-smibyvby></path> </svg> </button>  <div class="promo-track flex gap-5 md:gap-6 px-5 md:px-8 lg:px-2" data-promo-track tabindex="0" role="region" aria-label="Carrousel des promos" aria-roledescription="carrousel" data-astro-cid-smibyvby>  ${promos.map((p) => renderTemplate`<div class="promo-card-slot shrink-0" role="group" aria-roledescription="diapositive" data-astro-cid-smibyvby> ${renderComponent($$result, "PromoCard", $$PromoCard, { "slug": p.slug, "titre": p.data.titre, "description": p.data.description, "image": p.data.image, "prix_original": p.data.prix_original, "prix_promo": p.data.prix_promo, "reduction_pct": p.data.reduction_pct, "rayon": p.data.rayon, "magasin": p.data.magasin, "date_fin": p.data.date_fin, "featured": p.data.mise_en_avant, "data-astro-cid-smibyvby": true })} </div>`)}  ${promos.map((p) => renderTemplate`<div class="promo-card-slot shrink-0" aria-hidden="true" inert data-astro-cid-smibyvby> ${renderComponent($$result, "PromoCard", $$PromoCard, { "slug": p.slug, "titre": p.data.titre, "description": p.data.description, "image": p.data.image, "prix_original": p.data.prix_original, "prix_promo": p.data.prix_promo, "reduction_pct": p.data.reduction_pct, "rayon": p.data.rayon, "magasin": p.data.magasin, "date_fin": p.data.date_fin, "featured": p.data.mise_en_avant, "data-astro-cid-smibyvby": true })} </div>`)} </div>  <button type="button" class="promo-nav promo-nav-next" aria-label="Promo suivante" data-promo-next data-astro-cid-smibyvby> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-smibyvby> <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-smibyvby></path> </svg> </button> <div class="hidden md:flex items-center justify-end gap-2 mt-4 text-[]-neutral-600 font-pro" data-astro-cid-smibyvby> <span class="inline-flex items-center gap-1.5" data-astro-cid-smibyvby>
Glissez · flèches · défilement auto
</span> </div> </div>  `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/PromoCarousel.astro", void 0);

const $$Astro$2 = createAstro("https://marchedemov2.vercel.app");
const $$PromoHeroV2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PromoHeroV2;
  const magasinLabel = (m) => m === "tous" || m === "toulouse-sud" ? "Toulouse Sud \u2014 C\xE9pi\xE8re" : m;
  const { promos = [], extraSlides = [], autoAdvanceMs = 2800 } = Astro2.props;
  const agneauBannerSlide = {
    kind: "banner",
    titre: "Promo Agneau A\xEFd el Kebir",
    description: "",
    eyebrow: "",
    image: "/promos/promo_rectangulaire.webp",
    imageMobile: "/promos/promo_mobile_marchedemo.jpeg",
    imageAlt: "Promo agneau A\xEFd \u2014 290\u20AC prix co\xFBtant, March\xE9 de Mo'",
    ctaLabel: "",
    ctaHref: "/promos",
    accent: "#1C6B35",
    prixPromo: null,
    prixOriginal: null,
    reductionPct: null,
    videoUrl: null
  };
  const promoSlides = promos.slice(0, 5).map((p) => ({
    kind: "promo",
    titre: p.data.titre,
    description: p.data.description || `${p.data.prix_promo}\u20AC au lieu de ${p.data.prix_original}\u20AC`,
    eyebrow: `Promo \xB7 ${magasinLabel(p.data.magasin)}`,
    image: p.data.image,
    imageMobile: null,
    imageAlt: p.data.titre,
    ctaLabel: "Voir la promo \u2192",
    ctaHref: "/promos",
    accent: "#C53030",
    prixPromo: p.data.prix_promo,
    prixOriginal: p.data.prix_original,
    reductionPct: p.data.reduction_pct,
    videoUrl: null
  }));
  const editorialSlides = extraSlides.map((s) => ({
    kind: s.videoUrl ? "video" : "editorial",
    titre: s.titre,
    description: s.description,
    eyebrow: s.eyebrow,
    image: s.image,
    imageMobile: null,
    imageAlt: s.imageAlt ?? s.titre,
    ctaLabel: s.ctaLabel,
    ctaHref: s.ctaHref,
    accent: s.accent ?? "#1C6B35",
    prixPromo: null,
    prixOriginal: null,
    reductionPct: null,
    videoUrl: s.videoUrl || null
  }));
  const hasDynamicVideo = editorialSlides.some((s) => s.kind === "video");
  const initialSlides = [agneauBannerSlide, ...promoSlides, ...editorialSlides];
  const videoSlide = {
    kind: "video",
    titre: "Votre supermarch\xE9 du monde \xE0 Toulouse",
    description: "Boucherie halal sur carcasse, fruits & l\xE9gumes exotiques, \xE9pices du monde. Ouvert 7j/7.",
    eyebrow: "Vid\xE9o \xB7 March\xE9 de Mo'",
    image: "/images/home/hero.jpg",
    imageMobile: null,
    imageAlt: "Vid\xE9o March\xE9 de Mo'",
    ctaLabel: "Voir nos rayons",
    ctaHref: "/rayons",
    accent: "#1C6B35",
    prixPromo: null,
    prixOriginal: null,
    reductionPct: null,
    videoUrl: "/videos/marchedemo-promo.mp4"
  };
  if (!hasDynamicVideo) {
    if (initialSlides.length > 0) {
      initialSlides.splice(1, 0, videoSlide);
    } else {
      initialSlides.push(videoSlide);
    }
  }
  const baseSlides = initialSlides;
  const slideCount = baseSlides.length;
  const loopSlides = slideCount > 1 ? [baseSlides[slideCount - 1], ...baseSlides, baseSlides[0]] : baseSlides;
  const hasSlides = slideCount > 0;
  const heroWidths = [800, 1200, 1600, 2400];
  const heroSizes = "62vw";
  const heroSources = loopSlides.map(
    (s) => s.kind === "banner" || s.image.startsWith("/promos/") ? { src: s.image, srcset: "" } : supabaseSrcSet(s.image, heroWidths, { quality: 78 })
  );
  return renderTemplate`${hasSlides && renderTemplate`${maybeRenderHead()}<section class="promo-hero"${addAttribute(autoAdvanceMs, "data-auto-ms")}${addAttribute(slideCount, "data-slide-count")}${addAttribute(slideCount > 1 ? "true" : void 0, "data-loop")} aria-roledescription="carousel" aria-label="Promotions et annonces" data-astro-cid-umonoemk><div class="promo-hero-track" data-promo-hero-track tabindex="0" role="region" data-astro-cid-umonoemk>${loopSlides.map((slide, i) => {
    const isVideo = slide.kind === "video";
    const isBanner = slide.kind === "banner";
    const isClone = slideCount > 1 && (i === 0 || i === loopSlides.length - 1);
    const realIndex = slideCount > 1 ? i === 0 ? slideCount - 1 : i === loopSlides.length - 1 ? 0 : i - 1 : i;
    const hideText = slide.kind === "banner";
    return renderTemplate`<article${addAttribute(`promo-hero-slide ${isVideo ? "promo-hero-slide-video-layout" : ""} ${isBanner ? "promo-hero-slide--banner" : ""}`, "class")} role="group" aria-roledescription="diapositive"${addAttribute(`${realIndex + 1} sur ${slideCount} : ${slide.titre}`, "aria-label")}${addAttribute(realIndex, "data-slide-index")}${addAttribute(i, "data-dom-index")}${addAttribute(isClone ? "true" : void 0, "data-loop-clone")}${addAttribute(isVideo ? `background-color: ${slide.accent} !important;` : "", "style")} data-astro-cid-umonoemk>${isVideo ? (
      /* Split Screen Layout for Video Slide */
      renderTemplate`<div class="promo-video-layout-container w-full h-full flex flex-col-reverse md:flex-row relative" data-astro-cid-umonoemk><!-- Background decorative wave grid for the video slide --><div class="absolute inset-0 bg-transparent z-0" data-astro-cid-umonoemk></div><div class="absolute inset-0 opacity-[0.035] pointer-events-none z-0"${addAttribute(`background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, rgba(0,0,0,0) 80%), url("data:image/svg+xml,%3Csvg width='120' height='24' viewBox='0 0 120 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 30 0, 60 12 T 120 12' fill='none' stroke='${encodeURIComponent(slide.accent)}' stroke-width='1.5'/%3E%3C/svg%3E");`, "style")} data-astro-cid-umonoemk></div><!-- Left text column (hidden on green-accent / video slides per design) -->${!hideText && renderTemplate`<div class="promo-video-left flex-1 flex flex-col justify-end md:justify-center p-4 md:p-8 lg:p-12 z-10 text-white" data-astro-cid-umonoemk><div class="promo-hero-slide-inner" data-astro-cid-umonoemk><span class="promo-hero-eyebrow"${addAttribute(`--accent: ${slide.accent}`, "style")} data-astro-cid-umonoemk>${slide.eyebrow}</span><h2 class="promo-hero-title text-balance text-white mt-2" data-astro-cid-umonoemk>${slide.titre}</h2><p class="promo-hero-desc text-white/90 mt-2 max-w-xl" data-astro-cid-umonoemk>${slide.description}</p><a${addAttribute(slide.ctaHref, "href")} class="promo-hero-cta btn-sheen mt-4 inline-flex"${addAttribute(`--accent: ${slide.accent}`, "style")} data-astro-cid-umonoemk>${slide.ctaLabel}<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-umonoemk><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-umonoemk></path></svg></a></div></div>`}<!-- Right video player card column --><div class="promo-video-right flex-1 flex items-center justify-center p-4 md:p-6 z-10 relative" data-astro-cid-umonoemk><div class="w-full max-w-[420px] aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-neutral-900 relative" data-astro-cid-umonoemk><video muted playsinline loop autoplay class="w-full h-full object-cover" data-astro-cid-umonoemk>${slide.videoUrl && renderTemplate`<source${addAttribute(slide.videoUrl, "src")}${addAttribute(slide.videoUrl.endsWith(".mp4") ? "video/mp4" : void 0, "type")} data-astro-cid-umonoemk>`}</video><!-- Glowing frame overlay --><div class="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-2xl" data-astro-cid-umonoemk></div></div></div></div>`
    ) : (
      /* Image promo / banner slide */
      renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-umonoemk": true }, { "default": ($$result2) => renderTemplate`<div class="promo-hero-slide-image-wrap" data-astro-cid-umonoemk><picture data-astro-cid-umonoemk>${slide.imageMobile && renderTemplate`<source media="(max-width: 767px)"${addAttribute(slide.imageMobile, "srcset")} data-astro-cid-umonoemk>`}<img${addAttribute(heroSources[i].src || slide.image, "src")}${addAttribute(heroSources[i].srcset || void 0, "srcset")}${addAttribute(heroSizes, "sizes")}${addAttribute(slide.imageAlt, "alt")}${addAttribute(realIndex === 0 && !isClone ? "eager" : "lazy", "loading")}${addAttribute(realIndex === 0 && !isClone ? "high" : void 0, "fetchpriority")} decoding="async" class="promo-hero-slide-image"${addAttribute(isBanner ? "1200" : "1920", "width")}${addAttribute(isBanner ? "510" : "820", "height")} data-astro-cid-umonoemk></picture>${!isBanner && renderTemplate`<div class="promo-hero-slide-overlay"${addAttribute(`--accent: ${slide.accent}`, "style")} data-astro-cid-umonoemk></div>`}</div>${!hideText && renderTemplate`<div class="promo-hero-slide-content" data-astro-cid-umonoemk><div class="container-mo promo-hero-slide-inner" data-astro-cid-umonoemk><span class="promo-hero-eyebrow" data-astro-cid-umonoemk>${slide.eyebrow}</span><h2 class="promo-hero-title text-balance" data-astro-cid-umonoemk>${slide.titre}</h2><p class="promo-hero-desc" data-astro-cid-umonoemk>${slide.description}</p>${slide.kind === "promo" && slide.prixPromo != null && renderTemplate`<div class="promo-hero-price" data-astro-cid-umonoemk><span class="promo-hero-price-now" data-astro-cid-umonoemk>${slide.prixPromo}€</span>${slide.prixOriginal != null && renderTemplate`<span class="promo-hero-price-before" data-astro-cid-umonoemk>${slide.prixOriginal}€</span>`}${slide.reductionPct != null && renderTemplate`<span class="promo-hero-price-pct" data-astro-cid-umonoemk>−${slide.reductionPct}%</span>`}</div>`}<a${addAttribute(slide.ctaHref, "href")} class="promo-hero-cta btn-sheen"${addAttribute(`--accent: ${slide.accent}`, "style")} data-astro-cid-umonoemk>${slide.ctaLabel}<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-umonoemk><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-umonoemk></path></svg></a></div></div>`}` })}`
    )}</article>`;
  })}</div><button type="button" class="promo-hero-nav promo-hero-nav-prev" data-promo-hero-prev aria-label="Diapositive précédente" data-astro-cid-umonoemk><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-umonoemk><path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-umonoemk></path></svg></button><button type="button" class="promo-hero-nav promo-hero-nav-next" data-promo-hero-next aria-label="Diapositive suivante" data-astro-cid-umonoemk><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-umonoemk><path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-umonoemk></path></svg></button><div class="promo-hero-dots" role="tablist" aria-label="Sélectionner une diapositive" data-astro-cid-umonoemk>${baseSlides.map((_, i) => renderTemplate`<button type="button" class="promo-hero-dot"${addAttribute(i, "data-promo-hero-dot")} role="tab"${addAttribute(`Diapositive ${i + 1} sur ${slideCount}`, "aria-label")}${addAttribute(i === 0 ? "true" : void 0, "aria-current")} data-astro-cid-umonoemk></button>`)}</div><div class="sr-only" data-promo-hero-status aria-live="polite" aria-atomic="true" data-astro-cid-umonoemk></div></section>`}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/PromoHeroV2.astro", void 0);

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$PromoHero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PromoHero;
  const props = Astro2.props;
  return renderTemplate`${renderTemplate`${renderComponent($$result, "PromoHeroV3", $$PromoHeroV3, { ...props })}` }`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/PromoHero.astro", void 0);

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$KineticMarquee = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$KineticMarquee;
  const {
    items,
    variant = "noir",
    speed = 28,
    direction = "left",
    accentColor,
    class: extraClass = ""
  } = Astro2.props;
  const variants = {
    vert: { bg: "bg-vert", text: "text-white", accent: "#F6F2EB" },
    noir: { bg: "bg-noir", text: "text-white", accent: "#1C6B35" },
    creme: { bg: "bg-white", text: "text-noir", accent: "#1C6B35" },
    blanc: { bg: "bg-blanc", text: "text-noir", accent: "#1C6B35" }
  };
  const v = variants[variant];
  const puceColor = accentColor ?? v.accent;
  const doubled = [...items, ...items];
  return renderTemplate`${maybeRenderHead()}<section${addAttribute([
    "kinetic-marquee overflow-hidden relative py-3 md:py-4",
    v.bg,
    v.text,
    extraClass
  ], "class:list")}${addAttribute(`--marquee-duration: ${speed}s; --marquee-direction: ${direction === "right" ? "reverse" : "normal"}`, "style")} aria-hidden="true" data-astro-cid-xzw7p3qs> <div class="kinetic-marquee__track flex gap-6 md:gap-10 whitespace-nowrap items-center will-change-transform" data-astro-cid-xzw7p3qs> ${doubled.map((item) => renderTemplate`<span class="inline-flex items-center gap-6 md:gap-10 shrink-0" data-astro-cid-xzw7p3qs> <span class="kinetic-marquee__puce"${addAttribute(`background: ${puceColor}`, "style")} aria-hidden="true" data-astro-cid-xzw7p3qs></span> <span class="kinetic-marquee__text font-soft font-bold leading-none tracking-tight" data-astro-cid-xzw7p3qs> ${item} </span> </span>`)} </div> </section> `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/KineticMarquee.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$IndexV2 = createComponent(async ($$result, $$props, $$slots) => {
  const allPromos = await getActivePromos();
  const featuredPromo = allPromos.find((p) => p.data.ticker_semaine) ?? allPromos.find((p) => p.data.mise_en_avant) ?? allPromos[0];
  const promosHome = allPromos.slice(0, 6);
  const promosHero = allPromos.filter((p) => p.data.mise_en_avant).slice(0, 4);
  const heroEditorialSlides = await getHomeEditorialSlides();
  const marqueeItems = await getHomeMarqueeItems();
  const seoSettings = await getHomeSeoSettings();
  const PRODUITS_VEDETTES = await getProduitsVedettes(8);
  const actus = await getActus(12);
  const recettesHome = await getRecettesVedettes(3);
  const videos = (await getCollection("videos", (v) => v.data.actif && v.data.rayon === "home")).sort((a, b) => a.data.ordre - b.data.ordre);
  const schemas = [
    organizationSchema(),
    websiteSchema(),
    ...allMagasinsSchema(),
    ...featuredPromo ? [offerSchema(featuredPromo.data)] : []
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": seoSettings.title, "description": seoSettings.description, "ogImage": seoSettings.ogImage, "faqItems": FAQ_HOME, "schema": schemas, "heroImage": "/images/rayons/epices-du-monde/marche-aux-epices-dubai.jpg" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["", " ", "", "", `<section class="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-neutral-100"> <!-- Watermark Mo' \u2014 parallax l\xE9ger pour feel "profondeur" --> <img src="/logos/favicon-marchedemo.png" alt="" aria-hidden="true" data-parallax="0.45" class="absolute -right-20 top-10 w-[640px] max-w-[70%] opacity-[0.045] pointer-events-none select-none"> <div class="container-mo relative z-10 pt-12 lg:pt-20 pb-20 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center overflow-hidden"> <div class="lg:col-span-7"> <span class="eyebrow">Supermarch\xE9 ethnique \xB7 Toulouse</span> <h1 class="display-xl mt-6 text-balance font-soft font-black" data-split-reveal>
Votre <span class="text-vert">supermarch\xE9</span><br>
du monde \xE0 <span class="text-rouge">Toulouse</span>.
</h1> <p class="mt-6 max-w-xl text-[17px] leading-relaxed text-neutral-600 text-pretty"> <strong>Boucherie halal sur carcasse</strong>, fruits &amp; l\xE9gumes exotiques, \xE9pices du monde \u2014 aux prix les plus serr\xE9s d'Occitanie.
<strong>Magasin</strong> ouvert <strong>7j/7</strong>.
</p> <div class="mt-10 flex flex-col sm:flex-row gap-3 max-w-full"> <a href="/rayons" class="btn btn-primary btn-sheen">
Voir les 12 rayons
<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"> <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> <a href="/magasins" class="btn btn-ghost">Trouver le magasin</a> </div> <!-- Trust indicators (4 pills) --> <div class="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3 text-[13px] text-neutral-500 max-w-full"> <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-vert"></span> Halal certifi\xE9, sans \xE9lectronarcose</span> <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rouge"></span> Arrivage quotidien</span> <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-noir"></span> Prix affich\xE9s en rayon</span> <a href="/rayons/produits-courants" class="inline-flex items-center gap-2 group hover:text-rouge transition-colors"> <span class="w-2 h-2 rounded-full bg-rouge animate-pulse"></span> <strong class="font-bold">Des prix cass\xE9s</strong> <span class="text-rouge group-hover:translate-x-0.5 transition-transform">\u2192</span> </a> </div> </div> <!-- Hero visual : phone mockup montrant le site sur t\xE9l\xE9phone. --> <div class="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0 overflow-visible"> <div class="phone-mockup"> <div class="phone-mockup-screen"> <div class="phone-screen-content relative h-full bg-neutral-950 flex flex-col text-white overflow-hidden text-[11px] select-none"> <!-- Status bar --> <div class="flex justify-between items-center px-4 pt-3 pb-1 text-[9px] font-bold text-white/90 z-20 shrink-0 bg-neutral-950"> <span>09:41</span> <div class="flex items-center gap-1.5"> <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z" opacity=".3"></path><path d="M17 22h5V5z"></path></svg> <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-12-12c5.52-5.52 14.48-5.52 20 0z"></path></svg> <svg class="w-3.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm2 9h2v-4h-2v4z"></path></svg> </div> </div> <!-- Header App --> <div class="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-neutral-900/60 backdrop-blur-sm z-20 shrink-0"> <div class="flex items-center gap-2"> <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" class="object-contain w-full h-full" alt=""> </div> <div> <div class="font-soft font-bold text-[10px] text-white">March\xE9 de Mo'</div> <div class="text-[7px] text-vert font-semibold">Supermarch\xE9 du Monde</div> </div> </div> <!-- Cart icon --> <div class="relative p-1 bg-white/5 rounded-full"> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> <span id="sim-cart-badge" class="absolute -top-1 -right-1 bg-rouge text-white text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center scale-0 transition-transform duration-300">0</span> </div> </div> <!-- Scrollable App Content --> <div id="sim-main-scroll" class="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 z-10 scrollbar-none"> <!-- Loyalty Card section inside App --> <div class="relative rounded-xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 p-3 border border-white/10 shadow-md"> <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-vert/10 blur-xl"></div> <div class="flex justify-between items-start"> <div> <div class="text-[7px] text-white/50 font-bold uppercase tracking-wider">Carte de Fid\xE9lit\xE9</div> <div class="font-soft font-bold text-[11px] text-white mt-0.5">Adh\xE9rent Mo'</div> </div> <span class="text-vert text-[8px] font-bold px-1.5 py-0.5 bg-vert/10 rounded-full flex items-center gap-1"> <span class="w-1 h-1 rounded-full bg-vert animate-pulse"></span>
Active
</span> </div> <div class="mt-3.5 flex justify-between items-end"> <div> <div id="sim-loyalty-points" class="text-[13px] font-soft font-black text-white leading-none">150 <span class="text-[8px] font-medium text-white/60">points</span></div> <div class="text-[6.5px] text-white/40 mt-1">Valable dans notre magasin</div> </div> <!-- Mini Barcode --> <div class="relative flex items-center gap-[1.5px] opacity-75 h-3 bg-white/5 px-1 py-0.5 rounded overflow-hidden"> <div id="sim-barcode-laser" class="absolute inset-x-0 top-0 h-[1.5px] bg-red-500 shadow-[0_0_4px_#ef4444] opacity-0"></div> <div class="w-[1px] h-2.5 bg-white"></div> <div class="w-[2px] h-2.5 bg-white"></div> <div class="w-[1px] h-2.5 bg-white"></div> <div class="w-[3px] h-2.5 bg-white"></div> <div class="w-[1px] h-2.5 bg-white"></div> <div class="w-[2px] h-2.5 bg-white"></div> <div class="w-[1px] h-2.5 bg-white"></div> </div> </div> </div> <!-- Quick Categories Grid --> <div class="grid grid-cols-4 gap-1.5"> <div id="sim-cat-0" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F349}</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">Fruits</div> </div> <div id="sim-cat-1" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F969}</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">Viandes</div> </div> <div id="sim-cat-2" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F336}\uFE0F</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">\xC9pices</div> </div> <div id="sim-cat-3" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F359}</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">Asie</div> </div> </div> <!-- Welcome Banner (Maf\xE9 promo) --> <div class="relative rounded-xl overflow-hidden bg-gradient-to-r from-vert to-vert/80 p-3 text-white"> <div class="text-[8px] font-bold uppercase tracking-wider text-white/80">Offre Sp\xE9ciale</div> <div class="font-soft font-bold text-[13px] mt-1 leading-tight">Maf\xE9 Poulet</div> <p class="text-[9px] text-white/90 mt-0.5">Recette authentique \xE0 -20%</p> <div class="mt-2 text-[9px] bg-white/20 inline-block px-2 py-0.5 rounded font-bold">12,90\u20AC <span class="line-through text-white/60 ml-1">16,10\u20AC</span></div> </div> <!-- Product Catalog Title --> <div class="flex justify-between items-center pt-1"> <span class="font-soft font-bold text-[11px]">Produits frais du jour</span> <span class="text-[8px] text-vert font-semibold font-soft">Tout voir</span> </div> <!-- Product Grid --> <div class="grid grid-cols-2 gap-2" id="sim-product-grid"> <!-- Product 1 --> <div class="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col justify-between" id="sim-p1"> <div> <div class="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative mb-1.5"> <img id="sim-p1-img" src="/images/promos/mangue.jpg" class="object-cover w-full h-full" alt="Mangue Jos\xE9"> </div> <div id="sim-p1-title" class="font-bold text-[9px] truncate">Mangue Jos\xE9</div> <div id="sim-p1-desc" class="text-[7.5px] text-neutral-400">\xCEle de la R\xE9union</div> </div> <div class="mt-2 flex items-center justify-between"> <span id="sim-p1-price" class="font-bold text-vert">3,90\u20AC</span> <button id="sim-add-btn" class="bg-vert text-white text-[7.5px] font-bold px-2 py-1 rounded-md transition-colors hover:bg-vert/80 shadow-sm">Ajouter</button> </div> </div> <!-- Product 2 --> <div class="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col justify-between" id="sim-p2"> <div> <div class="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative mb-1.5"> <img id="sim-p2-img" src="/images/promos/agneau-halal.jpg" class="object-cover w-full h-full" alt="Bifteck de B\u0153uf"> </div> <div id="sim-p2-title" class="font-bold text-[9px] truncate">Bifteck de B\u0153uf</div> <div id="sim-p2-desc" class="text-[7.5px] text-neutral-400">Halal, origine France</div> </div> <div class="mt-2 flex items-center justify-between"> <span id="sim-p2-price" class="font-bold text-vert">14,90\u20AC</span> <button id="sim-add-btn-2" class="bg-white/10 text-white text-[7.5px] font-bold px-2 py-1 rounded-md">Ajouter</button> </div> </div> </div> <!-- Delivery Tracking Section --> <div class="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2"> <div class="flex justify-between items-center"> <span class="font-soft font-bold text-[10px]">Suivi de commande</span> <span class="text-[7.5px] text-neutral-400">R\xE9f: #MO-892</span> </div> <div class="space-y-1"> <div class="flex justify-between text-[8px]"> <span id="sim-delivery-status" class="text-white/90 font-medium">Pr\xE9paration de votre colis...</span> <span class="font-bold text-vert">En cours</span> </div> <div class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"> <div id="sim-delivery-progress" class="h-full bg-vert rounded-full" style="width: 25%"></div> </div> </div> </div> </div> <!-- Floating Added-to-Cart Notification Badge --> <div id="sim-float-badge" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-vert text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg scale-0 transition-transform duration-300 z-20"> <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path> </svg> <span class="text-[8px] font-bold">Produit ajout\xE9 !</span> </div> <!-- Loyalty Scan Overlay --> <div id="sim-scan-overlay" class="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-25 opacity-0 pointer-events-none transition-opacity duration-300"> <div class="bg-neutral-900 border border-white/10 rounded-2xl p-4 text-center max-w-[160px] transform scale-90 transition-transform duration-300" id="sim-scan-modal"> <div class="text-vert text-[20px] mb-1">\u{1F389}</div> <div class="text-[10px] font-bold text-white">Code Scann\xE9 !</div> <div class="text-[7.5px] text-neutral-400 mt-1">Votre fid\xE9lit\xE9 a \xE9t\xE9 valid\xE9e avec succ\xE8s.</div> </div> </div> <!-- Splash screen overlay --> <div id="sim-screen-splash" class="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-30 transition-opacity duration-500"> <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 shadow-md animate-bounce mb-3"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" class="object-contain w-full h-full" alt=""> </div> <div class="font-soft font-bold text-[14px] text-white">March\xE9 de Mo'</div> <div class="text-[8px] text-vert font-semibold mt-1 tracking-widest uppercase">Fid\xE9lit\xE9 Active</div> <div class="mt-6 flex gap-1"> <div class="w-1.5 h-1.5 bg-vert rounded-full animate-bounce" style="animation-delay: 0.1s"></div> <div class="w-1.5 h-1.5 bg-vert rounded-full animate-bounce" style="animation-delay: 0.2s"></div> <div class="w-1.5 h-1.5 bg-vert rounded-full animate-bounce" style="animation-delay: 0.3s"></div> </div> </div> </div> </div> </div> <!-- Sticker logo rouge en surcouche (effet autocollant adouci) --> <img src="/logos/logo-marchedemo-FDROUGE.png" alt="" aria-hidden="true" class="absolute top-2 right-2 sm:right-4 lg:right-0 w-20 sm:w-24 md:w-28 drop-shadow-2xl rotate-[8deg] z-10 pointer-events-none rounded-[22px] border-[4px] border-white bg-white shadow-[0_12px_24px_rgba(0,0,0,0.18)]"> <!-- Floating badge "Disponible sur t\xE9l\xE9phone" --> <div class="absolute left-1 sm:-left-2 md:-left-6 bottom-12 bg-white rounded-2xl shadow-2xl p-3 md:p-4 flex items-center gap-3 max-w-[200px] sm:max-w-[240px] z-10"> <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-vert/10 flex items-center justify-center text-vert shrink-0"> <svg class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="5" y="2" width="14" height="20" rx="2"></rect> <line x1="12" y1="18" x2="12" y2="18.01"></line> </svg> </div> <div> <div class="font-soft font-bold text-[13px] md:text-[15px] leading-tight">Pens\xE9 mobile</div> <div class="text-[10px] md:text-[12px] text-neutral-500 leading-tight mt-0.5">Notre site, sur<br>votre t\xE9l\xE9phone</div> </div> </div> </div> </div> </section> <section class="section bg-blanc"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Nos rayons</span> <h2 class="display-lg mt-4 text-balance">
20 000 r\xE9f\xE9rences.<br> <span class="text-vert">Un seul ticket de caisse.</span> </h2> </div> <a href="/rayons" class="btn btn-secondary shrink-0 btn-sheen">
Voir tous les rayons
</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"> `, ` </div> </div> </section> <div class="w-full flex flex-col items-center overflow-hidden border-t border-b border-black/5 py-8" style="background: radial-gradient(circle at center, rgba(46, 139, 74, 0.05) 0%, rgba(255, 255, 255, 0) 80%), url('data:image/svg+xml,%3Csvg width='120' height='24' viewBox='0 0 120 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 30 0, 60 12 T 120 12' fill='none' stroke='%231c6b35' stroke-width='1.5' stroke-opacity='0.04'/%3E%3C/svg%3E') repeat;"> <div class="group relative block shrink-0"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" alt="March\xE9 de Mo'" width="110" height="110" class="w-24 h-24 lg:w-28 lg:h-28 object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300 bg-white rounded-full shadow-sm p-0.5"> </div> </div> `, " ", `<section class="section bg-white"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Produits vedettes</span> <h2 class="display-lg mt-4 text-balance">
Du <span class="text-vert">monde entier</span>,<br>
dans votre panier.
</h2> <p class="mt-3 text-[15px] text-neutral-600">
Notre s\xE9lection du moment, rayon par rayon. Prix affich\xE9s \xE0 l'euro pr\xE8s en magasin.
</p> </div> <a href="/rayons" class="btn btn-secondary shrink-0 btn-sheen">
Explorer les rayons
</a> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"> `, " </div> </div> </section> ", ` <section class="section bg-noir-section relative overflow-hidden"> <img src="/logos/favicon-marchedemo-contourwh.png" alt="" aria-hidden="true" class="absolute -right-20 top-10 w-[640px] max-w-[80%] opacity-[0.06] pointer-events-none select-none"> <div class="container-mo relative z-10 grid lg:grid-cols-12 gap-12 items-center"> <div class="lg:col-span-7"> <span class="eyebrow !text-vert-light">Notre histoire</span> <h2 class="display-lg mt-4 text-balance !text-white">
Mo', c'\xE9tait<br> <span class="text-vert-light">Mohammed</span>.
</h2> <div class="mt-6 space-y-4 text-white/75 text-[16px] leading-relaxed max-w-2xl"> <p>
Le patriarche. Le p\xE8re de cette famille de commer\xE7ants passionn\xE9s
            dont est issu <strong class="text-white">Samir Ouaddaha</strong>,
            fondateur du March\xE9 de Mo'.
</p> <p>
Laur\xE9at du <strong class="text-white">R\xE9seau Entreprendre Occitanie</strong>,
            Samir a ouvert le magasin \xE0 Toulouse.
            Avec une conviction simple : les saveurs du monde doivent \xEAtre
            accessibles \xE0 tous, avec la <strong class="text-white">qualit\xE9 d'un ultra-frais</strong>
et le prix d'un supermarch\xE9.
</p> <p>
Aujourd'hui, une \xE9quipe de <strong class="text-white">24 salari\xE9s</strong>,
            et une certitude : <strong class="text-white">90% de notre \xE9quipe</strong>
n'avait pas d'emploi avant de rejoindre le March\xE9 de Mo'.
</p> </div> <div class="mt-10 flex flex-col sm:flex-row gap-3"> <a href="/notre-enseigne" class="btn btn-primary btn-sheen">Notre enseigne</a> <a href="/nos-engagements" class="btn btn-ghost !text-white !border-white/25 hover:!border-white">
Nos engagements
</a> </div> </div> <div class="lg:col-span-5"> <div class="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-vert-dark/40 to-black/60 ring-4 ring-white/10 reveal reveal-mask"> <img src="/images/home/fondateur-mo.png" alt="Mohammed \u2014 le p\xE8re, patriarche de la famille fondatrice du March\xE9 de Mo'" class="absolute inset-0 w-full h-full object-contain object-bottom p-6" width="900" height="900" loading="lazy"> <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div> </div> </div> </div> </section> <section class="section bg-white"> <div class="container-mo"> <div class="text-center max-w-3xl mx-auto mb-14 reveal"> <span class="eyebrow !justify-center">Nos 4 engagements</span> <h2 class="display-lg mt-4 text-balance">
Un supermarch\xE9, oui.<br> <span class="text-rouge">Un engagement</span>, surtout.
</h2> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"> `, ` </div> </div> </section> <div class="w-full flex flex-col items-center overflow-hidden border-t border-b border-black/5 py-8" style="background: radial-gradient(circle at center, rgba(46, 139, 74, 0.05) 0%, rgba(255, 255, 255, 0) 80%), url('data:image/svg+xml,%3Csvg width='120' height='24' viewBox='0 0 120 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 30 0, 60 12 T 120 12' fill='none' stroke='%231c6b35' stroke-width='1.5' stroke-opacity='0.03'/%3E%3C/svg%3E') repeat;"> <div class="group relative block shrink-0"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" alt="Signature March\xE9 de Mo'" width="110" height="110" loading="lazy" class="w-24 h-24 lg:w-28 lg:h-28 object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 bg-white rounded-full p-0.5 shadow-sm"> </div> </div> `, '<section class="section bg-white"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Recettes du monde</span> <h2 class="display-lg mt-4 text-balance">\nCuisinez la plan\xE8te,<br> <span class="text-vert">avec nos rayons.</span> </h2> <p class="mt-3 text-[15px] text-neutral-600">\nMaf\xE9 s\xE9n\xE9galais, bibimbap cor\xE9en, tajine marocain, ph\u1EDF vietnamien\u2026\n            Recettes authentiques, ingr\xE9dients en rayon, explications pas \xE0 pas.\n</p> </div> <a href="/recettes" class="btn btn-secondary shrink-0 btn-sheen">\nToutes les recettes\n</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"> ', ' </div> </div> </section> <section class="section bg-blanc"> <div class="container-mo"> <div class="text-center max-w-3xl mx-auto mb-14 reveal"> <span class="eyebrow !justify-center">Notre magasin</span> <h2 class="display-lg mt-4 text-balance">\nVotre supermarch\xE9 \xE0 Toulouse.<br> <span class="text-vert">Ouvert 7j/7, m\xEAme dimanche matin.</span> </h2> </div> <div class="max-w-2xl mx-auto"> ', " </div> </div> </section> ", ` <section id="suggestions" class="section bg-white scroll-mt-24"> <div class="container-mo"> <div class="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-neutral-50 border border-black/5"> <!-- Decorative Mo' watermark --> <img src="/logos/favicon-marchedemo.png" alt="" aria-hidden="true" class="absolute -right-12 -bottom-12 w-64 opacity-[0.02] pointer-events-none"> <div class="relative z-10 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 items-start"> <div> <span class="eyebrow !text-vert">Votre avis compte</span> <h2 class="display-lg mt-4 text-balance">
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
              sujet: "Suggestion Page d'Accueil",
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
  <\/script> `, " ", " "], ["", " ", "", "", `<section class="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-neutral-100"> <!-- Watermark Mo' \u2014 parallax l\xE9ger pour feel "profondeur" --> <img src="/logos/favicon-marchedemo.png" alt="" aria-hidden="true" data-parallax="0.45" class="absolute -right-20 top-10 w-[640px] max-w-[70%] opacity-[0.045] pointer-events-none select-none"> <div class="container-mo relative z-10 pt-12 lg:pt-20 pb-20 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center overflow-hidden"> <div class="lg:col-span-7"> <span class="eyebrow">Supermarch\xE9 ethnique \xB7 Toulouse</span> <h1 class="display-xl mt-6 text-balance font-soft font-black" data-split-reveal>
Votre <span class="text-vert">supermarch\xE9</span><br>
du monde \xE0 <span class="text-rouge">Toulouse</span>.
</h1> <p class="mt-6 max-w-xl text-[17px] leading-relaxed text-neutral-600 text-pretty"> <strong>Boucherie halal sur carcasse</strong>, fruits &amp; l\xE9gumes exotiques, \xE9pices du monde \u2014 aux prix les plus serr\xE9s d'Occitanie.
<strong>Magasin</strong> ouvert <strong>7j/7</strong>.
</p> <div class="mt-10 flex flex-col sm:flex-row gap-3 max-w-full"> <a href="/rayons" class="btn btn-primary btn-sheen">
Voir les 12 rayons
<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"> <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> <a href="/magasins" class="btn btn-ghost">Trouver le magasin</a> </div> <!-- Trust indicators (4 pills) --> <div class="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3 text-[13px] text-neutral-500 max-w-full"> <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-vert"></span> Halal certifi\xE9, sans \xE9lectronarcose</span> <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rouge"></span> Arrivage quotidien</span> <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-noir"></span> Prix affich\xE9s en rayon</span> <a href="/rayons/produits-courants" class="inline-flex items-center gap-2 group hover:text-rouge transition-colors"> <span class="w-2 h-2 rounded-full bg-rouge animate-pulse"></span> <strong class="font-bold">Des prix cass\xE9s</strong> <span class="text-rouge group-hover:translate-x-0.5 transition-transform">\u2192</span> </a> </div> </div> <!-- Hero visual : phone mockup montrant le site sur t\xE9l\xE9phone. --> <div class="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0 overflow-visible"> <div class="phone-mockup"> <div class="phone-mockup-screen"> <div class="phone-screen-content relative h-full bg-neutral-950 flex flex-col text-white overflow-hidden text-[11px] select-none"> <!-- Status bar --> <div class="flex justify-between items-center px-4 pt-3 pb-1 text-[9px] font-bold text-white/90 z-20 shrink-0 bg-neutral-950"> <span>09:41</span> <div class="flex items-center gap-1.5"> <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z" opacity=".3"></path><path d="M17 22h5V5z"></path></svg> <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-12-12c5.52-5.52 14.48-5.52 20 0z"></path></svg> <svg class="w-3.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm2 9h2v-4h-2v4z"></path></svg> </div> </div> <!-- Header App --> <div class="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-neutral-900/60 backdrop-blur-sm z-20 shrink-0"> <div class="flex items-center gap-2"> <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" class="object-contain w-full h-full" alt=""> </div> <div> <div class="font-soft font-bold text-[10px] text-white">March\xE9 de Mo'</div> <div class="text-[7px] text-vert font-semibold">Supermarch\xE9 du Monde</div> </div> </div> <!-- Cart icon --> <div class="relative p-1 bg-white/5 rounded-full"> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> <span id="sim-cart-badge" class="absolute -top-1 -right-1 bg-rouge text-white text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center scale-0 transition-transform duration-300">0</span> </div> </div> <!-- Scrollable App Content --> <div id="sim-main-scroll" class="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 z-10 scrollbar-none"> <!-- Loyalty Card section inside App --> <div class="relative rounded-xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 p-3 border border-white/10 shadow-md"> <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-vert/10 blur-xl"></div> <div class="flex justify-between items-start"> <div> <div class="text-[7px] text-white/50 font-bold uppercase tracking-wider">Carte de Fid\xE9lit\xE9</div> <div class="font-soft font-bold text-[11px] text-white mt-0.5">Adh\xE9rent Mo'</div> </div> <span class="text-vert text-[8px] font-bold px-1.5 py-0.5 bg-vert/10 rounded-full flex items-center gap-1"> <span class="w-1 h-1 rounded-full bg-vert animate-pulse"></span>
Active
</span> </div> <div class="mt-3.5 flex justify-between items-end"> <div> <div id="sim-loyalty-points" class="text-[13px] font-soft font-black text-white leading-none">150 <span class="text-[8px] font-medium text-white/60">points</span></div> <div class="text-[6.5px] text-white/40 mt-1">Valable dans notre magasin</div> </div> <!-- Mini Barcode --> <div class="relative flex items-center gap-[1.5px] opacity-75 h-3 bg-white/5 px-1 py-0.5 rounded overflow-hidden"> <div id="sim-barcode-laser" class="absolute inset-x-0 top-0 h-[1.5px] bg-red-500 shadow-[0_0_4px_#ef4444] opacity-0"></div> <div class="w-[1px] h-2.5 bg-white"></div> <div class="w-[2px] h-2.5 bg-white"></div> <div class="w-[1px] h-2.5 bg-white"></div> <div class="w-[3px] h-2.5 bg-white"></div> <div class="w-[1px] h-2.5 bg-white"></div> <div class="w-[2px] h-2.5 bg-white"></div> <div class="w-[1px] h-2.5 bg-white"></div> </div> </div> </div> <!-- Quick Categories Grid --> <div class="grid grid-cols-4 gap-1.5"> <div id="sim-cat-0" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F349}</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">Fruits</div> </div> <div id="sim-cat-1" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F969}</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">Viandes</div> </div> <div id="sim-cat-2" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F336}\uFE0F</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">\xC9pices</div> </div> <div id="sim-cat-3" class="bg-white/5 rounded-lg py-1.5 px-1 text-center border border-white/5 transition-all duration-300"> <span class="text-[13px]">\u{1F359}</span> <div class="text-[6.5px] font-bold mt-0.5 text-white/80">Asie</div> </div> </div> <!-- Welcome Banner (Maf\xE9 promo) --> <div class="relative rounded-xl overflow-hidden bg-gradient-to-r from-vert to-vert/80 p-3 text-white"> <div class="text-[8px] font-bold uppercase tracking-wider text-white/80">Offre Sp\xE9ciale</div> <div class="font-soft font-bold text-[13px] mt-1 leading-tight">Maf\xE9 Poulet</div> <p class="text-[9px] text-white/90 mt-0.5">Recette authentique \xE0 -20%</p> <div class="mt-2 text-[9px] bg-white/20 inline-block px-2 py-0.5 rounded font-bold">12,90\u20AC <span class="line-through text-white/60 ml-1">16,10\u20AC</span></div> </div> <!-- Product Catalog Title --> <div class="flex justify-between items-center pt-1"> <span class="font-soft font-bold text-[11px]">Produits frais du jour</span> <span class="text-[8px] text-vert font-semibold font-soft">Tout voir</span> </div> <!-- Product Grid --> <div class="grid grid-cols-2 gap-2" id="sim-product-grid"> <!-- Product 1 --> <div class="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col justify-between" id="sim-p1"> <div> <div class="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative mb-1.5"> <img id="sim-p1-img" src="/images/promos/mangue.jpg" class="object-cover w-full h-full" alt="Mangue Jos\xE9"> </div> <div id="sim-p1-title" class="font-bold text-[9px] truncate">Mangue Jos\xE9</div> <div id="sim-p1-desc" class="text-[7.5px] text-neutral-400">\xCEle de la R\xE9union</div> </div> <div class="mt-2 flex items-center justify-between"> <span id="sim-p1-price" class="font-bold text-vert">3,90\u20AC</span> <button id="sim-add-btn" class="bg-vert text-white text-[7.5px] font-bold px-2 py-1 rounded-md transition-colors hover:bg-vert/80 shadow-sm">Ajouter</button> </div> </div> <!-- Product 2 --> <div class="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col justify-between" id="sim-p2"> <div> <div class="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative mb-1.5"> <img id="sim-p2-img" src="/images/promos/agneau-halal.jpg" class="object-cover w-full h-full" alt="Bifteck de B\u0153uf"> </div> <div id="sim-p2-title" class="font-bold text-[9px] truncate">Bifteck de B\u0153uf</div> <div id="sim-p2-desc" class="text-[7.5px] text-neutral-400">Halal, origine France</div> </div> <div class="mt-2 flex items-center justify-between"> <span id="sim-p2-price" class="font-bold text-vert">14,90\u20AC</span> <button id="sim-add-btn-2" class="bg-white/10 text-white text-[7.5px] font-bold px-2 py-1 rounded-md">Ajouter</button> </div> </div> </div> <!-- Delivery Tracking Section --> <div class="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2"> <div class="flex justify-between items-center"> <span class="font-soft font-bold text-[10px]">Suivi de commande</span> <span class="text-[7.5px] text-neutral-400">R\xE9f: #MO-892</span> </div> <div class="space-y-1"> <div class="flex justify-between text-[8px]"> <span id="sim-delivery-status" class="text-white/90 font-medium">Pr\xE9paration de votre colis...</span> <span class="font-bold text-vert">En cours</span> </div> <div class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"> <div id="sim-delivery-progress" class="h-full bg-vert rounded-full" style="width: 25%"></div> </div> </div> </div> </div> <!-- Floating Added-to-Cart Notification Badge --> <div id="sim-float-badge" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-vert text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg scale-0 transition-transform duration-300 z-20"> <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path> </svg> <span class="text-[8px] font-bold">Produit ajout\xE9 !</span> </div> <!-- Loyalty Scan Overlay --> <div id="sim-scan-overlay" class="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-25 opacity-0 pointer-events-none transition-opacity duration-300"> <div class="bg-neutral-900 border border-white/10 rounded-2xl p-4 text-center max-w-[160px] transform scale-90 transition-transform duration-300" id="sim-scan-modal"> <div class="text-vert text-[20px] mb-1">\u{1F389}</div> <div class="text-[10px] font-bold text-white">Code Scann\xE9 !</div> <div class="text-[7.5px] text-neutral-400 mt-1">Votre fid\xE9lit\xE9 a \xE9t\xE9 valid\xE9e avec succ\xE8s.</div> </div> </div> <!-- Splash screen overlay --> <div id="sim-screen-splash" class="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-30 transition-opacity duration-500"> <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 shadow-md animate-bounce mb-3"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" class="object-contain w-full h-full" alt=""> </div> <div class="font-soft font-bold text-[14px] text-white">March\xE9 de Mo'</div> <div class="text-[8px] text-vert font-semibold mt-1 tracking-widest uppercase">Fid\xE9lit\xE9 Active</div> <div class="mt-6 flex gap-1"> <div class="w-1.5 h-1.5 bg-vert rounded-full animate-bounce" style="animation-delay: 0.1s"></div> <div class="w-1.5 h-1.5 bg-vert rounded-full animate-bounce" style="animation-delay: 0.2s"></div> <div class="w-1.5 h-1.5 bg-vert rounded-full animate-bounce" style="animation-delay: 0.3s"></div> </div> </div> </div> </div> </div> <!-- Sticker logo rouge en surcouche (effet autocollant adouci) --> <img src="/logos/logo-marchedemo-FDROUGE.png" alt="" aria-hidden="true" class="absolute top-2 right-2 sm:right-4 lg:right-0 w-20 sm:w-24 md:w-28 drop-shadow-2xl rotate-[8deg] z-10 pointer-events-none rounded-[22px] border-[4px] border-white bg-white shadow-[0_12px_24px_rgba(0,0,0,0.18)]"> <!-- Floating badge "Disponible sur t\xE9l\xE9phone" --> <div class="absolute left-1 sm:-left-2 md:-left-6 bottom-12 bg-white rounded-2xl shadow-2xl p-3 md:p-4 flex items-center gap-3 max-w-[200px] sm:max-w-[240px] z-10"> <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-vert/10 flex items-center justify-center text-vert shrink-0"> <svg class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="5" y="2" width="14" height="20" rx="2"></rect> <line x1="12" y1="18" x2="12" y2="18.01"></line> </svg> </div> <div> <div class="font-soft font-bold text-[13px] md:text-[15px] leading-tight">Pens\xE9 mobile</div> <div class="text-[10px] md:text-[12px] text-neutral-500 leading-tight mt-0.5">Notre site, sur<br>votre t\xE9l\xE9phone</div> </div> </div> </div> </div> </section> <section class="section bg-blanc"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Nos rayons</span> <h2 class="display-lg mt-4 text-balance">
20 000 r\xE9f\xE9rences.<br> <span class="text-vert">Un seul ticket de caisse.</span> </h2> </div> <a href="/rayons" class="btn btn-secondary shrink-0 btn-sheen">
Voir tous les rayons
</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"> `, ` </div> </div> </section> <div class="w-full flex flex-col items-center overflow-hidden border-t border-b border-black/5 py-8" style="background: radial-gradient(circle at center, rgba(46, 139, 74, 0.05) 0%, rgba(255, 255, 255, 0) 80%), url('data:image/svg+xml,%3Csvg width=\\'120\\' height=\\'24\\' viewBox=\\'0 0 120 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M0 12 Q 30 0, 60 12 T 120 12\\' fill=\\'none\\' stroke=\\'%231c6b35\\' stroke-width=\\'1.5\\' stroke-opacity=\\'0.04\\'/%3E%3C/svg%3E') repeat;"> <div class="group relative block shrink-0"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" alt="March\xE9 de Mo'" width="110" height="110" class="w-24 h-24 lg:w-28 lg:h-28 object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300 bg-white rounded-full shadow-sm p-0.5"> </div> </div> `, " ", `<section class="section bg-white"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Produits vedettes</span> <h2 class="display-lg mt-4 text-balance">
Du <span class="text-vert">monde entier</span>,<br>
dans votre panier.
</h2> <p class="mt-3 text-[15px] text-neutral-600">
Notre s\xE9lection du moment, rayon par rayon. Prix affich\xE9s \xE0 l'euro pr\xE8s en magasin.
</p> </div> <a href="/rayons" class="btn btn-secondary shrink-0 btn-sheen">
Explorer les rayons
</a> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"> `, " </div> </div> </section> ", ` <section class="section bg-noir-section relative overflow-hidden"> <img src="/logos/favicon-marchedemo-contourwh.png" alt="" aria-hidden="true" class="absolute -right-20 top-10 w-[640px] max-w-[80%] opacity-[0.06] pointer-events-none select-none"> <div class="container-mo relative z-10 grid lg:grid-cols-12 gap-12 items-center"> <div class="lg:col-span-7"> <span class="eyebrow !text-vert-light">Notre histoire</span> <h2 class="display-lg mt-4 text-balance !text-white">
Mo', c'\xE9tait<br> <span class="text-vert-light">Mohammed</span>.
</h2> <div class="mt-6 space-y-4 text-white/75 text-[16px] leading-relaxed max-w-2xl"> <p>
Le patriarche. Le p\xE8re de cette famille de commer\xE7ants passionn\xE9s
            dont est issu <strong class="text-white">Samir Ouaddaha</strong>,
            fondateur du March\xE9 de Mo'.
</p> <p>
Laur\xE9at du <strong class="text-white">R\xE9seau Entreprendre Occitanie</strong>,
            Samir a ouvert le magasin \xE0 Toulouse.
            Avec une conviction simple : les saveurs du monde doivent \xEAtre
            accessibles \xE0 tous, avec la <strong class="text-white">qualit\xE9 d'un ultra-frais</strong>
et le prix d'un supermarch\xE9.
</p> <p>
Aujourd'hui, une \xE9quipe de <strong class="text-white">24 salari\xE9s</strong>,
            et une certitude : <strong class="text-white">90% de notre \xE9quipe</strong>
n'avait pas d'emploi avant de rejoindre le March\xE9 de Mo'.
</p> </div> <div class="mt-10 flex flex-col sm:flex-row gap-3"> <a href="/notre-enseigne" class="btn btn-primary btn-sheen">Notre enseigne</a> <a href="/nos-engagements" class="btn btn-ghost !text-white !border-white/25 hover:!border-white">
Nos engagements
</a> </div> </div> <div class="lg:col-span-5"> <div class="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-vert-dark/40 to-black/60 ring-4 ring-white/10 reveal reveal-mask"> <img src="/images/home/fondateur-mo.png" alt="Mohammed \u2014 le p\xE8re, patriarche de la famille fondatrice du March\xE9 de Mo'" class="absolute inset-0 w-full h-full object-contain object-bottom p-6" width="900" height="900" loading="lazy"> <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div> </div> </div> </div> </section> <section class="section bg-white"> <div class="container-mo"> <div class="text-center max-w-3xl mx-auto mb-14 reveal"> <span class="eyebrow !justify-center">Nos 4 engagements</span> <h2 class="display-lg mt-4 text-balance">
Un supermarch\xE9, oui.<br> <span class="text-rouge">Un engagement</span>, surtout.
</h2> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"> `, ` </div> </div> </section> <div class="w-full flex flex-col items-center overflow-hidden border-t border-b border-black/5 py-8" style="background: radial-gradient(circle at center, rgba(46, 139, 74, 0.05) 0%, rgba(255, 255, 255, 0) 80%), url('data:image/svg+xml,%3Csvg width='120' height='24' viewBox='0 0 120 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 30 0, 60 12 T 120 12' fill='none' stroke='%231c6b35' stroke-width='1.5' stroke-opacity='0.03'/%3E%3C/svg%3E') repeat;"> <div class="group relative block shrink-0"> <img src="/logos/logo-marchedemo-rond-contourgreen.png" alt="Signature March\xE9 de Mo'" width="110" height="110" loading="lazy" class="w-24 h-24 lg:w-28 lg:h-28 object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 bg-white rounded-full p-0.5 shadow-sm"> </div> </div> `, '<section class="section bg-white"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Recettes du monde</span> <h2 class="display-lg mt-4 text-balance">\nCuisinez la plan\xE8te,<br> <span class="text-vert">avec nos rayons.</span> </h2> <p class="mt-3 text-[15px] text-neutral-600">\nMaf\xE9 s\xE9n\xE9galais, bibimbap cor\xE9en, tajine marocain, ph\u1EDF vietnamien\u2026\n            Recettes authentiques, ingr\xE9dients en rayon, explications pas \xE0 pas.\n</p> </div> <a href="/recettes" class="btn btn-secondary shrink-0 btn-sheen">\nToutes les recettes\n</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"> ', ' </div> </div> </section> <section class="section bg-blanc"> <div class="container-mo"> <div class="text-center max-w-3xl mx-auto mb-14 reveal"> <span class="eyebrow !justify-center">Notre magasin</span> <h2 class="display-lg mt-4 text-balance">\nVotre supermarch\xE9 \xE0 Toulouse.<br> <span class="text-vert">Ouvert 7j/7, m\xEAme dimanche matin.</span> </h2> </div> <div class="max-w-2xl mx-auto"> ', " </div> </div> </section> ", ` <section id="suggestions" class="section bg-white scroll-mt-24"> <div class="container-mo"> <div class="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-neutral-50 border border-black/5"> <!-- Decorative Mo' watermark --> <img src="/logos/favicon-marchedemo.png" alt="" aria-hidden="true" class="absolute -right-12 -bottom-12 w-64 opacity-[0.02] pointer-events-none"> <div class="relative z-10 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 items-start"> <div> <span class="eyebrow !text-vert">Votre avis compte</span> <h2 class="display-lg mt-4 text-balance">
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
              sujet: "Suggestion Page d'Accueil",
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
  <\/script> `, " ", " "])), renderComponent($$result2, "PromoHero", $$PromoHero, { "promos": promosHero, "extraSlides": heroEditorialSlides, "autoAdvanceMs": 2800 }), featuredPromo && renderTemplate`${maybeRenderHead()}<section class="relative overflow-hidden bg-rouge text-white animate-fade-up"> <div class="container-mo py-4 md:py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] md:text-[14px] font-pro"> <span class="inline-flex items-center gap-2 font-bold"> <span class="badge-promo !bg-white !text-rouge !shadow-none !min-w-0 !h-auto !px-2 !py-0.5 !text-[12px]">
-${featuredPromo.data.reduction_pct}%
</span>
Offre de la semaine
</span> <span> <strong>${featuredPromo.data.titre}</strong> ·
${featuredPromo.data.prix_promo} € au lieu de ${featuredPromo.data.prix_original} €
</span> <a href="/promos" class="ml-auto font-bold underline underline-offset-4 hover:opacity-80 transition">
Voir toutes les promos →
</a> </div> </section>`, videos.length > 0 && renderTemplate`<section class="section bg-blanc animate-fade-up"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Marché de Mo' en vidéos</span> <h2 class="display-lg mt-4 text-balance">
Rencontrez nos équipes et nos rayons.
</h2> </div> <a href="https://www.tiktok.com/@marchedemo" target="_blank" rel="noopener noreferrer" class="btn btn-secondary shrink-0">
Nous suivre sur TikTok
</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${videos.slice(0, 3).map((v) => {
    return renderTemplate`${renderComponent($$result2, "LocalVideoPlayer", LocalVideoPlayer, { "client:visible": true, "src": v.data.src_local, "title": v.data.titre, "href": v.data.url_tiktok, "client:component-hydration": "visible", "client:component-path": "@components/islands/LocalVideoPlayer.jsx", "client:component-export": "default" })}`;
  })} </div> </div> </section>`, promosHome.length > 0 && renderTemplate`<section class="section bg-white"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow !text-rouge">Promos de la semaine</span> <h2 class="display-lg mt-4 text-balance">
Les <span class="text-rouge">vraies promos</span> du moment.
</h2> <p class="mt-3 text-[15px] text-neutral-600">
Mises à jour chaque semaine. Affichées à l'euro près, dans notre magasin.
</p> </div> <a href="/promos" class="btn btn-rouge shrink-0">
Voir toutes les promos
</a> </div> ${renderComponent($$result2, "PromoCarousel", $$PromoCarousel, { "promos": promosHome })} </div> </section>`, RAYONS_LIST.slice(0, 6).map((r, i) => renderTemplate`${renderComponent($$result2, "RayonCard", $$RayonCard, { "rayon": r, "large": i === 0 })}`), renderComponent($$result2, "KineticMarquee", $$KineticMarquee, { "items": marqueeItems, "variant": "vert", "speed": 25 }), actus.length > 0 && renderTemplate`<section class="section bg-blanc relative overflow-hidden"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Les actus du marché</span> <h2 class="display-lg mt-4 text-balance" data-split-reveal>
Ce qui <span class="text-vert">bouge</span><br>
en ce moment.
</h2> <p class="mt-3 text-[15px] text-neutral-600">
Arrivages de saison, nouveautés en rayon, événements, recettes d'inspiration.
              Le pouls du marché, chaque semaine.
</p> </div> <a href="/actualites" class="btn btn-secondary shrink-0 btn-sheen">
Toutes les actus
</a> </div> ${renderComponent($$result2, "ActuCarousel", $$ActuCarousel, { "actus": actus })} </div> </section>`, PRODUITS_VEDETTES.map((p, i) => renderTemplate`<div class="reveal"${addAttribute(`--reveal-delay: ${i % 4 * 60}ms`, "style")}> ${renderComponent($$result2, "ProduitCard", $$ProduitCard, { "produit": p })} </div>`), renderComponent($$result2, "Stats", $$Stats, { "variant": "light" }), ENGAGEMENTS.map((e, i) => renderTemplate`<article class="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 reveal"${addAttribute(`--reveal-delay: ${i * 80}ms`, "style")}> <div class="w-14 h-14 rounded-2xl bg-vert/10 text-vert flex items-center justify-center mb-6"> ${e.icone === "heart" && renderTemplate`<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"> <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path> </svg>`} ${e.icone === "people" && renderTemplate`<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path> <circle cx="9" cy="7" r="4"></circle> <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path> </svg>`} ${e.icone === "trophy" && renderTemplate`<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"></path> </svg>`} ${e.icone === "care" && renderTemplate`<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path> <path d="M12 7v4M9 9h6"></path> </svg>`} </div> <h3 class="font-soft font-bold text-[20px] leading-tight">${e.titre}</h3> <p class="mt-2 text-[14px] text-neutral-500 font-pro">${e.resume}</p> <p class="mt-4 text-[14px] text-neutral-700 leading-relaxed">${e.description}</p> </article>`), videos.length > 0 && renderTemplate`<section class="section bg-blanc"> <div class="container-mo"> <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal"> <div class="max-w-2xl"> <span class="eyebrow">Marché de Mo' en vidéos</span> <h2 class="display-lg mt-4 text-balance">
Rencontrez nos équipes et nos rayons.
</h2> </div> <a href="https://www.tiktok.com/@marchedemo" target="_blank" rel="noopener noreferrer" class="btn btn-secondary shrink-0">
Nous suivre sur TikTok
</a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${videos.slice(3, 6).map((v) => {
    return renderTemplate`${renderComponent($$result2, "LocalVideoPlayer", LocalVideoPlayer, { "client:visible": true, "src": v.data.src_local, "title": v.data.titre, "href": v.data.url_tiktok, "client:component-hydration": "visible", "client:component-path": "@components/islands/LocalVideoPlayer.jsx", "client:component-export": "default" })}`;
  })} </div> </div> </section>`, recettesHome.map((r, i) => renderTemplate`<div class="reveal"${addAttribute(`--reveal-delay: ${i * 80}ms`, "style")}> ${renderComponent($$result2, "RecetteCard", $$RecetteCard, { "recette": r })} </div>`), Object.values(MAGASINS).map((m) => renderTemplate`<a${addAttribute(`/magasins/${m.slug}`, "href")} class="group block relative overflow-hidden rounded-3xl bg-noir text-white shadow-xl hover:shadow-2xl transition-all duration-500"> <div class="aspect-[4/3] sm:aspect-[16/10] relative overflow-hidden bg-noir-softer"> <img${addAttribute(m.photo || "/images/magasins/toulouse-sud.jpg", "src")}${addAttribute(`${m.nom} \u2014 ext\xE9rieur`, "alt")} loading="lazy" width="1200" height="750" class="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-[1.05] transition-all duration-700" onerror="this.style.opacity='0.3'"> <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div> </div> <div class="absolute inset-x-0 bottom-0 p-4 sm:p-7 lg:p-10"> ${m.badge && renderTemplate`<span class="inline-flex items-center mb-1.5 pill pill-rouge bg-rouge !text-white text-[9.5px] sm:text-[11px]"> ${m.badge} </span>`} <h3 class="font-soft font-bold text-[18px] sm:text-[26px] lg:text-[32px] leading-tight !text-white"> ${m.nomCourt} </h3> <p class="mt-1 text-white/80 text-[11.5px] sm:text-[14px]">${m.adresseLigne1}, ${m.codePostal} ${m.ville}</p> <div class="mt-2.5 sm:mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[12.5px] text-white/70"> <span class="inline-flex items-center gap-1.5"> <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
7j/7
</span> <span>${m.surface}</span> <span>${m.parking}</span> </div> <span class="mt-3.5 sm:mt-6 inline-flex items-center gap-2 font-bold text-[11.5px] sm:text-[13.5px] group-hover:translate-x-1 transition-transform">
Voir le magasin
<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"></path></svg> </span> </div> </a>`), renderComponent($$result2, "NewsletterInline", $$NewsletterInline, { "variant": "dark" }), renderComponent($$result2, "FAQAccordion", $$FAQAccordion, { "items": FAQ_HOME }), renderComponent($$result2, "FeedbackPopup", $$FeedbackPopup, {})) })} `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/indexV2.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/indexV2.astro";
const $$url = "/indexV2";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$IndexV2,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
