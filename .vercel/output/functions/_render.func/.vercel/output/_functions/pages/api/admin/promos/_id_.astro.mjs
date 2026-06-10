import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../../chunks/admin-activity_7EJyrd7K.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const ALLOWED_FIELDS = /* @__PURE__ */ new Set([
  "titre",
  "description",
  "image_url",
  "prix_original",
  "prix_promo",
  "reduction_pct",
  "rayon",
  "magasin",
  "date_debut",
  "date_fin",
  "mise_en_avant",
  "ticker_semaine",
  "actif",
  "ordre",
  "slug"
]);
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
async function resolveIdToUuid(idOrSlug) {
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRe.test(idOrSlug)) return idOrSlug;
  const { data } = await supabaseAdmin.from("promos").select("id").eq("slug", idOrSlug).maybeSingle();
  return data?.id ?? null;
}
const PATCH = async ({ params, request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const rawId = params.id;
  if (!rawId) return json({ error: "Missing id" }, 400);
  const uuid = await resolveIdToUuid(rawId);
  if (!uuid) return json({ error: "Promo introuvable" }, 404);
  try {
    const body = await request.json();
    const patch = {};
    for (const [k, v] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.has(k)) continue;
      patch[k] = v;
    }
    if ("rayon" in patch && !ALLOWED_RAYONS.includes(patch.rayon)) {
      return json({ error: `Rayon invalide : ${patch.rayon}` }, 400);
    }
    if ("magasin" in patch && !ALLOWED_MAGASINS.includes(patch.magasin)) {
      return json({ error: `Magasin invalide : ${patch.magasin}` }, 400);
    }
    if ("reduction_pct" in patch) {
      const n = Math.round(Number(patch.reduction_pct));
      if (!Number.isFinite(n) || n < 0 || n > 99) {
        return json({ error: "reduction_pct doit être entre 0 et 99" }, 400);
      }
      patch.reduction_pct = n;
    }
    for (const k of ["prix_original", "prix_promo"]) {
      if (k in patch) {
        const n = Number(patch[k]);
        if (!Number.isFinite(n) || n < 0) {
          return json({ error: `${k} doit être un nombre >= 0` }, 400);
        }
        patch[k] = n;
      }
    }
    if ("slug" in patch) {
      patch.slug = String(patch.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    }
    if (patch.ticker_semaine === true) {
      await supabaseAdmin.from("promos").update({ ticker_semaine: false }).neq("id", uuid);
    }
    if ("ticker_semaine" in patch) {
      patch.ticker_semaine = !!patch.ticker_semaine;
    }
    const { data, error } = await supabaseAdmin.from("promos").update(patch).eq("id", uuid).select().single();
    if (error) throw error;
    logActivity({
      entity: "promo",
      entity_id: data?.id ?? uuid,
      entity_label: data?.titre ?? null,
      action: "update",
      payload: { fields: Object.keys(patch), patch }
    });
    return json({ promo: data });
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};
const DELETE = async ({ params, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const rawId = params.id;
  if (!rawId) return json({ error: "Missing id" }, 400);
  const uuid = await resolveIdToUuid(rawId);
  if (!uuid) return json({ error: "Promo introuvable" }, 404);
  const { data: snap } = await supabaseAdmin.from("promos").select("id, titre, slug, rayon").eq("id", uuid).maybeSingle();
  const { error } = await supabaseAdmin.from("promos").delete().eq("id", uuid);
  if (error) return json({ error: error.message }, 500);
  logActivity({
    entity_label: snap?.titre ?? snap?.slug ?? null,
    payload: { rayon: snap?.rayon ?? null, slug: snap?.slug ?? null }
  });
  return new Response(null, { status: 204 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
