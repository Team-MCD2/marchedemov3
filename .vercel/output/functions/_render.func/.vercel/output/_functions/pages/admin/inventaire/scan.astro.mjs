import { c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$InventaireLayout } from '../../../chunks/InventaireLayout_CE2YPdbt.mjs';
import { $ as $$ScannerModal } from '../../../chunks/ScannerModal_BQsR2ysp.mjs';
import { $ as $$EditModal } from '../../../chunks/EditModal_C81yTaCE.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const $$Scan = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$InventaireLayout, { "title": "Scanner un produit \u2014 March\xE9 de Mo'" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6"> <div> <div class="text-xs font-semibold text-vert uppercase tracking-wider">Recherche</div> <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Scanner un produit</h1> <p class="text-sm text-slate-600 mt-1">Scannez un code-barres ou tapez un numéro d'article pour ouvrir sa fiche directement.</p> </div> <!-- Search box --> <section class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4 md:p-5"> <form id="scan-search-form" class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 md:gap-3"> <div class="relative"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg> <input id="scan-input" type="text" inputmode="numeric" placeholder="Saisir un code ou scanner" autofocus autocomplete="off" spellcheck="false" class="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm font-mono shadow-sm focus:border-vert focus:ring-2 focus:ring-vert/20 focus:outline-none"> </div> <button id="btn-scan-search" type="submit" title="Rechercher (Entrée)" class="inline-flex items-center justify-center gap-2 rounded-lg bg-vert px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-vert-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-vert focus-visible:ring-offset-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
Rechercher
</button> <button id="btn-scan-camera" type="button" class="inline-flex items-center justify-center gap-2 rounded-lg bg-vert px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-vert-800"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3h-3z"></path><path d="M20 14v3"></path><path d="M14 20h3"></path></svg>
Caméra
</button> </form> <p class="mt-2 text-[11px] text-slate-500">Tapez le code et appuyez sur <strong>Entrée</strong> ou cliquez sur <strong>Rechercher</strong>. La caméra déclenche la recherche automatiquement après scan.</p> </section> <!-- Result panel --> <section id="scan-result" class="hidden"> <!-- Filled dynamically by scripts/scan.js --> </section> <!-- Empty state --> <section id="scan-empty" class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-10 md:p-14 text-center"> <div class="mx-auto h-16 w-16 rounded-2xl bg-vert-50 ring-1 ring-vert-200 flex items-center justify-center text-vert mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg> </div> <h2 class="text-lg font-semibold text-slate-900">Prêt à scanner</h2> <p class="text-sm text-slate-500 mt-1 max-w-md mx-auto">
Pointez la caméra sur un code-barres ou tapez un numéro d'article dans le champ ci-dessus.
</p> </section> <!-- Loading state --> <section id="scan-loading" class="hidden bg-gradient-to-br from-vert-50 via-emerald-50 to-teal-50 rounded-2xl shadow-sm ring-1 ring-vert-200 p-12 text-center"> <div class="relative h-20 w-20 mx-auto mb-5"> <div class="absolute inset-0 rounded-full bg-vert/30 animate-ping"></div> <div class="absolute inset-0 rounded-full bg-vert-100 ring-4 ring-vert-200 flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-vert animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5v14"></path><path d="M7 5v14"></path><path d="M11 5v14"></path><path d="M15 5v14"></path><path d="M19 5v14"></path></svg> </div> </div> <p class="text-base font-bold text-slate-900">Code-barres reconnu !</p> <p id="scan-loading-code" class="font-mono text-xs text-slate-500 mt-1"></p> <div class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-vert-700"> <div class="h-3 w-3 rounded-full border-2 border-vert-300 border-t-vert animate-spin"></div>
Recherche dans la base…
</div> </section> </main> ${renderComponent($$result2, "ScannerModal", $$ScannerModal, {})} ${renderComponent($$result2, "EditModal", $$EditModal, {})}  ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/inventaire/scan.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/inventaire/scan.astro";
const $$url = "/admin/inventaire/scan";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Scan,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
