import { deleteArticle, getArticle, updateArticle } from '../../../../../chunks/inventaire-db_BPwFePtL.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function GET({ params }) {
  const article = await getArticle(params.id);
  if (!article) return json({ error: "Article introuvable" }, 404);
  return json({ article });
}
async function PUT({ params, request }) {
  try {
    const data = await request.json();
    const article = await updateArticle(params.id, data);
    if (!article) return json({ error: "Article introuvable" }, 404);
    return json({ article });
  } catch (e) {
    return json({ error: e.message }, 400);
  }
}
async function DELETE({ params }) {
  const ok = await deleteArticle(params.id);
  return json({ ok }, ok ? 200 : 404);
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
