import { nextNumArticle } from '../../../../chunks/inventaire-db_BPwFePtL.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
async function GET() {
  try {
    return new Response(JSON.stringify({ num: await nextNumArticle() }), {
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
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
