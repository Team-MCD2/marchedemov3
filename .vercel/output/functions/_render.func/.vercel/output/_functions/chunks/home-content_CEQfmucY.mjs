import { d as createAstro, c as createComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead, e as renderComponent } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */
import { s as supabaseSrcSet } from './image-cdn_DFkHDQ0b.mjs';
import { g as getCollection } from './_astro_content_BJyRHHIi.mjs';
import { R as RAYONS } from './site_dG8pplQb.mjs';
import { a as getAllRecettes } from './recettes_-ecohakO.mjs';
import { a as supabase } from './supabase_DGRgIA0P.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$3 = createAstro("https://marchedemov2.vercel.app");
const $$FeedbackPopup = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$FeedbackPopup;
  const googleReviewsUrl = "https://www.google.com/search?sca_esv=987102333fe88aad&sxsrf=ANbL-n4MkUMhL9v8oqWl_vATaSFdRY2uTw:1779404224790&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQVmAaKOkam4zBEqGG6D2dkLApv2b1i4n_W4wW0VjN-p8FWo3rTf-y-WdWZuASv7xuuOwNgeIZXz8eW5pQLbYxMs9nDs&q=Marche+de+Mo%27+Reviews&sa=X&ved=2ahUKEwiI1-ulvcuUAxX0Rv4FHWujBzgQ0bkNegQINRAH&biw=1536&bih=730&dpr=1.25";
  return renderTemplate(_a || (_a = __template(["", `<div id="feedback-popup" class="feedback-popup-shell" role="dialog" aria-labelledby="feedback-title" aria-hidden="true" data-astro-cid-afk7xxif> <button type="button" id="feedback-close" class="feedback-popup-close" aria-label="Fermer" data-astro-cid-afk7xxif> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-afk7xxif> <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-afk7xxif></path> </svg> </button> <div class="space-y-4" data-astro-cid-afk7xxif> <div class="flex items-center gap-3" data-astro-cid-afk7xxif> <span class="text-[24px]" role="img" aria-label="\xC9toiles" data-astro-cid-afk7xxif>\u2B50</span> <div data-astro-cid-afk7xxif> <span class="text-[10px] uppercase tracking-wider font-bold text-vert" data-astro-cid-afk7xxif>Votre avis compte</span> <h3 id="feedback-title" class="font-soft font-bold text-[15px] text-noir leading-tight" data-astro-cid-afk7xxif>
Avez-vous appr\xE9ci\xE9 votre derni\xE8re visite chez March\xE9 de Mo' ?
</h3> </div> </div> <p class="text-[12px] text-neutral-500 leading-normal" data-astro-cid-afk7xxif>
Aidez-nous \xE0 nous am\xE9liorer ou partagez votre exp\xE9rience avec la communaut\xE9 toulousaine.
</p> <div class="flex items-center gap-3 pt-1" data-astro-cid-afk7xxif> <a id="feedback-yes"`, ' target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-2.5 px-4 rounded-full bg-vert text-white text-[12.5px] font-bold hover:bg-vert-dark transition shadow-md hover:shadow-lg" data-astro-cid-afk7xxif>\nOui, super !\n</a> <button id="feedback-no" type="button" class="flex-1 py-2.5 px-4 rounded-full border border-neutral-200 hover:border-black text-[12.5px] font-bold text-neutral-600 hover:text-noir transition bg-white" data-astro-cid-afk7xxif>\nNon...\n</button> </div> </div> </div>  <script>\n  (() => {\n    let checkTimeout = null;\n    let scrollListener = null;\n\n    const LOCAL_STORAGE_KEY = "mo_feedback_dismissed_until";\n    const SHOW_DELAY_MS = 15000; // 15 seconds\n    const SCROLL_THRESHOLD = 0.5; // 50% scroll\n\n    const getDismissedUntil = () => {\n      const val = localStorage.getItem(LOCAL_STORAGE_KEY);\n      return val ? parseInt(val, 10) : 0;\n    };\n\n    const setDismissed = (days = 30) => {\n      const until = Date.now() + days * 24 * 60 * 60 * 1000;\n      localStorage.setItem(LOCAL_STORAGE_KEY, until.toString());\n    };\n\n    const dismissPopup = (shell) => {\n      if (!shell) return;\n      shell.classList.remove("is-visible");\n      shell.setAttribute("aria-hidden", "true");\n      cleanup();\n    };\n\n    const showPopup = (shell) => {\n      if (!shell) return;\n      \n      // Safety check if already shown or dismissed\n      if (Date.now() < getDismissedUntil()) return;\n      \n      shell.classList.add("is-visible");\n      shell.setAttribute("aria-hidden", "false");\n      cleanup();\n    };\n\n    const cleanup = () => {\n      if (checkTimeout) clearTimeout(checkTimeout);\n      if (scrollListener) {\n        window.removeEventListener("scroll", scrollListener);\n        scrollListener = null;\n      }\n    };\n\n    const initFeedbackPopup = () => {\n      const shell = document.getElementById("feedback-popup");\n      if (!shell) return;\n\n      // Check if already dismissed for 30 days\n      if (Date.now() < getDismissedUntil()) {\n        return;\n      }\n\n      const closeBtn = document.getElementById("feedback-close");\n      const yesBtn = document.getElementById("feedback-yes");\n      const noBtn = document.getElementById("feedback-no");\n\n      // Set dismiss action\n      closeBtn?.addEventListener("click", () => {\n        setDismissed(30);\n        dismissPopup(shell);\n      });\n\n      yesBtn?.addEventListener("click", () => {\n        setDismissed(30);\n        dismissPopup(shell);\n      });\n\n      noBtn?.addEventListener("click", () => {\n        setDismissed(30);\n        dismissPopup(shell);\n\n        // Smooth scroll to suggestions section\n        const suggestionsSec = document.getElementById("suggestions");\n        if (suggestionsSec) {\n          suggestionsSec.scrollIntoView({ behavior: "smooth" });\n          // Focus the input\n          const txt = document.getElementById("suggestion-message");\n          if (txt) {\n            setTimeout(() => txt.focus(), 800);\n          }\n        }\n      });\n\n      // Show trigger 1: Timer (15s)\n      checkTimeout = setTimeout(() => {\n        showPopup(shell);\n      }, SHOW_DELAY_MS);\n\n      // Show trigger 2: Scroll past 50%\n      scrollListener = () => {\n        const scrollTop = window.scrollY || document.documentElement.scrollTop;\n        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;\n        if (docHeight > 0 && (scrollTop / docHeight) >= SCROLL_THRESHOLD) {\n          showPopup(shell);\n        }\n      };\n      window.addEventListener("scroll", scrollListener, { passive: true });\n    };\n\n    // Support Astro Page transitions\n    document.addEventListener("astro:page-load", () => {\n      cleanup();\n      initFeedbackPopup();\n    });\n\n    // Run on first load\n    if (document.readyState !== "loading") {\n      initFeedbackPopup();\n    } else {\n      document.addEventListener("DOMContentLoaded", initFeedbackPopup);\n    }\n  })();\n<\/script>'])), maybeRenderHead(), addAttribute(googleReviewsUrl, "href"));
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/FeedbackPopup.astro", void 0);

