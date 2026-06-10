import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$InventaireLayout } from '../../../chunks/InventaireLayout_CG313_Rs.mjs';
import { C as COOKIE_NAME, v as verifySessionToken, s as safeNextPath } from '../../../chunks/auth_ClxGn7gk.mjs';
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$Code = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Code;
  const cookie = Astro2.cookies.get(COOKIE_NAME);
  const session = verifySessionToken(cookie?.value || "");
  const nextParam = safeNextPath(Astro2.url.searchParams.get("next")) || "/admin/inventaire/inventaire";
  if (session.ok) {
    return Astro2.redirect(nextParam);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$InventaireLayout, { "title": "March\xE9 de Mo' \u2014 Acc\xE8s", "description": "Saisissez le code d'acc\xE8s pour continuer.", "showNav": false }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-vert-50 via-white to-emerald-50"> <div class="w-full max-w-md"> <!-- Logo + titre --> <div class="text-center mb-8"> <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-vert to-emerald-600 shadow-lg ring-1 ring-vert-500/30 mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="11" width="18" height="11" rx="2"></rect> <path d="M7 11V7a5 5 0 0 1 10 0v4"></path> </svg> </div> <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
Acc\xE8s prot\xE9g\xE9
</h1> <p class="mt-2 text-sm text-slate-600">
Saisissez le code d'acc\xE8s \xE0 6&nbsp;chiffres pour ouvrir March\xE9 de Mo'.
</p> </div> <!-- Carte du formulaire --> <form id="code-form" novalidate class="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-6 md:p-8 space-y-5"> <input type="hidden" name="next"`, `> <div> <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
Code d'acc\xE8s
</label> <div id="digits" class="flex justify-center gap-2 md:gap-3"> `, ` </div> <p id="code-error" class="hidden mt-3 text-center text-sm font-semibold text-red-600"></p> </div> <button type="submit" id="submit-btn" disabled class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-vert to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-vert-200 transition hover:shadow-xl hover:from-vert-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"> <span id="submit-label">D\xE9verrouiller</span> <svg id="submit-spinner" xmlns="http://www.w3.org/2000/svg" class="hidden h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M21 12a9 9 0 1 1-6.219-8.56"></path> </svg> </button> <p class="text-center text-xs text-slate-600">
Session active 30&nbsp;minutes. Au-del\xE0, le code sera redemand\xE9 automatiquement.
</p> </form> </div> </main> <script>
    (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initCodePage) : initCodePage());

    function initCodePage() {
      const form     = document.getElementById('code-form');
      if (!form) return;
      const inputs   = Array.from(document.querySelectorAll('.digit'));
      const submit   = document.getElementById('submit-btn');
      const label    = document.getElementById('submit-label');
      const spinner  = document.getElementById('submit-spinner');
      const errorEl  = document.getElementById('code-error');
      const nextEl   = form.querySelector('input[name="next"]');

      const onlyDigits = (s) => (s || '').replace(/\\D+/g, '');

      function getCode() {
        return inputs.map((i) => i.value).join('');
      }

      function refreshSubmit() {
        submit.disabled = getCode().length !== 6;
      }

      function clearError() {
        errorEl.classList.add('hidden');
        errorEl.textContent = '';
        inputs.forEach((i) => i.classList.remove('border-red-400', 'bg-red-50'));
      }

      function showError(msg) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
        inputs.forEach((i) => i.classList.add('border-red-400', 'bg-red-50'));
      }

      function setLoading(loading) {
        submit.disabled = loading || getCode().length !== 6;
        label.textContent = loading ? 'V\xE9rification\u2026' : 'D\xE9verrouiller';
        spinner.classList.toggle('hidden', !loading);
      }

      // Gestion saisie chiffre par chiffre + collage
      inputs.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
          clearError();
          const v = onlyDigits(e.target.value);
          if (!v) { input.value = ''; refreshSubmit(); return; }

          // Collage multi-chiffres dans une seule case
          if (v.length > 1) {
            const chars = v.slice(0, 6 - idx).split('');
            chars.forEach((c, k) => { if (inputs[idx + k]) inputs[idx + k].value = c; });
            const target = Math.min(idx + chars.length, inputs.length - 1);
            inputs[target].focus();
            inputs[target].select();
            refreshSubmit();
            if (getCode().length === 6) form.requestSubmit();
            return;
          }

          input.value = v;
          if (idx < inputs.length - 1) inputs[idx + 1].focus();
          refreshSubmit();
          if (getCode().length === 6) form.requestSubmit();
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !input.value && idx > 0) {
            inputs[idx - 1].focus();
            inputs[idx - 1].value = '';
            refreshSubmit();
          } else if (e.key === 'ArrowLeft' && idx > 0) {
            e.preventDefault(); inputs[idx - 1].focus();
          } else if (e.key === 'ArrowRight' && idx < inputs.length - 1) {
            e.preventDefault(); inputs[idx + 1].focus();
          }
        });

        input.addEventListener('focus', () => input.select());

        input.addEventListener('paste', (e) => {
          const txt = onlyDigits(e.clipboardData?.getData('text') || '');
          if (!txt) return;
          e.preventDefault();
          const chars = txt.slice(0, 6).split('');
          inputs.forEach((inp, k) => { inp.value = chars[k] || ''; });
          const target = Math.min(chars.length, inputs.length) - 1;
          inputs[Math.max(0, target)].focus();
          refreshSubmit();
          if (getCode().length === 6) form.requestSubmit();
        });
      });

      // Auto-focus de la premi\xE8re case
      setTimeout(() => inputs[0]?.focus(), 50);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = getCode();
        if (code.length !== 6) return;

        clearError();
        setLoading(true);

        try {
          const res = await fetch('/api/admin/inventaire/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          if (res.ok) {
            const target = nextEl.value || '/admin/inventaire/inventaire';
            window.location.replace(target);
            return;
          }

          if (res.status === 401) {
            showError('Code incorrect. R\xE9essayez.');
          } else {
            showError('Erreur serveur, r\xE9essayez dans un instant.');
          }
          // remise \xE0 z\xE9ro pour ressaisie
          inputs.forEach((i) => (i.value = ''));
          inputs[0].focus();
          refreshSubmit();
        } catch (err) {
          console.error(err);
          showError('Connexion impossible. V\xE9rifiez votre r\xE9seau.');
        } finally {
          setLoading(false);
        }
      });
    }
  <\/script> `], [" ", `<main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-vert-50 via-white to-emerald-50"> <div class="w-full max-w-md"> <!-- Logo + titre --> <div class="text-center mb-8"> <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-vert to-emerald-600 shadow-lg ring-1 ring-vert-500/30 mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="11" width="18" height="11" rx="2"></rect> <path d="M7 11V7a5 5 0 0 1 10 0v4"></path> </svg> </div> <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
