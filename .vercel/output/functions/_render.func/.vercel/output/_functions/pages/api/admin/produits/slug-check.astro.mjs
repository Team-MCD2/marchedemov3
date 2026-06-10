import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
import '../../../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
const GET = async ({ url, cookies }) => {
  if (!await isAuthenticated(cookies)) return json({ error: "Unauthorized" }, 401);
  return json({ error: "Supabase service_role key missing" }, 500);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
