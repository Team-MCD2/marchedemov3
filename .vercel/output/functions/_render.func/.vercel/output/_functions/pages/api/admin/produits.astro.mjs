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
function normalizeProduit(raw) {
  const required = ["slug", "nom", "rayon"];
  for (const f of required) {
    if (raw[f] === void 0 || raw[f] === null || raw[f] === "") {
      throw new Error(`Champ obligatoire manquant : ${f}`);
    }
  }
  const rayon = String(raw.rayon).trim();
  if (!ALLOWED_RAYONS.includes(rayon)) {
    throw new Error(`Rayon invalide : ${rayon}`);
  }
  let prix_indicatif = null;
  if (raw.prix_indicatif != null && raw.prix_indicatif !== "") {
    const n = Number(raw.prix_indicatif);
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(`prix_indicatif doit être un nombre >= 0 ou vide`);
    }
    prix_indicatif = n;
  }
  const slug = slugifyKey(raw.slug);
  if (!slug) {
    throw new Error("Slug invalide : doit contenir au moins un caractère alphanumérique");
  }
  return {
    slug,
    nom: String(raw.nom).trim(),
    description: raw.description != null ? String(raw.description) : "",
    image_url: raw.image_url || raw.image || null,
    prix_indicatif,
    unite: raw.unite ? String(raw.unite).trim() : null,
    rayon,
    /* Hiérarchie catégorielle pour drill-down. Optionnels — null si vide.
       Les slugs sont validés par la SQL CHECK via taxonomie.ts si besoin,
       mais on accepte ici n'importe quelle string non-vide pour rester
       flexible sur les imports massifs.                                */
    categorie: raw.categorie ? String(raw.categorie).trim() : null,
    sous_categorie: raw.sous_categorie ? String(raw.sous_categorie).trim() : null,
    origine: raw.origine ? String(raw.origine).trim() : null,
    badge: raw.badge ? String(raw.badge).trim() : null,
    actif: raw.actif !== false,
    ordre: Number.isFinite(Number(raw.ordre)) ? Number(raw.ordre) : 0
  };
}
const GET = async ({ cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin.from("produits").select("*").order("rayon", { ascending: true }).order("ordre", { ascending: true }).order("nom", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ produits: data ?? [] });
};
const POST = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    const row = normalizeProduit(body);
    const { data, error } = await supabaseAdmin.from("produits").insert(row).select().single();
    if (error) throw error;
    logActivity({
      entity: "produit",
      entity_id: data?.id ?? null,
      entity_label: data?.nom ?? row.slug,
      action: "create",
      payload: { rayon: data?.rayon, slug: data?.slug }
    });
    return json({ produit: data }, 201);
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};
const PUT = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    if (!Array.isArray(body.produits)) {
      return json({ error: "Format attendu : { produits: [...] }" }, 400);
    }
    const rows = body.produits.map(normalizeProduit);
    const { data, error } = await supabaseAdmin.from("produits").upsert(rows, { onConflict: "slug" }).select();
    if (error) throw error;
    logActivity({
      entity: "produit",
      action: "import",
      entity_label: `${data?.length ?? 0} produit(s)`,
      payload: {
        count: data?.length ?? 0,
        slugs: (data ?? []).slice(0, 50).map((r) => r.slug)
      }
    });
    return json({ produits: data ?? [], count: data?.length ?? 0 });
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
