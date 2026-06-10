import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$FAQAccordion = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FAQAccordion;
  const {
    items,
    title = "Questions fr\xE9quentes",
    eyebrow = "FAQ",
    compact = false
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(compact ? "py-12" : "section bg-blanc", "class")}> <div class="container-mo grid lg:grid-cols-12 gap-10 lg:gap-16"> <!-- Left : heading --> <div class="lg:col-span-4"> <span class="eyebrow">${eyebrow}</span> <h2 class="display-md mt-4 text-balance">${title}</h2> <p class="mt-4 text-neutral-600 text-[15px] leading-relaxed max-w-sm">
Vous ne trouvez pas votre réponse ?
<a href="/service-client" class="text-vert font-bold underline underline-offset-4 hover:text-vert-dark transition">
Contactez notre service client
</a>.
</p> </div> <!-- Right : accordion --> <div class="lg:col-span-8"> <div class="divide-y divide-black/10"> ${items.map((item, i) => renderTemplate`<details class="faq-item"${addAttribute(i === 0, "open")}> <summary> <span class="flex-1">${item.q}</span> </summary> <div class="faq-answer">${unescapeHTML(item.r)}</div> </details>`)} </div> </div> </div> </section>`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/FAQAccordion.astro", void 0);

export { $$FAQAccordion as $ };
