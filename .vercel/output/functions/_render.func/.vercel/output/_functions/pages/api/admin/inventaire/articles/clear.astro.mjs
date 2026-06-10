import { clearAllArticles } from '../../../../../chunks/inventaire-db_BPwFePtL.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
async function POST() {
  try {
    const count = await clearAllArticles();
    return new Response(JSON.stringify({ count }), {
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
