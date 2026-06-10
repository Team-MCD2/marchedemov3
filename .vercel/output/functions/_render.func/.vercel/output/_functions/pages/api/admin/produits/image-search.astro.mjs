import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
export { renderers } from '../../../../renderers.mjs';

const USER_AGENT = "MarcheDeMo-V2-AdminSearch/1.0 (+contact@marchedemo.com) Node.js own-catalogue builder, https://marchedemo.com";
const OFF_SEARCH_NEW = "https://search.openfoodfacts.org/search";
const OFF_SEARCH_LEGACY = "https://world.openfoodfacts.org/api/v2/search";
const FIELDS = [
  "code",
  "product_name",
  "product_name_fr",
  "brands",
  "countries_tags",
  "origins",
  "image_front_url",
  "image_front_small_url",
  "image_url",
  "labels_tags",
  "quantity"
].join(",");
function extractProducts(json) {
  if (Array.isArray(json?.products)) return json.products;
  if (Array.isArray(json?.hits)) return json.hits;
  return [];
}
const COUNTRY_FR = {
  "en:france": "France",
  "en:morocco": "Maroc",
  "en:tunisia": "Tunisie",
  "en:algeria": "Algérie",
  "en:egypt": "Égypte",
  "en:lebanon": "Liban",
  "en:turkey": "Turquie",
  "en:india": "Inde",
  "en:china": "Chine",
  "en:japan": "Japon",
  "en:vietnam": "Vietnam",
  "en:thailand": "Thaïlande",
  "en:senegal": "Sénégal",
  "en:cote-d-ivoire": "Côte d'Ivoire",
  "en:cameroon": "Cameroun",
  "en:mali": "Mali",
  "en:portugal": "Portugal",
  "en:spain": "Espagne",
  "en:italy": "Italie",
  "en:greece": "Grèce",
  "en:mexico": "Mexique",
  "en:brazil": "Brésil"
};
function pickOrigine(p) {
  if (p.origins && typeof p.origins === "string" && p.origins.length > 1) {
    return String(p.origins).replace(/^Origine\s*:?\s*/i, "").replace(/[,;].*$/, "").trim().slice(0, 80) || null;
  }
  const tags = Array.isArray(p.countries_tags) ? p.countries_tags : [];
  for (const t of tags) {
    const label = COUNTRY_FR[t];
    if (label && label !== "France") return label;
  }
  if (tags.includes("en:france")) return "France";
  return null;
}
function normaliseHit(p, source) {
  const imageUrl = p.image_front_url || p.image_url || p.image_front_small_url || "";
  if (!imageUrl) return null;
  if (/placeholder|image_not_available/i.test(imageUrl)) return null;
  const name = (p.product_name_fr || p.product_name || "").trim();
  if (!name) return null;
  return {
    code: String(p.code ?? ""),
    name: name.slice(0, 160),
    brands: p.brands ? String(p.brands).split(",")[0].trim() : null,
    origine: pickOrigine(p),
    quantity: p.quantity ? String(p.quantity).slice(0, 40) : null,
    imageUrl,
    thumbUrl: p.image_front_small_url || imageUrl,
    source,
    attribution: "OpenFoodFacts · CC-BY-SA"
  };
}
async function tryFetch(url, source) {
  const res = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    /* Admin UX: bail out quickly instead of hanging on OFF slowdowns. */
    signal: AbortSignal.timeout(7e3)
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return extractProducts(json);
}
function buildSearchNewUrl(q, pageSize) {
  const url = new URL(OFF_SEARCH_NEW);
  url.searchParams.set("q", q);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("sort_by", "-popularity_key");
  url.searchParams.set("langs", "fr");
  return url;
}
function buildSearchLegacyUrl(q, pageSize) {
  const url = new URL(OFF_SEARCH_LEGACY);
  url.searchParams.set("search_terms", q);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("sort_by", "popularity_key");
  url.searchParams.set("lc", "fr");
  return url;
}
async function searchOFFImages(query, opts = {}) {
  const q = String(query || "").trim();
  if (!q) return [];
  const pageSize = Math.max(1, Math.min(opts.pageSize ?? 16, 30));
  let rawHits = [];
  let source = "off-new";
  try {
    rawHits = await tryFetch(buildSearchNewUrl(q, pageSize), "off-new");
  } catch {
    rawHits = [];
  }
  if (rawHits.length === 0) {
    try {
      rawHits = await tryFetch(buildSearchLegacyUrl(q, pageSize), "off-legacy");
      source = "off-legacy";
    } catch {
      rawHits = [];
    }
  }
  const seen = /* @__PURE__ */ new Set();
  const results = [];
  for (const raw of rawHits) {
    const hit = normaliseHit(raw, source);
    if (!hit) continue;
    const key = hit.code || hit.imageUrl;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(hit);
    if (results.length >= pageSize) break;
  }
  return results;
}

const prerender = false;
const MAX_PAGE_SIZE = 24;
const DEFAULT_PAGE_SIZE = 12;
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function handle(query, pageSizeRaw) {
  const q = query.trim();
  if (!q) {
    return json({ error: "`query` est requis" }, 400);
  }
  if (q.length > 120) {
    return json({ error: "`query` trop long (max 120 caractères)" }, 400);
  }
  let pageSize = DEFAULT_PAGE_SIZE;
  if (pageSizeRaw != null) {
    const n = Number(pageSizeRaw);
    if (!Number.isFinite(n) || n < 1 || n > MAX_PAGE_SIZE) {
      return json(
        { error: `pageSize doit être dans [1, ${MAX_PAGE_SIZE}]` },
        400
      );
    }
    pageSize = Math.floor(n);
  }
  try {
    const results = await searchOFFImages(q, { pageSize });
    return json({
      query: q,
      results,
      count: results.length,
      source: "openfoodfacts"
    });
  } catch (err) {
    return json(
      { error: err?.message ?? "Échec de la recherche OpenFoodFacts" },
      502
    );
  }
}
const GET = async ({ url, cookies }) => {
  if (!await isAuthenticated(cookies)) {
    return json({ error: "Unauthorized" }, 401);
  }
  const q = url.searchParams.get("q") ?? "";
  const pageSize = url.searchParams.get("pageSize");
  return handle(q, pageSize);
};
const POST = async ({ request, cookies }) => {
  if (!await isAuthenticated(cookies)) {
    return json({ error: "Unauthorized" }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON body invalide" }, 400);
  }
  const q = String(body?.query ?? "");
  return handle(q, body?.pageSize);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
