import { listArticles, createArticle } from '../../../../chunks/inventaire-db_BPwFePtL.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function GET({ url }) {
  try {
    const full = url.searchParams.get("full") === "1";
    return json({ articles: await listArticles({ lite: !full }) });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
async function POST({ request }) {
  try {
    const data = await request.json();
    if (Array.isArray(data)) {
      const { createArticles } = await import('../../../../chunks/inventaire-db_BPwFePtL.mjs');
      const results = await createArticles(data);
      return json({ articles: results, count: results.length }, 201);
    }
    const article = await createArticle(data);
    return json({ article }, 201);
  } catch (e) {
    const msg = /UNIQUE.*numero_article/i.test(e.message) ? `Le numéro d'article existe déjà.` : e.message;
    return json({ error: msg }, 400);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
