import { i as isAuthenticated } from '../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../chunks/admin-activity_7EJyrd7K.mjs';
import { s as slugifyKey } from '../../../chunks/slug_C1K2ks4q.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
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
function normalizeActu(raw) {
  const required = [
    "slug",
    "type",
    "titre",
    "image"
  ];
  for (const f of required) {
    if (raw[f] === void 0 || raw[f] === null || String(raw[f]).trim() === "") {
      throw new Error(`Champ obligatoire manquant : ${f}`);
    }
  }
  const type = String(raw.type).trim();
  if (!ALLOWED_TYPES.includes(type)) {
    throw new Error(`Type d'actualité invalide : ${type}`);
  }
  let rayon = null;
  if (raw.rayon && String(raw.rayon).trim() !== "") {
    const r = String(raw.rayon).trim();
    if (!ALLOWED_RAYONS.includes(r)) {
      throw new Error(`Rayon invalide : ${r}`);
    }
    rayon = r;
  }
  const slug = slugifyKey(raw.slug);
  if (!slug) {
    throw new Error("Slug invalide : doit contenir au moins un caractère alphanumérique");
  }
  let dateStr = (/* @__PURE__ */ new Date()).toISOString();
  if (raw.date) {
    const d = new Date(raw.date);
    if (!isNaN(d.getTime())) {
      dateStr = d.toISOString();
    }
  }
  return {
    slug,
    type,
    titre: String(raw.titre).trim(),
    resume: raw.resume != null ? String(raw.resume).trim() : "",
    image: String(raw.image).trim(),
    image_alt: raw.image_alt != null ? String(raw.image_alt).trim() : "",
    rayon,
    date: dateStr,
    href: raw.href != null ? String(raw.href).trim() : "",
    badge_label: raw.badge_label != null ? String(raw.badge_label).trim() : "",
    actif: raw.actif !== false,
    contenu: raw.contenu != null ? String(raw.contenu).trim() : "",
    auteur: raw.auteur != null ? String(raw.auteur).trim() : "L'équipe Marché de Mo'"
  };
}
const GET = async ({ cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin.from("actus").select("*").order("date", { ascending: false });
  if (error) return json({ error: error.message }, 500);
  return json({ actus: data ?? [] });
};
const POST = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    console.log("[actus POST] Received body:", JSON.stringify(body, null, 2));
    const row = normalizeActu(body);
    console.log("[actus POST] Normalized row:", JSON.stringify(row, null, 2));
    const { data, error } = await supabaseAdmin.from("actus").insert(row).select().single();
    if (error) {
      console.error("[actus POST] Supabase error:", error);
      throw error;
    }
    logActivity({
      entity: "actu",
      entity_id: data?.id ?? null,
      entity_label: data?.titre ?? row.slug,
      action: "create",
      payload: { type: data?.type, slug: data?.slug, rayon: data?.rayon }
    });
    return json({ actu: data }, 201);
  } catch (err) {
    console.error("[actus POST] Error:", err);
    return json({ error: err.message || String(err), details: err.toString() }, 400);
  }
};
const PUT = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    if (!Array.isArray(body.actus)) {
      return json({ error: "Format attendu : { actus: [...] }" }, 400);
    }
    const rows = body.actus.map(normalizeActu);
    const { data, error } = await supabaseAdmin.from("actus").upsert(rows, { onConflict: "slug" }).select();
    if (error) throw error;
    logActivity({
      entity: "actu",
      action: "import",
      entity_label: `${data?.length ?? 0} actualité(s)`,
      payload: {
        count: data?.length ?? 0,
        slugs: (data ?? []).slice(0, 50).map((r) => r.slug)
      }
    });
    return json({ actus: data ?? [], count: data?.length ?? 0 });
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
