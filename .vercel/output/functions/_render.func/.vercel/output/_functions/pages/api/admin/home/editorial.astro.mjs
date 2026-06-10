import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../../chunks/admin-activity_7EJyrd7K.mjs';
import { s as slugifyKey } from '../../../../chunks/slug_C1K2ks4q.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const ALLOWED_FIELDS = /* @__PURE__ */ new Set([
  "slug",
  "eyebrow",
  "titre",
  "description",
  "image",
  "image_alt",
  "cta_label",
  "cta_href",
  "accent",
  "ordre",
  "actif"
]);
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
function normalize(raw) {
  const slug = slugifyKey(raw.slug || raw.titre || "");
  if (!slug) throw new Error("Slug invalide : doit contenir au moins un caractère alphanumérique.");
  if (!raw.titre || !String(raw.titre).trim()) throw new Error("Le titre est obligatoire.");
  if (!raw.image || !String(raw.image).trim()) throw new Error("L'image est obligatoire.");
  return {
    slug,
    eyebrow: raw.eyebrow != null ? String(raw.eyebrow).trim() : "",
    titre: String(raw.titre).trim(),
    description: raw.description != null ? String(raw.description).trim() : "",
    image: String(raw.image).trim(),
    image_alt: raw.image_alt != null ? String(raw.image_alt).trim() : "",
    cta_label: raw.cta_label != null ? String(raw.cta_label).trim() : "",
    cta_href: raw.cta_href != null ? String(raw.cta_href).trim() : "",
    accent: raw.accent != null && String(raw.accent).trim() !== "" ? String(raw.accent).trim() : "#1C6B35",
    ordre: Number.isFinite(Number(raw.ordre)) ? Number(raw.ordre) : 0,
    actif: raw.actif !== false
  };
}
const GET = async ({ cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin.from("home_editorial_slides").select("*").order("ordre", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ slides: data ?? [] });
};
const POST = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    const row = normalize(body);
    const { data, error } = await supabaseAdmin.from("home_editorial_slides").insert(row).select().single();
    if (error) throw error;
    logActivity({
      entity: "home_slide",
      entity_id: data?.id ?? null,
      entity_label: data?.titre ?? row.slug,
      action: "create",
      payload: { slug: data?.slug }
    });
    return json({ slide: data }, 201);
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};
const PUT = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    if (!Array.isArray(body.slides)) {
      return json({ error: "Format attendu : { slides: [...] }" }, 400);
    }
    const rows = body.slides.map(normalize);
    const { data, error } = await supabaseAdmin.from("home_editorial_slides").upsert(rows, { onConflict: "slug" }).select();
    if (error) throw error;
    logActivity({
      entity: "home_slide",
      action: "import",
      entity_label: `${data?.length ?? 0} slide(s)`,
      payload: { count: data?.length ?? 0, slugs: (data ?? []).map((r) => r.slug) }
    });
    return json({ slides: data ?? [], count: data?.length ?? 0 });
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};
const PATCH = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    const id = body.id;
    if (!id) return json({ error: "Missing id" }, 400);
    const patch = {};
    for (const [k, v] of Object.entries(body)) {
      if (k === "id") continue;
      if (!ALLOWED_FIELDS.has(k)) continue;
      patch[k] = v;
    }
    if ("slug" in patch) {
      patch.slug = slugifyKey(patch.slug);
      if (!patch.slug) return json({ error: "Slug invalide" }, 400);
    }
    if ("ordre" in patch) {
      const n = Number(patch.ordre);
      if (!Number.isFinite(n)) return json({ error: "Ordre doit être un nombre" }, 400);
      patch.ordre = n;
    }
    const { data, error } = await supabaseAdmin.from("home_editorial_slides").update(patch).eq("id", id).select().single();
    if (error) throw error;
    logActivity({
      entity: "home_slide",
      entity_id: id,
      entity_label: data?.titre ?? null,
      action: "update",
      payload: { fields: Object.keys(patch) }
    });
    return json({ slide: data });
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};
const DELETE = async ({ request, url, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  let id = null;
  try {
    const body = await request.json();
    id = body?.id ?? null;
  } catch {
  }
  if (!id) id = url.searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const { data: snap } = await supabaseAdmin.from("home_editorial_slides").select("id, titre, slug").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("home_editorial_slides").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  logActivity({
    entity_label: snap?.titre ?? snap?.slug ?? null});
  return new Response(null, { status: 204 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
