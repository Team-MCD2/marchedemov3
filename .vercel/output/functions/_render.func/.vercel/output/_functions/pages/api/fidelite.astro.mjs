export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request, redirect }) => {
  const ct = request.headers.get("content-type") ?? "";
  const wantsJson = ct.includes("application/json");
  let payload = {};
  if (wantsJson) {
    payload = await request.json().catch(() => ({}));
  } else {
    const form = await request.formData();
    for (const [k, v] of form.entries()) payload[k] = String(v);
  }
  const { prenom, nom, email } = payload;
  if (!prenom || !nom || !email) {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: false, error: "Champs obligatoires manquants" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    return redirect("/programme-fidelite?fidelite=error", 303);
  }
  console.log("[fidelite]", { prenom, nom, email });
  if (wantsJson) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
  return redirect("/programme-fidelite?fidelite=ok", 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
