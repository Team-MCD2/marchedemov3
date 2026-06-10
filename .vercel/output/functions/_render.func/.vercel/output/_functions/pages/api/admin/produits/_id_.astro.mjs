import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../../chunks/admin-activity_7EJyrd7K.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const ALLOWED_FIELDS = /* @__PURE__ */ new Set([
  "slug",
  "nom",
  "description",
  "image_url",
  "prix_indicatif",
  "unite",
  "rayon",
  "categorie",
  "sous_categorie",
  "origine",
  "badge",
  "actif",
  "ordre"
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
  const { data } = await supabaseAdmin.from("produits").select("id").eq("slug", idOrSlug).maybeSingle();
  return data?.id ?? null;
}
const PATCH = async ({ params, request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const rawId = params.id;
  if (!rawId) return json({ error: "Missing id" }, 400);
  const uuid = await resolveIdToUuid(rawId);
  if (!uuid) return json({ error: "Produit introuvable" }, 404);
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
    if ("prix_indicatif" in patch) {
      if (patch.prix_indicatif === "" || patch.prix_indicatif == null) {
        patch.prix_indicatif = null;
      } else {
        const n = Number(patch.prix_indicatif);
        if (!Number.isFinite(n) || n < 0) {
          return json({ error: "prix_indicatif doit être un nombre >= 0 ou null" }, 400);
        }
        patch.prix_indicatif = n;
      }
    }
    if ("slug" in patch) {
      patch.slug = String(patch.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    }
    const { data, error } = await supabaseAdmin.from("produits").update(patch).eq("id", uuid).select().single();
    if (error) throw error;
    logActivity({
      entity: "produit",
      entity_id: data?.id ?? uuid,
      entity_label: data?.nom ?? null,
      action: "update",
      payload: { fields: Object.keys(patch), patch }
    });
    return json({ produit: data });
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
  if (!uuid) return json({ error: "Produit introuvable" }, 404);
  const { data: snap } = await supabaseAdmin.from("produits").select("id, nom, slug, rayon").eq("id", uuid).maybeSingle();
  const { error } = await supabaseAdmin.from("produits").delete().eq("id", uuid);
  if (error) return json({ error: error.message }, 500);
  logActivity({
    entity_label: snap?.nom ?? snap?.slug ?? null,
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