const $$Astro$2 = createAstro("https://marchedemov2.vercel.app");
const $$PromoHeroV3 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PromoHeroV3;
  const { promos = [], extraSlides = [], autoAdvanceMs = 5e3 } = Astro2.props;
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
    eyebrow: "Promotion Exceptionnelle",
    image: p.data.image,
    imageMobile: null,
    imageAlt: p.data.titre,
    ctaLabel: "Voir la promo",
    ctaHref: "/promos",
    accent: "#8B1919",
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
  const initialSlides = [agneauBannerSlide, ...promoSlides, ...editorialSlides];
  const videoSlide = {
    kind: "video",
    titre: "Votre supermarch\xE9 du monde \xE0 Toulouse",
    description: "Boucherie halal sur carcasse, fruits & l\xE9gumes exotiques, \xE9pices du monde. Ouvert 7j/7.",
    eyebrow: "Pr\xE9sentation",
    image: "/images/home/hero.jpg",
    imageMobile: null,
    imageAlt: "Vid\xE9o March\xE9 de Mo'",
    ctaLabel: "D\xE9couvrir nos rayons",
    ctaHref: "/rayons",
    accent: "#1C6B35",
    prixPromo: null,
    prixOriginal: null,
    reductionPct: null,
    videoUrl: "/videos/marchedemo-promo.mp4"
  };
  if (!editorialSlides.some((s) => s.kind === "video")) {
    initialSlides.splice(1, 0, videoSlide);
  }
  const baseSlides = initialSlides;
  const slideCount = baseSlides.length;
  const heroWidths = [800, 1200, 1600];
  const heroSizes = "100vw";
  const heroSources = baseSlides.map(
    (s) => s.kind === "banner" || s.image.startsWith("/promos/") ? { src: s.image, srcset: "" } : supabaseSrcSet(s.image, heroWidths, { quality: 78 })
  );
  return renderTemplate`${slideCount > 0 && renderTemplate`${maybeRenderHead()}<div class="w-full py-4 select-none" data-astro-cid-mrwu4odo><div id="promo-hero-v3" class="relative w-full max-w-[1400px] mx-auto aspect-[21/8] max-h-[420px] min-h-[220px] rounded-2xl overflow-hidden shadow-lg border border-neutral-100 group"${addAttribute(autoAdvanceMs, "data-auto-ms")}${addAttribute(slideCount, "data-slide-count")} data-astro-cid-mrwu4odo><!-- Slides Container --><div id="hero-slides-track" class="w-full h-full flex transition-transform duration-500 ease-out" style="transform: translateX(0%);" data-astro-cid-mrwu4odo>${baseSlides.map((slide, i) => {
    const isVideo = slide.kind === "video";
    const isBanner = slide.kind === "banner";
    return renderTemplate`<div class="w-full h-full flex-shrink-0 relative" data-astro-cid-mrwu4odo>${isVideo ? renderTemplate`<!-- Split Screen Video Layout -->
                <div class="w-full h-full flex flex-col-reverse md:flex-row bg-vert relative text-white" data-astro-cid-mrwu4odo><div class="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-center z-10" data-astro-cid-mrwu4odo><span class="text-[11px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full w-fit mb-3" data-astro-cid-mrwu4odo>${slide.eyebrow}</span><h2 class="font-soft font-bold text-[22px] md:text-[34px] leading-tight text-white mb-2" data-astro-cid-mrwu4odo>${slide.titre}</h2><p class="text-[13.5px] md:text-[15px] text-white/90 leading-relaxed mb-4 max-w-lg" data-astro-cid-mrwu4odo>${slide.description}</p><a${addAttribute(slide.ctaHref, "href")} class="bg-white hover:bg-neutral-100 text-vert font-bold text-[13.5px] px-6 py-2.5 rounded-full shadow-lg w-fit transition-colors" data-astro-cid-mrwu4odo>${slide.ctaLabel}</a></div><div class="flex-1 flex items-center justify-center p-4 z-10 bg-black/10" data-astro-cid-mrwu4odo><div class="w-full max-w-[380px] aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900" data-astro-cid-mrwu4odo>${slide.videoUrl && renderTemplate`<video muted playsinline loop autoplay class="w-full h-full object-cover" data-astro-cid-mrwu4odo><source${addAttribute(slide.videoUrl, "src")} type="video/mp4" data-astro-cid-mrwu4odo></video>`}</div></div></div>` : renderTemplate`<!-- Banner Image Layout -->
                <div class="w-full h-full relative" data-astro-cid-mrwu4odo><picture class="w-full h-full block" data-astro-cid-mrwu4odo>${slide.imageMobile && renderTemplate`<source media="(max-width: 767px)"${addAttribute(slide.imageMobile, "srcset")} data-astro-cid-mrwu4odo>`}<img${addAttribute(heroSources[i].src || slide.image, "src")}${addAttribute(heroSources[i].srcset || void 0, "srcset")}${addAttribute(heroSizes, "sizes")}${addAttribute(slide.imageAlt, "alt")}${addAttribute(i === 0 ? "eager" : "lazy", "loading")}${addAttribute(`w-full h-full ${isBanner ? "object-contain bg-white p-1" : "object-cover"}`, "class")} data-astro-cid-mrwu4odo></picture>${!isBanner && renderTemplate`<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-6 md:p-10 lg:p-14 text-white" data-astro-cid-mrwu4odo><div class="max-w-xl" data-astro-cid-mrwu4odo><span class="text-[11px] font-black uppercase tracking-widest bg-vert px-3 py-1 rounded-full w-fit mb-2.5 block" data-astro-cid-mrwu4odo>${slide.eyebrow}</span><h2 class="font-soft font-bold text-[22px] md:text-[34px] leading-tight text-white mb-2" data-astro-cid-mrwu4odo>${slide.titre}</h2><p class="text-[13.5px] md:text-[15px] text-white/95 leading-relaxed mb-4" data-astro-cid-mrwu4odo>${slide.description}</p>${slide.kind === "promo" && slide.prixPromo != null && renderTemplate`<div class="flex items-baseline gap-3 mb-4 select-none" data-astro-cid-mrwu4odo><span class="text-[32px] font-black leading-none" data-astro-cid-mrwu4odo>${slide.prixPromo}€</span>${slide.prixOriginal != null && renderTemplate`<span class="text-[16px] text-white/60 line-through" data-astro-cid-mrwu4odo>${slide.prixOriginal}€</span>`}${slide.reductionPct != null && renderTemplate`<span class="text-[12px] bg-white text-rouge font-black px-2 py-0.5 rounded" data-astro-cid-mrwu4odo>-${slide.reductionPct}%</span>`}</div>`}<a${addAttribute(slide.ctaHref, "href")} class="bg-vert hover:bg-vert-dark text-white font-bold text-[13.5px] px-6 py-2.5 rounded-full shadow-lg w-fit transition-colors inline-block" data-astro-cid-mrwu4odo>${slide.ctaLabel}</a></div></div>`}</div>`}</div>`;
  })}</div><!-- Navigation Arrows (Shown on Hover) --><button id="hero-prev-btn" class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-label="Diapositive précédente" data-astro-cid-mrwu4odo><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-mrwu4odo><path d="m15 18-6-6 6-6" data-astro-cid-mrwu4odo></path></svg></button><button id="hero-next-btn" class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-label="Diapositive suivante" data-astro-cid-mrwu4odo><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-mrwu4odo><path d="m9 18 6-6-6-6" data-astro-cid-mrwu4odo></path></svg></button><!-- Indicator Dots --><div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/25 backdrop-blur-md rounded-full" data-astro-cid-mrwu4odo>${baseSlides.map((_, i) => renderTemplate`<button class="hero-dot w-2 h-2 rounded-full bg-white/45 hover:bg-white transition-all outline-none"${addAttribute(i, "data-index")}${addAttribute(`Aller \xE0 la diapositive ${i + 1}`, "aria-label")}${addAttribute(i === 0 ? "true" : void 0, "aria-current")} data-astro-cid-mrwu4odo></button>`)}</div></div></div>`}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/PromoHeroV3.astro", void 0);

