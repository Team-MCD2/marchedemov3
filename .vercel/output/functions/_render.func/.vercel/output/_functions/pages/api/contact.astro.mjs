import { i as isRateLimited } from '../../chunks/rate-limit_DmDM6Hkl.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request, redirect, clientAddress }) => {
  const ct = request.headers.get("content-type") ?? "";
  const wantsJson = ct.includes("application/json");
  let payload = {};
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || clientAddress || "127.0.0.1";
  const limitCheck = isRateLimited(ip, 3, 6e4);
  if (limitCheck.limited) {
    const errorMsg = "Trop de tentatives. Veuillez réessayer plus tard.";
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: false, error: errorMsg }), {
        status: 429,
        headers: { "content-type": "application/json" }
      });
    }
    return redirect("/service-client?contact=error&msg=429", 303);
  }
  if (wantsJson) {
    payload = await request.json().catch(() => ({}));
  } else {
    const form = await request.formData();
    for (const [k, v] of form.entries()) payload[k] = String(v);
  }
  const { prenom, nom, email, sujet, message, phone_confirm } = payload;
  if (phone_confirm) {
    console.log("[contact] Spam detected (honeypot filled):", phone_confirm);
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: true, spam: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return redirect("/service-client?contact=ok", 303);
  }
  if (!prenom || !nom || !email || !sujet || !message) {
    const err = "Tous les champs obligatoires doivent être remplis";
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: false, error: err }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    return redirect("/service-client?contact=error", 303);
  }
  console.log("[contact]", { prenom, nom, email, sujet });
  if (wantsJson) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
  return redirect("/service-client?contact=ok", 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
