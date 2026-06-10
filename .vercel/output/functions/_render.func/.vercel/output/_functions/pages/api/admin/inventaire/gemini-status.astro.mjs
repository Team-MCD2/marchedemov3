import { r as resolveModel, c as hasVisionKey, l as resolveMistralModel, m as getMistralKeyCount, b as hasMistralKey, n as resolveGroqModel, o as getGroqKeyCount, a as hasGroqKey, p as getKeyCount, h as hasServerKey } from '../../../../chunks/inventaire-vision_BLzAmBhu.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
async function GET() {
  return new Response(
    JSON.stringify({
      // legacy field (kept for backwards compat with the client)
      serverKey: hasServerKey(),
      // primary LLM
      geminiKey: hasServerKey(),
      geminiKeyCount: getKeyCount(),
      geminiModel: resolveModel(),
      // fallback LLMs
      groqKey: hasGroqKey(),
      groqKeyCount: getGroqKeyCount(),
      groqModel: resolveGroqModel(),
      mistralKey: hasMistralKey(),
      mistralKeyCount: getMistralKeyCount(),
      mistralModel: resolveMistralModel(),
      // OCR / logo / colors
      visionKey: hasVisionKey(),
      // Aliases retained for client compatibility
      model: resolveModel()
    }),
    { headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
