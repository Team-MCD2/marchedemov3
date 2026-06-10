import { C as COOKIE_NAME } from '../../../../../chunks/auth_ClxGn7gk.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
async function POST({ cookies }) {
  cookies.delete(COOKIE_NAME, { path: "/" });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
