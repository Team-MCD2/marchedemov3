import { g as getRoleForCode, m as makeSessionToken, C as COOKIE_NAME, S as SESSION_TTL_MS } from '../../../../../chunks/auth_ClxGn7gk.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
async function POST({ request, url, cookies }) {
  let code = "";
  try {
    const data = await request.json();
    code = String(data?.code ?? "").trim();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const role = getRoleForCode(code);
  if (!/^\d{6}$/.test(code) || !role) {
    return new Response(JSON.stringify({ error: "invalid_code" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const token = makeSessionToken(role);
  const secure = url.protocol === "https:";
  cookies.set(COOKIE_NAME, token, {
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1e3),
    httpOnly: true,
    sameSite: "lax",
    secure
  });
  return new Response(
    JSON.stringify({ ok: true, expiresIn: SESSION_TTL_MS }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
