import { a as analyzeImageHybrid } from '../../../../../chunks/inventaire-analyze_BjG_8-YC.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function POST({ request }) {
  try {
    const { image, model } = await request.json();
    const geminiKey = request.headers.get("x-gemini-key") || "";
    const visionKey = request.headers.get("x-vision-key") || "";
    if (!image) return json({ error: 'Champ "image" manquant (data URL)' }, 400);
    const { merged, sources } = await analyzeImageHybrid({
      base64DataUrl: image,
      geminiKey,
      visionKey,
      model
    });
    return json({ result: merged, sources });
  } catch (e) {
    if (e.message === "SCAN_IMPOSSIBLE") {
      return json({
        error: "Impossible de scanner le produit. Veuillez réessayer avec un meilleur éclairage ou une photo plus nette.",
        userFriendly: true
      }, 500);
    }
    return json({ error: e.message || "Erreur analyse image" }, 500);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
