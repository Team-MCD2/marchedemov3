import { i as isAuthenticated } from '../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../chunks/admin-activity_7EJyrd7K.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
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
const GET = async ({ cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin.from("site_settings").select("*").order("key", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ settings: data ?? [] });
};
const PATCH = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  try {
    const body = await request.json();
    const { key, value } = body;
    if (!key || typeof key !== "string") {
      return json({ error: "Clé de configuration manquante ou invalide" }, 400);
    }
    if (value === void 0 || value === null) {
      return json({ error: "Valeur manquante" }, 400);
    }
    const { data, error } = await supabaseAdmin.from("site_settings").update({ value: String(value).trim() }).eq("key", key).select().single();
    if (error) throw error;
    logActivity({
      entity: "site_setting",
      entity_id: key,
      entity_label: key,
      action: "update",
      payload: { value: String(value).trim() }
    });
    return json({ setting: data });
  } catch (err) {
    return json({ error: err.message || String(err) }, 400);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
