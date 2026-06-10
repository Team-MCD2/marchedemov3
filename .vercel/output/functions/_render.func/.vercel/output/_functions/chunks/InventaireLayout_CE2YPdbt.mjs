import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, g as defineScriptVars, h as renderSlot, e as renderComponent, i as renderHead } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
/* empty css                           */
import 'clsx';

const $$Astro$1 = createAstro("https://marchedemov2.vercel.app");
const $$InventaireNavbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$InventaireNavbar;
  const path = Astro2.url.pathname.replace(/\/+$/, "") || "/admin/inventaire";
  const BRAND_NAME = ("Marché de Mo'").toString();
  const BRAND_TAGLINE = ("Inventaire intelligent").toString();
  const links = [
    { href: "/admin", label: "Admin Global", icon: "arrow-left" },
    { href: "/admin/inventaire", label: "Accueil", icon: "home" },
    { href: "/admin/inventaire/inventaire", label: "Inventaire", icon: "box" },
    { href: "/admin/inventaire/ajouter", label: "Ajouter", icon: "plus" },
    { href: "/admin/inventaire/statistiques", label: "Statistiques", icon: "chart" },
    { href: "/admin/inventaire/scan", label: "Scan", icon: "qr" },
    { href: "/admin/inventaire/codes-barres", label: "Codes-barres", icon: "barcode" }
  ];
  function isActive(href) {
    if (href === "/admin") return path === "/admin";
    if (href === "/admin/inventaire") return path === "/admin/inventaire";
    return path === href || path.startsWith(href + "/");
  }
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200"> <div class="max-w-7xl mx-auto flex items-center gap-3 p-3 md:p-4"> <a href="/admin/inventaire" class="flex items-center gap-2.5 min-w-0 mr-2 md:mr-4"${addAttribute(`${BRAND_NAME} — Accueil inventaire`, "aria-label")}> <img src="/logos/logo-marchedemo.png"${addAttribute(BRAND_NAME, "alt")} width="40" height="40" class="h-9 w-9 md:h-10 md:w-10 shrink-0 object-contain"> <div class="min-w-0 hidden sm:block leading-tight"> <h1 class="font-display text-sm md:text-base font-bold text-vert tracking-tight truncate">${BRAND_NAME}</h1> <p class="hidden md:block text-[11px] text-slate-500 -mt-0.5">${BRAND_TAGLINE}</p> </div> </a> <nav class="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar"> ${links.map((l) => renderTemplate`<a${addAttribute(l.href, "href")}${addAttribute([
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition",
    isActive(l.href) ? "bg-vert text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  ], "class:list")}> ${l.icon === "arrow-left" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>`} ${l.icon === "home" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`} ${l.icon === "box" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`} ${l.icon === "plus" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`} ${l.icon === "chart" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>`} ${l.icon === "qr" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3h-3z"></path><path d="M20 14v3"></path><path d="M14 20h3"></path><path d="M20 20v1"></path></svg>`} ${l.icon === "barcode" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5v14"></path><path d="M7 5v14"></path><path d="M11 5v14"></path><path d="M15 5v14"></path><path d="M19 5v14"></path></svg>`} <span class="hidden sm:inline">${l.label}</span> </a>`)} </nav> </div> </header>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/InventaireNavbar.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$InventaireLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$InventaireLayout;
  const BRAND_NAME = ("Marché de Mo'").toString();
  const BRAND_TAGLINE = ("Inventaire intelligent").toString();
  const {
    title = `${BRAND_NAME} — ${BRAND_TAGLINE}`,
    description = `Outil d'inventaire ${BRAND_NAME} : caméra, analyse IA et scan code-barres pour les équipes en magasin.`,
    showNav = true
  } = Astro2.props;
  const authExpiresAt = Astro2.locals.authExpiresAt;
  return renderTemplate(_b || (_b = __template(['<html lang="fr"> <head><meta charset="UTF-8"><meta name="description"', '><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#1C6B35">', '<link rel="icon" type="image/png" href="/logos/favicon-marchedemo.png"><link rel="apple-touch-icon" href="/logos/favicon-marchedemo.png"><!-- Typekit : Filson Pro + Filson Soft (même kit que le site public) --><link rel="preconnect" href="https://use.typekit.net" crossorigin><link rel="preconnect" href="https://p.typekit.net" crossorigin><link rel="stylesheet" href="https://use.typekit.net/tci0qgy.css"><title>', "</title>", '</head> <body class="antialiased bg-white text-slate-900"> ', " ", ' <!-- Toast host (shared by every page) --> <div id="toast-host" class="fixed top-4 right-4 z-[60] space-y-2 pointer-events-none"></div> ', ' <script>\n      (() => {\n        // Triple-click placeholder copy helper\n        document.addEventListener("click", (e) => {\n          if (e.detail === 3) {\n            const input = e.target;\n            if (input && (input.tagName === "INPUT" || input.tagName === "TEXTAREA")) {\n              const placeholder = input.getAttribute("placeholder");\n              if (placeholder) {\n                const proto = input.tagName === "INPUT" \n                  ? window.HTMLInputElement.prototype \n                  : window.HTMLTextAreaElement.prototype;\n                const descriptor = Object.getOwnPropertyDescriptor(proto, "value");\n                if (descriptor && descriptor.set) {\n                  descriptor.set.call(input, placeholder);\n                  input.dispatchEvent(new Event("input", { bubbles: true }));\n                  input.dispatchEvent(new Event("change", { bubbles: true }));\n                } else {\n                  input.value = placeholder;\n                  input.dispatchEvent(new Event("input", { bubbles: true }));\n                  input.dispatchEvent(new Event("change", { bubbles: true }));\n                }\n              }\n            }\n          }\n        });\n      })();\n    </script> </body> </html>'])), addAttribute(description, "content"), authExpiresAt && renderTemplate`<meta name="dsh-session-expires-at"${addAttribute(String(authExpiresAt), "content")}>`, title, renderHead(), showNav && renderTemplate`${renderComponent($$result, "InventaireNavbar", $$InventaireNavbar, {})}`, renderSlot($$result, $$slots["default"]), authExpiresAt && renderTemplate(_a || (_a = __template(["<script>(function(){", "\n        // Auto-déconnexion côté client : on planifie un redirect vers /admin/inventaire/code\n        // pile au moment où le cookie de session expire (24h après le\n        // login). Utile si l'utilisateur reste sur la même page sans\n        // déclencher de requête au serveur.\n        (function () {\n          const remaining = expiresAt - Date.now();\n          const back = encodeURIComponent(location.pathname + location.search);\n          const target = '/admin/inventaire/code?next=' + back;\n          if (remaining <= 0) { location.replace(target); return; }\n          // setTimeout est plafonné à ~24,8 jours (int32) — sans risque ici (24h).\n          setTimeout(() => location.replace(target), remaining + 500);\n        })();\n      })();</script>"])), defineScriptVars({ expiresAt: authExpiresAt })));
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/layouts/admin/InventaireLayout.astro", void 0);

export { $$InventaireLayout as $ };
