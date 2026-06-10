const supabase = (console.warn(
  "[supabase] SUPABASE_URL/ANON_KEY missing — running in fallback mode (Content Collections / local JSON)."
), null);
const supabaseAdmin = null;

export { supabase as a, supabaseAdmin as s };
