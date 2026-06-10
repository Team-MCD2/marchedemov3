import { getArticle } from '../../../../chunks/inventaire-db_BPwFePtL.mjs';
import { s as supabaseAdmin } from '../../../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function POST({ request }) {
  try {
    const { id } = await request.json();
    if (!id) return json({ error: "ID manquant" }, 400);
    if (!supabaseAdmin) {
      return json({ error: "Configuration Supabase manquante (service_role)" }, 500);
    }
    const article = await getArticle(id);
    if (!article) return json({ error: "Article non trouvé dans l'inventaire" }, 404);
    const slug = article.code_barres || `prod-${article.id}`;
    const catalogData = {
      slug,
      nom: article.nom_produit || "Produit sans nom",
      description: article.description || "",
      image_url: article.photo_url || null,
      prix_indicatif: article.prix_vente || null,
      rayon: article.rayon,
      actif: true,
      // Par défaut actif dans le catalogue
      ordre: 0
      // Par défaut en haut ou trié plus tard
    };
    const { data, error } = await supabaseAdmin.from("produits").upsert(catalogData, { onConflict: "slug" }).select("*").single();
    if (error) {
      console.error("Erreur d'insertion catalogue:", error);
      return json({ error: `Erreur d'insertion : ${error.message}` }, 500);
    }
    return json({ success: true, product: data }, 200);
  } catch (e) {
    console.error("Erreur publish API:", e);
    return json({ error: e.message }, 500);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
