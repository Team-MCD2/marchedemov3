import { c as createComponent, e as renderComponent, r as renderTemplate } from '../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import '../chunks/indexV2_CrhyxNrU.mjs';
import { $ as $$IndexV3 } from '../chunks/indexV3_B4dfkVm_.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderTemplate`${renderComponent($$result, "IndexV3", $$IndexV3, {})}` }`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/index.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