Acc\xE8s prot\xE9g\xE9
</h1> <p class="mt-2 text-sm text-slate-600">
Saisissez le code d'acc\xE8s \xE0 6&nbsp;chiffres pour ouvrir March\xE9 de Mo'.
</p> </div> <!-- Carte du formulaire --> <form id="code-form" novalidate class="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-6 md:p-8 space-y-5"> <input type="hidden" name="next"`, `> <div> <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
Code d'acc\xE8s
</label> <div id="digits" class="flex justify-center gap-2 md:gap-3"> `, ` </div> <p id="code-error" class="hidden mt-3 text-center text-sm font-semibold text-red-600"></p> </div> <button type="submit" id="submit-btn" disabled class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-vert to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-vert-200 transition hover:shadow-xl hover:from-vert-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"> <span id="submit-label">D\xE9verrouiller</span> <svg id="submit-spinner" xmlns="http://www.w3.org/2000/svg" class="hidden h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M21 12a9 9 0 1 1-6.219-8.56"></path> </svg> </button> <p class="text-center text-xs text-slate-600">
Session active 30&nbsp;minutes. Au-del\xE0, le code sera redemand\xE9 automatiquement.
</p> </form> </div> </main> <script>
    (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initCodePage) : initCodePage());

    function initCodePage() {
      const form     = document.getElementById('code-form');
      if (!form) return;
      const inputs   = Array.from(document.querySelectorAll('.digit'));
      const submit   = document.getElementById('submit-btn');
      const label    = document.getElementById('submit-label');
      const spinner  = document.getElementById('submit-spinner');
      const errorEl  = document.getElementById('code-error');
      const nextEl   = form.querySelector('input[name="next"]');

      const onlyDigits = (s) => (s || '').replace(/\\\\D+/g, '');

      function getCode() {
        return inputs.map((i) => i.value).join('');
      }

      function refreshSubmit() {
        submit.disabled = getCode().length !== 6;
      }

      function clearError() {
        errorEl.classList.add('hidden');
        errorEl.textContent = '';
        inputs.forEach((i) => i.classList.remove('border-red-400', 'bg-red-50'));
      }

      function showError(msg) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
        inputs.forEach((i) => i.classList.add('border-red-400', 'bg-red-50'));
      }

      function setLoading(loading) {
        submit.disabled = loading || getCode().length !== 6;
        label.textContent = loading ? 'V\xE9rification\u2026' : 'D\xE9verrouiller';
        spinner.classList.toggle('hidden', !loading);
      }

      // Gestion saisie chiffre par chiffre + collage
      inputs.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
          clearError();
          const v = onlyDigits(e.target.value);
          if (!v) { input.value = ''; refreshSubmit(); return; }

          // Collage multi-chiffres dans une seule case
          if (v.length > 1) {
            const chars = v.slice(0, 6 - idx).split('');
            chars.forEach((c, k) => { if (inputs[idx + k]) inputs[idx + k].value = c; });
            const target = Math.min(idx + chars.length, inputs.length - 1);
            inputs[target].focus();
            inputs[target].select();
            refreshSubmit();
            if (getCode().length === 6) form.requestSubmit();
            return;
          }

          input.value = v;
          if (idx < inputs.length - 1) inputs[idx + 1].focus();
          refreshSubmit();
          if (getCode().length === 6) form.requestSubmit();
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !input.value && idx > 0) {
            inputs[idx - 1].focus();
            inputs[idx - 1].value = '';
            refreshSubmit();
          } else if (e.key === 'ArrowLeft' && idx > 0) {
            e.preventDefault(); inputs[idx - 1].focus();
          } else if (e.key === 'ArrowRight' && idx < inputs.length - 1) {
            e.preventDefault(); inputs[idx + 1].focus();
          }
        });

        input.addEventListener('focus', () => input.select());

        input.addEventListener('paste', (e) => {
          const txt = onlyDigits(e.clipboardData?.getData('text') || '');
          if (!txt) return;
          e.preventDefault();
          const chars = txt.slice(0, 6).split('');
          inputs.forEach((inp, k) => { inp.value = chars[k] || ''; });
          const target = Math.min(chars.length, inputs.length) - 1;
          inputs[Math.max(0, target)].focus();
          refreshSubmit();
          if (getCode().length === 6) form.requestSubmit();
        });
      });

      // Auto-focus de la premi\xE8re case
      setTimeout(() => inputs[0]?.focus(), 50);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = getCode();
        if (code.length !== 6) return;

        clearError();
        setLoading(true);

        try {
          const res = await fetch('/api/admin/inventaire/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          if (res.ok) {
            const target = nextEl.value || '/admin/inventaire/inventaire';
            window.location.replace(target);
            return;
          }

          if (res.status === 401) {
            showError('Code incorrect. R\xE9essayez.');
          } else {
            showError('Erreur serveur, r\xE9essayez dans un instant.');
          }
          // remise \xE0 z\xE9ro pour ressaisie
          inputs.forEach((i) => (i.value = ''));
          inputs[0].focus();
          refreshSubmit();
        } catch (err) {
          console.error(err);
          showError('Connexion impossible. V\xE9rifiez votre r\xE9seau.');
        } finally {
          setLoading(false);
        }
      });
    }
  <\/script> `])), maybeRenderHead(), addAttribute(nextParam, "value"), Array.from({ length: 6 }).map((_, i) => renderTemplate`<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="1"${addAttribute(i, "data-index")} class="digit h-14 w-12 md:h-16 md:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-2xl md:text-3xl font-bold text-slate-900 tabular-nums shadow-sm transition focus:border-vert focus:bg-white focus:outline-none focus:ring-4 focus:ring-vert-100"${addAttribute(`Chiffre ${i + 1}`, "aria-label")}>`)) })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/inventaire/code.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/inventaire/code.astro";
const $$url = "/admin/inventaire/code";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Code,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
