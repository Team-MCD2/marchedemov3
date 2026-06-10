import { i as isRateLimited } from '../../chunks/rate-limit_DmDM6Hkl.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request, redirect, clientAddress }) => {
  const ct = request.headers.get("content-type") ?? "";
  let email = "";
  let wantsJson = ct.includes("application/json");
  let honeypot = "";
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || clientAddress || "127.0.0.1";
  const limitCheck = isRateLimited(ip, 5, 6e4);
  if (limitCheck.limited) {
    const errorMsg = "Trop de tentatives. Veuillez réessayer plus tard.";
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: false, error: errorMsg }), {
        status: 429,
        headers: { "content-type": "application/json" }
      });
    }
    return redirect("/?newsletter=error&msg=429", 303);
  }
  if (wantsJson) {
    const body = await request.json().catch(() => ({}));
    email = typeof body.email === "string" ? body.email : "";
    honeypot = typeof body.phone_confirm === "string" ? body.phone_confirm : "";
  } else {
    const form = await request.formData();
    email = String(form.get("email") ?? "");
    honeypot = String(form.get("phone_confirm") ?? "");
  }
  if (honeypot) {
    console.log("[newsletter] Spam detected (honeypot filled):", honeypot);
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: true, spam: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return redirect("/?newsletter=ok", 303);
  }
  const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!ok) {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: false, error: "Email invalide" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    return redirect("/?newsletter=error", 303);
  }
  console.log("[newsletter] subscribe:", email);
  if (wantsJson) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
  return redirect("/?newsletter=ok", 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
