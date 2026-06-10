import { i as isAuthenticated } from '../../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../../chunks/admin-activity_7EJyrd7K.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const ALLOWED_FIELDS = /* @__PURE__ */ new Set(["label", "ordre", "actif"]);
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
  const label = raw.label != null ? String(raw.label).trim() : "";
  if (!label) throw new Error("Le libellé est obligatoire.");
  return {
    label,
    ordre: Number.isFinite(Number(raw.ordre)) ? Number(raw.ordre) : 0,
    actif: raw.actif !== false
  };
}
const GET = async ({ cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin.from("home_marquee_items").select("*").order("ordre", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ items: data ?? [] });
};
const POST = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    const row = normalize(body);
    const { data, error } = await supabaseAdmin.from("home_marquee_items").insert(row).select().single();
    if (error) throw error;
    logActivity({
      entity: "home_marquee",
      entity_id: data?.id ?? null,
      entity_label: data?.label ?? row.label,
      action: "create",
      payload: {}
    });
    return json({ item: data }, 201);
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};
const PUT = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    if (!Array.isArray(body.items)) {
      return json({ error: "Format attendu : { items: [...] }" }, 400);
    }
    const rows = body.items.map(
      (it, i) => normalize({ ...it, ordre: it.ordre ?? i })
    );
    const del = await supabaseAdmin.from("home_marquee_items").delete().not("id", "is", null);
    if (del.error) throw del.error;
    if (rows.length === 0) {
      logActivity({
        entity: "home_marquee",
        action: "import",
        entity_label: "0 item(s)",
        payload: { count: 0 }
      });
      return json({ items: [], count: 0 });
    }
    const { data, error } = await supabaseAdmin.from("home_marquee_items").insert(rows).select();
    if (error) throw error;
    logActivity({
      entity: "home_marquee",
      action: "import",
      entity_label: `${data?.length ?? 0} item(s)`,
      payload: { count: data?.length ?? 0 }
    });
    return json({ items: data ?? [], count: data?.length ?? 0 });
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
    if ("ordre" in patch) {
      const n = Number(patch.ordre);
      if (!Number.isFinite(n)) return json({ error: "Ordre doit être un nombre" }, 400);
      patch.ordre = n;
    }
    if ("label" in patch) {
      const l = String(patch.label ?? "").trim();
      if (!l) return json({ error: "Le libellé ne peut pas être vide" }, 400);
      patch.label = l;
    }
    const { data, error } = await supabaseAdmin.from("home_marquee_items").update(patch).eq("id", id).select().single();
    if (error) throw error;
    logActivity({
      entity: "home_marquee",
      entity_id: id,
      entity_label: data?.label ?? null,
      action: "update",
      payload: { fields: Object.keys(patch) }
    });
    return json({ item: data });
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
  const { data: snap } = await supabaseAdmin.from("home_marquee_items").select("id, label").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("home_marquee_items").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  logActivity({
    entity_label: snap?.label ?? null});
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