const ACTUS_SEED = [
  {
    id: "arrivage-mangues-kent",
    type: "arrivage",
    titre: "Arrivage mangues Kent du Mali",
    resume: "Les mangues Kent ultra-sucrées arrivent en rayon ce mardi. Quantité limitée, saison courte.",
    image: "/images/rayons/fruits-legumes/pamplemousse.jpg",
    imageAlt: "Cagette de mangues Kent fraîchement arrivées",
    rayon: "fruits-legumes",
    date: /* @__PURE__ */ new Date("2026-04-20"),
    href: "/rayons/fruits-legumes/fruits/exotiques"
  },
  {
    id: "festival-ramadan-2026",
    type: "evenement",
    titre: "Préparation du Ramadan — arrivages spéciaux",
    resume: "Dattes Medjool de Tunisie, farines pour pâtisseries orientales, harissa artisanale. Tout pour un mois béni.",
    image: "/images/rayons/epices-du-monde/marche-aux-epices-dubai.jpg",
    imageAlt: "Étal d'épices et dattes pour le Ramadan",
    rayon: "saveur-mediterranee",
    date: /* @__PURE__ */ new Date("2026-04-18"),
    href: "/rayons/saveur-mediterranee"
  },
  {
    id: "nouveaute-gochujang",
    type: "nouveaute",
    titre: "Nouveau : gochujang artisanal coréen",
    resume: "Pâte fermentée de piment coréen, marque Sempio — enfin disponible en rayon Asie.",
    image: "/images/rayons/saveurs-asie/image-de-jason-leung.jpg",
    imageAlt: "Pot de gochujang sur comptoir",
    rayon: "saveurs-asie",
    date: /* @__PURE__ */ new Date("2026-04-15"),
    href: "/rayons/saveurs-asie/sauces-condiments"
  },
  {
    id: "arrivage-agneau-printemps",
    type: "arrivage",
    titre: "Agneau de printemps — carcasse entière",
    resume: "Arrivage hebdomadaire d'agneau halal, sans électronarcose. Découpe sur mesure au comptoir.",
    image: "/images/rayons/boucherie-halal/image-de-cindie-hansen.jpg",
    imageAlt: "Étal de boucherie halal avec agneau",
    rayon: "boucherie-halal",
    date: /* @__PURE__ */ new Date("2026-04-12"),
    href: "/rayons/boucherie-halal/viandes/agneau"
  },
  {
    id: "nouveaute-plantain-precuit",
    type: "nouveaute",
    titre: "Plantain précuit Afropèze",
    resume: "Gain de temps garanti : plantain bouilli, emballé sous-vide. Prêt à poêler ou frire.",
    image: "/images/rayons/saveurs-afrique/slide-02-homepage-maceo-groupe-distributeur-produits-creole-.webp",
    imageAlt: "Sachet de plantain précuit",
    rayon: "saveurs-afrique",
    date: /* @__PURE__ */ new Date("2026-04-10"),
    href: "/rayons/saveurs-afrique/feculents-farines"
  },
  {
    id: "evenement-festival-africain",
    type: "evenement",
    titre: "Semaine Saveurs d'Afrique — 22 au 28 avril",
    resume: "Dégustations, démos cuisine, prix découverte sur tout le rayon africain. Dans notre magasin.",
    image: "/images/rayons/saveurs-afrique/image-de-annie-spratt.jpg",
    imageAlt: "Étal de produits africains pour la semaine festival",
    rayon: "saveurs-afrique",
    date: /* @__PURE__ */ new Date("2026-04-08"),
    href: "/rayons/saveurs-afrique"
  }
];
const TYPE_LABELS = {
  article: "Actualité",
  recette: "Recette",
  arrivage: "Arrivage",
  nouveaute: "Nouveauté",
  evenement: "Événement"
};
function actuBadgeLabel(actu) {
  if (actu.badgeLabel) return actu.badgeLabel;
  if (actu.rayon && RAYONS[actu.rayon]) return RAYONS[actu.rayon].nomCourt;
  return TYPE_LABELS[actu.type];
}
function actuBadgeColor(actu) {
  if (actu.rayon && RAYONS[actu.rayon]?.accent) return RAYONS[actu.rayon].accent;
  switch (actu.type) {
    case "arrivage":
      return "#E07B1F";
    case "nouveaute":
      return "#1C6B35";
    case "evenement":
      return "#C53030";
    case "recette":
      return "#8B4513";
    default:
      return "#1C6B35";
  }
}
async function getActus(limit) {
  const items = [];
  try {
    const { data: dbActus, error } = await supabase.from("actus").select("*").eq("actif", true).order("date", { ascending: false });
    if (error) {
      console.warn("DB Actus failed, falling back to static collections:", error.message);
    } else if (dbActus) {
      for (const item of dbActus) {
        items.push({
          id: `db-${item.id}`,
          type: item.type,
          titre: item.titre,
          resume: item.resume || void 0,
          image: item.image,
          imageAlt: item.image_alt || void 0,
          rayon: item.rayon || void 0,
          date: new Date(item.date),
          href: item.href || "",
          badgeLabel: item.badge_label || void 0
        });
      }
    }
  } catch (e) {
    console.warn("DB Actus query error, falling back:", e?.message || e);
  }
  try {
    const articles = await getCollection("articles", (a) => a.data.actif);
    for (const a of articles) {
      const typeMap = {
        promos: "evenement",
        nouveautes: "nouveaute",
        recettes: "recette",
        engagements: "article",
        evenements: "evenement"
      };
      items.push({
        id: `article-${a.slug}`,
        type: typeMap[a.data.categorie] ?? "article",
        titre: a.data.titre,
        resume: a.data.resume,
        image: a.data.image,
        imageAlt: a.data.titre,
        date: new Date(a.data.date_publication),
        href: `/actualites/${a.slug}`
      });
    }
  } catch (e) {
  }
  try {
    const recettes = await getAllRecettes();
    for (const r of recettes) {
      items.push({
        id: `recette-${r.id}`,
        type: "recette",
        titre: r.titre,
        resume: r.resume,
        image: r.image,
        imageAlt: r.titre,
        rayon: r.rayon,
        /* Les recettes Collection ont une date_publication, mais l'interface
           Recette ne l'expose pas. On utilise une date par défaut récente. */
        date: /* @__PURE__ */ new Date("2026-03-01"),
        href: r.lien ?? `/rayons/${r.rayon}`
      });
    }
  } catch {
  }
  if (items.length === 0) {
    items.push(...ACTUS_SEED);
  }
  items.sort((a, b) => b.date.getTime() - a.date.getTime());
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$ActuCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ActuCard;
  const { actu } = Astro2.props;
  const badge = actuBadgeLabel(actu);
  const badgeColor = actuBadgeColor(actu);
  const { src: actuSrc, srcset: actuSrcset } = supabaseSrcSet(
    actu.image,
    [400, 600, 800],
    { quality: 72 }
  );
  const actuSizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(actu.href, "href")} data-tilt data-tilt-max="3" class="actu-card group block" data-astro-cid-mtt3w2lm> <div class="relative overflow-hidden rounded-2xl bg-white aspect-[5/4] ring-1 ring-black/5 shadow-sm group-hover:shadow-card-hover transition-all duration-400" data-astro-cid-mtt3w2lm> <img${addAttribute(actuSrc, "src")}${addAttribute(actuSrcset, "srcset")}${addAttribute(actuSizes, "sizes")}${addAttribute(actu.imageAlt ?? actu.titre, "alt")} loading="lazy" decoding="async" width="600" height="480" class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-600" data-astro-cid-mtt3w2lm>  <span class="actu-badge absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-pro font-bold uppercase tracking-wider text-white shadow-sm"${addAttribute(`background: ${badgeColor}`, "style")} data-astro-cid-mtt3w2lm> ${badge} </span>  ${(actu.type === "arrivage" || actu.type === "nouveaute") && renderTemplate`<span class="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-noir shadow-sm" data-astro-cid-mtt3w2lm> <span class="relative flex w-1.5 h-1.5" data-astro-cid-mtt3w2lm> <span class="absolute inset-0 rounded-full bg-rouge animate-ping opacity-60" data-astro-cid-mtt3w2lm></span> <span class="relative w-1.5 h-1.5 rounded-full bg-rouge" data-astro-cid-mtt3w2lm></span> </span> ${actu.type === "arrivage" ? "Arrivage" : "Nouveau"} </span>`} </div> <div class="mt-3 px-0.5" data-astro-cid-mtt3w2lm> <h3 class="font-soft font-bold text-[14.5px] md:text-[15.5px] leading-tight text-noir line-clamp-2 min-h-[2.4em] group-hover:text-vert transition-colors" data-astro-cid-mtt3w2lm> ${actu.titre} </h3> </div> </a> `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/ActuCard.astro", void 0);

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$ActuCarousel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ActuCarousel;
  const { actus } = Astro2.props;
  return renderTemplate`${actus.length > 0 && renderTemplate`${maybeRenderHead()}<div class="actu-carousel relative -mx-5 md:-mx-8 lg:mx-0" data-astro-cid-e3tebylh><button type="button" class="actu-nav actu-nav-prev" aria-label="Actualité précédente" data-actu-prev data-astro-cid-e3tebylh><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-e3tebylh><path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-e3tebylh></path></svg></button><div class="actu-track flex gap-4 md:gap-5 px-5 md:px-8 lg:px-2" data-actu-track tabindex="0" role="region" aria-label="Les actus du marché" aria-roledescription="carousel" data-astro-cid-e3tebylh>${actus.map((actu) => renderTemplate`<div class="actu-slot shrink-0" role="group" aria-roledescription="diapositive" data-astro-cid-e3tebylh>${renderComponent($$result, "ActuCard", $$ActuCard, { "actu": actu, "data-astro-cid-e3tebylh": true })}</div>`)}${actus.map((actu) => renderTemplate`<div class="actu-slot shrink-0" aria-hidden="true" inert data-astro-cid-e3tebylh>${renderComponent($$result, "ActuCard", $$ActuCard, { "actu": actu, "data-astro-cid-e3tebylh": true })}</div>`)}</div><button type="button" class="actu-nav actu-nav-next" aria-label="Actualité suivante" data-actu-next data-astro-cid-e3tebylh><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-e3tebylh><path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-e3tebylh></path></svg></button><div class="hidden md:flex items-center justify-end gap-2 mt-4 text-[]-neutral-600 font-pro" data-astro-cid-e3tebylh><span class="inline-flex items-center gap-1.5" data-astro-cid-e3tebylh>
