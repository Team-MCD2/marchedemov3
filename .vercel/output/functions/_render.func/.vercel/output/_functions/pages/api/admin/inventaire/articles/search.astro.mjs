import { findArticleByCode } from '../../../../../chunks/inventaire-db_BPwFePtL.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function GET({ url }) {
  const q = String(url.searchParams.get("q") || "").trim();
  if (!q) return json({ error: "Paramètre `q` requis" }, 400);
  try {
    const result = await findArticleByCode(q);
    return json(result);
  } catch (err) {
    return json({ error: err.message || "Erreur de recherche" }, 500);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
