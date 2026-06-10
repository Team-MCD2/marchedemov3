import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_D6bhTD9n.mjs';
import { S as SITE } from '../../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  function safeNext(raw) {
    if (!raw) return "/admin";
    if (!raw.startsWith("/admin")) return "/admin";
    if (raw.startsWith("//") || raw.includes("\\")) return "/admin";
    return raw;
  }
  const next = safeNext(Astro2.url.searchParams.get("next"));
  if (await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect(next);
  }
  const error = Astro2.url.searchParams.has("error");
  const expired = Astro2.url.searchParams.get("expired") === "1";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Acc\xE8s admin \xB7 ${SITE.name}`, "description": "Connexion \xE0 l'espace d'administration du site.", "noIndex": true, "hideChrome": true, "data-astro-cid-rf56lckb": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen grid lg:grid-cols-2 bg-blanc" data-astro-cid-rf56lckb> <!-- Left : visual --> <aside class="hidden lg:flex relative overflow-hidden bg-noir-section items-center justify-center p-16" data-astro-cid-rf56lckb> <img src="/logos/favicon-marchedemo-contourwh.png" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-contain opacity-[0.07]" data-astro-cid-rf56lckb> <div class="relative z-10 text-white max-w-md" data-astro-cid-rf56lckb> <img src="/logos/favicon-marchedemo-contourwh.png"${addAttribute(SITE.name, "alt")} class="h-16 mb-10" data-astro-cid-rf56lckb> <h1 class="font-soft font-bold text-[40px] leading-[0.95] text-balance" data-astro-cid-rf56lckb>
Espace<br data-astro-cid-rf56lckb> <span class="text-vert-light" data-astro-cid-rf56lckb>administration</span>.
</h1> <p class="mt-6 text-white/70 text-[15px] leading-relaxed" data-astro-cid-rf56lckb>
Gestion du site, des promos, des offres d'emploi et des demandes reçues.
</p> </div> </aside> <!-- Right : form --> <section class="flex items-center justify-center p-6 md:p-12" data-astro-cid-rf56lckb> <div class="w-full max-w-md" data-astro-cid-rf56lckb> <a href="/" class="inline-flex items-center gap-2 text-[13px] text-neutral-500 hover:text-vert transition" data-astro-cid-rf56lckb> <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-rf56lckb><path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-rf56lckb></path></svg>
Retour au site
</a> <h2 class="display-md mt-6" data-astro-cid-rf56lckb>${expired ? "Session expir\xE9e" : "Connexion"}</h2> <p class="mt-3 text-[14.5px] text-neutral-500" data-astro-cid-rf56lckb> ${expired ? "Votre session admin a expir\xE9. Reconnectez-vous \u2014 vos modifications en cours ont \xE9t\xE9 sauvegard\xE9es localement et seront restaur\xE9es." : "R\xE9serv\xE9 \xE0 l'\xE9quipe administrative."} </p> ${expired && renderTemplate`<div class="mt-4 bg-orange-50 border border-orange-200 text-orange-900 text-[12.5px] rounded-xl p-3 flex items-start gap-2" data-astro-cid-rf56lckb> <span aria-hidden="true" data-astro-cid-rf56lckb>⚠</span> <span data-astro-cid-rf56lckb>
Pas d'inquiétude : le formulaire que vous étiez en train de remplir est conservé en mémoire de session jusqu'à 1 h.
</span> </div>`} <form method="POST" action="/api/login" class="mt-8 space-y-4" data-astro-cid-rf56lckb> <input type="hidden" name="next"${addAttribute(next, "value")} data-astro-cid-rf56lckb> <div data-astro-cid-rf56lckb> <label for="password" class="block text-[13px] font-bold mb-1.5" data-astro-cid-rf56lckb>Mot de passe</label> <div class="relative" data-astro-cid-rf56lckb> <input id="password" name="password" type="password" required autocomplete="current-password" autofocus class="input-admin pr-12" data-astro-cid-rf56lckb> <button type="button" id="toggle-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-noir transition" aria-label="Afficher le mot de passe" data-astro-cid-rf56lckb> <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-rf56lckb> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-rf56lckb></path> <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-rf56lckb></circle> </svg> </button> </div>  </div> ${error && renderTemplate`<div class="bg-rouge/10 border border-rouge/20 text-rouge text-[13.5px] rounded-xl p-3" data-astro-cid-rf56lckb>
Mot de passe incorrect.
</div>`} <button type="submit" class="btn btn-primary w-full justify-center mt-2" data-astro-cid-rf56lckb>
Se connecter
</button> </form> <p class="mt-12 text-[]-neutral-600 font-pro" data-astro-cid-rf56lckb>
Accès oublié ? Contactez l'<a${addAttribute(`mailto:${SITE.agence.url}`, "href")} class="text-vert underline underline-offset-2" data-astro-cid-rf56lckb>agence</a>.
</p> </div> </section> </main> ` })} `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/login.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
