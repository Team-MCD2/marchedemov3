import{p as g,a as m}from"./hoisted.DRWz8QCo.js";import{$ as n,t as f,e as o,r as v,f as b}from"./ui.B2kUQ00D.js";import"./jspdf.es.min.DqlWnO3y.js";import"./preload-helper.CLcXU_4U.js";import"./_commonjsHelpers.BosuxZz1.js";let d="";function a(t){n("#scan-empty")?.classList.toggle("hidden",t!=="empty"),n("#scan-loading")?.classList.toggle("hidden",t!=="loading"),n("#scan-result")?.classList.toggle("hidden",t!=="result")}function w(t){return/^\d{8,14}$/.test(String(t||"").trim().replace(/[\s\-]/g,""))}function h(t){const e=n("#scan-result");if(!e)return;a("result");const s=w(t),i=s?`/admin/inventaire/ajouter?code_barres=${encodeURIComponent(t)}&from=scan`:"/admin/inventaire/ajouter?from=scan";e.innerHTML=`
    <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div class="p-6 md:p-8 text-center border-b border-slate-100">
        <div class="mx-auto h-16 w-16 rounded-2xl bg-amber-50 ring-1 ring-amber-200 flex items-center justify-center text-amber-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 class="text-lg font-semibold text-slate-900">Article inconnu de l'inventaire</h2>
        <p class="text-sm text-slate-500 mt-1">
          Aucun article ne correspond à <span class="font-mono font-semibold text-slate-700">${o(t)}</span>.
        </p>
      </div>

      <div class="p-6 md:p-8 bg-gradient-to-br from-vert-50 to-emerald-50">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="flex-1">
            <h3 class="text-base font-bold text-slate-900">Voulez-vous l'ajouter à l'inventaire ?</h3>
            <p class="text-sm text-slate-600 mt-1">
              ${s?`On prérempli le code-barres pour vous. Il ne vous restera qu'à <strong class="font-semibold text-slate-900">filmer le produit</strong> puis <strong class="font-semibold text-slate-900">enregistrer</strong>.`:`Le numéro d'article sera généré automatiquement. Il vous restera juste à <strong class="font-semibold text-slate-900">filmer le produit</strong> et <strong class="font-semibold text-slate-900">enregistrer</strong>.`}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button id="btn-scan-retry" type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Non, recommencer
            </button>
            <a href="${i}"
              class="inline-flex items-center gap-1.5 rounded-lg bg-vert px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-vert-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Oui, ajouter cet article
            </a>
          </div>
        </div>
      </div>
    </div>
  `,n("#btn-scan-retry")?.addEventListener("click",()=>{const r=n("#scan-input");r&&(r.value="",r.focus()),d="",a("empty")})}function p(t){return`
    <div class="p-5 md:p-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 md:gap-6">
      <!-- Photo -->
      <div class="relative aspect-square w-full max-w-[220px] mx-auto md:mx-0 rounded-xl ring-1 ring-slate-200 bg-slate-50 overflow-hidden">
        ${t.photo_url?`<img src="${t.photo_url}" alt="${o(t.description||"")}" class="absolute inset-0 w-full h-full object-cover" />`:'<div class="absolute inset-0 flex items-center justify-center text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>'}
      </div>

      <!-- Infos -->
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span class="font-mono text-xs font-semibold text-slate-500">${o(t.numero_article||"")}</span>
          ${t.rayon?`<span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">${o(t.rayon)}</span>`:""}
          ${v(t.statut)}
        </div>
        ${t.nom_produit?`<h3 class="text-base font-semibold text-vert-700 mb-0.5">${o(t.nom_produit)}</h3>`:""}
        <h2 class="text-lg md:text-xl font-bold text-slate-900 truncate">
          ${o(t.marque||"")}${t.marque&&t.dlc?" · ":""}${o(t.dlc||"")}
        </h2>
        ${t.description?`<p class="text-sm text-slate-600 mt-1 line-clamp-3">${o(t.description)}</p>`:""}

        <dl class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Prix vente</dt>
            <dd class="mt-0.5 font-bold text-slate-900 tabular-nums">${b(t.prix_vente)||"—"}</dd>
          </div>
          <div>
            <dt class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quantité</dt>
            <dd class="mt-0.5 font-bold text-slate-900 tabular-nums">${t.quantite??0} <span class="text-xs font-normal text-slate-500">/ ${t.quantite_initiale??0}</span></dd>
          </div>
          <div>
            <dt class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Format</dt>
            <dd class="mt-0.5 text-slate-700 truncate">${o(t.format||"—")}</dd>
          </div>
          <div>
            <dt class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Magasin</dt>
            <dd class="mt-0.5 text-slate-700 truncate italic">${o(t.magasin||"—")}</dd>
          </div>
        </dl>

        <div class="mt-5 flex flex-wrap items-center gap-2">
          <button data-article-edit="true" data-article-id="${o(t.id)}" type="button"
            class="btn-scan-edit inline-flex items-center gap-1.5 rounded-lg bg-vert px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-vert-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            Éditer cet article
          </button>
        </div>
      </div>
    </div>
  `}function y(t){const e=n("#scan-result");e&&(a("result"),e.innerHTML=`
    <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
      ${p(t)}
      <div class="px-5 pb-5 flex gap-2">
        <button id="btn-scan-new" type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Nouveau scan
        </button>
      </div>
    </div>
  `,x(e,[t]))}function k(t){if(!t||!t.length){a("empty");return}if(t.length===1){y(t[0]);return}const e=n("#scan-result");e&&(a("result"),e.innerHTML=`
    <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 bg-amber-50">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span class="text-sm font-semibold text-amber-800">
            ${t.length} articles partagent ce code-barres
          </span>
        </div>
      </div>
      <div class="divide-y divide-slate-100">
        ${t.map(s=>`
          <div class="hover:bg-slate-50 transition">
            ${p(s)}
          </div>
        `).join("")}
      </div>
      <div class="px-5 pb-5 pt-2">
        <button id="btn-scan-new" type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Nouveau scan
        </button>
      </div>
    </div>
  `,x(e,t))}function x(t,e){t.querySelectorAll(".btn-scan-edit").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.articleId,r=e.find(l=>l.id===i)||e[0];typeof window.__mdm?.openEditModal=="function"&&window.__mdm.openEditModal(r)})}),t.querySelector("#btn-scan-new")?.addEventListener("click",()=>{const s=n("#scan-input");s&&(s.value="",s.focus()),d="",a("empty")})}async function c(t){const e=String(t||"").trim().replace(/[\s\-]/g,"");if(!e){a("empty");return}if(e===d)return;d=e;const s=n("#scan-loading-code");s&&(s.textContent=e),a("loading");try{const i=await fetch(`/api/admin/inventaire/articles/search?q=${encodeURIComponent(e)}`);if(!i.ok){const l=await i.json().catch(()=>({}));throw new Error(l.error||`Erreur ${i.status}`)}const r=await i.json();if(r.found){try{g()}catch{}const l=r.articles&&r.articles.length?r.articles:r.article?[r.article]:[];k(l)}else{try{m()}catch{}h(e)}}catch(i){try{m()}catch{}f(i.message||"Erreur de recherche","error"),a("empty")}}function $(){const t=n("#scan-search-form"),e=n("#scan-input");!t||!e||(t.addEventListener("submit",s=>{s.preventDefault(),c(e.value)}),e.addEventListener("input",()=>{d=""}))}function _(){n("#btn-scan-camera")?.addEventListener("click",()=>{typeof window.__mdm?.openScanner=="function"&&window.__mdm.openScanner("photo","search")})}window.__mdm=window.__mdm||{};window.__mdm.onScanFound=t=>{const e=n("#scan-input");e&&(e.value=t),c(t)};window.__mdm.onArticleUpdated=t=>{if(d){const e=d;d="",c(e)}};function u(){$(),_()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",u):u();
