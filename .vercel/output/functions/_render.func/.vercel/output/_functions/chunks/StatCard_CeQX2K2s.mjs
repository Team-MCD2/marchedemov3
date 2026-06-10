import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment, u as unescapeHTML } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const $$StatCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StatCard;
  const {
    label,
    value,
    total,
    delta,
    deltaSuffix = "",
    href,
    tone = "neutral",
    icon,
    hint
  } = Astro2.props;
  const toneToClass = {
    vert: { bar: "bg-vert", text: "text-vert-dark", bg: "bg-vert/10" },
    rouge: { bar: "bg-rouge", text: "text-rouge", bg: "bg-rouge/10" },
    noir: { bar: "bg-noir", text: "text-noir", bg: "bg-noir/10" },
    orange: { bar: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-100" },
    neutral: { bar: "bg-neutral-300", text: "text-neutral-700", bg: "bg-neutral-100" }
  };
  const t = toneToClass[tone];
  const Tag = href ? "a" : "div";
  const baseClass = `relative bg-white rounded-3xl p-5 md:p-6 shadow-card ${href ? "hover:shadow-card-hover transition-all hover:-translate-y-0.5 group block" : ""}`;
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "class": baseClass }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<span${addAttribute(["absolute left-0 top-5 bottom-5 w-1 rounded-r", t.bar], "class:list")} aria-hidden="true"></span> <div class="flex items-start justify-between gap-3"> <p class="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-bold">${label}</p> ${icon && renderTemplate`<span${addAttribute(["w-7 h-7 rounded-full flex items-center justify-center text-[14px]", t.bg], "class:list")} aria-hidden="true"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(icon)}` })} </span>`} </div> <div class="flex items-baseline gap-2 mt-3"> <span class="font-soft font-bold text-[36px] md:text-[42px] leading-none text-noir tabular-nums"> ${value} </span> ${total != null && renderTemplate`<span class="text-[13px] text-neutral-400 tabular-nums">/ ${total}</span>`} </div> <div class="mt-3 flex items-center gap-2 text-[12px]"> ${typeof delta === "number" && delta !== 0 && renderTemplate`<span${addAttribute([
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold tabular-nums",
    delta > 0 ? "bg-vert/10 text-vert-dark" : "bg-rouge/10 text-rouge"
  ], "class:list")}${addAttribute(`Variation 7 jours`, "title")}> ${delta > 0 ? "\u25B2" : "\u25BC"} ${Math.abs(delta)} ${deltaSuffix && renderTemplate`<span class="font-normal opacity-70 ml-0.5">${deltaSuffix}</span>`} </span>`} ${typeof delta === "number" && delta === 0 && renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-bold">
— stable
</span>`} ${hint && renderTemplate`<span class="text-neutral-500">${hint}</span>`} </div> ${href && renderTemplate`<span class="absolute right-5 bottom-5 text-[12px] font-bold text-neutral-400 group-hover:text-vert transition">
Gérer →
</span>`}` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/components/admin/StatCard.astro", void 0);

export { $$StatCard as $ };
