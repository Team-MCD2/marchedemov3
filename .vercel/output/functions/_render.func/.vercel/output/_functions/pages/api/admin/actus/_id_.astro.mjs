import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../../chunks/admin-activity_7EJyrd7K.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const ALLOWED_FIELDS = /* @__PURE__ */ new Set([
  "titre",
  "resume",
  "image",
  "image_alt",
  "type",
  "rayon",
  "date",
  "href",
  "badge_label",
  "actif",
  "slug",
  "contenu",
  "auteur"
]);
const ALLOWED_TYPES = ["article", "recette", "arrivage", "nouveaute", "evenement"];
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
  const { data } = await supabaseAdmin.from("actus").select("id").eq("slug", idOrSlug).maybeSingle();
  return data?.id ?? null;
}
const PATCH = async ({ params, request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const rawId = params.id;
  if (!rawId) return json({ error: "Missing id" }, 400);
  const uuid = await resolveIdToUuid(rawId);
  if (!uuid) return json({ error: "Actualité introuvable" }, 404);
  try {
    const body = await request.json();
    const patch = {};
    for (const [k, v] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.has(k)) continue;
      patch[k] = v;
    }
    if ("type" in patch) {
      const type = String(patch.type).trim();
      if (!ALLOWED_TYPES.includes(type)) {
        return json({ error: `Type d'actualité invalide : ${type}` }, 400);
      }
      patch.type = type;
    }
    if ("rayon" in patch) {
      if (patch.rayon && String(patch.rayon).trim() !== "") {
        const r = String(patch.rayon).trim();
        if (!ALLOWED_RAYONS.includes(r)) {
          return json({ error: `Rayon invalide : ${r}` }, 400);
        }
        patch.rayon = r;
      } else {
        patch.rayon = null;
      }
    }
    if ("date" in patch && patch.date) {
      const d = new Date(patch.date);
      if (isNaN(d.getTime())) {
        return json({ error: "Format de date invalide" }, 400);
      }
      patch.date = d.toISOString();
    }
    if ("slug" in patch) {
      patch.slug = String(patch.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
      if (!patch.slug) {
        return json({ error: "Slug invalide" }, 400);
      }
    }
    const { data, error } = await supabaseAdmin.from("actus").update(patch).eq("id", uuid).select().single();
    if (error) throw error;
    logActivity({
      entity: "actu",
      entity_id: data?.id ?? uuid,
      entity_label: data?.titre ?? null,
      action: "update",
      payload: { fields: Object.keys(patch), patch }
    });
    return json({ actu: data });
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
  if (!uuid) return json({ error: "Actualité introuvable" }, 404);
  const { data: snap } = await supabaseAdmin.from("actus").select("id, titre, slug, type").eq("id", uuid).maybeSingle();
  const { error } = await supabaseAdmin.from("actus").delete().eq("id", uuid);
  if (error) return json({ error: error.message }, 500);
  logActivity({
    entity_label: snap?.titre ?? snap?.slug ?? null,
    payload: { type: snap?.type ?? null, slug: snap?.slug ?? null }
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
