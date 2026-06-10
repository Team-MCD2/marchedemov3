import { i as isAuthenticated } from '../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../chunks/admin-activity_7EJyrd7K.mjs';
import { s as slugifyKey } from '../../../chunks/slug_C1K2ks4q.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const ALLOWED_RAYONS = [
  "boucherie-halal",
  "fruits-legumes",
  "epices-du-monde",
  "saveurs-afrique",
  "saveurs-asie",
  "saveur-mediterranee",
  "saveur-sud-amer",
  "balkans-turques",
  "produits-courants",
  "surgeles",
  "boulangerie",
  "produits-laitiers"
];
const ALLOWED_MAGASINS = ["toulouse-sud"];
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function requireAdmin(cookies) {
  if (!await isAuthenticated(cookies)) return json({ error: "Unauthorized" }, 401);
  return json({ error: "Supabase service_role key missing" }, 500);
}
function normalizePromo(raw) {
  const required = [
    "slug",
    "titre",
    "prix_original",
    "prix_promo",
    "reduction_pct",
    "rayon",
    "date_debut",
    "date_fin"
  ];
  for (const f of required) {
    if (raw[f] === void 0 || raw[f] === null || raw[f] === "") {
      throw new Error(`Champ obligatoire manquant : ${f}`);
    }
  }
  const rayon = String(raw.rayon).trim();
  if (!ALLOWED_RAYONS.includes(rayon)) {
    throw new Error(`Rayon invalide : ${rayon}`);
  }
  const magasin = String(raw.magasin ?? "tous").trim();
  if (!ALLOWED_MAGASINS.includes(magasin)) {
    throw new Error(`Magasin invalide : ${magasin}`);
  }
  const prix_original = Number(raw.prix_original);
  const prix_promo = Number(raw.prix_promo);
  const reduction_pct = Math.round(Number(raw.reduction_pct));
  if (!Number.isFinite(prix_original) || prix_original <= 0) {
    throw new Error(`prix_original doit être un nombre > 0`);
  }
  if (!Number.isFinite(prix_promo) || prix_promo < 0) {
    throw new Error(`prix_promo doit être un nombre >= 0`);
  }
  if (!Number.isFinite(reduction_pct) || reduction_pct < 0 || reduction_pct > 99) {
    throw new Error(`reduction_pct doit être entre 0 et 99`);
  }
  const slug = slugifyKey(raw.slug);
  if (!slug) {
    throw new Error("Slug invalide : doit contenir au moins un caractère alphanumérique");
  }
  return {
    slug,
    titre: String(raw.titre).trim(),
    description: raw.description != null ? String(raw.description) : "",
    image_url: raw.image_url || raw.image || null,
    prix_original,
    prix_promo,
    reduction_pct,
    rayon,
    magasin,
    date_debut: String(raw.date_debut),
    date_fin: String(raw.date_fin),
    mise_en_avant: !!raw.mise_en_avant,
    ticker_semaine: !!raw.ticker_semaine,
    actif: raw.actif !== false,
    ordre: Number.isFinite(Number(raw.ordre)) ? Number(raw.ordre) : 0
  };
}
async function clearOtherTickers(slugsBeingSaved) {
  return;
}
const GET = async ({ cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin.from("promos").select("*").order("ordre", { ascending: true }).order("date_fin", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ promos: data ?? [] });
};
const POST = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    const row = normalizePromo(body);
    if (row.ticker_semaine) {
      await clearOtherTickers([row.slug]);
    }
    const { data, error } = await supabaseAdmin.from("promos").insert(row).select().single();
    if (error) throw error;
    logActivity({
      entity: "promo",
      entity_id: data?.id ?? null,
      entity_label: data?.titre ?? row.slug,
      action: "create",
      payload: {
        rayon: data?.rayon,
        slug: data?.slug,
        magasin: data?.magasin,
        ticker_semaine: !!data?.ticker_semaine
      }
    });
    return json({ promo: data }, 201);
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};
const PUT = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    if (!Array.isArray(body.promos)) {
      return json({ error: "Format attendu : { promos: [...] }" }, 400);
    }
    const rows = body.promos.map(normalizePromo);
    const tickerIndices = [];
    rows.forEach((r, i) => {
      if (r.ticker_semaine) tickerIndices.push(i);
    });
    if (tickerIndices.length > 1) {
      const winner = tickerIndices[tickerIndices.length - 1];
      tickerIndices.forEach((i) => {
        if (i !== winner) rows[i].ticker_semaine = false;
      });
    }
    const winnerSlugs = rows.filter((r) => r.ticker_semaine).map((r) => r.slug);
    if (winnerSlugs.length > 0) {
      await clearOtherTickers(winnerSlugs);
    }
    const { data, error } = await supabaseAdmin.from("promos").upsert(rows, { onConflict: "slug" }).select();
    if (error) throw error;
    logActivity({
      entity: "promo",
      action: "import",
      entity_label: `${data?.length ?? 0} promo(s)`,
      payload: {
        count: data?.length ?? 0,
        slugs: (data ?? []).slice(0, 50).map((r) => r.slug),
        ticker_winner: winnerSlugs[0] ?? null
      }
    });
    return json({ promos: data ?? [], count: data?.length ?? 0 });
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
