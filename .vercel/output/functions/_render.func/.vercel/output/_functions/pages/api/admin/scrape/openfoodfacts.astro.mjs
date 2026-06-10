import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
import '../../../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const FIELDS = [
  "code",
  "product_name",
  "product_name_fr",
  "generic_name_fr",
  "brands",
  "brands_tags",
  "categories_tags",
  "countries_tags",
  "origins",
  "image_front_url",
  "image_front_small_url",
  "image_url",
  "nutriscore_grade",
  "packaging",
  "quantity",
  "labels_tags"
].join(",");
const OFF_SEARCH_NEW = "https://search.openfoodfacts.org/search";
const OFF_SEARCH_LEGACY = "https://world.openfoodfacts.org/api/v2/search";
const USER_AGENT = "MarcheDeMo-V2-Scraper/1.0 (+contact@marchedemo.com) Node.js/22 serverless, https://marchedemo.com";
const QUERY_PLAN = {
  "epices-du-monde": [
    { tag: "en:spices", limit: 30 },
    { tag: "en:teas", limit: 12 },
    { tag: "en:herbs-and-spices", limit: 10 },
    { tag: "en:salts", limit: 6 }
  ],
  "saveurs-asie": [
    { tag: "en:soy-sauces", limit: 12 },
    { tag: "en:asian-noodles", limit: 12 },
    { tag: "en:rices", limit: 15 },
    { tag: "en:curry-pastes", limit: 8 },
    { tag: "en:coconut-milks", limit: 8 }
  ],
  "saveurs-afrique": [
    { tag: "en:spreads", limit: 10 },
    { tag: "en:nuts", limit: 12 },
    { tag: "en:dried-fruits", limit: 10 },
    { tag: "en:flours", limit: 8 }
  ],
  "boucherie-halal": [
    { tag: "en:meats", limit: 20 },
    { tag: "en:poultry", limit: 10 }
  ],
  "fruits-legumes": [
    { tag: "en:fresh-fruits", limit: 20 },
    { tag: "en:fresh-vegetables", limit: 20 }
  ],
  "surgeles": [
    { tag: "en:frozen-foods", limit: 15 },
    { tag: "en:frozen-fruits", limit: 8 },
    { tag: "en:frozen-vegetables", limit: 8 }
  ]
};
async function fetchOFF(endpoint, params) {
  const url = `${endpoint}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json"
    },
    signal: AbortSignal.timeout(15e3)
    // 15s timeout for serverless
  });
  if (!res.ok) {
    throw new Error(`OFF API error: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}
function normalizeProduct(item, rayon) {
  const code = item.code;
  const name = item.product_name_fr || item.product_name || item.generic_name_fr || "";
  const image = item.image_front_url || item.image_front_small_url || item.image_url || "";
  if (!code || !name || !image) return null;
  return {
    code,
    nom: name.trim(),
    marque: item.brands || item.brands_tags?.[0] || "",
    image_url: image,
    rayon,
    categories: item.categories_tags || [],
    origine: item.origins || "",
    packaging: item.packaging || "",
    quantity: item.quantity || "",
    nutriscore: item.nutriscore_grade || ""
  };
}
const POST = async ({ request, cookies }) => {
  if (!await isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    const rayonsToScrape = body.rayons || Object.keys(QUERY_PLAN);
    const allProducts = [];
    for (const rayon of rayonsToScrape) {
      const queries = QUERY_PLAN[rayon] || [];
      for (const query of queries) {
        const params = new URLSearchParams({
          fields: FIELDS,
          page_size: String(query.limit),
          categories_tags_en: query.tag
        });
        let data;
        try {
          data = await fetchOFF(OFF_SEARCH_NEW, params);
          if (!data.hits) throw new Error("No hits in response");
          data.hits = data.hits || [];
        } catch (e) {
          console.warn(`OFF new endpoint failed for ${rayon}/${query.tag}, trying legacy:`, e);
          const legacyParams = new URLSearchParams({
            fields: FIELDS
          });
          legacyParams.set("search_terms", query.tag.replace("en:", ""));
          legacyParams.set("page_size", String(query.limit));
          data = await fetchOFF(OFF_SEARCH_LEGACY, legacyParams);
          data.hits = data.products || [];
        }
        for (const item of data.hits) {
          const normalized = normalizeProduct(item, rayon);
          if (normalized) {
            allProducts.push(normalized);
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    const uniqueProducts = /* @__PURE__ */ new Map();
    for (const p of allProducts) {
      if (!uniqueProducts.has(p.code)) {
        uniqueProducts.set(p.code, p);
      }
    }
    return new Response(JSON.stringify({
      products: Array.from(uniqueProducts.values()),
      count: uniqueProducts.size,
      rayons: rayonsToScrape
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message || "Scraping failed",
      details: err.toString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
