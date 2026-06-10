import { getStatsBundle } from '../../../../chunks/inventaire-db_BPwFePtL.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
async function GET({ url }) {
  const topRaw = Number(url.searchParams.get("top"));
  const topLimit = Number.isFinite(topRaw) && topRaw >= 0 ? Math.min(topRaw, 50) : 10;
  try {
    const bundle = await getStatsBundle({ topLimit });
    return new Response(JSON.stringify(bundle), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // Cache court côté navigateur : permet une navigation rapide entre
        // / et /statistiques sans relancer la requête. SWR : si le cache
        // est expiré (>30s), on ressert l'ancienne version pendant qu'on
        // refetch en arrière-plan, jusqu'à 60s.
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60"
      }
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