Glissez · flèches · défilement auto
</span></div></div>`}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/ActuCarousel.astro", void 0);

const FALLBACK_SLIDES = [
  {
    kind: "editorial",
    eyebrow: "Dernier-né du Groupe",
    titre: "Toulouse Sud Cépière. Ouvert.",
    description: "1 200 m² d'espace de vente, rayon Saveurs d'Asie étendu, espace traiteur halal sur place. Votre nouveau rendez-vous au cœur de l'Hippodrome.",
    image: "/images/magasins/toulouse-sud.jpg",
    imageAlt: "Nouveau magasin Marché de Mo' Toulouse Sud Cépière",
    ctaLabel: "Découvrir le magasin",
    ctaHref: "/magasins/toulouse-sud",
    accent: "#1C6B35",
    videoUrl: null
  },
  {
    kind: "editorial",
    eyebrow: "Programme fidélité",
    titre: "5€ offerts à chaque 100€.",
    description: "La carte Marché de Mo' : un avantage direct, sans condition. Vous faites vos courses, on vous remercie.",
    image: "/images/rayons/fruits-legumes.jpg",
    imageAlt: "Carte fidélité Marché de Mo'",
    ctaLabel: "Rejoindre le programme",
    ctaHref: "/fidelite",
    accent: "#C53030",
    videoUrl: null
  }
];
function slideRowToEntry(row) {
  return {
    kind: "editorial",
    eyebrow: row.eyebrow ?? "",
    titre: row.titre ?? "",
    description: row.description ?? "",
    image: row.image ?? "",
    imageAlt: row.image_alt ?? "",
    ctaLabel: row.cta_label ?? "",
    ctaHref: row.cta_href ?? "",
    accent: row.accent || "#1C6B35",
    videoUrl: row.video_url || null
  };
}
async function getHomeEditorialSlides() {
  try {
    const { data, error } = await supabase.from("home_editorial_slides").select("*").eq("actif", true).order("ordre", { ascending: true });
    if (error || !data) return FALLBACK_SLIDES;
    if (data.length === 0) return FALLBACK_SLIDES;
    return data.map(slideRowToEntry);
  } catch {
    return FALLBACK_SLIDES;
  }
}
const FALLBACK_MARQUEE = [
  "Saveurs du monde",
  "Arrivages quotidiens",
  "Boucherie halal sur carcasse",
  "Fruits exotiques",
  "20 000+ références",
  "60 ans d'expérience familiale"
];
async function getHomeMarqueeItems() {
  try {
    const { data, error } = await supabase.from("home_marquee_items").select("label, ordre").eq("actif", true).order("ordre", { ascending: true });
    if (error || !data) return FALLBACK_MARQUEE;
    if (data.length === 0) return FALLBACK_MARQUEE;
    return data.map((r) => String(r.label));
  } catch {
    return FALLBACK_MARQUEE;
  }
}
const FALLBACK_SEO = {
  title: "Marché de Mo' — Plus grand supermarché ethnique d'Occitanie · Toulouse",
  description: "Boucherie halal sur carcasse, fruits & légumes exotiques, épices du monde — Toulouse. Ouvert 7j/7, même dimanche matin.",
  ogImage: "/logos/logo-marchedemo-rond-contourgreen.png"
};
async function getHomeSeoSettings() {
  try {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error || !data || data.length === 0) return FALLBACK_SEO;
    const title = data.find((r) => r.key === "home_seo_title")?.value ?? FALLBACK_SEO.title;
    const description = data.find((r) => r.key === "home_seo_description")?.value ?? FALLBACK_SEO.description;
    const ogImage = data.find((r) => r.key === "home_seo_og_image")?.value ?? FALLBACK_SEO.ogImage;
    return { title, description, ogImage };
  } catch {
    return FALLBACK_SEO;
  }
}

export { $$FeedbackPopup as $, getHomeSeoSettings as a, getActus as b, $$ActuCarousel as c, $$PromoHeroV3 as d, getHomeMarqueeItems as e, getHomeEditorialSlides as g };
