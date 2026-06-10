import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, e as renderComponent, F as Fragment, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$Breadcrumb = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { items, darkText = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav aria-label="Fil d'Ariane" class="container-mo pt-2.5 pb-0"> <ol${addAttribute(`flex flex-wrap items-center gap-2 text-[13px] ${darkText ? "text-white/70" : "text-neutral-500"} font-pro`, "class")}> <li> <a href="/"${addAttribute(`hover:underline ${darkText ? "hover:text-white" : "hover:text-vert"}`, "class")}>Accueil</a> </li> ${items.map((item) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <li aria-hidden="true" class="opacity-40">/</li> <li> ${item.href ? renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`hover:underline ${darkText ? "hover:text-white" : "hover:text-vert"}`, "class")}> ${item.name} </a>` : renderTemplate`<span${addAttribute(darkText ? "text-white" : "text-neutral-900", "class")}>${item.name}</span>`} </li> ` })}`)} </ol> </nav>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/Breadcrumb.astro", void 0);

export { $$Breadcrumb as $ };
