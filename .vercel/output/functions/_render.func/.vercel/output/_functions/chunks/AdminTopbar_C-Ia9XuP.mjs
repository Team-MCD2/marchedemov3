import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, e as renderComponent } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { S as SITE } from './site_dG8pplQb.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                         */

function KeyboardHelpOverlay() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function isTyping(target) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if (target.isContentEditable) return true;
      return false;
    }
    function onKey(e) {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "?" && !isTyping(e.target)) {
        e.preventDefault();
        setOpen((cur) => !cur);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "kb-help-title",
      className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
      onClick: (e) => {
        if (e.target === e.currentTarget) setOpen(false);
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("header", { className: "px-6 py-4 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white z-10", children: [
              /* @__PURE__ */ jsx("h2", { id: "kb-help-title", className: "font-soft font-bold text-[18px]", children: "Raccourcis clavier" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setOpen(false),
                  "aria-label": "Fermer (Échap)",
                  className: "w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12", strokeLinecap: "round" }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
              /* @__PURE__ */ jsxs(Section, { title: "Navigation", children: [
                /* @__PURE__ */ jsx(Row, { keys: ["?"], label: "Ouvrir / fermer cette aide" }),
                /* @__PURE__ */ jsx(Row, { keys: ["Échap"], label: "Fermer modale ou aide" }),
                /* @__PURE__ */ jsx(Row, { keys: ["/"], label: "Focus sur la barre de recherche" })
              ] }),
              /* @__PURE__ */ jsxs(Section, { title: "Listes (produits / promos)", children: [
                /* @__PURE__ */ jsx(Row, { keys: ["n"], label: "Nouveau produit / nouvelle promo" }),
                /* @__PURE__ */ jsx(Row, { keys: ["r"], label: "Mode réorganisation" }),
                /* @__PURE__ */ jsx(Row, { keys: ["↑", "↓"], label: "Naviguer entre les rangs (en mode réorg.)" })
              ] }),
              /* @__PURE__ */ jsxs(Section, { title: "Modale d'édition", children: [
                /* @__PURE__ */ jsx(Row, { keys: ["Ctrl", "S"], altKeys: ["⌘", "S"], label: "Enregistrer" }),
                /* @__PURE__ */ jsx(Row, { keys: ["Échap"], label: "Annuler / fermer" })
              ] }),
              /* @__PURE__ */ jsxs(Section, { title: "Arborescence catalogue", children: [
                /* @__PURE__ */ jsx(Row, { keys: ["↑", "↓"], label: "Rang précédent / suivant" }),
                /* @__PURE__ */ jsx(Row, { keys: ["→"], label: "Déplier la branche" }),
                /* @__PURE__ */ jsx(Row, { keys: ["←"], label: "Replier la branche" }),
                /* @__PURE__ */ jsx(Row, { keys: ["Entrée"], label: "Ouvrir la page de la branche" }),
                /* @__PURE__ */ jsx(Row, { keys: ["Début", "Fin"], label: "Premier / dernier rang" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("footer", { className: "px-6 py-3 border-t border-black/5 bg-white/50 text-[]-neutral-600 sticky bottom-0", children: [
              "Astuce : tapez ",
              /* @__PURE__ */ jsx(Kbd, { children: "?" }),
              " n'importe où (sauf dans un champ de texte) pour rouvrir cette aide."
            ] })
          ]
        }
      )
    }
  );
}
function Section({ title, children }) {
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("h3", { className: "text-[]-neutral-600 uppercase tracking-wider mb-2", children: title }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children })
  ] });
}
function Row({ keys, altKeys, label }) {
  return /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 text-[13px]", children: [
    /* @__PURE__ */ jsx("span", { className: "text-neutral-700", children: label }),
    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 shrink-0", children: [
      keys.map((k, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        i > 0 && /* @__PURE__ */ jsx("span", { className: "text-neutral-300", children: "+" }),
        /* @__PURE__ */ jsx(Kbd, { children: k })
      ] }, i)),
      altKeys && /* @__PURE__ */ jsxs("span", { className: "ml-1 flex items-center gap-1 text-neutral-500", children: [
        /* @__PURE__ */ jsx("span", { children: "·" }),
        altKeys.map((k, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          i > 0 && /* @__PURE__ */ jsx("span", { children: "+" }),
          /* @__PURE__ */ jsx(Kbd, { subtle: true, children: k })
        ] }, i))
      ] })
    ] })
  ] });
}
function Kbd({ children, subtle }) {
  return /* @__PURE__ */ jsx(
    "kbd",
    {
      className: `inline-block min-w-[1.5rem] text-center px-1.5 py-0.5 rounded text-[]-neutral-600"
          : "bg-noir text-white border-noir"
      }`,
      children
    }
  );
}

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$AdminTopbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminTopbar;
  const { current, subtitle } = Astro2.props;
  const navItems = [
    { id: "dashboard", label: "Tableau de bord", href: "/admin", icon: "📊" },
    { id: "inventaire", label: "Inventaire", href: "/admin/inventaire/inventaire", icon: "📦" },
    { id: "catalogue", label: "Catalogue", href: "/admin/catalogue", icon: "🌳" },
    { id: "promos", label: "Promos", href: "/admin/promos", icon: "🏷" },
    { id: "actus", label: "Actualités", href: "/admin/actus", icon: "📰" },
    { id: "contenu-home", label: "Accueil", href: "/admin/contenu-home", icon: "🏠" },
    { id: "produits", label: "Produits", href: "/admin/produits", icon: "🛒" },
    { id: "medias", label: "Images", href: "/admin/medias", icon: "🖼" },
    { id: "banners", label: "Bannières", href: "/admin/banners", icon: "🎨" },
    { id: "images-gap", label: "Manquantes", href: "/admin/images-gap", icon: "⚠" },
    { id: "affiches", label: "Affiches A4", href: "/admin/generateur-affiche", icon: "🖨" }
  ];
  const vercelEnv = typeof process !== "undefined" && process.env && process.env.VERCEL_ENV || null;
  let envLabel;
  let envToneClass;
  let envDotClass;
  if (vercelEnv === "preview") {
    envLabel = "Preview";
    envToneClass = "bg-blue-50 text-blue-700 border-blue-200";
    envDotClass = "bg-blue-500";
  } else {
    envLabel = "Production";
    envToneClass = "bg-vert/10 text-vert-dark border-vert/30";
    envDotClass = "bg-vert";
  }
  const showSubtitle = !!subtitle;
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 bg-white/95 border-b border-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/80" data-astro-cid-expxuqem> <div class="container-mo" data-astro-cid-expxuqem> <!-- Row 1 : brand + env badge + actions --> <div class="flex items-center justify-between h-14 gap-3" data-astro-cid-expxuqem> <div class="flex items-center gap-3 min-w-0" data-astro-cid-expxuqem> <a href="/admin" class="flex items-center gap-3 shrink-0 group" data-astro-cid-expxuqem> <img src="/logos/favicon-marchedemo.png" alt="" class="h-7 w-7 rounded-md ring-1 ring-black/5 group-hover:ring-vert/40 transition" aria-hidden="true" data-astro-cid-expxuqem> <div class="hidden sm:flex flex-col leading-tight" data-astro-cid-expxuqem> <p class="text-[10px] uppercase tracking-[0.18em] font-bold text-neutral-400" data-astro-cid-expxuqem>
Admin ${SITE.name} </p> <p class="font-soft font-bold text-[14px] truncate max-w-[18ch] md:max-w-none" data-astro-cid-expxuqem> ${showSubtitle ? subtitle : "Tableau de bord"} </p> </div> </a> <span${addAttribute([
    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
    envToneClass
  ], "class:list")}${addAttribute(`Environnement : ${envLabel}`, "title")} data-astro-cid-expxuqem> <span${addAttribute(["w-1.5 h-1.5 rounded-full", envDotClass], "class:list")} aria-hidden="true" data-astro-cid-expxuqem></span> ${envLabel} </span> </div> <div class="flex items-center gap-2 shrink-0" data-astro-cid-expxuqem> <!-- Theme Picker Popover (DA-aware swatch grid + intensity) - ONLY visible on affiches --> ${current === "affiches" && renderTemplate`<details id="admin-theme-picker" class="relative group" data-astro-cid-expxuqem> <summary class="list-none flex items-center gap-1.5 cursor-pointer rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[12px] font-bold pl-2.5 pr-3 py-1.5 border border-black/10 transition select-none" aria-label="Sélectionner le thème et l'intensité de l'administration" title="Thème de l'admin" data-astro-cid-expxuqem> <span id="admin-theme-trigger-icon" class="text-[14px] leading-none" aria-hidden="true" data-astro-cid-expxuqem>🌳</span> <span id="admin-theme-trigger-name" class="hidden md:inline" data-astro-cid-expxuqem>Standard</span> <span id="admin-theme-trigger-intensity" class="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-neutral-400" aria-hidden="true" data-astro-cid-expxuqem> <span class="hidden sm:inline" data-astro-cid-expxuqem>·</span> <span class="hidden sm:inline" data-astro-cid-expxuqem>Discret</span> </span> <svg class="w-3 h-3 text-neutral-400 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-expxuqem> <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-expxuqem></path> </svg> </summary> <div class="absolute right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-card border border-black/5 p-3 z-50" role="dialog" aria-label="Sélection du thème et de l'intensité" data-astro-cid-expxuqem> <p class="text-[10px] uppercase tracking-[0.18em] font-bold text-neutral-400 mb-2 px-1" data-astro-cid-expxuqem>
Thème
</p> <div class="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Thème" data-astro-cid-expxuqem> ${[
    { v: "default", icon: "🌳", name: "Standard", swatchA: "#1C6B35", swatchB: "#8B1919" },
    { v: "spring", icon: "🌸", name: "Printemps", swatchA: "#7CB342", swatchB: "#FF7043" },
    { v: "summer", icon: "☀️", name: "Été", swatchA: "#FB8C00", swatchB: "#E91E63" },
    { v: "autumn", icon: "🍂", name: "Automne", swatchA: "#D84315", swatchB: "#FF8F00" },
    { v: "winter", icon: "❄️", name: "Hiver", swatchA: "#1976D2", swatchB: "#E53935" },
    { v: "ramadan", icon: "🌙", name: "Ramadan", swatchA: "#1C6B35", swatchB: "#FFD700" },
    { v: "christmas", icon: "�", name: "Noël", swatchA: "#2E7D32", swatchB: "#C62828" },
    { v: "easter", icon: "🐰", name: "Pâques", swatchA: "#9C27B0", swatchB: "#FFC107" }
  ].map((t) => renderTemplate`<button type="button"${addAttribute(t.v, "data-theme-value")} class="theme-swatch group/swatch relative flex flex-col items-center gap-1 p-2 rounded-xl border border-transparent hover:bg-neutral-50 hover:border-black/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-vert/40" role="radio" aria-checked="false"${addAttribute(t.name, "aria-label")}${addAttribute(t.name, "title")} data-astro-cid-expxuqem> <span class="relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-black/10" data-astro-cid-expxuqem> <span class="absolute inset-0"${addAttribute(`background: linear-gradient(135deg, ${t.swatchA} 0%, ${t.swatchA} 50%, ${t.swatchB} 50%, ${t.swatchB} 100%);`, "style")} data-astro-cid-expxuqem></span> <span class="relative text-[14px] drop-shadow-sm" aria-hidden="true" data-astro-cid-expxuqem>${t.icon}</span> </span> <span class="text-[10px] font-bold text-neutral-600 leading-tight text-center" data-astro-cid-expxuqem>${t.name}</span> </button>`)} </div> <hr class="my-3 border-black/5" data-astro-cid-expxuqem> <p class="text-[10px] uppercase tracking-[0.18em] font-bold text-neutral-400 mb-2 px-1" data-astro-cid-expxuqem>
Intensité
</p> <div class="grid grid-cols-2 gap-1.5 bg-neutral-100 rounded-full p-1" role="radiogroup" aria-label="Intensité" data-astro-cid-expxuqem> <button type="button" data-intensity-value="subtle" class="intensity-pill flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] font-bold transition" role="radio" aria-checked="true" title="Discret : la marque vert/rouge reste, seuls les accents décoratifs changent." data-astro-cid-expxuqem> <span aria-hidden="true" data-astro-cid-expxuqem>✦</span> <span data-astro-cid-expxuqem>Discret</span> </button> <button type="button" data-intensity-value="bold" class="intensity-pill flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] font-bold transition" role="radio" aria-checked="false" title="Affirmé : la marque vert/rouge est remplacée par la palette du thème (prise de contrôle complète)." data-astro-cid-expxuqem> <span aria-hidden="true" data-astro-cid-expxuqem>✸</span> <span data-astro-cid-expxuqem>Affirmé</span> </button> </div> <p class="mt-2 text-[10.5px] leading-snug text-neutral-400 px-1" data-astro-cid-expxuqem> <strong class="text-neutral-500 font-bold" data-astro-cid-expxuqem>Discret</strong> préserve la couleur de marque · <strong class="text-neutral-500 font-bold" data-astro-cid-expxuqem>Affirmé</strong> la remplace par celle du thème.
</p> </div> </details>`} <a href="/" class="text-[12px] text-neutral-500 hover:text-vert transition hidden md:inline-flex items-center gap-1" data-astro-cid-expxuqem> <span data-astro-cid-expxuqem>Voir le site</span> <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-expxuqem> <path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-expxuqem></path> </svg> </a> <details class="relative group" data-astro-cid-expxuqem> <summary class="list-none flex items-center gap-2 cursor-pointer rounded-full px-2 py-1 hover:bg-neutral-100 transition" aria-label="Menu administrateur" data-astro-cid-expxuqem> <span class="w-7 h-7 rounded-full bg-noir text-white text-[11px] font-bold flex items-center justify-center" aria-hidden="true" data-astro-cid-expxuqem>M</span> <span class="text-[12px] font-bold hidden sm:inline" data-astro-cid-expxuqem>Admin</span> <svg class="w-3 h-3 text-neutral-400 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-expxuqem> <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-expxuqem></path> </svg> </summary> <div class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-black/5 p-2 z-50" data-astro-cid-expxuqem> <a href="/admin" class="block px-3 py-2 rounded-lg text-[13px] font-bold hover:bg-white" data-astro-cid-expxuqem>
Tableau de bord
</a> <a href="/admin/inventaire/inventaire" class="block px-3 py-2 rounded-lg text-[13px] font-bold text-vert hover:bg-white" data-astro-cid-expxuqem>
Gestion Inventaire 📦
</a> <a href="/admin/medias" class="block px-3 py-2 rounded-lg text-[13px] hover:bg-white" data-astro-cid-expxuqem>
Images
</a> <a href="/admin/banners" class="block px-3 py-2 rounded-lg text-[13px] hover:bg-white" data-astro-cid-expxuqem>
Bannières (cultures & catégories)
</a> <a href="/admin/actus" class="block px-3 py-2 rounded-lg text-[13px] hover:bg-white" data-astro-cid-expxuqem>
Actualités & blog
</a> <a href="/admin/contenu-home" class="block px-3 py-2 rounded-lg text-[13px] hover:bg-white" data-astro-cid-expxuqem>
Contenu page d'accueil
</a> <a href="/admin/generateur-affiche" class="block px-3 py-2 rounded-lg text-[13px] hover:bg-white" data-astro-cid-expxuqem>
Générateur d'affiches A4
</a> <a href="/admin/images-gap" class="block px-3 py-2 rounded-lg text-[13px] hover:bg-white" data-astro-cid-expxuqem>
Produits sans image
</a> <button type="button" data-kb-help-open class="block w-full text-left px-3 py-2 rounded-lg text-[13px] hover:bg-white" data-astro-cid-expxuqem>
Raccourcis clavier
<span class="float-right text-[11px] text-neutral-400 font-mono" data-astro-cid-expxuqem>?</span> </button> <a href="/" class="block px-3 py-2 rounded-lg text-[13px] hover:bg-white md:hidden" data-astro-cid-expxuqem>
Voir le site public
</a> <hr class="my-1 border-black/5" data-astro-cid-expxuqem> <a href="/api/logout" class="block px-3 py-2 rounded-lg text-[13px] font-bold text-rouge hover:bg-rouge/5" data-astro-cid-expxuqem>
Déconnexion
</a> </div> </details> </div> </div> <!-- Row 2 : nav --> <nav class="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1" aria-label="Sections administrateur" data-astro-cid-expxuqem> ${navItems.map((n) => renderTemplate`<a${addAttribute(n.href, "href")}${addAttribute([
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition",
    current === n.id ? "bg-noir text-white shadow-card" : "text-neutral-600 hover:bg-white hover:text-noir"
  ], "class:list")}${addAttribute(current === n.id ? "page" : void 0, "aria-current")} data-astro-cid-expxuqem> <span aria-hidden="true" class="text-[11px]" data-astro-cid-expxuqem>${n.icon}</span> ${n.label} </a>`)} </nav> </div> </header> <!-- Mounted once per admin page : "?" anywhere opens the cheatsheet.
     \`client:idle\` so the heavy React subtree loads only after the
     critical content has painted ; the keyboard listener attaches
     immediately on idle. --> ${renderComponent($$result, "KeyboardHelpOverlay", KeyboardHelpOverlay, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@components/islands/admin/KeyboardHelpOverlay.jsx", "client:component-export": "default", "data-astro-cid-expxuqem": true })}  `;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/AdminTopbar.astro", void 0);

export { $$AdminTopbar as $ };
